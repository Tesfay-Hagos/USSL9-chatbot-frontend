'use client';

import ThemeToggle from './ThemeToggle';

interface WebsitePageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function WebsitePage({
  darkMode,
  onToggleDarkMode,
}: WebsitePageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Header – website style */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span className="text-3xl">🏥</span>
            <div>
              <span className="font-bold text-lg text-slate-800 dark:text-white block">
                Azienda ULSS 9
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Scaligera
              </span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#servizi"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-univr-red dark:hover:text-univr-red-light transition-colors"
            >
              Servizi
            </a>
            <a
              href="#orari"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-univr-red dark:hover:text-univr-red-light transition-colors"
            >
              Orari
            </a>
            <a
              href="#sedi"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-univr-red dark:hover:text-univr-red-light transition-colors"
            >
              Sedi
            </a>
            <a
              href="#contatti"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-univr-red dark:hover:text-univr-red-light transition-colors"
            >
              Contatti
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Azienda ULSS 9 Scaligera
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Servizi sanitari e assistenza sul territorio. Trova informazioni su orari, sedi,
            prenotazioni e modulistica.
          </p>
        </div>
      </section>

      {/* Servizi */}
      <section id="servizi" className="py-14 px-4 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Servizi
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-2xl mb-3 block">📋</span>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                Prenotazioni e visite
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Prenotazione visite, esami e ticket. CUP e modulistica.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-2xl mb-3 block">📍</span>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                Sedi e strutture
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ospedali, distretti, punti prelievi e indirizzi sul territorio.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-2xl mb-3 block">🕐</span>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
                Orari e accessi
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Orari di apertura, sportelli e modalità di accesso ai servizi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Numeri utili / Contatti */}
      <section id="contatti" className="py-14 px-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Contatti e numeri utili
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Per informazioni generali, prenotazioni e assistenza puoi contattare i numeri
                e gli sportelli indicati sul sito ufficiale.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Consulta il sito{' '}
                <a
                  href="https://www.aulss9.veneto.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-univr-red dark:text-univr-red-light hover:underline"
                >
                  aulss9.veneto.it
                </a>{' '}
                per gli aggiornamenti.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="font-medium text-slate-800 dark:text-white mb-2">
                Hai una domanda?
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Usa l&apos;assistente virtuale (icona chat in basso a destra) per trovare
                risposte su orari, sedi e servizi ULSS 9.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © Azienda ULSS 9 Scaligera. Assistente powered by{' '}
            <span className="text-univr-red dark:text-univr-red-light font-medium">
              Gemini AI
            </span>{' '}
            con RAG.
          </p>
        </div>
      </footer>
    </div>
  );
}
