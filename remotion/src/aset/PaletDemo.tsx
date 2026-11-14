// Demo identitas lintas palet: adegan yang sama di latar berbeda. Yang tetap: kicker, TikTokBox, kartu judul dua tingkat,
// chip, kotak caption, ornamen sudut, grain, tipografi, objek 3D membulat. Yang berganti: latar dan warna material (style/palet.json).
// Render: npx remotion still PaletDemo out/x.png --props='{"palet":"mint"}' --frame=45
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {Grain, TikTokBox, C} from './Aset';
import {Kicker, Ornament} from './Gabung';
import {PaperPalet, PALET, KARTU, type PaletName} from './PaperPalet';
import {Env} from '../pengetahuan/Scene';
import {Rig, Base, House} from '../v13/Mood13';

export const PaletDemo: React.FC<{palet?: PaletName}> = ({palet = 'krem'}) => {
  const p = PALET[palet];
  const gelap = !p.terang;
  const chip = (x: number, text: string, col: string) => (
    <div style={{position: 'absolute', left: x, top: 1235, transform: 'translate(-50%,-50%)', padding: '10px 22px', borderRadius: 16, background: KARTU, border: `4px solid ${col}`, fontFamily: 'Inter', fontWeight: 800, fontSize: 54, color: col}}>{text}</div>
  );
  return (
    <AbsoluteFill>
      <PaperPalet palet={palet} />
      <Kicker text="FAKTA RUMAH · #00" y={292} start={0} color={gelap ? p.accent : undefined} />
      <TikTokBox text="Kenapa dua rumah beda nasib?" p={1} y={338} size={40} />
      <div style={{position: 'absolute', left: 60, top: 450, maxWidth: 960, padding: '20px 30px 24px', borderRadius: 26, background: KARTU, boxShadow: '0 12px 40px rgba(28,28,30,0.18)', fontFamily: 'Inter', color: C.ink}}>
        <div style={{fontSize: 50, fontWeight: 700, letterSpacing: -1}}>Satu aman,</div>
        <div style={{fontSize: 96, fontWeight: 900, letterSpacing: -2, lineHeight: 1.0, color: p.accentTeks, marginTop: 6, whiteSpace: 'nowrap'}}>SATU RETAK?</div>
      </div>
      <ThreeCanvas width={1080} height={1920} shadows orthographic camera={{position: [0, 4, 30], zoom: 200, near: 0.1, far: 100}} gl={{alpha: true, antialias: true}}>
        <Rig x={0} y={1.05} zoom={250} />
        <Env intensity={0.35} /><hemisphereLight args={['#fffaf0', '#cfc6b4', 0.6]} />
        <directionalLight position={[2.5, 4.5, 3.0]} intensity={2.2} color="#fff4e6" castShadow />
        <Base w={5.2} />
        <House x={-1.0} wall={p.accent} roof={p.accentTeks} />
        <House x={1.0} wall={p.cool} roof={p.coolTeks} />
      </ThreeCanvas>
      {chip(190, 'masalah', p.accentTeks)}
      {chip(746, 'aman', p.goodTeks)}
      <div style={{position: 'absolute', left: 60, right: 60, top: 1400, textAlign: 'center'}}>
        <span style={{display: 'inline-block', padding: '12px 28px 16px', borderRadius: 22, background: 'rgba(250,249,246,0.95)', boxShadow: '0 10px 30px rgba(28,28,30,0.18)', fontFamily: 'Inter', fontWeight: 700, fontSize: 60, letterSpacing: -0.8, color: C.ink}}>
          <span style={{color: p.accentTeks}}>rumah</span> sebelah retak
        </span>
      </div>
      <div style={{filter: gelap ? 'invert(1)' : 'none'}}><Ornament cx={1030} cy={150} size={360} start={0} /><Ornament cx={40} cy={1800} size={360} start={6} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: 30, color: gelap ? '#dfe6f5' : C.grey}}>palet: {palet} · {p.nama}</div>
      <Grain o={0.08} />
    </AbsoluteFill>
  );
};
