import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { connectDB, fillUpDB } from './src/database.ts'
import { createAdaptorServer } from '@hono/node-server'
import { setupWebSocketServer } from './src/websocket/commandServer.ts'
import { createServer } from 'http'

// Import des routes
import recipeRoutes from './src/routes/recipesRouter.ts'
import ingredientRoutes from './src/routes/ingredientsRouter.ts'
import playerRoutes from './src/routes/playerRouter.ts'
import saveRoutes from './src/routes/savesRouter.ts'

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
    await connectDB().then(() => fillUpDB())
    console.log('MongoDB connecté')
    
    // Crée un serveur HTTP Node.js classique
    const server = createServer(async (req, res) => {
      // Convertit la requête Node.js en Request Web standard pour Hono
      const url = `http://${req.headers.host}${req.url}`
      
      // Collecte le body pour les POST/PUT
      let body: any = undefined
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        const chunks: any[] = []
        for await (const chunk of req) {
          chunks.push(chunk)
        }
        body = Buffer.concat(chunks)
      }
      
      const request = new Request(url, {
        method: req.method,
        headers: req.headers as HeadersInit,
        body,
      })
      
      // Passe la requête à Hono
      const response = await app.fetch(request)
      
      // Renvoie la réponse
      res.statusCode = response.status
      response.headers.forEach((value, key) => {
        res.setHeader(key, value)
      })
      
      if (response.body) {
        const reader = response.body.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          res.write(value)
        }
      }
      res.end()
    })
    
    // Attache WebSocket au serveur
    setupWebSocketServer(server)
    
    // Démarre le serveur
    server.listen(port, () => {
      console.log(` HTTP + WebSocket sur http://localhost:${port}`)
      console.log(` CORS autorisés: ${corsOrigins.join(', ')}`)
    })
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

startServer()
