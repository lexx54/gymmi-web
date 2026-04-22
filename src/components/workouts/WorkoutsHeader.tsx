import { Bell, HelpCircle, Search } from 'lucide-react';
import styled from 'styled-components';

/**
 * Sticky page header for the workouts builder.
 * Includes the page title, global search, action icons, and avatar.
 */
export function WorkoutsHeader() {
  return (
    <HeaderRoot>
      <TitleBlock>
        <Title>Workout Builder</Title>
        <Subtitle>Design your peak performance session</Subtitle>
      </TitleBlock>
      <ActionsRow>
        <SearchWrap>
          <SearchIcon>
            <Search size={16} aria-hidden />
          </SearchIcon>
          <SearchInput type="text" placeholder="Search global routine..." aria-label="Search routine" />
        </SearchWrap>
        <IconButton type="button" aria-label="Notifications">
          <Bell size={16} />
        </IconButton>
        <IconButton type="button" aria-label="Help">
          <HelpCircle size={16} />
        </IconButton>
        <Avatar aria-hidden />
      </ActionsRow>
    </HeaderRoot>
  );
}

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 2rem;
  background-color: rgba(16, 18, 37, 0.85);
  backdrop-filter: blur(20px);
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h1`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #e0e0fc;
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.65rem;
  font-weight: 700;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const SearchWrap = styled.div`
  position: relative;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: #e7bdbb;
  display: grid;
  place-items: center;
`;

const SearchInput = styled.input`
  background-color: #181a2e;
  border: none;
  border-radius: 9999px;
  padding: 0.6rem 1rem 0.6rem 2.4rem;
  width: 17rem;
  color: #e0e0fc;
  font-size: 0.85rem;
  outline: none;
  transition: box-shadow 150ms ease;

  &::placeholder {
    color: rgba(173, 136, 134, 0.6);
  }

  &:focus {
    box-shadow: 0 0 0 1px #ffb3b1;
  }
`;

const IconButton = styled.button`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  border: none;
  background-color: #1c1e32;
  color: #e7bdbb;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: #26283d;
  }
`;

const Avatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ff535a 0%, #680011 100%);
`;
