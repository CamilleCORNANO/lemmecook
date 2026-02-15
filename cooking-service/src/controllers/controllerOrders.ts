import { Context } from 'hono'
import { getDB } from '../database.ts'
import { ObjectId } from 'mongodb'

// Récupérer les commandes du joueur
export async function getMyOrders(c: Context) {
  try {
    const playerId = c.get('userId')
    const status = c.req.query('status')  // ?status=pending ou ?status=completed
    
    const db = getDB()
    const query: any = { playerId }
    
    if (status) {
      query.status = status
    }
    
    const orders = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return c.json({ orders, total: orders.length })
  } catch (error) {
    console.error('Erreur getMyOrders:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

// Marquer une commande comme complétée
export async function completeOrder(c: Context) {
  try {
    const playerId = c.get('userId')
    const orderId = c.req.param('orderId')
    
    const db = getDB()
    const orders = db.collection('orders')
    
    const updated = await orders.findOneAndUpdate(
      { 
        _id: new ObjectId(orderId),
        playerId,
        status: 'pending'
      },
      { 
        $set: { 
          status: 'completed',
          completedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!updated) {
      return c.json({ error: 'Commande non trouvée ou déjà complétée' }, 404)
    }

    return c.json({ 
      message: 'Commande complétée',
      order: updated,
      earned: updated.priceToSell
    })
  } catch (error) {
    console.error('Erreur completeOrder:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

// Marquer une commande comme échouée
export async function failOrder(c: Context) {
  try {
    const playerId = c.get('userId')
    const orderId = c.req.param('orderId')
    
    const db = getDB()
    const orders = db.collection('orders')
    
    const updated = await orders.findOneAndUpdate(
      { 
        _id: new ObjectId(orderId),
        playerId,
        status: 'pending'
      },
      { 
        $set: { 
          status: 'failed',
          completedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!updated) {
      return c.json({ error: 'Commande non trouvée ou déjà traitée' }, 404)
    }

    return c.json({ 
      message: 'Commande échouée',
      order: updated
    })
  } catch (error) {
    console.error('Erreur failOrder:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}

// Stats des commandes
export async function getOrderStats(c: Context) {
  try {
    const playerId = c.get('userId')
    
    const db = getDB()
    const orders = db.collection('orders')
    
    const stats = await orders.aggregate([
      { $match: { playerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEarned: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'completed'] }, '$priceToSell', 0] 
            }
          }
        }
      }
    ]).toArray()

    return c.json({ stats })
  } catch (error) {
    console.error('Erreur getOrderStats:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
}