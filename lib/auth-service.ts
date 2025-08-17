import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth, googleProvider, isFirebaseConfigured } from "./firebase"
import { supabase } from "./supabase"

export interface AuthUser {
  id: string
  email: string
  name: string
  userType: "cliente" | "prestador"
  avatar?: string
}

export class AuthService {
  static async syncUserWithSupabase(firebaseUser: FirebaseUser, userType: "cliente" | "prestador"): Promise<AuthUser> {
    console.log("[v0] Sincronizando usuário com Supabase:", firebaseUser.email)

    // Verificar se usuário já existe no Supabase
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", firebaseUser.email).single()

    if (existingUser) {
      console.log("[v0] Usuário já existe no Supabase")
      return {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        userType: existingUser.user_type,
        avatar: existingUser.avatar_url,
      }
    }

    // Criar novo usuário no Supabase
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuário",
        user_type: userType,
        avatar_url: firebaseUser.photoURL,
        verified: firebaseUser.emailVerified,
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Erro ao criar usuário no Supabase:", error)
      throw new Error("Erro ao sincronizar dados do usuário")
    }

    // Se for prestador, criar perfil de prestador
    if (userType === "prestador") {
      await supabase.from("providers").insert({
        id: firebaseUser.uid,
        bio: "Novo prestador de serviços",
        experience: "iniciante",
        hourly_rate: 50,
        rating: 5,
        total_reviews: 0,
        completed_jobs: 0,
        acceptance_rate: 100,
        response_time: "< 1 hora",
        work_radius: 10,
        joined_year: new Date().getFullYear(),
      })
    }

    console.log("[v0] Usuário criado com sucesso no Supabase")
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      userType: newUser.user_type,
      avatar: newUser.avatar_url,
    }
  }

  static async signInWithEmail(email: string, password: string, userType: "cliente" | "prestador"): Promise<AuthUser> {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase não configurado")
    }

    const { user } = await signInWithEmailAndPassword(auth!, email, password)
    return await this.syncUserWithSupabase(user, userType)
  }

  static async signUpWithEmail(
    email: string,
    password: string,
    name: string,
    userType: "cliente" | "prestador",
  ): Promise<AuthUser> {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase não configurado")
    }

    const { user } = await createUserWithEmailAndPassword(auth!, email, password)
    return await this.syncUserWithSupabase(user, userType)
  }

  static async signInWithGoogle(userType: "cliente" | "prestador"): Promise<AuthUser> {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase não configurado")
    }

    const { user } = await signInWithPopup(auth!, googleProvider!)
    return await this.syncUserWithSupabase(user, userType)
  }

  static async signOut(): Promise<void> {
    if (isFirebaseConfigured() && auth) {
      await firebaseSignOut(auth)
    }
  }
}
