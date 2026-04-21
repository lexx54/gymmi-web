export interface EditorialHeaderProps {
  /** Time-of-day greeting shown above the headline (e.g. "GOOD MORNING"). */
  greeting: string;
  /** User name appended to the greeting. */
  name: string;
  /** Large ghosted background word rendered behind the headline. */
  ghostLabel?: string;
  /** First line of the main headline. */
  line1: string;
  /** Accent phrase rendered in the brand color on the second line. */
  accent: string;
  /** Trailing text after the accent on the second line. */
  line2Suffix: string;
}

/**
 * Editorial page header: ghost-word backdrop, time-of-day overline, and
 * a large italic headline with an accent phrase. Implements DESIGN.md
 * section 3 (Editorial Authority typography) and the "Deep Space" layering
 * principle from section 1.
 */
export default function EditorialHeader({
  greeting,
  name,
  ghostLabel = 'ELITE',
  line1,
  accent,
  line2Suffix,
}: EditorialHeaderProps) {
  return (
    <section className="mb-12 relative">
      <div
        aria-hidden
        className="absolute -left-12 top-0 text-[120px] font-black text-surface-container-highest/10 select-none leading-none pointer-events-none font-headline"
      >
        {ghostLabel}
      </div>
      <p className="text-primary font-label font-bold tracking-[0.2em] mb-2">
        {greeting}, {name}
      </p>
      <h2 className="text-5xl lg:text-7xl font-black font-headline tracking-tighter italic leading-none text-on-surface">
        {line1} <br />{' '}
        <span className="text-kinetic-red">{accent}</span> {line2Suffix}
      </h2>
    </section>
  );
}
