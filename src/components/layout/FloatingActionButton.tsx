import { Play } from 'lucide-react';

/**
 * Persistent floating "Start Workout" CTA per the Kinetic design system.
 * Uses the primary -> primary-container gradient with an extra-diffused
 * ambient glow (no traditional drop shadow). Sits above the BottomNav on mobile.
 */
export function FloatingActionButton() {
  return (
    <button
      type="button"
      className="fixed right-6 lg:right-12 bottom-12 max-md:bottom-28 z-50 group"
      aria-label="Start workout"
    >
      <span className="absolute inset-0 bg-primary-container rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
      <span className="relative bg-gradient-to-br from-primary to-primary-container text-background flex items-center gap-3 pl-5 pr-7 py-4 rounded-full editorial-shadow hover:scale-105 active:scale-95 transition-all duration-300">
        <Play className="size-7 shrink-0" strokeWidth={2.5} fill="currentColor" aria-hidden />
        <span className="font-headline font-extrabold tracking-tighter text-base lg:text-lg italic">
          START WORKOUT
        </span>
      </span>
    </button>
  );
}
