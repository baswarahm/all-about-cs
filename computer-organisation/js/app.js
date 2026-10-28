/* ============ app.js — routing, views, test runner, practice, tools ============ */

const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LETTERS = 'ABCD';
const TOPIC_NAMES = { 1: 'Introduction', 2: 'Number systems', 3: 'Arithmetic' };

/* ---------- storage (safe) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('co1:' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('co1:' + k, JSON.stringify(v)); } catch { } },
  del(k) { try { localStorage.removeItem('co1:' + k); } catch { } },
};

/* ---------- theme ---------- */
(function initTheme() {
  const saved = store.get('theme', null);
  if (saved) document.documentElement.dataset.theme = saved;
  document.getElementById('themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; store.set('theme', next);
  });
})();

/* ---------- seeded shuffle (stable per test/question) ---------- */
function seeded(seed) { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
function optOrder(test, i, attemptSeed) {
  const q = test.qs[i], idx = q.o.map((_, k) => k);
  if (!test.shuffle) return idx;
  const fixed = idx.filter(k => /above/i.test(q.o[k]));
  const free = idx.filter(k => !fixed.includes(k));
  const r = seeded(test.id + ':' + i + ':' + attemptSeed);
  for (let k = free.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [free[k], free[j]] = [free[j], free[k]]; }
  return [...free, ...fixed];
}

/* ---------- router ---------- */
const routes = { home: viewHome, learn: viewLearn, cheat: viewCheat, tests: viewTests, test: viewTest, practice: viewPractice, tutorials: viewTutorials, tools: viewTools };
let cleanup = null;
function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  const [name = 'home', ...args] = location.hash.replace(/^#\/?/, '').split('/');
  const fn = routes[name] || viewHome;
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('on', a.dataset.r === (name === 'test' ? 'tests' : name) || (!routes[name] && a.dataset.r === 'home')));
  document.body.classList.toggle('in-test', name === 'test');
  fn(...args);
  if (!args[1]) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* =====================================================================
   HOME
   ===================================================================== */
function readCount(t) { const r = store.get('read', {}); return t.sections.filter(s => r[t.id + '/' + s.id]).length; }
function bestOf(id) { const h = store.get('hist:' + id, []); return h.length ? Math.max(...h.map(x => x.score)) : null; }
function lastN(id) { const h = store.get('hist:' + id, []); return h.length ? h[h.length - 1].n || 50 : 50; }

function viewHome() {
  const paperRow = t => {
    const best = bestOf(t.id), inprog = store.get('run:' + t.id, null);
    return `<tr><td><b>${t.title}</b><small>${t.blurb}</small>${best !== null ? `<span class="best-c">Best so far: ${best}/${lastN(t.id)}</span>` : ''}</td>
      <td><a class="btn sm ${t.id === 'mock1' ? 'primary' : ''}" href="#test/${t.id}">${inprog && !inprog.done ? 'Resume' : 'Open'}</a></td></tr>`;
  };
  app.innerHTML = `
  <section class="cover">
    <div class="cover-main">
      <div class="doc-id"><span>CCA102 / CST131 · Sem 1 2026/27</span><span>Test 1 · Topics 1–3</span></div>
      <h1>Computer Organisation,<br><em>Test 1</em> revision</h1>
      <p class="lede">The notes from the three topics, last year's paper with the answers corrected, two mock papers, a random Test 1 that is new every time, a question bank for each topic, drills and solvers that show the working.</p>
      <div class="hero-cta"><a class="btn primary" href="#learn/t1">Read Topic 1</a><a class="btn" href="#test/past">Open last year's paper</a></div>
    </div>
    <dl class="spec">
      <div><dt>Format</dt><dd>50 MCQ, 60 min</dd></div>
      <div><dt>Coverage</dt><dd>Topics 1–3</dd></div>
      <div><dt>2025/26 split</dt><dd>18 / 14 / 18</dd></div>
      <div><dt>Question bank</dt><dd>${BANK.length + 150} + endless calculations</dd></div>
    </dl>
  </section>

  <div class="cols">
    <section>
      <h2 class="h-sec"><span>01</span>Notes</h2>
      <ol class="toc">${TOPICS.map(t => `<li><a href="#learn/${t.id}"><span class="toc-n">${t.num}</span><span class="toc-t"><b>${t.title}</b><small>${t.sub}</small></span><span class="toc-p">${readCount(t)}/${t.sections.length} read</span></a></li>`).join('')}</ol>
      <a class="toc-extra" href="#cheat">Cheat sheet: everything to memorise on one printable page</a>
    </section>
    <section>
      <h2 class="h-sec"><span>02</span>Papers</h2>
      <table class="papers">${TESTS.concat(DYNAMIC).map(paperRow).join('')}</table>
    </section>
  </div>

  <section class="home-block">
    <h2 class="h-sec"><span>03</span>How to use this</h2>
    <ol class="plan">
      <li><b>Read</b> the three topics, about an hour. Keep the <a href="#cheat">cheat sheet</a> open.</li>
      <li><b>Last year's paper in Study mode.</b> You see the answer after each question.</li>
      <li><b>Drill</b> conversions and 2's complement until you get 10 right in a row.</li>
      <li><b>Mock 1 in Exam mode</b> with the 60-minute timer, then go through every wrong answer.</li>
      <li><b>Re-read your weakest topic</b>, then sit Mock 2.</li>
      <li><b>Random Test 1</b> in Exam mode, again and again: every attempt is a new paper with last year's shape. Use the <b>topic banks</b> in Study mode for your weak topic.</li>
    </ol>
  </section>

  <div class="extras">
    <a class="link-card" href="#tutorials"><h3>Tutorial answers</h3><p>Worked solutions for Tutorials 1–3 and every slide activity.</p></a>
    <a class="link-card" href="#tools"><h3>Solvers</h3><p>Enter any number and get the full working: conversions, 2's complement, Booth, division, IEEE 754, MIPS.</p></a>
  </div>`;
}

/* =====================================================================
   LEARN
   ===================================================================== */
function viewLearn(tid = 't1', sid) {
  const t = TOPICS.find(x => x.id === tid) || TOPICS[0];
  const read = store.get('read', {});
  const idx = TOPICS.indexOf(t), prev = TOPICS[idx - 1], next = TOPICS[idx + 1];
  app.innerHTML = `
  <div class="learn">
    <aside class="learn-nav">
      <div class="ln-topics">${TOPICS.map(x => `<a href="#learn/${x.id}" class="${x === t ? 'on' : ''}"><span>${x.num}</span>${x.title}</a>`).join('')}</div>
      <div class="ln-h">In this topic</div>
      <nav class="ln-secs">${t.sections.map(s => `<a href="#learn/${t.id}/${s.id}" data-s="${s.id}">${read[t.id + '/' + s.id] ? '<i class="dot done"></i>' : '<i class="dot"></i>'}${s.title}</a>`).join('')}</nav>
      <div class="ln-h">Files</div>
      <div class="ln-files">${t.files.map(([f, l]) => pdf(f, l)).join('')}</div>
    </aside>
    <article class="learn-body">
      <header class="lb-head">
        <p class="eyebrow">§01 · Topic ${t.num} · ${t.weight}</p>
        <h1>${t.title}</h1><p class="lede">${t.sub}</p>
      </header>
      ${t.sections.map(s => `
        <section class="note" id="sec-${s.id}">
          <div class="note-h"><h2>${s.title}</h2>
            <label class="readbox"><input type="checkbox" data-read="${t.id}/${s.id}" ${read[t.id + '/' + s.id] ? 'checked' : ''}> Got it</label></div>
          ${s.html}
        </section>`).join('')}
      <div class="pager">
        ${prev ? `<a class="btn" href="#learn/${prev.id}">← Topic ${prev.num}: ${prev.title}</a>` : '<span></span>'}
        ${next ? `<a class="btn primary" href="#learn/${next.id}">Topic ${next.num}: ${next.title} →</a>` : `<a class="btn primary" href="#test/past">Try the past test →</a>`}
      </div>
    </article>
  </div>`;
  app.querySelectorAll('[data-read]').forEach(cb => cb.addEventListener('change', () => {
    const r = store.get('read', {}); r[cb.dataset.read] = cb.checked; store.set('read', r);
    const a = app.querySelector(`.ln-secs a[data-s="${cb.dataset.read.split('/')[1]}"] .dot`); if (a) a.classList.toggle('done', cb.checked);
  }));
  // scroll-spy
  const links = [...app.querySelectorAll('.ln-secs a')];
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', 'sec-' + l.dataset.s === e.target.id));
  }), { rootMargin: '-20% 0px -70% 0px' });
  app.querySelectorAll('.note').forEach(n => obs.observe(n));
  cleanup = () => obs.disconnect();
  if (sid) { const el = document.getElementById('sec-' + sid); if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' })); }
}

