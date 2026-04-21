import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { FloatingActionButton } from './FloatingActionButton';

export function DashboardLayout() {
  return (
    <div className="dark min-h-screen bg-background font-body text-on-surface">
      <Sidebar />
      <TopBar />
      <main className="pt-24 pb-12 pl-6 pr-6 lg:pl-80 lg:pr-12 min-h-screen max-md:pb-28">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <FloatingActionButton />
      <BottomNav />
    </div>
  );
}
