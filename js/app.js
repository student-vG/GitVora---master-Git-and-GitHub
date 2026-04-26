// ============================================================
// GitVora — Main App JS
// Panels: Push Guide, Workflow Builder, Skill Path, Error Detective,
// Command Reference, AI Assistant
// ============================================================

// ---- THEME ----
const THEME_KEY = 'gitvora-theme';
const themeToggleApp = document.getElementById('themeToggleApp');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const isLight = theme === 'light';
  if (themeToggleApp) {
    themeToggleApp.textContent = isLight ? '🌙' : '☀️';
    themeToggleApp.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  }
}

applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
themeToggleApp?.addEventListener('click', () => {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
});

// ---- NAVIGATION ----
const panels = document.querySelectorAll('.panel');
const navItems = document.querySelectorAll('.nav-item');
const topbarTitle = document.getElementById('topbarTitle');

const panelTitles = {
  push: '🚀 Push Guide',
  workflow: '🔄 Workflow Builder',
  academy: '🧠 Skill Path',
  visual: '🛰️ Visual Coach',
  errors: '🔧 Error Detective',
  reference: '📚 Command Reference',
  chat: '🤖 AI Assistant',
};

function showPanel(name) {
  panels.forEach((p) => p.classList.remove('active'));
  navItems.forEach((n) => n.classList.remove('active'));
  document.getElementById(`panel-${name}`)?.classList.add('active');
  document.querySelector(`[data-panel="${name}"]`)?.classList.add('active');
  topbarTitle.textContent = panelTitles[name] || 'GitVora';
  document.getElementById('sidebar').classList.remove('open');
  const panelEl = document.getElementById(`panel-${name}`);
  if (panelEl) panelEl.scrollTo({ top: 0, behavior: 'smooth' });
}

window.showPanel = showPanel;

navItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    showPanel(item.dataset.panel);
  });
});

// Mobile sidebar toggle
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});
document.getElementById('sidebarClose').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const isTyping = document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT';
  if (isTyping) return;
  const panelOrder = ['push', 'workflow', 'academy', 'visual', 'errors', 'reference', 'chat'];
  if (e.key >= '1' && e.key <= '7') {
    showPanel(panelOrder[parseInt(e.key, 10) - 1]);
  }
});

// Shortcuts modal
document.getElementById('shortcutsBtn').addEventListener('click', () => {
  document.getElementById('shortcutsModal').style.display = 'flex';
});
document.getElementById('shortcutsClose').addEventListener('click', () => {
  document.getElementById('shortcutsModal').style.display = 'none';
});
document.getElementById('shortcutsModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
});

// ---- HELPERS ----
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function copyText(text, btn) {
  const onSuccess = () => {
    if (!btn) return;
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1800);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
      fallbackCopy(text, onSuccess);
    });
    return;
  }

  fallbackCopy(text, onSuccess);
}

function fallbackCopy(text, onSuccess) {
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.style.position = 'fixed';
  temp.style.opacity = '0';
  document.body.appendChild(temp);
  temp.focus();
  temp.select();
  try {
    document.execCommand('copy');
    onSuccess();
  } catch {
    // ignored
  } finally {
    temp.remove();
  }
}

function scrollPanelTo(panelEl, targetEl) {
  if (!panelEl || !targetEl) return;
  const top = Math.max(targetEl.offsetTop - 10, 0);
  panelEl.scrollTo({ top, behavior: 'smooth' });
}

window.copyText = copyText;

// ============================================================
// PUSH GUIDE
// ============================================================
const scenarios = {
  first: [
    {
      title: 'Install Git',
      explanation: 'Make sure Git is installed on your machine. Open a terminal and check.',
      cmd: 'git --version',
      note: 'If not installed: git-scm.com/downloads',
    },
    {
      title: 'Configure your identity',
      explanation: 'Tell Git who you are. This info appears in every commit you make.',
      cmd: 'git config --global user.name "Your Name"\ngit config --global user.email "you@email.com"',
    },
    {
      title: 'Initialize your repository',
      explanation: 'Navigate to your project folder and initialize a Git repository.',
      cmd: 'cd /path/to/your-project\ngit init',
    },
    {
      title: 'Create a repo on GitHub',
      explanation: 'Go to github.com → click "+" → "New repository". Keep it empty if you already have local files.',
      cmd: '# No terminal command — do this on GitHub.com',
      note: 'Copy the repo URL — you will need it in the next step.',
    },
    {
      title: 'Link local to GitHub',
      explanation: 'Connect your local repository to the remote repository.',
      cmd: 'git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git',
    },
    {
      title: 'Stage your files',
      explanation: 'Tell Git which files should be included in your first commit.',
      cmd: 'git add .',
    },
    {
      title: 'Create your first commit',
      explanation: 'Save a snapshot of your files with a clear message.',
      cmd: 'git commit -m "Initial commit"',
    },
    {
      title: 'Set branch name to main',
      explanation: 'Use main as the default branch name if needed.',
      cmd: 'git branch -M main',
    },
    {
      title: '🚀 Push and set upstream',
      explanation: 'This links local main to origin/main. After this, future pushes are just `git push`.',
      cmd: 'git push -u origin main\n# next time:\n# git push',
      note: 'If push is rejected, first run: git pull --rebase origin main',
    },
    {
      title: 'If rebase changed commit IDs',
      explanation: 'After a rebase on your own branch, you might need a safe force push.',
      cmd: 'git push --force-with-lease origin main',
      note: 'Prefer --force-with-lease over --force. It protects teammates from accidental overwrite.',
    },
  ],
  regular: [
    {
      title: 'Check status',
      explanation: 'Always start by checking what changed locally.',
      cmd: 'git status',
    },
    {
      title: 'Pull latest updates',
      explanation: 'Sync with remote first to avoid avoidable conflicts.',
      cmd: 'git pull --rebase origin main',
    },
    {
      title: 'Stage your changes',
      explanation: 'Stage all changes or selected files.',
      cmd: 'git add .\n# OR specific files:\n# git add src/components/Button.jsx',
    },
    {
      title: 'Review staged changes',
      explanation: 'Confirm exactly what you are about to commit.',
      cmd: 'git diff --staged',
    },
    {
      title: 'Commit clearly',
      explanation: 'Use clear commit messages with prefixes like feat:, fix:, docs:, refactor:',
      cmd: 'git commit -m "feat: add profile settings page"',
    },
    {
      title: 'Push updates',
      explanation: 'Push to your tracked branch.',
      cmd: 'git push',
      note: 'If push fails after rebase on your own branch: git push --force-with-lease',
    },
  ],
  branch: [
    {
      title: 'Create feature branch',
      explanation: 'Work in feature branches instead of directly on main.',
      cmd: 'git checkout -b feature/your-feature-name',
    },
    {
      title: 'Build your feature',
      explanation: 'Make changes, run tests, and keep commits focused.',
      cmd: '# write code and test locally',
    },
    {
      title: 'Commit your changes',
      explanation: 'Stage and commit in small, meaningful units.',
      cmd: 'git add .\ngit commit -m "feat: implement your feature"',
    },
    {
      title: 'Push branch',
      explanation: 'First push uses -u to set tracking.',
      cmd: 'git push -u origin feature/your-feature-name',
    },
    {
      title: 'Open pull request',
      explanation: 'Describe what changed, why, and how it was tested.',
      cmd: '# GitHub → Pull requests → New pull request',
    },
    {
      title: 'After merge, clean up',
      explanation: 'Keep local repo tidy after PR merge.',
      cmd: 'git checkout main\ngit pull --rebase origin main\ngit branch -d feature/your-feature-name',
    },
  ],
  fork: [
    {
      title: 'Fork repository on GitHub',
      explanation: 'Create your copy of the original project.',
      cmd: '# On GitHub.com → click Fork',
    },
    {
      title: 'Clone your fork',
      explanation: 'Download your fork to your local machine.',
      cmd: 'git clone https://github.com/YOUR_USERNAME/FORKED_REPO.git\ncd FORKED_REPO',
    },
    {
      title: 'Add upstream remote',
      explanation: 'Track updates from the original repository.',
      cmd: 'git remote add upstream https://github.com/ORIGINAL_OWNER/REPO.git\ngit remote -v',
    },
    {
      title: 'Create contribution branch',
      explanation: 'Never commit directly to fork main.',
      cmd: 'git checkout -b fix/your-contribution',
    },
    {
      title: 'Commit contribution',
      explanation: 'Keep commit messages specific and review-ready.',
      cmd: 'git add .\ngit commit -m "fix: describe your change"',
    },
    {
      title: 'Push to your fork',
      explanation: 'Push branch to your fork and create a pull request.',
      cmd: 'git push -u origin fix/your-contribution',
    },
    {
      title: 'Open PR to original repo',
      explanation: 'Target the original repository main branch.',
      cmd: '# GitHub → your fork → Compare & pull request',
    },
  ],
};

