import fs, { promises as fsp } from 'fs'
import path from 'path'
import { Bill, BillProduct, BillUser, Product, User } from '../types'

export interface DbSchema {
  users: User[]
  products: Product[]
  bills: Bill[]
  billUsers: BillUser[]
  billProducts: BillProduct[]
  meta: {
    userId: number
    productId: number
    billId: number
  }
}

const dataDir = path.join(__dirname, '../../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'database.json')

const createDefaultData = (): DbSchema => ({
  users: [],
  products: [],
  bills: [],
  billUsers: [],
  billProducts: [],
  meta: {
    userId: 0,
    productId: 0,
    billId: 0
  }
})

let cachedData: DbSchema | null = null

const loadDb = async (): Promise<DbSchema> => {
  if (cachedData) {
    return cachedData
  }

  try {
    const content = await fsp.readFile(dbPath, 'utf-8')
    cachedData = JSON.parse(content) as DbSchema
  } catch (error) {
    cachedData = createDefaultData()
    await fsp.writeFile(dbPath, JSON.stringify(cachedData, null, 2), 'utf-8')
  }

  if (!cachedData.meta) {
    cachedData.meta = { userId: 0, productId: 0, billId: 0 }
  }

  return cachedData
}

export const getDbData = async (): Promise<DbSchema> => {
  return loadDb()
}

export const saveDb = async (): Promise<void> => {
  if (!cachedData) {
    return
  }
  await fsp.writeFile(dbPath, JSON.stringify(cachedData, null, 2), 'utf-8')
}

export const initDb = async (): Promise<void> => {
  await loadDb()
  await saveDb()
}

export const getNextId = (data: DbSchema, key: 'userId' | 'productId' | 'billId'): number => {
  data.meta[key] += 1
  return data.meta[key]
}

