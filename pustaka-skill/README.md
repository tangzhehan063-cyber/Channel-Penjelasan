# Pustaka skill motion (lokal)

56 skill dari 19 paket iart-ai (lisensi MIT, lihat `LICENSE` tiap paket) di `motion/`, disimpan di repo supaya tidak perlu clone/pasang per video.
- Daftar & status kecocokan: `REGISTRY.md` (dibuat `node tools/skill-registry.mjs` dari `kompatibilitas.json`).
- Memilih skill: `node tools/pilih-skill.mjs "<tugas>" [--fase N]` atau skill proyek `motion-skills`.
- Aturan penerjemahan ke proyek: `INTEGRASI.md`.
- Asal & commit: `SUMBER.txt`; media demo yang tidak disimpan: `media-dibuang.txt`.
Folder ini tidak dimuat otomatis oleh Claude; hanya SKILL.md yang dipilih router yang dibaca.
