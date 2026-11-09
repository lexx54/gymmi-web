import styled from 'styled-components';

/** Shared building blocks for the admin dashboard and admin analytics views. */

export const Eyebrow = styled.p`
  margin: 0;
  color: #d4d8ee;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.65rem;
  font-weight: 700;
`;

export const Card = styled.article`
  min-width: 0;
  border-radius: 1.35rem;
  border: 1px solid rgba(126, 136, 175, 0.18);
  background: linear-gradient(180deg, #181d36 0%, #12152d 100%);
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const CardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const CardTitle = styled.h3`
  margin: 0.35rem 0 0;
  color: #f4f5ff;
  font-size: 1.2rem;
  font-weight: 800;
  text-transform: uppercase;
`;

export const Muted = styled.p`
  margin: 0;
  color: #8a90b2;
  font-size: 0.8rem;
`;

export const Delta = styled.span<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? '#3ecf8e' : '#ef4d5f')};
  font-weight: 700;
`;

export const Dot = styled.i<{ $color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  font-size: 0.75rem;
  color: #8a90b2;
  margin-top: 0.5rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

export const Bars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.9rem;
`;

export const BarRow = styled.div`
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr) 4.5rem;
  gap: 0.6rem;
  align-items: center;
  font-size: 0.75rem;
  color: #d4d8ee;

  span:last-child {
    text-align: right;
  }
`;

export const Track = styled.div`
  height: 8px;
  border-radius: 99px;
  background: rgba(126, 136, 175, 0.16);
  overflow: hidden;
`;

export const Fill = styled.div`
  height: 100%;
  border-radius: 99px;
  background: #ef233c;
`;

export const MiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 0.9rem;
`;

export const MiniValue = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #f5f6ff;
`;

export const MiniLabel = styled.p`
  margin: 0;
  font-size: 0.72rem;
  color: #8a90b2;
`;

export const ErrorBox = styled.div`
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  border: 1px solid rgba(239, 77, 95, 0.4);
  background: rgba(239, 77, 95, 0.08);
  color: #f5f6ff;
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: #efc0c4;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
`;

/** Small stat: big number over a short label. */
export function Mini({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div>
      <MiniValue style={color ? { color } : undefined}>{value}</MiniValue>
      <MiniLabel>{label}</MiniLabel>
    </div>
  );
}
