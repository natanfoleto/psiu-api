import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  commentId: string
}

interface Body {
  content: string
}

export async function updateComment(
  request: Request<Params>,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { commentId } = request.params
  const { content } = request.body as Body

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  })

  if (!comment) {
    response.status(400).json({
      result: 'error',
      message: 'Comentário não encontrado',
    })

    return
  }

  if (comment.ownerId !== studentId) {
    response.status(401).json({
      result: 'error',
      message: 'Operação não autorizada',
    })

    return
  }

  await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
  })

  response.json({
    result: 'success',
    message: 'Comentário atualizado',
  })
}
