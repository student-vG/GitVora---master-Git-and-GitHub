// ============================================================
// PRO SETUP WIZARD — Full Guide
// ============================================================
function renderSetupWizard(userData) {
  const container = document.getElementById("setupStepsContainer");
  container.innerHTML = "";

  const name     = userData.name     || "Developer";
  const email    = userData.email    || "you@email.com";
  const username = userData.username || "yourusername";
  const os       = userData.os       || "windows";

  const installContent = os === "windows" ? `
    <p class="sw-intro">Git Bash is the terminal you'll use to talk to Git. It gives you a powerful command-line interface on Windows.</p>
    <div class="sw-steps-list">
      <div class="sw-step-item"><span class="sw-step-num">1</span><div>Go to <a href="https://git-scm.com/downloads" target="_blank">git-scm.com/downloads</a> and click <span class="sw-tag">Download for Windows</span>.</div></div>
      <div class="sw-step-item"><span class="sw-step-num">2</span><div>Open the downloaded <code>.exe</code> file and click <strong>Yes</strong> when Windows asks for permission.</div></div>
      <div class="sw-step-item"><span class="sw-step-num">3</span><div>Click <strong>Next</strong> on every screen — the defaults are perfect for beginners. On the editor screen you can optionally pick <strong>VS Code</strong>.</div></div>
      <div class="sw-step-item"><span class="sw-step-num">4</span><div>Click <strong>Install</strong> and wait for it to finish.</div></div>
      <div class="sw-step-item"><span class="sw-step-num">5</span><div>Press the <kbd>Win</kbd> key, search <strong>Git Bash</strong>, and open it. A black terminal window appears — this is your new superpower!</div></div>
    </div>
    <div class="sw-tip" style="border-color:rgba(255,107,107,0.4);background:rgba(255,107,107,0.06);"><i class="ph ph-info"></i> <strong>Quick Check:</strong> Type <code>git --version</code> and press Enter. If you see a version number, Git is installed correctly!</div>
  ` : os === "mac" ? `
    <p class="sw-intro">macOS may have Git pre-installed. Let's check and get the latest version.</p>
    <div class="sw-steps-list">
      <div class="sw-step-item"><span class="sw-step-num">1</span><div>Press <kbd>Cmd</kbd> + <kbd>Space</kbd>, type <strong>Terminal</strong>, open it.</div></div>
      <div class="sw-step-item"><span class="sw-step-num">2</span><div>Type <code>git --version</code> — if a version shows, you're done!</div></div>
      <div class="sw-step-item"><span class="sw-step-num">3</span><div>If not installed, a popup asks you to install <strong>Command Line Developer Tools</strong> — click <strong>Install</strong>.</div></div>
      <div class="sw-step-item"><span class="sw-step-num">4</span><div>For the latest Git via Homebrew: <code>brew install git</code></div></div>
    </div>
  ` : `
    <p class="sw-intro">Installing Git on Linux is simple via your package manager.</p>
    <div class="sw-steps-list">
      <div class="sw-step-item"><span class="sw-step-num">1</span><div>Open Terminal.</div></div>
      <div class="sw-step-item"><span class="sw-step-num">2</span><div>Update packages: <code>sudo apt update</code></div></div>
      <div class="sw-step-item"><span class="sw-step-num">3</span><div>Install Git: <code>sudo apt install git</code></div></div>
      <div class="sw-step-item"><span class="sw-step-num">4</span><div>Verify: <code>git --version</code></div></div>
    </div>
  `;

  const steps = [
    {
      icon: "ph-github-logo", label: "STEP 1", color: "#00ff88",
      title: "Create Your GitHub Account",
      content: `
        <p class="sw-intro">GitHub is the world's largest platform for storing and sharing code. Every developer needs one. Here's how to set yours up the right way.</p>
        <div class="sw-steps-list">
          <div class="sw-step-item"><span class="sw-step-num">1</span><div>Go to <a href="https://github.com" target="_blank">github.com</a> and click <span class="sw-tag">Sign up</span> in the top-right corner.</div></div>
          <div class="sw-step-item"><span class="sw-step-num">2</span><div><strong>Enter your email:</strong> Use <code>${email}</code> — the same one you'll use for Git.</div></div>
          <div class="sw-step-item"><span class="sw-step-num">3</span><div><strong>Create a strong password.</strong> Mix letters, numbers, symbols. e.g., <code>MyGit@2025!</code></div></div>
          <div class="sw-step-item"><span class="sw-step-num">4</span><div><strong>Choose your username:</strong> <code>${username}</code> — This is permanent and public. Employers see it. Use your real name or a professional handle.</div></div>
          <div class="sw-step-item"><span class="sw-step-num">5</span><div><strong>Solve the puzzle</strong> (GitHub's human verification).</div></div>
          <div class="sw-step-item"><span class="sw-step-num">6</span><div><strong>Enter the launch code</strong> sent to <code>${email}</code> to activate your account.</div></div>
        </div>
        <div class="sw-tip"><i class="ph ph-shield-check"></i> <strong>Pro Tip:</strong> Immediately go to <strong>Settings → Password and authentication</strong> and enable <strong>Two-Factor Authentication (2FA)</strong> to protect your code.</div>
      `
    },
    {
      icon: "ph-user-circle", label: "STEP 2", color: "#00cfff",
      title: "Understanding Your GitHub Profile Menu",
      content: `
        <p class="sw-intro">Click your profile photo in the top-right corner of GitHub. A dropdown appears. Here is what every option does — no more guessing.</p>
        <div class="sw-menu-grid">
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(0,255,136,0.12);color:#00ff88;"><i class="ph ph-user"></i></div><div><strong>Profile</strong><p>Your public developer page. Shows your photo, bio, pinned repos, the green contribution graph, and all your repositories.</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(0,207,255,0.12);color:#00cfff;"><i class="ph ph-folders"></i></div><div><strong>Repositories</strong><p>All the projects you've created. Public ones are visible to everyone; private ones only to you.</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(255,184,108,0.12);color:#ffb86c;"><i class="ph ph-star"></i></div><div><strong>Stars</strong><p>Projects you've "starred" (bookmarked). Stars also signal to others that a project is popular and trustworthy.</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(255,107,107,0.12);color:#ff6b6b;"><i class="ph ph-code"></i></div><div><strong>Gists</strong><p>A mini-repo for a single code snippet. Great for sharing one function or config file without creating a full project.</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(180,120,255,0.12);color:#b478ff;"><i class="ph ph-buildings"></i></div><div><strong>Organizations</strong><p>Team accounts. Companies group members and repos under one umbrella (e.g., <code>github.com/google</code>).</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(0,255,136,0.12);color:#00ff88;"><i class="ph ph-globe"></i></div><div><strong>Enterprises</strong><p>Large company-level GitHub with extra security and admin features. For big corporations.</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(255,107,107,0.12);color:#ff6b6b;"><i class="ph ph-heart"></i></div><div><strong>Sponsors</strong><p>Lets developers get paid by the community for open-source work. You can also donate to projects you love.</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(0,207,255,0.12);color:#00cfff;"><i class="ph ph-gear"></i></div><div><strong>Settings</strong><p>Change your email, password, SSH keys, notifications, and privacy. This is your account control panel.</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(255,184,108,0.12);color:#ffb86c;"><i class="ph ph-robot"></i></div><div><strong>Copilot Settings</strong><p>GitHub Copilot is an AI coding assistant that auto-completes your code as you type.</p></div></div>
          <div class="sw-menu-item"><div class="sw-menu-icon" style="background:rgba(180,120,255,0.12);color:#b478ff;"><i class="ph ph-paint-brush"></i></div><div><strong>Appearance</strong><p>Switch between Light, Dark, and Dimmed themes. Pro developers always use dark mode!</p></div></div>
        </div>
      `
    },
    {
      icon: "ph-identification-card", label: "STEP 3", color: "#b478ff",
      title: "Set Up a Professional Profile",
      content: `
        <p class="sw-intro">Your GitHub profile is your developer resume. Recruiters look at it. Make it shine.</p>
        <div class="sw-profile-grid">
          <div class="sw-profile-block"><div class="sw-profile-icon"><i class="ph ph-camera"></i></div><div><strong>Profile Photo</strong><p>Upload a real, professional photo. A developer without a photo looks inactive. Same photo as LinkedIn.</p></div></div>
          <div class="sw-profile-block"><div class="sw-profile-icon"><i class="ph ph-pencil-line"></i></div><div><strong>Name & Bio</strong><p>Your name: <strong>${name}</strong>. Bio is 80 chars max. Example: <em>"Full-Stack Dev | Python &amp; React | Building cool things"</em></p></div></div>
          <div class="sw-profile-block"><div class="sw-profile-icon"><i class="ph ph-map-pin"></i></div><div><strong>Location & Website</strong><p>Add your city and a link to your portfolio. These make you findable by recruiters.</p></div></div>
          <div class="sw-profile-block"><div class="sw-profile-icon"><i class="ph ph-squares-four"></i></div><div><strong>Pinned Repositories</strong><p>Pin up to 6 of your best projects to the top. Always keep your best work visible.</p></div></div>
        </div>
        <div class="sw-highlight-box" style="border-color:rgba(180,120,255,0.35);background:rgba(180,120,255,0.05);">
          <div class="sw-highlight-title" style="color:#b478ff;"><i class="ph ph-magic-wand"></i> The Secret Profile README Trick</div>
          <p>Create a repo with the same name as your username and its README becomes your profile homepage banner!</p>
          <div class="sw-sub-steps">
            <div class="sw-sub-step"><span>1</span> Create a new repo named exactly: <code>${username}/${username}</code></div>
            <div class="sw-sub-step"><span>2</span> Check <strong>"Initialize with a README"</strong></div>
            <div class="sw-sub-step"><span>3</span> Edit the README with Markdown — add your skills and links</div>
            <div class="sw-sub-step"><span>4</span> Visit <code>github.com/${username}</code> to see your portfolio page!</div>
          </div>
        </div>
      `
    },
    {
      icon: "ph-folders", label: "STEP 4", color: "#ffb86c",
      title: "What's Inside a GitHub Repository — Every Tab Explained",
      content: `
        <p class="sw-intro">When you open any repository on GitHub, you'll see many tabs. Here is what every single one does.</p>
        <div class="sw-tabs-grid">
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#00ff88;"><i class="ph ph-code"></i></div><strong>Code</strong><p>The main tab. Shows all your files and folders. Click any file to see its contents.</p></div>
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#ff6b6b;"><i class="ph ph-bug"></i></div><strong>Issues</strong><p>A built-in bug tracker and task list. If something is broken or needs adding, open an Issue.</p></div>
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#00cfff;"><i class="ph ph-git-pull-request"></i></div><strong>Pull Requests</strong><p>When someone wants to contribute code, they open a PR. You review, discuss, and merge it. The heart of teamwork.</p></div>
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#b478ff;"><i class="ph ph-lightning"></i></div><strong>Actions</strong><p>Automate tasks! When you push code, Actions can run tests, build your app, or deploy it automatically.</p></div>
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#ffb86c;"><i class="ph ph-kanban"></i></div><strong>Projects</strong><p>A Kanban board built into GitHub. Organize Issues into columns: "To Do", "In Progress", "Done".</p></div>
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#00ff88;"><i class="ph ph-cube"></i></div><strong>Packages</strong><p>Publish your code as a reusable library (npm, Docker) so other developers can install and use your work.</p></div>
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#ff6b6b;"><i class="ph ph-shield"></i></div><strong>Security</strong><p>GitHub scans your code for known vulnerabilities and alerts you when a library you use has a dangerous bug.</p></div>
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#00cfff;"><i class="ph ph-chart-bar"></i></div><strong>Insights</strong><p>See statistics — who contributed, how many lines changed, visitor traffic, and dependency graphs.</p></div>
          <div class="sw-tab-card"><div class="sw-tab-icon" style="color:#b478ff;"><i class="ph ph-gear-six"></i></div><strong>Settings</strong><p>Rename/delete the repo, add collaborators, enable GitHub Pages (free website hosting), and configure branch rules.</p></div>
        </div>
      `
    },
    {
      icon: "ph-git-branch", label: "STEP 5", color: "#00cfff",
      title: "Creating a Repository — Every Option Explained",
      content: `
        <p class="sw-intro">Click the <span class="sw-tag">New</span> button on GitHub. You'll see a form with several options. Here's exactly what to choose and why.</p>
        <div class="sw-option-list">
          <div class="sw-option"><div class="sw-option-label"><i class="ph ph-text-aa"></i> Repository Name</div><div class="sw-option-body"><p>Use lowercase and hyphens. No spaces.<br>✅ Good: <code>my-portfolio</code> &nbsp; ❌ Bad: <code>My Portfolio</code></p></div></div>
          <div class="sw-option"><div class="sw-option-label"><i class="ph ph-article"></i> Description</div><div class="sw-option-body"><p>Always write 1 sentence. E.g., <em>"A personal portfolio website built with HTML and CSS."</em></p></div></div>
          <div class="sw-option"><div class="sw-option-label"><i class="ph ph-eye"></i> Public vs Private</div><div class="sw-option-body">
            <div class="sw-vis-compare">
              <div class="sw-vis-card" style="border-color:rgba(0,255,136,0.3);">
                <strong style="color:#00ff88;">🌍 Public</strong>
                <p>Anyone can see your code. Use for: Portfolio projects, open-source, learning experiments.</p>
              </div>
              <div class="sw-vis-card" style="border-color:rgba(255,107,107,0.3);">
                <strong style="color:#ff6b6b;">🔒 Private</strong>
                <p>Only you and invited collaborators can see it. Use for: Client work, projects with API keys or passwords.</p>
              </div>
            </div>
          </div></div>
          <div class="sw-option sw-option--highlight"><div class="sw-option-label"><i class="ph ph-file-text"></i> Initialize with README</div><div class="sw-option-body"><p><strong>ALWAYS CHECK THIS.</strong> A README is the front page of your project — the first thing visitors see. Without it, your repo looks empty and abandoned.</p></div></div>
          <div class="sw-option"><div class="sw-option-label"><i class="ph ph-prohibit"></i> Add .gitignore</div><div class="sw-option-body"><p>Tells Git which files to completely <strong>ignore</strong> and never upload to GitHub:<br>• <code>node_modules/</code> — thousands of library files<br>• <code>.env</code> — your secret API keys and passwords<br>• <code>dist/</code>, <code>__pycache__/</code> — build output<br><strong>Select your language template</strong> (e.g., "Node" for JavaScript, "Python" for Python).</p></div></div>
          <div class="sw-option"><div class="sw-option-label"><i class="ph ph-scales"></i> Choose a License</div><div class="sw-option-body"><div class="sw-license-grid">
            <div class="sw-license-tag" style="border-color:rgba(0,255,136,0.3);color:#00ff88;">MIT — Most popular. Anyone can use, modify, and sell your code freely.</div>
            <div class="sw-license-tag" style="border-color:rgba(0,207,255,0.3);color:#00cfff;">Apache 2.0 — Like MIT but adds patent protection.</div>
            <div class="sw-license-tag" style="border-color:rgba(255,184,108,0.3);color:#ffb86c;">GPL — If anyone modifies your code, they must open-source theirs too.</div>
            <div class="sw-license-tag" style="border-color:rgba(255,107,107,0.3);color:#ff6b6b;">No License — Others technically cannot use your code legally.</div>
          </div><p style="margin-top:10px;"><strong>Recommendation for beginners:</strong> Choose <strong>MIT License</strong> for all portfolio projects.</p></div></div>
        </div>
      `
    },
    {
      icon: "ph-terminal", label: "STEP 6", color: "#ff6b6b",
      title: os === "windows" ? "Install Git Bash on Windows" : os === "mac" ? "Install Git on macOS" : "Install Git on Linux",
      content: installContent
    },
    {
      icon: "ph-code-block", label: "STEP 7", color: "#00ff88",
      title: "How to Use Git Bash — Your First Commands",
      content: `
        <p class="sw-intro">Git Bash looks intimidating but it's just a text-based way to give instructions to your computer. These 7 commands cover 90% of your daily Git work.</p>
        <div class="sw-terminal-teach">
          <div class="sw-terminal-header"><span class="sw-dot" style="background:#ff5f57;"></span><span class="sw-dot" style="background:#ffbd2e;"></span><span class="sw-dot" style="background:#28ca41;"></span><span class="sw-terminal-title">Git Bash</span></div>
          <div class="sw-terminal-body">
            <div class="sw-cmd-explain"><div class="sw-cmd-line"><span class="sw-prompt">$</span><code>git config --global user.name "${name}"</code></div><div class="sw-cmd-desc">📌 Tell Git your full name. This appears on every commit you make.</div></div>
            <div class="sw-cmd-explain"><div class="sw-cmd-line"><span class="sw-prompt">$</span><code>git config --global user.email "${email}"</code></div><div class="sw-cmd-desc">📌 Tell Git your email. Must match your GitHub email so contributions are counted.</div></div>
            <div class="sw-cmd-explain"><div class="sw-cmd-line"><span class="sw-prompt">$</span><code>git --version</code></div><div class="sw-cmd-desc">✅ Verify Git is installed. You should see something like <code>git version 2.44.0</code></div></div>
            <div class="sw-cmd-explain"><div class="sw-cmd-line"><span class="sw-prompt">$</span><code>git clone https://github.com/${username}/your-repo.git</code></div><div class="sw-cmd-desc">⬇️ Download a repo from GitHub onto your computer to work on it.</div></div>
            <div class="sw-cmd-explain"><div class="sw-cmd-line"><span class="sw-prompt">$</span><code>git status</code></div><div class="sw-cmd-desc">🔍 Check what files you've changed. Run this constantly — it's your best friend.</div></div>
            <div class="sw-cmd-explain"><div class="sw-cmd-line"><span class="sw-prompt">$</span><code>git add .</code></div><div class="sw-cmd-desc">📦 Stage all changes, telling Git "include ALL these in my next save."</div></div>
            <div class="sw-cmd-explain"><div class="sw-cmd-line"><span class="sw-prompt">$</span><code>git commit -m "Add my first file"</code></div><div class="sw-cmd-desc">💾 Save a snapshot with a descriptive message. Like pressing Save in a game.</div></div>
            <div class="sw-cmd-explain"><div class="sw-cmd-line"><span class="sw-prompt">$</span><code>git push origin main</code></div><div class="sw-cmd-desc">🚀 Upload your saved changes to GitHub so the world can see them!</div></div>
          </div>
        </div>
        <div class="sw-tip"><i class="ph ph-trophy"></i> <strong>You're now a Git &amp; GitHub developer, ${name}!</strong> The learning curve is real, but these commands are the foundation of everything.</div>
      `
    }
  ];

  steps.forEach((step) => {
    const card = document.createElement("div");
    card.className = "sw-guide-card";
    card.style.setProperty("--sw-color", step.color);
    card.innerHTML = `
      <div class="sw-card-header">
        <div class="sw-card-icon"><i class="ph ${step.icon}"></i></div>
        <div class="sw-card-meta">
          <div class="sw-card-label">${step.label}</div>
          <div class="sw-card-title">${step.title}</div>
        </div>
        <div class="sw-card-check" title="Mark as done"><i class="ph ph-check-circle"></i></div>
      </div>
      <div class="sw-card-body">${step.content}</div>
    `;
    card.querySelector(".sw-card-check").addEventListener("click", () => {
      card.classList.toggle("done");
    });
    card.querySelectorAll(".copy-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        copyText(decodeURIComponent(this.dataset.cmd), this);
      });
    });
    container.appendChild(card);
  });
}
