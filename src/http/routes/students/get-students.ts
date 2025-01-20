import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

export async function getStudents(
  request: Request,
  response: Response,
): Promise<void> {
  const students = await prisma.student.findMany({
    where: {
      active: true,
    },
  })

  response.json({
    result: 'success',
    data: students,
  })
}
