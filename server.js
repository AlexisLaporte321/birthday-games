require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { neon } = require('@neondatabase/serverless');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Neon database
let sql = null;
let useDB = false;
try {
    if (process.env.DATABASE_URL) {
        sql = neon(process.env.DATABASE_URL);
        useDB = true;
        console.log('Using Neon PostgreSQL for leaderboard storage');

        // Initialize database schema
        (async () => {
            try {
                await sql`
                    CREATE TABLE IF NOT EXISTS highscores (
                        id SERIAL PRIMARY KEY,
                        environment TEXT NOT NULL,
                        score INTEGER NOT NULL,
                        name TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;
                console.log('Database schema initialized');
            } catch (error) {
                console.error('Error initializing database schema:', error);
            }
        })();
    } else {
        console.log('Using in-memory storage for leaderboard (local dev)');
    }
} catch (e) {
    console.error('Error initializing Neon:', e);
    console.log('Using in-memory storage for leaderboard');
}

// Middleware
app.use(express.json());

// Persistent storage paths
const LEADERBOARD_DIR = path.join(__dirname, 'data');
const LEADERBOARD_LOCAL_FILE = path.join(LEADERBOARD_DIR, 'leaderboard-local.json');
const LEADERBOARD_PROD_FILE = path.join(LEADERBOARD_DIR, 'leaderboard-prod.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(LEADERBOARD_DIR)) {
    fs.mkdirSync(LEADERBOARD_DIR, { recursive: true });
}

// Load leaderboards from files
function loadLeaderboard(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`Error loading leaderboard from ${filePath}:`, error);
    }
    return [];
}

// Save leaderboard to file
function saveLeaderboard(filePath, leaderboard) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(leaderboard, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error saving leaderboard to ${filePath}:`, error);
    }
}

// Load initial leaderboards
let leaderboardLocal = loadLeaderboard(LEADERBOARD_LOCAL_FILE);
let leaderboardProd = loadLeaderboard(LEADERBOARD_PROD_FILE);

// Helper to determine if request is from localhost
function isLocalhost(req) {
    const host = req.get('host') || '';
    return host.includes('localhost') || host.includes('127.0.0.1');
}

// Servir les fichiers statiques depuis public/
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// API: Get leaderboard (auto-detects local vs prod)
app.get('/api/highscore', async (req, res) => {
    try {
        const isLocal = isLocalhost(req);
        const environment = isLocal ? 'local' : 'prod';
        let leaderboard;

        if (useDB) {
            // Use Neon database
            const rows = await sql`
                SELECT score, name
                FROM highscores
                WHERE environment = ${environment}
                ORDER BY score DESC
                LIMIT 3
            `;
            leaderboard = rows;
        } else {
            // Use file storage fallback
            leaderboard = isLocal ? leaderboardLocal : leaderboardProd;
        }

        res.json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.json({ leaderboard: [] });
    }
});

// API: Submit new score (auto-detects local vs prod)
app.post('/api/highscore', async (req, res) => {
    try {
        const { score, name } = req.body;
        const isLocal = isLocalhost(req);
        const environment = isLocal ? 'local' : 'prod';
        let leaderboard;
        let isTopScore = false;

        if (typeof score === 'number' && score > 0) {
            if (useDB) {
                // Insert new score into database
                await sql`
                    INSERT INTO highscores (environment, score, name)
                    VALUES (${environment}, ${score}, ${name || 'Anonymous'})
                `;

                // Get top 3 scores for this environment
                const rows = await sql`
                    SELECT score, name
                    FROM highscores
                    WHERE environment = ${environment}
                    ORDER BY score DESC
                    LIMIT 3
                `;
                leaderboard = rows;

                // Check if new score made it to top 3
                isTopScore = leaderboard.some(entry => entry.score === score && entry.name === (name || 'Anonymous'));
            } else {
                // Use file storage fallback
                leaderboard = isLocal ? [...leaderboardLocal] : [...leaderboardProd];

                leaderboard.push({
                    score,
                    name: name || 'Anonymous'
                });

                leaderboard.sort((a, b) => b.score - a.score);
                leaderboard = leaderboard.slice(0, 3);

                if (isLocal) {
                    leaderboardLocal = leaderboard;
                    saveLeaderboard(LEADERBOARD_LOCAL_FILE, leaderboard);
                } else {
                    leaderboardProd = leaderboard;
                    saveLeaderboard(LEADERBOARD_PROD_FILE, leaderboard);
                }

                isTopScore = leaderboard.some(entry => entry.score === score && entry.name === (name || 'Anonymous'));
            }

            res.json({ leaderboard, newRecord: isTopScore });
        } else {
            // Invalid score, just return current leaderboard
            if (useDB) {
                const rows = await sql`
                    SELECT score, name
                    FROM highscores
                    WHERE environment = ${environment}
                    ORDER BY score DESC
                    LIMIT 3
                `;
                leaderboard = rows;
            } else {
                leaderboard = isLocal ? leaderboardLocal : leaderboardProd;
            }
            res.json({ leaderboard, newRecord: false });
        }
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour le jeu de Maxime
app.get('/maxime', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'maxime', 'index.html'));
});

// Route pour le jeu de Katerina
app.get('/katerina', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'katerina', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
