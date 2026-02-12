import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { connectDB } from './src/models/database.ts'
import authRoutes from './src/routes.ts'
import { requireAuth } from './src/middleware/middlewareAuth.ts'

const app = new Hono()

// CORS
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))

// Routes d'authentification
app.route('/api/auth', authRoutes)

// Route protégée exemple
app.get('/api/protected', requireAuth, async (c) => {
  const userId = c.get('userId')
  const userEmail = c.get('userEmail')
  
  return c.json({ 
    message: 'Contenu protégé',
    user: { id: userId, email: userEmail }
  })
})


app.get('/', (c) => c.json({ message: 'API Running' }))


const port = 3000

connectDB().then(() => {
  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`✅ Serveur sur http://localhost:${info.port}`)
  })
}).catch(console.error)