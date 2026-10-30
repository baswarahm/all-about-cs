// "People online" counter in the navbar, using Supabase Realtime Presence (no database table needed).
// Every open page joins the same channel; Supabase drops a page by itself when it is closed.
// One browser counts once, even with several tabs open (they share the same key).
// Each page loads this file with <script src="online.js" data-course="..."></script> (hub: data-course="hub").
// The publishable key is meant to be public; never put the database password here.
(function () {
  var SUPABASE_URL = 'https://yjqdvdlwmlberfunhgvo.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_hSMX7EoBC2c2ZTRoRw0ksA_xN-y1XT9';
  var LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/dist/umd/supabase.js';
  var CHANNEL = 'site-online';

  var me = document.currentScript;
  var course = (me && me.getAttribute('data-course')) || 'hub';

  function visitorId() {
    try {
      var id = localStorage.getItem('online:id');
      if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('online:id', id); }
      return id;
    } catch (e) { return Math.random().toString(36).slice(2); }
  }

  var pill, num;
  function makePill() {
    var anchor = document.querySelector('.courses-btn, .coursesbtn, #themeBtn');
    if (!anchor) return false;
    var css = document.createElement('style');
    css.textContent =
      '.online-pill{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;align-self:center;white-space:nowrap;' +
        'font:500 11px/1 var(--mono,ui-monospace,Consolas,monospace);padding:4px 8px;border:1px solid currentColor;border-radius:999px;opacity:.85;margin-right:8px}' +
      '.online-pill i{width:7px;height:7px;border-radius:50%;background:#2f9e44;box-shadow:0 0 0 0 rgba(47,158,68,.6);animation:online-pulse 2s infinite}' +
      '.online-pill.off i{background:#999;animation:none}' +
      '@keyframes online-pulse{70%{box-shadow:0 0 0 6px rgba(47,158,68,0)}100%{box-shadow:0 0 0 0 rgba(47,158,68,0)}}' +
      '@media (max-width:700px){.online-pill .online-word{display:none}.online-pill{padding:4px 7px;margin-right:6px}}' +
      '@media (prefers-reduced-motion:reduce){.online-pill i{animation:none}}';
    document.head.appendChild(css);
    pill = document.createElement('span');
    pill.className = 'online-pill off';
    pill.title = 'Connecting…';
    pill.innerHTML = '<i aria-hidden="true"></i><b class="online-num">–</b><span class="online-word">online</span>';
    num = pill.querySelector('.online-num');
    num.style.fontWeight = '600';
    if (anchor.id === 'themeBtn') pill.style.marginLeft = 'auto';   // hub page: keep it next to the theme button
    anchor.parentNode.insertBefore(pill, anchor);
    return true;
  }

  function show(state) {
    var total = 0, here = 0;
    Object.keys(state).forEach(function (key) {
      total++;
      if (state[key].some(function (p) { return p.course === course; })) here++;
    });
    num.textContent = total;
    pill.classList.remove('off');
    pill.title = total + (total === 1 ? ' person' : ' people') + ' on the site now' +
      (course !== 'hub' ? ' · ' + here + ' on this course' : '');
  }

  function connect() {
    var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
    var ch = client.channel(CHANNEL, { config: { presence: { key: visitorId() } } });
    ch.on('presence', { event: 'sync' }, function () { show(ch.presenceState()); })
      .subscribe(function (status) {
        if (status === 'SUBSCRIBED') ch.track({ course: course, at: Date.now() });
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          pill.classList.add('off'); pill.title = 'Online count not available right now';
        }
      });
  }

  function init() {
    if (!makePill()) return;
    if (window.supabase && window.supabase.createClient) return connect();
    var s = document.createElement('script');
    s.src = LIB;
    s.async = true;
    s.onload = connect;
    s.onerror = function () { pill.classList.add('off'); pill.title = 'Online count not available right now'; };
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
