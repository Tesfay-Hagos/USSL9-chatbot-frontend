// Chat API client – backend URL
// Strip trailing slashes, then ensure path ends at /api/v1
const _base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');
const V1_BASE = _base.endsWith('/api') ? `${_base}/v1` : `${_base}/api/v1`;

export interface ChatRequest {
  message: string;
  domain: string | null;
  conversation_id?: string;
  language?: string;
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
  languages?: string[];
}

export interface PublicStoreInfo {
  domain: string;
  display_name: string;
  description: string;
  is_initial: boolean;
}

let sessionTokenCache: { token: string; expiresAt: number } | null = null;

export async function getSessionToken(): Promise<string> {
  if (sessionTokenCache && sessionTokenCache.expiresAt > Date.now() + 10_000) {
    return sessionTokenCache.token;
  }
  const res = await fetch(`${V1_BASE}/session-token`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to get session token');
  const data = await res.json();
  sessionTokenCache = {
    token: data.session_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.session_token;
}

// Public endpoint — no session token required
export async function getPublicStores(): Promise<PublicStoreInfo[]> {
  const response = await fetch(`${V1_BASE}/public/stores`);
  if (!response.ok) throw new Error('Failed to load categories');
  return response.json();
}

export async function sendMessage(
  message: string,
  domain: string | null = null,
  language?: string,
): Promise<ChatResponse> {
  const token = await getSessionToken();
  const body: ChatRequest = { message, domain };
  if (language) body.language = language;
  const response = await fetch(`${V1_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Token': token,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let detail = response.statusText;
    try { detail = (await response.json()).detail || detail; } catch { /* keep statusText */ }
    throw new Error(detail);
  }
  return response.json();
}

export async function getWelcome(lang?: string): Promise<WelcomeResponse> {
  const token = await getSessionToken();
  const url = lang
    ? `${V1_BASE}/welcome?lang=${encodeURIComponent(lang)}`
    : `${V1_BASE}/welcome`;
  const response = await fetch(url, { headers: { 'X-Session-Token': token } });
  if (!response.ok) throw new Error(`Failed to get welcome: ${response.statusText}`);
  return response.json();
}
