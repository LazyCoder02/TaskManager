import { User } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"

interface AuthResponse {
  user: User
  token: string
}

interface User {
  id: string
  email: string
  full_name: string
}

export const authService = {
  async register(email: string, password: string, full_name: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, full_name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      if (data.token) {
        localStorage.setItem("user_id", data.user.id)
        localStorage.setItem("email", data.user.email)
        localStorage.setItem("full_name", data.user.full_name)
        localStorage.setItem("token", data.token)
      }

      return data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password")
      }

      if (data.token) {
        localStorage.setItem("user_id", data.user.id)
        localStorage.setItem("email", data.user.email)
        localStorage.setItem("full_name", data.user.full_name)
        localStorage.setItem("token", data.token)
      }

      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem("token")
    if (!token) return null
    const id = localStorage.getItem("user_id")
    const email = localStorage.getItem("email")
    const name = localStorage.getItem("full_name")
    const currentUser: User ={id: id, email: email, full_name: name }
    console.log("rafael was here", currentUser)
    return currentUser;

  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("full_name")
    localStorage.removeItem("email")
    localStorage.removeItem("user_id")
  },
}

