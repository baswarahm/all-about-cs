// Exam lockdown for the mock assessments, like the real locked-down assessment:
// copy / cut / paste, right-click, drag-and-drop, print / save / view-source / developer-tools shortcuts are blocked,
// and leaving the window or full screen is detected. Every attempt shows a warning and is recorded.
// The page cannot stop Alt+Tab or closing the browser; it can only detect them (and ask before the page is closed).
// Change the wording of the warnings in MESSAGES.
(function () {
  var MESSAGES = {
    copy: 'Copying is not allowed during this assessment.',
    cut: 'Cutting text is not allowed during this assessment.',
    paste: 'Pasting is not allowed during this assessment. You must type your answer yourself.',
    shortcut: 'This keyboard shortcut is disabled during this assessment.',
    contextmenu: 'Right-click is disabled during this assessment.',
    drop: 'Dragging and dropping text is not allowed during this assessment.',
    leave: 'You left the assessment window. Leaving the assessment window is not allowed.',
    fullscreen: 'You exited full-screen mode. This assessment must be taken in full screen.',
    navigate: 'You cannot open other pages until you finish this assessment.',
    printscreen: 'Taking screenshots is not allowed during this assessment.',
  };
  var START_TEXT = 'This assessment runs in a locked mode, like the real one: copy, paste, right-click and other shortcuts are disabled, ' +
    'and leaving the window or full screen is recorded. Click the button to begin in full screen.';
  var LEFT_TEXT = 'You left the test. Return to Zen mode to continue.';

  var active = false, onViolation = null, overlay = null, count = 0;
  var lastLeave = 0, quietUntil = 0;
  var overlayKind = '', teardown = [], gateMsg = '', leftAt = 0;

  function css() {
    if (document.getElementById('lockdown-css')) return;
    var s = document.createElement('style');
    s.id = 'lockdown-css';
    s.textContent =
      '.ld-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.ld-overlay.ld-gate{background:transparent;pointer-events:none}' +
      '.ld-overlay.ld-gate .ld-box{pointer-events:auto;box-shadow:0 10px 40px rgba(0,0,0,.35)}' +
      '.ld-box{max-width:460px;width:100%;background:var(--sheet,#fff);color:var(--ink,#111);border:2px solid var(--pen,#b3261e);padding:20px 22px;font-family:var(--sans,system-ui)}' +
      '.ld-box h3{margin:0 0 10px;font-family:var(--serif,Georgia);color:var(--pen,#b3261e)}' +
      '.ld-box p{margin:0 0 12px;line-height:1.5}.ld-box .ld-count{font-size:13px;opacity:.75}' +
      '.ld-box .ld-err{color:var(--pen,#b3261e);font-weight:600}' +
      '.ld-box .ld-row{display:flex;gap:8px;justify-content:flex-end}' +
      '.ld-box button{font:inherit;font-weight:600;padding:8px 16px;border:1.5px solid var(--ink,#111);background:var(--ink,#111);color:var(--sheet,#fff);cursor:pointer}' +
      '.ld-box button.ld-cancel{background:transparent;color:var(--ink,#111)}';
    document.head.appendChild(s);
  }
  // the dialog has to be inside the element that is full screen, or it is not painted at all
  function mountRoot() {
    var fs = document.fullscreenElement;
    return (fs && fs !== document.documentElement && fs !== document.body) ? fs : document.body;
  }
  function close() {
    var fns = teardown; teardown = [];
    fns.forEach(function (fn) { try { fn(); } catch (e) {} });
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null; overlayKind = '';
  }
  function showError(text) {
    var el = overlay && overlay.querySelector('.ld-err');
    if (el) { el.textContent = text; el.hidden = false; }
  }
  // one overlay at a time: gate (full screen lost), ask (confirm dialog) or warning
  function openOverlay(o) {
    css(); close();
    var root = mountRoot(), prev = document.activeElement;
    overlayKind = o.kind || '';
    overlay = document.createElement('div');
    overlay.className = 'ld-overlay' + (o.gate ? ' ld-gate' : '');
    overlay.setAttribute('role', o.ask ? 'dialog' : 'alertdialog');
    if (o.ask) overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'ld-title');
    overlay.innerHTML = '<div class="ld-box"><h3 id="ld-title"></h3><p class="ld-text"></p>' +
      (o.footer ? '<p class="ld-count"></p>' : '') + '<p class="ld-err" hidden></p><div class="ld-row"></div></div>';
    overlay.querySelector('h3').textContent = o.title;
    overlay.querySelector('.ld-text').textContent = o.text;
    if (o.footer) overlay.querySelector('.ld-count').textContent = o.footer;
    var row = overlay.querySelector('.ld-row'), first = null;
    o.buttons.forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = b.label;
      if (!b.primary) btn.className = 'ld-cancel';
      var onClick = function () { b.onClick(); };
      btn.addEventListener('click', onClick);
      teardown.push(function () { btn.removeEventListener('click', onClick); });
      row.appendChild(btn);
      if (!first) first = btn;
    });
    if (o.enter) {
      var el = overlay, onKey = function (e) { if (e.key === 'Enter') { e.preventDefault(); o.enter(); } };
      el.addEventListener('keydown', onKey);
      teardown.push(function () { el.removeEventListener('keydown', onKey); });
    }
    teardown.push(function () { if (prev && prev !== document.body && prev.focus) { try { prev.focus(); } catch (e) {} } });
    root.appendChild(overlay);
    if (first) first.focus();
  }
  function fullscreenOK() { return !!(document.documentElement.requestFullscreen && document.fullscreenEnabled); }
  // must run straight from a click handler: requestFullscreen needs user activation
  function requestFullscreen() {
    if (!fullscreenOK()) { showError('Fullscreen is not available in this browser.'); return; }
    quietUntil = Date.now() + 1500;   // the browser's own full-screen message can steal focus for a moment
    var p;
    try { p = document.documentElement.requestFullscreen(); }
    catch (e) { showError('Fullscreen was blocked. Try again.'); return; }
    if (p && p.catch) p.catch(function () { showError('Fullscreen was blocked. Try again.'); });
  }
  function enterFullscreen() {
    if (!fullscreenOK() || document.fullscreenElement) return;
    requestFullscreen();
  }
  function gate(text, footer) {
    if (overlayKind === 'gate') {
      gateMsg = text;
      overlay.querySelector('.ld-text').textContent = text;
      if (footer) overlay.querySelector('.ld-count').textContent = footer;
      return;
    }
    gateMsg = text;
    openOverlay({
      gate: true, kind: 'gate', title: 'Assessment mode', text: text, footer: footer,
      buttons: [{ label: 'Re-enter Zen Mode', primary: true, onClick: requestFullscreen }]
    });
  }
  // after a dialog closes, bring the full-screen gate back if full screen is still lost
  function regate() {
    if (!active || overlayKind) return;
    if (fullscreenOK() && !document.fullscreenElement) gate(gateMsg || MESSAGES.fullscreen, 'This has been recorded (warning ' + count + ').');
  }

  function violate(type) {
    if (!active) return;
    count++;
    if (onViolation) onViolation(type, MESSAGES[type]);
    if (type === 'leave') leftAt = Date.now();
    if (overlayKind === 'ask') return;   // never cover a dialog the user is answering
    var footer = 'This has been recorded (warning ' + count + ').';
    if (fullscreenOK() && !document.fullscreenElement) {
      gate((type === 'leave' || Date.now() - leftAt < 5000) ? LEFT_TEXT : MESSAGES[type], footer);
    } else {
      openOverlay({ kind: 'warning', title: 'Warning', text: MESSAGES[type], footer: footer,
        buttons: [{ label: 'OK', primary: true, onClick: close }] });
    }
  }
  function block(e, type) { e.preventDefault(); e.stopPropagation(); violate(type); }

  document.addEventListener('keydown', function (e) {
    if (!active) return;
    var k = (e.key || '').toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (mod && !e.shiftKey && (k === 'c' || k === 'x' || k === 'v')) return block(e, k === 'c' ? 'copy' : k === 'x' ? 'cut' : 'paste');
    if (mod && k === 'insert') return block(e, 'copy');
    if (e.shiftKey && k === 'insert') return block(e, 'paste');
    if (e.shiftKey && k === 'delete') return block(e, 'cut');
    if (k === 'f12' || (mod && e.shiftKey && 'ijck'.indexOf(k) >= 0 && k.length === 1) ||
        (mod && !e.shiftKey && 'psuo'.indexOf(k) >= 0 && k.length === 1)) return block(e, 'shortcut');
  }, true);
  document.addEventListener('keyup', function (e) { if (active && e.key === 'PrintScreen') violate('printscreen'); }, true);
  ['copy', 'cut', 'paste'].forEach(function (ev) { document.addEventListener(ev, function (e) { if (active) block(e, ev); }, true); });
  document.addEventListener('contextmenu', function (e) { if (active) block(e, 'contextmenu'); }, true);
  document.addEventListener('drop', function (e) { if (active) block(e, 'drop'); }, true);
  document.addEventListener('dragstart', function (e) { if (active) e.preventDefault(); }, true);

  function left() {
    if (!active || Date.now() < quietUntil || Date.now() - lastLeave < 1500) return;
    lastLeave = Date.now();
    violate('leave');
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) left(); });
  window.addEventListener('blur', left);
  document.addEventListener('fullscreenchange', function () {
    if (!active) return;
    if (document.fullscreenElement) { if (overlayKind !== 'ask') close(); return; }
    quietUntil = Date.now() + 1000;
    violate('fullscreen');
  });
  window.addEventListener('beforeunload', function (e) { if (active) { e.preventDefault(); e.returnValue = ''; } });

  window.Lockdown = {
    messages: MESSAGES,
    // start({ onViolation(type, message) }) — called on every page of an assessment; does nothing if already active
    start: function (opts) {
      onViolation = opts && opts.onViolation;
      if (active) return;
      active = true;
      count = (opts && opts.count) || 0;
      if (fullscreenOK() && !document.fullscreenElement) openOverlay({
        kind: 'start', title: 'Assessment mode', text: START_TEXT,
        buttons: [{ label: 'Begin in full screen', primary: true, onClick: requestFullscreen }]
      });
    },
    stop: function () {
      if (!active) return;
      active = false; close();
      if (document.fullscreenElement && document.exitFullscreen) { try { var p = document.exitFullscreen(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
    },
    isActive: function () { return active; },
    enterFullscreen: enterFullscreen,
    warn: violate,
    // in-page confirm dialog; mounted inside the full-screen element so it is visible during a mock
    ask: function (text, onConfirm) {
      var yes = function () { close(); if (onConfirm) onConfirm(); };
      openOverlay({
        kind: 'ask', ask: true, title: 'Please confirm', text: text,
        buttons: [{ label: 'Confirm', primary: true, onClick: yes },
          { label: 'Cancel', primary: false, onClick: function () { close(); regate(); } }],
        enter: yes
      });
    },
  };
})();
