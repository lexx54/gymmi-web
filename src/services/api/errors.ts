import type { AxiosError } from 'axios';
import type { EntitlementResource, PlanName } from '../../types/rbac';

export type ApiErrorDetails = {
  code?: 'PLAN_LIMIT' | 'ENTITLEMENT_DENIED' | 'PLAN_DOWNGRADE_BLOCKED' | string;
  message?: string | string[];
  resource?: EntitlementResource;
  reason?: string;
  plan?: PlanName;
  limit?: number;
  usage?: number;
};

/** Returns structured API error response data when available. */
export function getApiErrorDetails(error: unknown): ApiErrorDetails | undefined {
  return (error as AxiosError<ApiErrorDetails>)?.response?.data;
}

/** Returns the first server message with a localized fallback. */
export function getApiErrorMessage(error: unknown, fallback = ''): string {
  const message = getApiErrorDetails(error)?.message;
  if (Array.isArray(message)) return message[0] ?? fallback;
  return message || fallback;
}
