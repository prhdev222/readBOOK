import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export interface AdminAuth {
  username: string
  password: string
}

// Admin credentials from environment
const ADMIN_CREDENTIALS: AdminAuth = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function createAdminToken(username: string): string {
  return jwt.sign(
    {
      username,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyAdminToken(token: string): { username: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return { username: decoded.username, role: decoded.role }
  } catch (error) {
    return null
  }
}

export async function setAdminAuthCookie(username: string) {
  const token = createAdminToken(username)
  cookies().set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  })
}

export async function getAdminFromCookie(): Promise<{ username: string; role: string } | null> {
  const token = cookies().get('admin_token')?.value
  if (!token) return null

  return verifyAdminToken(token)
}

export async function clearAdminAuthCookie() {
  cookies().delete('admin_token')
}

export async function requireAdmin() {
  const admin = await getAdminFromCookie()
  if (!admin) {
    throw new Error('Admin authentication required')
  }
  return admin
}