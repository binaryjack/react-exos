/**
 * Test database helper
 *
 * Creates an isolated in-memory sql.js database for each test suite.
 * Uses _initTestDb() from the connection module to inject the test DB
 * so all service functions use it without file I/O.
 *
 * Usage:
 *   import { setupTestDb, teardownTestDb } from './__helpers__/db'
 *   beforeAll(setupTestDb)
 *   afterAll(teardownTestDb)
 */

import { createRequire } from 'module'
import { migrate } from '../../infrastructure/database/schema.js'
import { _initTestDb } from '../../infrastructure/database/connection.js'

const require = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initSqlJs = require('sql.js') as (config?: any) => Promise<any>

export async function setupTestDb(): Promise<void> {
  const SQL = await initSqlJs()
  const db = new SQL.Database()

  // Inject the in-memory DB — all runSql/querySql calls will use this
  _initTestDb(db)

  // Run schema migrations on the fresh in-memory DB
  await migrate()
}

export function teardownTestDb(): void {
  _initTestDb(null)
}
