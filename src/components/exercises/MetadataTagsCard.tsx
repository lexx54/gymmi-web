import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ExerciseTag } from './types';
import type { Tag } from '../../services/api/tags';

type MetadataTagsCardProps = {
  tags: ExerciseTag[];
  catalogTags: Tag[];
  onAddTag: (tag: ExerciseTag) => void;
  onRemoveTag: (tag: ExerciseTag) => void;
  onCreateTag: () => void;
};

/**
 * Selected exercise tags plus the user's visible catalog, with a create-tag entry point.
 */
export function MetadataTagsCard({
  tags,
  catalogTags,
  onAddTag,
  onRemoveTag,
  onCreateTag,
}: MetadataTagsCardProps) {
  const { t } = useTranslation();
  const availableTags = catalogTags.filter((tag) => !tags.includes(tag.name));

  return (
    <Card>
      <FieldLabel>{t('exercises.metadataTags')}</FieldLabel>
      <TagRow>
        {tags.map((tag) => (
          <Chip key={tag}>
            <span>{tag}</span>
            <RemoveButton
              type="button"
              aria-label={t('exercises.removeTag', { tag })}
              onClick={() => onRemoveTag(tag)}
            >
              <X size={12} />
            </RemoveButton>
          </Chip>
        ))}
        <AddChip type="button" onClick={onCreateTag}>
          <Plus size={12} />
          {t('exercises.createTag')}
        </AddChip>
      </TagRow>
      {availableTags.length > 0 ? (
        <>
          <AvailableLabel>{t('exercises.availableTags')}</AvailableLabel>
          <TagRow>
            {availableTags.map((tag) => (
              <AvailableChip
                key={tag.id}
                type="button"
                onClick={() => onAddTag(tag.name)}
              >
                {tag.name}
              </AvailableChip>
            ))}
          </TagRow>
        </>
      ) : null}
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

const AvailableLabel = styled.span`
  display: block;
  color: #9a8c8c;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.58rem;
  font-weight: 700;
  margin: 1.1rem 0 0.65rem;
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

const AvailableChip = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border: 1px dashed rgba(93, 63, 62, 0.45);
  background: transparent;
  color: #c8c8e6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9999px;
  cursor: pointer;

  &:hover {
    border-color: #ffb3b1;
    color: #ffb3b1;
  }
`;
