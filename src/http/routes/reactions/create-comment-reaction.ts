import { EnumTypeReaction } from '@enums/enum-type-reaction'
import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  commentId: string
}

interface Body {
  type: EnumTypeReaction
}

export async function createCommentReaction(
  request: Request<Params>,
  response: Response,
) {
  const { studentId } = request
  const { commentId } = request.params
  const { type } = request.body as Body

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

  const commentReaction = await prisma.commentReaction.findFirst({
    where: {
      commentId,
      ownerId: studentId,
    },
  })

  if (commentReaction) {
    if (commentReaction.type !== type) {
      await prisma.commentReaction.update({
        where: {
          id: commentReaction.id,
        },
        data: {
          type,
        },
      })

      response.status(201).json({
        result: 'success',
        message: 'Comment reagido',
      })

      return
    } else {
      await prisma.commentReaction.delete({
        where: {
          id: commentReaction.id,
        },
      })

      response.status(201).json({
        result: 'success',
        message: 'Reação removida',
      })

      return
    }
  }

  const reaction = await prisma.commentReaction.create({
    data: {
      ownerId: studentId,
      commentId,
      type,
    },
  })

  response.status(201).json({
    result: 'success',
    message: 'Comentário reagido',
    data: {
      reaction: {
        ...reaction,
        isOwner: true,
      },
    },
  })
}
