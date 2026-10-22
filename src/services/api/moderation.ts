import apiClient from './client';
import type {
  BlockedUser,
  CreateReportPayload,
  PaginatedAdminReports,
  ReportStatus,
  ReportTargetType,
  ResolveReportPayload,
} from '../../types/moderation';

const REPORT_PATHS: Record<ReportTargetType, string> = {
  ARTICLE: 'articles',
  COMMENT: 'comments',
  USER: 'users',
};

export async function reportContent(
  targetType: ReportTargetType,
  targetId: string,
  payload: CreateReportPayload,
): Promise<{ id: string; status: ReportStatus }> {
  const { data } = await apiClient.post<{ id: string; status: ReportStatus }>(
    `/reports/${REPORT_PATHS[targetType]}/${targetId}`,
    payload,
  );
  return data;
}

export async function blockUser(userId: string): Promise<{ blocked: boolean }> {
  const { data } = await apiClient.post<{ blocked: boolean }>(`/blocks/${userId}`);
  return data;
}

export async function unblockUser(userId: string): Promise<{ blocked: boolean }> {
  const { data } = await apiClient.delete<{ blocked: boolean }>(`/blocks/${userId}`);
  return data;
}

export async function fetchBlockedUsers(): Promise<BlockedUser[]> {
  const { data } = await apiClient.get<BlockedUser[]>('/blocks');
  return data;
}

export async function fetchAdminReports(
  page = 1,
  limit = 20,
  status: ReportStatus | 'ALL' = 'OPEN',
): Promise<PaginatedAdminReports> {
  const { data } = await apiClient.get<PaginatedAdminReports>('/admin/reports', {
    params: { page, limit, status },
  });
  return data;
}

export async function resolveAdminReport(
  id: string,
  payload: ResolveReportPayload,
): Promise<{ id: string; status: ReportStatus }> {
  const { data } = await apiClient.patch<{ id: string; status: ReportStatus }>(
    `/admin/reports/${id}`,
    payload,
  );
  return data;
}
