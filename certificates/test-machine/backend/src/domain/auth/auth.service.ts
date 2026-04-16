import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { querySql, queryOneSql, runSql } from '../../infrastructure/database/connection.js'
import { User, UserDto, UserRole } from '../types.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d'

export interface RegisterInput {
  email: string
  password: string
  displayName: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface TokenPayload {
  sub: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

function toDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt
  }
}

export async function register(input: RegisterInput): Promise<{ user: UserDto; token: string }> {
  const existing = queryOneSql<User>('SELECT * FROM users WHERE email = ?', [input.email.toLowerCase()])
  if (existing) {
    throw Object.assign(new Error('Email already in use'), { status: 409 })
  }

  const passwordHash = await bcrypt.hash(input.password, 12)
  const id = uuidv4()
  const now = new Date().toISOString()

  runSql(
    `INSERT INTO users (id, email, passwordHash, displayName, role, createdAt)
     VALUES (?, ?, ?, ?, 'candidate', ?)`,
    [id, input.email.toLowerCase(), passwordHash, input.displayName, now]
  )

  const user = queryOneSql<User>('SELECT * FROM users WHERE id = ?', [id])!
  const token = signToken(user)
  return { user: toDto(user), token }
}

export async function login(input: LoginInput): Promise<{ user: UserDto; token: string }> {
  const user = queryOneSql<User>('SELECT * FROM users WHERE email = ?', [input.email.toLowerCase()])
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 })
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 })
  }

  const token = signToken(user)
  return { user: toDto(user), token }
}

export function me(userId: string): UserDto {
  const user = queryOneSql<User>('SELECT * FROM users WHERE id = ?', [userId])
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return toDto(user)
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload
}

export function listAllUsers(): UserDto[] {
  return querySql<User>('SELECT * FROM users ORDER BY createdAt DESC').map(toDto)
}

function signToken(user: User): string {
  const payload: TokenPayload = { sub: user.id, email: user.email, role: user.role }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}
