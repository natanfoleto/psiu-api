import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

export async function inactivateStudent(
  request: Request,
  response: Response,
): Promise<void> {
  const { studentId } = request

  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  })

  if (!student) {
    response.status(400).json({
      result: 'error',
      message: 'Estudante não encontrado',
    })

    return
  }

  await prisma.student.update({
    where: {
      id: studentId,
    },
    data: {
      active: false,
    },
  })

  response.json({
    result: 'success',
    message: 'Estudante deletado',
  })
}
