import { Loader2, Lock, Palette } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { BrandBand } from '../branding/BrandBand';
import { BrandColorPicker } from '../branding/BrandColorPicker';
import {
  Actions,
  CardDescription,
  CardWrapper,
  FieldError,
  FieldGroup,
  FieldHint,
  FieldLabel,
  FieldStack,
  FormGrid,
  HeaderRow,
  PdfBrandName,
  PdfBrandRow,
  PdfDayBar,
  PdfFooter,
  PdfLogo,
  PdfPreview,
  PdfTitle,
  PlanBadge,
  PreviewStack,
  PrimaryButton,
  SecondaryButton,
  TextInput,
} from '../branding/brandFormStyles';
import { SectionTitle } from './SettingsShell';
import { useFeatureUpsell } from '../../hooks/useFeatureUpsell';
import { useUpdateUserProfile } from '../../hooks/useUserProfile';
import type { ApiErrorDetails } from '../../services/api/errors';
import type { FullUserProfile } from '../../types/auth';
import { DEFAULT_BRAND_COLOR, isBrandColor, readableTextColor } from '../../utils/brand';

type BrandSettingsCardProps = {
  userProfile?: FullUserProfile | null;
};

/** Coach Pro: the brand name and color clients see on routines and PDFs (logo comes from the coaching profile). */
export function BrandSettingsCard({ userProfile }: BrandSettingsCardProps) {
  const { t } = useTranslation();
  const { allowed, requireFeature, showUpsell, upsellModal } = useFeatureUpsell('branding');
  const { mutate: updateProfile, isPending } = useUpdateUserProfile();
  const trainerProfile = userProfile?.trainerProfile;
  const savedName = trainerProfile?.brandName ?? '';
  const savedColor = trainerProfile?.brandColor ?? DEFAULT_BRAND_COLOR;
  const [name, setName] = useState(savedName);
  const [color, setColor] = useState(savedColor);
  // Reset the form when the saved brand changes (load, save) without an effect.
  const savedKey = `${savedName}|${savedColor}`;
  const [syncedKey, setSyncedKey] = useState(savedKey);
  if (savedKey !== syncedKey) {
    setSyncedKey(savedKey);
    setName(savedName);
    setColor(savedColor);
  }

  const trimmed = name.trim();
  const nameInvalid = trimmed.length > 0 && (trimmed.length < 2 || trimmed.length > 60);
  const dirty = trimmed !== savedName || color !== savedColor;
  const displayName = trimmed || userProfile?.username || '';
  const preview = useMemo(
    () => ({
      kind: 'trainer' as const,
      name: displayName,
      logoUrl: trainerProfile?.logoUrl ?? null,
      color,
      textColor: readableTextColor(color),
    }),
    [color, displayName, trainerProfile?.logoUrl],
  );

  const save = () => {
    if (!requireFeature() || nameInvalid || !isBrandColor(color)) return;
    updateProfile(
      {
        trainerProfile: {
          brandName: trimmed || null,
          brandColor: color === DEFAULT_BRAND_COLOR ? null : color,
        },
      },
      {
        onSuccess: () => toast.success(t('branding.saved')),
        onError: (error) => {
          const details = (error as AxiosError<ApiErrorDetails>).response?.data;
          if (details?.code === 'PLAN_LIMIT') showUpsell(details);
          else toast.error(t('branding.saveFailed'));
        },
      },
    );
  };

  return (
    <CardWrapper data-testid="brand-settings-card">
      <HeaderRow>
        <SectionTitle>
          <Palette size={18} color="#ffb3b1" /> {t('branding.settingsTitle')}
        </SectionTitle>
        <PlanBadge>{t('branding.proOnly')}</PlanBadge>
      </HeaderRow>
      <CardDescription>{t('branding.settingsDesc')}</CardDescription>

      <FormGrid>
        <FieldStack>
          <FieldGroup>
            <FieldLabel>{t('branding.brandName')}</FieldLabel>
            <TextInput
              value={name}
              maxLength={60}
              placeholder={t('branding.brandNamePlaceholder')}
              disabled={!allowed}
              aria-invalid={nameInvalid}
              onChange={(event) => setName(event.target.value)}
            />
            {nameInvalid ? (
              <FieldError>{t('branding.invalidName')}</FieldError>
            ) : (
              <FieldHint>{t('branding.brandNameHint')}</FieldHint>
            )}
          </FieldGroup>
          <div>
            <FieldLabel as="p" style={{ margin: '0 0 0.6rem' }}>
              {t('branding.brandColor')}
            </FieldLabel>
            <BrandColorPicker value={color} onChange={setColor} disabled={!allowed} />
          </div>
          <FieldHint>{t('branding.logoHint')}</FieldHint>
        </FieldStack>

        <PreviewStack aria-label={t('branding.preview')}>
          <FieldLabel>{t('branding.previewClient')}</FieldLabel>
          <BrandBand brand={preview} />
          <FieldLabel>{t('branding.previewPdf')}</FieldLabel>
          <PdfPreview>
            <PdfBrandRow>
              {preview.logoUrl && <PdfLogo src={preview.logoUrl} alt="" />}
              <PdfBrandName $color={preview.textColor === '#ffffff' ? color : '#1b1c2b'}>{displayName}</PdfBrandName>
            </PdfBrandRow>
            <PdfTitle>Upper / Lower Strength</PdfTitle>
            <PdfDayBar $color={color}>{t('workouts.weekdays.1')}</PdfDayBar>
            <PdfFooter>{t('branding.madeWithGymmi')}</PdfFooter>
          </PdfPreview>
        </PreviewStack>
      </FormGrid>

      <Actions>
        {allowed ? (
          <>
            <SecondaryButton
              type="button"
              disabled={isPending || (!savedName && savedColor === DEFAULT_BRAND_COLOR && !dirty)}
              onClick={() => {
                setName('');
                setColor(DEFAULT_BRAND_COLOR);
              }}
            >
              {t('branding.clear')}
            </SecondaryButton>
            <PrimaryButton type="button" onClick={save} disabled={isPending || !dirty || nameInvalid}>
              {isPending && <Loader2 size={14} />}
              {t('branding.save')}
            </PrimaryButton>
          </>
        ) : (
          <PrimaryButton type="button" onClick={() => requireFeature()}>
            <Lock size={14} />
            {t('branding.unlockPro')}
          </PrimaryButton>
        )}
      </Actions>
      {upsellModal}
    </CardWrapper>
  );
}
