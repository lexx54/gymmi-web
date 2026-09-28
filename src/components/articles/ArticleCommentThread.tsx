import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styled from 'styled-components';
import {
  useArticleComments,
  useCreateArticleComment,
  useDeleteArticleComment,
} from '../../hooks/useArticles';

interface ArticleCommentThreadProps {
  articleId: string;
}

export function ArticleCommentThread({ articleId }: ArticleCommentThreadProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const { data: comments = [], isLoading } = useArticleComments(articleId);
  const createCommentMutation = useCreateArticleComment();
  const deleteCommentMutation = useDeleteArticleComment();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      await createCommentMutation.mutateAsync({ articleId, content: trimmed });
      setContent('');
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({ articleId, commentId });
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <Container>
      <Header>
        <MessageSquare size={18} color="#ef233c" />
        <Heading>
          {t('articles.comments.title', { count: comments.length })}
        </Heading>
      </Header>

      <CommentForm onSubmit={handlePost}>
        <InputWrapper>
          <CommentInput
            rows={2}
            placeholder={t('articles.comments.writePlaceholder')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={createCommentMutation.isPending}
            data-testid="article-comment-input"
          />
          <SubmitButton
            type="submit"
            disabled={!content.trim() || createCommentMutation.isPending}
            data-testid="article-comment-submit-btn"
          >
            <Send size={15} />
            <span>{t('articles.comments.post')}</span>
          </SubmitButton>
        </InputWrapper>
      </CommentForm>

      {isLoading && <LoadingMessage>{t('common.loading')}</LoadingMessage>}

      {!isLoading && comments.length === 0 && (
        <EmptyMessage>{t('articles.comments.noComments')}</EmptyMessage>
      )}

      <List>
        {comments.map((comment) => (
          <CommentItem key={comment.id} data-testid={`comment-item-${comment.id}`}>
            <Avatar>
              {comment.user.avatarUrl ? (
                <img src={comment.user.avatarUrl} alt={comment.user.username} />
              ) : (
                <span>{comment.user.username[0]?.toUpperCase() ?? 'U'}</span>
              )}
            </Avatar>
            <CommentBody>
              <AuthorRow>
                <Username>{comment.user.displayName || comment.user.username}</Username>
                <Timestamp>
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Timestamp>
                {comment.canDelete && (
                  <DeleteBtn
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    title={t('articles.comments.delete')}
                    data-testid={`delete-comment-${comment.id}`}
                  >
                    <Trash2 size={13} />
                  </DeleteBtn>
                )}
              </AuthorRow>
              <Text>{comment.content}</Text>
            </CommentBody>
          </CommentItem>
        ))}
      </List>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 2rem;
  border-top: 1px solid rgba(126, 136, 175, 0.15);
  padding-top: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Heading = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #f7f7ff;
`;

const CommentForm = styled.form`
  margin-bottom: 1.5rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: border-color 0.15s ease;

  &:focus-within {
    border-color: #ef233c;
  }
`;

const CommentInput = styled.textarea`
  width: 100%;
  background: transparent;
  border: none;
  color: #f7f7ff;
  font-family: inherit;
  font-size: 0.88rem;
  resize: vertical;
  outline: none;

  &::placeholder {
    color: #7c84aa;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #ef233c;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #252b48;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: #ef233c;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CommentBody = styled.div`
  flex: 1;
  background: #141830;
  border-radius: 0.75rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid rgba(126, 136, 175, 0.1);
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
`;

const Username = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: #f7f7ff;
`;

const Timestamp = styled.span`
  font-size: 0.72rem;
  color: #7c84aa;
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #7c84aa;
  cursor: pointer;
  margin-left: auto;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  transition: color 0.15s ease;

  &:hover {
    color: #ef233c;
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 0.86rem;
  color: #cbd0e2;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
`;

const LoadingMessage = styled.p`
  color: #7c84aa;
  font-size: 0.85rem;
`;

const EmptyMessage = styled.p`
  color: #7c84aa;
  font-size: 0.85rem;
  font-style: italic;
  margin: 0.5rem 0;
`;
