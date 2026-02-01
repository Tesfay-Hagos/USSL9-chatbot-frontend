'use client';

import {
  ChatLink,
  ChatResponse,
  getWelcome,
  sendMessage,
  Source,
} from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  sources?: Source[];
  links?: ChatLink[];
  stores_used?: string[];
  timestamp: Date;
}

const STORE_LABELS: Record<string, string> = {
  general_info: 'Informazioni generali',
  hours: 'Orari',
  locations: 'Sedi',
  services: 'Servizi',
  docs: 'Documenti',
};

const STORE_LABELS_EN: Record<string, string> = {
  general_info: 'General information',
  hours: 'Opening hours',
  locations: 'Locations',
  services: 'Services',
  docs: 'Documents',
};

// Optional category picker: main ULSS 9 stores (user can skip)
const OPTIONAL_CATEGORY_IDS: readonly string[] = [
  'general_info',
  'hours',
  'locations',
  'services',
] as const;

interface ChatInterfaceProps {
  embedded?: boolean;
  onBackToHome?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function ChatInterface({
  embedded = false,
  onBackToHome,
  darkMode,
  onToggleDarkMode,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [welcomeError, setWelcomeError] = useState<string | null>(null);
  const [chosenLanguage, setChosenLanguage] = useState<'it' | 'en' | null>(null);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [welcomeData, setWelcomeData] = useState<{ message: string; suggestions: string[] } | null>(null);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>(['it']);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const LANGUAGE_STORAGE_KEY = 'ulss9_chat_language';

  // Load welcome in the stored language (or Italian); decide whether to show language picker
  useEffect(() => {
    const loadWelcome = async () => {
      setWelcomeError(null);
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;
        const langParam = stored === 'it' || stored === 'en' ? stored : 'it';
        const data = await getWelcome(langParam);
        const languages = data.languages ?? ['it'];
        setSupportedLanguages(languages);
        setWelcomeData({ message: data.message, suggestions: data.suggestions || [] });

        const allowedStored = stored === 'it' || stored === 'en';

        if (languages.includes('en') && !allowedStored) {
          setShowLanguagePicker(true);
          setChosenLanguage(null);
        } else {
          const lang = (allowedStored ? stored : 'it') as 'it' | 'en';
          setChosenLanguage(lang);
          setShowLanguagePicker(false);
          const welcomeMessage: Message = {
            id: 'welcome',
            content: data.message,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error('Failed to load welcome:', err);
        setWelcomeError('Impossibile connettersi al server. Verifica che il backend sia avviato.');
        setChosenLanguage('it');
        setShowLanguagePicker(false);
        setSupportedLanguages(['it']);
        setMessages([
          {
            id: 'welcome',
            content:
              '👋 Benvenuto nell\'assistente ULSS 9 Scaligera. Scrivi una domanda per trovare informazioni sul sito aulss9.veneto.it.',
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
        setSuggestions([
          'Quali sono gli orari del punto prelievi di Legnago?',
          'Dove si trova l\'Ospedale Magalini di Villafranca?',
          'Come prenotare una visita specialistica?',
        ]);
      }
    };
    loadWelcome();
  }, []);

  const handleNewChat = () => {
    if (typeof window !== 'undefined') localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    setChosenLanguage(null);
    setMessages([]);
    setSuggestions([]);
    setInputValue('');
    setSelectedCategory(null);
    if (supportedLanguages.includes('en')) {
      setShowLanguagePicker(true);
    } else {
      setChosenLanguage('it');
      const data = welcomeData || {
        message: "👋 Benvenuto nell'assistente ULSS 9 Scaligera. Scrivi una domanda per trovare informazioni sul sito aulss9.veneto.it.",
        suggestions: [
          'Quali sono gli orari del punto prelievi di Legnago?',
          'Dove si trova l\'Ospedale Magalini di Villafranca?',
          'Come prenotare una visita specialistica?',
        ],
      };
      setMessages([
        { id: 'welcome', content: data.message, sender: 'bot', timestamp: new Date() },
      ]);
      setSuggestions(data.suggestions);
    }
  };

  const handleLanguageChoose = async (lang: 'it' | 'en') => {
    if (typeof window !== 'undefined') localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setChosenLanguage(lang);
    setShowLanguagePicker(false);
    try {
      const data = await getWelcome(lang);
      setWelcomeData({ message: data.message, suggestions: data.suggestions || [] });
      const welcomeMessage: Message = {
        id: 'welcome',
        content: data.message,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      setSuggestions(data.suggestions || []);
    } catch {
      const data = welcomeData || {
        message: lang === 'en'
          ? "👋 Welcome to the ULSS 9 Scaligera assistant. Ask a question to find information on the aulss9.veneto.it website."
          : "👋 Benvenuto nell'assistente ULSS 9 Scaligera. Scrivi una domanda per trovare informazioni sul sito aulss9.veneto.it.",
        suggestions: lang === 'en'
          ? ['What are the opening hours of the Legnago blood draw point?', 'Where is Magalini Hospital in Villafranca?', 'How do I book a specialist visit?']
          : ['Quali sono gli orari del punto prelievi di Legnago?', 'Dove si trova l\'Ospedale Magalini di Villafranca?', 'Come prenotare una visita specialistica?'],
      };
      setMessages([{ id: 'welcome', content: data.message, sender: 'bot', timestamp: new Date() }]);
      setSuggestions(data.suggestions);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    handleSubmitMessage(suggestion);
  };

  const handleSubmitMessage = async (messageText: string) => {
    const message = messageText.trim();
    if (!message || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setSuggestions([]);
    setWelcomeError(null);

    try {
      const lang = chosenLanguage || 'it';
      const domain = selectedCategory || null;
      const response: ChatResponse = await sendMessage(message, domain, lang);

      setSelectedCategory(null);
      if (response.suggested_questions && response.suggested_questions.length > 0) {
        setSuggestions(response.suggested_questions);
      } else {
        setSuggestions([]);
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: response.response,
        sender: 'bot',
        sources: response.sources,
        links: response.links ?? [],
        stores_used: response.stores_used ?? [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content:
          '❌ Si è verificato un errore. Riprova o verifica che il backend sia avviato.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    handleSubmitMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-univr-red dark:text-univr-red-light">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div
      className={
        embedded
          ? 'h-full flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900'
          : 'min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
      }
    >
      {!embedded && (
        <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            {onBackToHome ? (
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-univr-red transition-colors"
              >
                <span className="text-xl">←</span>
                <span className="font-medium">Home</span>
              </button>
            ) : (
              <div className="w-32" />
            )}

            <div className="flex items-center gap-3">
              <span className="text-2xl animate-float">🏥</span>
              <div>
                <h1 className="font-semibold text-slate-800 dark:text-white">
                  Assistente ULSS 9 Scaligera
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Scrivi la tua domanda – nessuna categoria da selezionare
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleNewChat}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-univr-red dark:hover:text-univr-red-light transition-colors"
              >
                {chosenLanguage === 'en' ? 'New chat' : 'Nuova chat'}
              </button>
              <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
            </div>
          </div>
        </header>
      )}

      {welcomeError && (
        <div className={embedded ? 'px-3 py-2 shrink-0' : 'max-w-3xl mx-auto px-4 py-2'}>
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg px-4 py-2 text-sm">
            {welcomeError}
          </div>
        </div>
      )}

      <main className={embedded ? 'flex-1 overflow-y-auto min-h-0 px-3 py-4' : 'flex-1 overflow-y-auto px-4 py-6'}>
        <div className={embedded ? 'space-y-4' : 'max-w-3xl mx-auto space-y-6'}>
          {embedded && (
            <div className="flex justify-end pb-1">
              <button
                type="button"
                onClick={handleNewChat}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-univr-red dark:hover:text-univr-red-light transition-colors"
              >
                {chosenLanguage === 'en' ? 'New chat' : 'Nuova chat'}
              </button>
            </div>
          )}
          {showLanguagePicker && (
            <div className="animate-slide-up rounded-2xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
              <p className="text-lg font-medium text-slate-800 dark:text-white mb-1">
                Scegli lingua / Choose language
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Le risposte saranno nella lingua scelta. / Answers will be in the selected language.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleLanguageChoose('it')}
                  className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-univr-red to-univr-red-dark text-white
                           hover:shadow-lg hover:scale-105 transition-all"
                >
                  Italiano
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChoose('en')}
                  className="px-6 py-3 rounded-xl font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white
                           hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-105 transition-all"
                >
                  English
                </button>
              </div>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 animate-slide-up ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              } ${embedded ? 'gap-2' : 'gap-3'}`}
            >
              <div
                className={`rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-univr-red to-univr-red-dark text-white'
                    : 'glass-panel'
                } ${embedded ? 'w-8 h-8' : 'w-10 h-10'}`}
              >
                <span className={embedded ? 'text-sm' : 'text-lg'}>
                  {message.sender === 'user' ? '👤' : '🤖'}
                </span>
              </div>

              <div
                className={`rounded-2xl shadow-md ${
                  embedded ? 'max-w-[85%] px-3 py-2' : 'max-w-[80%] px-5 py-3'
                } ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-univr-red to-univr-red-dark text-white'
                    : 'glass-panel text-slate-800 dark:text-slate-200'
                }`}
              >
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content),
                  }}
                />

                {/* Store badges (categories used) */}
                {message.stores_used && message.stores_used.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {message.stores_used.map((sid) => (
                      <span
                        key={sid}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300"
                      >
                        {(chosenLanguage === 'en' ? STORE_LABELS_EN[sid] : STORE_LABELS[sid]) ?? sid}
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested links (Pagine consigliate / Documenti) */}
                {message.links && message.links.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-300/30 dark:border-slate-600/30">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Pagine / documenti consigliati
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.links.map((link, i) =>
                        link.url ? (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg
                                     bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-300 dark:hover:bg-slate-600
                                     text-slate-700 dark:text-slate-200 no-underline transition-colors"
                          >
                            <span>{link.title}</span>
                            <svg
                              className="w-3.5 h-3.5 opacity-70"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ) : (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg
                                     bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200"
                          >
                            📄 {link.title}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Sources (snippets) */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-300/30 dark:border-slate-600/30">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Fonti ({message.sources.length})
                    </p>
                    <div className="space-y-1">
                      {message.sources.slice(0, 3).map((source, i) => (
                        <div
                          key={i}
                          className="text-xs bg-slate-200/50 dark:bg-slate-700/50 rounded px-2 py-1 truncate"
                        >
                          {source.snippet ||
                            source.title ||
                            source.content ||
                            `Fonte ${source.index ?? i + 1}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center shadow-md">
                <span className="text-lg">🤖</span>
              </div>
              <div className="glass-panel rounded-2xl px-5 py-4 shadow-md">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}

          {suggestions.length > 0 && !isLoading && (
            <div className="mt-4 animate-slide-up">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                {chosenLanguage === 'en' ? 'Suggestions:' : 'Suggerimenti:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    type="button"
                    className="px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                             rounded-full hover:border-univr-red dark:hover:border-univr-red-light
                             hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105
                             text-slate-700 dark:text-slate-300 shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {!showLanguagePicker && (
      <footer className="sticky bottom-0 shrink-0 glass-panel border-t border-slate-200/50 dark:border-slate-700/50 px-3 py-3">
        <form onSubmit={handleSubmit} className={embedded ? '' : 'max-w-3xl mx-auto'}>
          <div className="mb-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {chosenLanguage === 'en'
                ? 'Optional: your question relates to… (skip if unsure)'
                : 'Opzionale: la tua domanda riguarda… (salta se non sei sicuro)'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {OPTIONAL_CATEGORY_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === id ? null : id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                    selectedCategory === id
                      ? 'bg-univr-red text-white border-univr-red dark:bg-univr-red-light dark:border-univr-red-light'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-univr-red/50 dark:hover:border-univr-red-light/50'
                  }`}
                >
                  {(chosenLanguage === 'en' ? STORE_LABELS_EN[id] : STORE_LABELS[id]) ?? id}
                </button>
              ))}
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {chosenLanguage === 'en' ? 'Skip' : 'Salta'}
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-end bg-white dark:bg-slate-800 rounded-xl p-2 shadow-lg border border-slate-200 dark:border-slate-700">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scrivi la tua domanda..."
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none bg-transparent px-3 py-2 text-slate-800 dark:text-white text-sm
                       placeholder-slate-400 focus:outline-none max-h-24"
              style={{ minHeight: embedded ? '40px' : '44px' }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-gradient-to-br from-univr-red to-univr-red-dark text-white rounded-lg
                       hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          {!embedded && (
            <p className="text-center text-xs text-slate-500 mt-2">
              Assistente ULSS 9 – Powered by <span className="text-univr-red font-medium">Gemini AI</span> con RAG
            </p>
          )}
        </form>
      </footer>
      )}
    </div>
  );
}
