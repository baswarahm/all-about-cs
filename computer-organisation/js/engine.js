/* ============ engine.js — number helpers + step-by-step solvers ============ */

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const DIG = '0123456789ABCDEF';
const bin = (v, n) => (((v % 2 ** n) + 2 ** n) % 2 ** n).toString(2).padStart(n, '0');
const sval = s => parseInt(s, 2) - (s[0] === '1' ? 2 ** s.length : 0);   // 2's comp -> decimal
const sub = (x, b) => `(${x})<sub>${b}</sub>`;
const invert = s => s.replace(/[01]/g, c => (c === '0' ? '1' : '0'));
const fmt = x => +x.toFixed(6) + '';
function tbl(head, rows, cls = 'mono small') {
  return `<table class="tbl ${cls}"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>` +
    rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') + '</table>';
}

/* ---------- number conversion ---------- */
function parseBase(str, b) {
  str = String(str).trim().toUpperCase().replace(/\s/g, '');
  let neg = false;
  if (str[0] === '-') { neg = true; str = str.slice(1); }
  if (!str || (str.match(/\./g) || []).length > 1) return NaN;
  const [ip, fp = ''] = str.split('.');
  let v = 0;
  for (const c of ip) { const d = DIG.indexOf(c); if (d < 0 || d >= b) return NaN; v = v * b + d; }
  let f = 0, p = 1 / b;
  for (const c of fp) { const d = DIG.indexOf(c); if (d < 0 || d >= b) return NaN; f += d * p; p /= b; }
  return (neg ? -1 : 1) * (v + f);
}
function toBase(x, b, maxF = 12) {
  const neg = x < 0; x = Math.abs(x);
  let ip = Math.floor(x), fp = x - ip;
  let s = ip.toString(b).toUpperCase();
  if (fp > 1e-12) {
    s += '.'; let k = 0;
    while (fp > 1e-12 && k < maxF) { fp *= b; const d = Math.floor(fp + 1e-9); s += DIG[Math.min(d, b - 1)]; fp = Math.max(0, fp - d); k++; }
    if (fp > 1e-9) s += '…';
  }
  return (neg ? '-' : '') + s;
}
function expandSteps(str, b) {             // base b -> decimal
  str = str.toUpperCase().replace('-', '');
  const [ip, fp = ''] = str.split('.');
  const terms = [], vals = [];
  [...ip].forEach((c, i) => { const p = ip.length - 1 - i; terms.push(`${c}×${b}<sup>${p}</sup>`); vals.push(fmt(DIG.indexOf(c) * b ** p)); });
  [...fp].forEach((c, i) => { const p = -(i + 1); terms.push(`${c}×${b}<sup>${p}</sup>`); vals.push(fmt(DIG.indexOf(c) * b ** p)); });
  return `<p>Multiply each digit by its place value and add:</p><p class="mono">${terms.join(' + ')}<br>= ${vals.join(' + ')}<br>= <b>${fmt(parseBase(str, b))}</b></p>`;
}
function divideSteps(n, b) {               // decimal integer -> base b
  if (n === 0) return '<p>Integer part is 0.</p>';
  const rows = []; let x = n;
  while (x > 0) { rows.push([`${x} ÷ ${b}`, Math.floor(x / b), `${x % b}${x % b > 9 ? ' (' + DIG[x % b] + ')' : ''}`]); x = Math.floor(x / b); }
  return `<p>Integer part: divide by ${b}, read remainders <b>bottom-up</b>.</p>` + tbl(['Division', 'Quotient', 'Remainder'], rows) +
    `<p>→ <b class="mono">${n.toString(b).toUpperCase()}</b></p>`;
}
function fracSteps(f, b, maxF = 12) {      // decimal fraction -> base b
  const rows = []; let k = 0, out = '';
  while (f > 1e-12 && k < maxF) { const p = f * b, d = Math.floor(p + 1e-9); rows.push([`${fmt(f)} × ${b}`, fmt(p), DIG[d]]); out += DIG[d]; f = Math.max(0, p - d); k++; }
  return `<p>Fraction part: multiply by ${b}, read integer parts <b>top-down</b>.</p>` + tbl(['Multiply', 'Result', 'Digit'], rows) +
    `<p>→ <b class="mono">.${out}${f > 1e-9 ? '…' : ''}</b></p>`;
}
function groupSteps(binStr, g) {           // binary -> base 2^g
  let [ip, fp = ''] = binStr.split('.');
  while (ip.length % g) ip = '0' + ip;
  while (fp.length % g) fp += '0';
  const gi = ip.match(new RegExp(`.{${g}}`, 'g')) || [], gf = fp.match(new RegExp(`.{${g}}`, 'g')) || [];
  const conv = x => DIG[parseInt(x, 2)];
  let res = gi.map(conv).join('').replace(/^0+(?=.)/, '') + (gf.length ? '.' + gf.map(conv).join('') : '');
  const rows = [[...gi, ...(gf.length ? ['.'] : []), ...gf], [...gi.map(conv), ...(gf.length ? ['.'] : []), ...gf.map(conv)]];
  return { html: `<p>Group into ${g}-bit groups from the point (pad with 0s):</p>` + tbl(rows[0], [rows[1]]), res };
}
function ungroupSteps(str, b) {            // base 8/16 -> binary
  const g = b === 8 ? 3 : 4;
  const parts = [...str.toUpperCase()].map(c => c === '.' ? '.' : DIG.indexOf(c).toString(2).padStart(g, '0'));
  let res = parts.join('');
  let [ip, fp = ''] = res.split('.');
  ip = ip.replace(/^0+(?=.)/, ''); fp = fp.replace(/0+$/, '');
  res = ip + (fp ? '.' + fp : '');
  return { html: `<p>Replace each digit by its ${g}-bit binary:</p>` + tbl([...str.toUpperCase()], [parts]), res };
}
function convertExplain(str, b1, b2) {
  str = String(str).trim().toUpperCase();
  const v = parseBase(str, b1);
  if (isNaN(v)) return { answer: null, html: `<p class="err">"${str}" is not a valid base-${b1} number.</p>` };
  if (v < 0) return { answer: null, html: `<p class="err">Enter a positive number (use the Integer representations tool for negatives).</p>` };
  const answer = toBase(v, b2);
  let html = '';
  const pow2 = { 2: 1, 8: 3, 16: 4 };
  if (b1 === 2 && (b2 === 8 || b2 === 16)) html = groupSteps(str, pow2[b2]).html;
  else if ((b1 === 8 || b1 === 16) && b2 === 2) html = ungroupSteps(str, b1).html;
  else if ((b1 === 8 || b1 === 16) && (b2 === 8 || b2 === 16) && b1 !== b2) {
    const u = ungroupSteps(str, b1); const g = groupSteps(u.res, pow2[b2]);
    html = `<p><b>Step 1:</b> base ${b1} → binary</p>${u.html}<p class="mono">= ${u.res}</p><p><b>Step 2:</b> binary → base ${b2}</p>${g.html}`;
  } else {
    if (b1 !== 10) html += (b2 !== 10 ? `<p><b>Step 1:</b> base ${b1} → decimal</p>` : '') + expandSteps(str, b1);
    if (b2 !== 10) {
      html += b1 !== 10 ? `<p><b>Step 2:</b> decimal → base ${b2}</p>` : '';
      const ip = Math.floor(v), fp = v - ip;
      html += divideSteps(ip, b2);
      if (fp > 1e-12) html += fracSteps(fp, b2);
    }
  }
  html += `<p>Answer: <b class="mono">${sub(str, b1)} = ${sub(answer, b2)}</b></p>`;
  return { answer, html };
}

