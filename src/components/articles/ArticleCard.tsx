import {
  Bookmark,
  Clock,
  Edit3,
  Heart,
  MessageSquare,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ArticleItem } from '../../types/articles';
import {
  useToggleArticleBookmark,
  useToggleArticleLike,
} from '../../hooks/useArticles';

interface ArticleCardProps {
  article: ArticleItem;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

export function ArticleCard({
  article,
  onClick,
  onEdit,
  onDelete,
  canEdit,
}: ArticleCardProps) {
  const { t } = useTranslation();
  const toggleLikeMutation = useToggleArticleLike();
  const toggleBookmarkMutation = useToggleArticleBookmark();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeMutation.mutate(article.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmarkMutation.mutate(article.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <CardContainer
      onClick={onClick}
      data-testid={`article-card-${article.id}`}
    >
      <CoverArea>
        {article.coverImageUrl ? (
          <CoverImg src={article.coverImageUrl} alt={article.title} />
        ) : (
          <FallbackBanner>
            <span>{article.category}</span>
          </FallbackBanner>
        )}
        <CategoryPill>{article.category}</CategoryPill>
        {article.status === 'DRAFT' && (
          <DraftPill>{t('articles.draft')}</DraftPill>
        )}
      </CoverArea>

      <CardBody>
        <TopMeta>
          <ReadTime>
            <Clock size={12} />
            <span>
              {t('articles.readTime', { minutes: article.readTimeMinutes })}
            </span>
          </ReadTime>
          {article.authorRole === 'GYM' ? (
            <AuthorBadge title={article.gym?.name ?? 'Gym'}>
              <ShieldCheck size={13} color="#ef233c" />
              <span>{article.gym?.name ?? t('articles.fromGym')}</span>
            </AuthorBadge>
          ) : (
            <AuthorBadge title={article.trainer?.username ?? 'Coach'}>
              <UserCheck size={13} color="#3a86ff" />
              <span>
                {article.trainer?.username ?? t('articles.fromTrainer')}
              </span>
            </AuthorBadge>
          )}
        </TopMeta>

        <Title>{article.title}</Title>
        {article.excerpt && <Excerpt>{article.excerpt}</Excerpt>}

        <FooterRow>
          <ActionGroup>
            <InteractiveBtn
              type="button"
              $active={article.isLikedByMe}
              onClick={handleLike}
              data-testid={`like-btn-${article.id}`}
            >
              <Heart
                size={15}
                fill={article.isLikedByMe ? '#ef233c' : 'transparent'}
                color={article.isLikedByMe ? '#ef233c' : 'currentColor'}
              />
              <span>{article.likesCount}</span>
            </InteractiveBtn>

            <InteractiveBtn
              type="button"
              $active={article.isBookmarkedByMe}
              onClick={handleBookmark}
              data-testid={`bookmark-btn-${article.id}`}
            >
              <Bookmark
                size={15}
                fill={article.isBookmarkedByMe ? '#ef233c' : 'transparent'}
                color={article.isBookmarkedByMe ? '#ef233c' : 'currentColor'}
              />
            </InteractiveBtn>

            <MetaPill>
              <MessageSquare size={13} />
              <span>{article.commentsCount}</span>
            </MetaPill>
          </ActionGroup>

          {canEdit && (
            <AuthorActions>
              {onEdit && (
                <IconBtn
                  type="button"
                  onClick={handleEdit}
                  title={t('articles.editArticle')}
                  data-testid={`edit-article-${article.id}`}
                >
                  <Edit3 size={14} />
                </IconBtn>
              )}
              {onDelete && (
                <IconBtn
                  type="button"
                  onClick={handleDelete}
                  title={t('articles.deleteArticle')}
                  data-testid={`delete-article-${article.id}`}
                >
                  <Trash2 size={14} />
                </IconBtn>
              )}
            </AuthorActions>
          )}
        </FooterRow>
      </CardBody>
    </CardContainer>
  );
}

const CardContainer = styled.article`
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.15);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(239, 35, 60, 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }
`;

const CoverArea = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  background: #0f1226;
  overflow: hidden;
`;

const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.03);
  }
`;

const FallbackBanner = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1b2044 0%, #0d1024 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 0.85rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.12);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
`;

const CategoryPill = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(15, 18, 38, 0.85);
  backdrop-filter: blur(4px);
  color: #ef233c;
  border: 1px solid rgba(239, 35, 60, 0.3);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const DraftPill = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(245, 158, 11, 0.9);
  color: #0b0d1b;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const CardBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TopMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.65rem;
`;

const ReadTime = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  color: #7c84aa;
`;

const AuthorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  color: #cbd0e2;
  font-weight: 600;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #f7f7ff;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Excerpt = styled.p`
  margin: 0 0 1rem;
  font-size: 0.82rem;
  color: #949ab8;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(126, 136, 175, 0.1);
  padding-top: 0.75rem;
  margin-top: auto;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const InteractiveBtn = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  color: ${(p) => (p.$active ? '#ef233c' : '#7c84aa')};
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem;
  transition: color 0.15s ease;

  &:hover {
    color: #ef233c;
  }
`;

const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #7c84aa;
`;

const AuthorActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const IconBtn = styled.button`
  background: transparent;
  border: none;
  color: #7c84aa;
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  border-radius: 0.35rem;
  transition: all 0.15s ease;

  &:hover {
    color: #ef233c;
    background: rgba(239, 35, 60, 0.1);
  }
`;