function viewCheat() {
  app.innerHTML = `<div class="page-head"><div><p class="eyebrow">§06 · One page</p><h1>Cheat sheet</h1><p class="lede">Everything you must memorise for Test 1. Print it or keep it open while you practise.</p></div><button class="btn" onclick="print()">Print</button></div>${CHEAT}`;
}

/* =====================================================================
   TESTS — list + runner
   ===================================================================== */
function viewTests() {
  app.innerHTML = `<div class="page-head"><div><p class="eyebrow">§02 · 3 fixed papers + papers that are new every time</p><h1>Papers</h1><p class="lede">Choose <b>Study mode</b> to see the answer after every question, or <b>Exam mode</b> for a timed run with results at the end.</p></div></div>
  <div class="grid3">${TESTS.concat(DYNAMIC).map(t => {
    const h = store.get('hist:' + t.id, []);
    return `<div class="tcard static">
      <div class="tcard-top"><span class="pill ${t.id === 'past' ? 'pill-amber' : 'pill-accent'}">${t.id === 'past' ? 'Real paper' : t.id === 'random' ? 'New every time' : t.build ? 'Topic bank' : 'Mock paper'}</span>${h.length ? `<span class="best">Best ${Math.max(...h.map(x => x.score))}/${h[h.length - 1].n || 50}</span>` : ''}</div>
      <h3>${t.title}</h3><p>${t.blurb}</p>
      ${h.length ? `<div class="hist">${h.slice(-5).map(x => `<span title="${new Date(x.at).toLocaleString()}">${x.score}</span>`).join('')}</div>` : ''}
      <div class="row"><a class="btn primary" href="#test/${t.id}">Open</a></div>
    </div>`; }).join('')}</div>`;
}

