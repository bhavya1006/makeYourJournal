import { motion } from 'motion/react';
import { BookOpen, Calendar } from 'lucide-react';
import { JournalEntry } from './TodayJournal';
import { useState } from 'react';

interface JournalArchiveProps {
  journalEntries: { [date: string]: JournalEntry };
}

export function JournalArchive({ journalEntries }: JournalArchiveProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // Group entries by month
  const getEntriesByMonth = () => {
    const grouped: { [month: string]: JournalEntry[] } = {};
    
    Object.values(journalEntries)
      .filter(entry => entry.content.trim() !== '')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach(entry => {
        const date = new Date(entry.date);
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        
        if (!grouped[monthKey]) {
          grouped[monthKey] = [];
        }
        grouped[monthKey].push(entry);
      });
    
    return grouped;
  };

  const entriesByMonth = getEntriesByMonth();
  const totalEntries = Object.values(journalEntries).filter(e => e.content.trim() !== '').length;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <BookOpen className="size-6 sm:size-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl text-gray-900">Journal Archive</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'} total
          </p>
        </div>

        {/* Entries by Month */}
        {Object.keys(entriesByMonth).length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-border">
            <BookOpen className="size-12 sm:size-16 mx-auto mb-4 text-gray-300" />
            <p className="text-sm sm:text-base text-gray-500">No journal entries yet</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">Start writing in your daily journal on the home page</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {Object.entries(entriesByMonth).map(([month, entries], monthIndex) => (
              <motion.div
                key={month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: monthIndex * 0.1 }}
              >
                {/* Month Header */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Calendar className="size-4 sm:size-5 text-blue-600" />
                  <h2 className="text-lg sm:text-xl text-gray-900">{month}</h2>
                  <span className="text-xs sm:text-sm text-gray-500">({entries.length})</span>
                </div>

                {/* Entries Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {entries.map((entry, entryIndex) => {
                    const date = new Date(entry.date);
                    const formattedDate = date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });
                    const isExpanded = expandedEntry === entry.date;

                    return (
                      <motion.div
                        key={entry.date}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: entryIndex * 0.05 }}
                        className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setExpandedEntry(isExpanded ? null : entry.date)}
                      >
                        <div className="p-4 sm:p-5">
                          {/* Entry Header */}
                          <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <h3 className="text-sm sm:text-base text-gray-900 line-clamp-1 flex-1">
                              {entry.title || 'Untitled'}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formattedDate}
                            </span>
                          </div>

                          {/* Entry Content */}
                          <p className={`text-gray-600 text-xs sm:text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
                            {entry.content}
                          </p>

                          {/* Expand/Collapse indicator */}
                          {entry.content.length > 150 && (
                            <button className="text-blue-600 text-xs sm:text-sm mt-2 hover:underline">
                              {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}