function renderPushSteps(scenario) {
  const container = document.getElementById('pushSteps');
  container.innerHTML = '';
  scenarios[scenario].forEach((step, i) => {
    const card = document.createElement('div');
    card.className = 'step-card';
    card.innerHTML = `
      <div class="step-card-header">
        <div class="step-num-badge">${i + 1}</div>
        <div class="step-card-title">${step.title}</div>
        <div class="step-card-done" title="Mark as done"></div>
      </div>
      <div class="step-card-body">
        <div class="step-explanation">${step.explanation}</div>
        <div class="step-cmd-block">
          <span class="step-cmd-text">${step.cmd}</span>
          <button class="copy-btn" data-cmd="${encodeURIComponent(step.cmd)}">Copy</button>
        </div>
        ${step.note ? `<div class="step-note">⚠️ ${step.note}</div>` : ''}
      </div>
    `;
    card.querySelector('.step-card-done').addEventListener('click', () => {
      card.classList.toggle('done');
    });
    card.querySelector('.copy-btn').addEventListener('click', function () {
      copyText(decodeURIComponent(this.dataset.cmd), this);
    });
    container.appendChild(card);
  });
}

document.querySelectorAll('.scenario-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.scenario-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderPushSteps(btn.dataset.scenario);
  });
});
renderPushSteps('first');

// ============================================================
// WORKFLOW BUILDER
// ============================================================
const workflows = [
  {
    icon: '✨',
    title: 'Start a New Project',
    desc: 'Init, connect, and push cleanly',
    steps: [
      { cmd: 'git init', desc: 'Initialize repository' },
      { cmd: 'git remote add origin <repo-url>', desc: 'Connect to GitHub remote' },
      { cmd: 'git add .', desc: 'Stage all files' },
      { cmd: 'git commit -m "Initial commit"', desc: 'Create first commit' },
      { cmd: 'git branch -M main', desc: 'Use main branch name' },
      { cmd: 'git push -u origin main', desc: 'Push and set upstream' },
      { cmd: 'git push', desc: 'Future pushes after upstream is set' },
    ],
  },
  {
    icon: '🌿',
    title: 'Create & Work on Branch',
    desc: 'Clean feature branch workflow',
    steps: [
      { cmd: 'git checkout -b feature/name', desc: 'Create and switch to branch' },
      { cmd: 'git add .', desc: 'Stage changes' },
      { cmd: 'git commit -m "feat: your feature"', desc: 'Commit clearly' },
      { cmd: 'git push -u origin feature/name', desc: 'Push feature branch' },
    ],
  },
  {
    icon: '🔀',
    title: 'Merge a Branch',
    desc: 'Safe merge into main',
    steps: [
      { cmd: 'git checkout main', desc: 'Switch to main' },
      { cmd: 'git pull --rebase origin main', desc: 'Sync latest main' },
      { cmd: 'git merge feature/name', desc: 'Merge feature branch' },
      { cmd: 'git push', desc: 'Push merged result' },
      { cmd: 'git branch -d feature/name', desc: 'Delete merged branch locally' },
    ],
  },
  {
    icon: '🛟',
    title: 'Recover from Push Rejection',
    desc: 'When remote has new commits',
    steps: [
      { cmd: 'git status', desc: 'Check working state first' },
      { cmd: 'git pull --rebase origin main', desc: 'Reapply local commits on top of remote' },
      { cmd: 'git push', desc: 'Push again after successful rebase' },
      { cmd: 'git push --force-with-lease', desc: 'Only if history was rewritten and branch is yours' },
    ],
  },
  {
    icon: '↩️',
    title: 'Undo Last Commit',
    desc: 'Keep or discard changes safely',
    steps: [
      { cmd: 'git log --oneline -5', desc: 'View recent commits' },
      { cmd: 'git reset --soft HEAD~1', desc: 'Undo commit, keep staged changes' },
      { cmd: 'git reset --mixed HEAD~1', desc: 'Undo commit, keep unstaged changes' },
      { cmd: 'git reset --hard HEAD~1', desc: 'Danger: remove commit and changes permanently' },
    ],
  },
  {
    icon: '🔄',
    title: 'Sync Fork with Original',
    desc: 'Keep fork up to date',
    steps: [
      { cmd: 'git remote add upstream <original-repo>', desc: 'Add original repo as upstream' },
      { cmd: 'git fetch upstream', desc: 'Fetch upstream updates' },
      { cmd: 'git checkout main', desc: 'Switch to your main branch' },
      { cmd: 'git merge upstream/main', desc: 'Merge upstream changes' },
      { cmd: 'git push origin main', desc: 'Update your fork on GitHub' },
    ],
  },
  {
    icon: '💾',
    title: 'Stash & Switch Context',
    desc: 'Pause and resume work quickly',
    steps: [
      { cmd: 'git stash', desc: 'Save uncommitted work' },
      { cmd: 'git checkout other-branch', desc: 'Switch branch' },
      { cmd: '# ...do urgent task...', desc: 'Handle urgent work' },
      { cmd: 'git checkout original-branch', desc: 'Return to original branch' },
      { cmd: 'git stash pop', desc: 'Restore stashed changes' },
    ],
  },
  {
    icon: '🏷️',
    title: 'Tag a Release',
    desc: 'Create and publish versions',
    steps: [
      { cmd: 'git tag -a v1.0.0 -m "Release v1.0.0"', desc: 'Create annotated tag' },
      { cmd: 'git push origin v1.0.0', desc: 'Push single tag' },
      { cmd: 'git push origin --tags', desc: 'Push all tags when needed' },
    ],
  },
  {
    icon: '🔍',
    title: 'Find Bug with Bisect',
    desc: 'Binary search through history',
    steps: [
      { cmd: 'git bisect start', desc: 'Start bisect mode' },
      { cmd: 'git bisect bad HEAD', desc: 'Current commit is bad' },
      { cmd: 'git bisect good <good-commit>', desc: 'Known good commit' },
      { cmd: 'git bisect good  # or git bisect bad', desc: 'Mark each tested commit' },
      { cmd: 'git bisect reset', desc: 'End bisect session' },
    ],
  },
];

