import { Eye, Activity, Shield, Zap, ArrowRight, CheckCircle2, Sparkles, TrendingUp, Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Third Eye</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#product" className="hover:text-white transition-colors">Product</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Glowing Product */}
      <div className="relative">
        {/* Dramatic Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[600px] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-50 blur-sm" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[600px] bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-30" />
        
        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative z-10">
            <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">
                Automated Agent
              </span>
              <br />
              <span className="text-white">
                for your teams
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              Third Eye monitors your critical user flows 24/7 so you don't have to. 
              Real-time insights, proactive alerts, and full observability.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="group px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-3"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Product Showcase with Glow */}
          <div className="relative mt-20 max-w-6xl mx-auto">
            {/* Glow effects around product */}
            <div className="absolute -inset-20 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02]">
              {/* Mock Dashboard Screenshot */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-black p-8">
                <div className="grid grid-cols-3 gap-4 h-full">
                  {/* Metrics Column */}
                  <div className="space-y-4">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="text-xs text-purple-400 mb-2">METRICS</div>
                      <div className="text-2xl font-bold text-white">99.9%</div>
                      <div className="text-xs text-gray-400">Availability</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-xs text-green-400 mb-2">SUCCESS RATE</div>
                      <div className="text-2xl font-bold text-white">98.5%</div>
                    </div>
                  </div>
                  
                  {/* Traces Column */}
                  <div className="space-y-4">
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                      <div className="text-xs text-pink-400 mb-2">TRACES</div>
                      <div className="h-20 flex items-end gap-1">
                        {[40, 60, 45, 80, 55, 70, 50].map((h, i) => (
                          <div key={i} className="flex-1 bg-pink-500/50 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Logs Column */}
                  <div className="space-y-2">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <div className="text-xs text-blue-400 mb-2">LOGS</div>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex gap-2"><span className="text-green-400">✓</span> Login flow passed</div>
                        <div className="flex gap-2"><span className="text-red-400">✗</span> Checkout timeout</div>
                        <div className="flex gap-2"><span className="text-green-400">✓</span> Cart updated</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Dark Background */}
      <div className="bg-black py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Unmatched observability
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Third Eye is a complete, real-time synthetic monitoring platform that provides 
              full observability for your critical user flows.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <FeatureShowcase
              title="Real-time Monitoring"
              description="Track user flows with Playwright-based synthetic monitoring"
              image={
                <div className="bg-gradient-to-br from-purple-900/50 to-black rounded-xl p-6 border border-purple-500/30">
                  <Activity className="h-16 w-16 text-purple-400 mb-4" />
                  <div className="space-y-2">
                    <div className="h-2 bg-purple-500/30 rounded w-3/4" />
                    <div className="h-2 bg-purple-500/20 rounded w-1/2" />
                  </div>
                </div>
              }
            />
            
            <FeatureShowcase
              title="Incident Detection"
              description="Get notified before your users experience issues"
              image={
                <div className="bg-gradient-to-br from-pink-900/50 to-black rounded-xl p-6 border border-pink-500/30">
                  <Shield className="h-16 w-16 text-pink-400 mb-4" />
                  <div className="space-y-2">
                    <div className="h-2 bg-pink-500/30 rounded w-2/3" />
                    <div className="h-2 bg-pink-500/20 rounded w-1/3" />
                  </div>
                </div>
              }
            />
            
            <FeatureShowcase
              title="Step Breakdown"
              description="Detailed latency analysis for every user interaction"
              image={
                <div className="bg-gradient-to-br from-blue-900/50 to-black rounded-xl p-6 border border-blue-500/30">
                  <TrendingUp className="h-16 w-16 text-blue-400 mb-4" />
                  <div className="flex gap-2 items-end h-20">
                    {[60, 80, 45, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500/40 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              }
            />
            
            <FeatureShowcase
              title="Screenshot Evidence"
              description="Visual proof of every incident with automated captures"
              image={
                <div className="relative bg-gradient-to-br from-orange-900/50 to-black rounded-xl p-6 border border-orange-500/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-blue-500/20 blur-2xl" />
                  <div className="relative">
                    <Zap className="h-16 w-16 text-orange-400 mb-4" />
                    <div className="text-sm text-gray-400">Automated captures</div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Feature Icons Grid */}
      <div className="bg-black py-32 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <FeatureIcon
              icon={<Activity className="h-8 w-8" />}
              title="Real-time sync"
              description="Monitor user flows with zero latency"
            />
            <FeatureIcon
              icon={<Shield className="h-8 w-8" />}
              title="Proactive alerts"
              description="Get notified before issues impact users"
            />
            <FeatureIcon
              icon={<TrendingUp className="h-8 w-8" />}
              title="Advanced analytics"
              description="Deep insights into performance trends"
            />
            <FeatureIcon
              icon={<Clock className="h-8 w-8" />}
              title="SLA tracking"
              description="Monitor error budgets in real-time"
            />
            <FeatureIcon
              icon={<Zap className="h-8 w-8" />}
              title="Instant insights"
              description="Visualize metrics, traces, and logs"
            />
            <FeatureIcon
              icon={<CheckCircle2 className="h-8 w-8" />}
              title="Zero config"
              description="Start monitoring in minutes"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-32 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to see everything?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Start monitoring your critical user flows in minutes. No credit card required.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-5 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-300 inline-flex items-center gap-3"
            >
              View Dashboard
              <Play className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-gray-500">© 2026 Third Eye. All rights reserved.</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Documentation</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureShowcase = ({ title, description, image }: { title: string; description: string; image: React.ReactNode }) => (
  <div className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative p-8">
      <div className="mb-6 aspect-video rounded-xl overflow-hidden">
        {image}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const FeatureIcon = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default Landing;
