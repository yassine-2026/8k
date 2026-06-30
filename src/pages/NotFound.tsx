import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-blue-500 leading-none mb-8 opacity-20">
        404
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
      <p className="text-white/60 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/"
        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}
