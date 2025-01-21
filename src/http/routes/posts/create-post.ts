import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Body {
  content: string
}

export async function createPost(
  request: Request,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { content } = request.body as Body

  await prisma.post.create({
    data: {
      content,
      ownerId: studentId,
    },
  })

  response.status(201).json({
    result: 'success',
    message: 'Post criado',
  })
}
