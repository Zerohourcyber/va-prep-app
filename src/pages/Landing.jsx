import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, CheckCircle2, FileText, Sparkles, ArrowRight, 
  ClipboardList, Activity, Calculator, Lock, Zap, Users,
  Star, ChevronRight, Menu, X
} from 'lucide-react';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const features = [
    {
      icon: ClipboardList,
      title: 'Smart Checklist',
      description: 'Track every document, form, and requirement. Never miss a critical step in your VA claim.',
      color: 'amber'
    },
    {
      icon: Activity,
      title: 'Medical History Tracking',
      description: 'Log appointments, symptoms, and treatments. Build a complete timeline of your conditions.',
      color: 'emerald'
    },
    {
      icon: Sparkles,
      title: 'AI Document Parser',
      description: 'Paste medical notes and let AI extract key information automatically. Premium feature.',
      color: 'purple',
      premium: true
    },
    {
      icon: Sparkles,
      title: 'AI Condition Generator',
      description: 'AI analyzes your history to identify claim-ready conditions with evidence summaries.',
      color: 'sky',
      premium: true
    },
    {
      icon: Calculator,
      title: 'Rating Calculator',
      description: 'Estimate your combined VA disability rating using the official VA math formula.',
      color: 'rose'
    },
    {
      icon: FileText,
      title: 'VSO-Ready PDF Export',
      description: 'Generate professional reports with all your tracked information for your VSO.',
      color: 'indigo',
      premium: true
    }
  ];

  const steps = [
    { num: '01', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card required.' },
    { num: '02', title: 'Track Everything', desc: 'Log your medical history, conditions, and documentation.' },
    { num: '03', title: 'Generate Your Claim', desc: 'Use AI to build evidence summaries and export your report.' }
  ];

  const faqs = [
    { q: 'Is this affiliated with the VA?', a: 'No. This is an independent organizational tool to help veterans prepare their disability claims. Always work with an accredited VSO for official submissions.' },
    { q: 'Is my data secure?', a: 'Yes. All data is encrypted and stored securely. You own your data and can export or delete it anytime.' },
    { q: 'What\'s included in Premium?', a: 'AI document parsing, AI condition generator, PDF export, unlimited entries, and priority support.' },
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel your subscription anytime with no questions asked. Your data remains accessible.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/30 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <span className="text-xl font-bold tracking-tight">VA Prep</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">FAQ</a>
              <Link to="/login" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Sign In</Link>
              <Link 
                to="/login" 
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
              >
                Start Free
              </Link>
            </div>

            <button 
              className="md:hidden p-2 text-slate-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 space-y-4">
            <a href="#features" className="block text-slate-300 py-2">Features</a>
            <a href="#pricing" className="block text-slate-300 py-2">Pricing</a>
            <a href="#faq" className="block text-slate-300 py-2">FAQ</a>
            <Link to="/login" className="block text-slate-300 py-2">Sign In</Link>
            <Link to="/login" className="block w-full text-center py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg">
              Start Free
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">AI-Powered Claim Preparation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Prepare Your VA Claim{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Like a Pro
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Track medical history, organize evidence, and generate professional reports. 
            AI helps identify patterns and build stronger claims.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors border border-slate-700"
            >
              See Features
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Free tier forever
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Prepare</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for veterans navigating the disability claims process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className={`relative p-6 rounded-2xl border transition-all hover:-translate-y-1 ${
                  feature.premium 
                    ? 'bg-gradient-to-br from-slate-800/80 to-slate-800/40 border-amber-500/30 hover:border-amber-500/50' 
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {feature.premium && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded">
                    PREMIUM
                  </div>
                )}
                <div className={`inline-flex p-3 rounded-xl mb-4 bg-${feature.color}-500/10`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-4 bg-slate-800/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400">Get started in minutes, not hours.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-slate-800 mb-4">{step.num}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
                {idx < 2 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">Start free. Upgrade when you need AI power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-slate-400 text-sm mb-6">Everything you need to get started</p>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-slate-500 font-normal">/forever</span></div>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Smart checklist tracking',
                  'Up to 3 conditions',
                  'Up to 5 medical entries',
                  'Rating calculator',
                  'Local data storage'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link 
                to="/login"
                className="block w-full text-center py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-800/40 border border-amber-500/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium</h3>
              <p className="text-slate-400 text-sm mb-6">Full power with AI features</p>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-slate-500 font-normal">/month</span></div>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Free',
                  'Unlimited conditions',
                  'Unlimited medical entries',
                  'AI document parsing',
                  'AI condition generator',
                  'PDF report export',
                  'Cloud data sync',
                  'Priority support'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link 
                to="/login"
                className="block w-full text-center py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-24 px-4 bg-slate-800/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Prepare Your Claim?</h2>
          <p className="text-lg text-slate-400 mb-10">
            Join thousands of veterans using VA Prep to organize their disability claims.
          </p>
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            Start Free Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Shield className="w-5 h-5 text-amber-500" />
              </div>
              <span className="font-semibold">VA Prep</span>
            </div>
            <p className="text-sm text-slate-500 text-center">
              Organizational tool for VA claim preparation. Not affiliated with the Department of Veterans Affairs.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

