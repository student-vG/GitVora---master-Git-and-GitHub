// ============================================================
// SKILL PATH — Roadmap-style Visual Tree
// ============================================================

const skillTreeData = {
  id: "root", label: "Git & GitHub", color: "#ffffff",
  children: [
    {
      id: "basics", label: "Learn the Basics", color: "#ffd700",
      info: { title: "Learn the Basics", body: "Start here. Understand what Git is and why every developer uses it." },
      children: [
        { id: "b1", label: "What is Version Control?", color: "#fde68a", info: { title: "What is Version Control?", body: "Version control is a system that records changes to files over time. You can recall specific versions later, revert files to a previous state, and see who modified what and when. Think of it as a time machine for your code." } },
        { id: "b2", label: "Why use Git?", color: "#fde68a", info: { title: "Why use Git?", body: "Git is the industry-standard version control system. It lets you: save snapshots of your project, collaborate with teams without overwriting each other's work, and recover from mistakes instantly." } },
        { id: "b3", label: "Git vs Other VCS", color: "#fde68a", info: { title: "Git vs Other VCS", body: "Git is <strong>distributed</strong> — every developer has the full project history. Older systems like SVN or CVS are centralized, meaning one server holds everything. Distributed means you can work offline and merge later." } },
        { id: "b4", label: "Installing Git", color: "#fde68a", info: { title: "Installing Git Locally", body: "<strong>Windows:</strong> Download from git-scm.com/downloads<br><strong>Mac:</strong> Run <code>brew install git</code> or install Xcode tools<br><strong>Linux:</strong> Run <code>sudo apt install git</code><br><br>Verify: <code>git --version</code>" } }
      ]
    },
    {
      id: "repo", label: "Repository Basics", color: "#ffd700",
      info: { title: "Repository Basics", body: "A repository (repo) is a folder tracked by Git. It stores your entire project history." },
      children: [
        { id: "r1", label: "git init", color: "#fde68a", info: { title: "git init", body: "Turns any folder into a Git repository.<br><code>git init</code><br>Creates a hidden <code>.git</code> folder that stores all history. Run once per project." } },
        { id: "r2", label: "git config", color: "#fde68a", info: { title: "git config", body: "Set your identity so Git knows who made each commit.<br><code>git config --global user.name \"Your Name\"</code><br><code>git config --global user.email \"you@email.com\"</code>" } },
        { id: "r3", label: "Working Directory", color: "#fde68a", info: { title: "Working Directory", body: "The working directory is the folder on your computer where you edit files. Changes here are 'untracked' until you use <code>git add</code>." } },
        { id: "r4", label: "Staging Area", color: "#fde68a", info: { title: "Staging Area (Index)", body: "The staging area is a preparation zone. <code>git add .</code> moves changes here. You choose exactly what goes into the next commit." } },
        { id: "r5", label: "Committing Changes", color: "#fde68a", info: { title: "Committing Changes", body: "A commit saves a snapshot of staged changes.<br><code>git commit -m \"feat: add login\"</code><br>Write descriptive messages: what changed and why." } },
        { id: "r6", label: ".gitignore", color: "#fde68a", info: { title: ".gitignore", body: "A file that tells Git which files to completely ignore (never track).<br>Common entries:<br><code>node_modules/</code><br><code>.env</code><br><code>dist/</code><br>Select a template when creating a repo on GitHub." } }
      ]
    },
    {
      id: "collab", label: "Basic Collaboration", color: "#ffd700",
      info: { title: "Basic Collaboration", body: "Use GitHub to share code and work with others using remotes and pull requests." },
      children: [
        { id: "c1", label: "Cloning Repos", color: "#fde68a", info: { title: "Cloning Repositories", body: "Download a GitHub repository to your computer.<br><code>git clone https://github.com/user/repo.git</code><br>This copies all files and the full history." } },
        { id: "c2", label: "Managing Remotes", color: "#fde68a", info: { title: "Managing Remotes", body: "Remotes are URLs pointing to GitHub repos.<br><code>git remote add origin &lt;url&gt;</code><br><code>git remote -v</code> — list all remotes<br><strong>origin</strong> = your fork, <strong>upstream</strong> = original repo" } },
        { id: "c3", label: "Push / Pull", color: "#fde68a", info: { title: "Pushing & Pulling", body: "<code>git push origin main</code> — upload commits to GitHub<br><code>git pull --rebase origin main</code> — download and sync remote changes<br>Always pull before you push to avoid conflicts." } },
        { id: "c4", label: "Pull Requests", color: "#fde68a", info: { title: "Pull Requests (PRs)", body: "A PR is a formal request to merge your branch into main. On GitHub: push your branch → click 'Compare & pull request' → add description → request review → merge." } }
      ]
    },
    {
      id: "branch", label: "Branching", color: "#ffd700",
      info: { title: "Branching", body: "Branches let you work on features without touching the stable main code." },
      children: [
        { id: "br1", label: "Creating Branch", color: "#fde68a", info: { title: "Creating a Branch", body: "<code>git checkout -b feature/my-feature</code><br>Creates and switches to a new branch. Use naming like <code>feature/</code>, <code>fix/</code>, <code>hotfix/</code>." } },
        { id: "br2", label: "Switching Branch", color: "#fde68a", info: { title: "Switching Branches", body: "<code>git switch main</code> (modern)<br><code>git checkout main</code> (classic)<br>Both switch your working directory to that branch." } },
        { id: "br3", label: "Merging", color: "#fde68a", info: { title: "Merging Branches", body: "<code>git checkout main</code><br><code>git merge feature/my-feature</code><br>Combines the feature branch into main. Resolve any conflicts that appear." } },
        { id: "br4", label: "Rebase", color: "#fde68a", info: { title: "git rebase", body: "<code>git pull --rebase origin main</code><br>Replays your commits on top of the latest remote commits. Keeps history clean and linear instead of creating merge commits." } }
      ]
    },
    {
      id: "advanced", label: "Advanced Git", color: "#ffd700",
      info: { title: "Advanced Git", body: "Power tools for debugging, recovering, and rewriting history." },
      children: [
        { id: "a1", label: "git stash", color: "#fde68a", info: { title: "git stash", body: "Temporarily shelve changes without committing.<br><code>git stash</code> — save<br><code>git stash pop</code> — restore<br>Use when you need to switch branches but aren't ready to commit." } },
        { id: "a2", label: "git reflog", color: "#fde68a", info: { title: "git reflog — Ultimate Undo", body: "Records every action you've ever taken. Recover lost commits, branches, or bad resets.<br><code>git reflog</code><br><code>git reset --hard HEAD@{2}</code>" } },
        { id: "a3", label: "git cherry-pick", color: "#fde68a", info: { title: "git cherry-pick", body: "Apply a single commit from another branch.<br><code>git cherry-pick abc1234</code><br>Use when you want just one specific change without merging everything." } },
        { id: "a4", label: "git bisect", color: "#fde68a", info: { title: "git bisect — Find the Bug", body: "Binary search through history to find which commit introduced a bug.<br><code>git bisect start</code><br><code>git bisect bad</code><br><code>git bisect good v1.0</code><br>Git checks out commits for you to test." } },
        { id: "a5", label: "Interactive Rebase", color: "#fde68a", info: { title: "git rebase -i — Rewrite History", body: "<code>git rebase -i HEAD~3</code><br>Squash, reorder, rename, or drop the last N commits before merging a PR. Never rebase public shared branches." } }
      ]
    },
    {
      id: "release", label: "Release & CI/CD", color: "#ffd700",
      info: { title: "Release & CI/CD", body: "Tag versions, manage releases, and automate with GitHub Actions." },
      children: [
        { id: "rl1", label: "git tag", color: "#fde68a", info: { title: "git tag — Version Releases", body: "<code>git tag -a v1.0.0 -m \"Release\"</code><br><code>git push origin --tags</code><br>Use Semantic Versioning: <strong>Major.Minor.Patch</strong>" } },
        { id: "rl2", label: "Release Branches", color: "#fde68a", info: { title: "Release Branches (GitFlow)", body: "Cut a release branch from main for final stabilization: <code>release/v1.2.0</code>. Fix final bugs here, then merge back to main and tag it." } },
        { id: "rl3", label: "GitHub Actions", color: "#fde68a", info: { title: "GitHub Actions — Automation", body: "Automate tests, builds, and deployments when you push code. Create a <code>.github/workflows/main.yml</code> file. GitHub runs it automatically on every push or PR." } }
      ]
    }
  ]
};

