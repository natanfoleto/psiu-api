import { authentication } from '@http/middlewares/auth'
import upload from '@lib/multer'
import { Router } from 'express'

import { createStudent } from './create-student'
import { getStudents } from './get-students'
import { inactivateStudent } from './inactivate-student'
import { updateStudent } from './update-student'
import { uploadStudents } from './upload-students'

const userRouter = Router()

userRouter.post('/', createStudent)
userRouter.post('/upload', upload.single('file'), uploadStudents)

userRouter.use(authentication)

userRouter.get('/', authentication, getStudents)
userRouter.put('/', updateStudent)
userRouter.delete('/', inactivateStudent)

export { userRouter }
