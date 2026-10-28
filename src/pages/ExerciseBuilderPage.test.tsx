import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import ExerciseBuilderPage from './ExerciseBuilderPage';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@test.com',
      username: 'testuser',
      hasPaid: false,
      role: { id: 'r1', name: 'Admin' },
    },
    isAuthenticated: true,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('../hooks/usePermissions', () => ({
  useMyPermissions: () => ({ data: [], isLoading: false }),
  useHasPermission: () => true,
  useEntitlements: () => ({ data: undefined }),
  hasAnyEntitlementCapability: () => true,
  isEntitlementLimitReached: () => false,
}));

vi.mock('../hooks/useListData', () => ({
  useListEquipments: () => ({
    data: [{ id: '1', name: 'Dumbbells', type: 'free_weight', description: '' }],
    isLoading: false,
    isError: false,
  }),
  useListMuscles: () => ({
    data: [
      { id: '1', name: 'Quads', type: 'Lower Body', description: '' },
      { id: '2', name: 'Chest', type: 'Upper Body', description: '' },
    ],
    isLoading: false,
    isError: false,
  }),
}));

const mockUpdateMutate = vi.fn();
const mockNavigate = vi.fn();
let mockExistingExercise: Record<string, unknown> | undefined;

const catalogExercise = {
  id: 'ex-1',
  name: 'Barbell Bench Press',
  targetMuscle: { en: 'Chest', es: 'Pecho' },
  equipment: { en: 'Dumbbells', es: 'Mancuernas' },
  instructions: { en: 'Press the bar', es: 'Empuja la barra' },
  activationMap: {
    principal: { en: 'Chest', es: 'Pecho' },
    secondary: { en: 'Quads', es: 'Cuádriceps' },
    stabilizers: { en: 'Chest', es: 'Pecho' },
  },
  difficulty: 'Intermediate',
  movementType: 'Compound',
  tags: ['push'],
  images: [],
  ownerId: null,
  gymId: null,
  createdAt: '',
  updatedAt: '',
};

vi.mock('../hooks/useExercises', () => ({
  useCreateExercise: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateExercise: () => ({
    mutate: mockUpdateMutate,
    isPending: false,
  }),
  useExercise: (id: string | undefined) => ({
    data: id ? mockExistingExercise : undefined,
    isError: false,
  }),
}));

vi.mock('../hooks/useTags', () => ({
  useTags: () => ({
    data: [],
    isLoading: false,
  }),
  useCreateTag: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    NavLink: ({ children, to }: { children: ReactNode; to: string }) =>
      createElement('a', { href: to }, children),
  };
});

function renderWithRouter(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(MemoryRouter, null, children),
  });
}

describe('ExerciseBuilderPage', () => {
  it('should render "Workout Builder" header text', () => {
    renderWithRouter(<ExerciseBuilderPage />);

    expect(screen.getByText('Workout Builder')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = renderWithRouter(<ExerciseBuilderPage />);

    expect(container).toBeTruthy();
  });
});

describe('ExerciseBuilderPage edit mode', () => {
  function renderEdit() {
    return render(
      <MemoryRouter initialEntries={['/exercises/ex-1/edit']}>
        <Routes>
          <Route path="/exercises/:exerciseId/edit" element={<ExerciseBuilderPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prefills the form and saves changes, keeping untouched translations', () => {
    mockExistingExercise = catalogExercise;
    renderEdit();

    expect(screen.getByDisplayValue('Barbell Bench Press')).toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue('Barbell Bench Press'), {
      target: { value: 'Flat Bench Press' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(mockUpdateMutate).toHaveBeenCalledTimes(1);
    const [{ id, params }] = mockUpdateMutate.mock.calls[0];
    expect(id).toBe('ex-1');
    expect(params.name).toBe('Flat Bench Press');
    expect(params.instructions).toEqual({ en: 'Press the bar', es: 'Empuja la barra' });
    expect(params.activationMap.secondary).toEqual({ en: 'Quads', es: 'Cuádriceps' });
  });

  it('sends admins back to the catalog for user-created exercises', () => {
    mockExistingExercise = { ...catalogExercise, ownerId: 'trainer-1' };
    renderEdit();

    expect(screen.queryByDisplayValue('Barbell Bench Press')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/exercises');
    expect(mockUpdateMutate).not.toHaveBeenCalled();
  });
});
