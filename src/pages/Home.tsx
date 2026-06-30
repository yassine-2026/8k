import { ArrowRight, Image as ImageIcon, Video, Zap, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
          <div className="w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen opacity-50 absolute -translate-x-1/4 translate-y-1/4"></div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen AI Upscaling Engine</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
          Upscale Media to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Absolute Perfection
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12 leading-relaxed">
          Transform low-resolution images and videos into crystal clear 8K masterpieces using our professional-grade AI enhancement models. 
          No loss of detail. No artifacting. Just pure quality.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/image-enhancer"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold text-lg transition-transform hover:scale-105 active:scale-95"
          >
            <ImageIcon className="w-5 h-5" />
            Enhance Image
          </Link>
          <Link
            to="/video-enhancer"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/10 text-white rounded-full font-semibold text-lg transition-all hover:bg-white/20 active:scale-95 backdrop-blur-sm"
          >
            <Video className="w-5 h-5" />
            Enhance Video
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Processing</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Our infrastructure is designed to handle massive files while delivering the highest quality output available.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Up to 8K Resolution",
              description: "State-of-the-art super resolution models capable of 2x, 4x, and 8x upscaling while preserving natural textures.",
              icon: Sparkles,
            },
            {
              title: "Lightning Fast",
              description: "Distributed GPU clusters process your media in seconds, not hours. Real-time progress tracking.",
              icon: Zap,
            },
            {
              title: "Secure & Private",
              description: "Files are processed entirely in memory and deleted instantly after generation. Zero data retention.",
              icon: Shield,
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 flex items-center justify-center rounded-xl mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
