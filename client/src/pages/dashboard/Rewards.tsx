import { motion } from 'framer-motion';
import { Award, Star, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Rewards() {
  const { user } = useAuth();

  const badges = [
    { name: 'Elite Operative', desc: '100+ tasks completed', icon: ShieldCheck, color: 'text-primary bg-primary/10 border-primary/30' },
    { name: 'Cyber Sentinel', desc: 'Flawless event management', icon: Star, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    { name: 'Rapid Responder', desc: 'Top 1% approval times', icon: Zap, color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Agent Profile & Rewards</h1>
          <p className="text-muted-foreground mt-1">Gamified recognition and capability tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-card/40 border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-secondary border-2 border-primary overflow-hidden flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              {user?.firstName?.[0] || 'A'}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md border border-background">
              Lvl 42
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-primary font-mono mt-1">{user?.role?.replace('_', ' ')}</p>
          
          <div className="w-full mt-6 bg-secondary/30 rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Reputation Score</p>
            <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              9,450
            </p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 bg-card/40 border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Unlocked Capabilities (Badges)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge, idx) => (
              <motion.div 
                key={badge.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border flex items-center gap-4 ${badge.color}`}
              >
                <div className="p-2 bg-background/50 rounded-lg backdrop-blur-sm">
                  <badge.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{badge.name}</h4>
                  <p className="text-xs opacity-80">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
            <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground bg-secondary/10">
              <span className="text-sm">Locked (Reach Lvl 50)</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mt-8 mb-4">Recent Commendations</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary shadow-[0_0_8px_rgba(239,68,68,1)]" />
                <div>
                  <p className="text-sm font-medium text-white">Awarded +500 points for successful hackathon execution.</p>
                  <p className="text-xs text-muted-foreground mt-1">Authorized by Faculty Coordinator • 2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
