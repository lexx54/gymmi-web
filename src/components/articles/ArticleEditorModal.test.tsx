import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { ArticleEditorModal } from './ArticleEditorModal';
import * as articlesApi from '../../services/api/articles';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('ArticleEditorModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      createElement(ArticleEditorModal, {
        isOpen: false,
        onClose: vi.fn(),
      }),
      { wrapper: createWrapper() },
    );

    expect(screen.queryByTestId('article-editor-modal')).not.toBeInTheDocument();
  });

  it('renders modal with aligned category and estimated read time inputs', () => {
    render(
      createElement(ArticleEditorModal, {
        isOpen: true,
        onClose: vi.fn(),
      }),
      { wrapper: createWrapper() },
    );

    expect(screen.getByTestId('article-editor-modal')).toBeInTheDocument();

    const categorySelect = screen.getByTestId('article-category-select');
    const readTimeInput = screen.getByTestId('article-read-time-input');

    expect(categorySelect).toBeInTheDocument();
    expect(readTimeInput).toBeInTheDocument();

    // Default values
    expect(categorySelect).toHaveValue('GENERAL');
    expect(readTimeInput).toHaveValue(3);

    // Check that categories are present
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('updates category and read time values on user interaction', () => {
    render(
      createElement(ArticleEditorModal, {
        isOpen: true,
        onClose: vi.fn(),
      }),
      { wrapper: createWrapper() },
    );

    const categorySelect = screen.getByTestId('article-category-select');
    const readTimeInput = screen.getByTestId('article-read-time-input');

    fireEvent.change(categorySelect, { target: { value: 'NUTRITION' } });
    expect(categorySelect).toHaveValue('NUTRITION');

    fireEvent.change(readTimeInput, { target: { value: '7' } });
    expect(readTimeInput).toHaveValue(7);
  });

  it('submits article with updated category and read time', async () => {
    const createSpy = vi.spyOn(articlesApi, 'createArticle').mockResolvedValue({
      id: 'art-new',
      title: 'Healthy Meal Prep',
      content: 'Here is a detailed guide on meal prep for athletes...',
      excerpt: null,
      coverImageUrl: null,
      category: 'NUTRITION',
      readTimeMinutes: 5,
      status: 'PUBLISHED',
      publishedAt: '2026-03-01T00:00:00Z',
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-03-01T00:00:00Z',
      authorRole: 'TRAINER',
      authorId: 'trainer-1',
      author: { id: 'trainer-1', username: 'coach_mike', avatarUrl: null },
      gym: null,
      trainer: null,
      likesCount: 0,
      commentsCount: 0,
      isLikedByMe: false,
      isBookmarkedByMe: false,
    });

    const onClose = vi.fn();

    render(
      createElement(ArticleEditorModal, {
        isOpen: true,
        onClose,
      }),
      { wrapper: createWrapper() },
    );

    fireEvent.change(screen.getByTestId('article-title-input'), {
      target: { value: 'Healthy Meal Prep' },
    });
    fireEvent.change(screen.getByTestId('article-content-input'), {
      target: { value: 'Here is a detailed guide on meal prep for athletes...' },
    });
    fireEvent.change(screen.getByTestId('article-category-select'), {
      target: { value: 'NUTRITION' },
    });
    fireEvent.change(screen.getByTestId('article-read-time-input'), {
      target: { value: '5' },
    });

    fireEvent.click(screen.getByTestId('publish-article-btn'));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Healthy Meal Prep',
          category: 'NUTRITION',
          readTimeMinutes: 5,
          status: 'PUBLISHED',
        }),
      );
      expect(onClose).toHaveBeenCalled();
    });
  });
});
