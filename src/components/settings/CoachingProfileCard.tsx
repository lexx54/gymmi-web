import { useState, useEffect, useRef } from 'react';
import { Dumbbell, Pencil, Check, X, Loader2, Plus, Building, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { toast } from 'sonner';
import { CardSurface, SectionTitle } from './SettingsShell';
import { useUpdateUserProfile } from '../../hooks/useUserProfile';
import { uploadImageDirectly } from '../../utils/imageUpload';
import type { FullUserProfile } from '../../types/auth';

interface CoachingProfileCardProps {
  userProfile?: FullUserProfile | null;
  isLoading?: boolean;
}

const PRESET_SPECIALIZATIONS = [
  'Hypertrophy',
  'Weight Loss',
  'Powerlifting',
  'HIIT & Cardio',
  'Calisthenics',
  'Rehab & Mobility',
  'CrossFit',
  'Nutrition Coaching',
];

export function CoachingProfileCard({ userProfile, isLoading }: CoachingProfileCardProps) {
  const { t } = useTranslation();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateUserProfile();

  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState<number | ''>('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [gyms, setGyms] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);

  // Inputs for adding tags / gyms
  const [customTagInput, setCustomTagInput] = useState('');
  const [gymInput, setGymInput] = useState('');

  // Sync state when profile loads
  useEffect(() => {
    if (userProfile?.trainerProfile) {
      const tp = userProfile.trainerProfile;
      setDescription(tp.description || '');
      setMonthlyPrice(tp.monthlyPrice ?? '');
      setSpecializations(tp.specializations || []);
      setGyms(tp.gyms || []);
      setLogoUrl(tp.logoUrl ?? null);
    }
  }, [userProfile]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const publicUrl = await uploadImageDirectly(file, 'trainer-logo');
      setLogoUrl(publicUrl);
      toast.success(t('settings.logoUpdated') || 'Logo uploaded');
    } catch (err: any) {
      toast.error(err.message === 'FILE_TOO_LARGE' ? t('auth.fileTooLarge') : t('auth.uploadError'));
    } finally {
      setIsUploadingLogo(false);
      if (logoFileRef.current) logoFileRef.current.value = '';
    }
  };

  const toggleSpecialization = (tag: string) => {
    const exists = specializations.includes(tag);
    const updated = exists ? specializations.filter((t) => t !== tag) : [...specializations, tag];
    setSpecializations(updated);
  };

  const addCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!specializations.includes(trimmed)) {
      setSpecializations([...specializations, trimmed]);
    }
    setCustomTagInput('');
  };

  const addGym = () => {
    const trimmed = gymInput.trim();
    if (!trimmed) return;
    if (gyms.length >= 3) {
      toast.error(t('auth.maxGymsReached'));
      return;
    }
    if (!gyms.includes(trimmed)) {
      setGyms([...gyms, trimmed]);
    }
    setGymInput('');
  };

  const removeGym = (gymToRemove: string) => {
    setGyms(gyms.filter((g) => g !== gymToRemove));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userProfile?.trainerProfile) {
      const tp = userProfile.trainerProfile;
      setDescription(tp.description || '');
      setMonthlyPrice(tp.monthlyPrice ?? '');
      setSpecializations(tp.specializations || []);
      setGyms(tp.gyms || []);
      setLogoUrl(tp.logoUrl ?? null);
    }
    setCustomTagInput('');
    setGymInput('');
  };

  const handleSave = () => {
    const priceNum = Number(monthlyPrice);
    if (monthlyPrice === '' || isNaN(priceNum) || priceNum < 0) {
      toast.error(t('auth.validation.priceRequired'));
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      toast.error(t('auth.validation.descriptionMin'));
      return;
    }
    if (specializations.length === 0) {
      toast.error(t('auth.validation.specializationsMin'));
      return;
    }

    const trainerPayload: any = {
      description: description.trim(),
      monthlyPrice: priceNum,
      specializations,
      gyms,
    };
    if (logoUrl) {
      trainerPayload.logoUrl = logoUrl;
    }

    updateProfile(
      {
        trainerProfile: trainerPayload,
      },
      {
        onSuccess: () => {
          toast.success(t('settings.profileUpdated'));
          setIsEditing(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || t('common.error'));
        },
      },
    );
  };

  const tp = userProfile?.trainerProfile;

  return (
    <Wrapper data-testid="coaching-profile-card">
      <HeaderRow>
        <SectionTitle>
          <Dumbbell size={18} color="#ffb3b1" /> {t('auth.stepCoaching')}
        </SectionTitle>
        {!isEditing ? (
          <EditButton
            type="button"
            onClick={() => setIsEditing(true)}
            data-testid="edit-coaching-profile-btn"
          >
            <Pencil size={13} />
            <span>{t('settings.editCredentials')}</span>
          </EditButton>
        ) : (
          <ActionGroup>
            <CancelButton type="button" onClick={handleCancel} disabled={isSaving}>
              <X size={13} />
              <span>{t('common.cancel')}</span>
            </CancelButton>
            <SaveButton
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              data-testid="save-coaching-profile-btn"
            >
              {isSaving ? <Loader2 size={13} className="spin" /> : <Check size={13} />}
              <span>{t('common.save')}</span>
            </SaveButton>
          </ActionGroup>
        )}
      </HeaderRow>

      {isLoading ? (
        <LoadingState>{t('common.loading')}</LoadingState>
      ) : !isEditing ? (
        /* VIEW MODE */
        <InfoStack>
          <InfoRow>
            <InfoCol>
              <InfoLabel>{t('auth.monthlyPrice')}</InfoLabel>
              <PriceTag>${tp?.monthlyPrice ?? '0'} USD / mo</PriceTag>
            </InfoCol>
          </InfoRow>

          <InfoBlock>
            <InfoLabel>{t('auth.specializations')}</InfoLabel>
            {tp?.specializations && tp.specializations.length > 0 ? (
              <ChipsList>
                {tp.specializations.map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </ChipsList>
            ) : (
              <EmptyText>—</EmptyText>
            )}
          </InfoBlock>

          <InfoBlock>
            <InfoLabel>{t('auth.gymAffiliations')}</InfoLabel>
            {tp?.gyms && tp.gyms.length > 0 ? (
              <ChipsList>
                {tp.gyms.map((gym) => (
                  <GymChip key={gym}>
                    <Building size={13} />
                    <span>{gym}</span>
                  </GymChip>
                ))}
              </ChipsList>
            ) : (
              <EmptyText>—</EmptyText>
            )}
          </InfoBlock>

          <InfoBlock>
            <InfoLabel>{t('settings.trainerLogo') || 'Trainer Logo'}</InfoLabel>
            {tp?.logoUrl ? (
              <LogoPreviewBox>
                <img src={tp.logoUrl} alt="Trainer Logo" />
              </LogoPreviewBox>
            ) : (
              <EmptyText>—</EmptyText>
            )}
          </InfoBlock>

          <InfoBlock>
            <InfoLabel>{t('auth.servicesDescription')}</InfoLabel>
            <DescriptionText>{tp?.description || '—'}</DescriptionText>
          </InfoBlock>
        </InfoStack>
      ) : (
        /* EDIT MODE */
        <EditForm>
          <FieldGroup>
            <FieldLabel>{t('settings.trainerLogo') || 'Trainer Logo'}</FieldLabel>
            <LogoUploadRow>
              {logoUrl ? (
                <LogoPreviewBox>
                  <img src={logoUrl} alt="Trainer Logo" />
                </LogoPreviewBox>
              ) : (
                <LogoPlaceholderBox>
                  <Dumbbell size={24} color="#ff9da4" />
                </LogoPlaceholderBox>
              )}
              <UploadSmallBtn
                type="button"
                onClick={() => logoFileRef.current?.click()}
                disabled={isUploadingLogo}
                data-testid="coaching-upload-logo-btn"
              >
                {isUploadingLogo ? <Loader2 size={13} className="spin" /> : <Camera size={13} />}
                <span>
                  {logoUrl
                    ? t('settings.editTrainerLogo') || 'Change Logo'
                    : t('auth.uploadTrainerLogo') || 'Upload Logo'}
                </span>
              </UploadSmallBtn>
              <input
                ref={logoFileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={handleLogoUpload}
                data-testid="coaching-logo-file-input"
              />
            </LogoUploadRow>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>{t('auth.monthlyPrice')}</FieldLabel>
            <StyledInput
              type="number"
              min="0"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 150"
              data-testid="edit-input-monthlyPrice"
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>{t('auth.specializations')}</FieldLabel>
            <ChipsWrap>
              {PRESET_SPECIALIZATIONS.map((tag) => {
                const isSelected = specializations.includes(tag);
                return (
                  <ChipBtn
                    key={tag}
                    type="button"
                    $selected={isSelected}
                    onClick={() => toggleSpecialization(tag)}
                    data-testid={`edit-tag-${tag}`}
                  >
                    {tag}
                  </ChipBtn>
                );
              })}
            </ChipsWrap>
            <TagInputRow>
              <StyledInput
                type="text"
                placeholder={t('auth.customTagPlaceholder')}
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                data-testid="edit-input-custom-tag"
              />
              <AddSmallBtn type="button" onClick={addCustomTag}>
                <Plus size={16} />
              </AddSmallBtn>
            </TagInputRow>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              {t('auth.gymAffiliations')} ({gyms.length}/3)
            </FieldLabel>
            {gyms.length > 0 && (
              <ChipsList>
                {gyms.map((gym) => (
                  <GymChipEditable key={gym}>
                    <Building size={13} />
                    <span>{gym}</span>
                    <RemoveBtn type="button" onClick={() => removeGym(gym)}>
                      <X size={12} />
                    </RemoveBtn>
                  </GymChipEditable>
                ))}
              </ChipsList>
            )}
            {gyms.length < 3 && (
              <TagInputRow>
                <StyledInput
                  type="text"
                  placeholder={t('auth.gymPlaceholder')}
                  value={gymInput}
                  onChange={(e) => setGymInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addGym();
                    }
                  }}
                  data-testid="edit-input-gym"
                />
                <AddSmallBtn type="button" onClick={addGym}>
                  <Plus size={16} />
                </AddSmallBtn>
              </TagInputRow>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>{t('auth.servicesDescription')}</FieldLabel>
            <StyledTextarea
              rows={4}
              placeholder={t('auth.servicesPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="edit-input-description"
            />
          </FieldGroup>
        </EditForm>
      )}
    </Wrapper>
  );
}

// Styled Components
const Wrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  background: rgba(239, 35, 60, 0.12);
  border: 1px solid rgba(239, 35, 60, 0.35);
  color: #ff9da4;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 35, 60, 0.22);
    color: #ffffff;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  background: #181a2e;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #9096b6;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #242947;
    color: #f5f6ff;
  }
`;

const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.95rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ff8a93, #ef233c);
  border: none;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(239, 35, 60, 0.35);

  &:hover {
    background: linear-gradient(135deg, #ff9da4, #d90429);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingState = styled.p`
  margin: 0;
  color: #9096b6;
  font-size: 0.85rem;
`;

const InfoStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const InfoLabel = styled.span`
  color: #9096b6;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

const PriceTag = styled.span`
  color: #ff9da4;
  font-size: 1.35rem;
  font-weight: 750;
`;

const ChipsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagChip = styled.span`
  display: inline-flex;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  background: rgba(126, 136, 175, 0.14);
  border: 1px solid rgba(126, 136, 175, 0.22);
  color: #f5f6ff;
  font-size: 0.78rem;
  font-weight: 600;
`;

const GymChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  background: rgba(239, 35, 60, 0.15);
  border: 1px solid rgba(239, 35, 60, 0.35);
  color: #ff9da4;
  font-size: 0.78rem;
  font-weight: 600;
`;

const GymChipEditable = styled(GymChip)`
  gap: 0.5rem;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #ff9da4;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #ffffff;
  }
`;

const DescriptionText = styled.p`
  margin: 0;
  color: #e0e0fc;
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: pre-wrap;
  background: #14172e;
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(126, 136, 175, 0.12);
`;

const EmptyText = styled.span`
  color: #697092;
  font-size: 0.85rem;
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const FieldLabel = styled.span`
  color: #9096b6;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

const StyledInput = styled.input`
  padding: 0.7rem 0.95rem;
  border-radius: 0.75rem;
  background: #0f1329;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #ffffff;
  font-size: 0.88rem;
  outline: none;

  &:focus {
    border-color: #ef233c;
  }
`;

const StyledTextarea = styled.textarea`
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  background: #0f1329;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #ffffff;
  font-size: 0.88rem;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #ef233c;
  }
`;

const ChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const ChipBtn = styled.button<{ $selected?: boolean }>`
  padding: 0.4rem 0.75rem;
  border-radius: 9999px;
  background: ${({ $selected }) =>
    $selected ? 'linear-gradient(135deg, #ff8a93, #ef233c)' : '#0f1329'};
  border: 1px solid ${({ $selected }) => ($selected ? '#ef233c' : 'rgba(126, 136, 175, 0.22)')};
  color: ${({ $selected }) => ($selected ? '#ffffff' : '#b6bcdb')};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
`;

const TagInputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const AddSmallBtn = styled.button`
  width: 2.85rem;
  border-radius: 9999px;
  background-color: #ef233c;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: #d90429;
  }
`;

const LogoPreviewBox = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 179, 177, 0.4);
  overflow: hidden;
  background: #14172e;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LogoPlaceholderBox = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 0.75rem;
  border: 1px dashed rgba(255, 179, 177, 0.35);
  background: rgba(255, 83, 90, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoUploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UploadSmallBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  background: rgba(255, 83, 90, 0.12);
  border: 1px solid rgba(255, 179, 177, 0.35);
  color: #ffb3b1;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 83, 90, 0.22);
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
