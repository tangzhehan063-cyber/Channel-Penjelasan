// Uji model CC0 (Kenney Starter-Kit-Racing): glTF dimuat di komponen DOM (delayRender) lalu dilempar ke kanvas 3D.
import {ThreeCanvas} from '@remotion/three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {useEffect, useMemo, useState} from 'react';
import {PaperPalet} from '../aset/PaperPalet';
import {Lights, Rig} from './stage';

const FILES = ['vehicle-truck-red.glb', 'vehicle-truck-yellow.glb', 'vehicle-motorcycle.glb'];
/** muat semua glTF sebelum frame dirender */
export const useModels = (files: string[]) => {
  const [m, setM] = useState<Record<string, THREE.Group> | null>(null);
  const [h] = useState(() => delayRender('muat glTF'));
  useEffect(() => {
    const L = new GLTFLoader();
    Promise.all(files.map((f) => L.loadAsync(staticFile(`models/kenney/${f}`)).then((g) => [f, g.scene] as const)))
      .then((r) => setM(Object.fromEntries(r))).catch((e) => { console.error(e); continueRender(h); });
  }, []);
  // lepas penahan render hanya setelah kanvas sempat menggambar model (2 frame animasi + jeda)
  useEffect(() => {
    if (!m) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => continueRender(h), 250)));
    return () => cancelAnimationFrame(id);
  }, [m]);
  return m;
};
const Pasang: React.FC<{scene: THREE.Group; p: [number, number, number]; s: number; rot?: number; flat?: string}> = ({scene, p, s, rot = 0, flat}) => {
  const obj = useMemo(() => {
    const o = scene.clone(true);
    // warnai hanya bodi (node bernama 'body'); roda, kaca, lampu tetap dari tekstur asli
    const mat = flat ? new THREE.MeshStandardMaterial({color: flat, roughness: 0.55}) : null;
    o.traverse((c) => { const m = c as THREE.Mesh; if (!m.isMesh || !mat) return; let n: THREE.Object3D | null = c; while (n) { if (n.name === 'body') { m.material = mat; break; } n = n.parent; } });
    return o;
  }, [scene, flat]);
  return <primitive object={obj} position={p} scale={s} rotation={[0, rot, 0]} />;
};
export const TesKendaraan: React.FC = () => {
  const m = useModels(FILES);
  return (
    <AbsoluteFill>
      <PaperPalet palet="batu" />
      <ThreeCanvas width={1080} height={1920} camera={{position: [0, 2.2, 7], fov: 34}} gl={{alpha: true, antialias: true}}>
        <Lights /><Rig k={{t: 0, pos: [0.3, 3.4, 11.5], look: [0, 0.2, 0]}} />
        {m && <>
          <Pasang scene={m['vehicle-truck-red.glb']} p={[-1.2, 1.7, 0]} s={0.85} rot={-0.7} />
          <Pasang scene={m['vehicle-motorcycle.glb']} p={[1.2, 1.7, 0]} s={0.85} rot={-0.7} />
          <Pasang scene={m['vehicle-truck-yellow.glb']} p={[-1.2, -1.1, 0]} s={0.85} rot={-0.7} flat="#3f6fb8" />
          <Pasang scene={m['vehicle-motorcycle.glb']} p={[1.2, -1.1, 0]} s={0.85} rot={-0.7} flat="#e9a23b" />
        </>}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
