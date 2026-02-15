import { ObjectId } from 'mongodb'
import { Recipe } from './recipes.js'
import { Ingredient } from './ingredients.js'

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