"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signInWithOAuth(provider: "google" | "facebook" | "linkedin") {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error("OAuth error:", error)
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Check user type and redirect accordingly
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", data.user.id)
        .single()

      if (!userError && userData) {
        revalidatePath("/", "layout")
        if (userData.user_type === "provider") {
          redirect("/dashboard/prestador")
        } else {
          redirect("/dashboard/cliente")
        }
      }
    }

    revalidatePath("/", "layout")
    redirect("/")
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const name = formData.get("name")
  const phone = formData.get("phone")
  const userType = formData.get("userType") || "client"

  if (!email || !password || !name || !userType) {
    return { error: "Email, password, name and user type are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          name: name.toString(),
          user_type: userType.toString(),
          phone: phone?.toString() || null,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: email.toString(),
        name: name.toString(),
        phone: phone?.toString() || null,
        user_type: userType.toString(),
        active: true,
        verified: false,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }

      // If user is a provider, create provider profile
      if (userType === "provider") {
        const { error: providerError } = await supabase.from("providers").insert({
          id: data.user.id,
          profession: "Não especificado",
          experience: "Iniciante",
          hourly_rate: 0,
          rating: 0,
          total_reviews: 0,
          completed_jobs: 0,
          acceptance_rate: 100,
          response_time: "< 1 hora",
          work_radius: 10,
          joined_year: new Date().getFullYear(),
        })

        if (providerError) {
          console.error("Provider profile creation error:", providerError)
        }
      }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
