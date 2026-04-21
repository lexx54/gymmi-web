import styled from 'styled-components';

const BARS = [
  { day: 'Mon', height: 35 },
  { day: 'Tue', height: 52 },
  { day: 'Wed', height: 30 },
  { day: 'Thu', height: 64 },
  { day: 'Fri', height: 74, active: true },
  { day: 'Sat', height: 46 },
  { day: 'Sun', height: 22 },
];

/**
 * Displays weekly progress with static bar metrics.
 */
export function WeeklyProgressCard() {
  return (
    <Card>
      <HeaderRow>
        <div>
          <Eyebrow>Weekly Progress</Eyebrow>
          <Title>Volume Training</Title>
        </div>
        <PercentWrap>
          <Percent>84%</Percent>
          <PercentCaption>Goal Reached</PercentCaption>
        </PercentWrap>
      </HeaderRow>
      <BarsWrap>
        {BARS.map((bar) => (
          <BarItem key={bar.day}>
            <Bar $height={bar.height} $active={Boolean(bar.active)} />
            <DayLabel>{bar.day}</DayLabel>
          </BarItem>
        ))}
      </BarsWrap>
    </Card>
  );
}

const Card = styled.section`
  border-radius: 1.9rem;
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  border: 1px solid rgba(124, 132, 170, 0.14);
  padding: 1.55rem 1.6rem 1.45rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.35rem;
  color: #c5cbe9;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  font-weight: 600;
`;

const Title = styled.h3`
  margin: 0;
  color: #f2f3fe;
  font-size: 2.7rem;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  font-weight: 750;
`;

const PercentWrap = styled.div`
  text-align: right;
  margin-top: 0.2rem;
`;

const Percent = styled.p`
  margin: 0;
  color: #f9aab1;
  font-size: 2.75rem;
  font-style: italic;
  font-weight: 800;
`;

const PercentCaption = styled.p`
  margin: 0.2rem 0 0;
  color: #f6c5ca;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.68rem;
  font-weight: 600;
`;

const BarsWrap = styled.div`
  margin-top: 1.2rem;
  min-height: 18.75rem;
  border-radius: 1.35rem;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: 0.8rem;
  padding: 1.15rem 0.6rem 0.35rem;
  background: linear-gradient(180deg, rgba(18, 21, 41, 0.4) 0%, rgba(13, 17, 33, 0.75) 100%);
`;

const BarItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const Bar = styled.div<{ $height: number; $active: boolean }>`
  width: 100%;
  height: ${({ $height }) => `${$height}%`};
  min-height: 2.4rem;
  border-radius: 0.75rem 0.75rem 0.4rem 0.4rem;
  background: ${({ $active }) =>
    $active
      ? 'linear-gradient(180deg, #ffc4c6 0%, #ef233c 95%)'
      : 'linear-gradient(180deg, #4a506b 0%, #39405b 100%)'};
`;

const DayLabel = styled.span`
  color: #b9bfdc;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 600;
`;
