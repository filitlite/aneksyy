/* ============================================================
   main.js — aneksyy // 喰種 (bio edition)
   typer, reveal, skills, projects, hunger bar, phonk toggle
   ============================================================ */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  window.addEventListener('pageshow', () => window.scrollTo(0, 0));

  const DATA = {
    skills: [
      { n: 'Python', v: 92, d: 'automation · pentest scripting · tools · backend' },
      { n: 'Pentest / Web', v: 88, d: 'OWASP Top 10 · Burp Suite · manual analysis' },
      { n: 'HTML/CSS/JS', v: 84, d: 'frontend · XSS/CSRF · client-side' },
      { n: 'OSINT & Recon', v: 86, d: 'recon · info gathering · attack surface' },
      { n: 'C++ / C#', v: 76, d: 'low-level · reverse engineering · systems' },
      { n: 'DevOps & Tools', v: 80, d: 'linux · git · docker · networking · bash' }
    ],
    tags: ['Web App Sec', 'API Security', 'Auth Bypass', 'IDOR', 'SQLi', 'XSS', 'SSRF', 'CSRF', 'Business Logic', 'Access Control', 'Info Disclosure', 'Race Conditions'],
    projs: [
      { n: 'aneksyy', d: 'основной репозиторий профиля', l: 'TypeScript', c: '#3178c6' },
      { n: 'TaskBoardLite', d: 'десктоп-приложение для задач склада (Python, tkinter, SQLite)', l: 'Python', c: '#3572A5' },
      { n: 'hggfgdsf', d: 'облачные бэкапы для магазина оружия', l: 'Python', c: '#3572A5' }
    ]
  };

  /* ================= VIDEO BG ================= */
  const heroEdit = $('#heroEdit'), editBg = $('#editBg');
  heroEdit.addEventListener('error', () => editBg.remove());
  heroEdit.muted = true;

  /* ================= AUDIO (EDIT: OFF при заходе, ON — по кнопке) ================= */
  const audioToggle = $('#audioToggle'), volSlider = $('#volSlider');
  volSlider.value = 10;
  PHONK.setVol(0.10);

  let stateOn = false; // по умолчанию выключено — включается кнопкой
  function paint() {
    audioToggle.textContent = stateOn ? '♪ EDIT://ON' : '♪ EDIT://OFF';
    audioToggle.classList.toggle('playing', stateOn);
  }
  function startSound() {
    PHONK.start();
    if (PHONK.ctx.state === 'suspended') PHONK.ctx.resume().catch(() => {});
    if (typeof PHONK.editForcePlay === 'function') PHONK.editForcePlay();
  }
  audioToggle.addEventListener('click', () => {
    stateOn = !stateOn;
    paint();
    if (stateOn) startSound(); else PHONK.stop();
  });
  volSlider.addEventListener('input', e => PHONK.setVol(e.target.value / 100));

  // при заходе: тишина, кнопка тускло горит OFF; клик по ней — трек запускается
  paint();
  // страховка: пока включено, дожимаем <audio> и контекст (защита от паузы браузера)
  setInterval(() => {
    if (!stateOn) return;
    if (PHONK.ctx.state !== 'running') PHONK.ctx.resume().catch(() => {});
    if (typeof PHONK.editForcePlay === 'function') PHONK.editForcePlay();
  }, 700);

  /* ================= PROJECTS: живые с GitHub API ================= */
  const LANG_COLORS = {
    Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
    HTML: '#e34c26', CSS: '#563d7c', 'C++': '#f34b7d', 'C#': '#178600',
    C: '#555555', Shell: '#89e051', Go: '#00ADD8', Rust: '#dea584',
    Java: '#b07219', Kotlin: '#A97BFF', PHP: '#4F5D95', Ruby: '#701516'
  };
  const pg = $('#projGrid');
  function renderRepos(repos) {
    repos.sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)));
    pg.innerHTML = '';
    repos.forEach(r => {
      const a = document.createElement('a');
      a.className = 'proj-card';
      a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
      const lang = r.language || '—';
      const color = LANG_COLORS[lang] || '#7a6f86';
      a.innerHTML = `<div class="proj-name">${r.name}</div>
        <div class="proj-desc">${r.description || 'без описания'}</div>
        <div class="proj-meta"><span><i class="lang-dot" style="background:${color}"></i>${lang}</span>
        ${r.stargazers_count ? `<span class="proj-stars">★ ${r.stargazers_count}</span>` : ''}</div>`;
      pg.appendChild(a);
    });
  }
  function renderFallback() {
    renderRepos([
      { name: 'aneksyy', description: 'основной репозиторий профиля', language: 'TypeScript', html_url: 'https://github.com/filitlite', stargazers_count: 0, pushed_at: 0 },
      { name: 'TaskBoardLite', description: 'десктоп-приложение для задач склада (Python, tkinter, SQLite)', language: 'Python', html_url: 'https://github.com/filitlite', stargazers_count: 0, pushed_at: 0 },
      { name: 'hggfgdsf', description: 'облачные бэкапы для магазина оружия', language: 'Python', html_url: 'https://github.com/filitlite', stargazers_count: 0, pushed_at: 0 },
    ]);
  }
  fetch('https://api.github.com/users/filitlite/repos?per_page=100&sort=updated')
    .then(r => { if (!r.ok) throw new Error('github http ' + r.status); return r.json(); })
    .then(repos => {
      if (!Array.isArray(repos) || !repos.length) throw new Error('empty');
      renderRepos(repos);
    })
    .catch(renderFallback);

  /* ================= TYPER ================= */
  const typedLines = [
    'нахожу уязвимости, которые другие пропускают.',
    'пишу код, который сложно сломать.',
    'breaking systems to make them stronger.',
    'eat or be eaten. // 喰'
  ];
  const typedEl = $('#typedLine');
  let tl = 0, cl = 0, del = false;
  (function typeLoop() {
    const line = typedLines[tl];
    typedEl.textContent = line.slice(0, cl);
    if (!del) {
      if (cl < line.length) { cl++; setTimeout(typeLoop, 45 + Math.random() * 40); }
      else { del = true; setTimeout(typeLoop, 2200); }
    } else {
      if (cl > 0) { cl -= 2; setTimeout(typeLoop, 16); }
      else { del = false; tl = (tl + 1) % typedLines.length; setTimeout(typeLoop, 400); }
    }
  })();

  /* ================= REVEAL ================= */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ================= SKILLS ================= */
  const skillList = $('#skillList');
  DATA.skills.forEach(s => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `<div class="skill-head"><span>${s.n}</span><span class="pct">${s.v}%</span></div>
      <div class="skill-bar"></div><div class="skill-sub">${s.d}</div>`;
    skillList.appendChild(row);
  });
  const io2 = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      $$('.skill-bar').forEach((b, i) => setTimeout(() => b.style.setProperty('--w', DATA.skills[i].v + '%'), i * 120));
      io2.disconnect();
    }
  }), { threshold: 0.3 });
  io2.observe(skillList);

  /* ================= TAGS ================= */
  const wz = $('#warzoneTags');
  DATA.tags.forEach(t => {
    const sp = document.createElement('span');
    sp.textContent = t;
    wz.appendChild(sp);
  });

  /* ================= ABOUT TERMINAL (лёгкий, без пафоса) ================= */
  const at = $('#aboutTerm');
  const atScript = [
    { c: 'whoami' },
    { o: 'aneksyy — ломаю то, что пишу' },
    { c: 'ls ~/now' },
    { kv: ['bugbounty', 'BI.ZONE · Standoff365'] },
    { kv: ['code', 'Python · C++ · C# · JS'] },
    { kv: ['fun', 'Web · API · auth · logic'] },
    { c: 'exit' },
    { o: 'не выйдет. 1000 − 7 …' },
    { cur: true }
  ];
  function renderAtInstant() {
    let html = '';
    atScript.forEach(l => {
      if (l.c) html += `<span class="ps">$</span> <span class="cmd">${l.c}</span>\n`;
      else if (l.kv) html += `  <span class="k">${l.kv[0]}</span> <span class="v">${l.kv[1]}</span>\n`;
      else if (l.o) html += `<span class="v">${l.o}</span>\n`;
    });
    if (atScript[atScript.length - 1].cur) html += `<span class="cur"></span>`;
    at.innerHTML = html;
  }
  function typeAt() {
    at.innerHTML = '';
    let li = 0, ci = 0;
    let html = '';
    (function step() {
      if (li >= atScript.length) return;
      const l = atScript[li];
      const line = l.c
        ? { p: `<span class="ps">$</span> <span class="cmd">`, t: l.c }
        : l.kv
          ? { p: `  <span class="k">${l.kv[0]}</span> <span class="v">`, t: l.kv[1] }
          : l.o ? { p: `<span class="v">`, t: l.o }
          : null;
      if (!line) { html += `<span class="cur"></span>`; at.innerHTML = html; return; }
      if (ci < line.t.length) {
        at.innerHTML = html + line.p + line.t.slice(0, ++ci) + `</span>`;
        setTimeout(step, l.c ? 26 : 10);
      } else {
        html += line.p + line.t + `</span>\n`;
        li++; ci = 0;
        at.innerHTML = html;
        setTimeout(step, l.c ? 300 : 140);
      }
    })();
  }
  // печатается, когда досье попадает в кадр
  const atIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { typeAt(); atIO.disconnect(); }
  }), { threshold: 0.3 });
  atIO.observe(at);
  // fallback: если reveal сработал раньше observer'а кадров — отрисовать мгновенно при ошибке анимации
  window.addEventListener('pageshow', renderAtInstant);

})();
