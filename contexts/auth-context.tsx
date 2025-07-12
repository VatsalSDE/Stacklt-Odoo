"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  reputation: number
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data and token
    const storedUser = localStorage.getItem("stackit_user")
    const storedToken = localStorage.getItem("stackit_token")
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        // Clear invalid data
        localStorage.removeItem("stackit_user")
        localStorage.removeItem("stackit_token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log('Attempting login for:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Login error response:', errorData)
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      console.log('Login successful:', data.user.username)
      
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem("stackit_user", JSON.stringify(data.user))
      localStorage.setItem("stackit_token", data.token)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log('Attempting signup for:', username, email)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      console.log('Signup response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Signup error response:', errorData)
        throw new Error(errorData.message || 'Registration failed')
      }

      const data = await response.json()
      console.log('Signup successful:', data.user.username)
      
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem("stackit_user", JSON.stringify(data.user))
      localStorage.setItem("stackit_token", data.token)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Signup error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("stackit_user")
    localStorage.removeItem("stackit_token")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
