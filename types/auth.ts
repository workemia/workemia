export type UserRole = 'client' | 'provider' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  type: UserRole
  service?: string
  isAdmin: boolean
}