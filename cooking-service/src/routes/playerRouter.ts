import { Hono } from 'hono'
import { requireAuth } from '../middlewares/auth'
import { 
  createPlayer,
  getPlayeryUserId,
  getIngredients, 
  getRecipes, 
  unlockRecipes, 
  updateIngredients, 
  getWallet, 
  updateWallet 
} from '../controllers/controllerPlayers'

const player = new Hono()

// Route publique (appelée par Auth Service)
player.post('/', createPlayer)

// Route pour récupérer un joueur par userId (depuis le token)
player.get('/user/:userId', requireAuth, getPlayeryUserId)

// Routes protégées
player.use('*', requireAuth)

// Recettes du joueur
player.get('/recipes', getRecipes)
player.post('/unlock-recipe', unlockRecipes)

// Ingrédients du joueur
player.get('/ingredients', getIngredients)
player.post('/update-ingredients', updateIngredients)

// Wallet du joueur
player.get('/wallet', getWallet)
player.post('/update-wallet', updateWallet)

export default player

