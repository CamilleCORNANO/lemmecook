import type { Context } from 'hono'
import { getDB } from '../database.ts'
import { ObjectId } from 'mongodb'
import { get } from 'axios'

/*
//ne sert à rien, à supprimer après les tests
export const GetPlayers = async (c: Context) => {
    const db = getDB()
    const players = await db.collection('players').find().toArray()
    return c.json(players)
}



export const GetPlayersById = async (c: Context) => {
    const id = c.req.param('id')
    const db = getDB()
    const player = await db.collection('players').findOne({ _id: new ObjectId(id) })
    if (!player) {
        return c.json({ error: 'Player not found' }, 404)
    }
    return c.json(player)
}*/


export const getPlayeryUserId = async (c: Context) => {
    try {
        const userId = c.req.param('userId')
        const db = getDB()
        const player = await db.collection('players').findOne({ userId: new ObjectId(userId) })
        if (!player) {
            return c.json({ error: 'Player not found' }, 404)
        } else {
            return c.json(player)
        }
    } catch (error) {
        console.error('Erreur getPlayerByUserId:', error)
        return c.json({ error: 'Erreur serveur' }, 500)
    }
}

export const saveUser = async (c: Context) => {
  try {
    const playerId = c.req.param('id')
    const { name, ingredients, recipes } = await c.req.json()

    const db = getDB()
    const result = await db.collection('players').findOneAndUpdate(
      { _id: new ObjectId(playerId) },
      { 
        $set: { 
          name, 
          ingredients, 
          recipes,
          lastSaved: new Date()
        }
      },
      { 
        returnDocument: 'after',
        upsert: true // Crée le joueur s'il n'existe pas
      }
    )

    return c.json({ 
      success: true,
      player: result,
      message: 'Sauvegarde réussie'
    })
  } catch (error) {
    console.error('Erreur save:', error)
    return c.json({ error: 'Erreur lors de la sauvegarde' }, 500)
  }
}

export const createPlayer = async (c: Context) => {
  try {
    const { name } = await c.req.json()

    const db = getDB()
    const result = await db.collection('players').insertOne({
      name,
      ingredients: [],
      recipes: [],
      lastSaved: new Date()
    })

    return c.json({ 
      success: true,
      player: { ...result, _id: result.insertedId },
      message: 'Joueur créé avec succès'
    })
  } catch (error) {
    console.error('Erreur createPlayer:', error)
    return c.json({ error: 'Erreur lors de la création du joueur' }, 500)
  }
}

export const unlockRecipes = async (c: Context) => {
  try {
    const playerId = c.req.param('id')
    const { recipeId } = await c.req.json()

    const db = getDB()
    const result = await db.collection('players').findOneAndUpdate(
      { _id: new ObjectId(playerId) },
        { $addToSet: { recipes: recipeId } }, // Ajoute la recette à la liste sans dupliquer
      { returnDocument: 'after' }
    )

    if (!result) {
      return c.json({ error: 'Joueur non trouvé' }, 404)
    }

    return c.json({ 
      success: true,
      player: result,
      message: 'Recette débloquée'
    })
  } catch (error) {
    console.error('Erreur unlockRecipe:', error)
    return c.json({ error: 'Erreur lors du déblocage de la recette' }, 500)
  }
}

export const getRecipes = async (c: Context) => {
  try {
    const playerId = c.req.param('id')
    const db = getDB()
    const player = await db.collection('players').findOne({ _id: new ObjectId(playerId) })
    if (!player) {
      return c.json({ error: 'Joueur non trouvé' }, 404)
    } else {
      return c.json({ 
        success: true,
        recipes: player.recipes,
        message: 'Recettes récupérées'
      })
    }
    } catch (error) {
    console.error('Erreur getRecipes:', error)
    return c.json({ error: 'Erreur lors de la récupération des recettes' }, 500)
  }
} 

export const getIngredients = async (c: Context) => {
  try {
    const playerId = c.req.param('id')
    const db = getDB()
    const player = await db.collection('players').findOne({ _id: new ObjectId(playerId) })
    if (!player) {
      return c.json({ error: 'Joueur non trouvé' }, 404)
    } else {
      return c.json({ 
        success: true,
        ingredients: player.ingredients,
        message: 'Ingrédients récupérés'
      })
    }
    } catch (error) {
    console.error('Erreur getIngredients:', error)
    return c.json({ error: 'Erreur lors de la récupération des ingrédients' }, 500) }
}
export const addIngredient = async (c: Context) => {
  try {
    const playerId = c.req.param('id')
    const { ingredientId } = await c.req.json()
    const db = getDB()
    const result = await db.collection('players').findOneAndUpdate(
      { _id: new ObjectId(playerId) },
      { $addToSet: { ingredients: ingredientId } }, // Ajoute l'ingrédient à la liste sans dupliquer
      { returnDocument: 'after' }
    )
    if (!result) {
      return c.json({ error: 'Joueur non trouvé' }, 404)
    }
    return c.json({
      success: true,
      player: result,
      message: 'Ingrédient ajouté'
    })
  } catch (error) {
    console.error('Erreur addIngredient:', error)
    return c.json({ error: 'Erreur lors de l\'ajout de l\'ingrédient' }, 500)
  }
}

export const updateIngredients = async (c: Context) => {
  try {
    const playerId = c.req.param('id')
    const { ingredientIds } = await c.req.json()
    const db = getDB()
    const result = await db.collection('players').findOneAndUpdate(
      { _id: new ObjectId(playerId) },
      { $set: { ingredients: ingredientIds } }, // Remplace la liste des ingrédients
      { returnDocument: 'after' }
    )
    if (!result) {
      return c.json({ error: 'Joueur non trouvé' }, 404)
    }
    return c.json({
      success: true,
      player: result,
      message: 'Ingrédients mis à jour'
    })
  } catch (error) {
    console.error('Erreur updateIngredients:', error)
    return c.json({ error: 'Erreur lors de la mise à jour des ingrédients' }, 500)
  }
}


export const getWallet = async (c: Context) => {
  try {
    const playerId = c.req.param('id')
    const db = getDB()
    const player = await db.collection('players').findOne({ _id: new ObjectId(playerId) })
    if (!player) {
      return c.json({ error: 'Joueur non trouvé' }, 404)
    } else {
      return c.json({ 
        success: true,
        wallet: player.wallet,
        message: 'Solde récupéré'
      })
    } } catch (error) {
    console.error('Erreur getWallet:', error)
    return c.json({ error: 'Erreur lors de la récupération du solde' }, 500) }
}

export const updateWallet = async (c: Context) => {
  try {
    const playerId = c.req.param('id')
    const { amount } = await c.req.json()
    const db = getDB()
    const result = await db.collection('players').findOneAndUpdate(
      { _id: new ObjectId(playerId) },
      { $inc: { wallet: amount } }, // Incrémente le solde du joueur
      { returnDocument: 'after' }
    )
    if (!result) {
      return c.json({ error: 'Joueur non trouvé' }, 404)
    } else {
      return c.json({ 
        success: true,
        wallet: result.value.wallet,
        message: 'Solde mis à jour'
      })
    } } catch (error) {
    console.error('Erreur updateWallet:', error)
    return c.json({ error: 'Erreur lors de la mise à jour du solde' }, 500) } 
}


