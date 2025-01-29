import { Request, Response } from 'express'

interface Body {
  password: string
}

export async function authenticateUpload(
  request: Request,
  response: Response,
): Promise<void> {
  const { password } = request.body as Body

  if (password === process.env.UPLOAD_PHRASE) {
    response.json({
      result: 'success',
      message: 'Senha de acesso verificada com sucesso!',
    })

    return
  }

  response.status(400).json({
    result: 'error',
    message: 'Falha ao verificar a senha de acesso!',
  })
}
