import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  postId: string
}

interface Body {
  content: string
}

export async function createComment(
  request: Request<Params>,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { postId } = request.params
  const { content } = request.body as Body

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    response.status(400).json({
      result: 'error',
      message: 'Post não encontrado',
    })

    return
  }

  await prisma.comment.create({
    data: {
      content,
      postId,
      ownerId: studentId,
    },
  })

  response.status(201).json({
    result: 'success',
    message: 'Comentário criado',
  })
}
