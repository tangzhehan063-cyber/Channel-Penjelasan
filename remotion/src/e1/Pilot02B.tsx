// PILOT v2 (Animation Director) E1 #02, sequence "Di bawah rumah" 20,4-31,0 dtk. Rekonstruksi 3D dari foto referensi (tanpa foto di layar).
// Konsep: satu dunia kontinu. Kamera di jalan melihat rumah yang ditinggikan; bidang potong menyapu dari depan ke tengah rumah (irisan maket),
// penampang memperlihatkan urugan, lantai, pondasi, lempung, pasir; lempung memampat, rumah + tanah turun terhadap tiang acuan; bidang potong
// menutup lagi dan air (tinggi tetap) kini menggenangi jalan dan tangga. 1 satuan = 1 m. Pemampatan 0,57 m = ILUSTRASI.
// Aturan: bidang penutup (cap) tiap padatan digeser mundur 3-5 cm dan berbeda per lapis (tak sebidang); kamera tak pernah masuk ke padatan.
import {ThreeCanvas} from '@remotion/three';
import {createContext, useContext, useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css'; import '@fontsource/inter/700.css';
import {Env} from '../pengetahuan/Scene';
import {Rig} from '../kit/stage';
import {FPS, nudgeKey, r, type V3} from '../kit/waktu';
import {useTex} from './AnatomiRumah';
import {useBahan} from './look';
import {Grain, kompres, SINK, T0, usePenampang} from './Pilot02';
import {kameraShots, type ShotKamera} from './lib/kamera';
import {Anot, type Anotasi} from './lib/anot';
import shotsJson from '../../../e1/02/shots2.json';

export const PILOT02B_FRAMES = Math.round(10.6 * FPS);
const SHOTS = (shotsJson as unknown as {shots: ShotKamera[]}).shots;
const ACUAN = '#ef6a4c';
const rnd = (i: number, k: number) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const GZ = 40; // tepi depan tanah (di belakang kamera pembuka)

type Cx = {plane: THREE.Plane; zc: number};
const CX = createContext<Cx>({plane: new THREE.Plane(), zc: 12});
const ulang = (m: THREE.Texture | undefined, rx: number, ry: number) => { if (!m) return undefined; const c = m.clone(); c.repeat.set(rx, ry); c.needsUpdate = true; return c; };

/** kotak padat dengan bidang penutup (cap) di bidang potong. co = jarak cap di belakang bidang (beda per lapis agar tak sebidang). */
const Bk: React.FC<{p: V3; s: V3; map?: THREE.Texture; rep?: [number, number]; bump?: number; r?: number; tint?: string; co?: number; sh?: boolean; cap?: boolean; o?: number}> =
  ({p, s, map, rep = [1, 1], bump = 0, r: ro = 0.9, tint = '#ffffff', co = 0.05, sh = true, cap = true, o = 1}) => {
    const {plane, zc} = useContext(CX);
    const m = useMemo(() => ulang(map, rep[0], rep[1]), [map, rep[0], rep[1]]);
    const spans = cap && zc < p[2] + s[2] / 2 && zc > p[2] - s[2] / 2;
    const mat = (cl: boolean) => <meshStandardMaterial color={tint} map={m} bumpMap={bump && m ? m : undefined} bumpScale={bump} roughness={ro} transparent={o < 1} opacity={o} clippingPlanes={cl ? [plane] : undefined} />;
    return (<>
      <mesh position={p} castShadow={sh && o >= 1} receiveShadow><boxGeometry args={s} />{mat(true)}</mesh>
      {spans && <mesh position={[p[0], p[1], zc - co]} receiveShadow><planeGeometry args={[s[0], s[1]]} />{mat(false)}</mesh>}
    </>);
  };

const Plane2: React.FC<{p: V3; s: [number, number]; rot?: V3; color: string; map?: THREE.Texture; r?: number; clip?: boolean}> = ({p, s, rot = [0, 0, 0], color, map, r: ro = 0.9}) => {
  const {plane} = useContext(CX);
  return <mesh position={p} rotation={rot} castShadow receiveShadow><planeGeometry args={s} /><meshStandardMaterial color={color} map={map} roughness={ro} side={THREE.DoubleSide} clippingPlanes={[plane]} /></mesh>;
};

// ---------- rumah (rekonstruksi dari foto: dasar tinggi + tangga, teras bertiang, atap pelana berteritis, dinding plester kusam) ----------
const Fl = 1.35, HW = 2.9, XW = 3.6, ZB = -3.4, ZF = 1.0, ZP = 2.2;
const Rumah: React.FC<{b: ReturnType<typeof useBahan>; x: ReturnType<typeof useTex>; m: ReturnType<typeof usePenampang>}> = ({b, x, m}) => {
  const ridgeZ = -1.2, ridgeY = Fl + HW + 1.5, eY = Fl + HW;
  const front = {dz: ZF + 1.4 - ridgeZ, dy: 1.5}, back = {dz: ridgeZ - (ZB - 0.8), dy: 1.5};
  const fg = useMemo(() => {
    const W = 7.2, H = HW, T = 0.16, s = new THREE.Shape(); s.moveTo(-W / 2, 0); s.lineTo(W / 2, 0); s.lineTo(W / 2, H); s.lineTo(-W / 2, H); s.closePath();
    ([[-1.5, 0.02, 0.9, 2.0], [-3.0, 0.95, 0.9, 1.1], [1.1, 0.95, 1.1, 1.1]] as number[][]).forEach(([cx, y, w, h]) => { const p = new THREE.Path(); p.moveTo(cx - w / 2, y); p.lineTo(cx + w / 2, y); p.lineTo(cx + w / 2, y + h); p.lineTo(cx - w / 2, y + h); p.closePath(); s.holes.push(p); });
    const e = new THREE.ExtrudeGeometry(s, {depth: T, bevelEnabled: false}); e.translate(0, 0, -T / 2); return e;
  }, []);
  const {plane} = useContext(CX);
  const plester = useMemo(() => ulang(b.plester, 1.1, 0.8), [b]), genteng = useMemo(() => ulang(x.genteng, 6, 5), [x]);
  const wall = '#e9e0c9', teal = '#a9c9bb';
  return (<group>
    {/* pondasi telapak + urugan + dinding dasar + lantai */}
    <Bk p={[0, -0.2, -0.7]} s={[8.0, 0.4, 6.4]} map={m.pondasi} rep={[4, 0.5]} bump={0.8} co={0.045} />
    <Bk p={[0, (Fl - 0.12) / 2, -0.55]} s={[7.0, Fl - 0.12, 5.5]} map={m.urugan} rep={[4, 0.5]} bump={0.9} co={0.04} />
    <Bk p={[0, Fl / 2, ZB]} s={[7.4, Fl, 0.26]} map={x.beton} rep={[3, 0.6]} bump={0.6} tint="#b7b4aa" co={0.035} />
    {[-1, 1].map((sd) => <Bk key={sd} p={[sd * 3.57, Fl / 2, (ZB + ZP) / 2]} s={[0.26, Fl, ZP - ZB]} map={x.beton} rep={[2, 0.6]} bump={0.6} tint="#b7b4aa" co={0.035} />)}
    <Bk p={[0, Fl / 2, ZP]} s={[7.4, Fl, 0.26]} map={x.beton} rep={[3, 0.6]} bump={0.6} tint="#a9b3a0" co={0.035} />
    <Bk p={[0, Fl - 0.06, (ZB + ZP) / 2]} s={[7.1, 0.12, ZP - ZB - 0.1]} map={b.plester} rep={[3, 2]} bump={0.3} tint="#d9d2c2" co={0.03} />
    {/* dinding */}
    <Bk p={[0, Fl + HW / 2 + 0.06, ZB + 0.08]} s={[7.2, HW, 0.16]} map={b.plester} rep={[1.1, 0.8]} bump={0.3} tint={wall} co={0.03} />
    {[-1, 1].map((sd) => <Bk key={sd} p={[sd * 3.52, Fl + HW / 2 + 0.06, (ZB + ZF) / 2]} s={[0.16, HW, ZF - ZB]} map={b.plester} rep={[1, 0.8]} bump={0.3} tint={sd < 0 ? teal : wall} co={0.03} />)}
    <mesh geometry={fg} position={[0, Fl + 0.06, ZF]} castShadow receiveShadow><meshStandardMaterial map={plester} bumpMap={plester} bumpScale={0.5} roughness={0.95} color={wall} clippingPlanes={[plane]} /></mesh>
    {/* pintu, jendela berjalusi */}
    <Bk p={[-1.5, Fl + 1.05, ZF]} s={[0.82, 1.96, 0.05]} map={b.kayu} bump={0.4} cap={false} />
    {[[-3.0, 0.7], [1.1, 0.7]].map(([cx, w], i) => <group key={i}>
      <Bk p={[cx, Fl + 1.5, ZF]} s={[w + 0.1, 1.0, 0.02]} tint="#9fc3d6" r={0.1} o={0.5} sh={false} cap={false} />
      {[0, 1, 2, 3, 4].map((k) => <Bk key={k} p={[cx, Fl + 1.05 + k * 0.2 + 0.1, ZF + 0.02]} s={[w + 0.06, 0.04, 0.03]} map={b.kayu} cap={false} sh={false} />)}
      <Bk p={[cx, Fl + 2.07, ZF + 0.02]} s={[w + 0.22, 0.08, 0.14]} map={b.kayu} cap={false} /><Bk p={[cx, Fl + 0.99, ZF + 0.06]} s={[w + 0.22, 0.07, 0.2]} map={b.kayu} cap={false} />
    </group>)}
    {/* teras: tiang, pagar, atap teritis */}
    {[-3.2, 0.3].map((cx) => <Bk key={cx} p={[cx, Fl + (HW - 0.1) / 2, ZP - 0.15]} s={[0.22, HW - 0.1, 0.22]} map={b.plester} rep={[1, 2]} bump={0.4} tint="#ddd4be" cap={false} />)}
    <Bk p={[-1.45, Fl + 0.88, ZP - 0.15]} s={[3.5, 0.06, 0.08]} map={b.kayu} cap={false} />
    {Array.from({length: 17}, (_, i) => -3.0 + i * 0.2).map((cx, i) => <Bk key={i} p={[cx, Fl + 0.46, ZP - 0.15]} s={[0.035, 0.88, 0.035]} tint="#3a3d42" r={0.5} cap={false} sh={false} />)}
    {/* atap */}
    {[[1, front, 0.9], [-1, back, 0]].map(([sd, g, zc0], i) => {
      const gg = g as {dz: number; dy: number}, ang = Math.atan2(gg.dy, gg.dz), L = Math.hypot(gg.dz, gg.dy) + 0.05, zm = ridgeZ + (sd as number) * gg.dz / 2, ym = ridgeY - gg.dy / 2 + 0.05;
      return <mesh key={i} position={[0, ym, zm]} rotation={[-(sd as number) * ang, 0, 0]} castShadow receiveShadow><boxGeometry args={[8.6, 0.09, L]} /><meshStandardMaterial map={genteng} bumpMap={genteng} bumpScale={1.0} roughness={0.85} color="#dcc6b2" clippingPlanes={[plane]} /></mesh>;
    })}
    <Bk p={[0, ridgeY + 0.1, ridgeZ]} s={[8.7, 0.14, 0.3]} tint="#8f4a30" r={0.8} cap={false} />
    {/* tembok segitiga di ujung atap */}
    {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 3.62, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
      <shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(ZB, eY + 0.06); s.lineTo(ZF + 0.9, eY + 0.06); s.lineTo(ridgeZ, ridgeY); s.closePath(); return s; })()]} />
      <meshStandardMaterial color={sd < 0 ? teal : wall} map={plester} roughness={0.95} side={THREE.DoubleSide} clippingPlanes={[plane]} /></mesh>)}
    {/* isi dalam ruang (terlihat saat potongan terbuka): meja, lemari, jendela belakang */}
    <Bk p={[-1.6, Fl + 0.4, -1.9]} s={[1.3, 0.06, 0.75]} map={b.kayu} />
    {[[-0.98, -1.6], [-2.22, -1.6], [-0.98, -2.2], [-2.22, -2.2]].map(([lx, lz], i) => <Bk key={i} p={[lx, Fl + 0.19, lz + 0.3]} s={[0.06, 0.36, 0.06]} map={b.kayu} cap={false} />)}
    <Bk p={[2.4, Fl + 0.95, -3.0]} s={[1.1, 1.9, 0.5]} map={b.kayu} bump={0.4} tint="#b08a5a" />
    <Bk p={[0.2, Fl + 1.55, ZB + 0.18]} s={[1.0, 1.0, 0.03]} tint="#9fc3d6" r={0.1} o={0.5} sh={false} cap={false} />
    {/* tangga beton menyusuri dasar */}
    {[0, 1, 2, 3, 4].map((i) => { const h = ((i + 1) * Fl) / 5; return <Bk key={i} p={[2.75, h / 2, ZP + 0.2 + (4 - i) * 0.38 + 0.2]} s={[1.5, h, 0.38]} map={x.beton} rep={[1, 0.3]} bump={0.6} tint="#b3b0a6" co={0.02} />; })}
  </group>);
};

