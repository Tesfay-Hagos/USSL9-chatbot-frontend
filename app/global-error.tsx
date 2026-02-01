'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console only – no error overlay on the page
    console.error('Global error:', error.message, error.digest ?? '', error.stack ?? '');
  }, [error]);

  return (
    <html lang="it">
      <body className="antialiased bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
            Si è verificato un errore. Riprova.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-[#0066A1] text-white hover:bg-[#004D7A] transition-colors"
          >
            Riprova
          </button>
        </div>
      </body>
    </html>
  );
}
