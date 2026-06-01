import { Dumbbell, MoreVertical, Play, Plus, Search, Sparkles, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';

type Routine = {
  id: string;
  category: string;
  title: string;
  focus: string;
  movements: string;
  duration: string;
  lastPerformed: string;
};

type Protocol = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  tone: 'red' | 'athlete';
};

const filters = ['All', 'Strength', 'Hypertrophy', 'Recovery', 'Endurance'];

const routines: Routine[] = [
  {
    id: 'push-day',
    category: 'Hypertrophy',
    title: 'Hypertrophy A - Push Day',
    focus: 'Chest / Shoulders / Triceps',
    movements: '8 Movements',
    duration: '65 min',
    lastPerformed: '2 days ago',
  },
  {
    id: 'lower-b',
    category: 'Strength',
    title: 'Elite Strength - Lower B',
    focus: 'Quads / Glutes / Calves',
    movements: '6 Movements',
    duration: '50 min',
    lastPerformed: 'Today',
  },
  {
    id: 'mobility-flow',
    category: 'Recovery',
    title: 'Mobility Flow 2.0',
    focus: 'Full Body / Flexibility',
    movements: '12 Flows',
    duration: '25 min',
    lastPerformed: 'Last week',
  },
  {
    id: 'back-bicep',
    category: 'Hypertrophy',
    title: 'Back & Bicep Annihilation',
    focus: 'Lats / Upper Back / Biceps',
    movements: '9 Movements',
    duration: '75 min',
    lastPerformed: '5 days ago',
  },
];

const protocols: Protocol[] = [
  {
    id: 'overload',
    eyebrow: 'Premium Track',
    title: 'The Overload Principle',
    subtitle: '12 Week Periodization Program',
    tone: 'red',
  },
  {
    id: 'explosion',
    eyebrow: 'Pro Series',
    title: 'Kinetic Explosion',
    subtitle: 'Plyometric & Power Efficiency',
    tone: 'athlete',
  },
];

/**
 * Routine library landing page for browsing and starting workout protocols.
 */
export default function WorkoutLibraryPage() {
  const { user } = useAuth();
  const username = user?.username ?? 'Alex';

  return (
    <PageShell>
      <Sidebar username={username} />

      <MainPanel>
        <HeroRow>
          <div>
            <Title>Routine Library</Title>
            <Subtitle>Manage and execute your precision-engineered training protocols.</Subtitle>
          </div>
          <CreateRoutineLink to="/workout/new">
            <Plus size={16} aria-hidden />
            <span>Create Routine</span>
          </CreateRoutineLink>
        </HeroRow>

        <FilterRow aria-label="Routine filters">
          {filters.map((filter) => (
            <FilterButton key={filter} type="button" $active={filter === 'All'}>
              {filter}
            </FilterButton>
          ))}
        </FilterRow>

        <SearchShell>
          <Search size={18} aria-hidden />
          <SearchInput placeholder="Search your library..." aria-label="Search your library" />
        </SearchShell>

        <RoutineGrid>
          {routines.map((routine) => (
            <RoutineCard key={routine.id}>
              <RoutineTopline>
                <CategoryPill>{routine.category}</CategoryPill>
                <IconButton type="button" aria-label={`More options for ${routine.title}`}>
                  <MoreVertical size={18} aria-hidden />
                </IconButton>
              </RoutineTopline>
              <RoutineTitle>{routine.title}</RoutineTitle>
              <RoutineFocus>{routine.focus}</RoutineFocus>

              <MetricRow>
                <MetricTile>
                  <Dumbbell size={15} aria-hidden />
                  <MetricCopy>
                    <MetricLabel>Exercises</MetricLabel>
                    <MetricValue>{routine.movements}</MetricValue>
                  </MetricCopy>
                </MetricTile>
                <MetricTile>
                  <Timer size={15} aria-hidden />
                  <MetricCopy>
                    <MetricLabel>Duration</MetricLabel>
                    <MetricValue>{routine.duration}</MetricValue>
                  </MetricCopy>
                </MetricTile>
              </MetricRow>

              <RoutineFooter>
                <LastPerformed>
                  Last performed <strong>{routine.lastPerformed}</strong>
                </LastPerformed>
                <PlayLink to="/workout/new" aria-label={`Play ${routine.title}`}>
                  <span>Play</span>
                  <Play size={14} aria-hidden />
                </PlayLink>
              </RoutineFooter>
            </RoutineCard>
          ))}

          <NewRoutineLink to="/workout/new">
            <NewRoutineIcon>
              <Plus size={21} aria-hidden />
            </NewRoutineIcon>
            <NewRoutineTitle>New Routine</NewRoutineTitle>
            <NewRoutineCopy>Build a custom protocol</NewRoutineCopy>
          </NewRoutineLink>
        </RoutineGrid>

        <ProtocolsSection>
          <SectionLabel>Expert Protocols</SectionLabel>
          <ProtocolGrid>
            {protocols.map((protocol) => (
              <ProtocolCard key={protocol.id} $tone={protocol.tone}>
                <Sparkles size={18} aria-hidden />
                <ProtocolCopy>
                  <ProtocolEyebrow>{protocol.eyebrow}</ProtocolEyebrow>
                  <ProtocolTitle>{protocol.title}</ProtocolTitle>
                  <ProtocolSubtitle>{protocol.subtitle}</ProtocolSubtitle>
                </ProtocolCopy>
              </ProtocolCard>
            ))}
          </ProtocolGrid>
        </ProtocolsSection>
      </MainPanel>
    </PageShell>
  );
}

