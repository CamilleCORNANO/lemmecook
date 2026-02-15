import { Hono } from 'hono'
import { requireAuth } from '../middlewares/auth'
import { 
  GetRecipes, 
  GetRecipeById, 
  filterRecipesByPot, 
  checkExactMatch 
} from '../controllers/controllerRecipes'

const recipe = new Hono()

// Routes protégées
recipe.use('*', requireAuth)

// Toutes les recettes (livre de recettes)
recipe.get('/', GetRecipes)

// Détails d'une recette
recipe.get('/:id', GetRecipeById)

// Filtrer les recettes selon les ingrédients du pot
recipe.get('/filter-by-pot', filterRecipesByPot)

// Vérifier si le pot correspond exactement à une recette
recipe.post('/check-exact-match', checkExactMatch)

export default recipe