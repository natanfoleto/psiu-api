import multer from 'multer'

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (request, file, callback) => {
    const allowMimeTypes = ['text/csv', 'application/vnd.ms-excel']

    if (allowMimeTypes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(
        new Error('Formato de arquivo inválido. Apenas CSV é permitido.'),
      )
    }
  },
})

export default upload
