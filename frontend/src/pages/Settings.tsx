import Sidebar from "@/components/Sidebar";
import { User, Bell, Shield, Database, Palette } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid gap-4 max-w-4xl">
          <SettingCard icon={<User />} title="Profile" description="Update your personal information" />
          <SettingCard icon={<Bell />} title="Notifications" description="Configure alert preferences" />
          <SettingCard icon={<Shield />} title="Security" description="Manage authentication and access" />
          <SettingCard icon={<Database />} title="Data & Privacy" description="Control your data and privacy settings" />
          <SettingCard icon={<Palette />} title="Appearance" description="Customize the interface theme" />
        </div>
      </div>
    </div>
  );
};

const SettingCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
        <div className="text-purple-400">{icon}</div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  </div>
);

export default Settings;
