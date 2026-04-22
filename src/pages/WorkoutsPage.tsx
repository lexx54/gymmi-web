import { useCallback, useState } from 'react';
import { ExerciseCard } from '../components/workouts/ExerciseCard';
import { ExerciseLibrary } from '../components/workouts/ExerciseLibrary';
import { RoutineDropzone } from '../components/workouts/RoutineDropzone';
import { RoutineToolbar } from '../components/workouts/RoutineToolbar';
import { StartFab } from '../components/workouts/StartFab';
import {
  LibraryPane,
  RoutinePane,
  WorkoutsBuilderGrid,
  WorkoutsMain,
  WorkoutsPageShell,
} from '../components/workouts/WorkoutsShell';
import { WorkoutsHeader } from '../components/workouts/WorkoutsHeader';
import type {
  Category,
  LibraryExercise,
  RoutineExercise,
  SetField,
} from '../components/workouts/types';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';

const LIBRARY_EXERCISES: LibraryExercise[] = [
  {
    id: 'lib-bench',
    name: 'Barbell Bench Press',
    category: 'Chest',
    modality: 'Compound',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUCX4rTYYQrIVcH_UHD6T5ewZLKNvhI13gAZidfsySV2SAlFDIv8Zy9itlZlltWXcEDZwuw1_T8cC5D9CXSAoN7xlxB0TiuaueJUzNDGzGT7S82j_4Htgeq0HlCRrlMEYiRh-pkYc-y73OVcxmoRXEQmmhWGaWukSFpYM-HT2iguM6ncWkdMwg9I7pNg9TBvc7lNmBPAMbHdGmMnPdU1l7OZGDm6ZppsEIP3A3Ld8Lx8Ym0QkU6WXhiIISbQYknOCc830muFW9evg',
  },
  {
    id: 'lib-squat',
    name: 'Back Squats',
    category: 'Legs',
    modality: 'Compound',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIkfyU3-mFlarEO3C98Q1kXVjt6cLct2WwJ2tdUioJy43b73HdCLENbbvlnUU8P_5MaRM_-2r6Fue7be5vzasFK7FNkKGJELADabKS1vwck3daHH6odywhfL6GCtx4mDFI0ChYr7DWwK1oNIeB3Otg2s_z7fXRcVwAqzVgs56Nh5taAIPSsht-h4IJIKNSJ1QPZnRBOyvtMAaGReeBkTP03Ns1pT-Vhd_Xcq63WyS-1q5tlhs1Ig2gBcl-IyS2lArUXvfsFvSKd7c',
  },
  {
    id: 'lib-deadlift',
    name: 'Conventional Deadlift',
    category: 'Back',
    modality: 'Compound',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAn2nB9kyRWrBBffkUmTnrs5pB6wXA4jA7BissbUEnVJsgDm-QgWzcKFWjnUSORAAjgRnrtGSAMz9JdlVsEaVgmI0Yp_vT0fP6oFckvYFtzzgULYG--6iYp6ztMK0taP4jHMt7rQiuy_7SXShn80KxdLmmr7nQno83G1PZlkTe7JBNsAhdwK7ZCojfKBE3IlFnTzdccHK71DizKS9uprYVfaOK3YOOJtfhj_oY3dhcNqFhAaDf08qt3iElBV6dCe5-Yo1PoDwONJQ8',
  },
  {
    id: 'lib-pullups',
    name: 'Wide Grip Pull-Ups',
    category: 'Back',
    modality: 'Bodyweight',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3UqyKTy_L5slBHac_JigxxHYWpahE2MTUL9qp68UKx0ZvRjwkul44fVLMujomEpeyT8rjTFCOXsr9yqB_uYBR2VM6lg_pKVBnhPJJAF6DtwahK_5rgGydbDGmqfiPu569HGmHlpLKWLuKgc_XJcx7_LsbW1MDhlp75gG7u-BvIc95uGekR5PsVuKcl6aNBODOiYHGLQ5dlNSt5V8nhFangJVyhvOsS3lslJfcTma-2HFXc2QpPSG7UvHSZJxCOvHicgkReUhsAGs',
  },
];

const INITIAL_ROUTINE: RoutineExercise[] = [
  {
    id: 'routine-bench',
    exerciseId: 'lib-bench',
    name: 'Barbell Bench Press',
    target: 'Pectoralis Major',
    sets: [
      { id: 'bench-set-1', weight: 100, reps: 8, rest: '90s', rpe: 8 },
      { id: 'bench-set-2', weight: 100, reps: 8, rest: '90s', rpe: 8 },
    ],
  },
  {
    id: 'routine-flyes',
    exerciseId: 'lib-flyes',
    name: 'Incline Dumbbell Flyes',
    target: 'Upper Chest',
    sets: [{ id: 'flyes-set-1', weight: 22, reps: 12, rest: '60s', rpe: 9 }],
  },
];

let setCounter = 0;
const nextSetId = () => {
  setCounter += 1;
  return `set-${Date.now()}-${setCounter}`;
};

/**
 * Routine builder page (`/workouts`).
 * Pairs the exercise library with an active routine canvas.
 */
export default function WorkoutsPage() {
  const { user } = useAuth();
  const username = user?.username ?? 'Alex';

  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [routineTitle, setRoutineTitle] = useState('Hypertrophy A - Push Day');
  const [routine, setRoutine] = useState<RoutineExercise[]>(INITIAL_ROUTINE);

  const handleAddSet = useCallback((exerciseId: string) => {
    setRoutine((current) =>
      current.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        const previous = exercise.sets[exercise.sets.length - 1];
        const nextSet = {
          id: nextSetId(),
          weight: previous?.weight ?? 0,
          reps: previous?.reps ?? 0,
          rest: previous?.rest ?? '90s',
          rpe: previous?.rpe ?? 0,
        };
        return { ...exercise, sets: [...exercise.sets, nextSet] };
      }),
    );
  }, []);

  const handleRemoveSet = useCallback((exerciseId: string, setId: string) => {
    setRoutine((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) }
          : exercise,
      ),
    );
  }, []);

  const handleRemoveExercise = useCallback((exerciseId: string) => {
    setRoutine((current) => current.filter((exercise) => exercise.id !== exerciseId));
  }, []);

  const handleUpdateSet = useCallback(
    (exerciseId: string, setId: string, field: SetField, value: number) => {
      setRoutine((current) =>
        current.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id === setId ? { ...set, [field]: value } : set,
                ),
              }
            : exercise,
        ),
      );
    },
    [],
  );

  return (
    <WorkoutsPageShell>
      <Sidebar username={username} />
      <WorkoutsMain>
        <WorkoutsHeader />
        <WorkoutsBuilderGrid>
          <LibraryPane>
            <ExerciseLibrary
              exercises={LIBRARY_EXERCISES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              totalCount={124}
            />
          </LibraryPane>

          <RoutinePane>
            <RoutineToolbar
              title={routineTitle}
              onTitleChange={setRoutineTitle}
              durationLabel="65 Minutes"
              intensityLabel="High"
            />

            {routine.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                position={index + 1}
                onAddSet={() => handleAddSet(exercise.id)}
                onRemoveSet={(setId) => handleRemoveSet(exercise.id, setId)}
                onRemoveExercise={() => handleRemoveExercise(exercise.id)}
                onUpdateSet={(setId, field, value) =>
                  handleUpdateSet(exercise.id, setId, field, value)
                }
              />
            ))}

            <RoutineDropzone />
          </RoutinePane>
        </WorkoutsBuilderGrid>
        <StartFab />
      </WorkoutsMain>
    </WorkoutsPageShell>
  );
}