const wfGrid = document.getElementById('workflowGrid');
const wfResult = document.getElementById('workflowResult');
const wfCommands = document.getElementById('wfCommands');
const wfResultTitle = document.getElementById('wfResultTitle');
const workflowPanel = document.getElementById('panel-workflow');

workflows.forEach((wf) => {
  const card = document.createElement('div');
  card.className = 'wf-card';
  card.innerHTML = `
    <div class="wf-icon">${wf.icon}</div>
    <h3>${wf.title}</h3>
    <p>${wf.desc}</p>
  `;
  card.addEventListener('click', () => {
    wfResultTitle.textContent = `${wf.icon} ${wf.title}`;
    wfCommands.innerHTML = wf.steps
      .map(
        (s, i) => `
      <div class="wf-cmd-row">
        <div class="wf-cmd-num">${i + 1}</div>
        <div class="wf-cmd-info">
          <div class="wf-cmd-code">
            <span class="wf-cmd-text">${escapeHtml(s.cmd)}</span>
            <button class="copy-btn" data-wf-cmd="${encodeURIComponent(s.cmd)}">Copy</button>
          </div>
          ${s.desc ? `<div class="wf-cmd-desc">${escapeHtml(s.desc)}</div>` : ''}
        </div>
      </div>
    `
      )
      .join('');

    wfCommands.querySelectorAll('[data-wf-cmd]').forEach((btn) => {
      btn.addEventListener('click', function () {
        copyText(decodeURIComponent(this.dataset.wfCmd), this);
      });
    });

    wfResult.style.display = 'block';
    scrollPanelTo(workflowPanel, wfResult);
  });
  wfGrid.appendChild(card);
});

document.getElementById('closeResult').addEventListener('click', () => {
  wfResult.style.display = 'none';
});

// ============================================================
// SKILL PATH
// ============================================================
const academyTracks = [
  {
    level: 'Level 1',
    title: 'Git Basics',
    summary: 'Understand repository setup and day-one commands.',
    items: ['git init', 'git status', 'git add', 'git commit', 'git push -u origin main'],
  },
  {
    level: 'Level 2',
    title: 'Branch Confidence',
    summary: 'Build features safely with branches and pull requests.',
    items: ['git checkout -b', 'git pull --rebase', 'PR workflow', 'clean commit messages'],
  },
  {
    level: 'Level 3',
    title: 'Collaboration',
    summary: 'Work with teams without breaking history.',
    items: ['merge conflict resolution', 'git fetch', 'git remote -v', 'review-first workflow'],
  },
  {
    level: 'Level 4',
    title: 'History Mastery',
    summary: 'Rewrite and recover history responsibly.',
    items: ['git rebase -i', 'git cherry-pick', 'git reflog', 'git revert'],
  },
  {
    level: 'Level 5',
    title: 'Release Operations',
    summary: 'Ship versions and keep stable delivery pipelines.',
    items: ['git tag -a', 'release branches', 'hotfix workflow', 'git push --tags'],
  },
  {
    level: 'Level 6',
    title: 'Expert Debugging',
    summary: 'Track down deep issues in large repositories.',
    items: ['git bisect', 'git blame', 'git log --graph', 'safe force strategy'],
  },
];

function renderAcademy() {
  const academyGrid = document.getElementById('academyGrid');
  academyGrid.innerHTML = academyTracks
    .map(
      (track) => `
    <div class="academy-card">
      <div class="academy-level">${track.level}</div>
      <h3>${track.title}</h3>
      <p>${track.summary}</p>
      <p><strong>Focus:</strong> ${track.items.map((i) => `<code>${escapeHtml(i)}</code>`).join(', ')}</p>
    </div>
  `
    )
    .join('');
}

renderAcademy();

