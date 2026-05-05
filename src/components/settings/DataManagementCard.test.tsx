import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataManagementCard } from './DataManagementCard';

describe('DataManagementCard', () => {
  it('renders section title with data management text', () => {
    render(<DataManagementCard />);

    expect(screen.getByText(/data management/i)).toBeInTheDocument();
  });

  it('renders sync badge text', () => {
    render(<DataManagementCard />);

    expect(screen.getByText('LAST SYNC: 2M AGO')).toBeInTheDocument();
  });
});
