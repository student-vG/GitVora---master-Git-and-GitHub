# ⬡ GitVora — Git & GitHub Mastery Hub

GitVora is a practical web app that helps developers go from beginner to expert in Git and GitHub with guided workflows, error fixing, and command learning.

---

## 🚀 What's New in v2

- New brand: **GitVora** (easy to pronounce, strong identity)
- Added **light mode + dark mode** with saved preference
- AI assistant now works in a **reliable local-first mode** (no more hard failure when cloud API is unavailable)
- Fixed workflow result scrolling inside the Workflow panel
- Improved push guidance with:
  - `git push -u origin main`
  - `git push` after upstream setup
  - Safe force push guidance with `git push --force-with-lease`
- Added **Beginner → Expert Skill Path**
- Added **Visual Coach** for complete Git + GitHub teaching:
  - Visual roadmap
  - Branch graph examples
  - Terminal trainer
  - GitHub procedure checklist
  - Mission ladder + `.gitignore` generator
- Added **Git Handbook panel** with 155+ book-style learning pages
- Improved responsive layout for mobile devices

---

## 📦 Features

### 1. Landing Page (`index.html`)

- Animated terminal hero
- Problem-aware feature messaging
- Command explorer and error lookup
- Beginner-to-expert roadmap section
- Mobile menu + theme toggle

### 2. Main App (`app.html`)

#### 🚀 Push Guide

Scenarios:
- First push ever
- Regular push
- Push a branch
- Fork & PR workflow

Includes:
- Step cards
- Copy commands
- Done tracking
- Notes for common failure points

#### 🔄 Workflow Builder

One-click command workflows for:
- New project setup
- Branch workflow
- Merge workflow
- Push rejection recovery
- Fork syncing
- Stash context switching
- Tagging releases
- Bisect debugging

#### 🧠 Skill Path

Structured progression:
- Level 1: Basics
- Level 2: Branching
- Level 3: Collaboration
- Level 4: History mastery
- Level 5: Release operations
- Level 6: Expert debugging
- Mark levels complete with progress tracking

#### 📘 Git Handbook (New)

Book-paper style responsive notes:
- 155+ pages
- What is Git/GitHub, why it exists, who built Git, and when
- Command meaning, where to use commands, and memory tips
- Workflow notes from basic to expert
- Troubleshooting notes mapped to common error families

#### 🛰️ Visual Coach (New)

Complete visual learning from starter to expert:
- Track-based roadmap (Starter, Collaboration, Recovery, Expert Ops)
- Branch graph visual examples
- Interactive terminal trainer with command hints
- GitHub UI procedure coach with progress tracking
- Mission ladder with micro-practice goals
- Built-in `.gitignore` generator by stack

#### 🔧 Error Detective

- Paste an error
- Get likely diagnosis and calm fix commands
- Browse common error catalogue
- Pattern matching supports multi-line real terminal output and 100+ common Git error variants
- Mode selector: `Auto`, `Explain Only`, or `Explain + Solve`
- Multi-issue breakdown: each detected issue gets its own explanation and solution
- If an issue is not confidently detected, external links are shown automatically (GitHub Docs, Stack Overflow, Git docs search)

#### 📚 Command Reference

- Searchable categories
- Real examples
- Push + upstream + safe force guidance

#### 🤖 AI Assistant

- Local-first Git assistant engine
- Works even if external network is unavailable
- Gives practical commands and explanations
- Supports quick prompts and chat flow
- Uses handbook-backed answers for foundational learning questions (what/why/who/when/meaning/how to remember)

---

## 📁 Project Structure

```text
giteasy/
├── index.html
├── app.html
├── css/
│   ├── landing.css
│   └── app.css
└── js/
    ├── landing.js
    └── app.js
```

---

## 🧪 Run Locally

1. Open folder in VS Code
2. Use Live Server (or any static server)
3. Open `index.html`

---

## 🛡️ Safe Force Push Note

Use this only after history rewrite (rebase/squash) on your own branch:

```bash
git pull --rebase origin main
git push --force-with-lease origin <branch>
```

Prefer `--force-with-lease` over `--force` to avoid overwriting teammates' remote work.

---

Made for developers who want to master Git and GitHub with confidence.
