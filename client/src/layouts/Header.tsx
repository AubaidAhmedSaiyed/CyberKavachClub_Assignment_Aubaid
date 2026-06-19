import { Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-border bg-card/30 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center w-96 relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search the network..." 
          className="w-full bg-secondary/40 border border-border rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,1)]"></span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors ml-4"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    </header>
  );
}
