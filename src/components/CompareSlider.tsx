import { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface CompareSliderProps {
  originalImage: string;
  enhancedImage: string;
}

export default function CompareSlider({ originalImage, enhancedImage }: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  const onMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const onTouchMove = (e: TouchEvent | React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", () => setIsDragging(false));
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", () => setIsDragging(false));
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video md:aspect-[4/3] max-w-4xl mx-auto rounded-2xl overflow-hidden select-none cursor-ew-resize bg-slate-900 border border-white/10"
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* Original Image (Bottom) */}
      <img
        src={originalImage}
        alt="Original"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none grayscale opacity-60"
      />
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono border border-white/10 text-slate-200">
        ORIGINAL
      </div>

      {/* Enhanced Image (Top, clipped) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={enhancedImage}
          alt="Enhanced"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
        <div className="absolute bottom-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono border border-white/10 text-white">
          AI ENHANCED
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-ew-resize flex items-center justify-center z-20"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
          <MoveHorizontal className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
