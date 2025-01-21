import { checkPassword, encrytPassword } from '@lib/bcrypt'
import { prisma } from '@lib/prisma'
import { Request, Response } from 'express'

interface Body {
  password: string
  newPassword: string
  confirmNewPassword: string
}

export async function updatePassword(
  request: Request,
  response: Response,
): Promise<void> {
  const { studentId } = request
  const { password, newPassword, confirmNewPassword } = request.body as Body

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

  const passwordMatch = await checkPassword(password, student.passwordHash)

  if (!passwordMatch) {
    response.status(401).json({
      result: 'error',
      message: 'Senha incorreta',
    })

    return
  }

  if (newPassword !== confirmNewPassword) {
    response.status(400).json({
      result: 'error',
      message: 'As senhas não deram match',
    })

    return
  }

  if (
    !newPassword.match(
      /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    )
  ) {
    response.status(400).json({
      result: 'error',
      message: 'A nova senha é fraca',
    })

    return
  }

  const passwordHash = await encrytPassword(newPassword)

  await prisma.student.update({
    where: {
      id: studentId,
    },
    data: {
      passwordHash,
    },
  })

  response.json({
    result: 'success',
    message: 'Senha atualizada',
  })
}
