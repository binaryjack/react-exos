import { v4 as uuidv4 } from 'uuid'
import { querySql, queryOneSql, runSql } from '../../infrastructure/database/connection.js'
import { Technology, TechnologyDto } from '../types.js'

function toDto(t: Technology): TechnologyDto {
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    isActive: t.isActive === 1,
    levels: JSON.parse(t.levels) as string[],
    createdAt: t.createdAt
  }
}

export function listTechnologies(activeOnly = true): TechnologyDto[] {
  const sql = activeOnly
    ? 'SELECT * FROM technologies WHERE isActive = 1 ORDER BY name'
    : 'SELECT * FROM technologies ORDER BY name'
  return querySql<Technology>(sql).map(toDto)
}

export function getTechnology(idOrSlug: string): TechnologyDto | null {
  const row = queryOneSql<Technology>(
    'SELECT * FROM technologies WHERE id = ? OR slug = ?',
    [idOrSlug, idOrSlug]
  )
  return row ? toDto(row) : null
}

export interface CreateTechnologyInput {
  slug: string
  name: string
  description?: string
  levels: string[]
}

export function createTechnology(input: CreateTechnologyInput): TechnologyDto {
  const existing = queryOneSql<Technology>('SELECT id FROM technologies WHERE slug = ?', [input.slug])
  if (existing) {
    throw Object.assign(new Error(`Technology with slug '${input.slug}' already exists`), { status: 409 })
  }
  const id = uuidv4()
  const now = new Date().toISOString()
  runSql(
    `INSERT INTO technologies (id, slug, name, description, isActive, levels, createdAt)
     VALUES (?, ?, ?, ?, 1, ?, ?)`,
    [id, input.slug, input.name, input.description ?? '', JSON.stringify(input.levels), now]
  )
  return toDto(queryOneSql<Technology>('SELECT * FROM technologies WHERE id = ?', [id])!)
}

export interface UpdateTechnologyInput {
  name?: string
  description?: string
  levels?: string[]
  isActive?: boolean
}

export function updateTechnology(id: string, input: UpdateTechnologyInput): TechnologyDto {
  const existing = queryOneSql<Technology>('SELECT * FROM technologies WHERE id = ?', [id])
  if (!existing) throw Object.assign(new Error('Technology not found'), { status: 404 })

  const updated: Technology = {
    ...existing,
    name: input.name ?? existing.name,
    description: input.description ?? existing.description,
    levels: input.levels !== undefined ? JSON.stringify(input.levels) : existing.levels,
    isActive: input.isActive !== undefined ? (input.isActive ? 1 : 0) : existing.isActive
  }

  runSql(
    `UPDATE technologies SET name = ?, description = ?, isActive = ?, levels = ? WHERE id = ?`,
    [updated.name, updated.description, updated.isActive, updated.levels, id]
  )
  return toDto(updated)
}
