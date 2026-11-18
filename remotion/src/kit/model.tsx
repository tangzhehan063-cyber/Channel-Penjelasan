// Kit Penjelasan: model 3D luar (glTF, mis. Kenney CC0) dan siluet SVG diekstrusi. Katalog: style/aset-luar.md
// PENTING: glTF dimuat di komponen DOM (bukan di dalam kanvas R3F) lalu dilempar sebagai prop. Konteks React tidak menyeberang ke kanvas.
import {useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js';
import {continueRender, delayRender, staticFile} from 'remotion';
import {INK} from './prim';
import type {V3} from './waktu';

export type Models = Record<string, THREE.Group>;
/** muat glTF (path relatif terhadap public/aset-luar/). m = null selama belum siap. Render ditahan sampai kanvas benar-benar menggambar:
 *  pasang <Gambar onSiap={siap} /> di dalam kanvas SETELAH semua <Model3D>/<Siluet> (hanya bila m != null). */
export const useModels = (files: string[]): {m: Models | null; siap: () => void} => {
  const [m, setM] = useState<Models | null>(files.length ? null : {});
  const [h] = useState(() => delayRender('muat model luar', {timeoutInMilliseconds: 60000}));
  const [lepas] = useState(() => { let sudah = false; return () => { if (!sudah) { sudah = true; continueRender(h); } }; });
  useEffect(() => {
    if (!files.length) { lepas(); return; }
    const L = new GLTFLoader();
    Promise.all(files.map((f) => L.loadAsync(staticFile(`aset-luar/${f}`)).then((g) => [f, g.scene] as const)))
      .then((r) => setM(Object.fromEntries(r))).catch((e) => { console.error(e); lepas(); });
  }, []);
  return {m, siap: lepas};
};
/** Pemicu gambar: render satu frame secara sinkron lalu melapor siap. Taruh paling akhir di dalam kanvas. */
export const Gambar: React.FC<{onSiap: () => void}> = ({onSiap}) => {
  const {gl, scene, camera} = useThree();
  useEffect(() => { gl.render(scene, camera); const id = requestAnimationFrame(() => requestAnimationFrame(onSiap)); return () => cancelAnimationFrame(id); }, []);
  return null;
};

/** Pasang model: fit = sisi terpanjang (x/z) dalam satuan dunia, alas di y=0, dipusatkan. redup = pengali kecerahan (0,7 = lebih gelap). warna = {namaNode atau namaMaterial: hex} mengganti warna bagian itu saja; flat = satu warna untuk semua; garis = outline tinta tipis. */
export const Model3D: React.FC<{scene: THREE.Group; p?: V3; fit?: number; rot?: number; warna?: Record<string, string>; flat?: string; garis?: boolean; redup?: number}> = ({scene, p = [0, 0, 0], fit = 1.5, rot = 0, warna, flat, garis, redup = 1}) => {
  const {obj, k} = useMemo(() => {
    const o = scene.clone(true);
    const box = new THREE.Box3().setFromObject(o), size = new THREE.Vector3(), c = new THREE.Vector3();
    box.getSize(size); box.getCenter(c);
    const kk = fit / Math.max(size.x, size.z, 0.0001);
    o.position.set(-c.x, -box.min.y, -c.z);
    const mats: Record<string, THREE.Material> = {};
    const get = (hex: string) => (mats[hex] ??= new THREE.MeshStandardMaterial({color: hex, roughness: 0.55}));
    o.traverse((n) => {
      const m = n as THREE.Mesh;
      if (!m.isMesh) return;
      if (garis && !(m as any).userData.sudahGaris) { // outline tinta tipis pada sudut tajam (≥35°)
        (m as any).userData.sudahGaris = true;
        m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 35), new THREE.LineBasicMaterial({color: INK})));
      }
      if (flat) { m.material = get(flat); return; }
      if (redup !== 1 && !warna) { // gelapkan albedo (model berwarna putih terlalu terang di bawah lampu adegan); bahan dikloning agar tidak mengubah model asli
        const arr = Array.isArray(m.material) ? m.material : [m.material];
        const baru = arr.map((q) => { const c = (q as THREE.MeshStandardMaterial).clone(); if (c.color) c.color.multiplyScalar(redup); return c; });
        m.material = Array.isArray(m.material) ? baru : baru[0];
      }
      if (warna) { // prioritas: nama node (bagian spesifik, mis. 'doorFreezer'), baru nama material (mis. 'metalLight')
        let q: THREE.Object3D | null = n;
        while (q) { if (warna[q.name]) { m.material = get(warna[q.name]); return; } q = q.parent; }
        const mm = m.material as THREE.Material;
        if (!Array.isArray(mm) && warna[mm.name]) m.material = get(warna[mm.name]);
      }
    });
    return {obj: o, k: kk};
  }, [scene, fit, warna, flat, redup, garis]);
  return (
    <group position={p} rotation={[0, rot, 0]} scale={k}>
      <primitive object={obj} />
    </group>
  );
};
export type Lapis = {d: string; warna: string; depth: number; z?: number; bevel?: number};
/** Siluet SVG berlapis -> 3D membulat. d = jalur SVG (y ke bawah), 1 satuan dunia = 100 px SVG bila skala 0.01. pusat = titik SVG yang jadi (0,0). */
export const Siluet: React.FC<{lapis: Lapis[]; pusat: [number, number]; skala?: number; p?: V3; rot?: number}> = ({lapis, pusat, skala = 0.01, p = [0, 0, 0], rot = 0}) => {
  const grup = useMemo(() => {
    const g = new THREE.Group(), loader = new SVGLoader();
    for (const l of lapis) {
      const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${l.d}"/></svg>`);
      for (const pt of data.paths) for (const shape of SVGLoader.createShapes(pt)) {
        const geo = new THREE.ExtrudeGeometry(shape, {depth: l.depth, bevelEnabled: (l.bevel ?? 0) > 0, bevelSize: l.bevel ?? 0, bevelThickness: l.bevel ?? 0, bevelSegments: 4, curveSegments: 24});
        geo.translate(-pusat[0], -pusat[1], (l.z ?? 0) - l.depth / 2);
        g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color: l.warna, roughness: 0.5})));
      }
    }
    g.scale.set(skala, -skala, skala);
    return g;
  }, [lapis, pusat, skala]);
  return <group position={p} rotation={[0, rot, 0]}><primitive object={grup} /></group>;
};
