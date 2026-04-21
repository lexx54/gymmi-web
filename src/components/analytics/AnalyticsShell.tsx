import type { ReactNode } from 'react';
import styled from 'styled-components';

type AnalyticsCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Shared surface for all analytics content blocks.
 * Provides the dark rounded card styling used across the analytics screen.
 */
export function AnalyticsCard({ children, className }: AnalyticsCardProps) {
  return <CardSurface className={className}>{children}</CardSurface>;
}

/**
 * Shared eyebrow label (all-caps muted label above a card title).
 */
export const Eyebrow = styled.p`
  margin: 0 0 0.4rem;
  color: #9096b6;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.7rem;
  font-weight: 600;
`;

/**
 * Shared card title styling used for section headings.
 */
export const CardTitle = styled.h2`
  margin: 0;
  color: #f5f6ff;
  font-size: 2.1rem;
  font-weight: 700;
  line-height: 1.05;
`;

/**
 * Page-level container that mirrors the dark shell used on the dashboard,
 * but without the radial highlight so analytics cards read cleanly.
 */
export const AnalyticsPageShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0b1020;
  color: #f7f7ff;
`;

export const AnalyticsMain = styled.main`
  flex: 1;
  padding: 1.4rem 2rem 2.5rem;
  position: relative;
`;

export const AnalyticsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.75rem;
`;

const CardSurface = styled.section`
  border-radius: 1.4rem;
  border: 1px solid rgba(126, 136, 175, 0.14);
  background: linear-gradient(180deg, #171b34 0%, #121630 100%);
  padding: 1.5rem 1.6rem;
`;