function newRun(test, mode) {
  return { mode, seed: Date.now().toString(36), ans: Array(test.qs.length).fill(null), flag: Array(test.qs.length).fill(false), cur: 0, start: Date.now(), elapsed: 0, done: false };
}

function viewTest(id) {
  let test = TESTS.find(t => t.id === id);
  const dyn = test ? null : DYNAMIC.find(t => t.id === id);
  if (!test && !dyn) return viewTests();
  let run = store.get('run:' + id, null);
  // papers from bank.js are built fresh; an attempt in progress keeps its own questions
  if (dyn) test = Object.assign({}, dyn, { qs: run && !run.done && run.qs ? run.qs : dyn.build() });
  if (!run || run.done) return testIntro(test, run);
  testRunner(test, run);
}

function testIntro(test, last) {
  const byTopic = [1, 2, 3].map(t => test.qs.filter(q => q.t === t).length);
  app.innerHTML = `
  <div class="intro">
    <a class="back" href="#tests">← All papers</a>
    <p class="eyebrow">${test.id === 'past' ? 'Real paper · corrected answers' : test.build ? 'New questions every attempt' : 'Practice paper'}</p>
    <h1>${test.title}</h1>
    <p class="lede">${test.blurb}</p>
    <div class="intro-stats"><div><b>${test.qs.length}</b><span>questions</span></div><div><b>${test.minutes}</b><span>minutes</span></div>${byTopic.map((n, i) => n ? `<div><b>${n}</b><span>Topic ${i + 1}</span></div>` : '').join('')}</div>
    <div class="modes">
      <button class="mode" data-mode="study"><b>Study mode</b><span>The answer and explanation appear as soon as you pick. No timer pressure. Best for your first attempt.</span></button>
      <button class="mode" data-mode="exam"><b>Exam mode</b><span>${test.minutes}-minute countdown. No feedback until you submit, then a full review.</span></button>
    </div>
    <p class="hint">Keyboard: <kbd>A</kbd>–<kbd>D</kbd> to answer · <kbd>←</kbd> <kbd>→</kbd> to move · <kbd>F</kbd> to flag</p>
    ${last && last.done && (!test.build || last.qs) ? `<button class="btn" id="seeLast">See your last result (${last.score}/${last.qs ? last.qs.length : 50})</button>` : ''}
  </div>`;
  app.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => {
    const run = newRun(test, b.dataset.mode); if (test.build) run.qs = test.qs; store.set('run:' + test.id, run); testRunner(test, run);
  }));
  const s = document.getElementById('seeLast'); if (s) s.addEventListener('click', () => results(test.build ? Object.assign({}, test, { qs: last.qs }) : test, last));
}

