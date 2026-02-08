import { API_URL } from "@/app/config";

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export interface UploadResponse {
  filename: string;
  stored_filename: string;
  processed_filename: string;
  size: number;
  processed_size: number;
  content_type: string;
  status: string;
}

export function getDownloadUrl(filename: string): string {
  return `${API_URL}/download/${filename}`;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Upload failed");
  }

  return res.json();
}
