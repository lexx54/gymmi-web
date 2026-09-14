import { CalendarPlus, Dumbbell, Edit3, Eye, Plus, Search, Share2, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import styled from 'styled-components';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  useAssignWorkout,
  useDeleteWorkout,
  useEligibleClients,
  useEligibleTrainers,
  useMyWorkoutAssignment,
  useSelfAssignWorkout,
  useShareWorkout,
  useWorkouts,
} from '../hooks/useWorkouts';
import { WORKOUT_PERIODS, type WorkoutPeriod, type WorkoutRoutine } from '../services/api/workouts';

type DialogMode = 'share' | 'assign' | 'selfAssign';
type LibraryFilter = 'all' | 'mine' | 'assigned';

/**
 * Browses visible API routines and exposes role-safe routine actions.
 */
export default function WorkoutLibraryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: routines = [], isLoading, isError } = useWorkouts();
  const isClient = user?.role.name === 'Client';
  const isTrainer = user?.role.name === 'Trainer';
  const { data: assignment } = useMyWorkoutAssignment(isClient);
  const deleteMutation = useDeleteWorkout();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<LibraryFilter>('all');
  const [dialog, setDialog] = useState<{ mode: DialogMode; routine: WorkoutRoutine } | null>(null);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return routines.filter((routine) => {
      const matchesSearch = !needle || `${routine.name} ${routine.description ?? ''}`.toLowerCase().includes(needle);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'mine' && routine.createdById === user?.id) ||
        (filter === 'assigned' && routine.id === assignment?.routineId);
      return matchesSearch && matchesFilter;
    });
  }, [assignment?.routineId, filter, routines, search, user?.id]);

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
        <Hero>
          <div>
            <Title>{t('workouts.libraryTitle')}</Title>
            <Subtitle>{t('workouts.librarySubtitle')}</Subtitle>
          </div>
          <CreateLink to="/workout/new"><Plus size={16} />{t('workouts.createRoutine')}</CreateLink>
        </Hero>
        <Controls>
          <FilterGroup aria-label={t('workouts.routineFilters')}>
            {(['all', 'mine', ...(isClient ? ['assigned'] : [])] as LibraryFilter[]).map((item) => (
              <FilterButton key={item} type="button" $active={filter === item} onClick={() => setFilter(item)}>
                {t(`workouts.filters.${item}`)}
              </FilterButton>
            ))}
          </FilterGroup>
          <SearchField>
            <Search size={17} aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('workouts.searchLibrary')}
              aria-label={t('workouts.searchLibrary')}
            />
          </SearchField>
        </Controls>

        {isLoading && <Status>{t('common.loading')}</Status>}
        {isError && <Status role="alert">{t('workouts.loadFailed')}</Status>}
        {!isLoading && !isError && <Grid>
          {visible.map((routine) => {
            const owned = routine.createdById === user?.id;
            const assigned = assignment?.routineId === routine.id;
            const exerciseCount = routine.days.reduce((count, day) => count + day.exercises.length, 0);
            return (
              <Card key={routine.id} $assigned={assigned}>
                <CardTop>
                  <Badge>{assigned ? t('workouts.assigned') : owned ? t('workouts.owned') : t('workouts.readOnly')}</Badge>
                  <Dumbbell size={20} aria-hidden />
                </CardTop>
                <CardTitle>{routine.name}</CardTitle>
                <CardDescription>{routine.description || t('workouts.noDescription')}</CardDescription>
                <Metrics>
                  <span>{t('workouts.dayCount', { count: routine.days.length })}</span>
                  <span>{t('workouts.exerciseCount', { count: exerciseCount })}</span>
                </Metrics>
                <Actions>
                  <ActionLink to={`/workout/${routine.id}`}><Eye size={15} />{t('workouts.view')}</ActionLink>
                  {owned && <ActionLink to={`/workout/${routine.id}/edit`}><Edit3 size={15} />{t('workouts.edit')}</ActionLink>}
                  {owned && isTrainer && <ActionButton type="button" onClick={() => setDialog({ mode: 'share', routine })}>
                    <Share2 size={15} />{t('workouts.share')}
                  </ActionButton>}
                  {isTrainer && <ActionButton type="button" onClick={() => setDialog({ mode: 'assign', routine })}>
                    <Users size={15} />{t('workouts.assign')}
                  </ActionButton>}
                  {isClient && !assigned && <ActionButton type="button" onClick={() => setDialog({ mode: 'selfAssign', routine })}>
                    <CalendarPlus size={15} />{t('workouts.selfAssign')}
                  </ActionButton>}
                  {owned && <DangerButton type="button" onClick={() => removeRoutine(routine)} aria-label={t('workouts.deleteNamed', { name: routine.name })}>
                    <Trash2 size={15} />
                  </DangerButton>}
                </Actions>
              </Card>
            );
          })}
          {!visible.length && <Empty>{t('workouts.noRoutines')}</Empty>}
        </Grid>}
      </Main>
      {dialog && <WorkoutAccessDialog mode={dialog.mode} routine={dialog.routine} onClose={() => setDialog(null)} />}
    </PageShell>
  );
}

