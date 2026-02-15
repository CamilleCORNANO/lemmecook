import { ObjectId } from 'mongodb'
import { Recipe } from './recipes'
import { Ingredient } from './ingredients'

export interface Save {
  _id?: ObjectId
  userId: ObjectId
  slotNumber: number
  playerName: string
  playerId: ObjectId
  ingredients: Ingredient[]  // ou type plus précis
  recipes: Recipe[]
  wallet: number
  createdAt: Date
  lastSaved: Date
}