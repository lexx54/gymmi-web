import { useEffect, useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styled, { keyframes } from 'styled-components';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_EXERCISE_IMAGES,
  uploadExerciseImage,
} from '../../utils/imageUpload';

type ExerciseImagesCardProps = {
  images: string[];
  onAddImages: (urls: string[]) => void;
  onRemoveImage: (url: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
};

/**
 * Upload area for up to three exercise photos. Each photo is optimized in the
 * browser (WebP/JPEG, max 1MB) before it is sent to storage.
 */
export function ExerciseImagesCard({
  images,
  onAddImages,
  onRemoveImage,
  onUploadingChange,
}: ExerciseImagesCardProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const remaining = MAX_EXERCISE_IMAGES - images.length - uploadingCount;

  useEffect(() => {
    onUploadingChange?.(uploadingCount > 0);
  }, [onUploadingChange, uploadingCount]);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    if (remaining <= 0) {
      toast.error(t('exercises.images.limitReached', { max: MAX_EXERCISE_IMAGES }));
      return;
    }
    if (files.length > remaining) {
      toast.error(t('exercises.images.limitReached', { max: MAX_EXERCISE_IMAGES }));
    }

    const batch = files.slice(0, remaining);
    setUploadingCount((count) => count + batch.length);
    const results = await Promise.allSettled(batch.map(uploadExerciseImage));
    setUploadingCount((count) => count - batch.length);

    const urls: string[] = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        urls.push(result.value);
        return;
      }
      const message = result.reason instanceof Error ? result.reason.message : '';
      if (message === 'INVALID_FILE_TYPE') toast.error(t('exercises.images.invalidType'));
      else if (message === 'FILE_TOO_LARGE') toast.error(t('exercises.images.tooLarge'));
      else toast.error(t('exercises.images.uploadFailed'));
    });
    if (urls.length > 0) onAddImages(urls);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    void uploadFiles(Array.from(event.dataTransfer.files));
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (remaining > 0) setIsDragOver(true);
  };

  const emptySlots = Math.max(0, MAX_EXERCISE_IMAGES - images.length - uploadingCount);

  return (
    <Card
      $isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      data-testid="exercise-images-card"
    >
      <HeaderRow>
        <FieldLabel>{t('exercises.images.title')}</FieldLabel>
        <Counter>
          {images.length}/{MAX_EXERCISE_IMAGES}
        </Counter>
      </HeaderRow>
      <Hint>{t('exercises.images.hint', { max: MAX_EXERCISE_IMAGES })}</Hint>

      <Grid>
        {images.map((url, index) => (
          <Thumb key={url}>
            <img
              src={url}
              alt={t('exercises.images.alt', { current: index + 1, total: images.length })}
            />
            <RemoveButton
              type="button"
              aria-label={t('exercises.images.remove', { current: index + 1 })}
              onClick={() => onRemoveImage(url)}
            >
              <X size={14} aria-hidden />
            </RemoveButton>
          </Thumb>
        ))}
        {Array.from({ length: uploadingCount }, (_, index) => (
          <Slot key={`uploading-${index}`} role="status" aria-label={t('exercises.images.optimizing')}>
            <Spinner size={22} aria-hidden />
          </Slot>
        ))}
        {Array.from({ length: emptySlots }, (_, index) =>
          index === 0 ? (
            <AddSlot
              key="add"
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label={t('exercises.images.add')}
            >
              <ImagePlus size={22} aria-hidden />
              <span>{t('exercises.images.addShort')}</span>
            </AddSlot>
          ) : (
            <Slot key={`empty-${index}`} aria-hidden />
          ),
        )}
      </Grid>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        multiple
        data-testid="exercise-images-input"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = '';
          void uploadFiles(files);
        }}
      />
    </Card>
  );
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Card = styled.section<{ $isDragOver: boolean }>`
  background-color: #181a2e;
  border-radius: 0.85rem;
  border: 2px dashed
    ${({ $isDragOver }) => ($isDragOver ? 'rgba(255, 179, 177, 0.7)' : 'rgba(93, 63, 62, 0.25)')};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 150ms ease;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FieldLabel = styled.span`
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const Counter = styled.span`
  color: #ffb3b1;
  font-size: 0.75rem;
  font-weight: 700;
`;

const Hint = styled.p`
  margin: 0;
  color: #e7bdbb;
  font-size: 0.8rem;
  line-height: 1.45;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
`;

const slotBase = `
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 0.65rem;
  overflow: hidden;
`;

const Thumb = styled.div`
  ${slotBase}
  background-color: #26283d;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Slot = styled.div`
  ${slotBase}
  display: grid;
  place-items: center;
  background-color: #1f2136;
  color: #ffb3b1;
`;

const AddSlot = styled.button`
  ${slotBase}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border: 1px dashed rgba(255, 179, 177, 0.4);
  background-color: #26283d;
  color: #ffb3b1;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;

  &:hover {
    border-color: rgba(255, 179, 177, 0.8);
    background-color: #2d2f46;
  }

  &:focus-visible {
    outline: 2px solid #ffb3b1;
    outline-offset: 2px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  width: 1.6rem;
  height: 1.6rem;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(16, 18, 37, 0.8);
  color: #ffdad6;
  cursor: pointer;

  &:hover {
    background: rgba(16, 18, 37, 0.95);
  }

  &:focus-visible {
    outline: 2px solid #ffb3b1;
    outline-offset: 2px;
  }
`;

const Spinner = styled(Loader2)`
  animation: ${spin} 900ms linear infinite;
`;

const HiddenInput = styled.input`
  display: none;
`;
