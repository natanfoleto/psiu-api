declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    JWT_SECRET: string
    JWT_EXPIRES_IN: string
    JWT_MAX_AGE: string
    UPLOAD_PHRASE: string
  }
}
