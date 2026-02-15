import { Hono } from 'hono'
import { requireAuth } from '../middlewares/auth'
import { 
    getUserSaves, 
    getSaveBySlot,
    createSave,
    updateSave,
    deleteSave
} from '../controllers/controllerSaves'
import { saveUser } from '../controllers/controllerPlayers'
const saveRoute = new Hono()

// Routes protégées
saveRoute.use('*', requireAuth)

// Récupérer toutes les sauvegardes de l'utilisateur
saveRoute.get('/', getUserSaves)

// Récupérer une sauvegarde par numéro de slot
saveRoute.get('/slot/:slotNumber', getSaveBySlot)

// Sauvegarder
saveRoute.post('/', saveUser)

saveRoute.post('/create', createSave)
saveRoute.post('/update/:slotNumber', updateSave)
saveRoute.delete('/delete/:slotNumber', deleteSave)


export default saveRoute