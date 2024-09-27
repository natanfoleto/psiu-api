import { db } from '@database/client'
import { generatePassword } from '@utils/generate-password'
import { randomUUID } from 'crypto'
import { Request, Response } from 'express'

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

  console.log()

  const studentByRa = db.select('students', { ra })

  if (studentByRa.length) {
    response.status(400).json({
      result: 'error',
      message: `Students register ${ra} already exists`,
    })

    return
  }

  const student = {
    id: randomUUID(),
    ra,
    name,
    password: generatePassword(),
    birthdate: new Date(birthdate),
  }

  db.insert('students', student)

  response.status(201).json({
    result: 'success',
    message: 'Student profile created',
  })
}
