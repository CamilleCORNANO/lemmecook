import type { Context } from 'hono'
import { connectDB } from '../models/database.ts'
import { ObjectId } from 'mongodb'
import { get } from 'axios'


export const GetPlayers = async (c: Context) => {
    const db = await connectDB()
    const players = await db.collection('players').find().toArray()
    return c.json(players)
}   

export const GetPlayerById = async (c: Context) => {
    const id = c.req.param('id')
    const db = await connectDB()
    const player = await db.collection('players').findOne({ _id: new ObjectId(id) })
    if (!player) {
        return c.json({ error: 'Player not found' }, 404)
    }
    return c.json(player)
}


