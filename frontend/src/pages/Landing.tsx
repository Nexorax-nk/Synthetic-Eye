import { Eye, Activity, Shield, Zap, ArrowRight, CheckCircle2, Sparkles, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Third Eye
            </span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-sm font-medium"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Automated Synthetic Monitoring</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Watch Everything.
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Miss Nothing.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl font-light leading-relaxed">
            Automated agent that monitors your critical user flows 24/7
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Real-time insights. Proactive alerts. Zero blind spots.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-3 hover:scale-105"
            >
              Get Started
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-2xl font-semibold text-lg border border-white/10 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
            >
              View Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl w-full">
            <StatCard icon={<TrendingUp />} value="99.9%" label="Uptime SLA" />
            <StatCard icon={<Clock />} value="<100ms" label="Alert Latency" />
            <StatCard icon={<Activity />} value="24/7" label="Monitoring" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Built for Modern Teams
          </h2>
          <p className="text-gray-400 text-lg">Everything you need to keep your services running smoothly</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-purple-400" />}
            title="Real-time Monitoring"
            description="Track user flows and performance metrics in real-time with automated Playwright-based synthetic monitoring"
            gradient="from-purple-500/10 to-purple-500/5"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-pink-400" />}
            title="Proactive Alerts"
            description="Get notified before your users experience issues with intelligent anomaly detection and SLA tracking"
            gradient="from-pink-500/10 to-pink-500/5"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-blue-400" />}
            title="Full Observability"
            description="Visualize metrics, traces, and logs with comprehensive dashboards and step-by-step breakdowns"
            gradient="from-blue-500/10 to-blue-500/5"
          />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Why Third Eye?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Built with the latest observability standards and designed for teams that ship fast
              </p>
              <div className="space-y-4">
                <BenefitItem text="Automated Playwright-based synthetic monitoring" />
                <BenefitItem text="Full observability with metrics, traces, and logs" />
                <BenefitItem text="Screenshot evidence for every incident" />
                <BenefitItem text="Step-by-step latency breakdown" />
                <BenefitItem text="SLA error budget tracking" />
                <BenefitItem text="Zero configuration required" />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#0f1117] to-[#141821] border border-white/5 flex items-center justify-center">
                  <Eye className="h-32 w-32 text-purple-400/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-xl p-16 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to see everything?
              </h2>
              <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
                Start monitoring your critical user flows in minutes. No credit card required.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-gray-500">© 2026 Third Eye. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
    <div className="text-purple-400 mb-2">{icon}</div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) => (
  <div className={`relative group rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 p-8 hover:border-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-105`}>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="mb-6 w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const BenefitItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
      <CheckCircle2 className="h-4 w-4 text-green-400" />
    </div>
    <p className="text-gray-300 group-hover:text-white transition-colors">{text}</p>
  </div>
);

export default Landing;
