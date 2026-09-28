import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styled from 'styled-components';
import type {
  ArticleCategory,
  ArticleItem,
  ArticleStatus,
} from '../../types/articles';
import { useCreateArticle, useUpdateArticle } from '../../hooks/useArticles';
import { uploadImageDirectly } from '../../utils/imageUpload';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleToEdit?: ArticleItem | null;
}

const CATEGORIES: ArticleCategory[] = [
  'NUTRITION',
  'TECHNIQUE',
  'RECOVERY',
  'ANNOUNCEMENT',
  'MINDSET',
  'GENERAL',
];

export function ArticleEditorModal({
  isOpen,
  onClose,
  articleToEdit,
}: ArticleEditorModalProps) {
  const { t } = useTranslation();
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('GENERAL');
  const [readTimeMinutes, setReadTimeMinutes] = useState<number>(3);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      const url = await uploadImageDirectly(file, 'article-cover');
      setCoverImageUrl(url);
      toast.success(t('articles.coverUploaded', 'Cover image uploaded'));
    } catch (err: any) {
      toast.error(
        err.message === 'FILE_TOO_LARGE'
          ? t('auth.fileTooLarge', 'File too large')
          : t('auth.uploadError', 'Upload failed'),
      );
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setContent(articleToEdit.content);
      setExcerpt(articleToEdit.excerpt ?? '');
      setCoverImageUrl(articleToEdit.coverImageUrl ?? '');
      setCategory(articleToEdit.category);
      setReadTimeMinutes(articleToEdit.readTimeMinutes);
    } else {
      setTitle('');
      setContent('');
      setExcerpt('');
      setCoverImageUrl('');
      setCategory('GENERAL');
      setReadTimeMinutes(3);
    }
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (targetStatus: ArticleStatus) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle.length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }

    if (trimmedContent.length < 10) {
      toast.error('Content must be at least 10 characters');
      return;
    }

    const payload = {
      title: trimmedTitle,
      content: trimmedContent,
      excerpt: excerpt.trim() || undefined,
      coverImageUrl: coverImageUrl.trim() || undefined,
      category,
      readTimeMinutes: Number(readTimeMinutes) || 3,
      status: targetStatus,
    };

    try {
      if (articleToEdit) {
        await updateMutation.mutateAsync({
          id: articleToEdit.id,
          payload,
        });
        toast.success(t('common.success'));
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t('common.success'));
      }
      onClose();
    } catch {
      toast.error(t('common.error'));
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Backdrop onClick={onClose} data-testid="article-editor-modal-backdrop">
      <ModalCard
        onClick={(e) => e.stopPropagation()}
        data-testid="article-editor-modal"
      >
        <Header>
          <ModalTitle>
            {articleToEdit
              ? t('articles.editArticle')
              : t('articles.newArticle')}
          </ModalTitle>
          <CloseBtn type="button" onClick={onClose} data-testid="close-editor">
            <X size={20} />
          </CloseBtn>
        </Header>

        <FormBody>
          <FormGroup>
            <Label>{t('articles.form.titleLabel')} *</Label>
            <Input
              type="text"
              placeholder={t('articles.form.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="article-title-input"
            />
          </FormGroup>

          <Row>
            <FormGroup style={{ flex: 1 }}>
              <Label>{t('articles.form.categoryLabel')}</Label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                data-testid="article-category-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`articles.categories.${cat}`)}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup style={{ width: '130px' }}>
              <Label>{t('articles.form.readTimeLabel')}</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={readTimeMinutes}
                onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                data-testid="article-read-time-input"
              />
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>{t('articles.form.coverUrlLabel')}</Label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Input
                type="url"
                placeholder={t('articles.form.coverUrlPlaceholder')}
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                data-testid="article-cover-input"
                style={{ flex: 1 }}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverUpload}
              />
              <SecondaryBtn
                type="button"
                disabled={isUploadingCover}
                onClick={() => fileInputRef.current?.click()}
                style={{ whiteSpace: 'nowrap' }}
              >
                {isUploadingCover
                  ? t('common.loading', 'Uploading...')
                  : t('common.upload', 'Upload')}
              </SecondaryBtn>
            </div>
          </FormGroup>

          <FormGroup>
            <Label>{t('articles.form.excerptLabel')}</Label>
            <Input
              type="text"
              placeholder={t('articles.form.excerptPlaceholder')}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              data-testid="article-excerpt-input"
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('articles.form.contentLabel')} *</Label>
            <Textarea
              rows={12}
              placeholder={t('articles.form.contentPlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              data-testid="article-content-input"
            />
          </FormGroup>
        </FormBody>

        <Footer>
          <SecondaryBtn
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit('DRAFT')}
            data-testid="save-draft-btn"
          >
            {t('articles.saveDraft')}
          </SecondaryBtn>

          <PrimaryBtn
            type="button"
            disabled={isPending}
            onClick={() => handleSubmit('PUBLISHED')}
            data-testid="publish-article-btn"
          >
            {t('articles.publish')}
          </PrimaryBtn>
        </Footer>
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
  max-width: 680px;
  max-height: 90vh;
  background: #0f1226;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 1.25rem;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(126, 136, 175, 0.15);
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #f7f7ff;
  font-weight: 700;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #7c84aa;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.35rem;
  transition: color 0.15s ease;

  &:hover {
    color: #ef233c;
  }
`;

const FormBody = styled.div`
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #949ab8;
`;

const Input = styled.input`
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 0.65rem;
  padding: 0.65rem 0.85rem;
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

const Select = styled.select`
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 0.65rem;
  padding: 0.65rem 0.85rem;
  color: #f7f7ff;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #ef233c;
  }
`;

const Textarea = styled.textarea`
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 0.65rem;
  padding: 0.75rem 0.85rem;
  color: #f7f7ff;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #ef233c;
  }

  &::placeholder {
    color: #7c84aa;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  border-top: 1px solid rgba(126, 136, 175, 0.15);
  background: #0b0d1b;
`;

const SecondaryBtn = styled.button`
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #f7f7ff;
  border-radius: 0.6rem;
  padding: 0.55rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: #ef233c;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryBtn = styled.button`
  background: #ef233c;
  border: none;
  color: #ffffff;
  border-radius: 0.6rem;
  padding: 0.55rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
