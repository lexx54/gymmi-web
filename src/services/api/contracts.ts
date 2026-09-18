import apiClient from './client';
import type { WorkoutAssignment, WorkoutPeriod } from './workouts';

export type ContractStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export type ContractParty = {
  id: string;
  email: string;
  username: string;
};

export type TrainerContract = {
  id: string;
  clientId: string;
  trainerId: string;
  period: WorkoutPeriod;
  customEndDate: string | null;
  startDate: string | null;
  endDate: string | null;
  status: ContractStatus;
  respondedAt: string | null;
  createdAt: string;
  client?: ContractParty;
  trainer?: ContractParty;
};

export type WorkoutSessionNote = {
  id: string;
  clientId: string;
  routineId: string;
  weekday: number;
  weekStartDate: string;
  status: 'COMPLETED' | 'INCOMPLETE';
  stopReason: string | null;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
};

export type ContractClientRoster = {
  client: ContractParty;
  contracts: TrainerContract[];
  assignments: WorkoutAssignment[];
  sessions: WorkoutSessionNote[];
};

export type CreateContractWrite = {
  trainerId: string;
  period: WorkoutPeriod;
  customEndDate?: string;
};

/** Lists trainers a client can request a contract with. */
export async function fetchContractTrainers(): Promise<ContractParty[]> {
  const { data } = await apiClient.get<ContractParty[]>('/contracts/trainers');
  return data;
}

/** Lists the signed-in user's contracts. */
export async function fetchMyContracts(): Promise<TrainerContract[]> {
  const { data } = await apiClient.get<TrainerContract[]>('/contracts/me');
  return data;
}

/** Lists the trainer roster with assignments and session notes. */
export async function fetchContractClients(): Promise<ContractClientRoster[]> {
  const { data } = await apiClient.get<ContractClientRoster[]>('/contracts/clients');
  return data;
}

/** Client requests a contract with a trainer. */
export async function createContract(params: CreateContractWrite): Promise<TrainerContract> {
  const { data } = await apiClient.post<TrainerContract>('/contracts', params);
  return data;
}

/** Trainer accepts a pending contract. */
export async function acceptContract(id: string): Promise<TrainerContract> {
  const { data } = await apiClient.post<TrainerContract>(`/contracts/${id}/accept`);
  return data;
}

/** Trainer rejects a pending contract. */
export async function rejectContract(id: string): Promise<TrainerContract> {
  const { data } = await apiClient.post<TrainerContract>(`/contracts/${id}/reject`);
  return data;
}

/** Client cancels a pending contract. */
export async function cancelContract(id: string): Promise<TrainerContract> {
  const { data } = await apiClient.post<TrainerContract>(`/contracts/${id}/cancel`);
  return data;
}