const Latar: React.FC<{b: ReturnType<typeof useBahan>; x: ReturnType<typeof useTex>}> = ({b, x}) => {
  const Rm: React.FC<{x0: number; z0: number; w: number; h: number; c: string}> = ({x0, z0, w, h, c}) => (<group>
    <Bk p={[x0, h / 2, z0]} s={[w, h, 3.2]} map={b.plester} rep={[2, 1]} bump={0.4} tint={c} />
    {[-1, 1].map((sd) => <mesh key={sd} position={[x0, h + 0.7, z0 + sd * 0.9]} rotation={[sd * 0.48, 0, 0]} castShadow><boxGeometry args={[w + 0.8, 0.08, 2.1]} /><meshStandardMaterial map={ulang(x.genteng, 4, 2)} roughness={0.85} color="#bda792" /></mesh>)}
  </group>);
  return (<group>
    <Rm x0={-10.5} z0={-1.4} w={4.4} h={2.9} c="#d6e0da" /><Rm x0={10.2} z0={-1.0} w={4.6} h={3.1} c="#e4d6b8" /><Rm x0={-17} z0={-3} w={4.6} h={2.8} c="#e6c9a4" />
    <Rm x0={-4} z0={-14} w={5} h={3.2} c="#d9d1c0" /><Rm x0={6.5} z0={-15} w={5.4} h={3.0} c="#cbd8d0" />
    {/* tiang listrik + kabel */}
    <mesh position={[-6.8, 3.4, 3.4]} castShadow><cylinderGeometry args={[0.1, 0.14, 6.8, 10]} /><meshStandardMaterial color="#7a6c5c" roughness={0.9} /></mesh>
    <Bk p={[-6.8, 6.2, 3.4]} s={[1.6, 0.08, 0.08]} tint="#5a4a38" cap={false} /><Bk p={[0, 6.0, 3.4]} s={[40, 0.025, 0.025]} tint="#222" cap={false} sh={false} /><Bk p={[0, 5.7, 3.4]} s={[40, 0.025, 0.025]} tint="#222" cap={false} sh={false} />
    {/* pisang */}
    {[[7.2, 3.0], [8.4, 1.2]].map(([px, pz], k) => <group key={k} position={[px, 0, pz]}>
      <mesh position={[0, 1.0, 0]} castShadow><cylinderGeometry args={[0.1, 0.14, 2.0, 8]} /><meshStandardMaterial color="#8aa05a" roughness={0.9} /></mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i} position={[Math.cos(i * 1.05) * 0.6, 2.05 + (i % 2) * 0.14, Math.sin(i * 1.05) * 0.6]} rotation={[0.9 * Math.sin(i * 1.05), 0, -0.9 * Math.cos(i * 1.05)]} castShadow><boxGeometry args={[0.38, 0.03, 1.7]} /><meshStandardMaterial color="#5f9a43" roughness={0.8} side={THREE.DoubleSide} /></mesh>)}
    </group>)}
    {/* garis pohon jauh (kabut) */}
    {Array.from({length: 14}, (_, i) => <mesh key={i} position={[-34 + i * 5.2 + rnd(i, 1) * 2, 4 + rnd(i, 2) * 2, -28]}><sphereGeometry args={[3 + rnd(i, 3) * 2.2, 10, 8]} /><meshStandardMaterial color="#6f8a63" roughness={1} /></mesh>)}
  </group>);
};

