// CCA101 Prep - single page app (hash routing, no build step).
(function () {
  'use strict';

  // ───────────────────────── helpers ─────────────────────────
  var app = document.getElementById('app');
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('cca-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem('cca-' + k, JSON.stringify(v)); } catch (e) {} },
  };
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function fmtClock(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return h + ':' + String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
  }
  function round2(x) { return Math.round(x * 100) / 100; }
  var LETTERS = 'abcdefghij';
  var timers = [];
  function every(ms, fn) { fn(); timers.push(setInterval(fn, ms)); }
  function clearTimers() { timers.forEach(clearInterval); timers = []; }

  var PROBLEMS = window.PROBLEMS || [];
  var EXPECTED = window.PROBLEM_EXPECTED || {};
  var QUIZ = window.QUIZ || [];
  var MATERIAL = window.MATERIAL || [];
  // problems are listed easiest first inside each group
  var GROUPS = ['Sequence', 'Selection', 'Repetition'];
  var STEPS = 'Step by step';   // the easy-to-hard set in data/problems-new.js
  var PAST = 'Past Test 1 style';   // data/problems-past.js
  function groupOf(p) { return GROUPS.filter(function (g) { return p.topic.indexOf(g) === 0; })[0] || 'Other'; }
  PROBLEMS.sort(function (a, b) {
    return GROUPS.indexOf(groupOf(a)) - GROUPS.indexOf(groupOf(b)) || a.level - b.level;
  });
  var genCache = {};
  function problemById(id) {
    if (/^gen~/.test(id)) return genCache[id] || (genCache[id] = window.Generator && Generator.parseId(id));
    return PROBLEMS.filter(function (p) { return p.id === id; })[0];
  }
  function expectedFor(p, i) {
    var t = p.tests[i];
    return t && t.expected !== undefined ? t.expected : (EXPECTED[p.id] || [])[i];
  }
  function topicTitle(id) { var t = MATERIAL.filter(function (m) { return m.id === id; })[0]; return t ? t.title : id; }

  // ───────────────────────── editor ─────────────────────────
  function makeEditor(host, value, onChange, keys) {
    keys = keys || {};
    if (window.CodeMirror) {
      var extra = {
        Tab: function (c) { if (c.somethingSelected()) c.indentSelection('add'); else c.replaceSelection('    '); },
        'Shift-Tab': function (c) { c.indentSelection('subtract'); },
      };
      Object.keys(keys).forEach(function (k) { extra[k] = function () { keys[k](); }; });
      var cm = window.CodeMirror(host, {
        value: value, mode: 'text/x-c++src', lineNumbers: true, indentUnit: 4, tabSize: 4,
        matchBrackets: true, autoCloseBrackets: true, extraKeys: extra,
      });
      if (onChange) cm.on('change', function () { onChange(cm.getValue()); });
      setTimeout(function () { cm.refresh(); }, 0);
      return { getValue: function () { return cm.getValue(); }, setValue: function (v) { cm.setValue(v); }, focus: function () { cm.focus(); } };
    }
    // CodeMirror failed to load: plain textarea
    var ta = document.createElement('textarea');
    ta.className = 'fallback'; ta.spellcheck = false; ta.value = value;
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 4;
      }
    });
    if (onChange) ta.addEventListener('input', function () { onChange(ta.value); });
    host.appendChild(ta);
    return { getValue: function () { return ta.value; }, setValue: function (v) { ta.value = v; }, focus: function () { ta.focus(); } };
  }

  // Plain-English hints for the most common g++ errors.
  var ERROR_HINTS = [
    [/redeclaration of|conflicting declaration|previously declared/, 'You declared a variable that already exists. The computer-generated variables are already declared, so use them directly (write <code>x = 5;</code>, not <code>int x = 5;</code>).'],
    [/'(\w+)' was not declared in this scope/, function (m) { return '<code>' + esc(m[1]) + '</code> is used before it is declared. Check the spelling and capital letters, or declare it first (e.g. <code>int ' + esc(m[1]) + ' = 0;</code>). Variables declared inside <code>{ }</code> only exist inside that block.'; }],
    [/expected ';'/, 'A semicolon <code>;</code> is missing, usually at the end of the line <i>before</i> the one the error points to.'],
    [/expected '}' at end of input/, 'A closing brace <code>}</code> is missing. Every <code>{</code> needs a matching <code>}</code>.'],
    [/'else' without a previous 'if'/, 'There is an <code>else</code> with no matching <code>if</code>. Look for a stray <code>;</code> right after <code>if (...)</code>, or a missing <code>{ }</code> around several statements.'],
    [/lvalue required/, 'You are assigning to something that is not a variable. Did you write <code>=</code> where you meant <code>==</code>, or put the variable on the right of <code>=</code>?'],
    [/invalid operands of types '(double|float)' and '\w+' to binary 'operator%'|to binary 'operator%'/, '<code>%</code> only works with integers. Cast first, e.g. <code>static_cast&lt;int&gt;(x) % 10</code>.'],
    [/no match for 'operator(>>|<<)'/, 'Check the arrow direction: <code>cout &lt;&lt; value</code> and <code>cin &gt;&gt; variable</code>.'],
    [/expected primary-expression/, 'Something is missing or misplaced in an expression, e.g. an extra operator, a missing value, or a type name used in the wrong place.'],
    [/missing terminating " character|missing terminating ' character/, 'A string or character is missing its closing quote.'],
    [/break statement not within loop or switch|continue statement not within/, '<code>break</code>/<code>continue</code> can only be used inside a loop (or <code>break</code> inside a switch).'],
    [/jump to case label|crosses initialization/, 'You declared a variable inside a <code>case</code>. Wrap that case\'s statements in <code>{ }</code> or declare the variable before the switch.'],
  ];
  function errorHints(text) {
    var out = [];
    ERROR_HINTS.forEach(function (h) {
      var m = text.match(h[0]);
      if (m) out.push(typeof h[1] === 'function' ? h[1](m) : h[1]);
    });
    return out.length ? '<div class="callout"><b>Hint:</b> ' + out.slice(0, 2).join('<br>') + '</div>' : '';
  }

  // ───────────────────────── theme ─────────────────────────
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }
  applyTheme(store.get('theme', null));
  $('#themeBtn').addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next); store.set('theme', next);
  });

  // ───────────────────────── router ─────────────────────────
  function route() {
    clearTimers();
    app.onkeydown = null;
    var parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
    var page = parts[0] || 'home';
    $all('[data-nav]').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === page); });
    window.scrollTo(0, 0);
    var views = { home: viewHome, material: viewMaterial, quiz: viewQuiz, progass: viewProgass, generator: viewGenerator, playground: viewPlayground };
    (views[page] || viewHome)(parts.slice(1));
  }
  window.addEventListener('hashchange', route);

  // ───────────────────────── home ─────────────────────────
  var EXAMS = [
    { name: 'Programming Assessment 1', at: '2026-11-03T17:00:00+08:00', time: 'Tue 3 Nov 2026 · 17:00 – 19:00 · DUP C',
      topics: 'Week 1–6 (Week 6: repetition only). CodeRunner: complete partial programs.', link: '#/progass', cta: 'Practise coding' },
    { name: 'Test 1', at: '2026-11-10T17:30:00+08:00', time: 'Tue 10 Nov 2026 · 17:30 – 18:30 · DUP C',
      topics: 'Week 1–7 (up to basic file processing). Moodle quiz, single and multiple answer.', link: '#/quiz', cta: 'Take a mock test' },
  ];
  function viewHome() {
    var solved = PROBLEMS.filter(function (p) { return (store.get('prog-' + p.id, {}).best || 0) > 0; }).length;
    var hist = store.get('quiz-history', []);
    var bestQuiz = hist.reduce(function (m, h) { return Math.max(m, h.pct); }, 0);
    var solvedPct = PROBLEMS.length ? Math.round(100 * solved / PROBLEMS.length) : 0;
    var genHist = store.get('gen-history', []);
    var toc = [
      ['#/material', 'Notes', 'Lecture material, weeks 1–5, with code you can run', MATERIAL.filter(function (m) { return !m.placeholder; }).length + ' topics'],
      ['#/quiz', 'Test 1 mock', 'Moodle-style quiz, timed or by topic' + (hist.length ? ', best so far ' + bestQuiz + '%' : ''), QUIZ.length + ' questions'],
      ['#/progass', 'ProgrAss practice', 'CodeRunner problems with hidden tests and penalties', solved + '/' + PROBLEMS.length + ' solved'],
      ['#/generator', 'Question generator', 'A fresh, never-seen-before coding question every time', genHist.length ? genHist.length + ' generated' : '∞'],
      ['#/playground', 'Scratchpad', 'Run any C++ program with keyboard input', 'g++ 13'],
    ];
    app.innerHTML =
      '<section class="cover">' +
        '<div class="cover-main">' +
          '<div class="kicker">CCA101 · Session 2026/2027</div>' +
          '<h1 class="cover-title">Principles of<br>Programming</h1>' +
          '<p class="cover-sub">CCA101 / CPT111. Everything for ProgrAss 1 and Test 1 in one place: notes, a mock test, and coding questions marked by a real compiler.</p>' +
          '<div class="row"><a class="btn primary" href="#/generator">Generate a question</a><a class="btn" href="#/quiz">Sit the mock test</a></div>' +
        '</div>' +
        '<aside class="timetable"><div class="kicker">Timetable</div>' +
          EXAMS.map(function (e, i) {
            return '<a class="tt-row" href="' + e.link + '"><div class="tt-name">' + esc(e.name) + '</div>' +
              '<div class="tt-when">' + esc(e.time) + '</div><div class="tt-topics">' + esc(e.topics) + '</div>' +
              '<div class="tt-count" id="cd' + i + '"></div></a>';
          }).join('') +
        '</aside>' +
      '</section>' +
      '<section class="toc"><div class="kicker">Contents</div><ol>' + toc.map(function (t, i) {
        return '<li><a href="' + t[0] + '"><span class="toc-no">' + (i + 1) + '</span><span class="toc-text"><b>' + esc(t[1]) + '</b><small>' + esc(t[2]) + '</small></span>' +
          '<span class="toc-dots"></span><span class="toc-meta">' + esc(t[3]) + '</span></a></li>';
      }).join('') + '</ol></section>' +
      '<section class="progress-strip"><span class="kicker">Coding progress</span><div class="bar"><span style="width:' + solvedPct + '%"></span></div><span class="mono small">' + solvedPct + '%</span></section>';
    every(1000, function () {
      EXAMS.forEach(function (e, i) {
        var el = $('#cd' + i); if (!el) return;
        var ms = new Date(e.at) - new Date();
        if (ms <= 0) { el.textContent = 'done, good luck'; return; }
        var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
        el.textContent = 'in ' + d + 'd ' + String(h).padStart(2, '0') + 'h ' + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
      });
    });
  }

  // ───────────────────────── material ─────────────────────────
  function viewMaterial(args) {
    var id = args[0] || MATERIAL[0].id;
    var idx = MATERIAL.findIndex(function (m) { return m.id === id; });
    if (idx < 0) idx = 0;
    var t = MATERIAL[idx];
    var prev = MATERIAL[idx - 1], next = MATERIAL[idx + 1];
    app.innerHTML =
      '<div class="layout-side">' +
        '<nav class="side card" style="padding:10px">' + MATERIAL.map(function (m) {
          return '<a href="#/material/' + m.id + '" class="' + (m.id === t.id ? 'active ' : '') + (m.placeholder ? 'dim' : '') + '">' +
            esc(m.title) + '<small>' + esc(m.week) + '</small></a>';
        }).join('') + '</nav>' +
        '<article class="card material">' +
          '<div class="row"><span class="pill accent">' + esc(t.week) + '</span>' +
            t.test.map(function (x) { return '<span class="pill">' + esc(x) + '</span>'; }).join('') + '</div>' +
          '<h1 style="margin-top:10px">' + esc(t.title) + '</h1>' +
          t.sections.map(function (s) { return '<section><h2>' + esc(s.h) + '</h2>' + s.html + '</section>'; }).join('') +
          '<div class="topic-nav">' +
            (prev ? '<a class="btn" href="#/material/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<span></span>') +
            (next ? '<a class="btn" href="#/material/' + next.id + '">' + esc(next.title) + ' →</a>' : '<a class="btn primary" href="#/quiz">Test yourself →</a>') +
          '</div>' +
        '</article>' +
      '</div>';
    // "Try it" buttons on runnable examples
    $all('pre.code', app).forEach(function (pre) {
      var wrap = document.createElement('div'); wrap.className = 'code-wrap';
      pre.parentNode.insertBefore(wrap, pre); wrap.appendChild(pre);
      if (!/int\s+main\s*\(/.test(pre.textContent)) return;
      var b = document.createElement('button'); b.className = 'btn small try'; b.textContent = '▶ Try it';
      b.addEventListener('click', function () {
        store.set('playground', { code: pre.textContent, stdin: store.get('playground', {}).stdin || '' });
        location.hash = '#/playground';
      });
      wrap.appendChild(b);
    });
  }

  // ───────────────────────── quiz ─────────────────────────
  var MOCK_QUESTIONS = 30;
  // Like the past Test 1, the mock also has 2–5 CodeRunner questions mixed in (default 4), worth CODE_MARKS each,
  // with the Moodle quiz penalty regime "10, 20, ... %" (the first Check is free).
  var CODING_CHOICES = [2, 3, 4, 5], CODING_DEFAULT = 4, CODE_MARKS = 10;
  // the real Test 1 is 2 hours, whatever the number of programming questions
  var TEST1_MINUTES = 120;
  function mockMinutes() { return TEST1_MINUTES; }
  function quizPenalty(checkNo) { return Math.min(100, Math.max(0, (checkNo - 1) * 10)); }
  // about half from the past-Test-1-style set, the rest from the step-by-step set / easier bank problems
  function pickTestCoding(count, avoid) {
    avoid = avoid || [];
    var ok = function (p) { return avoid.indexOf(p.id) < 0; };
    var past = PROBLEMS.filter(function (p) { return p.set === 'past' && ok(p); });
    var rest = PROBLEMS.filter(function (p) { return p.set !== 'past' && (p.set === 'steps' || p.level <= 2) && ok(p); });
    var fromPast = shuffle(past).slice(0, Math.ceil(count / 2));
    return fromPast.concat(shuffle(rest).slice(0, count - fromPast.length)).map(function (p) { return p.id; });
  }
  function addCoding(items, ids) {
    ids.forEach(function (id) { items.splice(Math.floor(Math.random() * (items.length + 1)), 0, { c: id }); });
  }

  // Moodle-style marking: each correct option ticked earns 1/k, each wrong option ticked loses 1/k, never below 0.
  function scoreQ(q, sel) {
    sel = sel || [];
    if (!q.m) return sel.length === 1 && sel[0] === q.a[0] ? 1 : 0;
    var k = q.a.length, good = 0, badN = 0;
    sel.forEach(function (i) { if (q.a.indexOf(i) >= 0) good++; else badN++; });
    return Math.max(0, (good - badN) / k);
  }
  function scoreClass(s) { return s >= 0.999 ? 'right' : s > 0 ? 'partial' : 'wrong'; }
  function pillClass(s) { return s >= 0.999 ? 'ok' : s > 0 ? 'warn' : 'bad'; }

  function viewQuiz(args) {
    var mode = args[0];
    if (mode === 'mock') return quizMock();
    if (mode === 'practice') return quizPractice();
    var mock = store.get('quiz-mock', null);
    var hist = store.get('quiz-history', []);
    var topics = [];
    QUIZ.forEach(function (q) { if (topics.indexOf(q.t) < 0) topics.push(q.t); });
    app.innerHTML =
      '<header class="page-head"><div class="kicker">Section 2</div><h1>Test 1 mock</h1>' +
      '<p class="lede">Like the Moodle quiz: some questions have one answer (radio), others are <b>select one or more</b> (checkboxes). ' +
      'In multiple-answer questions each correct tick earns part of the mark and each wrong tick takes the same amount off, so don\'t tick everything.</p></header>' +
      '<div class="grid grid-2">' +
        '<div class="card"><h2>Timed mock test</h2>' +
          '<p>' + MOCK_QUESTIONS + ' random questions from all ' + QUIZ.length + ' + programming (CodeRunner) questions, ' + CODE_MARKS +
            ' marks each, compiled with g++ like the past Test 1. ' + TEST1_MINUTES / 60 + ' hours, like the real Test 1. Review with explanations at the end.</p>' +
          (mock && !mock.finished ? '<p class="pill warn">Attempt in progress</p> ' : '') +
          '<label class="small muted">Programming questions <select id="codeCount" class="select">' + CODING_CHOICES.map(function (n) {
            return '<option value="' + n + '"' + (n === store.get('mock-coding', CODING_DEFAULT) ? ' selected' : '') + '>' + n + ' (' +
              (MOCK_QUESTIONS + n * CODE_MARKS) + ' marks)</option>';
          }).join('') + '</select></label>' +
          '<div class="row" style="margin-top:10px">' +
            (mock && !mock.finished ? '<a class="btn primary" href="#/quiz/mock">Continue attempt</a><button class="btn" id="newMock">Start over</button>'
              : '<button class="btn primary" id="newMock">Start mock test</button>') +
            (mock && mock.finished ? '<a class="btn" href="#/quiz/mock">Review last attempt</a>' : '') +
          '</div>' +
          (hist.length ? '<h3 style="margin-top:18px">Past attempts</h3><table class="mini"><tr><th>Date</th><th>Score</th></tr>' +
            hist.slice(-6).reverse().map(function (h) { return '<tr><td>' + esc(new Date(h.date).toLocaleString()) + '</td><td><b>' + h.pct + '%</b> (' + h.score + ' / ' + h.total + ')</td></tr>'; }).join('') + '</table>' : '') +
        '</div>' +
        '<div class="card"><h2>Practice by topic</h2><p>Instant feedback after each question. Pick topics:</p>' +
          '<div class="topic-checks">' + topics.map(function (t) {
            var n = QUIZ.filter(function (q) { return q.t === t; }).length;
            return '<label><input type="checkbox" value="' + t + '" checked> ' + esc(topicTitle(t)) + ' <span class="muted small">(' + n + ')</span></label>';
          }).join('') + '</div>' +
          '<button class="btn primary" id="startPractice">Start practice</button>' +
        '</div>' +
      '</div>';
    $('#newMock').addEventListener('click', function () {
      if (mock && !mock.finished && !confirm('Discard the attempt in progress?')) return;
      var coding = +$('#codeCount').value || CODING_DEFAULT;
      store.set('mock-coding', coding);
      var items = shuffle(QUIZ.map(function (_, i) { return i; })).slice(0, MOCK_QUESTIONS).map(function (i) { return { q: i }; });
      // put the programming questions at random places in the paper, as in the past Test 1
      addCoding(items, pickTestCoding(coding));
      store.set('quiz-mock', { items: items, answers: {}, flags: {}, codes: {}, checks: {}, marks: {}, results: {}, checkedCode: {},
        cur: 0, start: Date.now(), end: Date.now() + mockMinutes() * 60000, finished: false });
      location.hash = '#/quiz/mock';
    });
    $('#startPractice').addEventListener('click', function () {
      var sel = $all('.topic-checks input:checked').map(function (c) { return c.value; });
      if (!sel.length) return;
      var qs = shuffle(QUIZ.map(function (_, i) { return i; }).filter(function (i) { return sel.indexOf(QUIZ[i].t) >= 0; }));
      store.set('quiz-practice', { qs: qs, cur: 0, answers: {}, checked: {} });
      location.hash = '#/quiz/practice';
    });
  }

  function renderOptions(q, sel, name, locked) {
    return '<div class="opts">' + q.o.map(function (o, i) {
      var on = sel.indexOf(i) >= 0;
      var cls = 'opt' + (on ? ' sel' : '') + (locked ? ' locked' : '');
      if (locked) {
        if (q.a.indexOf(i) >= 0) cls += ' correct';
        else if (on) cls += ' incorrect';
      }
      return '<label class="' + cls + '"><input type="' + (q.m ? 'checkbox' : 'radio') + '" name="' + name + '" value="' + i + '"' +
        (on ? ' checked' : '') + (locked ? ' disabled' : '') + '><span class="letter">' + LETTERS[i] + '.</span><span class="otext">' + o + '</span>' +
        (locked && on ? '<span class="yours">your answer</span>' : '') + '</label>';
    }).join('') + '</div>';
  }
  function readSel(root) { return $all('.opts input:checked', root).map(function (c) { return +c.value; }); }
  function bindOptions(onPick) {
    $all('.opts input', app).forEach(function (inp) {
      inp.addEventListener('change', function () {
        $all('.opt', app).forEach(function (l) { l.classList.toggle('sel', $('input', l).checked); });
        onPick(readSel(app));
      });
    });
  }

  function quizMock() {
    var st = store.get('quiz-mock', null);
    if (!st) { location.hash = '#/quiz'; return; }
    // attempts saved before programming questions were added only have qs (quiz indexes)
    if (!st.items) { st.items = st.qs.map(function (i) { return { q: i }; }); st.codes = {}; st.checks = {}; st.marks = {}; st.results = {}; st.checkedCode = {}; }
    // an unfinished attempt started before programming questions existed gets them now (and the extra time)
    if (!st.finished && !st.items.some(function (x) { return x.c; })) {
      var add = store.get('mock-coding', CODING_DEFAULT);
      // answers are stored by position, so only append at the end to keep them on the right questions
      pickTestCoding(add).forEach(function (id) { st.items.push({ c: id }); });
      st.end = Math.max(st.end, st.start + mockMinutes() * 60000);
      store.set('quiz-mock', st);
    }
    var items = st.items;
    function save() { store.set('quiz-mock', st); }
    function maxOf(it) { return it.c ? CODE_MARKS : 1; }
    function scoreOf(it, i) { return it.c ? (st.marks[i] || 0) / 100 * CODE_MARKS : scoreQ(QUIZ[it.q], st.answers[i]); }
    function answered(it, i) { return it.c ? !!(st.codes[i] || '').trim() : (st.answers[i] || []).length > 0; }
    var totalMax = items.reduce(function (a, it) { return a + maxOf(it); }, 0);

    // Check a programming answer: every test must pass; the mark is 100% minus the penalty for this check, best mark kept.
    function checkCode(i) {
      var p = problemById(items[i].c), code = st.codes[i] || '';
      st.checks[i] = (st.checks[i] || 0) + 1;
      var pen = quizPenalty(st.checks[i]);
      var idxs = p.tests.map(function (_, k) { return k; });
      return runTests(p, idxs, code).then(function (res) {
        var passed = res.results.filter(function (r) { return r && r.pass; }).length;
        var allPass = !res.compileError && passed === idxs.length;
        var mark = allPass ? 100 - pen : 0;
        st.marks[i] = Math.max(st.marks[i] || 0, mark);
        st.checkedCode[i] = code;
        st.results[i] = (allPass ? '<div class="result-banner ok">Passed all tests! ✓ Mark for this submission: ' + round2(mark / 100 * CODE_MARKS) + ' / ' + CODE_MARKS + '</div>'
          : '<div class="result-banner bad">' + (res.compileError ? 'Compilation failed.' : 'Passed ' + passed + ' of ' + idxs.length + ' tests.') +
            ' Your code must pass every test to earn marks.</div>') + renderResults(p, idxs, res, allPass);
        save();
        return allPass;
      });
    }

    function finish() {
      clearTimers();
      // answers that were typed but never checked (or changed after the last check) are checked now, like Moodle on "Submit all"
      var pending = items.map(function (it, i) { return i; }).filter(function (i) {
        return items[i].c && (st.codes[i] || '').trim() && st.checkedCode[i] !== st.codes[i];
      });
      if (pending.length) app.innerHTML = '<div class="result-banner info"><span class="spin"></span> Marking your programming answers with g++…</div>';
      pending.reduce(function (chain, i) { return chain.then(function () { return checkCode(i); }); }, Promise.resolve())
        .catch(function () {})
        .then(function () {
          st.finished = true;
          var total = items.reduce(function (a, it, i) { return a + scoreOf(it, i); }, 0);
          st.score = round2(total); st.total = totalMax;
          var hist = store.get('quiz-history', []);
          hist.push({ date: Date.now(), score: st.score, total: totalMax, pct: Math.round(100 * total / totalMax) });
          store.set('quiz-history', hist);
          st.cur = 0; save(); render();
        });
    }

    function codingBody(it, n, done) {
      var p = problemById(it.c);
      var examples = p.tests.map(function (_, k) { return k; }).filter(function (k) { return !p.tests[k].hidden; });
      var checks = st.checks[n] || 0;
      return '<div class="qtext">' + p.desc +
          '<p style="margin-top:14px"><b>Given the partial program:</b></p><div class="partial-prog">' + renderPartialProgram(p) + '</div>' +
          '<p style="margin-top:14px"><b>For example:</b></p><div class="table-scroll"><table class="tests"><tr><th>Input</th><th>Result</th></tr>' +
          examples.map(function (k) { return '<tr><td>' + testInputCell(p.tests[k]) + '</td><td><pre>' + esc(expectedFor(p, k)) + '</pre></td></tr>'; }).join('') +
          '</table></div></div>' +
        (done
          ? '<p><b>Your answer:</b></p><pre class="plain">' + esc(st.codes[n] || '(no answer)') + '</pre>' + (st.results[n] || '') +
            '<div class="explain ok"><b>Model answer (one possible solution):</b><pre class="plain">' + esc(p.solution) + '</pre></div>'
          : '<div class="row"><b>Answer:</b> <span class="penalty">(penalty regime: 10, 20, … %)</span><span class="spacer"></span>' +
              '<span class="small muted">Checks used: <b>' + checks + '</b> · next check penalty <b>' + quizPenalty(checks + 1) + '%</b></span></div>' +
            '<div class="editor-wrap" id="editor"></div>' +
            '<div class="row" style="margin-top:10px"><button class="btn" id="precheck">Precheck</button><button class="btn primary" id="check">Check</button></div>' +
            '<div id="results">' + (st.results[n] || '') + '</div>');
    }

    function render() {
      clearTimers();
      var n = st.cur, it = items[n], done = st.finished;
      var q = it.c ? null : QUIZ[it.q], sel = st.answers[n] || [];
      var s = done ? scoreOf(it, n) : 0, frac = s / maxOf(it);
      var finalScore = st.score, finalMax = st.total || totalMax;
      app.innerHTML =
        (done ? '<div class="card" style="margin-bottom:16px"><div class="row"><div><div class="muted small">Your score</div>' +
          '<div class="score-big">' + Math.round(100 * finalScore / finalMax) + '%</div></div>' +
          '<div class="muted">' + finalScore + ' / ' + finalMax + ' marks · review each question below</div><span class="spacer"></span>' +
          '<a class="btn" href="#/quiz">Back</a></div></div>' : '') +
        '<div class="quiz-layout">' +
          '<div class="card question">' +
            '<div class="qhead"><div><b>Question ' + (n + 1) + '</b> <span class="muted small">of ' + items.length + '</span> ' +
              (it.c ? '<span class="pill accent">Programming · ' + CODE_MARKS + ' marks</span>' : '<span class="pill">' + esc(topicTitle(q.t)) + '</span>') + '</div>' +
              (done ? '<span class="pill ' + pillClass(frac) + '">Mark ' + round2(s) + ' / ' + maxOf(it) + '</span>'
                : '<label class="small"><input type="checkbox" id="flag"' + (st.flags[n] ? ' checked' : '') + '> Flag question</label>') +
            '</div>' +
            (it.c ? codingBody(it, n, done)
              : '<div class="qtext">' + q.q + '</div>' +
                '<div class="muted small" style="margin-bottom:8px">' + (q.m ? 'Select one or more:' : 'Select one:') + '</div>' +
                renderOptions(q, sel, 'q' + n, done) +
                (done ? '<div class="explain ' + pillClass(s).replace('warn', 'partial').replace('bad', 'bad') + '"><b>Correct answer: ' +
                  q.a.map(function (i) { return LETTERS[i]; }).join(', ') + '.</b> ' + q.e + '</div>' : '')) +
            '<div class="row" style="margin-top:16px">' +
              '<button class="btn" id="prev"' + (n === 0 ? ' disabled' : '') + '>← Previous</button>' +
              (!done && !it.c && sel.length ? '<button class="btn ghost small" id="clear">Clear my choice</button>' : '') +
              '<span class="spacer"></span>' +
              (n < items.length - 1 ? '<button class="btn primary" id="next">Next page →</button>'
                : (!done ? '<button class="btn primary" id="finish">Finish attempt…</button>' : '')) +
            '</div>' +
          '</div>' +
          '<aside class="card qnav">' +
            '<b>Quiz navigation</b>' +
            (!done ? '<div class="row" style="margin-top:6px"><span class="muted small">Time left</span><span class="timer" id="timer"></span></div>' : '') +
            '<div class="qgrid">' + items.map(function (x, i) {
              var c = '';
              if (done) c = scoreClass(scoreOf(x, i) / maxOf(x));
              else if (answered(x, i)) c = 'answered';
              if (i === n) c += ' current';
              if (st.flags[i] && !done) c += ' flag';
              return '<button data-go="' + i + '" class="' + c + '"' + (x.c ? ' title="Programming question"' : '') + '>' + (i + 1) + (x.c ? '*' : '') + '</button>';
            }).join('') + '</div>' +
            '<div class="muted small" style="margin:6px 0">* = programming question</div>' +
            (!done ? '<button class="btn small" id="finish2">Finish attempt…</button>' : '') +
          '</aside>' +
        '</div>';
      if (!done && it.c) {
        var p = problemById(it.c), busy = false;
        makeEditor($('#editor'), st.codes[n] || '', function (v) {
          st.codes[n] = v; save();
          var b = $('[data-go="' + n + '"]'); if (b) b.classList.toggle('answered', !!v.trim());
        });
        var run = function (all) {
          if (busy) return;
          if (!(st.codes[n] || '').trim()) { $('#results').innerHTML = '<div class="result-banner bad">The answer box is empty.</div>'; return; }
          busy = true;
          $('#precheck').disabled = $('#check').disabled = true;
          $('#results').innerHTML = '<div class="result-banner info"><span class="spin"></span> Compiling with g++ and running the tests…</div>';
          var done2 = function () { busy = false; if (st.cur === n && !st.finished) render(); };
          if (all) { checkCode(n).then(done2, function (e) { busy = false; $('#results').innerHTML = '<div class="result-banner bad">Could not run your code: ' + esc(e.message || e) + '</div>'; }); return; }
          var ex = p.tests.map(function (_, k) { return k; }).filter(function (k) { return !p.tests[k].hidden; });
          runTests(p, ex, st.codes[n]).then(function (res) {
            busy = false;
            $('#precheck').disabled = $('#check').disabled = false;
            var passed = res.results.filter(function (r) { return r && r.pass; }).length;
            $('#results').innerHTML = (!res.compileError && passed === ex.length
              ? '<div class="result-banner ok">Precheck: the example tests pass. Press Check to run the hidden tests too.</div>'
              : '<div class="result-banner bad">Precheck: ' + (res.compileError ? 'compilation failed.' : passed + ' of ' + ex.length + ' example tests pass.') + '</div>') +
              renderResults(p, ex, res);
          }, function (e) { busy = false; $('#precheck').disabled = $('#check').disabled = false; $('#results').innerHTML = '<div class="result-banner bad">Could not run your code: ' + esc(e.message || e) + '</div>'; });
        };
        $('#precheck').addEventListener('click', function () { run(false); });
        $('#check').addEventListener('click', function () { run(true); });
      }
      if (!done) {
        if (!it.c) bindOptions(function (picked) {
          st.answers[n] = picked; save();
          var b = $('[data-go="' + n + '"]'); if (b) b.classList.toggle('answered', picked.length > 0);
        });
        $('#flag').addEventListener('change', function (e) { st.flags[n] = e.target.checked; save(); render(); });
        if ($('#clear')) $('#clear').addEventListener('click', function () { st.answers[n] = []; save(); render(); });
        var ask = function () {
          var unanswered = items.filter(function (x, i) { return !answered(x, i); }).length;
          if (confirm('Submit all and finish?' + (unanswered ? '\n' + unanswered + ' question(s) not answered.' : ''))) finish();
        };
        if ($('#finish')) $('#finish').addEventListener('click', ask);
        $('#finish2').addEventListener('click', ask);
        every(1000, function () {
          var left = st.end - Date.now(), el = $('#timer');
          if (left <= 0) { finish(); return; }
          if (el) { el.textContent = fmtClock(left); el.classList.toggle('low', left < 5 * 60000); }
        });
      }
      $('#prev').addEventListener('click', function () { st.cur--; save(); render(); });
      if ($('#next')) $('#next').addEventListener('click', function () { st.cur++; save(); render(); });
      $all('[data-go]', app).forEach(function (b) {
        b.addEventListener('click', function () { st.cur = +b.getAttribute('data-go'); save(); render(); });
      });
    }
    render();
  }

  function quizPractice() {
    var st = store.get('quiz-practice', null);
    if (!st || !st.qs.length) { location.hash = '#/quiz'; return; }
    function save() { store.set('quiz-practice', st); }
    function render() {
      var n = st.cur, q = QUIZ[st.qs[n]], sel = st.answers[n] || [], checked = !!st.checked[n];
      var s = checked ? scoreQ(q, sel) : 0;
      var doneN = Object.keys(st.checked).length;
      var tot = Object.keys(st.checked).reduce(function (a, k) { return a + scoreQ(QUIZ[st.qs[k]], st.answers[k]); }, 0);
      app.innerHTML =
        '<div class="row" style="margin-bottom:14px"><a class="btn small" href="#/quiz">← Back</a>' +
          '<span class="muted">Practice · question ' + (n + 1) + ' of ' + st.qs.length + '</span><span class="spacer"></span>' +
          '<span class="pill accent">Score so far: ' + round2(tot) + ' / ' + doneN + '</span></div>' +
        '<div class="bar" style="margin-bottom:14px"><span style="width:' + Math.round(100 * (n + 1) / st.qs.length) + '%"></span></div>' +
        '<div class="card question" style="max-width:820px">' +
          '<div class="qhead"><span class="pill">' + esc(topicTitle(q.t)) + '</span>' +
            (checked ? '<span class="pill ' + pillClass(s) + '">Mark ' + round2(s) + ' / 1</span>' : '') + '</div>' +
          '<div class="qtext">' + q.q + '</div>' +
          '<div class="muted small" style="margin-bottom:8px">' + (q.m ? 'Select one or more:' : 'Select one:') + '</div>' +
          renderOptions(q, sel, 'p' + n, checked) +
          (checked ? '<div class="explain ' + (s >= .999 ? 'ok' : s > 0 ? 'partial' : 'bad') + '"><b>' + (s >= .999 ? 'Correct!' : s > 0 ? 'Partially correct.' : 'Incorrect.') +
            ' Answer: ' + q.a.map(function (i) { return LETTERS[i]; }).join(', ') + '.</b> ' + q.e + '</div>' : '') +
          '<div class="row" style="margin-top:16px">' +
            '<button class="btn" id="prev"' + (n === 0 ? ' disabled' : '') + '>← Previous</button><span class="spacer"></span>' +
            (!checked ? '<button class="btn primary" id="check">Check</button>' : '') +
            (n < st.qs.length - 1 ? '<button class="btn' + (checked ? ' primary' : '') + '" id="next">Next →</button>' : '<a class="btn" href="#/quiz">Done</a>') +
          '</div>' +
        '</div>';
      if (!checked) {
        bindOptions(function (picked) { st.answers[n] = picked; save(); });
        $('#check').addEventListener('click', function () { st.answers[n] = readSel(app); st.checked[n] = true; save(); render(); });
      }
      $('#prev').addEventListener('click', function () { st.cur--; save(); render(); });
      if ($('#next')) $('#next').addEventListener('click', function () { st.cur++; save(); render(); });
    }
    render();
  }

  // ───────────────────────── ProgrAss (CodeRunner) ─────────────────────────
  var FREE_CHECKS = 20;
  function penaltyFor(checkNo) { return checkNo <= FREE_CHECKS ? 0 : Math.min(100, (checkNo - FREE_CHECKS) * 5); }
  var PENALTY_TEXT = 'penalty regime: ' + FREE_CHECKS + ' free checks, then 5, 10, 15, … 100 %';
  // the real Programming Assessment: 2–4 programming questions in 1 hour
  var PA_MINUTES = 60, PA_COUNTS = [2, 3, 4], PA_DEFAULT = 3;

  function progState(id) { return store.get('prog-' + id, { code: '', checks: 0, best: 0 }); }
  function saveProg(id, s) { store.set('prog-' + id, s); }
  function levelStars(l) { return '<span class="lvl" title="Difficulty ' + l + ' of 3">' + '★★★'.slice(0, l) + '<span class="dimstar">' + '★★★'.slice(l) + '</span></span>'; }
  function activeMock() { var m = store.get('pa-mock', null); return m && !m.finished ? m : null; }

  // generated mock: one selection/sequence question, then repetition, with a nested-loop question near the end
  function pickGeneratedMock(count) {
    var fams = Generator.families;
    var sel = shuffle(fams.filter(function (f) { return f.group !== 'Repetition'; }));
    var repf = shuffle(fams.filter(function (f) { return f.group === 'Repetition' && f.key !== 'pattern'; }));
    var keys = [sel[0].key, repf[0].key, 'pattern'];
    var pool = shuffle(sel.slice(1).concat(repf.slice(1)));
    while (keys.length < count && pool.length) keys.splice(keys.length - 1, 0, pool.shift().key);
    return keys.slice(0, count).map(function (k) { return 'gen~' + k + '~' + Generator.randomSeed(); });
  }

  function pickMockProblems(count) {
    var taken = {};
    function take(list) {
      var p = shuffle(list).filter(function (x) { return !taken[x.id]; })[0];
      if (p) taken[p.id] = true;
      return p;
    }
    var picks = [
      take(PROBLEMS.filter(function (p) { return groupOf(p) !== 'Repetition' && p.level >= 2; })),
      take(PROBLEMS.filter(function (p) { return groupOf(p) === 'Repetition' && p.level === 2; })),
      take(PROBLEMS.filter(function (p) { return p.level === 3; })),
    ];
    while (picks.length < count) picks.push(take(PROBLEMS.filter(function (p) { return p.level >= 2 || picks.length > 4; })));
    return picks.slice(0, count).filter(Boolean).sort(function (a, b) { return a.level - b.level; }).map(function (p) { return p.id; });
  }

  function viewProgass(args) {
    if (args[0] === 'mock') return progassMockSummary();
    if (args[0]) return viewProblem(args[0]);
    var mock = store.get('pa-mock', null);
    var filter = store.get('pa-filter', 'All');
    var solved = PROBLEMS.filter(function (p) { return progState(p.id).best > 0; }).length;
    var countPicker = '<label class="small muted">Questions <select id="mockCount" class="select">' + PA_COUNTS.map(function (n) {
      return '<option value="' + n + '"' + (n === store.get('pa-count', PA_DEFAULT) ? ' selected' : '') + '>' + n + '</option>';
    }).join('') + '</select></label>' +
      '<label class="small muted">From <select id="mockSrc" class="select">' +
      [['gen', 'generator (new every time)'], ['bank', 'question bank'], ['mix', 'mix of both']].map(function (o) {
        return '<option value="' + o[0] + '"' + (store.get('mock-src', 'gen') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
      }).join('') + '</select></label>';
    app.innerHTML =
      '<header class="page-head"><div class="kicker">Section 3</div><h1>ProgrAss 1 practice</h1>' +
      '<p class="lede">Works like CodeRunner on Moodle. Each question gives you a <b>partial program</b>; the variables are generated by the computer, so don\'t re-declare them. ' +
      'Type only your part. <b>Precheck</b> runs the example tests for free. <b>Check</b> runs every test including the hidden ones, and counts towards the penalty regime. ' +
      'Your code is compiled with real <b>g++</b>, just like the assessment. Finished them all? The <a href="#/generator">question generator</a> makes endless new ones.</p></header>' +
      '<div class="card mock-card"><div class="row"><div><h2 style="margin:0">Mock ProgrAss</h2>' +
        '<div class="muted small">' + PA_COUNTS[0] + '–' + PA_COUNTS[PA_COUNTS.length - 1] + ' random questions in ' + PA_MINUTES + ' minutes, like the real assessment. Model answers stay locked until you finish.</div></div><span class="spacer"></span>' +
        (activeMock()
          ? '<a class="btn primary" href="#/progass/' + activeMock().ids[0] + '">Continue mock</a>' + countPicker + '<button class="btn" id="mockStart">Start over</button>'
          : countPicker + '<button class="btn primary" id="mockStart">Start mock</button>' +
            (mock && mock.finished ? '<a class="btn" href="#/progass/mock">Last result</a>' : '')) +
      '</div></div>' +
      '<div class="row" style="margin:20px 0 10px"><div class="chips" id="chips">' + ['All'].concat(GROUPS, [STEPS, PAST]).map(function (g) {
        return '<button class="chip' + (g === filter ? ' on' : '') + '" data-f="' + g + '">' + g + '</button>';
      }).join('') + '</div><span class="spacer"></span><span class="muted small">' + solved + ' / ' + PROBLEMS.length + ' solved</span>' +
        '<div class="bar" style="width:140px"><span style="width:' + Math.round(100 * solved / PROBLEMS.length) + '%"></span></div></div>' +
      '<div class="plist">' + PROBLEMS.filter(function (p) { return filter === 'All' || groupOf(p) === filter || (filter === STEPS && p.set === 'steps') || (filter === PAST && p.set === 'past'); }).map(function (p) {
        var s = progState(p.id);
        var status = s.best > 0 ? '<span class="pill ok">✓ ' + s.best + '%</span>' : s.checks ? '<span class="pill warn">attempted</span>' : '';
        return '<a class="pitem" href="#/progass/' + p.id + '"><span class="pnum">' + (PROBLEMS.indexOf(p) + 1) + '</span><div><div class="ptitle">' + esc(p.title) + '</div>' +
          '<div class="muted small">' + esc(p.topic) + ' · ' + p.tests.length + ' tests</div></div><span class="spacer"></span>' +
          status + levelStars(p.level) + '</a>';
      }).join('') + '</div>';
    $all('#chips .chip').forEach(function (c) {
      c.addEventListener('click', function () { store.set('pa-filter', c.getAttribute('data-f')); viewProgass([]); });
    });
    $('#mockStart').addEventListener('click', function () {
      if (activeMock() && !confirm('Discard the current mock attempt?')) return;
      var count = +$('#mockCount').value, src = $('#mockSrc').value;
      store.set('pa-count', count);
      store.set('mock-src', src);
      var ids;
      if (src === 'bank') ids = pickMockProblems(count);
      else if (src === 'gen') ids = pickGeneratedMock(count);
      else {
        var g = pickGeneratedMock(count), b = pickMockProblems(count);
        ids = g.map(function (x, i) { return i % 2 ? b[i] || x : x; });
      }
      store.set('pa-mock', { ids: ids, start: Date.now(), end: Date.now() + PA_MINUTES * 60000, finished: false, codes: {}, checks: {}, best: {} });
      location.hash = '#/progass/' + ids[0];
    });
  }

  function renderPartialProgram(p) {
    var t0 = p.tests[0];
    var src = p.template.replace('{{VARS}}', '\u0001' + (t0.vars || '') + '\u0002').replace('{{ANSWER}}', '\u0003');
    return esc(src)
      .replace(/\u0001([\s\S]*?)\u0002/, function (_, v) { return v; })
      .replace(/(\/\/Variables generated by computer[^\n]*|\/\/type in your answer[^\n]*)/g, '<span class="comp">$1</span>')
      .replace('\u0003', '<span class="gap">    ⟵ your answer goes here</span>');
  }

  function testInputCell(t) {
    var parts = [];
    if (t.vars) parts.push(esc(t.vars.replace(/^ {4}/gm, '')));
    if (t.stdin) parts.push('<span class="muted">keyboard input:</span>\n' + esc(t.stdin));
    return '<pre>' + parts.join('\n') + '</pre>';
  }

  function viewProblem(id) {
    var p = problemById(id);
    if (!p) { app.innerHTML = '<p>Problem not found. <a href="#/progass">Back</a></p>'; return; }
    var mock = activeMock();
    var inMock = !!(mock && mock.ids.indexOf(id) >= 0);
    var st = progState(id);
    var code = inMock ? (mock.codes[id] || '') : st.code;
    var checks = inMock ? (mock.checks[id] || 0) : st.checks;
    var examples = p.tests.map(function (t, i) { return i; }).filter(function (i) { return !p.tests[i].hidden; });
    var pos = PROBLEMS.indexOf(p), prevP = PROBLEMS[pos - 1], nextP = PROBLEMS[pos + 1];

    app.innerHTML =
      (inMock ? '<div class="mock-bar"><b>Mock ProgrAss</b>' + mock.ids.map(function (mid, i) {
        var done = (mock.best[mid] || 0) > 0;
        return '<a class="qlink' + (mid === id ? ' on' : '') + (done ? ' done' : '') + '" href="#/progass/' + mid + '">Q' + (i + 1) + '</a>';
      }).join('') + '<span class="spacer"></span><span class="muted small">Time left</span><span class="timer" id="mockTimer"></span>' +
        '<button class="btn small" id="mockFinish">Finish attempt…</button></div>'
        : p.generated
          ? '<div class="row" style="margin-bottom:12px"><a class="btn small" href="#/generator">← Generator</a><span class="spacer"></span>' +
            '<button class="btn small" id="genSame">Another ' + esc(p.family.toLowerCase()) + '</button><button class="btn small" id="genAny">Random type</button></div>'
          : '<div class="row" style="margin-bottom:12px"><a class="btn small" href="#/progass">← All problems</a><span class="spacer"></span>' +
            (prevP ? '<a class="btn small ghost" href="#/progass/' + prevP.id + '">← Prev</a>' : '') +
            (nextP ? '<a class="btn small ghost" href="#/progass/' + nextP.id + '">Next →</a>' : '') + '</div>') +
      '<div class="row" style="margin-bottom:6px"><h1 style="margin:0">' + esc(p.title) + '</h1>' + levelStars(p.level) + '</div>' +
      '<div class="row" style="margin-bottom:16px">' + (p.generated ? '<span class="pill gen" title="Share this code to get the same question">Generated · ' + esc(genCode(p)) + '</span>' : '') +
        '<span class="pill accent">' + esc(p.topic) + '</span>' +
        '<span class="pill">' + p.tests.length + ' tests (' + (p.tests.length - examples.length) + ' hidden)</span>' +
        (!inMock && st.best ? '<span class="pill ok">Best mark ' + st.best + '%</span>' : '') + '</div>' +
      '<div class="problem-layout">' +
        '<div class="card problem-desc">' + p.desc +
          '<p style="margin-top:14px"><b>Given the partial program:</b></p>' +
          '<div class="partial-prog">' + renderPartialProgram(p) + '</div>' +
          '<p style="margin-top:14px"><b>For example:</b></p>' +
          '<div class="table-scroll"><table class="tests"><tr><th>Input</th><th>Result</th></tr>' + examples.map(function (i) {
            return '<tr><td>' + testInputCell(p.tests[i]) + '</td><td><pre>' + esc(expectedFor(p, i)) + '</pre></td></tr>';
          }).join('') + '</table></div>' +
        '</div>' +
        '<div class="answer-box">' +
          '<div class="card">' +
            '<div class="row"><b>Answer</b><span class="spacer"></span><span class="penalty">' + PENALTY_TEXT + '</span></div>' +
            '<div class="row small muted" style="margin:4px 0 8px">Checks used: <b id="checksUsed">' + checks + '</b> · next check penalty <b id="nextPen">' + penaltyFor(checks + 1) + '%</b></div>' +
            '<div class="editor-wrap" id="editor"></div>' +
            '<div class="row" style="margin-top:12px">' +
              '<button class="btn" id="precheck" title="Ctrl + Enter">Precheck</button>' +
              '<button class="btn primary" id="check" title="Ctrl + Shift + Enter">Check</button>' +
              '<span class="spacer"></span>' +
              (!inMock ? '<button class="btn ghost small" id="model">Model answer</button>' : '') +
              '<button class="btn ghost small" id="reset">Clear</button>' +
            '</div>' +
            '<div class="muted small" style="margin-top:6px">Ctrl + Enter = Precheck · Ctrl + Shift + Enter = Check</div>' +
            '<div id="results"></div>' +
            '<details style="margin-top:12px"><summary>Show the full program that gets compiled</summary><pre class="plain small" id="fullProg"></pre></details>' +
          '</div>' +
        '</div>' +
      '</div>';

    var editor = makeEditor($('#editor'), code, function (v) {
      if (inMock) { var m = store.get('pa-mock', null); if (m) { m.codes[id] = v; store.set('pa-mock', m); } }
      else { var s = progState(id); s.code = v; saveProg(id, s); }
      updateFull();
    }, { 'Ctrl-Enter': function () { run(false); }, 'Shift-Ctrl-Enter': function () { run(true); },
         'Cmd-Enter': function () { run(false); }, 'Shift-Cmd-Enter': function () { run(true); } });
    function updateFull() { $('#fullProg').textContent = buildSource(p, p.tests[0], editor.getValue()); }
    updateFull();

    $('#reset').addEventListener('click', function () {
      if (editor.getValue().trim() && !confirm('Clear your answer?')) return;
      editor.setValue('');
    });
    if ($('#model')) $('#model').addEventListener('click', function () {
      if (!st.best && !confirm('Show the model answer? Try it yourself first: you learn more by struggling a bit!')) return;
      $('#results').innerHTML = '<div class="result-banner info" style="margin-top:12px">Model answer (one possible solution):</div>' +
        '<pre class="plain">' + esc(p.solution) + '</pre><button class="btn small" id="useModel">Copy into answer box</button>';
      $('#useModel').addEventListener('click', function () { editor.setValue(p.solution); });
    });

    var busy = false;
    function run(all) {
      if (busy) return;
      var answer = editor.getValue();
      if (!answer.trim()) { $('#results').innerHTML = '<div class="result-banner bad">The answer box is empty.</div>'; return; }
      busy = true;
      var idxs = all ? p.tests.map(function (_, i) { return i; }) : examples;
      $('#precheck').disabled = $('#check').disabled = true;
      $('#results').innerHTML = '<div class="result-banner info"><span class="spin"></span> Compiling with g++ and running ' + idxs.length + ' test(s)…</div>';
      runTests(p, idxs, answer).then(function (res) {
        busy = false;
        $('#precheck').disabled = $('#check').disabled = false;
        var passed = res.results.filter(function (r) { return r && r.pass; }).length;
        var allPass = !res.compileError && passed === idxs.length;
        var banner;
        if (all) {
          var n, mark;
          if (inMock) {
            var m = store.get('pa-mock', null);
            n = (m.checks[id] || 0) + 1; m.checks[id] = n;
            mark = allPass ? 100 - penaltyFor(n) : 0;
            m.best[id] = Math.max(m.best[id] || 0, mark); store.set('pa-mock', m);
          } else {
            var s = progState(id); n = s.checks + 1; s.checks = n;
            mark = allPass ? 100 - penaltyFor(n) : 0;
            s.best = Math.max(s.best || 0, mark); saveProg(id, s); st = s;
          }
          $('#checksUsed').textContent = n; $('#nextPen').textContent = penaltyFor(n + 1) + '%';
          banner = allPass ? '<div class="result-banner ok">Passed all tests! ✓ Mark for this submission: ' + mark + '%. The hidden tests are shown below.</div>'
            : '<div class="result-banner bad">' + (res.compileError ? 'Compilation failed.' : 'Passed ' + passed + ' of ' + idxs.length + ' tests.') +
              ' Your code must pass every test to earn marks. (Mark 0%)</div>';
        } else {
          banner = allPass ? '<div class="result-banner ok">Precheck: the example tests pass. Press Check to run the hidden tests too.</div>'
            : '<div class="result-banner bad">Precheck: ' + (res.compileError ? 'compilation failed.' : passed + ' of ' + idxs.length + ' example tests pass.') + '</div>';
        }
        $('#results').innerHTML = banner + (res.note ? '<p class="small muted">' + esc(res.note) + '</p>' : '') + renderResults(p, idxs, res, all && allPass);
      }, function (err) {
        busy = false;
        $('#precheck').disabled = $('#check').disabled = false;
        $('#results').innerHTML = '<div class="result-banner bad">Could not run your code: ' + esc(err.message || err) + '</div>';
      });
    }
    $('#precheck').addEventListener('click', function () { run(false); });
    $('#check').addEventListener('click', function () { run(true); });
    if ($('#genSame')) $('#genSame').addEventListener('click', function () { openGenerated(id.split('~')[1]); });
    if ($('#genAny')) $('#genAny').addEventListener('click', function () { openGenerated(Generator.randomKey('Any')); });

    if (inMock) {
      every(1000, function () {
        var m = store.get('pa-mock', null);
        if (!m || m.finished) return;
        var left = m.end - Date.now();
        if (left <= 0) { clearTimers(); finishPaMock(); return; }
        var el = $('#mockTimer'); if (el) { el.textContent = fmtClock(left); el.classList.toggle('low', left < 10 * 60000); }
      });
      $('#mockFinish').addEventListener('click', function () { if (confirm('Finish the mock attempt? Questions you never passed get 0.')) finishPaMock(); });
    }
  }

  function finishPaMock() {
    var m = store.get('pa-mock', null);
    if (!m) return;
    m.finished = true; m.finishedAt = Date.now(); store.set('pa-mock', m);
    location.hash = '#/progass/mock';
  }

  function progassMockSummary() {
    var m = store.get('pa-mock', null);
    if (!m) { location.hash = '#/progass'; return; }
    var total = m.ids.reduce(function (a, id) { return a + (m.best[id] || 0); }, 0);
    var used = (m.finishedAt || Date.now()) - m.start;
    app.innerHTML = '<div class="row" style="margin-bottom:12px"><a class="btn small" href="#/progass">← ProgrAss</a></div>' +
      '<div class="card"><div class="muted small">Mock ProgrAss result</div><div class="score-big">' + Math.round(total / m.ids.length) + '%</div>' +
      '<p class="muted">Time used: ' + fmtClock(used) + '</p>' +
      '<table class="mini"><tr><th>Question</th><th>Checks</th><th>Mark</th></tr>' + m.ids.map(function (id, i) {
        var p = problemById(id);
        return '<tr><td>' + (i + 1) + '. <a href="#/progass/' + id + '">' + esc(p ? p.title : id) + '</a></td><td>' + (m.checks[id] || 0) + '</td><td><b>' + (m.best[id] || 0) + '%</b></td></tr>';
      }).join('') + '</table>' +
      '<p class="muted small">Open a question to see its model answer and keep practising. Your mock answers were kept separately from normal practice.</p></div>';
  }

  // Run the given test indexes. Compile errors are the same for every test (only variable values change),
  // so the first test runs alone and the rest only run if it compiled.
  function runTests(p, idxs, answer) {
    var results = [];
    function runOne(k) {
      var i = idxs[k], t = p.tests[i];
      return Runner.run(buildSource(p, t, answer), t.stdin || '').then(function (r) {
        r.pass = r.ok && !r.timedOut && normalizeOutput(r.stdout) === normalizeOutput(expectedFor(p, i));
        results[k] = r;
        return r;
      });
    }
    return runOne(0).then(function (first) {
      var note = first.note || '';
      if (!first.ok) return { results: results, compileError: first.compileOutput || 'Compilation failed', note: note };
      var rest = idxs.slice(1).map(function (_, k) { return k + 1; });
      var pos = 0;
      function worker() {
        if (pos >= rest.length) return Promise.resolve();
        return runOne(rest[pos++]).then(worker);
      }
      return Promise.all([worker(), worker(), worker()]).then(function () { return { results: results, note: note }; });
    });
  }

  // reveal: after a Check where every test passed, hidden tests are shown in full too.
  function renderResults(p, idxs, res, reveal) {
    if (res.compileError) {
      return '<p class="small" style="margin:10px 0 4px"><b>Compiler output</b></p>' + errorHints(res.compileError) +
        '<pre class="console"><span class="err">' + esc(res.compileError) + '</span></pre>';
    }
    var anyTimeout = res.results.some(function (r) { return r && r.timedOut; });
    return (anyTimeout ? '<div class="callout warn"><b>Time limit exceeded.</b> Your program ran too long, most likely an infinite loop: check that the loop variable changes so the condition eventually becomes false.</div>' : '') +
      '<div class="table-scroll"><table class="tests"><tr><th></th><th>Test</th><th>Expected</th><th>Got</th></tr>' + idxs.map(function (i, k) {
      var t = p.tests[i], r = res.results[k] || {};
      var got = (r.stdout || '') + (r.timedOut ? '\n[time limit exceeded]' : '') + (r.runtimeError ? '\n[runtime error: ' + (r.stderr || '') + ']' : '');
      if (t.hidden && !reveal) {
        return '<tr class="' + (r.pass ? 'pass' : 'fail') + '"><td class="res">' + (r.pass ? '✓' : '✗') + '</td>' +
          '<td colspan="3" class="muted">Hidden test case' + (r.pass ? '' : ': your output is different. Think about edge cases (0, 1, negative, boundary values).') + '</td></tr>';
      }
      return '<tr class="' + (r.pass ? 'pass' : 'fail') + '"><td class="res">' + (r.pass ? '✓' : '✗') + '</td>' +
        '<td>' + (t.hidden ? '<span class="pill">hidden</span>' : '') + testInputCell(t) + '</td><td><pre>' + esc(expectedFor(p, i)) + '</pre></td><td><pre>' + esc(got) + '</pre></td></tr>';
    }).join('') + '</table></div>';
  }

  // ───────────────────────── question generator ─────────────────────────
  function genCode(p) { return p.id.split('~')[1] + '-' + p.id.split('~')[2]; }
  function openGenerated(key) {
    var id = 'gen~' + key + '~' + Generator.randomSeed();
    var p = problemById(id);
    var hist = store.get('gen-history', []).filter(function (h) { return h.id !== id; });
    hist.unshift({ id: id, title: p.title, at: Date.now() });
    store.set('gen-history', hist.slice(0, 40));
    location.hash = '#/progass/' + id;
  }

  function viewGenerator() {
    var fams = Generator.families;
    var pref = store.get('gen-pref', { group: 'Any', fam: 'any' });
    var hist = store.get('gen-history', []);
    function famOptions(group) {
      return '<option value="any">Any type</option>' + fams.filter(function (f) { return group === 'Any' || f.group === group; })
        .map(function (f) { return '<option value="' + f.key + '"' + (pref.fam === f.key ? ' selected' : '') + '>' + esc(f.name) + '</option>'; }).join('');
    }
    app.innerHTML =
      '<header class="page-head"><div class="kicker">Section 4</div><h1>Question generator</h1>' +
      '<p class="lede">Every press builds a new CodeRunner question: a random theme, random numbers and fresh hidden tests, in the same partial-program format as the assessment. ' +
      'Each question has a code, so you can send it to a friend and they get exactly the same question.</p></header>' +
      '<div class="gen-panel">' +
        '<div class="gen-field"><label for="gGroup">Topic</label><select id="gGroup" class="select">' + ['Any'].concat(GROUPS).map(function (g) {
          return '<option' + (pref.group === g ? ' selected' : '') + '>' + g + '</option>';
        }).join('') + '</select></div>' +
        '<div class="gen-field"><label for="gFam">Type</label><select id="gFam" class="select">' + famOptions(pref.group) + '</select></div>' +
        '<button class="btn primary big" id="gGo">Generate question</button>' +
        '<div class="gen-field gen-code"><label for="gCode">Have a code?</label><div class="row"><input id="gCode" class="input" placeholder="e.g. digits-482913"><button class="btn" id="gOpen">Open</button></div></div>' +
      '</div>' +
      '<div class="grid grid-2" style="margin-top:28px">' +
        '<section><h2 class="rule-head">Question types</h2><table class="mini types"><tr><th>Type</th><th>Topic</th><th>Level</th><th></th></tr>' +
          fams.map(function (f) {
            return '<tr><td>' + esc(f.name) + '</td><td>' + f.group + '</td><td>' + levelStars(f.level) + '</td><td><button class="link-btn" data-try="' + f.key + '">try one →</button></td></tr>';
          }).join('') + '</table></section>' +
        '<section><h2 class="rule-head">Recently generated</h2>' + (hist.length
          ? '<table class="mini"><tr><th>Code</th><th>Question</th><th>Result</th></tr>' + hist.slice(0, 12).map(function (h) {
              var s = progState(h.id);
              return '<tr><td class="mono"><a href="#/progass/' + h.id + '">' + esc(h.id.split('~')[1] + '-' + h.id.split('~')[2]) + '</a></td><td>' + esc(h.title) + '</td><td>' +
                (s.best ? '<span class="pill ok">' + s.best + '%</span>' : s.checks ? '<span class="pill warn">tried</span>' : '<span class="muted small">-</span>') + '</td></tr>';
            }).join('') + '</table>'
          : '<p class="muted">Nothing yet. Press <b>Generate question</b>.</p>') + '</section>' +
      '</div>';
    $('#gGroup').addEventListener('change', function () {
      pref.group = this.value; pref.fam = 'any'; store.set('gen-pref', pref);
      $('#gFam').innerHTML = famOptions(pref.group);
    });
    $('#gFam').addEventListener('change', function () { pref.fam = this.value; store.set('gen-pref', pref); });
    $('#gGo').addEventListener('click', function () {
      openGenerated(pref.fam !== 'any' ? pref.fam : Generator.randomKey(pref.group));
    });
    $all('[data-try]', app).forEach(function (b) { b.addEventListener('click', function () { openGenerated(b.getAttribute('data-try')); }); });
    function openCode() {
      var m = /^\s*([a-z]+)\s*-\s*(\d+)\s*$/i.exec($('#gCode').value);
      var id = m && 'gen~' + m[1].toLowerCase() + '~' + m[2];
      if (!id || !problemById(id)) { $('#gCode').classList.add('invalid'); return; }
      location.hash = '#/progass/' + id;
    }
    $('#gOpen').addEventListener('click', openCode);
    $('#gCode').addEventListener('keydown', function (e) { if (e.key === 'Enter') openCode(); });
  }

  // ───────────────────────── playground ─────────────────────────
  var DEFAULT_CODE = '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cout << "Enter a number: ";\n    cin >> n;\n    for (int i = 1; i <= n; i++)\n        cout << i << " ";\n    cout << endl;\n    return 0;\n}\n';
  function viewPlayground() {
    var saved = store.get('playground', { code: DEFAULT_CODE, stdin: '5' });
    app.innerHTML =
      '<header class="page-head"><div class="kicker">Section 5</div><h1>Scratchpad</h1>' +
      '<p class="lede">Write any C++ program and run it with g++. Type the keyboard input for <code>cin</code> in the input box <i>before</i> pressing Run (values separated by spaces or new lines).</p></header>' +
      '<div class="problem-layout">' +
        '<div class="card"><div class="editor-wrap editor-lg" id="editor"></div>' +
          '<div class="row" style="margin-top:12px"><button class="btn primary" id="run">▶ Run</button>' +
          '<span class="muted small">Ctrl + Enter</span><span class="spacer"></span><button class="btn ghost small" id="reset">Reset</button></div></div>' +
        '<div class="card"><b>Keyboard input (stdin)</b><textarea class="stdin" id="stdin" spellcheck="false"></textarea>' +
          '<div class="row" style="margin:14px 0 6px"><b>Output</b></div>' +
          '<pre class="console" id="out"><span class="note">Press Run to compile and run your program.</span></pre>' +
          '<div id="hints"></div></div>' +
      '</div>';
    var stdinEl = $('#stdin');
    stdinEl.value = saved.stdin || '';
    function persist() { store.set('playground', { code: editor.getValue(), stdin: stdinEl.value }); }
    var running = false;
    function go() {
      if (running) return;
      running = true; $('#run').disabled = true;
      var out = $('#out');
      $('#hints').innerHTML = '';
      out.innerHTML = '<span class="note">Compiling with g++…</span>';
      Runner.run(editor.getValue(), stdinEl.value).then(function (r) {
        running = false; $('#run').disabled = false;
        var h = '';
        if (r.note) h += '<span class="note">' + esc(r.note) + '\n\n</span>';
        if (!r.ok) {
          out.innerHTML = h + '<span class="err">' + esc(r.compileOutput || 'Compilation failed') + '</span>';
          $('#hints').innerHTML = errorHints(r.compileOutput || '');
          return;
        }
        h += esc(r.stdout || '');
        if (r.stderr) h += '<span class="err">' + esc('\n' + r.stderr) + '</span>';
        if (r.timedOut) h += '<span class="err">\n[time limit exceeded: infinite loop, or the program is waiting for more input?]</span>';
        h += '<span class="note">\n[' + (r.exitCode != null ? 'exit code ' + r.exitCode : 'finished') + ']</span>';
        out.innerHTML = h;
      }, function (err) {
        running = false; $('#run').disabled = false;
        out.innerHTML = '<span class="err">' + esc(err.message || err) + '</span>';
      });
    }
    var editor = makeEditor($('#editor'), saved.code || DEFAULT_CODE, persist, { 'Ctrl-Enter': go, 'Cmd-Enter': go });
    stdinEl.addEventListener('input', persist);
    $('#reset').addEventListener('click', function () { if (confirm('Reset to the sample program?')) { editor.setValue(DEFAULT_CODE); persist(); } });
    $('#run').addEventListener('click', go);
    app.onkeydown = function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); go(); } };
  }

  route();
})();
