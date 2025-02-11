import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

export async function getPosts(
  request: Request,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { _page = '1', _perPage = '10' } = request.query

  const page = Math.max(parseInt(_page as string, 10), 1)
  const perPage = Math.max(parseInt(_perPage as string, 10), 1)

  const offset = (page - 1) * perPage

  const posts = await prisma.post.findMany({
    where: {
      active: true,
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
          content: true,
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
    skip: offset,
    take: perPage,
  })

  const items = await prisma.post.count({
    where: {
      active: true,
    },
  })

  const last = Math.ceil(items / perPage)
  const prev = page > 1 ? page - 1 : null
  const next = page < last ? page + 1 : null

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
      isOwner: post.ownerId === studentId,
    }
  })

  response.json({
    result: 'success',
    first: 1,
    prev,
    next,
    last,
    items,
    data: postsResponse,
  })
}
