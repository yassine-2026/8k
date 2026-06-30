import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X } from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept: Record<string, string[]>;
  selectedFile: File | null;
  onClear: () => void;
  maxSize?: number;
}

export default function FileUploader({ onFileSelect, accept, selectedFile, onClear, maxSize = 50 * 1024 * 1024 }: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept,
    maxSize,
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="w-full p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
            <FileIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</p>
            <p className="text-white/50 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
        isDragReject
          ? "border-red-500 bg-red-500/10"
          : isDragActive
          ? "border-purple-500 bg-purple-500/10"
          : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
      }`}
    >
      <input {...getInputProps()} />
      <div className="p-4 bg-white/10 rounded-full mb-4">
        <UploadCloud className={`w-8 h-8 ${isDragReject ? "text-red-400" : "text-white"}`} />
      </div>
      <p className="text-white text-lg font-medium mb-2">
        {isDragActive ? "Drop the file here..." : "Drag & drop a file here"}
      </p>
      <p className="text-white/50 text-sm text-center max-w-sm">
        Or click to browse. Supports high-resolution files up to {maxSize / 1024 / 1024}MB.
      </p>
    </div>
  );
}
