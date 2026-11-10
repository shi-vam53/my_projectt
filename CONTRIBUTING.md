# Contributing to Praxis

Thank you for your interest in contributing to **Praxis**! Praxis is an open-source engineering simulation and workplace readiness platform designed to train modern software engineers, SREs, and data practitioners on realistic production incidents.

---

## 🛠️ Quick Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/shi-vam53/my_projectt.git
cd my_projectt
```

### 2. Configure Local Environment Secrets
Copy the environment template:
```bash
cp .env.example .env
```
Add your optional `GROQ_API_KEY` (from [console.groq.com](https://console.groq.com)) to enable Dual-LLM incident evaluation. *Never commit `.env` to Git.*

### 3. Install Python Dependencies
```bash
pip install -r backend/requirements.txt
pip install pytest httpx
```

### 4. Run the Test Suite
Ensure all tests pass before making any changes:
```bash
pytest backend/ -v
```

### 5. Launch the Development Server
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Open your browser at `http://localhost:8000`.

---

## 🔒 Security & Code Guidelines

1. **Zero Secret Leaks**: Never hardcode API keys, tokens, or passwords in files. Always read from `os.environ` or `.env`.
2. **Progressive Gating**: Maintain airtight gating integrity:
   - Phase 1: Technical Reference Handbook
   - Phase 2: Prerequisite Knowledge Quiz (≥ 80% passing score)
   - Phase 3 & 4: Production Incident Problem Bank (40 real-world issues)
3. **Admin Panel Locking**: Access to `/api/admin/*` and the Reviewer Leaderboard is strictly restricted to administrator `shivam`.
4. **Submitting Changes**:
   - Create a feature branch: `git checkout -b feat/your-feature-name`
   - Run `pytest backend/ -v` to ensure 100% test pass rate.
   - Commit with clear semantic commit messages: `git commit -m "feat: add redis cluster failover problem"`
   - Push and open a Pull Request.
