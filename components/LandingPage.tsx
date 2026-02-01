'use client';

import ThemeToggle from './ThemeToggle';

interface LandingPageProps {
  onSelectChatbot: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LandingPage({
  onSelectChatbot,
  darkMode,
  onToggleDarkMode,
}: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
      </div>
      <header className="pt-16 pb-8 px-4 text-center">
        <div className="animate-float text-7xl mb-6">🏥</div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-ulss9-primary via-ulss9-primary-dark to-ulss9-green bg-clip-text text-transparent mb-4">
          Assistente ULSS 9 Scaligera
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Cerca informazioni sul sito Azienda ULSS 9 Scaligera – scrivi la tua domanda
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="max-w-md w-full">
          <button
            onClick={onSelectChatbot}
            className="group relative w-full p-8 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl
                     shadow-xl hover:shadow-2xl border border-slate-200/50 dark:border-slate-700/50
                     transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
                     overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative text-6xl mb-6 transition-transform duration-300 group-hover:scale-110">
              💬
            </div>
            <h2 className="relative text-2xl font-bold text-slate-800 dark:text-white mb-3">
              Avvia assistente
            </h2>
            <p className="relative text-slate-600 dark:text-slate-400 text-base">
              Scrivi la tua domanda e ricevi risposte basate sul sito ULSS 9
            </p>
            <ul className="relative mt-4 text-left text-sm text-slate-500 dark:text-slate-500 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Nessuna categoria da selezionare
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Risposte AI con RAG
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Link alle pagine consigliate
              </li>
            </ul>
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent
                          group-hover:border-blue-500/50 transition-colors duration-300 pointer-events-none" />
          </button>
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-500">
        ULSS 9 Scaligera – Powered by <span className="text-ulss9-primary font-semibold">Gemini AI</span> con RAG
      </footer>
    </div>
  );
}
