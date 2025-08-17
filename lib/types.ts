export interface User {
  id: string
  firebase_uid: string
  email: string
  display_name: string | null
  created_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}
