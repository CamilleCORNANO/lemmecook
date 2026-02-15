import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { connectDB, connectDBDebug } from './src/models/database.js'
import authRoutes from './src/routes.js'
import { requireAuth } from './src/middlewares/middlewareAuth.js'

type Variables = {
  userId: string
  userEmail: string
}
const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']

const app = new Hono<{ Variables: Variables }>()

app.use('*', cors({
  origin: corsOrigins,
  credentials: true,
}))

app.route('/api/auth', authRoutes)

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

/*
async function startServerDebug() {
  try {
    console.log(' Tentative de connexion à MongoDB...')
    await connectDBDebug()
    console.log(' MongoDB connecté, démarrage du serveur...')
    
    serve({ fetch: app.fetch, port }, (info) => {
      console.log(` Serveur démarré sur http://localhost:${info.port}`)
    })
  } catch (error) {
    console.error(' Erreur fatale au démarrage:', error)
    process.exit(1)
  }
}

startServerDebug()
*/

export { app, connectDB }