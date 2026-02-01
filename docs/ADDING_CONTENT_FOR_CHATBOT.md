# Adding Information So the Chatbot Answers Well

The chatbot gets its answers from **document stores** (RAG) on the **backend**. Content is not stored in this frontend repo.

## Where to add content

- **Backend + Admin board**: Create stores (domains) and upload PDF/MD/TXT/DOCX there.
- **Guide**: See the backend docs: [ADDING_CONTENT_TO_DOMAINS.md](https://github.com/your-org/USSL9-chatbot-backend/blob/main/docs/ADDING_CONTENT_TO_DOMAINS.md) (adjust the URL to your backend repo).

## Short version

1. Log in to the **Admin board** (USSL9-chatbot-adminboard).
2. Create the four ULSS 9 categories if not already created.
3. For each domain (**Informazioni generali**, **Orari**, **Sedi**, **Servizi**), upload documents (e.g. from [aulss9.veneto.it](https://www.aulss9.veneto.it)).
4. Optionally add a **Documenti** (docs) store and upload normative/bandi.

The chatbot frontend (this repo) only sends questions to the backend; all content is managed in the backend and via the Admin board.
