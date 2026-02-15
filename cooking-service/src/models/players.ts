import type { integer } from 'drizzle-orm/gel-core';
import { ObjectId } from 'mongodb'

export interface Player {
    _id?: ObjectId,
    userId: string,
    name: string,
    wallet: number,
    ingredients: string[],
    recipes: string[],
    token : string
}