const Dunia: React.FC<{t: number; zc: number}> = ({t, zc}) => {
  const b = useBahan(), x = useTex(), m = usePenampang();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0), []);
  plane.constant = zc;
  const c = kompres(t), d = SINK * c, hClay = 1.5 - d;
  const act = r(t, 24.0, 24.8) * (1 - r(t, 28.6, 29.3)), PX = 1.9, YP = -2.45;
  const GW = 70, GZ0 = -32;
  return (<CX.Provider value={{plane, zc}}>
    {/* lapisan tetap/memampat */}
    <Bk p={[0, -2.85 - 5.15 / 2, (GZ0 + GZ) / 2]} s={[GW, 5.15, GZ - GZ0]} map={m.batuan} rep={[24, 3]} bump={1.0} co={0.05} />
    <Bk p={[0, -2.05 - 0.4, (GZ0 + GZ) / 2]} s={[GW, 0.8, GZ - GZ0]} map={m.pasir} rep={[24, 0.8]} bump={0.7} co={0.048} />
    <Bk p={[0, -2.05 + hClay / 2, (GZ0 + GZ) / 2]} s={[GW, hClay, GZ - GZ0]} map={m.lempung} rep={[24, 1.2]} bump={0.6} r={0.38} co={0.046} />
    {/* semua di atas lempung turun bersama */}
    <group position={[0, -d, 0]}>
      <Bk p={[0, -0.275, (GZ0 + GZ) / 2]} s={[GW, 0.55, GZ - GZ0]} map={m.urugan} rep={[24, 0.5]} bump={0.9} co={0.044} />
      <Bk p={[0, 0, (3.6 + GZ) / 2]} s={[GW, 0.06, GZ - 3.6]} map={b.jalan} rep={[24, 4]} bump={0.7} co={0.034} tint="#9a9a96" />
      <Rumah b={b} x={x} m={m} />
      <Latar b={b} x={x} />
    </group>
    {/* penggaris acuan (tertanam di batuan): tidak ikut turun */}
    <group position={[4.9, 0, 3.4]}>
      {Array.from({length: 26}, (_, i) => i).map((i) => <mesh key={i} position={[0, -2.85 + 0.125 + i * 0.25 + 0.0 + 0.0, 0]}><cylinderGeometry args={[0.085, 0.085, 0.25, 12]} /><meshStandardMaterial color={i % 2 ? '#f2efe8' : '#d94a35'} roughness={0.55} clippingPlanes={[plane]} /></mesh>)}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.025, 8, 20]} /><meshBasicMaterial color={ACUAN} toneMapped={false} /></mesh>
    </group>
    {/* air: tinggi tetap, tampak hanya bila tanah turun di bawahnya */}
    <mesh position={[0, -0.34, (GZ0 + GZ) / 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[GW, GZ - GZ0]} /><meshStandardMaterial color="#6a98b4" roughness={0.12} metalness={0.1} transparent opacity={0.8} clippingPlanes={[plane]} /></mesh>
    {/* garis acuan merah di penampang (posisi awal), hanya saat potongan terbuka */}
    {zc < 8 && <mesh position={[0, 0.0, zc - 0.02]}><boxGeometry args={[14, 0.035, 0.01]} /><meshBasicMaterial color={ACUAN} toneMapped={false} /></mesh>}
    {/* sumur bor + air terhisap, digambar di muka penampang */}
    {zc < 8 && <>
      <mesh position={[PX, (YP - d - 0.5) / 2 - 0.1, zc - 0.015]}><cylinderGeometry args={[0.07, 0.07, -YP - d - 0.5 + 0.2, 12]} /><meshStandardMaterial color="#7b828a" metalness={0.6} roughness={0.45} /></mesh>
      <mesh position={[PX - 0.3, YP, zc - 0.015]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.6, 12]} /><meshStandardMaterial color="#7b828a" metalness={0.6} roughness={0.45} /></mesh>
      {act > 0.02 && Array.from({length: 70}, (_, i) => {
        const u = (t * 0.2 + rnd(i, 3)) % 1, sx = -0.5 + rnd(i, 1) * 2.0, sy = -2.05 + 0.2 + rnd(i, 2) * Math.max(0.3, hClay - 0.4); let px: number, py: number;
        if (u < 0.4) { const k = u / 0.4; px = lerp(sx, 1.3, k); py = lerp(sy, YP, k); }
        else if (u < 0.55) { const k = (u - 0.4) / 0.15; px = lerp(1.3, PX, k); py = YP; }
        else { const k = (u - 0.55) / 0.45; px = PX; py = lerp(YP, -d - 0.7, k); }
        const o = Math.min(1, u / 0.06, (1 - u) / 0.1) * act;
        return <mesh key={i} position={[px, py, zc - 0.01 + 0]}><sphereGeometry args={[0.04, 10, 8]} /><meshBasicMaterial color="#5fb0ff" transparent opacity={o * 0.95} toneMapped={false} /></mesh>;
      })}
    </>}
    {/* panah beban */}
    {zc < 8 && r(t, 28.7, 29.6) > 0.02 && <group position={[-0.2, Fl - d + 0.7 - 0.3 * r(t, 28.8, 29.8, Easing.out(Easing.cubic)), zc - 0.02]}>
      <mesh position={[0, 1.1, 0]}><boxGeometry args={[0.2, 2.0, 0.03]} /><meshBasicMaterial color={ACUAN} transparent opacity={r(t, 28.7, 29.2) * (1 - r(t, 29.6, 30.1))} toneMapped={false} /></mesh>
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.36, 0.5, 3]} /><meshBasicMaterial color={ACUAN} transparent opacity={r(t, 28.7, 29.2) * (1 - r(t, 29.6, 30.1))} toneMapped={false} /></mesh>
    </group>}
  </CX.Provider>);
};

