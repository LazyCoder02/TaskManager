// contexts/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "@/services/authService"

interface User{
    email: string,
    full_name: string,
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, full_name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      // Only attempt to get current user if there's a token
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      const user = await authService.getCurrentUser()
      setUser(user)
    } catch (error) {
      // Handle error silently - user will be null
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setUser(response.user)
  }

  const register = async (email: string, password: string, full_name: string) => {
    const response = await authService.register(email, password, full_name)
    setUser(response.user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}