import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const handleAction = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  const actions = [
    { name: 'Dashboard Home', path: '/dashboard' },
    { name: 'Manage Events', path: '/dashboard/events' },
    { name: 'View Teams', path: '/dashboard/teams' },
    { name: 'Attendance System', path: '/dashboard/attendance' },
    { name: 'Certificates Engine', path: '/dashboard/certificates' },
    { name: 'My Rewards', path: '/dashboard/rewards' },
    { name: 'Review Approvals', path: '/dashboard/approvals' },
  ];

  const filtered = actions.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm">
      <div className="bg-background border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input 
            type="text" 
            autoFocus 
            placeholder="Search commands... (e.g. Events, Teams)"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">No results found</div>
          ) : (
            filtered.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleAction(action.path)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary/50 text-gray-300 hover:text-white transition-colors"
              >
                {action.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