function testRunner(test, run) {
  const N = test.qs.length;
  const save = () => store.set('run:' + test.id, run);
  run.start = Date.now() - (run.elapsed || 0);
  app.innerHTML = `
  <div class="runner">
    <div class="run-bar">
      <a class="back" href="#tests" title="Leave (progress is saved)">✕</a>
      <div class="run-title"><b>${test.short}</b><span>${run.mode === 'exam' ? 'Exam mode' : 'Study mode'}</span></div>
      <div class="run-prog"><div class="prog"><div id="rProg"></div></div><span id="rCount"></span></div>
      <div class="timer" id="rTimer"></div>
      <button class="btn primary sm" id="rSubmit">Submit</button>
    </div>
    <div class="run-main">
      <div class="qwrap" id="qwrap"></div>
      <aside class="qnav"><div class="qnav-h">Questions <span class="legend"><i class="a"></i>answered <i class="f"></i>flagged</span></div><div class="qgrid" id="qgrid"></div>
        ${run.mode === 'study' ? '<div class="live" id="live"></div>' : ''}
        <button class="btn sm ghost" id="rRestart">Restart</button></aside>
    </div>
  </div>`;
  const qwrap = document.getElementById('qwrap'), qgrid = document.getElementById('qgrid');

  function drawGrid() {
    qgrid.innerHTML = test.qs.map((q, i) => {
      let cls = run.ans[i] !== null ? 'a' : '';
      if (run.mode === 'study' && run.ans[i] !== null) cls = run.ans[i] === q.a ? 'ok' : 'bad';
      return `<button class="${cls} ${run.flag[i] ? 'f' : ''} ${i === run.cur ? 'cur' : ''}" data-i="${i}">${i + 1}</button>`;
    }).join('');
    const n = run.ans.filter(x => x !== null).length;
    document.getElementById('rProg').style.width = (100 * n / N) + '%';
    document.getElementById('rCount').textContent = `${n}/${N}`;
    const live = document.getElementById('live');
    if (live) { const c = test.qs.filter((q, i) => run.ans[i] === q.a).length; live.innerHTML = `<b>${c}</b> correct of ${n} answered`; }
  }
  function drawQ() {
    const i = run.cur, q = test.qs[i], ord = optOrder(test, i, run.seed), chosen = run.ans[i];
    const reveal = run.mode === 'study' && chosen !== null;
    qwrap.innerHTML = `
      <div class="qcard">
        <div class="q-meta"><span class="qn">Question ${i + 1}<small> / ${N}</small></span><span class="pill t${q.t}">Topic ${q.t} · ${TOPIC_NAMES[q.t]}</span>
          <button class="flag ${run.flag[i] ? 'on' : ''}" id="flagBtn" title="Flag (F)">⚑ ${run.flag[i] ? 'Flagged' : 'Flag'}</button></div>
        <div class="q-text">${q.q}</div>
        <div class="opts">${ord.map((k, j) => {
          let cls = chosen === k ? 'sel' : '';
          if (reveal) cls = k === q.a ? 'right' : (chosen === k ? 'wrong' : 'dim');
          return `<button class="opt ${cls}" data-k="${k}" ${reveal ? 'disabled' : ''}><span class="L">${LETTERS[j]}</span><span class="T">${q.o[k]}</span></button>`;
        }).join('')}</div>
        ${reveal ? `<div class="explain ${chosen === q.a ? 'good' : 'bad'}"><b>${chosen === q.a ? 'Correct' : 'Not quite — answer ' + LETTERS[ord.indexOf(q.a)]}</b>${q.e}</div>` : ''}
      </div>
      <div class="q-foot">
        <button class="btn" id="prevQ" ${i === 0 ? 'disabled' : ''}>← Previous</button>
        ${i < N - 1 ? `<button class="btn primary" id="nextQ">Next →</button>` : `<button class="btn primary" id="finishQ">Finish & submit</button>`}
      </div>`;
    qwrap.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => choose(+b.dataset.k)));
    document.getElementById('flagBtn').onclick = toggleFlag;
    document.getElementById('prevQ').onclick = () => go(i - 1);
    const nx = document.getElementById('nextQ'); if (nx) nx.onclick = () => go(i + 1);
    const fn = document.getElementById('finishQ'); if (fn) fn.onclick = submit;
    drawGrid();
  }
  function choose(k) {
    if (run.mode === 'study' && run.ans[run.cur] !== null) return;
    run.ans[run.cur] = k; save(); drawQ();
    if (run.mode === 'exam' && run.cur < N - 1) setTimeout(() => { if (run.ans[run.cur] === k) go(run.cur + 1); }, 220);
  }
  function toggleFlag() { run.flag[run.cur] = !run.flag[run.cur]; save(); drawQ(); }
  function go(i) { if (i < 0 || i >= N) return; run.cur = i; save(); drawQ(); qwrap.scrollIntoView({ block: 'nearest' }); }
  function submit() {
    const left = run.ans.filter(x => x === null).length;
    if (left && !confirm(`${left} question${left > 1 ? 's are' : ' is'} unanswered. Submit anyway?`)) return;
    finish();
  }
  function finish() {
    run.elapsed = Date.now() - run.start; run.done = true;
    run.score = test.qs.filter((q, i) => run.ans[i] === q.a).length;
    save();
    const h = store.get('hist:' + test.id, []); h.push({ score: run.score, n: N, at: Date.now(), mode: run.mode, ms: run.elapsed }); store.set('hist:' + test.id, h);
    results(test, run);
  }
  qgrid.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) go(+b.dataset.i); });
  document.getElementById('rSubmit').onclick = submit;
  document.getElementById('rRestart').onclick = () => { if (confirm('Start this test again from scratch?')) { store.del('run:' + test.id); viewTest(test.id); } };

  const timerEl = document.getElementById('rTimer');
  const tick = () => {
    run.elapsed = Date.now() - run.start;
    if (run.mode === 'exam') {
      const left = test.minutes * 60000 - run.elapsed;
      if (left <= 0) { clearInterval(iv); alert('Time is up! Submitting your answers.'); finish(); return; }
      timerEl.textContent = mmss(left); timerEl.classList.toggle('low', left < 5 * 60000);
    } else timerEl.textContent = mmss(run.elapsed);
  };
  const iv = setInterval(() => { tick(); if (run.elapsed % 10000 < 1000) save(); }, 1000); tick();
  const onKey = e => {
    if (e.target.matches('input,textarea,select')) return;
    const k = e.key.toUpperCase();
    const ord = optOrder(test, run.cur, run.seed);
    if ('ABCD'.includes(k) && k.length === 1) choose(ord[LETTERS.indexOf(k)]);
    else if ('1234'.includes(k) && k.length === 1) choose(ord[+k - 1]);
    else if (e.key === 'ArrowRight') go(run.cur + 1);
    else if (e.key === 'ArrowLeft') go(run.cur - 1);
    else if (k === 'F') toggleFlag();
  };
  document.addEventListener('keydown', onKey);
  cleanup = () => { clearInterval(iv); document.removeEventListener('keydown', onKey); if (!run.done) save(); };
  drawQ();
}
const mmss = ms => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

