import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, ShieldCheck, QrCode } from 'lucide-react';
import api from '../../api/axios';

export default function Teams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [memberIds, setMemberIds] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const members = memberIds.split(',').map(id => id.trim()).filter(id => id.length > 0);
      await api.post('/teams', { name: newTeamName, members });
      setShowModal(false);
      setNewTeamName('');
      setMemberIds('');
      fetchTeams();
    } catch (error) {
      console.error(error);
      alert('Failed to form squad.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">Organize and track operational squads.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-destructive text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        >
          <Plus className="w-5 h-5" />
          <span>Form New Squad</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, idx) => (
            <motion.div 
              key={team.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card/40 border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="p-5 border-b border-border bg-secondary/30 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">{team.name}</h3>
                  <p className="text-xs text-primary font-mono">{team.teamId}</p>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Squad Roster</h4>
                <div className="space-y-3">
                  {team.members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                          {member.user.firstName[0]}
                        </div>
                        <span className="text-gray-300">{member.user.firstName} {member.user.lastName}</span>
                      </div>
                      {member.isLeader && (
                        <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          <ShieldCheck className="w-3 h-3" /> Leader
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-2">
                  <button className="flex-1 bg-secondary hover:bg-secondary/80 text-white py-2 rounded-xl font-medium transition-colors border border-border hover:border-primary/50 text-sm flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4" /> Show QR
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {teams.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card/20">
              No active squads in the network.
            </div>
          )}
        </div>
      )}

      {/* Create Team Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-primary/30 rounded-3xl p-8 w-full max-w-lg shadow-[0_0_80px_rgba(239,68,68,0.15)]"
          >
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" /> Form New Squad
            </h2>
            <p className="text-muted-foreground mb-8">Register a new operational team. You will automatically be assigned as Team Leader.</p>
            
            <form onSubmit={handleCreateTeam} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Squad Designation (Name)</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  placeholder="e.g. Phantom Strike"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member IDs (Comma separated)</label>
                <input 
                  type="text" 
                  className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white"
                  value={memberIds}
                  onChange={e => setMemberIds(e.target.value)}
                  placeholder="user_id_1, user_id_2"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave blank to add members later.</p>
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t border-border mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-secondary/80 transition-colors font-medium">Abort</button>
                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all">Form Squad</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
