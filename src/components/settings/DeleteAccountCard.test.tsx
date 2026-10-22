import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DeleteAccountCard } from './DeleteAccountCard';
import * as authContext from '../../context/AuthContext';
import * as userApi from '../../services/api/user';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

function renderCard() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <DeleteAccountCard />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('DeleteAccountCard', () => {
  const signOut = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.restoreAllMocks();
    navigateMock.mockReset();
    signOut.mockClear();
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: { id: 'u1', email: 'a@b.com', username: 'alex' } as any,
      isAuthenticated: true,
      isLoading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut,
    });
  });

  function openAndFill(password: string, confirm: string) {
    fireEvent.click(screen.getByTestId('delete-account-btn'));
    fireEvent.change(screen.getByTestId('delete-account-password'), {
      target: { value: password },
    });
    fireEvent.change(screen.getByTestId('delete-account-confirm'), {
      target: { value: confirm },
    });
  }

  it('keeps submit disabled until password and confirmation word are entered', () => {
    renderCard();
    openAndFill('secret12', 'delete');
    expect(screen.getByTestId('delete-account-submit')).toBeDisabled();
    fireEvent.change(screen.getByTestId('delete-account-confirm'), {
      target: { value: 'DELETE' },
    });
    expect(screen.getByTestId('delete-account-submit')).toBeEnabled();
  });

  it('deletes the account, signs out and redirects to login', async () => {
    const deleteSpy = vi.spyOn(userApi, 'deleteAccountApi').mockResolvedValue();
    renderCard();
    openAndFill('secret12', 'DELETE');
    fireEvent.click(screen.getByTestId('delete-account-submit'));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/login', { replace: true }));
    expect(deleteSpy).toHaveBeenCalledWith('secret12');
    expect(signOut).toHaveBeenCalled();
  });

  it('shows the server error and stays signed in when deletion fails', async () => {
    vi.spyOn(userApi, 'deleteAccountApi').mockRejectedValue({
      response: { data: { message: 'Incorrect password' } },
    });
    renderCard();
    openAndFill('wrong', 'DELETE');
    fireEvent.click(screen.getByTestId('delete-account-submit'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect password');
    expect(signOut).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
