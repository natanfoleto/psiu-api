import { encrytPassword } from '@lib/bcrypt'
import { prisma } from '@lib/prisma'
import type { Prisma } from '@prisma/client'
import { generatePassword } from '@utils/generate-password'
import csvParser from 'csv-parser'
import { Request, Response } from 'express'
import { Stream } from 'stream'

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

  const students: Promise<Prisma.StudentCreateManyInput>[] = []

  const bufferStream = new Stream.Readable()

  bufferStream.push(request.file.buffer)
  bufferStream.push(null)

  try {
    bufferStream
      .pipe(csvParser({ separator: ';' }))
      .on('data', async (student) => {
        const processStudent = async () => {
          const password = generatePassword()
          const passwordHash = await encrytPassword(password)

          console.log(password)

          return {
            ...student,
            birthdate: new Date(student.birthdate),
            passwordHash,
          }
        }

        students.push(processStudent())
      })
      .on('end', async () => {
        const data = await Promise.all(students)

        await prisma.student.createMany({
          data,
        })

        console.log('Estudantes cadastrados')

        response.json({
          result: 'success',
          data,
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
