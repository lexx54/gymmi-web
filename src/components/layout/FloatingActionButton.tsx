import { Play } from 'lucide-react';

export function FloatingActionButton() {
  return (
    <button type="button" className="fixed bottom-12 right-12 z-50 group md:bottom-12 max-md:bottom-28">
      <span className="absolute inset-0 bg-primary-container rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
      <span className="relative bg-gradient-to-br from-primary to-primary-container text-background flex items-center gap-4 pl-6 pr-8 py-5 rounded-full editorial-shadow hover:scale-105 active:scale-95 transition-all duration-300">
        <Play className="size-8 shrink-0 text-background" strokeWidth={2.5} fill="currentColor" aria-hidden />
        <span className="font-headline font-extrabold tracking-tighter text-lg italic">
          START WORKOUT
        </span>
      </span>
    </button>
  );
}
