// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Plus, LogOut, Menu, X } from 'lucide-react';
// import { TaskGrid, Task } from './TaskGrid';
// import { TodayJournal, JournalEntry } from './TodayJournal';
// import { JournalArchive } from './JournalArchive';
// import { ProgressGraph } from './ProgressGraph';
// import { RocketGame } from './RocketGame';
// import { Navbar } from './Navbar';
// import { MonthlyTracker } from './MonthlyTracker';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import {
//   getTasks,
//   createTask as apiCreateTask,
//   deleteTask as apiDeleteTask,
//   toggleCompletion as apiToggleCompletion,
//   getCompletions,
//   getProgress,
//   getJournal,
//   upsertJournal
// } from '../lib/api';

// interface DashboardProps {
//   userName: string;
//   onSignOut: () => void;
// }

// interface DailyProgress {
//   date: string;
//   completion: number;
//   day: string;
//   tasksCompleted: number;
//   totalTasks: number;
// }

// export function Dashboard({ userName, onSignOut }: DashboardProps) {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [progressData, setProgressData] = useState<DailyProgress[]>([]);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [activePage, setActivePage] = useState<'home' | 'monthly' | 'journal'>('home');
//   const [currentStreak, setCurrentStreak] = useState(0);
//   const [longestStreak, setLongestStreak] = useState(0);
//   const [days, setDays] = useState<{ date: string; dayName: string; dayNum: number }[]>([]);
//   const [journalEntries, setJournalEntries] = useState<{ [date: string]: JournalEntry }>({});
//   const [showTaskAddedAnimation, setShowTaskAddedAnimation] = useState(false);

//   // Sound effect for task completion
//   const playSuccessSound = () => {
//     const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();

//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);

//     // Create a pleasant "ding" sound
//     oscillator.type = 'sine';
//     oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
//     oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

//     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

//     oscillator.start(audioContext.currentTime);
//     oscillator.stop(audioContext.currentTime + 0.3);
//   };

//   // Load journal entries from localStorage
//   useEffect(() => {
//     const savedJournal = localStorage.getItem('journalEntries');
//     if (savedJournal) {
//       setJournalEntries(JSON.parse(savedJournal));
//     } else {
//       // Add sample journal entries for the last 3 days
//       const sampleEntries: { [date: string]: JournalEntry } = {};
//       const today = new Date();

//       // Yesterday
//       const yesterday = new Date(today);
//       yesterday.setDate(yesterday.getDate() - 1);
//       sampleEntries[yesterday.toLocaleDateString()] = {
//         date: yesterday.toLocaleDateString(),
//         title: 'Productive Day at Work',
//         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Had a great meeting with the team today about the new project. Made significant progress on the task tracker feature. Feeling accomplished and ready to tackle tomorrow\'s challenges. Also managed to squeeze in a good workout session in the evening.',
//       };

//       // 2 days ago
//       const twoDaysAgo = new Date(today);
//       twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
//       sampleEntries[twoDaysAgo.toLocaleDateString()] = {
//         date: twoDaysAgo.toLocaleDateString(),
//         title: 'Learning and Growth',
//         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Spent most of the day learning new React patterns and best practices. Discovered some really interesting hooks that will make my code cleaner. Also took time to read a chapter from my personal development book. The weather was perfect for an afternoon walk.',
//       };

//       // 3 days ago
//       const threeDaysAgo = new Date(today);
//       threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
//       sampleEntries[threeDaysAgo.toLocaleDateString()] = {
//         date: threeDaysAgo.toLocaleDateString(),
//         title: 'Weekend Reflections',
//         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Took time today to reflect on my goals and progress. Feels good to see how far I\'ve come this month. Spent quality time with family and friends. Sometimes it\'s important to step back and appreciate the moment rather than constantly pushing forward.',
//       };

//       setJournalEntries(sampleEntries);
//       localStorage.setItem('journalEntries', JSON.stringify(sampleEntries));
//     }
//   }, []);

