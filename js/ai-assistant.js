// ============================================================
// AI ASSISTANT — Advanced Local Expert System
// ============================================================

(function initAIAssistant() {
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!chatMessages || !chatInput || !sendBtn) return;

  // Make sendQuickPrompt global so HTML buttons can use it
  window.sendQuickPrompt = function(text) {
    chatInput.value = text;
    handleSend();
  };

  // Auto-resize textarea
  chatInput.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
  });

  // Handle Enter (send) and Shift+Enter (new line)
  chatInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener("click", handleSend);

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Add user message
    appendMessage("user", text);
    
    // Reset input
    chatInput.value = "";
    chatInput.style.height = "auto";

    // 2. Show typing indicator
    const typingId = showTypingIndicator();

    // 3. Process response with a slight delay for realism
    setTimeout(() => {
      removeTypingIndicator(typingId);
      const response = processAIResponse(text);
      appendMessage("ai", response);
    }, 800 + Math.random() * 800); // 0.8s to 1.6s delay
  }

  function appendMessage(sender, htmlContent) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender}`;
    
    if (sender === "ai") {
      msgDiv.innerHTML = `
        <div class="msg-avatar">⬡</div>
        <div class="msg-content">
          <div class="msg-name">GitVora AI</div>
          <div class="msg-text">${htmlContent}</div>
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="msg-content">
          <div class="msg-text">${escapeHtml(htmlContent)}</div>
        </div>
      `;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const id = "typing-" + Date.now();
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-msg ai";
    msgDiv.id = id;
    msgDiv.innerHTML = `
      <div class="msg-avatar">⬡</div>
      <div class="msg-content">
        <div class="msg-name">GitVora AI</div>
        <div class="msg-text">
          <div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>
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

  function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/\n/g, "<br>");
  }

  // --- KNOWLEDGE BASE ---
  function processAIResponse(input) {
    const lower = input.toLowerCase();

    // MATCH: Push for the first time
    if (lower.includes("first time") || (lower.includes("push") && lower.includes("first"))) {
      return `To push a brand new project to GitHub for the first time, follow these exact steps:
        <br><br>
        1. Initialize Git in your folder:<br>
        <code>git init</code><br><br>
        2. Stage and commit all your files:<br>
        <code>git add .</code><br>
        <code>git commit -m "Initial commit"</code><br><br>
        3. Connect to your empty GitHub repository (replace URL):<br>
        <code>git remote add origin https://github.com/your-username/your-repo.git</code><br><br>
        4. Rename your branch to main (modern standard):<br>
        <code>git branch -M main</code><br><br>
        5. Push the code and link the branches:<br>
        <code>git push -u origin main</code>`;
    }

    // MATCH: Daily update flow
    if (lower.includes("daily") || (lower.includes("pull") && lower.includes("push"))) {
      return `The golden rule for daily work is <strong>always pull before you push</strong>. Here is the safest daily flow:
        <br><br>
        1. Stage your changes:<br>
        <code>git add .</code><br><br>
        2. Commit your work:<br>
        <code>git commit -m "feat: added new header"</code><br><br>
        3. <strong>Safely pull latest remote changes:</strong><br>
        <code>git pull --rebase origin main</code><br>
        <em>(Rebase puts your new commits neatly on top of the remote changes, avoiding messy merge commits)</em><br><br>
        4. Now it's safe to push:<br>
        <code>git push</code>`;
    }

    // MATCH: Pull rebase
    if (lower.includes("pull --rebase") || lower.includes("rebase")) {
      return `<code>git pull --rebase</code> is the professional way to sync your local code with GitHub.
        <br><br>
        <strong>What normal git pull does:</strong><br>
        It downloads remote changes and creates a "Merge commit" to stitch your local work and remote work together. This makes history messy.
        <br><br>
        <strong>What git pull --rebase does:</strong><br>
        1. It temporarily "lifts" your local commits.<br>
        2. It downloads the remote commits and puts them down.<br>
        3. It replays your local commits on top of them.<br>
        Result: A perfectly straight, linear history!`;
    }

    // MATCH: Undo commit
    if (lower.includes("undo") && lower.includes("commit")) {
      return `You can undo the last commit easily. Which scenario matches yours?
        <br><br>
        <strong>Option A: Keep your code changes, just undo the commit record</strong><br>
        <code>git reset --soft HEAD~1</code><br>
        <em>(Your files stay exactly as they are, they just go back to being 'staged'.)</em>
        <br><br>
        <strong>Option B: Keep code changes, but un-stage everything</strong><br>
        <code>git reset --mixed HEAD~1</code><br>
        <br>
        <strong>Option C: DANGER! Delete the commit AND throw away all the code changes completely</strong><br>
        <code>git reset --hard HEAD~1</code>`;
    }

    // MATCH: Merge conflict
    if (lower.includes("conflict")) {
      return `Don't panic! A merge conflict just means Git doesn't know which version of a line of code to keep.
        <br><br>
        <strong>1. Find the conflicts</strong><br>
        Run <code>git status</code>. Conflicted files will be marked as "both modified".
        <br><br>
        <strong>2. Open the file in your editor (like VS Code)</strong><br>
        Look for these markers:<br>
        <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (Current Change)</code><br>
        <code>Your code here</code><br>
        <code>=======</code><br>
        <code>Incoming code here</code><br>
        <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; branch-name (Incoming Change)</code>
        <br><br>
        <strong>3. Resolve it</strong><br>
        Delete the markers and keep the code you want. Save the file.
        <br><br>
        <strong>4. Finish the merge/rebase</strong><br>
        <code>git add .</code><br>
        <code>git commit -m "fix: resolve merge conflicts"</code> (or <code>git rebase --continue</code>)`;
    }

    // MATCH: Error - failed to push some refs
    if (lower.includes("failed to push some refs") || lower.includes("updates were rejected")) {
      return `🚨 <strong>Push Rejected!</strong>
        <br><br>
        <strong>Why this happened:</strong><br>
        Someone else (or you, from another computer) pushed new commits to GitHub. GitHub is rejecting your push because if it accepted it, it would overwrite those new remote changes.
        <br><br>
        <strong>How to fix it:</strong><br>
        You need to download their changes first.<br>
        Run: <code>git pull --rebase origin main</code>
        <br><br>
        Once that finishes (and you resolve any conflicts if they appear), run:<br>
        <code>git push</code>`;
    }

    // MATCH: .gitignore
    if (lower.includes("gitignore")) {
      return `<code>.gitignore</code> is a hidden text file that tells Git which files or folders it should <strong>completely ignore</strong> and never track or upload to GitHub.
        <br><br>
        <strong>Common things to ignore:</strong><br>
        • <code>node_modules/</code> (Downloaded dependencies)<br>
        • <code>.env</code> (Secret API keys and passwords. <strong>NEVER commit this!</strong>)<br>
        • <code>.DS_Store</code> (Mac system files)<br>
        • <code>dist/</code> or <code>build/</code> (Compiled output)
        <br><br>
        <strong>How to use it:</strong> Just create a file named <code>.gitignore</code> in your project root and type the folder names inside it.`;
    }

    // MATCH: Who built Git
    if (lower.includes("who built git") || lower.includes("who created git")) {
      return `Git was created by <strong>Linus Torvalds</strong> (the same person who created Linux) in 2005.
        <br><br>
        <strong>Why?</strong><br>
        The Linux kernel team was using a proprietary version control system called BitKeeper. When the relationship broke down and they lost their free license, Linus locked himself away and wrote the first version of Git in just a few weeks.
        <br><br>
        He designed it to be blazingly fast, fully distributed (no central server required), and capable of handling massive projects like Linux.`;
    }
    
    // MATCH: Stash
    if (lower.includes("stash")) {
      return `<code>git stash</code> is a magic shelf for your code.
        <br><br>
        Imagine you are halfway through coding a feature, and suddenly your boss says "Fix this bug on the main branch right now!" You aren't ready to commit your messy code yet.
        <br><br>
        1. Put your messy code on the shelf:<br>
        <code>git stash</code>
        <br><br>
        2. Switch branches, fix the bug, and come back.
        <br><br>
        3. Take your messy code off the shelf and continue working:<br>
        <code>git stash pop</code>`;
    }

    // Default Fallback
    return `I'm a localized Git expert! I can help you with:
      <br><br>
      • <strong>Workflow questions:</strong> "How do I start?" or "Daily update flow"<br>
      • <strong>Fixing errors:</strong> Paste your Git error here!<br>
      • <strong>Commands explained:</strong> "What does git rebase do?"<br>
      • <strong>Fixing mistakes:</strong> "How do I undo a commit?"
      <br><br>
      Try asking me one of those, or click a quick prompt above.`;
  }
})();
