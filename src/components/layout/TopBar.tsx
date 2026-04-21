import { Bell } from 'lucide-react';
import styled from 'styled-components';

/**
 * Displays the dashboard utility actions on the top-right.
 */
export function TopBar() {
  return (
    <Container>
      <IconButton type="button" aria-label="Notifications">
        <Bell size={16} />
      </IconButton>
      <AvatarFrame aria-hidden>
        <AvatarDot />
      </AvatarFrame>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 9999px;
  background: transparent;
  color: #f5bdc1;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const AvatarFrame = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.7rem;
  border: 1px solid #f5bdc1;
  background: rgba(245, 189, 193, 0.08);
  display: grid;
  place-items: center;
`;

const AvatarDot = styled.div`
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 9999px;
  background: #f5bdc1;
`;
