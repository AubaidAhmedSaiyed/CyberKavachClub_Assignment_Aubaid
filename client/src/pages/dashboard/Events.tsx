import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { socket } = useSocket();
  const [newEvent, setNewEvent] = useState({
    name: '', description: '', venue: '', date: '', time: '', teamSize: 1, registrationDeadline: new Date().toISOString()
  });

  useEffect(() => {
    fetchEvents();

    if (socket) {
      socket.on('SYSTEM_UPDATE', () => {
        fetchEvents();
      });
    }

    return () => {
      if (socket) socket.off('SYSTEM_UPDATE');
    };
  }, [socket]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/events', newEvent);
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert('Failed to create event. Ensure you have Coordinator access.');
    }
  };

  const isCoordinator = user?.role.includes('COORDINATOR');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Events</h1>
          <p className="text-muted-foreground mt-1">Browse and manage upcoming operational events.</p>
        </div>
        {isCoordinator && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-destructive text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card/40 border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="h-40 bg-secondary/50 relative overflow-hidden flex items-center justify-center">
                {event.bannerImage ? (
                  <img src={event.bannerImage} alt={event.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <ShieldAlert className="w-16 h-16 text-primary/20" />
                )}
                {!event.isPublished && (
                  <div className="absolute top-3 right-3 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-md">DRAFT</div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 truncate">{event.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{event._count?.registrations || 0} / {event.capacity || 100} Registered</span>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5 pt-0 mt-auto">
                <Link to={`/dashboard/events/${event.id}`} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl py-2 flex items-center justify-center transition-colors font-medium">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
          {events.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card/20">
              No events found in the system.
            </div>
          )}
        </div>
      )}

      {/* Real Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-primary/30 rounded-3xl p-8 w-full max-w-2xl shadow-[0_0_80px_rgba(239,68,68,0.15)] max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-primary" /> Initialize New Operation
            </h2>
            <p className="text-muted-foreground mb-8">Create a draft event. It must be approved by the Faculty Coordinator to go live.</p>
            
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Operation Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white"
                  value={newEvent.name}
                  onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea 
                  required rows={3}
                  className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white resize-none"
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</label>
                  <input 
                    type="date" required
                    className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white"
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</label>
                  <input 
                    type="time" required
                    className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white"
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Venue / Coordinates</label>
                  <input 
                    type="text" required
                    className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white"
                    value={newEvent.venue}
                    onChange={e => setNewEvent({...newEvent, venue: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Team Size Limit</label>
                  <input 
                    type="number" min="1" required
                    className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white"
                    value={newEvent.teamSize}
                    onChange={e => setNewEvent({...newEvent, teamSize: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t border-border mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-secondary/80 transition-colors font-medium">Abort</button>
                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all">Launch Event</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
