import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import ArticlesPage from './ArticlesPage';
import GymArticlesPage from './gym/GymArticlesPage';
import * as authContext from '../context/AuthContext';
import * as articlesApi from '../services/api/articles';
import type { ArticleItem } from '../types/articles';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(MemoryRouter, null, children),
    );
  };
}

describe('Articles Pages', () => {
  const mockArticles: ArticleItem[] = [
    {
      id: 'art-1',
      title: 'Optimal Bench Press Technique',
      content: 'Maintain a slight arch in your thoracic spine and keep scapulae retracted.',
      excerpt: 'Maintain a slight arch in your thoracic spine...',
      coverImageUrl: 'https://example.com/bench.jpg',
      category: 'TECHNIQUE',
      readTimeMinutes: 4,
      status: 'PUBLISHED',
      publishedAt: '2026-03-01T10:00:00Z',
      createdAt: '2026-03-01T09:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z',
      authorRole: 'TRAINER',
      authorId: 'trainer-1',
      author: { id: 'trainer-1', username: 'coach_mike', avatarUrl: null },
      gym: null,
      trainer: { id: 'trainer-1', username: 'coach_mike', avatarUrl: null },
      likesCount: 12,
      commentsCount: 3,
      isLikedByMe: false,
      isBookmarkedByMe: false,
    },
    {
      id: 'art-2',
      title: 'Gym Expansion Announcement',
      content: 'We are excited to announce new functional training rigs arriving next month.',
      excerpt: 'We are excited to announce new functional...',
      coverImageUrl: null,
      category: 'ANNOUNCEMENT',
      readTimeMinutes: 2,
      status: 'PUBLISHED',
      publishedAt: '2026-03-02T12:00:00Z',
      createdAt: '2026-03-02T11:00:00Z',
      updatedAt: '2026-03-02T12:00:00Z',
      authorRole: 'GYM',
      authorId: 'gym-user-1',
      author: { id: 'gym-user-1', username: 'iron_gym', avatarUrl: null },
      gym: { id: 'gym-1', name: 'Iron Gym', logoUrl: null },
      trainer: null,
      likesCount: 25,
      commentsCount: 5,
      isLikedByMe: true,
      isBookmarkedByMe: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: {
        id: 'client-1',
        email: 'client@example.com',
        username: 'athlete_john',
        role: { id: 'client-role', name: 'Client' },
      },
      isAuthenticated: true,
      isLoading: false,
    } as any);

    vi.spyOn(articlesApi, 'fetchArticlesFeed').mockResolvedValue({
      items: mockArticles,
      total: 2,
      limit: 20,
      offset: 0,
    });

    vi.spyOn(articlesApi, 'fetchMyArticles').mockResolvedValue({
      items: mockArticles,
      total: 2,
      limit: 20,
      offset: 0,
    });

    vi.spyOn(articlesApi, 'fetchArticleComments').mockResolvedValue([]);
  });

  describe('ArticlesPage', () => {
    it('renders articles feed for client with cards', async () => {
      render(createElement(ArticlesPage), { wrapper: createWrapper() });

      expect(await screen.findByText('Optimal Bench Press Technique')).toBeInTheDocument();
      expect(screen.getByText('Gym Expansion Announcement')).toBeInTheDocument();
    });

    it('opens reader modal when an article card is clicked', async () => {
      render(createElement(ArticlesPage), { wrapper: createWrapper() });

      const card = await screen.findByTestId('article-card-art-1');
      fireEvent.click(card);

      expect(await screen.findByTestId('article-reader-modal')).toBeInTheDocument();
      expect(
        screen.getByText('Maintain a slight arch in your thoracic spine and keep scapulae retracted.'),
      ).toBeInTheDocument();

      const closeBtn = screen.getByTestId('close-article-reader');
      fireEvent.click(closeBtn);

      await waitFor(() => {
        expect(screen.queryByTestId('article-reader-modal')).not.toBeInTheDocument();
      });
    });

    it('triggers like toggle mutation when like button is clicked', async () => {
      const toggleLikeSpy = vi
        .spyOn(articlesApi, 'toggleArticleLike')
        .mockResolvedValue({ liked: true, likesCount: 13 });

      render(createElement(ArticlesPage), { wrapper: createWrapper() });

      const likeBtn = await screen.findByTestId('like-btn-art-1');
      fireEvent.click(likeBtn);

      await waitFor(() => {
        expect(toggleLikeSpy).toHaveBeenCalledWith('art-1');
      });
    });
  });

  describe('GymArticlesPage', () => {
    beforeEach(() => {
      vi.spyOn(authContext, 'useAuth').mockReturnValue({
        user: {
          id: 'gym-user-1',
          email: 'gym@example.com',
          username: 'IronHQ',
          role: { id: 'gym-role', name: 'Gym' },
        },
        isAuthenticated: true,
        isLoading: false,
      } as any);
    });

    it('renders gym articles management dashboard and opens editor modal', async () => {
      render(createElement(GymArticlesPage), { wrapper: createWrapper() });

      expect(await screen.findByTestId('gym-new-article-btn')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('gym-new-article-btn'));
      expect(await screen.findByTestId('article-editor-modal')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('close-editor'));
      await waitFor(() => {
        expect(screen.queryByTestId('article-editor-modal')).not.toBeInTheDocument();
      });
    });
  });
});
