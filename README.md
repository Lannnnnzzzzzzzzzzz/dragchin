# DramaBox API Scraper

Proyek API tidak resmi yang melakukan pengambilan data (scraping) dari website DramaBox dan menyajikannya kembali dalam format JSON untuk kebutuhan pengembangan.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)
![Express](https://img.shields.io/badge/Express-v5.x-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**DramaBox API Scraper** adalah layanan backend berbasis Node.js yang mengekstraksi data dari situs DramaBox secara *real-time*. Proyek ini menyediakan API JSON untuk pencarian drama, daftar trending, detail episode, hingga ekstraksi URL streaming (m3u8/mp4).

Dilengkapi dengan web interface modern yang siap pakai menggunakan **TailwindCSS**.

---

## 🚀 Fitur Utama

- **Pencarian Drama**: Cari judul drama berdasarkan kata kunci
- **Update Terbaru**: Dapatkan daftar drama yang baru saja diperbarui (mendukung pagination)
- **Top Trending**: Lihat daftar drama yang sedang populer saat ini
- **Detail Lengkap**: Metadata drama, sinopsis, cover HD, dan daftar episode
- **Stream Extractor**: Mendapatkan URL video asli (MP4/M3U8)
- **Web Interface**: Aplikasi web modern untuk menonton drama
- **API Documentation**: Dokumentasi interaktif untuk menguji endpoint

---

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **HTTP Client**: Axios v1.13.2
- **HTML Parser**: Cheerio v1.1.2
- **Frontend**: HTML5 + TailwindCSS + Font Awesome

---

## 📦 Instalasi & Penggunaan

### 1. Clone Repositori
```bash
git clone https://github.com/dramabosid/DramabaBox-Api-Scraping.git
cd dramabook-scrap
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Server
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

---

## 🌐 Akses Aplikasi

Setelah server berjalan, Anda dapat mengakses:

- **Web Interface**: http://localhost:3000/app
- **API Documentation**: http://localhost:3000/

---

## 📡 API Endpoints

### 1. Search Drama
```
GET /api/search?q={keyword}
```

**Parameter:**
- `q` (required): Kata kunci pencarian

**Response:**
```json
{
  "status": "success",
  "query": "CEO",
  "total_results": 10,
  "data": [
    {
      "bookId": "41000122793",
      "judul": "Drama Title",
      "total_episode": "100 Episode",
      "cover": "https://...",
      "url": "https://..."
    }
  ]
}
```

### 2. Latest Updates
```
GET /api/latest?page={number}
```

**Parameter:**
- `page` (optional): Nomor halaman (default: 1)

### 3. Trending Drama
```
GET /api/trending
```

**Response:**
```json
{
  "status": "success",
  "type": "trending",
  "total": 10,
  "data": [
    {
      "rank": 1,
      "bookId": "...",
      "judul": "...",
      "total_episode": "...",
      "cover": "...",
      "url": "..."
    }
  ]
}
```

### 4. Drama Detail
```
GET /api/detail?bookId={id}
```

**Parameter:**
- `bookId` (required): ID drama

**Response:**
```json
{
  "status": "success",
  "bookId": "41000122793",
  "judul": "Drama Title",
  "deskripsi": "Description...",
  "cover": "https://...",
  "total_episode": "100 Episode",
  "jumlah_episode_tersedia": 100,
  "episodes": [
    {
      "episode_index": 1,
      "episode_label": "Episode 1"
    }
  ]
}
```

### 5. Stream Video
```
GET /api/stream?bookId={id}&episode={number}
```

**Parameter:**
- `bookId` (required): ID drama
- `episode` (required): Nomor episode

**Response:**
```json
{
  "status": "success",
  "data": {
    "bookId": "41000122793",
    "episode": 1,
    "video": {
      "mp4": "https://...",
      "m3u8": "https://..."
    }
  }
}
```

---

## ⚠️ Catatan Penting

1. **Website Protection**: DramaBox menggunakan CloudFlare dan proteksi anti-bot. API ini mungkin mengalami rate limiting atau blokir jika terlalu banyak request.

2. **Dynamic Content**: Beberapa konten di DramaBox dimuat secara dinamis menggunakan JavaScript. Scraper ini mungkin tidak dapat mengambil semua data.

3. **Legal Notice**: Proyek ini hanya untuk tujuan edukasi. Penggunaan untuk produksi atau komersial tidak disarankan tanpa izin dari pemilik website.

4. **CORS**: API ini tidak menggunakan CORS middleware, sehingga mungkin perlu konfigurasi tambahan jika diakses dari domain berbeda.

---

## 🔧 Troubleshooting

### 403 Forbidden Error
Jika mendapat error 403, kemungkinan:
- Request diblokir oleh CloudFlare
- Perlu menambahkan delay antar request
- Perlu menggunakan proxy atau VPN

### Empty Results
Jika hasil kosong:
- Selector HTML mungkin berubah
- Perlu update selector di file `server.js`
- Cek apakah website target masih aktif

### Video Not Playing
Jika video tidak bisa diputar:
- URL streaming mungkin memerlukan autentikasi
- Format video tidak didukung browser
- Perlu menggunakan video player library seperti Video.js atau HLS.js

---

## 📝 Development

Untuk development, Anda dapat menggunakan nodemon:

```bash
npm install -g nodemon
nodemon server.js
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat pull request atau buka issue untuk bug report dan feature request.

---

## 📄 License

MIT License - Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

## 👨‍💻 Author

Developed with ❤️ for educational purposes

**Disclaimer**: Proyek ini tidak berafiliasi dengan DramaBox. Gunakan dengan bijak dan bertanggung jawab.
