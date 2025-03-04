import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Params {
  studentId: string
}

export async function getPostsByStudent(
  request: Request<Params>,
  response: Response,
): Promise<void> {
  const { studentId } = request.params

  const posts = await prisma.post.findMany({
    where: {
      active: true,
      ownerId: studentId,
    },
    select: {
      id: true,
      content: true,
      publishedAt: true,
      updatedAt: true,
      ownerId: true,
      comments: {
        select: {
          id: true,
          commentedAt: true,
          updatedAt: true,
          postId: true,
          ownerId: true,
          reactions: {
            select: {
              id: true,
              type: true,
              reactedAt: true,
              commentId: true,
              ownerId: true,
            },
          },
        },
      },
      reactions: {
        select: {
          id: true,
          type: true,
          reactedAt: true,
          postId: true,
          ownerId: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  const postsResponse = posts.map((post) => {
    const comments = post.comments.map((comment) => {
      const reactions = comment.reactions.map((reaction) => {
        return {
          ...reaction,
          isOwner: reaction.ownerId === studentId,
        }
      })

      return {
        ...comment,
        reactions,
        isOwner: comment.ownerId === studentId,
      }
    })

    const reactions = post.reactions.map((reaction) => {
      return {
        ...reaction,
        isOwner: reaction.ownerId === studentId,
      }
    })

    return {
      ...post,
      comments,
      reactions,
      isOwner: true,
    }
  })

  response.json({
    result: 'success',
    data: postsResponse,
  })
}