function WorkoutAccessDialog({
  mode,
  routine,
  onClose,
}: {
  mode: DialogMode;
  routine: WorkoutRoutine;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { data: trainers = [] } = useEligibleTrainers(mode === 'share');
  const { data: clients = [] } = useEligibleClients(mode === 'assign');
  const shareMutation = useShareWorkout();
  const assignMutation = useAssignWorkout();
  const selfAssignMutation = useSelfAssignWorkout();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [clientId, setClientId] = useState('');
  const [period, setPeriod] = useState<WorkoutPeriod>('WEEK');
  const [customEndDate, setCustomEndDate] = useState('');

  const submit = async () => {
    try {
      if (mode === 'share') {
        await shareMutation.mutateAsync({ id: routine.id, trainerIds: selectedIds });
      } else if (mode === 'assign') {
        if (!clientId) return;
        await assignMutation.mutateAsync({
          id: routine.id,
          clientId,
          period,
          ...(period === 'CUSTOM' ? { customEndDate } : {}),
        });
      } else {
        await selfAssignMutation.mutateAsync({
          routineId: routine.id,
          period,
          ...(period === 'CUSTOM' ? { customEndDate } : {}),
        });
      }
      toast.success(t(`workouts.${mode}Success`));
      onClose();
    } catch {
      toast.error(t(`workouts.${mode}Failed`));
    }
  };
  const pending = shareMutation.isPending || assignMutation.isPending || selfAssignMutation.isPending;
  const invalid = mode === 'assign' && !clientId || period === 'CUSTOM' && !customEndDate;

  return (
    <Backdrop onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="workout-dialog-title">
        <DialogTitle id="workout-dialog-title">{t(`workouts.dialogs.${mode}`, { name: routine.name })}</DialogTitle>
        {mode === 'share' ? <>
          <Hint>{t('workouts.shareReplacementHint')}</Hint>
          <CheckboxList>
            {trainers.map((trainer) => (
              <label key={trainer.id}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(trainer.id)}
                  onChange={() => setSelectedIds((current) =>
                    current.includes(trainer.id) ? current.filter((id) => id !== trainer.id) : [...current, trainer.id])}
                />
                {trainer.username} · {trainer.email}
              </label>
            ))}
          </CheckboxList>
        </> : <>
          {mode === 'assign' && <Field>
            {t('workouts.client')}
            <select value={clientId} onChange={(event) => setClientId(event.target.value)}>
              <option value="">{t('workouts.selectClient')}</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.username}</option>)}
            </select>
          </Field>}
          <Field>
            {t('workouts.period')}
            <select value={period} onChange={(event) => setPeriod(event.target.value as WorkoutPeriod)}>
              {WORKOUT_PERIODS.map((value) => <option key={value} value={value}>{t(`workouts.periods.${value}`)}</option>)}
            </select>
          </Field>
          {period === 'CUSTOM' && <Field>
            {t('workouts.customEndDate')}
            <input type="date" min={new Date().toISOString().slice(0, 10)} value={customEndDate} onChange={(event) => setCustomEndDate(event.target.value)} />
          </Field>}
        </>}
        <DialogActions>
          <CancelButton type="button" onClick={onClose}>{t('common.cancel')}</CancelButton>
          <SubmitButton type="button" onClick={submit} disabled={pending || invalid}>
            {pending ? t('common.saving') : t('common.confirm')}
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
}

const PageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #101225;
  color: #f7f7ff;
