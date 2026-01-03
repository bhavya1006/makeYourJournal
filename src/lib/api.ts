import { supabase } from './supabaseClient'

/**
 * ===============================
 * AUTH HELPERS
 * ===============================
 */
async function getUserId(): Promise<string> {
  // console.group('🔐 getUserId')

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    // console.error('❌ Error getting session:', error)
    // console.groupEnd()
    throw error
  }

  if (!data.session?.user) {
    // console.error('❌ No active session found')
    // console.groupEnd()
    throw new Error('Not authenticated')
  }

  // console.log('✅ User authenticated:', data.session.user.id)
  // console.groupEnd()
  return data.session.user.id
}

/**
 * ===============================
 * TASKS
 * ===============================
 */
export async function getTasks() {
  // console.group('📥 getTasks')

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })

  // if (error) console.error('❌ Failed to fetch tasks:', error)
  // else console.log(`✅ Tasks fetched: ${data.length}`)

  // console.groupEnd()
  return { data, error }
}

export async function createTask(title: string) {
  // console.group('➕ createTask')

  try {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, user_id: userId })
      .select()
      .single()

    // if (error) console.error('❌ Failed to create task:', error)
    // else console.log('✅ Task created:', data)

    return { data, error }
  } catch (err) {
    // console.error('❌ createTask crashed:', err)
    return { data: null, error: err }
  } finally {
    // console.groupEnd()
  }
}

export async function deleteTask(id: string) {
  // console.group('🗑 deleteTask')

  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .select()
    .single()

  // if (error) console.error('❌ Failed to delete task:', error)
  // else console.log('✅ Task deleted:', data)

  // console.groupEnd()
  return { data, error }
}

/**
 * ===============================
 * TASK COMPLETIONS
 * ===============================
 */
function nextDay(dateStr: string) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Fetch completions (row exists = completed)
 */
export async function getCompletions(start: string, end: string) {
  // console.group('📊 getCompletions')

  const { data, error } = await supabase
    .from('task_completions')
    .select('task_id, date')
    .gte('date', start)
    .lt('date', nextDay(end))

  // if (error) console.error('❌ Failed to fetch completions:', error)
  // else console.log(`✅ Completions fetched: ${data.length}`)

  // console.groupEnd()
  return { data, error }
}

/**
 * Toggle completion
 * INSERT = check
 * DELETE = uncheck
 */
export async function toggleCompletion(taskId: string, dateStr: string) {
  // console.group('🔁 toggleCompletion')

  try {
    const userId = await getUserId()

    const { data: existing, error: fetchErr } = await supabase
      .from('task_completions')
      .select('id')
      .eq('task_id', taskId)
      .eq('date', dateStr)
      .maybeSingle()

    if (fetchErr) {
      // console.error('❌ Fetch failed:', fetchErr)
      return { data: null, error: fetchErr }
    }

    // ✅ Already completed → UNCHECK → DELETE
    if (existing) {
      // console.log('☑️ Exists → deleting row')

      const { error } = await supabase
        .from('task_completions')
        .delete()
        .eq('id', existing.id)

      // if (error) console.error('❌ Delete failed:', error)
      // else console.log('✅ Unchecked successfully')

      return { data: null, error }
    }

    // ❌ Not completed → CHECK → INSERT
    // console.log('⬜ Not exists → inserting row')

    const { data, error } = await supabase
      .from('task_completions')
      .insert({
        task_id: taskId,
        user_id: userId,
        date: dateStr,
      })
      .select()
      .single()

    // if (error) console.error('❌ Insert failed:', error)
    // else console.log('✅ Checked successfully:', data)

    return { data, error }
  } catch (err) {
    // console.error('❌ toggleCompletion crashed:', err)
    return { data: null, error: err }
  } finally {
    // console.groupEnd()
  }
}

/**
 * ===============================
 * PROGRESS (CLIENT SIDE)
 * ===============================
 */
export async function getProgress(start: string, end: string) {
  // console.group('📈 getProgress')

  const { data: tasks } = await getTasks()
  const { data: completions } = await getCompletions(start, end)

  const totalTasks = tasks?.length || 0
  const counts: Record<string, number> = {}

  completions?.forEach(c => {
    counts[c.date] = (counts[c.date] || 0) + 1
  })

  const results = []
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (
    let d = new Date(start);
    d <= new Date(end);
    d.setDate(d.getDate() + 1)
  ) {
    const date = d.toISOString().slice(0, 10)
    const completed = counts[date] || 0

    results.push({
      date,
      tasksCompleted: completed,
      totalTasks,
      completion: totalTasks
        ? Math.round((completed / totalTasks) * 100)
        : 0,
      day: days[d.getDay()],
    })
  }

  // console.log('✅ Progress computed:', results)
  // console.groupEnd()
  return results
}

/**
 * ===============================
 * JOURNALS
 * ===============================
 */
export async function upsertJournal(
  dateStr: string,
  title: string,
  content: string
) {
  // console.group('📝 upsertJournal')

  try {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('journals')
      .upsert(
        { user_id: userId, date: dateStr, title, content },
        { onConflict: 'user_id,date' }
      )
      .select()
      .single()

    // if (error) console.error('❌ Journal upsert failed:', error)
    // else console.log('✅ Journal saved:', data)

    return { data, error }
  } catch (err) {
    // console.error('❌ upsertJournal crashed:', err)
    return { data: null, error: err }
  } finally {
    // console.groupEnd()
  }
}

export async function getJournal(dateStr: string) {
  // console.group('📖 getJournal')

  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .gte('date', dateStr)
    .lt('date', nextDay(dateStr))
    .maybeSingle()

  // if (error) console.error('❌ Fetch journal failed:', error)
  // else console.log('✅ Journal fetched:', data)

  // console.groupEnd()
  return { data, error }
}
