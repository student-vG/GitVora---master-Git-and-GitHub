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

function initLaunchSplash() {
  const splash = document.getElementById('launchSplash');
  if (!splash) return;

  let shouldShow = false;
  try {
    shouldShow = sessionStorage.getItem('gitvora-show-launch-splash') === '1';
    sessionStorage.removeItem('gitvora-show-launch-splash');
  } catch {
    shouldShow = false;
  }

  if (!shouldShow) {
    splash.classList.add('is-hidden');
    return;
  }

  document.body.classList.add('splash-active');
  requestAnimationFrame(() => {
    splash.classList.remove('is-hidden');
  });

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const holdMs = reduceMotion ? 420 : 760;

  setTimeout(() => {
    splash.classList.add('is-hidden');
    document.body.classList.remove('splash-active');
  }, holdMs);
}

initLaunchSplash();

// ---- NAVIGATION ----
const panels = document.querySelectorAll('.panel');
const navItems = document.querySelectorAll('.nav-item');
const topbarTitle = document.getElementById('topbarTitle');

const panelTitles = {
  push: '🚀 Push Guide',
  workflow: '🔄 Workflow Builder',
  academy: '🧠 Skill Path',
  visual: '🛰️ Visual Coach',
  handbook: '📘 Git Handbook',
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
  const panelOrder = ['push', 'workflow', 'academy', 'visual', 'handbook', 'errors', 'reference', 'chat'];
  if (e.key >= '1' && e.key <= '8') {
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
  update: [
    {
      title: 'Check branch and status',
      explanation: 'Make sure you are on the correct branch and see your current local state.',
      cmd: 'git branch --show-current\ngit status',
    },
    {
      title: 'Save local work before pull',
      explanation: 'Before bringing remote updates, commit or stash your local edits to avoid pull errors.',
      cmd: 'git add .\ngit commit -m "wip: save local changes"\n# OR temporary:\n# git stash',
    },
    {
      title: 'Pull latest project updates',
      explanation: 'Sync remote changes first so your local branch is up to date.',
      cmd: 'git pull --rebase origin main',
      note: 'Use your branch name if you are not on main.',
    },
    {
      title: 'If you used stash, restore it',
      explanation: 'Bring your temporary saved work back after pull completes.',
      cmd: 'git stash pop\n# resolve conflicts if shown',
    },
    {
      title: 'Add your new project changes',
      explanation: 'Make edits, test, then stage only what you want to push.',
      cmd: 'git add .',
    },
    {
      title: 'Commit your update',
      explanation: 'Use a clear commit message for this update cycle.',
      cmd: 'git commit -m "feat: update project changes"',
    },
    {
      title: 'Push to GitHub',
      explanation: 'Push after pull/rebase is clean.',
      cmd: 'git push',
      note: 'If you rebased your own branch and push is rejected, use git push --force-with-lease.',
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
    icon: '⬇️',
    title: 'Pull Latest Project Updates',
    desc: 'Safely sync remote changes before coding',
    steps: [
      { cmd: 'git status', desc: 'Check if you have local edits' },
      { cmd: 'git stash', desc: 'Optional: stash if you need a clean pull first' },
      { cmd: 'git pull --rebase origin main', desc: 'Download and replay local commits cleanly' },
      { cmd: 'git stash pop', desc: 'Optional: re-apply stashed work' },
      { cmd: 'git status', desc: 'Confirm clean state before new commits' },
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

const ACADEMY_PROGRESS_KEY = 'gitvora-academy-progress';

function getAcademyCompletion() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACADEMY_PROGRESS_KEY) || '{}');
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveAcademyCompletion(state) {
  localStorage.setItem(ACADEMY_PROGRESS_KEY, JSON.stringify(state));
}

function updateAcademyProgressUI(state) {
  const total = academyTracks.length;
  const completed = academyTracks.filter((track) => state[track.level]).length;
  const percent = Math.round((completed / total) * 100);
  const progressBar = document.getElementById('academyProgressBar');
  const progressText = document.getElementById('academyProgressText');
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (progressText) progressText.textContent = `${completed} / ${total} levels`;
}

function renderAcademy() {
  const academyGrid = document.getElementById('academyGrid');
  const completion = getAcademyCompletion();
  academyGrid.innerHTML = academyTracks
    .map(
      (track) => `
    <div class="academy-card">
      <div class="academy-level">${track.level}</div>
      <h3>${track.title}</h3>
      <p>${track.summary}</p>
      <p><strong>Focus:</strong> ${track.items.map((i) => `<code>${escapeHtml(i)}</code>`).join(', ')}</p>
      <label class="academy-complete">
        <input type="checkbox" data-academy-level="${escapeHtml(track.level)}" ${completion[track.level] ? 'checked' : ''}/>
        Mark level complete
      </label>
    </div>
  `
    )
    .join('');

  academyGrid.querySelectorAll('[data-academy-level]').forEach((input) => {
    input.addEventListener('change', () => {
      const next = getAcademyCompletion();
      next[input.dataset.academyLevel] = input.checked;
      saveAcademyCompletion(next);
      updateAcademyProgressUI(next);
    });
  });

  updateAcademyProgressUI(completion);
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
// Pattern-based detector for common real-world Git outputs
// ============================================================
const allErrors = [
  {
    tag: 'NON-FAST-FORWARD PUSH',
    title: 'Push rejected: your branch is behind remote',
    patterns: [
      /!\s*\[rejected\].*non-fast-forward/i,
      /non-fast-forward/i,
      /failed to push some refs/i,
      /tip of your current branch is behind/i,
      /updates were rejected because.*behind/i,
      /updates were rejected because remote contains work/i,
      /use \'git pull\' before pushing again/i,
      /note about fast-forwards/i,
    ],
    cause: 'Remote branch has commits your local branch does not include yet.',
    fix: '1) git status\n2) git pull --rebase origin <branch>\n3) Resolve conflicts if asked, then git add <file> and git rebase --continue\n4) git push\n5) If you intentionally rebased your own branch: git push --force-with-lease',
    prevent: 'Pull with rebase before starting new work and push in smaller batches.',
  },
  {
    tag: 'LINE ENDING WARNING',
    title: 'LF/CRLF conversion warning',
    patterns: [/lf will be replaced by crlf/i, /crlf will be replaced by lf/i],
    cause: 'Your operating system line endings and repository line endings differ.',
    fix: 'This is usually a warning, not a blocker.\nFor Windows:\n1) git config --global core.autocrlf true\nFor macOS/Linux:\n2) git config --global core.autocrlf input\nOptional: add .gitattributes with explicit line-ending rules.',
    prevent: 'Set core.autocrlf once and keep a shared .gitattributes in the repo.',
    response: 'explain',
  },
  {
    tag: 'NOT A GIT REPOSITORY',
    title: 'fatal: not a git repository',
    patterns: [/not a git repository/i],
    cause: 'Command was run outside a Git repository.',
    fix: '1) cd /path/to/your/project\n2) git status\n3) If project is not initialized yet: git init',
    prevent: 'Run git commands inside your project root where .git exists.',
  },
  {
    tag: 'GIT NOT INSTALLED / PATH ISSUE',
    title: 'git: command not found',
    patterns: [/git: command not found/i, /'git' is not recognized/i],
    cause: 'Git is not installed or not available in system PATH.',
    fix: '1) Install Git from git-scm.com/downloads\n2) Restart terminal\n3) Verify with: git --version',
    prevent: 'After install, verify PATH and restart terminal shell.',
  },
  {
    tag: 'REPOSITORY URL / ACCESS ISSUE',
    title: 'fatal: repository not found / unable to access',
    patterns: [
      /fatal: repository .* not found/i,
      /repository not found/i,
      /fatal: unable to access/i,
      /couldn\'t find remote ref/i,
      /remote: repository not found/i,
    ],
    cause: 'Remote URL is wrong, repo is private/inaccessible, or branch/ref does not exist.',
    fix: '1) git remote -v\n2) If wrong URL: git remote set-url origin <correct-url>\n3) Verify repo exists and you have access\n4) Verify branch/ref name exists on remote',
    prevent: 'Copy remote URL directly from GitHub repo page and verify with git remote -v.',
  },
  {
    tag: 'AUTHENTICATION FAILED',
    title: 'fatal: Authentication failed',
    patterns: [/authentication failed/i, /http basic: access denied/i, /invalid username or password/i],
    cause: 'Credentials are invalid or outdated for remote access.',
    fix: '1) Use GitHub Personal Access Token (PAT) instead of password\n2) Or switch remote to SSH and configure SSH key\n3) Clear old credentials from your credential manager',
    prevent: 'Use PAT/SSH and rotate credentials cleanly when tokens expire.',
  },
  {
    tag: 'PASSWORD AUTH REMOVED',
    title: 'remote: Support for password authentication was removed',
    patterns: [/support for password authentication was removed/i],
    cause: 'GitHub does not allow account password auth for Git operations.',
    fix: '1) Create GitHub PAT (Settings → Developer settings → Tokens)\n2) Use PAT as password when prompted\nOR\n3) Configure SSH key and use git@github.com URL',
    prevent: 'Prefer SSH or PAT from the start.',
  },
  {
    tag: 'SSH PUBLIC KEY ISSUE',
    title: 'Permission denied (publickey)',
    patterns: [/permission denied \(publickey\)/i, /host key verification failed/i],
    cause: 'SSH key is missing, not loaded, or host trust is not set.',
    fix: '1) ssh -T git@github.com\n2) ssh-keygen -t ed25519 -C "you@example.com" (if needed)\n3) ssh-add ~/.ssh/id_ed25519\n4) Add public key to GitHub → SSH and GPG keys',
    prevent: 'Keep one active SSH key loaded in agent and verify with ssh -T.',
  },
  {
    tag: 'REMOTE CONFIGURATION ISSUE',
    title: 'remote origin already exists / no such remote',
    patterns: [/remote origin already exists/i, /no such remote \'origin\'/i],
    cause: 'Remote setup command conflicts with existing or missing remote.',
    fix: 'If remote exists:\n1) git remote -v\n2) git remote set-url origin <new-url>\nIf remote missing:\n1) git remote add origin <url>',
    prevent: 'Check remotes before changing them: git remote -v.',
  },
  {
    tag: 'AUTHOR IDENTITY UNKNOWN',
    title: 'Please tell me who you are',
    patterns: [/unable to auto-detect email address/i, /please tell me who you are/i, /author identity unknown/i],
    cause: 'Git user.name and/or user.email are not configured.',
    fix: '1) git config --global user.name "Your Name"\n2) git config --global user.email "you@example.com"\n3) Retry commit',
    prevent: 'Configure identity once immediately after installing Git.',
  },
  {
    tag: 'WORKING TREE STATUS (NOT STAGED)',
    title: 'Changes not staged / no changes added to commit',
    patterns: [
      /changes not staged for commit/i,
      /no changes added to commit/i,
      /did you forget to use \'git add\'/i,
      /modified:\s+/i,
      /use "git add <file>\.\.\." to update what will be committed/i,
    ],
    cause: 'This is a status report, not a crash. Your files changed, but they are not staged for commit yet.',
    fix: 'Optional next steps:\n1) Review current state: git status\n2) Stage updates: git add . (or specific files)\n3) Commit: git commit -m "your message"\n4) Push if needed: git push',
    prevent: 'Run git status before commit so you know what is staged vs unstaged.',
    response: 'explain',
  },
  {
    tag: 'STATUS: CLEAN OR ALREADY SYNCED',
    title: 'nothing to commit / already up to date',
    patterns: [/nothing to commit, working tree clean/i, /everything up-to-date/i, /already up to date/i, /no local changes to save/i],
    cause: 'Git is informing you there is nothing new to commit, stash, or push right now.',
    fix: 'If you expected changes:\n1) Verify file edits are saved\n2) Run git status\n3) Stage files with git add .\nIf you just pulled/pushed, this message is normal.',
    prevent: 'No action needed unless you expected different output.',
    response: 'explain',
  },
  {
    tag: 'REFSPEC / PATHSPEC ISSUE',
    title: 'pathspec or refspec does not match',
    patterns: [
      /pathspec .* did not match any file/i,
      /src refspec .* does not match any/i,
      /fatal: needed a single revision/i,
      /unknown revision or path not in working tree/i,
    ],
    cause: 'Branch/tag/file reference does not exist locally or name is mistyped.',
    fix: '1) git branch -a\n2) git tag\n3) Verify name and spelling\n4) Create commit before pushing new branch: git add . && git commit -m "init"',
    prevent: 'List existing branches/tags first before checkout/push.',
  },
  {
    tag: 'BRANCH STATE ISSUE',
    title: 'branch exists / not found / invalid branch',
    patterns: [
      /branch named .* already exists/i,
      /branch .* not found/i,
      /invalid branch name/i,
      /branch is already checked out/i,
      /cannot delete branch checked out/i,
    ],
    cause: 'Branch operation conflicts with current branch state.',
    fix: '1) git branch -a\n2) Switch branch if needed: git checkout <branch>\n3) Delete safely from another branch: git branch -d <name>\n4) Use a valid branch name format (letters, numbers, /, -, _).',
    prevent: 'Check current branch before create/delete actions.',
  },
  {
    tag: 'HEAD / REVISION ISSUE',
    title: 'bad revision / ambiguous HEAD / no commits yet',
    patterns: [
      /invalid reference/i,
      /bad revision/i,
      /ambiguous argument head/i,
      /does not have any commits yet/i,
      /bad object/i,
      /bad tree object/i,
      /invalid object name head/i,
      /invalid upstream/i,
    ],
    cause: 'HEAD or revision reference is invalid, often because repository has no commits or wrong commit hash is used.',
    fix: '1) git status\n2) If no commits yet: git add . && git commit -m "Initial commit"\n3) Verify revision with: git log --oneline --all\n4) Retry command with valid hash/branch',
    prevent: 'Create initial commit early and copy hashes from git log output.',
  },
  {
    tag: 'NETWORK / DNS ISSUE',
    title: 'Could not resolve host / timeout / disconnect',
    patterns: [
      /could not resolve host/i,
      /connection timed out/i,
      /fetch-pack: unexpected disconnect/i,
      /rpc failed/i,
      /remote end hung up unexpectedly/i,
      /early eof/i,
    ],
    cause: 'Network instability, VPN/proxy issue, or DNS resolution failure interrupted Git connection.',
    fix: '1) Check internet and VPN/proxy settings\n2) Retry: git fetch --all\n3) If large push: git config --global http.postBuffer 524288000\n4) Try SSH instead of HTTPS (or vice versa)',
    prevent: 'Use stable network and avoid very large single pushes.',
  },
  {
    tag: 'SSL CERTIFICATE ISSUE',
    title: 'SSL certificate problem',
    patterns: [/ssl certificate problem/i],
    cause: 'TLS certificate trust chain failed on this machine/network.',
    fix: '1) Update Git and OS certificate store\n2) Verify corporate proxy certificates if on enterprise network\n3) Do NOT disable SSL verification globally unless temporary emergency on trusted network',
    prevent: 'Keep Git and certificate store updated.',
  },
  {
    tag: 'UNRELATED HISTORIES',
    title: 'fatal: refusing to merge unrelated histories',
    patterns: [/refusing to merge unrelated histories/i],
    cause: 'Local and remote repositories started from different root commits.',
    fix: '1) git pull origin <branch> --allow-unrelated-histories\n2) Resolve conflicts if shown\n3) git push',
    prevent: 'Start local from clone, or keep one single initial history.',
  },
  {
    tag: 'MERGE CONFLICT / UNFINISHED MERGE',
    title: 'Automatic merge failed or merge still in progress',
    patterns: [
      /automatic merge failed/i,
      /conflict \(content\)/i,
      /you have not concluded your merge/i,
      /merge is not possible because you have unmerged files/i,
      /exiting because of unfinished merge/i,
      /entry would be overwritten by merge/i,
      /your local changes would be overwritten by merge/i,
      /cannot do a partial commit during merge/i,
    ],
    cause: 'Git needs manual conflict resolution or merge cleanup before continuing.',
    fix: '1) git status\n2) Open conflicted files and resolve markers\n3) git add <resolved-files>\n4) git commit (or git merge --continue)\n5) If you want to cancel merge: git merge --abort',
    prevent: 'Pull/rebase frequently and keep commits small.',
  },
  {
    tag: 'REBASE STATE ISSUE',
    title: 'Rebase in progress / cannot rebase with unstaged changes',
    patterns: [
      /rebase in progress/i,
      /no rebase in progress/i,
      /interactive rebase already started/i,
      /cannot rebase: you have unstaged changes/i,
      /cannot pull with rebase: unstaged changes/i,
      /could not apply/i,
      /skipped previously applied commit/i,
    ],
    cause: 'Repository is in an active rebase state or local unstaged changes block rebase.',
    fix: '1) git status\n2) If unstaged changes: git add . && git stash (if needed)\n3) Continue: git rebase --continue\n4) Cancel: git rebase --abort\n5) End stale state: git rebase --quit',
    prevent: 'Start rebase with clean working tree.',
  },
  {
    tag: 'TRACKING / UPSTREAM ISSUE',
    title: 'No tracking information or push destination',
    patterns: [
      /no tracking information/i,
      /current branch .* has no upstream branch/i,
      /no configured push destination/i,
      /no upstream branch/i,
    ],
    cause: 'Current branch is not linked to remote tracking branch.',
    fix: '1) git push -u origin <branch-name>\n2) Future pushes can use: git push\n3) Verify tracking: git branch -vv',
    prevent: 'Use -u on first push for every new branch.',
  },
  {
    tag: 'REMOTE POLICY BLOCKED',
    title: 'remote rejected / hook declined / protected branch',
    patterns: [/remote rejected/i, /pre-receive hook declined/i, /protected branch hook declined/i, /refusing to update checked out branch/i],
    cause: 'Server policy rejected push (branch protection, checks, or hook rules).',
    fix: '1) Read rejection reason in output\n2) Push to feature branch and open PR\n3) Satisfy required checks/reviews\n4) Ask repo admin if policy update is needed',
    prevent: 'Use PR workflow for protected branches.',
  },
  {
    tag: 'DETACHED HEAD',
    title: 'You are in detached HEAD state',
    patterns: [/detached head state/i, /head detached at/i, /you are in detached head state/i],
    cause: 'You checked out a commit instead of a branch.',
    fix: '1) To keep work: git checkout -b rescue-branch\n2) To return: git checkout main',
    prevent: 'Checkout named branches for normal work.',
  },
  {
    tag: 'LOCK FILE / GIT PROCESS ISSUE',
    title: 'index.lock / cannot lock ref / another git process running',
    patterns: [
      /unable to create \'.*index\.lock\': file exists/i,
      /cannot lock ref/i,
      /another git process seems to be running/i,
      /unable to write new index file/i,
    ],
    cause: 'Interrupted command left lock files or another Git process is still running.',
    fix: '1) Close running Git tools/terminals\n2) Delete stale lock file: .git/index.lock (only if no git process is active)\n3) Retry original command',
    prevent: 'Avoid force-closing Git operations mid-process.',
  },
  {
    tag: 'FILESYSTEM PERMISSION ISSUE',
    title: 'Permission denied / cannot mkdir .git / unable to unlink',
    patterns: [/permission denied/i, /cannot mkdir \.git/i, /unable to unlink old file/i, /cannot stat file/i],
    cause: 'OS permissions or file locks prevent Git file operations.',
    fix: '1) Close apps using the files\n2) Run terminal with proper permissions\n3) Check file/folder ownership and read/write access\n4) Retry command',
    prevent: 'Work inside writable project directories.',
  },
  {
    tag: 'PATH LENGTH ISSUE',
    title: 'filename too long / path too long',
    patterns: [/filename too long/i, /path too long/i],
    cause: 'Windows path length limit was exceeded.',
    fix: '1) Enable long paths in Windows\n2) Use shorter repo path (e.g., C:\\src\\project)\n3) Avoid deeply nested folders',
    prevent: 'Keep repository path short on Windows.',
  },
  {
    tag: 'UNTRACKED FILE OVERWRITE RISK',
    title: 'Untracked file would be overwritten',
    patterns: [
      /following untracked files would be overwritten/i,
      /untracked working tree file would be overwritten/i,
    ],
    cause: 'Checkout/merge would overwrite local untracked files.',
    fix: '1) Backup or move untracked files\n2) Or stash including untracked: git stash -u\n3) Retry checkout/merge\n4) Restore files if needed',
    prevent: 'Keep working tree clean before switching branches.',
  },
  {
    tag: 'SUBMODULE ISSUE',
    title: 'Embedded repository / submodule mapping failed',
    patterns: [/adding embedded git repository/i, /submodule path failed/i, /no submodule mapping found/i],
    cause: 'Nested repository is treated as submodule incorrectly or submodule config is broken.',
    fix: '1) If intended submodule: git submodule add <url> <path>\n2) If not intended: remove nested .git folder inside subdir\n3) Check .gitmodules consistency',
    prevent: 'Decide clearly between normal folder and submodule usage.',
  },
  {
    tag: 'CLONE DESTINATION ISSUE',
    title: 'destination path exists / clone failed / unable checkout',
    patterns: [
      /destination path .* already exists/i,
      /clone of repository failed/i,
      /unable to checkout working tree/i,
      /fatal: failed to resolve tag/i,
    ],
    cause: 'Target folder conflicts or clone/checkout process failed.',
    fix: '1) Choose a new empty folder\n2) Retry clone\n3) If tag/branch is missing, verify remote refs first',
    prevent: 'Clone into clean empty directories.',
  },
  {
    tag: 'TAG ISSUE',
    title: 'Tag already exists or invalid tag refspec',
    patterns: [/tag already exists/i, /failed to resolve tag/i, /src refspec v\d+.* does not match any/i],
    cause: 'Tag name conflict or tag/reference does not exist locally.',
    fix: '1) List tags: git tag\n2) Create tag if missing: git tag -a v1.0.0 -m "Release"\n3) Push tag: git push origin v1.0.0',
    prevent: 'Verify tag names before creation/push.',
  },
  {
    tag: 'STASH ISSUE',
    title: 'No stash entries / stash apply conflicts',
    patterns: [/no stash entries found/i, /no local changes to save/i, /conflicts when applying stash/i],
    cause: 'No stash exists yet or stash apply created conflicts.',
    fix: '1) Check stashes: git stash list\n2) Apply specific stash: git stash apply stash@{0}\n3) Resolve conflicts, then git add and commit',
    prevent: 'Name stashes clearly with git stash push -m "message".',
  },
  {
    tag: 'CHERRY-PICK / REVERT ISSUE',
    title: 'cherry-pick failed / revert failed / merge commit requires -m',
    patterns: [/cherry-pick failed/i, /revert failed/i, /commit is a merge but no -m option was given/i],
    cause: 'Cherry-pick/revert encountered conflicts or merge-commit parent was not specified.',
    fix: '1) git status\n2) Resolve conflicts and git add files\n3) Continue: git cherry-pick --continue or git revert --continue\n4) For merge commit revert: git revert -m 1 <merge-commit-hash>',
    prevent: 'Inspect commit type with git show before revert/cherry-pick.',
  },
  {
    tag: 'PULL STRATEGY WARNING',
    title: 'Pulling without specifying reconcile strategy',
    patterns: [/pulling without specifying how to reconcile divergent branches/i],
    cause: 'Git wants explicit pull strategy (merge, rebase, ff-only).',
    fix: 'Set preferred default once:\n1) git config --global pull.rebase true   # rebase style\nOR\n2) git config --global pull.ff only       # fast-forward only\nThen run pull again.',
    prevent: 'Set pull strategy globally to avoid repeated warnings.',
  },
  {
    tag: 'EDITOR CONFIG ISSUE',
    title: 'cannot run editor / EDITOR unset',
    patterns: [/cannot run editor/i, /terminal is dumb, but editor unset/i],
    cause: 'Git cannot open editor for commit/rebase messages.',
    fix: '1) Set editor:\n   git config --global core.editor "code --wait"\n   OR git config --global core.editor "notepad"\n2) Retry command',
    prevent: 'Configure core.editor once for your machine.',
  },
  {
    tag: 'SPARSE CHECKOUT ISSUE',
    title: 'sparse checkout leaves no entry',
    patterns: [/sparse checkout leaves no entry/i],
    cause: 'Sparse checkout patterns currently exclude all files.',
    fix: '1) Check sparse patterns: .git/info/sparse-checkout\n2) Add valid include paths\n3) Re-apply: git sparse-checkout reapply',
    prevent: 'Validate sparse paths before applying.',
  },
  {
    tag: 'SAFE DIRECTORY / OWNERSHIP ISSUE',
    title: 'detected dubious ownership / unsafe repository',
    patterns: [/detected dubious ownership in repository/i, /unsafe repository/i],
    cause: 'Repository ownership differs from current OS user.',
    fix: 'If repo is trusted:\n1) git config --global --add safe.directory <full-repo-path>\n2) Retry command',
    prevent: 'Use repos owned by current user where possible.',
  },
  {
    tag: 'REPO CORRUPTION / OBJECT ISSUE',
    title: 'pack/object/config format problem',
    patterns: [
      /pack has bad object/i,
      /object file is empty/i,
      /unknown repository format version/i,
      /bad config file .*\.git\/config/i,
      /warning: templates not found/i,
    ],
    cause: 'Repository metadata or object files may be corrupted or incompatible.',
    fix: '1) Backup local changes immediately\n2) Run: git fsck --full\n3) If severe, clone fresh copy and re-apply local changes\n4) Restore/repair config from backup if needed',
    prevent: 'Avoid abrupt shutdown during Git writes and keep backups.',
  },
];

function detectErrorMatches(input) {
  const text = input || '';
  if (!text.trim()) return [];
  const unique = new Set();
  const matches = [];
  allErrors.forEach((rule) => {
    const isMatch = rule.patterns.some((pattern) => pattern.test(text));
    if (isMatch && !unique.has(rule.tag)) {
      unique.add(rule.tag);
      matches.push(rule);
    }
  });
  return matches;
}

const ISSUE_LINKS = {
  'NON-FAST-FORWARD PUSH': [
    { label: 'GitHub: Non-fast-forward', url: 'https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors' },
  ],
  'LINE ENDING WARNING': [
    {
      label: 'GitHub: Configure line endings',
      url: 'https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings',
    },
  ],
  'AUTHENTICATION FAILED': [
    { label: 'GitHub: PAT authentication', url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token' },
  ],
  'PASSWORD AUTH REMOVED': [
    { label: 'GitHub: Token authentication', url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token' },
  ],
  'SSH PUBLIC KEY ISSUE': [
    { label: 'GitHub: SSH setup', url: 'https://docs.github.com/en/authentication/connecting-to-github-with-ssh' },
  ],
  'MERGE CONFLICT / UNFINISHED MERGE': [{ label: 'GitHub: Resolve conflicts', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts' }],
  'REBASE STATE ISSUE': [{ label: 'Git: rebase docs', url: 'https://git-scm.com/docs/git-rebase' }],
  'TRACKING / UPSTREAM ISSUE': [{ label: 'Git push docs', url: 'https://git-scm.com/docs/git-push' }],
};

function shouldAnalyzeLine(line) {
  return /error|fatal|warning|rejected|failed|conflict|denied|unable|not found|could not|refspec|detached|hook|timed out|ssl|lock|overwritten|unmerged|rebase|stash|cherry-pick|revert|unsafe|dubious|up[\s-]*to[\s-]*date/i.test(
    line || ''
  );
}

function getIssueLinks(tag, seedText) {
  const specific = ISSUE_LINKS[tag] || [];
  const query = encodeURIComponent((seedText || tag || 'git error').slice(0, 180));
  const generic = [
    { label: 'Search GitHub Docs', url: `https://docs.github.com/en/search?query=${query}` },
    { label: 'Search Stack Overflow', url: `https://stackoverflow.com/search?q=${query}` },
    { label: 'Search Git Docs', url: `https://git-scm.com/search/results?search=${query}` },
  ];
  return [...specific, ...generic].slice(0, 4);
}

function analyzeErrorsDetailed(input) {
  const source = input || '';
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const issueMap = new Map();
  const unmatchedLines = [];

  const addIssue = (rule, evidenceLine, weight = 1) => {
    if (!issueMap.has(rule.tag)) {
      issueMap.set(rule.tag, { rule, evidence: new Set(), score: 0 });
    }
    if (evidenceLine) {
      issueMap.get(rule.tag).evidence.add(evidenceLine);
    }
    issueMap.get(rule.tag).score += weight;
  };

  // Combined output matching
  detectErrorMatches(source).forEach((rule) => {
    const combinedHits = rule.patterns.filter((pattern) => pattern.test(source)).length;
    addIssue(rule, '(combined terminal output)', Math.max(combinedHits, 1));
  });

  // Per-line matching so users get individual solutions
  lines.forEach((line) => {
    if (!shouldAnalyzeLine(line)) return;
    const lineMatches = detectErrorMatches(line);
    if (lineMatches.length === 0) {
      unmatchedLines.push(line);
      return;
    }
    lineMatches.forEach((rule) => {
      const lineHits = rule.patterns.filter((pattern) => pattern.test(line)).length;
      addIssue(rule, line, Math.max(lineHits, 1));
    });
  });

  return {
    issues: Array.from(issueMap.values())
      .map((entry) => ({
        rule: entry.rule,
        evidence: Array.from(entry.evidence),
        score: entry.score,
      }))
      .sort((a, b) => b.score - a.score),
    unmatchedLines,
  };
}

function detectErrorFromInput(input) {
  return analyzeErrorsDetailed(input).issues[0]?.rule || null;
}

function getSelectedErrorMode() {
  return document.querySelector('input[name="errorMode"]:checked')?.value || 'auto';
}

function shouldExplainOnly(mode, match) {
  if (mode === 'explain') return true;
  if (mode === 'solve') return false;
  return match?.response === 'explain';
}

function validateErrorInput(text) {
  const warnings = [];
  const lines = (text || '').split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 3) {
    warnings.push('For best accuracy, paste full terminal output including command line + error + hint lines.');
  }
  if (!/git\s+[a-z]/i.test(text)) {
    warnings.push('I could not see an explicit git command line. Include it if possible.');
  }
  if (!shouldAnalyzeLine(text) && !/git status|on branch/i.test(text)) {
    warnings.push('This text looks non-error informational. Use Explain Only mode if you only want interpretation.');
  }
  return warnings;
}

function extractFixCommands(fixText) {
  const lines = (fixText || '').split(/\r?\n/);
  const commands = [];
  const seen = new Set();
  lines.forEach((line) => {
    const match = line.match(/\bgit\s+[a-z0-9-][^\n]*/i);
    if (!match) return;
    const cmd = match[0].trim();
    if (!seen.has(cmd.toLowerCase())) {
      seen.add(cmd.toLowerCase());
      commands.push(cmd);
    }
  });
  return commands.slice(0, 5);
}

function buildFixStepButtons(fixText, issueKey) {
  const commands = extractFixCommands(fixText);
  if (commands.length === 0) return '';
  return `
    <div class="er-step-actions">
      ${commands
        .map(
          (command, idx) =>
            `<button class="er-step-btn" data-fix-cmd="${encodeURIComponent(command)}" data-fix-id="${issueKey}-${idx}">Copy: ${escapeHtml(command)}</button>`
        )
        .join('')}
    </div>
  `;
}

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

document.getElementById('detectBtn').addEventListener('click', () => {
  const inputValue = document.getElementById('errorPasteBox').value.trim();
  const result = document.getElementById('errorResult');
  const mode = getSelectedErrorMode();
  const validationWarnings = validateErrorInput(inputValue);

  if (!inputValue) {
    result.style.display = 'none';
    return;
  }

  const analysis = analyzeErrorsDetailed(inputValue);
  const primary = analysis.issues[0];

  if (primary) {
    const validatorHtml = validationWarnings.length
      ? `<div class="er-validator">${validationWarnings.map((w) => `• ${escapeHtml(w)}`).join('<br>')}</div>`
      : '';
    const issuesHtml = analysis.issues
      .slice(0, 8)
      .map((entry, index) => {
        const match = entry.rule;
        const explainOnly = shouldExplainOnly(mode, match);
        const confidence = Math.min(99, Math.max(45, 55 + entry.score * 7));
        const evidenceLines = entry.evidence
          .filter((line) => line !== '(combined terminal output)')
          .slice(0, 3)
          .map((line) => `• ${escapeHtml(line)}`)
          .join('<br>');
        const links = getIssueLinks(match.tag, entry.evidence[0] || match.title)
          .map((link) => `<a class="er-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`)
          .join('');

        return `
          <div class="er-issue">
            <div class="er-tag">Issue ${index + 1}: ${match.tag}</div>
            <div class="er-title">${escapeHtml(match.title)}</div>
            ${
              evidenceLines
                ? `<div class="er-section">
                     <div class="er-label">Matched lines</div>
                     <div class="er-text">${evidenceLines}</div>
                   </div>`
                : ''
            }
            <div class="er-section">
              <div class="er-label">What this means</div>
              <div class="er-text">${escapeHtml(match.cause)}</div>
            </div>
            <div class="er-section">
              <div class="er-label">${explainOnly ? 'Optional next steps' : 'Calm fix steps'}</div>
              <div class="er-fix">${escapeHtml(match.fix)}</div>
              ${buildFixStepButtons(match.fix, `issue-${index + 1}`)}
            </div>
            <div class="er-confidence">Confidence: ${confidence}%</div>
            ${
              match.prevent
                ? `<div class="er-section">
                    <div class="er-label">How to avoid it next time</div>
                    <div class="er-text">${escapeHtml(match.prevent)}</div>
                  </div>`
                : ''
            }
            <div class="er-links">${links}</div>
          </div>
        `;
      })
      .join('');

    const unmatchedHtml = analysis.unmatchedLines.length
      ? `
          <div class="er-issue">
            <div class="er-tag">Unmatched lines</div>
            <div class="er-text">
              ${analysis.unmatchedLines.slice(0, 5).map((line) => `• ${escapeHtml(line)}`).join('<br>')}
            </div>
            <div class="er-text" style="margin-top:8px">I could not map these lines confidently, so here are direct external search links:</div>
            <div class="er-links">
              ${getIssueLinks('GENERIC', analysis.unmatchedLines[0]).map((link) => `<a class="er-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`).join('')}
            </div>
          </div>
        `
      : '';

    result.style.display = 'block';
    result.innerHTML = `
      <div class="er-tag">🎯 DETECTED ${analysis.issues.length} issue${analysis.issues.length > 1 ? 's' : ''}</div>
      <div class="er-title">${escapeHtml(primary.rule.title)}</div>
      ${validatorHtml}
      ${issuesHtml}
      ${unmatchedHtml}
    `;

    result.querySelectorAll('[data-fix-cmd]').forEach((button) => {
      button.addEventListener('click', function () {
        const decoded = decodeURIComponent(this.dataset.fixCmd);
        copyText(decoded, this);
      });
    });
  } else {
    const fallbackLinks = getIssueLinks('GENERIC', inputValue);
    const validatorHtml = validationWarnings.length
      ? `<div class="er-validator">${validationWarnings.map((w) => `• ${escapeHtml(w)}`).join('<br>')}</div>`
      : '';
    result.style.display = 'block';
    result.innerHTML = `
      <div class="er-tag">🤔 NOT RECOGNIZED YET</div>
      <div class="er-title">I could not confidently classify this output.</div>
      ${validatorHtml}
      <div class="er-section">
        <div class="er-text">No stress — below are reliable external links for this exact output, or send it to AI Assistant for a guided fix path.</div>
      </div>
      <div class="er-links">
        ${fallbackLinks.map((link) => `<a class="er-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`).join('')}
      </div>
      <div style="margin-top:14px">
        <button class="btn-detect" id="askAiFromError">Ask AI Assistant →</button>
      </div>
    `;
    result.querySelector('#askAiFromError').addEventListener('click', () => {
      showPanel('chat');
      chatInput.value = `I got this Git output:\n${inputValue}\nPlease ${mode === 'explain' ? 'explain what it means' : 'explain calmly and give step-by-step fix commands'}.`;
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
// HANDBOOK (Book-style 155+ pages)
// ============================================================
const handbookCorePages = [
  {
    section: 'Foundation',
    title: 'What is Git?',
    body: `Git is a distributed version control system.

Why it matters:
- It records snapshots of your project over time.
- It helps you safely experiment with branches.
- It makes teamwork possible without overwriting each other.

Memory tip:
- Think of Git as a "time machine + teamwork safety net".`,
  },
  {
    section: 'Foundation',
    title: 'What is GitHub?',
    body: `GitHub is a cloud platform for hosting Git repositories.

What GitHub adds:
- Pull Requests (code review workflow)
- Issues, Projects, Discussions
- Actions (CI/CD automation)
- Team collaboration and permissions

Memory tip:
- Git = engine. GitHub = collaboration platform built around that engine.`,
  },
  {
    section: 'History',
    title: 'Who Built Git and When?',
    body: `Git was created by Linus Torvalds in 2005.

Context:
- Linux kernel needed a fast and reliable version control system.
- Git was designed for performance, data integrity, and distributed work.

Why developers still use it:
- Extremely fast branching/merging
- Strong integrity model
- Works both solo and at enterprise team scale.`,
  },
  {
    section: 'Foundation',
    title: 'Git vs GitHub in One Minute',
    body: `Git:
- Local + distributed version control.
- Commands like \`git add\`, \`git commit\`, \`git branch\`.

GitHub:
- Remote hosting + collaboration layer.
- Pull requests, code review, releases, issue tracking.

Use both together:
1) Work locally with Git
2) Share and review on GitHub`,
  },
  {
    section: 'Model',
    title: 'The Three Areas You Must Remember',
    body: `Every day Git flow depends on 3 areas:
- Working Directory: where you edit files
- Staging Area (Index): what will go into next commit
- Repository (History): saved commits

Memory formula:
Edit -> Stage -> Commit -> Push`,
  },
  {
    section: 'Model',
    title: 'How to Remember Commands Faster',
    body: `Command memory strategy:
1) Learn by intent, not by alphabetical order.
2) Group commands by workflow: create, inspect, branch, share, recover.
3) Practice tiny daily loops.

Examples:
- Inspect: \`git status\`, \`git log\`, \`git diff\`
- Build commit: \`git add\`, \`git commit\`
- Share: \`git pull --rebase\`, \`git push\``,
  },
  {
    section: 'Workflow',
    title: 'Beginner Safe Daily Workflow',
    body: `Safe daily loop:
1) \`git status\`
2) \`git pull --rebase origin main\`
3) Edit files
4) \`git add .\`
5) \`git commit -m "type: message"\`
6) \`git push\`

If conflict appears:
- Resolve files
- \`git add <file>\`
- \`git rebase --continue\``,
  },
  {
    section: 'Workflow',
    title: 'Professional Branch Workflow',
    body: `Feature branch method:
1) \`git checkout -b feature/something\`
2) Commit in small chunks
3) \`git push -u origin feature/something\`
4) Open PR in GitHub
5) Review, update, merge
6) Delete merged branch

Why this is important:
- Cleaner history
- Safer collaboration
- Better review quality`,
  },
  {
    section: 'Safety',
    title: 'When to Use --force-with-lease',
    body: `Use \`git push --force-with-lease\` only if:
- You rebased/squashed your own branch history
- You understand the branch is safe to rewrite

Avoid raw \`--force\` on shared branches.

Memory tip:
- "Lease checks before force" -> safer for teams.`,
  },
  {
    section: 'GitHub',
    title: 'GitHub Pull Request Procedure',
    body: `Pull request checklist:
1) Clear title and summary
2) Why this change is needed
3) Testing notes
4) Screenshots (if UI change)
5) Mention risk areas

Strong PRs reduce back-and-forth and speed up merging.`,
  },
  {
    section: 'Troubleshooting',
    title: 'How to Read Git Errors Calmly',
    body: `Read Git output in this order:
1) fatal/error line
2) hint lines
3) branch context from \`git status\`

Then decide:
- Explain-only status message?
- Actual blocker needing fix?

Never panic-run random commands from internet snippets.`,
  },
  {
    section: 'Recall',
    title: '30-Second Recall Framework',
    body: `When stuck, ask:
- Where am I? (\`git status\`)
- What changed? (\`git diff\`)
- What branch? (\`git branch -vv\`)
- What remote relation? (\`git remote -v\`)

This gives enough context for 80% of Git issues.`,
  },
];

function buildHandbookPages() {
  const pages = [...handbookCorePages];

  // Command meaning pages (from reference)
  refData.forEach((category) => {
    category.items.forEach((item) => {
      pages.push({
        section: 'Commands',
        title: `Meaning of ${item.cmd}`,
        body: `Command: \`${item.cmd}\`

What it means:
- ${item.detail}

Where to use it:
- ${item.desc}

Example:
${item.example}

How to remember:
- Use this command when your intent is "${item.desc.toLowerCase()}".`,
      });

      pages.push({
        section: 'Memory',
        title: `Remembering ${item.cmd}`,
        body: `Quick memory card:
- Intent: ${item.desc}
- Trigger: When you need ${item.desc.toLowerCase()}
- Pair command: Start with \`git status\` before running it

Practice drill:
1) Open a demo repo
2) Run \`${item.cmd.replace(/<[^>]+>/g, 'value')}\`
3) Explain in one sentence what changed`,
      });
    });
  });

  // Workflow pages
  workflows.forEach((wf) => {
    pages.push({
      section: 'Workflow',
      title: `${wf.title} — Step Notes`,
      body: `Workflow goal: ${wf.desc}

Commands in order:
${wf.steps.map((step, i) => `${i + 1}. ${step.cmd} — ${step.desc || 'run as needed'}`).join('\n')}

Where this is used:
- Team projects, practical daily Git operations, and controlled releases.`,
    });
  });

  // Error explanation pages
  allErrors.forEach((issue) => {
    pages.push({
      section: 'Troubleshooting',
      title: `${issue.tag} — Why and How`,
      body: `Detected issue family:
- ${issue.title}

Why this happens:
- ${issue.cause}

Calm handling:
${issue.fix}

Prevention:
- ${issue.prevent || 'Use git status and smaller commit/push batches.'}`,
    });
  });

  // Fill to 155+ with focused drill pages
  const drillTopics = [
    'Inspect state before action',
    'Staging discipline',
    'Commit message quality',
    'Branch naming standards',
    'Safe rebase habits',
    'Conflict resolution confidence',
    'Remote tracking hygiene',
    'Release tagging discipline',
    'Recovery with reflog',
    'PR review communication',
  ];

  let drillIndex = 1;
  while (pages.length < 155) {
    const topic = drillTopics[(drillIndex - 1) % drillTopics.length];
    pages.push({
      section: 'Practice',
      title: `Practice Page ${drillIndex}: ${topic}`,
      body: `Micro lesson:
- Topic: ${topic}
- Duration: 10-15 minutes

Exercise:
1) Create a small test repository
2) Reproduce one realistic scenario
3) Explain each command before pressing Enter
4) Document what changed after each command

Reflection prompts:
- What did Git track?
- What would break if skipped?
- Which command is easiest to forget and why?`,
    });
    drillIndex += 1;
  }

  return pages.map((page, index) => ({
    ...page,
    page: index + 1,
    id: `handbook-${index + 1}`,
  }));
}

const handbookPages = buildHandbookPages();
let currentHandbookIndex = 0;
let handbookFilteredIndexes = handbookPages.map((_, index) => index);

function scoreHandbookPage(page, query) {
  const q = query.toLowerCase();
  if (!q.trim()) return 0;
  const title = page.title.toLowerCase();
  const body = page.body.toLowerCase();
  const section = page.section.toLowerCase();
  let score = 0;
  if (title.includes(q)) score += 6;
  if (section.includes(q)) score += 3;
  if (body.includes(q)) score += 2;
  q.split(/\s+/).forEach((token) => {
    if (!token) return;
    if (title.includes(token)) score += 2;
    if (body.includes(token)) score += 1;
  });
  return score;
}

function searchHandbookPages(query, limit = 5) {
  const ranked = handbookPages
    .map((page, index) => ({ page, index, score: scoreHandbookPage(page, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}

function formatBookBody(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function renderHandbookToc() {
  const toc = document.getElementById('handbookToc');
  if (!toc) return;
  toc.innerHTML = handbookFilteredIndexes
    .slice(0, 200)
    .map((realIndex) => {
      const page = handbookPages[realIndex];
      const active = realIndex === currentHandbookIndex ? 'active' : '';
      return `<button class="handbook-toc-item ${active}" data-handbook-index="${realIndex}">
        <strong>Pg ${page.page}:</strong> ${escapeHtml(page.title)}
      </button>`;
    })
    .join('');

  toc.querySelectorAll('[data-handbook-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentHandbookIndex = parseInt(btn.dataset.handbookIndex, 10);
      renderHandbookPage();
      renderHandbookToc();
    });
  });
}

function getFilteredPositionInfo() {
  const position = handbookFilteredIndexes.indexOf(currentHandbookIndex);
  return {
    position: position >= 0 ? position : 0,
    total: handbookFilteredIndexes.length || handbookPages.length,
  };
}

function renderHandbookPage() {
  const pageEl = document.getElementById('handbookPage');
  const pageInfo = document.getElementById('handbookPageInfo');
  if (!pageEl || !pageInfo) return;

  const page = handbookPages[currentHandbookIndex];
  if (!page) return;

  pageEl.innerHTML = `
    <h2 class="book-title">${escapeHtml(page.title)}</h2>
    <div class="book-meta">
      <span class="book-chip">Page ${page.page}</span>
      <span class="book-chip">${escapeHtml(page.section)}</span>
      <span class="book-chip">GitVora Book Style</span>
    </div>
    <div class="book-body">${formatBookBody(page.body)}</div>
  `;

  const { position, total } = getFilteredPositionInfo();
  pageInfo.textContent = `Page ${position + 1} / ${total} (Full book: ${handbookPages.length} pages)`;
}

function moveHandbookPage(delta) {
  const { position, total } = getFilteredPositionInfo();
  if (total === 0) return;
  const nextPos = Math.max(0, Math.min(total - 1, position + delta));
  currentHandbookIndex = handbookFilteredIndexes[nextPos];
  renderHandbookPage();
  renderHandbookToc();
}

function applyHandbookFilter(query) {
  if (!query.trim()) {
    handbookFilteredIndexes = handbookPages.map((_, idx) => idx);
  } else {
    handbookFilteredIndexes = searchHandbookPages(query, handbookPages.length).map((entry) => entry.index);
  }

  if (handbookFilteredIndexes.length === 0) {
    handbookFilteredIndexes = handbookPages.map((_, idx) => idx);
  }

  if (!handbookFilteredIndexes.includes(currentHandbookIndex)) {
    currentHandbookIndex = handbookFilteredIndexes[0];
  }

  renderHandbookPage();
  renderHandbookToc();
}

function initHandbook() {
  if (!document.getElementById('panel-handbook')) return;

  const searchInput = document.getElementById('handbookSearch');
  const prevBtn = document.getElementById('handbookPrev');
  const nextBtn = document.getElementById('handbookNext');

  prevBtn?.addEventListener('click', () => moveHandbookPage(-1));
  nextBtn?.addEventListener('click', () => moveHandbookPage(1));

  searchInput?.addEventListener('input', () => {
    applyHandbookFilter(searchInput.value);
  });

  renderHandbookPage();
  renderHandbookToc();
}

function getBestHandbookMatch(query) {
  const top = searchHandbookPages(query, 1)[0];
  return top ? handbookPages[top.index] : null;
}

initHandbook();

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
  const analysis = analyzeErrorsDetailed(userText);
  const primary = analysis.issues[0];
  if (!primary) {
    if (!shouldAnalyzeLine(userText)) return null;
    const links = getIssueLinks('GENERIC', userText);
    return `I could not confidently map this output yet.

You can check these reliable resources:
- ${links.map((l) => `${l.label}: ${l.url}`).join('\n- ')}

If you paste the full terminal output including command + hints, I can guide you step-by-step.`;
  }

  const match = primary.rule;
  const explainOnly = match.response === 'explain';
  const alsoDetected = analysis.issues.slice(1, 4).map((issue) => issue.rule.tag);
  return `I recognized this as **${match.tag}**.

**Why this happens**
- ${match.cause}

**${explainOnly ? 'Optional next steps' : 'Fix steps'}**
\`\`\`
${match.fix}
\`\`\`

${
  alsoDetected.length
    ? `**Also detected in your output**\n- ${alsoDetected.join('\n- ')}\n`
    : ''
}

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

function getPullGuideReply() {
  return `Use this safe pull guide:

\`\`\`
git status
# if you have unfinished edits:
# git stash
git pull --rebase origin main
# if you stashed:
# git stash pop
\`\`\`

If conflict appears:
- fix files
- \`git add <file>\`
- \`git rebase --continue\``;
}

function getDailyUpdateReply() {
  return `After your first push, use this **project update flow** every time:

\`\`\`
git status
git pull --rebase origin main
# make code changes
git add .
git commit -m "feat: your update"
git push
\`\`\`

If you rebased your own branch and push is rejected:
\`\`\`
git push --force-with-lease
\`\`\``;
}

function getHandbookReply(userText) {
  const lower = userText.toLowerCase();
  const handbookIntent =
    /\b(what is|who built|when|why|meaning|notes|book|handbook|history|remember|all commands|github procedure|explain)\b/i.test(lower) ||
    lower.includes('git command meaning') ||
    lower.includes('how to remember');

  if (!handbookIntent) return null;

  const bestPage = getBestHandbookMatch(userText);
  if (!bestPage) return null;
  const related = searchHandbookPages(userText, 3).map((entry) => handbookPages[entry.index]);

  return `From **GitVora Handbook**:

**Page ${bestPage.page}: ${bestPage.title}**
- Section: ${bestPage.section}
- Core note: ${bestPage.body.split('\n').slice(0, 6).join(' ').slice(0, 320)}...

Open full notes in **Git Handbook panel** (shortcut: key 5).  
This panel has ${handbookPages.length}+ pages in book-paper style for beginner to expert learning.

Related pages:
- ${related.map((page) => `Page ${page.page}: ${page.title}`).join('\n- ')}`;
}

function localAssistantReply(userText) {
  const lower = userText.toLowerCase();
  const mentionsPullRequest = lower.includes('pull request') || lower.includes('create pr');
  const asksPullGuide =
    !mentionsPullRequest &&
    (/\bpull\b/.test(lower) ||
      lower.includes('latest changes') ||
      lower.includes('sync from github') ||
      lower.includes('update from github'));
  const asksPushGuide = /\bpush\b/.test(lower);
  const asksDailyUpdate =
    lower.includes('project update') ||
    lower.includes('after first push') ||
    lower.includes('after once starting push') ||
    lower.includes('pull and push');

  if (/\b(hi|hello|hey)\b/.test(lower)) {
    return 'Hi! I am GitVora AI. Ask me any Git/GitHub question and I will give you step-by-step commands.';
  }

  if ((lower.includes('first push') || lower.includes('push my code first time')) && !asksDailyUpdate) {
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

  if (asksDailyUpdate || (asksPullGuide && asksPushGuide)) {
    return getDailyUpdateReply();
  }

  if (asksPullGuide) {
    return getPullGuideReply();
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

  const handbookReply = getHandbookReply(userText);
  if (handbookReply) return handbookReply;

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
