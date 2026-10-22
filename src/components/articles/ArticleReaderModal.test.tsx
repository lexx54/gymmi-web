import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArticleReaderModal } from './ArticleReaderModal';
import * as moderationApi from '../../services/api/moderation';
import * as authContext from '../../context/AuthContext';
import type { ArticleItem } from '../../types/articles';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../services/api/articles', () => ({
  fetchArticleComments: vi.fn().mockResolvedValue([]),
  createArticleComment: vi.fn(),
  deleteArticleComment: vi.fn(),
  toggleArticleLike: vi.fn(),
  toggleArticleBookmark: vi.fn(),
}));

vi.mock('../../services/api/moderation', () => ({
  reportContent: vi.fn(),
  blockUser: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockFn = (fn: unknown) => fn as ReturnType<typeof vi.fn>;

const article: ArticleItem = {
  id: 'art-1',
  title: 'Squat depth',
  content: 'Go deep.',
  excerpt: null,
  coverImageUrl: null,
  category: 'TECHNIQUE',
  readTimeMinutes: 2,
  status: 'PUBLISHED',
  publishedAt: '2026-10-20T10:00:00.000Z',
  createdAt: '2026-10-20T10:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
  authorRole: 'TRAINER',
  authorId: 'coach-1',
  author: { id: 'coach-1', username: 'coach_john', avatarUrl: null },
  gym: null,
  trainer: { id: 'coach-1', username: 'coach_john', avatarUrl: null },
  likesCount: 0,
  commentsCount: 0,
  isLikedByMe: false,
  isBookmarkedByMe: false,
};

function renderModal(onClose = vi.fn()) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(ArticleReaderModal, { article, onClose }),
    ),
  );
  return onClose;
}

describe('ArticleReaderModal moderation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFn(authContext.useAuth).mockReturnValue({ user: { id: 'reader-1' } });
    mockFn(moderationApi.reportContent).mockResolvedValue({ id: 'r1', status: 'OPEN' });
    mockFn(moderationApi.blockUser).mockResolvedValue({ blocked: true });
  });

  it('reports the article', async () => {
    renderModal();
    fireEvent.click(screen.getByTestId('article-report-btn'));
    fireEvent.click(screen.getByTestId('report-reason-MISINFORMATION'));
    fireEvent.click(screen.getByTestId('report-submit-btn'));

    await waitFor(() => {
      expect(moderationApi.reportContent).toHaveBeenCalledWith('ARTICLE', 'art-1', {
        reason: 'MISINFORMATION',
      });
    });
  });

  it('blocks the author and closes the reader', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onClose = renderModal();
    fireEvent.click(screen.getByTestId('article-block-author-btn'));

    await waitFor(() => {
      expect(moderationApi.blockUser).toHaveBeenCalledWith('coach-1');
      expect(onClose).toHaveBeenCalled();
    });
    confirmSpy.mockRestore();
  });

  it('hides Report and Block on your own article', () => {
    mockFn(authContext.useAuth).mockReturnValue({ user: { id: 'coach-1' } });
    renderModal();
    expect(screen.queryByTestId('article-report-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('article-block-author-btn')).not.toBeInTheDocument();
  });
});
