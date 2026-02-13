import type { integer } from 'drizzle-orm/gel-core';
import { ObjectId } from 'mongodb'

export interface Player {
    _id?: ObjectId,
    name: string,
    ingredients: string[],
    recipes: string[],
    token : string
}