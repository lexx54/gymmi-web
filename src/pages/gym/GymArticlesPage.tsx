import {
  BookOpen,
  FileText,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styled from 'styled-components';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { useAuth } from '../../context/AuthContext';
import { useDeleteArticle, useMyArticles } from '../../hooks/useArticles';
import type { ArticleCategory, ArticleItem } from '../../types/articles';
import { ArticleCard } from '../../components/articles/ArticleCard';
import { ArticleReaderModal } from '../../components/articles/ArticleReaderModal';
import { ArticleEditorModal } from '../../components/articles/ArticleEditorModal';

const CATEGORIES: ArticleCategory[] = [
  'NUTRITION',
  'TECHNIQUE',
  'RECOVERY',
  'ANNOUNCEMENT',
  'MINDSET',
  'GENERAL',
];

export default function GymArticlesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState<ArticleCategory | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<ArticleItem | null>(null);

  const deleteMutation = useDeleteArticle();

  const { data: myData, isLoading } = useMyArticles({
    category: categoryFilter === 'ALL' ? undefined : categoryFilter,
    search: search.trim() || undefined,
  });

  const articles = myData?.items ?? [];
  const publishedCount = articles.filter((a) => a.status === 'PUBLISHED').length;
  const draftCount = articles.filter((a) => a.status === 'DRAFT').length;

  const handleDelete = async (article: ArticleItem) => {
    if (!window.confirm(t('articles.deleteConfirm'))) return;
    try {
      await deleteMutation.mutateAsync(article.id);
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <PageShell>
      <Sidebar username={user?.username ?? 'Gym'} />
      <Main>
        <HeaderRow>
          <div>
            <Title>{t('articles.gymTitle')}</Title>
            <Subtitle>{t('articles.gymDesc')}</Subtitle>
          </div>
          <TopBar />
        </HeaderRow>

        <StatsRow>
          <StatPillsGroup>
            <StatPill>
              <BookOpen size={16} color="#ef233c" />
              <span>
                <strong>{articles.length}</strong> {t('articles.sources.all')}
              </span>
            </StatPill>
            <StatPill>
              <Sparkles size={16} color="#10b981" />
              <span>
                <strong>{publishedCount}</strong> {t('articles.published')}
              </span>
            </StatPill>
            {draftCount > 0 && (
              <StatPill>
                <FileText size={16} color="#f59e0b" />
                <span>
                  <strong>{draftCount}</strong> {t('articles.draft')}
                </span>
              </StatPill>
            )}
          </StatPillsGroup>

          <PrimaryActionBtn
            type="button"
            onClick={() => {
              setArticleToEdit(null);
              setIsEditorOpen(true);
            }}
            data-testid="gym-new-article-btn"
          >
            <Plus size={16} />
            <span>{t('articles.newArticle')}</span>
          </PrimaryActionBtn>
        </StatsRow>

        <FilterSearchRow>
          <SearchWrapper>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder={t('articles.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="gym-search-articles-input"
            />
          </SearchWrapper>

          <CategoryPillScroll>
            <CategoryPillBtn
              type="button"
              $active={categoryFilter === 'ALL'}
              onClick={() => setCategoryFilter('ALL')}
            >
              {t('articles.categories.all')}
            </CategoryPillBtn>
            {CATEGORIES.map((cat) => (
              <CategoryPillBtn
                key={cat}
                type="button"
                $active={categoryFilter === cat}
                onClick={() => setCategoryFilter(cat)}
                data-testid={`gym-category-pill-${cat}`}
              >
                {t(`articles.categories.${cat}`)}
              </CategoryPillBtn>
            ))}
          </CategoryPillScroll>
        </FilterSearchRow>

        {isLoading && <LoadingText>{t('common.loading')}</LoadingText>}

        {!isLoading && articles.length === 0 && (
          <EmptyState data-testid="gym-empty-articles">
            <BookOpen size={40} color="#7c84aa" />
            <h3>{t('articles.empty.myArticles')}</h3>
            <PrimaryActionBtn
              type="button"
              onClick={() => {
                setArticleToEdit(null);
                setIsEditorOpen(true);
              }}
            >
              <Plus size={16} />
              <span>{t('articles.newArticle')}</span>
            </PrimaryActionBtn>
          </EmptyState>
        )}

        <Grid>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => setSelectedArticle(article)}
              canEdit={true}
              onEdit={() => {
                setArticleToEdit(article);
                setIsEditorOpen(true);
              }}
              onDelete={() => handleDelete(article)}
            />
          ))}
        </Grid>
      </Main>

      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <ArticleEditorModal
        isOpen={isEditorOpen}
        articleToEdit={articleToEdit}
        onClose={() => {
          setIsEditorOpen(false);
          setArticleToEdit(null);
        }}
      />
    </PageShell>
  );
}

const PageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0b0d1b;
  color: #f7f7ff;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0 0 0.4rem;
  font-size: 1.85rem;
  font-weight: 800;
  color: #f7f7ff;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #949ab8;
  font-size: 0.95rem;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatPillsGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const StatPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #141830;
  padding: 0.5rem 0.9rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(126, 136, 175, 0.15);
  font-size: 0.85rem;
  color: #cbd0e2;

  strong {
    color: #f7f7ff;
  }
`;

const PrimaryActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ef233c;
  color: #ffffff;
  border: none;
  border-radius: 0.65rem;
  padding: 0.55rem 1.15rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const FilterSearchRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7c84aa;
  display: flex;
`;

const SearchInput = styled.input`
  width: 100%;
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 0.75rem;
  padding: 0.65rem 1rem 0.65rem 2.6rem;
  color: #f7f7ff;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #ef233c;
  }

  &::placeholder {
    color: #7c84aa;
  }
`;

const CategoryPillScroll = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(126, 136, 175, 0.2);
    border-radius: 2px;
  }
`;

const CategoryPillBtn = styled.button<{ $active?: boolean }>`
  background: ${(p) => (p.$active ? '#ef233c' : '#141830')};
  color: ${(p) => (p.$active ? '#ffffff' : '#949ab8')};
  border: 1px solid
    ${(p) => (p.$active ? '#ef233c' : 'rgba(126, 136, 175, 0.2)')};
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    border-color: #ef233c;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1.5rem;
  background: #141830;
  border: 1px dashed rgba(126, 136, 175, 0.2);
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;

  h3 {
    margin: 0;
    max-width: 28rem;
    font-size: 1.05rem;
    color: #cbd0e2;
    font-weight: 500;
    line-height: 1.5;
  }
`;

const LoadingText = styled.p`
  color: #7c84aa;
  font-size: 0.9rem;
`;
