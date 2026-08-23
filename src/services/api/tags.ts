import apiClient from './client';

export type Tag = {
  id: string;
  name: string;
  isGlobal: boolean;
  createdById: string;
  createdAt: string;
};

export type CreateTagParams = {
  name: string;
};

export async function fetchTags(): Promise<Tag[]> {
  const { data } = await apiClient.get<Tag[]>('/tags');
  return data;
}

export async function createTag(params: CreateTagParams): Promise<Tag> {
  const { data } = await apiClient.post<Tag>('/tags', params);
  return data;
}
