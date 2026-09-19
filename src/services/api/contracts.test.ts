import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './client';
import {
  acceptContract,
  cancelContract,
  createContract,
  endContract,
  fetchContractClients,
  fetchContractTrainers,
  fetchMyContracts,
  rejectContract,
} from './contracts';

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const get = apiClient.get as unknown as ReturnType<typeof vi.fn>;
const post = apiClient.post as unknown as ReturnType<typeof vi.fn>;

describe('contracts API', () => {
  beforeEach(() => {
    get.mockReset();
    post.mockReset();
    get.mockResolvedValue({ data: [] });
    post.mockResolvedValue({ data: { id: 'c1' } });
  });

  it('uses contract routes', async () => {
    await fetchContractTrainers();
    await fetchMyContracts();
    await fetchContractClients();
    await createContract({ trainerId: 't1', period: 'WEEK' });
    await acceptContract('c1');
    await rejectContract('c1');
    await cancelContract('c1');
    await endContract('c1');

    expect(get.mock.calls.map((call) => call[0])).toEqual([
      '/contracts/trainers',
      '/contracts/me',
      '/contracts/clients',
    ]);
    expect(post).toHaveBeenCalledWith('/contracts', {
      trainerId: 't1',
      period: 'WEEK',
    });
    expect(post).toHaveBeenCalledWith('/contracts/c1/accept');
    expect(post).toHaveBeenCalledWith('/contracts/c1/end');
  });
});