//   // Save journal entries to localStorage
//   useEffect(() => {
//     if (Object.keys(journalEntries).length > 0) {
//       localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
//     }
//   }, [journalEntries]);

//   // Generate 10 days (past, present, future)
//   useEffect(() => {
//     const generatedDays = [];
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const today = new Date();

//     // Generate 10 days: 3 past days + today + 6 future days
//     for (let i = -3; i <= 6; i++) {
//       const date = new Date(today);
//       date.setDate(date.getDate() + i);
//       generatedDays.push({
//         date: date.toLocaleDateString(),
//         dayName: dayNames[date.getDay()],
//         dayNum: date.getDate(),
//       });
//     }

//     setDays(generatedDays);
//   }, []);

//   // Making change from here --------------------------

//   // Load tasks from localStorage
//   // useEffect(() => {
//   //   const savedTasks = localStorage.getItem('tasks');
//   //   if (savedTasks) {
//   //     setTasks(JSON.parse(savedTasks));
//   //   } else {
//   //     // Default tasks with some pre-filled data
//   //     const defaultTasks: Task[] = [
//   //       {
//   //         id: '1',
//   //         title: 'Morning Reading',
//   //         completionByDate: {},
//   //       },
//   //       {
//   //         id: '2',
//   //         title: 'Exercise',
//   //         completionByDate: {},
//   //       },
//   //       {
//   //         id: '3',
//   //         title: 'Code Practice',
//   //         completionByDate: {},
//   //       },
//   //     ];

//   //     // Add some test data for past days
//   //     const today = new Date();
//   //     for (let i = -3; i < 0; i++) {
//   //       const date = new Date(today);
//   //       date.setDate(date.getDate() + i);
//   //       const dateStr = date.toLocaleDateString();

//   //       // Randomly complete some tasks
//   //       defaultTasks.forEach(task => {
//   //         if (Math.random() > 0.3) {
//   //           task.completionByDate[dateStr] = true;
//   //         }
//   //       });
//   //     }

//   //     setTasks(defaultTasks);
//   //     localStorage.setItem('tasks', JSON.stringify(defaultTasks));
//   //   }
//   // }, []);
//   useEffect(() => {
//     const load = async () => {
//       try {
//         // load tasks
//         const { data: tasksData, error: tasksError } = await getTasks();
//         if (tasksError) throw tasksError;

//         // compute date range to request completions for (e.g., last 30 days or generated `days`)
//         const today = new Date();
//         const start = new Date(today);
//         start.setDate(start.getDate() - 30);
//         const startStr = start.toISOString().slice(0, 10);
//         const endStr = today.toISOString().slice(0, 10);

//         const { data: compsData } = await getCompletions(startStr, endStr);

//         // build completionByDate map on tasks
//         const tasksWithMap = (tasksData || []).map((t: any) => ({ ...t, completionByDate: {} as Record<string, boolean> }));
//         (compsData || []).forEach((c: any) => {
//           const t = tasksWithMap.find((tt: any) => tt.id === c.task_id);
//           if (t) t.completionByDate[c.date] = c.completed;
//         });

//         setTasks(tasksWithMap);
//       } catch (err) {
//         console.error('Failed to load tasks:', err);
//         // fallback: keep local default logic if you want
//       }
//     };
//     load();
//   }, []);

//   // Load today's journal from server (if any) and merge with local cache
//   useEffect(() => {
//     const loadTodayJournal = async () => {
//       const todayISO = new Date().toISOString().slice(0, 10);
//       try {
//         const { data, error } = await getJournal(todayISO);
//         if (!error && data) {
//           setJournalEntries(prev => ({ ...prev, [todayISO]: { date: data.date, title: data.title, content: data.content } }));
//         }
//       } catch (err) {
//         console.error('Failed to load today journal', err);
//       }
//     };
//     loadTodayJournal();
//   }, []);

