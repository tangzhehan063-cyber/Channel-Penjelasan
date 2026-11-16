# Riset: Air PDAM direbus vs air galon isi ulang, 16 Nov 2026

Topik pengganti "pajak jual rumah" (dihentikan user; riset pajak tetap tersimpan). Hanya fakta dari teks resmi yang saya baca langsung.

## Sumber primer yang terbaca
1. **Permenkes 2/2023** (peraturan pelaksanaan PP 66/2014 Kesehatan Lingkungan), PDF dari jdih.kemkes.go.id. **Catatan: judul file tertulis "RANCANGAN"**; versi bertanda tangan ada di peraturan.bpk.go.id (diblokir Cloudflare dari container). Angka di bawah cocok dengan kutipan jurnal atas Permenkes 2/2023, tapi cek ulang ke salinan resmi sebelum publish.
2. **WHO Technical Brief "Boil water" (WHO/FWC/WSH/15.02, Jan 2015)**, iris.who.int.

## Fakta terverifikasi
**Standar air minum (Permenkes 2/2023, Lampiran, Tabel 1 Parameter Wajib Air Minum)**
- Air Minum = air yang memenuhi syarat kesehatan dan **dapat langsung diminum**; berlaku untuk jaringan perpipaan (PDAM), bukan perpipaan, dan depot.
- Wajib: *E. coli* **0** CFU/100 ml; total coliform **0** CFU/100 ml; kekeruhan < 3 NTU; TDS < 300 mg/L; suhu udara ±3 °C.
- **Titik sampel pengawasan internal:** perpipaan = di **unit produksi dan jaringan distribusi**; depot = di **unit produksi dan unit pengisian galon**. (Tidak disebut keran rumah.)
- Frekuensi minimal pengujian internal: fisik 1 bulan, mikrobiologi **1 bulan**, kimia 6 bulan; hasil dilaporkan ke dinas kesehatan tiap 6 bulan.
- **Depot Air Minum (DAM)** = usaha yang mengolah air baku jadi air minum curah dan menjual langsung ke konsumen. Wajib diuji di lab terakreditasi/ditunjuk Pemda: ***E. coli* tiap 3 bulan, parameter lengkap tiap 6 bulan.**
- Aturan galon di DAM: dibilas air produksi **minimal 10 detik** sebelum diisi, ditutup bersih setelah diisi, galon terisi **tidak boleh disimpan di DAM lebih dari 1x24 jam**; tandon air baku harus tertutup.
- Pasal 51: Permenkes 43/2014 (Higiene Sanitasi Depot Air Minum) **dicabut** saat 2/2023 berlaku (hasil pencarian yang menyebut 2/2023 = "higiene sanitasi depot" itu keliru).
- Rekomendasi bila hasil buruk di tingkat masyarakat: Pengelolaan Air Minum Rumah Tangga (PAMRT), rinci di panduan terpisah (belum dibaca).

**Merebus (WHO Boil water)**
- Merebus sampai **rolling boil** cukup untuk menonaktifkan bakteri, virus, dan protozoa patogen. Setelah mendidih, angkat dari api, **dinginkan alami (tanpa es)**, lindungi dari kontaminasi ulang saat disimpan.
- Boros bahan bakar dan **tidak memberi perlindungan residu** (air bisa tercemar lagi setelah dingin).
- Bakteri peka panas: *E. coli* turun 1 log per < 2 detik pada 65 °C (tabel 1 WHO).
- Brief WHO ini **tidak** membahas bahan kimia; jangan klaim "rebus tidak menghilangkan kimia" dari sumber ini (CDC memuatnya tapi domain diblokir).

## Belum terverifikasi (jangan masuk naskah)
- Persentase depot isi ulang yang tercemar: hanya studi lokal (Semarang 2017, Banyumas 2016, dll.), tidak ada survei nasional Kemenkes. Jangan tulis "X% galon isi ulang tercemar".
- Waktu mendidih 1 menit / 3 menit di ketinggian: itu rekomendasi CDC, bukan WHO (WHO: cukup rolling boil).
- Kenapa air PDAM perlu direbus di rumah (pipa dalam rumah, tandon): sumber primer belum ada; sebut hanya bahwa titik uji PDAM bukan di keran rumah.
- Harga: tarif listrik/gas dan harga isi ulang galon belum disurvei. Hitungan biaya rebus bisa memakai fisika (1 liter 25→100 °C = 0,087 kWh ideal), tarif tandai "(perkiraan)".

## Sudut video (usulan)
Hook: "Air PDAM boleh diminum langsung? Standarnya bilang bisa, tapi uji kualitasnya berhenti di jaringan PDAM, bukan di keran rumahmu." Bandingkan 3 jalur: rebus sendiri (kontrol di tangan, tanpa residu), galon isi ulang (diuji tiap 3 bulan, galon dibilas 10 detik), galon merek (belum diriset, SNI AMDK).

## Cara akses sumber
`curl -A "Mozilla/5.0"` ke jdih.kemkes.go.id (jalur `/storage/documents/pdfs/...`) dan who.int/iris.who.int berhasil. peraturan.bpk.go.id (Cloudflare) dan cdc.gov (Akamai) menolak.
