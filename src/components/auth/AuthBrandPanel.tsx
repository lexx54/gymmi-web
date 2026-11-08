import type { ReactNode } from 'react';
import styled from 'styled-components';
import { GymmiLogo } from '../common/GymmiLogo';

type AuthBrandPanelProps = {
  children: ReactNode;
  /** Panel width on desktop (hidden below 1024px). */
  width?: string;
};

/**
 * Dark brand panel shown on the left of the login and signup pages:
 * logo lockup at the top, a large cropped mark in the top-right corner,
 * and page-specific content (children) anchored to the bottom.
 */
export function AuthBrandPanel({ children, width = '46%' }: AuthBrandPanelProps) {
  return (
    <Panel $width={width}>
      <GiantMark size="100%" />
      <Lockup>
        <GymmiLogo size={44} title="Gymmi" />
        <BrandWordmark>Gymmi</BrandWordmark>
      </Lockup>
      <Bottom>{children}</Bottom>
    </Panel>
  );
}

export const BRAND_INK = '#2b2d42';
export const BRAND_RED = '#ef233c';

const Panel = styled.aside<{ $width: string }>`
  display: none;
  position: relative;
  overflow: hidden;
  background-color: ${BRAND_INK};
  color: #ffffff;
  padding: 3rem;
  flex-direction: column;
  justify-content: space-between;
  gap: 3rem;

  @media (min-width: 1024px) {
    display: flex;
    width: ${({ $width }) => $width};
    flex: none;
    /* Stay in view while a long form (signup) scrolls beside it. */
    position: sticky;
    top: 0;
    height: 100vh;
    align-self: flex-start;
  }
`;

const GiantMark = styled(GymmiLogo)`
  position: absolute;
  width: 72%;
  height: auto;
  aspect-ratio: 1;
  top: -16%;
  right: -22%;
  pointer-events: none;
`;

const Lockup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const BrandWordmark = styled.span<{ $dark?: boolean }>`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ $dark }) => ($dark ? BRAND_INK : '#ffffff')};
`;

const Bottom = styled.div`
  position: relative;
  display: grid;
  gap: 1.5rem;
  max-width: 32rem;
  margin-bottom: 2rem;
`;

export const BrandHeadline = styled.h1`
  margin: 0;
  font-size: clamp(2.25rem, 3.4vw, 3rem);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-wrap: balance;

  em {
    font-style: normal;
    color: ${BRAND_RED};
  }
`;

export const BrandFeatureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  font-size: 1rem;
  color: #c8cede;

  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  li::before {
    content: '';
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 0.15rem;
    background-color: ${BRAND_RED};
    transform: rotate(-10deg);
    flex: none;
  }
`;
