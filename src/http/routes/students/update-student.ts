import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Body {
  name: string
  birthdate: string
}

export async function updateStudent(
  request: Request,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { name, birthdate } = request.body as Body

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
      name,
      birthdate: new Date(birthdate),
    },
  })

  response.json({
    result: 'success',
    message: 'Dados atualizados',
  })
}
