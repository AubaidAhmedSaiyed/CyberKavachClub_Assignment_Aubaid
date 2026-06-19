import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Events from './pages/dashboard/Events';
import EventDetails from './pages/dashboard/EventDetails';
import Approvals from './pages/dashboard/Approvals';
import Teams from './pages/dashboard/Teams';
import Attendance from './pages/dashboard/Attendance';
import Certificates from './pages/dashboard/Certificates';
import Rewards from './pages/dashboard/Rewards';
import Notifications from './pages/dashboard/Notifications';
import CommandPalette from './components/CommandPalette';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="teams" element={<Teams />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
