'use client';

import { useState } from 'react';
import ChatInterface from './ChatInterface';

interface ChatWidgetProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function ChatWidget({
  darkMode,
  onToggleDarkMode,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating chat button – classic chatbot bubble */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl
                   bg-gradient-to-br from-ulss9-primary to-ulss9-primary-dark text-white
                   flex items-center justify-center
                   hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-200
                   focus:outline-none focus:ring-4 focus:ring-ulss9-primary/40"
        aria-label={isOpen ? 'Chiudi assistente' : 'Apri assistente'}
      >
        {/* Chat bubble / robot icon */}
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat panel – opens above the button, looks like a real chat window */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 z-40 w-[calc(100vw-3rem)] max-w-md h-[min(70vh,560px)]
                     flex flex-col rounded-2xl shadow-2xl overflow-hidden
                     bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                     animate-slide-up"
          role="dialog"
          aria-label="Assistente chat"
        >
          {/* Widget header – chatbot style */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-ulss9-primary to-ulss9-primary-dark text-white shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-sm">Assistente ULSS 9</p>
                <p className="text-xs text-white/80">Scrivi una domanda</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Chiudi"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat content – embedded interface */}
          <div className="flex-1 flex flex-col min-h-0">
            <ChatInterface
              embedded
              darkMode={darkMode}
              onToggleDarkMode={onToggleDarkMode}
            />
          </div>
        </div>
      )}
    </>
  );
}
