/** Gymmi red, used when a branded coach or gym hasn't picked a color. */
export const DEFAULT_BRAND_COLOR = '#ef233c';

/** Preset accent colors offered in the brand editor. */
export const BRAND_COLOR_PRESETS = [
  '#ef233c',
  '#ff6b35',
  '#ffd60a',
  '#2ec4b6',
  '#0b3d91',
  '#7b2cbf',
  '#111827',
  '#e5e7eb',
] as const;

export const isBrandColor = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const value = parseInt(hex.slice(i, i + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * Same rule as the API's `readableTextColor`: white text when it meets WCAG AA
 * for bold text (3:1), otherwise near-black. Used for live previews only; real
 * brands come with `textColor` from the API.
 */
export function readableTextColor(hex: string): string {
  if (!isBrandColor(hex)) return '#ffffff';
  return 1.05 / (luminance(hex) + 0.05) >= 3 ? '#ffffff' : '#111111';
}
