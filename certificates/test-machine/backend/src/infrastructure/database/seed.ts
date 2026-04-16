import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { getDb, persistDb, querySql } from './connection.js'

export async function seed(): Promise<void> {
  const db = await getDb()

  // ── Technologies ─────────────────────────────────────────────────────────
  const existingTechs = querySql<{ count: number }>('SELECT COUNT(*) as count FROM technologies')
  if (existingTechs[0].count === 0) {
    const now = new Date().toISOString()

    db.run(
      `INSERT INTO technologies (id, slug, name, description, isActive, levels, createdAt)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [
        uuidv4(),
        'react',
        'React',
        'React certification exam questions covering Hooks, Component Patterns, Performance, Server Components, and more.',
        JSON.stringify(['MID', 'SENIOR']),
        now
      ]
    )

    db.run(
      `INSERT INTO technologies (id, slug, name, description, isActive, levels, createdAt)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [
        uuidv4(),
        'typescript',
        'TypeScript',
        'TypeScript exam questions covering Types, Generics, Utility Types, Narrowing, and Declaration Files.',
        JSON.stringify(['FUNDAMENTALS', 'ADVANCED']),
        now
      ]
    )

    console.log('[seed] Technologies inserted')
  }

  // ── Admin user ────────────────────────────────────────────────────────────
  const existingAdmin = querySql<{ count: number }>(
    "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
  )
  if (existingAdmin[0].count === 0) {
    const passwordHash = await bcrypt.hash('Admin1234!', 12)
    db.run(
      `INSERT INTO users (id, email, passwordHash, displayName, role, createdAt)
       VALUES (?, ?, ?, ?, 'admin', ?)`,
      [uuidv4(), 'admin@test-machine.local', passwordHash, 'Admin', new Date().toISOString()]
    )
    console.log('[seed] Default admin created — email: admin@test-machine.local / password: Admin1234!')
  }

  persistDb()
}
