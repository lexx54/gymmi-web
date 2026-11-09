import { Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BRAND_COLOR_PRESETS, isBrandColor, readableTextColor } from '../../utils/brand';

type BrandColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
};

/** Preset swatches plus a hex field for the brand accent color. */
export function BrandColorPicker({ value, onChange, disabled }: BrandColorPickerProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(value);
  // Follow outside changes (swatch click, reset) without an effect.
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }
  const invalid = draft !== '' && !isBrandColor(draft);

  return (
    <div>
      <Swatches role="radiogroup" aria-label={t('branding.brandColor')}>
        {BRAND_COLOR_PRESETS.map((color) => {
          const selected = value.toLowerCase() === color;
          return (
            <Swatch
              key={color}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={color}
              disabled={disabled}
              $color={color}
              onClick={() => onChange(color)}
            >
              {selected && <Check size={14} color={readableTextColor(color)} strokeWidth={3} />}
            </Swatch>
          );
        })}
      </Swatches>
      <HexRow>
        <HexPreview $color={isBrandColor(draft) ? draft : value} aria-hidden />
        <HexInput
          aria-label={t('branding.customColor')}
          value={draft}
          maxLength={7}
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(event) => {
            const next = event.target.value.startsWith('#') ? event.target.value : `#${event.target.value}`;
            setDraft(next);
            if (isBrandColor(next)) onChange(next.toLowerCase());
          }}
        />
      </HexRow>
      {invalid && <ErrorText>{t('branding.invalidColor')}</ErrorText>}
    </div>
  );
}

const Swatches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Swatch = styled.button<{ $color: string }>`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  background: ${({ $color }) => $color};
  cursor: pointer;

  &[aria-checked='true'] {
    border-color: #ffffff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

const HexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const HexPreview = styled.span<{ $color: string }>`
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.4rem;
  background: ${({ $color }) => $color};
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const HexInput = styled.input`
  width: 7rem;
  padding: 0.45rem 0.65rem;
  border-radius: 0.6rem;
  border: 1px solid rgba(231, 189, 187, 0.2);
  background: #101225;
  color: #e0e0fc;
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
  text-transform: uppercase;

  &[aria-invalid='true'] {
    border-color: #ff535a;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const ErrorText = styled.p`
  margin: 0.4rem 0 0;
  color: #ff8a8f;
  font-size: 0.75rem;
`;
