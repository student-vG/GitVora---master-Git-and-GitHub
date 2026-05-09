const fs = require('fs');
const path = require('path');

const iconMap = {
  '🚀': '<i class="ph ph-rocket"></i>',
  '⬇️': '<i class="ph ph-download-simple"></i>',
  '🔄': '<i class="ph ph-arrows-clockwise"></i>',
  '🧠': '<i class="ph ph-brain"></i>',
  '🛰️': '<i class="ph ph-planet"></i>',
  '📘': '<i class="ph ph-book-open-text"></i>',
  '🔧': '<i class="ph ph-wrench"></i>',
  '📚': '<i class="ph ph-books"></i>',
  '🤖': '<i class="ph ph-robot"></i>',
  '☀️': '<i class="ph ph-sun"></i>',
  '🌙': '<i class="ph ph-moon"></i>',
  '⌨️': '<i class="ph ph-keyboard"></i>',
  '💡': '<i class="ph ph-lightbulb"></i>',
  '⚠️': '<i class="ph ph-warning"></i>',
  '✨': '<i class="ph ph-sparkle"></i>',
  '🌿': '<i class="ph ph-git-branch"></i>',
  '🔀': '<i class="ph ph-git-merge"></i>',
  '🛟': '<i class="ph ph-lifebuoy"></i>',
  '↩️': '<i class="ph ph-arrow-u-up-left"></i>',
  '📋': '<i class="ph ph-clipboard"></i>',
  '👋': '<i class="ph ph-hand-waving"></i>',
  '😭': '<i class="ph ph-smiley-sad"></i>',
  '🤯': '<i class="ph ph-confounded"></i>',
  '💀': '<i class="ph ph-skull"></i>',
  '🎯': '<i class="ph ph-target"></i>'
};

const dir = 'c:\\Users\\vikra\\Downloads\\giteasy\\GitVora---master-Git-and-GitHub';

function processFile(filename) {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [emoji, icon] of Object.entries(iconMap)) {
    content = content.split(emoji).join(icon);
  }
  
  // Specific JS replacements for innerHTML
  if (filename === 'js/app.js') {
    content = content.replace('themeToggleApp.textContent = isLight', 'themeToggleApp.innerHTML = isLight');
    content = content.replace('topbarTitle.textContent = panelTitles[name] || "GitVora";', 'topbarTitle.innerHTML = panelTitles[name] || "GitVora";');
  }
  
  if (filename === 'js/landing.js') {
    content = content.replace('themeToggleLanding.textContent = isLight', 'themeToggleLanding.innerHTML = isLight');
    content = content.replace('themeToggleLandingMobile.textContent = isLight', 'themeToggleLandingMobile.innerHTML = isLight');
  }

  // Inject phosphor script into HEAD
  if (filename.endsWith('.html')) {
    if (!content.includes('unpkg.com/@phosphor-icons/web')) {
      content = content.replace('</head>', '    <script src="https://unpkg.com/@phosphor-icons/web"></script>\n  </head>');
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

['app.html', 'index.html', 'js/app.js', 'js/landing.js', 'service-worker.js'].forEach(processFile);

// Additionally update service-worker.js to cache the phosphor script
let swPath = path.join(dir, 'service-worker.js');
let swContent = fs.readFileSync(swPath, 'utf8');
if (!swContent.includes('https://unpkg.com/@phosphor-icons/web')) {
  swContent = swContent.replace('"/img/logo.svg",', '"/img/logo.svg",\n  "https://unpkg.com/@phosphor-icons/web",');
  fs.writeFileSync(swPath, swContent, 'utf8');
}
