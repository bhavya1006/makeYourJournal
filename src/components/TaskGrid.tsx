import { motion } from 'motion/react'
import { Check, Trash2 } from 'lucide-react'
import { useState } from 'react'

export interface Task {
  id: string
  title: string
  completionByDate: { [date: string]: boolean } // ISO date -> completed
}

interface TaskGridProps {
  tasks: Task[]
  days: { date: string; dayName: string; dayNum: number }[]
  onToggleCompletion: (taskId: string, date: string) => void
  onDeleteTask: (taskId: string) => void
}

const toISO = (d: Date) => d.toISOString().slice(0, 10)

export function TaskGrid({ tasks, days, onToggleCompletion, onDeleteTask }: TaskGridProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const todayISO = toISO(new Date())

  return (
    <div className="bg-white border border-border shadow-sm overflow-hidden rounded-2xl">
      {/* toolbar */}
      <div className="bg-gray-50 border-b border-border px-3 sm:px-4 py-2">
        <span className="text-muted-foreground text-sm sm:text-base">Task Tracker</span>
      </div>

      <div className="overflow-x-auto overflow-y-visible scrollbar-hide">
        <div className="min-w-max">

          {/* headers */}
          <div className="flex bg-gray-100 border-b-2 border-gray-300">
            <div className="bg-gray-100 border-r-2 border-gray-300 w-12 sm:w-14 py-2 flex justify-center">
              <span className="text-xs text-gray-500">#</span>
            </div>

            <div className="bg-gray-100 border-r-2 border-gray-300 px-3 sm:px-4 py-2 w-56 sm:w-72">
              <span className="text-gray-700 text-sm sm:text-base">Task Name</span>
            </div>

            {days.map(day => {
              const dayISO = toISO(new Date(day.date))
              const isToday = dayISO === todayISO
              const isFuture = dayISO > todayISO

              return (
                <div
                  key={day.date}
                  className={`flex-shrink-0 w-16 sm:w-20 px-1 py-2 text-center border-r border-gray-300 ${
                    isToday ? 'bg-blue-50' : isFuture ? 'bg-gray-100' : ''
                  }`}
                >
                  <p className={`text-xs ${isToday ? 'text-blue-600' : isFuture ? 'text-gray-400' : 'text-gray-500'}`}>
                    {day.dayName}
                  </p>
                  <p className={`text-sm ${isToday ? 'text-blue-700' : isFuture ? 'text-gray-400' : 'text-gray-700'}`}>
                    {day.dayNum}
                  </p>
                </div>
              )
            })}
          </div>

          {/* rows */}
          {tasks.map((task, taskIndex) => {
            const rowBg = taskIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'

            return (
              <motion.div
                key={task.id}
                className={`flex border-b border-gray-200 ${rowBg} hover:bg-blue-50/50`}
                onMouseEnter={() => setHoveredRow(task.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div className="border-r-2 border-gray-300 w-12 sm:w-14 py-2 flex justify-center">
                  <span className="text-xs text-gray-500">{taskIndex + 1}</span>
                </div>

                <div className="border-r-2 border-gray-300 px-3 sm:px-4 py-2 w-56 sm:w-72 flex justify-between">
                  <span className="truncate">{task.title}</span>
                  <button onClick={() => onDeleteTask(task.id)}>
                    <Trash2 className="size-3 text-red-600" />
                  </button>
                </div>

                {days.map(day => {
                  const dayISO = toISO(new Date(day.date))
                  const isFuture = dayISO > todayISO
                  const isCompleted = task.completionByDate?.[dayISO] === true
                  const cellKey = `${task.id}-${dayISO}`

                  return (
                    <div
                      key={day.date}
                      className="flex-shrink-0 w-16 sm:w-20 px-1 py-2 border-r border-gray-200"
                      onMouseEnter={() => !isFuture && setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="flex justify-center">
                        <button
                          onClick={() => !isFuture && onToggleCompletion(task.id, dayISO)}
                          disabled={isFuture}
                          className={`size-5 sm:size-6 rounded border-2 flex items-center justify-center ${
                            isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'
                          }`}
                        >
                          {isCompleted && <Check className="size-3 sm:size-4" strokeWidth={3} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
