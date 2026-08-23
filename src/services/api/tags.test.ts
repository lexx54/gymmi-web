import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTags, createTag } from './tags';
import apiClient from './client';

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockGet = apiClient.get as ReturnType<typeof vi.fn>;
const mockPost = apiClient.post as ReturnType<typeof vi.fn>;

const sampleTag = {
  id: 'tag-1',
  name: 'Strength',
  isGlobal: true,
  createdById: 'admin-1',
  createdAt: '2026-01-01T00:00:00.000Z',
};

beforeEach(() => {
  mockGet.mockReset();
  mockPost.mockReset();
});

describe('fetchTags', () => {
  it('should GET /tags and return tags', async () => {
    mockGet.mockResolvedValue({ data: [sampleTag] });

    const result = await fetchTags();

    expect(mockGet).toHaveBeenCalledWith('/tags');
    expect(result).toEqual([sampleTag]);
  });
});

describe('createTag', () => {
  it('should POST /tags and return the created tag', async () => {
    mockPost.mockResolvedValue({ data: sampleTag });

    const result = await createTag({ name: 'Strength' });

    expect(mockPost).toHaveBeenCalledWith('/tags', { name: 'Strength' });
    expect(result).toEqual(sampleTag);
  });
});
