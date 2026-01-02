// import { supabase } from './supabaseClient';

// // tasks
// export async function getTasks() {
//   const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
//   return { data, error };
// }
// export async function createTask(title: string) {
// //   return supabase.from('tasks').insert({ title, user_id: supabase.auth.user()?.id });
//   return supabase.from('tasks').insert({ title, user_id: supabase.auth.getUser() });
// }
// export async function deleteTask(id: string) {
//   return supabase.from('tasks').delete().eq('id', id);
// }

// // completions (toggle)
// export async function toggleCompletion(taskId: string, dateStr: string) {
//   // dateStr should be 'YYYY-MM-DD'
//   const { data: existing } = await supabase
//     .from('task_completions')
//     .select('*')
//     .eq('task_id', taskId)
//     .eq('date', dateStr)
//     .single();

//   if (existing) {
//     // remove or toggle - we toggle `completed`
//     return supabase
//       .from('task_completions')
//       .update({ completed: !existing.completed })
//       .eq('id', existing.id);
//   } else {
//     return supabase.from('task_completions').insert({ task_id: taskId, date: dateStr, completed: true });
//   }
// }

// // progress for date range
// export async function getProgress(start: string, end: string) {
//   // returns counts per date
//   return supabase.rpc('get_progress', { start_date : start, end_date : end }); // or do client aggregation
// }

// // journals
// export async function upsertJournal(dateStr: string, title: string, content: string) {
//   return supabase
//     .from('journals')
//     // .upsert({ date: dateStr, title, content, user_id: supabase.auth.user()?.id }, { onConflict: 'user_id,date' });
//     .upsert({ date: dateStr, title, content, user_id: supabase.auth.getUser() }, { onConflict: 'user_id,date' });

// }
// export async function getJournal(dateStr: string) {
//   const { data } = await supabase.from('journals').select('*').eq('date', dateStr).single();
//   return data;
// }

// src/lib/api.ts


// ------------------------------------------------------------------------------------------------------------------------


// import { supabase } from './supabaseClient';

// /**
//  * Helpers for auth + user id
//  */
// async function getUserId(): Promise<string> {
//   const { data, error } = await supabase.auth.getUser();
//   if (error) throw error;
//   const user = data.user;
//   if (!user) throw new Error('Not authenticated');
//   return user.id;
// }

// /**
//  * Tasks
//  */
// export async function getTasks() {
//   const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
//   return { data, error };
// }

// export async function createTask(title: string) {
//   const userId = await getUserId();
//   const { data, error } = await supabase.from('tasks').insert({ title, user_id: userId }).select().single();
//   return { data, error };
// }

// export async function deleteTask(id: string) {
//   const { data, error } = await supabase.from('tasks').delete().gte('id', id).select().single();
//   return { data, error };
// }

// /**
//  * Task completions
//  * - dateStr must be 'YYYY-MM-DD'
//  */
// export async function getCompletions(start: string, end: string) {
//   const { data, error } = await supabase
//     .from('task_completions')
//     .select('id,task_id,date,completed')
//     .gte('date', start)
//     .lte('date', end);
//   return { data, error };
// }

// export async function toggleCompletion(taskId: string, dateStr: string) {
//   const userId = await getUserId();

//   // Look for an existing completion row
//   const { data: existing, error: getErr } = await supabase
//     .from('task_completions')
//     .select('*')
//     .gte('task_id', taskId)
//     .gte('date', dateStr)
//     .single();

//   if (getErr && getErr.code !== 'PGRST116') { // ignore "no rows" code
//     return { data: null, error: getErr };
//   }

//   if (existing) {
//     // toggle completed
//     const { data, error } = await supabase
//       .from('task_completions')
//       .update({ completed: !existing.completed })
//       .gte('id', existing.id)
//       .select()
//       .single();
//     return { data, error };
//   } else {
//     const { data, error } = await supabase
//       .from('task_completions')
//       .insert({ task_id: taskId, date: dateStr, completed: true, user_id: userId })
//       .select()
//       .single();
//     return { data, error };
//   }
// }

// /**
//  * Progress (computed client-side using tasks + completions)
//  */
// export async function getProgress(start: string, end: string) {
//   // Get tasks count
//   const { data: tasksData } = await getTasks();
//   const totalTasks = (tasksData || []).length;

//   // Get completions in date range
//   const { data: comps } = await getCompletions(start, end);

