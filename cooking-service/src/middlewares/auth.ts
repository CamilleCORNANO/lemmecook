import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Token manquant' }, 401)
  }

  try {
    // Extraction du token (enlève "Bearer ")
    const token = authHeader.substring(7)

    const decoded = jwt.verify(token, JWT_SECRET) as { 
      userId: string
      email: string 
    }
    
    // Stocker userId dans le contexte
    c.set('userId', decoded.userId)
    c.set('userEmail', decoded.email)

    await next()
  } catch (error) {
    return c.json({ error: 'Token invalide ou expiré' }, 401)
  }
}