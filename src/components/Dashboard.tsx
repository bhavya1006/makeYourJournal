import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus } from 'lucide-react'
import { TaskGrid, Task } from './TaskGrid'
import { TodayJournal, JournalEntry } from './TodayJournal'
import { JournalArchive } from './JournalArchive'
import { ProgressGraph } from './ProgressGraph'
import { RocketGame } from './RocketGame'
import { Navbar } from './Navbar'
import { MonthlyTracker } from './MonthlyTracker'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  getTasks,
  createTask,
  deleteTask,
  toggleCompletion,
  getCompletions,
  getProgress,
  getJournal,
  upsertJournal,
} from '../lib/api'
import { supabase } from '../lib/supabaseClient'

interface DashboardProps {
  userName: string
  onSignOut: () => void
}

interface DailyProgress {
  date: string
  completion: number
  day: string
  tasksCompleted: number
  totalTasks: number
}

export function Dashboard({ userName, onSignOut }: DashboardProps) {
  /* ---------------- AUTH ---------------- */
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
  }, [])

  /* ---------------- STATE (MATCHES OLD CODE) ---------------- */
  const [tasks, setTasks] = useState<Task[]>([])
  const [progressData, setProgressData] = useState<DailyProgress[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [activePage, setActivePage] =
    useState<'home' | 'monthly' | 'journal'>('home')
  const [days, setDays] = useState<
    { date: string; dayName: string; dayNum: number }[]
  >([])
  const [journalEntries, setJournalEntries] = useState<{
    [date: string]: JournalEntry
  }>({})
  const [showTaskAddedAnimation, setShowTaskAddedAnimation] = useState(false)

  const todayDate = new Date().toISOString().slice(0, 10)

  /* ---------------- SOUND (UNCHANGED) ---------------- */
  const playSuccessSound = () => {
    const AudioCtx =
      window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(
      1200,
      ctx.currentTime + 0.1
    )

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + 0.3
    )

    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  }

  /* ---------------- DAYS (UNCHANGED) ---------------- */
  useEffect(() => {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const list = []

    for (let i = -3; i <= 6; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      list.push({
        date: d.toISOString().slice(0, 10),
        dayName: names[d.getDay()],
        dayNum: d.getDate(),
      })
    }

    setDays(list)
  }, [])

  /* ---------------- LOAD TASKS + COMPLETIONS (TIMED) ---------------- */
  useEffect(() => {
    if (!user) return

    const load = async () => {
      console.time('⏱ dashboard:initialLoad')

      console.time('⏱ backend:getTasks')
      const { data: tasksData } = await getTasks()
      console.timeEnd('⏱ backend:getTasks')

      console.time('⏱ backend:getCompletions')
      const start = new Date()
      start.setDate(start.getDate() - 30)
      const { data: comps } = await getCompletions(
        start.toISOString().slice(0, 10),
        todayDate
      )
      console.timeEnd('⏱ backend:getCompletions')

      console.time('⏱ ui:mapTasks')
      const mapped = (tasksData || []).map((t: any) => ({
        ...t,
        completionByDate: {},
      }))

        ; (comps || []).forEach((c: any) => {
          const task = mapped.find((t: any) => t.id === c.task_id)
          if (task) task.completionByDate[c.date] = true
        })
      console.timeEnd('⏱ ui:mapTasks')

      setTasks(mapped)
      console.timeEnd('⏱ dashboard:initialLoad')
    }

    load()
  }, [user])

  /* ---------------- LOAD JOURNAL (SAFE) ---------------- */
  useEffect(() => {
    if (!user) return

    console.time('⏱ backend:getJournal')
    getJournal(todayDate).then(({ data }) => {
      console.timeEnd('⏱ backend:getJournal')
      if (data) {
        setJournalEntries({
          [todayDate]: {
            date: todayDate,
            title: data.title,
            content: data.content,
          },
        })
      }
    })
  }, [user])

  /* ---------------- LOAD PROGRESS ---------------- */
  // useEffect(() => {
  //   if (!user) return

  //   console.time('⏱ backend:getProgress')
  //   getProgress(
  //     new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
  //     todayDate
  //   ).then(res => {
  //     console.timeEnd('⏱ backend:getProgress')
  //     setProgressData(res)
  //   })
  // }, [tasks, user])
  useEffect(() => {
    if (!user) return

    const loadProgress = async () => {
      console.time('⏱ backend:getProgress')

      const res = await getProgress(
        new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
        todayDate
      )

      console.timeEnd('⏱ backend:getProgress')
      setProgressData(res)
    }

    loadProgress()
  }, [tasks, user])

  /* ---------------- HANDLERS ---------------- */
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    console.time('⏱ backend:createTask')
    const { data } = await createTask(newTaskTitle.trim())
    console.timeEnd('⏱ backend:createTask')

    if (!data) return

    setTasks(prev => [...prev, { ...data, completionByDate: {} }])
    setNewTaskTitle('')
    setShowTaskAddedAnimation(true)
    setTimeout(() => setShowTaskAddedAnimation(false), 1000)
  }

  const handleToggleCompletion = async (taskId: string, date: string) => {
    console.time('⏱ total:toggle')

    console.time('⏱ ui:updateState')
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId) return task
        const updated = { ...(task.completionByDate || {}) }
        if (updated[date]) {
          delete updated[date]
        } else {
          updated[date] = true
          playSuccessSound()
        }
        return { ...task, completionByDate: updated }
      })
    )
    console.timeEnd('⏱ ui:updateState')

    console.time('⏱ backend:toggleCompletion')
    await toggleCompletion(taskId, date)
    console.timeEnd('⏱ backend:toggleCompletion')

    console.timeEnd('⏱ total:toggle')
  }

  const handleDeleteTask = async (id: string) => {
    console.time('⏱ backend:deleteTask')
    await deleteTask(id)
    console.timeEnd('⏱ backend:deleteTask')

    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const handleUpdateTodayJournal = async (
    content: string,
    title: string
  ) => {
    console.time('⏱ backend:upsertJournal')
    await upsertJournal(todayDate, title, content)
    console.timeEnd('⏱ backend:upsertJournal')

    setJournalEntries(prev => ({
      ...prev,
      [todayDate]: { date: todayDate, title, content },
    }))
  }

  /* ---------------- SAFE JOURNAL (KEY FIX) ---------------- */
  const todayJournalEntry: JournalEntry =
    journalEntries[todayDate] || {
      date: todayDate,
      title: '',
      content: '',
    }

  const todayCompletedTasks = tasks.filter(
    task => task.completionByDate?.[todayDate]
  ).length

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white">
      <Navbar
        activePage={activePage}
        onPageChange={setActivePage}
        userName={userName}
        todayCompletedTasks={todayCompletedTasks}
        totalTasks={tasks.length}
        onSignOut={onSignOut}
      />

      {activePage === 'home' && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white border rounded-2xl p-4"
              >
                <div className="flex gap-3">
                  <Input
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={e =>
                      e.key === 'Enter' && handleAddTask()
                    }
                    placeholder="Enter task name..."
                  />
                  <Button onClick={handleAddTask}>
                    <Plus />
                  </Button>
                </div>
              </motion.div>

              <TaskGrid
                tasks={tasks}
                days={days}
                onToggleCompletion={handleToggleCompletion}
                onDeleteTask={handleDeleteTask}
              />

              <TodayJournal
                journalEntry={todayJournalEntry}
                onUpdateJournal={handleUpdateTodayJournal}
              />
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <ProgressGraph data={progressData} />
              <RocketGame />
            </div>
          </div>
        </div>
      )}

      {activePage === 'monthly' && <MonthlyTracker tasks={tasks} />}
      {activePage === 'journal' && (
        <JournalArchive journalEntries={journalEntries} />
      )}

      <AnimatePresence>
        {showTaskAddedAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl"
          >
            Task added!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
