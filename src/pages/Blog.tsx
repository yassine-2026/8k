export default function Blog() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Latest from the Blog</h1>
        <p className="text-xl text-slate-400">
          News, techniques, and updates about AI upscaling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Understanding Diffusion Models for Super Resolution",
            excerpt: "Dive deep into how the latest generative models are replacing traditional GANs for video restoration.",
            date: "Oct 12, 2023",
            category: "Engineering"
          },
          {
            title: "AuraUpscale v2.0 is Live",
            excerpt: "We've upgraded our core infrastructure to support 8K resolution video upscaling in near real-time.",
            date: "Oct 5, 2023",
            category: "Product Updates"
          },
          {
            title: "How to Prepare Footage for AI Enhancement",
            excerpt: "A guide on bitrates, formats, and best practices to get the maximum quality out of our AI.",
            date: "Sep 28, 2023",
            category: "Tutorials"
          }
        ].map((post, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg p-6 hover:bg-white/10 hover:border-blue-500/50 transition-colors group cursor-pointer">
            <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-3">{post.category}</div>
            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{post.title}</h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{post.excerpt}</p>
            <div className="text-[10px] text-slate-500 font-bold uppercase">{post.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
