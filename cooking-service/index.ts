import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { connectDB } from './database.ts'

// Import des routes
import recipeRoutes from './routes/recipesRoutes'
import ingredientRoutes from './routes/ingredientsRoutes'
import playerRoutes from './routes/playerRoutes'
import saveRoutes from './routes/savesRoutes'

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
  await connectDB()
  
  // Crée le serveur avec l'adaptateur Hono
  const server = createAdaptorServer({
    fetch: app.fetch
  })
  
  // Attache WebSocket
  setupWebSocketServer(server)
  
  // Démarre
  server.listen(port, () => {
    console.log(`✅ HTTP + WebSocket sur http://localhost:${port}`)
  })
}

startServer()

app.route('/api', Routes)
