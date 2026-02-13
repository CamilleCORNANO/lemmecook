import type { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Non autorisé' }, 401)
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string }
    
    // Ajoute les données user au contexte
    c.set('userId', decoded.userId)
    c.set('userEmail', decoded.email)
    
    await next()
  } catch (error) {
    return c.json({ error: 'Token invalide' }, 401)
  }
}