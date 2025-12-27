# DramaboRox App

API Proxy dan Web Interface untuk dramabox.kangprah.web.id

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Server
```bash
npm start
```

Server akan berjalan di `http://localhost:3002`

## 🌐 Akses

- **Web App**: http://localhost:3002/app
- **API Docs**: http://localhost:3002/

## 📡 API Endpoints

Semua endpoint adalah proxy ke `https://dramabox.kangprah.web.id/api/*`

- `GET /api/home` - Homepage data
- `GET /api/search?q={query}&page={page}` - Search drama
- `GET /api/trending` - Trending dramas
- `GET /api/latest?page={page}` - Latest dramas
- `GET /api/detail/:id` - Drama detail
- `GET /api/episode/:id?episode={number}` - Episode video URL

## 📝 Notes

- Port default: 3002
- Semua request di-proxy ke website asli dengan headers yang sesuai
- Mendukung CORS untuk integrasi frontend