//   // ----------------------------------till here

//   // Load progress data (from Supabase)
//   const loadProgress = async () => {
//     const today = new Date();
//     const start = new Date(today);
//     start.setDate(start.getDate() - 6); // last 7 days inclusive
//     const startStr = start.toISOString().slice(0, 10);
//     const endStr = today.toISOString().slice(0, 10);

//     try {
//       const res = await getProgress(startStr, endStr);
//       setProgressData(res);
//       calculateStreak(res);
//       localStorage.setItem('progressData', JSON.stringify(res));
//     } catch (err) {
//       console.error('Failed to load progress from server:', err);
//       // fallback to local cache or generated data
//       const saved = localStorage.getItem('progressData');
//       if (saved) {
//         setProgressData(JSON.parse(saved));
//         calculateStreak(JSON.parse(saved));
//       } else {
//         generateInitialProgressData();
//       }
//     }
//   };

//   useEffect(() => {
//     loadProgress();
//   }, [tasks, days]);

//   // Load streak data
//   useEffect(() => {
//     const savedCurrentStreak = localStorage.getItem('currentStreak');
//     const savedLongestStreak = localStorage.getItem('longestStreak');

//     if (savedCurrentStreak) setCurrentStreak(parseInt(savedCurrentStreak));
//     if (savedLongestStreak) setLongestStreak(parseInt(savedLongestStreak));
//   }, []);

//   // Save tasks to localStorage and update progress
//   useEffect(() => {
//     if (tasks.length > 0 && days.length > 0) {
//       localStorage.setItem('tasks', JSON.stringify(tasks));
//       updateProgressFromTasks();
//     }
//   }, [tasks, days]);

//   const updateProgressFromTasks = () => {
//     const data: DailyProgress[] = [];
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     // Only include days that have passed or today (not future days)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     days.forEach(day => {
//       const dayDate = new Date(day.date);
//       dayDate.setHours(0, 0, 0, 0);

//       // Only include if day is today or in the past
//       if (dayDate <= today) {
//         const totalTasks = tasks.length;
//         const tasksCompleted = tasks.filter(task => task.completionByDate?.[day.date] === true).length;
//         const completion = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

//         data.push({
//           date: day.date,
//           completion,
//           day: day.dayName,
//           tasksCompleted,
//           totalTasks,
//         });
//       }
//     });

//     // Keep only last 7 days for the graph
//     const last7Days = data.slice(-7);
//     setProgressData(last7Days);
//     localStorage.setItem('progressData', JSON.stringify(last7Days));
//     calculateStreak(last7Days);
//   };

//   const generateInitialProgressData = () => {
//     const data: DailyProgress[] = [];
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const today = new Date();

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(date.getDate() - i);

//       // Generate realistic test data with 3-4 active days
//       let totalTasks = 0;
//       let tasksCompleted = 0;

//       // Make last 4 days active (including today)
//       if (i <= 3) {
//         totalTasks = Math.floor(Math.random() * 3) + 4; // 4-6 tasks
//         tasksCompleted = Math.floor(Math.random() * 2) + Math.ceil(totalTasks * 0.5); // At least 50% completed
//       } else {
//         // Earlier days might have activity too
//         const hasActivity = Math.random() > 0.4;
//         if (hasActivity) {
//           totalTasks = Math.floor(Math.random() * 4) + 3; // 3-6 tasks
//           tasksCompleted = Math.floor(Math.random() * (totalTasks + 1));
//         }
//       }

//       const completion = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

//       data.push({
//         date: date.toLocaleDateString(),
//         completion,
//         day: days[date.getDay()],
//         tasksCompleted,
//         totalTasks,
//       });
//     }

//     setProgressData(data);
//     localStorage.setItem('progressData', JSON.stringify(data));
//     calculateStreak(data);
//   };

