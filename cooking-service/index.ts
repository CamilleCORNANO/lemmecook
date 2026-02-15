import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { connectDB } from './src/database.js'

// Import des routes
import recipeRoutes from './src/routes/recipesRouter.js'
import ingredientRoutes from './src/routes/ingredientsRouter.js'
import playerRoutes from './src/routes/playerRouter.js'
import saveRoutes from './src/routes/savesRouter.js'

const app = new Hono()

// CORS
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
app.use('*', cors({
  origin: corsOrigins,
  credentials: true,
}))

// Route de base
app.get('/', (c) => c.json({ message: 'Cooking Service OK' }))

// Montage des routes
app.route('/api/recipes', recipeRoutes)
app.route('/api/ingredients', ingredientRoutes)
app.route('/api/players', playerRoutes)
app.route('/api/saves', saveRoutes)

const port = 3001

async function startServer() {
  try {
    await connectDB()
    
    // Démarre le serveur
    serve({ fetch: app.fetch, port }, (info) => {
      console.log(`✅ Serveur sur http://localhost:${info.port}`)
    })
  } catch (error) {
    console.error('Erreur au démarrage:', error)
    process.exit(1)
  }
}

startServer()
