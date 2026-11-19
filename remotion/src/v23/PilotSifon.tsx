// PILOT (19 Nov 2026), bukan video terbit: gaya "mekanisme minimal ala Lesics" untuk sifon pipa U. Satu mekanisme, gerak nyata (air mengalir, air surut, bau tertahan), tanpa karakter.
import {AbsoluteFill, Easing} from 'remotion';
import {Canvas3D, Chip, Title, TemaProvider, camAt, proj, r, FPS, type Key} from '../kit';
import {PaperPalet, PALET} from '../aset/PaperPalet';
import {Sifon} from '../kit/objek/Sifon';
import {useCurrentFrame} from 'remotion';

export const PILOT_SIFON_FRAMES = 15 * FPS;
const PL = PALET.mint;
const W = {buka: 6.5, ujung: 9.0, tutup: 10.2, surut: 11.6, gas: 12.0, gasSelesai: 14.2};
const CAM: Key[] = [
  {t: 0, pos: [-1.2, 3.4, 11.4], look: [0.55, 2.0, 0]}, {t: 2.0, pos: [-2.4, 2.4, 12.8], look: [0.6, 1.6, 0]}, {t: 4.0, pos: [-0.2, 0.9, 9.6], look: [0.1, 0.4, 0]},
  {t: 6.2, pos: [-2.8, 2.9, 10.6], look: [0.6, 1.9, 0]}, {t: 9.0, pos: [0.8, 2.2, 9.4], look: [0.3, 1.3, 0]},
  {t: 11.0, pos: [0.3, 1.1, 6.8], look: [0.0, 0.7, 0]}, {t: 12.8, pos: [3.2, 1.7, 8.4], look: [0.3, 0.9, 0]}, {t: 15, pos: [4.4, 2.6, 10.6], look: [0.6, 1.7, 0]}];
const ease = Easing.inOut(Easing.cubic);

export const PilotSifon: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const k = camAt(CAM, t);
  const gap = ease(r(t, 1.0, 2.6, Easing.linear)) - ease(r(t, 4.6, 6.0, Easing.linear));
  const P = (x: number, y: number): [number, number] => proj(k, [x, y, 0]);
  return (
    <TemaProvider value={{accent: PL.accent, cool: PL.cool, good: PL.good}}>
      <AbsoluteFill>
        <PaperPalet palet="mint" />
        <Canvas3D k={k}><Sifon t={t} gap={gap} w={W} warna={{accent: PL.accent, cool: PL.cool, good: PL.good}} /></Canvas3D>
        <Title t={t} a={0.3} b={2.4} small="Pipa U di bawah wastafel," big="KENAPA MELENGKUNG?" bigColor={PL.cool} size={84} />
        <Title t={t} a={12.0} b={15.0} small="Air yang tertahan jadi" big="PENUTUP BAU GOT" bigColor={PL.accent} size={92} />
        {/* label bagian saat dibongkar (menempel pada bagiannya lewat proyeksi kamera) */}
        {(() => { const sp = (x: number, y: number, dx: number, dy: number): [number, number] => { const q = P(x, y); return [Math.max(250, Math.min(900, q[0] + dx)), Math.max(760, Math.min(1700, q[1] + dy))]; };
          const a = sp(-0.6, 1.4, 190, 0), b = sp(0, -0.55 * gap * 1.6, 0, 360), c = sp(1.5, 1.2, -60, -110), d = sp(-0.6, 0.7 - 0.5 * gap, 230, 60);
          const on = (a0: number, b0: number) => r(t, a0, a0 + 0.35, Easing.out(Easing.cubic)) * (1 - r(t, b0, b0 + 0.4));
          return (<>
            <Chip x={a[0]} y={a[1]} p={on(1.8, 4.6)} text="pipa dari wastafel" color={PL.cool} size={40} />
            <Chip x={d[0]} y={d[1]} p={on(2.2, 4.6)} text="mur + karet" color={PL.accent} size={40} />
            <Chip x={c[0]} y={c[1]} p={on(2.6, 4.6)} text="pipa ke dinding" color={PL.cool} size={40} />
            <Chip x={b[0]} y={b[1]} p={on(3.0, 4.8)} text="lengkungan U" color={PL.accent} size={46} />
          </>); })()}
        <Chip x={540} y={1560} p={r(t, 10.8, 11.2, Easing.out(Easing.cubic)) * (1 - r(t, 11.9, 12.2))} text="air tersisa di lengkungan" color={PL.cool} size={44} />
        <Chip x={540} y={1560} p={r(t, 13.0, 13.4, Easing.out(Easing.cubic))} text="bau got tertahan" color={PL.accent} size={46} />
      </AbsoluteFill>
    </TemaProvider>
  );
};
