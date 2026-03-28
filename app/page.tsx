import dynamic from 'next/dynamic';

// Disable SSR for the chat widget — it uses browser-only APIs (sessionStorage,
// window.parent) and fetches dynamic content. SSR causes hydration mismatches.
const NewChatWidget = dynamic(() => import('@/components/NewChatWidget'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--bg)] transition-colors duration-500">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--hover-micro)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center max-w-3xl mx-auto w-full">
        <div className="mb-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--teal)] to-[#006b64] flex items-center justify-center shadow-[0_8px_32px_rgba(0,201,184,0.35)]">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text)] mb-6 drop-shadow-sm">
          Assistente <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--teal)] to-[#006b64]">Azienda ULSS 9</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--text-60)] font-light leading-relaxed max-w-2xl mb-12">
          Questo è il widget dimostrativo del chatbot intelligente. Questa interfaccia galleggiante sarà integrata presto sul sito web ufficiale per supportare i pazienti nella ricerca veloce di informazioni.
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface2)] shadow-[var(--sh-sm)]">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--teal)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--teal)]"></span>
          </span>
          <span className="text-[0.78rem] font-medium tracking-wide text-[var(--text)] uppercase">Demo Attiva</span>
        </div>
      </div>
      
      {/* The widget floats above everything else at the bottom right */}
      <div className="relative z-50">
        <NewChatWidget />
      </div>
    </main>
  );
}
