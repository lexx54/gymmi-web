import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  getActivationTier,
  type ActivationTier,
  type ExerciseBodyActivations,
} from './exerciseBodyMapUtils';

type ExerciseBodyMapProps = ExerciseBodyActivations;

type BodyView = 'front' | 'back';

const TIER_COLORS: Record<ActivationTier, string> = {
  primary: '#ff535a',
  secondary: '#bbc7dd',
  stabilizers: '#5d3f3e',
};

const INACTIVE_COLOR = '#313349';
const BODY_OUTLINE = '#6d7088';
const MIRROR = 'translate(200, 0) scale(-1, 1)';

const NECK = 'M92 50 L91 66 Q100 73 109 66 L108 50 Z';
const TORSO =
  'M70 75 Q100 60 130 75 L143 88 Q149 102 143 121 L135 150 Q128 168 126 185 L132 207 Q131 222 117 228 Q100 233 83 228 Q69 222 68 207 L74 185 Q72 168 65 150 L57 121 Q51 102 57 88 Z';
const UPPER_ARM = 'M58 82 Q44 87 39 105 L27 164 Q36 175 48 168 L59 116 Q66 96 58 82 Z';
const FOREARM = 'M27 168 Q37 178 48 172 L38 238 Q30 245 21 237 Z';
const HAND = 'M21 241 Q30 248 38 242 L37 266 Q29 281 19 266 Z';
const THIGH = 'M69 222 Q84 229 99 224 L98 294 Q96 311 83 312 Q69 308 66 286 Z';
const SHIN = 'M69 314 Q82 323 95 314 L92 378 Q90 394 79 394 Q68 392 67 373 Z';
const FOOT = 'M68 395 Q79 401 90 395 L95 413 Q96 422 85 422 L64 422 Q58 420 61 412 Z';

const DELTOID = 'M58 80 Q44 85 39 104 Q49 114 62 104 Q66 89 58 80 Z';
const PEC = 'M73 94 Q87 84 99 94 L99 130 Q83 138 70 121 Q68 105 73 94 Z';
const UPPER_ARM_MUSCLE = 'M40 110 Q51 118 61 109 L50 167 Q40 173 31 161 Z';
const FOREARM_MUSCLE = 'M28 173 Q38 181 47 175 L39 232 Q30 240 23 232 Z';
const ABS = 'M89 132 Q100 126 111 132 L109 199 Q100 207 91 199 Z';
const OBLIQUE = 'M69 126 Q81 135 88 138 L90 199 Q77 194 70 176 Z';
const QUAD = 'M70 230 Q84 237 97 230 L95 287 Q84 299 72 286 Z';
const CALF = 'M69 320 Q82 329 94 320 L91 370 Q81 382 69 369 Z';
const UPPER_BACK = 'M71 88 Q100 73 129 88 L136 141 Q126 163 114 179 L100 187 L86 179 Q74 163 64 141 Z';
const GLUTE = 'M70 202 Q86 195 99 207 L99 234 Q84 244 70 228 Z';
const HAMSTRING = 'M69 239 Q84 247 97 239 L95 291 Q84 304 70 290 Z';

/** Displays front and back anatomical silhouettes for the fixed muscle catalog. */
export function ExerciseBodyMap(props: ExerciseBodyMapProps) {
  const { t } = useTranslation();
  const regionProps = (muscle: string) => {
    const tier = getActivationTier(muscle, props);
    return {
      fill: tier ? TIER_COLORS[tier] : INACTIVE_COLOR,
      'data-muscle': muscle,
      'data-tier': tier ?? 'inactive',
    };
  };

  return (
    <Container>
      <Figures>
        {(['front', 'back'] as const).map((view) => (
          <Figure key={view}>
            <BodySvg
              viewBox="0 0 200 440"
              role="img"
              aria-label={t(view === 'front' ? 'exercises.frontView' : 'exercises.backView')}
            >
              <Body view={view} regionProps={regionProps} />
            </BodySvg>
            <FigureLabel>
              {t(view === 'front' ? 'exercises.frontView' : 'exercises.backView')}
            </FigureLabel>
          </Figure>
        ))}
      </Figures>
      <Legend aria-label={t('exercises.activationHierarchy')}>
        {(['primary', 'secondary', 'stabilizers'] as const).map((tier) => (
          <LegendItem key={tier}>
            <LegendDot $color={TIER_COLORS[tier]} />
            {t(`exercises.${tier}`)}
          </LegendItem>
        ))}
      </Legend>
    </Container>
  );
}

