import { GetRecipes, GetRecipeById, filterRecipesByPot, checkExactMatch } from "./controllers/controllerRecipes.ts";
import { GetIngredients, GetIngredientsById } from "./controllers/controllerIngredients.ts";
import { getPlayeryUserId, getIngredients, getRecipes, unlockRecipes,  } from "./controllers/controllerPlayers.ts";
import { createPlayer, save } from "./controllers/controllerPlayers";
import { Hono } from "hono";
import { requireAuth } from "./middlewares/auth";
import { getUserSaves } from "./controllers/controllerSaves.ts";

const Routes = new Hono()

Routes.get("/recipes", GetRecipes) // toutes les recettes, livre
Routes.get("/recipes/filter-by-pot", filterRecipesByPot) // filtrer les recettes selon les ingrédients du pot
Routes.post("/recipes/check-exact-match", checkExactMatch) // vérifier si le pot correspond exactement à une recette
Routes.get("/recipes/:id", GetRecipeById) // détails d'une recette
Routes.get("/ingredients", GetIngredients) // tous les ingrédients
Routes.get("/ingredients/:id", GetIngredientsById) // détails d'un ingrédient
Routes.post("/players/:id/save", requireAuth, save) // sauvegarder le joueur
Routes.get("/players", unlockRecipes) // débloquer une recette pour un joueur
Routes.get("/saves", getUserSaves) // récupérer les sauvegardes d'un utilisateur
Routes.
Routes.post("/players", createPlayer) // créer un joueur
Routes.get("/players/user/:userId", getPlayeryUserId) // joueur par userId (auth)
Routes.get("/players/ingredients", getIngredients) // ingrédients du joueur 
Routes.get("/players/recipes", getRecipes) // recettes du joueur 

export default Routes