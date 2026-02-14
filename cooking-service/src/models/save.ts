import { ObjectId } from 'mongodb'

export interface Save {
  _id?: ObjectId
  userId: ObjectId
  slotNumber: number
  playerName: string
  playerId: ObjectId
  ingredients: any[]  // ou type plus précis
  recipes: any[]
  progression?: {
    level?: number
    money?: number
  }
  createdAt: Date
  lastSaved: Date
}