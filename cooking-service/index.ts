import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { connectDB, connectDBDebug } from './src/models/database.ts'
import Routes from './src/routes.ts'


const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}))

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`✅ Serveur sur http://localhost:${info.port}`)
})

app.route('/api', Routes)
