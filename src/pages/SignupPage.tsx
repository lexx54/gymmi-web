import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Dumbbell,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Plus,
  X,
  Edit2,
  Building,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSignup } from '../hooks/useAuthApi';
import {
  createStep1Schema,
  createStep2Schema,
  createStep3TrainerSchema,
  createSignupSchema,
  type SignupFormValues,
} from '../schemas/auth';
import type { SignupParams } from '../types/auth';
import { uploadImageDirectly } from '../utils/imageUpload';

const LOCKOUT_DURATION = 180_000;

function getMutationErrorMessage(err: unknown, fallback: string) {
  const ax = err as AxiosError<{ message: string }>;
  return ax.response?.data?.message || (err instanceof Error ? err.message : null) || fallback;
}

const PRESET_GOALS = [
  { key: 'buildMuscle', labelKey: 'auth.goals.buildMuscle' },
  { key: 'loseFat', labelKey: 'auth.goals.loseFat' },
  { key: 'gainStrength', labelKey: 'auth.goals.gainStrength' },
  { key: 'endurance', labelKey: 'auth.goals.endurance' },
  { key: 'generalFitness', labelKey: 'auth.goals.generalFitness' },
];

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

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Unit toggles
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [displayWeight, setDisplayWeight] = useState<string>('');
  const [displayHeight, setDisplayHeight] = useState<string>('');

  // Trainer custom tag and gym inputs
  const [customTagInput, setCustomTagInput] = useState('');
  const [gymInput, setGymInput] = useState('');

  const { mutate: signup, isPending: loading } = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(createSignupSchema(t)),
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'Client',
      avatarUrl: '',
      age: undefined,
      gender: '',
      height: undefined,
      weight: undefined,
      goal: '',
      description: '',
      monthlyPrice: undefined,
      specializations: [],
      gyms: [],
      logoUrl: '',
    },
  });

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const selectedRole = watch('role');
  const isTrainer = selectedRole === 'Trainer';
  const totalSteps = isTrainer ? 4 : 3;

  const currentAvatarUrl = watch('avatarUrl') || '';
  const currentLogoUrl = watch('logoUrl') || '';
  const currentSpecializations = watch('specializations') || [];
  const currentGyms = watch('gyms') || [];
  const selectedGoal = watch('goal') || '';
  const selectedGender = watch('gender') || '';

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setUploadingAvatar(true);
    try {
      const publicUrl = await uploadImageDirectly(file, 'avatar');
      setValue('avatarUrl', publicUrl, { shouldValidate: true });
      clearErrors('avatarUrl');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message === 'FILE_TOO_LARGE') {
        toast.error(t('auth.photoSizeError'));
      } else if (message === 'INVALID_FILE_TYPE') {
        toast.error(t('auth.photoTypeError'));
      } else {
        toast.error(t('auth.photoUploadError'));
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setValue('avatarUrl', '', { shouldValidate: true });
  };

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setUploadingLogo(true);
    try {
      const publicUrl = await uploadImageDirectly(file, 'trainer-logo');
      setValue('logoUrl', publicUrl, { shouldValidate: true });
      clearErrors('logoUrl');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message === 'FILE_TOO_LARGE') {
        toast.error(t('auth.photoSizeError'));
      } else if (message === 'INVALID_FILE_TYPE') {
        toast.error(t('auth.photoTypeError'));
      } else {
        toast.error(t('auth.photoUploadError'));
      }
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setValue('logoUrl', '', { shouldValidate: true });
  };

  // Synchronize height unit conversions
  const handleHeightChange = (valStr: string) => {
    setDisplayHeight(valStr);
    const num = parseFloat(valStr);
    if (isNaN(num)) {
      setValue('height', undefined as any, { shouldValidate: true });
      return;
    }
    const cm = heightUnit === 'ft' ? Math.round(num * 30.48 * 10) / 10 : num;
    setValue('height', cm, { shouldValidate: true });
  };

  const toggleHeightUnit = (unit: 'cm' | 'ft') => {
    if (unit === heightUnit) return;
    setHeightUnit(unit);
    const currentVal = parseFloat(displayHeight);
    if (!isNaN(currentVal)) {
      const converted = unit === 'ft'
        ? (currentVal / 30.48).toFixed(1)
        : (currentVal * 30.48).toFixed(0);
      setDisplayHeight(converted);
    }
  };

  // Synchronize weight unit conversions
  const handleWeightChange = (valStr: string) => {
    setDisplayWeight(valStr);
    const num = parseFloat(valStr);
    if (isNaN(num)) {
      setValue('weight', undefined as any, { shouldValidate: true });
      return;
    }
    const kg = weightUnit === 'lbs' ? Math.round((num / 2.20462) * 10) / 10 : num;
    setValue('weight', kg, { shouldValidate: true });
  };

  const toggleWeightUnit = (unit: 'kg' | 'lbs') => {
    if (unit === weightUnit) return;
    setWeightUnit(unit);
    const currentVal = parseFloat(displayWeight);
    if (!isNaN(currentVal)) {
      const converted = unit === 'lbs'
        ? (currentVal * 2.20462).toFixed(1)
        : (currentVal / 2.20462).toFixed(1);
      setDisplayWeight(converted);
    }
  };

  // Specialization tag handlers
  const toggleSpecialization = (tag: string) => {
    const exists = currentSpecializations.includes(tag);
    const updated = exists
      ? currentSpecializations.filter((t) => t !== tag)
      : [...currentSpecializations, tag];
    setValue('specializations', updated, { shouldValidate: true });
  };

  const addCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!currentSpecializations.includes(trimmed)) {
      setValue('specializations', [...currentSpecializations, trimmed], { shouldValidate: true });
    }
    setCustomTagInput('');
  };

  // Gym affiliation handlers
  const addGym = () => {
    const trimmed = gymInput.trim();
    if (!trimmed) return;
    if (currentGyms.length >= 3) {
      toast.error(t('auth.maxGymsReached'));
      return;
    }
    if (!currentGyms.includes(trimmed)) {
      setValue('gyms', [...currentGyms, trimmed], { shouldValidate: true });
    }
    setGymInput('');
  };

  const removeGym = (gymToRemove: string) => {
    setValue(
      'gyms',
      currentGyms.filter((g) => g !== gymToRemove),
      { shouldValidate: true },
    );
  };

  // Lockout timer
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const diff = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (diff <= 0) {
        setLockedUntil(null);
        setRemainingSeconds(0);
      } else {
        setRemainingSeconds(diff);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = remainingSeconds > 0;
  const disabled = loading || isLocked;

  const formatCountdown = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Step progression validations
  const handleNextFromStep1 = async () => {
    const currentValues = watch();
    const result = createStep1Schema(t).safeParse(currentValues);
    if (!result.success) {
      const seen = new Set<string>();
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof SignupFormValues;
        if (fieldName && !seen.has(fieldName)) {
          seen.add(fieldName);
          setError(fieldName, { type: 'manual', message: issue.message });
        }
      }
      return;
    }
    clearErrors(['email', 'username', 'password', 'confirmPassword', 'role', 'avatarUrl']);
    setStep(2);
  };

  const handleNextFromStep2 = async () => {
    const currentValues = watch();
    const result = createStep2Schema(t, isTrainer).safeParse(currentValues);
    if (!result.success) {
      const seen = new Set<string>();
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof SignupFormValues;
        if (fieldName && !seen.has(fieldName)) {
          seen.add(fieldName);
          setError(fieldName, { type: 'manual', message: issue.message });
        }
      }
      return;
    }
    clearErrors(['age', 'gender', 'height', 'weight', 'goal']);
    setStep(3);
  };

  const handleNextFromStep3 = async () => {
    if (isTrainer) {
      const currentValues = watch();
      const result = createStep3TrainerSchema(t).safeParse(currentValues);
      if (!result.success) {
        const seen = new Set<string>();
        for (const issue of result.error.issues) {
          const fieldName = issue.path[0] as keyof SignupFormValues;
          if (fieldName && !seen.has(fieldName)) {
            seen.add(fieldName);
            setError(fieldName, { type: 'manual', message: issue.message });
          }
        }
        return;
      }
      clearErrors(['description', 'monthlyPrice', 'specializations', 'gyms', 'logoUrl']);
      setStep(4);
    } else {
      setStep(3);
    }
  };

  const onSubmit = (data: SignupFormValues) => {
    if (disabled) return;

    const payload: SignupParams = {
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
      ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
      profile: {
        age: Number(data.age),
        gender: data.gender,
        height: Number(data.height),
        weight: Number(data.weight),
        ...(data.role === 'Client' && data.goal ? { goal: data.goal } : {}),
      },
      ...(data.role === 'Trainer'
        ? {
            trainerProfile: {
              description: data.description || '',
              monthlyPrice: Number(data.monthlyPrice) || 0,
              specializations: data.specializations || [],
              gyms: data.gyms || [],
              ...(data.logoUrl ? { logoUrl: data.logoUrl } : {}),
            },
          }
        : {}),
    };

    signup(payload, {
      onSuccess: () => {
        toast.success(t('auth.accountCreated'));
        navigate('/login');
      },
      onError: (err) => {
        if ((err as AxiosError).response?.status === 429) {
          setLockedUntil(Date.now() + LOCKOUT_DURATION);
          toast.error(
            t('auth.lockout', { time: formatCountdown(Math.ceil(LOCKOUT_DURATION / 1000)) }),
          );
          return;
        }
        toast.error(getMutationErrorMessage(err, t('auth.signupFailed')));
      },
    });
  };

  return (
    <PageContainer>
      <HeroPanel>
        <HeroImage
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
          alt="Gym"
        />
        <HeroContent>
          <div>
            <HeroTitle>Gymmi</HeroTitle>
          </div>
          <HeroFooter>
            <HeroQuote>{t('auth.quote')}</HeroQuote>
          </HeroFooter>
        </HeroContent>
      </HeroPanel>

      <FormPanel>
        <FormInner>
          <MobileBrand>
            <MobileBrandTitle>Gymmi</MobileBrandTitle>
          </MobileBrand>

          <FormCard>
            {/* Step Progress Bar Header */}
            <ProgressHeader>
              <ProgressTrack>
                <ProgressFill $percent={((step - 1) / (totalSteps - 1)) * 100} />
              </ProgressTrack>
              <StepIndicatorText>
                {t('auth.stepIndicator', { current: step, total: totalSteps })}
              </StepIndicatorText>
            </ProgressHeader>

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              {/* STEP 1: Account Credentials & Role */}
              {step === 1 && (
                <StepSection data-testid="signup-step-1">
                  <FormTitle>{t('auth.createAccount')}</FormTitle>
                  <FormSubtitle>{t('auth.signUpWithEmail')}</FormSubtitle>

                  {/* Role Selector Cards */}
                  <FieldGroup>
                    <Label>{t('auth.rolePrompt')}</Label>
                    <RoleGrid>
                      <RoleCard
                        type="button"
                        $selected={selectedRole === 'Client'}
                        onClick={() => setValue('role', 'Client', { shouldValidate: true })}
                        data-testid="role-client"
                      >
                        <RoleIconWrap $selected={selectedRole === 'Client'}>
                          <UserIcon size={20} />
                        </RoleIconWrap>
                        <RoleTextWrap>
                          <RoleName>{t('auth.roles.Client')}</RoleName>
                          <RoleDesc>Track workouts, volume, and personal records</RoleDesc>
                        </RoleTextWrap>
                        {selectedRole === 'Client' && <CheckBadge><Check size={14} /></CheckBadge>}
                      </RoleCard>

                      <RoleCard
                        type="button"
                        $selected={selectedRole === 'Trainer'}
                        onClick={() => setValue('role', 'Trainer', { shouldValidate: true })}
                        data-testid="role-trainer"
                      >
                        <RoleIconWrap $selected={selectedRole === 'Trainer'}>
                          <Dumbbell size={20} />
                        </RoleIconWrap>
                        <RoleTextWrap>
                          <RoleName>{t('auth.roles.Trainer')}</RoleName>
                          <RoleDesc>Coach clients, assign routines, manage roster</RoleDesc>
                        </RoleTextWrap>
                        {selectedRole === 'Trainer' && <CheckBadge><Check size={14} /></CheckBadge>}
                      </RoleCard>
                    </RoleGrid>
                    {errors.role && <ErrorMsg>{errors.role.message}</ErrorMsg>}
                  </FieldGroup>

                  {/* Profile Photo & Trainer Logo Uploaders (Side by Side) */}
                  <PhotoUploadsContainer>
                    <PhotoUploadCol>
                      <Label>
                        {t('auth.profilePhoto')} <OptionalTag>({t('auth.optional')})</OptionalTag>
                      </Label>
                      <IconBoxWrapper>
                        <AvatarUploadBox
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          data-testid="avatar-picker-trigger"
                          title={currentAvatarUrl ? t('auth.changePhoto') : t('auth.uploadPhoto')}
                        >
                          {uploadingAvatar ? (
                            <SpinnerWrap data-testid="avatar-uploading">
                              <Loader2 size={24} className="animate-spin" />
                            </SpinnerWrap>
                          ) : currentAvatarUrl ? (
                            <AvatarPreviewImg
                              src={currentAvatarUrl}
                              alt={t('auth.avatarPreviewAlt')}
                              data-testid="avatar-preview-img"
                            />
                          ) : (
                            <UploadIconWrap>
                              <Camera size={24} />
                            </UploadIconWrap>
                          )}
                        </AvatarUploadBox>
                        {currentAvatarUrl && (
                          <RemoveBadgeBtn
                            type="button"
                            onClick={handleRemoveAvatar}
                            data-testid="remove-avatar"
                            title={t('auth.removePhoto')}
                            aria-label={t('auth.removePhoto')}
                          >
                            <X size={12} />
                          </RemoveBadgeBtn>
                        )}
                      </IconBoxWrapper>

                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarFile}
                        style={{ display: 'none' }}
                        data-testid="input-avatar"
                      />
                      {errors.avatarUrl && <ErrorMsg>{errors.avatarUrl.message}</ErrorMsg>}
                    </PhotoUploadCol>

                    {isTrainer && (
                      <PhotoUploadCol data-testid="trainer-logo-field">
                        <Label>
                          {t('auth.trainerLogo')} <OptionalTag>({t('auth.optional')})</OptionalTag>
                        </Label>
                        <IconBoxWrapper>
                          <LogoUploadBox
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            data-testid="logo-picker-trigger"
                            title={currentLogoUrl ? t('auth.changeLogo') : t('auth.uploadLogo')}
                          >
                            {uploadingLogo ? (
                              <SpinnerWrap data-testid="logo-uploading">
                                <Loader2 size={24} className="animate-spin" />
                              </SpinnerWrap>
                            ) : currentLogoUrl ? (
                              <LogoPreviewImg
                                src={currentLogoUrl}
                                alt={t('auth.logoPreviewAlt')}
                                data-testid="logo-preview-img"
                              />
                            ) : (
                              <UploadIconWrap>
                                <Dumbbell size={24} />
                              </UploadIconWrap>
                            )}
                          </LogoUploadBox>
                          {currentLogoUrl && (
                            <RemoveBadgeBtn
                              type="button"
                              onClick={handleRemoveLogo}
                              data-testid="remove-logo"
                              title={t('auth.removeLogo')}
                              aria-label={t('auth.removeLogo')}
                            >
                              <X size={12} />
                            </RemoveBadgeBtn>
                          )}
                        </IconBoxWrapper>

                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleLogoFile}
                          style={{ display: 'none' }}
                          data-testid="input-logo"
                        />
                        {errors.logoUrl && <ErrorMsg>{errors.logoUrl.message}</ErrorMsg>}
                      </PhotoUploadCol>
                    )}
                  </PhotoUploadsContainer>

                  {/* Email */}
                  <FieldGroup>
                    <InputWrap>
                      <InputIcon><Mail size={18} /></InputIcon>
                      <StyledInput
                        type="email"
                        placeholder={t('auth.emailPlaceholder')}
                        autoComplete="email"
                        {...register('email')}
                        $hasError={Boolean(errors.email)}
                        data-testid="input-email"
                      />
                    </InputWrap>
                    {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
                  </FieldGroup>

                  {/* Username */}
                  <FieldGroup>
                    <InputWrap>
                      <InputIcon><UserIcon size={18} /></InputIcon>
                      <StyledInput
                        type="text"
                        placeholder={t('auth.usernamePlaceholder')}
                        autoComplete="username"
                        {...register('username')}
                        $hasError={Boolean(errors.username)}
                        data-testid="input-username"
                      />
                    </InputWrap>
                    {errors.username && <ErrorMsg>{errors.username.message}</ErrorMsg>}
                  </FieldGroup>

                  {/* Password */}
                  <FieldGroup>
                    <InputWrap>
                      <InputIcon><Lock size={18} /></InputIcon>
                      <StyledInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.passwordPlaceholder')}
                        autoComplete="new-password"
                        {...register('password')}
                        $hasError={Boolean(errors.password)}
                        data-testid="input-password"
                      />
                      <TogglePasswordBtn
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </TogglePasswordBtn>
                    </InputWrap>
                    {errors.password && <ErrorMsg>{errors.password.message}</ErrorMsg>}
                  </FieldGroup>

                  {/* Confirm Password */}
                  <FieldGroup>
                    <InputWrap>
                      <InputIcon><Lock size={18} /></InputIcon>
                      <StyledInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        $hasError={Boolean(errors.confirmPassword)}
                        data-testid="input-confirmPassword"
                      />
                      <TogglePasswordBtn
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </TogglePasswordBtn>
                    </InputWrap>
                    {errors.confirmPassword && <ErrorMsg>{errors.confirmPassword.message}</ErrorMsg>}
                  </FieldGroup>

                  <PrimaryBtn
                    type="button"
                    onClick={handleNextFromStep1}
                    data-testid="step1-next"
                  >
                    <span>{t('auth.continue')}</span>
                    <ChevronRight size={18} />
                  </PrimaryBtn>
                </StepSection>
              )}

              {/* STEP 2: Physical Profile (Age, Gender, Height, Weight, Goal) */}
              {step === 2 && (
                <StepSection data-testid="signup-step-2">
                  <FormTitle>{t('auth.stepBody')}</FormTitle>
                  <FormSubtitle>Tell us about your physical background to tailor your experience</FormSubtitle>

                  {/* Age & Gender in a row */}
                  <TwoColRow>
                    <FieldGroup>
                      <Label>{t('auth.age')}</Label>
                      <StyledInput
                        type="number"
                        placeholder={t('auth.agePlaceholder')}
                        {...register('age', { valueAsNumber: true })}
                        $hasError={Boolean(errors.age)}
                        data-testid="input-age"
                      />
                      {errors.age && <ErrorMsg>{errors.age.message}</ErrorMsg>}
                    </FieldGroup>

                    <FieldGroup>
                      <Label>{t('auth.gender')}</Label>
                      <GenderGrid>
                        {['male', 'female', 'other'].map((g) => (
                          <GenderBtn
                            key={g}
                            type="button"
                            $selected={selectedGender === g}
                            onClick={() => setValue('gender', g, { shouldValidate: true })}
                            data-testid={`gender-${g}`}
                          >
                            {t(`auth.gender${g.charAt(0).toUpperCase() + g.slice(1)}`)}
                          </GenderBtn>
                        ))}
                      </GenderGrid>
                      {errors.gender && <ErrorMsg>{errors.gender.message}</ErrorMsg>}
                    </FieldGroup>
                  </TwoColRow>

                  {/* Height & Weight with Unit Toggles */}
                  <TwoColRow>
                    <FieldGroup>
                      <UnitHeader>
                        <Label>{t('auth.height')}</Label>
                        <UnitToggleGroup>
                          <UnitBtn
                            type="button"
                            $active={heightUnit === 'cm'}
                            onClick={() => toggleHeightUnit('cm')}
                          >
                            CM
                          </UnitBtn>
                          <UnitBtn
                            type="button"
                            $active={heightUnit === 'ft'}
                            onClick={() => toggleHeightUnit('ft')}
                          >
                            FT
                          </UnitBtn>
                        </UnitToggleGroup>
                      </UnitHeader>
                      <StyledInput
                        type="number"
                        step="0.1"
                        placeholder={heightUnit === 'cm' ? '175' : '5.9'}
                        value={displayHeight}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        $hasError={Boolean(errors.height)}
                        data-testid="input-height"
                      />
                      {errors.height && <ErrorMsg>{errors.height.message}</ErrorMsg>}
                    </FieldGroup>

                    <FieldGroup>
                      <UnitHeader>
                        <Label>{t('auth.weight')}</Label>
                        <UnitToggleGroup>
                          <UnitBtn
                            type="button"
                            $active={weightUnit === 'kg'}
                            onClick={() => toggleWeightUnit('kg')}
                          >
                            KG
                          </UnitBtn>
                          <UnitBtn
                            type="button"
                            $active={weightUnit === 'lbs'}
                            onClick={() => toggleWeightUnit('lbs')}
                          >
                            LBS
                          </UnitBtn>
                        </UnitToggleGroup>
                      </UnitHeader>
                      <StyledInput
                        type="number"
                        step="0.1"
                        placeholder={weightUnit === 'kg' ? '70' : '154'}
                        value={displayWeight}
                        onChange={(e) => handleWeightChange(e.target.value)}
                        $hasError={Boolean(errors.weight)}
                        data-testid="input-weight"
                      />
                      {errors.weight && <ErrorMsg>{errors.weight.message}</ErrorMsg>}
                    </FieldGroup>
                  </TwoColRow>

                  {/* Fitness Goal Chips (Athletes Only) */}
                  {!isTrainer && (
                    <FieldGroup>
                      <Label>{t('auth.fitnessGoal')}</Label>
                      <ChipsWrap>
                        {PRESET_GOALS.map((g) => {
                          const label = t(g.labelKey);
                          const isSelected = selectedGoal === label;
                          return (
                            <ChipBtn
                              key={g.key}
                              type="button"
                              $selected={isSelected}
                              onClick={() => setValue('goal', label, { shouldValidate: true })}
                              data-testid={`goal-${g.key}`}
                            >
                              {label}
                            </ChipBtn>
                          );
                        })}
                      </ChipsWrap>

                      {/* Custom goal input */}
                      <StyledInput
                        type="text"
                        placeholder={t('auth.customGoalPlaceholder')}
                        value={selectedGoal}
                        onChange={(e) => setValue('goal', e.target.value, { shouldValidate: true })}
                        style={{ marginTop: '0.65rem' }}
                        data-testid="input-custom-goal"
                      />
                      {errors.goal && <ErrorMsg>{errors.goal.message}</ErrorMsg>}
                    </FieldGroup>
                  )}

                  {/* Actions */}
                  <NavActions>
                    <SecondaryBtn type="button" onClick={() => setStep(1)}>
                      <ChevronLeft size={18} />
                      <span>{t('auth.back')}</span>
                    </SecondaryBtn>
                    <PrimaryBtn
                      type="button"
                      onClick={handleNextFromStep2}
                      data-testid="step2-next"
                    >
                      <span>{t('auth.continue')}</span>
                      <ChevronRight size={18} />
                    </PrimaryBtn>
                  </NavActions>
                </StepSection>
              )}

              {/* STEP 3: Coaching Profile (Trainers Only) */}
              {step === 3 && isTrainer && (
                <StepSection data-testid="signup-step-3-trainer">
                  <FormTitle>{t('auth.stepCoaching')}</FormTitle>
                  <FormSubtitle>Highlight your expertise, rate, and training locations</FormSubtitle>

                  {/* Description */}
                  <FieldGroup>
                    <Label>{t('auth.servicesDescription')}</Label>
                    <StyledTextarea
                      rows={3}
                      placeholder={t('auth.servicesPlaceholder')}
                      {...register('description')}
                      $hasError={Boolean(errors.description)}
                      data-testid="input-description"
                    />
                    {errors.description && <ErrorMsg>{errors.description.message}</ErrorMsg>}
                  </FieldGroup>

                  {/* Monthly Rate ($ USD) */}
                  <FieldGroup>
                    <Label>{t('auth.monthlyPrice')}</Label>
                    <StyledInput
                      type="number"
                      placeholder={t('auth.monthlyPricePlaceholder')}
                      {...register('monthlyPrice', { valueAsNumber: true })}
                      $hasError={Boolean(errors.monthlyPrice)}
                      data-testid="input-monthlyPrice"
                    />
                    {errors.monthlyPrice && <ErrorMsg>{errors.monthlyPrice.message}</ErrorMsg>}
                  </FieldGroup>

                  {/* Specialization Tags */}
                  <FieldGroup>
                    <Label>{t('auth.specializations')}</Label>
                    <ChipsWrap>
                      {PRESET_SPECIALIZATIONS.map((tag) => {
                        const isSelected = currentSpecializations.includes(tag);
                        return (
                          <ChipBtn
                            key={tag}
                            type="button"
                            $selected={isSelected}
                            onClick={() => toggleSpecialization(tag)}
                            data-testid={`tag-${tag}`}
                          >
                            {tag}
                          </ChipBtn>
                        );
                      })}
                    </ChipsWrap>

                    {/* Add Custom Tag */}
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
                        data-testid="input-custom-tag"
                      />
                      <AddSmallBtn type="button" onClick={addCustomTag}>
                        <Plus size={16} />
                      </AddSmallBtn>
                    </TagInputRow>
                    {errors.specializations && <ErrorMsg>{errors.specializations.message}</ErrorMsg>}
                  </FieldGroup>

                  {/* Gym Affiliations (max 3, optional) */}
                  <FieldGroup>
                    <Label>
                      {t('auth.gymAffiliations')} ({currentGyms.length}/3)
                    </Label>
                    {currentGyms.length > 0 && (
                      <SelectedTagsWrap>
                        {currentGyms.map((gym) => (
                          <GymBadge key={gym}>
                            <Building size={14} />
                            <span>{gym}</span>
                            <RemoveBtn type="button" onClick={() => removeGym(gym)}>
                              <X size={12} />
                            </RemoveBtn>
                          </GymBadge>
                        ))}
                      </SelectedTagsWrap>
                    )}

                    {currentGyms.length < 3 && (
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
                          data-testid="input-gym"
                        />
                        <AddSmallBtn type="button" onClick={addGym}>
                          <Plus size={16} />
                        </AddSmallBtn>
                      </TagInputRow>
                    )}
                  </FieldGroup>

                  {/* Nav Actions */}
                  <NavActions>
                    <SecondaryBtn type="button" onClick={() => setStep(2)}>
                      <ChevronLeft size={18} />
                      <span>{t('auth.back')}</span>
                    </SecondaryBtn>
                    <PrimaryBtn
                      type="button"
                      onClick={handleNextFromStep3}
                      data-testid="step3-next"
                    >
                      <span>{t('auth.continue')}</span>
                      <ChevronRight size={18} />
                    </PrimaryBtn>
                  </NavActions>
                </StepSection>
              )}

              {/* CONFIRMATION STEP: (Step 3 for Client, Step 4 for Trainer) */}
              {((!isTrainer && step === 3) || (isTrainer && step === 4)) && (
                <StepSection data-testid="signup-step-confirmation">
                  <FormTitle>{t('auth.reviewTitle')}</FormTitle>
                  <FormSubtitle>{t('auth.reviewSubtitle')}</FormSubtitle>

                  {/* Summary Card 1: Account Information */}
                  <SummaryCard>
                    <SummaryCardHeader>
                      <SummaryCardTitle>{t('auth.accountSection')}</SummaryCardTitle>
                      <EditLinkBtn type="button" onClick={() => setStep(1)} data-testid="edit-step-1">
                        <Edit2 size={13} />
                        <span>{t('auth.edit')}</span>
                      </EditLinkBtn>
                    </SummaryCardHeader>
                    <SummaryRow>
                      <SummaryLabel>Role:</SummaryLabel>
                      <SummaryValHighlight>{watch('role')}</SummaryValHighlight>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryLabel>Username:</SummaryLabel>
                      <SummaryVal>{watch('username')}</SummaryVal>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryLabel>Email:</SummaryLabel>
                      <SummaryVal>{watch('email')}</SummaryVal>
                    </SummaryRow>
                    {watch('avatarUrl') && (
                      <SummaryRow>
                        <SummaryLabel>{t('auth.profilePhoto')}:</SummaryLabel>
                        <SummaryThumbImg
                          src={watch('avatarUrl')}
                          alt={t('auth.avatarPreviewAlt')}
                          data-testid="summary-avatar-img"
                        />
                      </SummaryRow>
                    )}
                  </SummaryCard>

                  {/* Summary Card 2: Physical Profile */}
                  <SummaryCard>
                    <SummaryCardHeader>
                      <SummaryCardTitle>{t('auth.profileSection')}</SummaryCardTitle>
                      <EditLinkBtn type="button" onClick={() => setStep(2)} data-testid="edit-step-2">
                        <Edit2 size={13} />
                        <span>{t('auth.edit')}</span>
                      </EditLinkBtn>
                    </SummaryCardHeader>
                    <SummaryRow>
                      <SummaryLabel>{t('auth.age')}:</SummaryLabel>
                      <SummaryVal>{watch('age')} yrs</SummaryVal>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryLabel>{t('auth.gender')}:</SummaryLabel>
                      <SummaryVal style={{ textTransform: 'capitalize' }}>{watch('gender')}</SummaryVal>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryLabel>{t('auth.height')}:</SummaryLabel>
                      <SummaryVal>{watch('height')} cm</SummaryVal>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryLabel>{t('auth.weight')}:</SummaryLabel>
                      <SummaryVal>{watch('weight')} kg</SummaryVal>
                    </SummaryRow>
                    {!isTrainer && watch('goal') && (
                      <SummaryRow>
                        <SummaryLabel>{t('auth.fitnessGoal')}:</SummaryLabel>
                        <SummaryValHighlight>{watch('goal')}</SummaryValHighlight>
                      </SummaryRow>
                    )}
                  </SummaryCard>

                  {/* Summary Card 3: Coaching Profile (Trainer Only) */}
                  {isTrainer && (
                    <SummaryCard>
                      <SummaryCardHeader>
                        <SummaryCardTitle>{t('auth.coachingSection')}</SummaryCardTitle>
                        <EditLinkBtn type="button" onClick={() => setStep(3)} data-testid="edit-step-3">
                          <Edit2 size={13} />
                          <span>{t('auth.edit')}</span>
                        </EditLinkBtn>
                      </SummaryCardHeader>
                      <SummaryRow>
                        <SummaryLabel>Monthly Rate:</SummaryLabel>
                        <SummaryValHighlight>${watch('monthlyPrice')} USD / mo</SummaryValHighlight>
                      </SummaryRow>
                      <SummaryRow>
                        <SummaryLabel>Specializations:</SummaryLabel>
                        <SummaryVal>{currentSpecializations.join(', ')}</SummaryVal>
                      </SummaryRow>
                      {currentGyms.length > 0 && (
                        <SummaryRow>
                          <SummaryLabel>Gyms:</SummaryLabel>
                          <SummaryVal>{currentGyms.join(', ')}</SummaryVal>
                        </SummaryRow>
                      )}
                      <SummaryRow style={{ alignItems: 'flex-start' }}>
                        <SummaryLabel>Services:</SummaryLabel>
                        <SummaryVal style={{ whiteSpace: 'pre-wrap' }}>{watch('description')}</SummaryVal>
                      </SummaryRow>
                      {watch('logoUrl') && (
                        <SummaryRow>
                          <SummaryLabel>{t('auth.trainerLogo')}:</SummaryLabel>
                          <SummaryThumbImg
                            src={watch('logoUrl')}
                            alt={t('auth.logoPreviewAlt')}
                            data-testid="summary-logo-img"
                          />
                        </SummaryRow>
                      )}
                    </SummaryCard>
                  )}

                  {/* Final Actions */}
                  <NavActions>
                    <SecondaryBtn type="button" onClick={() => setStep(isTrainer ? 3 : 2)}>
                      <ChevronLeft size={18} />
                      <span>{t('auth.back')}</span>
                    </SecondaryBtn>
                    <SubmitPrimaryBtn
                      type="submit"
                      disabled={disabled}
                      data-testid="confirm-signup-btn"
                    >
                      {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                      {isLocked
                        ? t('auth.wait', { time: formatCountdown(remainingSeconds) })
                        : loading
                          ? t('auth.creatingAccount')
                          : t('auth.confirmAndCreate')}
                    </SubmitPrimaryBtn>
                  </NavActions>
                </StepSection>
              )}
            </form>

            <DividerRow>
              <Line />
              <OrText>{t('common.or')}</OrText>
              <Line />
            </DividerRow>

            <FooterText>
              {t('auth.alreadyHaveAccount')}{' '}
              <LoginLink to="/login">{t('auth.login')}</LoginLink>
            </FooterText>
          </FormCard>
        </FormInner>
      </FormPanel>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0d1121;
`;

const HeroPanel = styled.div`
  display: none;
  position: relative;
  overflow: hidden;
  background-color: #161b33;

  @media (min-width: 1024px) {
    display: flex;
    width: 38%;
  }
`;

const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.35;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  line-height: 1.2;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.025em;
`;

const HeroFooter = styled.div`
  margin-bottom: 2rem;
`;

const HeroQuote = styled.p`
  font-size: 1.15rem;
  line-height: 1.6;
  color: rgba(237, 242, 244, 0.85);
  font-style: italic;
  max-width: 24rem;
`;

const FormPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top right, #1d2342 0%, #0e1224 100%);
  padding: 2.5rem 1.5rem;
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 36rem;
`;

const MobileBrand = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileBrandTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
`;

const FormCard = styled.div`
  background: linear-gradient(180deg, #181d38 0%, #12162f 100%);
  border: 1px solid rgba(124, 132, 170, 0.16);
  border-radius: 1.85rem;
  padding: 2.25rem 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
`;

const ProgressHeader = styled.div`
  margin-bottom: 1.75rem;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: linear-gradient(90deg, #ff8a93 0%, #ef233c 100%);
  border-radius: 9999px;
  transition: width 0.35s ease;
`;

const StepIndicatorText = styled.p`
  margin: 0.6rem 0 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: #c5cbe9;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  text-align: right;
`;

const StepSection = styled.div`
  animation: fadeIn 0.25s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FormTitle = styled.h2`
  font-size: 1.85rem;
  font-weight: 750;
  color: #ffffff;
  margin: 0 0 0.3rem;
  text-align: center;
  letter-spacing: -0.01em;
`;

const FormSubtitle = styled.p`
  color: #9da4c4;
  font-size: 0.85rem;
  margin: 0 0 1.85rem;
  text-align: center;
`;

const FieldGroup = styled.div`
  margin-bottom: 1.15rem;
`;

const Label = styled.label`
  display: block;
  color: #d2d6ee;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.45rem;
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1.15rem;
  color: #8b92b5;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.82rem 1.15rem 0.82rem 3.1rem;
  border-radius: 9999px;
  background-color: #0f1329;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ef233c' : 'rgba(124, 132, 170, 0.22)')};
  color: #ffffff;
  font-size: 0.88rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #ef233c;
  }

  &::placeholder {
    color: #697092;
  }
