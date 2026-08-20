import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type ModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

/**
 * Generic modal shell for focused overlay workflows.
 */
export function Modal({ isOpen, title, description, children, onClose }: ModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Overlay role="presentation" onMouseDown={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <div>
            <Title id="modal-title">{title}</Title>
            {description ? <Description id="modal-description">{description}</Description> : null}
          </div>
          <CloseButton type="button" aria-label={t('common.closeModal')} onClick={onClose}>
            <X size={18} aria-hidden />
          </CloseButton>
        </Header>
        {children}
      </Dialog>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(16, 18, 37, 0.72);
  backdrop-filter: blur(22px);
`;

const Dialog = styled.div`
  width: min(100%, 34rem);
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(255, 179, 177, 0.12), transparent 16rem),
    #1c1e32;
  padding: 1.5rem;
  color: #f7f7ff;
  box-shadow: 0 48px 70px -48px rgba(0, 0, 0, 0.95);
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #f7f7ff;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: -0.04em;
`;

const Description = styled.p`
  margin: 0.45rem 0 0;
  color: #e7bdbb;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #313349;
  color: #ffdad6;
  cursor: pointer;
`;
