import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ActivationMapCard, suggestSecondaryStabilizers } from '../components/exercises/ActivationMapCard';
import { BasicInfoCard } from '../components/exercises/BasicInfoCard';
import { BuilderPageHeader } from '../components/exercises/BuilderPageHeader';
import { DifficultyMovementCard } from '../components/exercises/DifficultyMovementCard';
import { ExercisesHeader } from '../components/exercises/ExercisesHeader';
import {
  ExercisesContent,
  ExercisesMain,
  ExercisesPageShell,
} from '../components/exercises/ExercisesShell';
import { InstructionsCard } from '../components/exercises/InstructionsCard';
import { LivePreviewDock } from '../components/exercises/LivePreviewDock';
import { MediaUploadCard } from '../components/exercises/MediaUploadCard';
import { MetadataTagsCard } from '../components/exercises/MetadataTagsCard';
import { VisualInspirationCard } from '../components/exercises/VisualInspirationCard';
import type {
  Difficulty,
  Equipment,
  ExerciseDraft,
  ExerciseTag,
  MovementType,
  TargetMuscle,
} from '../components/exercises/types';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useListEquipments, useListMuscles } from '../hooks/useListData';

const INITIAL_DRAFT: ExerciseDraft = {
  name: '',
  targetMuscle: 'Quads',
  activationSecondary: 'Glutes',
  activationStabilizers: 'Core',
  equipment: 'Dumbbells',
  instructions: '',
  difficulty: 'Intermediate',
  movementType: null,
  tags: ['Strength', 'Hypertrophy', 'Leg Day'],
};

/**
 * Exercise builder page for creating a new movement entry.
 */
export default function ExerciseBuilderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const username = user?.username ?? 'Alex';
  const [draft, setDraft] = useState<ExerciseDraft>(INITIAL_DRAFT);
  const { data: equipments } = useListEquipments();
  const { data: muscles } = useListMuscles();
  const equipmentOptions = equipments?.map((e) => e.name);
  const muscleOptions = muscles?.map((m) => m.name);
  const muscleKey = useMemo(
    () => (muscles?.length ? muscles.map((m) => m.name).join('|') : ''),
    [muscles],
  );
  const prevMuscleKeyRef = useRef('');

  useEffect(() => {
    if (!muscles?.length) return;
    const names = muscles.map((m) => m.name);
    const muscleListJustLoaded = prevMuscleKeyRef.current === '' && muscleKey !== '';
    prevMuscleKeyRef.current = muscleKey;

    setDraft((prev) => {
      const target = names.includes(prev.targetMuscle) ? prev.targetMuscle : names[0];
      const suggested = suggestSecondaryStabilizers(muscles, target);
      const targetChanged = target !== prev.targetMuscle;
      const resetSecondary =
        targetChanged || muscleListJustLoaded || !names.includes(prev.activationSecondary);
      const resetStabilizers =
        targetChanged || muscleListJustLoaded || !names.includes(prev.activationStabilizers);
      return {
        ...prev,
        targetMuscle: target,
        activationSecondary: resetSecondary ? suggested.secondary : prev.activationSecondary,
        activationStabilizers: resetStabilizers ? suggested.stabilizers : prev.activationStabilizers,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `muscleKey` fingerprints `muscles`; including `muscles` retriggers on query ref churn.
  }, [muscleKey, draft.targetMuscle]);

  const handleActivationSecondaryChange = useCallback((activationSecondary: string) => {
    setDraft((prev) => ({ ...prev, activationSecondary }));
  }, []);

  const handleActivationStabilizersChange = useCallback((activationStabilizers: string) => {
    setDraft((prev) => ({ ...prev, activationStabilizers }));
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setDraft((prev) => ({ ...prev, name }));
  }, []);

  const handleTargetMuscleChange = useCallback((targetMuscle: TargetMuscle) => {
    setDraft((prev) => ({ ...prev, targetMuscle }));
  }, []);

  const handleEquipmentChange = useCallback((equipment: Equipment) => {
    setDraft((prev) => ({ ...prev, equipment }));
  }, []);

  const handleInstructionsChange = useCallback((instructions: string) => {
    setDraft((prev) => ({ ...prev, instructions }));
  }, []);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setDraft((prev) => ({ ...prev, difficulty }));
  }, []);

  const handleMovementTypeChange = useCallback((movementType: MovementType) => {
    setDraft((prev) => ({ ...prev, movementType }));
  }, []);

  const handleAddTag = useCallback((tag: ExerciseTag) => {
    setDraft((prev) =>
      prev.tags.includes(tag) ? prev : { ...prev, tags: [...prev.tags, tag] },
    );
  }, []);

  const handleRemoveTag = useCallback((tag: ExerciseTag) => {
    setDraft((prev) => ({ ...prev, tags: prev.tags.filter((existing) => existing !== tag) }));
  }, []);

  const handleDiscard = () => {
    setDraft(INITIAL_DRAFT);
    navigate('/exercises');
  };

  const handlePublish = () => {
    navigate('/exercises');
  };

  return (
    <ExercisesPageShell>
      <Sidebar username={username} />
      <ExercisesMain>
        <ExercisesHeader title="Workout Builder" />
        <ExercisesContent>
          <BuilderPageHeader onDiscard={handleDiscard} onPublish={handlePublish} />
          <BentoGrid>
            <LeftColumn>
              <BasicInfoCard
                name={draft.name}
                targetMuscle={draft.targetMuscle}
                equipment={draft.equipment}
                targetMuscleOptions={muscleOptions}
                equipmentOptions={equipmentOptions}
                onNameChange={handleNameChange}
                onTargetMuscleChange={handleTargetMuscleChange}
                onEquipmentChange={handleEquipmentChange}
              />
              <InstructionsCard value={draft.instructions} onChange={handleInstructionsChange} />
              <ActivationMapCard
                muscleNames={muscleOptions ?? []}
                primary={draft.targetMuscle}
                secondary={draft.activationSecondary}
                stabilizers={draft.activationStabilizers}
                onPrimaryChange={handleTargetMuscleChange}
                onSecondaryChange={handleActivationSecondaryChange}
                onStabilizersChange={handleActivationStabilizersChange}
              />
            </LeftColumn>
            <RightColumn>
              <MediaUploadCard />
              <DifficultyMovementCard
                difficulty={draft.difficulty}
                movementType={draft.movementType}
                onDifficultyChange={handleDifficultyChange}
                onMovementTypeChange={handleMovementTypeChange}
              />
              <MetadataTagsCard
                tags={draft.tags}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />
              <VisualInspirationCard />
            </RightColumn>
          </BentoGrid>
        </ExercisesContent>
        <LivePreviewDock />
      </ExercisesMain>
    </ExercisesPageShell>
  );
}

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;

  @media (min-width: 1100px) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
