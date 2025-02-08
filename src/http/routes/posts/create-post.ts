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

  const post = await prisma.post.create({
    data: {
      content,
      ownerId: studentId,
    },
  })

  response.status(201).json({
    result: 'success',
    message: 'Post criado',
    data: {
      post: {
        ...post,
        comments: [],
        reactions: [],
        isOwner: true,
      },
    },
  })
}
