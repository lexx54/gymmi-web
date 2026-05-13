import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api/client';

/** Row shape returned by `GET /list/equipments` and `GET /list/muscles`. */
export type ListCatalogItem = {
  id: string;
  name: string;
  type: string;
  description: string;
};

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

export function useListEquipments() {
  return useListData<ListCatalogItem>('equipments');
}

export function useListMuscles() {
  return useListData<ListCatalogItem>('muscles');
}
