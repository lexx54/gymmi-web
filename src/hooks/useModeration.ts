import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  blockUser,
  fetchAdminReports,
  reportContent,
  resolveAdminReport,
} from '../services/api/moderation';
import type {
  CreateReportPayload,
  ReportStatus,
  ReportTargetType,
  ResolveReportPayload,
} from '../types/moderation';

export const adminReportsQueryKey = (page: number, status: ReportStatus | 'ALL') =>
  ['admin', 'reports', page, status] as const;

export function useReportContent() {
  return useMutation({
    mutationFn: ({
      targetType,
      targetId,
      payload,
    }: {
      targetType: ReportTargetType;
      targetId: string;
      payload: CreateReportPayload;
    }) => reportContent(targetType, targetId, payload),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => blockUser(userId),
    onSuccess: () => {
      // Blocked authors disappear from feeds and comment threads.
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

export function useAdminReports(page: number, status: ReportStatus | 'ALL') {
  return useQuery({
    queryKey: adminReportsQueryKey(page, status),
    queryFn: () => fetchAdminReports(page, 20, status),
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ResolveReportPayload }) =>
      resolveAdminReport(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      void queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}
