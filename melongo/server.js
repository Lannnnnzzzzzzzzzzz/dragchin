const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3001;

const BASE_URL = 'https://melolo.kangprah.web.id';

const getHeaders = () => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': BASE_URL,
    'Origin': BASE_URL
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/api/home', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/home`, {
            headers: getHeaders()
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil data home',
            error: error.message
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
        const response = await axios.get(`${BASE_URL}/api/search`, {
            params: { q, page },
            headers: getHeaders()
        });
        res.json(response.data);
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
        const response = await axios.get(`${BASE_URL}/api/detail/${id}`, {
            headers: getHeaders()
        });
        res.json(response.data);
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
        const response = await axios.get(`${BASE_URL}/api/episode/${id}`, {
            params: { episode },
            headers: getHeaders()
        });
        res.json(response.data);
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
        const response = await axios.get(`${BASE_URL}/api/trending`, {
            headers: getHeaders()
        });
        res.json(response.data);
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
        const response = await axios.get(`${BASE_URL}/api/latest`, {
            params: { page },
            headers: getHeaders()
        });
        res.json(response.data);
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
});
