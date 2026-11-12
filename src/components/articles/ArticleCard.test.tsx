import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArticleCard } from './ArticleCard';
import * as articlesApi from '../../services/api/articles';
import type { ArticleItem } from '../../types/articles';

vi.mock('../../services/api/articles', () => ({
  toggleArticleLike: vi.fn().mockResolvedValue({ liked: true }),
  toggleArticleBookmark: vi.fn().mockResolvedValue({ bookmarked: false }),
}));

const article: ArticleItem = {
  id: 'art-1',
  title: 'Squat depth',
  content: 'Go deep.',
  excerpt: 'Members-only excerpt',
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
  isBookmarkedByMe: true,
};

function renderCard(item: ArticleItem, onClick = vi.fn()) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  render(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(ArticleCard, { article: item, onClick }),
    ),
  );
  return onClick;
}

describe('ArticleCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens an accessible article', () => {
    const onClick = renderCard(article);
    fireEvent.click(screen.getByTestId('article-card-art-1'));
    expect(onClick).toHaveBeenCalled();
    expect(screen.queryByTestId('article-locked-art-1')).toBeNull();
  });

  describe('locked saved article (NV-06)', () => {
    const locked: ArticleItem = {
      ...article,
      locked: true,
      content: '',
      excerpt: null,
    };

    it('renders disabled and does not open', () => {
      const onClick = renderCard(locked);
      const card = screen.getByTestId('article-card-art-1');

      expect(card).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByTestId('article-locked-art-1')).toBeInTheDocument();
      fireEvent.click(card);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('disables like but still lets the user remove the bookmark', async () => {
      renderCard(locked);

      expect(screen.getByTestId('like-btn-art-1')).toBeDisabled();
      fireEvent.click(screen.getByTestId('bookmark-btn-art-1'));
      await waitFor(() =>
        expect(articlesApi.toggleArticleBookmark).toHaveBeenCalledWith('art-1'),
      );
      expect(articlesApi.toggleArticleLike).not.toHaveBeenCalled();
    });
  });
});
