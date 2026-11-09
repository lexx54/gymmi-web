import styled from 'styled-components';
import type { AnalyticsBucket } from '../../types/adminAnalytics';
import { bucketLabel, niceMax } from './format';

export type TrendSeries = { key: string; color: string; label: string };
/** Any bucket row; series values are read by key. */
export type TrendPoint = { date: string };

type TrendChartProps = {
  points: TrendPoint[];
  series: TrendSeries[];
  /** `stacked` draws bars stacked per bucket; `line` draws one line per series. */
  mode: 'stacked' | 'line';
  bucket: AnalyticsBucket;
  locale: string;
  ariaLabel: string;
  formatValue?: (value: number) => string;
  testId?: string;
};

const WIDTH = 640;
const HEIGHT = 210;
const LEFT = 46;
const RIGHT = WIDTH - 8;
const TOP = 10;
const BOTTOM = 180;

/**
 * Time-series chart for admin analytics, drawn as plain SVG so bars, lines
 * and ticks share one scale. Each bucket carries a `<title>` tooltip.
 */
export function TrendChart({
  points,
  series,
  mode,
  bucket,
  locale,
  ariaLabel,
  formatValue = (v) => new Intl.NumberFormat(locale).format(v),
  testId,
}: TrendChartProps) {
  const value = (p: TrendPoint, key: string) =>
    Number((p as unknown as Record<string, unknown>)[key] ?? 0);
  const peaks = points.map((p) =>
    mode === 'stacked'
      ? series.reduce((sum, s) => sum + value(p, s.key), 0)
      : Math.max(0, ...series.map((s) => value(p, s.key))),
  );
  const max = niceMax(Math.max(0, ...peaks));
  const ticks = [0, max / 4, max / 2, (max * 3) / 4, max];
  const slot = (RIGHT - LEFT) / Math.max(1, points.length);
  const x = (i: number) => LEFT + i * slot + slot / 2;
  const y = (v: number) => BOTTOM - (v / max) * (BOTTOM - TOP);
  const n = points.length;
  const labelIdx = n <= 7 ? points.map((_, i) => i) : [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1];

  return (
    <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel} data-testid={testId}>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={LEFT} x2={RIGHT} y1={y(tick)} y2={y(tick)} stroke="rgba(126,136,175,0.16)" />
          <text x={LEFT - 8} y={y(tick) + 3} textAnchor="end">
            {formatValue(tick)}
          </text>
        </g>
      ))}

      {points.map((p, i) => {
        const tip = `${bucketLabel(p.date, bucket, locale)} · ${series
          .map((s) => `${s.label}: ${formatValue(value(p, s.key))}`)
          .join(', ')}`;
        if (mode === 'line') {
          // Invisible hit area so each bucket still has a tooltip.
          return (
            <rect key={p.date} x={LEFT + i * slot} y={TOP} width={slot} height={BOTTOM - TOP} fill="transparent">
              <title>{tip}</title>
            </rect>
          );
        }
        let base = 0;
        return (
          <g key={p.date}>
            <title>{tip}</title>
            {series.map((s) => {
              const v = value(p, s.key);
              if (!v) return null;
              const top = y(base + v);
              const height = y(base) - top;
              base += v;
              return (
                <rect
                  key={s.key}
                  x={LEFT + i * slot + 2}
                  y={top}
                  width={Math.max(1, slot - 4)}
                  height={height}
                  rx={2}
                  fill={s.color}
                />
              );
            })}
          </g>
        );
      })}

      {mode === 'line' &&
        series.map((s) => (
          <g key={s.key} pointerEvents="none">
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              points={points.map((p, i) => `${x(i)},${y(value(p, s.key))}`).join(' ')}
            />
            {n <= 31 &&
              points.map((p, i) => (
                <circle key={p.date} cx={x(i)} cy={y(value(p, s.key))} r={2.5} fill={s.color} />
              ))}
          </g>
        ))}

      {labelIdx.map((i, k) => (
        <text
          key={`${points[i].date}-${k}`}
          x={x(i)}
          y={BOTTOM + 18}
          textAnchor={n > 7 && k === labelIdx.length - 1 ? 'end' : n > 7 && k === 0 ? 'start' : 'middle'}
        >
          {bucketLabel(points[i].date, bucket, locale)}
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
