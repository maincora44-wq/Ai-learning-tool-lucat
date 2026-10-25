# AI Learning OS

**Tagline:** Learn AI. Build workflows. Verify results.  
**Version:** 1.0  
**Target Platform:** Mobile-First Progressive Web App (PWA) optimized for Samsung Galaxy Z Fold7 (Folded & Unfolded) + Desktop.

---

## 1. Executive Summary & Purpose

AI Learning OS teaches ChatGPT and Microsoft 365 AI through an evidence-based progressive capability framework:

$$\text{Tools} \longrightarrow \text{Workflows} \longrightarrow \text{Automation} \longrightarrow \text{Agents} \longrightarrow \text{Systems}$$

Combined with an evidence ladder:

$$\text{CONCEPT} \longrightarrow \text{PROPOSAL} \longrightarrow \text{PROTOTYPE} \longrightarrow \text{WORKING} \longrightarrow \text{VERIFIED}$$

The curriculum focuses on rigorous, real-world finance, investing, accounting (IFRS/US GAAP), and internal controls (ICFR) use cases using **entirely realistic synthetic fixtures**.

---

## 2. Key Architecture & Features

1. **Zero External Cloud/Tenant Dependency for MVP**:
   - Bundled 35-topic curriculum catalog.
   - 13 substantive ready lessons following the mandatory 8-section pedagogical engine.
   - 8 fully functional hands-on practice labs with interactive simulators, downloadable sample CSV datasets, and 10-point rubrics.
   - Durable local storage in IndexedDB with JSON backup export and schema-validated restore.

2. **Strict Evidence-Based Maturity Ladder**:
   - `CONCEPT`: Theory comprehension.
   - `PROPOSAL`: Written design/workflow artifact required.
   - `PROTOTYPE`: Attested partial implementation.
   - `WORKING`: Requires at least one recorded end-to-end execution run.
   - `VERIFIED`: Strictly requires all 4 tests: Normal, Edge, Failure, and Rerun (Idempotency). Never auto-promoted!

3. **Deterministic Automation & Idempotency Engine (LAB-05 & LAB-06)**:
   - Interactive simulation testing recurrence triggers, overdue filtering, unassigned owner edge cases, and duplicate-run suppression via deterministic Idempotency Keys.

4. **Optional Server-Side Gemini Coach**:
   - Server-side Express API route (`/api/coach`) with `@google/genai` (Gemini 3.8 Flash).
   - Graceful fallback: If offline or API key is unconfigured, seamlessly activates the local deterministic tutor without breaking.

5. **Galaxy Z Fold7 Responsive Layout**:
   - Folded mode (narrow screen): Single-column stepped reading, bottom navigation bar, touch targets >= 44px.
   - Unfolded dual-pane mode & Desktop: Responsive sidebar, dual-column reading & workspace.

---

## 3. Launch Curriculum Inventory

### Ready Lessons (13 Complete)
- **T01**: Models vs Context vs Tools vs Memory (Cross)
- **T02**: Prompt Structure, Constraints, Verification (ChatGPT)
- **T03**: Files, Search, Analysis and Tool Choice (ChatGPT)
- **T05**: Microsoft 365 Copilot Chat, Content Scope & Access (M365)
- **T06**: Excel/Word/PowerPoint Copilot Patterns (M365)
- **T07**: Outlook/Teams/SharePoint and Permissions (M365)
- **W01**: Input → Steps → Decision → Validation → Output → Exceptions (Cross)
- **W02**: Reproducible Investment Research (ChatGPT)
- **W03**: Evidence-Centered Accounting Memorandum (ChatGPT)
- **A01**: Triggers, Schedules, Retries, Idempotency, Logging (Cross)
- **A04**: Power Automate Triggers, Conditions & Actions (M365)
- **G01**: Goal, Plan, Tool, Observe, State, Stop (Cross)
- **S01**: AI Reference Architecture & Capstone System Boundaries (Cross)

### Interactive Labs (8 Complete)
- **LAB-01**: Choosing the Right Tool for Business Tasks (Tools)
- **LAB-02**: Safe AI Prompt for Control Evidence Request (Tools)
- **LAB-03**: Maintenance vs Capitalization Accounting Memo (Workflows)
- **LAB-04**: Reproducible Investment Research Workflow (Workflows)
- **LAB-05**: Month-End Control Reminder & Escalation Simulator (Automation)
- **LAB-06**: Power Automate Flow Designer Simulation (Automation)
- **LAB-07**: Reconciliation-Investigation Agent Lab (Agents)
- **LAB-08**: Investment OS Architecture Decision Record (Systems)

---

## 4. Setup, Development & Production

```bash
# Run unit tests
npx tsx src/test/runTests.ts

# Start full-stack development server on port 3000
npm run dev

# Build production bundle
npm run build
```

---

## 5. Security & Privacy Disclaimers

- **Synthetic Data Notice**: Use only synthetic test data. Never enter live company financial statements, private employee names, or tenant credentials.
- **Client Storage**: All learning history and notes reside in browser IndexedDB on the device. Export JSON backups periodically via Settings.

## Deployment and offline behavior (GitHub Pages)

A GitHub Actions workflow in `.github/workflows/pages.yml` checks TypeScript, regression tests and the PWA production bundle before publishing `main`. **One-time admin setup:** under **Settings → Pages → Build and deployment**, select **GitHub Actions** as the publishing source. Once a deployment succeeds, verify `https://maincora44-wq.github.io/Ai-learning-tool-lucat/` on an Android device.

GitHub Pages hosts **static content only**. Bundled lessons, quizzes, labs, local IndexedDB records, and the deterministic offline learning guide work without a paid service. The **Gemini AI coach requires a separately deployed, access-controlled Express backend**. The production server disables public coach requests by default; enabling it without authentication and rate limits can cause unexpected API charges. Do not place any Gemini API key in frontend Vite variables or in the public repository.

The service worker and generated manifest are emitted by `vite-plugin-pwa` on production builds, not in `vite dev`. Preloaded lessons remain available offline once caching completes; live AI does not. Device/browser storage is not cloud sync. Export JSON backups from Settings before moving to a new device or clearing site data.

Release verification:
```bash
bun install --frozen-lockfile
bun run lint
bun run test
GITHUB_PAGES=true bun run build
```
