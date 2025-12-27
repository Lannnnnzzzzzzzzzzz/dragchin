# Testing Guide - DramaBox API

## Cara Menjalankan Server

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

---

## Testing Manual dengan cURL

### 1. Test Latest Endpoint
```bash
curl "http://localhost:3000/api/latest?page=1"
```

### 2. Test Trending Endpoint
```bash
curl "http://localhost:3000/api/trending"
```

### 3. Test Search Endpoint
```bash
curl "http://localhost:3000/api/search?q=CEO"
```

### 4. Test Detail Endpoint
```bash
curl "http://localhost:3000/api/detail?bookId=41000122793"
```

### 5. Test Stream Endpoint
```bash
curl "http://localhost:3000/api/stream?bookId=41000122793&episode=1"
```

---

## Testing via Browser

### API Documentation (Built-in Test Interface)
```
http://localhost:3000/
```

### Web Application (User Interface)
```
http://localhost:3000/app
```

---

## Expected Responses

### Success Response
```json
{
  "status": "success",
  "data": [...]
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "error": "Technical error message"
}
```

---

## Common Issues

### 403 Forbidden
Website DramaBox menggunakan CloudFlare protection. Jika mendapat error 403:
- Coba tambahkan delay antar request
- Gunakan proxy atau VPN
- Update User-Agent di `server.js`

### Empty Data
Jika API mengembalikan data kosong:
- Website target mungkin mengubah struktur HTML
- Perlu update selector di `server.js`
- Cek koneksi internet

### CORS Error (jika diakses dari domain lain)
Tambahkan CORS middleware di `server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

---

## Testing Checklist

- [ ] Server bisa dijalankan tanpa error
- [ ] Endpoint `/api/latest` mengembalikan data
- [ ] Endpoint `/api/trending` mengembalikan data
- [ ] Endpoint `/api/search` bisa mencari dengan keyword
- [ ] Endpoint `/api/detail` mengembalikan detail drama
- [ ] Endpoint `/api/stream` mengembalikan URL video
- [ ] Web interface di `/app` bisa diakses
- [ ] API documentation di `/` bisa diakses

---

## Notes

1. Karena DramaBox menggunakan proteksi CloudFlare, beberapa request mungkin diblokir
2. Selector HTML mungkin perlu di-update sesuai perubahan website
3. API ini untuk tujuan edukasi, gunakan dengan bijak
4. Rate limiting disarankan untuk produksi
