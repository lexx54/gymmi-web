import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTag, fetchTags, type CreateTagParams, type Tag } from '../services/api/tags';

export const tagsQueryKey = ['tags'] as const;

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: tagsQueryKey,
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateTagParams) => createTag(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsQueryKey });
    },
  });
}
