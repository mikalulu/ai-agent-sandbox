(function () {
  const ICON_SPRITE = `
<svg id="site-icon-sprite" aria-hidden="true" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-spark" viewBox="0 0 24 24">
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3"/>
  </symbol>
  <symbol id="icon-flower" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1.8"/>
    <circle cx="12" cy="6" r="2.5"/>
    <circle cx="18" cy="12" r="2.5"/>
    <circle cx="12" cy="18" r="2.5"/>
    <circle cx="6" cy="12" r="2.5"/>
  </symbol>
  <symbol id="icon-robot" viewBox="0 0 24 24">
    <path d="M12 4V2"/>
    <rect x="5" y="6" width="14" height="11" rx="4"/>
    <path d="M8 17v3M16 17v3M3.5 10.5h1.5M19 10.5h1.5"/>
    <circle cx="9.5" cy="11" r="1"/>
    <circle cx="14.5" cy="11" r="1"/>
    <path d="M9 14.5h6"/>
  </symbol>
  <symbol id="icon-brain" viewBox="0 0 24 24">
    <path d="M9 7a3 3 0 0 0-3 3v.2A3.8 3.8 0 0 0 8.5 18H11V7.6A2.8 2.8 0 0 0 9 7Z"/>
    <path d="M15 7a3 3 0 0 1 3 3v.2A3.8 3.8 0 0 1 15.5 18H13V7.6A2.8 2.8 0 0 1 15 7Z"/>
    <path d="M11 10H9.2M11 14H8.8M13 10h1.8M13 14h2.2M12 7v10"/>
  </symbol>
  <symbol id="icon-shield" viewBox="0 0 24 24">
    <path d="M12 3 5 6v5c0 4.4 2.8 7.8 7 10 4.2-2.2 7-5.6 7-10V6l-7-3Z"/>
  </symbol>
  <symbol id="icon-lock" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="3"/>
    <path d="M8 11V8a4 4 0 1 1 8 0v3"/>
  </symbol>
  <symbol id="icon-key" viewBox="0 0 24 24">
    <circle cx="8" cy="12" r="3.5"/>
    <path d="M11.5 12H20M17 12v3M15 12v2"/>
  </symbol>
  <symbol id="icon-tool" viewBox="0 0 24 24">
    <path d="M14.8 5.2a4.5 4.5 0 0 0-5.6 5.6L4 16l4 4 5.2-5.2a4.5 4.5 0 0 0 5.6-5.6l-2.5 2.3-2.8-.3-.3-2.8 2.3-2.5Z"/>
  </symbol>
  <symbol id="icon-tools" viewBox="0 0 24 24">
    <path d="M4 20 11 13"/>
    <path d="M10 5a3 3 0 0 0 4.2 4.2L20 15l-3 3-5.8-5.8A3 3 0 0 0 10 5Z"/>
    <path d="m4 14 3 3"/>
  </symbol>
  <symbol id="icon-layer" viewBox="0 0 24 24">
    <path d="m12 4 8 4-8 4-8-4 8-4Z"/>
    <path d="m4 12 8 4 8-4"/>
    <path d="m4 16 8 4 8-4"/>
  </symbol>
  <symbol id="icon-linux" viewBox="0 0 24 24">
    <path d="M8 9c0-3.2 1.7-5 4-5s4 1.8 4 5v5c0 3-1.8 5-4 5s-4-2-4-5V9Z"/>
    <circle cx="10" cy="10.3" r=".8"/>
    <circle cx="14" cy="10.3" r=".8"/>
    <path d="M9.5 13.8h5M8 17l-2.5 2.2M16 17l2.5 2.2"/>
  </symbol>
  <symbol id="icon-leaf" viewBox="0 0 24 24">
    <path d="M19 5c-7 0-11 4.2-11 10 0 2.5 1.6 4 4 4 6 0 10-4 10-11 0-1-.3-2-.9-3Z"/>
    <path d="M8 16c2-2 4.8-4 8.4-5.8"/>
  </symbol>
  <symbol id="icon-apple" viewBox="0 0 24 24">
    <path d="M13.3 5.7c-1-.9-1.4-2-1.5-3.2 1.5.1 2.7.6 3.4 1.6"/>
    <path d="M8.5 9.5c1.1-1.5 2.6-2.3 4.4-2.3 1.4 0 2.5.4 3.4 1.2 1 .9 1.6 2 1.7 3.4.1 1.3-.1 2.6-.7 3.9-1 2.1-2.3 3.1-3.9 3.1-.8 0-1.5-.2-2.1-.6-.6.4-1.3.6-2.1.6-1.6 0-2.9-1-3.8-3.1-.6-1.3-.8-2.6-.7-3.9.1-.9.5-1.7 1.2-2.3"/>
  </symbol>
  <symbol id="icon-windows" viewBox="0 0 24 24">
    <path d="M4 5.5 11 4v7H4V5.5ZM13 4l7-1v8h-7V4ZM4 13h7v7l-7-1.5V13ZM13 13h7v8l-7-1V13Z"/>
  </symbol>
  <symbol id="icon-window" viewBox="0 0 24 24">
    <rect x="4" y="5" width="16" height="14" rx="2"/>
    <path d="M4 9h16M12 9v10"/>
  </symbol>
  <symbol id="icon-wave" viewBox="0 0 24 24">
    <path d="M3 14c2.2 0 2.8-4 5-4s2.8 4 5 4 2.8-4 5-4 2.8 4 3 4"/>
  </symbol>
  <symbol id="icon-wind" viewBox="0 0 24 24">
    <path d="M4 9h11a2.5 2.5 0 1 0-2.3-3.4"/>
    <path d="M4 14h15a2.5 2.5 0 1 1-2.3 3.4"/>
  </symbol>
  <symbol id="icon-search" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="5.5"/>
    <path d="m16 16 4.5 4.5"/>
  </symbol>
  <symbol id="icon-eye" viewBox="0 0 24 24">
    <path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z"/>
    <circle cx="12" cy="12" r="2.5"/>
  </symbol>
  <symbol id="icon-shell" viewBox="0 0 24 24">
    <path d="M12 19c4.4 0 8-3 8-7s-3.6-7-8-7-8 3-8 7c0 3.1 2.1 5.8 5.2 6.7"/>
    <path d="M12 8a4 4 0 1 1 0 8 2 2 0 1 1 0-4 1 1 0 1 1 0 2"/>
  </symbol>
  <symbol id="icon-trail" viewBox="0 0 24 24">
    <circle cx="7" cy="7" r="1.6"/>
    <circle cx="11.5" cy="5.5" r="1.4"/>
    <circle cx="15.5" cy="7.2" r="1.5"/>
    <circle cx="17.5" cy="11.3" r="1.4"/>
    <path d="M8 15.2c0-2.4 2-4.2 4.4-4.2 2.5 0 4.6 1.8 4.6 4.2 0 2.1-1.9 3.8-4.6 3.8-2.6 0-4.4-1.7-4.4-3.8Z"/>
  </symbol>
  <symbol id="icon-idea" viewBox="0 0 24 24">
    <path d="M8 14a6 6 0 1 1 8 0c-.9.8-1.5 1.8-1.7 3H9.7c-.2-1.2-.8-2.2-1.7-3Z"/>
    <path d="M10 20h4M9.5 17h5"/>
  </symbol>
  <symbol id="icon-info" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8"/>
    <path d="M12 10v5M12 7.2h.01"/>
  </symbol>
  <symbol id="icon-warning" viewBox="0 0 24 24">
    <path d="M12 4 3.5 19h17L12 4Z"/>
    <path d="M12 9v4.5M12 17h.01"/>
  </symbol>
  <symbol id="icon-check" viewBox="0 0 24 24">
    <path d="m5 12.5 4.2 4.2L19 7"/>
  </symbol>
  <symbol id="icon-xmark" viewBox="0 0 24 24">
    <path d="m6 6 12 12M18 6 6 18"/>
  </symbol>
  <symbol id="icon-partial" viewBox="0 0 24 24">
    <path d="M5 12h14"/>
  </symbol>
  <symbol id="icon-clipboard" viewBox="0 0 24 24">
    <rect x="6" y="5" width="12" height="16" rx="2"/>
    <path d="M9 5.5h6M10 3h4a1.5 1.5 0 0 1 1.5 1.5V6h-7V4.5A1.5 1.5 0 0 1 10 3Z"/>
    <path d="M9.5 11h5M9.5 15h5"/>
  </symbol>
  <symbol id="icon-rocket" viewBox="0 0 24 24">
    <path d="M13 4c4.5 1 6.2 4.5 6.8 8-2 .3-4 .8-5.7 2.5L9.5 19H5v-4.5l4.5-4.6C11.2 8.2 11.7 6.2 12 4Z"/>
    <path d="M14.5 9.5h.01M8 16l-2 5 5-2"/>
  </symbol>
  <symbol id="icon-box" viewBox="0 0 24 24">
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/>
    <path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>
  </symbol>
  <symbol id="icon-wand" viewBox="0 0 24 24">
    <path d="m5 19 8.5-8.5"/>
    <path d="M14 4v3M12.5 5.5h3M18 7l1.2 2.3L21.5 10l-2.3 1-.8 2.3-1-2.3-2.3-1 2.3-.7L18 7ZM9 16l-4 4"/>
  </symbol>
  <symbol id="icon-sync" viewBox="0 0 24 24">
    <path d="M19 8a7 7 0 0 0-12-2L5 8M5 16a7 7 0 0 0 12 2l2-2"/>
    <path d="M5 8h4M15 16h4"/>
  </symbol>
  <symbol id="icon-plug" viewBox="0 0 24 24">
    <path d="M9 4v5M15 4v5M7 9h10v2a5 5 0 0 1-5 5 5 5 0 0 1-5-5V9ZM12 16v4"/>
  </symbol>
  <symbol id="icon-monitor" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="12" rx="2"/>
    <path d="M8 21h8M12 17v4"/>
  </symbol>
  <symbol id="icon-folder" viewBox="0 0 24 24">
    <path d="M3 8a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"/>
  </symbol>
  <symbol id="icon-book" viewBox="0 0 24 24">
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H12v15H6.5A2.5 2.5 0 0 0 4 21V6.5ZM20 6.5A2.5 2.5 0 0 0 17.5 4H12v15h5.5A2.5 2.5 0 0 1 20 21V6.5Z"/>
  </symbol>
  <symbol id="icon-note" viewBox="0 0 24 24">
    <path d="M7 4h10a2 2 0 0 1 2 2v12l-4 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>
    <path d="M9 9h6M9 13h6M9 17h4"/>
  </symbol>
  <symbol id="icon-chart" viewBox="0 0 24 24">
    <path d="M5 19V9M12 19V5M19 19v-7M4 19h16"/>
  </symbol>
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="m4 11 8-6 8 6"/>
    <path d="M6 10.5V20h12v-9.5"/>
  </symbol>
  <symbol id="icon-bird" viewBox="0 0 24 24">
    <path d="M5 15c2.4-5.4 6.4-8 12-8-1 2.8-1.6 4.9-1.6 6.2 0 3.2-2.3 5.8-5.3 5.8A5 5 0 0 1 5 15Z"/>
    <path d="M11 11c1.4-.4 2.8-.4 4.2 0"/>
  </symbol>
  <symbol id="icon-chat" viewBox="0 0 24 24">
    <path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-5 4v-4H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/>
  </symbol>
  <symbol id="icon-globe" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8"/>
    <path d="M4.5 9h15M4.5 15h15M12 4c2 2.2 3 5 3 8s-1 5.8-3 8c-2-2.2-3-5-3-8s1-5.8 3-8Z"/>
  </symbol>
  <symbol id="icon-user" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="3.2"/>
    <path d="M5 19a7 7 0 0 1 14 0"/>
  </symbol>
  <symbol id="icon-crown" viewBox="0 0 24 24">
    <path d="m4 9 4 4 4-6 4 6 4-4-2 10H6L4 9Z"/>
  </symbol>
  <symbol id="icon-flame" viewBox="0 0 24 24">
    <path d="M12 4c1.8 2 2.8 3.8 2.8 5.5 0 1.6-.8 2.9-2.3 4-.4-1.5-1.1-2.8-2.1-4-1.8 1.6-2.7 3.5-2.7 5.7A5.3 5.3 0 0 0 13 20a5.5 5.5 0 0 0 5.5-5.5C18.5 10.5 16.4 7.1 12 4Z"/>
  </symbol>
  <symbol id="icon-barrier" viewBox="0 0 24 24">
    <path d="M4 15h16M7 15V9h10v6M7 11h10M9 9l2 2M13 9l2 2"/>
  </symbol>
  <symbol id="icon-droplet" viewBox="0 0 24 24">
    <path d="M12 4c3.5 4 5.2 6.8 5.2 8.6A5.2 5.2 0 1 1 6.8 12.6C6.8 10.8 8.5 8 12 4Z"/>
  </symbol>
  <symbol id="icon-target" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="7.5"/>
    <circle cx="12" cy="12" r="3.5"/>
    <path d="M12 4v2M20 12h-2M12 20v-2M4 12h2"/>
  </symbol>
  <symbol id="icon-tag" viewBox="0 0 24 24">
    <path d="M11 5H5v6l7.5 7.5a2 2 0 0 0 2.8 0l3.2-3.2a2 2 0 0 0 0-2.8L11 5Z"/>
    <circle cx="8" cy="8" r="1"/>
  </symbol>
  <symbol id="icon-orb" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"/>
    <path d="M4 12c2.5-3.2 5.2-4.8 8-4.8S17.5 8.8 20 12c-2.5 3.2-5.2 4.8-8 4.8S6.5 15.2 4 12Z"/>
  </symbol>
</svg>`;

  const EMOJI_ICON_MAP = {
    '⚠️': 'warning',
    'ℹ': 'info',
    '🙅‍♀️': 'warning',
    '🙆‍♀️': 'check',
    '🙋‍♀️': 'chat',
    '🛡️': 'shield',
    '🛠️': 'tools',
    '🖥️': 'monitor',
    '👁️': 'eye',
    '🗣️': 'chat',
    '⚙️': 'tools',
    '🏷️': 'tag',
    '✂️': 'tools',
    '♻️': 'sync',
    '👮‍♀️': 'shield',
    '✿': 'spark',
    '❀': 'flower',
    '✦': 'spark',
    '❋': 'flower',
    '✨': 'spark',
    '🤖': 'robot',
    '🧠': 'brain',
    '🛡': 'shield',
    '🔒': 'lock',
    '🔐': 'lock',
    '🔑': 'key',
    '🔧': 'tool',
    '🛠': 'tools',
    '⚙': 'tools',
    '🔨': 'tools',
    '🧱': 'layer',
    '🧅': 'layer',
    '🐧': 'linux',
    '🌿': 'leaf',
    '🍎': 'apple',
    '🔮': 'orb',
    '⊞': 'windows',
    '🪟': 'window',
    '🌊': 'wave',
    '💨': 'wind',
    '🌀': 'wind',
    '🔍': 'search',
    '👀': 'eye',
    '👁': 'eye',
    '🌸': 'flower',
    '🌻': 'flower',
    '🐚': 'shell',
    '🐾': 'trail',
    '💡': 'idea',
    '⚠': 'warning',
    '✅': 'check',
    '☑': 'check',
    '☐': 'check',
    '✓': 'check',
    '❌': 'xmark',
    '✗': 'xmark',
    '〰️': 'partial',
    '〰': 'partial',
    '➖': 'partial',
    '📋': 'clipboard',
    '🚀': 'rocket',
    '📦': 'box',
    '🎁': 'box',
    '🐳': 'box',
    '💾': 'folder',
    '🪄': 'wand',
    '🔄': 'sync',
    '🔁': 'sync',
    '🔌': 'plug',
    '💻': 'monitor',
    '🖥': 'monitor',
    '📺': 'monitor',
    '📁': 'folder',
    '📖': 'book',
    '📘': 'book',
    '📚': 'book',
    '📝': 'note',
    '📎': 'note',
    '📊': 'chart',
    '🏠': 'home',
    '🏰': 'home',
    '🦆': 'bird',
    '🦋': 'bird',
    '💬': 'chat',
    '🗣': 'chat',
    '🌐': 'globe',
    '🌎': 'globe',
    '👤': 'user',
    '👑': 'crown',
    '🔥': 'flame',
    '💥': 'flame',
    '🚧': 'barrier',
    '🚪': 'barrier',
    '🚫': 'warning',
    '🙅': 'warning',
    '🙆': 'check',
    '💦': 'droplet',
    '🚰': 'droplet',
    '🎯': 'target',
    '🎈': 'spark',
    '♪': 'spark',
    '🤫': 'spark',
    '🤔': 'idea',
    '♻': 'sync',
    '👻': 'spark',
    '👽': 'spark',
    '🦙': 'leaf',
    '👮': 'shield',
    '🏷': 'tag',
    '✂': 'tools',
    '💪': 'spark',
    '🐢': 'trail',
    '💳': 'tag',
    '🍺': 'box',
    '🏗️': 'layer',
    '🏗': 'layer',
    '🎮': 'target',
    '🦭': 'bird',
    '🙋': 'chat',
    '💸': 'tag',
  };

  const SVG_TEXT_REPLACEMENTS = [
    ['⚠️', '注意'],
    ['⚠', '注意'],
    ['✿', ''],
    ['🤖 ', ''],
    ['🧠 ', ''],
    ['🚀 ', ''],
    ['🔧 ', ''],
    ['✨ ', ''],
    ['🛠️ ', ''],
    ['🛠 ', ''],
    ['🪄 ', ''],
    ['💨 ', ''],
    ['🦆 ', ''],
    ['🔄 ', ''],
    ['🔌 ', ''],
    ['🐧 ', ''],
    ['🍎 ', ''],
    ['⊞ ', ''],
    ['🌸 ', ''],
    ['🐚 ', ''],
    ['📦 ', ''],
    ['📋 ', ''],
    ['🏗️ ', ''],
    ['🏗 ', ''],
  ];

  const quickStartState = new Set();
  const quickStartButtonClasses = {
    linux: 'active-linux',
    mac: 'active-mac',
    win: 'active-win',
  };

  const quickStartCards = {
    linux: `<strong>🐧 Linux + NVIDIA GPU — 最も高い隔離性能の構成</strong><br>
Podman + Xephyr で画面・ファイルを分離し、GPU は CDI でパススルーします。<br>
<strong>難易度:</strong> <span style="color:var(--peach2)">★★★ 中〜高</span> — Xephyr と CDI の設定が主な作業です<br>
<strong>推奨環境:</strong> Ubuntu 22.04+ / NVIDIA GPU / RAM 16GB+ / ディスク 80GB+<br>
→ <a href="./linux.html" style="color:var(--mint2)">Linux セットアップガイドへ</a>`,
    mac: `<strong>🍎 Apple Silicon Mac — VM ベースの隔離構成</strong><br>
Lima VM 内でエージェントを実行し、Ollama はホスト側の Metal で推論します。<br>
<strong>難易度:</strong> <span style="color:var(--mint2)">★☆☆ 低</span> — Homebrew で導入でき、手順が少ない構成です<br>
<strong>推奨環境:</strong> macOS 13+ / M1〜M4 / Unified Memory 16GB+ / ディスク 100GB+<br>
→ <a href="./mac.html" style="color:var(--lav2)">macOS セットアップガイドへ</a>`,
    win: `<strong>⊞ Windows 11 — WSL2 ベースの隔離構成</strong><br>
WSL2 上で Podman を動かし、GUI 表示は WSLg が処理します。<br>
<strong>難易度:</strong> <span style="color:var(--sky2)">★★☆ 中</span> — WSL2 の有効化とドライバー更新が主な作業です<br>
<strong>推奨環境:</strong> Windows 11 22H2+ / NVIDIA GPU / RAM 16GB+ / ディスク 80GB+<br>
→ <a href="./windows.html" style="color:var(--sky2)">Windows セットアップガイドへ</a>`,
  };

  const quickStartMixes = {
    'linux+mac': `<strong>🐧✕🍎 デュアル構成 — 隔離と推論速度の両立</strong><br><br>
<span style="color:var(--mint2)">🐧 Linux</span> → エージェントの本番実行環境<br>
<span style="color:var(--lav2)">🍎 Mac</span> → Ollama Metal によるローカル LLM サーバー<br><br>
Linux 側から <code>OLLAMA_HOST</code> で Mac の Ollama に接続すると、Metal の推論性能を活用できます。<br><br>
→ <a href="./linux.html" style="color:var(--mint2)">Linux から始める</a>　→ <a href="./mac.html" style="color:var(--lav2)">macOS も整える</a>`,
    'linux+win': `<strong>🐧✕⊞ デュアル構成 — Linux メイン、Windows 補助</strong><br><br>
<span style="color:var(--mint2)">🐧 Linux</span> → 高い隔離性のメイン実行環境<br>
<span style="color:var(--sky2)">⊞ Windows</span> → Windows 専用ツールの検証や WSL2 補助環境<br><br>
エージェントは Linux で実行し、Windows で互換性確認を行う構成が効率的です。<br><br>
→ <a href="./linux.html" style="color:var(--mint2)">Linux から始める</a>　→ <a href="./windows.html" style="color:var(--sky2)">Windows も整える</a>`,
    'mac+win': `<strong>🍎✕⊞ デュアル構成 — Mac で推論、Windows で実行</strong><br><br>
<span style="color:var(--lav2)">🍎 Mac</span> → Ollama Metal による推論と設計作業<br>
<span style="color:var(--sky2)">⊞ Windows</span> → WSL2 + Podman でのエージェント実行<br><br>
Windows 側から Mac の Ollama に接続すると、Apple Silicon の推論性能を共有できます。<br><br>
→ <a href="./mac.html" style="color:var(--lav2)">Mac から始める</a>　→ <a href="./windows.html" style="color:var(--sky2)">Windows も整える</a>`,
    'linux+mac+win': `<strong>🐧✕🍎✕⊞ フル構成 — 用途別に役割を分担</strong><br><br>
<span style="color:var(--mint2)">🐧 Linux</span> → エージェント本番実行<br>
<span style="color:var(--lav2)">🍎 Mac</span> → ローカル LLM サーバー<br>
<span style="color:var(--sky2)">⊞ Windows</span> → GUI 確認や Windows 専用ツール検証<br><br>
各マシンの得意分野で役割分担することで、効率的に運用できます。<br><br>
→ <a href="./linux.html" style="color:var(--mint2)">Linux</a>　→ <a href="./mac.html" style="color:var(--lav2)">macOS</a>　→ <a href="./windows.html" style="color:var(--sky2)">Windows</a>`,
  };

  const quickStartStyles = {
    linux: 'background:#f4fafe;border-color:var(--mint)',
    mac: 'background:#f6f9fd;border-color:var(--lav)',
    win: 'background:#eef7ff;border-color:var(--sky)',
    'linux+mac': 'background:#f3f8fd;border-color:var(--mint)',
    'linux+win': 'background:#eff6fd;border-color:var(--sky)',
    'mac+win': 'background:#f4f8fd;border-color:var(--lav)',
    'linux+mac+win': 'background:#f5f9fe;border-color:var(--peach)',
  };

  const envLegend = { 4: '◎', 3: '○', 2: '△', 1: '✗', 0: '—' };
  const envClass = { 4: 's4', 3: 's3', 2: 's2', 1: 's1', 0: 's0' };
  const envShells = [
    { name: 'bash', tag: 'Bourne Again Shell', s: [4, 3, 3, 4, 0, 4] },
    { name: 'zsh', tag: 'Z Shell', s: [4, 3, 3, 4, 0, 4] },
    { name: 'ash / dash', tag: 'POSIX sh', s: [2, 2, 2, 2, 0, 2] },
    { name: 'fish', tag: 'Friendly Interactive Shell', s: [2, 2, 2, 2, 0, 2] },
    { name: 'git-bash', tag: 'MinGW / MSYS2 bash', s: [0, 0, 0, 0, 3, 0] },
    { name: 'WSL (bash/zsh)', tag: 'Linux on Windows via WSL2', s: [0, 0, 0, 0, 0, 4] },
    { name: 'PowerShell', tag: 'pwsh / cross-platform', s: [3, 3, 2, 3, 3, 3] },
    { name: 'CMD', tag: 'Windows cmd.exe', s: [0, 0, 0, 0, 2, 0] },
  ];

  const EMOJI_PATTERN = new RegExp(
    Object.keys(EMOJI_ICON_MAP)
      .sort((a, b) => b.length - a.length)
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|'),
    'g'
  );

  function injectIconSprite() {
    if (document.getElementById('site-icon-sprite')) return;
    document.body.insertAdjacentHTML('afterbegin', ICON_SPRITE);
  }

  function createIcon(iconName) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    const use = document.createElementNS(ns, 'use');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('svg-icon', `icon-${iconName}`);
    use.setAttribute('href', `#icon-${iconName}`);
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#icon-${iconName}`);
    svg.appendChild(use);
    return svg;
  }

  function shouldSkipTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    if (!node.nodeValue || !node.nodeValue.trim()) return true;
    if (parent.closest('script, style, textarea, pre, code, option, select, svg, noscript')) return true;
    if (parent.closest('#site-icon-sprite, .sr-only, .no-svg-icons')) return true;
    return false;
  }

  function replaceEmojiText(root) {
    if (!root) return;
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
      if (shouldSkipTextNode(node) || !EMOJI_PATTERN.test(node.nodeValue)) {
        EMOJI_PATTERN.lastIndex = 0;
        return;
      }

      EMOJI_PATTERN.lastIndex = 0;
      const text = node.nodeValue;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      text.replace(EMOJI_PATTERN, (match, offset) => {
        if (offset > lastIndex) {
          fragment.append(document.createTextNode(text.slice(lastIndex, offset)));
        }
        fragment.append(createIcon(EMOJI_ICON_MAP[match] || 'spark'));
        lastIndex = offset + match.length;
        return match;
      });

      if (lastIndex < text.length) {
        fragment.append(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode.replaceChild(fragment, node);
    });
  }

  function cleanSvgText(root) {
    if (!root) return;
    const svgRoots = root.matches?.('svg') ? [root] : root.querySelectorAll?.('svg');
    if (!svgRoots || !svgRoots.length) return;

    svgRoots.forEach((svg) => {
      const walker = document.createTreeWalker(svg, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }

      nodes.forEach((node) => {
        let value = node.nodeValue;
        let changed = false;
        SVG_TEXT_REPLACEMENTS.forEach(([token, replacement]) => {
          if (value.includes(token)) {
            value = value.split(token).join(replacement);
            changed = true;
          }
        });
        if (changed) {
          node.nodeValue = value.replace(/\s{2,}/g, ' ').trim();
        }
      });
    });
  }

  function classifyCodeBlocks() {
    document.querySelectorAll('.code-wrap').forEach((wrap) => {
      const lang = (wrap.querySelector('.code-lang')?.textContent || '').toLowerCase();
      if (lang.includes('zsh')) {
        wrap.classList.add('wrap-host-mac');
      } else if (lang.includes('powershell') || lang.includes('ps')) {
        wrap.classList.add('wrap-host-win');
      } else if (lang.includes('ホスト')) {
        wrap.classList.add('wrap-host-linux');
      } else if (lang.includes('ゲスト') || lang.includes('wsl2') || lang.includes('vm')) {
        wrap.classList.add('wrap-guest');
      } else if (lang.includes('bash') || lang.includes('shell')) {
        wrap.classList.add(lang.trim() === 'bash' ? 'wrap-host-linux' : 'wrap-guest');
      } else if (lang.includes('dockerfile') || lang.includes('yaml') || lang.includes('json') || lang.includes('ini')) {
        wrap.classList.add('wrap-infra');
      } else {
        wrap.classList.add('wrap-default');
      }
    });
  }

  async function copyCode(btn) {
    const wrap = btn.closest('.code-wrap');
    const pre = wrap?.querySelector('pre');
    if (!pre) return;
    const text = pre.innerText;
    const original = btn.dataset.originalLabel || btn.textContent;
    btn.dataset.originalLabel = original;

    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'コピーしました';
      btn.classList.add('ok');
      btn.setAttribute('aria-label', 'コピーできました');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('ok');
        btn.setAttribute('aria-label', original);
      }, 1800);
    } catch (_) {
      btn.textContent = 'コピー失敗';
      btn.setAttribute('aria-label', 'コピーに失敗しました');
      setTimeout(() => {
        btn.textContent = original;
        btn.setAttribute('aria-label', original);
      }, 1800);
    }
  }

  function bindChecklist() {
    document.querySelectorAll('.check-list li').forEach((item) => {
      item.setAttribute('role', 'checkbox');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-checked', item.classList.contains('checked') ? 'true' : 'false');
      const toggle = () => {
        item.classList.toggle('checked');
        item.setAttribute('aria-checked', item.classList.contains('checked') ? 'true' : 'false');
      };
      item.addEventListener('click', toggle);
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      });
    });
  }

  function bindReveal() {
    const sections = document.querySelectorAll('.section');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
  }

  function bindToTop() {
    const button = document.querySelector('.to-top');
    if (!button) return;
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    const refresh = () => {
      button.classList.toggle('show', window.scrollY > 200);
    };
    window.addEventListener('scroll', refresh, { passive: true });
    refresh();
  }

  function renderQuickStart() {
    const result = document.getElementById('qs-result');
    if (!result) return;
    const selected = [...quickStartState].sort();
    if (!selected.length) {
      result.classList.remove('show');
      result.style.display = 'none';
      return;
    }

    const key = selected.join('+');
    const html = selected.length === 1 ? quickStartCards[selected[0]] : quickStartMixes[key];
    result.setAttribute('style', `${quickStartStyles[key] || ''};display:block`);
    result.innerHTML = html || '';
    cleanSvgText(result);
    replaceEmojiText(result);
    result.classList.add('show');
  }

  function toggleQuickStart(os) {
    if (quickStartState.has(os)) {
      quickStartState.delete(os);
    } else {
      quickStartState.add(os);
    }

    const button = document.getElementById(`btn-${os}`);
    if (button) {
      button.className = `qs-btn${quickStartState.has(os) ? ` ${quickStartButtonClasses[os]}` : ''}`;
    }
    renderQuickStart();
  }

  function bindQuickStart() {
    if (!document.getElementById('qs-result')) return;
    window.qsToggle = toggleQuickStart;
    renderQuickStart();
  }

  function renderEnvironmentMatrix() {
    const tbody = document.getElementById('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    envShells.forEach((shell) => {
      const tr = document.createElement('tr');
      const label = document.createElement('td');
      label.className = 'sn';
      label.innerHTML = `<span class="snm">${shell.name}</span><span class="snt">${shell.tag}</span>`;
      tr.appendChild(label);

      shell.s.forEach((score) => {
        const td = document.createElement('td');
        td.innerHTML = score === 0
          ? '<span class="na">—</span>'
          : `<span class="badge ${envClass[score]}">${envLegend[score]}</span>`;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  function enhanceExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      if (!link.rel.includes('noopener')) {
        link.rel = `${link.rel} noopener noreferrer`.trim();
      }
    });
  }

  function bindCopyButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-btn');
      if (btn) {
        copyCode(btn);
      }
    });
  }

  window.cp = copyCode;

  document.addEventListener('DOMContentLoaded', () => {
    injectIconSprite();
    classifyCodeBlocks();
    bindChecklist();
    bindReveal();
    bindToTop();
    bindQuickStart();
    renderEnvironmentMatrix();
    cleanSvgText(document.body);
    replaceEmojiText(document.body);
    enhanceExternalLinks();
    bindCopyButtons();
  });
})();
