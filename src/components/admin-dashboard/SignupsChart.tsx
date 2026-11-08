import styled from 'styled-components';
import type { OverviewRole, SignupDay } from '../../types/adminOverview';
import { ROLE_COLORS } from './colors';

const ROLES: OverviewRole[] = ['Client', 'Trainer', 'Gym'];
const WIDTH = 640;
const HEIGHT = 210;
const LEFT = 30;
const RIGHT = WIDTH - 6;
const TOP = 10;
const BOTTOM = 180;

type SignupsChartProps = {
  days: SignupDay[];
  locale: string;
  ariaLabel: string;
};

/** Rounds the axis maximum up to a multiple of 4 so all 5 ticks are integers. */
function niceMax(value: number): number {
  return Math.max(4, Math.ceil(value / 4) * 4);
}

/**
 * Stacked daily signups by role, drawn as plain SVG so every bar and tick
 * shares one scale.
 */
export function SignupsChart({ days, locale, ariaLabel }: SignupsChartProps) {
  const totals = days.map((d) => d.Client + d.Trainer + d.Gym);
  const max = niceMax(Math.max(0, ...totals));
  const ticks = [0, max / 4, max / 2, (max * 3) / 4, max];
  const slot = (RIGHT - LEFT) / Math.max(1, days.length);
  const y = (v: number) => BOTTOM - (v / max) * (BOTTOM - TOP);
  const dateLabel = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  const labelIdx = days.length ? [0, Math.floor(days.length / 3), Math.floor((2 * days.length) / 3), days.length - 1] : [];

  return (
    <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel} data-testid="signups-chart">
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={LEFT} x2={RIGHT} y1={y(tick)} y2={y(tick)} stroke="rgba(126,136,175,0.16)" />
          <text x={LEFT - 8} y={y(tick) + 3} textAnchor="end">
            {tick}
          </text>
        </g>
      ))}
      {days.map((day, i) => {
        let base = 0;
        return (
          <g key={day.date}>
            <title>{`${dateLabel(day.date)} · ${ROLES.map((r) => `${r}: ${day[r]}`).join(', ')}`}</title>
            {ROLES.map((role) => {
              const value = day[role];
              if (!value) return null;
              const top = y(base + value);
              const height = y(base) - top;
              base += value;
              return (
                <rect
                  key={role}
                  x={LEFT + i * slot + 2}
                  y={top}
                  width={Math.max(1, slot - 4)}
                  height={height}
                  rx={2}
                  fill={ROLE_COLORS[role]}
                />
              );
            })}
          </g>
        );
      })}
      {labelIdx.map((i, n) => (
        <text
          key={`${days[i].date}-${n}`}
          x={LEFT + i * slot + slot / 2}
          y={BOTTOM + 18}
          textAnchor={n === labelIdx.length - 1 ? 'end' : n === 0 ? 'start' : 'middle'}
        >
          {dateLabel(days[i].date)}
        </text>
      ))}
    </Svg>
  );
}

const Svg = styled.svg`
  width: 100%;
  height: auto;
  margin-top: 0.75rem;

  text {
    fill: #8a90b2;
    font-size: 10px;
    font-variant-numeric: tabular-nums;
  }
`;
