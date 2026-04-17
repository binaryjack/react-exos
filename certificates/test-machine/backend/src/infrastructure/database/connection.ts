import { createRequire } from 'module'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initSqlJs = require('sql.js') as (config?: any) => Promise<any>

const DB_DIR = path.resolve(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'test-machine.db')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDb(): Promise<any> {
  if (_db) return _db

  const SQL = await initSqlJs()

  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true })
  }

  if (existsSync(DB_PATH)) {
    const fileBuffer = readFileSync(DB_PATH)
    _db = new SQL.Database(fileBuffer)
  } else {
    _db = new SQL.Database()
  }

  return _db
}

export function persistDb(): void {
  if (!_db) return
  // Skip file persistence in test environment
  if (process.env.NODE_ENV === 'test') return
  const data: Uint8Array = _db.export()
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true })
  }
  writeFileSync(DB_PATH, Buffer.from(data))
}

// Helper: run a statement and persist
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runSql(sql: string, params: any[] = []): void {
  if (!_db) throw new Error('DB not initialised — call getDb() first')
  _db.run(sql, params)
  persistDb()
}

// Helper: query returning all rows as objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function querySql<T = Record<string, unknown>>(sql: string, params: any[] = []): T[] {
  if (!_db) throw new Error('DB not initialised — call getDb() first')
  const stmt = _db.prepare(sql)
  stmt.bind(params)
  const rows: T[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return rows
}

// Helper: query returning a single row or null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function queryOneSql<T = Record<string, unknown>>(sql: string, params: any[] = []): T | null {
  const rows = querySql<T>(sql, params)
  return rows.length > 0 ? rows[0] : null
}

/**
 * TEST-ONLY — inject a pre-built sql.js in-memory database.
 * Disables file persistence for the lifetime of that DB.
 * Call with `null` to reset to the uninitialised state.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _initTestDb(db: any | null): void {
  _db = db
}
