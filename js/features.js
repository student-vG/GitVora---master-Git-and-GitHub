// ============================================================
// FEATURE 1: COMMIT MESSAGE VALIDATOR
// ============================================================
(function initCommitValidator() {
  const el = document.getElementById("commitlintApp");
  if (!el) return;

  const TYPES = ["feat","fix","docs","style","refactor","test","chore","perf","ci","build","revert"];
  const TYPE_DESC = {
    feat:"New feature for the user",fix:"Bug fix for the user",docs:"Documentation only",
    style:"Formatting, no logic change",refactor:"Code restructure, no feature/fix",
    test:"Adding or updating tests",chore:"Build process or tooling",perf:"Performance improvement",
    ci:"CI/CD config changes",build:"Build system changes",revert:"Reverting a previous commit"
  };

  el.innerHTML = `
    <div class="cl-wrap">
      <div class="cl-input-area">
        <label class="cl-label">Type your commit message:</label>
        <input id="clInput" class="cl-input" placeholder='e.g. feat(auth): add login page with JWT support' autocomplete="off" spellcheck="false"/>
        <div class="cl-live" id="clLive"></div>
      </div>
      <div class="cl-result" id="clResult" style="display:none"></div>
      <div class="cl-types-grid">
        <div class="cl-section-title">Conventional Commit Types — Click to Insert</div>
        ${TYPES.map(t=>`<div class="cl-type-chip" data-type="${t}"><code>${t}:</code><span>${TYPE_DESC[t]}</span></div>`).join("")}
      </div>
      <div class="cl-examples">
        <div class="cl-section-title">Real-World Examples</div>
        <div class="cl-eg" data-fill="feat(auth): add Google OAuth login"><span class="cl-eg-type feat">feat</span> feat(auth): add Google OAuth login</div>
        <div class="cl-eg" data-fill="fix(cart): correct item total calculation"><span class="cl-eg-type fix">fix</span> fix(cart): correct item total calculation</div>
        <div class="cl-eg" data-fill="docs(readme): add installation instructions"><span class="cl-eg-type docs">docs</span> docs(readme): add installation instructions</div>
        <div class="cl-eg" data-fill="chore(deps): update eslint to v9"><span class="cl-eg-type chore">chore</span> chore(deps): update eslint to v9</div>
        <div class="cl-eg" data-fill="refactor(api): extract fetch logic to service layer"><span class="cl-eg-type refactor">refactor</span> refactor(api): extract fetch logic to service layer</div>
        <div class="cl-eg" data-fill="perf(images): lazy-load hero images on scroll"><span class="cl-eg-type perf">perf</span> perf(images): lazy-load hero images on scroll</div>
      </div>
    </div>`;

  function validateCommit(msg) {
    const issues = [], tips = [];
    const reg = /^(\w+)(\([\w\-\/]+\))?(!)?:\s(.+)$/;
    const match = msg.match(reg);

    if (!msg.trim()) return { score: 0, label: "", issues: [], tips: [] };
    if (!match) {
      issues.push("Missing format: must start with <code>type: description</code>");
      issues.push("Example: <code>feat: add login button</code> or <code>fix(api): handle null error</code>");
      return { score: 10, label: "Invalid", color: "#ff6b6b", issues, tips };
    }

    const [, type, scope, breaking, desc] = match;
    let score = 60;

    if (!TYPES.includes(type)) {
      issues.push(`<code>${type}</code> is not a valid type. Use: ${TYPES.map(t=>`<code>${t}</code>`).join(", ")}`);
      score -= 20;
    } else { score += 15; }

    if (desc.length < 5) { issues.push("Description too short — be more specific."); score -= 15; }
    if (desc.length > 72) { issues.push(`Description is ${desc.length} chars — keep under 72.`); score -= 10; }
    if (/^[A-Z]/.test(desc)) { issues.push("Description should start lowercase: <code>add login</code> not <code>Add login</code>"); score -= 5; }
    if (/\.$/.test(desc)) { issues.push("Remove the period at the end of your description."); score -= 5; }
    if (scope) score += 10;
    if (breaking) { tips.push("Breaking change detected (<code>!</code>). Consider adding a footer: <code>BREAKING CHANGE: description</code>"); }
    if (desc.length >= 5 && desc.length <= 72) score += 10;
    if (!issues.length) tips.push("Perfect format! Ready to commit. 🎉");
    score = Math.max(0, Math.min(100, score));

    const label = score >= 90 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Needs Work" : "Invalid";
    const color = score >= 90 ? "#00ff88" : score >= 70 ? "#ffb86c" : score >= 50 ? "#ff9f43" : "#ff6b6b";
    return { score, label, color, issues, tips, type, scope: scope?.slice(1,-1), desc, breaking };
  }

  const input = el.querySelector("#clInput");
  const liveEl = el.querySelector("#clLive");
  const resultEl = el.querySelector("#clResult");

  input.addEventListener("input", () => {
    const msg = input.value;
    if (!msg.trim()) { liveEl.textContent = ""; resultEl.style.display = "none"; return; }
    const v = validateCommit(msg);
    if (!v.label) return;

    liveEl.innerHTML = `<span style="color:${v.color};font-weight:700;">${v.label}</span> — Score: <strong>${v.score}/100</strong>`;

    resultEl.style.display = "block";
    resultEl.innerHTML = `
      <div class="cl-score-bar-wrap"><div class="cl-score-bar" style="width:${v.score}%;background:${v.color}"></div></div>
      <div class="cl-parsed">
        ${v.type ? `<span class="cl-token type" style="background:${v.color};color:#000">${v.type}</span>` : ""}
        ${v.scope ? `<span class="cl-token scope">(${v.scope})</span>` : ""}
        ${v.breaking ? `<span class="cl-token breaking">!</span>` : ""}
        ${v.desc ? `<span class="cl-token desc">${v.desc}</span>` : ""}
      </div>
      ${v.issues.map(i=>`<div class="cl-issue"><i class="ph ph-x-circle"></i>${i}</div>`).join("")}
      ${v.tips.map(t=>`<div class="cl-tip"><i class="ph ph-check-circle"></i>${t}</div>`).join("")}
    `;
  });

  el.querySelectorAll(".cl-type-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.type + ": ";
      input.focus(); input.dispatchEvent(new Event("input"));
    });
  });
  el.querySelectorAll(".cl-eg").forEach(eg => {
    eg.addEventListener("click", () => {
      input.value = eg.dataset.fill;
      input.dispatchEvent(new Event("input"));
    });
  });
})();

