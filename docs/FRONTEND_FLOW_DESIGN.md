# Frontend Flow Design – ULSS 9 Chatbot

This document describes the **user flow** on the frontend: what the user does, what the system shows, and what happens next. It assumes the backend implements the ULSS 9 design (store selection, RAG, answer + links).

---

## 1. High-Level Flow

```
User lands on app
    → Sees welcome + example questions
User types a question (free-form)
    → Sends one request to backend
Backend selects stores, runs RAG, returns answer + links
    → Frontend shows: answer text + suggested links (and optionally category badges)
User reads answer and/or clicks a link
    → Can ask a follow-up or start a new question
```

No step requires the user to **choose a category** before asking; the system infers it.

---

## 2. Step-by-Step User Journey

### Step 1: User arrives

**User does:** Opens the app (e.g. homepage or chat page).

**System shows:**
- A short **welcome message** (e.g. “Benvenuto nell’assistente ULSS 9 Scaligera”).
- A **chat input** (text area or single line) ready for the first message.
- Optionally: **suggested questions** (e.g. 3–5 chips or bullets) from `GET /api/welcome`:
  - “Quali sono gli orari del punto prelievi di Legnago?”
  - “Dove si trova l’Ospedale Magalini di Villafranca?”
  - “Come posso cambiare il medico di base?”
  - “Come prenotare una visita specialistica?”

**User can:** Type a question, or click a suggestion to paste it into the input (and optionally send it).

---

### Step 2: User sends a question

**User does:** Writes a question in natural language (e.g. “A che ora apre il punto prelievi a San Bonifacio?”) and sends it (Enter or Send button).

**System does:**
- Disables input (or shows a “typing” state).
- Sends **one** request: `POST /api/chat` with `{ "message": "..." }` (no `domain`).
- Shows the user message in the chat thread.

**User sees:** Their message appear in the conversation; then a loading indicator (e.g. spinner or “Sto cercando…”).

---

### Step 3: System replies

**Backend returns** (see backend design):
- `response`: answer text (Italian, synthetic).
- `links`: 1–3 suggested links (title + URL).
- `stores_used`: e.g. `["hours", "locations"]`.
- Optionally `sources` for transparency.

**System shows:**
1. **Answer bubble**  
   - The `response` text, formatted (paragraphs, lists if the backend uses markdown).  
   - Optional: small **badges** under the text for `stores_used` (e.g. “Orari”, “Sedi”) so the user sees which areas were used.

2. **Suggested links block**  
   - A clear label, e.g. “Pagine consigliate dal sito ULSS 9” or “Approfondisci su aulss9.veneto.it”.  
   - For each item in `links`: a **button** or **card** with `title`; on click, open `url` in a **new tab** (external site).

3. **Input**  
   - Re-enabled so the user can type again.

**User sees:** One assistant message containing: answer + optional category badges + suggested links. No need to choose a category; the flow is “ask → get answer + links”.

---

### Step 4: What the user can do next

**Option A – Follow-up question**  
- User types another question in the same chat (e.g. “E a Legnago?”).  
- Frontend sends again `POST /api/chat` with the new `message`.  
- Backend may or may not use conversation history (e.g. `conversation_id`) in a later phase; for now, each request can be stateless.  
- System shows the new exchange (user message + new answer + new links).

**Option B – Click a link**  
- User clicks one of the suggested links.  
- Browser opens the ULSS 9 page in a new tab.  
- Chat stays as is; user can return and ask something else.

**Option C – New topic**  
- User asks a completely different question (e.g. from “orari” to “dove si trova l’ospedale X”).  
- Same flow as Step 2–3: one request, new answer, new links and stores.

**Option D – Use a suggestion**  
- If the user did not use a suggestion at the start, they can click one later (e.g. from a “Suggerimenti” section that stays visible or reappears).  
- That text is inserted and/or sent as the next message; flow continues as in Step 2–3.

---

## 3. Flow Diagram (Simplified)

```
┌─────────────────────────────────────────────────────────────────┐
│  USER LANDING                                                    │
│  • Welcome message                                               │
│  • Input + suggested questions (optional)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  USER SENDS MESSAGE                                              │
│  • Types or selects suggestion → Send                            │
│  • Frontend: POST /api/chat { message }                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (internal)                                              │
│  • Store selection (Gemini)                                      │
│  • RAG over selected stores                                      │
│  • Generate answer + links                                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  SYSTEM REPLIES                                                  │
│  • Answer text                                                   │
│  • Badges: stores_used (e.g. Orari, Sedi)                         │
│  • Block: "Pagine consigliate" → links (title, open in new tab)  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  USER NEXT ACTION                                                │
│  • Ask follow-up     →  back to "USER SENDS MESSAGE"             │
│  • Click a link      →  open aulss9.veneto.it in new tab         │
│  • New question      →  back to "USER SENDS MESSAGE"             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. What the User Does Not Do

- **Does not** choose a category (general info / orari / sedi / servizi) before asking; the backend infers it.  
- **Does not** search the site manually first; the assistant answers and then offers links.  
- **Does not** need to log in for the basic flow (unless you add auth later).

---

## 5. Optional UI Elements

- **Suggestions**: Show `suggestions` from `/api/welcome` as clickable chips; on click, set input text and optionally send.  
- **Stores used**: Show `stores_used` as small badges (e.g. “Informazioni generali”, “Orari”, “Sedi”, “Servizi”) under the answer.  
- **Sources**: If you expose `sources`, a collapsible “Fonti” section or tooltip per link.  
- **Error state**: If the backend returns an error, show a short message and “Riprova” or allow the user to edit and resend.  
- **Empty links**: If `links` is empty, hide the “Pagine consigliate” block or show “Nessun link disponibile per questa risposta.”

---

## 6. Summary

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Opens app | Welcome + input + optional suggested questions |
| 2 | Types question and sends | Message shown; loading |
| 3 | — | Answer text + optional store badges + “Pagine consigliate” (links) |
| 4a | Asks follow-up | New request → new answer + links |
| 4b | Clicks a link | ULSS 9 page opens in new tab |
| 4c | Asks new question | Same as 2–3 |

The frontend flow is **single-turn from the user’s perspective**: ask → get answer + links → then choose to follow up, click a link, or ask something else.
