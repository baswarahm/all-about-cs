/* ============ tutorials.js — worked answers for Tutorials 1–3 and slide activities ============
   Each entry: { g: group, q: question, f: () => ({ ans, html }) }. Built lazily when opened. */

const ANS = [];
const add = (g, q, f) => ANS.push({ g, q, f });
const conv = (s, a, b) => { const r = convertExplain(s, a, b); return { ans: `${sub(s, a)} = ${sub(r.answer, b)}`, html: r.html }; };

const TUT_GROUPS = {
  T1: { name: 'Tutorial 1 — Introduction (discussion)', file: 'CST131-CCA102_Tutorial1_2627 (1).pdf' },
  T2: { name: 'Tutorial 2 — Number systems', file: 'CST131-CCA102_Tutorial2_2627.pdf' },
  T3: { name: 'Tutorial 3 — Computer arithmetic', file: 'CST131-CCA102_Tutorial3_2627.pdf' },
  S2: { name: 'Slide activities — Topic 2', file: 'Topic 2 - Number Systems (2).pptx' },
  S3: { name: 'Slide activities — Topic 3', file: 'Topic 3 - Computer Arithmetic_Pt1.pdf' },
};

// ---- Tutorial 1 (discussion — model answers)
add('T1', 'Scenario 1 Q1 — Hardware vs software: roles and how they work together', () => ({ ans: 'Hardware executes, software instructs, the OS manages', html:
  `<ul><li><b>Hardware</b> = the physical parts: CPU, RAM, SSD, display, keyboard, battery.</li><li><b>Software</b> = the instructions: the <b>operating system</b> and the <b>applications</b> (Word, Chrome, Spotify, Calculator).</li><li>Together: applications ask the OS for resources. The OS schedules the programs on the CPU cores, gives them memory and handles I/O. The hardware actually executes the machine instructions.</li><li>Why Airene's laptop is slow: many open apps compete for <b>RAM</b> (the OS may swap to disk) and for CPU time. Slowness is not always about the number of cores.</li></ul>` }));
add('T1', 'Scenario 1 Q2 — How the computer calculates and displays the answer (CPU, memory, CU, ALU)', () => ({ ans: 'Fetch → decode → execute in ALU → store → output', html:
  `<ol><li>The key presses enter through an <b>I/O</b> module and travel over the <b>system bus</b> into <b>main memory</b>, which holds the Calculator program and the numbers.</li><li>The <b>control unit</b> fetches the next instruction (its address is in the PC), decodes it and sends control signals.</li><li>The operands are loaded into <b>registers</b>, and the CU tells the <b>ALU</b> to do the arithmetic.</li><li>The ALU puts the result in a register, and the CU stores it back to memory.</li><li>The result is sent through I/O to the display.</li></ol><p>Diagram: <span class="mono">[I/O] ⇄ [Bus] ⇄ [Memory]</span>, with the bus also connected to <span class="mono">[CPU: CU + ALU + Registers]</span>. Mention the four functions: data movement, storage, processing and control.</p>` }));
add('T1', 'Scenario 1 Q3 — Do more CPU cores always perform better?', () => ({ ans: 'Disagree', html:
  `<ul><li>Extra cores only help when the work is split into parallel threads (video export, compiling, many apps). Single-threaded tasks depend on per-core speed: clock rate, CPI, cache and CPU generation.</li><li><b>Amdahl's Law</b>: the serial part limits the speedup.</li><li>Other bottlenecks: RAM size, storage speed, the GPU, cooling and power limits.</li></ul>` }));
add('T1', 'Scenario 2 Q1–Q3 — Which laptop for Amir?', () => ({ ans: 'B for a student; C for a full-time video creator', html:
  `<ul><li><b>Recommend B</b> (RM3,699). 16 GB RAM handles multitasking and IDEs, and 12 cores speed up compiling and the occasional video export. It is within the RM4,000 budget.</li><li><b>Sacrifice:</b> battery life (10 h vs 14 h), no dedicated GPU, 512 GB storage.</li><li><b>Q2:</b> More cores are not automatically best. You also need the clock speed and CPU generation, benchmark results (SPEC) for his workload, RAM, the GPU and the real battery life.</li><li><b>Q3 — a full-time creator should choose C:</b> the dedicated GPU speeds up rendering, 1 TB holds the footage and it has 16 GB RAM. The trade-off is a 6 h battery and almost the whole budget.</li></ul><p class="muted">Any choice earns marks if you justify it with at least two specs and an honest sacrifice.</p>` }));
