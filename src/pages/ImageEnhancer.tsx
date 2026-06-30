import { useState } from "react";
import toast from "react-hot-toast";
import FileUploader from "../components/FileUploader";
import CompareSlider from "../components/CompareSlider";
import { Download, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function ImageEnhancer() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState("4");
  const [faceEnhance, setFaceEnhance] = useState(true);

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

  const processImage = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("scale", scale);
    formData.append("faceEnhance", faceEnhance.toString());

    try {
      const response = await fetch("/api/enhance/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process image");
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
        <h1 className="text-4xl font-bold text-white mb-4">AI Image Enhancer</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Upscale and enhance your images up to 8K resolution. Removes noise, sharpens details, and restores faces automatically.
        </p>
      </div>

      {!enhancedUrl ? (
        <div className="max-w-3xl mx-auto space-y-8">
          <FileUploader
            onFileSelect={handleFileSelect}
            onClear={handleClear}
            selectedFile={file}
            accept={{
              "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif", ".bmp", ".tiff", ".gif", ".heic", ".raw"]
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
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-6 block">Enhancement Settings</label>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 block">Output Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["2", "4", "8"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setScale(val)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                          scale === val
                            ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                            : "bg-white/5 border-white/10 text-slate-200 hover:border-blue-500/50"
                        }`}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div>
                    <h4 className="text-xs text-slate-200">Face Restoration</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Enhance and recover facial details</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={faceEnhance}
                      onChange={(e) => setFaceEnhance(e.target.checked)}
                    />
                    <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-transform text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Enhance Now
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
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
                download="enhanced-image.png"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all"
              >
                <Download className="w-4 h-4" />
                Download Result
              </a>
            </div>
          </div>

          {originalUrl && (
            <CompareSlider originalImage={originalUrl} enhancedImage={enhancedUrl} />
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">New Resolution</p>
              <p className="text-white font-medium text-sm">Up to 8K</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Format</p>
              <p className="text-white font-medium text-sm">PNG</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Face Restored</p>
              <p className="text-white font-medium text-sm">{faceEnhance ? "Yes" : "No"}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-lg">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Scale Factor</p>
              <p className="text-white font-medium text-sm">{scale}x</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
