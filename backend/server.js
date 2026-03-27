

import express  from 'express';
import cors     from 'cors';
import dotenv   from 'dotenv';
import path     from 'path';
import { fileURLToPath } from 'url';

import authRoutes         from './routes/authRoutes.js';
import eventRoutes        from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';

// ── Load environment variables ──
dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── __dirname equivalent for ES Modules ──
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Serve Frontend Static Files ──
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ──
app.use('/api/auth',           authRoutes);
app.use('/api/events',         eventRoutes);
app.use('/api',                registrationRoutes);

// ── Catch-all: serve index.html for any non-API route ──
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// ── Start Server ──
app.listen(PORT, () => {
    console.log(`\n🚀 CampusConnect server running at http://localhost:${PORT}\n`);
});
