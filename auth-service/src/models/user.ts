import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  password: string 
  name: string
  saves: ObjectId[]  // Références aux saves de l'utilisateur
  createdAt: Date
}