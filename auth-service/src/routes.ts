import { Hono } from 'hono'
import { signUp, signIn, getMe } from './controllers/controllerAuth.js'

const auth = new Hono()

auth.post('/sign-up', signUp)
auth.post('/sign-in', signIn)
auth.get('/me', getMe)

export default auth