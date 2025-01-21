import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  commentId: string
}

export async function inactivateComment(
  request: Request<Params>,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { commentId } = request.params

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

  const post = await prisma.post.findUnique({
    where: {
      id: comment.postId,
    },
  })

  if (!post) {
    response.status(400).json({
      result: 'error',
      message: 'O post desse comentário não foi encontrado',
    })

    return
  }

  if (comment.ownerId !== studentId && post.ownerId !== studentId) {
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
      active: false,
    },
  })

  response.json({
    result: 'success',
    message: 'Comentário deletado',
  })
}
