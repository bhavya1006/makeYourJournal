import { Home, Calendar, BookOpen, LogOut } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activePage: 'home' | 'monthly' | 'journal';
  onPageChange: (page: 'home' | 'monthly' | 'journal') => void;
  userName: string;
  todayCompletedTasks: number;
  totalTasks: number;
  onSignOut: () => void;
}

export function Navbar({ activePage, onPageChange, userName, todayCompletedTasks, totalTasks, onSignOut }: NavbarProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 gap-2">
          {/* Left - User info */}
          <div className="hidden sm:block">
            <h2 className="text-base sm:text-lg">Welcome, {userName}</h2>
            <p className="text-muted-foreground text-xs hidden md:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Mobile - Just name or icon */}
          <div className="sm:hidden">
            <h2 className="text-sm">{userName}</h2>
          </div>

          {/* Center - Navigation */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => onPageChange('home')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 rounded-full transition-all text-xs sm:text-sm ${
                activePage === 'home'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="size-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={() => onPageChange('monthly')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 rounded-full transition-all text-xs sm:text-sm ${
                activePage === 'monthly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="size-3.5" />
              <span className="hidden sm:inline">Monthly</span>
            </button>
            <button
              onClick={() => onPageChange('journal')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 rounded-full transition-all text-xs sm:text-sm ${
                activePage === 'journal'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="size-3.5" />
              <span className="hidden sm:inline">Journal</span>
            </button>
          </div>

          {/* Right - Status and Sign Out */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-primary/5 rounded-full px-2 sm:px-3 py-1.5">
              <div className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground text-xs">
                <span className="hidden sm:inline">{todayCompletedTasks}/{totalTasks} tasks</span>
                <span className="sm:hidden">{todayCompletedTasks}/{totalTasks}</span>
              </span>
            </div>

            {/* Sign Out */}
            <button
              onClick={onSignOut}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full transition-all text-xs sm:text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200"
              title="Sign out"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}