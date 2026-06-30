import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Start for free, upgrade when you need more power. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            name: "Starter",
            price: "Free",
            description: "Perfect for testing the waters",
            features: [
              "5 AI Image Enhancements / day",
              "Up to 2x Upscaling",
              "Standard Processing Speed",
              "Community Support",
            ]
          },
          {
            name: "Pro",
            price: "$19",
            period: "/mo",
            popular: true,
            description: "For professionals and content creators",
            features: [
              "Unlimited Image Enhancements",
              "100 Video Enhancements / mo",
              "Up to 8K Upscaling",
              "Face Restoration Model",
              "Priority Processing",
              "Email Support",
            ]
          },
          {
            name: "Enterprise",
            price: "$99",
            period: "/mo",
            description: "For teams and high-volume needs",
            features: [
              "Everything in Pro",
              "Unlimited Video Enhancements",
              "API Access",
              "Dedicated Account Manager",
              "Custom Integrations",
              "SLA Guarantee",
            ]
          }
        ].map((plan) => (
          <div 
            key={plan.name} 
            className={`relative p-8 rounded-2xl border backdrop-blur-lg ${
              plan.popular 
                ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]" 
                : "bg-white/5 border-white/10"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-lg flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Most Popular
                </span>
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-slate-400 mb-6 text-sm">{plan.description}</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              {plan.period && <span className="text-slate-400">{plan.period}</span>}
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-slate-200 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/dashboard"
              className={`block w-full py-3 rounded-xl text-center text-sm font-bold transition-all ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-900/20 text-white"
                  : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
