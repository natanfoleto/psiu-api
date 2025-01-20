import { encrytPassword } from '@lib/bcrypt'
import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

// import { generatePassword } from '@utils/generate-password'

interface Body {
  ra: string
  name: string
  birthdate: string
}

export async function createStudent(
  request: Request,
  response: Response,
): Promise<void> {
  const { ra, name, birthdate } = request.body as Body

  const studentByRa = await prisma.student.findUnique({
    where: {
      ra,
    },
  })

  if (studentByRa) {
    response.status(400).json({
      result: 'error',
      message: `Já existe um estudante com o RA: ${ra}`,
    })

    return
  }

  // const password = generatePassword()
  const passwordHash = await encrytPassword('123456')

  await prisma.student.create({
    data: {
      name,
      ra,
      passwordHash,
      birthdate: new Date(birthdate),
    },
  })

  response.status(201).json({
    result: 'success',
    message: 'Estudante criado',
  })
}
