import { Building2, Loader2, Lock } from 'lucide-react';
import { useState } from 'react';
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
  FieldLabel,
  FieldStack,
  FormGrid,
  HeaderRow,
  PlanBadge,
  PreviewStack,
  PrimaryButton,
  TextArea,
  TextInput,
} from '../branding/brandFormStyles';
import { ImageUploadField } from '../common/ImageUploadField';
import { SectionTitle } from './SettingsShell';
import { useFeatureUpsell } from '../../hooks/useFeatureUpsell';
import { useMyGym, useUpdateMyGym } from '../../hooks/useGyms';
import type { ApiErrorDetails } from '../../services/api/errors';
import type { GymProfile } from '../../types/gym';
import { DEFAULT_BRAND_COLOR, readableTextColor } from '../../utils/brand';

type FormState = {
  name: string;
  description: string;
  city: string;
  address: string;
  websiteUrl: string;
  phoneNumber: string;
  logoUrl: string | null;
  coverUrl: string | null;
  brandColor: string;
};

const toForm = (gym?: GymProfile): FormState => ({
  name: gym?.name ?? '',
  description: gym?.description ?? '',
  city: gym?.city ?? '',
  address: gym?.address ?? '',
  websiteUrl: gym?.websiteUrl ?? '',
  phoneNumber: gym?.phoneNumber ?? '',
  logoUrl: gym?.logoUrl ?? null,
  coverUrl: gym?.coverUrl ?? null,
  brandColor: gym?.brandColor ?? DEFAULT_BRAND_COLOR,
});

/** Gym profile editing (all tiers) plus the brand color (Gym Maximum). */
export function FacilityProfileCard() {
  const { t } = useTranslation();
  const { data } = useMyGym();
  const gym = data?.gym;
  const { mutate: updateGym, isPending } = useUpdateMyGym();
  const branding = useFeatureUpsell('branding');
  const saved = toForm(gym);
  const [form, setForm] = useState<FormState>(saved);
  // Reset the form when the saved profile changes (load, save) without an effect.
  const savedKey = JSON.stringify(saved);
  const [syncedKey, setSyncedKey] = useState(savedKey);
  if (savedKey !== syncedKey) {
    setSyncedKey(savedKey);
    setForm(saved);
  }

  const dirty = JSON.stringify(form) !== savedKey;
  const nameMissing = form.name.trim().length < 2;
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    if (nameMissing) return;
    const colorChanged = form.brandColor !== saved.brandColor;
    updateGym(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        websiteUrl: form.websiteUrl.trim() || null,
        phoneNumber: form.phoneNumber.trim(),
        logoUrl: form.logoUrl,
        coverUrl: form.coverUrl,
        ...(colorChanged
          ? { brandColor: form.brandColor === DEFAULT_BRAND_COLOR ? null : form.brandColor }
          : {}),
      },
      {
        onSuccess: () => toast.success(t('gym.profile.saved')),
        onError: (error) => {
          const details = (error as AxiosError<ApiErrorDetails>).response?.data;
          if (details?.code === 'PLAN_LIMIT') branding.showUpsell(details);
          else toast.error(t('gym.profile.saveFailed'));
        },
      },
    );
  };

  return (
    <CardWrapper data-testid="facility-profile-card">
      <HeaderRow>
        <SectionTitle>
          <Building2 size={18} color="#ffb3b1" /> {t('gym.profile.title')}
        </SectionTitle>
      </HeaderRow>
      <CardDescription>{t('gym.profile.desc')}</CardDescription>

      <FormGrid>
        <FieldStack>
          <FieldGroup>
            <FieldLabel>{t('gym.profile.name')}</FieldLabel>
            <TextInput value={form.name} maxLength={80} onChange={(e) => set('name', e.target.value)} aria-invalid={nameMissing} />
            {nameMissing && <FieldError>{t('gym.profile.nameRequired')}</FieldError>}
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>{t('gym.profile.description')}</FieldLabel>
            <TextArea value={form.description} onChange={(e) => set('description', e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>{t('gym.profile.city')}</FieldLabel>
            <TextInput value={form.city} onChange={(e) => set('city', e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>{t('gym.profile.address')}</FieldLabel>
            <TextInput value={form.address} onChange={(e) => set('address', e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>{t('gym.profile.website')}</FieldLabel>
            <TextInput type="url" placeholder="https://" value={form.websiteUrl} onChange={(e) => set('websiteUrl', e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>{t('gym.profile.phone')}</FieldLabel>
            <TextInput type="tel" value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} />
          </FieldGroup>
        </FieldStack>

        <FieldStack>
          <ImageUploadField label={t('gym.profile.logo')} purpose="gym-logo" value={form.logoUrl} onChange={(url) => set('logoUrl', url)} testId="gym-logo-upload" />
          <ImageUploadField label={t('gym.profile.cover')} purpose="gym-cover" shape="wide" value={form.coverUrl} onChange={(url) => set('coverUrl', url)} testId="gym-cover-upload" />

          <HeaderRow>
            <FieldLabel>{t('branding.brandColor')}</FieldLabel>
            <PlanBadge>{t('branding.gymOnly')}</PlanBadge>
          </HeaderRow>
          <CardDescription style={{ margin: 0 }}>{t('branding.gymSettingsDesc')}</CardDescription>
          <BrandColorPicker value={form.brandColor} onChange={(color) => set('brandColor', color)} disabled={!branding.allowed} />
          {!branding.allowed && (
            <div>
              <PrimaryButton type="button" onClick={() => branding.requireFeature()}>
                <Lock size={14} />
                {t('branding.unlockGym')}
              </PrimaryButton>
            </div>
          )}
          <PreviewStack aria-label={t('branding.preview')}>
            <FieldLabel>{t('branding.previewMembers')}</FieldLabel>
            <BrandBand
              brand={{
                kind: 'gym',
                name: form.name.trim() || '—',
                logoUrl: form.logoUrl,
                color: form.brandColor,
                textColor: readableTextColor(form.brandColor),
              }}
            />
          </PreviewStack>
        </FieldStack>
      </FormGrid>

      <Actions>
        <PrimaryButton type="button" onClick={save} disabled={isPending || !dirty || nameMissing} data-testid="save-facility-profile">
          {isPending && <Loader2 size={14} />}
          {t('gym.profile.save')}
        </PrimaryButton>
      </Actions>
      {branding.upsellModal}
    </CardWrapper>
  );
}