type BodyProps = {
  view: BodyView;
  regionProps: (muscle: string) => Record<string, string>;
};

/** Anatomical silhouette; one half is drawn and mirrored to keep the body symmetric. */
function Body({ view, regionProps }: BodyProps) {
  return (
    <g stroke={BODY_OUTLINE} strokeWidth="1.4" strokeLinejoin="round">
      <ellipse cx="100" cy="33" rx="15" ry="20" fill={INACTIVE_COLOR} />
      <path d={NECK} fill={INACTIVE_COLOR} />
      <path d={TORSO} fill={INACTIVE_COLOR} />
      {view === 'front' ? (
        <>
          <path d={ABS} {...regionProps('Rectus Abdominis')} />
          <path
            d="M100 131 V202 M90 151 H110 M90 173 H110"
            fill="none"
            stroke={BODY_OUTLINE}
          />
        </>
      ) : (
        <>
          <path d={UPPER_BACK} {...regionProps('Back')} />
          <path
            d="M100 82 V184 M72 111 Q84 120 91 139 M128 111 Q116 120 109 139"
            fill="none"
            stroke={BODY_OUTLINE}
          />
        </>
      )}
      <BodySide view={view} regionProps={regionProps} />
      <g transform={MIRROR}>
        <BodySide view={view} regionProps={regionProps} />
      </g>
    </g>
  );
}

/** Limb and lateral muscle regions for a single body side. */
function BodySide({ view, regionProps }: BodyProps) {
  const isFront = view === 'front';

  return (
    <g>
      <path d={UPPER_ARM} fill={INACTIVE_COLOR} />
      <path d={FOREARM} fill={INACTIVE_COLOR} />
      <path d={HAND} fill={INACTIVE_COLOR} />
      <path d={THIGH} fill={INACTIVE_COLOR} />
      <path d={SHIN} fill={INACTIVE_COLOR} />
      <path d={FOOT} fill={INACTIVE_COLOR} />
      <path d="M25 250 L34 260 M68 307 Q82 313 96 307" fill="none" />

      <path d={DELTOID} {...regionProps('Shoulders')} />
      <path d={UPPER_ARM_MUSCLE} {...regionProps(isFront ? 'Biceps' : 'Triceps')} />
      <path d={FOREARM_MUSCLE} {...regionProps('Forearms')} />
      {isFront ? (
        <>
          <path d={PEC} {...regionProps('Chest')} />
          <path d={OBLIQUE} {...regionProps('Obliques')} />
          <path d={QUAD} {...regionProps('Quads')} />
          <path d="M83 234 L82 286" fill="none" />
        </>
      ) : (
        <>
          <path d={GLUTE} {...regionProps('Glutes')} />
          <path d={HAMSTRING} {...regionProps('Hamstrings')} />
          <path d="M84 247 L83 291" fill="none" />
        </>
      )}
      <path d={CALF} {...regionProps('Calves')} />
    </g>
  );
}

const Container = styled.div`
  border-radius: 1rem;
  background: #181a2e;
  padding: 1rem;
`;

const Figures = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
`;

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  margin: 0;
`;

const BodySvg = styled.svg`
  width: 100%;
  max-width: 12rem;
  height: min(52vh, 22rem);
`;

const FigureLabel = styled.figcaption`
  color: #e7bdbb;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem 1.25rem;
  margin-top: 1rem;
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #e7bdbb;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;
