import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Brand } from '../../services/api/workouts';

type BrandBandProps = {
  brand: Brand;
  /** `band` spans its container; `chip` is a compact pill for cards. */
  variant?: 'band' | 'chip';
  className?: string;
};

/** Shows a coach's or gym's brand (logo, "Coached by …", accent color) to their clients. */
export function BrandBand({ brand, variant = 'band', className }: BrandBandProps) {
  const { t } = useTranslation();
  const label =
    brand.kind === 'gym'
      ? t('branding.atGym', { name: brand.name })
      : t('branding.coachedBy', { name: brand.name });
  const initial = brand.name.trim().charAt(0).toUpperCase();

  return (
    <Band
      className={className}
      $variant={variant}
      $color={brand.color}
      $text={brand.textColor}
      data-testid="brand-band"
    >
      {brand.logoUrl ? (
        <Logo src={brand.logoUrl} alt="" $variant={variant} />
      ) : (
        <Initial $variant={variant} aria-hidden>
          {initial}
        </Initial>
      )}
      <Label>{label}</Label>
    </Band>
  );
}

const Band = styled.div<{ $variant: 'band' | 'chip'; $color: string; $text: string }>`
  display: ${({ $variant }) => ($variant === 'chip' ? 'inline-flex' : 'flex')};
  align-items: center;
  gap: ${({ $variant }) => ($variant === 'chip' ? '0.4rem' : '0.7rem')};
  max-width: 100%;
  padding: ${({ $variant }) => ($variant === 'chip' ? '0.2rem 0.65rem 0.2rem 0.25rem' : '0.6rem 0.9rem')};
  border-radius: ${({ $variant }) => ($variant === 'chip' ? '999px' : '0.9rem')};
  background: ${({ $color }) => $color};
  color: ${({ $text }) => $text};
  font-size: ${({ $variant }) => ($variant === 'chip' ? '0.7rem' : '0.85rem')};
  font-weight: 800;
  line-height: 1.2;
`;

const logoSize = (variant: 'band' | 'chip') => (variant === 'chip' ? '1.3rem' : '2rem');

const Logo = styled.img<{ $variant: 'band' | 'chip' }>`
  flex-shrink: 0;
  width: ${({ $variant }) => logoSize($variant)};
  height: ${({ $variant }) => logoSize($variant)};
  border-radius: 999px;
  object-fit: cover;
  background: #ffffff;
`;

const Initial = styled.span<{ $variant: 'band' | 'chip' }>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: ${({ $variant }) => logoSize($variant)};
  height: ${({ $variant }) => logoSize($variant)};
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 0.8em;
`;

const Label = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
