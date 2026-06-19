import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, CheckCircle, Info, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, type: 'ALERT', title: 'System Intrusion Attempt Blocked', time: '2 mins ago', isRead: false },
    { id: 2, type: 'SUCCESS', title: 'Event "Cyberthon" Approved', time: '1 hour ago', isRead: false },
    { id: 3, type: 'INFO', title: 'Team "Neon" registered', time: '3 hours ago', isRead: true },
  ]);

  useEffect(() => {
    if (!user) return;
    const socket = io('http://localhost:5000');
    socket.emit('join', user.id);

    socket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'ALERT': return <ShieldAlert className="w-5 h-5 text-destructive" />;
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Comms Channel</h1>
          <p className="text-muted-foreground mt-1">Realtime system alerts and broadcast messages.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-xl font-medium transition-colors border border-border"
        >
          Mark All Read
        </button>
      </div>

      <div className="bg-card/40 border border-border rounded-2xl p-2 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div 
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className={`p-4 mb-2 rounded-xl border flex items-start gap-4 transition-all group ${notif.isRead ? 'bg-secondary/10 border-transparent' : 'bg-secondary/40 border-primary/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]'}`}
            >
              <div className={`p-2 rounded-lg ${notif.isRead ? 'bg-background/50' : 'bg-background'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>{notif.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notif.isRead && (
                  <button onClick={() => markAsRead(notif.id)} className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors" title="Mark Read">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => deleteNotification(notif.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {notifications.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No new transmissions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
