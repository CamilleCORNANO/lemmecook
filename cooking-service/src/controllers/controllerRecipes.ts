import type { Context } from 'hono'
import { getDB } from '../models/database.ts'
import { ObjectId } from 'mongodb'

export const GetRecipes = async (c: Context) => {
    const db = getDB()
    const recipes = await db.collection('recipes').find().toArray()
    return c.json(recipes)
}

//Je sais pas si ça sert à quelque chose d'avoir une route pour chaque recette, mais peut-etre
export const GetRecipeById = async (c: Context) => {
    const id = c.req.param('id')
    const db = getDB()
    const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) })
    if (!recipe) {
        return c.json({ error: 'Recipe not found' }, 404)
    }
    return c.json(recipe)
}  

export async function filterRecipesByPot(c: Context) {
  try {
    const { ingredientIds } = await c.req.json()
    if (!ingredientIds || ingredientIds.length === 0) {
      // Pot vide = aucune recette possible
      return c.json({ 
        recipes: [],
        total: 0
      })
    }

    const db = getDB()
    const objectIds: ObjectId[] = ingredientIds.map((id: string) => new ObjectId(id))
    
    // Trouve les recettes qui contiennent AU MINIMUM ces ingrédients
    const recipes = await db.collection('recipes')
      .find({
        'ingredients.ingredientId': { $all: objectIds }
      })
      .toArray()

    return c.json({ 
      recipes,
      total: recipes.length
    })
  } catch (error) {
    console.error('Erreur filterRecipesByPot:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

// Vérifier si le pot correspond EXACTEMENT à une recette
export async function checkExactMatch(c: Context) {
  try {
    const { ingredientIds } = await c.req.json()
    
    if (!ingredientIds || ingredientIds.length === 0) {
      return c.json({ 
        hasMatch: false,
        match: null
      })
    }

    const db = getDB()
    const objectIds: ObjectId[] = ingredientIds.map((id: string) => new ObjectId(id))
    
    // Trouve une recette avec EXACTEMENT ces ingrédients
    const exactMatch = await db.collection('recipes').findOne({
      $and: [
        { 'ingredients.ingredientId': { $all: objectIds } },
        { 'ingredients': { $size: objectIds.length } }
      ]
    })

    return c.json({ 
      hasMatch: !!exactMatch,
      match: exactMatch
    })
  } catch (error) {
    console.error('Erreur checkExactMatch:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}