import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccountSettingsCard } from './AccountSettingsCard';

describe('AccountSettingsCard', () => {
  it('renders email address', () => {
    render(<AccountSettingsCard />);

    expect(screen.getByText('alex.volt@kinetic.performance')).toBeInTheDocument();
  });

  it('renders password toggle button with aria-label', () => {
    render(<AccountSettingsCard />);

    expect(screen.getByRole('button', { name: 'Toggle password visibility' })).toBeInTheDocument();
  });

  it('renders 2FA toggle as enabled', () => {
    render(<AccountSettingsCard />);

    expect(screen.getByText('ENABLED')).toBeInTheDocument();
  });

  it('renders location sync as disabled', () => {
    render(<AccountSettingsCard />);

    expect(screen.getByText('DISABLED')).toBeInTheDocument();
  });
});
