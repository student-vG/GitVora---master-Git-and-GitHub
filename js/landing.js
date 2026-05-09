// ============================================================
// GitVora — Landing Page JS
// ============================================================

// -- THEME (LIGHT / DARK) --
const THEME_KEY = "gitvora-theme";
const landingThemeBtn = document.getElementById("themeToggleLanding");
const landingThemeBtnMobile = document.getElementById(
  "themeToggleLandingMobile",
);

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const isLight = theme === "light";
  if (landingThemeBtn)
    landingThemeBtn.innerHTML = isLight ? '<i class="ph ph-moon"></i> Dark' : '<i class="ph ph-sun"></i> Light';
  if (landingThemeBtnMobile)
    landingThemeBtnMobile.innerHTML = isLight
      ? '<i class="ph ph-moon"></i> Dark Mode'
      : '<i class="ph ph-sun"></i> Light Mode';
}

const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
applyTheme(savedTheme);

function toggleTheme() {
  const next =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "dark"
      : "light";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

if (landingThemeBtn) landingThemeBtn.addEventListener("click", toggleTheme);
if (landingThemeBtnMobile)
  landingThemeBtnMobile.addEventListener("click", toggleTheme);

// -- HAMBURGER MENU --
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("open");
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () =>
    document.getElementById("mobileMenu").classList.remove("open"),
  );
});

// -- OFFSET ANCHOR SCROLL (FIXED NAVBAR) --
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 78;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

// -- LAUNCH APP SPLASH & INSTALL POPUP --
let deferredPrompt;
let installPopupShown = false;

// Capture the beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Handle launch app button clicks to show install popup
document.querySelectorAll('a[href="app.html"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (deferredPrompt) {
      showInstallPopup();
    } else {
      window.location.href = "app.html";
    }
  });
});

function showInstallPopup() {
  const popup = document.getElementById("installPopup");
  const overlay = document.getElementById("installOverlay");
  const closeBtn = document.getElementById("installClose");
  const skipBtn = document.getElementById("skipInstall");
  const installBtn = document.getElementById("installBtn");

  if (!popup) return;

  popup.style.display = "flex";
  installPopupShown = true;

  // Close popup handlers
  closeBtn.addEventListener("click", closeInstallPopup);
  overlay.addEventListener("click", closeInstallPopup);
  skipBtn.addEventListener("click", closeInstallPopup);

  // Install button handler
  installBtn.addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
        closeInstallPopup();
      });
    } else {
      // If beforeinstallprompt is not available, just go to app
      closeInstallPopup();
      setTimeout(() => (window.location.href = "app.html"), 300);
    }
  });
}

function closeInstallPopup() {
  const popup = document.getElementById("installPopup");
  if (popup) {
    popup.style.display = "none";
    setTimeout(() => (window.location.href = "app.html"), 300);
  }
}

// -- TERMINAL ANIMATION --
const terminalLines = [
  { type: "prompt", text: "$ git add ." },
  { type: "success", text: "✓ Staged 12 files" },
  { type: "prompt", text: '$ git commit -m "feat: add login page"' },
  { type: "success", text: "[main abc1234] feat: add login page" },
  { type: "info", text: " 3 files changed, 89 insertions(+)" },
  { type: "prompt", text: "$ git push -u origin main" },
  { type: "info", text: "Counting objects: 5, done." },
  { type: "info", text: "Writing objects: 100% ████████ 1.23 KiB" },
  { type: "success", text: "✓ Branch main → origin/main" },
  { type: "prompt", text: "$ git push" },
  {
    type: "success",
    text: "✓ Future pushes work without retyping origin/main",
  },
  { type: "success", text: "🎉 Push successful!" },
];

const termEl = document.getElementById("heroTerminal");
let lineIdx = 0;

