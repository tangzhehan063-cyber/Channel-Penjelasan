// Latar berpalet: identitas channel tidak bergantung pada warna latar putih/krem (lihat style/identitas.md dan style/palet.json).
// 'krem' = latar baku (PaperPlus apa adanya, video #1–#14 tidak berubah). Preset lain: gradien palet + tekstur kertas dicampur.
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import pal from '../../../style/palet.json';
import {PaperPlus} from './Gabung';

export type PaletName = keyof typeof pal.presets;
export const PALET = pal.presets;
export const KARTU = pal.kartu;

export const PaperPalet: React.FC<{palet?: PaletName}> = ({palet = 'krem'}) => {
  const f = useCurrentFrame();
  if (palet === 'krem') return <PaperPlus />;
  const p = pal.presets[palet];
  const blend = p.terang ? 'multiply' : 'soft-light';
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(120% 90% at 30% 20%, ${p.bg} 0%, ${p.bg2} 100%)`}} />
      <Img src={staticFile('aset/kertas-dasar.png')} style={{position: 'absolute', width: 1080, height: 1920, mixBlendMode: blend, opacity: p.tekstur}} />
      <Img src={staticFile('aset/kertas-bayang.png')} style={{position: 'absolute', width: 1080, height: 1920, mixBlendMode: blend, opacity: p.terang ? 1 : 0.5, transform: `translateX(${(f / 30) * 4}px)`}} />
    </AbsoluteFill>
  );
};
