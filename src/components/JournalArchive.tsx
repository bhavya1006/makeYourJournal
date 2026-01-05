import { motion } from 'motion/react'
import { BookOpen, Calendar } from 'lucide-react'
import { JournalEntry } from './TodayJournal'
import { useState } from 'react'

interface JournalArchiveProps {
  journalEntries: { [date: string]: JournalEntry }
}

export function JournalArchive({ journalEntries }: JournalArchiveProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  const entriesByMonth = Object.values(journalEntries)
    .filter(e => e.content.trim() !== '')
    .sort(
      (a, b) =>
        new Date(`${b.date}T00:00:00`).getTime() -
        new Date(`${a.date}T00:00:00`).getTime()
    )
    .reduce((acc: Record<string, JournalEntry[]>, entry) => {
      const d = new Date(`${entry.date}T00:00:00`)
      const key = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      acc[key] = acc[key] || []
      acc[key].push(entry)
      return acc
    }, {})

  const totalEntries = Object.values(journalEntries).filter(e => e.content.trim() !== '').length

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          <h1 className="text-xl sm:text-2xl">Journal Archive</h1>
        </div>
        <p className="text-gray-600">{totalEntries} entries total</p>
      </div>

      {Object.keys(entriesByMonth).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border">
          <BookOpen className="mx-auto size-12 text-gray-300" />
          <p className="text-gray-500">No journal entries yet</p>
        </div>
      ) : (
        Object.entries(entriesByMonth).map(([month, entries]) => (
          <div key={month} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-blue-600" />
              <h2 className="text-lg sm:text-xl">{month}</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {entries.map(entry => {
                const d = new Date(`${entry.date}T00:00:00`)
                const label = d.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })
                const expanded = expandedEntry === entry.date

                return (
                  <motion.div
                    key={entry.date}
                    className="bg-white border rounded-2xl p-4 cursor-pointer"
                    onClick={() => setExpandedEntry(expanded ? null : entry.date)}
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="truncate">{entry.title || 'Untitled'}</h3>
                      <span className="text-xs text-gray-500">{label}</span>
                    </div>

                    <p className={`text-gray-600 ${expanded ? '' : 'line-clamp-3'}`}>
                      {entry.content}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
