export default function PrivacyPolicy() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 prose prose-invert prose-purple">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-white/70">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Data Collection</h2>
        <p>We collect information you provide directly to us when you create an account, subscribe to our newsletter, or fill out a form.</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. File Uploads & Processing</h2>
        <p>The images and videos you upload are processed entirely in memory or temporary storage. We do not store your original or enhanced files on our servers permanently. Files are automatically deleted immediately after the enhancement process completes and the output is delivered to you.</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Use of Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you.</p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Third-Party Services</h2>
        <p>We use Replicate API for AI processing. Your files are sent securely to their infrastructure for the sole purpose of enhancement and are subject to their strict zero-retention privacy agreements.</p>
      </div>
    </div>
  );
}
