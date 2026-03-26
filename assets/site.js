(function () {
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
    linux: 'background:#f4fefa;border-color:var(--mint)',
    mac: 'background:#f8f4ff;border-color:var(--lav)',
    win: 'background:#f4faff;border-color:var(--sky)',
    'linux+mac': 'background:#f2fcf6;border-color:var(--mint)',
    'linux+win': 'background:#f0faff;border-color:var(--sky)',
    'mac+win': 'background:#f6f0ff;border-color:var(--lav)',
    'linux+mac+win': 'background:#fff8f4;border-color:var(--peach)',
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
    classifyCodeBlocks();
    bindChecklist();
    bindReveal();
    bindToTop();
    bindQuickStart();
    renderEnvironmentMatrix();
    enhanceExternalLinks();
    bindCopyButtons();
  });
})();
