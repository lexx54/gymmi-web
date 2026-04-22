import styled from 'styled-components';

const IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBbHxzJro1oK9AOHETMiWVuu9Zxexe39sq6xX7xBzGbcPcV0O-wC35fj8GsS2iymGABT-rDQ6iIX3bUKKtdaiJKLdp1mhjNs-ZHMSNBXP4ZfJRVfxhWP_8B0MxBsObnwmZCusgz3uPht0VgG9uzhqUKjFX8jpzC8sAChaPdBCm2nq6fhW0LFKf2qY4CTLWtB_qJBPrUgcm32oEMzBw9oa9EWAD4V1gSTX_xHs3D15cY3XgN_gAbHq3ZLtfdWtDyDgd0Su1RDFS_f7Y';

/**
 * Featured inspiration image with overlay caption.
 */
export function VisualInspirationCard() {
  return (
    <Card>
      <img src={IMAGE_URL} alt="Heavy iron weights in a moody dark gym with red accents" />
      <Overlay />
      <CaptionBlock>
        <Eyebrow>Visual Inspiration</Eyebrow>
        <Quote>&quot;Precision in movement creates power in execution.&quot;</Quote>
      </CaptionBlock>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0.85rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #101225 0%, rgba(16, 18, 37, 0) 55%);
`;

const CaptionBlock = styled.div`
  position: absolute;
  inset: auto 1.4rem 1.4rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: #ffb3b1;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.62rem;
  font-weight: 700;
`;

const Quote = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-style: italic;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.4;
`;
