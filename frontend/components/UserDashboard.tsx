"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useTasks, type Task } from "@/contexts/TaskContext"
import { TaskTable } from "@/components/TaskTable"
import TaskStats from "@/components/TaskStats"

const initialTaskStats = {
  tasksSet: 0,
  complete: 0,
  notes: 0,
  todo: 0,
}

export default function UserDashboard() {
  const { user } = useAuth()
  const { tasks } = useTasks()
  const [taskStats, setTaskStats] = useState(initialTaskStats)

  const updateStats = useCallback((tasks: Task[]) => {
    setTaskStats({
      tasksSet: tasks.length,
      complete: tasks.filter((task) => task.status === "completed").length,
      notes: tasks.filter((task) => task.description && task.description.trim() !== "").length,
      todo: tasks.filter((task) => task.status === "pending").length,
    })
  }, [])

  useEffect(() => {
    updateStats(tasks)
  }, [tasks, updateStats])

  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Welcome, {user.full_name}!</h1>
      <TaskStats
        tasksSet={taskStats.tasksSet}
        complete={taskStats.complete}
        notes={taskStats.notes}
        todo={taskStats.todo}
      />
      <div>
        <h2 className="mb-4 text-xl font-semibold dark:text-white">My Tasks</h2>
        <TaskTable />
      </div>
    </div>
  )
}