add('T1', 'Scenario 3 Q1 — Support moving to the cloud? Benefit, risk, responsibility', () => ({ ans: 'Support, with conditions', html:
  `<ul><li><b>Benefit:</b> access anytime and anywhere, scales on demand, no physical servers to maintain, the provider handles uptime.</li><li><b>Risk:</b> data security/privacy (research data), dependence on the internet connection, ongoing subscription cost, vendor lock-in.</li><li><b>Responsibility kept:</b> user accounts and access control, security configuration, backup and data-retention policy, the campus network, monitoring costs.</li></ul><p>A <b>hybrid</b> approach (sensitive data kept local) is a strong answer.</p>` }));
add('T1', 'Scenario 3 Q2 — Does the cloud eliminate all infrastructure problems?', () => ({ ans: 'No — the responsibility is shared', html:
  `<p><b>Disagree.</b> The provider runs the physical servers, but the department still depends on its own network and internet link, users' devices, accounts and permissions, security settings and budget.</p><p>Before deciding, consider: the total cost over several years, data-protection rules, migration effort, the provider's SLA/uptime, a backup/exit plan, and staff training.</p>` }));
// ---- Tutorial 2
add('T2', 'Q1 — Order (1.1)₂, (1.4)₁₀, (1.5)₁₆', () => ({ ans: '(1.5)₁₆ < (1.4)₁₀ < (1.1)₂', html: `<p>(1.1)<sub>2</sub> = 1 + ½ = 1.5; (1.4)<sub>10</sub> = 1.4; (1.5)<sub>16</sub> = 1 + 5/16 = 1.3125.</p><p>Smallest → largest: <b>(1.5)<sub>16</sub> &lt; (1.4)<sub>10</sub> &lt; (1.1)<sub>2</sub></b></p>` }));
[['2a', '54', 8, 5], ['2b', '312', 4, 7], ['2c', '520', 6, 7], ['2d', '12212', 3, 9]].forEach(([k, s, a, b]) => add('T2', `Q${k} — (${s})<sub>${a}</sub> to base ${b}`, () => conv(s, a, b)));
['28', '125', '209', '14.625', '25.625', '35.25'].forEach((s, i) => add('T2', `Q3${'abcdef'[i]} — ${s} to binary`, () => conv(s, 10, 2)));
['C.7', 'B9.A', '875.1', 'BAD.E', '46D', '19A'].forEach((s, i) => add('T2', `Q4${'abcdef'[i]} — (${s})<sub>16</sub> to decimal`, () => conv(s, 16, 10)));
['12', '5655', '2550276', '765453336', '3726755'].forEach((s, i) => add('T2', `Q5${'abcde'[i]} — (${s})<sub>8</sub> to hexadecimal`, () => conv(s, 8, 16)));
['4FB2', '88BAE', 'DC4'].forEach((s, i) => add('T2', `Q6${'abc'[i]} — (${s})<sub>16</sub> to binary, octal, decimal`, () => {
  const b = convertExplain(s, 16, 2), o = convertExplain(s, 16, 8), d = convertExplain(s, 16, 10);
  return { ans: `${b.answer}₂ · ${o.answer}₈ · ${d.answer}₁₀`, html: `<h4>Binary</h4>${b.html}<h4>Octal</h4>${o.html}<h4>Decimal</h4>${d.html}` };
}));
// ---- Tutorial 3
[['1001011', '11101', 2], ['4556', '1245', 8], ['BCD', 'A34', 16]].forEach(([x, y, b], i) => add('T3', `Q1${'abc'[i]} — (${x})<sub>${b}</sub> + (${y})<sub>${b}</sub>`, () => { const r = baseAddExplain(x, y, b); return { ans: sub(r.answer, b), html: r.html }; }));
['111011101110', '11111111000100', '100000000', '1010101010111'].forEach((s, i) => add('T3', `Q2${'abcd'[i]} — 2’s complement of (${s})<sub>2</sub>`, () => { const r = twosOfExplain(s); return { ans: r.answer, html: r.html }; }));
[['100101', '11011'], ['1101011', '111010'], ['1110111', '10110111']].forEach(([x, y], i) => add('T3', `Q3${'abc'[i]} — (${x})<sub>2</sub> − (${y})<sub>2</sub>`, () => { const r = binSubExplain(x, y); return { ans: r.answer, html: r.html }; }));
[[6, 3, 'd'], [5, -4, 'e'], [-3, -5, 'f']].forEach(([a, b, k]) => add('T3', `Q3${k} — ${a} − ${b < 0 ? '(' + b + ')' : b} using 2’s complement`, () => { const r = addTrace(a, b, 8, '-'); return { ans: `${r.res} = ${a - b}`, html: r.html + (k === 'e' ? '<p class="muted">With 4 bits instead: 5 − (−4) = 9 does not fit in the range −8…7, so it overflows. That may be the point of this question.</p>' : '') }; }));
[[10, 4], [15, 3], [14, 14]].forEach(([m, q], i) => add('T3', `Q4${'abc'[i]} — ${m} × ${q} using add-shift`, () => { const r = addShiftTrace(m, q, 4); return { ans: `${r.res} = ${m * q}`, html: r.html }; }));
add('T3', 'Q5 — Booth: 5 × 6 (4 bits)', () => { const r = boothTrace(5, 6, 4); return { ans: `${r.res} = 30`, html: r.html }; });
add('T3', 'Q6 — Booth: 23 × 19 (6 bits)', () => { const r = boothTrace(23, 19, 6); return { ans: `${r.res} = 437`, html: r.html }; });
add('T3', 'Q7 — Restoring division: 11 ÷ 3', () => { const r = divTrace(11, 3, 4); return { ans: `Q = ${r.q} (3), A = ${r.r} (2)`, html: r.html }; });
// ---- Slide activities Topic 2
['010101', '101100', '001100.101', '010010.111'].forEach(s => add('S2', `QA1 — (${s})<sub>2</sub> to decimal`, () => conv(s, 2, 10)));
['27', '81', '126', '333'].forEach(s => add('S2', `QA2 — ${s} to binary`, () => conv(s, 10, 2)));
['36.25', '72.75', '45.375'].forEach(s => add('S2', `QA3 — ${s} to binary`, () => conv(s, 10, 2)));
['FACE', '239.4'].forEach(s => add('S2', `QA4 — (${s})<sub>16</sub> to binary`, () => conv(s, 16, 2)));
['1001.1111', '110101.011001'].forEach(s => add('S2', `QA4 — (${s})<sub>2</sub> to hex`, () => conv(s, 2, 16)));
['894', '328', '14259'].forEach(s => add('S2', `QA4 — ${s} to hex`, () => conv(s, 10, 16)));
[['999', 10, 8], ['567', 8, 10], ['A98', 16, 8], ['538', 10, 8], ['3121', 4, 10]].forEach(([s, a, b]) => add('S2', `Slide — (${s})<sub>${a}</sub> to base ${b}`, () => conv(s, a, b)));
// ---- Slide activities Topic 3
[-37, 24, -24, -63].forEach(v => add('S3', `QA1 — ${v} in 8-bit sign-magnitude`, () => { const r = signMagExplain(v); return { ans: r.answer, html: r.html }; }));
['01001', '01011', '00111', '00001'].forEach(s => add('S3', `QA2 — 2’s complement of ${s}`, () => { const r = twosOfExplain(s); return { ans: r.answer, html: r.html }; }));
[44, 89, 106, -18, -74, -86, -99, -110, -120, -128].forEach(v => add('S3', `QA3 — ${v} in 8-bit 2’s complement`, () => ({ ans: bin(v, 8), html: twosSteps(v, 8) })));
[[-19, -7], [44, 45], [-75, 59], [127, 1], [-1, 1], [-103, -69]].forEach(([a, b]) => add('S3', `QA4 — ${a} + ${b < 0 ? '(' + b + ')' : b} (8-bit)`, () => { const r = addTrace(a, b, 8, '+'); return { ans: `${r.res}${r.ovf ? ' — overflow' : ' = ' + (a + b)}`, html: r.html }; }));
[[5, 3], [7, 4], [-6, 2], [12, -5], [-7, -8], [45, 18], [-50, 25]].forEach(([a, b]) => add('S3', `QA5 — ${a} − ${b < 0 ? '(' + b + ')' : b} (8-bit)`, () => { const r = addTrace(a, b, 8, '-'); return { ans: `${r.res}${r.ovf ? ' — overflow' : ' = ' + (a - b)}`, html: r.html }; }));
[[10, 10], [9, 12]].forEach(([m, q]) => add('S3', `QA7 — add-shift ${m} × ${q}`, () => { const r = addShiftTrace(m, q, 4); return { ans: `${r.res} = ${m * q}`, html: r.html }; }));
[[10, -10, 5], [-6, -5, 4], [-7, 5, 4]].forEach(([m, q, n]) => add('S3', `QA8 — Booth ${m} × ${q} (${n} bits)`, () => { const r = boothTrace(m, q, n); return { ans: `${r.res} = ${m * q}`, html: r.html }; }));
[[4, 2], [9, 3], [10, 4], [11, 3]].forEach(([a, b]) => add('S3', `QA9 — restoring division ${a} ÷ ${b}`, () => { const r = divTrace(a, b, 4); return { ans: `Q = ${r.q} (${Math.floor(a / b)}), A = ${r.r} (${a % b})`, html: r.html }; }));
[['-5', -5], ['-6', -6], ['384', 384], ['1/16', 1 / 16]].forEach(([t, v]) => add('S3', `QA11 — ${t} in IEEE 754 32-bit`, () => { const r = ieeeEncodeExplain(v); return { ans: `${r.s} ${r.e} ${r.m}`, html: r.html }; }));
