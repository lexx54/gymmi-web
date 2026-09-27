import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchMyGym,
  updateMyGym,
  fetchMyGymMembers,
  removeGymMember,
  fetchMyGymCoaches,
  approveGymCoach,
  rejectGymCoach,
  updateCoachPermissions,
  removeGymCoach,
  upgradeGymTier,
  fetchPublicGyms,
  fetchPublicGym,
  joinGym,
  leaveGym,
  fetchMyMemberships,
  requestAffiliation,
  fetchMyAffiliations,
} from '../services/api/gyms';
import type { GymProfileParams } from '../types/auth';

export const myGymQueryKey = ['gyms', 'me'] as const;
export const myGymMembersQueryKey = ['gyms', 'me', 'members'] as const;
export const myGymCoachesQueryKey = ['gyms', 'me', 'coaches'] as const;
export const publicGymsQueryKey = (params?: { search?: string; city?: string }) =>
  ['gyms', 'public', params] as const;
export const myMembershipsQueryKey = ['gyms', 'me', 'memberships'] as const;
export const myAffiliationsQueryKey = ['gyms', 'me', 'affiliations'] as const;

export function useMyGym(enabled = true) {
  return useQuery({
    queryKey: myGymQueryKey,
    queryFn: fetchMyGym,
    enabled,
  });
}

export function useUpdateMyGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GymProfileParams>) => updateMyGym(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myGymQueryKey });
    },
  });
}

export function useMyGymMembers(enabled = true) {
  return useQuery({
    queryKey: myGymMembersQueryKey,
    queryFn: fetchMyGymMembers,
    enabled,
  });
}

export function useRemoveGymMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => removeGymMember(memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myGymMembersQueryKey });
      void queryClient.invalidateQueries({ queryKey: myGymQueryKey });
    },
  });
}

export function useMyGymCoaches(enabled = true) {
  return useQuery({
    queryKey: myGymCoachesQueryKey,
    queryFn: fetchMyGymCoaches,
    enabled,
  });
}

export function useApproveGymCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coachId: string) => approveGymCoach(coachId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myGymCoachesQueryKey });
      void queryClient.invalidateQueries({ queryKey: myGymQueryKey });
    },
  });
}

export function useRejectGymCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coachId: string) => rejectGymCoach(coachId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myGymCoachesQueryKey });
    },
  });
}

export function useUpdateCoachPermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      coachId,
      canPublishRoutines,
    }: {
      coachId: string;
      canPublishRoutines: boolean;
    }) => updateCoachPermissions(coachId, canPublishRoutines),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myGymCoachesQueryKey });
    },
  });
}

export function useRemoveGymCoach() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coachId: string) => removeGymCoach(coachId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myGymCoachesQueryKey });
      void queryClient.invalidateQueries({ queryKey: myGymQueryKey });
    },
  });
}

export function useUpgradeGymTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tier: string) => upgradeGymTier(tier),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myGymQueryKey });
    },
  });
}

export function usePublicGyms(params?: { search?: string; city?: string }) {
  return useQuery({
    queryKey: publicGymsQueryKey(params),
    queryFn: () => fetchPublicGyms(params),
  });
}

export function usePublicGym(id: string, enabled = true) {
  return useQuery({
    queryKey: ['gyms', 'public', id],
    queryFn: () => fetchPublicGym(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useJoinGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gymId: string) => joinGym(gymId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myMembershipsQueryKey });
    },
  });
}

export function useLeaveGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gymId: string) => leaveGym(gymId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myMembershipsQueryKey });
    },
  });
}

export function useMyMemberships(enabled = true) {
  return useQuery({
    queryKey: myMembershipsQueryKey,
    queryFn: fetchMyMemberships,
    enabled,
  });
}

export function useRequestAffiliation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gymId: string) => requestAffiliation(gymId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myAffiliationsQueryKey });
    },
  });
}

export function useMyAffiliations(enabled = true) {
  return useQuery({
    queryKey: myAffiliationsQueryKey,
    queryFn: fetchMyAffiliations,
    enabled,
  });
}
