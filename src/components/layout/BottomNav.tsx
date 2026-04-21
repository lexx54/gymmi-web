import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, BarChart3, User } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type LucideSvgIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

interface BottomNavItem {
  to: string;
  label: string;
  icon: LucideSvgIcon;
}

const items: BottomNavItem[] = [
  { to: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { to: '/workouts', label: 'WORKOUTS', icon: Dumbbell },
  { to: '/analytics', label: 'STATS', icon: BarChart3 },
  { to: '/profile', label: 'PROFILE', icon: User },
];

/**
 * Glassmorphic mobile-only bottom navigation.
 * Hidden on `md` and above where the Sidebar takes over.
 */
export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container/80 backdrop-blur-2xl rounded-t-3xl z-50">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-xl px-4 py-2 active:scale-90 transition-transform ${
              isActive
                ? 'text-primary bg-surface-variant'
                : 'text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity'
            }`
          }
        >
          <Icon className="size-6" strokeWidth={2} aria-hidden />
          <span className="font-body uppercase tracking-[0.05em] text-[10px] font-bold mt-1">
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
