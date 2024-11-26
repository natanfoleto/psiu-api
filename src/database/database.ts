import fs from 'node:fs/promises'
import path from 'node:path'

const databasePath = path.join(__dirname, '../db.json')

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Row {
  id: string | number
  [key: string]: any
}

interface Where {
  [key: string]: any
}

interface Pagination {
  pag?: number
  take?: number
}

interface PaginatedResult<T> {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: T[]
}

export class Database {
  #database: { [key: string]: Row[] } = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist(): void {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
  }

  // SELECT MANY
  findMany(table: string, where?: Where): Row[] {
    let data = this.#database[table] ?? []

    if (where) {
      data = data.filter((row) => {
        return Object.entries(where).every(([key, value]) => {
          if (typeof row[key] === 'boolean') return row[key] === value

          return row[key]?.includes(value)
        })
      })
    }

    return data
  }

  findManyPagination(
    table: string,
    pagination: Pagination,
    where?: Where,
  ): PaginatedResult<Row> {
    let data = this.#database[table] ?? []

    if (where) {
      data = data.filter((row) => {
        return Object.entries(where).every(([key, value]) => {
          if (typeof row[key] === 'boolean') return row[key] === value

          return row[key]?.includes(value)
        })
      })
    }

    const totalItems = data.length // Total de itens filtrados
    const take = pagination.take ?? totalItems // Itens por página (ou todos)
    const pag = pagination.pag ?? 0 // Página atual (começando em 0)

    // Calcular "skip" com base na página
    const skip = pag * take

    const totalPages = Math.ceil(totalItems / take) // Quantidade total de páginas

    // Verificar se a página é válida
    if (pag < 0 || pag >= totalPages) {
      return {
        first: 0,
        prev: null,
        next: null,
        last: totalPages - 1,
        pages: totalPages,
        items: totalItems,
        data: [],
      }
    }

    // Dados paginados
    const paginatedData = data.slice(skip, skip + take)

    // Retornar o objeto de paginação
    return {
      first: 0,
      prev: pag > 0 ? pag - 1 : null,
      next: pag < totalPages - 1 ? pag + 1 : null,
      last: totalPages - 1,
      pages: totalPages,
      items: totalItems,
      data: paginatedData,
    }
  }

  // SELECT UNIQUE
  findUnique(table: string, where: Where): Row | null {
    const data = this.#database[table] ?? []

    const found = data.find((row) =>
      Object.entries(where).every(([key, value]) => row[key] === value),
    )

    return found ?? null
  }

  // INSERT
  create(table: string, data: Row): Row {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  // UPDATE
  update(
    table: string,
    id: string | number,
    data: Omit<Row, 'id'>,
  ): Row | null {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      const found = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = { ...found, ...data }
      this.#persist()

      return { id, ...data }
    }

    return null
  }

  // DELETE
  delete(table: string, id: string | number): Row | null {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      const [deletedRow] = this.#database[table].splice(rowIndex, 1)
      this.#persist()

      return deletedRow
    }

    return null
  }
}