// ── Node info lookup ──────────────────────────────────────────
const nodeMap = {};
function buildMap(node) {
  nodeMap[node.id] = node;
  if (node.children) node.children.forEach(buildMap);
}
buildMap(skillTreeData);

// ── Render ────────────────────────────────────────────────────
function renderSkillTree() {
  const grid = document.getElementById("academyGrid");
  if (!grid) return;
  grid.innerHTML = "";
  grid.style.display = "block";
  grid.style.padding = "0";

  const wrap = document.createElement("div");
  wrap.className = "rt-wrap";
  wrap.innerHTML = buildTreeHTML(skillTreeData, true);
  grid.appendChild(wrap);

  // Detail panel
  const panel = document.createElement("div");
  panel.className = "sk-detail-panel";
  panel.id = "skDetailPanel";
  panel.style.display = "none";
  panel.innerHTML = `
    <div class="sk-detail-header">
      <div class="sk-detail-title" id="skDetailTitle"></div>
      <button class="sk-detail-close" id="skDetailClose"><i class="ph ph-x"></i></button>
    </div>
    <div class="sk-detail-body" id="skDetailBody"></div>
  `;
  grid.appendChild(panel);

  // Click handlers
  grid.querySelectorAll(".rt-node[data-id]").forEach(el => {
    el.addEventListener("click", e => {
      e.stopPropagation();
      const node = nodeMap[el.dataset.id];
      if (!node || !node.info) return;
      document.getElementById("skDetailTitle").textContent = node.info.title;
      document.getElementById("skDetailBody").innerHTML = node.info.body;
      panel.style.display = "block";
      grid.querySelectorAll(".rt-node").forEach(n => n.classList.remove("active"));
      el.classList.add("active");
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  document.getElementById("skDetailClose").addEventListener("click", () => {
    panel.style.display = "none";
    grid.querySelectorAll(".rt-node").forEach(n => n.classList.remove("active"));
  });

  updateAcademyProgressUI(getAcademyCompletion());
}

function buildTreeHTML(node, isRoot = false) {
  const hasChildren = node.children && node.children.length > 0;
  const nodeClass = isRoot ? "rt-node rt-root" : (hasChildren ? "rt-node rt-branch" : "rt-node rt-leaf");
  const style = `--rt-color:${node.color}`;

  return `
    <div class="rt-item">
      <div class="${nodeClass}" data-id="${node.id}" style="${style}">${node.label}</div>
      ${hasChildren ? `
        <div class="rt-children">
          ${node.children.map(c => buildTreeHTML(c)).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

renderSkillTree();
