// Video #5 "Tembokmu Minum Air dari Tanah": objek 3D prosedural (tanpa model eksternal).
// Satuan: 1 unit = 1 meter (tinggi tembok 2,4 m), supaya level air "± 1 m" jujur secara skala.
import {useMemo} from 'react';
import * as THREE from 'three';

export const CORAL = '#f27a63';
export const W = 3.0, H = 2.4, D = 0.3;          // tembok
export const ZP = D / 2 + 0.04;                  // muka depan plester
export const ZW = ZP + 0.03;                     // muka depan air (di depan plester/cat kedap)
export const YAW = -0.45;                        // tembok diputar supaya sisi potong kanan terlihat

const phys = (color: string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({color, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.32, sheen: 0.6, sheenColor: new THREE.Color('#ffd6cc'), sheenRoughness: 0.6, ...o});

// ---------- shader air: biru bening, permukaan atas bergelombang, garis basah di tepi ----------
const VERT = `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG_WATER = `
uniform float uLevel, uTime, uOp; uniform vec3 uCol; varying vec3 vP;
void main(){
  float x = vP.x + vP.z * 1.3;
  float w = 0.03 * sin(x * 7.0 + uTime * 1.7) + 0.016 * sin(x * 19.0 - uTime * 2.3);
  float top = uLevel + w;
  if (vP.y > top || vP.y < -0.001) discard;
  float edge = smoothstep(top - 0.14, top, vP.y);
  float line = exp(-pow((vP.y - top + 0.012) / 0.011, 2.0));
  float a = min(1.0, uOp * (0.62 + 0.25 * edge));
  vec3 c = mix(uCol, vec3(0.55, 0.82, 1.0), edge * 0.45);
  c = mix(c, vec3(0.03, 0.25, 0.55), line);
  gl_FragColor = vec4(c, max(a, line * min(1.0, uOp)));
}`;
// noda garam (tide mark): garis putih kusam + area bawah sedikit lebih gelap
const FRAG_STAIN = `
uniform float uLevel, uOp; varying vec3 vP;
void main(){
  float x = vP.x + vP.z;
  float top = uLevel + 0.03 * sin(x * 5.0) + 0.015 * sin(x * 13.0 + 1.0);
  float band = exp(-pow((vP.y - top) / 0.05, 2.0));
  float below = (vP.y < top ? 1.0 : 0.0) * 0.18;
  float a = uOp * (band * 1.0 + below * 2.6);
  vec3 c = mix(vec3(0.45, 0.25, 0.2), vec3(1.0, 1.0, 1.0), band);
  gl_FragColor = vec4(c, a);
}`;

export function useWaterMat(color = '#1f7fdc', stain = false) {
  return useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: stain ? FRAG_STAIN : FRAG_WATER, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {uLevel: {value: 0}, uTime: {value: 0}, uOp: {value: 1}, uCol: {value: new THREE.Color(color)}},
  }), [color, stain]);
}
const INK = new THREE.MeshBasicMaterial({color: '#1c1c1e', side: THREE.BackSide});
const UBOX = new THREE.BoxGeometry(1, 1, 1);
export const Ink: React.FC<{p: [number, number, number]; s: [number, number, number]; w?: number}> = ({p, s, w = 0.028}) =>
  <mesh geometry={UBOX} material={INK} position={p} scale={[s[0] + w, s[1] + w, s[2] + w]} />;
const setU = (m: THREE.ShaderMaterial, level: number, time: number, op = 1) => { m.uniforms.uLevel.value = level; m.uniforms.uTime.value = time; m.uniforms.uOp.value = op; };

// plane vertikal yang koordinat lokalnya = koordinat tembok (y 0..h), untuk shader berbasis tinggi
function facePlane(w: number, h: number, axis: 'z' | 'x', x0: number, z0: number) {
  const g = new THREE.PlaneGeometry(w, h, 1, 1);
  if (axis === 'x') g.rotateY(Math.PI / 2);
  g.translate(axis === 'z' ? x0 : x0, h / 2, axis === 'z' ? z0 : z0);
  return g;
}

// ---------- TEMBOK ----------
export type WallState = {
  t: number; level: number; waterOp?: number;
  bubbles?: number;   // 0..1 gelembung cat tumbuh
  peel?: number;      // 0..1 kulit cat terkelupas
  coat?: number;      // 0..1 cat kedap di kaki tembok
  trasram?: number;   // 0..1 trasram muncul
  stain?: number;     // opasitas noda setinggi lutut
};

const BUBBLES: [number, number, number][] = [[-1.05, 0.22, 0.13], [-0.62, 0.38, 0.1], [-0.2, 0.18, 0.15], [0.25, 0.42, 0.09], [0.62, 0.24, 0.12], [1.05, 0.36, 0.1], [-0.85, 0.55, 0.07], [0.0, 0.6, 0.08], [0.9, 0.12, 0.08], [-1.32, 0.42, 0.08]];
const FLAKES: [number, number, number][] = [[-0.42, 0.5, 0], [0.42, 0.62, 0.4], [1.2, 0.5, 0.75]];

export const Wall: React.FC<WallState> = ({t, level, waterOp = 1, bubbles = 0, peel = 0, coat = 0, trasram = 0, stain = 0}) => {
  const m = useMemo(() => ({
    brick: phys('#e65a43'), mortar: phys('#fbe6de', {roughness: 0.7, clearcoat: 0.1}),
    plaster: phys('#f39a85', {roughness: 0.5, clearcoat: 0.4}), coat: phys('#7e2a20', {roughness: 0.25, clearcoat: 1}),
    trasram: phys('#e3ded6', {roughness: 0.35, clearcoat: 0.8, sheen: 0}), ground: phys('#b9b1a6', {roughness: 0.9, clearcoat: 0, sheen: 0}),
  }), []);
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const sph = useMemo(() => new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const bricks = useMemo(() => {
    const out: {x: number; y: number; l: number}[] = [], bh = 0.16, bl = 0.4;
    for (let r = 0; r < Math.round(H / bh); r++) {
      const off = r % 2 ? bl / 2 : 0;
      for (let x0 = -W / 2 - off; x0 < W / 2; x0 += bl) {
        const a = Math.max(x0, -W / 2), b = Math.min(x0 + bl, W / 2);
        if (b - a > 0.05) out.push({x: (a + b) / 2, y: r * bh + bh / 2, l: b - a});
      }
    }
    return out;
  }, []);
  const geo = useMemo(() => ({
    front: facePlane(W + 0.02, H, 'z', 0, ZW), side: facePlane(ZW + D / 2 + 0.01, H, 'x', W / 2 + 0.035, (ZW - D / 2) / 2),
    stain: facePlane(W, H, 'z', 0, ZP + 0.004),
  }), []);
  const wFront = useWaterMat(), wSide = useWaterMat(), st = useWaterMat('#fff', true);
  setU(wFront, level, t, waterOp); setU(wSide, level, t + 0.7, waterOp); setU(st, 0.48, t, stain);
  const tr = Math.min(1, trasram * 1.2);
  return (
    <group>
      {/* tanah */}
      <mesh geometry={box} material={m.ground} position={[0, -0.18, 0.1]} scale={[4.6, 0.36, 2.2]} />
      <Ink p={[0, -0.18, 0.1]} s={[4.6, 0.36, 2.2]} />
      <Ink p={[0, H / 2, 0]} s={[W, H, D]} />
      <Ink p={[0, 0.7, D / 2 + 0.02]} s={[W, 1.4, 0.04]} /><Ink p={[-0.5, 1.9, D / 2 + 0.02]} s={[2.0, 1.0, 0.04]} /><Ink p={[0.75, 1.55, D / 2 + 0.02]} s={[0.5, 0.3, 0.04]} />
      {/* inti adukan + bata */}
      <mesh geometry={box} material={m.mortar} position={[0, H / 2, 0]} scale={[W - 0.004, H - 0.004, D - 0.03]} />
      {bricks.map((b, i) => <mesh key={i} geometry={box} material={m.brick} position={[b.x, b.y, 0]} scale={[b.l - 0.026, 0.134, D - 0.006]} />)}
      {/* plester; pojok kanan atas terkelupas memperlihatkan bata */}
      <mesh geometry={box} material={m.plaster} position={[0, 0.7, D / 2 + 0.02]} scale={[W, 1.4, 0.04]} />
      <mesh geometry={box} material={m.plaster} position={[-0.5, 1.9, D / 2 + 0.02]} scale={[2.0, 1.0, 0.04]} />
      <mesh geometry={box} material={m.plaster} position={[0.75, 1.55, D / 2 + 0.02]} scale={[0.5, 0.3, 0.04]} />
      {/* gelembung cat */}
      {BUBBLES.map(([x, y, r], i) => {
        const g = THREE.MathUtils.clamp(bubbles * 1.6 - i * 0.06, 0, 1);
        return g > 0 ? <mesh key={i} geometry={sph} material={m.plaster} position={[x, y, ZP]} rotation={[Math.PI / 2, 0, 0]} scale={[r * g, r * 0.45 * g, r * g]} /> : null;
      })}
      {/* kulit cat terkelupas: berengsel di tepi atas lalu jatuh pelan */}
      {FLAKES.map(([x, y, d], i) => {
        const p = THREE.MathUtils.clamp(peel * 1.5 - d * 0.6, 0, 1);
        if (p <= 0) return null;
        const fall = Math.max(0, p - 0.55) / 0.45;
        return (
          <group key={i} position={[x, y - fall * fall * 0.45, ZP + 0.006 + fall * 0.25]} rotation={[p * 1.1, 0, (i - 1) * 0.3 * p]}>
            <mesh geometry={box} material={m.plaster} position={[0, -0.07, 0]} scale={[0.2, 0.14, 0.008]} />
          </group>
        );
      })}
      {/* cat kedap di kaki tembok (beat mitos) */}
      {coat > 0 && <mesh geometry={box} material={m.coat} position={[0, 0.3 * coat, ZP + 0.008]} scale={[W + 0.02, 0.6 * coat, 0.016]} />}
      {coat > 0 && <mesh geometry={box} material={m.coat} position={[W / 2 + 0.008, 0.3 * coat, (ZP - D / 2) / 2 + 0.008]} scale={[0.016, 0.6 * coat, ZP + D / 2 + 0.016]} />}
      {/* trasram: pita kedap air di kaki tembok */}
      {tr > 0 && <mesh geometry={box} material={m.trasram} position={[0, 0.15 * tr, (D / 2 + ZP + 0.02) / 2 - 0.08]} scale={[W + 0.03, 0.3 * tr, ZP - D / 2 + 0.2]} />}
      {tr > 0 && <mesh geometry={box} material={m.trasram} position={[0, 0.15 * tr, 0]} scale={[W + 0.03, 0.3 * tr, D + 0.12]} />}
      {stain > 0 && <mesh geometry={geo.stain} material={st} />}
      {level > 0.001 && <mesh geometry={geo.front} material={wFront} />}
      {level > 0.001 && <mesh geometry={geo.side} material={wSide} />}
    </group>
  );
};

// ---------- MAKRO: pori kapiler di penampang bata + tisu ----------
const BW = 2.4, BH = 1.7, BD = 1.2;
function rand(i: number) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
export const PoriBata: React.FC<{t: number; p: number; tissue: number}> = ({t, p, tissue}) => {
  const brick = useMemo(() => phys('#e65a43'), []);
  const pore = useMemo(() => phys('#8e2d20', {roughness: 0.6, clearcoat: 0.2}), []);
  const tissueM = useMemo(() => phys('#fbfaf7', {roughness: 0.9, clearcoat: 0, sheen: 0.3, sheenColor: new THREE.Color('#ffffff')}), []);
  const pool = useMemo(() => phys('#2f8fe6', {roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.75, sheen: 0}), []);
  const chans = useMemo(() => Array.from({length: 34}, (_, i) => {
    const x0 = -BW / 2 + 0.08 + (i + rand(i) * 0.7) * ((BW - 0.16) / 34);
    const pts = Array.from({length: 9}, (_, k) => new THREE.Vector3(x0 + Math.sin(k * 1.3 + i) * 0.035 + (rand(i * 9 + k) - 0.5) * 0.03, (k / 8) * BH, BD / 2 + 0.002));
    const curve = new THREE.CatmullRomCurve3(pts);
    return {dark: new THREE.TubeGeometry(curve, 48, 0.017, 8), wet: new THREE.TubeGeometry(curve, 48, 0.021, 8), speed: 0.75 + rand(i + 50) * 0.5};
  }), []);
  const mats = useMemo(() => chans.map(() => new THREE.ShaderMaterial({vertexShader: VERT, fragmentShader: FRAG_WATER, transparent: true, depthWrite: false,
    uniforms: {uLevel: {value: 0}, uTime: {value: 0}, uOp: {value: 1.8}, uCol: {value: new THREE.Color('#2f8fe6')}}})), [chans]);
  chans.forEach((c, i) => setU(mats[i], p * BH * 1.05 * c.speed, t, 2.2));
  const tGeo = useMemo(() => { const g = new THREE.PlaneGeometry(0.55, 1.8, 10, 30); const pos = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * 4) * 0.05); g.translate(0, 0.9, 0); g.computeVertexNormals(); return g; }, []);
  const tWater = useWaterMat('#1f7fdc');
  setU(tWater, -0.05 + tissue * 1.3, t, 1.4);
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  return (
    <group>
      <mesh geometry={box} material={pool} position={[0.7, -0.06, 0]} scale={[5.6, 0.12, 2.4]} />
      <mesh geometry={box} material={brick} position={[0, BH / 2, 0]} scale={[BW, BH, BD]} />
      <Ink p={[0, BH / 2, 0]} s={[BW, BH, BD]} w={0.04} />
      {chans.map((c, i) => <mesh key={i} geometry={c.dark} material={pore} />)}
      {chans.map((c, i) => <mesh key={'w' + i} geometry={c.wet} material={mats[i]} />)}
      <group position={[1.62, -0.08, 0.3]} rotation={[0, -0.2, 0.03]}>
        <mesh geometry={tGeo} material={tissueM} />
        <mesh geometry={tGeo} material={tWater} position={[0, 0, 0.012]} />
      </group>
    </group>
  );
};

// ---------- PENAMPANG LAPISAN: bata | plester | cat, kristal garam mendorong cat ----------
export const Lapisan: React.FC<{t: number; water: number; crystal: number; bulge: number; powder: number; spread: number}> = ({t, water, crystal, bulge, powder, spread}) => {
  const m = useMemo(() => ({brick: phys('#e65a43'), plaster: phys('#f39a85', {roughness: 0.5, clearcoat: 0.4}), paint: phys('#ffffff', {roughness: 0.3, clearcoat: 0.9, side: THREE.DoubleSide}),
    salt: phys('#ffffff', {roughness: 0.15, clearcoat: 1, sheen: 0, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.25}), groove: phys('#fbe6de', {roughness: 0.7, clearcoat: 0.1})}), []);
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const S = 2.2, zPl = 0.35 + spread * 0.25, zCat = 0.48 + spread * 0.5;
  const cx = 0.42, cy = 1.0, R = 0.5;
  const paintGeo = useMemo(() => new THREE.PlaneGeometry(S / 2 + 0.55, S, 80, 90).translate(-S / 4 + 0.275, S / 2, 0), []);
  // tonjolan cat (gelembung) diupdate per frame
  const pos = paintGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const dx = pos.getX(i) - cx, dy = pos.getY(i) - cy; pos.setZ(i, bulge * 0.32 * Math.exp(-(dx * dx + dy * dy) / (R * R * 0.5))); }
  pos.needsUpdate = true; paintGeo.computeVertexNormals();
  const oct = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const crystals = useMemo(() => Array.from({length: 46}, (_, i) => {
    const a = rand(i) * Math.PI * 2, r = Math.sqrt(rand(i + 7)) * R * 0.85;
    return {x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, s: 0.03 + rand(i + 3) * 0.05, d: rand(i + 11), rot: rand(i + 13) * 3};
  }), []);
  const side = useMemo(() => facePlane(0.5 + 0.12, S, 'x', S / 2 + 0.004, 0.06), []);
  const wm = useWaterMat();
  setU(wm, water * 0.9, t, 0.8);
  return (
    <group>
      <mesh geometry={box} material={m.brick} position={[0, S / 2, -0.12]} scale={[S, S, 0.5]} />
      <Ink p={[0, S / 2, -0.12]} s={[S, S, 0.5]} w={0.035} /><Ink p={[0, S / 2, zPl - 0.06]} s={[S, S, 0.12]} w={0.035} />
      {[0.42, 0.84, 1.26, 1.68].map((y) => <mesh key={y} geometry={box} material={m.groove} position={[0, y, 0.135]} scale={[S + 0.002, 0.028, 0.02]} />)}
      <mesh geometry={box} material={m.plaster} position={[0, S / 2, zPl - 0.06]} scale={[S, S, 0.12]} />
      {crystals.map((c, i) => {
        const g = THREE.MathUtils.clamp(crystal * 1.4 - c.d * 0.4, 0, 1);
        const zc = zPl + 0.01 + bulge * 0.32 * Math.exp(-((c.x - cx) ** 2 + (c.y - cy) ** 2) / (R * R * 0.5)) * 0.6 * rand(i + 21);
        return g > 0 ? <mesh key={i} geometry={oct} material={m.salt} position={[c.x, c.y, zc]} rotation={[c.rot, c.rot * 1.3, 0]} scale={c.s * g} /> : null;
      })}
      {Array.from({length: 26}, (_, i) => {
        const ph = powder * 1.6 - rand(i + 30) * 0.6; if (ph <= 0) return null;
        const y = cy - R * 0.7 - ph * ph * 1.4, x = cx + (rand(i + 40) - 0.5) * 0.7;
        return y > 0.02 ? <mesh key={'p' + i} geometry={oct} material={m.salt} position={[x, y, zCat + 0.08 + rand(i) * 0.1]} scale={0.018} rotation={[ph * 6, ph * 4, 0]} /> : null;
      })}
      <mesh geometry={paintGeo} material={m.paint} position={[0, 0, zCat]} />
      <mesh geometry={side} material={wm} />
    </group>
  );
};