function results(test, run) {
  if (cleanup) { cleanup(); cleanup = null; }
  document.body.classList.remove('in-test');
  const N = test.qs.length, score = run.score, pct = Math.round(100 * score / N);
  const topics = [1, 2, 3].map(t => { const ids = test.qs.map((q, i) => i).filter(i => test.qs[i].t === t); const c = ids.filter(i => run.ans[i] === test.qs[i].a).length; return { t, c, n: ids.length }; });
  const weakest = [...topics].sort((a, b) => a.c / a.n - b.c / b.n)[0];
  const verdict = pct >= 85 ? 'Excellent — you are ready.' : pct >= 70 ? 'Good. Fix the mistakes below and you are there.' : pct >= 50 ? 'A pass, but review the weak topic before the test.' : 'Go back to the notes, then try again.';
  app.innerHTML = `
  <div class="results">
    <a class="back" href="#tests">← All papers</a>
    <div class="res-head">
      <div class="score-big"><b>${score}</b><span>/${N}</span></div>
      <div class="res-info"><p class="eyebrow">${test.title} · ${run.mode === 'exam' ? 'Exam mode' : 'Study mode'} · ${mmss(run.elapsed)}</p><h1>${pct}%</h1><p class="lede">${verdict}</p>
        <div class="row"><button class="btn primary" id="again">Try again</button>${weakest.c < weakest.n ? `<a class="btn" href="#learn/t${weakest.t}">Review Topic ${weakest.t}: ${TOPIC_NAMES[weakest.t]}</a>` : ''}</div></div>
    </div>
    <div class="strip" title="One cell per question">${test.qs.map((q, i) => `<i class="${run.ans[i] === q.a ? 'ok' : run.ans[i] === null ? '' : 'bad'}" title="Q${i + 1}"></i>`).join('')}</div>
    <div class="bars">${topics.map(x => `<div class="bar"><div class="bar-l"><b>Topic ${x.t}</b> ${TOPIC_NAMES[x.t]}</div><div class="prog big"><div style="width:${100 * x.c / x.n}%" class="${x.c / x.n < .6 ? 'lowp' : ''}"></div></div><div class="bar-r">${x.c}/${x.n}</div></div>`).join('')}</div>
    <div class="review-h"><h2>Review</h2><div class="seg" id="seg"><button data-f="wrong" class="on">Wrong (${N - score})</button><button data-f="flag">Flagged (${run.flag.filter(Boolean).length})</button><button data-f="all">All</button></div></div>
    <div id="rev"></div>
  </div>`;
  const rev = document.getElementById('rev');
  const draw = f => {
    const list = test.qs.map((q, i) => ({ q, i })).filter(({ q, i }) => f === 'all' || (f === 'wrong' && run.ans[i] !== q.a) || (f === 'flag' && run.flag[i]));
    rev.innerHTML = list.length ? list.map(({ q, i }) => {
      const ord = optOrder(test, i, run.seed), ok = run.ans[i] === q.a;
      return `<div class="rq ${ok ? 'ok' : 'bad'}"><div class="q-meta"><span class="qn">Q${i + 1}</span><span class="pill t${q.t}">Topic ${q.t}</span><span class="mark">${ok ? '✓ Correct' : run.ans[i] === null ? '— Skipped' : '✗ Wrong'}</span></div>
        <div class="q-text">${q.q}</div>
        <div class="opts small">${ord.map((k, j) => `<div class="opt ${k === q.a ? 'right' : run.ans[i] === k ? 'wrong' : 'dim'}"><span class="L">${LETTERS[j]}</span><span class="T">${q.o[k]}</span>${run.ans[i] === k ? '<em>your answer</em>' : ''}</div>`).join('')}</div>
        <div class="explain">${q.e}</div></div>`;
    }).join('') : '<p class="empty">Nothing here.</p>';
  };
  document.getElementById('seg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; document.querySelectorAll('#seg button').forEach(x => x.classList.toggle('on', x === b)); draw(b.dataset.f); });
  document.getElementById('again').onclick = () => { store.del('run:' + test.id); viewTest(test.id); };
  draw(score === N ? 'all' : 'wrong');
  window.scrollTo(0, 0);
}

/* =====================================================================
   PRACTICE — endless generated drills with full working
   ===================================================================== */
const DRILLS = {
  'dec-bin': { label: 'Decimal → binary', t: 2, gen() { const v = rnd(9, 255); return { q: `Convert <b>${v}</b><sub>10</sub> to binary.`, ans: v.toString(2), kind: 'num', sol: () => convertExplain(String(v), 10, 2).html }; } },
  'bin-dec': { label: 'Binary → decimal', t: 2, gen() { const v = rnd(9, 255); const s = v.toString(2); return { q: `Convert <b class="mono">${s}</b><sub>2</sub> to decimal.`, ans: String(v), kind: 'num', sol: () => convertExplain(s, 2, 10).html }; } },
  'frac': { label: 'Fractions (dec ↔ bin)', t: 2, gen() { const v = rnd(2, 63) + pick(FRACS); if (Math.random() < .5) return { q: `Convert <b>${v}</b><sub>10</sub> to binary.`, ans: toBase(v, 2), kind: 'num', sol: () => convertExplain(String(v), 10, 2).html }; const s = toBase(v, 2); return { q: `Convert <b class="mono">${s}</b><sub>2</sub> to decimal.`, ans: String(v), kind: 'num', sol: () => convertExplain(s, 2, 10).html }; } },
  'hex': { label: 'Hex ↔ binary / decimal', t: 2, gen() {
    const v = rnd(20, 4095), h = v.toString(16).toUpperCase(), b = v.toString(2);
    return pick([
      { q: `Convert <b class="mono">${b}</b><sub>2</sub> to hexadecimal.`, ans: h, kind: 'num', sol: () => convertExplain(b, 2, 16).html },
      { q: `Convert <b class="mono">${h}</b><sub>16</sub> to binary.`, ans: b, kind: 'num', sol: () => convertExplain(h, 16, 2).html },
      { q: `Convert <b class="mono">${h}</b><sub>16</sub> to decimal.`, ans: String(v), kind: 'num', sol: () => convertExplain(h, 16, 10).html },
      { q: `Convert <b>${v}</b><sub>10</sub> to hexadecimal.`, ans: h, kind: 'num', sol: () => convertExplain(String(v), 10, 16).html }]);
  } },
  'oct': { label: 'Octal ↔ binary / hex', t: 2, gen() {
    const v = rnd(20, 4095), o = v.toString(8), h = v.toString(16).toUpperCase(), b = v.toString(2);
    return pick([
      { q: `Convert <b class="mono">${b}</b><sub>2</sub> to octal.`, ans: o, kind: 'num', sol: () => convertExplain(b, 2, 8).html },
      { q: `Convert <b class="mono">${o}</b><sub>8</sub> to hexadecimal.`, ans: h, kind: 'num', sol: () => convertExplain(o, 8, 16).html },
      { q: `Convert <b class="mono">${h}</b><sub>16</sub> to octal.`, ans: o, kind: 'num', sol: () => convertExplain(h, 16, 8).html },
      { q: `Convert <b class="mono">${o}</b><sub>8</sub> to decimal.`, ans: String(v), kind: 'num', sol: () => convertExplain(o, 8, 10).html }]);
  } },
  'twos': { label: "2's complement (8-bit)", t: 3, gen() {
    const v = rnd(-128, -1);
    if (Math.random() < .5) return { q: `Write <b>${v}</b> in 8-bit 2's complement.`, ans: bin(v, 8), kind: 'bits', sol: () => twosSteps(v, 8) };
    const s = bin(v, 8); return { q: `What decimal value is <b class="mono">${s}</b> in 8-bit 2's complement?`, ans: String(v), kind: 'int', sol: () => `<p>MSB weight is −128: ${[...s].map((c, i) => c === '1' ? (i === 0 ? '−128' : '+ ' + 2 ** (7 - i)) : null).filter(Boolean).join(' ')} = <b>${v}</b></p>` };
  } },
  'reps': { label: 'Sign-mag / 1’s / 2’s', t: 3, gen() {
    const v = -rnd(1, 127), which = pick(['sm', 'one', 'two']);
    const ans = { sm: '1' + bin(-v, 7), one: invert(bin(-v, 8)), two: bin(v, 8) }[which];
    const name = { sm: 'sign-magnitude', one: "1's complement", two: "2's complement" }[which];
    return { q: `Write <b>${v}</b> in 8-bit <b>${name}</b>.`, ans, kind: 'bits', sol: () => threeRepExplain(v, 8).html };
  } },
  'addsub': { label: '8-bit add / subtract + overflow', t: 3, gen() {
    const op = pick(['+', '-']); let a = rnd(-128, 127), b = rnd(-127, 127);
    if (Math.random() < .6) { a = rnd(-100, 100); b = rnd(-100, 100); }
    const r = addTrace(a, b, 8, op);
    return { q: `Compute <b>${a} ${op === '-' ? '−' : '+'} ${b < 0 ? '(' + b + ')' : b}</b> in 8-bit 2's complement. Give the 8-bit result and say whether overflow occurs.`, ans: r.res, ovf: r.ovf, kind: 'bits', sol: () => r.html };
  } },
};
const FRACS = [0.5, 0.25, 0.75, 0.125, 0.375, 0.625, 0.875];

function viewPractice(drillId) {
  const stats = store.get('drill', { n: 0, c: 0, streak: 0, best: 0 });
  let cur = drillId && DRILLS[drillId] ? drillId : store.get('drillSel', 'dec-bin');
  app.innerHTML = `
  <div class="page-head"><div><p class="eyebrow">§03 · Unlimited questions</p><h1>Drills</h1><p class="lede">Type your answer. You get the full working whether you are right or wrong.</p></div>
    <div class="score"><div><b id="sStreak">${stats.streak}</b><span>streak</span></div><div><b id="sBest">${stats.best}</b><span>best</span></div><div><b id="sAcc">${stats.n ? Math.round(100 * stats.c / stats.n) : 0}%</b><span>accuracy</span></div></div></div>
  <div class="drill-tabs">${Object.entries(DRILLS).map(([k, d]) => `<button data-d="${k}" class="${k === cur ? 'on' : ''}"><small>T${d.t}</small>${d.label}</button>`).join('')}</div>
  <div class="drill" id="drill"></div>`;
  const box = document.getElementById('drill');
  function next() {
    const d = DRILLS[cur], q = d.gen();
    box.innerHTML = `
      <div class="qcard">
        <div class="q-text big">${q.q}</div>
        <form class="answer" id="af" autocomplete="off">
          <input id="ain" class="mono" placeholder="${q.kind === 'bits' ? 'e.g. 11010011' : 'Your answer'}" spellcheck="false" autofocus>
          ${q.ovf !== undefined ? `<label class="ovf"><input type="checkbox" id="aovf"> Overflow</label>` : ''}
          <button class="btn primary">Check</button>
          <button type="button" class="btn ghost" id="skip">Show answer</button>
        </form>
        <div id="fb"></div>
      </div>`;
    const inp = document.getElementById('ain'); inp.focus();
    const reveal = (ok, gave) => {
      const st = store.get('drill', { n: 0, c: 0, streak: 0, best: 0 });
      if (gave) { st.n++; if (ok) { st.c++; st.streak++; st.best = Math.max(st.best, st.streak); } else st.streak = 0; store.set('drill', st); }
      document.getElementById('sStreak').textContent = st.streak; document.getElementById('sBest').textContent = st.best; document.getElementById('sAcc').textContent = (st.n ? Math.round(100 * st.c / st.n) : 0) + '%';
      document.getElementById('fb').innerHTML = `<div class="explain ${ok ? 'good' : 'bad'}"><b>${ok ? 'Correct!' : gave ? 'Not quite.' : 'Answer'}</b> Answer: <span class="mono">${q.ans}</span>${q.ovf !== undefined ? ` · overflow: <b>${q.ovf ? 'yes' : 'no'}</b>` : ''}<div class="work">${q.sol()}</div></div>
        <div class="row"><button class="btn primary" id="nq">Next question →</button></div>`;
      document.querySelectorAll('#af input, #af button').forEach(x => x.disabled = true);
      const nq = document.getElementById('nq'); nq.onclick = next; nq.focus();
    };
    document.getElementById('af').onsubmit = e => {
      e.preventDefault(); const v = inp.value.trim(); if (!v) return;
      let ok = normAns(v, q.kind) === normAns(q.ans, q.kind);
      if (q.ovf !== undefined) ok = ok && document.getElementById('aovf').checked === q.ovf;
      reveal(ok, true);
    };
    document.getElementById('skip').onclick = () => reveal(false, false);
  }
  app.querySelector('.drill-tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-d]'); if (!b) return; cur = b.dataset.d; store.set('drillSel', cur);
    app.querySelectorAll('.drill-tabs button').forEach(x => x.classList.toggle('on', x === b)); next();
  });
  next();
}
function normAns(s, kind) {
  s = String(s).toUpperCase().replace(/[\s_]/g, '').replace(/^\+/, '');
  if (kind === 'bits') return s;
  if (kind === 'int') return String(parseInt(s, 10));
  let [i, f = ''] = s.split('.'); i = i.replace(/^0+(?=.)/, ''); f = f.replace(/0+$/, '');
  return i + (f ? '.' + f : '');
}