function typeNextLine() {
  if (lineIdx >= terminalLines.length) {
    // Reset after pause
    setTimeout(() => {
      termEl.innerHTML = "";
      lineIdx = 0;
      typeNextLine();
    }, 3000);
    return;
  }
  const line = terminalLines[lineIdx];
  const span = document.createElement("div");
  const cls =
    line.type === "prompt"
      ? "t-prompt"
      : line.type === "success"
        ? "t-success"
        : "t-info";
  span.className = cls;
  termEl.appendChild(span);

  // Type out the text character by character
  let charIdx = 0;
  const text = line.text;
  const interval = setInterval(
    () => {
      span.textContent += text[charIdx];
      charIdx++;
      if (charIdx >= text.length) {
        clearInterval(interval);
        lineIdx++;
        setTimeout(typeNextLine, line.type === "prompt" ? 300 : 150);
      }
    },
    line.type === "prompt" ? 45 : 20,
  );

  termEl.scrollTop = termEl.scrollHeight;
}

setTimeout(typeNextLine, 1000);

// -- COMMANDS DATA --
const commandsData = {
  basics: [
    {
      cmd: "git init",
      desc: "Initialize a new Git repository",
      detail:
        "Creates a new .git directory in your current folder. This is always the first step when starting a new project.",
      example:
        "$ mkdir my-project\n$ cd my-project\n$ git init\n→ Initialized empty Git repository in .git/",
    },
    {
      cmd: "git add <file>",
      desc: "Stage files for commit",
      detail:
        'Adds file changes to the staging area. Use "git add ." to stage all changes at once.',
      example:
        "$ git add index.html        # stage one file\n$ git add .                 # stage everything\n$ git add src/              # stage a folder",
    },
    {
      cmd: 'git commit -m "message"',
      desc: "Save staged changes with a message",
      detail:
        "Creates a snapshot of your staged changes. Write clear, descriptive messages — your future self will thank you.",
      example:
        '$ git commit -m "feat: add user login form"\n→ [main 4a2bc13] feat: add user login form\n  2 files changed, 54 insertions(+)',
    },
    {
      cmd: "git status",
      desc: "Show working tree status",
      detail:
        "Shows which files are staged, modified, or untracked. Run this whenever you are unsure of what's happening.",
      example:
        "$ git status\nOn branch main\nChanges to be committed:\n  modified:   index.html\nUntracked files:\n  styles.css",
    },
    {
      cmd: "git log",
      desc: "Show commit history",
      detail:
        "Lists all commits in the current branch. Use --oneline for a compact view.",
      example:
        "$ git log --oneline\nabc1234 feat: add login page\ndef5678 fix: button color\n0123456 Initial commit",
    },
  ],
  branch: [
    {
      cmd: "git branch <name>",
      desc: "Create a new branch",
      detail:
        "Creates a new branch without switching to it. Branches let you work on features without affecting main.",
      example:
        "$ git branch feature/login\n$ git branch\n  feature/login\n* main",
    },
    {
      cmd: "git checkout -b <name>",
      desc: "Create and switch to new branch",
      detail:
        "Shortcut to create a branch and immediately switch to it. The most common way to start new work.",
      example:
        "$ git checkout -b feature/user-auth\n→ Switched to a new branch 'feature/user-auth'",
    },
    {
      cmd: "git merge <branch>",
      desc: "Merge a branch into current",
      detail: "Combines changes from another branch into your current branch.",
      example:
        "$ git checkout main\n$ git merge feature/login\n→ Merge made by the 'ort' strategy.",
    },
    {
      cmd: "git branch -d <name>",
      desc: "Delete a branch",
      detail:
        "Deletes a merged branch. Use -D (capital) to force-delete an unmerged branch.",
      example:
        "$ git branch -d feature/login\n→ Deleted branch feature/login (was abc1234).",
    },
  ],
  remote: [
    {
      cmd: "git remote add origin <url>",
      desc: "Connect local repo to GitHub",
      detail:
        'Links your local repository to a remote one (like GitHub). "origin" is just a conventional name.',
      example:
        "$ git remote add origin https://github.com/you/repo.git\n$ git remote -v\norigin  https://github.com/you/repo.git (fetch)",
    },
    {
      cmd: "git push origin main",
      desc: "Push commits to GitHub",
      detail:
        'Uploads your local commits to the remote repository. On first push, use --set-upstream or -u, then future pushes can be plain "git push".',
      example:
        "$ git push -u origin main\n→ Branch 'main' set up to track origin/main.\n$ git push\n✓ Push successful",
    },
    {
      cmd: "git push --force-with-lease",
      desc: "Safely force-push after rebase",
      detail:
        "Use this only when you rewrote your own branch history (for example after rebase). It is safer than --force because it refuses to overwrite teammates' new commits.",
      example:
        "$ git pull --rebase origin main\n$ git push --force-with-lease origin feature/my-branch",
    },
    {
      cmd: "git pull",
      desc: "Download and integrate changes",
      detail:
        "Fetches latest changes from remote and merges them into your local branch. Do this before starting work.",
      example:
        "$ git pull\n→ Already up to date.\n# or\n→ Updating abc..def: Fast-forward",
    },
    {
      cmd: "git clone <url>",
      desc: "Download a repository",
      detail:
        "Creates a local copy of a remote repository, including all history.",
      example:
        "$ git clone https://github.com/user/repo.git\n→ Cloning into 'repo'...\n→ done.",
    },
  ],
  undo: [
    {
      cmd: "git restore <file>",
      desc: "Discard working directory changes",
      detail:
        "Reverts a file to the last committed version. Caution: changes are lost permanently.",
      example: "$ git restore index.html\n# File reverted to last commit state",
    },
    {
      cmd: "git reset HEAD <file>",
      desc: "Unstage a file",
      detail: "Removes a file from the staging area without deleting changes.",
      example:
        "$ git add .           # Oops, staged too much\n$ git reset HEAD styles.css\n→ Unstaged changes from styles.css",
    },
    {
      cmd: "git revert <commit>",
      desc: "Undo a commit safely",
      detail:
        "Creates a new commit that reverses the specified commit. Safe to use on pushed code.",
      example: '$ git revert abc1234\n→ [main def5678] Revert "bad change"',
    },
    {
      cmd: "git stash",
      desc: "Temporarily save uncommitted changes",
      detail:
        "Saves your dirty working directory so you can switch branches and come back later.",
      example:
        "$ git stash\n→ Saved working directory and index state\n$ git stash pop\n→ Changes restored",
    },
  ],
};

