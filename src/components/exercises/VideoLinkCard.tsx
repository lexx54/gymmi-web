import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MAX_EXERCISE_VIDEO_URL, toSafeVideoUrl } from '../../utils/videoUrl';

type VideoLinkCardProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Optional external demo video link (e.g. YouTube) for the exercise builder.
 */
export function VideoLinkCard({ value, onChange }: VideoLinkCardProps) {
  const { t } = useTranslation();
  const invalid = value.trim() !== '' && !toSafeVideoUrl(value);

  return (
    <Card>
      <FieldLabel htmlFor="exercise-video-url">
        <Link2 size={13} aria-hidden />
        {t('exercises.videoUrl')}
      </FieldLabel>
      <Input
        id="exercise-video-url"
        type="url"
        inputMode="url"
        value={value}
        maxLength={MAX_EXERCISE_VIDEO_URL}
        placeholder={t('exercises.videoUrlPlaceholder')}
        aria-invalid={invalid}
        aria-describedby="exercise-video-url-hint"
        $invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
      />
      <Hint id="exercise-video-url-hint" $invalid={invalid}>
        {invalid ? t('exercises.videoUrlInvalid') : t('exercises.videoUrlHint')}
      </Hint>
    </Card>
  );
}

const Card = styled.section`
  background-color: #181a2e;
  border-radius: 0.85rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const FieldLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const Input = styled.input<{ $invalid: boolean }>`
  width: 100%;
  box-sizing: border-box;
  background-color: #1c1e32;
  border: none;
  border-radius: 0.75rem;
  color: #e0e0fc;
  padding: 1rem 1.2rem;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  box-shadow: ${({ $invalid }) => ($invalid ? '0 0 0 2px #ffb4ab' : 'none')};
  transition: box-shadow 150ms ease;

  &::placeholder {
    color: rgba(173, 136, 134, 0.6);
  }

  &:focus {
    box-shadow: 0 0 0 2px ${({ $invalid }) => ($invalid ? '#ffb4ab' : '#ffb3b1')};
  }
`;

const Hint = styled.p<{ $invalid: boolean }>`
  margin: 0;
  color: ${({ $invalid }) => ($invalid ? '#ffb4ab' : 'rgba(231, 189, 187, 0.7)')};
  font-size: 0.75rem;
`;
