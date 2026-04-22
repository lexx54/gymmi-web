import { Video } from 'lucide-react';
import styled from 'styled-components';

/**
 * Dashed upload area for the exercise instructional video.
 */
export function MediaUploadCard() {
  return (
    <Card type="button">
      <IconBadge>
        <Video size={26} />
      </IconBadge>
      <Title>Upload Instructional Video</Title>
      <Hint>Drag and drop or click to browse. Max size 250MB. MP4, MOV format.</Hint>
      <Dots aria-hidden>
        <Dot $active />
        <Dot $active={false} />
        <Dot $active={false} />
      </Dots>
    </Card>
  );
}

const Card = styled.button`
  position: relative;
  width: 100%;
  min-height: 22rem;
  border-radius: 0.85rem;
  background-color: #181a2e;
  border: 2px dashed rgba(93, 63, 62, 0.25);
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 1.25rem 1.75rem;
  cursor: pointer;
  text-align: center;
  transition: border-color 150ms ease;

  &:hover {
    border-color: rgba(255, 179, 177, 0.55);
  }
`;

const IconBadge = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background-color: #26283d;
  color: #ffb3b1;
  display: grid;
  place-items: center;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.25);
`;

const Title = styled.h3`
  margin: 0.2rem 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #e0e0fc;
`;

const Hint = styled.p`
  margin: 0;
  color: #e7bdbb;
  font-size: 0.82rem;
  max-width: 18rem;
  line-height: 1.45;
`;

const Dots = styled.div`
  position: absolute;
  bottom: 0.9rem;
  right: 1rem;
  display: flex;
  gap: 0.35rem;
`;

const Dot = styled.span<{ $active: boolean }>`
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background-color: ${({ $active }) => ($active ? '#ffb3b1' : 'rgba(255, 179, 177, 0.25)')};
`;
