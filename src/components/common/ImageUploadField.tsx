import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styled from 'styled-components';
import { uploadImageDirectly, type UploadImagePurpose } from '../../utils/imageUpload';

type ImageUploadFieldProps = {
  label: string;
  purpose: UploadImagePurpose;
  value: string | null;
  onChange: (url: string | null) => void;
  /** `square` for logos, `wide` for covers. */
  shape?: 'square' | 'wide';
  testId?: string;
};

/** Picks an image, uploads it to storage via a presigned URL, and returns its public URL. */
export function ImageUploadField({ label, purpose, value, onChange, shape = 'square', testId }: ImageUploadFieldProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImageDirectly(file, purpose));
    } catch (error) {
      toast.error((error as Error).message === 'FILE_TOO_LARGE' ? t('auth.fileTooLarge') : t('auth.uploadError'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Field>
      <Label>{label}</Label>
      <Row>
        <Preview $shape={shape}>
          {value ? <img src={value} alt="" /> : <ImagePlus size={20} aria-hidden />}
        </Preview>
        <Buttons>
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} data-testid={testId}>
            {uploading ? <Loader2 size={14} /> : <ImagePlus size={14} />}
            {uploading ? t('gym.profile.uploading') : value ? t('gym.profile.change') : t('gym.profile.upload')}
          </Button>
          {value && !uploading && (
            <Button type="button" onClick={() => onChange(null)} aria-label={`${t('gym.profile.remove')} ${label}`}>
              <Trash2 size={14} />
              {t('gym.profile.remove')}
            </Button>
          )}
        </Buttons>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          aria-label={label}
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
      </Row>
    </Field>
  );
}

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Label = styled.span`
  color: #9096b6;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
`;

const Preview = styled.div<{ $shape: 'square' | 'wide' }>`
  display: grid;
  place-items: center;
  width: ${({ $shape }) => ($shape === 'wide' ? '7.5rem' : '3.5rem')};
  height: 3.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #0f1329;
  border: 1px dashed rgba(126, 136, 175, 0.35);
  color: #7c84aa;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: #181a2e;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #c6cae6;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }
`;
