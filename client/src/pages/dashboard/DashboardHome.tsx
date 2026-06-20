import { useAuth } from '../../context/AuthContext';
import { Roles } from '../../utils/rbac';
import AdminDashboard from './views/AdminDashboard';
import MemberDashboard from './views/MemberDashboard';
import GuestDashboard from './views/GuestDashboard';

export default function DashboardHome() {
  const { user } = useAuth();

  if (!user) return null;

  // Render Admin Dashboard for all coordinators for now
  if (
    user.role === Roles.FACULTY_COORDINATOR ||
    user.role === Roles.STUDENT_COORDINATOR ||
    user.role === Roles.TECH_COORDINATOR ||
    user.role === Roles.CONTENT_COORDINATOR ||
    user.role === Roles.SOCIAL_MEDIA_COORDINATOR
  ) {
    return <AdminDashboard />;
  }

  // Render Member Dashboard for club members
  if (user.role === Roles.CLUB_MEMBER) {
    return <MemberDashboard />;
  }

  // Render Guest Dashboard for guests
  return <GuestDashboard />;
}

