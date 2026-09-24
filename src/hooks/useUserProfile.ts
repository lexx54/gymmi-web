import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfileApi, updateUserProfileApi } from '../services/api/user';
import type { FullUserProfile, UpdateProfilePayload } from '../types/auth';

export const USER_PROFILE_QUERY_KEY = ['user-profile'];

export function useUserProfile(enabled: boolean = true) {
  return useQuery<FullUserProfile>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: fetchUserProfileApi,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateUserProfileApi(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
  });
}
