import apiClient from './client';
import type {
  ArticleCommentItem,
  ArticleFeedResponse,
  ArticleItem,
  CreateArticlePayload,
  QueryArticlesParams,
  UpdateArticlePayload,
} from '../../types/articles';

export async function fetchArticlesFeed(
  params?: QueryArticlesParams,
): Promise<ArticleFeedResponse> {
  const { data } = await apiClient.get<ArticleFeedResponse>('/articles/feed', {
    params,
  });
  return data;
}

export async function fetchMyArticles(
  params?: QueryArticlesParams,
): Promise<ArticleFeedResponse> {
  const { data } = await apiClient.get<ArticleFeedResponse>('/articles/mine', {
    params,
  });
  return data;
}

export async function fetchArticleById(id: string): Promise<ArticleItem> {
  const { data } = await apiClient.get<ArticleItem>(`/articles/${id}`);
  return data;
}

export async function createArticle(
  payload: CreateArticlePayload,
): Promise<ArticleItem> {
  const { data } = await apiClient.post<ArticleItem>('/articles', payload);
  return data;
}

export async function updateArticle(
  id: string,
  payload: UpdateArticlePayload,
): Promise<ArticleItem> {
  const { data } = await apiClient.patch<ArticleItem>(`/articles/${id}`, payload);
  return data;
}

export async function deleteArticle(id: string): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(`/articles/${id}`);
  return data;
}

export async function toggleArticleLike(
  id: string,
): Promise<{ liked: boolean; likesCount: number }> {
  const { data } = await apiClient.post<{ liked: boolean; likesCount: number }>(
    `/articles/${id}/like`,
  );
  return data;
}

export async function toggleArticleBookmark(
  id: string,
): Promise<{ bookmarked: boolean }> {
  const { data } = await apiClient.post<{ bookmarked: boolean }>(
    `/articles/${id}/bookmark`,
  );
  return data;
}

export async function fetchArticleComments(
  articleId: string,
): Promise<ArticleCommentItem[]> {
  const { data } = await apiClient.get<ArticleCommentItem[]>(
    `/articles/${articleId}/comments`,
  );
  return data;
}

export async function createArticleComment(
  articleId: string,
  content: string,
): Promise<ArticleCommentItem> {
  const { data } = await apiClient.post<ArticleCommentItem>(
    `/articles/${articleId}/comments`,
    { content },
  );
  return data;
}

export async function deleteArticleComment(
  articleId: string,
  commentId: string,
): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(
    `/articles/${articleId}/comments/${commentId}`,
  );
  return data;
}
