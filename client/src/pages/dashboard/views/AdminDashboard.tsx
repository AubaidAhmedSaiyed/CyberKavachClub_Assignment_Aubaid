import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Award, CheckSquare, Clock, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../../../context/SocketContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    totalWaitlisted: 0,
    pendingEvents: [] as any[],
    recentRegistrations: [] as any[]
  });
  const { socket } = useSocket();

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/analytics/admin', { withCredentials: true });
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    if (socket) {
      socket.on('SYSTEM_UPDATE', () => {
        fetchAnalytics();
      });
    }

    return () => {
      if (socket) socket.off('SYSTEM_UPDATE');
    };
  }, [socket]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Operations</h1>
        <p className="text-muted-foreground mt-1">Live overview of platform integrity and usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Users</p>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Events</p>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.activeEvents}</h3>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Registrations</p>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalRegistrations}</h3>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Waitlisted</p>
            <CheckSquare className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalWaitlisted}</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card/40 border border-border p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-yellow-500" />
              Pending Approvals
            </h3>
            <Link to="/dashboard/approvals" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.pendingEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No pending approvals.</p>
            ) : (
              stats.pendingEvents.map(event => (
                <div key={event.id} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div>
                    <p className="font-semibold text-white">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(event.date), 'PPp')}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md">Pending</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card/40 border border-border p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Recent Registrations
            </h3>
          </div>
          <div className="space-y-4">
            {stats.recentRegistrations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent registrations.</p>
            ) : (
              stats.recentRegistrations.map(reg => (
                <div key={reg.id} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div>
                    <p className="font-semibold text-white">{reg.user.firstName} {reg.user.lastName}</p>
                    <p className="text-xs text-muted-foreground">Registered for: <span className="text-primary">{reg.event.name}</span></p>
                  </div>
                  <span className="text-xs text-muted-foreground">{format(new Date(reg.registeredAt), 'MMM d, h:mm a')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
