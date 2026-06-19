import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, CheckSquare, Clock, UserCheck } from 'lucide-react';
import api from '../../api/axios';

export default function Attendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanUserId, setScanUserId] = useState('');

  const fetchAttendance = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await api.get(`/attendance/event/${eventId}`);
      setRecords(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) {
      alert("Please load an Event ID first!");
      return;
    }
    try {
      await api.post('/attendance', { eventId, userId: scanUserId });
      setShowScanner(false);
      setScanUserId('');
      fetchAttendance();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Scan failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Live Tracker</h1>
          <p className="text-muted-foreground mt-1">Realtime attendance monitoring and QR scanning.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Event ID..." 
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2 outline-none text-white text-sm"
          />
          <button 
            onClick={fetchAttendance}
            className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-xl font-medium transition-colors border border-border"
          >
            Load
          </button>
          <button 
            onClick={() => setShowScanner(true)}
            className="bg-primary hover:bg-destructive text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <Scan className="w-5 h-5" />
            <span>Launch Scanner</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card/40 border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Checked In</p>
            <p className="text-2xl font-bold text-white">{records.filter(r => !r.checkOutTime).length}</p>
          </div>
        </div>
        <div className="bg-card/40 border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Processed</p>
            <p className="text-2xl font-bold text-white">{records.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : records.length > 0 ? (
        <div className="bg-card/40 border border-border rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4 font-medium">Operative</th>
                <th className="px-6 py-4 font-medium">Student ID</th>
                <th className="px-6 py-4 font-medium">Check In</th>
                <th className="px-6 py-4 font-medium">Check Out</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((req, idx) => (
                <motion.tr 
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{req.user.firstName} {req.user.lastName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">{req.user.studentId || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-primary" />
                      {new Date(req.checkInTime).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {req.checkOutTime ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(req.checkOutTime).toLocaleTimeString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium text-green-500 bg-green-500/10 border-green-500/20">
                      PRESENT
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card/20">
          Enter an Event ID to load tracker data.
        </div>
      )}

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-primary/30 rounded-3xl p-8 w-full max-w-sm shadow-[0_0_80px_rgba(239,68,68,0.15)] text-center"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mx-auto mb-4 border border-primary/30 animate-pulse">
              <Scan className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Initialize Scan</h2>
            <p className="text-muted-foreground mb-6 text-sm">Target operative ID QR code or manually enter the designation.</p>
            
            <form onSubmit={handleScan} className="space-y-4">
              <input 
                type="text" 
                required
                className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white text-center font-mono"
                value={scanUserId}
                onChange={e => setScanUserId(e.target.value)}
                placeholder="USER_ID_XXX"
              />
              <button type="submit" className="w-full bg-primary text-white px-4 py-3 rounded-xl font-bold hover:bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all">Process Entry</button>
              <button type="button" onClick={() => setShowScanner(false)} className="w-full px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