/* =====================================================================
   TUTORIALS
   ===================================================================== */
function viewTutorials(g) {
  const groups = Object.keys(TUT_GROUPS);
  const cur = groups.includes(g) ? g : 'T1';
  app.innerHTML = `
  <div class="page-head"><div><p class="eyebrow">§04 · Worked solutions</p><h1>Tutorial answers</h1><p class="lede">Every tutorial question and slide activity, with the full working shown. Try each one yourself first, then open it to check.</p></div></div>
  <div class="seg wide">${groups.map(k => `<a href="#tutorials/${k}" class="${k === cur ? 'on' : ''}">${TUT_GROUPS[k].name.split(' — ')[0]}<small>${TUT_GROUPS[k].name.split(' — ')[1]}</small></a>`).join('')}</div>
  <div class="tut-head"><h2>${TUT_GROUPS[cur].name}</h2><div class="row">${pdf(TUT_GROUPS[cur].file, 'Open the question sheet')}<button class="btn sm ghost" id="expand">Expand all</button></div></div>
  <div class="tut-list">${ANS.map((a, i) => a.g === cur ? `<details class="ans" data-i="${i}"><summary><span class="aq">${a.q}</span><span class="aa">Show answer</span></summary><div class="sol"></div></details>` : '').join('')}</div>`;
  const fill = d => { const a = ANS[d.dataset.i]; if (!a.r) a.r = a.f(); const sol = d.querySelector('.sol'); if (!sol.innerHTML) { sol.innerHTML = a.r.html; d.querySelector('.aa').innerHTML = a.r.ans; } };
  app.querySelectorAll('details.ans').forEach(d => d.addEventListener('toggle', () => d.open && fill(d)));
  document.getElementById('expand').onclick = e => {
    const open = e.target.textContent.startsWith('Expand');
    app.querySelectorAll('details.ans').forEach(d => { d.open = open; if (open) fill(d); });
    e.target.textContent = open ? 'Collapse all' : 'Expand all';
  };
}

