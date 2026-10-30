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

  var active = false, onViolation = null, overlay = null, count = 0;
  var lastLeave = 0, quietUntil = 0;

  function css() {
    if (document.getElementById('lockdown-css')) return;
    var s = document.createElement('style');
    s.id = 'lockdown-css';
    s.textContent =
      '.ld-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.ld-box{max-width:460px;width:100%;background:var(--sheet,#fff);color:var(--ink,#111);border:2px solid var(--pen,#b3261e);padding:20px 22px;font-family:var(--sans,system-ui)}' +
      '.ld-box h3{margin:0 0 10px;font-family:var(--serif,Georgia);color:var(--pen,#b3261e)}' +
      '.ld-box p{margin:0 0 12px;line-height:1.5}.ld-box .ld-count{font-size:13px;opacity:.75}' +
      '.ld-box button{font:inherit;font-weight:600;padding:8px 16px;border:1.5px solid var(--ink,#111);background:var(--ink,#111);color:var(--sheet,#fff);cursor:pointer}';
    document.head.appendChild(s);
  }
  function close() { if (overlay) { overlay.remove(); overlay = null; } }
  function show(title, text, buttonText, onButton, footer) {
    css(); close();
    overlay = document.createElement('div');
    overlay.className = 'ld-overlay';
    overlay.setAttribute('role', 'alertdialog');
    overlay.innerHTML = '<div class="ld-box"><h3></h3><p class="ld-text"></p>' + (footer ? '<p class="ld-count"></p>' : '') + '<button type="button"></button></div>';
    overlay.querySelector('h3').textContent = title;
    overlay.querySelector('.ld-text').textContent = text;
    if (footer) overlay.querySelector('.ld-count').textContent = footer;
    var b = overlay.querySelector('button');
    b.textContent = buttonText;
    b.addEventListener('click', function () { close(); if (onButton) onButton(); });
    document.body.appendChild(overlay);
    b.focus();
  }
  function fullscreenOK() { return !!(document.documentElement.requestFullscreen && document.fullscreenEnabled); }
  function enterFullscreen() {
    if (!fullscreenOK() || document.fullscreenElement) return;
    quietUntil = Date.now() + 1500;   // the browser's own full-screen message can steal focus for a moment
    try { var p = document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }

  function violate(type) {
    if (!active) return;
    count++;
    if (onViolation) onViolation(type, MESSAGES[type]);
    var footer = 'This has been recorded (warning ' + count + ').';
    if (type === 'fullscreen' && fullscreenOK()) show('Warning', MESSAGES[type], 'Return to full screen', enterFullscreen, footer);
    else show('Warning', MESSAGES[type], 'OK', null, footer);
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
    if (active && !document.fullscreenElement) { quietUntil = Date.now() + 1000; violate('fullscreen'); }
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
      if (fullscreenOK() && !document.fullscreenElement) show('Assessment mode', START_TEXT, 'Begin in full screen', enterFullscreen);
    },
    stop: function () {
      if (!active) return;
      active = false; close();
      if (document.fullscreenElement && document.exitFullscreen) { try { var p = document.exitFullscreen(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
    },
    isActive: function () { return active; },
    enterFullscreen: enterFullscreen,
    warn: violate,
    // use instead of window.confirm during an assessment, so the dialog is not counted as leaving the window
    confirm: function (text) { quietUntil = Date.now() + 600000; var r = window.confirm(text); quietUntil = Date.now() + 800; return r; },
  };
})();
