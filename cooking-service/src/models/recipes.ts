import { ObjectId } from 'mongodb'

export interface Recipe{
    _id?: ObjectId,
    title: string,
    ingredients: string[]
    priceToMake: number,
    priceToSell: number,
    linkPix: string
}
