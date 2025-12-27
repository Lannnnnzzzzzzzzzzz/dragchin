const express = require('express');
const path = require('path');
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const app = express();
const PORT = 3001;

const BASE_URL = 'https://melolo.kangprah.web.id';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const getHeaders = () => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': BASE_URL,
    'Origin': BASE_URL,
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
});

async function fetchWithRetry(url, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await new Promise(resolve => setTimeout(resolve, delay));

            const response = await client.get(url, {
                headers: getHeaders(),
                timeout: 30000,
                maxRedirects: 5,
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });

            if (response.status === 429) {
                console.log(`Rate limited, retry ${i + 1}/${retries}...`);
                delay *= 2;
                continue;
            }

            return response.data;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Error on attempt ${i + 1}, retrying...`);
            delay *= 2;
        }
    }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/api/home', async (req, res) => {
    try {
        const data = await fetchWithRetry(`${BASE_URL}/api/home`);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil data home',
            error: error.message,
            note: 'Website menggunakan proteksi Vercel yang ketat. Silakan akses website langsung untuk mendapatkan data.'
        });
    }
});

app.get('/api/search', async (req, res) => {
    const { q, page = 1 } = req.query;

    if (!q) {
        return res.status(400).json({
            status: 'error',
            message: 'Parameter q required'
        });
    }

    try {
        const data = await fetchWithRetry(`${BASE_URL}/api/search?q=${encodeURIComponent(q)}&page=${page}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal melakukan pencarian',
            error: error.message
        });
    }
});

app.get('/api/detail/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const data = await fetchWithRetry(`${BASE_URL}/api/detail/${id}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil detail',
            error: error.message
        });
    }
});

app.get('/api/episode/:id', async (req, res) => {
    const { id } = req.params;
    const { episode } = req.query;

    try {
        const data = await fetchWithRetry(`${BASE_URL}/api/episode/${id}?episode=${episode}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil episode',
            error: error.message
        });
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const data = await fetchWithRetry(`${BASE_URL}/api/trending`);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil trending',
            error: error.message
        });
    }
});

app.get('/api/latest', async (req, res) => {
    const { page = 1 } = req.query;

    try {
        const data = await fetchWithRetry(`${BASE_URL}/api/latest?page=${page}`);
        res.json(data);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil latest',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Melongo API Server berjalan di http://localhost:${PORT}`);
    console.log(`Web App: http://localhost:${PORT}/app`);
    console.log(`API Docs: http://localhost:${PORT}/`);
});
