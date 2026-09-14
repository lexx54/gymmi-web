import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setAppLanguage } from '../../i18n';
import { ExerciseBodyMap } from './ExerciseBodyMap';

afterEach(async () => {
  await setAppLanguage('en');
});

describe('ExerciseBodyMap', () => {
  it('keeps canonical English muscle regions active in Spanish', async () => {
    await setAppLanguage('es');
    const { container } = render(
      <ExerciseBodyMap primary="Quads" secondary="Glutes" stabilizers="Calves" />,
    );

    expect(screen.getByRole('img', { name: 'Frente' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Espalda' })).toBeInTheDocument();
    expect(container.querySelector('[data-muscle="Quads"]')).toHaveAttribute(
      'data-tier',
      'primary',
    );
    expect(container.querySelector('[data-muscle="Glutes"]')).toHaveAttribute(
      'data-tier',
      'secondary',
    );
    expect(container.querySelector('[data-muscle="Chest"]')).toHaveAttribute(
      'data-tier',
      'inactive',
    );
    expect(container).toMatchSnapshot();
  });
});
