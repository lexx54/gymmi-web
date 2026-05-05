import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api/client';

/**
 * Generic hook to fetch data from any sub-endpoint under the /list controller.
 * As new entities are added to the list controller (e.g. /list/muscles, /list/categories),
 * this same hook can be reused by passing the resource name.
 */
export function useListData<T = unknown>(resource: string) {
  return useQuery<T[]>({
    queryKey: ['list', resource],
    queryFn: async () => {
      const { data } = await apiClient.get<T[]>(`/list/${resource}`);
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}
