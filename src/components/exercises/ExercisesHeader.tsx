import { Bell, HelpCircle, Search } from 'lucide-react';
import styled from 'styled-components';

type ExercisesHeaderProps = {
  title: string;
  searchPlaceholder?: string;
};

/**
 * Sticky glass-style top app bar used across the exercises routes.
 * Renders the page title slot, a search input, and quick action icons.
 */
export function ExercisesHeader({
  title,
  searchPlaceholder = 'Search exercises...',
}: ExercisesHeaderProps) {
  return (
    <HeaderRoot>
      <Title>{title}</Title>
      <Actions>
        <SearchWrap>
          <SearchIcon>
            <Search size={16} aria-hidden />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder={searchPlaceholder}
            aria-label="Search exercises"
          />
        </SearchWrap>
        <IconButton type="button" aria-label="Notifications">
          <BellWithDot>
            <Bell size={16} />
            <NotificationDot aria-hidden />
          </BellWithDot>
        </IconButton>
        <IconButton type="button" aria-label="Help">
          <HelpCircle size={16} />
        </IconButton>
        <Avatar aria-hidden />
      </Actions>
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
  padding: 1.4rem 2.5rem;
  background-color: rgba(16, 18, 37, 0.8);
  backdrop-filter: blur(20px);
`;

const Title = styled.h1`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #ffb3b1;
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
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
  padding: 0.55rem 1rem 0.55rem 2.4rem;
  width: 15.5rem;
  color: #e0e0fc;
  font-size: 0.85rem;
  outline: none;
  transition: box-shadow 150ms ease;

  &::placeholder {
    color: rgba(173, 136, 134, 0.6);
  }

  &:focus {
    box-shadow: 0 0 0 2px #ffb3b1;
  }
`;

const IconButton = styled.button`
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: #e7bdbb;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color 150ms ease;

  &:hover {
    color: #ffffff;
  }
`;

const BellWithDot = styled.span`
  position: relative;
  display: grid;
  place-items: center;
`;

const NotificationDot = styled.span`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background-color: #ff535a;
`;

const Avatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ff535a 0%, #680011 100%);
  box-shadow: 0 0 0 2px rgba(255, 179, 177, 0.2);
`;
