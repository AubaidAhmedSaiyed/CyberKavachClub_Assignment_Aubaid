import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Users, CheckSquare, Award, ShieldAlert, FileBadge, Bell, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import { hasPermission } from '../utils/rbac';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const allNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Events', path: '/dashboard/events', icon: Calendar },
    { name: 'Teams', path: '/dashboard/teams', icon: Users },
    { name: 'Attendance', path: '/dashboard/attendance', icon: CheckSquare },
    { name: 'Certificates', path: '/dashboard/certificates', icon: FileBadge },
    { name: 'Rewards', path: '/dashboard/rewards', icon: Award },
    { name: 'Approvals', path: '/dashboard/approvals', icon: ShieldAlert },
    { name: 'Users', path: '/dashboard/users', icon: Users },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ];

  const navItems = allNavItems.filter(item => hasPermission(user?.role, item.path));

  return (
    <div className="w-64 h-screen bg-card/50 backdrop-blur-md border-r border-border flex flex-col relative z-20">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="text-primary w-6 h-6" />
          <span>Cyber<span className="text-primary">Kavach</span></span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group overflow-hidden",
                isActive ? "text-white bg-primary/10" : "text-muted-foreground hover:text-white hover:bg-secondary/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={clsx("w-5 h-5", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-xl border border-border/50">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.firstName?.[0] || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
