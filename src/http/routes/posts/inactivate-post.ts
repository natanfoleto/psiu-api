import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  postId: string
}

export async function inactivatePost(
  request: Request<Params>,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { postId } = request.params

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

  if (post.ownerId !== studentId) {
    response.status(401).json({
      result: 'error',
      message: 'Operação não autorizada',
    })

    return
  }

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      active: false,
    },
  })

  response.json({
    result: 'success',
    message: 'Post deletado',
  })
}
