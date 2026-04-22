import styled from 'styled-components';
import type { ExerciseSummary } from './types';

type ExerciseCatalogCardProps = {
  exercise: ExerciseSummary;
};

/**
 * Compact summary card shown in the Exercises catalog grid.
 */
export function ExerciseCatalogCard({ exercise }: ExerciseCatalogCardProps) {
  return (
    <Card>
      <Eyebrow>{exercise.targetMuscle}</Eyebrow>
      <Name>{exercise.name}</Name>
      <Meta>
        <MetaItem>{exercise.equipment}</MetaItem>
        <MetaItem>{exercise.difficulty}</MetaItem>
      </Meta>
      {exercise.tags.length > 0 ? (
        <Tags>
          {exercise.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Tags>
      ) : null}
    </Card>
  );
}

const Card = styled.article`
  background-color: #181a2e;
  border-radius: 0.85rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 11rem;
  transition: background-color 150ms ease, transform 150ms ease;

  &:hover {
    background-color: #1c1e32;
    transform: translateY(-2px);
  }
`;

const Eyebrow = styled.p`
  margin: 0;
  color: #ffb3b1;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const Name = styled.h3`
  margin: 0;
  color: #e0e0fc;
  font-size: 1.15rem;
  font-weight: 700;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e7bdbb;
  font-size: 0.78rem;
`;

const MetaItem = styled.span`
  &:not(:last-child)::after {
    content: '•';
    margin-left: 0.75rem;
    color: rgba(231, 189, 187, 0.6);
  }
`;

const Tags = styled.div`
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.55rem;
  border-radius: 9999px;
  background-color: #26283d;
  color: #e0e0fc;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.6rem;
  font-weight: 700;
`;
