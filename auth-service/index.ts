import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from './lib/database.ts'


const app = new Hono()

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
