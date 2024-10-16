import { authentication } from '@http/middlewares/auth'
import { Router } from 'express'

import { createPost } from './create-post'

const postRouter = Router()

postRouter.use(authentication)

postRouter.post('/', createPost)

export { postRouter }
