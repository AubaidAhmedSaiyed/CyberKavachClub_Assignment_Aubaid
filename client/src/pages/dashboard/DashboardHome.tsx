import { motion } from 'framer-motion';
import { Activity, Users, FileText, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function DashboardHome() {
  const data = [
    { name: 'Mon', visits: 400, regs: 240 },
    { name: 'Tue', visits: 300, regs: 139 },
    { name: 'Wed', visits: 200, regs: 980 },
    { name: 'Thu', visits: 278, regs: 390 },
    { name: 'Fri', visits: 189, regs: 480 },
    { name: 'Sat', visits: 239, regs: 380 },
    { name: 'Sun', visits: 349, regs: 430 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Main Grid</h1>
        <p className="text-muted-foreground mt-1">Network traffic and system analytics overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Agents</p>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-white">1,248</h3>
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">+12% from last cycle</p>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Operations</p>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">42</h3>
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">+3 launched today</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending Clearances</p>
            <FileText className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">14</h3>
          <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">Requires immediate review</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">System Integrity</p>
            <ShieldAlert className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">99.9%</h3>
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">All protocols secure</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-card/40 border border-border p-6 rounded-2xl h-96">
          <h3 className="text-lg font-bold text-white mb-6">Traffic & Engagement</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="visits" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-card/40 border border-border p-6 rounded-2xl h-96">
          <h3 className="text-lg font-bold text-white mb-6">Event Registrations</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} itemStyle={{ color: '#ef4444' }} />
              <Bar dataKey="regs" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