`;

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.85rem 1.15rem;
  border-radius: 1rem;
  background-color: #0f1329;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ef233c' : 'rgba(124, 132, 170, 0.22)')};
  color: #ffffff;
  font-size: 0.88rem;
  outline: none;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    border-color: #ef233c;
  }

  &::placeholder {
    color: #697092;
  }
`;

const TogglePasswordBtn = styled.button`
  position: absolute;
  right: 1.15rem;
  background: none;
  border: none;
  color: #8b92b5;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #ffffff;
  }
`;

const ErrorMsg = styled.p`
  margin: 0.35rem 0 0 0.85rem;
  color: #ff8a93;
  font-size: 0.74rem;
  font-weight: 500;
`;

const TwoColRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-top: 0.4rem;
`;

const RoleCard = styled.button<{ $selected?: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.95rem;
  border-radius: 1.15rem;
  background: ${({ $selected }) =>
    $selected
      ? 'linear-gradient(180deg, rgba(239, 35, 60, 0.18) 0%, rgba(239, 35, 60, 0.06) 100%)'
      : '#0f1329'};
  border: 1.5px solid ${({ $selected }) => ($selected ? '#ef233c' : 'rgba(124, 132, 170, 0.18)')};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: #ef233c;
  }
`;

const RoleIconWrap = styled.div<{ $selected?: boolean }>`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.75rem;
  background-color: ${({ $selected }) => ($selected ? '#ef233c' : '#1d2342')};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const RoleTextWrap = styled.div`
  flex: 1;
