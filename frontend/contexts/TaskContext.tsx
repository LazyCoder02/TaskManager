"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import axios from "axios"

export interface Task {
  id?: number
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  due_date?: string
  createdAt?: Date
  updatedAt?: Date
}

interface TaskContextType {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  deleteTask: (id: number) => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // First, let's add a base URL constant
  const API_URL = 'http://localhost:4000/api'

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("No token found - clearing tasks")
      setTasks([])
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Fetched tasks:", response.data)
      setTasks(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError("Failed to fetch tasks")
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      console.log("Adding task:", task)
      // Use the consistent API_URL
      const response = await axios.post(`${API_URL}/tasks`, task, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Task added:", response.data)
      fetchTasks();
      setTasks((prevTasks) => [...prevTasks, response.data])
      setError(null)
    } catch (err) {
      console.error("Error adding task:", err)
      setError("Failed to add task")
    } finally {
      setIsLoading(false)
    }
  }

  const updateTask = async (updatedTask: Task) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      // Use the consistent API_URL
      const response = await axios.put(`${API_URL}/tasks/${updatedTask.id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks((prevTasks) => prevTasks.map((t) => (t.id === updatedTask.id ? response.data : t)))
      setError(null)
    } catch (err) {
      console.error("Error updating task:", err)
      setError("Failed to update task")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTask = async (id: number) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      // Use the consistent API_URL
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id))
      setError(null)
    } catch (err) {
      console.error("Error deleting task:", err)
      setError("Failed to delete task")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("Initial fetch of tasks")
    fetchTasks()
  }, [fetchTasks])

  return (
    <TaskContext.Provider value={{ tasks, isLoading, error, fetchTasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}

