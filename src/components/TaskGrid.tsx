import { motion } from 'motion/react';
import { Check, Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface Task {
  id: string;
  title: string;
  completionByDate: { [date: string]: boolean }; // date -> completed status
}

interface TaskGridProps {
  tasks: Task[];
  days: { date: string; dayName: string; dayNum: number }[];
  onToggleCompletion: (taskId: string, date: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskGrid({ tasks, days, onToggleCompletion, onDeleteTask }: TaskGridProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="bg-white border border-border shadow-sm overflow-hidden rounded-2xl">
      {/* Excel-style toolbar */}
      <div className="bg-gray-50 border-b border-border px-3 sm:px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm sm:text-base">Task Tracker</span>
        </div>
      </div>

      {/* Grid Container - Everything scrolls together, no sticky columns */}
      <div className="overflow-x-auto overflow-y-visible scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <div className="min-w-max">
          {/* Column Headers - Excel style */}
          <div className="flex bg-gray-100 border-b-2 border-gray-300">
            {/* Row Number Column Header */}
            <div className="bg-gray-100 border-r-2 border-gray-300 w-12 sm:w-14 py-2 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-gray-500">#</span>
            </div>
            
            {/* Task Name Column Header */}
            <div className="bg-gray-100 border-r-2 border-gray-300 px-3 sm:px-4 py-2 w-56 sm:w-72 flex items-center flex-shrink-0">
              <span className="text-gray-700 text-sm sm:text-base">Task Name</span>
            </div>
            
            {/* Day Column Headers */}
            {days.map((day, index) => {
              const isToday = day.date === new Date().toLocaleDateString();
              const dayDate = new Date(day.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              dayDate.setHours(0, 0, 0, 0);
              const isFuture = dayDate > today;
              
              return (
                <div
                  key={day.date}
                  className={`flex-shrink-0 w-16 sm:w-20 px-1 py-2 text-center border-r border-gray-300 ${
                    isToday ? 'bg-blue-50' : isFuture ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className={`text-xs ${isToday ? 'text-blue-600' : isFuture ? 'text-gray-400' : 'text-gray-500'}`}>
                      {day.dayName}
                    </p>
                    <p className={`text-sm ${isToday ? 'text-blue-700' : isFuture ? 'text-gray-400' : 'text-gray-700'}`}>
                      {day.dayNum}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Task Rows */}
          <div>
            {tasks.map((task, taskIndex) => {
              const rowBg = taskIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30';
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: taskIndex * 0.03 }}
                  className={`flex border-b border-gray-200 ${
                    hoveredRow === task.id ? 'bg-blue-50/50' : rowBg
                  } hover:bg-blue-50/50 group`}
                  onMouseEnter={() => setHoveredRow(task.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Row Number */}
                  <div className={`${hoveredRow === task.id ? 'bg-blue-50/50' : rowBg} border-r-2 border-gray-300 w-12 sm:w-14 py-2 flex items-center justify-center group-hover:bg-blue-50/50 flex-shrink-0`}>
                    <span className="text-xs text-gray-500">{taskIndex + 1}</span>
                  </div>

                  {/* Task Name Cell */}
                  <div className={`${hoveredRow === task.id ? 'bg-blue-50/50' : rowBg} border-r-2 border-gray-300 px-3 sm:px-4 py-2 w-56 sm:w-72 flex items-center justify-between group-hover:bg-blue-50/50 flex-shrink-0`}>
                    <span className="text-gray-800 text-sm sm:text-base truncate pr-2">{task.title}</span>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 sm:p-1.5 hover:bg-red-100 rounded flex-shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="size-3 sm:size-3.5 text-red-600" />
                    </button>
                  </div>

                  {/* Checkbox Cells for Each Day */}
                  {days.map((day) => {
                    const isToday = day.date === new Date().toLocaleDateString();
                    const dayDate = new Date(day.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    dayDate.setHours(0, 0, 0, 0);
                    const isFuture = dayDate > today;
                    const isCompleted = task.completionByDate?.[day.date] || false;
                    const cellKey = `${task.id}-${day.date}`;
                    const isHovered = hoveredCell === cellKey;

                    return (
                      <div
                        key={day.date}
                        className={`flex-shrink-0 w-16 sm:w-20 px-1 py-2 border-r border-gray-200 ${
                          isToday ? 'bg-blue-50/70' : isFuture ? 'bg-gray-50/50' : ''
                        } ${isHovered && !isFuture ? 'bg-blue-100/50' : ''}`}
                        onMouseEnter={() => !isFuture && setHoveredCell(cellKey)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => !isFuture && onToggleCompletion(task.id, day.date)}
                            disabled={isFuture}
                            className={`size-5 sm:size-6 rounded border-2 flex items-center justify-center transition-all ${
                              isFuture
                                ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-40'
                                : isCompleted
                                ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                                : isHovered
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-300 bg-white'
                            }`}
                          >
                            {isCompleted && <Check className="size-3 sm:size-4" strokeWidth={3} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-gray-50/30 border-b border-gray-200">
              <p className="text-gray-500 text-sm sm:text-base">No tasks yet. Add your first task above!</p>
            </div>
          )}
        </div>
      </div>

      {/* Excel-style footer */}
      <div className="bg-gray-50 border-t border-border px-3 sm:px-4 py-2">
        <p className="text-xs text-gray-500">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • {days.length} days
        </p>
      </div>
    </div>
  );
}