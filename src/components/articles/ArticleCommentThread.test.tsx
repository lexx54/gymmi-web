import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArticleCommentThread } from './ArticleCommentThread';
import * as articlesApi from '../../services/api/articles';
import * as moderationApi from '../../services/api/moderation';
import * as authContext from '../../context/AuthContext';
import { toast } from 'sonner';
import type { ArticleCommentItem } from '../../types/articles';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../services/api/articles', () => ({
  fetchArticleComments: vi.fn(),
  createArticleComment: vi.fn(),
  deleteArticleComment: vi.fn(),
}));

vi.mock('../../services/api/moderation', () => ({
  reportContent: vi.fn(),
  blockUser: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockFn = (fn: unknown) => fn as ReturnType<typeof vi.fn>;

const comment = (id: string, userId: string, username: string): ArticleCommentItem => ({
  id,
  content: `comment by ${username}`,
  createdAt: '2026-10-20T10:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
  user: { id: userId, username, avatarUrl: null, displayName: username },
  canDelete: userId === 'me',
});

function renderThread() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(ArticleCommentThread, { articleId: 'art-1' }),
    ),
  );
}

describe('ArticleCommentThread moderation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFn(authContext.useAuth).mockReturnValue({ user: { id: 'me', username: 'me' } });
    mockFn(articlesApi.fetchArticleComments).mockResolvedValue([
      comment('c-mine', 'me', 'me'),
      comment('c-other', 'user-2', 'troll'),
    ]);
    mockFn(moderationApi.reportContent).mockResolvedValue({ id: 'r1', status: 'OPEN' });
    mockFn(moderationApi.blockUser).mockResolvedValue({ blocked: true });
  });

  it('offers Report and Block only on other users\' comments', async () => {
    renderThread();
    await screen.findByText('comment by troll');

    expect(screen.getByTestId('report-comment-c-other')).toBeInTheDocument();
    expect(screen.getByTestId('block-comment-author-c-other')).toBeInTheDocument();
    expect(screen.queryByTestId('report-comment-c-mine')).not.toBeInTheDocument();
    expect(screen.queryByTestId('block-comment-author-c-mine')).not.toBeInTheDocument();
  });

  it('reports a comment with a reason and details', async () => {
    renderThread();
    fireEvent.click(await screen.findByTestId('report-comment-c-other'));

    const submit = screen.getByTestId('report-submit-btn');
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getByTestId('report-reason-HARASSMENT'));
    fireEvent.change(screen.getByTestId('report-details-input'), {
      target: { value: 'Insults' },
    });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(moderationApi.reportContent).toHaveBeenCalledWith('COMMENT', 'c-other', {
        reason: 'HARASSMENT',
        details: 'Insults',
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Thanks. Our team will review this within 24 hours.',
      );
    });
    expect(screen.queryByTestId('report-dialog')).not.toBeInTheDocument();
  });

  it('blocks the comment author after confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderThread();
    fireEvent.click(await screen.findByTestId('block-comment-author-c-other'));

    await waitFor(() => {
      expect(moderationApi.blockUser).toHaveBeenCalledWith('user-2');
      expect(toast.success).toHaveBeenCalledWith('troll has been blocked');
    });
    confirmSpy.mockRestore();
  });

  it('does not block when the confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderThread();
    fireEvent.click(await screen.findByTestId('block-comment-author-c-other'));

    expect(moderationApi.blockUser).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
