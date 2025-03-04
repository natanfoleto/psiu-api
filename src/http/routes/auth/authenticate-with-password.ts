import { checkPassword } from '@lib/bcrypt'
import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'

interface Body {
  ra: string
  password: string
}

export async function authenticateWithPassword(
  request: Request,
  response: Response,
): Promise<void> {
  const { ra, password } = request.body as Body

  const student = await prisma.student.findUnique({
    where: {
      ra,
    },
  })

  if (!student) {
    response.status(401).json({
      result: 'error',
      message: 'RA ou senha incorretos',
    })

    return
  }

  if (!student.active) {
    response.status(401).json({
      result: 'error',
      message: 'RA ou senha incorretos',
    })

    return
  }

  const passwordMatch = await checkPassword(password, student.passwordHash)

  if (!passwordMatch) {
    response.status(401).json({
      result: 'error',
      message: 'RA ou senha incorretos',
    })

    return
  }

  const token = sign({ id: student.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  // Seta o token no cookie do response
  response.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: Number(process.env.JWT_MAX_AGE),
  })

  response.json({
    result: 'success',
    message: 'Logado com sucesso!',
    data: {
      student: {
        id: student.id,
        ra: student.ra,
        name: student.name,
        birthdate: student.birthdate,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      },
    },
  })
}
