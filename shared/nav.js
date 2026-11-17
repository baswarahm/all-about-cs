/* shared/nav.js — the same way around every course, plus a few fun bits.
   · "Jump to" search (🔍 button, Ctrl+K or /): pages, sections and other courses
   · a bottom tab bar on phones (Discrete and Programming; CO already has one)
   · a daily study streak 🔥 with a little confetti, and "continue where you left off" on the main page
   Load at the end of <body>. Saves only cs:streak and cs:last; never touches a course's own keys. */
(function () {
  var root = document.documentElement, d = document;
  var site = ['hub', 'co', 'ds', 'pop'].filter(function (s) { return root.classList.contains('site-' + s); })[0];
  if (!site) return;
  var base = site === 'hub' ? '' : '../';
  var COURSES = [
    { id: 'co', emoji: '🧮', name: 'Computer Organisation', path: 'computer-organisation/' },
    { id: 'ds', emoji: '🔗', name: 'Discrete Structures', path: 'discrete-structures/' },
    { id: 'pop', emoji: '💻', name: 'Principles of Programming', path: 'principles-of-programming/' }
  ];
  // the main pages of each course: [emoji, label, where]; where = '#hash' or 'tab:N' (Discrete week tab)
  var PAGES = {
    co: [['🏠', 'Home', '#home'], ['📖', 'Notes', '#learn/t1'], ['🎯', 'Practice', '#practice'], ['📝', 'Tests', '#tests'],
         ['🛠️', 'Tools', '#tools'], ['✏️', 'Tutorials', '#tutorials'], ['📋', 'Cheat sheet', '#cheat']],
    pop: [['🏠', 'Home', '#/'], ['📖', 'Notes', '#/material'], ['🎯', 'Practice', '#/generator'], ['📝', 'Tests', '#/quiz'], ['💻', 'Code', '#/playground'], ['🧩', 'Problem bank (all lab questions)', '#/progass']],
    ds: []
  };
  function get(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Discrete: the week tabs are the pages
  if (site === 'ds') {
    [].forEach.call(d.querySelectorAll('.wtab'), function (b) {
      var n = b.getAttribute('data-weekbtn'), t = b.querySelector('b').textContent, s = (b.querySelector('span') || {}).textContent || '';
      PAGES.ds.push([n === '0' ? '🏠' : n === '6' ? '🎯' : '📅', t + (s && n !== '0' ? ' · ' + s : ''), 'tab:' + n]);
    });
  }
  function go(where) {
    if (where.indexOf('tab:') === 0) { var b = d.getElementById('tab' + where.slice(4)); if (b) b.click(); scrollTo(0, 0); }
    else if (where.charAt(0) === '#') location.hash = where.slice(1);
    else location.href = where;
  }

  /* ───────── fun: confetti + toast ───────── */
  function confetti(n) {
    if (reduce) return;
    var cols = ['#ff7a3d', '#b58ce8', '#e5484d', '#f5c542', '#3ecf8e', '#4ea8ff'], box = el('div', 'cs-confetti');
    for (var i = 0; i < (n || 60); i++) {
      var p = el('i');
      p.style.left = Math.random() * 100 + 'vw'; p.style.background = cols[i % cols.length];
      p.style.animationDelay = Math.random() * .4 + 's'; p.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
      p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(p);
    }
    d.body.appendChild(box); setTimeout(function () { box.remove(); }, 3400);
  }
  function toast(msg) {
    var t = el('div', 'cs-toast', msg); t.setAttribute('role', 'status'); d.body.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 3200); setTimeout(function () { t.remove(); }, 3700);
  }
  window.csCelebrate = function (msg) { confetti(); if (msg) toast(msg); };

  /* ───────── daily streak ───────── */
  function day(t) { var x = new Date(t); return x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate(); }
  var now = Date.now(), st = get('cs:streak', { d: '', n: 0, best: 0 }), today = day(now);
  if (st.d !== today) {
    st.n = st.d === day(now - 864e5) ? st.n + 1 : 1; st.d = today; st.best = Math.max(st.best || 0, st.n); set('cs:streak', st);
    if (st.n > 1) setTimeout(function () { window.csCelebrate('🔥 ' + st.n + '-day study streak! Keep it going.'); }, 700);
  }

  /* ───────── where you are (for "continue" on the main page) ───────── */
  function here() {
    var on = d.querySelector('.site-co .nav a.on, .site-pop .nav a.active, .site-ds .wtab[aria-selected="true"]');
    if (!on) return d.title;
    if (site === 'ds') return on.querySelector('b').textContent + ' · ' + on.querySelector('span').textContent;
    var c = on.cloneNode(true); [].forEach.call(c.querySelectorAll('.ic, i'), function (x) { x.remove(); });
    return c.textContent.trim();
  }
  function remember() {
    if (site === 'hub') return;
    var last = get('cs:last', {}); last[site] = { t: here(), h: location.hash, at: Date.now() }; last.latest = site; set('cs:last', last);
  }
  if (site !== 'hub') {
    addEventListener('hashchange', function () { setTimeout(remember, 80); });
    d.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.wtab')) setTimeout(remember, 80); });
    setTimeout(remember, 400);
  }

  /* ───────── Jump to (search everything) ───────── */
  function items() {
    var list = [];
    if (site !== 'hub') PAGES[site].forEach(function (p) { list.push({ e: p[0], t: p[1], s: 'Page', go: p[2] }); });
    if (site === 'ds') {   // every section of every week
      [].forEach.call(d.querySelectorAll('#nav .navgroup'), function (g) {
        var w = g.getAttribute('data-week'), tab = d.getElementById('tab' + w), wk = tab ? tab.querySelector('b').textContent : 'Test 1';
        [].forEach.call(g.querySelectorAll('a[href^="#"]'), function (a) {
          list.push({ e: '§', t: a.textContent.trim(), s: wk, go: function () { go('tab:' + w); setTimeout(function () { var x = d.querySelector(a.getAttribute('href')); if (x) x.scrollIntoView({ behavior: 'instant' }); }, 200); } });
        });
      });
    } else if (site !== 'hub') {   // headings on the page you are reading
      [].forEach.call(d.querySelectorAll('main h2, main h3'), function (h) {
        if (!h.offsetParent || !h.textContent.trim()) return;
        list.push({ e: '§', t: h.textContent.trim().slice(0, 80), s: 'On this page', go: function () { h.scrollIntoView({ behavior: 'smooth' }); } });
      });
    }
    COURSES.forEach(function (c) {
      if (c.id === site) return;
      list.push({ e: c.emoji, t: c.name, s: 'Course', go: base + c.path });
      PAGES[c.id].slice(1).forEach(function (p) { list.push({ e: p[0], t: c.name.split(' ')[0] + ' · ' + p[1], s: 'Course', go: base + c.path + p[2] }); });
    });
    (window.CS_DEADLINES || []).forEach(function (x) {   // upcoming tests and deadlines (shared/deadlines.js)
      if (x.end.getTime() < Date.now() || (site !== 'hub' && x.c !== site && x.c !== 'all')) return;
      var days = Math.max(0, Math.ceil((x.start.getTime() - Date.now()) / 864e5));
      list.push({ e: '📅', t: x.t, s: days ? 'in ' + days + ' days' : 'now', go: base + '#soon' });
    });
    if (site !== 'hub') list.push({ e: '🏫', t: 'All CS courses', s: 'Main page', go: base || './' });
    list.push({ e: '◑', t: 'Switch dark / light', s: 'Setting', go: function () { var b = d.getElementById('themeBtn') || d.getElementById('theme'); if (b) b.click(); } });
    return list;
  }
  var pal, inp, res, cur = 0, shown = [];
  function render() {
    var q = inp.value.toLowerCase().trim().split(/\s+/), all = items();
    shown = all.filter(function (x) { var h = (x.t + ' ' + x.s).toLowerCase(); return q.every(function (w) { return h.indexOf(w) >= 0; }); }).slice(0, 40);
    cur = Math.min(cur, Math.max(shown.length - 1, 0));
    res.innerHTML = shown.length ? shown.map(function (x, i) {
      return '<li role="option" id="csj' + i + '" aria-selected="' + (i === cur) + '" data-i="' + i + '"><span class="e">' + esc(x.e) + '</span><span class="t">' + esc(x.t) + '</span><span class="s">' + esc(x.s) + '</span></li>';
    }).join('') : '<li class="none">Nothing found. Try another word 🙂</li>';
    inp.setAttribute('aria-activedescendant', shown.length ? 'csj' + cur : '');
    var a = res.querySelector('[aria-selected="true"]'); if (a) a.scrollIntoView({ block: 'nearest' });
  }
  function pick(i) {
    var x = shown[i]; if (!x) return; closeJump();
    typeof x.go === 'function' ? x.go() : go(x.go);
  }
  function openJump() {
    if (!pal) {
      pal = el('div', 'cs-jump', '<div class="cs-jump-box" role="dialog" aria-modal="true" aria-label="Jump to"><input type="text" placeholder="Jump to… (try: notes, trees, test, kmap)" aria-label="Search pages and sections" role="combobox" aria-controls="csjres" aria-expanded="true" autocomplete="off" spellcheck="false"><ul id="csjres" role="listbox"></ul><p class="cs-jump-foot"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close</p></div>');
      d.body.appendChild(pal); inp = pal.querySelector('input'); res = pal.querySelector('ul');
      pal.addEventListener('mousedown', function (e) { if (e.target === pal) closeJump(); });
      res.addEventListener('click', function (e) { var li = e.target.closest('li[data-i]'); if (li) pick(+li.getAttribute('data-i')); });
      inp.addEventListener('input', function () { cur = 0; render(); });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { cur = Math.min(cur + 1, shown.length - 1); render(); e.preventDefault(); }
        else if (e.key === 'ArrowUp') { cur = Math.max(cur - 1, 0); render(); e.preventDefault(); }
        else if (e.key === 'Enter') { pick(cur); e.preventDefault(); }
        else if (e.key === 'Escape') closeJump();
      });
    }
    pal.hidden = false; inp.value = ''; cur = 0; render(); inp.focus(); d.body.classList.add('cs-noscroll');
  }
  function closeJump() { if (pal) { pal.hidden = true; d.body.classList.remove('cs-noscroll'); } }
  window.csJump = openJump;
  d.addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable || (e.target.closest && e.target.closest('.CodeMirror'));
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openJump(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); openJump(); }
  });

  /* ───────── header: 🔥 streak chip and 🔍 jump button, before the theme button ───────── */
  var theme = d.getElementById('themeBtn') || d.getElementById('theme');
  if (theme) {
    var jb = el('button', 'cs-jump-btn', '<span aria-hidden="true">🔍</span><span class="lbl">Jump to</span><kbd>Ctrl K</kbd>');
    jb.type = 'button'; jb.setAttribute('aria-label', 'Jump to a page or section'); jb.onclick = openJump;
    var sc = el('span', 'cs-streak', '🔥 ' + st.n); sc.title = st.n + '-day study streak (best ' + st.best + ')';
    theme.parentNode.insertBefore(sc, theme); theme.parentNode.insertBefore(jb, theme);
  }

  /* ───────── phone bottom bar (Discrete and Programming) ───────── */
  if (site === 'pop' || site === 'ds') {
    var tabs = site === 'pop' ? PAGES.pop.slice(0, 5).map(function (p) { return { e: p[0], t: p[1], go: p[2] }; }) : [
      { e: '🏠', t: 'Home', go: 'tab:0' },
      { e: '📅', t: 'Weeks', go: function () { openJump(); inp.value = 'week'; render(); } },
      { e: '🎯', t: 'Exam Lab', go: 'tab:6' },
      { e: '☰', t: 'Sections', go: function () { var f = d.getElementById('fab'); if (f) f.click(); } },
      { e: '🔍', t: 'Search', go: openJump }
    ];
    var bar = el('nav', 'cs-tabbar'); bar.setAttribute('aria-label', 'Course menu');
    tabs.forEach(function (x) {
      var b = el(typeof x.go === 'string' && x.go.charAt(0) === '#' ? 'a' : 'button', '', '<span class="e" aria-hidden="true">' + x.e + '</span>' + x.t);
      if (b.tagName === 'A') b.href = x.go; else { b.type = 'button'; b.onclick = function () { typeof x.go === 'function' ? x.go() : go(x.go); }; }
      b.setAttribute('data-go', typeof x.go === 'string' ? x.go : '');
      bar.appendChild(b);
    });
    d.body.appendChild(bar); d.body.classList.add('cs-has-tabbar');
    var mark = function () {
      var key = site === 'pop' ? (location.hash.split('/')[1] || '') : ((d.querySelector('.wtab[aria-selected="true"]') || {}).id || '').replace('tab', 'tab:');
      [].forEach.call(bar.children, function (b) {
        var g = b.getAttribute('data-go'), on = site === 'pop' ? g === '#/' + key : g === key;
        b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      });
    };
    addEventListener('hashchange', mark); d.addEventListener('click', function () { setTimeout(mark, 60); }); mark();
  }

  /* ───────── main page: greeting, streak and "continue" ───────── */
  if (site === 'hub') {
    var h = new Date().getHours(), hi = h < 5 ? 'Up late? 🌙' : h < 12 ? 'Good morning ☀️' : h < 18 ? 'Good afternoon 👋' : 'Good evening 🌆';
    var tips = ['Small steps every day beat one big cram.', 'Try a question before you read the answer.', 'Explain it to a friend: if you can, you know it.',
      'Stuck? Take a 5-minute break, then try again.', 'Mistakes in practice save marks in the test.', 'Ten focused minutes still count. Start now.'];
    var last = get('cs:last', {}), lc = last.latest && COURSES.filter(function (c) { return c.id === last.latest; })[0];
    var box = el('section', 'cs-hello');
    box.innerHTML = '<div class="cs-hello-top"><b>' + hi + '</b><span class="cs-streak big" title="Best streak: ' + st.best + ' days">🔥 ' + st.n + ' day' + (st.n > 1 ? 's' : '') + ' in a row</span></div>' +
      '<p class="cs-tip">💡 ' + tips[new Date().getDate() % tips.length] + '</p>' +
      (lc ? '<a class="cs-continue" href="' + lc.path + (last[lc.id].h || '') + '"><span class="e">' + lc.emoji + '</span><span><small>Continue where you left off</small><b>' + esc(lc.name) + '</b><em>' + esc(last[lc.id].t || '') + '</em></span><span class="arr">→</span></a>' : '');
    var lede = d.querySelector('main .lede'); if (lede) lede.insertAdjacentElement('afterend', box);
    COURSES.forEach(function (c) {   // "opened 2 h ago" on each course card
      var card = d.querySelector('.course.' + (c.id === 'pop' ? 'fp' : c.id)), l = last[c.id]; if (!card) return;
      card.insertAdjacentHTML('afterbegin', '<span class="cs-emoji" aria-hidden="true">' + c.emoji + '</span>');
      if (l && l.at) {
        var m = Math.round((Date.now() - l.at) / 6e4), ago = m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' days ago';
        card.querySelector('.go').insertAdjacentHTML('beforebegin', '<span class="cs-seen">Last opened ' + ago + '</span>');
      }
    });
  }
})();
