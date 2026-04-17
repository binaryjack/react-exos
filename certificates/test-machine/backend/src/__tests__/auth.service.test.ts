import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { setupTestDb, teardownTestDb } from './__helpers__/db.js'
import { register, login, me } from '../domain/auth/auth.service.js'
import * as connection from '../infrastructure/database/connection.js'

// ── helpers ───────────────────────────────────────────────────────────────────

function runSql(sql: string, params: unknown[] = []) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(connection as any).runSql(sql, params)
}

// ── suite ─────────────────────────────────────────────────────────────────────

describe('auth.service', () => {
  beforeAll(setupTestDb)
  afterAll(teardownTestDb)

  // Clear users before each test so registrations don't bleed across cases
  beforeEach(() => {
    runSql('DELETE FROM users')
  })

  // ── register ────────────────────────────────────────────────────────────────

  describe('register()', () => {
    it('creates a user and returns a JWT token', async () => {
      const result = await register({
        email: 'alice@example.com',
        password: 'Password1!',
        displayName: 'Alice',
      })

      expect(result.user.email).toBe('alice@example.com')
      expect(result.user.displayName).toBe('Alice')
      expect(result.user.role).toBe('candidate')
      expect(typeof result.token).toBe('string')
      expect(result.token.split('.').length).toBe(3) // JWT structure
    })

    it('normalises email to lowercase', async () => {
      const result = await register({
        email: 'BOB@EXAMPLE.COM',
        password: 'Password1!',
        displayName: 'Bob',
      })
      expect(result.user.email).toBe('bob@example.com')
    })

    it('throws 409 when email already exists', async () => {
      await register({ email: 'dup@example.com', password: 'Abc123!', displayName: 'Dup' })

      await expect(
        register({ email: 'dup@example.com', password: 'Xyz789!', displayName: 'Dup2' })
      ).rejects.toMatchObject({ message: 'Email already in use', status: 409 })
    })

    it('does not return passwordHash in the DTO', async () => {
      const { user } = await register({
        email: 'carol@example.com',
        password: 'Secret99!',
        displayName: 'Carol',
      })
      // DTO type should not have passwordHash — verify at runtime too
      expect((user as Record<string, unknown>).passwordHash).toBeUndefined()
    })
  })

  // ── login ───────────────────────────────────────────────────────────────────

  describe('login()', () => {
    beforeEach(async () => {
      await register({ email: 'dave@example.com', password: 'Correct99!', displayName: 'Dave' })
    })

    it('returns user + token for valid credentials', async () => {
      const result = await login({ email: 'dave@example.com', password: 'Correct99!' })
      expect(result.user.email).toBe('dave@example.com')
      expect(typeof result.token).toBe('string')
    })

    it('is case-insensitive for email', async () => {
      const result = await login({ email: 'DAVE@EXAMPLE.COM', password: 'Correct99!' })
      expect(result.user.email).toBe('dave@example.com')
    })

    it('throws 401 for wrong password', async () => {
      await expect(
        login({ email: 'dave@example.com', password: 'WrongPass!' })
      ).rejects.toMatchObject({ message: 'Invalid credentials', status: 401 })
    })

    it('throws 401 for unknown email', async () => {
      await expect(
        login({ email: 'nobody@example.com', password: 'Whatever1!' })
      ).rejects.toMatchObject({ message: 'Invalid credentials', status: 401 })
    })
  })

  // ── me ───────────────────────────────────────────────────────────────────────

  describe('me()', () => {
    it('returns user DTO for a valid id', async () => {
      const { user } = await register({
        email: 'eve@example.com',
        password: 'Pass1234!',
        displayName: 'Eve',
      })
      const found = me(user.id)
      expect(found.id).toBe(user.id)
      expect(found.email).toBe('eve@example.com')
    })

    it('throws 404 for unknown id', () => {
      expect(() => me('00000000-0000-0000-0000-000000000000')).toThrow(
        expect.objectContaining({ status: 404 })
      )
    })
  })
})