//   const calculateStreak = (data: DailyProgress[]) => {
//     let current = 0;
//     let longest = 0;
//     let tempStreak = 0;

//     // Sort data by date (newest first) and calculate current streak
//     const sortedData = [...data].sort((a, b) =>
//       new Date(b.date).getTime() - new Date(a.date).getTime()
//     );

//     // Check if today has any completed tasks
//     const today = new Date().toLocaleDateString();
//     const todayData = sortedData.find(d => d.date === today);

//     // Current streak: count consecutive days with at least 1 completed task from today backwards
//     for (let i = 0; i < sortedData.length; i++) {
//       const dayData = sortedData[i];
//       if (dayData.tasksCompleted > 0) {
//         current++;
//       } else {
//         break;
//       }
//     }

//     // Calculate longest streak
//     for (const dayData of data) {
//       if (dayData.tasksCompleted > 0) {
//         tempStreak++;
//         longest = Math.max(longest, tempStreak);
//       } else {
//         tempStreak = 0;
//       }
//     }

//     setCurrentStreak(current);
//     setLongestStreak(longest);
//     localStorage.setItem('currentStreak', current.toString());
//     localStorage.setItem('longestStreak', longest.toString());
//   };

//   const handleAddTask = async () => {
//     if (newTaskTitle.trim()) {
//       const { data, error } = await apiCreateTask(newTaskTitle.trim());
//       if (error) {
//         console.error(error);
//         return;
//       }
//       setTasks(prev => [...prev, { ...data, completionByDate: {} }]);
//       setNewTaskTitle('');
//       setShowTaskAddedAnimation(true);
//       setTimeout(() => setShowTaskAddedAnimation(false), 1000);
//     }
//   };
//   //   if (newTaskTitle.trim()) {
//   //     const newTask: Task = {
//   //       id: Date.now().toString(),
//   //       title: newTaskTitle.trim(),
//   //       completionByDate: {},
//   //     };
//   //     setTasks([...tasks, newTask]);
//   //     setNewTaskTitle('');
//   //     setShowTaskAddedAnimation(true);
//   //     setTimeout(() => setShowTaskAddedAnimation(false), 1000);
//   //   }
//   // };

//   const handleToggleCompletion = async (taskId: string, date: string) => {
//     try {
//       await apiToggleCompletion(taskId, date);
//       // Update local state optimistically
//       setTasks(prev => prev.map(task => {
//         if (task.id !== taskId) return task;
//         const newMap = { ...(task.completionByDate || {}) };
//         newMap[date] = !newMap[date];
//         return { ...task, completionByDate: newMap };
//       }));
//       playSuccessSound();
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   //   setTasks(tasks.map(task => {
//   //     if (task.id === taskId) {
//   //       const newCompletionByDate = { ...task.completionByDate };
//   //       newCompletionByDate[date] = !newCompletionByDate[date];
//   //       return { ...task, completionByDate: newCompletionByDate };
//   //     }
//   //     return task;
//   //   }));
//   //   playSuccessSound();
//   // };

