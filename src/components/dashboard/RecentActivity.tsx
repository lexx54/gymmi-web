import styled from 'styled-components';

type Activity = {
  id: string;
  when: string;
  title: string;
  meta: string;
};

const ACTIVITIES: Activity[] = [
  { id: 'a1', when: 'Yesterday', title: 'Urban Trail Run', meta: '5.2 km - 28:14' },
  { id: 'a2', when: '2 Days Ago', title: 'Recovery Flow', meta: '45 min - Low Intensity' },
  { id: 'a3', when: '3 Days Ago', title: 'Power Lifting', meta: '65 min - 1,200kg Volume' },
];

/**
 * Displays recent activity summary cards.
 */
export function RecentActivity() {
  return (
    <Section>
      <SectionHeader>
        <Title>Recent Activity</Title>
        <HistoryLink href="#">View History</HistoryLink>
      </SectionHeader>
      <Cards>
        {ACTIVITIES.map((activity, index) => (
          <Card key={activity.id} $muted={index === 2}>
            <When>{activity.when}</When>
            <CardTitle>{activity.title}</CardTitle>
            <Meta>{activity.meta}</Meta>
          </Card>
        ))}
      </Cards>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #eceefe;
  text-transform: uppercase;
  font-size: 2.1rem;
  font-weight: 750;
`;

const HistoryLink = styled.a`
  color: #e8b9bf;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.7rem;
  font-weight: 700;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
`;

const Card = styled.article<{ $muted: boolean }>`
  border-radius: 1.3rem;
  border: 1px solid rgba(126, 136, 175, 0.14);
  background: ${({ $muted }) =>
    $muted
      ? 'linear-gradient(180deg, rgba(20, 24, 45, 0.62) 0%, rgba(13, 16, 30, 0.62) 100%)'
      : 'linear-gradient(180deg, #1b203a 0%, #14182f 100%)'};
  padding: 1rem 1.1rem;
  min-height: 8.2rem;
  opacity: ${({ $muted }) => ($muted ? 0.45 : 1)};
`;

const When = styled.p`
  margin: 0;
  color: #d9ddf2;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.68rem;
  font-weight: 700;
`;

const CardTitle = styled.p`
  margin: 0.55rem 0 0.4rem;
  color: #f3f4ff;
  font-size: 1.9rem;
  font-weight: 650;
  line-height: 1.05;
`;

const Meta = styled.p`
  margin: 0;
  color: #b0b7d8;
  font-size: 0.9rem;
`;
