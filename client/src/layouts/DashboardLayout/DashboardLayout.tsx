import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Dynamic Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
