// Kit Penjelasan: template video berbasis data (beats.json). Satu komposisi merakit: palet, adegan 3D (objek + kamera), kartu judul,
// stiker, subtitle, kicker, komentar, follow, audio+SFX. Lapisan 2D khusus (panel pemutus pola) dikirim lewat prop `ekstra`.
// Format data: arsip/style-lama/gaya-penjelasan.md (bagian "beats.json"). Contoh nyata: remotion/src/v20/beats.json (menghasilkan #20 piksel-identik).
import {Fragment} from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Ghost} from '../pengetahuan/Scene';
import {Grain, TikTokBox} from '../aset/Aset';
import {Kicker, CommentBubble, FollowButton} from '../aset/Gabung';
import {PaperPalet, PALET, type PaletName} from '../aset/PaperPalet';
import {Canvas3D, CanvasIso, Seg} from './stage';
import {Captions, Chip, TemaProvider, Title, type KataVO} from './teks';
import {FPS, camAt, proj, projIso, r, type Key, type V3} from './waktu';
import {OBJEK} from './objek/registry';

type T = number | string; // detik, atau nama beat di `beats`
export type DataVideo = {
  nomor: string; palet: PaletName; durasi: number; vo: string; // vo: path di public/, mis. 'v20/vo.mp3'
  kicker: string; hook: {pil: string; hingga: number};
  beats: Record<string, number>;
  adegan: {dari: T; sampai: T; objek: string; mode: string; kamera: Key[]; w?: Record<string, [number, number]>; ulang?: boolean; iso?: {zoom: number}}[];
  hantu?: {dari: T; sampai: T; baris: [string, string]}[];
  judul: {dari: T; sampai: T; kecil: string; besar: string; warna?: 'accent' | 'cool' | 'good'; ukuran?: number}[];
  stiker: {teks: string; warna: 'accent' | 'cool' | 'good'; ukuran?: number; waktu: [number, number, number, number]; xy?: [number, number]; garis?: boolean;
           tempel?: {adegan: number; titik: V3; dx?: number; dy?: number; x?: [number, number]; y?: [number, number]}}[];
  komentar: {kata: string; mulai: number; y: number; keluar: number};
  follow: {mulai: number; klik: number; y: number};
  sfx: [string, number, number][];
};

export const Penjelasan: React.FC<{data: DataVideo; words: KataVO[]; ekstra?: React.FC<{t: number}>[]}> = ({data, words, ekstra = []}) => {
  const f = useCurrentFrame(), t = f / FPS;
  const PL = PALET[data.palet];
  const tema = {accent: PL.accent, cool: PL.cool, good: PL.good};
  const warna = {accent: PL.accent, good: PL.good, cool: PL.cool};
  const B = data.beats;
  const T = (x: T) => (typeof x === 'number' ? x : B[x]);
  const cams = data.adegan.map((a) => {
    const k = camAt(a.kamera, t);
    if (!a.iso) return k;
    // isometrik: jarak (pos-look) hanya mengatur zoom; arah kamera tetap. zoom = zoom0 * d0 / d
    const d = (kk: Key) => Math.max(0.5, kk.pos[2] - kk.look[2]), d0 = d(a.kamera[0]);
    return {...k, zoom: a.iso.zoom * d0 / d(k)};
  });
  return (
    <TemaProvider value={tema}>
      <AbsoluteFill>
        <PaperPalet palet={data.palet} />
        {(data.hantu ?? []).map((h, i) => t >= T(h.dari) && t < T(h.sampai) && <Ghost key={i} lines={h.baris} />)}

        {data.adegan.map((a, i) => {
          const O = OBJEK[a.objek];
          return <Seg key={i} a={T(a.dari)} b={T(a.sampai)} f={f} first={i === 0}>{a.iso ? <CanvasIso k={cams[i]}><O t={t} mode={a.mode} w={a.w} warna={warna} /></CanvasIso> : <Canvas3D k={cams[i]}><O t={t} mode={a.mode} w={a.w} warna={warna} /></Canvas3D>}</Seg>;
        })}

        <Kicker text={data.kicker} y={292} start={0} color={tema.accent} />
        <TikTokBox text={data.hook.pil} p={r(t, 0.15, 0.8, Easing.linear)} y={338} size={40} />
        {ekstra.map((E, i) => <E key={i} t={t} />)}

        {data.judul.map((j, i) => <Title key={i} t={t} a={T(j.dari)} b={T(j.sampai)} small={j.kecil} big={j.besar} bigColor={tema[j.warna ?? 'accent']} size={j.ukuran} />)}

        {data.stiker.map((s, i) => {
          const [a, b, c, d] = s.waktu;
          let [x, y] = s.xy ?? [540, 1210];
          let anc: [number, number] | null = null;
          if (s.tempel) {
            const isoA = !!data.adegan[s.tempel.adegan].iso; // adegan isometrik memakai proyeksi isometrik, bukan perspektif
            const [px, py] = (isoA ? projIso : proj)(cams[s.tempel.adegan], s.tempel.titik);
            anc = [px, py];
            const [x0, x1] = s.tempel.x ?? [250, 900], [y0, y1] = s.tempel.y ?? [900, 1260];
            x = Math.max(x0, Math.min(x1, px + (s.tempel.dx ?? 0))); y = Math.max(y0, Math.min(y1, py + (s.tempel.dy ?? 0)));
          }
          const pp = r(t, a, b) * (1 - r(t, c, d));
          return (
            <Fragment key={i}>
              {s.garis && anc && pp > 0 && (
                <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, opacity: pp, pointerEvents: 'none'}}>
                  <line x1={x} y1={y} x2={anc[0]} y2={anc[1]} stroke="#1c1c1e" strokeWidth={3.5} strokeLinecap="round" />
                  <circle cx={anc[0]} cy={anc[1]} r={11} fill={tema[s.warna]} stroke="#1c1c1e" strokeWidth={3} />
                </svg>
              )}
              <Chip x={x} y={y} p={pp} text={s.teks} color={tema[s.warna]} size={s.ukuran} />
            </Fragment>
          );
        })}
        <CommentBubble word={data.komentar.kata} start={Math.round(data.komentar.mulai * FPS)} y={data.komentar.y} out={Math.round(data.komentar.keluar * FPS)} />
        <FollowButton start={Math.round(data.follow.mulai * FPS)} click={Math.round(data.follow.klik * FPS)} y={data.follow.y} />
        <Captions ms={t * 1000} words={words} />
        <Grain o={0.05} id={`g${data.nomor}`} />

        <Audio src={staticFile(data.vo)} />
        <Audio src={staticFile('sfx/ambient.wav')} volume={0.1} />
        {data.sfx.map(([n, s2, v], i) => <Sequence key={i} from={Math.round(s2 * FPS)} layout="none"><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>)}
      </AbsoluteFill>
    </TemaProvider>
  );
};
