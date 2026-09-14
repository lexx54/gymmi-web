import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NoRoutines } from './NoRoutines';

vi.mock('../Can', () => ({
  Can: ({ children }: { children: ReactNode }) => children,
}));

describe('NoRoutines', () => {
  it('renders the empty catalog with a create action', () => {
    const onCreateRoutine = vi.fn();
    render(<NoRoutines variant="empty" onCreateRoutine={onCreateRoutine} />);

    expect(screen.getByRole('heading', { name: /no routines yet/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /create routine/i }));
    expect(onCreateRoutine).toHaveBeenCalledTimes(1);
  });

  it('clears filters from the no-results state', () => {
    const onClearFilters = vi.fn();
    render(<NoRoutines variant="no-results" onClearFilters={onClearFilters} />);

    expect(screen.getByRole('heading', { name: /no routines found/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});
