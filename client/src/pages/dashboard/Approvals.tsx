import { useState, useEffect } from 'react';

import { ShieldAlert, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { useSocket } from '../../context/SocketContext';

export default function Approvals() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'events'>('requests');
  const { socket } = useSocket();

  const fetchAll = async () => {
    try {
      setLoading(true);
      const resReq = await api.get('/requests');
      setRequests(resReq.data);

      const resAn = await api.get('/analytics/admin');
      setPendingEvents(resAn.data.pendingEvents || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    if (socket) {
      socket.on('SYSTEM_UPDATE', () => {
        fetchAll();
      });
    }

    return () => {
      if (socket) socket.off('SYSTEM_UPDATE');
    };
  }, [socket]);

  const handleReviewRequest = async (id: string, status: string) => {
    try {
      await api.patch(`/requests/${id}/review`, { status, remarks: 'Reviewed by ' + user?.firstName });
      fetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePublishEvent = async (id: string) => {
    try {
      await api.patch(`/events/${id}/publish`);
      // WebSocket SYSTEM_UPDATE will handle the refresh
    } catch (error) {
      console.error(error);
      alert('Failed to publish event');
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Clearance Center</h1>
          <p className="text-muted-foreground mt-1">Manage system requests and event publications.</p>
        </div>
      </div>

      <div className="flex border-b border-border mb-6">
        <button
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'}`}
          onClick={() => setActiveTab('requests')}
        >
          General Requests
        </button>
        <button
          className={`px-4 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'}`}
          onClick={() => setActiveTab('events')}
        >
          Unpublished Events
          {pendingEvents.length > 0 && (
            <span className="bg-destructive text-white text-xs px-2 py-0.5 rounded-full">{pendingEvents.length}</span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'requests' ? (
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
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No pending requests found.</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{req.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{req.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{req.type.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-sm text-white">{req.creator?.firstName} {req.creator?.lastName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                        {getStatusIcon(req.status)}
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'PENDING' || req.status === 'UNDER_REVIEW' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleReviewRequest(req.id, 'APPROVED')} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleReviewRequest(req.id, 'REJECTED')} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Reject">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card/40 border border-border rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.2)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Venue</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No unpublished events found.</td>
                </tr>
              ) : (
                pendingEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{event.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{event.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-white">{event.venue}</td>
                    <td className="px-6 py-4 text-sm text-white">{event.capacity}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handlePublishEvent(event.id)} 
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve & Publish
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
