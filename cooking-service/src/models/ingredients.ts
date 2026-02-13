import type { integer } from 'drizzle-orm/gel-core';
import { ObjectId } from 'mongodb'

export interface Ingredient {
    _id?: ObjectId,
    name: string,
    quantity: number,
    linkPix: string
}