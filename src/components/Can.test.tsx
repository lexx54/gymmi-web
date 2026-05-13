import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Can } from './Can';

vi.mock('../hooks/usePermissions', () => ({
  useHasPermission: (resource: string, action: string) => {
    return resource === 'exercises' && action === 'CREATE';
  },
}));

describe('Can', () => {
  it('renders children when permission is allowed', () => {
    render(
      <Can resource="exercises" action="CREATE">
        <button>Create</button>
      </Can>,
    );
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('hides children when permission is denied', () => {
    render(
      <Can resource="exercises" action="DELETE">
        <button>Delete</button>
      </Can>,
    );
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('renders fallback when permission is denied', () => {
    render(
      <Can resource="exercises" action="DELETE" fallback={<span>No access</span>}>
        <button>Delete</button>
      </Can>,
    );
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.getByText('No access')).toBeInTheDocument();
  });
});
