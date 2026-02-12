import { Context } from 'hono'
import { connectDB } from '../models/database.ts'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function signUp(c: Context) {
  try {
    const { email, password, name } = await c.req.json()

    // Validation
    if (!email || !password || !name) {
      return c.json({ error: 'Tous les champs sont requis' }, 400)
    }

    const db = connectDB()
    const users = db.collection('users')

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return c.json({ error: 'Email déjà utilisé' }, 400)
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    })

    // Générer le JWT
    const token = jwt.sign(
      { userId: result.insertedId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return c.json({
      message: 'Utilisateur créé',
      token,
      user: { id: result.insertedId, email, name }
    }, 201)
  } catch (error) {
    console.error('Erreur inscription:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

export async function signIn(c: Context) {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email et mot de passe requis' }, 400)
    }

    const db = connectDB()
    const users = db.collection('users')

    // Trouve l'utilisateur
    const user = await users.findOne({ email })
    if (!user) {
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401)
    }

    // Vérifie le mot de passe
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return c.json({ error: 'Email ou mot de passe incorrect' }, 401)
    }

    // Générer le JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return c.json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, email: user.email, name: user.name }
    })
  } catch (error) {
    console.error('Erreur connexion:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

export async function getMe(c: Context) {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Non autorisé' }, 401)
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string }

    const db = connectDB()
    const users = db.collection('users')
    const user = await users.findOne({ email: decoded.email })

    if (!user) {
      return c.json({ error: 'Utilisateur non trouvé' }, 404)
    }

    return c.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    return c.json({ error: 'Token invalide' }, 401)
  }
}