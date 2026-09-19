import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptContract,
  cancelContract,
  createContract,
  endContract,
  fetchContractClients,
  fetchContractTrainers,
  fetchMyContracts,
  rejectContract,
  type CreateContractWrite,
} from '../services/api/contracts';
import { myPermissionsQueryKey } from './usePermissions';

export const myContractsQueryKey = ['contracts', 'me'] as const;
export const contractClientsQueryKey = ['contracts', 'clients'] as const;
export const contractTrainersQueryKey = ['contracts', 'trainers'] as const;

export function useMyContracts(enabled = true) {
  return useQuery({
    queryKey: myContractsQueryKey,
    queryFn: fetchMyContracts,
    enabled,
  });
}

export function useContractClients(enabled = true) {
  return useQuery({
    queryKey: contractClientsQueryKey,
    queryFn: fetchContractClients,
    enabled,
  });
}

export function useContractTrainers(enabled = true) {
  return useQuery({
    queryKey: contractTrainersQueryKey,
    queryFn: fetchContractTrainers,
    enabled,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateContractWrite) => createContract(params),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myContractsQueryKey });
      void queryClient.invalidateQueries({ queryKey: myPermissionsQueryKey });
    },
  });
}

export function useRespondContract() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: myContractsQueryKey });
    void queryClient.invalidateQueries({ queryKey: contractClientsQueryKey });
    void queryClient.invalidateQueries({ queryKey: contractTrainersQueryKey });
    void queryClient.invalidateQueries({ queryKey: myPermissionsQueryKey });
  };
  return {
    accept: useMutation({ mutationFn: acceptContract, onSuccess: invalidate }),
    reject: useMutation({ mutationFn: rejectContract, onSuccess: invalidate }),
    cancel: useMutation({ mutationFn: cancelContract, onSuccess: invalidate }),
    end: useMutation({ mutationFn: endContract, onSuccess: invalidate }),
  };
}