`;

const RoleName = styled.p`
  margin: 0 0 0.2rem;
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 700;
`;

const RoleDesc = styled.p`
  margin: 0;
  color: #8b92b5;
  font-size: 0.68rem;
  line-height: 1.35;
`;

const CheckBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #ef233c;
  color: white;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GenderGrid = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const GenderBtn = styled.button<{ $selected?: boolean }>`
  flex: 1;
  padding: 0.75rem 0.35rem;
  border-radius: 9999px;
  background-color: ${({ $selected }) => ($selected ? '#ef233c' : '#0f1329')};
  border: 1px solid ${({ $selected }) => ($selected ? '#ef233c' : 'rgba(124, 132, 170, 0.22)')};
  color: ${({ $selected }) => ($selected ? '#ffffff' : '#b2b8d8')};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
`;

const UnitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.45rem;
`;

const UnitToggleGroup = styled.div`
  display: flex;
  background-color: #0f1329;
  border-radius: 9999px;
  padding: 2px;
  border: 1px solid rgba(124, 132, 170, 0.2);
`;

const UnitBtn = styled.button<{ $active?: boolean }>`
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 700;
  background-color: ${({ $active }) => ($active ? '#ef233c' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#7d84a5')};
  border: none;
  cursor: pointer;
`;

const ChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ChipBtn = styled.button<{ $selected?: boolean }>`
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  background: ${({ $selected }) =>
    $selected
      ? 'linear-gradient(180deg, #ff8a93 0%, #ef233c 100%)'
      : '#0f1329'};
  border: 1px solid ${({ $selected }) => ($selected ? '#ef233c' : 'rgba(124, 132, 170, 0.22)')};
  color: ${({ $selected }) => ($selected ? '#ffffff' : '#b6bcdb')};
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const TagInputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.6rem;
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

const SelectedTagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
`;

const GymBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: rgba(239, 35, 60, 0.15);
  border: 1px solid rgba(239, 35, 60, 0.35);
  color: #ff9da4;
  padding: 0.35rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.76rem;
  font-weight: 600;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #ff9da4;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
`;

const NavActions = styled.div`
  display: flex;
  gap: 0.85rem;
  margin-top: 1.6rem;
`;

const PrimaryBtn = styled.button`
  flex: 1;
  padding: 0.85rem;
  border-radius: 9999px;
  background-color: #ef233c;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d90429;
  }
`;

const SecondaryBtn = styled.button`
  padding: 0.85rem 1.25rem;
  border-radius: 9999px;
  background-color: #0f1329;
  border: 1px solid rgba(124, 132, 170, 0.25);
  color: #c5cbe9;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;

  &:hover {
    background-color: #171d38;
  }
`;

const SubmitPrimaryBtn = styled.button`
  flex: 1;
  padding: 0.85rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, #ff8a93 0%, #ef233c 100%);
  color: white;
  font-weight: 750;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 0 16px rgba(239, 35, 60, 0.4);

  &:disabled {
    background: #4a5068;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Summary cards for Confirmation step
const SummaryCard = styled.div`
  background-color: #0f1329;
  border: 1px solid rgba(124, 132, 170, 0.16);
  border-radius: 1.15rem;
  padding: 1rem 1.25rem;
  margin-bottom: 0.85rem;
`;

const SummaryCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.65rem;
  border-bottom: 1px solid rgba(124, 132, 170, 0.12);
  padding-bottom: 0.45rem;
`;

const SummaryCardTitle = styled.h4`
  margin: 0;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const EditLinkBtn = styled.button`
  background: none;
  border: none;
  color: #ef233c;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    color: #ff8a93;
    text-decoration: underline;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  margin-bottom: 0.35rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  color: #8c93b3;
`;

const SummaryVal = styled.span`
  color: #e4e7fa;
  font-weight: 500;
  text-align: right;
`;

const SummaryValHighlight = styled.span`
  color: #ff9da4;
  font-weight: 700;
  text-align: right;
`;

const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0 1rem;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: rgba(124, 132, 170, 0.18);
`;

const OrText = styled.span`
  font-size: 0.75rem;
  color: #8c93b3;
  text-transform: uppercase;
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 0.82rem;
  color: #8c93b3;
  margin: 0;
`;

const LoginLink = styled(Link)`
  color: #ef233c;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PhotoUploadsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1.25rem;
  width: 100%;
`;

const PhotoUploadCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

const IconBoxWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const AvatarUploadBox = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(124, 132, 170, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #ef233c;
    background: rgba(239, 35, 60, 0.08);
  }
`;

const AvatarPreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const LogoUploadBox = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(124, 132, 170, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #ef233c;
    background: rgba(239, 35, 60, 0.08);
  }
`;

const LogoPreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
`;

const RemoveBadgeBtn = styled.button`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ef233c;
  border: 2px solid #1a1e36;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  z-index: 2;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: #d90429;
    transform: scale(1.1);
  }
`;

const UploadIconWrap = styled.div`
  color: #7c84aa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerWrap = styled.div`
  color: #ef233c;
  display: flex;
  align-items: center;
  justify-content: center;

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

const OptionalTag = styled.span`
  font-size: 0.75rem;
  color: #7c84aa;
  font-weight: 400;
  margin-left: 0.35rem;
`;

const SummaryThumbImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;
