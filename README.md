# DramabaBox-Api-Scraping
Proyek API tidak resmi yang melakukan pengambilan data (scraping) dari website pihak ketiga dan menyajikannya kembali dalam format JSON untuk kebutuhan pengembangan.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)
![Express](https://img.shields.io/badge/Express-v4.x-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**DramaBox API Scraper** adalah layanan backend berbasis Node.js yang mengekstraksi data dari situs DramaBox secara *real-time*. Proyek ini menyediakan API JSON untuk pencarian drama, daftar trending, detail episode, hingga ekstraksi URL streaming (m3u8/mp4) dengan memanipulasi request AJAX.

Dilengkapi dengan antarmuka dokumentasi bawaan yang modern menggunakan **TailwindCSS**.

---

## 🚀 Fitur Utama

- **Pencarian Drama**: Cari judul drama berdasarkan kata kunci.
- **Update Terbaru**: Dapatkan daftar drama yang baru saja diperbarui (mendukung pagination).
- **Top Trending**: Lihat daftar drama yang sedang populer saat ini.
- **Detail Lengkap**: Metadata drama, sinopsis, cover HD, dan daftar episode.
- **Stream Extractor**: Mendapatkan URL video asli (MP4/M3U8) dengan *bypass* mekanisme AJAX standar.
- **Built-in UI**: Dokumentasi interaktif untuk menguji endpoint langsung dari browser.

---

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios (dengan kustomisasi Header & User-Agent)
- **Parser**: Cheerio
- **Frontend**: HTML5 + TailwindCSS (via CDN)

---

## 📦 Instalasi & Penggunaan

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda.

### 1. Clone Repositori
```bash
git clone [https://github.com/dramabosid/DramabaBox-Api-Scraping.git](https://github.com/dramabosid/DramabaBox-Api-Scraping.git)
cd dramabox-api
