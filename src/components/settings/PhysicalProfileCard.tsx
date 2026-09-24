import { useState, useEffect } from 'react';
import { Activity, Pencil, Check, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { toast } from 'sonner';
import { CardSurface, SectionTitle } from './SettingsShell';
import { useUpdateUserProfile } from '../../hooks/useUserProfile';
import type { FullUserProfile } from '../../types/auth';

interface PhysicalProfileCardProps {
  userProfile?: FullUserProfile | null;
  isLoading?: boolean;
}

const PRESET_GOALS = [
  { key: 'buildMuscle', labelKey: 'auth.goals.buildMuscle' },
  { key: 'loseFat', labelKey: 'auth.goals.loseFat' },
  { key: 'gainStrength', labelKey: 'auth.goals.gainStrength' },
  { key: 'endurance', labelKey: 'auth.goals.endurance' },
  { key: 'generalFitness', labelKey: 'auth.goals.generalFitness' },
];

export function PhysicalProfileCard({ userProfile, isLoading }: PhysicalProfileCardProps) {
  const { t } = useTranslation();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateUserProfile();

  const [isEditing, setIsEditing] = useState(false);

  // Unit toggles
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  // Form state
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('');
  const [displayHeight, setDisplayHeight] = useState<string>('');
  const [displayWeight, setDisplayWeight] = useState<string>('');
  const [heightCm, setHeightCm] = useState<number | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [goal, setGoal] = useState<string>('');

  // Sync state when profile loads or resets
  useEffect(() => {
    if (userProfile?.profile) {
      const p = userProfile.profile;
      setAge(p.age ?? '');
      setGender(p.gender ?? '');
      setHeightCm(p.height ?? null);
      setWeightKg(p.weight ?? null);
      setGoal(p.goal ?? '');

      if (p.height) {
        setDisplayHeight(
          heightUnit === 'ft' ? (p.height / 30.48).toFixed(1) : String(p.height),
        );
      }
      if (p.weight) {
        setDisplayWeight(
          weightUnit === 'lbs' ? (p.weight * 2.20462).toFixed(1) : String(p.weight),
        );
      }
    }
  }, [userProfile, heightUnit, weightUnit]);

  const handleHeightUnitToggle = (unit: 'cm' | 'ft') => {
    if (unit === heightUnit) return;
    setHeightUnit(unit);
    if (heightCm) {
      setDisplayHeight(unit === 'ft' ? (heightCm / 30.48).toFixed(1) : String(heightCm));
    }
  };

  const handleWeightUnitToggle = (unit: 'kg' | 'lbs') => {
    if (unit === weightUnit) return;
    setWeightUnit(unit);
    if (weightKg) {
      setDisplayWeight(unit === 'lbs' ? (weightKg * 2.20462).toFixed(1) : String(weightKg));
    }
  };

  const handleHeightInput = (valStr: string) => {
    setDisplayHeight(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const cm = heightUnit === 'ft' ? Math.round(num * 30.48 * 10) / 10 : num;
      setHeightCm(cm);
    } else {
      setHeightCm(null);
    }
  };

  const handleWeightInput = (valStr: string) => {
    setDisplayWeight(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const kg = weightUnit === 'lbs' ? Math.round((num / 2.20462) * 10) / 10 : num;
      setWeightKg(kg);
    } else {
      setWeightKg(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userProfile?.profile) {
      const p = userProfile.profile;
      setAge(p.age ?? '');
      setGender(p.gender ?? '');
      setHeightCm(p.height ?? null);
      setWeightKg(p.weight ?? null);
      setGoal(p.goal ?? '');
      setDisplayHeight(
        heightUnit === 'ft' ? ((p.height ?? 0) / 30.48).toFixed(1) : String(p.height ?? ''),
      );
      setDisplayWeight(
        weightUnit === 'lbs' ? ((p.weight ?? 0) * 2.20462).toFixed(1) : String(p.weight ?? ''),
      );
    }
  };

  const handleSave = () => {
    const ageNum = Number(age);
    if (!age || isNaN(ageNum) || ageNum < 14 || ageNum > 100) {
      toast.error(t('auth.validation.ageMin'));
      return;
    }
    if (!gender) {
      toast.error(t('auth.validation.genderRequired'));
      return;
    }
    if (!heightCm || heightCm <= 0) {
      toast.error(t('auth.validation.heightPositive'));
      return;
    }
    if (!weightKg || weightKg <= 0) {
      toast.error(t('auth.validation.weightPositive'));
      return;
    }
    if (!goal.trim()) {
      toast.error(t('auth.validation.goalRequired'));
      return;
    }

    updateProfile(
      {
        profile: {
          age: ageNum,
          gender,
          height: heightCm,
          weight: weightKg,
          goal: goal.trim(),
        },
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

  const formatHeight = (cm?: number | null) => {
    if (!cm) return '—';
    if (heightUnit === 'ft') {
      return `${(cm / 30.48).toFixed(1)} ft`;
    }
    return `${cm} cm`;
  };

  const formatWeight = (kg?: number | null) => {
    if (!kg) return '—';
    if (weightUnit === 'lbs') {
      return `${(kg * 2.20462).toFixed(1)} lbs`;
    }
    return `${kg} kg`;
  };

  const profile = userProfile?.profile;

  return (
    <Wrapper data-testid="physical-profile-card">
      <HeaderRow>
        <SectionTitle>
          <Activity size={18} color="#ffb3b1" /> {t('settings.physicalProfile')}
        </SectionTitle>
        {!isEditing ? (
          <EditButton
            type="button"
            onClick={() => setIsEditing(true)}
            data-testid="edit-physical-profile-btn"
          >
            <Pencil size={13} />
            <span>{t('settings.editProfile')}</span>
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
              data-testid="save-physical-profile-btn"
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
        <InfoGrid>
          <InfoCard>
            <InfoLabel>{t('auth.age')}</InfoLabel>
            <InfoValue>{profile?.age ? `${profile.age} yrs` : '—'}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoLabel>{t('auth.gender')}</InfoLabel>
            <InfoValue style={{ textTransform: 'capitalize' }}>
              {profile?.gender ? t(`auth.gender${profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}`, profile.gender) : '—'}
            </InfoValue>
          </InfoCard>

          <InfoCard>
            <UnitHeader>
              <InfoLabel>{t('auth.height')}</InfoLabel>
              <UnitPills>
                <UnitPill $active={heightUnit === 'cm'} onClick={() => handleHeightUnitToggle('cm')}>
                  CM
                </UnitPill>
                <UnitPill $active={heightUnit === 'ft'} onClick={() => handleHeightUnitToggle('ft')}>
                  FT
                </UnitPill>
              </UnitPills>
            </UnitHeader>
            <InfoValue>{formatHeight(profile?.height)}</InfoValue>
          </InfoCard>

          <InfoCard>
            <UnitHeader>
              <InfoLabel>{t('auth.weight')}</InfoLabel>
              <UnitPills>
                <UnitPill $active={weightUnit === 'kg'} onClick={() => handleWeightUnitToggle('kg')}>
                  KG
                </UnitPill>
                <UnitPill $active={weightUnit === 'lbs'} onClick={() => handleWeightUnitToggle('lbs')}>
                  LBS
                </UnitPill>
              </UnitPills>
            </UnitHeader>
            <InfoValue>{formatWeight(profile?.weight)}</InfoValue>
          </InfoCard>

          <GoalCard>
            <InfoLabel>{t('auth.fitnessGoal')}</InfoLabel>
            <GoalChip>{profile?.goal || '—'}</GoalChip>
          </GoalCard>
        </InfoGrid>
      ) : (
        /* EDIT MODE */
        <EditForm>
          <TwoColRow>
            <FieldGroup>
              <FieldLabel>{t('auth.age')}</FieldLabel>
              <StyledInput
                type="number"
                min="14"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 25"
                data-testid="edit-input-age"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>{t('auth.gender')}</FieldLabel>
              <GenderButtonGroup>
                {['male', 'female', 'other', 'preferNot'].map((g) => (
                  <GenderOption
                    key={g}
                    type="button"
                    $selected={gender === g}
                    onClick={() => setGender(g)}
                    data-testid={`edit-gender-${g}`}
                  >
                    {t(`auth.gender${g.charAt(0).toUpperCase() + g.slice(1)}`)}
                  </GenderOption>
                ))}
              </GenderButtonGroup>
            </FieldGroup>
          </TwoColRow>

          <TwoColRow>
            <FieldGroup>
              <UnitHeader>
                <FieldLabel>{t('auth.height')}</FieldLabel>
                <UnitPills>
                  <UnitPill $active={heightUnit === 'cm'} onClick={() => handleHeightUnitToggle('cm')}>
                    CM
                  </UnitPill>
                  <UnitPill $active={heightUnit === 'ft'} onClick={() => handleHeightUnitToggle('ft')}>
                    FT
                  </UnitPill>
                </UnitPills>
              </UnitHeader>
              <StyledInput
                type="number"
                step="0.1"
                value={displayHeight}
                onChange={(e) => handleHeightInput(e.target.value)}
                placeholder={heightUnit === 'cm' ? '175' : '5.9'}
                data-testid="edit-input-height"
              />
            </FieldGroup>

            <FieldGroup>
              <UnitHeader>
                <FieldLabel>{t('auth.weight')}</FieldLabel>
                <UnitPills>
                  <UnitPill $active={weightUnit === 'kg'} onClick={() => handleWeightUnitToggle('kg')}>
                    KG
                  </UnitPill>
                  <UnitPill $active={weightUnit === 'lbs'} onClick={() => handleWeightUnitToggle('lbs')}>
                    LBS
                  </UnitPill>
                </UnitPills>
              </UnitHeader>
              <StyledInput
                type="number"
                step="0.1"
                value={displayWeight}
                onChange={(e) => handleWeightInput(e.target.value)}
                placeholder={weightUnit === 'kg' ? '70' : '154'}
                data-testid="edit-input-weight"
              />
            </FieldGroup>
          </TwoColRow>

          <FieldGroup>
            <FieldLabel>{t('auth.fitnessGoal')}</FieldLabel>
            <ChipsWrap>
              {PRESET_GOALS.map((g) => {
                const label = t(g.labelKey);
                const isSelected = goal === label;
                return (
                  <ChipBtn
                    key={g.key}
                    type="button"
                    $selected={isSelected}
                    onClick={() => setGoal(label)}
                    data-testid={`edit-goal-${g.key}`}
                  >
                    {label}
                  </ChipBtn>
                );
              })}
            </ChipsWrap>
            <StyledInput
              type="text"
              placeholder={t('auth.customGoalPlaceholder')}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{ marginTop: '0.65rem' }}
              data-testid="edit-input-custom-goal"
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: #14172e;
  border: 1px solid rgba(126, 136, 175, 0.12);
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const InfoLabel = styled.span`
  color: #9096b6;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: #f5f6ff;
  font-size: 1.15rem;
  font-weight: 700;
`;

const GoalCard = styled.div`
  grid-column: 1 / -1;
  background: #14172e;
  border: 1px solid rgba(126, 136, 175, 0.12);
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GoalChip = styled.span`
  align-self: flex-start;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, rgba(239, 35, 60, 0.22) 0%, rgba(239, 35, 60, 0.08) 100%);
  border: 1px solid rgba(239, 35, 60, 0.4);
  color: #ff9da4;
  font-size: 0.85rem;
  font-weight: 700;
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TwoColRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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

const GenderButtonGroup = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
`;

const GenderOption = styled.button<{ $selected?: boolean }>`
  flex: 1;
  padding: 0.65rem 0.4rem;
  border-radius: 0.75rem;
  background: ${({ $selected }) => ($selected ? '#ef233c' : '#0f1329')};
  border: 1px solid ${({ $selected }) => ($selected ? '#ef233c' : 'rgba(126, 136, 175, 0.2)')};
  color: ${({ $selected }) => ($selected ? '#ffffff' : '#b2b8d8')};
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
`;

const UnitHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UnitPills = styled.div`
  display: flex;
  background: #0d1124;
  border-radius: 9999px;
  padding: 2px;
  border: 1px solid rgba(126, 136, 175, 0.2);
`;

const UnitPill = styled.button<{ $active?: boolean }>`
  padding: 0.18rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.62rem;
  font-weight: 700;
  background: ${({ $active }) => ($active ? '#ef233c' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#7d84a5')};
  border: none;
  cursor: pointer;
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
