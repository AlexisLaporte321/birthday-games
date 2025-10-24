const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory storage for world record (simple backend)
let worldRecord = {
    score: 0,
    name: ''
};

// Servir les fichiers statiques depuis public/
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// API: Get world record
app.get('/api/highscore', (req, res) => {
    res.json({ worldRecord });
});

// API: Submit new score
app.post('/api/highscore', (req, res) => {
    const { score, name } = req.body;
    if (typeof score === 'number' && score > worldRecord.score) {
        worldRecord = {
            score,
            name: name || 'Anonymous'
        };
        res.json({ worldRecord, newRecord: true });
    } else {
        res.json({ worldRecord, newRecord: false });
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