// ============================================================
// FEATURE 2: GITHUB ACTIONS GUIDE
// ============================================================
(function initActionsGuide() {
  const el = document.getElementById("actionsApp");
  if (!el) return;

  const workflows = [
    {
      id: "test", label: "Run Tests on Push", icon: "ph-flask", color: "#00ff88",
      desc: "Automatically run your test suite every time code is pushed. This is the foundation of CI.",
      when: "Use this for any project with automated tests (Jest, Pytest, JUnit, etc.)",
      yaml: `.github/workflows/test.yml
---
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test`
    },
    {
      id: "deploy", label: "Deploy to GitHub Pages", icon: "ph-globe", color: "#00cfff",
      desc: "Automatically publish your website to GitHub Pages every time you push to main. Free hosting!",
      when: "Perfect for portfolio sites, documentation, or any static HTML/CSS/JS project.",
      yaml: `.github/workflows/deploy.yml
---
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4`
    },
    {
      id: "lint", label: "Auto Lint & Format Check", icon: "ph-code", color: "#b478ff",
      desc: "Block PRs that have formatting or linting errors. Keeps your codebase consistent automatically.",
      when: "Use this to enforce code standards across your team without manual review.",
      yaml: `.github/workflows/lint.yml
---
name: Lint Check

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check formatting (Prettier)
        run: npm run format:check`
    },
    {
      id: "release", label: "Auto Release on Tag", icon: "ph-tag", color: "#ffb86c",
      desc: "Automatically create a GitHub Release with release notes when you push a version tag.",
      when: "Use this for libraries or apps where you want automated semantic versioning and changelogs.",
      yaml: `.github/workflows/release.yml
---
name: Create Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`
    }
  ];

  el.innerHTML = `
    <div class="ga-wrap">
      <div class="ga-how-it-works">
        <div class="ga-hw-title"><i class="ph ph-info"></i> How GitHub Actions Works</div>
        <div class="ga-hw-steps">
          <div class="ga-hw-step"><div class="ga-hw-num">1</div><div>You push code or open a PR</div></div>
          <div class="ga-hw-arrow">→</div>
          <div class="ga-hw-step"><div class="ga-hw-num">2</div><div>GitHub reads <code>.github/workflows/*.yml</code></div></div>
          <div class="ga-hw-arrow">→</div>
          <div class="ga-hw-step"><div class="ga-hw-num">3</div><div>A virtual machine runs your commands</div></div>
          <div class="ga-hw-arrow">→</div>
          <div class="ga-hw-step"><div class="ga-hw-num">4</div><div>Results shown as ✅ or ❌ on your PR</div></div>
        </div>
      </div>
      <div class="ga-pick-title">Choose a Workflow Template:</div>
      <div class="ga-cards" id="gaCards">
        ${workflows.map(w=>`
          <div class="ga-card" data-wf="${w.id}" style="--ga-color:${w.color}">
            <div class="ga-card-icon"><i class="ph ${w.icon}"></i></div>
            <div class="ga-card-label">${w.label}</div>
          </div>`).join("")}
      </div>
      <div class="ga-detail" id="gaDetail" style="display:none">
        <div class="ga-detail-header">
          <div>
            <div class="ga-detail-title" id="gaDetailTitle"></div>
            <div class="ga-detail-desc" id="gaDetailDesc"></div>
            <div class="ga-detail-when" id="gaDetailWhen"></div>
          </div>
          <button class="ga-copy-btn" id="gaCopyBtn"><i class="ph ph-copy"></i> Copy YAML</button>
        </div>
        <pre class="ga-yaml" id="gaYaml"></pre>
        <div class="ga-setup-steps">
          <div class="ga-setup-title">How to add this to your project:</div>
          <div class="ga-setup-step"><span>1</span> In your repo, create the folder: <code>.github/workflows/</code></div>
          <div class="ga-setup-step"><span>2</span> Create a file named as shown above (e.g., <code>test.yml</code>)</div>
          <div class="ga-setup-step"><span>3</span> Paste the YAML content into that file</div>
          <div class="ga-setup-step"><span>4</span> Commit and push — GitHub runs it automatically!</div>
          <div class="ga-setup-step"><span>5</span> View results in the <strong>Actions</strong> tab of your repository</div>
        </div>
      </div>
    </div>`;

  el.querySelectorAll(".ga-card").forEach(card => {
    card.addEventListener("click", () => {
      el.querySelectorAll(".ga-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const wf = workflows.find(w => w.id === card.dataset.wf);
      const detail = el.querySelector("#gaDetail");
      el.querySelector("#gaDetailTitle").textContent = wf.label;
      el.querySelector("#gaDetailDesc").textContent = wf.desc;
      el.querySelector("#gaDetailWhen").innerHTML = `<i class="ph ph-lightbulb"></i> ${wf.when}`;
      el.querySelector("#gaYaml").textContent = wf.yaml;
      detail.style.display = "block";
      detail.style.setProperty("--ga-color", card.style.getPropertyValue("--ga-color"));
    });
  });

  el.querySelector("#gaCopyBtn").addEventListener("click", function() {
    const yaml = el.querySelector("#gaYaml").textContent;
    navigator.clipboard.writeText(yaml).then(() => {
      this.innerHTML = '<i class="ph ph-check"></i> Copied!';
      setTimeout(() => { this.innerHTML = '<i class="ph ph-copy"></i> Copy YAML'; }, 2000);
    });
  });
})();

// ============================================================
// FEATURE 3: MERGE STRATEGY GUIDE
// ============================================================
(function initMergeStrategy() {
  const el = document.getElementById("mergeStratApp");
  if (!el) return;

  const strategies = [
    {
      id: "merge", label: "Merge Commit", icon: "ph-git-merge", color: "#00cfff",
      badge: "Default on GitHub",
      headline: "Preserves the full history of every commit.",
      pros: ["Complete audit trail of all commits","Branch history is visually preserved","Safe — never rewrites history","Best for long-lived feature branches"],
      cons: ["Creates an extra merge commit","History graph looks like a tangled web on large teams","Harder to read git log"],
      when: "✅ Use when: Working in a team with long feature branches, or when you need full commit history for compliance/audit.",
      avoid: "❌ Avoid when: You want a clean, linear history.",
      example: `git checkout main\ngit merge feature/login\n# Creates: merge commit "Merge branch 'feature/login'"`
    },
    {
      id: "squash", label: "Squash & Merge", icon: "ph-arrows-in-line-vertical", color: "#00ff88",
      badge: "Recommended for most teams",
      headline: "Combines all feature commits into one clean commit on main.",
      pros: ["Clean, linear history on main","One commit per feature — easy to revert","Commit message can be polished before merging","Great for code review — one thing, one commit"],
      cons: ["Loses individual commit history from the branch","Branch author credit may be lost","Can't bisect through granular changes after merge"],
      when: "✅ Use when: You want a clean main branch. Best for most product teams and open-source projects.",
      avoid: "❌ Avoid when: You need to trace individual commits for debugging or compliance.",
      example: `# On GitHub: Click "Squash and merge"\n# Or locally:\ngit checkout main\ngit merge --squash feature/login\ngit commit -m "feat(auth): add login page"`
    },
    {
      id: "rebase", label: "Rebase & Merge", icon: "ph-git-branch", color: "#b478ff",
      badge: "Advanced — Clean linear history",
      headline: "Replays all commits from the feature branch onto main without a merge commit.",
      pros: ["Perfectly linear git history","Every individual commit is preserved","No merge commits cluttering history","git bisect works perfectly"],
      cons: ["Rewrites commit SHAs — can't be undone safely","Dangerous on shared branches","Requires everyone to pull --force after rebase"],
      when: "✅ Use when: You are the sole owner of the branch and want clean individual commits on main.",
      avoid: "❌ Avoid when: Multiple people are working on the same branch.",
      example: `# On GitHub: Click "Rebase and merge"\n# Or locally:\ngit checkout feature/login\ngit rebase main\ngit checkout main\ngit merge --ff-only feature/login`
    }
  ];

  el.innerHTML = `
    <div class="ms-wrap">
      <div class="ms-cards">
        ${strategies.map(s=>`
          <div class="ms-card" data-ms="${s.id}" style="--ms-color:${s.color}">
            <div class="ms-card-icon"><i class="ph ${s.icon}"></i></div>
            <div class="ms-card-name">${s.label}</div>
            <div class="ms-card-badge">${s.badge}</div>
          </div>`).join("")}
      </div>
      <div class="ms-detail" id="msDetail">
        <div class="ms-placeholder"><i class="ph ph-hand-pointing"></i> Click a strategy above to see the full explanation</div>
      </div>
    </div>`;

  el.querySelectorAll(".ms-card").forEach(card => {
    card.addEventListener("click", () => {
      el.querySelectorAll(".ms-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const s = strategies.find(x => x.id === card.dataset.ms);
      const d = el.querySelector("#msDetail");
      d.style.setProperty("--ms-color", s.color);
      d.innerHTML = `
        <div class="ms-d-header" style="border-color:${s.color}20">
          <div class="ms-d-title" style="color:${s.color}"><i class="ph ${s.icon}"></i> ${s.label}</div>
          <div class="ms-d-headline">${s.headline}</div>
        </div>
        <div class="ms-d-body">
          <div class="ms-d-col">
            <div class="ms-d-sect-title" style="color:#00ff88">✅ Pros</div>
            ${s.pros.map(p=>`<div class="ms-d-item good"><i class="ph ph-check"></i>${p}</div>`).join("")}
          </div>
          <div class="ms-d-col">
            <div class="ms-d-sect-title" style="color:#ff6b6b">❌ Cons</div>
            ${s.cons.map(c=>`<div class="ms-d-item bad"><i class="ph ph-x"></i>${c}</div>`).join("")}
          </div>
        </div>
        <div class="ms-d-when">${s.when}</div>
        <div class="ms-d-avoid">${s.avoid}</div>
        <div class="ms-d-cmd-label">How to do it:</div>
        <pre class="sk-cmd" style="margin:0">${s.example}</pre>
      `;
    });
  });
})();

// ============================================================
// FEATURE 4: SIGNED COMMITS GUIDE
// ============================================================
(function initSignedCommits() {
  const el = document.getElementById("signedCommitsApp");
  if (!el) return;

  el.innerHTML = `
    <div class="sc-wrap">
      <div class="sc-why">
        <div class="sc-why-badge"><i class="ph ph-warning"></i> The Problem</div>
        <p>By default, GitHub shows <span class="sc-unverified">Unverified</span> on your commits. This means anyone could impersonate you by setting your email in their Git config and pushing commits "from you". Verified commits prove the commit actually came from you.</p>
      </div>

      <div class="sc-method-tabs">
        <button class="sc-tab active" data-tab="ssh">SSH Signing (Modern — Recommended)</button>
        <button class="sc-tab" data-tab="gpg">GPG Signing (Classic)</button>
      </div>

      <div class="sc-tab-content" id="scTabSSH">
        <div class="sc-steps">
          <div class="sc-step"><div class="sc-step-num">1</div><div>
            <strong>Generate an SSH key (if you don't have one):</strong>
            <pre class="sk-cmd">ssh-keygen -t ed25519 -C "your@email.com"</pre>
            <p>Press Enter for all prompts to use defaults. Your key is saved to <code>~/.ssh/id_ed25519.pub</code></p>
          </div></div>
          <div class="sc-step"><div class="sc-step-num">2</div><div>
            <strong>Add your SSH key to GitHub:</strong>
            <p>Go to <strong>github.com → Settings → SSH and GPG keys → New SSH key</strong></p>
            <pre class="sk-cmd">cat ~/.ssh/id_ed25519.pub\n# Copy the output and paste it on GitHub</pre>
            <p>Set the key type to <strong>"Signing Key"</strong> (not Authentication).</p>
          </div></div>
          <div class="sc-step"><div class="sc-step-num">3</div><div>
            <strong>Configure Git to use SSH for signing:</strong>
            <pre class="sk-cmd">git config --global gpg.format ssh\ngit config --global user.signingkey ~/.ssh/id_ed25519.pub\ngit config --global commit.gpgsign true</pre>
          </div></div>
          <div class="sc-step"><div class="sc-step-num">4</div><div>
            <strong>Make a signed commit and verify:</strong>
            <pre class="sk-cmd">git commit -m "feat: my first signed commit"\ngit log --show-signature -1</pre>
            <p>On GitHub, your commits will now show the green <span class="sc-verified">Verified</span> badge! ✅</p>
          </div></div>
        </div>
      </div>

      <div class="sc-tab-content" id="scTabGPG" style="display:none">
        <div class="sc-steps">
          <div class="sc-step"><div class="sc-step-num">1</div><div>
            <strong>Generate a GPG key:</strong>
            <pre class="sk-cmd">gpg --full-generate-key\n# Choose: RSA and RSA → 4096 bits → 0 (no expiry)\n# Enter your name and GitHub email</pre>
          </div></div>
          <div class="sc-step"><div class="sc-step-num">2</div><div>
            <strong>Get your key ID:</strong>
            <pre class="sk-cmd">gpg --list-secret-keys --keyid-format=long\n# Look for: sec   rsa4096/XXXXXXXXXXXXXXXX\n# Copy the XXXXXXXXXXXXXXXX part</pre>
          </div></div>
          <div class="sc-step"><div class="sc-step-num">3</div><div>
            <strong>Export and add to GitHub:</strong>
            <pre class="sk-cmd">gpg --armor --export XXXXXXXXXXXXXXXX\n# Copy the output</pre>
            <p>Go to <strong>github.com → Settings → SSH and GPG keys → New GPG key</strong> and paste it.</p>
          </div></div>
          <div class="sc-step"><div class="sc-step-num">4</div><div>
            <strong>Configure Git to use your key:</strong>
            <pre class="sk-cmd">git config --global user.signingkey XXXXXXXXXXXXXXXX\ngit config --global commit.gpgsign true</pre>
          </div></div>
          <div class="sc-step"><div class="sc-step-num">5</div><div>
            <strong>Sign a commit:</strong>
            <pre class="sk-cmd">git commit -S -m "feat: signed with GPG"\ngit log --show-signature -1</pre>
          </div></div>
        </div>
      </div>

      <div class="sc-tip"><i class="ph ph-trophy"></i> <strong>Pro tip:</strong> Once <code>commit.gpgsign true</code> is set globally, ALL future commits are signed automatically — no extra flags needed!</div>
    </div>`;

  el.querySelectorAll(".sc-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      el.querySelectorAll(".sc-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      el.querySelector("#scTabSSH").style.display = tab.dataset.tab === "ssh" ? "block" : "none";
      el.querySelector("#scTabGPG").style.display = tab.dataset.tab === "gpg" ? "block" : "none";
    });
  });
})();
