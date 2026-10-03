import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpotlightTour } from './SpotlightTour';
import * as tourStorage from '../../services/storage/tourStorage';

describe('SpotlightTour', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('does not render when isOpen is false', () => {
    render(
      <SpotlightTour
        isOpen={false}
        roleName="Client"
        userId="u-1"
        onClose={vi.fn()}
      />
    );
    expect(screen.queryByTestId('spotlight-tour')).toBeNull();
  });

  it('renders Client tour steps and advances with Next button', () => {
    const onClose = vi.fn();
    render(
      <SpotlightTour
        isOpen={true}
        roleName="Client"
        userId="u-1"
        onClose={onClose}
      />
    );

    expect(screen.getByTestId('spotlight-tour')).toBeInTheDocument();
    expect(screen.getByTestId('tour-step-counter')).toHaveTextContent('1');

    // Back button should not be present on first step
    expect(screen.queryByTestId('tour-back-btn')).toBeNull();

    // Click Next
    fireEvent.click(screen.getByTestId('tour-next-btn'));
    expect(screen.getByTestId('tour-step-counter')).toHaveTextContent('2');

    // Back button is now visible
    expect(screen.getByTestId('tour-back-btn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('tour-back-btn'));
    expect(screen.getByTestId('tour-step-counter')).toHaveTextContent('1');
  });

  it('marks tour seen and calls onClose when Skip is clicked', () => {
    const onClose = vi.fn();
    const markSpy = vi.spyOn(tourStorage, 'markUserTourSeen');

    render(
      <SpotlightTour
        isOpen={true}
        roleName="Trainer"
        userId="u-trainer"
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByTestId('tour-skip-btn'));
    expect(markSpy).toHaveBeenCalledWith('u-trainer');
    expect(onClose).toHaveBeenCalled();
  });

  it('marks tour seen and completes when finishing last step', () => {
    const onClose = vi.fn();
    const markSpy = vi.spyOn(tourStorage, 'markUserTourSeen');

    render(
      <SpotlightTour
        isOpen={true}
        roleName="Client"
        userId="u-client"
        onClose={onClose}
      />
    );

    // Client has 4 steps: advance 3 times to step 4
    fireEvent.click(screen.getByTestId('tour-next-btn')); // to step 2
    fireEvent.click(screen.getByTestId('tour-next-btn')); // to step 3
    fireEvent.click(screen.getByTestId('tour-next-btn')); // to step 4

    // On last step, button completes
    fireEvent.click(screen.getByTestId('tour-next-btn'));
    expect(markSpy).toHaveBeenCalledWith('u-client');
    expect(onClose).toHaveBeenCalled();
  });

  it('supports Gym role with 5 steps', () => {
    render(
      <SpotlightTour
        isOpen={true}
        roleName="Gym"
        userId="u-gym"
        onClose={vi.fn()}
      />
    );

    // Total should be 5
    expect(screen.getByTestId('tour-step-counter')).toHaveTextContent('5');
  });

  it('closes on Escape key press', () => {
    const onClose = vi.fn();
    render(
      <SpotlightTour
        isOpen={true}
        roleName="Admin"
        userId="u-admin"
        onClose={onClose}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
