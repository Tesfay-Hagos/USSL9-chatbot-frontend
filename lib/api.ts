// Chat API only – backend URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ChatRequest {
  message: string;
  domain: string | null;
  conversation_id?: string;
  language?: string; // "it" | "en"; used when backend allows English
}

export interface ChatLink {
  title: string;
  url?: string;
  document_id?: string;
  source_type?: 'website' | 'attachment';
}

export interface ChatResponse {
  response: string;
  sources: Source[];
  links: ChatLink[];
  stores_used: string[];
  domain: string | null;
  suggested_questions?: string[];
}

export interface Source {
  content?: string;
  index?: number;
  title?: string;
  url?: string;
  snippet?: string;
  source_type?: string;
}

export interface WelcomeResponse {
  message: string;
  available_domains: string[];
  suggestions: string[];
  languages?: string[]; // e.g. ["it"] or ["it", "en"] when English is allowed
}

export async function sendMessage(
  message: string,
  domain: string | null = null,
  language?: string
): Promise<ChatResponse> {
  const body: ChatRequest = { message, domain };
  if (language) body.language = language;
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function getWelcome(lang?: string): Promise<WelcomeResponse> {
  const url = lang ? `${API_BASE}/welcome?lang=${encodeURIComponent(lang)}` : `${API_BASE}/welcome`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to get welcome: ${response.statusText}`);
  }
  return response.json();
}
