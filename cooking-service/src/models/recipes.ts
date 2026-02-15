import type { integer } from 'drizzle-orm/gel-core';
import { ObjectId } from 'mongodb'

export interface Recipe{
    _id?: ObjectId,
    title: string,
    ingredients: string[]
    priceToMake: number,
    priceToSell: number,
    linkPix: string
}
