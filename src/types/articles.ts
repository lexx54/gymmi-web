export type ArticleCategory =
  | 'NUTRITION'
  | 'TECHNIQUE'
  | 'RECOVERY'
  | 'ANNOUNCEMENT'
  | 'MINDSET'
  | 'GENERAL';

export type ArticleStatus = 'DRAFT' | 'PUBLISHED';

export type ArticleAuthorRole = 'GYM' | 'TRAINER';

export type ArticleFeedSource = 'ALL' | 'TRAINER' | 'GYM' | 'SAVED';

export interface ArticleAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface ArticleGym {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface ArticleItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: ArticleCategory;
  readTimeMinutes: number;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorRole: ArticleAuthorRole;
  authorId: string;
  author: ArticleAuthor | null;
  gym: ArticleGym | null;
  trainer: ArticleAuthor | null;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isBookmarkedByMe: boolean;
}

export interface ArticleCommentItem {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
    displayName: string;
  };
  canDelete: boolean;
}

export interface CreateArticlePayload {
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  category: ArticleCategory;
  readTimeMinutes?: number;
  status?: ArticleStatus;
}

export interface UpdateArticlePayload extends Partial<CreateArticlePayload> {}

export interface QueryArticlesParams {
  source?: ArticleFeedSource;
  category?: ArticleCategory;
  search?: string;
  status?: ArticleStatus;
  limit?: number;
  offset?: number;
}

export interface ArticleFeedResponse {
  items: ArticleItem[];
  total: number;
  limit: number;
  offset: number;
}
