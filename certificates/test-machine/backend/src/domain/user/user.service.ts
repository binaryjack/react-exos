import { querySql, queryOneSql, runSql } from '../../infrastructure/database/connection.js'
import { User, UserDto } from '../types.js'
import { ExamSession } from '../types.js'
import { getUserSessions } from '../exam/exam.service.js'

function toDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt
  }
}

export function getProfile(userId: string): UserDto {
  const user = queryOneSql<User>('SELECT * FROM users WHERE id = ?', [userId])
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return toDto(user)
}

export function updateProfile(userId: string, input: { displayName?: string }): UserDto {
  const user = queryOneSql<User>('SELECT * FROM users WHERE id = ?', [userId])
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })

  if (input.displayName) {
    runSql('UPDATE users SET displayName = ? WHERE id = ?', [input.displayName, userId])
  }
  return toDto(queryOneSql<User>('SELECT * FROM users WHERE id = ?', [userId])!)
}

export interface UserStats {
  totalExams: number
  avgScore: number
  bestScore: number
  topicWeaknesses: { topic: string; avgScore: number; total: number }[]
}

export function getUserStats(userId: string): UserStats {
  const sessions = querySql<ExamSession>(
    'SELECT * FROM exam_sessions WHERE userId = ? AND submittedAt IS NOT NULL',
    [userId]
  )

  if (sessions.length === 0) {
    return { totalExams: 0, avgScore: 0, bestScore: 0, topicWeaknesses: [] }
  }

  const scores = sessions.map(s => s.score ?? 0)
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const bestScore = Math.max(...scores)

  // Aggregate topic scores across all sessions
  const topicMap: Record<string, { correct: number; total: number }> = {}
  for (const session of sessions) {
    if (!session.breakdown) continue
    const bd = JSON.parse(session.breakdown) as Record<string, { correct: number; total: number }>
    for (const [topic, stats] of Object.entries(bd)) {
      if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 }
      topicMap[topic].correct += stats.correct
      topicMap[topic].total += stats.total
    }
  }

  const topicWeaknesses = Object.entries(topicMap)
    .map(([topic, stats]) => ({
      topic,
      avgScore: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      total: stats.total
    }))
    .sort((a, b) => a.avgScore - b.avgScore)

  return { totalExams: sessions.length, avgScore, bestScore, topicWeaknesses }
}

export function getHistory(userId: string) {
  return getUserSessions(userId)
}
