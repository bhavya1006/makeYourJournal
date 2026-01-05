import { motion } from 'motion/react';
import { Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from './TaskGrid';
import { useState } from 'react';

interface MonthlyTrackerProps {
  tasks: Task[];
}

export function MonthlyTracker({ tasks }: MonthlyTrackerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Generate current month calendar
  const generateMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    let dayCounter = 1;

    // Generate 6 weeks (max needed for any month)
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < startingDayOfWeek) || dayCounter > daysInMonth) {
          weekDays.push(null);
        } else {
          const date = new Date(year, month, dayCounter);
          const dateStr = date.toLocaleDateString();
          
          // Calculate tasks completed for this day
          const tasksCompleted = tasks.filter(
            task => task.completionByDate?.[dateStr] === true
          ).length;
          
          const completionRate = tasks.length > 0 ? (tasksCompleted / tasks.length) * 100 : 0;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const compareDate = new Date(date);
          compareDate.setHours(0, 0, 0, 0);
          
          weekDays.push({
            day: dayCounter,
            date: dateStr,
            tasksCompleted,
            totalTasks: tasks.length,
            completionRate,
            isToday: compareDate.getTime() === today.getTime(),
            isPast: compareDate < today,
          });
          dayCounter++;
        }
      }
      calendar.push(weekDays);
      if (dayCounter > daysInMonth) break;
    }

    return calendar;
  };

  const monthCalendar = generateMonthCalendar();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && 
                         currentDate.getFullYear() === new Date().getFullYear();

  // Calculate monthly stats
  const calculateMonthlyStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // If viewing current month, only count up to today
    const today = new Date();
    const endDate = isCurrentMonth ? 
      new Date(today.getFullYear(), today.getMonth(), today.getDate()) : 
      lastDay;
    
    let totalDays = 0;
    let activeDays = 0;
    let totalCompletions = 0;
    let possibleCompletions = 0;

    for (let d = new Date(firstDay); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateISO = d.toISOString().slice(0,10);
      totalDays++;
      
      const dayCompletions = tasks.filter(task => task.completionByDate?.[dateISO] === true).length;
      if (dayCompletions > 0) {
        activeDays++;
      }
      totalCompletions += dayCompletions;
      possibleCompletions += tasks.length;
    }

    const avgCompletionRate = possibleCompletions > 0 ? (totalCompletions / possibleCompletions) * 100 : 0;

    return {
      totalDays,
      activeDays,
      avgCompletionRate: Math.round(avgCompletionRate),
    };
  };

  const stats = calculateMonthlyStats();

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="size-6 sm:size-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl text-gray-900">Monthly Tracker</h1>
                <p className="text-sm sm:text-base text-gray-600">{monthName}</p>
              </div>
            </div>
            
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="size-8 sm:size-10 flex items-center justify-center rounded-lg bg-white border border-border hover:bg-gray-50 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4 sm:size-5 text-gray-600" />
              </button>
              
              {!isCurrentMonth && (
                <button
                  onClick={goToCurrentMonth}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Today
                </button>
              )}
              
              <button
                onClick={goToNextMonth}
                className="size-8 sm:size-10 flex items-center justify-center rounded-lg bg-white border border-border hover:bg-gray-50 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="size-4 sm:size-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-border rounded-xl sm:rounded-2xl p-2 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-1 sm:mb-2">
              <span className="text-gray-600 text-[10px] sm:text-base">Active Days</span>
              <TrendingUp className="size-3 sm:size-5 text-green-600 hidden sm:block" />
            </div>
            <p className="text-xl sm:text-3xl text-gray-900">{stats.activeDays}</p>
            <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">Days with completed tasks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-border rounded-xl sm:rounded-2xl p-2 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-1 sm:mb-2">
              <span className="text-gray-600 text-[10px] sm:text-base">Completion</span>
              <TrendingUp className="size-3 sm:size-5 text-blue-600 hidden sm:block" />
            </div>
            <p className="text-xl sm:text-3xl text-gray-900">{stats.avgCompletionRate}%</p>
            <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">Average task completion</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-border rounded-xl sm:rounded-2xl p-2 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-1 sm:mb-2">
              <span className="text-gray-600 text-[10px] sm:text-base">Total Tasks</span>
              <TrendingUp className="size-3 sm:size-5 text-purple-600 hidden sm:block" />
            </div>
            <p className="text-xl sm:text-3xl text-gray-900">{tasks.length}</p>
            <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">Tasks being tracked</p>
          </motion.div>
        </div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-border rounded-2xl p-4 sm:p-6"
        >
          <div className="space-y-2">
            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs sm:text-sm text-gray-600 py-1 sm:py-2">
                  <span className="hidden sm:inline">{day === 'Sun' ? 'Sunday' : day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : 'Saturday'}</span>
                  <span className="sm:hidden">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar days */}
            {monthCalendar.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1 sm:gap-2">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg sm:rounded-xl p-1 sm:p-2 transition-all text-xs sm:text-sm ${
                      day
                        ? day.isToday
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : day.isPast
                          ? day.completionRate >= 75
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : day.completionRate >= 50
                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                            : day.completionRate > 0
                            ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                            : 'bg-gray-50 text-gray-400 border-2 border-gray-200'
                          : 'bg-gray-50 text-gray-300 border-2 border-gray-200'
                        : 'bg-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <span className="text-sm sm:text-lg mb-0 sm:mb-1">{day.day}</span>
                        {day.isPast && day.tasksCompleted > 0 && (
                          <span className="text-[10px] sm:text-xs">
                            {day.tasksCompleted}/{day.totalTasks}
                          </span>
                        )}
                        {day.isToday && (
                          <span className="text-[10px] sm:text-xs hidden sm:inline">Today</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="size-5 sm:size-6 bg-green-100 border-2 border-green-300 rounded flex-shrink-0" />
              <span className="text-gray-600">75%+ done</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-5 sm:size-6 bg-blue-100 border-2 border-blue-300 rounded flex-shrink-0" />
              <span className="text-gray-600">50-74%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-5 sm:size-6 bg-yellow-100 border-2 border-yellow-300 rounded flex-shrink-0" />
              <span className="text-gray-600">1-49%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-5 sm:size-6 bg-gray-50 border-2 border-gray-200 rounded flex-shrink-0" />
              <span className="text-gray-600">No tasks</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}