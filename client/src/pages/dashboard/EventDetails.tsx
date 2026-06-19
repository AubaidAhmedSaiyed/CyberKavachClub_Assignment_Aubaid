import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const res = await api.post(`/events/${id}/register`);
      alert(res.data.message);
      fetchEventDetails();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration? You will lose 5 points.')) return;
    setRegistering(true);
    try {
      const res = await api.delete(`/events/${id}/register`);
      alert(res.data.message);
      fetchEventDetails();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading event...</div>;
  if (error || !event) return <div className="p-8 text-center text-red-500">{error || 'Not found'}</div>;

  const isCoordinator = user?.role.includes('COORDINATOR');
  const userRegistration = event.registrations?.find((r: any) => r.userId === user?.id && r.status === 'REGISTERED');
  const userWaitlist = event.waitlists?.find((w: any) => w.userId === user?.id);
  const isFull = event._count.registrations >= event.capacity;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/dashboard/events')} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </button>

      <div className="bg-card/40 border border-border rounded-2xl overflow-hidden p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{event.name}</h1>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full text-sm font-medium">
              <Users className="w-4 h-4 text-primary" />
              <span>{event._count.registrations} / {event.capacity} Registered</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 text-gray-300 bg-black/20 p-4 rounded-xl border border-white/5">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Date & Time</p>
              <p className="font-medium">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-300 bg-black/20 p-4 rounded-xl border border-white/5">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Venue</p>
              <p className="font-medium">{event.venue}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 mt-6 flex justify-between items-center">
          <div>
            {userRegistration && (
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <CheckCircle className="w-5 h-5" />
                You are registered for this event!
              </div>
            )}
            {userWaitlist && (
              <div className="flex items-center gap-2 text-yellow-400 font-medium">
                <Clock className="w-5 h-5" />
                You are on the waitlist (Position: {userWaitlist.position})
              </div>
            )}
            {!userRegistration && !userWaitlist && isFull && (
              <div className="flex items-center gap-2 text-orange-400 font-medium">
                <AlertTriangle className="w-5 h-5" />
                Event is full. Registering will place you on the waitlist.
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            {(userRegistration || userWaitlist) ? (
              <button 
                onClick={handleCancel}
                disabled={registering}
                className="bg-destructive/20 hover:bg-destructive text-destructive-foreground px-6 py-2 rounded-xl font-medium transition-all"
              >
                Cancel {userWaitlist ? 'Waitlist' : 'Registration'}
              </button>
            ) : (
              <button 
                onClick={handleRegister}
                disabled={registering}
                className="bg-primary hover:bg-red-600 text-white px-8 py-2 rounded-xl font-medium shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
              >
                {isFull ? 'Join Waitlist' : 'Register Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      {isCoordinator && (
        <div className="bg-card/40 border border-border rounded-2xl p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Admin: Registration Roster</h2>
            <button 
              onClick={() => window.open(`http://localhost:5000/api/events/${id}/export?format=csv`)}
              className="bg-primary/20 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-primary/50"
            >
              Export CSV
            </button>
          </div>
          {event.registrations.length === 0 ? (
            <p className="text-muted-foreground">No registrations yet.</p>
          ) : (
            <div className="space-y-2">
              {event.registrations.map((reg: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
                  <div className="text-gray-300 font-medium">{reg.user.firstName} {reg.user.lastName}</div>
                  <div className="text-sm text-muted-foreground">{reg.user.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
