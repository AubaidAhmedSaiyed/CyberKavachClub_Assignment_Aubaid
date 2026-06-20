import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, FileBadge, Calendar, CheckSquare, Clock } from 'lucide-react';
import api from '../../../api/axios';
import { useSocket } from '../../../context/SocketContext';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function MemberDashboard() {
  const [stats, setStats] = useState({
    points: 0,
    myRegistrations: 0,
    myWaitlists: 0,
    myAttendances: 0,
    myCertificates: 0,
    myRegisteredEvents: [] as any[],
    upcomingEvents: [] as any[]
  });
  const { socket } = useSocket();

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/analytics/member');
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
        <h1 className="text-3xl font-bold text-white tracking-tight">Agent Status</h1>
        <p className="text-muted-foreground mt-1">Your club engagement and rewards profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Reward Points</p>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.points}</h3>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">My Registrations</p>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.myRegistrations}</h3>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Events Attended</p>
            <CheckSquare className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.myAttendances}</h3>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card/40 border border-border p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Certificates</p>
            <FileBadge className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.myCertificates}</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card/40 border border-border p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              My Registered Events
            </h3>
            <Link to="/dashboard/events" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.myRegisteredEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">You haven't registered for any events yet.</p>
            ) : (
              stats.myRegisteredEvents.map(reg => (
                <div key={reg.id} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div>
                    <p className="font-semibold text-white">{reg.event.name}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(reg.event.date), 'PPp')}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-green-500/20 text-green-500 rounded-md">Registered</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card/40 border border-border p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Upcoming Public Events
            </h3>
          </div>
          <div className="space-y-4">
            {stats.upcomingEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming events scheduled.</p>
            ) : (
              stats.upcomingEvents.map(event => (
                <div key={event.id} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border border-border/50">
                  <div>
                    <p className="font-semibold text-white">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(event.date), 'PPp')}</p>
                  </div>
                  <Link to={`/dashboard/events/${event.id}`} className="text-xs text-primary hover:underline">View Details</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