// -- RENDER COMMANDS --
const cmdList = document.getElementById("commandsList");
const cmdTabs = document.querySelectorAll(".cmd-tab");

function renderCommands(cat) {
  cmdList.innerHTML = "";
  commandsData[cat].forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "cmd-item";
    el.innerHTML = `
      <div class="cmd-header">
        <span class="cmd-code">${c.cmd}</span>
        <span class="cmd-desc">${c.desc}</span>
        <span class="cmd-arrow">▶</span>
      </div>
      <div class="cmd-body">
        <div class="cmd-note">${c.detail}</div>
        <div class="cmd-example">${c.example}</div>
      </div>
    `;
    el.querySelector(".cmd-header").addEventListener("click", () => {
      el.classList.toggle("open");
    });
    cmdList.appendChild(el);
  });
}

cmdTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    cmdTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderCommands(tab.dataset.cat);
  });
});
renderCommands("basics");

// -- ERRORS DATA --
const errorsData = [
  {
    tag: "PUSH REJECTED",
    title: "error: failed to push some refs to origin",
    cause:
      "The remote has commits your local branch doesn't have. This usually happens when someone else pushed, or when GitHub created a README on init.",
    fix: "$ git pull --rebase origin main\n$ git push origin main",
  },
  {
    tag: "MERGE CONFLICT",
    title: "CONFLICT (content): Merge conflict in <file>",
    cause:
      "Two branches made different changes to the same lines. Git doesn't know which version to keep.",
    fix: "# Open the conflicted file, look for <<<<<<< HEAD\n# Choose which version to keep\n# Remove the conflict markers\n$ git add <file>\n$ git commit",
  },
  {
    tag: "UNRELATED HISTORIES",
    title: "fatal: refusing to merge unrelated histories",
    cause:
      "Your local repo and remote repo have no common commits (different initial commits).",
    fix: "$ git pull origin main --allow-unrelated-histories\n$ git push origin main",
  },
  {
    tag: "AUTH FAILED",
    title: "remote: Support for password authentication was removed",
    cause:
      "GitHub stopped accepting passwords in 2021. You need a Personal Access Token or SSH key.",
    fix: '# Option 1: Use Personal Access Token\n# GitHub Settings → Developer Settings → Tokens → Generate\n# Use token as password when pushing\n\n# Option 2: Set up SSH\n$ ssh-keygen -t ed25519 -C "your@email.com"\n$ # Add ~/.ssh/id_ed25519.pub to GitHub Settings → SSH Keys',
  },
  {
    tag: "NO UPSTREAM",
    title: "fatal: The current branch has no upstream branch",
    cause:
      "Your branch has never been pushed. Git doesn't know where to push it.",
    fix: "$ git push --set-upstream origin <branch-name>\n# Or shorthand:\n$ git push -u origin <branch-name>\n# Future pushes:\n$ git push",
  },
  {
    tag: "DETACHED HEAD",
    title: "HEAD detached at <commit>",
    cause:
      "You checked out a specific commit instead of a branch. Commits made here won't be on any branch.",
    fix: "# To go back to main safely:\n$ git checkout main\n\n# To keep your changes:\n$ git checkout -b my-new-branch",
  },
  {
    tag: "NOTHING TO COMMIT",
    title: "nothing to commit, working tree clean",
    cause:
      "Not really an error! It means all your changes are already committed, or you haven't made any changes since the last commit.",
    fix: "$ git status          # check what's happening\n$ git log --oneline   # see recent commits\n# If you need to push: git push origin main",
  },
  {
    tag: "PERMISSION DENIED",
    title: "Permission denied (publickey)",
    cause:
      "SSH authentication failed. Either your SSH key isn't added to GitHub, or you're not using the right key.",
    fix: "$ ssh -T git@github.com      # test connection\n$ ssh-add ~/.ssh/id_ed25519   # add key to agent\n# Then add ~/.ssh/id_ed25519.pub to GitHub → Settings → SSH Keys",
  },
];

