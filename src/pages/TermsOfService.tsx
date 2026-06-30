export default function TermsOfService() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 prose prose-invert prose-purple">
      <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
      <div className="space-y-6 text-white/70">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Acceptable Use</h2>
        <p>You agree not to use the service to upload, process, or transmit any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy. We reserve the right to ban accounts that violate these guidelines.</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Service Availability</h2>
        <p>We do not guarantee that our services will be uninterrupted, timely, secure, or error-free. We reserve the right to modify or discontinue the service with or without notice.</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Intellectual Property</h2>
        <p>You retain all rights to the files you upload. You grant us a temporary license to process your files solely for the purpose of providing the enhancement service.</p>
      </div>
    </div>
  );
}
