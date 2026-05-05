import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrainingMetricsCard } from './TrainingMetricsCard';

describe('TrainingMetricsCard', () => {
  it('renders section title', () => {
    render(<TrainingMetricsCard />);

    expect(screen.getByText('Training Metrics')).toBeInTheDocument();
  });

  it('renders METRIC and IMPERIAL toggle buttons', () => {
    render(<TrainingMetricsCard />);

    expect(screen.getByRole('button', { name: 'METRIC' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'IMPERIAL' })).toBeInTheDocument();
  });

  it('renders all three heart rate zones', () => {
    render(<TrainingMetricsCard />);

    expect(screen.getByText('ZONE 5')).toBeInTheDocument();
    expect(screen.getByText('ZONE 4')).toBeInTheDocument();
    expect(screen.getByText('ZONE 3')).toBeInTheDocument();
  });

  it('renders CALCULATE AUTO button', () => {
    render(<TrainingMetricsCard />);

    expect(screen.getByRole('button', { name: 'CALCULATE AUTO' })).toBeInTheDocument();
  });
});
