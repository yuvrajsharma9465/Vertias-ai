# 🏛️ VERITAS AI – Architecture & Technical Specification

## 1. System Overview

VERITAS AI is built on a modern Next.js 14 App Router architecture with TypeScript, Tailwind CSS, and React 18, engineered specifically for high-throughput, low-latency empirical claim verification and document intelligence.

```
                      ┌───────────────────────────────────────┐
                      │              USER / AUDITOR           │
                      └──────────────────┬────────────────────┘
                                         │
                                         ▼
                      ┌───────────────────────────────────────┐
                      │     VERITAS AI Clean Enterprise UI    │
                      │   (Collapsible Sidebar + Top Nav)     │
                      └──────────────────┬────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
┌─────────────────┐            ┌───────────────────┐            ┌──────────────────┐
│  Verification   │            │ Document Library  │            │ Evidence Matrix  │
│  Engine & RAG   │            │   & OCR Ingest    │            │   & Audit Log    │
└───────┬─────────┘            └─────────┬─────────┘            └─────────┬────────┘
        │                                │                                │
        ▼                                ▼                                ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             API & State Controller                               │
│  - /api/verify: Claim Decomposition, Citation Retrieval, Quote Validation        │
│  - /api/report: Dossier Synthesis & Tamper-Evident Auditing                      │
│  - AppContext: Persistent Local State, Document Store, Session Cache             │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                  ┌──────────────────────┴──────────────────────┐
                  ▼                                             ▼
       ┌─────────────────────┐                       ┌─────────────────────┐
       │ Internal High-Speed │                       │ Google Gemini 2.5   │
       │ Deterministic Engine│                       │ Flash API Fallback  │
       └─────────────────────┘                       └─────────────────────┘
```

---

## 2. Evidence Retrieval & Quote Validation Protocol

To guarantee zero hallucinated evidence:
1. **Sentence Segmentation:** Raw AI output is segmented into discrete factual propositions.
2. **Document Indexing:** Authoritative source PDFs/documents are indexed with page boundaries preserved.
3. **Lexical & Semantic Cross-Examination:**
   - Candidate sentences are extracted per page.
   - Exact string matches with normalization (whitespace and case folding) are prioritized.
   - Antonym and numeric conflict detection flags contradictions.
4. **Evidentiary Validation Gate:**
   - A verdict of `SUPPORTED` strictly requires the evidence quote to exist on the cited page.
   - If the cited quote does not match the source document text, the claim is automatically downgraded to `INSUFFICIENT_EVIDENCE`.

---

## 3. Component Hierarchy

- **`src/app/layout.tsx`**: Enterprise dark theme provider and root shell.
- **`src/components/AppShell.tsx`**: Dynamic layout with fixed, collapsible left sidebar and top navbar.
- **`src/components/Sidebar.tsx`**: Fixed collapsible navigation with Veritas branding, engine health monitor, and claim verification progress bar.
- **`src/components/Navbar.tsx`**: Top navigation with dynamic page title, live search, unread audit notifications, and auditor profile menu.
- **`src/context/AppContext.tsx`**: Unified context providing documents, sessions, reports, statistics, and auditor settings with automatic localStorage caching.
- **`src/lib/verificationEngine.ts`**: Core verification engine with pre-loaded benchmark documents and sample testing prompts.
