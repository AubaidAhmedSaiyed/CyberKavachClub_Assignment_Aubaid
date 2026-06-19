import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Approvals() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', type: 'EVENT_APPROVAL', eventId: null });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: string) => {
    try {
      await api.patch(`/requests/${id}/review`, { status, remarks: 'Reviewed by ' + user?.firstName });
      fetchRequests(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/requests', newRequest);
      setShowModal(false);
      setNewRequest({ title: '', description: '', type: 'EVENT_APPROVAL', eventId: null });
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert('Failed to submit request.');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'UNDER_REVIEW': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'APPROVED': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'REJECTED': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'UNDER_REVIEW': return <ShieldAlert className="w-4 h-4" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Clearance Approvals</h1>
          <p className="text-muted-foreground mt-1">Manage system requests and security clearances.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-destructive text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        >
          <FileText className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-card/40 border border-border rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4 font-medium">Request Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Requester</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req, idx) => (
                <motion.tr 
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{req.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-gray-300 bg-secondary px-2 py-1 rounded-md border border-border">
                      {req.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-white">{req.creator.firstName} {req.creator.lastName}</p>
                      <p className="text-xs text-muted-foreground">{req.creator.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      <span>{req.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(user?.role === 'FACULTY_COORDINATOR' || user?.role === 'STUDENT_COORDINATOR') && req.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleReview(req.id, 'APPROVED')}
                          className="p-1.5 text-green-500 hover:bg-green-500/20 rounded-md transition-colors" title="Approve">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleReview(req.id, 'REJECTED')}
                          className="p-1.5 text-destructive hover:bg-destructive/20 rounded-md transition-colors" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No Actions</span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No clearance requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-primary/30 rounded-3xl p-8 w-full max-w-lg shadow-[0_0_80px_rgba(239,68,68,0.15)]"
          >
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" /> Submit Clearance Request
            </h2>
            <p className="text-muted-foreground mb-8">Request budget, equipment, or event permissions from Central Command.</p>
            
            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white"
                  value={newRequest.title}
                  onChange={e => setNewRequest({...newRequest, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</label>
                <select 
                  className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white appearance-none"
                  value={newRequest.type}
                  onChange={e => setNewRequest({...newRequest, type: e.target.value})}
                >
                  <option value="EVENT_APPROVAL">Event Approval</option>
                  <option value="BUDGET">Budget Clearance</option>
                  <option value="EQUIPMENT">Equipment Requisition</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Justification (Description)</label>
                <textarea 
                  required rows={3}
                  className="w-full bg-secondary/40 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all text-white resize-none"
                  value={newRequest.description}
                  onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t border-border mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-secondary/80 transition-colors font-medium">Abort</button>
                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all">Submit Protocol</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
