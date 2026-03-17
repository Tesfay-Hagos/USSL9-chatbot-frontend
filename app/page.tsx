import dynamic from 'next/dynamic';

// Disable SSR for the chat widget — it uses browser-only APIs (sessionStorage,
// window.parent) and fetches dynamic content. SSR causes hydration mismatches.
const NewChatWidget = dynamic(() => import('@/components/NewChatWidget'), { ssr: false });

export default function Home() {
  return (
    <main>
      <NewChatWidget />
    </main>
  );
}
