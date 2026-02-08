interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onTransform: () => void;
  disabled: boolean;
}

export function FileUploader({ file, onFileSelect, onTransform, disabled }: FileUploaderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (file) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-zinc-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onFileSelect(null)}
            className="rounded bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
          >
            Remove
          </button>
          <button
            onClick={onTransform}
            disabled={disabled}
            className="rounded bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500 disabled:opacity-50"
          >
            Transform
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="flex cursor-pointer flex-col items-center gap-4 py-8">
      <div className="rounded-full bg-zinc-800 p-4">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-medium">Click to upload</p>
        <p className="text-sm text-zinc-400">Images, videos, or audio</p>
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/*,video/*,audio/*"
        onChange={handleChange}
      />
    </label>
  );
}
