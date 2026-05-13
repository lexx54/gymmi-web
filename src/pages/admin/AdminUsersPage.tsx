import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import styled from 'styled-components';
import { fetchAdminUsers, fetchRoles, patchAdminUser } from '../../services/api/admin';
import type { PaginatedUsers, RoleDto } from '../../types/rbac';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  ExercisesContent,
  ExercisesMain,
  ExercisesPageShell,
} from '../../components/exercises/ExercisesShell';
import { ExercisesHeader } from '../../components/exercises/ExercisesHeader';
import { useState } from 'react';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const username = user?.username ?? 'Admin';
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: roles } = useQuery<RoleDto[]>({
    queryKey: ['admin', 'roles'],
    queryFn: fetchRoles,
  });

  const { data: usersData, isLoading } = useQuery<PaginatedUsers>({
    queryKey: ['admin', 'users', page],
    queryFn: () => fetchAdminUsers(page),
  });

  const patchMutation = useMutation({
    mutationFn: (vars: { userId: string; body: { roleId?: string; isActive?: boolean } }) =>
      patchAdminUser(vars.userId, vars.body),
    onSuccess: () => {
      toast.success('User updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? 'Failed to update user');
    },
  });

  const totalPages = usersData ? Math.ceil(usersData.total / usersData.limit) : 1;

  return (
    <ExercisesPageShell>
      <Sidebar username={username} />
      <ExercisesMain>
        <ExercisesHeader title="User Management" />
        <ExercisesContent>
          <Card>
            {isLoading ? (
              <p style={{ color: '#e0e0fc', textAlign: 'center', padding: '2rem' }}>Loading...</p>
            ) : (
              <>
                <Table>
                  <thead>
                    <tr>
                      <Th>Username</Th>
                      <Th>Email</Th>
                      <Th>Role</Th>
                      <Th>Active</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.items.map((u) => (
                      <tr key={u.id}>
                        <Td>{u.username}</Td>
                        <Td>{u.email}</Td>
                        <Td>
                          <RoleSelect
                            value={u.roleId}
                            onChange={(e) =>
                              patchMutation.mutate({ userId: u.id, body: { roleId: e.target.value } })
                            }
                          >
                            {roles?.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </RoleSelect>
                        </Td>
                        <Td>
                          <input
                            type="checkbox"
                            checked={u.isActive}
                            onChange={(e) =>
                              patchMutation.mutate({
                                userId: u.id,
                                body: { isActive: e.target.checked },
                              })
                            }
                            style={{ accentColor: '#ff535a', width: 18, height: 18 }}
                          />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination>
                  <PageButton disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Prev
                  </PageButton>
                  <PageInfo>
                    Page {page} of {totalPages}
                  </PageInfo>
                  <PageButton disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </PageButton>
                </Pagination>
              </>
            )}
          </Card>
        </ExercisesContent>
      </ExercisesMain>
    </ExercisesPageShell>
  );
}

const Card = styled.section`
  background-color: #181a2e;
  border-radius: 0.85rem;
  padding: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  color: #e7bdbb;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.62rem;
  font-weight: 700;
  border-bottom: 1px solid #262840;
`;

const Td = styled.td`
  padding: 0.75rem 0.5rem;
  color: #e0e0fc;
  font-size: 0.9rem;
  border-bottom: 1px solid #1c1e32;
`;

const RoleSelect = styled.select`
  background-color: #1c1e32;
  border: none;
  border-radius: 0.45rem;
  color: #e0e0fc;
  padding: 0.45rem 0.65rem;
  font-size: 0.85rem;
  outline: none;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #262840;
  border-radius: 0.45rem;
  background-color: #1c1e32;
  color: #e0e0fc;
  font-size: 0.8rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #e7bdbb;
  font-size: 0.8rem;
`;
