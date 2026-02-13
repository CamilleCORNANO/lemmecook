import { GetRecipes, GetRecipesById } from "controllers/controllerRecipes.ts";
import { GetIngredients, GetIngredientsById } from "controllers/controllerIngredients.ts";
import { GetPlayers, GetPlayersById } from "controllers/controllerPlayers.ts";
import { Hono } from "hono";

const Routes = new Hono()
Routes.get("/recipes", GetRecipes)
Routes.get("/recipes/:id", GetRecipesById)
Routes.get("/ingredients", GetIngredients)
Routes.get("/ingredients/:id", GetIngredientsById)
Routes.get("/players", GetPlayers)
Routes.get("/players/:id", GetPlayersById)