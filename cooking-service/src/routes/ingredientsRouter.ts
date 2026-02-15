import { Hono } from 'hono'
import { requireAuth } from '../middlewares/auth.js'
import { 
  GetIngredients, 
  GetIngredientsById 
} from '../controllers/controllerIngredients.js'

const ingredient = new Hono()

// Routes protégées
ingredient.use('*', requireAuth)

// Tous les ingrédients
ingredient.get('/', GetIngredients)

// Détails d'un ingrédient
ingredient.get('/:id', GetIngredientsById)

export default ingredient