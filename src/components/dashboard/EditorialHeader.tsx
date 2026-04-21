interface EditorialHeaderProps {
  /** Time-aware salutation, e.g. "GOOD MORNING". */
  greeting: string;
  /** User's display name, already uppercased. */
  name: string;
  /** First white headline line, e.g. "YOU'RE IN THE". */
  line1: string;
  /** Accent phrase rendered in primary tint, e.g. "PEAK ZONE". */
  accent: string;
  /** Trailing white phrase appended after the accent, e.g. "TODAY.". */
  line2Suffix: string;
}

/**
 * Editorial greeting block. Pairs a small uppercase overline with a giant
 * italic display stack inspired by the Kinetic Precision design language.
 * Intentional left/right asymmetry between the two display lines provides
 * the "magazine" feel called out in DESIGN.md.
 */
export function EditorialHeader({
  greeting,
  name,
  line1,
  accent,
  line2Suffix,
}: EditorialHeaderProps) {
  return (
    <header className="col-span-12 mb-4">
      <p className="font-label text-xs sm:text-sm text-on-surface-variant uppercase tracking-[0.25em] mb-4">
        {greeting}, {name}
      </p>
      <h2 className="font-headline italic font-extrabold tracking-tighter leading-[0.95] text-on-surface text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
        <span className="block">{line1}</span>
        <span className="block pl-2 sm:pl-6 lg:pl-12">
          <span className="text-primary">{accent}</span>
          <span className="text-on-surface"> {line2Suffix}</span>
        </span>
      </h2>
    </header>
  );
}
