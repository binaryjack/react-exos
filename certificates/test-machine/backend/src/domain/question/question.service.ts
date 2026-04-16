import { v4 as uuidv4 } from 'uuid'
import { querySql, queryOneSql, runSql } from '../../infrastructure/database/connection.js'
import { Question, QuestionDto } from '../types.js'
import { QuestionInput } from './question.schema.js'

function toDto(q: Question): QuestionDto {
  return {
    id: q.id,
    technologyId: q.technologyId,
    level: q.level,
    topic: q.topic,
    subtopic: q.subtopic,
    type: q.type,
    prompt: q.prompt,
    options: q.options ? (JSON.parse(q.options) as string[]) : null,
    answer: q.answer,
    difficulty: q.difficulty,
    estimatedTime: q.estimatedTime,
    explanation: q.explanation,
    references: JSON.parse(q.references) as string[],
    createdAt: q.createdAt
  }
}

export interface QuestionFilter {
  technologyId?: string
  level?: string
  topic?: string
  type?: string
}

export function listQuestions(filter: QuestionFilter = {}): QuestionDto[] {
  const conditions: string[] = []
  const params: unknown[] = []

  if (filter.technologyId) {
    conditions.push('technologyId = ?')
    params.push(filter.technologyId)
  }
  if (filter.level) {
    conditions.push('level = ?')
    params.push(filter.level)
  }
  if (filter.topic) {
    conditions.push('topic = ?')
    params.push(filter.topic)
  }
  if (filter.type) {
    conditions.push('type = ?')
    params.push(filter.type)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const sql = `SELECT * FROM questions ${where} ORDER BY topic, difficulty`
  return querySql<Question>(sql, params).map(toDto)
}

export function getQuestion(id: string): QuestionDto | null {
  const row = queryOneSql<Question>('SELECT * FROM questions WHERE id = ?', [id])
  return row ? toDto(row) : null
}

export function createQuestion(input: QuestionInput): QuestionDto {
  const id = uuidv4()
  const now = new Date().toISOString()
  runSql(
    `INSERT INTO questions
       (id, technologyId, level, topic, subtopic, type, prompt, options, answer,
        difficulty, estimatedTime, explanation, "references", createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.technologyId,
      input.level,
      input.topic,
      input.subtopic ?? '',
      input.type,
      input.prompt,
      input.options ? JSON.stringify(input.options) : null,
      input.answer,
      input.difficulty,
      input.estimatedTime,
      input.explanation ?? '',
      JSON.stringify(input.references ?? []),
      now
    ]
  )
  return toDto(queryOneSql<Question>('SELECT * FROM questions WHERE id = ?', [id])!)
}

export function updateQuestion(id: string, input: Partial<QuestionInput>): QuestionDto {
  const existing = queryOneSql<Question>('SELECT * FROM questions WHERE id = ?', [id])
  if (!existing) throw Object.assign(new Error('Question not found'), { status: 404 })

  const updated = {
    technologyId: input.technologyId ?? existing.technologyId,
    level: input.level ?? existing.level,
    topic: input.topic ?? existing.topic,
    subtopic: input.subtopic ?? existing.subtopic,
    type: input.type ?? existing.type,
    prompt: input.prompt ?? existing.prompt,
    options: input.options !== undefined
      ? (input.options ? JSON.stringify(input.options) : null)
      : existing.options,
    answer: input.answer ?? existing.answer,
    difficulty: input.difficulty ?? existing.difficulty,
    estimatedTime: input.estimatedTime ?? existing.estimatedTime,
    explanation: input.explanation ?? existing.explanation,
    references: input.references !== undefined
      ? JSON.stringify(input.references)
      : existing.references
  }

  runSql(
    `UPDATE questions SET
       technologyId = ?, level = ?, topic = ?, subtopic = ?, type = ?,
       prompt = ?, options = ?, answer = ?, difficulty = ?, estimatedTime = ?,
       explanation = ?, "references" = ?
     WHERE id = ?`,
    [
      updated.technologyId, updated.level, updated.topic, updated.subtopic, updated.type,
      updated.prompt, updated.options, updated.answer, updated.difficulty, updated.estimatedTime,
      updated.explanation, updated.references, id
    ]
  )
  return toDto(queryOneSql<Question>('SELECT * FROM questions WHERE id = ?', [id])!)
}

export function deleteQuestion(id: string): void {
  const existing = queryOneSql<Question>('SELECT id FROM questions WHERE id = ?', [id])
  if (!existing) throw Object.assign(new Error('Question not found'), { status: 404 })
  runSql('DELETE FROM questions WHERE id = ?', [id])
}

export interface QuestionStats {
  technologyId: string
  level: string
  topic: string
  count: number
}

export function getQuestionStats(): QuestionStats[] {
  return querySql<QuestionStats>(
    `SELECT technologyId, level, topic, COUNT(*) as count
     FROM questions
     GROUP BY technologyId, level, topic
     ORDER BY technologyId, level, topic`
  )
}
