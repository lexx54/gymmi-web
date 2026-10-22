export const REPORT_REASONS = [
  'SPAM',
  'HARASSMENT',
  'HATE_SPEECH',
  'SEXUAL_CONTENT',
  'VIOLENCE',
  'MISINFORMATION',
  'OTHER',
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export type ReportTargetType = 'ARTICLE' | 'COMMENT' | 'USER';

export type ReportStatus = 'OPEN' | 'ACTION_TAKEN' | 'DISMISSED';

export interface CreateReportPayload {
  reason: ReportReason;
  details?: string;
}

export interface BlockedUser {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  blockedAt: string;
}

export interface AdminReport {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  details: string | null;
  contentSnapshot: string | null;
  status: ReportStatus;
  resolutionNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  reporter: { id: string; username: string } | null;
  targetUser: { id: string; username: string; isActive: boolean } | null;
}

export interface PaginatedAdminReports {
  items: AdminReport[];
  total: number;
  page: number;
  limit: number;
}

export interface ResolveReportPayload {
  status: 'ACTION_TAKEN' | 'DISMISSED';
  removeContent?: boolean;
  deactivateUser?: boolean;
  note?: string;
}
