import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/contact", { method: "POST" });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-6">Contact Us</h1>
        <p className="text-xl text-slate-400">
          Have a question or need custom enterprise pricing? We're here to help.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg p-8">
        {status === "success" ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-white/60 mb-8">We'll get back to you within 24 hours.</p>
            <button 
              onClick={() => setStatus("idle")}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">Something went wrong. Please try again later.</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Subject</label>
              <select 
                id="subject"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all appearance-none"
              >
                <option value="support" className="bg-slate-900">Technical Support</option>
                <option value="billing" className="bg-slate-900">Billing Inquiry</option>
                <option value="enterprise" className="bg-slate-900">Enterprise Sales</option>
                <option value="other" className="bg-slate-900">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Message</label>
              <textarea 
                id="message" 
                rows={5}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 transition-transform"
            >
              {status === "loading" ? "Sending..." : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
