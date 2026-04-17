import { getDb, persistDb, queryOneSql } from '../connection.js'
import { migrate } from '../schema.js'
import { seed } from '../seed.js'
import { createQuestion } from '../../../domain/question/question.service.js'
import { reactMidQuestions } from './react-mid.js'
import { reactSeniorQuestions } from './react-senior.js'
import { typescriptQuestions } from './typescript.js'
import type { QuestionInput } from '../../../domain/question/question.schema.js'

const DIFFICULTY_MAP: Record<string, number> = { easy: 2, medium: 3, hard: 5 }

function normalise(q: Record<string, unknown>): QuestionInput {
  return { ...q, difficulty: DIFFICULTY_MAP[q.difficulty as string] ?? 3 } as QuestionInput
}

async function main() {
  console.log('[seed-questions] Initialising database...')
  await getDb()
  migrate()
  seed()

  // ── Look up technology IDs ───────────────────────────────────────────────
  const reactTech = queryOneSql<{ id: string }>(
    `SELECT id FROM technologies WHERE slug = 'react'`
  )
  const tsTech = queryOneSql<{ id: string }>(
    `SELECT id FROM technologies WHERE slug = 'typescript'`
  )

  if (!reactTech) throw new Error('[seed-questions] React technology not found — run base seed first')
  if (!tsTech) throw new Error('[seed-questions] TypeScript technology not found — run base seed first')

  const reactId = reactTech.id
  const tsId = tsTech.id

  console.log(`[seed-questions] React tech id: ${reactId}`)
  console.log(`[seed-questions] TypeScript tech id: ${tsId}`)

  // ── Check idempotency ────────────────────────────────────────────────────
  const existingReact = queryOneSql<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM questions WHERE technologyId = ?`,
    [reactId]
  )
  const existingTs = queryOneSql<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM questions WHERE technologyId = ?`,
    [tsId]
  )

  const reactCount = existingReact?.cnt ?? 0
  const tsCount = existingTs?.cnt ?? 0

  if (reactCount >= 150) {
    console.log(`[seed-questions] React already has ${reactCount} questions — skipping React seed`)
  } else {
    // Clear existing react questions for clean re-seed
    if (reactCount > 0) {
      console.log(`[seed-questions] Clearing ${reactCount} existing React questions for re-seed...`)
      const db = await getDb()
      db.run(`DELETE FROM questions WHERE technologyId = ?`, [reactId])
      persistDb()
    }

    console.log(`[seed-questions] Seeding ${reactMidQuestions.length} React MID questions...`)
    let midOk = 0
    for (const q of reactMidQuestions) {
      try {
        createQuestion(normalise({ ...q, technologyId: reactId }))
        midOk++
      } catch (e) {
        console.warn(`[seed-questions] WARN React MID: ${(e as Error).message} — "${q.prompt.slice(0, 60)}"`)
      }
    }
    console.log(`[seed-questions] ✓ React MID: ${midOk}/${reactMidQuestions.length} inserted`)

    console.log(`[seed-questions] Seeding ${reactSeniorQuestions.length} React SENIOR questions...`)
    let seniorOk = 0
    for (const q of reactSeniorQuestions) {
      try {
        createQuestion(normalise({ ...q, technologyId: reactId }))
        seniorOk++
      } catch (e) {
        console.warn(`[seed-questions] WARN React SENIOR: ${(e as Error).message} — "${q.prompt.slice(0, 60)}"`)
      }
    }
    console.log(`[seed-questions] ✓ React SENIOR: ${seniorOk}/${reactSeniorQuestions.length} inserted`)
  }

  if (tsCount >= 35) {
    console.log(`[seed-questions] TypeScript already has ${tsCount} questions — skipping TS seed`)
  } else {
    if (tsCount > 0) {
      console.log(`[seed-questions] Clearing ${tsCount} existing TypeScript questions for re-seed...`)
      const db = await getDb()
      db.run(`DELETE FROM questions WHERE technologyId = ?`, [tsId])
      persistDb()
    }

    console.log(`[seed-questions] Seeding ${typescriptQuestions.length} TypeScript questions...`)
    let tsOk = 0
    for (const q of typescriptQuestions) {
      try {
        createQuestion(normalise({ ...q, technologyId: tsId }))
        tsOk++
      } catch (e) {
        console.warn(`[seed-questions] WARN TypeScript: ${(e as Error).message} — "${q.prompt.slice(0, 60)}"`)
      }
    }
    console.log(`[seed-questions] ✓ TypeScript: ${tsOk}/${typescriptQuestions.length} inserted`)
  }

  // ── Final summary ────────────────────────────────────────────────────────
  const finalReact = queryOneSql<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM questions WHERE technologyId = ?`,
    [reactId]
  )
  const finalTs = queryOneSql<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM questions WHERE technologyId = ?`,
    [tsId]
  )
  const total = queryOneSql<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM questions`)

  console.log(`\n[seed-questions] ── Summary ──────────────────────────────`)
  console.log(`  React questions : ${finalReact?.cnt ?? 0}`)
  console.log(`  TypeScript qs   : ${finalTs?.cnt ?? 0}`)
  console.log(`  Total questions : ${total?.cnt ?? 0}`)
  console.log(`[seed-questions] Done ✓`)
}

main().catch((err) => {
  console.error('[seed-questions] Fatal error:', err)
  process.exit(1)
})
