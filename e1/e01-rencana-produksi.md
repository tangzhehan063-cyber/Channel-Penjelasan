# E1 #01: Rencana produksi (WORKFLOW 08–10), menunggu approval pilot
Dibuat 23 Nov 2026. Belum ada generasi yang dijalankan.

## 1. Model (dari konektor ElevenLabs penuh, `creative_get_flow_node_types`)
| Fungsi | Model utama | Alasan | Cadangan (hanya bila pilot gagal) |
|---|---|---|---|
| Style reference + keyframe | `gemini-3-pro-image` (Nano Banana Pro), 9:16, 2K | Bisa memakai gambar referensi (`images`) agar rumah yang sama konsisten antar shot; edit gambar | `flux-3-image`, `gpt-image-2.5-*` |
| Image-to-video | `bytedance-seedance-v2.5`, 9:16, 720p untuk pilot (1080p untuk final), `generate_audio=false` | Start/end frame + reference image; panduan modelnya menyebut kuat untuk cuaca, air, dan interaksi fisik (inti video ini); durasi 4–30 dtk | `kling-3-pro` (1080p, 3–15 dtk), `veo-3.1-fast` (4/6/8 dtk) |
| Suara | Gemini TTS Achernar (`tools/gemini_tts.py`) | Pilihan user; gratis | - |
| SFX (hujan, aliran air, ambang) | `eleven_text_to_sound_v3`, hanya bila perlu | Selektif sesuai WORKFLOW 07 | - |
| Penyusunan + teks overlay + SRT + loudnorm | Remotion/ffmpeg lokal (pipeline sudah ada) | Teks tidak boleh dari generator; tanpa kredit | - |

## 2. Rencana pilot (WORKFLOW 08): 3 generasi, batas keras 6
1. **Style reference** (1 gambar): komposisi shot 1, rumah perumahan Indonesia lebih rendah dari badan jalan, mendung, 9:16. **Berhenti untuk approval user.**
2. **Keyframe pilot** (1 gambar, shot 4: POV rendah menyusuri aliran air ke bawah pintu), memakai style reference sebagai referensi.
3. **Klip pilot** (1 video, ±5 dtk, Seedance 2.5, start frame = keyframe pilot, satu gerak kamera: POV forward).
Pilot memakai shot 4 karena itu padanan POV signature #9 (mobil melaju ke pintu). Catat kredit sebelum dan sesudah, waktu proses, dan hasil di `e1/e01-rumah-lebih-rendah.md` bagian 3–5.

## 3. Estimasi produksi penuh (hanya setelah pilot disetujui)
| Item | Jumlah dasar | Dengan cadangan ulang ±50% |
|---|---|---|
| Keyframe (10 shot + 1 style ref) | 11 gambar | ±16 |
| Klip i2v (durasi ±4,4,5,5,5,5,8,4,4,6 dtk; shot 1 dibuat 4 dtk lalu dipotong ke 3,6) | 10 klip, ±50 dtk | ±15 klip, ±75 dtk |
| Voice-over | 1 generasi Gemini | - |
| SFX | 0–3 | - |

## 4. Estimasi kredit: TIDAK BISA diberikan angka
- `account_get_usage` ditolak (konektor perlu izin tambahan; harus disambung ulang oleh pemilik akun), dan tool model tidak mencantumkan harga per generasi.
- Cara menutupi: (a) pilot mengukur kredit nyata per gambar dan per klip; (b) saya hitung proyeksi produksi penuh dari angka itu sebelum minta approval batch; (c) user bisa menyambung ulang izin konektor atau membaca saldo kredit di dashboard ElevenLabs sebelum dan sesudah pilot.
- **Anggaran kredit (WORKFLOW 12 butir 5) belum diputuskan.**

## 5. Rencana prompt
**Style bible (dipakai di semua prompt):** semi-realistic cinematic architectural visualization, rumah tapak perumahan Indonesia (satu lantai, cat putih krem, genteng terakota, kanopi kecil, pagar besi hitam setinggi dada, teras berkeramik abu, pot tanaman), jalan aspal kecil dengan selokan di tepinya, cuaca mendung menjelang hujan, jam sore, cahaya abu hangat natural, bayangan lembut, warna tidak terlalu jenuh, tanpa HDR berlebihan, vertikal 9:16, ruang kosong di bagian atas untuk teks, tanpa orang, tanpa teks, tanpa logo atau merek, tanpa plat nomor.
**Prompt style reference:** `[style bible] + establishing wide shot dari badan jalan, rumah berada jelas lebih rendah dari permukaan jalan (teras ±50 cm di bawah aspal), pintu depan terlihat dari atas.`
**Prompt keyframe shot 4:** `[style bible] + low POV camera 15 cm above ground, hujan deras, air mengalir di paving teras menuju celah bawah pintu, pintu dan gerbang sama dengan referensi, shallow depth of field.`
**Prompt klip pilot (deskripsikan gerak, bukan gambar):** `Slow forward POV tracking following the stream of rainwater along the paving toward the gap under the front door, camera stays low and steady, rain ripples on the water, no distortion, no warping, no change to house shape, consistent lighting.` Negative: `no people, no text, no logos, no morphing, no flicker.`

## 6. Output yang diharapkan
Style reference (1 gambar, minta ACC) → keyframe pilot (1 gambar) → klip pilot ±5 dtk, serta tabel evaluasi pilot (visual, gaya, gerak, konsistensi, biaya, waktu, kemudahan alur).

## 7. Risiko
- Rumah berubah bentuk antar shot (mitigasi: style reference jadi referensi semua keyframe, satu rumah saja).
- Generator default ke rumah Barat/suburban (mitigasi: ciri rumah Indonesia dieksplisitkan di style bible).
- Fisika air tidak natural, warping, flicker pada hujan (mitigasi: satu gerak kamera per klip, durasi pendek, cek QC visual).
- POV melewati gerbang dan celah pintu sulit stabil (bila gagal: pecah jadi dua klip pendek atau pakai end frame).
- Durasi minimum Seedance 4 dtk vs shot 3,6 dtk (dipotong saat editing).
- Kredit tidak terukur sebelum pilot; regenerasi hanya untuk alasan di WORKFLOW 09.
- Suara Gemini beda dari #9 (variabel tambahan, sudah dicatat).
- Topik sama dengan #17 (penonton mungkin sudah melihat).

## 8. Approval yang dibutuhkan sekarang
1. Mulai pilot: 3 generasi (batas 6), model di atas.
2. Setelah style reference jadi: approval gambar sebelum keyframe dan klip pilot.
3. Batch penuh: approval terpisah setelah proyeksi kredit dari pilot.
