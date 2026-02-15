# LemmeCook

## Autrice du MD
Camille (Claude)

## Lancement du projet
### 1. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```env
# MongoDB Credentials
MONGODB_INITDB_ROOT_USERNAME=admin
MONGODB_INITDB_ROOT_PASSWORD=password
MONGO_PORT=27017

# JWT Configuration
JWT_SECRET=your-secret-key-here
```

### 2. Lancer l'application

```powershell
# Démarrer tous les services
docker-compose up -d

# Vérifier les services
docker ps

# Accéder à l'application
# Frontend: http://localhost:5173
# Auth API: http://localhost:3000
# Cooking API: http://localhost:3001
# MongoDB Admin: http://localhost:8081
```

### 3. Arrêter l'application

```powershell
docker-compose down
```

### 4. Reconstruire après modifications

```powershell
docker-compose up --build -d
```

---



## Architecture

j'ai bossé sur deux services :
- **Auth Service** : Gestion de l'authentification
- **Cooking Service** : Logique du jeu

---

## Auth Service

### Description
Service simple d'authentification avec login/signup.

### Structure
```
auth-service/
├── src/
│   ├── models/
│   │   └── User.ts          # Modèle utilisateur + connexion DB
│   ├── middleware/
│   │   └── auth.ts          # Vérification du token JWT
│   ├── controllers/
│   │   └── authController.ts
│   ├── routes/
│   │   └── auth.ts
│   └── index.ts             # Routes login/signup
```

### Fonctionnalités
- Inscription (`sign-up`)
- Connexion (`sign-in`)
- Génération de tokens JWT
- Création automatique du joueur dans Cooking Service

---

## Cooking Service

### Description
Service principal gérant toute la logique du gameplay.

### Structure
```
cooking-service/
├── src/
│   ├── models/
│   │   ├── Ingredient.ts
│   │   ├── Recipe.ts
│   │   ├── Player.ts
│   │   ├── Save.ts
│   │   └── Order.ts
│   ├── controllers/
│   │   ├── controllerIngredients.ts
│   │   ├── controllerRecipes.ts
│   │   ├── controllerPlayers.ts
│   │   ├── controllerSaves.ts
│   │   └── controllerOrders.ts
│   ├── routes/
│   │   ├── ingredient.ts
│   │   ├── recipe.ts
│   │   ├── player.ts
│   │   └── save.ts
│   ├── websocket/
│   │   └── commandServer.ts
│   ├── services/
│   │   └── orderService.ts
│   └── index.ts
```

### Authentification
- **Toutes les routes sont protégées** sauf `POST /players` (création de joueur par Auth Service)
- Utilise le même secret JWT que Auth Service pour vérifier les tokens

### Fonctionnalités principales

#### 📦 Ingrédients
- Liste de tous les ingrédients disponibles
- Détails d'un ingrédient

#### 📖 Recettes
- Liste de toutes les recettes (livre de recettes)
- Filtrage des recettes selon les ingrédients du pot
- Vérification de correspondance exacte (déblocage de recette)
- Détails d'une recette

#### 👤 Joueurs
- Création de joueur (appelé par Auth Service)
- Gestion de l'inventaire d'ingrédients
- Recettes débloquées
- Wallet

#### 💾 Sauvegardes
- **Système de slots** : Plusieurs sauvegardes par utilisateur
- Chaque sauvegarde = Un joueur distinct
- Contient :
  - Recettes débloquées
  - Inventaire d'ingrédients
  - Wallet
  - Progression
- Les IDs des sauvegardes sont stockés en base

#### 📋 Commandes (temps réel via WebSocket)
- Génération aléatoire de commandes parmi les recettes
- Envoi en temps réel au joueur connecté
- Intervalle : 15 secondes (configurable)
- Prix de vente défini par le joueur

### Monétisation (en cours)
- **Price to make** = Somme des prix des ingrédients (affiché dans le livre)
- **Price to sell** = Défini par le joueur
- *(Idée future : Système de satisfaction client avec niveaux d'exigence et scores basés sur le temps)*

---

## Technologies

- **Backend** : Hono (TypeScript)
- **Base de données** : MongoDB
- **Authentification** : JWT (jsonwebtoken)
- **Temps réel** : WebSocket (ws)
- **Hash passwords** : bcryptjs

---

## Routes API

### Auth Service (port 3000)
```
POST /api/auth/sign-up     # Inscription
POST /api/auth/sign-in     # Connexion
GET  /api/auth/me          # Info utilisateur connecté
```

### Cooking Service (port 3001)
```
# Recettes
GET  /api/recipes
GET  /api/recipes/:id
GET  /api/recipes/filter-by-pot
POST /api/recipes/check-exact-match

# Ingrédients
GET  /api/ingredients
GET  /api/ingredients/:id

# Joueurs (protégé)
POST /api/players                    # Création (public, pour Auth Service)
GET  /api/players/recipes            # Mes recettes débloquées
GET  /api/players/ingredients        # Mon inventaire
GET  /api/players/wallet             # Mon wallet
POST /api/players/update-ingredients
POST /api/players/update-wallet

# Sauvegardes (protégé)
GET  /api/saves                      # Toutes mes sauvegardes
GET  /api/saves/slot/:slotNumber     # Une sauvegarde spécifique
POST /api/saves                      # Créer une sauvegarde

# WebSocket
ws://localhost:3001/ws               # Connexion temps réel pour les commandes
```

---

## Notes techniques

- **Refactoring en cours** : Code fonctionnel mais pas optimal
- **Priorité** : Fonctionnalité avant optimisation
- **WebSocket** : Utilisé pour l'envoi des commandes aléatoires en temps réel
- **Séparation des concerns** : Auth et Gameplay dans des services distincts pour la scalabilité