import { Context } from 'hono'
import { getDB } from '../models/database.ts'
import { ObjectId } from 'mongodb'

export const getUserSaves = async (c: Context) => {
  try {
    const userId = c.req.param('userId')
    
    const db = getDB()
    const saves = await db.collection('saves')
      .find({ userId: new ObjectId(userId) })
      .sort({ lastSaved: -1 })  // Plus récentes en premier
      .toArray()

    return c.json({ 
      saves,
      totalSaves: saves.length
    })
  } catch (error) {
    console.error('Erreur getUserSaves:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

export const getSave = async (c: Context) => {
  try {
    const saveId = c.req.param('saveId')
    
    const db = getDB()
    const save = await db.collection('saves').findOne({ 
      _id: new ObjectId(saveId) 
    })
    
    if (!save) {
      return c.json({ error: 'Sauvegarde non trouvée' }, 404)
    }

    return c.json({ save })
  } catch (error) {
    console.error('Erreur getSave:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

export const createSave = async (c: Context) => {
  try {
    const userId = c.req.param('userId')
    const { slotNumber, saveName, playerName, ingredients, recipes, progression } = await c.req.json()

    if (!slotNumber || !saveName || !playerName) {
      return c.json({ error: 'Données manquantes' }, 400)
    }

    const db = getDB()
    const savesCollection = db.collection('saves')

    const existingSave = await savesCollection.findOne({
      userId: new ObjectId(userId),
      slotNumber
    })

    if (existingSave) {
      return c.json({ error: 'Slot déjà utilisé' }, 400)
    }

    const result = await savesCollection.insertOne({
      userId: new ObjectId(userId),
      slotNumber,
      saveName,
      playerName,
      ingredients: ingredients || [],
      recipes: recipes || [],
      progression: progression || {},
      createdAt: new Date(),
      lastSaved: new Date()
    })

    return c.json({ 
      message: 'Sauvegarde créée',
      saveId: result.insertedId
    }, 201)
  } catch (error) {
    console.error('Erreur createSave:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

export const updateSave = async (c: Context) => {
  try {
    const saveId = c.req.param('saveId')
    const { saveName, playerName, ingredients, recipes, progression } = await c.req.json()

    const db = getDB()
    
    const updatedSave = await db.collection('saves').findOneAndUpdate(
      { _id: new ObjectId(saveId) },
      { 
        $set: { 
          ...(saveName && { saveName }),
          ...(playerName && { playerName }),
          ...(ingredients && { ingredients }),
          ...(recipes && { recipes }),
          ...(progression && { progression }),
          lastSaved: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!updatedSave) {
      return c.json({ error: 'Sauvegarde non trouvée' }, 404)
    }

    return c.json({ 
      message: 'Sauvegarde mise à jour',
      save: updatedSave
    })
  } catch (error) {
    console.error('Erreur updateSave:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

export const deleteSave = async (c: Context) => {
  try {
    const saveId = c.req.param('saveId')
    
    const db = getDB()
    const result = await db.collection('saves').deleteOne({ 
      _id: new ObjectId(saveId) 
    })

    if (result.deletedCount === 0) {
      return c.json({ error: 'Sauvegarde non trouvée' }, 404)
    }

    return c.json({ message: 'Sauvegarde supprimée' })
  } catch (error) {
    console.error('Erreur deleteSave:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}