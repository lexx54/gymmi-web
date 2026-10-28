import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { ExerciseImagesCard } from './ExerciseImagesCard';
import { uploadExerciseImage } from '../../utils/imageUpload';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

vi.mock('../../utils/imageUpload', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/imageUpload')>()),
  uploadExerciseImage: vi.fn(),
}));

const photo = (name: string) => new File(['x'], name, { type: 'image/jpeg' });

describe('ExerciseImagesCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows uploaded photos with remove buttons and an add slot', () => {
    const onRemoveImage = vi.fn();
    render(
      <ExerciseImagesCard
        images={['https://cdn.gymmi.com/a.webp']}
        onAddImages={vi.fn()}
        onRemoveImage={onRemoveImage}
      />,
    );

    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.gymmi.com/a.webp');
    expect(screen.getByRole('button', { name: /add exercise photos/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /remove photo 1/i }));
    expect(onRemoveImage).toHaveBeenCalledWith('https://cdn.gymmi.com/a.webp');
  });

  it('uploads only as many files as there are free slots', async () => {
    vi.mocked(uploadExerciseImage).mockImplementation(async (file) => `https://cdn/${file.name}`);
    const onAddImages = vi.fn();
    render(
      <ExerciseImagesCard
        images={['https://cdn.gymmi.com/a.webp']}
        onAddImages={onAddImages}
        onRemoveImage={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId('exercise-images-input'), {
      target: { files: [photo('1.jpg'), photo('2.jpg'), photo('3.jpg')] },
    });

    await waitFor(() => expect(onAddImages).toHaveBeenCalledWith(['https://cdn/1.jpg', 'https://cdn/2.jpg']));
    expect(uploadExerciseImage).toHaveBeenCalledTimes(2);
    expect(toast.error).toHaveBeenCalledWith('You can upload up to 3 photos per exercise');
  });

  it('hides the add slot once three photos are uploaded', () => {
    render(
      <ExerciseImagesCard
        images={['https://cdn/1', 'https://cdn/2', 'https://cdn/3']}
        onAddImages={vi.fn()}
        onRemoveImage={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: /add exercise photos/i })).not.toBeInTheDocument();
  });

  it('reports photos that stay too large after optimizing', async () => {
    vi.mocked(uploadExerciseImage).mockRejectedValue(new Error('FILE_TOO_LARGE'));
    const onAddImages = vi.fn();
    render(<ExerciseImagesCard images={[]} onAddImages={onAddImages} onRemoveImage={vi.fn()} />);

    fireEvent.change(screen.getByTestId('exercise-images-input'), {
      target: { files: [photo('big.jpg')] },
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'This photo is still over 1MB after optimizing. Try a smaller image.',
      ),
    );
    expect(onAddImages).not.toHaveBeenCalled();
  });
});
