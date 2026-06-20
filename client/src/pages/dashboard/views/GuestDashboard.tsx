import { motion } from 'framer-motion';
import { Calendar, Bell } from 'lucide-react';

export default function GuestDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to CyberKavach</h1>
        <p className="text-muted-foreground mt-1">Discover upcoming public events and announcements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-card/40 border border-border p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <Calendar className="w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
          </div>
          <p className="text-sm text-muted-foreground">You are browsing as a guest. Register for events to access the full member dashboard.</p>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card/40 border border-border p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4 text-blue-500">
            <Bell className="w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Announcements</h3>
          </div>
          <p className="text-sm text-muted-foreground">Stay tuned for public club announcements.</p>
        </motion.div>
      </div>
    </div>
  );
}
