import { Dumbbell, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styled from 'styled-components';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { useAuth } from '../../context/AuthContext';
import { useWorkouts, useDeleteWorkout } from '../../hooks/useWorkouts';
import { useMyGym } from '../../hooks/useGyms';
import type { WorkoutRoutine } from '../../services/api/workouts';

export default function GymCatalogPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: routines = [], isLoading, isError } = useWorkouts();
  const { data: gymData } = useMyGym(true);
  const deleteMutation = useDeleteWorkout();
  const [search, setSearch] = useState('');

  const facilityRoutines = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return routines.filter((routine) => {
      const matchesSearch =
        !needle ||
        `${routine.name} ${routine.description ?? ''}`.toLowerCase().includes(needle);
      return matchesSearch;
    });
  }, [routines, search]);

  const removeRoutine = async (routine: WorkoutRoutine) => {
    if (!window.confirm(t('workouts.confirmDelete', { name: routine.name }))) return;
    try {
      await deleteMutation.mutateAsync(routine.id);
      toast.success(t('workouts.deleted'));
    } catch {
      toast.error(t('workouts.deleteFailed'));
    }
  };

  return (
    <PageShell>
      <Sidebar username={user?.username ?? 'Alex'} />
      <Main>
        <TopBar title={t('gym.catalogTitle')} />

        <StatsRow>
          <StatPill>
            <Dumbbell size={16} color="#ef233c" />
            <span>
              <strong>{facilityRoutines.length}</strong> {t('gym.curatedRoutines')}
            </span>
          </StatPill>
          <PrimaryActionBtn
            type="button"
            onClick={() => navigate('/workout/new')}
            data-testid="create-catalog-routine-btn"
          >
            <Plus size={16} />
            <span>{t('gym.createRoutine')}</span>
          </PrimaryActionBtn>
        </StatsRow>

        <SearchWrapper>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="search-catalog-routines"
          />
        </SearchWrapper>

        {isLoading && <LoadingText>{t('common.loading')}</LoadingText>}
        {isError && <ErrorText>{t('common.error')}</ErrorText>}

        {!isLoading && facilityRoutines.length === 0 && (
          <EmptyState data-testid="empty-catalog">
            <Dumbbell size={40} color="#7c84aa" />
            <h3>{t('gym.noRoutines')}</h3>
            <p>{t('gym.catalogDesc')}</p>
            <PrimaryActionBtn
              type="button"
              onClick={() => navigate('/workout/new')}
            >
              <Plus size={16} />
              <span>{t('gym.createRoutine')}</span>
            </PrimaryActionBtn>
          </EmptyState>
        )}

        <Grid>
          {facilityRoutines.map((routine) => (
            <Card key={routine.id} data-testid={`catalog-card-${routine.id}`}>
              <CardTop>
                <Badge>{(routine.period ?? routine.difficulty ?? 'routine').toLowerCase()}</Badge>
                <CardActions>
                  <ActionIcon
                    type="button"
                    onClick={() => navigate(`/workout/${routine.id}/edit`)}
                    title={t('workouts.edit')}
                    data-testid={`edit-routine-${routine.id}`}
                  >
                    <Edit3 size={15} />
                  </ActionIcon>
                  <ActionIcon
                    type="button"
                    onClick={() => removeRoutine(routine)}
                    title={t('workouts.delete')}
                    data-testid={`delete-routine-${routine.id}`}
                  >
                    <Trash2 size={15} />
                  </ActionIcon>
                </CardActions>
              </CardTop>

              <RoutineName to={`/workout/${routine.id}`}>{routine.name}</RoutineName>
              <RoutineDesc>{routine.description || '—'}</RoutineDesc>

              <CardFooter>
                <span>{routine.days?.length ?? 0} {t('workouts.days')}</span>
                <span>{gymData?.gym?.name ?? 'Facility'}</span>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </Main>
    </PageShell>
  );
}

const PageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0b1020;
  color: #f7f7ff;
`;

const Main = styled.main`
  flex: 1;
  padding: 1.4rem 2rem 2.5rem;
  overflow-y: auto;
`;



const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

const StatPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.16);
  border-radius: 2rem;
  padding: 0.45rem 0.95rem;
  font-size: 0.84rem;
  color: #c5c9e2;
`;

const PrimaryActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  border: none;
  border-radius: 0.85rem;
  color: #ffffff;
  padding: 0.6rem 1.15rem;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 35, 60, 0.3);
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 35, 60, 0.45);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  max-width: 28rem;
  margin-bottom: 1.5rem;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.95rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7c84aa;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.18);
  border-radius: 0.85rem;
  padding: 0.65rem 1rem 0.65rem 2.45rem;
  color: #f7f7ff;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #ef233c;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.25rem;
`;

const Card = styled.div`
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  border: 1px solid rgba(126, 136, 175, 0.14);
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.85rem;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: rgba(239, 35, 60, 0.4);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Badge = styled.span`
  background: rgba(239, 35, 60, 0.15);
  color: #ff8a93;
  border: 1px solid rgba(239, 35, 60, 0.3);
  padding: 0.2rem 0.55rem;
  border-radius: 2rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const ActionIcon = styled.button`
  background: transparent;
  border: none;
  color: #7c84aa;
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.15s ease;

  &:hover {
    color: #ef233c;
    background: rgba(239, 35, 60, 0.1);
  }
`;

const RoutineName = styled(Link)`
  font-size: 1.1rem;
  font-weight: 700;
  color: #f7f7ff;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #ef233c;
  }
`;

const RoutineDesc = styled.p`
  margin: 0;
  color: #949ab8;
  font-size: 0.82rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(126, 136, 175, 0.1);
  padding-top: 0.75rem;
  font-size: 0.76rem;
  color: #7c84aa;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3.5rem 1.5rem;
  background: #141830;
  border: 1px dashed rgba(126, 136, 175, 0.2);
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;

  h3 {
    margin: 0;
    font-size: 1.15rem;
    color: #f7f7ff;
  }

  p {
    margin: 0;
    max-width: 24rem;
    font-size: 0.85rem;
    color: #949ab8;
  }
`;

const LoadingText = styled.p`
  color: #7c84aa;
  font-size: 0.9rem;
`;

const ErrorText = styled.p`
  color: #ef233c;
  font-size: 0.9rem;
`;
