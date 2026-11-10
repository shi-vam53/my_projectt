# Security Policy & Hardening

Praxis treats platform security, candidate data integrity, and API key protection with high diligence.

---

## 🛡️ Security Architecture Highlights

1. **Zero Secret Leakage in Client Code**:
   - Client-side code (`frontend/app.js` and `docs/app.js`) contains **no backend API keys**, service credentials, or sensitive tokens.
   - LLM evaluations, credential checks, and database updates proxy through protected backend endpoints (`/api/problems/*`).
2. **Environment Variable Decoupling**:
   - Backend API keys (`GROQ_API_KEY`, `SUPABASE_KEY`) are loaded dynamically from environment variables or a local `.env` file excluded via `.gitignore`.
3. **HTTP Hardening Headers**:
   Every response from the FastAPI server includes strict modern security headers:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `X-XSS-Protection: 1; mode=block`
   - `Permissions-Policy: geolocation=(), microphone=(), camera=()`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
4. **Injection Protection**:
   - All database queries use SQLite parameterized query bindings (`?`), eliminating SQL injection.
   - User inputs and submission texts are strictly sanitized with HTML escaping before rendering in the DOM.
5. **Airtight Admin Gating**:
   - Access to the Governance & Reviewer Leaderboard is restricted to verified administrator `shivam`.
   - Unauthorized attempts receive `401 Unauthorized` and render an access-restricted lock gate.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or credential leak within this repository:
1. Please do **NOT** open a public GitHub issue.
2. Contact the maintainer directly or report privately via GitHub Security Advisories.
3. Include detailed steps to reproduce the issue. We aim to acknowledge reports within 24 hours.
