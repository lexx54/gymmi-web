import { useQuery } from '@tanstack/react-query';
import {
  fetchClassifications,
  type FetchClassificationsParams,
} from '../services/api/classifications';

export const classificationsQueryKey = (params: FetchClassificationsParams) =>
  ['classifications', params] as const;

export function useClassifications(
  params: FetchClassificationsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: classificationsQueryKey(params),
    queryFn: () => fetchClassifications(params),
    enabled: enabled && Boolean(params.cohortId),
  });
}
