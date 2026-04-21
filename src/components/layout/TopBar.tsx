import { Bell } from 'lucide-react';

const profileAvatarUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AcZRzgwrqep6pbj8V5dHpCQbDn2g4gaeyWifoiZ2lF3KRoNcUOOCYAS0V0ZmRQdxtZTV-sUfU5ABfaLyQjDf62eUbBenirRew4-BuVYJ_CdTiaz6l7_853M6ETzYPrCzeeVAFCeDjzlCc8MV9wAV7v8ZPFFp2laB6VrCYaSpSX2h-uKje0RpKOHPTaUS7ymmdFL7-wnLq6rJ4RvyAHdwMOjY3ib52ktk8zcOcFX_phF-7R1FAc69gE1jGCa0lfO1sLVafHLLRgw';

interface TopBarProps {
  /** Page title displayed at the top-left on large screens. */
  title?: string;
}

/**
 * Glassmorphic top bar pinned above all dashboard routes.
 * Shows the page title (large screens) or KINETIC wordmark (mobile),
 * with a notifications bell and the user avatar on the right.
 */
export function TopBar({ title = 'DASHBOARD' }: TopBarProps) {
  return (
    <header className="fixed top-0 w-full z-40 bg-transparent backdrop-blur-3xl flex justify-between items-center pl-6 pr-6 py-4 lg:pl-80">
      <div className="lg:hidden text-2xl font-black italic tracking-tighter text-kinetic-red font-headline">
        KINETIC
      </div>
      <div className="hidden lg:block text-primary font-headline tracking-tighter font-bold text-xl uppercase">
        {title}
      </div>
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="text-primary hover:bg-surface-variant p-2 rounded-xl transition-colors active:scale-95 duration-200"
          aria-label="Notifications"
        >
          <Bell className="size-6" strokeWidth={2} />
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-primary p-0.5">
          <img
            alt=""
            className="w-full h-full rounded-full object-cover"
            src={profileAvatarUrl}
          />
        </div>
      </div>
    </header>
  );
}
