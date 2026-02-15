import { MongoClient, Db } from 'mongodb'

const url = process.env.MONGO_URL || process.env.MONGODB_URI || `mongodb://localhost:${process.env.MONGO_PORT || 27017}`

export const client = new MongoClient(url)
let db: Db | null = null

export async function connectDB() {
  try {
    await client.connect()
    const db: Db = client.db(process.env.MONGO_DB || 'lemmecook')
    console.log('Connecté à MongoDB')
    return db
  } catch (error) {
    console.error('Erreur MongoDB:', error)
    throw error
  }
}


export async function connectDBDebug() {
  try {
    console.log('🔌 Création du client MongoDB...')
    const client = new MongoClient(url)
    
    console.log('🔌 Tentative de connexion...')
    await client.connect()
    
    console.log('🔌 Sélection de la base de données...')
    db = client.db(process.env.MONGO_DB || 'lemmecook')
    
    console.log('✅ Connecté à MongoDB')
    return db
  } catch (error) {
    console.error('❌ Erreur détaillée MongoDB:', error)
    console.error('Stack:', (error as Error).stack)
    throw error
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}