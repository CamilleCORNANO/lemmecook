import { Ingredient, Recipe } from "./Objects"

// Ingredients list
export const Ingredients = {
    rice: new Ingredient('Rice', './sprites/Rice.png'),
    beans: new Ingredient('Beans', './sprites/Beans.png'),
    garlic: new Ingredient('Garlic', './sprites/Garlic.png'),
    pork: new Ingredient('Pork', './sprites/Pork.png'),
    turkey: new Ingredient('Turkey', './sprites/Turkey.png'),
    pasta: new Ingredient('Pasta', './sprites/Pasta.png'),
    cheese: new Ingredient('Cheese', './sprites/Cheese.png'),
    potato: new Ingredient('Potato', './sprites/Potato.png'),
    spinach: new Ingredient('Spinach', './sprites/Spinach.png'),
    beef: new Ingredient('Beef', './sprites/Steak.png'),
    fish: new Ingredient('Fish', './sprites/Fish.png'),
    tomato: new Ingredient('Tomato', './sprites/Tomato.png'),
    eggs: new Ingredient('Eggs', './sprites/Eggs.png'),
    carrot: new Ingredient('Carrot', './sprites/Carrot.png'),
}

const Recipes: Recipe[] = [
    // Original recipes
    new Recipe('Tomato Soup', [Ingredients.tomato, Ingredients.tomato, Ingredients.tomato]),
    new Recipe('Chicken Salad', [Ingredients.cheese, Ingredients.tomato, Ingredients.cheese]),
    
    // New recipes
    new Recipe('Chili Con Carne', [Ingredients.rice, Ingredients.beans, Ingredients.garlic]),
    new Recipe('Pork Ombre', [Ingredients.rice, Ingredients.pork]),
    new Recipe('Turkey Ombre', [Ingredients.rice, Ingredients.turkey]),
    new Recipe('Pasta Carbonara', [Ingredients.pasta, Ingredients.pork, Ingredients.cheese]),
    new Recipe('Pasta Carbonara Without Pork', [Ingredients.pasta, Ingredients.turkey, Ingredients.cheese]),
    new Recipe('Vegetarian Pasta Carbonara', [Ingredients.pasta, Ingredients.fish]),
    new Recipe('Absolute Despair', [Ingredients.potato, Ingredients.spinach, Ingredients.beef]),
    new Recipe('Fish and Chips', [Ingredients.potato, Ingredients.fish]),
    new Recipe('Tartiflette', [Ingredients.potato, Ingredients.garlic, Ingredients.pork]),
    new Recipe('Tartiflette Without Pork', [Ingredients.potato, Ingredients.garlic, Ingredients.turkey]),
    new Recipe('Beef Bourguignon', [Ingredients.beef, Ingredients.rice]),
    new Recipe('Pasta Bolognaise', [Ingredients.pasta, Ingredients.beef, Ingredients.tomato]),
    new Recipe('Salmon Lasagne', [Ingredients.pasta, Ingredients.spinach, Ingredients.fish]),
    new Recipe('Quiche Lorraine', [Ingredients.eggs, Ingredients.cheese, Ingredients.pork]),
    new Recipe('Quiche Lorraine Without Pork', [Ingredients.eggs, Ingredients.cheese, Ingredients.turkey]),
    new Recipe('Tuna Quiche', [Ingredients.eggs, Ingredients.fish, Ingredients.tomato]),
    new Recipe('Tomato Carrot Soup', [Ingredients.tomato, Ingredients.carrot]),
    new Recipe('Spinach Potato Soup', [Ingredients.spinach, Ingredients.potato]),
    new Recipe('Pizza', [Ingredients.tomato, Ingredients.cheese]),
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