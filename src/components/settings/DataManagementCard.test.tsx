import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataManagementCard } from './DataManagementCard';
import * as tourStorage from '../../services/storage/tourStorage';
import * as authContext from '../../context/AuthContext';

describe('DataManagementCard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com', username: 'TestUser' } as any,
      isAuthenticated: true,
      isLoading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it('renders section title with data management text', () => {
    render(
      <MemoryRouter>
        <DataManagementCard />
      </MemoryRouter>
    );

    expect(screen.getByText(/data management/i)).toBeInTheDocument();
  });

  it('renders sync badge text', () => {
    render(
      <MemoryRouter>
        <DataManagementCard />
      </MemoryRouter>
    );

    expect(screen.getByText('LAST SYNC: 2M AGO')).toBeInTheDocument();
  });

  it('resets tour and triggers restart when restart button is clicked', () => {
    const resetSpy = vi.spyOn(tourStorage, 'resetUserTour');
    render(
      <MemoryRouter>
        <DataManagementCard />
      </MemoryRouter>
    );

    const restartBtn = screen.getByTestId('restart-tour-btn');
    expect(restartBtn).toBeInTheDocument();
    fireEvent.click(restartBtn);
    expect(resetSpy).toHaveBeenCalledWith('test-user');
  });
});
