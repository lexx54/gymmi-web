import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import styled from 'styled-components';
import { fetchRoles, fetchRolePermissions, updateRolePermissions } from '../../services/api/admin';
import type { PermissionCell, RoleDto } from '../../types/rbac';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  ExercisesContent,
  ExercisesMain,
  ExercisesPageShell,
} from '../../components/exercises/ExercisesShell';
import { ExercisesHeader } from '../../components/exercises/ExercisesHeader';

const ACTIONS = ['READ', 'CREATE', 'EDIT', 'DELETE'];

export default function AdminPermissionsPage() {
  const { user } = useAuth();
  const username = user?.username ?? 'Admin';
  const queryClient = useQueryClient();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<PermissionCell[]>([]);

  const { data: roles } = useQuery<RoleDto[]>({
    queryKey: ['admin', 'roles'],
    queryFn: fetchRoles,
  });

  const { data: perms, isLoading: permsLoading } = useQuery({
    queryKey: ['admin', 'role', selectedRoleId, 'permissions'],
    queryFn: () => fetchRolePermissions(selectedRoleId!),
    enabled: !!selectedRoleId,
  });

  useEffect(() => {
    if (perms) setMatrix(perms);
  }, [perms]);

  useEffect(() => {
    if (roles?.length && !selectedRoleId) {
      const nonSystem = roles.find((r) => !r.isSystem);
      if (nonSystem) setSelectedRoleId(nonSystem.id);
    }
  }, [roles, selectedRoleId]);

  const selectedRole = roles?.find((r) => r.id === selectedRoleId);

  const saveMutation = useMutation({
    mutationFn: () => updateRolePermissions(selectedRoleId!, matrix),
    onSuccess: () => {
      toast.success('Permissions updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'role', selectedRoleId] });
      queryClient.invalidateQueries({ queryKey: ['me', 'permissions'] });
    },
    onError: () => toast.error('Failed to save permissions'),
  });

  const toggle = useCallback(
    (resource: string, action: string) => {
      setMatrix((prev) =>
        prev.map((c) =>
          c.resource === resource && c.action === action ? { ...c, allowed: !c.allowed } : c,
        ),
      );
    },
    [],
  );

  const resources = [...new Set(matrix.map((c) => c.resource))];

  return (
    <ExercisesPageShell>
      <Sidebar username={username} />
      <ExercisesMain>
        <ExercisesHeader title="Role Permissions" />
        <ExercisesContent>
          <Card>
            <TopBar>
              <RoleSelect
                value={selectedRoleId ?? ''}
                onChange={(e) => setSelectedRoleId(e.target.value)}
              >
                {roles
                  ?.filter((r) => !r.isSystem)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </RoleSelect>
              <SaveButton
                disabled={saveMutation.isPending || !selectedRoleId || !!selectedRole?.isSystem}
                onClick={() => saveMutation.mutate()}
              >
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </SaveButton>
            </TopBar>
            {permsLoading ? (
              <p style={{ color: '#e0e0fc', textAlign: 'center', padding: '2rem' }}>Loading...</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Resource</Th>
                    {ACTIONS.map((a) => (
                      <Th key={a}>{a}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resources.map((res) => (
                    <tr key={res}>
                      <Td>{res}</Td>
                      {ACTIONS.map((act) => {
                        const cell = matrix.find(
                          (c) => c.resource === res && c.action === act,
                        );
                        return (
                          <Td key={act}>
                            <input
                              type="checkbox"
                              checked={cell?.allowed ?? false}
                              onChange={() => toggle(res, act)}
                              style={{ accentColor: '#ff535a', width: 18, height: 18 }}
                            />
                          </Td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
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

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const RoleSelect = styled.select`
  background-color: #1c1e32;
  border: none;
  border-radius: 0.55rem;
  color: #e0e0fc;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  outline: none;
`;

const SaveButton = styled.button`
  padding: 0.65rem 1.5rem;
  border: none;
  border-radius: 0.55rem;
  background-color: #ff535a;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  text-transform: capitalize;
`;