// ============================================================
// VISUAL MASTERCLASS (Git + GitHub in one place)
// ============================================================
const visualTracks = [
  {
    id: 'starter',
    label: 'Starter Path',
    summary: 'First repo + first push + first PR',
    roadmap: [
      { title: 'Install & Configure', detail: 'Set identity and verify Git installation.' },
      { title: 'Initialize Repo', detail: 'Create local Git history from your project folder.' },
      { title: 'Connect to GitHub', detail: 'Create remote repository and add origin.' },
      { title: 'First Push', detail: 'Use -u once, then future pushes are simpler.' },
      { title: 'Open First PR', detail: 'Create your first review-friendly pull request.' },
    ],
    graph: [
      { branch: 'main', nodes: ['A', 'B', 'C'] },
      { branch: 'feature/docs', nodes: ['f1', 'f2', 'M*'] },
    ],
    terminal: [
      {
        accept: ['git init'],
        output: 'Initialized empty Git repository in ./ .git/',
        hint: 'Start by creating local git history with `git init`.',
      },
      {
        accept: ['git add .'],
        output: 'Staged all files.',
        hint: 'Stage files with `git add .` before committing.',
      },
      {
        accept: ['git commit -m*'],
        output: '[main abc1234] Initial commit created.',
        hint: 'Create a commit with `git commit -m "Initial commit"`.',
      },
      {
        accept: ['git branch -m main', 'git branch -M main', 'git branch -m main'],
        output: 'Branch renamed to main.',
        hint: 'Use `git branch -M main` for modern default naming.',
      },
      {
        accept: ['git remote add origin*'],
        output: 'Remote origin added.',
        hint: 'Add remote URL: `git remote add origin https://github.com/you/repo.git`',
      },
      {
        accept: ['git push -u origin main'],
        output: 'Push successful. Upstream tracking is now set.',
        hint: 'First push should be `git push -u origin main`.',
      },
    ],
    githubProcedure: [
      { title: 'Create repository', detail: 'GitHub → New repository → keep it empty if code already exists locally.' },
      { title: 'Copy HTTPS URL', detail: 'Copy repo URL and keep it ready for `git remote add origin`.' },
      { title: 'Push local code', detail: 'Run push commands from your terminal after commit.' },
      { title: 'Check Files tab', detail: 'Verify README/code appears in GitHub repo.' },
      { title: 'Create first branch PR', detail: 'Open a feature branch and create your first pull request.' },
    ],
    missions: [
      { tag: 'Day 1', title: 'Create local repo', detail: 'Run init, add, commit in a sample folder.' },
      { tag: 'Day 2', title: 'Push to GitHub', detail: 'Connect origin and complete first push.' },
      { tag: 'Day 3', title: 'Branch + PR', detail: 'Create feature branch and open PR.' },
    ],
  },
  {
    id: 'collab',
    label: 'Collaboration Path',
    summary: 'Feature branches, review loops, and clean history',
    roadmap: [
      { title: 'Create Feature Branch', detail: 'Never code directly on main in team projects.' },
      { title: 'Commit in Small Chunks', detail: 'Write review-friendly commits with clear messages.' },
      { title: 'Push Branch + PR', detail: 'Open pull request with context and testing notes.' },
      { title: 'Review & Rebase', detail: 'Resolve review comments and keep branch updated.' },
      { title: 'Merge Cleanly', detail: 'Merge PR and cleanup local branches.' },
    ],
    graph: [
      { branch: 'main', nodes: ['A', 'B', 'C', 'D'] },
      { branch: 'feature/login', nodes: ['l1', 'l2', 'M*'] },
    ],
    terminal: [
      {
        accept: ['git checkout -b feature/login'],
        output: 'Switched to new branch feature/login.',
        hint: 'Start feature work with `git checkout -b feature/login`.',
      },
      {
        accept: ['git add .'],
        output: 'Changes staged.',
        hint: 'Stage your feature updates with `git add .`.',
      },
      {
        accept: ['git commit -m*'],
        output: 'Feature commit created.',
        hint: 'Use descriptive commit message, for example `feat: add login form`.',
      },
      {
        accept: ['git push -u origin feature/login'],
        output: 'Remote branch created and tracking set.',
        hint: 'First branch push usually uses -u.',
      },
      {
        accept: ['git pull --rebase origin main'],
        output: 'Branch rebased on latest main.',
        hint: 'Keep your branch fresh with `git pull --rebase origin main`.',
      },
      {
        accept: ['git push --force-with-lease*', 'git push'],
        output: 'Remote branch updated safely.',
        hint: 'After rebase, prefer `git push --force-with-lease`.',
      },
    ],
    githubProcedure: [
      { title: 'Open Pull Request', detail: 'GitHub → Compare & pull request from feature branch.' },
      { title: 'Write strong PR summary', detail: 'Include what changed, why, and how tested.' },
      { title: 'Request review', detail: 'Tag reviewer/team and mention risky areas.' },
      { title: 'Resolve comments', detail: 'Push follow-up commits and mark threads resolved.' },
      { title: 'Merge + delete branch', detail: 'Use squash/rebase policy and cleanup branch.' },
    ],
    missions: [
      { tag: 'Day 8', title: 'Feature branch flow', detail: 'Create, push, and PR one branch end-to-end.' },
      { tag: 'Day 9', title: 'Review simulation', detail: 'Respond to 3 mock PR comments.' },
      { tag: 'Day 10', title: 'Rebase practice', detail: 'Rebase feature branch on latest main safely.' },
    ],
  },
  {
    id: 'recovery',
    label: 'Recovery Path',
    summary: 'Conflicts, rejected pushes, and safe force strategy',
    roadmap: [
      { title: 'Diagnose first', detail: 'Read `git status` and understand before running commands.' },
      { title: 'Rebase conflicts', detail: 'Resolve line conflicts cleanly and continue rebase.' },
      { title: 'Safe force push', detail: 'Use force-with-lease when history was rewritten.' },
      { title: 'Reflog rescue', detail: 'Recover accidental resets or bad rebases quickly.' },
      { title: 'Post-incident habits', detail: 'Add checks to avoid repeating same issues.' },
    ],
    graph: [
      { branch: 'main', nodes: ['A', 'B', 'C', 'D'] },
      { branch: 'feature/payments', nodes: ['p1', 'p2', 'R', 'M*'] },
    ],
    terminal: [
      {
        accept: ['git status'],
        output: 'Status checked. You know current branch and pending changes.',
        hint: 'Always inspect state first with `git status`.',
      },
      {
        accept: ['git pull --rebase origin main'],
        output: 'Rebase started. Resolve conflicts if prompted.',
        hint: 'Use rebase pull to replay local commits on remote changes.',
      },
      {
        accept: ['git add .', 'git add*'],
        output: 'Conflict resolutions staged.',
        hint: 'After fixing conflict files, stage them with `git add`.',
      },
      {
        accept: ['git rebase --continue'],
        output: 'Rebase continued successfully.',
        hint: 'Continue rebase after staging resolved files.',
      },
      {
        accept: ['git push --force-with-lease*'],
        output: 'Remote updated safely after rewritten history.',
        hint: 'For rebased branch, use `git push --force-with-lease` not raw --force.',
      },
      {
        accept: ['git reflog'],
        output: 'Reflog displayed. Recovery points identified.',
        hint: 'Use reflog when you need to recover lost commits.',
      },
    ],
    githubProcedure: [
      { title: 'Check PR conflict marker', detail: 'PR page shows conflict status if branch is behind.' },
      { title: 'Update branch from main', detail: 'Rebase/merge locally, then push updated branch.' },
      { title: 'Verify commits in PR', detail: 'Ensure only expected commits appear after rewrite.' },
      { title: 'Communicate force push', detail: 'Notify reviewers if branch history changed.' },
      { title: 'Merge when checks pass', detail: 'Only merge after CI and review are green.' },
    ],
    missions: [
      { tag: 'Day 18', title: 'Conflict drill', detail: 'Resolve one simulated merge conflict end-to-end.' },
      { tag: 'Day 19', title: 'Rebase + lease', detail: 'Practice safe force update after rebase.' },
      { tag: 'Day 20', title: 'Reflog recovery', detail: 'Recover a dropped commit in demo repo.' },
    ],
  },
  {
    id: 'expert',
    label: 'Expert Ops Path',
    summary: 'Releases, debugging history, and team automation',
    roadmap: [
      { title: 'Release versioning', detail: 'Tag stable versions and publish release notes.' },
      { title: 'Hotfix discipline', detail: 'Patch production with minimal risk.' },
      { title: 'Bisect debugging', detail: 'Find bad commits quickly with binary search.' },
      { title: 'Quality gates', detail: 'Use GitHub Actions and branch rules for consistency.' },
      { title: 'Mentor workflows', detail: 'Scale standards across teams.' },
    ],
    graph: [
      { branch: 'main', nodes: ['A', 'B', 'v1.2', 'H1', 'v1.3'] },
      { branch: 'hotfix/1.2.1', nodes: ['h1', 'M*'] },
    ],
    terminal: [
      {
        accept: ['git checkout main'],
        output: 'Switched to main.',
        hint: 'Prepare release actions from main branch.',
      },
      {
        accept: ['git pull --rebase origin main', 'git pull origin main'],
        output: 'Main updated from remote.',
        hint: 'Always sync latest main before release tags.',
      },
      {
        accept: ['git tag -a*'],
        output: 'Annotated release tag created.',
        hint: 'Create release tag like `git tag -a v1.2.0 -m "Release v1.2.0"`.',
      },
      {
        accept: ['git push origin --tags', 'git push origin v1.2.0'],
        output: 'Release tag pushed to remote.',
        hint: 'Push tags to publish release markers.',
      },
      {
        accept: ['git bisect start'],
        output: 'Bisect session started.',
        hint: 'Use bisect for fast root-cause search in commit history.',
      },
      {
        accept: ['git bisect reset'],
        output: 'Bisect ended and branch restored.',
        hint: 'Always reset after bisect is done.',
      },
    ],
    githubProcedure: [
      { title: 'Create GitHub Release', detail: 'GitHub → Releases → Draft new release from pushed tag.' },
      { title: 'Attach changelog', detail: 'Add highlights, breaking changes, migration notes.' },
      { title: 'Protect main branch', detail: 'Require PR reviews and status checks.' },
      { title: 'Configure CI rules', detail: 'Block merge on failed tests/lint checks.' },
      { title: 'Track incident fixes', detail: 'Link hotfix PRs to issues for audit trail.' },
    ],
    missions: [
      { tag: 'Day 26', title: 'Release tag', detail: 'Tag and publish a demo release with notes.' },
      { tag: 'Day 27', title: 'Hotfix branch', detail: 'Create and merge a hotfix flow.' },
      { tag: 'Day 28', title: 'Bisect session', detail: 'Find a broken commit using bisect.' },
    ],
  },
];

