/* ============ topic56.js — Topic 4 Part 2, Topic 5, Topic 6, Tutorials 4–6 ============
   Loaded after tutorials.js and before app.js. Adds: notes (TOPICS), six solvers (EXTRA_TOOLS, shown on the Solvers page),
   worked tutorial answers (ANS / TUT_GROUPS), bank questions with a reason per option (BANK) and question-bank papers (DYNAMIC). */
(function () {
  const h = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const tbl = (head, rows) => `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  /* ───────── Boolean engine: parse, truth table, minimal SOP (2–4 variables), K-map ───────── */
  // grammar: expr = term ('+' term)* ; term = factor ('·'|'*'|'.'|nothing factor)* ; factor = ('~'|'!')* atom ("'"|'’')*
  function parseBool(src) {
    const s = src.replace(/\s+/g, '').replace(/[’`]/g, "'").toUpperCase();
    let i = 0;
    const vars = new Set();
    function expr() { let n = term(); while (s[i] === '+') { i++; n = { op: '+', a: n, b: term() }; } return n; }
    function term() {
      let n = factor();
      while (i < s.length && (/[A-Z01(~!]/.test(s[i]) || /[·*.]/.test(s[i]))) { if (/[·*.]/.test(s[i])) i++; n = { op: '.', a: n, b: factor() }; }
      return n;
    }
    function factor() {
      let neg = 0; while (s[i] === '~' || s[i] === '!') { neg++; i++; }
      let n;
      if (s[i] === '(') { i++; n = expr(); if (s[i++] !== ')') throw 'Missing )'; }
      else if (/[A-Z]/.test(s[i])) { n = { v: s[i] }; vars.add(s[i]); i++; }
      else if (s[i] === '0' || s[i] === '1') { n = { c: +s[i] }; i++; }
      else throw 'Unexpected "' + (s[i] || 'end') + '"';
      while (s[i] === "'") { neg++; i++; }
      return neg % 2 ? { op: '!', a: n } : n;
    }
    const tree = expr();
    if (i < s.length) throw 'Unexpected "' + s[i] + '"';
    return { tree, vars: [...vars].sort() };
  }
  function evalBool(n, env) {
    if (n.v) return env[n.v]; if (n.c !== undefined) return n.c;
    if (n.op === '!') return 1 - evalBool(n.a, env);
    const a = evalBool(n.a, env), b = evalBool(n.b, env);
    return n.op === '+' ? (a | b) : (a & b);
  }
  // input: an expression, an output column like 11010100, or m(1,3,5) / Σm(1,3,5) with "vars: 3"
  function readFunction(text, nHint) {
    const t = text.trim();
    let m = t.match(/^[Σσ]?m\s*\(([\d,\s]*)\)$/i);
    if (m) {
      const ms = m[1].split(',').filter(x => x.trim() !== '').map(Number);
      const n = nHint || Math.max(2, Math.ceil(Math.log2(Math.max(...ms, 1) + 1)));
      return { n, vars: 'ABCD'.slice(0, n).split(''), ones: [...new Set(ms)].sort((a, b) => a - b), how: 'minterms' };
    }
    if (/^[01]+$/.test(t) && [4, 8, 16].includes(t.length)) {
      const n = Math.log2(t.length);
      return { n, vars: 'ABCD'.slice(0, n).split(''), ones: t.split('').map((c, i) => c === '1' ? i : -1).filter(i => i >= 0), how: 'outputs' };
    }
    const p = parseBool(t);
    let vars = p.vars;
    if (vars.length > 4) throw 'Use at most 4 variables';
    if (vars.length < 2) vars = ['A', 'B'].filter(v => !vars.includes(v)).concat(vars).sort().slice(0, 2);
    const n = vars.length, ones = [];
    for (let k = 0; k < 2 ** n; k++) { const env = {}; vars.forEach((v, j) => env[v] = (k >> (n - 1 - j)) & 1); if (evalBool(p.tree, env)) ones.push(k); }
    return { n, vars, ones, how: 'expression' };
  }
  function minimalSOP(n, vars, ones) {
    if (!ones.length) return { sop: '0', groups: [] };
    if (ones.length === 2 ** n) return { sop: '1', groups: [] };
    const set = new Set(ones), cubes = [];
    const total = 3 ** n;
    for (let c = 0; c < total; c++) {
      const d = []; let x = c; for (let j = 0; j < n; j++) { d.unshift(x % 3); x = Math.floor(x / 3); }
      const ms = []; for (let m = 0; m < 2 ** n; m++) if (d.every((v, j) => v === 2 || ((m >> (n - 1 - j)) & 1) === v)) ms.push(m);
      if (ms.every(m => set.has(m))) cubes.push({ d, ms, lits: d.filter(v => v !== 2).length, str: d.map((v, j) => v === 2 ? '' : vars[j] + (v ? '' : "'")).join('') || '1' });
    }
    const primes = cubes.filter(c => !cubes.some(b => b !== c && b.ms.length > c.ms.length && c.ms.every(m => b.ms.includes(m))));
    let best = null;
    for (let mask = 1; mask < (1 << primes.length); mask++) {
      const pick = primes.filter((_, i) => mask >> i & 1);
      if (best && pick.length > best.length) continue;
      const cov = new Set(); pick.forEach(c => c.ms.forEach(m => cov.add(m)));
      if (cov.size !== set.size) continue;
      const cost = pick.length * 100 + pick.reduce((a, c) => a + c.lits, 0);
      if (!best || cost < best.cost) best = Object.assign(pick, { cost });
    }
    return { sop: best.map(c => c.str).sort().join(' + '), groups: best };
  }
  const GRAY = [0, 1, 3, 2];
  function kmapHtml(n, vars, ones) {
    const rb = n === 2 ? 1 : n === 3 ? 1 : 2, cb = n - rb;
    const rows = rb === 1 ? [0, 1] : GRAY, cols = cb === 1 ? [0, 1] : GRAY;
    const lab = (v, b) => v.toString(2).padStart(b, '0');
    return `<div class="tbl-wrap"><table class="tbl kmap"><thead><tr><th>${vars.slice(0, rb).join('')} \\ ${vars.slice(rb).join('')}</th>${cols.map(c => `<th>${lab(c, cb)}</th>`).join('')}</tr></thead><tbody>${rows.map(r =>
      `<tr><td><b>${lab(r, rb)}</b></td>${cols.map(c => { const m = (r << cb) | c; return `<td>${ones.includes(m) ? '<b>1</b>' : '0'}<sub class="mt">m${m}</sub></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function boolReport(text, nHint) {
    const f = readFunction(text, nHint), { n, vars, ones } = f;
    const r = minimalSOP(n, vars, ones);
    const rows = []; for (let k = 0; k < 2 ** n; k++) rows.push([...k.toString(2).padStart(n, '0').split(''), ones.includes(k) ? '<b>1</b>' : '0', 'm' + k]);
    const nand = r.groups.length === 0 ? '' : r.groups.length === 1
      ? `F = ((${r.sop})')' : one NAND gate for the product, then a NAND with both inputs joined to invert it.`
      : `F = (${r.groups.map(g => `(${g.str})'`).join(' · ')})' : each product term is a NAND gate (${r.groups.map(g => g.str).join(', ')}), and their outputs go into one more NAND gate (NAND–NAND = SOP).`;
    return `<p><b>Minterms:</b> F = Σm(${ones.join(', ') || '–'})</p>` + tbl([...vars, 'F', ''], rows) +
      `<p><b>K-map</b> (rows and columns in the order 00, 01, 11, 10):</p>` + kmapHtml(n, vars, ones) +
      (r.groups.length ? `<p><b>Groups</b> (largest blocks of 1, 2, 4 or 8 that cover every 1):</p><ul>${r.groups.map(g => `<li><b>${g.str}</b> covers m${g.ms.join(', m')} — the variables that stay the same in the block</li>`).join('')}</ul>` : '') +
      `<p class="ans">Simplest SOP: <b>F = ${r.sop}</b></p>` + (nand ? `<p><b>NAND only:</b> ${h(nand)}</p>` : '');
  }

  /* ───────── flip-flops ───────── */
  function ffNext(type, q, a, b) {
    if (type === 'D') return { q: a, note: a ? 'D = 1 → Q = 1' : 'D = 0 → Q = 0' };
    if (type === 'SR') { if (a && b) return { q: null, note: 'S = R = 1 is NOT allowed' }; if (a) return { q: 1, note: 'set' }; if (b) return { q: 0, note: 'reset' }; return { q, note: 'no change' }; }
    if (a && b) return { q: 1 - q, note: 'toggle (J = K = 1)' }; if (a) return { q: 1, note: 'set' }; if (b) return { q: 0, note: 'reset' }; return { q, note: 'no change' };
  }
  function ffReport(type, q0, seq) {
    const steps = seq.trim().split(/[\s,;]+/).filter(Boolean);
    let q = +q0; const rows = [];
    for (const s of steps) {
      const bits = s.replace(/[^01]/g, '').split('').map(Number);
      const a = bits[0] || 0, b = type === 'D' ? 0 : (bits[1] || 0);
      const r = ffNext(type, q, a, b);
      rows.push([type === 'D' ? a : `${a} ${b}`, q, r.q === null ? '?' : r.q, r.note]);
      if (r.q !== null) q = r.q;
    }
    const head = type === 'D' ? ['D', 'Q (now)', 'Q (after clock)', 'What happens'] : type === 'SR' ? ['S R', 'Q (now)', 'Q (after clock)', 'What happens'] : ['J K', 'Q (now)', 'Q (after clock)', 'What happens'];
    const rule = type === 'JK' ? ['0 0 → no change', '0 1 → reset (Q = 0)', '1 0 → set (Q = 1)', '1 1 → toggle (Q becomes Q′)'] : type === 'SR' ? ['0 0 → no change', '0 1 → reset', '1 0 → set', '1 1 → not allowed'] : ['Q follows D at the clock'];
    return `<p><b>Rules (${type}):</b> ${rule.join(' · ')}</p>` + tbl(head, rows);
  }

  /* ───────── memory size → address bits ───────── */
  function memReport(sizeText, wordBytes) {
    const m = sizeText.trim().toUpperCase().match(/^([\d.]+)\s*([KMG]?)/);
    if (!m) throw 'Write a size like 4K, 64K, 1M';
    const mult = { '': 1, K: 1024, M: 1024 ** 2, G: 1024 ** 3 }[m[2]], words = Math.round(+m[1] * mult / wordBytes);
    const bits = Math.ceil(Math.log2(words)), exact = 2 ** bits === words;
    return `<p>${h(sizeText)} = ${m[1]} × ${mult === 1 ? 1 : (m[2] === 'K' ? '2¹⁰' : m[2] === 'M' ? '2²⁰' : '2³⁰')} = ${(+m[1] * mult).toLocaleString()} bytes` +
      (wordBytes > 1 ? ` ÷ ${wordBytes} bytes per word = ${words.toLocaleString()} words` : ' (byte-addressable: one address per byte)') + `.</p>` +
      `<p>Address bits n must give 2ⁿ ≥ ${words.toLocaleString()} addresses: 2^${bits} = ${(2 ** bits).toLocaleString()}${exact ? ' exactly' : ''}.</p><p class="ans">Address bits: <b>${bits}</b></p>`;
  }

  /* ───────── endianness ───────── */
  function endianReport(hex, start) {
    let x = hex.replace(/^0x/i, '').replace(/[\s_]/g, '').toUpperCase();
    if (!/^[0-9A-F]+$/.test(x)) throw 'Hex only';
    if (x.length % 2) x = '0' + x;
    const bytes = x.match(/../g), a0 = parseInt(String(start).replace(/^0x/i, ''), 16) || 0;
    const addr = i => '0x' + (a0 + i).toString(16).toUpperCase().padStart(2, '0');
    return `<p>The value has ${bytes.length} bytes. The <b>most significant</b> byte is ${bytes[0]}, the least significant is ${bytes[bytes.length - 1]}.</p>` +
      tbl(['Address', 'Big-endian', 'Little-endian'], bytes.map((_, i) => [addr(i), bytes[i], bytes[bytes.length - 1 - i]])) +
      `<p><b>Big-endian:</b> the lowest address holds the most significant byte (reads like the number). <b>Little-endian:</b> the lowest address holds the least significant byte (x86 uses little-endian).</p>`;
  }

  /* ───────── 0/1/2/3-address programs ───────── */
  function parseArith(src) {
    const s = src.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/²/g, '^2').replace(/³/g, '^3').replace(/[−–]/g, '-');
    let i = 0;
    function expr() { let n = term(); while (s[i] === '+' || s[i] === '-') { const op = s[i++]; n = { op, a: n, b: term() }; } return n; }
    function term() { let n = pow(); while (s[i] === '*' || s[i] === '/') { const op = s[i++]; n = { op, a: n, b: pow() }; } return n; }
    function pow() {
      let n = atom();
      if (s[i] === '^') { i++; const k = parseInt(s.slice(i), 10); i += String(k).length; if (!(k >= 1 && k <= 5)) throw 'Powers 1–5 only'; let r = n; for (let j = 1; j < k; j++) r = { op: '*', a: r, b: n }; n = r; }
      return n;
    }
    function atom() {
      if (s[i] === '(') { i++; const n = expr(); if (s[i++] !== ')') throw 'Missing )'; return n; }
      const m = s.slice(i).match(/^[A-Za-z]\w*/); if (!m) throw 'Unexpected "' + (s[i] || 'end') + '"';
      i += m[0].length; return { v: m[0].toUpperCase() };
    }
    const t = expr(); if (i < s.length) throw 'Unexpected "' + s[i] + '"'; return t;
  }
  const OPN = { '+': 'ADD', '-': 'SUB', '*': 'MUL', '/': 'DIV' };
  function progs(target, tree) {
    // 3-address
    let t3 = 0; const p3 = [];
    (function g(n, dest) { if (n.v) return n.v; const a = g(n.a), b = g(n.b), d = dest || 'T' + (++t3); p3.push([`${OPN[n.op]} ${d}, ${a}, ${b}`, `${d} ← ${a} ${n.op} ${b}`]); return d; })(tree, target);
    // 2-address
    let t2 = 0; const p2 = [];
    const comm = n => n.op === '+' || n.op === '*';   // order does not matter, so a leaf on the left can be used last
    (function g(n, dest) {
      if (n.v) { p2.push([`MOV ${dest}, ${n.v}`, `${dest} ← ${n.v}`]); return; }
      if (comm(n) && n.a.v && !n.b.v) { g(n.b, dest); p2.push([`${OPN[n.op]} ${dest}, ${n.a.v}`, `${dest} ← ${dest} ${n.op} ${n.a.v}`]); return; }
      g(n.a, dest);
      if (n.b.v) p2.push([`${OPN[n.op]} ${dest}, ${n.b.v}`, `${dest} ← ${dest} ${n.op} ${n.b.v}`]);
      else { const t = 'T' + (++t2); g(n.b, t); p2.push([`${OPN[n.op]} ${dest}, ${t}`, `${dest} ← ${dest} ${n.op} ${t}`]); }
    })(tree, target);
    // 1-address (accumulator)
    let t1 = 0; const p1 = [];
    (function g(n) {
      if (n.v) { p1.push([`LOAD ${n.v}`, `AC ← ${n.v}`]); return; }
      if (n.b.v) { g(n.a); p1.push([`${OPN[n.op]} ${n.b.v}`, `AC ← AC ${n.op} ${n.b.v}`]); return; }
      if (comm(n) && n.a.v) { g(n.b); p1.push([`${OPN[n.op]} ${n.a.v}`, `AC ← AC ${n.op} ${n.a.v}`]); return; }
      g(n.b); const t = 'T' + (++t1); p1.push([`STORE ${t}`, `${t} ← AC`]); g(n.a); p1.push([`${OPN[n.op]} ${t}`, `AC ← AC ${n.op} ${t}`]);
    })(tree);
    p1.push([`STORE ${target}`, `${target} ← AC`]);
    // 0-address (stack): postfix order
    const p0 = [], stack = [], trace = [];
    (function g(n) {
      if (n.v) { p0.push([`PUSH ${n.v}`, '']); stack.push(n.v); trace.push(stack.slice()); return; }
      g(n.a); g(n.b); const b = stack.pop(), a = stack.pop(); stack.push(`(${a}${n.op}${b})`); p0.push([OPN[n.op], `pop 2, push ${a} ${n.op} ${b}`]); trace.push(stack.slice());
    })(tree);
    p0.push([`POP ${target}`, `${target} ← top of stack`]); trace.push([]);
    p0.forEach((r, i) => r[1] = (r[1] ? r[1] + ' · ' : '') + 'stack: ' + (trace[i].length ? trace[i].join(' | ') : 'empty'));
    return { p0, p1, p2, p3 };
  }
  function addrReport(text) {
    const m = text.match(/^\s*([A-Za-z]\w*)\s*=\s*(.+)$/); if (!m) throw 'Write it like X = (A + B*C) / (D - E*F)';
    const target = m[1].toUpperCase(), p = progs(target, parseArith(m[2]));
    const block = (title, rows, note) => `<h4>${title} <span class="pill">${rows.length} instructions</span></h4>` + tbl(['Instruction', 'Meaning'], rows.map(r => [`<span class="mono">${h(r[0])}</span>`, h(r[1])])) + (note ? `<p class="small">${note}</p>` : '');
    return block('Three-address', p.p3, 'Each instruction names the result and both operands. T1, T2… are temporary locations.') +
      block('Two-address', p.p2, 'The first operand is also the destination, so values are copied (MOV) before they are changed.') +
      block('One-address (accumulator)', p.p1, 'One operand is always the accumulator AC; intermediate results are stored in temporaries.') +
      block('Zero-address (stack)', p.p0, 'Operands are pushed; ADD/SUB/MUL/DIV pop the top two and push the result (postfix order). For SUB and DIV the order is (second from top) op (top).') +
      `<p class="small">Fewer addresses → shorter, simpler instructions but more of them. More addresses → fewer, more powerful instructions.</p>`;
  }

  /* ───────── addressing modes: effective address and operand ───────── */
  function modesReport(A, R, PC, memText) {
    const mem = {}; memText.split(/[,;\n]+/).forEach(p => { const k = p.split(/[:=]/); if (k.length === 2) mem[+k[0].trim()] = +k[1].trim(); });
    const M = x => (x in mem ? mem[x] : '?');
    const rows = [
      ['Immediate', 'operand = A', '—', A, 0],
      ['Direct', 'EA = A', A, M(A), 1],
      ['Indirect', 'EA = (A)', M(A), M(M(A)), 2],
      ['Register', 'EA = R (the register)', 'R', R, 0],
      ['Register indirect', 'EA = (R)', R, M(R), 1],
      ['Displacement / indexed', 'EA = A + (R)', A + R, M(A + R), 1],
      ['Relative', 'EA = A + (PC)', A + PC, M(A + PC), 1],
      ['Stack', 'EA = top of stack (SP)', 'SP', '—', 0],
    ];
    return `<p>A = ${A}, register R holds ${R}, PC = ${PC}. Memory: ${Object.keys(mem).map(k => `[${k}] = ${mem[k]}`).join(', ') || '(none)'}.</p>` +
      tbl(['Mode', 'Rule', 'Effective address', 'Operand', 'Memory refs'], rows.map(r => [`<b>${r[0]}</b>`, r[1], r[2], r[3], r[4]])) +
      `<p class="small">"?" means that address is not in your memory list. Base-register addressing uses the same rule as displacement, with R holding the base and A the offset.</p>`;
  }

  /* ───────── solvers for the Solvers page ───────── */
  window.EXTRA_TOOLS = [
    ['bool', 'Truth table · K-map · simplest SOP · NAND', 'Topic 4', `<label class="wide">F = expression, outputs (e.g. 11010100) or Σm(1,3,5)<input id="xB" value="A'BC + AB'C + ABC" class="mono"></label><label>Variables (for Σm)<select id="xBn"><option value="0">auto</option><option>2</option><option>3</option><option>4</option></select></label>`,
      () => boolReport(document.getElementById('xB').value, +document.getElementById('xBn').value)],
    ['ff', 'Flip-flops (SR / D / JK)', 'Topic 4', `<label>Type<select id="xF"><option>JK</option><option>SR</option><option>D</option></select></label><label>Start Q<select id="xFq"><option>0</option><option>1</option></select></label><label class="wide">Inputs at each clock (JK/SR: pairs like 11 10 00; D: 1 0 1)<input id="xFs" value="11 11 10 01 00" class="mono"></label>`,
      () => ffReport(document.getElementById('xF').value, document.getElementById('xFq').value, document.getElementById('xFs').value)],
    ['mem', 'Memory size → address bits', 'Topic 4/5', `<label>Memory size<input id="xM" value="4K" class="mono"></label><label>Bytes per word<select id="xMw"><option>1</option><option>2</option><option>4</option><option>8</option></select></label>`,
      () => memReport(document.getElementById('xM').value, +document.getElementById('xMw').value)],
    ['endian', 'Big-endian vs little-endian', 'Topic 5', `<label>Value (hex)<input id="xE" value="12345678" class="mono"></label><label>Start address (hex)<input id="xEa" value="0" class="mono"></label>`,
      () => endianReport(document.getElementById('xE').value, document.getElementById('xEa').value)],
    ['naddr', '0-, 1-, 2-, 3-address programs', 'Topic 5', `<label class="wide">Expression<input id="xN" value="X = (A + B*C) / (D - E*F)" class="mono"></label>`,
      () => addrReport(document.getElementById('xN').value)],
    ['modes', 'Addressing modes (EA and operand)', 'Topic 6', `<label>Address field A<input id="xA" value="20" class="mono"></label><label>Register R<input id="xR" value="30" class="mono"></label><label>PC<input id="xP" value="100" class="mono"></label><label class="wide">Memory (address:value, …)<input id="xMm" value="20:40, 30:50, 40:60, 50:70, 120:80" class="mono"></label>`,
      () => modesReport(+document.getElementById('xA').value, +document.getElementById('xR').value, +document.getElementById('xP').value, document.getElementById('xMm').value)],
  ];

  /* ───────── notes ───────── */
  const t4 = TOPICS.find(t => t.id === 't4');
  t4.title = 'Digital Logic'; t4.sub = 'Part 1: Boolean algebra, gates, SOP/POS, K-maps, MUX, decoders, ROM, adders · Part 2: flip-flops, registers, counters, PLDs';
  t4.sections.push(
    { id: 'seq', title: 'Part 2 · Sequential circuits and flip-flops', html: `
      <p>A <b>combinational</b> circuit's output depends only on the inputs now. A <b>sequential</b> circuit also uses <b>stored information</b> (its <b>state</b>): combinational logic + storage elements + a <b>feedback</b> path.</p>
      <p>A <b>flip-flop</b> is the simplest storage element: it stores <b>1 bit</b>, is <b>bistable</b> (two stable states, 0 and 1), keeps its value until a signal changes it, and has two outputs Q and Q′. The <b>clock</b> decides <i>when</i> it updates.</p>
      ${T(['Flip-flop', 'Inputs', 'Behaviour'], [
        ['S-R (latch / clocked)', 'S, R', 'S = 1 sets Q = 1 · R = 1 resets Q = 0 · 00 no change · <b>S = R = 1 not allowed</b>'],
        ['D (data)', 'D', 'Q takes the value of D at the clock. One input, so S = R = 1 can never happen. <b>Used for registers.</b>'],
        ['J-K', 'J, K', 'Like S-R (J sets, K resets) but <b>J = K = 1 toggles</b>: Q becomes Q′'] ])}
      ${T(['J', 'K', 'Q (next)'], [['0', '0', 'Q (no change)'], ['0', '1', '0 (reset)'], ['1', '0', '1 (set)'], ['1', '1', 'Q′ (toggle)']])}
      ${key('<b>Latch vs flip-flop:</b> a latch is level-triggered (it changes whenever its inputs change while enabled); a flip-flop is edge-triggered (it changes only at the clock edge). Uses of flip-flops: registers, counters, shift registers, memory (storing bits), frequency division.')}
      ${check('A J-K flip-flop has Q = 0 and gets J = K = 1 for three clock pulses. What is Q after each?', 'It toggles every pulse: 1, 0, 1. (Try the Flip-flops solver.)')}
    ` },
    { id: 'regs', title: 'Part 2 · Registers and counters', html: `
      <ul>
        <li><b>Register:</b> a group of flip-flops in the CPU that stores one or more bits. <b>Parallel registers</b> read or write all bits at once and use <b>D flip-flops</b>.</li>
        <li><b>Shift register:</b> data enter the left-most flip-flop and move one place each clock pulse. Used for serial I/O and the ALU's shift/rotate. To shift the other way, feed the input to the other end and connect each flip-flop to its other neighbour.</li>
        <li><b>Counter:</b> a register whose value goes up by 1 each clock, modulo its capacity. n flip-flops count 0 to <b>2ⁿ − 1</b>, then wrap to 0 (4 flip-flops: 0–15). The CPU's program counter is a counter.</li>
        <li><b>Ripple counter</b> (asynchronous): J = K = 1 on every flip-flop; each output clocks the next, so changes ripple through. <b>Slow.</b> Q0 toggles most often.</li>
        <li><b>Synchronous counter:</b> all flip-flops share the clock and change together. <b>Faster</b>, used in CPUs. For a 3-bit J-K counter (A = LSB): Ja = Ka = 1, Jb = Kb = A, Jc = Kc = AB.</li>
      </ul>` },
    { id: 'pld', title: 'Part 2 · Programmable logic devices', html: `
      <ul>
        <li><b>PLA</b> (Programmable Logic Array): two programmable levels, an <b>AND-plane</b> and an <b>OR-plane</b>. Every input is also NOTed, so any SOP expression can be built. Made either with fuses at every crossing (blow the unwanted ones: field-programmable) or with the connections made during fabrication.</li>
        <li>A PLA is a <b>simple PLD</b> (SPLD). With many inputs its planes grow too big, so several SPLDs are put on one chip: a <b>CPLD</b>.</li>
        <li><b>FPGA</b> (Field-Programmable Gate Array): an array of uncommitted elements: <b>logic blocks</b> (do the computing; combinational or sequential, programmed by loading a truth table), <b>I/O blocks</b> and programmable <b>interconnect</b>. Very high logic capacity and more flip-flops than CPLDs.</li>
      </ul>` });

  TOPICS.push(
    { id: 't5', num: 5, title: 'Memory, Instructions & Operations', sub: 'Byte addressing, big/little-endian, word alignment, 0/1/2/3-address instructions, stack, operand and operation types, condition codes', weight: 'After Test 1 · Tutorial 6 Q1–Q4',
      sections: [
        { id: 'mem', title: 'Memory locations and byte addressing', html: `
          <p>Giving every bit an address is not practical, so successive addresses go to successive <b>bytes</b>: <b>byte addressability</b>. With 32-bit words (4 bytes) the words start at 0, 4, 8, 12, …; 16-bit words at 0, 2, 4; 64-bit at 0, 8, 16.</p>
          <p><b>Word alignment:</b> a word is aligned when it starts at an address that is a multiple of its size in bytes (always a power of 2).</p>
          <p><b>Address bits:</b> n address bits can name 2ⁿ locations. 4K = 4 × 2¹⁰ = 2¹² → <b>12 bits</b>; 1 KB → 10 bits; 64 KB → 16 bits.</p>
          ${check('How many address bits for 4K of byte-addressable memory?', '4K = 2² × 2¹⁰ = 2¹², so 12 bits.')}` },
        { id: 'endian', title: 'Big-endian and little-endian', html: `
          ${T(['', 'Big-endian', 'Little-endian'], [['Lowest address holds', 'the <b>most</b> significant (leftmost) byte', 'the <b>least</b> significant (rightmost) byte'], ['0x12345678 at address 0', '12 34 56 78', '78 56 34 12'], ['Examples', 'IBM mainframes, network byte order, many RISC', 'Intel x86'], ['Easy to read', 'yes, the bytes are in written order', 'arithmetic starts from the low byte']])}
          <p>Both are used in commercial machines. The byte order matters when data move between machines or are read byte by byte; single bytes (like the characters of a string) look the same in both.</p>
          ${tip('Use the endianness solver to lay out any hex value.')}` },
        { id: 'ops', title: 'Memory operations and instruction notation', html: `
          <p><b>Load</b> (read): copy a memory word into a register; the memory content is unchanged. <b>Store</b> (write): copy a register into memory; the old memory content is overwritten.</p>
          <p>An <b>instruction</b> is one command the processor executes (opcode + operands). The <b>instruction set</b> is all the instructions a processor understands (its ISA). Notation: <span class="mono">R1 ← [LOC]</span> means R1 gets the contents of LOC; <span class="mono">[R3] ← [R1] + [R2]</span>.</p>` },
        { id: 'naddr', title: 'Zero-, one-, two- and three-address instructions', html: `
          ${T(['Type', 'Example', 'Meaning'], [['Three-address', 'ADD R1, R2, R3', 'R1 ← R2 + R3'], ['Two-address', 'ADD R1, R2', 'R1 ← R1 + R2 (destination is also a source)'], ['One-address', 'ADD M', 'AC ← AC + M (accumulator implied)'], ['Zero-address', 'ADD', 'pop two, push the sum (stack implied)']])}
          <div class="example"><div class="ex-h">Slide example: Y = (A − B) / (C + D × E)</div><p class="mono">3-addr: SUB Y,A,B · MPY T,D,E · ADD T,T,C · DIV Y,Y,T<br>0-addr: PUSH A · PUSH B · SUB · PUSH C · PUSH D · PUSH E · MUL · ADD · DIV · POP Y</p></div>
          <p><b>More addresses:</b> more complex instructions, fewer per program. <b>Fewer addresses:</b> simpler, shorter instructions, faster to fetch, but more of them. Design decisions: operation repertoire, data types, instruction format (opcode length, number of addresses), registers, addressing modes.</p>
          <p>The <b>stack</b> is last-in-first-out (LIFO); the stack pointer holds the top. A <b>queue</b> is first-in-first-out (FIFO).</p>
          ${tip('The 0/1/2/3-address solver writes all four programs for any expression, with the stack shown after each step.')}` },
        { id: 'types', title: 'Types of operands and operations; condition codes', html: `
          <p><b>Operands:</b> addresses (unsigned integers), numbers (integer, floating point, decimal / packed decimal), characters (ASCII 7-bit, EBCDIC 8-bit), logical data (bits / flags).</p>
          <p><b>Operations:</b> data transfer (move, load, store, push, pop) · arithmetic (add, subtract, multiply, divide, increment, negate) · logical (AND, OR, NOT, XOR, shift, rotate) · conversion · input/output · system control · transfer of control (branch, skip, call/return).</p>
          <p>Instructions normally run in order (<b>straight-line sequencing</b>, the PC goes up). A <b>branch</b> loads a new address into the PC; a conditional branch tests the <b>condition codes</b> in the status register: <b>N</b> (negative), <b>Z</b> (zero), <b>V</b> (overflow), <b>C</b> (carry). A call/return uses the stack to remember where to come back to.</p>` },
      ] },
    { id: 't6', num: 6, title: 'Addressing Modes & Formats', sub: 'Immediate, direct, indirect, register, register indirect, displacement (relative, base, indexed), stack; instruction formats', weight: 'After Test 1',
      sections: [
        { id: 'modes', title: 'Addressing modes', html: `
          <p>An addressing mode says how the CPU finds the operand from the instruction's address field <b>A</b>. EA = effective address; (X) = "the contents of X".</p>
          ${T(['Mode', 'Rule', 'Memory refs for the operand', 'Pro', 'Con'], [
            ['Immediate', 'operand = A', '0', 'fast, no memory reference', 'value limited by the field size'],
            ['Direct', 'EA = A', '1', 'simple', 'limited address space'],
            ['Indirect', 'EA = (A)', '2', 'large address space (2ⁿ, n = word length)', 'two (or more) memory references, slower'],
            ['Register', 'EA = R', '0', 'very fast, short field', 'few registers, limited space'],
            ['Register indirect', 'EA = (R)', '1', 'large address space', 'one extra memory reference'],
            ['Displacement', 'EA = A + (R)', '1', 'flexible', 'more complex'],
            ['Stack', 'top of stack (SP)', '0 (implied)', 'no address field', 'limited use'] ])}
          <p>Three common kinds of displacement: <b>relative</b> (R = PC, EA = A + (PC), used for branches; exploits locality), <b>base-register</b> (R holds the base, A the offset; easy relocation, e.g. x86 segment registers), <b>indexed</b> (A is the base, R the offset; good for arrays, with autoindexing R++).</p>
          ${tip('Use the Addressing modes solver: enter A, R, PC and a few memory cells to see the EA and operand for every mode.')}
          ${check('A = 20, memory [20] = 40, [40] = 60. What operand does indirect addressing get?', 'EA = (20) = 40, operand = (40) = 60. Two memory references.')}` },
        { id: 'formats', title: 'Instruction formats', html: `
          <p>An instruction format is the layout of the bits: opcode, then operands (and mode bits). Key issues:</p>
          <ul>
            <li><b>Instruction length:</b> affected by memory size and organisation, bus structure, CPU complexity and speed. Trade-off: powerful instructions vs saving space.</li>
            <li><b>Allocation of bits:</b> number of addressing modes (implicit in the opcode, or explicit mode bits), number of operands (2 is typical), register vs memory operands, number of register sets, address range, address granularity.</li>
            <li><b>Variable-length instructions</b> (e.g. VAX, x86) allow more opcodes and modes but make the CPU more complex. PowerPC uses fixed 32-bit formats.</li>
          </ul>
          <p>Bits needed: a field that chooses one of 2ᵏ things needs k bits (16 registers → 4 bits; 64 opcodes → 6 bits).</p>` },
      ] });

  /* ───────── tutorial answers ───────── */
  Object.assign(TUT_GROUPS, { T4: { name: 'Tutorial 4 — Digital Logic 1' }, T5: { name: 'Tutorial 5 — Digital Logic II' }, T6: { name: 'Tutorial 6 — Memory locations and addressing' } });
  const gates = [['OR', 'A + B', [0, 1, 1, 1]], ['AND', 'A · B', [0, 0, 0, 1]], ['AND with inverted inputs (= NOR)', "A'·B' = (A + B)'", [1, 0, 0, 0]], ['NOR', "(A + B)'", [1, 0, 0, 0]], ['NAND', "(A · B)'", [1, 1, 1, 0]], ['OR with inverted inputs (= NAND)', "A' + B' = (A · B)'", [1, 1, 1, 0]], ['XOR', 'A ⊕ B', [0, 1, 1, 0]], ['XNOR', "(A ⊕ B)'", [1, 0, 0, 1]]];
  add('T4', 'Q1 — Name each gate and complete its truth table', () => ({ ans: 'OR, AND, AND(inv) = NOR, NOR, NAND, OR(inv) = NAND, XOR, XNOR, buffer', html:
    tbl(['Gate (in the order on the sheet)', 'Expression', 'AB = 00', '01', '10', '11'], gates.map(g => [g[0], g[1], ...g[2]])) +
    '<p>The last symbol (one input, triangle, no bubble) is a <b>buffer</b>: Output = A (0 → 0, 1 → 1).</p><p class="small">A gate with bubbles on its inputs inverts the inputs first. By De Morgan, an AND with inverted inputs is a NOR and an OR with inverted inputs is a NAND.</p>' }));
  add('T4', 'Q2 — Simplify with the commutative law (and X · X = X, X + X = X)', () => ({ ans: 'Remove the repeated terms', html:
    `<ol><li>(A′+D)(D+A′)(B+E+A′)(A′+E+B)(A+B+C) → <b>(A′ + D)(A′ + B + E)(A + B + C)</b>: (D+A′) = (A′+D) and (A′+E+B) = (B+E+A′).</li>
     <li>(X+Y)(Y+Z)(Y+X) → <b>(X + Y)(Y + Z)</b></li><li>(A+B+C)(D+E+F)(X+Y)(C+A+B) → <b>(A + B + C)(D + E + F)(X + Y)</b></li>
     <li>(ABC)+(A′B′C′)+(B′C′)+A(B+C)+(CBA)+(C′B′) → <b>ABC + A′B′C′ + B′C′ + A(B + C)</b>: CBA = ABC and C′B′ = B′C′.</li></ol>
     <p class="small">Order does not matter (commutative), and a repeated term or bracket adds nothing (idempotent). ⚠ Check the bars on your printed sheet for (a): if a bar differs, the brackets are not the same.</p>` }));
  add('T4', 'Q3 — 3-input K-map from the truth table (outputs 1,1,0,1,0,1,0,0)', () => ({ ans: "F = A'B' + A'C + B'C", html: boolReport('11010100') }));
  add('T4', 'Q4 — 4-input K-map from the truth table', () => ({ ans: 'see the map', html: boolReport('0100010001110101') }));
  add('T4', "Q5 — Simplify A'BC + AB'C + ABC (a) algebra (b) K-map", () => ({ ans: 'F = AC + BC = C(A + B)', html:
    `<p><b>(a) Algebra:</b> A′BC + ABC = BC(A′ + A) = BC. AB′C + ABC = AC(B′ + B) = AC (ABC is used twice: X = X + X). So F = BC + AC = <b>C(A + B)</b>.</p><p><b>(b) K-map:</b></p>` + boolReport("A'BC + AB'C + ABC") }));
  add('T5', 'Q1 — The toggle situation in a J-K flip-flop', () => ({ ans: 'J = K = 1 → Q becomes Q′ every clock', html:
    `<p>When <b>J = K = 1</b>, each clock pulse reverses the output: 0 → 1 → 0 → 1. This is the toggle. (In an S-R flip-flop S = R = 1 is not allowed; the J-K feedback fixes that.)</p>` + ffReport('JK', 0, '00 01 10 11 11 11') }));
  add('T5', 'Q2 — Address bits needed for 4K memory', () => ({ ans: '12 bits', html: memReport('4K', 1) }));
  add('T5', 'Q3 — The universal gates', () => ({ ans: 'NAND and NOR', html:
    `<p><b>NAND</b> and <b>NOR</b> are universal: each one alone can build NOT, AND and OR, so any Boolean function.</p>` +
    tbl(['Build', 'With NAND only', 'With NOR only'], [["NOT A", "(A·A)′", "(A+A)′"], ['A AND B', "((A·B)′)′", "(A′ + B′)′"], ['A OR B', "(A′·B′)′", "((A+B)′)′"]]) +
    '<p class="small">Using one gate type gives a regular design that is cheaper to manufacture.</p>' }));
  add('T5', "Q4 — F = ABC + BCD' + A'BC: truth table, K-map, NAND only", () => ({ ans: 'F = BC; NAND: F = ((BC)′)′', html:
    `<p><b>Algebra check:</b> ABC + A′BC = BC(A + A′) = BC, and BCD′ is already inside BC (absorption), so F = <b>BC</b>.</p>` + boolReport("ABC + BCD' + A'BC") +
    `<p><b>NAND only:</b> one NAND gate on B and C gives (BC)′; a second NAND with both inputs joined inverts it back to BC.</p>` }));
  add('T5', 'Q5 — Flip-flop: definition, latch vs flip-flop, applications', () => ({ ans: '1-bit bistable store; latch = level, flip-flop = edge', html:
    `<ul><li><b>Flip-flop:</b> a bistable sequential circuit that stores 1 bit (Q and Q′) and keeps it until the clock and inputs change it.</li>
     <li><b>Latch</b>: level-triggered, its output follows the inputs while it is enabled. <b>Flip-flop</b>: edge-triggered, it changes only at the clock edge, so all flip-flops in a system change together.</li>
     <li><b>Applications:</b> registers (D flip-flops), shift registers, counters (the program counter), storing a bit of memory, frequency division and synchronising signals.</li></ul>` }));
  add('T6', 'Q1 — Instruction and instruction set', () => ({ ans: 'One command vs all commands of the CPU', html:
    `<p>An <b>instruction</b> is a binary command the processor executes: an <b>opcode</b> (what to do) and <b>operands</b> (what to do it to: registers, memory addresses or values). The <b>instruction set</b> is the complete collection of instructions a processor can execute (data transfer, arithmetic, logical, conversion, I/O, system control, transfer of control). It is the part of the architecture the programmer sees.</p>` }));
  add('T6', 'Q2 — Big-endian vs little-endian', () => ({ ans: 'Which byte goes at the lowest address', html: endianReport('12345678', '0') + '<p><b>Common architecture:</b> big-endian: IBM mainframes, network protocols, many older RISC designs; little-endian: Intel x86 (and most PCs). Some (ARM, PowerPC) can switch.</p>' }));
  add('T6', 'Q3 — Stack machine program for X = (A + B²) / (D² − E)', () => ({ ans: 'PUSH A, PUSH B, PUSH B, MUL, ADD, PUSH D, PUSH D, MUL, PUSH E, SUB, DIV, POP X', html: (() => { const p = progs('X', parseArith('(A + B^2) / (D^2 - E)')); return tbl(['Instruction', 'Stack after it'], p.p0.map(r => [`<span class="mono">${r[0]}</span>`, h(r[1])])); })() }));
  add('T6', 'Q4 — X = (A + B×C) / (D − E×F) on 0-, 1-, 2- and 3-address machines', () => ({ ans: '3-addr: 5 · 2-addr: 8 · 1-addr: 11 · 0-addr: 12 instructions', html: addrReport('X = (A + B*C) / (D - E*F)') }));

  /* ───────── bank questions (w = why each option, in order) ───────── */
  const Qs = [
    [4, 'A sequential circuit differs from a combinational circuit because it:', ['Uses stored information (state) as well as the current inputs', 'Has no inputs', 'Always uses more gates', 'Cannot have a clock'], ['Correct. Its output depends on the inputs and on stored state, kept by a feedback path.', 'It has inputs.', 'Gate count is not the difference.', 'Sequential circuits usually have a clock.']],
    [4, 'A flip-flop stores:', ['1 bit', '1 byte', 'One word', 'One instruction'], ['Correct. It is bistable: Q is 0 or 1.', 'A byte needs 8 flip-flops.', 'A word needs a whole register.', 'An instruction needs many bits.']],
    [4, 'In an S-R flip-flop, which input combination is not allowed?', ['S = 1, R = 1', 'S = 0, R = 0', 'S = 1, R = 0', 'S = 0, R = 1'], ['Correct. Setting and resetting at once gives an undefined state.', '00 means no change.', '10 sets Q = 1.', '01 resets Q = 0.']],
    [4, 'A J-K flip-flop with J = K = 1:', ['Toggles: Q becomes Q′', 'Is not allowed', 'Always sets Q = 1', 'Keeps Q unchanged'], ['Correct. That is the toggle situation.', 'That is S = R = 1 in an S-R flip-flop.', 'Set is J = 1, K = 0.', 'No change is J = K = 0.']],
    [4, 'Which flip-flop is used to build parallel registers?', ['D flip-flop', 'J-K flip-flop only', 'S-R flip-flop only', 'None, registers have no flip-flops'], ['Correct. The slides: parallel registers use D flip-flops.', 'J-K is typical for counters.', 'S-R can have the forbidden 11 input.', 'Registers are made of flip-flops.']],
    [4, 'A counter built from 4 flip-flops counts from 0 up to:', ['15', '16', '4', '8'], ['Correct. 2⁴ − 1 = 15, then it wraps to 0.', '16 needs 5 bits.', '4 is the number of flip-flops.', '8 is 2³.']],
    [4, 'Why is a synchronous counter faster than a ripple counter?', ['All flip-flops change at the same time on the common clock', 'It has fewer flip-flops', 'It never toggles', 'It uses no clock'], ['Correct. In a ripple counter each flip-flop waits for the one before it.', 'It has the same number of flip-flops.', 'Its flip-flops toggle too.', 'It uses one shared clock.']],
    [4, 'A PLA has which two programmable levels?', ['An AND-plane and an OR-plane', 'An OR-plane and a NOT-plane', 'Two flip-flop planes', 'A decoder and a counter'], ['Correct. That lets it build any SOP expression.', 'Inputs are NOTed, but the programmable planes are AND and OR.', 'A PLA is combinational.', 'Not the PLA structure.']],
    [4, 'The key components of an FPGA are:', ['Logic blocks, I/O blocks and interconnect', 'Only AND gates', 'Vacuum tubes and relays', 'A single ALU'], ['Correct. Logic blocks compute, I/O blocks connect pins, interconnect joins them.', 'An FPGA is much more general.', 'Not modern devices.', 'An FPGA has many logic blocks.']],
    [5, 'With byte addressing and 32-bit words, successive words start at addresses:', ['0, 4, 8, 12', '0, 1, 2, 3', '0, 2, 4, 6', '0, 32, 64, 96'], ['Correct. Each 32-bit word is 4 bytes.', 'Those are byte addresses.', 'That is for 16-bit words.', 'Addresses count bytes, not bits.']],
    [5, 'How many address bits are needed for 4K of byte-addressable memory?', ['12', '4', '10', '16'], ['Correct. 4K = 2¹².', '4 bits give only 16 addresses.', '10 bits give 1K.', '16 bits give 64K.']],
    [5, 'In little-endian, the lowest address holds:', ['The least significant byte', 'The most significant byte', 'The middle byte', 'The address itself'], ['Correct. 0x12345678 is stored 78 56 34 12.', 'That is big-endian.', 'There is no such rule.', 'Memory holds data.']],
    [5, 'Intel x86 processors are:', ['Little-endian', 'Big-endian', 'Neither', 'Middle-endian'], ['Correct.', 'IBM mainframes are big-endian.', 'x86 has a fixed byte order: little-endian.', 'Not x86.']],
    [5, 'A word is aligned when it starts at an address that is:', ['A multiple of its size in bytes', 'An odd number', 'Always 0', 'A prime number'], ['Correct. e.g. 32-bit words at 0, 4, 8, …', 'Odd addresses are misaligned for multi-byte words.', 'Every multiple of the size works.', 'Not related to primes.']],
    [5, 'ADD R1, R2 meaning R1 ← R1 + R2 is a:', ['Two-address instruction', 'Three-address instruction', 'One-address instruction', 'Zero-address instruction'], ['Correct. The first operand is both a source and the destination.', 'A three-address one names the result separately.', 'A one-address one uses the accumulator.', 'A zero-address one uses the stack.']],
    [5, 'A zero-address machine gets its operands from:', ['The stack', 'The accumulator only', 'Three registers named in the instruction', 'The keyboard'], ['Correct. ADD pops the top two and pushes the result.', 'That is a one-address machine.', 'That is a three-address machine.', 'Not an addressing source.']],
    [5, 'Fewer addresses per instruction means:', ['Simpler, shorter instructions but more instructions per program', 'Fewer instructions per program', 'More complex instructions', 'No need for memory'], ['Correct. That is the trade-off on the slides.', 'More addresses give fewer instructions.', 'More addresses give more complex instructions.', 'Memory is still needed.']],
    [5, 'The Z condition code flag is set when:', ['The result is zero', 'The result is negative', 'There is a carry out', 'Arithmetic overflow happens'], ['Correct.', 'That is N.', 'That is C.', 'That is V.']],
    [5, 'Which is a transfer-of-control operation?', ['Branch', 'Load', 'AND', 'Convert'], ['Correct. It changes the PC.', 'Load is data transfer.', 'AND is logical.', 'Convert is conversion.']],
    [6, 'In immediate addressing the operand is:', ['Part of the instruction (the address field)', 'In memory at address A', 'In a register', 'On the stack'], ['Correct. No memory reference is needed.', 'That is direct addressing.', 'That is register addressing.', 'That is stack addressing.']],
    [6, 'In indirect addressing, EA =', ['(A)', 'A', 'A + (R)', '(R)'], ['Correct. The cell at A holds the address of the operand: two memory references.', 'That is direct.', 'That is displacement.', 'That is register indirect.']],
    [6, 'A = 20, memory [20] = 40, [40] = 60. With indirect addressing the operand is:', ['60', '40', '20', '80'], ['Correct. EA = (20) = 40, operand = (40) = 60.', '40 is the effective address.', '20 is A.', 'Not a value in memory here.']],
    [6, 'Relative addressing computes EA =', ['A + (PC)', 'A + (SP)', '(A)', 'A only'], ['Correct. Used for branches.', 'That uses the stack pointer.', 'That is indirect.', 'That is direct.']],
    [6, 'Which addressing mode is best for stepping through an array?', ['Indexed', 'Immediate', 'Direct', 'Register'], ['Correct. EA = A + (R), with R++ (autoindexing).', 'Immediate holds a constant.', 'Direct is one fixed address.', 'Register holds one value.']],
    [6, 'Which mode needs the most memory references to get the operand?', ['Indirect', 'Immediate', 'Register', 'Register indirect'], ['Correct. One to read the address, one for the operand (more if nested).', 'Immediate needs none.', 'Register needs none.', 'Register indirect needs one.']],
    [6, 'Base-register addressing makes it easy to:', ['Relocate a program in memory (only the base register changes)', 'Store constants', 'Avoid using registers', 'Make instructions longer'], ['Correct.', 'That is immediate.', 'It uses a register.', 'Not its purpose.']],
    [6, 'How many bits does a field need to choose one of 16 registers?', ['4', '16', '8', '2'], ['Correct. 2⁴ = 16.', '16 is the number of registers.', '8 bits choose one of 256.', '2 bits choose one of 4.']],
  ];
  Qs.forEach(([t, q, o, w]) => BANK.push({ t, q, o, a: 0, w, e: w[0].replace(/^Correct\.\s*/, '') || 'See the notes.' }));
  const banks = { 4: 'bank4', 5: 'bank5', 6: 'bank6' };
  [5, 6].forEach(t => DYNAMIC.push({ id: banks[t], title: `Topic ${t} question bank`, short: `Topic ${t} bank`, minutes: 30, shuffle: true,
    build: () => shuffleArr(conceptPool(t)), blurb: t === 5 ? 'Byte addressing, endianness, alignment, 0/1/2/3-address instructions, operand and operation types, condition codes.' : 'Immediate, direct, indirect, register, register indirect, displacement, relative, base, indexed and stack addressing; instruction formats.' }));
})();
