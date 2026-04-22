import { LibraryBig } from 'lucide-react';
import styled from 'styled-components';

/**
 * Empty-state dropzone shown beneath the routine list.
 */
export function RoutineDropzone() {
  return (
    <Zone>
      <Icon>
        <LibraryBig size={32} />
      </Icon>
      <Hint>Drag exercises from library to add</Hint>
    </Zone>
  );
}

const Zone = styled.div`
  border: 2px dashed rgba(93, 63, 62, 0.4);
  border-radius: 1.4rem;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  transition: border-color 150ms ease;

  &:hover {
    border-color: rgba(255, 179, 177, 0.5);
  }
`;

const Icon = styled.span`
  color: rgba(93, 63, 62, 0.85);
  display: grid;
  place-items: center;
`;

const Hint = styled.p`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #e7bdbb;
  font-weight: 700;
  font-size: 0.95rem;
`;