const gitignorePresets = {
  common: [
    '# OS files',
    '.DS_Store',
    'Thumbs.db',
    '',
    '# Editor and local settings',
    '.idea/',
    '.vscode/*',
    '!.vscode/extensions.json',
    '!.vscode/settings.json',
    '',
    '# Environment files',
    '.env',
    '.env.*',
    '!.env.example',
  ],
  node: ['node_modules/', 'npm-debug.log*', 'yarn-debug.log*', 'pnpm-debug.log*', 'dist/', 'coverage/'],
  react: ['build/', '.eslintcache'],
  nextjs: ['.next/', 'out/'],
  python: ['__pycache__/', '*.py[cod]', '.venv/', 'venv/', '.pytest_cache/', '.mypy_cache/'],
  java: ['*.class', '*.jar', '.gradle/', 'build/', 'target/'],
  go: ['bin/', 'pkg/', '*.test', 'coverage.out'],
  rust: ['target/', 'Cargo.lock'],
  flutter: ['.dart_tool/', '.packages', '.flutter-plugins', '.flutter-plugins-dependencies', 'build/'],
};

const stackLabels = {
  node: 'Node.js',
  react: 'React',
  nextjs: 'Next.js',
  python: 'Python',
  java: 'Java',
  go: 'Go',
  rust: 'Rust',
  flutter: 'Flutter',
};

let currentVisualTrack = visualTracks[0];
let sandboxStepIndex = 0;

function normalizeCommand(cmd) {
  return cmd.trim().replace(/\s+/g, ' ').toLowerCase();
}

function matchCommand(input, rule) {
  const normalizedInput = normalizeCommand(input);
  const normalizedRule = normalizeCommand(rule);
  if (normalizedRule.endsWith('*')) return normalizedInput.startsWith(normalizedRule.slice(0, -1));
  return normalizedInput === normalizedRule;
}

function renderVisualTrackTabs() {
  const tabs = document.getElementById('visualTrackTabs');
  tabs.innerHTML = visualTracks
    .map(
      (track) => `
    <button class="visual-track-btn ${track.id === currentVisualTrack.id ? 'active' : ''}" data-visual-track="${track.id}">
      ${track.label}
    </button>
  `
    )
    .join('');

  tabs.querySelectorAll('[data-visual-track]').forEach((btn) => {
    btn.addEventListener('click', () => setVisualTrack(btn.dataset.visualTrack));
  });
}

function renderVisualRoadmap(track) {
  const el = document.getElementById('visualRoadmap');
  const activeIndex = Math.min(sandboxStepIndex, track.roadmap.length - 1);
  el.innerHTML = track.roadmap
    .map(
      (step, index) => `
    <div class="roadmap-step ${index === activeIndex ? 'active' : ''}">
      <div class="roadmap-index">${index + 1}</div>
      <div class="roadmap-content">
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.detail)}</p>
      </div>
    </div>
  `
    )
    .join('');
}

function renderVisualGraph(track) {
  const graph = document.getElementById('visualGraph');
  graph.innerHTML = track.graph
    .map(
      (lane) => `
    <div class="graph-lane">
      <div class="graph-branch">${escapeHtml(lane.branch)}</div>
      <div class="graph-nodes">
        ${lane.nodes
          .map((node) => `<div class="graph-node ${node.includes('*') ? 'merge' : ''}">${escapeHtml(node.replace('*', ''))}</div>`)
          .join('')}
      </div>
    </div>
  `
    )
    .join('');
}

function appendSandboxLine(text, type = 'ok') {
  const screen = document.getElementById('sandboxOutput');
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  line.textContent = text;
  screen.appendChild(line);
  screen.scrollTop = screen.scrollHeight;
}

function resetTerminalTrainer(track = currentVisualTrack) {
  sandboxStepIndex = 0;
  const screen = document.getElementById('sandboxOutput');
  screen.innerHTML = '';
  appendSandboxLine(`Track: ${track.label} — ${track.summary}`, 'ok');
  appendSandboxLine(`Step 1/${track.terminal.length}: ${track.terminal[0].hint}`, 'ok');
  renderVisualRoadmap(track);
}

function runSandboxCommand() {
  const input = document.getElementById('sandboxInput');
  const rawCommand = input.value.trim();
  if (!rawCommand) return;

  const currentStep = currentVisualTrack.terminal[sandboxStepIndex];
  appendSandboxLine(`$ ${rawCommand}`, 'command');

  const isValid = currentStep.accept.some((rule) => matchCommand(rawCommand, rule));
  if (!isValid) {
    appendSandboxLine(`Not yet. Hint: ${currentStep.hint}`, 'error');
    input.value = '';
    return;
  }

  appendSandboxLine(currentStep.output, 'ok');
  sandboxStepIndex += 1;

  if (sandboxStepIndex >= currentVisualTrack.terminal.length) {
    appendSandboxLine('✅ Track complete. You can switch to another track or reset and practice again.', 'ok');
    renderVisualRoadmap(currentVisualTrack);
    input.value = '';
    return;
  }

  const nextStep = currentVisualTrack.terminal[sandboxStepIndex];
  appendSandboxLine(`Next Step ${sandboxStepIndex + 1}/${currentVisualTrack.terminal.length}: ${nextStep.hint}`, 'ok');
  renderVisualRoadmap(currentVisualTrack);
  input.value = '';
}

function showSandboxHint() {
  const currentStep = currentVisualTrack.terminal[sandboxStepIndex];
  if (!currentStep) return;
  appendSandboxLine(`Hint: ${currentStep.hint}`, 'ok');
}

function renderGithubProcedure(track) {
  const container = document.getElementById('githubProcedure');
  container.innerHTML = track.githubProcedure
    .map(
      (step, index) => `
    <label class="procedure-item">
      <input type="checkbox" data-procedure="${index}" />
      <div>
        <strong>${index + 1}. ${escapeHtml(step.title)}</strong>
        <p>${escapeHtml(step.detail)}</p>
      </div>
    </label>
  `
    )
    .join('');

  container.querySelectorAll('input[type="checkbox"]').forEach((check) => {
    check.addEventListener('change', updateProcedureProgress);
  });
  updateProcedureProgress();
}

function updateProcedureProgress() {
  const checks = Array.from(document.querySelectorAll('#githubProcedure input[type="checkbox"]'));
  if (checks.length === 0) return;
  const done = checks.filter((c) => c.checked).length;
  const percentage = Math.round((done / checks.length) * 100);
  document.getElementById('procedureProgressBar').style.width = `${percentage}%`;
}

