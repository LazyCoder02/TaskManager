import axios from "axios"
import type { Task } from "@/contexts/TaskContext"
import config from "@/contexts/config"

const API_URL = config.hostUrl

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks")
  return response.data
}

export const createTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
  const response = await api.post("/tasks", task)
  return response.data
}

export const updateTask = async (task: Task): Promise<Task> => {
  const response = await api.put(`/tasks/${task.id}`, task)
  return response.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}