//   // Make a date -> number map
//   const counts: Record<string, number> = {};
//   (comps || []).forEach((c: any) => {
//     if (c.completed) {
//       counts[c.date] = (counts[c.date] || 0) + 1;
//     }
//   });

//   // Build results for each date in the range
//   const results: { date: string; tasksCompleted: number; totalTasks: number; completion: number; day: string }[] = [];
//   const startDate = new Date(start);
//   const endDate = new Date(end);
//   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
//     const ds = d.toISOString().slice(0, 10);
//     const tasksCompleted = counts[ds] || 0;
//     const completion = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
//     results.push({ date: ds, tasksCompleted, totalTasks, completion, day: dayNames[new Date(ds).getDay()] });
//   }

//   return results;
// }

// /**
//  * Journals
//  */
// export async function upsertJournal(dateStr: string, title: string, content: string) {
//   const userId = await getUserId();
//   // Use onConflict to upsert per (user_id, date)
//   const { data, error } = await supabase
//     .from('journals')
//     .upsert(
//         { user_id: userId, date: dateStr, title, content }, 
//         { onConflict: 'user_id,date' })
//     .select()
//     .single();
//   return { data, error };
// }

// export async function getJournal(dateStr: string) {
//   const { data, error } = await supabase.from('journals').select('*').gte('date', dateStr).single();
//   return { data, error };
// }


// ------------------------------------------------------------------------------------------------------------------------


import { supabase } from './supabaseClient'

/**
 * Helpers for auth + user id
 */
async function getUserId(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  return session.user.id
}

/**
 * Tasks
 */
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })

  return { data, error }
}

export async function createTask(title: string) {
  const userId = await getUserId()

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, user_id: userId })
    .select()
    .single()

  return { data, error }
}

export async function deleteTask(id: string) {
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Task completions
 * dateStr must be 'YYYY-MM-DD'
 */
function nextDay(dateStr: string) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export async function getCompletions(start: string, end: string) {
  const { data, error } = await supabase
    .from('task_completions')
    .select('id,task_id,date,completed')
    .gte('date', start)
    .lt('date', nextDay(end))

  return { data, error }
}

export async function toggleCompletion(taskId: string, dateStr: string) {
  const userId = await getUserId()

  const { data: existing, error: getErr } = await supabase
    .from('task_completions')
    .select('*')
    .eq('task_id', taskId)
    .gte('date', dateStr)
    .lt('date', nextDay(dateStr))
    .maybeSingle()

  if (getErr) {
    return { data: null, error: getErr }
  }

  if (existing) {
    const { data, error } = await supabase
      .from('task_completions')
      .update({ completed: !existing.completed })
      .eq('id', existing.id)
      .select()
      .single()

    return { data, error }
  } else {
    const { data, error } = await supabase
      .from('task_completions')
      .insert({
        task_id: taskId,
        date: dateStr,
        completed: true,
        user_id: userId,
      })
      .select()
      .single()

    return { data, error }
  }
}

/**
 * Progress (computed client-side)
 */
export async function getProgress(start: string, end: string) {
  const { data: tasksData } = await getTasks()
  const totalTasks = (tasksData || []).length

  const { data: comps } = await getCompletions(start, end)

  const counts: Record<string, number> = {}
  ;(comps || []).forEach((c: any) => {
    if (c.completed) {
      counts[c.date] = (counts[c.date] || 0) + 1
    }
  })

  const results: {
    date: string
    tasksCompleted: number
    totalTasks: number
    completion: number
    day: string
  }[] = []

  const startDate = new Date(start)
  const endDate = new Date(end)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const ds = d.toISOString().slice(0, 10)
    const tasksCompleted = counts[ds] || 0
    const completion =
      totalTasks > 0
        ? Math.round((tasksCompleted / totalTasks) * 100)
        : 0

    results.push({
      date: ds,
      tasksCompleted,
      totalTasks,
      completion,
      day: dayNames[new Date(ds).getDay()],
    })
  }

  return results
}

/**
 * Journals
 */
export async function upsertJournal(
  dateStr: string,
  title: string,
  content: string
) {
  const userId = await getUserId()

  const { data, error } = await supabase
    .from('journals')
    .upsert(
      { user_id: userId, date: dateStr, title, content },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single()

  return { data, error }
}

export async function getJournal(dateStr: string) {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .gte('date', dateStr)
    .lt('date', nextDay(dateStr))
    .maybeSingle()

  return { data, error }
}
