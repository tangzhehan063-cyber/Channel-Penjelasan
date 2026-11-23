// Foto nyata sebagai bidang (billboard) di dunia three.js: bagian foto bisa dipotong (crop) dan ujung atasnya diberi bulu supaya menyatu dengan langit.
// Foto tidak diberi bingkai/kartu. Dimuat lewat staticFile, ditunggu dengan delayRender (deterministik).
import {useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import {continueRender, delayRender, staticFile} from 'remotion';

export const useFoto = (src: string): THREE.Texture | null => {
  const [tx, setTx] = useState<THREE.Texture | null>(null);
  const [h] = useState(() => delayRender(`foto ${src}`));
  useEffect(() => {
    new THREE.TextureLoader().load(staticFile(src), (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; setTx(t); continueRender(h); }, undefined, () => continueRender(h));
  }, [src, h]);
  return tx;
};

const bulu = (px: number) => { // alpha: 0 di atas -> 1 setelah `px` dari 256
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const g = c.getContext('2d')!; const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#000'); gr.addColorStop(Math.min(0.99, px / 256), '#fff'); gr.addColorStop(1, '#fff'); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); return new THREE.CanvasTexture(c);
};

/** Potongan foto: `crop` = [u0, v0, u1, v1] dalam pecahan gambar (v dari BAWAH). lebar/tinggi dalam meter. Pusat bidang di (x,y,z). */
export const FotoBidang: React.FC<{tx: THREE.Texture | null; crop: [number, number, number, number]; lebar: number; tinggi: number; p: [number, number, number]; buluAtas?: number; o?: number; rot?: number}> =
  ({tx, crop, lebar, tinggi, p, buluAtas = 0, o = 1, rot = 0}) => {
    const m = useMemo(() => { if (!tx) return null; const c = tx.clone(); c.needsUpdate = true; c.repeat.set(crop[2] - crop[0], crop[3] - crop[1]); c.offset.set(crop[0], crop[1]); return c; }, [tx, crop[0], crop[1], crop[2], crop[3]]);
    const a = useMemo(() => (buluAtas > 0 ? bulu(buluAtas * 256) : undefined), [buluAtas]);
    if (!m) return null;
    return (<mesh position={p} rotation={[0, 0, rot]} renderOrder={2}>
      <planeGeometry args={[lebar, tinggi]} />
      <meshBasicMaterial map={m} alphaMap={a} transparent={buluAtas > 0 || o < 1} opacity={o} toneMapped={false} depthWrite={o >= 1} />
    </mesh>);
  };
