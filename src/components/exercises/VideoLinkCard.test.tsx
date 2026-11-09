import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VideoLinkCard } from './VideoLinkCard';

describe('VideoLinkCard', () => {
  it('emits typed links', () => {
    const onChange = vi.fn();
    render(<VideoLinkCard value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Video link'), {
      target: { value: 'https://youtu.be/abc' },
    });
    expect(onChange).toHaveBeenCalledWith('https://youtu.be/abc');
    expect(screen.getByLabelText('Video link')).toHaveAttribute('aria-invalid', 'false');
  });

  it('flags links that are not full http(s) URLs', () => {
    render(<VideoLinkCard value="youtube.com/watch?v=abc" onChange={vi.fn()} />);

    expect(screen.getByLabelText('Video link')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a full link starting with https://')).toBeInTheDocument();
  });
});
