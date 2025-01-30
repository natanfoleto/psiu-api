import { encrytPassword } from '@lib/bcrypt'
import { prisma } from '@lib/prisma'
import type { Prisma } from '@prisma/client'
import { generatePassword } from '@utils/generate-password'
import csvParser from 'csv-parser'
import { Request, Response } from 'express'
import { Stream } from 'stream'

interface Student {
  ra: string
  name: string
  birthdate: string
  password_hash: string
}

interface StudentResponse {
  ra: string
  name: string
  birthdate: string
  password: string
}

export async function uploadStudents(
  request: Request,
  response: Response,
): Promise<void> {
  if (!request.file) {
    response.status(400).json({
      result: 'error',
      message: 'Nenhum arquivo foi enviado',
    })

    return
  }

  const bufferStream = new Stream.Readable()

  bufferStream.push(request.file.buffer)
  bufferStream.push(null)

  try {
    const rawStudents: Student[] = []
    const studentsForCreation: Prisma.StudentCreateManyInput[] = []
    const studentsResponse: StudentResponse[] = []

    bufferStream
      .pipe(csvParser({ separator: ';' }))
      .on('data', async (student) => {
        rawStudents.push(student)
      })
      .on('end', async () => {
        for (const student of rawStudents) {
          const studentByRa = await prisma.student.count({
            where: {
              ra: student.ra,
            },
          })

          if (studentByRa > 0) continue

          const password = generatePassword()
          const passwordHash = await encrytPassword(password)

          studentsForCreation.push({
            ...student,
            birthdate: new Date(student.birthdate),
            passwordHash,
          })

          studentsResponse.push({
            name: student.name,
            ra: student.ra,
            birthdate: student.birthdate,
            password,
          })
        }

        if (studentsForCreation.length > 0)
          await prisma.student.createMany({ data: studentsForCreation })

        response.json({
          result: 'success',
          data: studentsResponse,
          message: 'Estudantes cadastrados com sucesso',
        })
      })
  } catch (error) {
    console.error('Erro ao processar o arquivo: ', error)

    response.status(500).json({
      result: 'error',
      message: 'Erro ao processar o arquivo',
    })
  }
}
