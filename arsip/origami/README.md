# Arsip: engine kertas origami (video #1–#4)

Video #1–#4 dibuat dengan engine canvas 3D bergaya kertas origami, sebelum channel pindah ke gaya editorial 3D (Remotion). Arsip ini menyimpan semua sumbernya supaya video bisa dirender ulang atau direvisi.

| Folder | Isi |
|---|---|
| `engine/` | Library H (`lib_h.js`), SOUND kit (`lib_sound.js`), prompt gaya Origami Studio (bagian libs) |
| `01-bata-selang-seling/` … `04-keramik-meledak/` | `explainer.js` (scene + timeline + retime `TM`), `extras.js` (subtitle `CUES` + skor SFX), storyboard (`storyboard.html` siap buka, `sb_script.js`, `sb_body.html`), pipeline (`build_pages.py`, `shot.py`, `render.py`, `sfx.py`), `audio/vo_src.wav` (VO asli) |
| `profile-picture/` | Scene foto profil rumah kertas + bohlam (hasil di `branding/`) |

## Pipeline
1. `python3 build_pages.py <prompt libs>`: membangun `frame.html` + `storyboard.html` (font Space Grotesk/Space Mono dari npm `@fontsource`, folder `fonts/`).
2. `python3 shot.py <t1,t2,...> <prefix>`: keyframe PNG untuk dicek.
3. `python3 render.py <frame_awal> <frame_akhir> <out.mp4>`: render JPEG ke ffmpeg (4 worker paralel). `python3 sfx.py` menghasilkan `audio/sfx.wav`.
4. Mix: VO asli `adelay 300 ms` + SFX `lowpass 6500, volume 0.4`, `amix`. Encode H.264 CRF 21, AAC 192k, 1080×1920 30 fps.

Video #4 (dan foto profil) dirakit dengan `asm.py`: mesin dari `explainer.js` video #3 + `config.js` + `scene.js`.

## Aturan audio (dari user)
Suara VO **tidak diolah** (tanpa potong jeda, tempo, atau kompresi; hanya +1 dB). Animasi dan durasi video yang menyesuaikan VO lewat tabel retime `TM` ([waktu video, waktu storyboard]).
