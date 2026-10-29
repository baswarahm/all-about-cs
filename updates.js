// "Last updated" note for every course page: the date and time (Malaysia time) plus one short sentence.
// When you update a course, change its `at` (YYYY-MM-DDTHH:MM with +08:00) and `text`.
// Each course page loads this file with <script src="../updates.js" data-course="..."></script>.
// Wide screens: small text in the navbar, after the "CS courses" button. Phones: a thin line right under the navbar.
(function () {
  var UPDATES = {
    'computer-organisation': { at: '2026-10-28T22:52+08:00', text: 'New Random Test 1 (a fresh 50-question paper every time) and a question bank for each topic.' },
    'discrete-structures': { at: '2026-10-28T22:00+08:00', text: 'New look to match the other CS courses, with a tidier phone header.' },
    'principles-of-programming': { at: '2026-10-29T13:01+08:00', text: 'New Extreme level: 15 story-style programs where you work out the rules yourself.' },
  };

  var me = document.currentScript;
  var u = UPDATES[me && me.getAttribute('data-course')];
  if (!u) return;

  function when(iso) {
    var d = new Date(iso);
    try {
      var f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
      return f.format(d).replace(/\b(am|pm)\b/i, function (m) { return m.toUpperCase(); }) + ' MYT';
    } catch (e) { return iso.replace('T', ' ').slice(0, 16) + ' MYT'; }
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function init() {
    var anchor = document.querySelector('.courses-btn, .coursesbtn');
    if (!anchor) return;
    var header = anchor.closest('header') || anchor.parentNode;
    var stamp = 'Updated ' + when(u.at);

    var css = document.createElement('style');
    css.textContent =
      '.upd-note{flex:0 1 auto;min-width:0;max-width:220px;align-self:center;margin-left:10px;display:flex;flex-direction:column;' +
        'font-size:10.5px;line-height:1.3;opacity:.8}' +
      '.upd-note b{font-weight:600}' +
      '.upd-note span,.upd-note b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.upd-strip{display:none;font-size:11px;line-height:1.35;padding:5px 16px;opacity:.85;border-bottom:1px dashed}';
    document.head.appendChild(css);

    // in the navbar (wide screens)
    var note = document.createElement('div');
    note.className = 'upd-note';
    note.title = stamp + ': ' + u.text;
    note.innerHTML = '<b>' + esc(stamp) + '</b><span>' + esc(u.text) + '</span>';
    anchor.parentNode.insertBefore(note, anchor.nextSibling);

    // under the navbar (phones)
    var strip = document.createElement('div');
    strip.className = 'upd-strip';
    strip.innerHTML = '<b>' + esc(stamp) + '</b> · ' + esc(u.text);
    header.parentNode.insertBefore(strip, header.nextSibling);

    // follow the page's colours (light/dark) and the button's flex order / visibility
    function sync() {
      var cs = getComputedStyle(anchor), hs = getComputedStyle(header);
      note.style.color = getComputedStyle(anchor.parentNode).color;
      note.style.order = cs.order;
      if (cs.display === 'none') note.style.visibility = 'hidden'; else note.style.visibility = '';
      strip.style.color = hs.color;
      strip.style.borderColor = cs.borderTopColor;
    }
    // keep the note in the navbar only while it fits without squeezing the menu; otherwise use the strip
    var nav = header.querySelector('nav');
    function fit() {
      note.style.display = ''; strip.style.display = 'none';
      var tooTight = window.innerWidth <= 700 ||
        (nav && nav.scrollWidth > nav.clientWidth + 1) || header.scrollWidth > header.clientWidth + 1;
      if (tooTight) { note.style.display = 'none'; strip.style.display = 'block'; }
    }
    sync(); fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    var mo = new MutationObserver(function () { setTimeout(sync, 0); });
    mo.observe(document.documentElement, { attributes: true });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', function () { setTimeout(sync, 0); });
    }
    window.addEventListener('resize', sync);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
