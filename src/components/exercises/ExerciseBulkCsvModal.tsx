import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
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
 * Formats a byte count into a short human readable size.
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [hasInvalidType, setHasInvalidType] = useState(false);
  // Gates the result banner so a stale result is hidden once a new file is picked.
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) return;
    setFile(null);
    setHasInvalidType(false);
    setHasSubmitted(false);
    if (inputRef.current) inputRef.current.value = '';
  }, [isOpen]);

  const handleSelect = (selected: File | null) => {
    setHasSubmitted(false);
    if (!selected) {
      setFile(null);
      setHasInvalidType(false);
      return;
    }
    if (!/\.csv$/i.test(selected.name)) {
      setFile(null);
      setHasInvalidType(true);
      return;
    }
    setHasInvalidType(false);
    setFile(selected);
  };

  const handleClear = () => {
    setFile(null);
    setHasInvalidType(false);
    setHasSubmitted(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  // A finished import stays on screen until a different file is picked, so the
  // upload action is withdrawn meanwhile to avoid importing the same rows twice.
  const showResult = hasSubmitted && Boolean(result);
  const errorCount = result?.errors.length ?? 0;

  const handleSubmit = () => {
    if (!file || isUploading || showResult) return;
    setHasSubmitted(true);
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

        {file ? (
          <SelectedCard>
            <FileIcon aria-hidden>
              <FileSpreadsheet size={20} />
            </FileIcon>
            <FileInfo>
              <FileName title={file.name}>{file.name}</FileName>
              <FileMeta>
                {isUploading ? t('exercises.uploading') : t('exercises.fileSelected')}
                {' · '}
                {formatFileSize(file.size)}
              </FileMeta>
            </FileInfo>
            {isUploading ? (
              <Spinner size={18} aria-hidden />
            ) : (
              <IconButton
                type="button"
                onClick={handleClear}
                aria-label={t('exercises.removeFile')}
              >
                <X size={16} aria-hidden />
              </IconButton>
            )}
            {isUploading ? (
              <ProgressTrack aria-hidden>
                <ProgressBar />
              </ProgressTrack>
            ) : null}
          </SelectedCard>
        ) : (
          <UploadLabel htmlFor={inputId} $invalid={hasInvalidType}>
            <Upload size={22} aria-hidden />
            <UploadCopy>
              <strong>{t('exercises.chooseCsv')}</strong>
              <span>{t('exercises.csvOnly')}</span>
            </UploadCopy>
          </UploadLabel>
        )}
        <FileInput
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => handleSelect(event.target.files?.[0] ?? null)}
        />

        {hasInvalidType ? (
          <InlineError role="alert">{t('exercises.csvInvalidType')}</InlineError>
        ) : null}

        {file && !isUploading ? (
          <ChangeFile htmlFor={inputId}>{t('exercises.changeFile')}</ChangeFile>
        ) : null}

        {showResult && result ? (
          <ResultBanner $tone={errorCount > 0 ? 'warning' : 'success'} role="status">
            {errorCount > 0 ? (
              <AlertTriangle size={18} aria-hidden />
            ) : (
              <CheckCircle2 size={18} aria-hidden />
            )}
            <ResultText>
              {t('exercises.createdResult', { count: result.created })}
              {errorCount > 0 ? t('exercises.skippedRows', { count: errorCount }) : ''}.
            </ResultText>
          </ResultBanner>
        ) : null}

        {showResult && result?.errors.length ? (
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
          {showResult ? null : (
            <PrimaryButton type="button" disabled={!file || isUploading} onClick={handleSubmit}>
              {isUploading ? (
                <>
                  <Spinner size={16} aria-hidden />
                  {t('exercises.uploading')}
                </>
              ) : (
                t('exercises.uploadCsv')
              )}
            </PrimaryButton>
          )}
        </Actions>
      </Content>
    </Modal>
  );
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const slide = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(320%);
  }
`;

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

const UploadLabel = styled.label<{ $invalid: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 1rem;
  border: 1px dashed ${({ $invalid }) => ($invalid ? '#ff8a80' : '#3a3d59')};
  background: #181a2e;
  padding: 1.2rem;
  color: #f7f7ff;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;

  &:hover {
    border-color: #ffb3b1;
    background: #1d2036;
  }
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

const SelectedCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
  border-radius: 1rem;
  border: 1px solid rgba(126, 231, 168, 0.45);
  background: rgba(37, 74, 55, 0.35);
  padding: 1rem 1.2rem;
`;

const FileIcon = styled.span`
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  place-items: center;
  border-radius: 0.75rem;
  background: rgba(126, 231, 168, 0.16);
  color: #7ee7a8;
`;

const FileInfo = styled.span`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.2rem;
`;

const FileName = styled.strong`
  overflow: hidden;
  color: #f7f7ff;
  font-size: 0.95rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileMeta = styled.span`
  color: #9fe6bd;
  font-size: 0.78rem;
  font-weight: 700;
`;

const IconButton = styled.button`
  display: grid;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #313349;
  color: #ffdad6;
  cursor: pointer;

  &:hover {
    background: #3d4060;
  }
`;

const ProgressTrack = styled.span`
  position: relative;
  flex-basis: 100%;
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
`;

const ProgressBar = styled.span`
  position: absolute;
  inset: 0;
  width: 40%;
  border-radius: 999px;
  background: linear-gradient(135deg, #7ee7a8 0%, #4cc98a 100%);
  animation: ${slide} 1.1s ease-in-out infinite;
`;

const ChangeFile = styled.label`
  align-self: flex-start;
  margin-top: -0.65rem;
  color: #ffb3b1;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: underline;
`;

const InlineError = styled.p`
  margin: -0.65rem 0 0;
  color: #ffb4ab;
  font-size: 0.82rem;
  font-weight: 700;
`;

const Spinner = styled(Loader2)`
  flex-shrink: 0;
  animation: ${spin} 0.9s linear infinite;
`;

const ResultBanner = styled.div<{ $tone: 'success' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border-radius: 0.9rem;
  border: 1px solid
    ${({ $tone }) => ($tone === 'success' ? 'rgba(126, 231, 168, 0.45)' : 'rgba(255, 199, 116, 0.45)')};
  background: ${({ $tone }) =>
    $tone === 'success' ? 'rgba(37, 74, 55, 0.35)' : 'rgba(90, 68, 26, 0.35)'};
  color: ${({ $tone }) => ($tone === 'success' ? '#9fe6bd' : '#ffc774')};
  padding: 0.85rem 1.1rem;
`;

const ResultText = styled.p`
  margin: 0;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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
