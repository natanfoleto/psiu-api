import { db } from '@database/client'
import { Request, Response } from 'express'

interface Params {
  id: string
}

export async function inactivateStudent(
  request: Request<Params>,
  response: Response,
): Promise<void> {
  const { id } = request.params

  const student = db.findUnique('students', { id })

  if (!student) {
    response.status(400).json({
      result: 'error',
      message: 'Student not found',
    })

    return
  }

  db.update('students', id, {
    active: false,
    updatedAt: new Date(),
  })

  response.json({
    result: 'success',
    message: 'Student inactivated',
  })
}
