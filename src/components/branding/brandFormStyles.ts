import styled from 'styled-components';
import { CardSurface } from '../settings/SettingsShell';

/** Shared styles for the brand and facility profile cards in Settings (match CoachingProfileCard). */
export const CardWrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const CardDescription = styled.p`
  margin: -0.6rem 0 0;
  color: #9096b6;
  font-size: 0.85rem;
  line-height: 1.5;
`;

export const PlanBadge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 179, 177, 0.12);
  border: 1px solid rgba(255, 179, 177, 0.35);
  color: #ffb3b1;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  min-width: 0;
`;

export const FieldGroup = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

export const FieldLabel = styled.span`
  color: #9096b6;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
`;

export const FieldHint = styled.span`
  color: #7c84aa;
  font-size: 0.75rem;
`;

export const FieldError = styled.span`
  color: #ff8a8f;
  font-size: 0.75rem;
`;

export const TextInput = styled.input`
  padding: 0.7rem 0.95rem;
  border-radius: 0.75rem;
  background: #0f1329;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #ffffff;
  font-size: 0.88rem;
  outline: none;

  &:focus {
    border-color: #ef233c;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  background: #0f1329;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #ffffff;
  font-size: 0.88rem;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 5rem;

  &:focus {
    border-color: #ef233c;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1.1rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #ff8a93, #ef233c);
  border: none;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1.1rem;
  border-radius: 9999px;
  background: #181a2e;
  border: 1px solid rgba(126, 136, 175, 0.25);
  color: #c6cae6;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PreviewStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
`;

/** A white "paper" mock of the PDF header. */
export const PdfPreview = styled.div`
  border-radius: 0.75rem;
  background: #ffffff;
  padding: 1rem 1.1rem;
  color: #1b1c2b;
  box-shadow: 0 10px 24px -14px rgba(0, 0, 0, 0.6);
`;

export const PdfBrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const PdfLogo = styled.img`
  width: 2.2rem;
  height: 2.2rem;
  object-fit: contain;
`;

export const PdfBrandName = styled.span<{ $color: string }>`
  font-weight: 800;
  font-size: 0.95rem;
  color: ${({ $color }) => $color};
`;

export const PdfTitle = styled.p`
  margin: 0.55rem 0 0.6rem;
  font-weight: 800;
  font-size: 1.05rem;
`;

export const PdfDayBar = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 700;
  font-size: 0.85rem;

  &::before {
    content: '';
    width: 3px;
    height: 1rem;
    background: ${({ $color }) => $color};
  }
`;

export const PdfFooter = styled.p`
  margin: 0.8rem 0 0;
  color: #6b7280;
  font-size: 0.65rem;
`;
