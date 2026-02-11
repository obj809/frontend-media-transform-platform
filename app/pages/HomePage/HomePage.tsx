"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { checkHealth, uploadFile, getDownloadUrl, UploadResponse } from "@/app/services/api";
import { ConnectionStatus } from "@/app/types";
import "./HomePage.scss";

export function HomePage() {
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

  useEffect(() => {
    checkHealth().then((ok) => setStatus(ok ? "connected" : "offline"));
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    setUploadResult(null);

    const isJpeg = file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg");
    const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");
    if (!isJpeg && !isPng && !isHeic) {
      setError("Only JPG, PNG, and HEIC files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 25MB limit");
      return;
    }
    setFile(file);
  };

  const handleTransform = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadFile(file);
      setUploadResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="home-page">
      <Header />

      <main className="home-page__main">
        <section
          className={`home-page__section home-page__section--upload ${dragActive ? "home-page__section--drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="home-page__upload">
            {file ? (
              <div className="home-page__file">
                <p className="home-page__file-name">{file.name}</p>
                <p className="home-page__file-size">{(file.size / 1024).toFixed(1)} KB</p>
                <button className="home-page__file-remove" onClick={() => { setFile(null); setError(null); }}>Remove</button>
              </div>
            ) : (
              <label className="home-page__upload-label">
                <span>Drop file here or click to upload</span>
                <span className="home-page__upload-limit">JPG, PNG, or HEIC, max 25MB</span>
                {error && <span className="home-page__upload-error">{error}</span>}
                <input
                  type="file"
                  className="home-page__upload-input"
                  accept=".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/png,image/heic,image/heif"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </section>
        <div className="home-page__divider">
          <div
            className={`home-page__divider-box ${isUploading ? "home-page__divider-box--uploading" : ""}`}
            onClick={handleTransform}
          >
            {isUploading ? "⏳" : "⚙️"}
          </div>
        </div>
        <section className="home-page__section">
          <div className="home-page__output">
            {uploadResult ? (
              <div className="home-page__result">
                <Image
                  src={getDownloadUrl(uploadResult.processed_filename)}
                  alt="Processed"
                  className="home-page__result-image"
                  width={400}
                  height={250}
                  unoptimized
                />
                <p className="home-page__result-size">
                  {(uploadResult.processed_size / 1024).toFixed(1)} KB
                </p>
                <div className="home-page__result-actions">
                  <a
                    href={getDownloadUrl(uploadResult.processed_filename)}
                    download={uploadResult.processed_filename}
                    className="home-page__result-download"
                  >
                    Download
                  </a>
                  <button
                    className="home-page__result-clear"
                    onClick={() => setUploadResult(null)}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <span className="home-page__output-text">Your processed image will appear here</span>
            )}
          </div>
        </section>
      </main>

      <Footer status={status} />
    </div>
  );
}
