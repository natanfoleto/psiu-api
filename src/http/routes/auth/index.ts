import { authentication } from '@http/middlewares/auth'
import { Router } from 'express'

import { authenticateWithPassword } from './authenticate-with-password'
import { authenticateUpload } from './authentication-upload'
import { updatePassword } from './update-password'

const authRouter = Router()

authRouter.post('/password', authenticateWithPassword)
authRouter.post('/upload', authenticateUpload)

authRouter.use(authentication)

authRouter.patch('/password', updatePassword)

export { authRouter }