const errorsList = document.getElementById("errorsList");
const errorSearch = document.getElementById("errorSearch");

function renderErrors(filter = "") {
  errorsList.innerHTML = "";
  const filtered = filter
    ? errorsData.filter(
        (e) =>
          e.title.toLowerCase().includes(filter.toLowerCase()) ||
          e.tag.toLowerCase().includes(filter.toLowerCase()),
      )
    : errorsData;

  if (filtered.length === 0) {
    errorsList.innerHTML = `<div style="color:var(--text2);padding:20px;text-align:center;">No matching errors. <a href="app.html" style="color:var(--accent)">Ask the AI →</a></div>`;
    return;
  }

  filtered.forEach((e) => {
    const el = document.createElement("div");
    el.className = "error-item";
    el.innerHTML = `
      <div class="error-header">
        <span class="error-tag">${e.tag}</span>
        <span class="error-title">${e.title}</span>
        <span class="cmd-arrow">▶</span>
      </div>
      <div class="error-body">
        <div class="error-cause">📌 <strong>Cause:</strong> ${e.cause}</div>
        <div class="error-fix-label">Fix:</div>
        <div class="error-fix">${e.fix}</div>
      </div>
    `;
    el.querySelector(".error-header").addEventListener("click", () =>
      el.classList.toggle("open"),
    );
    errorsList.appendChild(el);
  });
}

errorSearch.addEventListener("input", () => renderErrors(errorSearch.value));
renderErrors();

// Navbar scroll effect
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").style.borderBottomColor =
    window.scrollY > 50 ? "rgba(0,255,136,0.1)" : "";
});