//   const handleDeleteTask = async (id: string) => {
//     const { error } = await apiDeleteTask(id);
//     if (error) {
//       console.error(error);
//       return;
//     }
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   const handleUpdateJournal = async (date: string, content: string, title: string) => {
//     try {
//       const { data, error } = await upsertJournal(date, title, content);
//       if (error) {
//         console.error('Failed to save journal', error);
//         return;
//       }
//       setJournalEntries(prev => ({ ...prev, [date]: { date, content, title } }));
//     } catch (err) {
//       console.error('Failed to save journal', err);
//     }
//   };
//     //   setJournalEntries(prev => ({
//   //     ...prev,
//   //     [date]: { date, content, title }
//   //   }));
//   // };

//   const handleUpdateTodayJournal = (content: string, title: string) => {
//     handleUpdateJournal(todayDate, content, title);
//   };

//   // Calculate completion for today
//   const todayDate = new Date().toLocaleDateString();
//   const todayCompletedTasks = tasks.filter(task => task.completionByDate?.[todayDate] === true).length;
//   const totalTasks = tasks.length;
//   const todayJournalEntry = journalEntries[todayDate] || { date: todayDate, content: '', title: '' };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white">
//       {/* Navbar */}
//       <Navbar
//         activePage={activePage}
//         onPageChange={setActivePage}
//         userName={userName}
//         todayCompletedTasks={todayCompletedTasks}
//         totalTasks={totalTasks}
//         onSignOut={onSignOut}
//       />

//       {/* Page Content */}
//       {activePage === 'home' && (
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
//             {/* Tasks Section - Left/Center */}
//             <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//               {/* Add Task - Excel style */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="bg-white border border-border shadow-sm overflow-hidden rounded-2xl"
//               >
//                 {/* Toolbar */}
//                 <div className="bg-gray-50 border-b border-border px-3 sm:px-4 py-2">
//                   <span className="text-muted-foreground text-sm sm:text-base">Add New Task</span>
//                 </div>

//                 {/* Input Area */}
//                 <div className="p-3 sm:p-4">
//                   <div className="flex gap-2 sm:gap-3">
//                     <Input
//                       value={newTaskTitle}
//                       onChange={(e) => setNewTaskTitle(e.target.value)}
//                       onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
//                       placeholder="Enter task name..."
//                       className="flex-1 bg-white border-gray-300 text-sm sm:text-base"
//                     />
//                     <Button
//                       onClick={handleAddTask}
//                       className="bg-blue-600 text-white hover:bg-blue-700 px-3 sm:px-4"
//                     >
//                       <Plus className="size-4 sm:size-5" />
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Task Grid */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1, duration: 0.6 }}
//               >
//                 <TaskGrid
//                   tasks={tasks}
//                   days={days}
//                   onToggleCompletion={handleToggleCompletion}
//                   onDeleteTask={handleDeleteTask}
//                 />
//               </motion.div>

//               {/* Today's Journal */}
//               <TodayJournal
//                 journalEntry={todayJournalEntry}
//                 onUpdateJournal={handleUpdateTodayJournal}
//               />
//             </div>

//             {/* Progress Section - Right */}
//             <div className="lg:col-span-1 space-y-4 sm:space-y-6">
//               <ProgressGraph data={progressData} />
//               {/* Rocket Game - Fills remaining space */}
//               <div className="lg:flex-1">
//                 <RocketGame />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {activePage === 'monthly' && (
//         <MonthlyTracker tasks={tasks} />
//       )}

//       {activePage === 'journal' && (
//         <JournalArchive journalEntries={journalEntries} />
//       )}

//       {/* Task Added Animation */}
//       <AnimatePresence>
//         {showTaskAddedAnimation && (
//           <motion.div
//             initial={{ opacity: 0, y: 50, scale: 0.8 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -20, scale: 0.8 }}
//             transition={{ type: 'spring', damping: 15, stiffness: 200 }}
//             className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 z-50"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
//             >
//               <Plus className="size-5 sm:size-6 bg-white text-green-500 rounded-full p-1" />
//             </motion.div>
//             <span className="text-sm sm:text-base font-medium">Task added!</span>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