const PageShell = styled.div`
  min-height: 100vh;
  display: flex;
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 83, 90, 0.12), transparent 28rem),
    linear-gradient(135deg, #101225 0%, #111326 48%, #0d1021 100%);
  color: #f7f7ff;
  font-family: Inter, "Plus Jakarta Sans", system-ui, sans-serif;
`;

const MainPanel = styled.main`
  width: min(100%, 66rem);
  padding: 2.4rem 1.35rem 4rem;

  @media (min-width: 768px) {
    padding: 2.8rem 3rem 4.8rem;
  }
`;

const HeroRow = styled.header`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 720px) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.45rem);
  font-weight: 900;
  letter-spacing: -0.06em;
  line-height: 0.95;
`;

const Subtitle = styled.p`
  margin: 0.55rem 0 0;
  color: #e7bdbb;
  font-size: 0.92rem;
`;

const CreateRoutineLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 0.85rem;
  padding: 1.05rem 1.55rem;
  background: linear-gradient(135deg, #ffb3b1, #ff535a);
  color: #2a0911;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  box-shadow: 0 35px 58px -36px rgba(255, 83, 90, 0.95);
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 2.4rem;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  border: 0;
  border-radius: 999px;
  padding: 0.72rem 1.35rem;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, #ffb3b1, #ff535a)' : 'rgba(49, 51, 73, 0.62)'};
  color: ${({ $active }) => ($active ? '#2a0911' : '#e7bdbb')};
  cursor: pointer;
  font-size: 0.64rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const SearchShell = styled.label`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: min(100%, 27rem);
  margin-top: 1.25rem;
  border-radius: 0.85rem;
  padding: 0.95rem 1rem;
  background: #181a2e;
  color: rgba(231, 189, 187, 0.76);
`;

const SearchInput = styled.input`
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #f7f7ff;
  font: inherit;

  &::placeholder {
    color: rgba(231, 189, 187, 0.45);
  }
`;

const RoutineGrid = styled.section`
  display: grid;
  gap: 1.55rem;
  margin-top: 2.1rem;

  @media (min-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const RoutineCard = styled.article`
  min-height: 15.9rem;
  border-radius: 0.55rem;
  padding: 1.45rem 1.45rem 1.25rem;
  background:
    radial-gradient(circle at 88% 0%, rgba(255, 179, 177, 0.08), transparent 13rem),
    #1c1e32;
  box-shadow: inset 0.16rem 0 0 rgba(255, 179, 177, 0.12);
`;

const RoutineTopline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const CategoryPill = styled.span`
  border-radius: 0.2rem;
  padding: 0.35rem 0.58rem;
  background: rgba(255, 83, 90, 0.1);
  color: #ffdad6;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

const IconButton = styled.button`
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: #ffdad6;
  cursor: pointer;
`;

const RoutineTitle = styled.h2`
  margin: 1.3rem 0 0;
  font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
  font-size: clamp(1.25rem, 2.4vw, 1.7rem);
  font-weight: 900;
  letter-spacing: -0.04em;
`;

const RoutineFocus = styled.p`
  margin: 0.25rem 0 0;
  color: #e7bdbb;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const MetricRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 1.55rem;
`;

const MetricTile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.72rem;
  min-width: 8.4rem;
`;

const MetricCopy = styled.span`
  display: grid;
  gap: 0.1rem;
`;

const MetricLabel = styled.span`
  color: rgba(231, 189, 187, 0.55);
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const MetricValue = styled.span`
  color: #f7f7ff;
  font-size: 0.78rem;
  font-weight: 900;
`;

const RoutineFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2.55rem;
`;

const LastPerformed = styled.p`
  margin: 0;
  color: rgba(231, 189, 187, 0.5);
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;

  strong {
    color: #ffdad6;
  }
`;

const PlayLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: #ffffff;
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-decoration: none;
  text-transform: uppercase;

  svg {
    width: 2rem;
    height: 2rem;
    border-radius: 0.55rem;
    padding: 0.55rem;
    background: #313349;
    color: #ffdad6;
  }
`;

const NewRoutineLink = styled(Link)`
  display: grid;
  min-height: 10.7rem;
  place-items: center;
  align-content: center;
  gap: 0.55rem;
  border-radius: 0.55rem;
  background:
    linear-gradient(90deg, rgba(255, 179, 177, 0.08) 50%, transparent 0) top / 1rem 0.12rem repeat-x,
    linear-gradient(90deg, rgba(255, 179, 177, 0.08) 50%, transparent 0) bottom / 1rem 0.12rem repeat-x,
    linear-gradient(0deg, rgba(255, 179, 177, 0.08) 50%, transparent 0) left / 0.12rem 1rem repeat-y,
    linear-gradient(0deg, rgba(255, 179, 177, 0.08) 50%, transparent 0) right / 0.12rem 1rem repeat-y,
    rgba(24, 26, 46, 0.55);
  color: #f7f7ff;
  text-align: center;
  text-decoration: none;
`;

const NewRoutineIcon = styled.span`
  display: grid;
  width: 3.15rem;
  height: 3.15rem;
  place-items: center;
  border-radius: 0.9rem;
  background: #313349;
  color: #ffb3b1;
`;

const NewRoutineTitle = styled.span`
  font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 900;
`;

const NewRoutineCopy = styled.span`
  color: rgba(231, 189, 187, 0.62);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
`;

const ProtocolsSection = styled.section`
  margin-top: 3.1rem;
`;

const SectionLabel = styled.p`
  margin: 0 0 1rem;
  color: #ffdad6;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const ProtocolGrid = styled.div`
  display: grid;
  gap: 1.55rem;

  @media (min-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ProtocolCard = styled.article<{ $tone: Protocol['tone'] }>`
  position: relative;
  overflow: hidden;
  display: flex;
  min-height: 11.4rem;
  align-items: end;
  gap: 0.9rem;
  border-radius: 0.65rem;
  padding: 1.45rem;
  background:
    linear-gradient(180deg, rgba(16, 18, 37, 0.08), rgba(16, 18, 37, 0.92)),
    ${({ $tone }) =>
      $tone === 'red'
        ? 'repeating-linear-gradient(90deg, rgba(255, 83, 90, 0.42) 0 0.35rem, transparent 0.35rem 2.1rem), radial-gradient(circle at 40% 0%, rgba(255, 179, 177, 0.5), transparent 13rem), #1c1e32'
        : 'radial-gradient(circle at 72% 8%, rgba(255, 83, 90, 0.65), transparent 8rem), linear-gradient(135deg, #313349, #15182b 58%, #1c1e32)'};

  &::before {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, rgba(255, 179, 177, 0.12), transparent 48%),
      radial-gradient(circle at 18% 20%, rgba(255, 83, 90, 0.22), transparent 10rem);
    content: '';
  }

  > * {
    position: relative;
  }

  svg {
    color: #ffb3b1;
  }
`;

const ProtocolCopy = styled.div`
  display: grid;
  gap: 0.15rem;
`;

const ProtocolEyebrow = styled.span`
  color: #ffdad6;
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const ProtocolTitle = styled.h3`
  margin: 0;
  font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-style: italic;
  font-weight: 900;
  letter-spacing: -0.07em;
  text-transform: uppercase;
`;

const ProtocolSubtitle = styled.span`
  color: #e7bdbb;
  font-size: 0.82rem;
`;
