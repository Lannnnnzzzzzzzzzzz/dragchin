# Melongo App

API Proxy dan Web Interface untuk melolo.kangprah.web.id

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Server
```bash
npm start
```

Server akan berjalan di `http://localhost:3001`

## 🌐 Akses

- **Web App**: http://localhost:3001/app
- **API Docs**: http://localhost:3001/

## 📡 API Endpoints

Semua endpoint adalah proxy ke `https://melolo.kangprah.web.id/api/*`

- `GET /api/home` - Homepage data
- `GET /api/search?q={query}&page={page}` - Search content
- `GET /api/trending` - Trending content
- `GET /api/latest?page={page}` - Latest content
- `GET /api/detail/:id` - Content detail
- `GET /api/episode/:id?episode={number}` - Episode video URL

## 📝 Notes

- Port default: 3001
- Semua request di-proxy ke website asli dengan headers yang sesuai
- Mendukung CORS untuk integrasi frontend
