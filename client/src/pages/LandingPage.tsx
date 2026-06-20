import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Activity, Users, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">CyberKavach</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/register" className="bg-primary hover:bg-destructive text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center gap-2">
              Join Club <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            University Cybersecurity Club
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Defend the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Digital Frontier.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            CyberKavach is the elite university cybersecurity organization. Learn ethical hacking, participate in CTFs, and secure the networks of tomorrow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto bg-primary hover:bg-destructive text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2 text-lg">
              Become a Member <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-secondary hover:bg-secondary/80 text-white px-8 py-4 rounded-xl font-bold transition-all border border-border flex items-center justify-center gap-2 text-lg">
              Access Terminal
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl mx-auto w-full text-left"
        >
          <div className="bg-card/40 backdrop-blur-sm border border-border p-8 rounded-3xl hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Live CTF Events</h3>
            <p className="text-muted-foreground leading-relaxed">Compete in real-time Capture The Flag tournaments against other universities and test your skills.</p>
          </div>

          <div className="bg-card/40 backdrop-blur-sm border border-border p-8 rounded-3xl hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Skill Certifications</h3>
            <p className="text-muted-foreground leading-relaxed">Earn verified digital badges and certificates by completing workshops and attending security seminars.</p>
          </div>

          <div className="bg-card/40 backdrop-blur-sm border border-border p-8 rounded-3xl hover:border-green-500/50 transition-colors group">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Elite Networking</h3>
            <p className="text-muted-foreground leading-relaxed">Connect with industry professionals, alumni, and peers who share your passion for cybersecurity.</p>
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 text-center">
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} CyberKavach Club. All systems operational.</p>
      </footer>
    </div>
  );
}