function renderMissions(track) {
  const list = document.getElementById('missionList');
  list.innerHTML = track.missions
    .map(
      (mission) => `
    <label class="mission-item">
      <div class="mission-item-header">
        <h3>${escapeHtml(mission.title)}</h3>
        <span class="mission-tag">${escapeHtml(mission.tag)}</span>
      </div>
      <p>${escapeHtml(mission.detail)}</p>
      <p style="margin-top:6px;font-size:0.74rem;color:var(--text3)">
        <input type="checkbox" style="accent-color: var(--accent);margin-right:6px" /> Mark complete
      </p>
    </label>
  `
    )
    .join('');
}

function updateGitignorePreview() {
  const selectedStacks = Array.from(document.querySelectorAll('#gitignoreStacks input:checked')).map((input) => input.value);
  const finalLines = [];
  const seen = new Set();

  const pushUnique = (line) => {
    const key = line.trim();
    if (seen.has(key)) return;
    seen.add(key);
    finalLines.push(line);
  };

  pushUnique('# Generated by GitVora');
  pushUnique('');
  gitignorePresets.common.forEach(pushUnique);
  selectedStacks.forEach((stack) => {
    pushUnique('');
    pushUnique(`# ${stackLabels[stack]} stack`);
    gitignorePresets[stack].forEach(pushUnique);
  });

  if (selectedStacks.length === 0) {
    pushUnique('');
    pushUnique('# Tip: Select one or more stacks above for framework-specific entries.');
  }

  document.getElementById('gitignorePreview').textContent = finalLines.join('\n');
}

function renderGitignoreStacks() {
  const container = document.getElementById('gitignoreStacks');
  container.innerHTML = Object.entries(stackLabels)
    .map(
      ([key, label]) => `
    <label class="stack-option">
      <input type="checkbox" value="${key}" />
      ${label}
    </label>
  `
    )
    .join('');

  container.querySelectorAll('input[type="checkbox"]').forEach((check) => {
    check.addEventListener('change', updateGitignorePreview);
  });
  updateGitignorePreview();
}

function setVisualTrack(trackId) {
  const nextTrack = visualTracks.find((track) => track.id === trackId);
  if (!nextTrack) return;
  currentVisualTrack = nextTrack;
  renderVisualTrackTabs();
  renderVisualRoadmap(currentVisualTrack);
  renderVisualGraph(currentVisualTrack);
  renderGithubProcedure(currentVisualTrack);
  renderMissions(currentVisualTrack);
  resetTerminalTrainer(currentVisualTrack);
}

function initVisualMasterclass() {
  if (!document.getElementById('panel-visual')) return;

  renderGitignoreStacks();
  setVisualTrack(currentVisualTrack.id);

  document.getElementById('sandboxRunBtn').addEventListener('click', runSandboxCommand);
  document.getElementById('sandboxHintBtn').addEventListener('click', showSandboxHint);
  document.getElementById('sandboxResetBtn').addEventListener('click', () => resetTerminalTrainer(currentVisualTrack));
  document.getElementById('sandboxInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runSandboxCommand();
    }
  });

  document.getElementById('copyGitignoreBtn').addEventListener('click', function () {
    copyText(document.getElementById('gitignorePreview').textContent, this);
  });
}

initVisualMasterclass();

// ============================================================
// ERROR DETECTIVE
// ============================================================
const allErrors = [
  {
    tag: 'PUSH REJECTED',
    title: 'error: failed to push some refs to origin',
    cause: 'Remote has commits your local branch does not have.',
    fix: '$ git pull --rebase origin main\n$ git push\n# If you rebased your own branch:\n$ git push --force-with-lease',
  },
  {
    tag: 'MERGE CONFLICT',
    title: 'CONFLICT (content): Merge conflict in file',
    cause: 'Two branches changed the same lines and Git needs your decision.',
    fix: '# 1) Open conflicted file\n# 2) Resolve <<<<<<< ======= >>>>>>> sections\n$ git add <resolved-file>\n$ git commit -m "resolve merge conflict"',
  },
  {
    tag: 'UNRELATED HISTORIES',
    title: 'fatal: refusing to merge unrelated histories',
    cause: 'Local and remote repos started with different root commits.',
    fix: '$ git pull origin main --allow-unrelated-histories\n$ git push',
  },
  {
    tag: 'AUTH REMOVED',
    title: 'remote: Support for password authentication was removed',
    cause: 'GitHub no longer accepts account passwords for Git operations.',
    fix: '# Use PAT (personal access token) or SSH keys.\n$ ssh-keygen -t ed25519 -C "you@email.com"\n# Add public key to GitHub > Settings > SSH and GPG keys',
  },
  {
    tag: 'NO UPSTREAM',
    title: 'fatal: The current branch has no upstream branch',
    cause: 'Branch has never been connected to remote tracking branch.',
    fix: '$ git push -u origin <branch-name>\n# Future pushes:\n$ git push',
  },
  {
    tag: 'DETACHED HEAD',
    title: 'HEAD detached at <commit-hash>',
    cause: 'You checked out a commit directly, not a branch.',
    fix: '$ git checkout main\n# To keep detached work:\n$ git checkout -b rescue-branch',
  },
  {
    tag: 'PERMISSION DENIED',
    title: 'Permission denied (publickey)',
    cause: 'SSH key is missing from agent or not added to GitHub.',
    fix: '$ ssh -T git@github.com\n$ eval "$(ssh-agent -s)"\n$ ssh-add ~/.ssh/id_ed25519',
  },
  {
    tag: 'NOT A GIT REPO',
    title: 'fatal: not a git repository',
    cause: 'You ran command outside a repository folder.',
    fix: '$ cd /path/to/your/repo\n$ git status\n# or create one:\n$ git init',
  },
];

function renderErrorCatalogue() {
  const list = document.getElementById('errorsCatList');
  list.innerHTML = '';
  allErrors.forEach((e) => {
    const el = document.createElement('div');
    el.className = 'ecat-item';
    el.innerHTML = `
      <div class="ecat-header">
        <span class="ecat-tag">${e.tag}</span>
        <span class="ecat-title">${escapeHtml(e.title)}</span>
        <span class="ecat-arrow">▶</span>
      </div>
      <div class="ecat-body">
        <div class="ecat-cause">📌 ${escapeHtml(e.cause)}</div>
        <div class="ecat-fix">${escapeHtml(e.fix)}</div>
      </div>
    `;
    el.querySelector('.ecat-header').addEventListener('click', () => el.classList.toggle('open'));
    list.appendChild(el);
  });
}

renderErrorCatalogue();

function detectErrorFromInput(input) {
  const lower = input.toLowerCase();
  return allErrors.find((entry) => {
    const titleWords = entry.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    const tagWords = entry.tag.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    return (
      titleWords.some((word) => lower.includes(word)) ||
      tagWords.some((word) => lower.includes(word)) ||
      lower.includes(entry.title.toLowerCase()) ||
      lower.includes(entry.tag.toLowerCase())
    );
  });
}

