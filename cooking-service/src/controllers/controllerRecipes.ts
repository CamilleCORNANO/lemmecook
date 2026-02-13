import type { Context } from 'hono'
import { connectDB } from '../models/database.ts'
import { ObjectId } from 'mongodb'

export const GetRecipes = async (c: Context) => {
    const db = await connectDB()
    const recipes = await db.collection('recipes').find().toArray()
    return c.json(recipes)
}

export const GetRecipeById = async (c: Context) => {
    const id = c.req.param('id')
    const db = await connectDB()
    const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) })
    if (!recipe) {
        return c.json({ error: 'Recipe not found' }, 404)
    }
    return c.json(recipe)
}  

export const getRecipesByIngredient = async (c: Context) => {
    const ingredientName = c.req.param('ingredient')
    const db = await connectDB()
    const recipes = await db.collection('recipes').find({ ingredients: ingredientName }).toArray()
    return c.json(recipes)
}

export const getRecipesByPlayer = async (c: Context) => {
    const playerId = c.req.param('playerId')
    const db = await connectDB()
    const recipes = await db.collection('recipes').find({ players: playerId }).toArray()
    return c.json(recipes)
}