/* =====================================================================
   TOOLS — step-by-step solvers
   ===================================================================== */
function viewTools() {
  const baseSel = (id, v) => `<select id="${id}">${[2, 3, 4, 5, 6, 7, 8, 9, 10, 16].map(b => `<option value="${b}" ${b === v ? 'selected' : ''}>base ${b}</option>`).join('')}</select>`;
  const bitsSel = (id, v, opts = [4, 5, 6, 8, 12, 16]) => `<select id="${id}">${opts.map(b => `<option ${b === v ? 'selected' : ''}>${b}</option>`).join('')}</select>`;
  const tools = [
    ['conv', 'Base conversion', 'Topic 2', `<label>Number<input id="cVal" value="25.625" class="mono"></label><label>From${baseSel('cFrom', 10)}</label><label>To${baseSel('cTo', 2)}</label>`,
      () => convertExplain($('#cVal').value, +$('#cFrom').value, +$('#cTo').value).html],
    ['rep', 'Signed representations', 'Topic 3', `<label>Decimal<input id="rVal" value="-58" class="mono"></label><label>Bits${bitsSel('rBits', 8)}</label>`,
      () => { const v = parseInt($('#rVal').value, 10), n = +$('#rBits').value; if (isNaN(v) || Math.abs(v) > 2 ** (n - 1)) return `<p class="err">Enter an integer that fits in ${n} bits.</p>`; return threeRepExplain(v, n).html + rangeHTML(n); }],
    ['add', 'Add / subtract (2’s complement)', 'Topic 3', `<label>A<input id="aA" value="-120" class="mono"></label><label>Op<select id="aOp"><option value="+">+</option><option value="-">−</option></select></label><label>B<input id="aB" value="-20" class="mono"></label><label>Bits${bitsSel('aBits', 8)}</label>`,
      () => addTrace(parseInt($('#aA').value, 10), parseInt($('#aB').value, 10), +$('#aBits').value, $('#aOp').value).html],
    ['mul', 'Add-shift multiplication (unsigned)', 'Topic 3', `<label>M (multiplicand)<input id="mM" value="13" class="mono"></label><label>Q (multiplier)<input id="mQ" value="11" class="mono"></label><label>Bits${bitsSel('mBits', 4, [3, 4, 5, 6, 8])}</label>`,
      () => addShiftTrace(+$('#mM').value, +$('#mQ').value, +$('#mBits').value).html],
    ['booth', 'Booth’s algorithm (signed)', 'Topic 3', `<label>M (multiplicand)<input id="bM" value="7" class="mono"></label><label>Q (multiplier)<input id="bQ" value="-6" class="mono"></label><label>Bits${bitsSel('bBits', 4, [4, 5, 6, 8])}</label>`,
      () => boothTrace(+$('#bM').value, +$('#bQ').value, +$('#bBits').value).html],
    ['div', 'Restoring division', 'Topic 3', `<label>Dividend (Q)<input id="dQ" value="7" class="mono"></label><label>Divisor (M)<input id="dM" value="3" class="mono"></label><label>Bits${bitsSel('dBits', 4, [4, 5, 6, 8])}</label>`,
      () => divTrace(+$('#dQ').value, +$('#dM').value, +$('#dBits').value).html],
    ['ieee', 'IEEE 754 (32-bit)', 'Topic 3', `<label>Decimal → bits<input id="fVal" value="-12.75" class="mono"></label><label>or bits → decimal<input id="fBits" placeholder="0 10000011 0110…" class="mono"></label>`,
      () => $('#fBits').value.trim() ? ieeeDecodeExplain($('#fBits').value).html : ieeeEncodeExplain(parseFloat($('#fVal').value)).html],
    ['mips', 'CPI / MIPS / time', 'Topic 1', `<label>Clock (MHz)<input id="pF" value="400" class="mono"></label><label>Instructions<input id="pIc" value="2000000" class="mono"></label><label class="wide">Mix: CPI:% pairs<input id="pMix" value="1:60, 2:18, 4:12, 8:10" class="mono"></label>`,
      () => { const mix = $('#pMix').value.split(',').map(p => p.split(':').map(Number)); if (mix.some(m => m.length !== 2 || m.some(isNaN))) return '<p class="err">Write pairs like 1:60, 2:40</p>'; return mipsExplain(+$('#pF').value, mix, +$('#pIc').value || 0).html; }],
  ];
  app.innerHTML = `<div class="page-head"><div><p class="eyebrow">§05 · Check your own working</p><h1>Solvers</h1><p class="lede">Enter any values and get the working laid out the way your lecturer shows it. Each tool updates as you type.</p></div></div>
  <div class="tool-nav">${tools.map(t => `<a href="#tools" data-go="${t[0]}">${t[1]}</a>`).join('')}</div>
  <div class="tools">${tools.map(([id, title, tag, form]) => `<section class="tool" id="tool-${id}"><div class="tool-h"><h3>${title}</h3><span class="pill">${tag}</span></div><form class="tool-form" data-t="${id}" onsubmit="return false">${form}</form><div class="tool-out" id="out-${id}"></div></section>`).join('')}</div>`;
  tools.forEach(([id, , , , fn]) => {
    const run = () => { try { document.getElementById('out-' + id).innerHTML = fn(); } catch (e) { document.getElementById('out-' + id).innerHTML = '<p class="err">Check your input.</p>'; } };
    const f = app.querySelector(`[data-t="${id}"]`); f.addEventListener('input', run); f.addEventListener('change', run); run();
  });
  app.querySelector('.tool-nav').addEventListener('click', e => { const a = e.target.closest('[data-go]'); if (!a) return; e.preventDefault(); document.getElementById('tool-' + a.dataset.go).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

route();
