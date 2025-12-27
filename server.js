const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const app = express();
const PORT = 3000;

const BASE_URL   = 'https://www.dramabox.com';
const SEARCH_URL = 'https://www.dramabox.com/id/search';
const DETAIL_URL = 'https://www.dramabox.com/id/watch';

const getHeaders = () => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'max-age=0'
});

const extractBookId = (url) => {
    if (!url) return null;
    try {
        const fullUrl = url.startsWith('http') ? url : `http://dummy.com/${url}`;
        const urlParams = new URLSearchParams(new URL(fullUrl).search);
        return urlParams.get('bookId');
    } catch (e) {
        return null;
    }
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/api/search', async (req, res) => {
    const query = req.query.q;

    if (!query) return res.status(400).json({ error: 'Parameter q required' });

    try {
        const response = await axios.get(SEARCH_URL, {
            params: { q: query },
            headers: getHeaders()
        });

        const $ = cheerio.load(response.data);
        const searchResults = [];

        $('a.relative.group').each((index, element) => {
            const linkHref = $(element).attr('href');
            const title = $(element).find('h3').first().text().trim();
            const cover = $(element).find('img').attr('src');
            const episodeText = $(element).find('.text-xs.text-gray-500').text().trim();

            if (title && linkHref) {
                searchResults.push({
                    bookId: extractBookId(linkHref),
                    judul: title,
                    total_episode: episodeText,
                    cover: cover,
                    url: `${BASE_URL}${linkHref}`
                });
            }
        });

        res.json({
            status: 'success',
            query,
            total_results: searchResults.length,
            data: searchResults
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/latest', async (req, res) => {
    const page = req.query.page || 1;

    try {
        const response = await axios.get(`${BASE_URL}/id`, {
            params: { page },
            headers: getHeaders()
        });

        const $ = cheerio.load(response.data);
        const dramas = [];

        $('a.relative.group').each((index, element) => {
            const linkHref = $(element).attr('href');
            const title = $(element).find('h3').first().text().trim();
            const cover = $(element).find('img').attr('src');
            const episodeText = $(element).find('.text-xs.text-gray-500').text().trim();

            if (title && linkHref) {
                dramas.push({
                    bookId: extractBookId(linkHref),
                    judul: title,
                    total_episode: episodeText,
                    cover: cover,
                    url: `${BASE_URL}${linkHref}`
                });
            }
        });

        res.json({
            status: 'success',
            type: 'latest',
            page: parseInt(page),
            total: dramas.length,
            data: dramas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/id`, {
            headers: getHeaders()
        });

        const $ = cheerio.load(response.data);
        const trendingDramas = [];

        $('a.relative.group').slice(0, 10).each((index, element) => {
            const linkHref = $(element).attr('href');
            const title = $(element).find('h3').first().text().trim();
            const cover = $(element).find('img').attr('src');
            const episodeText = $(element).find('.text-xs.text-gray-500').text().trim();

            if (title && linkHref) {
                trendingDramas.push({
                    rank: index + 1,
                    bookId: extractBookId(linkHref),
                    judul: title,
                    total_episode: episodeText,
                    cover: cover,
                    url: `${BASE_URL}${linkHref}`
                });
            }
        });

        res.json({
            status: 'success',
            type: 'trending',
            total: trendingDramas.length,
            data: trendingDramas
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/detail', async (req, res) => {
    const bookId = req.query.bookId;

    if (!bookId) return res.status(400).json({ status: 'error', message: 'Parameter bookId wajib diisi.' });

    try {
        const response = await axios.get(DETAIL_URL, {
            params: { bookId },
            headers: getHeaders()
        });

        const $ = cheerio.load(response.data);

        const title = $('h1').first().text().trim();
        const description = $('p.line-clamp-3').text().trim() || $('div.text-sm').first().text().trim();
        const cover = $('img.w-full').first().attr('src') || $('img').first().attr('src');
        const totalEpisodeText = $('span').filter((i, el) => $(el).text().includes('Episode')).first().text().trim();

        const episodes = [];
        $('button[data-episode], a[href*="episode"]').each((index, element) => {
            const epNum = $(element).attr('data-episode') || (index + 1);
            const label = $(element).text().trim() || `Episode ${epNum}`;
            episodes.push({
                episode_index: parseInt(epNum),
                episode_label: label,
            });
        });

        res.json({
            status: 'success',
            bookId: bookId,
            judul: title,
            deskripsi: description,
            cover: cover,
            total_episode: totalEpisodeText,
            jumlah_episode_tersedia: episodes.length,
            episodes: episodes
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Gagal mengambil detail drama', error: error.message });
    }
});

app.get('/api/stream', async (req, res) => {
    const { bookId, episode } = req.query;

    if (!bookId || !episode) {
        return res.status(400).json({
            status: 'error',
            message: 'Parameter bookId dan episode wajib diisi.'
        });
    }

    try {
        const headers = {
            ...getHeaders(),
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': `${DETAIL_URL}?bookId=${bookId}`
        };

        const response = await axios.get(`${BASE_URL}/api/video`, {
            params: {
                bookId: bookId,
                episode: episode
            },
            headers: headers
        });

        const rawData = response.data;

        if (!rawData || (!rawData.video && !rawData.url)) {
            return res.status(404).json({
                status: 'error',
                message: 'Episode tidak ditemukan atau terkunci.'
            });
        }

        const formattedResult = {
            status: "success",
            data: {
                bookId: bookId.toString(),
                episode: parseInt(episode),
                video: rawData.video || rawData.url || rawData
            }
        };

        res.json(formattedResult);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil stream',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
