import styled from 'styled-components';

type DashboardHeaderProps = {
  username: string;
};

/**
 * Renders the introductory hero copy for the dashboard.
 */
export function DashboardHeader({ username }: DashboardHeaderProps) {
  return (
    <Container>
      <SectionLabel>Dashboard</SectionLabel>
      <Greeting>Good Morning, {username.toUpperCase()}</Greeting>
      <Headline>
        YOU&apos;RE IN THE
        <AccentLine>PEAK ZONE</AccentLine>
        TODAY.
      </Headline>
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const SectionLabel = styled.p`
  color: #efc0c4;
  font-size: 1.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const Greeting = styled.p`
  color: #efc0c4;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.42em;
  text-transform: uppercase;
`;

const Headline = styled.h1`
  color: #f4f5ff;
  margin: 0;
  font-size: 5rem;
  line-height: 0.95;
  font-style: italic;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const AccentLine = styled.span`
  display: block;
  color: #ef233c;
`;
