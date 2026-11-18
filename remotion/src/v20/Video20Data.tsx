// Bukti template kit: #20 dirakit dari beats.json lewat <Penjelasan>. Harus menghasilkan still identik dengan Video20 (dicek 18 Nov 2026).
// Panel 2D pemutus pola (Sejarah) = lapisan `ekstra` khusus video ini.
import {Penjelasan, type DataVideo} from '../kit';
import {Sejarah} from './Video20';
import data from './beats.json';
import words from '../../public/v20/words.json';

export const Video20Data: React.FC = () => <Penjelasan data={data as unknown as DataVideo} words={(words as {words: {word: string; start: number; end: number}[]}).words} ekstra={[Sejarah]} />;
