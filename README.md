# Lemmecook

A full-stack cooking game application with microservices architecture using Node.js, TypeScript, React, and MongoDB.

## 📋 Project Structure

```
lemmecook/
├── auth-service/          # Authentication service (port 3000)
├── cooking-service/       # Cooking game logic service (port 3001)
├── front/                 # React frontend (port 5173)
├── docker-compose.yml     # Docker orchestration
└── .env                   # Environment variables
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** - Required for running the entire application
- **Node.js 20+** and **npm** (optional, for local development)
- **.env file** with required environment variables (see below)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Credentials
MONGODB_INITDB_ROOT_USERNAME=admin
MONGODB_INITDB_ROOT_PASSWORD=password
MONGO_PORT=27017

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Service Ports
# These are automatically mapped in docker-compose.yml
```

### Launch with Docker (Recommended)

#### 1. Start All Services

```powershell
docker-compose up -d
```

This will:
- Create a MongoDB database (port 27017)
- Start the Auth Service (port 3000)
- Start the Cooking Service (port 3001)
- Start the Frontend (port 5173)
- Start Mongo Express (port 8081)

#### 2. Check Service Status

```powershell
docker ps
```

#### 3. View Service Logs

```powershell
# Auth Service
docker logs lemmecook-auth-service-1 -f

# Cooking Service
docker logs lemmecook-cooking-service-1 -f

# Frontend
docker logs lemmecook-front-1 -f

# MongoDB
docker logs lemmecook-mongodb-1 -f
```

#### 4. Stop All Services

```powershell
docker-compose down
```

#### 5. Rebuild Services (after code changes)

```powershell
docker-compose up --build -d
```

## 🌐 Access the Application

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Main game application |
| **Auth Service** | http://localhost:3000 | Authentication API |
| **Cooking Service** | http://localhost:3001 | Game logic API |
| **Mongo Express** | http://localhost:8081 | MongoDB Admin UI |

## 🏗️ Architecture

### Services Overview

#### Auth Service (Port 3000)
- User authentication and JWT token generation
- User registration and login
- Protected endpoints verification
- **Tech Stack**: Hono.js, MongoDB, JWT, bcrypt

#### Cooking Service (Port 3001)
- Game logic and recipe management
- Ingredient and player data management
- Save game functionality
- WebSocket support for real-time updates
- **Tech Stack**: Hono.js, MongoDB, WebSocket

#### Frontend (Port 5173)
- React-based game interface
- Pixi.js for graphics rendering
- Real-time game updates
- **Tech Stack**: React, TypeScript, Vite, Pixi.js

#### MongoDB (Port 27017)
- Central database for all services
- Authentication enabled
- Mongo Express admin panel available at port 8081

## 🔧 Local Development (Without Docker)

### Prerequisites
- Node.js 20+
- npm or pnpm
- MongoDB running locally

### Auth Service

```powershell
cd auth-service
npm install
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Cooking Service

```powershell
cd cooking-service
npm install
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Frontend

```powershell
cd front
npm install       # or pnpm install
npm run dev       # Development server with hot reload
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## 📝 Configuration

### Environment Variables

The `.env` file must contain:

```env
# MongoDB
MONGODB_INITDB_ROOT_USERNAME=admin
MONGODB_INITDB_ROOT_PASSWORD=password
MONGO_PORT=27017

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional: Custom MongoDB database name
MONGO_DB=lemmecook
```

### Service Environment Variables

Services receive these variables from docker-compose:

**Auth Service:**
- `MONGODB_URI` - MongoDB connection string with authentication
- `JWT_SECRET` - Secret key for JWT tokens
- `CORS_ORIGINS` - Allowed CORS origins

**Cooking Service:**
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGINS` - Allowed CORS origins

**Frontend:**
- `VITE_API_URL` - Auth service URL (http://localhost:3000)
- `VITE_COOKING_API_URL` - Cooking service URL (http://localhost:3001)

## 🐛 Troubleshooting

### Services Can't Connect to MongoDB

**Problem**: `MongoServerSelectionError: getaddrinfo ENOTFOUND mongodb`

**Solution**:
```powershell
# Ensure all services are on the same network
docker-compose down
docker-compose up -d
```

### Port Already in Use

**Problem**: Port 3000, 3001, 5173, or 27017 already in use

**Solution**: Modify `docker-compose.yml` to use different ports:
```yaml
ports:
  - "3000:3000"  # Change first number to a free port
```

### Font Not Loading in Frontend

**Problem**: Custom font (Daydream DEMO.otf) not displaying

**Solution**: Ensure public folder is copied in Docker image:
- Check `front/Dockerfile` includes `COPY public ./public`
- Rebuild: `docker-compose up --build -d front`

### Services Exit Immediately

**Check logs**:
```powershell
docker logs <container-name>
```

**Common issues**:
- Missing environment variables in `.env`
- Database not healthy yet (MongoDB takes time to start)
- Port conflicts

## 📦 Building Production Images

### Build All Services

```powershell
docker-compose build
```

### Push to Registry

```powershell
docker tag lemmecook-auth-service:latest myregistry/lemmecook-auth-service:latest
docker push myregistry/lemmecook-auth-service:latest
```

## 🔌 API Endpoints

### Auth Service (http://localhost:3000)

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/protected` - Protected endpoint test

### Cooking Service (http://localhost:3001)

- `GET /api/recipes` - Get all recipes
- `GET /api/ingredients` - Get all ingredients
- `GET /api/players` - Get player data
- `GET /api/saves` - Get saved games
- WebSocket: `ws://localhost:3001/ws` - Real-time updates

## 🎮 Game Features

- **Recipe Discovery**: Browse and unlock recipes
- **Ingredient Management**: Collect and use ingredients
- **Cooking Mechanics**: Combine ingredients in a pot
- **Save System**: Multiple save slots
- **Player Progression**: Level up and unlock new content
- **Real-time Updates**: WebSocket-based game updates

## 📚 Technology Stack

**Backend**:
- Hono.js - Lightweight web framework
- MongoDB - NoSQL database
- TypeScript - Type-safe JavaScript
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- ws - WebSocket support

**Frontend**:
- React 19 - UI library
- TypeScript - Type safety
- Vite - Fast build tool
- Pixi.js - 2D rendering engine
- React Pixi - React bindings for Pixi

**DevOps**:
- Docker & Docker Compose - Containerization
- Node.js 20-alpine - Lightweight runtime

## 📄 License

[Add your license information here]

## 👥 Contributors

[Add contributors information here]