import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';
import styled from 'styled-components';
import type { ExerciseTag } from './types';

type MetadataTagsCardProps = {
  tags: ExerciseTag[];
  onAddTag: (tag: ExerciseTag) => void;
  onRemoveTag: (tag: ExerciseTag) => void;
};

/**
 * Metadata tag chips with an inline add-tag affordance.
 */
export function MetadataTagsCard({ tags, onAddTag, onRemoveTag }: MetadataTagsCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onAddTag(trimmed);
    }
    setDraft('');
    setIsAdding(false);
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      setDraft('');
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <FieldLabel>Metadata Tags</FieldLabel>
      <TagRow>
        {tags.map((tag) => (
          <Chip key={tag}>
            <span>{tag}</span>
            <RemoveButton
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => onRemoveTag(tag)}
            >
              <X size={12} />
            </RemoveButton>
          </Chip>
        ))}

        {isAdding ? (
          <TagInput
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={handleKey}
            placeholder="Tag name"
          />
        ) : (
          <AddChip type="button" onClick={() => setIsAdding(true)}>
            <Plus size={12} />
            Add Tag
          </AddChip>
        )}
      </TagRow>
    </Card>
  );
}

const Card = styled.section`
  background-color: #181a2e;
  border-radius: 0.85rem;
  padding: 2rem;
`;

const FieldLabel = styled.span`
  display: block;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.62rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background-color: #26283d;
  color: #e0e0fc;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9999px;
`;

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: #e7bdbb;
  width: 0.9rem;
  height: 0.9rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  transition: color 150ms ease;

  &:hover {
    color: #ffffff;
  }
`;

const AddChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid rgba(93, 63, 62, 0.35);
  background: transparent;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9999px;
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease;

  &:hover {
    border-color: #ffb3b1;
    color: #ffb3b1;
  }
`;

const TagInput = styled.input`
  padding: 0.3rem 0.75rem;
  border: 1px solid rgba(93, 63, 62, 0.45);
  background-color: #1c1e32;
  color: #e0e0fc;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9999px;
  outline: none;
  min-width: 6rem;
  transition: border-color 150ms ease;

  &:focus {
    border-color: #ffb3b1;
  }
`;
