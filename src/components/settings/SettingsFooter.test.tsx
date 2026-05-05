import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsFooter } from './SettingsFooter';

describe('SettingsFooter', () => {
  it('renders system state message', () => {
    render(<SettingsFooter />);

    expect(
      screen.getByText('System state: All local changes encrypted.'),
    ).toBeInTheDocument();
  });

  it('renders discard button', () => {
    render(<SettingsFooter />);

    expect(
      screen.getByRole('button', { name: /discard changes/i }),
    ).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<SettingsFooter />);

    expect(
      screen.getByRole('button', { name: /save configuration/i }),
    ).toBeInTheDocument();
  });
});
