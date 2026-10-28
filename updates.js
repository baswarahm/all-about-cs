// "What's new" button for every course page.
// Add new entries at the TOP of a course's list (newest first). Dates are YYYY-MM-DD.
// Each course page loads this file with <script src="../updates.js" data-course="..."></script>;
// the small button is placed right after the "CS courses" button in its navbar.
(function () {
  var UPDATES = {
    'computer-organisation': [
      { date: '2026-10-28', items: ['Lecture slides and tutorial sheets are now kept private; their links only open on the owner\'s computer'] },
    ],
    'discrete-structures': [
      { date: '2026-10-28', items: ['New look, matching the other CS courses', 'Tutorial and coursework PDFs removed from the public site'] },
    ],
    'principles-of-programming': [
      { date: '2026-10-28', items: [
        'Test 1 mock now has 2 programming questions (10 marks each), like the past Test 1',
        '180 new Test 1 questions from the Week 1–7 slides (321 in total)',
        'New notes: Random Numbers & Files',
        '4 "Past Test 1 style" coding questions in ProgrAss',
        'Every ProgrAss question now has 10 tests; hidden tests are shown after you pass',
        '20 "Step by step" coding questions, easy to hard, Weeks 2–5',
      ] },
    ],
  };

  var me = document.currentScript;
  var course = me && me.getAttribute('data-course');
  var list = UPDATES[course];
  if (!list || !list.length) return;

  var SEEN_KEY = 'cs-updates-seen:' + course;
  function getSeen() { try { return localStorage.getItem(SEEN_KEY) || ''; } catch (e) { return ''; } }
  function setSeen(v) { try { localStorage.setItem(SEEN_KEY, v); } catch (e) {} }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function nice(d) { var p = d.split('-'); return +p[2] + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function init() {
    var anchor = document.querySelector('.courses-btn, .coursesbtn');
    if (!anchor) return;
    var latest = list[0].date;
    var cs = getComputedStyle(anchor);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'upd-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'What\'s new on this page');
    btn.title = 'Latest update: ' + nice(latest);
    btn.innerHTML = 'New<span class="upd-dot" aria-hidden="true"></span>';
    // look like the CS courses button next to it, just smaller
    btn.style.cssText = 'position:relative;flex:0 0 auto;align-self:center;cursor:pointer;' +
      'font-family:' + cs.fontFamily + ';font-size:11px;font-weight:600;letter-spacing:.04em;line-height:1;' +
      'border:1px solid;border-radius:' + cs.borderTopLeftRadius + ';' +
      'height:' + Math.min(parseFloat(cs.height) || 28, 28) + 'px;padding:0 8px;margin:0 0 0 6px;white-space:nowrap';
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    // copy the neighbour's colours again whenever the page switches between light and dark
    // also follow its flex order and hide when it is hidden (some headers reorder or hide it on small screens)
    function sync() {
      cs = getComputedStyle(anchor);
      btn.style.color = cs.color; btn.style.borderColor = cs.borderTopColor; btn.style.background = cs.backgroundColor;
      btn.style.order = cs.order;
      btn.style.display = cs.display === 'none' ? 'none' : '';
    }
    sync();
    var mo = new MutationObserver(function () { setTimeout(sync, 0); close(); });
    mo.observe(document.documentElement, { attributes: true });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', function () { setTimeout(sync, 0); });
    }

    var style = document.createElement('style');
    style.textContent =
      '.upd-dot{position:absolute;top:-4px;right:-4px;width:8px;height:8px;border-radius:50%;background:#e8590c;display:none}' +
      '.upd-btn.unseen .upd-dot{display:block}' +
      '.upd-btn:hover{opacity:.75}' +
      '.upd-pop{position:fixed;z-index:1000;width:min(320px,calc(100vw - 24px));max-height:60vh;overflow:auto;padding:12px 14px;' +
      'border:1px solid;box-shadow:0 12px 32px -12px rgba(0,0,0,.45);font-size:13px;line-height:1.45}' +
      '.upd-pop h4{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.7}' +
      '.upd-pop .upd-date{font-weight:700;margin:10px 0 4px}.upd-pop .upd-date:first-of-type{margin-top:0}' +
      '.upd-pop ul{margin:0;padding-left:18px}.upd-pop li{margin:2px 0}';
    document.head.appendChild(style);

    if (getSeen() < latest) btn.classList.add('unseen');

    var pop = null;
    function close() {
      if (!pop) return;
      pop.remove(); pop = null;
      btn.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', outside, true);
      document.removeEventListener('keydown', onKey);
    }
    function outside(e) { if (pop && !pop.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close(); }
    function onKey(e) { if (e.key === 'Escape') { close(); btn.focus(); } }
    btn.addEventListener('click', function () {
      if (pop) { close(); return; }
      pop = document.createElement('div');
      pop.className = 'upd-pop';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-label', 'Latest updates');
      // use the page's own colours so it fits every course's theme, light or dark
      var body = getComputedStyle(document.body);
      var bg = body.backgroundColor;
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') bg = getComputedStyle(document.documentElement).backgroundColor || '#fff';
      pop.style.background = bg;
      pop.style.color = body.color;
      pop.style.borderColor = cs.borderTopColor;
      pop.style.fontFamily = body.fontFamily;
      pop.innerHTML = '<h4>Latest updates</h4>' + list.map(function (u) {
        return '<div class="upd-date">' + nice(u.date) + '</div><ul>' + u.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
      }).join('');
      document.body.appendChild(pop);
      var r = btn.getBoundingClientRect(), w = pop.offsetWidth;
      pop.style.top = (r.bottom + 8) + 'px';
      pop.style.left = Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12)) + 'px';
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.remove('unseen');
      setSeen(latest);
      setTimeout(function () { document.addEventListener('click', outside, true); }, 0);
      document.addEventListener('keydown', onKey);
    });
    window.addEventListener('resize', function () { close(); sync(); });
    window.addEventListener('scroll', function () { close(); setTimeout(sync, 0); }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
