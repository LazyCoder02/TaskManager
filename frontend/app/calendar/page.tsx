"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTasks } from "@/contexts/TaskContext"

export default function CalendarPage() {
  const { tasks } = useTasks() // Get tasks from the context
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => task.due_date && isSameDay(parseISO(task.due_date), date))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0 dark:text-white">Calendar</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg sm:text-xl font-semibold dark:text-gray-200">{format(currentDate, "MMMM yyyy")}</h2>
            <Button variant="outline" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 sm:mt-8 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">
          <div className="grid grid-cols-7 gap-px border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-center text-sm font-semibold">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="px-1 sm:px-4 py-2 dark:text-gray-200">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-700">
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="bg-white dark:bg-gray-800 p-1 sm:p-4" />
            ))}

            {days.map((day) => {
              const tasksForDay = getTasksForDate(day)
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "relative bg-white dark:bg-gray-800 p-1 sm:p-2 h-20 sm:h-32",
                    selectedDate && isSameDay(day, selectedDate) && "bg-blue-50 dark:bg-blue-900",
                    "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer",
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 rounded-full text-center leading-6 text-sm",
                      selectedDate && isSameDay(day, selectedDate) && "bg-blue-600 text-white",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {tasksForDay.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "rounded px-1 py-0.5 text-xs truncate",
                          task.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                            : task.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
                        )}
                      >
                        {task.title}
                      </div>
                    ))}
                    {tasksForDay.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">+{tasksForDay.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}

            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="bg-white dark:bg-gray-800 p-1 sm:p-4" />
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className="mt-4 sm:mt-8">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Tasks for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <div className="space-y-4">
              {getTasksForDate(selectedDate).map((task) => (
                <div key={task.id} className="rounded-lg border dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium dark:text-white">{task.title}</h4>
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
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