// ---------------------------------------------------------------------------------------

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
import { supabase } from '../lib/supabaseClient'
import {
  getTasks,
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  toggleCompletion as apiToggleCompletion,
  getCompletions,
  getProgress,
  getJournal,
  upsertJournal,
} from '../lib/api'

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
  /* ---------------- AUTH GUARD ---------------- */
  const [authReady, setAuthReady] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setAuthReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  if (!authReady) return null

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Please sign in to continue</p>
      </div>
    )
  }

  /* ---------------- STATE ---------------- */
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

  /* ---------------- DATES ---------------- */
  const todayISO = new Date().toISOString().slice(0, 10)

  /* ---------------- LOAD DAYS ---------------- */
  useEffect(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const arr = []

    for (let i = -3; i <= 6; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      arr.push({
        date: d.toISOString().slice(0, 10),
        dayName: dayNames[d.getDay()],
        dayNum: d.getDate(),
      })
    }

    setDays(arr)
  }, [])

  /* ---------------- LOAD TASKS + COMPLETIONS ---------------- */
  useEffect(() => {
    const load = async () => {
      const { data: tasksData } = await getTasks()

      const start = new Date()
      start.setDate(start.getDate() - 30)

      const { data: comps } = await getCompletions(
        start.toISOString().slice(0, 10),
        todayISO
      )

      const mapped = (tasksData || []).map((t: any) => ({
        ...t,
        completionByDate: {},
      }))

      ;(comps || []).forEach((c: any) => {
        const task = mapped.find((t: any) => t.id === c.task_id)
        if (task) task.completionByDate[c.date] = c.completed
      })

      setTasks(mapped)
    }

    load()
  }, [])

  /* ---------------- LOAD TODAY JOURNAL ---------------- */
  useEffect(() => {
    getJournal(todayISO).then(({ data }) => {
      if (data) {
        setJournalEntries(prev => ({
          ...prev,
          [todayISO]: {
            date: todayISO,
            title: data.title,
            content: data.content,
          },
        }))
      }
    })
  }, [])

  /* ---------------- PROGRESS ---------------- */
  useEffect(() => {
    const load = async () => {
      const start = new Date()
      start.setDate(start.getDate() - 6)

      const res = await getProgress(
        start.toISOString().slice(0, 10),
        todayISO
      )
      setProgressData(res)
    }

    load()
  }, [tasks])

  /* ---------------- HANDLERS ---------------- */
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    const { data } = await apiCreateTask(newTaskTitle.trim())
    if (!data) return

    setTasks(prev => [...prev, { ...data, completionByDate: {} }])
    setNewTaskTitle('')
    setShowTaskAddedAnimation(true)
    setTimeout(() => setShowTaskAddedAnimation(false), 800)
  }

  const handleToggleCompletion = async (taskId: string, date: string) => {
    await apiToggleCompletion(taskId, date)
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              completionByDate: {
                ...t.completionByDate,
                [date]: !t.completionByDate?.[date],
              },
            }
          : t
      )
    )
  }

  const handleDeleteTask = async (id: string) => {
    await apiDeleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const handleUpdateJournal = async (
    date: string,
    content: string,
    title: string
  ) => {
    await upsertJournal(date, title, content)
    setJournalEntries(prev => ({
      ...prev,
      [date]: { date, title, content },
    }))
  }

  /* ---------------- DERIVED ---------------- */
  const todayCompleted = tasks.filter(
    t => t.completionByDate?.[todayISO]
  ).length

  const todayJournal =
    journalEntries[todayISO] || { date: todayISO, title: '', content: '' }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        activePage={activePage}
        onPageChange={setActivePage}
        userName={userName}
        todayCompletedTasks={todayCompleted}
        totalTasks={tasks.length}
        onSignOut={onSignOut}
      />

      {activePage === 'home' && (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-xl p-4 flex gap-3">
              <Input
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                placeholder="Enter task..."
              />
              <Button onClick={handleAddTask}>
                <Plus className="size-4" />
              </Button>
            </div>

            <TaskGrid
              tasks={tasks}
              days={days}
              onToggleCompletion={handleToggleCompletion}
              onDeleteTask={handleDeleteTask}
            />

            <TodayJournal
              journalEntry={todayJournal}
              onUpdateJournal={(c, t) =>
                handleUpdateJournal(todayISO, c, t)
              }
            />
          </div>

          <div className="space-y-6">
            <ProgressGraph data={progressData} />
            <RocketGame />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl"
          >
            Task added!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
