import { ObjectId } from 'mongodb'

export interface Order {
  _id?: ObjectId
  recipeId: ObjectId
  recipeName: string
  priceToSell: number
  playerId: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
}

