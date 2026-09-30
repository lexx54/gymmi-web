export interface PresetSpecialization {
  key: string;
  labelKey: string;
  defaultEn: string;
}

export const PRESET_SPECIALIZATIONS: PresetSpecialization[] = [
  { key: 'hypertrophy', labelKey: 'auth.tagPresets.hypertrophy', defaultEn: 'Hypertrophy' },
  { key: 'weightLoss', labelKey: 'auth.tagPresets.weightLoss', defaultEn: 'Weight Loss' },
  { key: 'powerlifting', labelKey: 'auth.tagPresets.powerlifting', defaultEn: 'Powerlifting' },
  { key: 'hiit', labelKey: 'auth.tagPresets.hiit', defaultEn: 'HIIT & Cardio' },
  { key: 'calisthenics', labelKey: 'auth.tagPresets.calisthenics', defaultEn: 'Calisthenics' },
  { key: 'rehabilitation', labelKey: 'auth.tagPresets.rehabilitation', defaultEn: 'Rehab & Mobility' },
  { key: 'crossfit', labelKey: 'auth.tagPresets.crossfit', defaultEn: 'CrossFit' },
  { key: 'nutrition', labelKey: 'auth.tagPresets.nutrition', defaultEn: 'Nutrition Coaching' },
];

/**
 * Translates a specialization tag (preset key, English label, or Spanish label)
 * into the localized label using the provided translation function `t`.
 * Custom/unlisted tags are returned as-is.
 */
export function getSpecializationLabel(tag: string, t: (key: string) => string): string {
  if (!tag) return '';
  const normalized = tag.trim().toLowerCase();

  if (normalized === 'hypertrophy' || normalized === 'hipertrofia') {
    return t('auth.tagPresets.hypertrophy');
  }
  if (
    normalized === 'weight loss' ||
    normalized === 'weightloss' ||
    normalized === 'pérdida de peso' ||
    normalized === 'perdida de peso'
  ) {
    return t('auth.tagPresets.weightLoss');
  }
  if (normalized === 'powerlifting' || normalized === 'levantamiento de potencia') {
    return t('auth.tagPresets.powerlifting');
  }
  if (
    normalized === 'hiit & cardio' ||
    normalized === 'hiit y cardio' ||
    normalized === 'hiit' ||
    normalized === 'cardio'
  ) {
    return t('auth.tagPresets.hiit');
  }
  if (normalized === 'calisthenics' || normalized === 'calistenia') {
    return t('auth.tagPresets.calisthenics');
  }
  if (
    normalized === 'rehab & mobility' ||
    normalized === 'rehabilitación y movilidad' ||
    normalized === 'rehabilitacion y movilidad' ||
    normalized === 'rehab' ||
    normalized === 'rehabilitation'
  ) {
    return t('auth.tagPresets.rehabilitation');
  }
  if (normalized === 'crossfit') {
    return t('auth.tagPresets.crossfit');
  }
  if (
    normalized === 'nutrition coaching' ||
    normalized === 'asesoría nutricional' ||
    normalized === 'asesoria nutricional' ||
    normalized === 'nutrition'
  ) {
    return t('auth.tagPresets.nutrition');
  }

  return tag;
}

/**
 * Checks whether an existing tag in a trainer profile matches a preset specialization.
 */
export function isSameSpecialization(existingTag: string, preset: PresetSpecialization): boolean {
  if (!existingTag) return false;
  const normExisting = existingTag.trim().toLowerCase();
  const normKey = preset.key.toLowerCase();
  const normDefaultEn = preset.defaultEn.toLowerCase();

  if (normExisting === normKey || normExisting === normDefaultEn) return true;

  if (preset.key === 'hypertrophy' && (normExisting === 'hipertrofia' || normExisting === 'hypertrophy')) {
    return true;
  }
  if (
    preset.key === 'weightLoss' &&
    (normExisting === 'weight loss' || normExisting === 'pérdida de peso' || normExisting === 'perdida de peso')
  ) {
    return true;
  }
  if (
    preset.key === 'powerlifting' &&
    (normExisting === 'powerlifting' || normExisting === 'levantamiento de potencia')
  ) {
    return true;
  }
  if (
    preset.key === 'hiit' &&
    (normExisting === 'hiit & cardio' || normExisting === 'hiit y cardio' || normExisting === 'hiit')
  ) {
    return true;
  }
  if (
    preset.key === 'calisthenics' &&
    (normExisting === 'calisthenics' || normExisting === 'calistenia')
  ) {
    return true;
  }
  if (
    preset.key === 'rehabilitation' &&
    (normExisting === 'rehab & mobility' ||
      normExisting === 'rehabilitación y movilidad' ||
      normExisting === 'rehabilitacion y movilidad' ||
      normExisting === 'rehab' ||
      normExisting === 'rehabilitation')
  ) {
    return true;
  }
  if (preset.key === 'crossfit' && normExisting === 'crossfit') {
    return true;
  }
  if (
    preset.key === 'nutrition' &&
    (normExisting === 'nutrition coaching' ||
      normExisting === 'asesoría nutricional' ||
      normExisting === 'asesoria nutricional' ||
      normExisting === 'nutrition')
  ) {
    return true;
  }

  return false;
}
