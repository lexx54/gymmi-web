import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import type { Exercise } from '../../services/api/exercises';

const exercise: Exercise = {
  id: 'ex-1',
  name: 'Barbell Bench Press',
  targetMuscle: { en: 'Chest', es: 'Pecho' },
  equipment: { en: 'Barbell', es: 'Barra' },
  instructions: { en: 'Press the bar', es: 'Empuja la barra' },
  activationMap: {
    principal: { en: 'Chest', es: 'Pecho' },
    secondary: { en: 'Triceps', es: 'Tríceps' },
    stabilizers: { en: 'Shoulders', es: 'Hombros' },
  },
  difficulty: 'Intermediate',
  movementType: 'Compound',
  tags: [],
  images: ['https://cdn.gymmi.com/exercise-images/1.webp'],
  ownerId: null,
  gymId: null,
  createdAt: '',
  updatedAt: '',
};

describe('ExerciseDetailModal', () => {
  it('shows an edit action when onEdit is provided', () => {
    const onEdit = vi.fn();
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit exercise/i }));
    expect(onEdit).toHaveBeenCalled();
  });

  it('hides the edit action without onEdit', () => {
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /edit exercise/i })).not.toBeInTheDocument();
  });

  it('shows uploaded photos instead of placeholders', () => {
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} />);

    expect(screen.getByAltText('Exercise photo 1 of 1')).toHaveAttribute(
      'src',
      'https://cdn.gymmi.com/exercise-images/1.webp',
    );
    expect(screen.queryByText('Photos and video coming soon')).not.toBeInTheDocument();
  });

  it('asks for confirmation before deleting', () => {
    const onDelete = vi.fn();
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByText(/Delete "Barbell Bench Press"\?/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /delete exercise/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('can cancel the delete confirmation', () => {
    const onDelete = vi.fn();
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
  });

  it('disables the confirm buttons while deleting', () => {
    render(
      <ExerciseDetailModal exercise={exercise} onClose={vi.fn()} onDelete={vi.fn()} isDeleting />,
    );

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('hides the delete action without onDelete', () => {
    render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /^delete$/i })).not.toBeInTheDocument();
  });

  it('links to the exercise video in a new tab', () => {
    render(
      <ExerciseDetailModal
        exercise={{ ...exercise, videoUrl: 'https://www.youtube.com/watch?v=abc' }}
        onClose={vi.fn()}
      />,
    );

    const link = screen.getByRole('link', { name: /watch video/i });
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=abc');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('hides the video link when missing or unsafe', () => {
    const { rerender } = render(<ExerciseDetailModal exercise={exercise} onClose={vi.fn()} />);
    expect(screen.queryByRole('link', { name: /watch video/i })).not.toBeInTheDocument();

    rerender(
      <ExerciseDetailModal
        exercise={{ ...exercise, videoUrl: 'javascript:alert(1)' }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByRole('link', { name: /watch video/i })).not.toBeInTheDocument();
  });
});
