// import type { Ingredient } from '../types/Ingredient'

export class Ingredient{
    name: string
    image: string

    constructor(name: string, image: string) {
        this.name = name
        this.image = image
    }
}

export class Recipe{
    name: string
    ingredients: Ingredient[]

    constructor(name: string, ingredients: Ingredient[]) {
        this.name = name
        this.ingredients = ingredients
    }
}