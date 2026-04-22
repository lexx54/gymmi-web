import { Bold, Italic, List } from 'lucide-react';
import styled from 'styled-components';

type InstructionsCardProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Step-by-step movement instructions with basic formatting toolbar.
 */
export function InstructionsCard({ value, onChange }: InstructionsCardProps) {
  return (
    <Card>
      <HeaderRow>
        <FieldLabel>Detailed Instructions</FieldLabel>
        <ToolbarGroup>
          <ToolbarButton type="button" aria-label="Bold">
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton type="button" aria-label="Italic">
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton type="button" aria-label="Bulleted list">
            <List size={14} />
          </ToolbarButton>
        </ToolbarGroup>
      </HeaderRow>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Break down the movement step-by-step..."
        rows={8}
      />
    </Card>
  );
}

const Card = styled.section`
  background-color: #181a2e;
  border-radius: 0.85rem;
  padding: 2rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const FieldLabel = styled.span`
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const ToolbarGroup = styled.div`
  display: flex;
  gap: 0.35rem;
`;

const ToolbarButton = styled.button`
  border: none;
  background: transparent;
  color: #e7bdbb;
  width: 2rem;
  height: 2rem;
  border-radius: 0.35rem;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background-color: #1c1e32;
    color: #ffffff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background-color: #1c1e32;
  border: none;
  border-radius: 0.75rem;
  color: #e0e0fc;
  padding: 1.35rem 1.35rem;
  font-size: 0.95rem;
  line-height: 1.6;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: box-shadow 150ms ease;

  &::placeholder {
    color: rgba(173, 136, 134, 0.6);
  }

  &:focus {
    box-shadow: 0 0 0 2px #ffb3b1;
  }
`;
