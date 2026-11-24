// LAB (24 Nov): uji efek canvas Remotion pada foto (Img) dan blok warna (Solid), satu efek per frame, layar penuh. Hanya eksperimen.
import {AbsoluteFill, Img, Solid, staticFile} from 'remotion';
import {colorCorrection} from '@remotion/effects/color-correction';
import {vignette} from '@remotion/effects/vignette';
import {lightLeak} from '@remotion/effects/light-leak';
import {glow} from '@remotion/effects/glow';
import {filmBurn} from '@remotion/effects/film-burn';
import {zoomBlur} from '@remotion/effects/zoom-blur';
import {halftone} from '@remotion/effects/halftone';
import {chromaticAberration} from '@remotion/effects/chromatic-aberration';
import {noise} from '@remotion/effects/noise';
import {duotone} from '@remotion/effects/duotone';
const F: Record<string, () => unknown[]> = {
  none: () => [],
  cc: () => [colorCorrection({temperature: 0.2, contrast: 0.25, saturation: 0.8})],
  vignette: () => [vignette({amount: 0.8})],
  lightleak: () => [lightLeak({seed: 3, progress: 0.5})],
  glow: () => [glow({} as never)],
  filmburn: () => [filmBurn({} as never)],
  zoomblur: () => [zoomBlur({} as never)],
  halftone: () => [halftone({} as never)],
  chroma: () => [chromaticAberration({} as never)],
  noise: () => [noise({} as never)],
  duotone: () => [duotone({} as never)],
};
export const LabEfek: React.FC<{v?: string; kind?: 'img' | 'solid'}> = ({v = 'none', kind = 'img'}) => {
  const fx = (F[v] ?? F.none)() as never;
  return (<AbsoluteFill style={{background: '#111'}}>
    {kind === 'img' ? <Img src={staticFile('e1-02/rumah-ditinggikan.jpg')} width={1080} height={1920} style={{objectFit: 'cover'}} effects={fx} />
      : <Solid width={1080} height={1920} color="#5577aa" effects={fx} />}
  </AbsoluteFill>);
};
