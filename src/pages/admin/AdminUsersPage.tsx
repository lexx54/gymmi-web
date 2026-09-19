import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fetchAdminUsers, fetchRoles, patchAdminUser } from '../../services/api/admin';
import { getApiErrorMessage } from '../../services/api/errors';
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
  const { t } = useTranslation();
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
    mutationFn: (vars: {
      userId: string;
      body: { roleId?: string; isActive?: boolean; hasPaid?: boolean };
    }) =>
      patchAdminUser(vars.userId, vars.body),
    onSuccess: () => {
      toast.success(t('admin.userUpdated'));
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, t('admin.userUpdateFailed')));
    },
  });

  const totalPages = usersData ? Math.ceil(usersData.total / usersData.limit) : 1;

  return (
    <ExercisesPageShell>
      <Sidebar username={username} />
      <ExercisesMain>
        <ExercisesHeader title={t('admin.userManagement')} />
        <ExercisesContent>
          <Card>
            {isLoading ? (
              <p style={{ color: '#e0e0fc', textAlign: 'center', padding: '2rem' }}>{t('common.loading')}</p>
            ) : (
              <>
                <Table>
                  <thead>
                    <tr>
                      <Th>{t('admin.username')}</Th>
                      <Th>{t('admin.email')}</Th>
                      <Th>{t('admin.role')}</Th>
                      <Th>{t('admin.active')}</Th>
                      <Th>{t('admin.plan')}</Th>
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
                        <Td>
                          <PlanLabel $plus={(u.plan ?? (u.hasPaid ? 'plus' : 'free')) === 'plus'}>
                            {t(`entitlements.${u.plan ?? (u.hasPaid ? 'plus' : 'free')}`)}
                          </PlanLabel>
                          <input
                            type="checkbox"
                            checked={u.hasPaid}
                            aria-label={t('admin.togglePlan', { username: u.username })}
                            onChange={(e) =>
                              patchMutation.mutate({
                                userId: u.id,
                                body: { hasPaid: e.target.checked },
                              })
                            }
                            style={{ accentColor: '#ff535a', width: 18, height: 18 }}
                          />
                          {u.downgradeEffectiveAt ? (
                            <GraceText>
                              {t('admin.graceUntil', {
                                date: new Date(u.downgradeEffectiveAt).toLocaleString(),
                              })}
                            </GraceText>
                          ) : null}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination>
                  <PageButton disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    {t('admin.prev')}
                  </PageButton>
                  <PageInfo>
                    {t('admin.pageOf', { page, total: totalPages })}
                  </PageInfo>
                  <PageButton disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    {t('admin.next')}
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

const PlanLabel = styled.span<{ $plus: boolean }>`
  display: inline-block;
  min-width: 2.8rem;
  margin-right: 0.65rem;
  color: ${({ $plus }) => ($plus ? '#9ee0c0' : '#e7bdbb')};
  font-size: 0.78rem;
  font-weight: 800;
`;

const GraceText = styled.small`
  display: block;
  margin-top: 0.3rem;
  color: #ffc774;
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
