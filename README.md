# 🛡️ VERITAS AI
### Enterprise AI Claim Verification & Evidence Intelligence Platform

[![Veritas AI CI](https://github.com/actions/workflows/ci.yml/badge.svg)](https://github.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **"Don't just trust an AI answer. Verify its empirical ground-truth evidence."**

**VERITAS AI** is an enterprise-grade claim verification and evidence intelligence platform designed for compliance auditors, legal teams, cybersecurity analysts, and regulatory intelligence units to cross-examine AI-generated assertions against authoritative ground-truth documents.

---

## 🚀 Live Demo & Deployment

- **Deploy to Vercel (1-Click):**
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
- **GitHub Pages Live Demo:** The interactive prototype is pre-packaged in the `/docs` folder and ready for GitHub Pages hosting.

---

## 🎨 Enterprise Design Language

Inspired by modern high-end document intelligence and cybersecurity software:
- **Canvas:** Soft, clean canvas (`#EFF2F6`) allowing floating cards to stand out with depth.
- **Sidebar:** Sleek, rich dark charcoal (`#0D1017`) with categorized sections (`MAIN`, `ANALYTICS`, `MANAGEMENT`, `OTHER`).
- **Active Navigation:** High-contrast pure white pill (`bg-white`) with dark text and sharp dark icons.
- **Card Surfaces:** Pure white (`#FFFFFF`) with generous border radius (`rounded-2xl` ~18px) and diffuse shadows.
- **Status Accents:**
  - **Supported:** Emerald Green (`#10B981`)
  - **Contradicted:** Crimson Rose (`#F43F5E`)
  - **Insufficient:** Amber (`#F59E0B`)

---

## 📂 6 Real-World Benchmark Domains & Test Files Included

| Domain | Ground-Truth Test File | Key Areas Audited |
| :--- | :--- | :--- |
| **📄 Legal & Contracts** | `NDA_v3.2_Draft.pdf` (4 pgs) | Exclusivity clauses, IP retention, survival terms |
| **📊 SEC Financial 10-K** | `SEC_10K_Alphabet_2024.pdf` (142 pgs) | Net revenues, CET1 solvency ratio, credit loss provisions |
| **💊 Clinical & Pharma** | `BioPharma_Phase3_Cardiovascular_Trial.pdf` (3 pgs) | MACE risk reduction, adverse event disclosure |
| **🛡️ Cybersecurity SecOps** | `Cyber_SecOps_Global_Incident_Report_2026.pdf` (4 pgs) | Ransomware trends, FIDO2 hardware keys, MTTD |
| **🚗 Autonomous AI Patent** | `Patent_AI_Autonomous_Driving_US11492.pdf` (3 pgs) | LiDAR sensor fusion latency, local fail-safe redundancy |
| **🌱 ESG & Sustainability** | `GreenTech_ESG_Carbon_Neutrality_2026.pdf` (3 pgs) | Scope 1-2 emissions, renewable PPAs, fleet electrification |

---

## 🛠️ Quick Start & Local Development

### Prerequisites
- Node.js 18+ (Node.js 20 recommended)
- npm or pnpm

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/veritas-ai.git
cd veritas-ai

# Install dependencies
npm install
```

### 2. Run Test Suite
```bash
npm test
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🚢 Deploying to GitHub

### Step 1: Initialize Git and Commit
```bash
git init -b main
git add .
git commit -m "feat: initial commit of Veritas AI enterprise platform"
```

### Step 2: Create a Repository on GitHub
Create a new repository named `veritas-ai` on your GitHub account ([github.com/new](https://github.com/new)).

### Step 3: Link Remote and Push
```bash
git remote add origin https://github.com/<your-username>/veritas-ai.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages (Optional for Instant Prototype Hosting)
1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment**:
   - **Source:** Choose **GitHub Actions** (uses `.github/workflows/deploy-pages.yml` automatically) or **Deploy from a branch** (select `main` branch and `/docs` folder).
3. Your interactive prototype will be live at `https://<your-username>.github.io/veritas-ai/`.

---

## 📦 Project Structure

```
veritas-ai/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated CI test & build workflow
│       └── deploy-pages.yml     # Automated GitHub Pages deployment
├── docs/
│   └── index.html               # Standalone interactive prototype for GitHub Pages
├── public/
│   └── prototype.html          # Public standalone prototype
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── report/route.ts  # Audit dossier synthesis endpoint
│   │   │   └── verify/route.ts  # Claim extraction & verification endpoint
│   │   ├── documents/page.tsx   # Ground-truth document repository
│   │   ├── evidence/page.tsx    # Source citation matrix
│   │   ├── history/page.tsx     # Session audit ledger
│   │   ├── reports/page.tsx     # Printable PDF compliance dossiers
│   │   ├── settings/page.tsx    # Auditor credentials & AI model settings
│   │   ├── verify/page.tsx      # 3-step verification workflow with shuffle ideas
│   │   ├── globals.css          # Theme tokens & @media print stylesheet
│   │   ├── layout.tsx           # Root light-mode shell
│   │   └── page.tsx             # Executive Dashboard Deck
│   ├── components/
│   │   ├── AppShell.tsx         # Responsive container
│   │   ├── Navbar.tsx           # Prominent top bar & search
│   │   └── Sidebar.tsx          # Sleek dark sidebar with active white pill
│   ├── context/
│   │   └── AppContext.tsx       # State management & persistent storage
│   └── lib/
│       ├── types.ts             # Domain interfaces
│       └── verificationEngine.ts# Deterministic quote validation engine
├── tests/
│   └── veritas_verification.test.mjs # Unit tests
└── package.json
```

---

## 🔒 Security & Standards Compliance

- **Exact Boundary Quotations:** Every supported assertion requires ground-truth boundary validation.
- **ISO/IEC 27001 & NIST AI RMF Compatible:** Audit dossiers include cryptographic session hashes and timestamps.
- **Zero-Retention Mode:** Auditor settings allow zero-retention ephemeral audits for sensitive intelligence.
