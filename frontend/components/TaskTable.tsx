"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTasks } from "@/contexts/TaskContext"
import { Plus } from "lucide-react"
import type { Task } from "@/contexts/TaskContext"
import axios from "axios"
import config from "@/contexts/config"

export function TaskTable() {
  const { tasks = [], addTask, updateTask, deleteTask, isLoading } = useTasks()
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    status: "pending",
    due_date: "",
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTask) {
        console.log('Attempting to update task:', editingTask)
        await updateTask(editingTask)
        setEditingTask(null)
      } else {
        console.log('Attempting to add new task:', newTask)
        console.log('Environment:', {
          apiUrl: config.hostUrl,
          token: localStorage.getItem("token") ? "Token exists" : "No token"
        })
        await addTask(newTask)
        setNewTask({ title: "", description: "", status: "pending", due_date: "" })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error submitting task:", error)
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data)
        console.error("Response status:", error.response?.status)
      } // Add error logging
      // Keep dialog open on error
      return
    }
  }

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  console.log("Current tasks:", tasks) // Add logging

  return (
    <div>
      <div className="mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingTask ? editingTask.title : newTask.title}
                  onChange={(e) =>
                    editingTask
                      ? setEditingTask({ ...editingTask, title: e.target.value })
                      : setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editingTask ? editingTask.description : newTask.description}
                  onChange={(e) =>
                    editingTask
                      ? setEditingTask({ ...editingTask, description: e.target.value })
                      : setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Enter task description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editingTask ? editingTask.due_date : newTask.due_date}
                  onChange={(e) =>
                    editingTask
                      ? setEditingTask({ ...editingTask, due_date: e.target.value })
                      : setNewTask({ ...newTask, due_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={editingTask ? editingTask.status : newTask.status}
                  onChange={(e) => {
                    const value = e.target.value as Task["status"]
                    editingTask
                      ? setEditingTask({ ...editingTask, status: value })
                      : setNewTask({ ...newTask, status: value })
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">{editingTask ? "Update" : "Add"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!tasks || tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-medium text-muted-foreground">
                      No tasks have been set, go after your goals!
                    </p>
                    <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add your first task
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.due_date}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        task.status === "completed"
                          ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                          : task.status === "in-progress"
                            ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                            : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                      }`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingTask(task)
                        setIsDialogOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => task.id && deleteTask(task.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

