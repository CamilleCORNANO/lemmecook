import { MongoClient } from 'mongodb'

const url = `mongodb://${process.env.MONGODB_INITDB_ROOT_USERNAME}:${process.env.MONGODB_INITDB_ROOT_PASSWORD}@mongodb:27017/admin`

export const client = new MongoClient(url)

export async function connectDB() {
  try {
    await client.connect()
    console.log('Connecté à MongoDB')
    return client.db(process.env.MONGO_DB)
  } catch (error) {
    console.error('Erreur MongoDB:', error)
    throw error
  }
}
