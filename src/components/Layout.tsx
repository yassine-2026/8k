import { Outlet, Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, X, Wand2, Video, Home as HomeIcon, LogIn } from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Image AI", href: "/image-enhancer", icon: Wand2 },
    { name: "Video AI", href: "/video-enhancer", icon: Video },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-slate-200 selection:bg-blue-500/30 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  AuraUpscale
                </span>
              </Link>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex items-center gap-8 text-sm font-medium text-slate-400">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`transition-colors hover:text-white ${
                          isActive ? "text-white border-b-2 border-blue-500 pb-1" : ""
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/contact" className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-medium text-white">
                Contact
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-900/20 transition-transform active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                Get Started
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white/70 hover:text-white p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#050608]/95 backdrop-blur-xl absolute w-full">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-md px-3 py-2 text-base font-medium ${
                      isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        <Outlet />
      </main>

      <footer className="bg-white/5 backdrop-blur-2xl border-t border-white/10 py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="text-lg font-bold">AuraUpscale</span>
              </Link>
              <p className="text-sm text-white/50 mb-4 max-w-xs">
                Professional AI-powered super resolution for images and videos up to 8K.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/image-enhancer" className="text-sm text-white/60 hover:text-white transition-colors">Image Enhancer</Link></li>
                <li><Link to="/video-enhancer" className="text-sm text-white/60 hover:text-white transition-colors">Video Enhancer</Link></li>
                <li><Link to="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link to="/blog" className="text-sm text-white/60 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} AuraUpscale. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