document.getElementById('detectBtn').addEventListener('click', () => {
  const inputValue = document.getElementById('errorPasteBox').value.trim();
  const result = document.getElementById('errorResult');

  if (!inputValue) {
    result.style.display = 'none';
    return;
  }

  const match = detectErrorFromInput(inputValue);

  if (match) {
    result.style.display = 'block';
    result.innerHTML = `
      <div class="er-tag">🎯 DETECTED: ${match.tag}</div>
      <div class="er-title">${escapeHtml(match.title)}</div>
      <div class="er-section">
        <div class="er-label">What happened</div>
        <div class="er-text">${escapeHtml(match.cause)}</div>
      </div>
      <div class="er-section">
        <div class="er-label">How to fix it</div>
        <div class="er-fix">${escapeHtml(match.fix)}</div>
      </div>
    `;
  } else {
    result.style.display = 'block';
    result.innerHTML = `
      <div class="er-tag">🤔 NOT RECOGNIZED</div>
      <div class="er-title">This error is not in the quick database yet.</div>
      <div class="er-section">
        <div class="er-text">Send it to AI Assistant for a custom diagnosis with exact steps.</div>
      </div>
      <div style="margin-top:14px">
        <button class="btn-detect" id="askAiFromError">Ask AI Assistant →</button>
      </div>
    `;
    result.querySelector('#askAiFromError').addEventListener('click', () => {
      showPanel('chat');
      chatInput.value = `I got this Git error:\n${inputValue}\nHow do I fix it step-by-step?`;
      chatInput.dispatchEvent(new Event('input'));
      sendMessage(chatInput.value);
    });
  }

  const errorPanel = document.getElementById('panel-errors');
  scrollPanelTo(errorPanel, result);
});

// ============================================================
// COMMAND REFERENCE
// ============================================================
const refData = [
  {
    cat: '⚙️ Setup & Config',
    items: [
      {
        cmd: 'git config --global user.name "Name"',
        desc: 'Set your name',
        detail: 'This appears in every commit. Run once after Git install.',
        example: '$ git config --global user.name "Jane Doe"',
      },
      {
        cmd: 'git config --global user.email "email"',
        desc: 'Set your email',
        detail: 'Use the email connected to GitHub for contribution tracking.',
        example: '$ git config --global user.email "jane@example.com"',
      },
      {
        cmd: 'git config --list',
        desc: 'View all config',
        detail: 'Inspect current Git config values.',
        example: '$ git config --list',
      },
    ],
  },
  {
    cat: '📁 Repository',
    items: [
      {
        cmd: 'git init',
        desc: 'Create new repository',
        detail: 'Initializes a new Git repository in current folder.',
        example: '$ git init',
      },
      {
        cmd: 'git clone <url>',
        desc: 'Copy remote repository',
        detail: 'Downloads remote repository and full history.',
        example: '$ git clone https://github.com/user/repo.git',
      },
      {
        cmd: 'git status',
        desc: 'Show working tree',
        detail: 'Most useful command for daily work.',
        example: '$ git status',
      },
    ],
  },
  {
    cat: '📝 Staging & Committing',
    items: [
      {
        cmd: 'git add <file>',
        desc: 'Stage specific file',
        detail: 'Adds selected file to staging area.',
        example: '$ git add README.md',
      },
      {
        cmd: 'git add .',
        desc: 'Stage all changes',
        detail: 'Stages all tracked and untracked files from current folder.',
        example: '$ git add .',
      },
      {
        cmd: 'git commit -m "msg"',
        desc: 'Commit staged changes',
        detail: 'Creates commit snapshot from staged files.',
        example: '$ git commit -m "feat: add authentication"',
      },
      {
        cmd: 'git commit --amend',
        desc: 'Modify last commit',
        detail: 'Edit last commit message or include missed files.',
        example: '$ git add forgotten.js\n$ git commit --amend',
      },
    ],
  },
  {
    cat: '🌿 Branching',
    items: [
      {
        cmd: 'git branch',
        desc: 'List branches',
        detail: 'Shows local branches. Use -a for local + remote.',
        example: '$ git branch -a',
      },
      {
        cmd: 'git checkout -b <name>',
        desc: 'Create and switch branch',
        detail: 'Shortcut to create and switch in one command.',
        example: '$ git checkout -b feature/new-ui',
      },
      {
        cmd: 'git switch <branch>',
        desc: 'Switch branch (modern)',
        detail: 'Modern alternative to checkout for branch switching.',
        example: '$ git switch main',
      },
      {
        cmd: 'git merge <branch>',
        desc: 'Merge into current branch',
        detail: 'Combines changes from another branch.',
        example: '$ git merge feature/new-ui',
      },
    ],
  },
  {
    cat: '☁️ Remote',
    items: [
      {
        cmd: 'git remote add origin <url>',
        desc: 'Add remote',
        detail: 'Connect local repository to remote GitHub URL.',
        example: '$ git remote add origin https://github.com/user/repo.git',
      },
      {
        cmd: 'git push -u origin main',
        desc: 'First push and set upstream',
        detail: 'Sets tracking so future pushes can use plain `git push`.',
        example: '$ git push -u origin main\n$ git push',
      },
      {
        cmd: 'git push --force-with-lease',
        desc: 'Safe force push',
        detail: 'Use when your branch history changed (for example, after rebase). Safer than --force.',
        example: '$ git pull --rebase origin main\n$ git push --force-with-lease origin feature/my-branch',
      },
      {
        cmd: 'git pull --rebase',
        desc: 'Update branch cleanly',
        detail: 'Pull and replay your commits on top of remote updates.',
        example: '$ git pull --rebase origin main',
      },
      {
        cmd: 'git fetch',
        desc: 'Download remote changes only',
        detail: 'Gets updates without merging. Safe for inspection.',
        example: '$ git fetch origin',
      },
    ],
  },
  {
    cat: '⏮️ Undo & Recovery',
    items: [
      {
        cmd: 'git restore <file>',
        desc: 'Discard file changes',
        detail: 'Reverts file to last committed state.',
        example: '$ git restore index.html',
      },
      {
        cmd: 'git reset HEAD <file>',
        desc: 'Unstage file',
        detail: 'Removes file from staging area.',
        example: '$ git reset HEAD src/config.js',
      },
      {
        cmd: 'git revert <hash>',
        desc: 'Undo commit safely',
        detail: 'Creates new commit that reverses an existing one.',
        example: '$ git revert abc1234',
      },
      {
        cmd: 'git reflog',
        desc: 'Recover lost commits',
        detail: 'Shows where HEAD moved so you can recover states.',
        example: '$ git reflog',
      },
    ],
  },
];

function renderReference(filter = '') {
  const container = document.getElementById('refCategories');
  container.innerHTML = '';

  refData.forEach((category) => {
    const items = filter
      ? category.items.filter((item) => item.cmd.toLowerCase().includes(filter) || item.desc.toLowerCase().includes(filter))
      : category.items;

    if (items.length === 0) return;

    const catEl = document.createElement('div');
    catEl.className = 'ref-cat';
    catEl.innerHTML = `
      <div class="ref-cat-title">${category.cat}</div>
      <div class="ref-items">
        ${items
          .map(
            (item) => `
          <div class="ref-item">
            <div class="ref-item-header">
              <span class="ref-cmd">${escapeHtml(item.cmd)}</span>
              <span class="ref-desc">${escapeHtml(item.desc)}</span>
              <span style="color:var(--text3);font-size:0.8rem">▶</span>
            </div>
            <div class="ref-item-body">
              <div class="ref-detail">${escapeHtml(item.detail)}</div>
              <div class="ref-example">${escapeHtml(item.example)}</div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;

    catEl.querySelectorAll('.ref-item').forEach((item) => {
      item.querySelector('.ref-item-header').addEventListener('click', () => item.classList.toggle('open'));
    });

    container.appendChild(catEl);
  });
}

