import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, BarChart3, User } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container/80 backdrop-blur-2xl rounded-t-3xl z-50 shadow-[0_-10px_40px_rgba(16,18,37,0.4)]">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center rounded-xl px-4 py-2 tap-highlight-none active:scale-90 ${
            isActive
              ? 'text-primary bg-surface-variant'
              : 'text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity'
          }`
        }
        end
      >
        <LayoutDashboard className="size-6" strokeWidth={2} aria-hidden />
        <span className="font-body uppercase tracking-[0.05em] text-[10px] font-bold mt-1">
          DASHBOARD
        </span>
      </NavLink>
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity tap-highlight-none active:scale-90"
        href="#"
      >
        <Dumbbell className="size-6" strokeWidth={2} aria-hidden />
        <span className="font-body uppercase tracking-[0.05em] text-[10px] font-bold mt-1">
          WORKOUTS
        </span>
      </a>
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity tap-highlight-none active:scale-90"
        href="#"
      >
        <BarChart3 className="size-6" strokeWidth={2} aria-hidden />
        <span className="font-body uppercase tracking-[0.05em] text-[10px] font-bold mt-1">
          STATS
        </span>
      </a>
      <a
        className="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity tap-highlight-none active:scale-90"
        href="#"
      >
        <User className="size-6" strokeWidth={2} aria-hidden />
        <span className="font-body uppercase tracking-[0.05em] text-[10px] font-bold mt-1">
          PROFILE
        </span>
      </a>
    </nav>
  );
}
