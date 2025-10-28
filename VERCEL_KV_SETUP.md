# Configuration Vercel KV pour les Highscores

## Pourquoi Vercel KV?

Le système de fichiers sur Vercel est éphémère - les données sont perdues à chaque redéploiement. Vercel KV (Redis) permet un stockage persistant gratuit jusqu'à 256MB.

## Configuration

### 1. Créer un KV Database sur Vercel

```bash
# Via CLI
vercel kv create birthday-highscores

# Ou via le dashboard Vercel:
# https://vercel.com/dashboard/stores
# → Create Database → KV
# → Nommer: birthday-highscores
```

### 2. Lier le KV au projet

```bash
# Via CLI
vercel link
vercel env pull

# Ou via le dashboard:
# Project Settings → Storage → Connect Store
# → Sélectionner birthday-highscores
```

### 3. Variables d'environnement

Les variables suivantes seront automatiquement ajoutées:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_URL`

## Fonctionnement

### Local (dev)
- Utilise le stockage fichier dans `/data/*.json`
- Pas besoin de KV configuré
- Les scores sont sauvegardés localement

### Production (Vercel)
- Utilise automatiquement Vercel KV si configuré
- Stockage persistant Redis
- Les scores survivent aux redéploiements

## Structure des données

```javascript
// Clés KV:
leaderboard:local  → [] // Top 3 scores localhost
leaderboard:prod   → [] // Top 3 scores production

// Format des scores:
[
  { score: 100, name: "Player1" },
  { score: 85, name: "Player2" },
  { score: 70, name: "Player3" }
]
```

## Vérification

```bash
# Tester localement
curl http://localhost:3000/api/highscore

# Tester en prod
curl https://your-app.vercel.app/api/highscore
```
