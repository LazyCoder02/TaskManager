"use client"

import { useState, useEffect } from "react"
import { format, parseISO, isBefore } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useTasks } from "@/contexts/TaskContext"
import { cn } from "@/lib/utils"
import { Task } from "@/contexts/TaskContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'

export default function MyTasksPage() {
  const { tasks } = useTasks()
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.log('User is not here!');
      router.push("/");
    }
  }, []);
    

  const getTasksByDueDate = (tasks: typeof useTasks.prototype.tasks): typeof tasks => {
    return tasks.sort((a: any, b: any) => {
      if (a.dueDate && b.dueDate) {
        if (isBefore(parseISO(a.dueDate), parseISO(b.dueDate))) return -1
        if (isBefore(parseISO(b.dueDate), parseISO(a.dueDate))) return 1
      }
      return 0
    })
  }
  
  const filteredTasks = getTasksByDueDate(tasks).filter((task: Task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold dark:text-white">My Tasks</h1>

        <div className="mb-4 sm:mb-6 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <img
                src="/placeholder.svg?height=200&width=200"
                alt="No tasks"
                className="mb-4 h-32 w-32 sm:h-40 sm:w-40"
              />
              <p className="text-center text-base sm:text-lg font-medium dark:text-gray-200">
                Wow, such empty! Time to add some tasks or take a well-deserved nap. 😴
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task: Task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="mb-2 sm:mb-0 dark:text-white">{task.title}</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Due: {task.due_date ? format(parseISO(task.due_date), "MMM d, yyyy") : "No due date"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs",
                        task.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                          : task.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
                      )}
                    >
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created:{" "}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created:{" "}
                        {task.createdAt
                        ? format(new Date(task.createdAt), "MMM d, yyyy")
                            : "Unknown"}
                    </span>


                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

