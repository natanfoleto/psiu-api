import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  postId: string
}

interface Body {
  content: string
}

export async function updatePost(
  request: Request<Params>,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { postId } = request.params
  const { content } = request.body as Body

  const post = await prisma.post.findUnique({ where: { id: postId } })

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

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      content,
    },
    include: {
      comments: {
        select: {
          id: true,
          content: true,
          active: true,
          commentedAt: true,
          updatedAt: true,
          ownerId: true,
          postId: true,
          reactions: true,
        },
      },
      reactions: true,
    },
  })

  const comments = updatedPost.comments.map((comment) => {
    const reactions = comment.reactions.map((reaction) => ({
      ...reaction,
      isOwner: comment.ownerId === studentId,
    }))

    return {
      ...comment,
      reactions,
      isOwner: comment.ownerId === studentId,
    }
  })

  response.json({
    result: 'success',
    message: 'Post atualizado',
    data: {
      post: {
        ...updatedPost,
        comments,
        isOwner: true,
      },
    },
  })
}
