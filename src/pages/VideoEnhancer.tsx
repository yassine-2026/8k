import { useState } from "react";
import FileUploader from "../components/FileUploader";
import { Download, Loader2, Sparkles, AlertCircle, Video as VideoIcon } from "lucide-react";

export default function VideoEnhancer() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setEnhancedUrl(null);
    setError(null);
  };

  const handleClear = () => {
    setFile(null);
    setOriginalUrl(null);
    setEnhancedUrl(null);
    setError(null);
  };

  const processVideo = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/enhance/video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process video");
      }

      if (data.output) {
        setEnhancedUrl(data.output);
      } else {
        throw new Error("No output received from the server");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">AI Video Enhancer</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          Upscale low-resolution videos, reduce noise, and increase frame rate using state-of-the-art AI video restoration models.
        </p>
      </div>

      {!enhancedUrl ? (
        <div className="max-w-3xl mx-auto space-y-8">
          <FileUploader
            onFileSelect={handleFileSelect}
            onClear={handleClear}
            selectedFile={file}
            maxSize={100 * 1024 * 1024} // 100MB for video demo
            accept={{
              "video/*": [".mp4", ".mov", ".avi", ".webm", ".mkv", ".m4v", ".flv", ".wmv", ".3gp", ".mpeg", ".ts", ".ogg"]
            }}
          />

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {file && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 border border-white/10">
                {originalUrl && (
                  <video 
                    src={originalUrl} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <button
                onClick={processVideo}
                disabled={isProcessing}
                className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Video (This may take a while)...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Enhance Video
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white">Enhancement Complete</h2>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
              >
                Enhance Another
              </button>
              <a
                href={enhancedUrl}
                download="enhanced-video.mp4"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
              >
                <Download className="w-4 h-4" />
                Download Video
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <VideoIcon className="w-4 h-4" />
                <span className="font-medium">Original</span>
              </div>
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                <video src={originalUrl!} controls className="w-full h-full object-contain" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Enhanced</span>
              </div>
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <video src={enhancedUrl} controls autoPlay loop className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
