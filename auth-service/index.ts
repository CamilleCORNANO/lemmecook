import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from './lib/database.ts'
import { cors } from 'hono/cors'


const app = new Hono()
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))

app.get('/', (c) => {
  connectDB()
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