/* ---------- arithmetic traces ---------- */
function twosSteps(v, n) {
  if (v >= 0) return `<p>${v} is positive → plain binary: <b class="mono">${bin(v, n)}</b></p>`;
  const p = bin(-v, n), o = invert(p);
  return `<p>+${-v} = <span class="mono">${p}</span> → invert (1's) = <span class="mono">${o}</span> → add 1 = <b class="mono">${bin(v, n)}</b></p>`;
}
function addTrace(a, b, n, op) {           // op '+' or '-'
  const lo = -(2 ** (n - 1)), hi = 2 ** (n - 1) - 1;
  if ([a, b].some(x => x < lo || x > hi)) return { html: `<p class="err">Operands must be in ${lo} … ${hi} for ${n} bits.</p>` };
  let html = `<p><b>A = ${a}:</b></p>${twosSteps(a, n)}<p><b>B = ${b}:</b></p>${twosSteps(b, n)}`;
  let B = bin(b, n), bv = b;
  if (op === '-') {
    bv = -b; const nb = bin(-b, n);
    html += `<p><b>Subtraction → A + (2's complement of B)</b>: 2's comp of <span class="mono">${B}</span> = <span class="mono">${nb}</span></p>`;
    if (b === lo) html += `<p class="muted">(Note: −(${lo}) can't be represented in ${n} bits; its 2's complement is itself.)</p>`;
    B = nb;
  }
  const A = bin(a, n);
  const raw = parseInt(A, 2) + parseInt(B, 2);
  const carry = raw >= 2 ** n ? 1 : 0;
  const res = bin(raw, n);
  const trueVal = op === '-' ? a - b : a + b;
  const ovf = trueVal < lo || trueVal > hi;
  html += tbl(['', 'Bits'], [['A', A], [op === '-' ? '+ (−B)' : '+ B', B], ['Sum', `${carry ? '<s>1</s>' : ''}${res}`]]);
  if (carry) html += `<p>Carry out of the MSB is <b>discarded</b>.</p>`;
  html += `<p>Result: <b class="mono">${res}</b> = ${sval(res)} &nbsp;·&nbsp; Overflow: <b>${ovf ? 'YES' : 'NO'}</b></p>`;
  html += ovf ? `<p class="tip">Both operands (after negation) have the same sign but the result's sign is different → overflow. True answer ${trueVal} needs more than ${n} bits.</p>`
    : `<p class="muted">Check: ${a} ${op === '-' ? '−' : '+'} ${b} = ${trueVal}</p>`;
  return { html, res, ovf };
}
function addShiftTrace(m, q, n) {
  const mask = 2 ** n - 1;
  if (m < 0 || q < 0 || m > mask || q > mask) return { html: `<p class="err">M and Q must be 0 … ${mask} for ${n} bits.</p>` };
  let C = 0, A = 0, Q = q;
  const M = bin(m, n), rows = [['0', 'Initialise', C, bin(A, n), bin(Q, n)]];
  for (let i = 1; i <= n; i++) {
    if (Q & 1) { const s = A + m; C = (s >> n) & 1; A = s & mask; rows.push([i, 'Q₀ = 1 → A ← A + M', C, bin(A, n), bin(Q, n)]); }
    else rows.push([i, 'Q₀ = 0 → no add', C, bin(A, n), bin(Q, n)]);
    Q = (Q >>> 1) | ((A & 1) << (n - 1)); A = (A >>> 1) | (C << (n - 1)); C = 0;
    rows.push([i, 'Shift right C, A, Q', C, bin(A, n), bin(Q, n)]);
  }
  const prod = bin(A, n) + bin(Q, n);
  return { res: prod, html: `<p>M = ${m} = <span class="mono">${M}</span>, Q = ${q} = <span class="mono">${bin(q, n)}</span></p>` +
    tbl(['Cycle', 'Operation', 'C', 'A', 'Q'], rows) + `<p>Product = A Q = <b class="mono">${prod}</b> = ${parseInt(prod, 2)} (check: ${m} × ${q})</p>` };
}
function boothTrace(m, q, n) {
  const mask = 2 ** n - 1, lo = -(2 ** (n - 1)), hi = 2 ** (n - 1) - 1;
  if (q < lo || q > hi || m <= lo || m > hi) return { html: `<p class="err">For ${n} bits: M must be ${lo + 1} … ${hi} and Q must be ${lo} … ${hi}. Use more bits.</p>` };
  let A = 0, Q = parseInt(bin(q, n), 2), Q1 = 0;
  const Mb = parseInt(bin(m, n), 2), negM = parseInt(bin(-m, n), 2);
  const rows = [['0', 'Initialise', bin(A, n), bin(Q, n), Q1]];
  for (let i = 1; i <= n; i++) {
    const q0 = Q & 1;
    if (q0 === 1 && Q1 === 0) { A = (A + negM) & mask; rows.push([i, '10 → A ← A − M', bin(A, n), bin(Q, n), Q1]); }
    else if (q0 === 0 && Q1 === 1) { A = (A + Mb) & mask; rows.push([i, '01 → A ← A + M', bin(A, n), bin(Q, n), Q1]); }
    Q1 = Q & 1; Q = (Q >>> 1) | ((A & 1) << (n - 1)); A = (A >>> 1) | (A & (1 << (n - 1)));
    rows.push([i, 'Arithmetic shift right A, Q, Q₋₁', bin(A, n), bin(Q, n), Q1]);
  }
  const prod = bin(A, n) + bin(Q, n);
  return { res: prod, html: `<p>M = ${m} = <span class="mono">${bin(m, n)}</span>, −M = <span class="mono">${bin(-m, n)}</span>, Q = ${q} = <span class="mono">${bin(q, n)}</span>, Q₋₁ = 0</p>` +
    tbl(['Cycle', 'Operation', 'A', 'Q', 'Q₋₁'], rows) + `<p>Product = A Q = <b class="mono">${prod}</b> = ${sval(prod)} (check: ${m} × ${q})</p>` };
}
function divTrace(dd, dv, n) {
  const mask = 2 ** n - 1;
  if (dd < 0 || dd > mask) return { html: `<p class="err">Dividend must be 0 … ${mask} for ${n} bits.</p>` };
  if (dv < 1 || dv > 2 ** (n - 1) - 1) return { html: `<p class="err">Divisor must be 1 … ${2 ** (n - 1) - 1} for ${n} bits (or use more bits).</p>` };
  let A = 0, Q = dd;
  const rows = [['0', 'Initialise', bin(A, n), bin(Q, n)]];
  for (let i = 1; i <= n; i++) {
    A = ((A << 1) | ((Q >> (n - 1)) & 1)) & mask; Q = (Q << 1) & mask;
    rows.push([i, 'Shift left A, Q', bin(A, n), bin(Q, n).slice(0, -1) + '_']);
    const d = A - dv;
    if (d < 0) {
      rows.push([i, 'A ← A − M (negative)', bin(d, n), bin(Q, n).slice(0, -1) + '_']);
      rows.push([i, 'A &lt; 0 → Q₀ = 0, restore A ← A + M', bin(A, n), bin(Q, n)]);
    } else {
      A = d; Q |= 1;
      rows.push([i, 'A ← A − M ≥ 0 → Q₀ = 1', bin(A, n), bin(Q, n)]);
    }
  }
  return { q: bin(Q, n), r: bin(A, n), html: `<p>Q (dividend) = ${dd} = <span class="mono">${bin(dd, n)}</span>, M (divisor) = ${dv} = <span class="mono">${bin(dv, n)}</span>, −M = <span class="mono">${bin(-dv, n)}</span></p>` +
    tbl(['Cycle', 'Operation', 'A', 'Q'], rows) + `<p>Quotient = Q = <b class="mono">${bin(Q, n)}</b> (${Q}), Remainder = A = <b class="mono">${bin(A, n)}</b> (${A}) (check: ${dd} ÷ ${dv})</p>` };
}
function ieeeBits(x) { const f = new Float32Array([x]); return new Uint32Array(f.buffer)[0].toString(2).padStart(32, '0'); }
function ieeeEncodeExplain(x) {
  if (!isFinite(x)) return { html: '<p class="err">Enter a number.</p>' };
  const b = ieeeBits(x), s = b[0], e = b.slice(1, 9), m = b.slice(9);
  if (x === 0) return { s, e, m, html: `<p>Zero is a special case: all exponent and fraction bits are 0.</p><p class="mono"><b>${s} ${e} ${m}</b></p>` };
  const E = parseInt(e, 2), ex = E - 127;
  const absBin = toBase(Math.abs(x), 2, 40);
  const frac = m.replace(/0+$/, '');
  const exact = Math.fround(x) === x;
  return { s, e, m, html:
    `<p><b>1. Sign:</b> ${x < 0 ? 'negative → S = 1' : 'positive → S = 0'}</p>` +
    `<p><b>2. Binary:</b> |${x}| = <span class="mono">${absBin}</span><sub>2</sub></p>` +
    `<p><b>3. Normalise:</b> <span class="mono">1.${frac || '0'} × 2<sup>${ex}</sup></span></p>` +
    `<p><b>4. Biased exponent:</b> ${ex} + 127 = ${E} = <span class="mono">${e}</span></p>` +
    `<p><b>5. Fraction:</b> bits after the leading 1, padded to 23: <span class="mono">${m}</span></p>` +
    (exact ? '' : `<p class="muted">(Not exactly representable — the fraction is rounded to 23 bits.)</p>`) +
    `<p>Answer: <b class="mono">${s} ${e} ${m}</b></p>` };
}
function ieeeDecodeExplain(bits) {
  bits = String(bits).replace(/\s/g, '');
  if (!/^[01]{32}$/.test(bits)) return { html: '<p class="err">Enter exactly 32 bits (spaces allowed).</p>' };
  const s = bits[0], e = bits.slice(1, 9), m = bits.slice(9), E = parseInt(e, 2);
  const u = new Uint32Array([parseInt(bits, 2)]); const v = new Float32Array(u.buffer)[0];
  if (E === 255) return { v, html: `<p>Exponent all 1s → ${/1/.test(m) ? 'NaN' : (s === '1' ? '−∞' : '+∞')}</p>` };
  if (E === 0) return { v, html: `<p>Exponent all 0s → zero/denormalised number: ${v}</p>` };
  const frac = m.replace(/0+$/, '');
  return { v, html:
    `<p>S = ${s} (${s === '1' ? 'negative' : 'positive'}), E = <span class="mono">${e}</span> = ${E} → e = ${E} − 127 = ${E - 127}, fraction = <span class="mono">${m}</span></p>` +
    `<p>Value = ${s === '1' ? '−' : '+'}<span class="mono">1.${frac || '0'}</span> × 2<sup>${E - 127}</sup>` +
    (E - 127 >= 0 && E - 127 <= 30 ? ` = ${s === '1' ? '−' : ''}<span class="mono">${toBase(Math.abs(v), 2, 40)}</span><sub>2</sub>` : '') +
    ` = <b>${v}</b></p>` };
}
function mipsExplain(fMHz, mix, Ic) {
  const tot = mix.reduce((a, c) => a + c[1], 0);
  if (Math.abs(tot - 100) > 0.01) return { html: `<p class="err">Percentages add to ${tot}, not 100.</p>` };
  const cpi = mix.reduce((a, c) => a + c[0] * c[1] / 100, 0);
  const mips = fMHz / cpi;
  const T = Ic ? Ic * cpi / (fMHz * 1e6) : null;
  return { cpi, mips, T, html:
    `<p><b>Average CPI</b> = ${mix.map(c => `${c[0]}×${c[1] / 100}`).join(' + ')} = <b>${fmt(cpi)}</b></p>` +
    `<p><b>MIPS</b> = f / (CPI × 10<sup>6</sup>) = ${fMHz}×10<sup>6</sup> / (${fmt(cpi)} × 10<sup>6</sup>) = <b>${fmt(mips)}</b></p>` +
    (T !== null ? `<p><b>T</b> = I<sub>c</sub> × CPI / f = ${Ic.toLocaleString()} × ${fmt(cpi)} / ${fMHz}×10<sup>6</sup> = <b>${fmt(T * 1000)} ms</b></p>` : '') };
}


