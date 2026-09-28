import {
  Bookmark,
  Calendar,
  Clock,
  Heart,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ArticleItem } from '../../types/articles';
import {
  useToggleArticleBookmark,
  useToggleArticleLike,
} from '../../hooks/useArticles';
import { ArticleCommentThread } from './ArticleCommentThread';

interface ArticleReaderModalProps {
  article: ArticleItem | null;
  onClose: () => void;
}

export function ArticleReaderModal({
  article,
  onClose,
}: ArticleReaderModalProps) {
  const { t } = useTranslation();
  const toggleLikeMutation = useToggleArticleLike();
  const toggleBookmarkMutation = useToggleArticleBookmark();

  // Simple, safe Markdown to structured presentation
  const renderedContent = useMemo(() => {
    if (!article?.content) return null;
    const lines = article.content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx}>{trimmed.replace(/^###\s+/, '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx}>{trimmed.replace(/^##\s+/, '')}</h2>;
      }
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx}>{trimmed.replace(/^#\s+/, '')}</h1>;
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx}>{trimmed.replace(/^>\s+/, '')}</blockquote>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx}>
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (!trimmed) {
        return <br key={idx} />;
      }
      return <p key={idx}>{line}</p>;
    });
  }, [article?.content]);

  if (!article) return null;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeMutation.mutate(article.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmarkMutation.mutate(article.id);
  };

  return (
    <Backdrop onClick={onClose} data-testid="article-reader-modal-backdrop">
      <ModalCard
        onClick={(e) => e.stopPropagation()}
        data-testid="article-reader-modal"
      >
        <CloseBtn
          type="button"
          onClick={onClose}
          data-testid="close-article-reader"
        >
          <X size={20} />
        </CloseBtn>

        {article.coverImageUrl && (
          <CoverImageWrapper>
            <img src={article.coverImageUrl} alt={article.title} />
          </CoverImageWrapper>
        )}

        <ModalBody>
          <MetaBar>
            <CategoryBadge>{article.category}</CategoryBadge>
            <ReadTime>
              <Clock size={13} />
              <span>
                {t('articles.readTime', { minutes: article.readTimeMinutes })}
              </span>
            </ReadTime>
            {article.publishedAt && (
              <DatePill>
                <Calendar size={13} />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </DatePill>
            )}
          </MetaBar>

          <ArticleTitle>{article.title}</ArticleTitle>

          <AuthorBar>
            {article.authorRole === 'GYM' ? (
              <AuthorPill>
                <ShieldCheck size={16} color="#ef233c" />
                <span>
                  {t('articles.fromGym')}:{' '}
                  <strong>{article.gym?.name || article.author?.username}</strong>
                </span>
              </AuthorPill>
            ) : (
              <AuthorPill>
                <UserCheck size={16} color="#3a86ff" />
                <span>
                  {t('articles.fromTrainer')}:{' '}
                  <strong>
                    {article.trainer?.username || article.author?.username}
                  </strong>
                </span>
              </AuthorPill>
            )}
          </AuthorBar>

          <ContentArea>{renderedContent}</ContentArea>

          <ActionBar>
            <ActionBtn
              type="button"
              $active={article.isLikedByMe}
              onClick={handleLike}
              data-testid="article-like-btn"
            >
              <Heart
                size={18}
                fill={article.isLikedByMe ? '#ef233c' : 'transparent'}
                color={article.isLikedByMe ? '#ef233c' : 'currentColor'}
              />
              <span>{article.likesCount}</span>
            </ActionBtn>

            <ActionBtn
              type="button"
              $active={article.isBookmarkedByMe}
              onClick={handleBookmark}
              data-testid="article-bookmark-btn"
            >
              <Bookmark
                size={18}
                fill={article.isBookmarkedByMe ? '#ef233c' : 'transparent'}
                color={article.isBookmarkedByMe ? '#ef233c' : 'currentColor'}
              />
            </ActionBtn>
          </ActionBar>

          <ArticleCommentThread articleId={article.id} />
        </ModalBody>
      </ModalCard>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 12, 24, 0.78);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
  overflow-y: auto;
`;

const ModalCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  background: #0f1226;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 1.25rem;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(20, 24, 48, 0.85);
  border: 1px solid rgba(126, 136, 175, 0.2);
  color: #f7f7ff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.15s ease;

  &:hover {
    background: #ef233c;
    border-color: #ef233c;
  }
`;

const CoverImageWrapper = styled.div`
  width: 100%;
  height: 240px;
  background: #141830;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const MetaBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
`;

const CategoryBadge = styled.span`
  background: rgba(239, 35, 60, 0.15);
  color: #ef233c;
  border: 1px solid rgba(239, 35, 60, 0.3);
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ReadTime = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #7c84aa;
  font-size: 0.78rem;
`;

const DatePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #7c84aa;
  font-size: 0.78rem;
`;

const ArticleTitle = styled.h1`
  margin: 0 0 1rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #f7f7ff;
  line-height: 1.25;
`;

const AuthorBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(126, 136, 175, 0.15);
`;

const AuthorPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: #cbd0e2;

  strong {
    color: #f7f7ff;
  }
`;

const ContentArea = styled.div`
  color: #cbd0e2;
  font-size: 0.95rem;
  line-height: 1.7;

  p {
    margin: 0 0 1rem;
  }

  h1,
  h2,
  h3 {
    color: #f7f7ff;
    margin: 1.5rem 0 0.75rem;
  }

  blockquote {
    border-left: 3px solid #ef233c;
    background: rgba(239, 35, 60, 0.06);
    margin: 1rem 0;
    padding: 0.65rem 1rem;
    font-style: italic;
    color: #f7f7ff;
    border-radius: 0 0.5rem 0.5rem 0;
  }

  li {
    margin-left: 1.25rem;
    margin-bottom: 0.35rem;
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(126, 136, 175, 0.15);
`;

const ActionBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: ${(p) => (p.$active ? 'rgba(239, 35, 60, 0.15)' : '#141830')};
  border: 1px solid
    ${(p) => (p.$active ? '#ef233c' : 'rgba(126, 136, 175, 0.2)')};
  color: ${(p) => (p.$active ? '#ef233c' : '#cbd0e2')};
  padding: 0.45rem 0.9rem;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #ef233c;
    color: #ef233c;
  }
`;
