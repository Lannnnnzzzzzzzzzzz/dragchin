const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = 3001;

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://jtsyiwdsjukvqwggbmal.supabase.co',
    process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0c3lpd2RzanVrdnF3Z2dibWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MzY2MDksImV4cCI6MjA4MjQxMjYwOX0.OjlJxsAcEAYBZxxBKkiIwMUvS58LgI8w11kHEqZz4jY'
);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/api/home', async (req, res) => {
    try {
        const { data: dramas, error } = await supabase
            .from('dramas')
            .select('*')
            .eq('source', 'melongo')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        const { data: trending, error: trendingError } = await supabase
            .from('drama_trending')
            .select('*, dramas(*)')
            .eq('source', 'melongo')
            .order('rank', { ascending: true })
            .limit(10);

        if (trendingError) throw trendingError;

        res.json({
            status: 'success',
            data: {
                latest: dramas.map(d => ({
                    id: d.id,
                    title: d.title,
                    poster: d.poster,
                    rating: d.rating,
                    episodes: d.total_episodes
                })),
                trending: trending.map(t => ({
                    id: t.dramas.id,
                    title: t.dramas.title,
                    poster: t.dramas.poster,
                    rating: t.dramas.rating,
                    rank: t.rank
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch home data',
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
        const limit = 20;
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('dramas')
            .select('*', { count: 'exact' })
            .eq('source', 'melongo')
            .ilike('title', `%${q}%`)
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            status: 'success',
            data: {
                results: data.map(d => ({
                    id: d.id,
                    title: d.title,
                    description: d.description,
                    poster: d.poster,
                    rating: d.rating,
                    episodes: d.total_episodes
                })),
                page: parseInt(page),
                total: count,
                hasMore: count > offset + limit
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to search dramas',
            error: error.message
        });
    }
});

app.get('/api/detail/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data: drama, error } = await supabase
            .from('dramas')
            .select('*')
            .eq('id', id)
            .eq('source', 'melongo')
            .single();

        if (error) throw error;

        const { data: episodes, error: episodesError } = await supabase
            .from('drama_episodes')
            .select('*')
            .eq('drama_id', id)
            .order('episode_number', { ascending: true });

        if (episodesError) throw episodesError;

        res.json({
            status: 'success',
            data: {
                id: drama.id,
                title: drama.title,
                description: drama.description,
                poster: drama.poster,
                rating: drama.rating,
                views: drama.views,
                totalEpisodes: drama.total_episodes,
                year: drama.year,
                genres: drama.genres,
                actors: drama.actors,
                episodes: episodes.map(e => ({
                    number: e.episode_number,
                    title: e.title,
                    thumbnail: e.thumbnail,
                    duration: e.duration
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch drama details',
            error: error.message
        });
    }
});

app.get('/api/episode/:id', async (req, res) => {
    const { id } = req.params;
    const { episode } = req.query;

    if (!episode) {
        return res.status(400).json({
            status: 'error',
            message: 'Parameter episode required'
        });
    }

    try {
        const { data, error } = await supabase
            .from('drama_episodes')
            .select('*, dramas(*)')
            .eq('drama_id', id)
            .eq('episode_number', parseInt(episode))
            .single();

        if (error) throw error;

        res.json({
            status: 'success',
            data: {
                dramaId: data.drama_id,
                dramaTitle: data.dramas.title,
                episode: data.episode_number,
                title: data.title,
                videoUrl: data.video_url,
                thumbnail: data.thumbnail,
                duration: data.duration
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch episode data',
            error: error.message
        });
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('drama_trending')
            .select('*, dramas(*)')
            .eq('source', 'melongo')
            .order('rank', { ascending: true })
            .limit(10);

        if (error) throw error;

        res.json({
            status: 'success',
            data: data.map(t => ({
                id: t.dramas.id,
                title: t.dramas.title,
                description: t.dramas.description,
                poster: t.dramas.poster,
                rating: t.dramas.rating,
                views: t.dramas.views,
                rank: t.rank
            }))
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch trending dramas',
            error: error.message
        });
    }
});

app.get('/api/latest', async (req, res) => {
    const { page = 1 } = req.query;

    try {
        const limit = 20;
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('dramas')
            .select('*', { count: 'exact' })
            .eq('source', 'melongo')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            status: 'success',
            data: {
                dramas: data.map(d => ({
                    id: d.id,
                    title: d.title,
                    description: d.description,
                    poster: d.poster,
                    rating: d.rating,
                    episodes: d.total_episodes
                })),
                page: parseInt(page),
                total: count,
                hasMore: count > offset + limit
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch latest dramas',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Melongo API Server berjalan di http://localhost:${PORT}`);
    console.log(`Web App: http://localhost:${PORT}/app`);
    console.log(`API Docs: http://localhost:${PORT}/`);
    console.log(`Using Supabase database for data storage`);
});
