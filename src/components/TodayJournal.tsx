import { motion } from 'motion/react';
import { BookOpen, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export interface JournalEntry {
  date: string;
  content: string;
  title: string;
}

interface TodayJournalProps {
  journalEntry: JournalEntry;
  onUpdateJournal: (content: string, title: string) => void;
}

export function TodayJournal({ journalEntry, onUpdateJournal }: TodayJournalProps) {
  const [localTitle, setLocalTitle] = useState(journalEntry.title);
  const [localContent, setLocalContent] = useState(journalEntry.content);
  const [isSaved, setIsSaved] = useState(true);

  // Sync with prop changes
  useEffect(() => {
    setLocalTitle(journalEntry.title);
    setLocalContent(journalEntry.content);
  }, [journalEntry.date]);

  const handleSave = () => {
    onUpdateJournal(localContent, localTitle);
    setIsSaved(true);
  };

  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    setIsSaved(false);
  };

  const handleContentChange = (value: string) => {
    setLocalContent(value);
    setIsSaved(false);
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white border border-border shadow-sm overflow-hidden rounded-2xl"
    >
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-border px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm sm:text-base">Today's Journal</span>
          <Button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm ${
              isSaved
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Save className="size-3 sm:size-4" />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Journal Content */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Date Display */}
        <div className="flex items-center gap-2 text-gray-600 mb-3 sm:mb-4">
          <BookOpen className="size-4 sm:size-5 text-blue-600" />
          <span className="text-sm sm:text-base">{formattedDate}</span>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs sm:text-sm text-gray-600 mb-2">Title</label>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Give your day a title..."
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm sm:text-base"
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label className="block text-xs sm:text-sm text-gray-600 mb-2">Journal Entry</label>
          <textarea
            value={localContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="How was your day? What did you learn? What are you grateful for?"
            className="w-full h-48 sm:h-64 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all text-sm sm:text-base"
          />
        </div>

        {/* Word Count */}
        <div className="text-right text-xs sm:text-sm text-gray-500">
          {localContent.length} characters
        </div>
      </div>
    </motion.div>
  );
}