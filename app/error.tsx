'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console only – no error overlay on the page
    console.error('Application error:', error.message, error.digest ?? '', error.stack ?? '');
  }, [error]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center px-4 py-12">
      <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
        Si è verificato un errore. Riprova.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-4 py-2 rounded-lg bg-ulss9-primary text-white hover:bg-ulss9-primary-dark transition-colors"
      >
        Riprova
      </button>
    </div>
  );
}
