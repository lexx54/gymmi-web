import { Upload } from 'lucide-react';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Modal } from '../common/Modal';
import type { BulkExerciseCsvResult } from '../../services/api/exercises';

type ExerciseBulkCsvModalProps = {
  isOpen: boolean;
  isUploading: boolean;
  result?: BulkExerciseCsvResult;
  onClose: () => void;
  onUpload: (file: File) => void;
};

const requiredColumns = ['name', 'targetMuscle', 'equipment', 'instructions', 'difficulty', 'movementType'];

/**
 * Exercise-specific CSV import modal.
 */
export function ExerciseBulkCsvModal({
  isOpen,
  isUploading,
  result,
  onClose,
  onUpload,
}: ExerciseBulkCsvModalProps) {
  const { t } = useTranslation();
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!file) return;
    onUpload(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t('exercises.bulkCsv')}
      description={t('exercises.bulkCsvDescription')}
      onClose={onClose}
    >
      <Content>
        <Columns>
          <ColumnsTitle>{t('exercises.requiredColumns')}</ColumnsTitle>
          <ColumnList>
            {requiredColumns.map((column) => (
              <ColumnPill key={column}>{column}</ColumnPill>
            ))}
          </ColumnList>
        </Columns>

        <UploadLabel htmlFor={inputId}>
          <Upload size={22} aria-hidden />
          <UploadCopy>
            <strong>{file?.name ?? t('exercises.chooseCsv')}</strong>
            <span>{t('exercises.csvOnly')}</span>
          </UploadCopy>
        </UploadLabel>
        <FileInput
          id={inputId}
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />

        {result ? (
          <ResultText>
            {t('exercises.createdResult', { count: result.created })}
            {result.errors.length > 0 ? t('exercises.skippedRows', { count: result.errors.length }) : ''}.
          </ResultText>
        ) : null}

        {result?.errors.length ? (
          <ErrorList>
            {result.errors.map((error) => (
              <li key={`${error.row}-${error.message}`}>
                {t('exercises.rowError', { row: error.row, message: error.message })}
              </li>
            ))}
          </ErrorList>
        ) : null}

        <Actions>
          <SecondaryButton type="button" onClick={onClose}>
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton type="button" disabled={!file || isUploading} onClick={handleSubmit}>
            {isUploading ? t('exercises.uploading') : t('exercises.uploadCsv')}
          </PrimaryButton>
        </Actions>
      </Content>
    </Modal>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

const Columns = styled.div`
  border-radius: 1rem;
  background: #181a2e;
  padding: 1rem;
`;

const ColumnsTitle = styled.p`
  margin: 0 0 0.75rem;
  color: #ffb3b1;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

const ColumnList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ColumnPill = styled.span`
  border-radius: 999px;
  background: #313349;
  color: #f7f7ff;
  padding: 0.45rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 1rem;
  background: #181a2e;
  padding: 1.2rem;
  color: #f7f7ff;
  cursor: pointer;
`;

const UploadCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  span {
    color: #e7bdbb;
    font-size: 0.82rem;
  }
`;

const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
`;

const ResultText = styled.p`
  margin: 0;
  color: #ffdad6;
  font-weight: 800;
`;

const ErrorList = styled.ul`
  display: flex;
  max-height: 8rem;
  flex-direction: column;
  gap: 0.45rem;
  margin: 0;
  overflow: auto;
  border-radius: 0.9rem;
  background: rgba(147, 0, 10, 0.22);
  color: #ffb4ab;
  padding: 0.9rem 1.1rem;
  font-size: 0.82rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const SecondaryButton = styled.button`
  border: 0;
  border-radius: 999px;
  background: #313349;
  color: #ffdad6;
  cursor: pointer;
  font-weight: 900;
  padding: 0.85rem 1.2rem;
  text-transform: uppercase;
`;

const PrimaryButton = styled.button`
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffb3b1 0%, #ff535a 100%);
  color: #2a0911;
  cursor: pointer;
  font-weight: 900;
  padding: 0.85rem 1.3rem;
  text-transform: uppercase;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;
