import { Ingredient, Recipe } from "./Objects"
const Recipes = [
    new Recipe('Tomato Soup', [new Ingredient('Tomato', './sprites/Tomato.png'), new Ingredient('Tomato', './sprites/Tomato.png'), new Ingredient('Tomato', './sprites/Tomato.png')]),
]

const checkRecipeMatch = (currentRecipe: Ingredient[]) => {
    for (let recipe of Recipes) {
        if (recipe.ingredients.length !== currentRecipe.length) continue
        let match = true
        for (let i = 0; i < recipe.ingredients.length; i++) {
            if (recipe.ingredients[i].name !== currentRecipe[i].name) {
                match = false
                break
            }
        }
        if (match) return recipe.name
    }
    return 'Trash'
}

export { checkRecipeMatch, Recipes }