document.getElementById('refSearch').addEventListener('input', (e) => {
  renderReference(e.target.value.toLowerCase().trim());
});
renderReference();

// ============================================================
// AI ASSISTANT (Reliable local-first mode)
// ============================================================
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const conversationHistory = [];

function formatMessage(text) {
  // Escape first for safety
  let safe = escapeHtml(text);

  // Links
  safe = safe.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

  // Code blocks
  safe = safe.replace(/```([\s\S]*?)```/g, (_, block) => `<pre>${block.trim()}</pre>`);

  // Inline code
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold and italics
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Paragraphs + lists
  const blocks = safe.split(/\n{2,}/).map((chunk) => chunk.trim()).filter(Boolean);
  return blocks
    .map((chunk) => {
      const lines = chunk.split('\n');
      const isList = lines.every((line) => line.trim().startsWith('- '));
      if (isList) {
        const listItems = lines.map((line) => `<li>${line.trim().slice(2)}</li>`).join('');
        return `<ul>${listItems}</ul>`;
      }
      return `<p>${chunk.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
}

function addMessage(role, text) {
  const el = document.createElement('div');
  el.className = `chat-msg ${role}`;
  el.innerHTML = `
    <div class="msg-avatar">${role === 'ai' ? '⬡' : '👤'}</div>
    <div class="msg-content">
      <div class="msg-name">${role === 'ai' ? 'GitVora AI' : 'You'}</div>
      <div class="msg-text">${formatMessage(text)}</div>
    </div>
  `;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getErrorHelpReply(userText) {
  const match = detectErrorFromInput(userText);
  if (!match) return null;
  return `I recognized this as **${match.tag}**.

**Why this happens**
- ${match.cause}

**Fix steps**
\`\`\`
${match.fix}
\`\`\`

If you want, paste your exact terminal output and I will tailor these commands to your repo state.`;
}

function getCommandHelpReply(userText) {
  const lower = userText.toLowerCase();
  const allItems = refData.flatMap((cat) => cat.items);
  const matched = allItems.find((item) => {
    const cleanCmd = item.cmd.toLowerCase().replace(/<[^>]+>/g, '').trim();
    const parts = cleanCmd.split(/\s+/);
    const primary = parts.length > 1 ? `git ${parts[1]}` : cleanCmd;
    return lower.includes(primary) || lower.includes(cleanCmd);
  });

  if (!matched) return null;

  return `Here is a quick guide for \`${matched.cmd}\`:

- **What it does:** ${matched.detail}
- **When to use it:** ${matched.desc}

\`\`\`
${matched.example}
\`\`\`

Tell me your exact goal and I can give you the exact command sequence next.`;
}

function getRoadmapReply() {
  return `Great goal. Here is the **GitVora 6-level roadmap**:

- Level 1 (Starter): \`git init\`, \`git status\`, \`git add\`, \`git commit\`, first push
- Level 2 (Builder): branches, PRs, \`git pull --rebase\`
- Level 3 (Collaborator): merge conflicts, fetch/merge safety, review workflow
- Level 4 (Advanced): interactive rebase, cherry-pick, stash
- Level 5 (Guardian): reflog recovery, safe force strategy (\`--force-with-lease\`)
- Level 6 (Expert): bisect, blame, release/version workflows

Practice 15 minutes daily and ask me for drills anytime.`;
}

function localAssistantReply(userText) {
  const lower = userText.toLowerCase();

  if (/\b(hi|hello|hey)\b/.test(lower)) {
    return 'Hi! I am GitVora AI. Ask me any Git/GitHub question and I will give you step-by-step commands.';
  }

  if (lower.includes('first push') || lower.includes('push my code first time')) {
    return `Use this first-push flow:

\`\`\`
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
\`\`\`

After that, use just:
\`\`\`
git push
\`\`\``;
  }

  if (lower.includes('--force') || lower.includes('force push') || lower.includes('force')) {
    return `Use force push carefully:

- Preferred: \`git push --force-with-lease\`
- Avoid raw \`--force\` unless absolutely necessary
- Use after rebase/squash on your own branch, not shared team branches

Safe pattern:
\`\`\`
git pull --rebase origin main
git push --force-with-lease origin <branch>
\`\`\``;
  }

  if (lower.includes('beginner') || lower.includes('expert') || lower.includes('roadmap') || lower.includes('learn git')) {
    return getRoadmapReply();
  }

  if (lower.includes('github procedure') || lower.includes('visual') || lower.includes('teach me git')) {
    return `Open the **Visual Coach** panel (shortcut: key 4).

It gives you:
- visual roadmap from starter to expert
- branch graph examples
- terminal command trainer with hints
- GitHub UI procedure checklist
- mission ladder and .gitignore generator

Tell me your level and I can recommend the exact track to start with.`;
  }

  const errorReply = getErrorHelpReply(userText);
  if (errorReply) return errorReply;

  const cmdReply = getCommandHelpReply(userText);
  if (cmdReply) return cmdReply;

  if (lower.includes('merge conflict')) {
    return `To resolve merge conflicts:

\`\`\`
git status
# edit conflicted files and remove conflict markers
git add <resolved-file>
git commit -m "resolve merge conflict"
\`\`\`

If you want, paste conflict text and I will help resolve line-by-line.`;
  }

  return `I can help with:
- push/pull problems
- merge conflicts
- branch and PR workflows
- choosing correct Git commands
- beginner-to-expert Git learning path

Share your exact goal or terminal error, and I will give precise next commands.`;
}

async function getAssistantResponse(userText) {
  // Optional external endpoint support.
  const endpoint = window.GITVORA_AI_ENDPOINT || '';
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: conversationHistory.slice(-8),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.reply && typeof data.reply === 'string') return data.reply;
      }
    } catch {
      // Fall back to reliable local mode.
    }
  }

  return localAssistantReply(userText);
}

async function sendMessage(userText) {
  if (!userText.trim() || sendBtn.disabled) return;

  addMessage('user', userText);
  conversationHistory.push({ role: 'user', content: userText });
  chatInput.value = '';
  chatInput.style.height = 'auto';
  sendBtn.disabled = true;

  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg ai';
  typingEl.innerHTML = `
    <div class="msg-avatar">⬡</div>
    <div class="msg-content">
      <div class="chat-typing">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  chatMessages.appendChild(typingEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    await new Promise((resolve) => setTimeout(resolve, 420));
    const aiText = await getAssistantResponse(userText);
    conversationHistory.push({ role: 'assistant', content: aiText });
    typingEl.remove();
    addMessage('ai', aiText);
  } catch {
    typingEl.remove();
    addMessage('ai', 'I hit an unexpected issue, but I am still here. Please retry your question and I will guide you step-by-step.');
  }

  sendBtn.disabled = false;
  chatInput.focus();
}

sendBtn.addEventListener('click', () => sendMessage(chatInput.value));

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(chatInput.value);
  }
});

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 120)}px`;
});

// Quick prompts from HTML buttons
window.sendQuickPrompt = (text) => {
  chatInput.value = text;
  sendMessage(text);
};
