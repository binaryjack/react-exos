import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { v4 as uuidv4 } from 'uuid'
import { setupTestDb, teardownTestDb } from './__helpers__/db.js'
import { generateExam, submitExam, getSession, getUserSessions } from '../domain/exam/exam.service.js'
import { createQuestion } from '../domain/question/question.service.js'
import { register } from '../domain/auth/auth.service.js'
import * as connection from '../infrastructure/database/connection.js'

// ── helpers ───────────────────────────────────────────────────────────────────

function runSql(sql: string, params: unknown[] = []) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(connection as any).runSql(sql, params)
}

// Fixed IDs so tests are predictable
const TECH_ID = uuidv4()

/** Seed a technology row + N questions, returning the question IDs */
function seedTechAndQuestions(count: number): string[] {
  runSql(
    `INSERT INTO technologies (id, slug, name, description, isActive, levels, createdAt)
     VALUES (?, 'react-test', 'React Test', '', 1, '["MID"]', ?)`,
    [TECH_ID, new Date().toISOString()]
  )

  const ids: string[] = []
  for (let i = 0; i < count; i++) {
    const q = createQuestion({
      technologyId: TECH_ID,
      level: 'MID',
      topic: i < Math.ceil(count / 2) ? 'Hooks' : 'Performance',
      type: 'mcq',
      prompt: `Question ${i + 1}: Which hook re-runs when deps change?`,
      options: ['useState', 'useEffect', 'useRef', 'useId'],
      answer: 'useEffect',
      difficulty: 3,
      estimatedTime: 60,
    })
    ids.push(q.id)
  }
  return ids
}

// ── suite ─────────────────────────────────────────────────────────────────────

describe('exam.service', () => {
  beforeAll(setupTestDb)
  afterAll(teardownTestDb)

  let userId: string

  beforeEach(async () => {
    // Clear tables in dependency order
    runSql('DELETE FROM exam_answers')
    runSql('DELETE FROM exam_sessions')
    runSql('DELETE FROM questions')
    runSql('DELETE FROM technologies')
    runSql('DELETE FROM users')

    // Fresh candidate user for each test
    const { user } = await register({
      email: 'tester@example.com',
      password: 'Test1234!',
      displayName: 'Tester',
    })
    userId = user.id

    seedTechAndQuestions(25)
  })

  // ── generateExam ────────────────────────────────────────────────────────────

  describe('generateExam()', () => {
    it('creates a session with the requested number of questions', () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 10, seed: 42 })

      expect(session.userId).toBe(userId)
      expect(session.technologyId).toBe(TECH_ID)
      expect(session.level).toBe('MID')
      expect(session.questionIds).toHaveLength(10)
      expect(session.submittedAt).toBeNull()
      expect(session.score).toBeNull()
    })

    it('defaults to 20 questions when count is not provided', () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', seed: 1 })
      expect(session.questionIds).toHaveLength(20)
    })

    it('caps at available question count when count > pool size', () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 999, seed: 1 })
      expect(session.questionIds.length).toBeLessThanOrEqual(25)
    })

    it('is deterministic with the same seed', () => {
      const a = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 10, seed: 99 })
      // Clear sessions, regenerate with same seed
      runSql('DELETE FROM exam_sessions')
      const b = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 10, seed: 99 })
      expect(a.questionIds).toEqual(b.questionIds)
    })

    it('throws 422 when no questions exist for that level', () => {
      expect(() =>
        generateExam({ userId, technologyId: TECH_ID, level: 'SENIOR', count: 5, seed: 1 })
      ).toThrow(expect.objectContaining({ status: 422 }))
    })
  })

  // ── getSession ──────────────────────────────────────────────────────────────

  describe('getSession()', () => {
    it('returns a session by id', () => {
      const created = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 5, seed: 7 })
      const fetched = getSession(created.id)
      expect(fetched?.id).toBe(created.id)
    })

    it('returns null for unknown id', () => {
      expect(getSession('00000000-0000-0000-0000-000000000000')).toBeNull()
    })
  })

  // ── getUserSessions ─────────────────────────────────────────────────────────

  describe('getUserSessions()', () => {
    it('returns all sessions for a user', () => {
      generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 5, seed: 1 })
      generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 5, seed: 2 })
      const sessions = getUserSessions(userId)
      expect(sessions).toHaveLength(2)
      sessions.forEach(s => expect(s.userId).toBe(userId))
    })

    it('returns empty array when user has no sessions', async () => {
      const { user: other } = await register({
        email: 'other@example.com',
        password: 'Other123!',
        displayName: 'Other',
      })
      expect(getUserSessions(other.id)).toHaveLength(0)
    })
  })

  // ── submitExam ──────────────────────────────────────────────────────────────

  describe('submitExam()', () => {
    it('scores 100% when all answers are correct', () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 5, seed: 10 })
      const answers = session.questionIds.map(qId => ({
        questionId: qId,
        userAnswer: 'useEffect', // the correct answer seeded above
        timeSpent: 30,
      }))

      const result = submitExam(session.id, userId, { answers })
      expect(result.score).toBe(100)
      expect(result.correctAnswers).toBe(5)
      expect(result.totalQuestions).toBe(5)
    })

    it('scores 0% when all answers are wrong', () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 5, seed: 11 })
      const answers = session.questionIds.map(qId => ({
        questionId: qId,
        userAnswer: 'useState', // wrong answer
        timeSpent: 15,
      }))

      const result = submitExam(session.id, userId, { answers })
      expect(result.score).toBe(0)
      expect(result.correctAnswers).toBe(0)
    })

    it('produces per-topic breakdown', () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 10, seed: 20 })
      const answers = session.questionIds.map(qId => ({
        questionId: qId,
        userAnswer: 'useEffect',
      }))
      const result = submitExam(session.id, userId, { answers })

      // Breakdown should have entries for each topic that appeared
      expect(typeof result.breakdown).toBe('object')
      const topicKeys = Object.keys(result.breakdown)
      expect(topicKeys.length).toBeGreaterThan(0)
      topicKeys.forEach(key => {
        expect(result.breakdown[key]).toHaveProperty('correct')
        expect(result.breakdown[key]).toHaveProperty('total')
      })
    })

    it('persists submittedAt and score on the session', () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 3, seed: 30 })
      submitExam(session.id, userId, { answers: [] }) // no answers = 0%

      const updated = getSession(session.id)
      expect(updated?.submittedAt).not.toBeNull()
      expect(updated?.score).toBe(0)
    })

    it('throws 409 when exam already submitted', () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 3, seed: 31 })
      submitExam(session.id, userId, { answers: [] })

      expect(() =>
        submitExam(session.id, userId, { answers: [] })
      ).toThrow(expect.objectContaining({ status: 409 }))
    })

    it('throws 403 when a different user tries to submit', async () => {
      const session = generateExam({ userId, technologyId: TECH_ID, level: 'MID', count: 3, seed: 32 })
      const { user: attacker } = await register({
        email: 'attacker@example.com',
        password: 'Attack99!',
        displayName: 'Attacker',
      })

      expect(() =>
        submitExam(session.id, attacker.id, { answers: [] })
      ).toThrow(expect.objectContaining({ status: 403 }))
    })

    it('throws 404 for a non-existent session', () => {
      expect(() =>
        submitExam('00000000-0000-0000-0000-000000000000', userId, { answers: [] })
      ).toThrow(expect.objectContaining({ status: 404 }))
    })
  })
})
