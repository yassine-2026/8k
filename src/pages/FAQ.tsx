import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "How does the AI upscaling work?",
      answer: "We use state-of-the-art Generative Adversarial Networks (GANs) and diffusion models tailored for image and video restoration. They analyze your media and intelligently predict and inject missing details, rather than just stretching pixels."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Files are processed entirely in memory or temporary secure storage and are permanently deleted immediately after the enhancement is complete. We do not use your files to train our models."
    },
    {
      question: "What is the maximum file size?",
      answer: "Free tier users can upload images up to 10MB. Pro users can upload up to 50MB for images and 500MB for videos. For larger enterprise needs, please contact support."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your dashboard. You will retain access to your Pro features until the end of your current billing cycle."
    },
    {
      question: "Why does video enhancement take so long?",
      answer: "Video enhancement requires processing every single frame individually. A 10-second video at 30FPS contains 300 images. We utilize massive GPU clusters to speed this up, but high-resolution AI processing is computationally intense."
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-white/60">
          Everything you need to know about AuraUpscale.
        </p>
      </div>

      <Accordion.Root type="single" collapsible className="space-y-4">
        {faqs.map((faq, i) => (
          <Accordion.Item 
            key={i} 
            value={`item-${i}`}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden data-[state=open]:border-purple-500/50 transition-colors"
          >
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center justify-between p-6 text-left focus:outline-none group">
                <span className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-white/50 group-data-[state=open]:rotate-180 transition-transform duration-300" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-6 pb-6 pt-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in text-white/60 leading-relaxed">
              {faq.answer}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