const TLX = (t: number) => (t < 21.45 ? 45 : t < 29.7 ? lerp(45, 0, r(t, 21.45, 22.7, Easing.out(Easing.cubic))) : lerp(0, 45, r(t, 29.7, 30.7, Easing.in(Easing.cubic))));

export const Pilot02B: React.FC<{nudge?: number}> = ({nudge = 0}) => {
  const f = useCurrentFrame(), t = T0 + f / FPS, cam = nudgeKey(kameraShots(SHOTS, t), nudge), zc = TLX(t);
  const d = SINK * kompres(t);
  const AN: Anotasi[] = [
    {a: 22.3, b: 23.6, teks: 'Pondasi', di: [-2.2, -0.2 - d, 0], sisi: 'L'},
    {a: 23.7, b: 28.4, teks: 'Lempung lunak', di: [-0.3, -1.3, 0], sisi: 'L'},
    {a: 24.3, b: 28.4, teks: 'Pasir berair', di: [-0.2, -2.45, 0], sisi: 'L'},
    {a: 24.6, b: 28.4, teks: 'Sumur bor', di: [1.9, -1.2, 0], sisi: 'R', dy: -140},
    {a: 29.0, b: 29.9, teks: 'Posisi awal', di: [-1.0, 0, 0], sisi: 'L', warna: ACUAN},
  ];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#9fb4cc 0%,#bccbdc 38%,#dfe3e2 62%,#cfd3cc 100%)'}}>
      <Audio src={staticFile('e1-02/vo.wav')} startFrom={Math.round(T0 * FPS)} />
      <AbsoluteFill style={{filter: 'contrast(1.06) saturate(1.04)'}}>
        <ThreeCanvas width={1080} height={1920} shadows camera={{position: cam.pos, fov: 34, near: 0.5, far: 160}} gl={{alpha: true, antialias: true, localClippingEnabled: true}} onCreated={({gl}) => { gl.localClippingEnabled = true; }}>
          <Env intensity={0.45} /><Rig k={cam} />
          <hemisphereLight args={['#dfe9f6', '#6d5f4d', 0.55]} />
          <directionalLight position={[-9, 15, 12]} intensity={2.1} color="#fff1dc" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-10} shadow-camera-near={1} shadow-camera-far={60} shadow-bias={-0.0004} shadow-normalBias={0.04} />
          <pointLight position={[0.5, 3.4, -1.2]} intensity={14} distance={8} color="#ffd9a0" />
          <fog attach="fog" args={['#d3dae0', 45, 120]} />
          <Dunia t={t} zc={zc} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 50%, rgba(14,18,28,0.38) 100%)', pointerEvents: 'none'}} />
      {AN.map((a) => <Anot key={a.teks} an={a} t={t} cam={cam} />)}
      <Grain f={f} />
    </AbsoluteFill>
  );
};
