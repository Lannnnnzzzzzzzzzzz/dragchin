# Panduan Menjalankan Semua Project

Project ini terdiri dari 3 bagian:
1. **DramaBox Original** - Port 3000
2. **Melongo** - Port 3001
3. **DramaboRox** - Port 3002

## 📦 Install Dependencies

Jalankan perintah ini di setiap folder:

```bash
# Install untuk project utama (DramaBox Original)
cd /tmp/cc-agent/61926704/project
npm install

# Install untuk Melongo
cd melongo
npm install

# Install untuk DramaboRox
cd ../dramaraborox
npm install
```

## 🚀 Menjalankan Server

### Option 1: Manual (Terminal Terpisah)

**Terminal 1 - DramaBox Original:**
```bash
cd /tmp/cc-agent/61926704/project
npm start
```
Akses: http://localhost:3000

**Terminal 2 - Melongo:**
```bash
cd /tmp/cc-agent/61926704/project/melongo
npm start
```
Akses: http://localhost:3001

**Terminal 3 - DramaboRox:**
```bash
cd /tmp/cc-agent/61926704/project/dramaraborox
npm start
```
Akses: http://localhost:3002

### Option 2: Background Process

```bash
# Dari root project
cd /tmp/cc-agent/61926704/project

# Start DramaBox Original
node server.js > logs/dramabox.log 2>&1 &

# Start Melongo
cd melongo && node server.js > ../logs/melongo.log 2>&1 &

# Start DramaboRox
cd ../dramaraborox && node server.js > ../logs/dramaraborox.log 2>&1 &
```

## 📱 Akses Aplikasi

### DramaBox Original (Port 3000)
- Web App: http://localhost:3000/app
- API Docs: http://localhost:3000/

### Melongo (Port 3001)
- Web App: http://localhost:3001/app
- API Docs: http://localhost:3001/

### DramaboRox (Port 3002)
- Web App: http://localhost:3002/app
- API Docs: http://localhost:3002/

## 🛑 Stop All Servers

```bash
# Kill semua node process
pkill -f "node server.js"

# Atau kill by port
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill
lsof -ti:3002 | xargs kill
```

## 🔧 Troubleshooting

### Port Already in Use
Jika port sudah digunakan, edit file server.js di masing-masing folder dan ubah PORT

### API Not Working
- Pastikan website sumber (melolo.kangprah.web.id dan dramabox.kangprah.web.id) dapat diakses
- Cek koneksi internet
- Website mungkin menggunakan proteksi yang memblokir request

### Empty Response
- Endpoint API di website sumber mungkin berbeda
- Cek struktur response dari website asli
- Update endpoint di server.js sesuai dengan API aktual