`;
const Main = styled.main`flex: 1; min-width: 0; padding: 2.5rem; @media (max-width: 640px) { padding: 1.1rem; }`;
const Hero = styled.header`display: flex; justify-content: space-between; gap: 1rem; align-items: start; @media (max-width: 640px) { flex-direction: column; }`;
const Title = styled.h1`margin: 0; font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 900; letter-spacing: -0.06em;`;
const Subtitle = styled.p`color: #e7bdbb;`;
const CreateLink = styled(Link)`display: inline-flex; align-items: center; gap: .5rem; padding: .9rem 1.2rem; border-radius: .8rem; background: linear-gradient(135deg,#ffb3b1,#ff535a); color: #46000b; text-decoration: none; font-weight: 900;`;
const Controls = styled.div`display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; margin: 2rem 0;`;
const FilterGroup = styled.div`display: flex; flex-wrap: wrap; gap: .55rem;`;
const FilterButton = styled.button<{ $active: boolean }>`border: 0; border-radius: 999px; padding: .65rem 1rem; background: ${({ $active }) => $active ? '#ffb3b1' : '#1c1e32'}; color: ${({ $active }) => $active ? '#680011' : '#e7bdbb'}; cursor: pointer;`;
const SearchField = styled.label`display: flex; align-items: center; gap: .6rem; min-width: min(100%, 18rem); border-radius: .8rem; padding: .75rem; background: #181a2e; color: #e7bdbb; input { min-width: 0; width: 100%; border: 0; outline: 0; background: transparent; color: #fff; }`;
const Grid = styled.section`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(19rem, 100%), 1fr)); gap: 1.25rem;`;
const Card = styled.article<{ $assigned: boolean }>`min-width: 0; border: 1px solid ${({ $assigned }) => $assigned ? '#ff535a' : 'rgba(231,189,187,.12)'}; border-radius: 1.25rem; padding: 1.3rem; background: #1c1e32;`;
const CardTop = styled.div`display: flex; justify-content: space-between; color: #ffb3b1;`;
const Badge = styled.span`border-radius: 999px; padding: .35rem .65rem; background: #313349; font-size: .68rem; font-weight: 800; text-transform: uppercase;`;
const CardTitle = styled.h2`margin: 1rem 0 .35rem;`;
const CardDescription = styled.p`min-height: 2.5rem; color: #e7bdbb;`;
const Metrics = styled.div`display: flex; gap: 1rem; color: #ffdad6; font-size: .78rem;`;
const Actions = styled.footer`display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.25rem;`;
const ActionLink = styled(Link)`display: inline-flex; align-items: center; gap: .35rem; border-radius: .55rem; padding: .55rem .65rem; background: #313349; color: #fff; text-decoration: none; font-size: .75rem;`;
const ActionButton = styled.button`display: inline-flex; align-items: center; gap: .35rem; border: 0; border-radius: .55rem; padding: .55rem .65rem; background: #313349; color: #fff; cursor: pointer;`;
const DangerButton = styled(ActionButton)`margin-left: auto; color: #ffb3b1;`;
const Status = styled.p`margin: 4rem 0; color: #e7bdbb; text-align: center;`;
const Empty = styled(Status)`grid-column: 1 / -1;`;
const Backdrop = styled.div`position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 1rem; background: rgba(5,6,18,.78);`;
const Dialog = styled.div`width: min(100%, 30rem); max-height: 85vh; overflow: auto; border-radius: 1.25rem; padding: 1.4rem; background: #1c1e32; box-shadow: 0 2rem 5rem rgba(0,0,0,.45);`;
const DialogTitle = styled.h2`margin: 0 0 1rem;`;
const Hint = styled.p`color: #e7bdbb; font-size: .82rem;`;
const CheckboxList = styled.div`display: grid; gap: .7rem; label { display: flex; gap: .6rem; }`;
const Field = styled.label`display: grid; gap: .45rem; margin-top: .8rem; color: #e7bdbb; select, input { border: 0; border-radius: .65rem; padding: .75rem; background: #101225; color: #fff; }`;
const DialogActions = styled.div`display: flex; justify-content: end; gap: .7rem; margin-top: 1.2rem;`;
const CancelButton = styled.button`border: 0; border-radius: .65rem; padding: .7rem 1rem; background: #313349; color: #fff; cursor: pointer;`;
const SubmitButton = styled(CancelButton)`background: #ff535a; color: #270007; font-weight: 900; &:disabled { opacity: .5; }`;
