'use client';

import { useState, useEffect, useCallback } from 'react';
import WebsitePage from '@/components/WebsitePage';
import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  }, [darkMode]);

  return (
    <>
      <WebsitePage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <ChatWidget darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
    </>
  );
}
