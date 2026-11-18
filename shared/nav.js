/* shared/nav.js: the same way around every course.
   · Search (button, Ctrl+K or /): pages, sections, deadlines and other courses
   · a bottom tab bar on phones (Discrete and Programming; CO already has one)
   · Discrete: a week picker on phones
   · main page: a "continue" link and when each course was last opened
   Load at the end of <body>. Saves only cs:last; never touches a course's own keys. */
(function () {
  var root = document.documentElement, d = document;
  var site = ['hub', 'co', 'ds', 'pop'].filter(function (s) { return root.classList.contains('site-' + s); })[0];
  if (!site) return;
  var base = site === 'hub' ? '' : '../';
  var COURSES = [
    { id: 'co', name: 'Computer Organisation', path: 'computer-organisation/' },
    { id: 'ds', name: 'Discrete Structures', path: 'discrete-structures/' },
    { id: 'pop', name: 'Principles of Programming', path: 'principles-of-programming/' }
  ];
  // the main pages of each course: [label, where]; where = '#hash' or 'tab:N' (Discrete week tab)
  var PAGES = {
    co: [['Home', '#home'], ['Notes', '#learn/t1'], ['Practice', '#practice'], ['Tests', '#tests'], ['Tools', '#tools'], ['Tutorials', '#tutorials'], ['Cheat sheet', '#cheat']],
    pop: [['Home', '#/'], ['Notes', '#/material'], ['Practice', '#/generator'], ['Tests', '#/quiz'], ['Code', '#/playground'], ['Problem bank (all lab questions)', '#/progass']],
    ds: []
  };
  function get(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Discrete: the week tabs are the pages
  if (site === 'ds') {
    [].forEach.call(d.querySelectorAll('.wtab'), function (b) {
      var n = b.getAttribute('data-weekbtn'), t = b.querySelector('b').textContent, s = (b.querySelector('span') || {}).textContent || '';
      PAGES.ds.push([t + (s && n !== '0' ? ' · ' + s : ''), 'tab:' + n]);
    });
  }
  function go(where) {
    if (where.indexOf('tab:') === 0) { var b = d.getElementById('tab' + where.slice(4)); if (b) b.click(); scrollTo(0, 0); }
    else if (where.charAt(0) === '#') location.hash = where.slice(1);
    else location.href = where;
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
    if (site !== 'hub') PAGES[site].forEach(function (p) { list.push({ t: p[0], s: 'Page', go: p[1] }); });
    if (site === 'ds') {   // every section of every week
      [].forEach.call(d.querySelectorAll('#nav .navgroup'), function (g) {
        var w = g.getAttribute('data-week'), tab = d.getElementById('tab' + w), wk = tab ? tab.querySelector('b').textContent : 'Test 1';
        [].forEach.call(g.querySelectorAll('a[href^="#"]'), function (a) {
          list.push({ t: a.textContent.trim(), s: wk, go: function () { go('tab:' + w); setTimeout(function () { var x = d.querySelector(a.getAttribute('href')); if (x) x.scrollIntoView({ behavior: 'instant' }); }, 200); } });
        });
      });
    } else if (site !== 'hub') {   // headings on the page you are reading
      [].forEach.call(d.querySelectorAll('main h2, main h3'), function (h) {
        if (!h.offsetParent || !h.textContent.trim()) return;
        list.push({ t: h.textContent.trim().slice(0, 80), s: 'On this page', go: function () { h.scrollIntoView({ behavior: 'smooth' }); } });
      });
      [].forEach.call(d.querySelectorAll('.sv-list a'), function (x) { list.push({ t: x.textContent.trim(), s: 'Solver', go: x.getAttribute('href') }); });
    }
    COURSES.forEach(function (c) {
      if (c.id === site) return;
      list.push({ t: c.name, s: 'Course', go: base + c.path });
      PAGES[c.id].slice(1).forEach(function (p) { list.push({ t: c.name.split(' ')[0] + ' · ' + p[0], s: 'Course', go: base + c.path + p[1] }); });
    });
    (window.CS_DEADLINES || []).forEach(function (x) {   // upcoming tests and deadlines (shared/deadlines.js)
      if (x.end.getTime() < Date.now() || (site !== 'hub' && x.c !== site && x.c !== 'all')) return;
      var days = Math.max(0, Math.ceil((x.start.getTime() - Date.now()) / 864e5));
      list.push({ t: x.t, s: days ? 'in ' + days + ' days' : 'now', go: base + '#soon' });
    });
    if (site !== 'hub') list.push({ t: 'All CS courses', s: 'Main page', go: base || './' });
    list.push({ t: 'Switch dark / light', s: 'Setting', go: function () { var b = d.getElementById('themeBtn') || d.getElementById('theme'); if (b) b.click(); } });
    return list;
  }
  var pal, inp, res, cur = 0, shown = [];
  function render() {
    var q = inp.value.toLowerCase().trim().split(/\s+/), all = items();
    shown = all.filter(function (x) { var h = (x.t + ' ' + x.s).toLowerCase(); return q.every(function (w) { return h.indexOf(w) >= 0; }); }).slice(0, 40);
    cur = Math.min(cur, Math.max(shown.length - 1, 0));
    res.innerHTML = shown.length ? shown.map(function (x, i) {
      return '<li role="option" id="csj' + i + '" aria-selected="' + (i === cur) + '" data-i="' + i + '"><span class="t">' + esc(x.t) + '</span><span class="s">' + esc(x.s) + '</span></li>';
    }).join('') : '<li class="none">No match.</li>';
    inp.setAttribute('aria-activedescendant', shown.length ? 'csj' + cur : '');
    var a = res.querySelector('[aria-selected="true"]'); if (a) a.scrollIntoView({ block: 'nearest' });
  }
  function pick(i) {
    var x = shown[i]; if (!x) return; closeJump();
    typeof x.go === 'function' ? x.go() : go(x.go);
  }
  function openJump() {
    if (!pal) {
      pal = el('div', 'cs-jump', '<div class="cs-jump-box" role="dialog" aria-modal="true" aria-label="Search"><input type="text" placeholder="Search pages, sections and deadlines" aria-label="Search pages, sections and deadlines" role="combobox" aria-controls="csjres" aria-expanded="true" autocomplete="off" spellcheck="false"><ul id="csjres" role="listbox"></ul><p class="cs-jump-foot"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close</p></div>');
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

  /* ───────── header: search button, before the theme button ───────── */
  var theme = d.getElementById('themeBtn') || d.getElementById('theme');
  if (theme) {
    var jb = el('button', 'cs-jump-btn', '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg><span class="lbl">Search</span><kbd>/</kbd>');
    jb.type = 'button'; jb.setAttribute('aria-label', 'Search pages and sections'); jb.onclick = openJump;
    theme.parentNode.insertBefore(jb, theme);
  }

  /* ───────── phone bottom bar (Discrete and Programming) ───────── */
  if (site === 'pop' || site === 'ds') {
    var tabs = site === 'pop' ? PAGES.pop.slice(0, 5).map(function (p) { return { t: p[0], go: p[1] }; }) : [
      { t: 'Home', go: 'tab:0' },
      { t: 'Weeks', go: function () { openWeeks(); } },
      { t: 'Exam Lab', go: 'tab:6' },
      { t: 'Sections', go: function () { var f = d.getElementById('fab'); if (f) f.click(); } },
      { t: 'Search', go: openJump }
    ];
    var bar = el('nav', 'cs-tabbar'); bar.setAttribute('aria-label', 'Course menu');
    tabs.forEach(function (x) {
      var b = el(typeof x.go === 'string' && x.go.charAt(0) === '#' ? 'a' : 'button', '', x.t);
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


  /* ───────── Discrete: every week in reach (a picker instead of a sideways-scrolling strip on phones) ───────── */
  var weeks, wbtn;
  function openWeeks() {
    if (!weeks) {
      weeks = el('div', 'cs-jump cs-weeks');
      weeks.innerHTML = '<div class="cs-jump-box" role="dialog" aria-modal="true" aria-label="Choose a week"><div class="cs-weeks-head"><b>Choose a week</b><button type="button" class="cs-x" aria-label="Close">✕</button></div><div class="cs-weeks-grid"></div></div>';
      d.body.appendChild(weeks);
      weeks.addEventListener('mousedown', function (e) { if (e.target === weeks) closeWeeks(); });
      weeks.querySelector('.cs-x').onclick = closeWeeks;
      weeks.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeWeeks(); });
    }
    var grid = weeks.querySelector('.cs-weeks-grid');
    grid.innerHTML = '';
    [].forEach.call(d.querySelectorAll('.wtab'), function (t) {
      var n = t.getAttribute('data-weekbtn'), p = parseFloat(getComputedStyle(t).getPropertyValue('--p')) || 0;
      var b = el('button', 'cs-wk' + (t.getAttribute('aria-selected') === 'true' ? ' on' : '') + (n === '6' ? ' exam' : ''),
        '<b>' + esc(t.querySelector('b').textContent) + '</b><span class="s">' + esc(t.querySelector('span').textContent) + '</span>' +
        (n !== '0' ? '<span class="bar"><i style="width:' + Math.round(p * 100) + '%"></i></span>' : ''));
      b.type = 'button'; b.onclick = function () { closeWeeks(); go('tab:' + n); };
      grid.appendChild(b);
    });
    weeks.hidden = false; d.body.classList.add('cs-noscroll');
    var on = grid.querySelector('.on') || grid.firstChild; if (on) on.focus();
  }
  function closeWeeks() { if (weeks) { weeks.hidden = true; d.body.classList.remove('cs-noscroll'); if (wbtn) wbtn.focus(); } }
  if (site === 'ds') {
    var strip = d.querySelector('.wtabs');
    wbtn = el('button', 'cs-weekbtn'); wbtn.type = 'button'; wbtn.setAttribute('aria-haspopup', 'dialog'); wbtn.onclick = openWeeks;
    if (strip) strip.insertAdjacentElement('afterend', wbtn);
    var label = function () {
      var t = d.querySelector('.wtab[aria-selected="true"]');
      if (t) wbtn.innerHTML = '<b>' + esc(t.querySelector('b').textContent) + '</b><span>' + esc(t.querySelector('span').textContent) + '</span><em>All weeks</em>';
    };
    label(); d.addEventListener('click', function () { setTimeout(label, 60); });
  }

  /* ───────── main page: "continue" link and when each course was last opened ───────── */
  if (site === 'hub') {
    var last = get('cs:last', {}), lc = last.latest && COURSES.filter(function (c) { return c.id === last.latest; })[0];
    if (lc) {
      var box = el('p', 'cs-continue', 'Last time: <a href="' + lc.path + esc(last[lc.id].h || '') + '">' + esc(lc.name) + (last[lc.id].t ? ', ' + esc(last[lc.id].t) : '') + '</a>');
      var lede = d.querySelector('main .lede'); if (lede) lede.insertAdjacentElement('afterend', box);
    }
    COURSES.forEach(function (c) {
      var card = d.querySelector('.course.' + (c.id === 'pop' ? 'fp' : c.id)), l = last[c.id]; if (!card || !l || !l.at) return;
      var m = Math.round((Date.now() - l.at) / 6e4), ago = m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' days ago';
      card.querySelector('.go').insertAdjacentHTML('beforebegin', '<span class="cs-seen">Opened ' + ago + '</span>');
    });
  }
})();
