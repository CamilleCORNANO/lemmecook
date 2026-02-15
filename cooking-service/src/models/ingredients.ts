import { ObjectId } from 'mongodb'

export interface Ingredient {
    _id?: ObjectId,
    name: string,
    quantity: number,
    linkPix: string
}