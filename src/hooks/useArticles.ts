import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchArticlesFeed,
  fetchMyArticles,
  fetchArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleLike,
  toggleArticleBookmark,
  fetchArticleComments,
  createArticleComment,
  deleteArticleComment,
} from '../services/api/articles';
import type {
  CreateArticlePayload,
  QueryArticlesParams,
  UpdateArticlePayload,
} from '../types/articles';

export const articlesFeedQueryKey = (params?: QueryArticlesParams) =>
  ['articles', 'feed', params] as const;

export const myArticlesQueryKey = (params?: QueryArticlesParams) =>
  ['articles', 'mine', params] as const;

export const articleDetailQueryKey = (id: string) =>
  ['articles', 'detail', id] as const;

export const articleCommentsQueryKey = (id: string) =>
  ['articles', 'comments', id] as const;

export function useArticlesFeed(params?: QueryArticlesParams, enabled = true) {
  return useQuery({
    queryKey: articlesFeedQueryKey(params),
    queryFn: () => fetchArticlesFeed(params),
    enabled,
  });
}

export function useMyArticles(params?: QueryArticlesParams, enabled = true) {
  return useQuery({
    queryKey: myArticlesQueryKey(params),
    queryFn: () => fetchMyArticles(params),
    enabled,
  });
}

export function useArticleDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: articleDetailQueryKey(id),
    queryFn: () => fetchArticleById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateArticlePayload) => createArticle(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateArticlePayload;
    }) => updateArticle(id, payload),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
      void queryClient.invalidateQueries({
        queryKey: articleDetailQueryKey(vars.id),
      });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useToggleArticleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleArticleLike(id),
    onSuccess: (_, articleId) => {
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
      void queryClient.invalidateQueries({
        queryKey: articleDetailQueryKey(articleId),
      });
    },
  });
}

export function useToggleArticleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleArticleBookmark(id),
    onSuccess: (_, articleId) => {
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
      void queryClient.invalidateQueries({
        queryKey: articleDetailQueryKey(articleId),
      });
    },
  });
}

export function useArticleComments(articleId: string, enabled = true) {
  return useQuery({
    queryKey: articleCommentsQueryKey(articleId),
    queryFn: () => fetchArticleComments(articleId),
    enabled: Boolean(articleId) && enabled,
  });
}

export function useCreateArticleComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      content,
    }: {
      articleId: string;
      content: string;
    }) => createArticleComment(articleId, content),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({
        queryKey: articleCommentsQueryKey(vars.articleId),
      });
      void queryClient.invalidateQueries({
        queryKey: articleDetailQueryKey(vars.articleId),
      });
      void queryClient.invalidateQueries({ queryKey: ['articles', 'feed'] });
    },
  });
}

export function useDeleteArticleComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      commentId,
    }: {
      articleId: string;
      commentId: string;
    }) => deleteArticleComment(articleId, commentId),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({
        queryKey: articleCommentsQueryKey(vars.articleId),
      });
      void queryClient.invalidateQueries({
        queryKey: articleDetailQueryKey(vars.articleId),
      });
      void queryClient.invalidateQueries({ queryKey: ['articles', 'feed'] });
    },
  });
}
