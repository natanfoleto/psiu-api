import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  reactionId: string
}

export async function deletePostReaction(
  request: Request<Params>,
  response: Response,
) {
  const { studentId } = request
  const { reactionId } = request.params

  const reaction = await prisma.postReaction.findUnique({
    where: {
      id: reactionId,
    },
  })

  if (!reaction) {
    response.status(400).json({
      result: 'error',
      message: 'Reação não encontrada',
    })

    return
  }

  if (reaction.ownerId !== studentId) {
    response.status(401).json({
      result: 'error',
      message: 'Operação não autorizada',
    })

    return
  }

  await prisma.postReaction.delete({
    where: {
      id: reactionId,
    },
  })

  response.json({
    result: 'success',
    message: 'Reação removida',
  })
}
