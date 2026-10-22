/**
 * Legal identity values rendered on public legal pages (Terms of Service).
 * Update these before store submission if the operating entity, contact
 * mailbox, or governing jurisdiction change.
 */
export const LEGAL_CONFIG = {
  /** Legal name of the entity that operates Gymmi. */
  companyName: 'Gymmi',
  /** Mailbox for legal notices, account deletion requests, and content reports. */
  contactEmail: 'support@gymmi.app',
  /** Country whose laws govern the Terms. */
  jurisdiction: 'the Bolivarian Republic of Venezuela',
  jurisdictionEs: 'la República Bolivariana de Venezuela',
  /** ISO date of the current Terms revision. */
  lastUpdated: '2026-10-21',
  /** Minimum age to register, kept in sync with the signup schema. */
  minimumAge: 14,
} as const;
