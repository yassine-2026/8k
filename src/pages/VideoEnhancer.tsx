import { useState } from "react";
import toast from "react-hot-toast";
import FileUploader from "../components/FileUploader";
import { Download, Loader2, Sparkles, AlertCircle, Video as VideoIcon } from "lucide-react";

export default function VideoEnhancer() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    setFile(selectedFile);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setEnhancedUrl(null);
    setError(null);
  };

  const handleClear = () => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
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

      if (data.output && data.output.outputUrl) {
        setEnhancedUrl(data.output.outputUrl);
        toast.success(`Enhanced using ${data.output.providerName} in ${data.output.processingTimeMs}ms`);
      } else {
        throw new Error("No output received from the server");
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">AI Video Enhancer</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
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
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-lg">
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden mb-6 border border-white/10 relative">
                {originalUrl && (
                  <video 
                    src={originalUrl} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono border border-white/10 text-slate-200">
                  ORIGINAL
                </div>
              </div>

              <button
                onClick={processVideo}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-transform text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Enhance Another
              </button>
              <a
                href={enhancedUrl}
                download="enhanced-video.mp4"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all"
              >
                <Download className="w-4 h-4" />
                Download Result
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <VideoIcon className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Original</span>
              </div>
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/10 relative">
                <video src={originalUrl!} controls className="w-full h-full object-contain grayscale opacity-60" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono border border-white/10 text-slate-200 pointer-events-none">
                  ORIGINAL
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-bold">AI Enhanced</span>
              </div>
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative">
                <video src={enhancedUrl} controls autoPlay loop className="w-full h-full object-contain" />
                <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono border border-white/10 text-white pointer-events-none">
                  AI ENHANCED
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
