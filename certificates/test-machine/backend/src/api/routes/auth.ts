import { Router } from 'express'
import { z } from 'zod'
import * as authService from '../../domain/auth/auth.service.js'
import { authenticate, AuthRequest } from '../middleware/authenticate.js'

export const authRouter: Router = Router()

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(64)
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

authRouter.post('/register', async (req, res) => {
  const result = RegisterSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error.issues[0].message })
    return
  }
  try {
    const data = await authService.register(result.data)
    res.status(201).json({ success: true, data })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})

authRouter.post('/login', async (req, res) => {
  const result = LoginSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error.issues[0].message })
    return
  }
  try {
    const data = await authService.login(result.data)
    res.json({ success: true, data })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})

authRouter.get('/me', authenticate, (req: AuthRequest, res) => {
  try {
    const user = authService.me(req.user!.sub)
    res.json({ success: true, data: user })
  } catch (err: unknown) {
    const e = err as Error & { status?: number }
    res.status(e.status ?? 500).json({ success: false, error: e.message })
  }
})
