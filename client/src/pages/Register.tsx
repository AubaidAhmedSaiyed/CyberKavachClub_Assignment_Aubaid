import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/auth/register', formData);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Cyber Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-destructive/10 via-background to-background z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg z-10 px-4"
      >
        <div className="bg-card/60 backdrop-blur-xl border border-primary/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.05)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Request Clearance</h1>
            <p className="text-muted-foreground">Join the CyberKavach Network</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-xl bg-destructive/20 border border-destructive/50 text-destructive-foreground text-sm text-center">
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-400 text-sm text-center">
              {success}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  className="w-full bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 outline-none transition-all text-white"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  required
                  className="w-full bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 outline-none transition-all text-white"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Student ID / Roll No</label>
              <input 
                type="text" 
                name="studentId"
                required
                className="w-full bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 outline-none transition-all text-white"
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 outline-none transition-all text-white"
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Secure Password</label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 outline-none transition-all text-white"
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-4 bg-primary hover:bg-destructive text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-[0.98]"
            >
              Submit Application
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have clearance? <Link to="/login" className="text-primary hover:underline">Access System</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
