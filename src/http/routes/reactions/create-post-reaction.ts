import { EnumTypeReaction } from '@enums/enum-type-reaction'
import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  postId: string
}

interface Body {
  type: EnumTypeReaction
}

export async function createPostReaction(
  request: Request<Params>,
  response: Response,
) {
  const { studentId } = request
  const { postId } = request.params
  const { type } = request.body as Body

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

  const postReaction = await prisma.postReaction.findFirst({
    where: {
      postId,
      ownerId: studentId,
    },
  })

  if (postReaction) {
    if (postReaction.type !== type) {
      await prisma.postReaction.update({
        where: {
          id: postReaction.id,
        },
        data: {
          type,
        },
      })

      response.status(201).json({
        result: 'success',
        message: 'Post reagido',
      })

      return
    } else {
      await prisma.postReaction.delete({
        where: {
          id: postReaction.id,
        },
      })

      response.status(201).json({
        result: 'success',
        message: 'Reação removida',
      })

      return
    }
  }

  const reaction = await prisma.postReaction.create({
    data: {
      ownerId: studentId,
      postId,
      type,
    },
  })

  response.status(201).json({
    result: 'success',
    message: 'Post reagido',
    data: {
      reaction: {
        ...reaction,
        isOwner: true,
      },
    },
  })
}
