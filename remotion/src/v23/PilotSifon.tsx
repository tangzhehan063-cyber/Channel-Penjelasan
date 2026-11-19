// PILOT (19 Nov 2026), bukan video terbit: gaya "mekanisme minimal ala Lesics" untuk sifon pipa U. Satu mekanisme, gerak nyata (air mengalir, air surut, bau tertahan), tanpa karakter.
import {AbsoluteFill, Easing} from 'remotion';
import {Canvas3D, Chip, Title, TemaProvider, camAt, r, FPS, type Key} from '../kit';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {Sifon} from '../kit/objek/Sifon';
import {useCurrentFrame} from 'remotion';

export const PILOT_SIFON_FRAMES = 9 * FPS;
const PL = PALET.mint;
const W = {buka: 0.5, ujung: 3.0, tutup: 4.2, surut: 5.6, gas: 6.0, gasSelesai: 8.2};
const CAM: Key[] = [{t: 0, pos: [-1.2, 3.4, 11.4], look: [0.55, 2.0, 0]}, {t: 4.5, pos: [0.6, 2.9, 10.6], look: [0.6, 1.9, 0]}, {t: 9, pos: [2.2, 2.5, 9.8], look: [0.6, 1.7, 0]}];

export const PilotSifon: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const k = camAt(CAM, t);
  return (
    <TemaProvider value={{accent: PL.accent, cool: PL.cool, good: PL.good}}>
      <AbsoluteFill>
        <PaperPalet palet="mint" />
        <Canvas3D k={k}><Sifon t={t} w={W} warna={{accent: PL.accent, cool: PL.cool, good: PL.good}} /></Canvas3D>
        <Title t={t} a={0.3} b={4.0} small="Pipa U di bawah wastafel," big="KENAPA MELENGKUNG?" bigColor={PL.cool} size={84} />
        <Title t={t} a={6.0} b={9.0} small="Air yang tertahan jadi" big="PENUTUP BAU GOT" bigColor={PL.accent} size={92} />
        <Chip x={540} y={1560} p={r(t, 4.8, 5.2, Easing.out(Easing.cubic)) * (1 - r(t, 5.9, 6.2))} text="air tersisa di lengkungan" color={PL.cool} size={44} />
        <Chip x={540} y={1560} p={r(t, 7.0, 7.4, Easing.out(Easing.cubic))} text="bau got tertahan" color={PL.accent} size={46} />
      </AbsoluteFill>
    </TemaProvider>
  );
};