function baseAddExplain(A, C, b) {
  A = A.toUpperCase(); C = C.toUpperCase();
  const a = parseBase(A, b), c = parseBase(C, b), R = (a + c).toString(b).toUpperCase();
  const len = Math.max(A.length, C.length); let carry = 0; const rows = [];
  for (let i = 0; i < len; i++) {
    const da = DIG.indexOf(A.padStart(len, '0')[len - 1 - i]), dc = DIG.indexOf(C.padStart(len, '0')[len - 1 - i]);
    const s = da + dc + carry;
    rows.push([`${i}`, `${da} + ${dc}${carry ? ' + 1' : ''} = ${s}`, `${DIG[s % b]}${s >= b ? ` (${s} − ${b})` : ''}`, Math.floor(s / b)]);
    carry = Math.floor(s / b);
  }
  if (carry) rows.push([`${len}`, 'final carry', '1', '']);
  return { answer: R, html: `<p>Add column by column from the right. If a column sum is ${b} or more, write sum − ${b} and carry 1.</p>` +
    tbl(['Column', 'Sum (decimal)', 'Write', 'Carry'], rows) + `<p>${sub(A, b)} + ${sub(C, b)} = <b class="mono">${sub(R, b)}</b> <span class="muted">(check: ${a} + ${c} = ${a + c})</span></p>` };
}
function twosOfExplain(s) {
  const len = s.length, k = s.lastIndexOf('1');
  if (k < 0) return { answer: s, html: '<p>All zeros: the 2’s complement of 0 is 0.</p>' };
  const ans = invert(s.slice(0, k)) + s.slice(k);
  const plus1 = bin(parseInt(invert(s), 2) + 1, len);
  return { answer: ans, html: `<p><b>Method 1:</b> invert → <span class="mono">${invert(s)}</span>, add 1 → <span class="mono">${plus1}</span>${parseInt(invert(s), 2) + 1 >= 2 ** len ? ' (carry out dropped)' : ''}</p>` +
    `<p><b>Method 2 (shortcut):</b> keep <span class="mono">${s.slice(k)}</span> (up to the first 1 from the right), flip <span class="mono">${s.slice(0, k) || '—'}</span> → <span class="mono">${invert(s.slice(0, k)) || '—'}</span></p>` +
    `<p>Answer: <b class="mono">${ans}</b></p>` };
}
function binSubExplain(Ms, Ns) {
  const n = Math.max(Ms.length, Ns.length);
  const M = Ms.padStart(n, '0'), N = Ns.padStart(n, '0');
  const m = parseInt(M, 2), nn = parseInt(N, 2);
  const comp = bin(-nn, n), sum = m + parseInt(comp, 2), carry = sum >= 2 ** n, S = bin(sum, n);
  let html = `<p>Pad both to ${n} bits: M = <span class="mono">${M}</span> (${m}), N = <span class="mono">${N}</span> (${nn}).</p>` +
    `<p>2’s complement of N = <span class="mono">${comp}</span></p>` +
    tbl(['', 'Bits'], [['M', M], ['+ 2’s comp N', comp], ['Sum', (carry ? '<s>1</s>' : '') + S]]);
  let answer;
  if (carry) { answer = S.replace(/^0+(?=.)/, ''); html += `<p>There is an end carry → discard it; the result is positive: <b class="mono">${S}</b> = ${m - nn}</p>`; }
  else { const t = bin(-sum, n); answer = '-' + t.replace(/^0+(?=.)/, ''); html += `<p>No end carry → the result is negative. Take the 2’s complement of the sum: <span class="mono">${S}</span> → <span class="mono">${t}</span>, so the answer is <b class="mono">−${t.replace(/^0+(?=.)/, '')}</b> = ${m - nn}</p>`; }
  return { answer, html };
}
function signMagExplain(v, n = 8) {
  const ans = (v < 0 ? '1' : '0') + bin(Math.abs(v), n - 1);
  return { answer: ans, html: `<p>Sign bit = ${v < 0 ? '1 (negative)' : '0 (positive)'}; magnitude ${Math.abs(v)} in ${n - 1} bits = <span class="mono">${bin(Math.abs(v), n - 1)}</span></p><p>Answer: <b class="mono">${ans}</b></p>` };
}
const rangeHTML = n => tbl(['Representation', `${n}-bit range`], [['Unsigned', `0 … ${2 ** n - 1}`], ['Sign-magnitude', `−${2 ** (n - 1) - 1} … +${2 ** (n - 1) - 1}`], ['1’s complement', `−${2 ** (n - 1) - 1} … +${2 ** (n - 1) - 1}`], ['2’s complement', `−${2 ** (n - 1)} … +${2 ** (n - 1) - 1}`]], 'small');
function threeRepExplain(v, n = 8) {
  const sm = (v < 0 ? '1' : '0') + bin(Math.abs(v), n - 1), on = v < 0 ? invert(bin(-v, n)) : bin(v, n), tw = bin(v, n);
  return { answer: `SM ${sm} · 1’s ${on} · 2’s ${tw}`, html: `<p>+${Math.abs(v)} = <span class="mono">${bin(Math.abs(v), n)}</span></p>` +
    tbl(['Representation', 'How', `${n} bits`], [['Sign-magnitude', 'set the MSB to 1', sm], ['1’s complement', 'invert every bit', on], ['2’s complement', '1’s complement + 1', tw]]) };
}

/* =====================================================================
   PREDICTED PAPER
   ===================================================================== */
