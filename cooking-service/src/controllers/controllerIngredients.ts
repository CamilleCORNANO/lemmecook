import type { Context } from 'hono'
import { connectDB } from '../models/database.ts'
import { ObjectId } from 'mongodb'

export const GetIngredients = async (c: Context) => {
    const db = await connectDB()
    const ingredients = await db.collection('ingredients').find().toArray()
    return c.json(ingredients)
}

export const GetIngredientsById = async (c: Context) => {
    const id = c.req.param('id')
    const db = await connectDB()
    const ingredient = await db.collection('ingredients').findOne({ _id: new ObjectId(id) })
    if (!ingredient) {
        return c.json({ error: 'Ingredient not found' }, 404)
    }
    return c.json(ingredient)
}   

//ne sert à rien, à supprimer après les tests
export async function createIngredient(c: Context) {
  try {
    const { name, description, category, unit } = await c.req.json()

    if (!name || !unit) {
      return c.json({ error: 'Name et unit requis' }, 400)
    }

    const db = await connectDB()
    const ingredients = db.collection('ingredients')

    const existing = await ingredients.findOne({ name })
    if (existing) {
      return c.json({ error: 'Ingrédient existe déjà' }, 400)
    }

    const result = await ingredients.insertOne({
      name,
      description: description || '',
      category: category || 'autre',
      unit,
      createdAt: new Date()
    })

    return c.json({ 
      message: 'Ingrédient créé',
      ingredientId: result.insertedId
    }, 201)
  } catch (error) {
    console.error('Erreur createIngredient:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}


export { GetIngredients as GetAllIngredients } from './controllerIngredients.ts'
export { GetIngredientsById as GetIngredientById } from './controllerIngredients.ts'