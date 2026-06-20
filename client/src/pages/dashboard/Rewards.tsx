import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

export default function Rewards() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    // In a real app this would be a dedicated leaderboard endpoint
    // For now we mock it or fetch all users if we are admin
    try {
      const res = await api.get('/auth/leaderboard').catch(() => ({ data: [] }));
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const dummyData = [
    { firstName: 'Aubaid', lastName: 'Ahmed', points: 1250, badges: ['Elite Hacker', 'Top Presenter'] },
    { firstName: 'John', lastName: 'Doe', points: 940, badges: ['Contributor'] },
    { firstName: 'Jane', lastName: 'Smith', points: 820, badges: ['Early Adopter'] },
    { firstName: 'Alex', lastName: 'Johnson', points: 450, badges: [] },
  ];

  const data = users.length > 0 ? users : dummyData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gamification & Rewards</h1>
          <p className="text-muted-foreground mt-1">Global leaderboard and achievement tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card/40 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Global Leaderboard
          </h2>
          
          <div className="space-y-4">
            {data.map((u, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl border ${idx === 0 ? 'bg-yellow-500/10 border-yellow-500/30' : idx === 1 ? 'bg-gray-300/10 border-gray-300/30' : idx === 2 ? 'bg-orange-700/10 border-orange-700/30' : 'bg-secondary/20 border-border'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-secondary text-muted-foreground'}
                  `}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{u.firstName} {u.lastName}</h3>
                    <div className="flex gap-2 mt-1">
                      {u.badges?.map((b: string, i: number) => (
                        <span key={i} className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xl font-bold text-white">
                  {u.points} <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/20 to-destructive/20 border border-primary/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Medal className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 relative z-10">Your Standing</h2>
            <p className="text-4xl font-black text-white relative z-10 mb-1">#4</p>
            <p className="text-sm text-primary font-medium relative z-10 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Top 10% of club
            </p>
            
            <div className="mt-6 relative z-10">
              <div className="flex justify-between text-sm mb-2 text-gray-300">
                <span>Current: 450 pts</span>
                <span>Next Rank: 500 pts</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-destructive w-[90%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
