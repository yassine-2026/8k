import { useState } from "react";
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
        <h1 className="text-4xl font-bold text-white mb-4">AI Image Enhancer</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
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
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-6">Enhancement Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Upscale Factor</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["2", "4", "8"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setScale(val)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          scale === val
                            ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <h4 className="text-white font-medium">Face Restoration</h4>
                    <p className="text-sm text-white/50">Enhance and recover facial details</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={faceEnhance}
                      onChange={(e) => setFaceEnhance(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>

                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
              >
                Enhance Another
              </button>
              <a
                href={enhancedUrl}
                download="enhanced-image.png"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
              >
                <Download className="w-4 h-4" />
                Download HD
              </a>
            </div>
          </div>

          {originalUrl && (
            <CompareSlider originalImage={originalUrl} enhancedImage={enhancedUrl} />
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/50 text-sm mb-1">New Resolution</p>
              <p className="text-white font-medium text-lg">Up to 8K</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/50 text-sm mb-1">Format</p>
              <p className="text-white font-medium text-lg">PNG</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/50 text-sm mb-1">Face Restored</p>
              <p className="text-white font-medium text-lg">{faceEnhance ? "Yes" : "No"}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/50 text-sm mb-1">Scale Factor</p>
              <p className="text-white font-medium text-lg">{scale}x</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
