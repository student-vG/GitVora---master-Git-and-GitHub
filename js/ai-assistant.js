// ============================================================
// AI ASSISTANT — Advanced Local Expert System v2.0
// ============================================================

(function initAIAssistant() {
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!chatMessages || !chatInput || !sendBtn) return;

  // Make sendQuickPrompt global so HTML buttons can use it
  window.sendQuickPrompt = function (text) {
    chatInput.value = text;
    chatInput.style.height = "auto";
    chatInput.style.height = chatInput.scrollHeight + "px";
    handleSend();
  };

  // Clear chat
  window.clearChat = function () {
    chatMessages.innerHTML = "";
    renderWelcome();
  };

  // Auto-resize textarea
  chatInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Handle Enter (send) and Shift+Enter (new line)
  chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener("click", handleSend);

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage("user", text);
    chatInput.value = "";
    chatInput.style.height = "auto";

    sendBtn.disabled = true;
    const typingId = showTypingIndicator();

    const delay = 700 + Math.random() * 900;
    setTimeout(() => {
      removeTypingIndicator(typingId);
      const response = processAIResponse(text);
      appendMessage("ai", response);
      sendBtn.disabled = false;
    }, delay);
  }

  function appendMessage(sender, content) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender}`;

    if (sender === "ai") {
      const msgId = "msg-" + Date.now();
      msgDiv.innerHTML = `
        <div class="msg-avatar-wrap">
          <div class="msg-avatar-ai">
            <i class="ph ph-robot"></i>
          </div>
        </div>
        <div class="msg-body">
          <div class="msg-meta">
            <span class="msg-name">GitVora AI</span>
            <span class="msg-time">${getCurrentTime()}</span>
          </div>
          <div class="msg-bubble ai-bubble" id="${msgId}">${content}</div>
          <div class="msg-actions">
            <button class="msg-action-btn" onclick="copyMsgContent('${msgId}')" title="Copy response">
              <i class="ph ph-copy"></i> Copy
            </button>
            <button class="msg-action-btn feedback-btn" onclick="giveFeedback(this, true)" title="Helpful">
              <i class="ph ph-thumbs-up"></i>
            </button>
            <button class="msg-action-btn feedback-btn" onclick="giveFeedback(this, false)" title="Not helpful">
              <i class="ph ph-thumbs-down"></i>
            </button>
          </div>
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="msg-body user-body">
          <div class="msg-bubble user-bubble">${escapeHtml(content)}</div>
          <div class="msg-time user-time">${getCurrentTime()}</div>
        </div>
        <div class="msg-avatar-user">
          <i class="ph ph-user"></i>
        </div>
      `;
    }

    chatMessages.appendChild(msgDiv);
    requestAnimationFrame(() => {
      chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
    });
  }

  window.copyMsgContent = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text).catch(() => {});
    const btn = el.closest(".msg-body").querySelector(".msg-action-btn");
    if (btn) {
      btn.innerHTML = '<i class="ph ph-check"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = '<i class="ph ph-copy"></i> Copy';
      }, 2000);
    }
  };

  window.giveFeedback = function (btn, positive) {
    const row = btn.closest(".msg-actions");
    if (!row) return;
    row.querySelectorAll(".feedback-btn").forEach((b) => {
      b.classList.remove("feedback-active");
      b.disabled = true;
    });
    btn.classList.add("feedback-active");
    btn.innerHTML = positive
      ? '<i class="ph ph-thumbs-up-fill"></i>'
      : '<i class="ph ph-thumbs-down-fill"></i>';
  };

  function showTypingIndicator() {
    const id = "typing-" + Date.now();
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-msg ai";
    msgDiv.id = id;
    msgDiv.innerHTML = `
      <div class="msg-avatar-wrap">
        <div class="msg-avatar-ai">
          <i class="ph ph-robot"></i>
        </div>
      </div>
      <div class="msg-body">
        <div class="msg-meta">
          <span class="msg-name">GitVora AI</span>
          <span class="msg-time">thinking...</span>
        </div>
        <div class="msg-bubble ai-bubble typing-bubble">
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br>");
  }

  // Format code blocks in responses
  function fmt(text) {
    // Replace ```code``` with styled blocks
    text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
      return `<pre class="ai-code-block"><code>${code.trim()}</code></pre>`;
    });
    // Replace `inline` with styled inline code
    text = text.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');
    return text;
  }

  // =============================================
  // WELCOME MESSAGE
  // =============================================
  function renderWelcome() {
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-msg ai";
    msgDiv.innerHTML = `
      <div class="msg-avatar-wrap">
        <div class="msg-avatar-ai">
          <i class="ph ph-robot"></i>
        </div>
      </div>
      <div class="msg-body">
        <div class="msg-meta">
          <span class="msg-name">GitVora AI</span>
          <span class="msg-status-dot"></span>
          <span class="msg-status-text">Always-On Expert</span>
        </div>
        <div class="msg-bubble ai-bubble welcome-bubble">
          <div class="welcome-header">
            <span class="welcome-wave">👋</span>
            Hi! I'm your personal Git & GitHub expert.
          </div>
          <div class="welcome-caps">I can help you with:</div>
          <div class="welcome-tags">
            <span class="wtag"><i class="ph ph-rocket"></i> Push & Pull flows</span>
            <span class="wtag"><i class="ph ph-wrench"></i> Error fixes</span>
            <span class="wtag"><i class="ph ph-git-branch"></i> Branching</span>
            <span class="wtag"><i class="ph ph-arrows-clockwise"></i> Rebase & Merge</span>
            <span class="wtag"><i class="ph ph-stack"></i> Stash & Cherry-pick</span>
            <span class="wtag"><i class="ph ph-tag"></i> Tags & Releases</span>
          </div>
          <div class="welcome-cta">What can I help you with today?</div>
        </div>
      </div>
    `;
    chatMessages.appendChild(msgDiv);
  }

  renderWelcome();

  // =============================================
  // KNOWLEDGE BASE
  // =============================================
  function processAIResponse(input) {
    const q = input.toLowerCase();

    // ── Push: First time
    if (
      (q.includes("push") && q.includes("first")) ||
      q.includes("first time") ||
      q.includes("new repo") ||
      q.includes("start project")
    ) {
      return fmt(`**🚀 First Push to GitHub**

Here are the exact commands to push a new project for the first time:

\`\`\`
# 1. Initialize Git in your project folder
git init

# 2. Stage all your files
git add .

# 3. Make your first commit
git commit -m "Initial commit"

# 4. Connect to GitHub (replace with your URL)
git remote add origin https://github.com/your-username/your-repo.git

# 5. Rename branch to main (modern standard)
git branch -M main

# 6. Push and link the branch
git push -u origin main
\`\`\`

✅ After this, future pushes are just \`git push\`.`);
    }

    // ── Daily update flow
    if (
      (q.includes("daily") || q.includes("update flow")) ||
      (q.includes("pull") && q.includes("push") && !q.includes("error") && !q.includes("fail"))
    ) {
      return fmt(`**🔄 Daily Developer Workflow**

The golden rule: **always pull before you push.**

\`\`\`
# 1. Stage your changes
git add .

# 2. Commit with a clear message
git commit -m "feat: add new feature"

# 3. Pull latest from remote (rebase keeps history clean)
git pull --rebase origin main

# 4. Push your commits
git push
\`\`\`

💡 Using \`--rebase\` avoids messy merge commits and keeps your history linear.`);
    }

    // ── Pull rebase explained
    if (q.includes("pull --rebase") || (q.includes("rebase") && !q.includes("conflict"))) {
      return fmt(`**♻️ What is \`git pull --rebase\`?**

Instead of creating a merge commit, rebase **replays your commits on top** of the remote commits.

\`\`\`
# Normal pull creates a merge commit (messy)
git pull

# Rebase pull keeps history linear (clean ✅)
git pull --rebase origin main
\`\`\`

**What happens step by step:**
1. Your local commits are temporarily removed
2. Remote changes are applied
3. Your commits are replayed on top

**Make it the default forever:**
\`\`\`
git config --global pull.rebase true
\`\`\`

This is how professional teams work!`);
    }

    // ── Undo commit
    if (q.includes("undo") && q.includes("commit")) {
      return fmt(`**↩️ How to Undo a Commit**

Choose the option that matches your situation:

\`\`\`
# Option A: Keep your code changes, just undo the commit record
git reset --soft HEAD~1

# Option B: Keep code changes, but un-stage everything
git reset --mixed HEAD~1

# Option C: ⚠️ DANGER — Delete the commit AND discard all code changes
git reset --hard HEAD~1
\`\`\`

**Tip:** If you already pushed and need to undo safely:
\`\`\`
git revert HEAD
git push
\`\`\`

\`git revert\` creates a new commit that reverses the change — it's safe on shared branches.`);
    }

    // ── Merge conflict
    if (q.includes("conflict") || q.includes("merge conflict")) {
      return fmt(`**⚔️ Resolving Merge Conflicts**

Don't panic! A conflict means two branches changed the same lines.

**Step 1: Find conflicted files**
\`\`\`
git status
# Conflicted files show as "both modified"
\`\`\`

**Step 2: Open the file and look for markers**
\`\`\`
<<<<<<< HEAD (your version)
your code here
=======
incoming code here
>>>>>>> branch-name (their version)
\`\`\`

**Step 3: Edit the file** — keep what you want, delete all markers.

**Step 4: Finish the merge**
\`\`\`
git add .
git commit -m "fix: resolve merge conflicts"
# OR if you were rebasing:
git rebase --continue
\`\`\``);
    }

    // ── Push rejected / failed to push refs
    if (
      q.includes("failed to push") ||
      q.includes("push rejected") ||
      q.includes("updates were rejected") ||
      q.includes("rejected because")
    ) {
      return fmt(`**🚨 Push Rejected — Here's the Fix**

**Why it happened:** The remote has commits your local branch doesn't have. GitHub is protecting you from overwriting them.

**The fix:**
\`\`\`
# Pull the remote changes first (with rebase for clean history)
git pull --rebase origin main

# Then push (now it will work)
git push
\`\`\`

**If conflicts appear during rebase:**
\`\`\`
# Resolve conflicts in files, then:
git add .
git rebase --continue
git push
\`\`\`

⚠️ Never use \`git push --force\` on a shared branch. Use \`--force-with-lease\` if you must force push on your own feature branch only.`);
    }

    // ── .gitignore
    if (q.includes("gitignore")) {
      return fmt(`**📄 What is .gitignore?**

It's a file that tells Git which files/folders to **completely ignore** — they will never be staged, committed, or pushed.

**Create it in your project root:**
\`\`\`
# .gitignore
node_modules/        # downloaded dependencies
.env                 # ⚠️ SECRET keys — NEVER commit this!
.DS_Store            # Mac system files
dist/ build/         # compiled output
*.log                # log files
.vscode/             # editor settings (optional)
\`\`\`

**If you already committed something and want to untrack it:**
\`\`\`
git rm --cached <file>
git commit -m "chore: remove tracked .env"
\`\`\`

💡 GitVora's Visual Coach has a **.gitignore Generator** — check it out!`);
    }

    // ── Stash
    if (q.includes("stash")) {
      return fmt(`**🗄️ Git Stash — Your Code Shelf**

Stash saves your unfinished work so you can switch branches without committing messy code.

\`\`\`
# Save current work (with a label)
git stash push -m "work in progress: login feature"

# List all stashes
git stash list

# Restore latest stash and remove it
git stash pop

# Restore latest stash but keep it in the list
git stash apply

# Delete a specific stash
git stash drop stash@{0}
\`\`\`

**Real-world use case:**
\`\`\`
# You're in the middle of feature work...
git stash

# Switch to fix an urgent bug
git checkout main
# ... fix bug, commit, push ...

# Come back and restore your work
git checkout feature/my-feature
git stash pop
\`\`\``);
    }

    // ── Cherry-pick
    if (q.includes("cherry-pick") || q.includes("cherry pick")) {
      return fmt(`**🍒 Git Cherry-Pick**

Cherry-pick lets you **copy a specific commit** from one branch and apply it to another.

\`\`\`
# 1. Find the commit hash you want
git log --oneline

# 2. Cherry-pick it onto your current branch
git cherry-pick abc1234

# 3. Cherry-pick a range of commits
git cherry-pick abc1234^..def5678

# If conflict occurs:
git add .
git cherry-pick --continue
\`\`\`

**When to use it:**
- You fixed a bug on \`feature\` branch and want it on \`main\` too
- You need just one specific change, not the whole branch
- Hotfix that needs to go to multiple release branches`);
    }

    // ── Branches
    if (q.includes("branch") && !q.includes("merge conflict")) {
      return fmt(`**🌿 Git Branching Guide**

\`\`\`
# Create a new branch
git branch feature/my-feature

# Create AND switch to it (most common)
git checkout -b feature/my-feature
# Modern way (Git 2.23+):
git switch -c feature/my-feature

# List all branches
git branch         # local branches
git branch -a      # all including remote

# Switch to an existing branch
git checkout main
git switch main    # modern way

# Delete a merged branch
git branch -d feature/my-feature

# Delete unmerged branch (force)
git branch -D feature/my-feature

# Push a branch to GitHub
git push -u origin feature/my-feature
\`\`\`

💡 **Naming conventions:** \`feature/\`, \`fix/\`, \`hotfix/\`, \`chore/\`, \`release/\``);
    }

    // ── Tags
    if (q.includes("tag") || q.includes("release")) {
      return fmt(`**🏷️ Git Tags & Releases**

Tags mark specific points in history — usually for releases.

\`\`\`
# Create a lightweight tag
git tag v1.0.0

# Create an annotated tag (recommended for releases)
git tag -a v1.0.0 -m "Release version 1.0.0"

# List all tags
git tag

# Push a tag to GitHub
git push origin v1.0.0

# Push ALL tags at once
git push origin --tags

# Delete a local tag
git tag -d v1.0.0

# Delete a remote tag
git push origin --delete v1.0.0
\`\`\`

On GitHub, tags automatically appear in the **Releases** section!`);
    }

    // ── Clone
    if (q.includes("clone")) {
      return fmt(`**📥 Git Clone — Download a Repository**

\`\`\`
# Clone a repo (creates a folder with repo name)
git clone https://github.com/username/repo.git

# Clone into a specific folder name
git clone https://github.com/username/repo.git my-project

# Clone only the latest snapshot (faster for large repos)
git clone --depth 1 https://github.com/username/repo.git

# Clone a specific branch
git clone -b main https://github.com/username/repo.git
\`\`\`

After cloning, you're automatically set up with \`origin\` pointing to the remote — no \`git remote add\` needed!`);
    }

    // ── Reflog (recover lost commits)
    if (q.includes("reflog") || q.includes("recover") || q.includes("lost commit") || q.includes("deleted branch")) {
      return fmt(`**🔍 Git Reflog — Recover Anything**

Reflog is your safety net. It records every action Git takes, even commits you "lost."

\`\`\`
# See the full history of HEAD movements
git reflog

# You'll see entries like:
# abc1234 HEAD@{2}: commit: feat: add login
# def5678 HEAD@{1}: reset --hard: moving to HEAD~3

# Restore to a specific point
git checkout abc1234
# Or create a new branch from that point:
git checkout -b recovery-branch abc1234

# Restore a deleted branch
git branch recovered-branch HEAD@{3}
\`\`\`

💡 Reflog entries are kept for **90 days** by default. You almost always can recover!`);
    }

    // ── SSH setup
    if (q.includes("ssh") || q.includes("permission denied") || q.includes("authentication") || q.includes("access denied")) {
      return fmt(`**🔐 Fix SSH Authentication**

\`\`\`
# Step 1: Generate an SSH key
ssh-keygen -t ed25519 -C "your@email.com"
# Press Enter to accept defaults

# Step 2: View your public key
cat ~/.ssh/id_ed25519.pub

# Step 3: Copy and add it to GitHub:
# GitHub → Settings → SSH and GPG Keys → New SSH Key → Paste

# Step 4: Test the connection
ssh -T git@github.com
# Should say: "Hi username! You've successfully authenticated"

# Step 5: If the key isn't being used, add it to the agent
ssh-add ~/.ssh/id_ed25519
\`\`\`

**Switch a repo from HTTPS to SSH:**
\`\`\`
git remote set-url origin git@github.com:username/repo.git
\`\`\``);
    }

    // ── Who built Git
    if (q.includes("who built") || q.includes("who created") || q.includes("history of git")) {
      return fmt(`**📜 The History of Git**

Git was created by **Linus Torvalds** (creator of Linux) in **April 2005**.

**Why?** The Linux kernel team was using BitKeeper, a proprietary version control system. When they lost their free license, Linus decided to write something better himself — in just a few weeks.

**Key design goals Linus set:**
- Blazingly fast (handles massive codebases like Linux)
- Fully distributed (no central server required)
- Strong data integrity (cryptographic SHA hashing)
- Free and open-source forever

Today Git powers virtually all software development and is used by billions of developers worldwide.

GitHub was built on top of Git in 2008 by Tom Preston-Werner, Chris Wanstrath, and Scott Chacon — and acquired by Microsoft in 2018 for $7.5 billion.`);
    }

    // ── Commit message best practices
    if (
      q.includes("commit message") ||
      q.includes("conventional commit") ||
      q.includes("how to write commit")
    ) {
      return fmt(`**✍️ Writing Great Commit Messages**

Use the **Conventional Commits** standard (used by Google, Microsoft, Angular):

\`\`\`
<type>(<scope>): <short description>
\`\`\`

**Types:**
\`\`\`
feat:     A new feature
fix:      A bug fix
docs:     Documentation changes only
style:    Formatting, missing semicolons, etc. (no logic change)
refactor: Code change that neither fixes a bug nor adds a feature
perf:     Performance improvement
test:     Adding or updating tests
chore:    Build process, dependency updates
\`\`\`

**Good examples:**
\`\`\`
feat(auth): add Google OAuth login
fix(navbar): correct mobile menu z-index
docs(readme): update installation steps
chore: update dependencies to latest
\`\`\`

💡 Use GitVora's **Commit Validator** panel to check your messages in real time!`);
    }

    // ── Fork and PR
    if (q.includes("fork") || (q.includes("pull request") || q.includes("pr"))) {
      return fmt(`**🍴 Fork & Pull Request Workflow**

\`\`\`
# 1. Fork the repo on GitHub (click "Fork" button)

# 2. Clone YOUR fork
git clone https://github.com/YOUR-NAME/repo.git

# 3. Add the original as "upstream"
git remote add upstream https://github.com/ORIGINAL/repo.git

# 4. Create a feature branch
git checkout -b fix/my-improvement

# 5. Make changes, commit them
git add .
git commit -m "fix: improve button styling"

# 6. Push to YOUR fork
git push origin fix/my-improvement

# 7. On GitHub, click "Compare & Pull Request"
\`\`\`

**Keep your fork up to date:**
\`\`\`
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
\`\`\``);
    }

    // ── Default fallback
    return fmt(`**🤖 I'm Your Git Expert!**

I can help you with:

\`\`\`
Quick prompts to try:
- "How do I push for the first time?"
- "My push was rejected, how do I fix it?"
- "What is git stash?"
- "How do I undo a commit?"
- "How do I resolve a merge conflict?"
- "What is git cherry-pick?"
- "How do I set up SSH?"
- "How to write good commit messages?"
- "How does git rebase work?"
- "How to create and push a tag?"
\`\`\`

Paste your **error message** here and I'll diagnose it instantly! 🔍`);
  }
})();
