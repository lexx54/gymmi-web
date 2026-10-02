import {
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
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
  const [coverDragOver, setCoverDragOver] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [category, setCategory] = useState<ArticleCategory>('GENERAL');
  const [readTimeMinutes, setReadTimeMinutes] = useState<number>(3);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadCoverFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(
        t('auth.invalidFileType', 'Please select a valid image file (JPG, PNG, WEBP)'),
      );
      return;
    }
    try {
      setIsUploadingCover(true);
      const url = await uploadImageDirectly(file, 'article-cover');
      setCoverImageUrl(url);
      toast.success(t('articles.coverUploaded', 'Cover image uploaded'));
    } catch (err: any) {
      toast.error(
        err.message === 'FILE_TOO_LARGE'
          ? t('auth.fileTooLarge', 'File too large (max 3MB)')
          : err.message === 'INVALID_FILE_TYPE'
            ? t('auth.invalidFileType', 'Please select a valid image file (JPG, PNG, WEBP)')
            : t('auth.uploadError', 'Upload failed'),
      );
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void uploadCoverFile(file);
    }
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setCoverDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void uploadCoverFile(file);
    }
  };

  const handleRemoveCover = () => {
    setCoverImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            <FormGroup>
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

            <FormGroup>
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
            <CoverHeaderRow>
              <Label>
                {t('articles.form.coverImageLabel', t('articles.form.coverUrlLabel', 'Cover Image (Optional)'))}
              </Label>
              <CoverActionsRow>
                {coverImageUrl && !isUploadingCover && (
                  <ChangeImageTextBtn
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="change-cover-image-btn"
                  >
                    <UploadCloud size={14} />
                    <span>{t('articles.form.changeImage', 'Change image')}</span>
                  </ChangeImageTextBtn>
                )}
                {!showUrlFallback && (
                  <UrlToggleBtn
                    type="button"
                    onClick={() => setShowUrlFallback(true)}
                    data-testid="toggle-url-input-btn"
                    title={t('articles.form.pasteUrlOption', 'Paste URL instead')}
                  >
                    <LinkIcon size={12} />
                    <span>{t('articles.form.pasteUrlOption', 'Paste URL')}</span>
                  </UrlToggleBtn>
                )}
              </CoverActionsRow>
            </CoverHeaderRow>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverUpload}
              data-testid="article-cover-file-input"
            />

            {/* Hidden input for test / programmatic access */}
            <input
              type="hidden"
              value={coverImageUrl}
              data-testid="article-cover-input"
            />

            {coverImageUrl ? (
              <CoverPreviewCard
                onDragOver={(e) => {
                  e.preventDefault();
                  setCoverDragOver(true);
                }}
                onDragLeave={() => setCoverDragOver(false)}
                onDrop={handleCoverDrop}
                $isDragOver={coverDragOver}
                data-testid="article-cover-preview"
              >
                <PreviewImg
                  src={coverImageUrl}
                  alt={t('articles.form.coverPreviewAlt', 'Cover Preview')}
                  data-testid="article-cover-img"
                />
                <PreviewOverlay>
                  <OverlayBtnGroup>
                    <ChangeOverlayBtn
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title={t('articles.form.changeImage', 'Change image')}
                    >
                      <UploadCloud size={15} />
                      <span>{t('articles.form.changeImage', 'Change image')}</span>
                    </ChangeOverlayBtn>
                    <RemoveOverlayBtn
                      type="button"
                      onClick={handleRemoveCover}
                      title={t('articles.form.removeImage', 'Remove image')}
                      data-testid="remove-cover-image-btn"
                    >
                      <Trash2 size={15} />
                      <span>{t('articles.form.removeImage', 'Remove')}</span>
                    </RemoveOverlayBtn>
                  </OverlayBtnGroup>
                </PreviewOverlay>

                {isUploadingCover && (
                  <LoadingCoverOverlay data-testid="cover-uploading">
                    <Loader2 size={32} className="animate-spin" />
                    <span>{t('common.loading', 'Uploading...')}</span>
                  </LoadingCoverOverlay>
                )}
              </CoverPreviewCard>
            ) : (
              <DropzoneContainer
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setCoverDragOver(true);
                }}
                onDragLeave={() => setCoverDragOver(false)}
                onDrop={handleCoverDrop}
                $isDragOver={coverDragOver}
                data-testid="article-cover-dropzone"
              >
                {isUploadingCover ? (
                  <DropzoneLoadingWrap data-testid="cover-uploading">
                    <Loader2 size={32} className="animate-spin" />
                    <DropzoneLoadingText>
                      {t('common.loading', 'Uploading...')}
                    </DropzoneLoadingText>
                  </DropzoneLoadingWrap>
                ) : (
                  <>
                    <DropzoneIconWrap>
                      <ImageIcon size={32} />
                    </DropzoneIconWrap>
                    <DropzoneTextWrap>
                      <DropzoneMainText>
                        {t('articles.form.dropzonePrompt', 'Drag and drop an image here, or ')}{' '}
                        <DropzoneHighlight>
                          {t('articles.form.browseFiles', 'browse')}
                        </DropzoneHighlight>
                      </DropzoneMainText>
                      <DropzoneSubText>
                        {t('articles.form.coverHelper', 'Supports JPG, PNG, WEBP up to 3MB')}
                      </DropzoneSubText>
                    </DropzoneTextWrap>
                  </>
                )}
              </DropzoneContainer>
            )}

            {showUrlFallback && (
              <UrlFallbackRow data-testid="url-fallback-row">
                <Input
                  type="url"
                  placeholder={t('articles.form.coverUrlPlaceholder', 'https://example.com/cover.jpg')}
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  style={{ height: '2.25rem', fontSize: '0.82rem' }}
                  data-testid="article-cover-url-fallback-input"
                />
                <UrlCloseBtn
                  type="button"
                  onClick={() => setShowUrlFallback(false)}
                  title="Hide URL input"
                  data-testid="close-url-fallback-btn"
                >
                  <X size={16} />
                </UrlCloseBtn>
              </UrlFallbackRow>
            )}
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

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
  justify-content: flex-end;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #949ab8;
  line-height: 1.35;
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  height: 2.65rem;
  box-sizing: border-box;
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
  width: 100%;
  min-width: 0;
  height: 2.65rem;
  box-sizing: border-box;
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

  option {
    background: #141830;
    color: #f7f7ff;
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

const CoverHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CoverActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ChangeImageTextBtn = styled.button`
  background: transparent;
  border: none;
  color: #7c84aa;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: #ef233c;
  }
`;

const UrlToggleBtn = styled.button`
  background: transparent;
  border: none;
  color: #7c84aa;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: #f7f7ff;
  }
`;

const DropzoneContainer = styled.button<{ $isDragOver?: boolean }>`
  width: 100%;
  min-height: 140px;
  background: ${({ $isDragOver }) =>
    $isDragOver ? 'rgba(239, 35, 60, 0.08)' : 'rgba(20, 24, 48, 0.6)'};
  border: 2px dashed
    ${({ $isDragOver }) =>
      $isDragOver ? '#ef233c' : 'rgba(126, 136, 175, 0.3)'};
  border-radius: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  cursor: pointer;
  padding: 1.25rem;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    border-color: #ef233c;
    background: rgba(239, 35, 60, 0.05);
  }
`;

const DropzoneIconWrap = styled.div`
  color: #7c84aa;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  ${DropzoneContainer}:hover & {
    color: #ef233c;
  }
`;

const DropzoneTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const DropzoneMainText = styled.span`
  font-size: 0.88rem;
  color: #c0c6de;
`;

const DropzoneHighlight = styled.span`
  color: #ef233c;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

const DropzoneSubText = styled.span`
  font-size: 0.75rem;
  color: #7c84aa;
`;

const CoverPreviewCard = styled.div<{ $isDragOver?: boolean }>`
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 0.85rem;
  overflow: hidden;
  border: 2px ${({ $isDragOver }) => ($isDragOver ? 'dashed #ef233c' : 'solid rgba(126, 136, 175, 0.25)')};
  background: #141830;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);

  &:hover > div {
    opacity: 1;
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 18, 38, 0.2) 0%, rgba(15, 18, 38, 0.85) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  @media (hover: none) {
    opacity: 1;
    background: linear-gradient(180deg, transparent 40%, rgba(15, 18, 38, 0.85) 100%);
  }
`;

const OverlayBtnGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const ChangeOverlayBtn = styled.button`
  background: rgba(20, 24, 48, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(126, 136, 175, 0.3);
  color: #f7f7ff;
  border-radius: 0.5rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s ease;

  &:hover {
    border-color: #ef233c;
    color: #ef233c;
  }
`;

const RemoveOverlayBtn = styled.button`
  background: rgba(239, 35, 60, 0.85);
  backdrop-filter: blur(4px);
  border: none;
  color: #ffffff;
  border-radius: 0.5rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.15s ease;

  &:hover {
    background: #d90429;
  }
`;

const LoadingCoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 18, 38, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ef233c;
  font-size: 0.85rem;
  font-weight: 600;

  .animate-spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const DropzoneLoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #ef233c;

  .animate-spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const DropzoneLoadingText = styled.span`
  font-size: 0.85rem;
  color: #c0c6de;
`;

const UrlFallbackRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
`;

const UrlCloseBtn = styled.button`
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
