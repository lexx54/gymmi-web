import { describe, it, expect } from 'vitest';
import {
  PRESET_SPECIALIZATIONS,
  getSpecializationLabel,
  isSameSpecialization,
} from './specializations';

describe('specializations utility', () => {
  const mockTranslations: Record<string, string> = {
    'auth.tagPresets.hypertrophy': 'Hipertrofia',
    'auth.tagPresets.weightLoss': 'Pérdida de Peso',
    'auth.tagPresets.powerlifting': 'Levantamiento de Potencia',
    'auth.tagPresets.hiit': 'HIIT y Cardio',
    'auth.tagPresets.calisthenics': 'Calistenia',
    'auth.tagPresets.rehabilitation': 'Rehabilitación y Movilidad',
    'auth.tagPresets.crossfit': 'CrossFit',
    'auth.tagPresets.nutrition': 'Asesoría Nutricional',
  };

  const t = (key: string) => mockTranslations[key] || key;

  it('translates English preset names to localized labels', () => {
    expect(getSpecializationLabel('Hypertrophy', t)).toBe('Hipertrofia');
    expect(getSpecializationLabel('Weight Loss', t)).toBe('Pérdida de Peso');
    expect(getSpecializationLabel('Calisthenics', t)).toBe('Calistenia');
    expect(getSpecializationLabel('HIIT & Cardio', t)).toBe('HIIT y Cardio');
    expect(getSpecializationLabel('Rehab & Mobility', t)).toBe('Rehabilitación y Movilidad');
    expect(getSpecializationLabel('Powerlifting', t)).toBe('Levantamiento de Potencia');
    expect(getSpecializationLabel('Nutrition Coaching', t)).toBe('Asesoría Nutricional');
  });

  it('translates preset keys to localized labels', () => {
    expect(getSpecializationLabel('hypertrophy', t)).toBe('Hipertrofia');
    expect(getSpecializationLabel('weightloss', t)).toBe('Pérdida de Peso');
    expect(getSpecializationLabel('calisthenics', t)).toBe('Calistenia');
  });

  it('returns custom unlisted tags as-is', () => {
    expect(getSpecializationLabel('Kettlebell Sport', t)).toBe('Kettlebell Sport');
    expect(getSpecializationLabel('Yoga Vinyasa', t)).toBe('Yoga Vinyasa');
  });

  it('identifies if a tag matches a preset', () => {
    const hypertrophyPreset = PRESET_SPECIALIZATIONS.find((p) => p.key === 'hypertrophy')!;
    expect(isSameSpecialization('Hypertrophy', hypertrophyPreset)).toBe(true);
    expect(isSameSpecialization('hipertrofia', hypertrophyPreset)).toBe(true);
    expect(isSameSpecialization('hypertrophy', hypertrophyPreset)).toBe(true);
    expect(isSameSpecialization('Yoga', hypertrophyPreset)).toBe(false);
  });
});
