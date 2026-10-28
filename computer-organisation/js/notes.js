/* ============ notes.js — study material for Test 1 (Topics 1–3) ============
   Each topic has sections; each section is HTML. Small helpers keep the markup short. */

const tip = (h) => `<div class="callout tip"><b>Exam tip</b>${h}</div>`;
const warn = (h) => `<div class="callout warn"><b>Common mistake</b>${h}</div>`;
const key = (h) => `<div class="callout key"><b>Remember</b>${h}</div>`;
const check = (q, a) => `<details class="qc"><summary><span class="qc-tag">Quick check</span>${q}</summary><div>${a}</div></details>`;
const T = (head, rows) => `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
// Slides and tutorial sheets live in private/ (git-ignored), so they only open on this computer.
const pdf = (file, label) => `<a class="src" href="${encodeURI('private/' + (/Tutorial/.test(file) ? 'tutorials/' : 'lectures/') + file)}" target="_blank" rel="noopener">${label}</a>`;
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a.src');
  if (!a) return;
  e.preventDefault();
  const w = window.open('', '_blank');
  fetch(a.href, { method: 'HEAD' }).then((r) => {
    if (!r.ok) throw 0;
    w.location = a.href;
  }).catch(() => {
    if (w) w.close();
    alert('This file is the lecturer\'s material and is only kept on the owner\'s computer.');
  });
});

const TOPICS = [
  {
    id: 't1', num: 1, title: 'Introduction', sub: 'Architecture vs organisation, structure & function, history, ARM/x86, cloud, performance',
    files: [['Topic 1a - Intro.pdf', 'Slides Part 1'], ['Topic 1b - Intro.pdf', 'Slides Part 2'], ['CST131-CCA102_Tutorial1_2627 (1).pdf', 'Tutorial 1']],
    weight: '18 of 50 MCQs last year',
    sections: [
      { id: 'arch', title: 'Architecture vs organisation', html: `
        <div class="two">
          <div class="card-in"><h4>Architecture = <em>what</em></h4><p>Attributes <b>visible to the programmer</b> that affect how a program runs.</p><ul><li>Instruction set (ISA)</li><li>Number of bits for data types</li><li>I/O mechanisms</li><li>Memory addressing techniques</li></ul></div>
          <div class="card-in"><h4>Organisation = <em>how</em></h4><p>Operational units and their <b>interconnections</b> that realise the architecture. <b>Transparent</b> (hidden) to the programmer.</p><ul><li>Control signals</li><li>Interfaces to peripherals</li><li>Memory technology</li><li>Hardware multiply unit vs repeated addition</li></ul></div>
        </div>
        <p><b>Classic example:</b> "Does the computer have a multiply instruction?" → architecture. "Is it done by a dedicated multiply unit or by repeated addition?" → organisation.</p>
        <h4>Why families matter</h4>
        <p>A manufacturer sells a <b>family</b> of models with the <b>same architecture but different organisation</b>. The architecture stays the same, so code is compatible (the same programs run on every model). The organisation changes from model to model (more cores, bigger cache, better pipelines, newer memory), so each model has a different price and performance. Examples: IBM System/360 (first planned family, 1964) and x86.</p>
        ${tip('The ISA is the <b>boundary between hardware and software</b>, which is why it counts as architecture.')}
        ${check('Cache size — architecture or organisation?', 'Organisation. The programmer cannot see it; the same program runs with any cache size.')}
      ` },
      { id: 'struct', title: 'Structure & function', html: `
        <h4>The 4 functions</h4>
        <div class="chips"><span>Data processing</span><span>Data storage</span><span>Data movement</span><span>Control</span></div>
        <p>The lecture asks which one is "busiest". Data movement happens in almost every operation, so it is a good answer, but every function is needed.</p>
        <h4>Top-level structure: 4 components</h4>
        ${T(['Component', 'Job'], [['CPU (processor)', 'Controls the computer and processes data'], ['Main memory', 'Stores data (and the program)'], ['I/O', 'Moves data between the computer and the outside world'], ['System interconnection', 'Lets the CPU, memory and I/O talk to each other (e.g. the system bus)']])}
        <h4>Inside the CPU: 4 components</h4>
        ${T(['Component', 'Job'], [['Control Unit (CU)', 'Fetches and decodes instructions and sends control signals'], ['ALU', 'Arithmetic and logic operations'], ['Registers', 'Fast storage inside the CPU'], ['Internal CPU interconnection', 'Connects the CU, ALU and registers']])}
        <div class="diagram">
          <div class="d-row"><div class="d-box">I/O</div><div class="d-bus">⇄ System interconnection (bus) ⇄</div><div class="d-box">Main memory</div></div>
          <div class="d-down">⇅</div>
          <div class="d-cpu"><div class="d-label">CPU</div><div class="d-row"><div class="d-box sm">Control Unit</div><div class="d-box sm">ALU</div><div class="d-box sm">Registers</div></div><div class="d-mini">internal CPU interconnection</div></div>
        </div>
        <h4>Top-down vs bottom-up</h4>
        <p><b>Top-down</b> means you start with the whole system and break it into subparts. The lecture uses this approach because it is the clearest way to describe a computer.</p>
        <h4>Multicore terms</h4>
        ${T(['Term', 'Meaning'], [['CPU', 'Fetches and executes instructions: ALU + CU + registers'], ['Core', 'One processing unit on a processor chip (its own CU, ALU, registers and perhaps cache)'], ['Processor', 'A chip with one or more cores. With several cores it is a <b>multicore</b> processor']])}
        ${tip('Tutorial 1: "How does the computer calculate and display the answer?" Walk through it: input → I/O → bus → memory. The CU fetches and decodes the instruction, the ALU computes, the result is stored back to memory, then sent through I/O to the display. Name all 4 functions.')}
        ${check('"More cores always means faster." True?', 'No. Extra cores only help when the work can run in parallel. Single-threaded tasks depend on clock speed, CPI and cache. RAM size, storage, the GPU and Amdahl\'s Law (the serial part) also limit speed.')}
      ` },
      { id: 'hist', title: 'History & generations', html: `
        ${T(['Generation', 'Technology', 'Key machines / facts'], [
          ['1st (1946–57)', 'Vacuum tubes', 'ENIAC, IAS, UNIVAC I. Hot, costly, machine language only, no multitasking'],
          ['2nd (1958–64)', 'Transistors (Bell Labs 1947, Shockley)', 'IBM 7000, DEC PDP-1. Smaller, cheaper, less heat. High-level languages and system software. Still <b>discrete</b> parts'],
          ['3rd (1965–71)', 'Integrated circuits (microelectronics)', 'IBM 360 (family), DEC PDP-8 (first minicomputer)'],
          ['Later', 'LSI / VLSI, semiconductor memory, microprocessors', 'Intel 4004 (1971), 8080, 8086 …']])}
        <h4>ENIAC</h4>
        <ul><li><b>E</b>lectronic <b>N</b>umerical <b>I</b>ntegrator <b>A</b>nd <b>C</b>omputer. Built by <b>Eckert & Mauchly</b> (University of Pennsylvania).</li><li>Purpose: compute <b>artillery range tables</b> in WWII. Started 1943 and finished 1946, too late for the war. Its first task was <b>hydrogen bomb</b> calculations. Used until 1955.</li><li>About 18,000 vacuum tubes and 15,000 sq ft. First general-purpose electronic digital computer. Programmed by rewiring.</li></ul>
        <h4>IAS (von Neumann), Princeton, 1946–1952</h4>
        <ul><li>Introduced the <b>stored-program concept</b>: instructions and data are kept in the same memory. This is the prototype of every computer today.</li><li>Memory: 1000 words of 40 bits. Each word holds a number or <b>two 20-bit instructions</b>.</li></ul>
        ${T(['IAS register', 'Holds'], [['MBR (Memory Buffer Register)', 'A word to be stored in / received from memory'], ['MAR (Memory Address Register)', 'The memory address to read/write'], ['IR (Instruction Register)', 'The opcode of the instruction being executed'], ['IBR (Instruction Buffer Register)', 'The right-hand instruction of a word (temporary)'], ['PC (Program Counter)', 'The address of the <b>next</b> instruction'], ['AC & MQ (Accumulator, Multiplier-Quotient)', 'Temporary operands and results of ALU operations']])}
        <h4>Commercial computers</h4>
        <ul><li><b>UNIVAC I</b> (1950): first successful commercial computer, used for the US Census. <b>UNIVAC II</b>: faster, more memory, <b>upward compatible</b>.</li><li><b>IBM 701</b> (1953): IBM's first stored-program computer (scientific). <b>702</b> (1955) was for business.</li><li><b>IBM 360</b> (1964): first planned <b>family</b> of computers. Not compatible with the older 7000 series.</li><li><b>DEC PDP-8</b> (1964): first <b>minicomputer</b>. Fit on a lab bench, needed no air-conditioning, cost $16k (vs $100k+). Used a <b>bus structure</b> and was sold to OEMs for embedded use.</li></ul>
        <h4>Integrated circuits</h4>
        <p>A computer is built from <b>gates</b> (Boolean logic → processing), <b>memory cells</b> (1 bit each → storage) and <b>interconnections</b> (→ movement and control). An IC puts all of them on one silicon chip. The order of size is wafer → chip → gate.</p>
        <h4>Moore's Law (Gordon Moore, Intel)</h4>
        <p>The number of transistors on a chip doubles <b>every year</b>. Since the 1970s it has been about every <b>18 months</b>. The <b>cost of a chip stays almost unchanged</b>. What this gives you:</p>
        <ul><li>Shorter electrical paths → higher performance</li><li>Smaller size → more flexibility</li><li>Lower power and cooling requirements</li><li>Fewer interconnections → higher reliability</li></ul>
        <h4>Memory & microprocessors</h4>
        <ul><li>Core memory (ferromagnetic) was expensive and bulky, and reading it destroyed the data. <b>Semiconductor memory</b> (Fairchild 1970, 256 bits) reads without destroying data and is much faster.</li><li><b>Intel 4004</b> (1971): first microprocessor, 4-bit. <b>8008</b> (1972): 8-bit. <b>8080</b> (1974): first <b>general-purpose</b> microprocessor. <b>8086</b>: 16-bit. <b>80386</b> (1985): 32-bit.</li></ul>
        ${check('Which generation first used high-level languages and system software?', 'The 2nd generation (transistors).')}
      ` },
      { id: 'x86', title: 'x86, ARM & embedded', html: `
        <h4>x86</h4>
        <ul><li>Dominant outside embedded systems.</li><li>The organisation and technology changed enormously, but the ISA stayed <b>backward compatible</b>: old programs run on new chips. About one instruction was added per month, giving about 500 instructions.</li></ul>
        <h4>Embedded systems</h4>
        <p>Hardware and software <b>inside a larger product</b> with a <b>dedicated function</b>, not a general-purpose computer. Examples: anti-lock brakes, airbags, household appliances. Requirements vary: safety, reliability, real-time response, lifespan, environment. The <b>IoT</b> grows from deeply embedded devices.</p>
        <h4>ARM</h4>
        <ul><li>Evolved from a <b>RISC</b> design. Designed by ARM Ltd (Cambridge) and <b>licensed</b> to manufacturers.</li><li>High speed, <b>small die size</b>, <b>low power</b>, so it is used in phones, tablets, IoT and embedded systems.</li><li>Product families: <b>Cortex-A</b> (application, e.g. phones), <b>Cortex-R</b> (real-time), <b>Cortex-M</b> (microcontrollers).</li><li>Apple's A-series chips are <b>SoCs</b>: CPU + GPU + Neural Engine + image processors + memory controllers on one chip.</li></ul>
      ` },
      { id: 'cloud', title: 'Cloud computing', html: `
        <p>NIST definition: a model for <b>ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources</b>.</p>
        ${T(['Service', 'You get', 'Examples'], [['<b>SaaS</b> — Software', 'Ready-to-use application software', 'Google Apps, Office 365, Dropbox'], ['<b>PaaS</b> — Platform', 'Tools/environment to <b>build and deploy your own</b> apps', 'Google App Engine, Windows Azure'], ['<b>IaaS</b> — Infrastructure', 'Raw processing, storage, networks', 'Amazon Web Services, Google Compute Engine, Azure']])}
        ${key('<b>S</b>aaS = <b>S</b>oftware for end-users. <b>P</b>aaS = <b>P</b>rogrammers deploy apps. <b>I</b>aaS = <b>I</b>nfrastructure (VMs, storage).')}
        ${tip('Tutorial 1 Scenario 3 (moving the school servers to the cloud): give <b>one benefit</b> (access anywhere, scalable, no hardware to maintain), <b>one risk</b> (data security/privacy, needs the internet, long-term cost, vendor lock-in) and <b>one responsibility the department still has</b> (accounts and access control, security settings, backups/data policy, its own network). The cloud does <b>not</b> remove every infrastructure problem: the department and the provider share the responsibility.')}
      ` },
      { id: 'perf', title: 'Performance', html: `
        <p>Key parameters: performance, cost, size, security, reliability, power consumption.</p>
        <h4>Clock</h4>
        <div class="formula">cycle time &nbsp;τ = 1 / f &nbsp;&nbsp;·&nbsp;&nbsp; 1 MHz = 10<sup>6</sup> Hz &nbsp;·&nbsp; 1 GHz = 10<sup>9</sup> Hz</div>
        <p>One instruction may take several cycles. The average is the <b>CPI</b> (cycles per instruction).</p>
        <div class="formula">CPI = Σ (CPI<sub>i</sub> × fraction<sub>i</sub>)<br>T = I<sub>c</sub> × CPI × τ = I<sub>c</sub> × CPI / f<br>MIPS = f / (CPI × 10<sup>6</sup>) = I<sub>c</sub> / (T × 10<sup>6</sup>)</div>
        <div class="example"><div class="ex-h">Worked example (slide)</div>
          <p>2 million instructions on a 400-MHz processor. Mix: ALU 60% (CPI 1), load/store cache hit 18% (CPI 2), branch 12% (CPI 4), cache miss 10% (CPI 8).</p>
          <p class="mono">CPI = 0.6(1) + 0.18(2) + 0.12(4) + 0.1(8) = 2.24<br>MIPS = 400 / 2.24 ≈ 178.6<br>T = 2×10⁶ × 2.24 / 400×10⁶ = 11.2 ms</p>
        </div>
        <h4>Benchmarks</h4>
        <p>MIPS and MFLOPS are <b>not good enough</b> for comparing processors. Instruction sets differ, so one instruction does a different amount of work on each architecture. Use <b>benchmarks</b> instead: programs written in a high-level language that represent a type of task (systems, numerical, commercial), are easy to measure and are widely distributed.</p>
        <ul><li><b>SPEC CPU2017</b>: the industry standard for processor-intensive work. It has integer and floating-point programs, and speed (single task) and rate (throughput) metrics.</li><li>Others: SPEC Cloud_IaaS, SPECviewperf (3D graphics), SPECwpc (workstations), SPECjvm2008, SPECjbb2015 (server Java), SPECsfs2014 (file servers), SPECvirt_sc2013.</li></ul>
        <h4>Amdahl's Law (asked in last year's test)</h4>
        <div class="formula">Speedup = 1 / ( (1 − f) + f / N )</div>
        <p><b>f</b> = the fraction of the program that can run in parallel, <b>N</b> = the number of processors. As N → ∞ the speedup → 1/(1 − f). The <b>serial part limits the speedup</b>, which is another reason more cores are not always better.</p>
        ${check('f = 0.8, N = 4. Speedup?', '1 / (0.2 + 0.2) = <b>2.5</b>')}
      ` },
    ],
  },
  {
    id: 't2', num: 2, title: 'Number Systems', sub: 'Bases, positional value, all conversions, BCD / ASCII / EBCDIC',
    files: [['Topic 2 - Number Systems (2).pptx', 'Slides (pptx)'], ['CST131-CCA102_Tutorial2_2627.pdf', 'Tutorial 2']],
    weight: '14 of 50 MCQs last year',
    sections: [
      { id: 'bases', title: 'Bases & positional value', html: `
        <p>The base (radix) <b>r</b> sets which digits are allowed: <b>0 to r − 1</b>.</p>
        ${T(['System', 'Base', 'Digits'], [['Binary', '2', '0 1'], ['Octal', '8', '0–7'], ['Decimal', '10', '0–9'], ['Hexadecimal', '16', '0–9, A(10) B(11) C(12) D(13) E(14) F(15)']])}
        <p><b>Positional:</b> each digit is multiplied by <b>r<sup>position</sup></b>. Positions are …2, 1, 0 left of the point and −1, −2, … right of it.</p>
        <div class="formula">(a<sub>2</sub>a<sub>1</sub>a<sub>0</sub>.a<sub>−1</sub>a<sub>−2</sub>)<sub>r</sub> = a<sub>2</sub>r² + a<sub>1</sub>r¹ + a<sub>0</sub>r⁰ + a<sub>−1</sub>r<sup>−1</sup> + a<sub>−2</sub>r<sup>−2</sup></div>
        <div class="pow-table">
          <div><b>2<sup>n</sup></b><span>1 2 4 8 16 32 64 128 256 512 1024</span></div>
          <div><b>2<sup>−n</sup></b><span>0.5 0.25 0.125 0.0625</span></div>
          <div><b>16<sup>n</sup></b><span>1 16 256 4096</span></div>
          <div><b>8<sup>n</sup></b><span>1 8 64 512</span></div>
        </div>
        ${check('Why can "1011" belong to binary, octal, decimal and hex?', 'It only uses digits 0 and 1, which are valid in every base. Its value is different in each one.')}
      ` },
      { id: 'conv', title: 'Conversion methods', html: `
        <div class="conv-map">
          <div class="cm"><b>Any base → decimal</b><span>Multiply each digit by r<sup>position</sup> and add</span></div>
          <div class="cm"><b>Decimal → any base</b><span>Integer: divide by r, read remainders <b>bottom-up</b>. Fraction: multiply by r, read integer parts <b>top-down</b></span></div>
          <div class="cm"><b>Binary ↔ hex</b><span>Groups of <b>4</b> bits (a nibble), counted from the point</span></div>
          <div class="cm"><b>Binary ↔ octal</b><span>Groups of <b>3</b> bits, counted from the point</span></div>
          <div class="cm"><b>Octal ↔ hex</b><span>Go through binary</span></div>
          <div class="cm"><b>Base a → base b</b> (e.g. 8 → 5)<span>Go through decimal</span></div>
        </div>
        <div class="example"><div class="ex-h">Decimal → binary with a fraction: 25.625</div>
          <div class="two">
            <div><p><b>Integer (÷2)</b></p><p class="mono">25 ÷ 2 = 12 r 1<br>12 ÷ 2 = 6 r 0<br>6 ÷ 2 = 3 r 0<br>3 ÷ 2 = 1 r 1<br>1 ÷ 2 = 0 r 1 ↑ read up → 11001</p></div>
            <div><p><b>Fraction (×2)</b></p><p class="mono">0.625 × 2 = 1.25 → 1<br>0.25 × 2 = 0.5 → 0<br>0.5 × 2 = 1.0 → 1 ↓ read down → .101</p></div>
          </div>
          <p>Answer: <b class="mono">11001.101</b></p>
        </div>
        <div class="example"><div class="ex-h">Binary → hex: 10001001.11</div>
          <p class="mono">1000 1001 . 1100 → 8 9 . C → <b>89.C</b></p>
          <p>Pad the integer part with 0s on the <b>left</b> and the fraction part with 0s on the <b>right</b>.</p>
        </div>
        <div class="example"><div class="ex-h">Decimal → hex: 479</div>
          <p class="mono">479 ÷ 16 = 29 r 15 (F)<br>29 ÷ 16 = 1 r 13 (D)<br>1 ÷ 16 = 0 r 1 → <b>1DF</b></p>
        </div>
        <div class="example"><div class="ex-h">Odd bases (Tutorial 2 Q2): (54)<sub>8</sub> → base 5</div>
          <p class="mono">(54)₈ = 5×8 + 4 = 44₁₀<br>44 ÷ 5 = 8 r 4; 8 ÷ 5 = 1 r 3; 1 ÷ 5 = 0 r 1 → <b>(134)₅</b></p>
        </div>
        ${warn('Grouping bits from the <b>left</b>. 1101011110 → hex is <span class="mono">0011 0101 1110 = 35E</span>, not D78. Always group outwards from the point.')}
        ${warn('Reading remainders top-down. Integer remainders are read <b>bottom-up</b> (the last one is the MSB). Fraction digits are read <b>top-down</b>.')}
        ${check('Order (1.1)₂, (1.4)₁₀, (1.5)₁₆', '(1.1)₂ = 1.5; (1.5)₁₆ = 1 + 5/16 = 1.3125. So <b>(1.5)₁₆ &lt; (1.4)₁₀ &lt; (1.1)₂</b>.')}
        ${check('(A98)₁₆ → octal', '1010 1001 1000 → 101 010 011 000 → <b>5230₈</b>')}
        <p class="more">Want step-by-step working for any number? Use the <a href="#tools">converter in Tools</a> or drill in <a href="#practice">Practice</a>.</p>
      ` },
      { id: 'hexwhy', title: 'Hex ↔ binary table', html: `
        <div class="hex-grid">${[...'0123456789ABCDEF'].map((c, i) => `<div><b>${c}</b><span>${i.toString(2).padStart(4, '0')}</span><i>${i}</i></div>`).join('')}</div>
        <p><b>Why hex?</b> It is more compact than binary. Data comes in multiples of 4 bits, so each hex digit is exactly one nibble, and converting between binary and hex is very easy.</p>
      ` },
      { id: 'codes', title: 'Character codes', html: `
        ${T(['Code', 'Bits', 'Characters', 'Notes'], [['<b>BCD</b> (Binary Coded Decimal)', '4 per decimal digit', '0–9', 'Each digit coded separately: 59 → 0101 1001 (not 00111011)'], ['<b>ASCII</b> (American Standard Code for Information Interchange)', '<b>7</b>', '128', 'Letters, numbers, symbols, control codes. Used by PCs and the internet'], ['<b>EBCDIC</b> (Extended Binary Coded Decimal Interchange Code)', '<b>8</b>', '256', 'IBM mainframes / midrange']])}
        ${tip('"ASCII vs EBCDIC format war": ASCII won because it was an open standard used by most other manufacturers and later by PCs and the internet. EBCDIC stayed inside IBM systems.')}
      ` },
    ],
  },
  {
    id: 't3', num: 3, title: 'Computer Arithmetic', sub: 'ALU, signed representations, 2’s complement add/sub, overflow, multiplication, division, IEEE 754',
    files: [['Topic 3 - Computer Arithmetic_Pt1.pdf', 'Slides Part 1'], ['Topic 3 - Computer Arithmetic_Pt2_lecture (1).pptx', 'Slides Part 2 (pptx)'], ['CST131-CCA102_Tutorial3_2627.pdf', 'Tutorial 3']],
    weight: '18 of 50 MCQs last year — most calculations',
    sections: [
      { id: 'alu', title: 'The ALU', html: `
        <p>The ALU executes arithmetic and logic instructions. "Everything else in the computer (CU, registers, memory) is there to service this unit": they bring data to the ALU and take the results away. It handles integers and may handle floating-point numbers. Its inputs are operands from registers and control signals from the CU. Its outputs are the result (to registers) and <b>flags</b> (e.g. overflow, zero, sign).</p>
      ` },
      { id: 'rep', title: 'Integer representations', html: `
        <p>Positive numbers look the <b>same</b> in every representation. They only differ for negatives.</p>
        ${T(['Representation', 'How to make −x', 'n-bit range', 'Zeros'], [
          ['Unsigned', '— (positive only)', '0 … 2<sup>n</sup> − 1', 'one'],
          ['Sign-magnitude', 'Set the MSB (sign bit) to 1', '−(2<sup>n−1</sup>−1) … +(2<sup>n−1</sup>−1)', '<b>two</b> (+0, −0)'],
          ["1's complement", 'Invert every bit', '−(2<sup>n−1</sup>−1) … +(2<sup>n−1</sup>−1)', '<b>two</b>'],
          ["2's complement", 'Invert every bit, then add 1', '<b>−2<sup>n−1</sup> … +(2<sup>n−1</sup>−1)</b>', 'one']])}
        ${T(['Bits', 'Unsigned', 'Sign-mag / 1’s', '2’s complement'], [['4', '0 … 15', '−7 … +7', '−8 … +7'], ['5', '0 … 31', '−15 … +15', '−16 … +15'], ['6', '0 … 63', '−31 … +31', '−32 … +31'], ['8', '0 … 255', '−127 … +127', '−128 … +127']])}
        <div class="example"><div class="ex-h">−18 in 8 bits, three ways</div>
          <p class="mono">+18 &nbsp;= 00010010<br>Sign-magnitude = <b>1</b>0010010<br>1's complement = 11101101<br>2's complement = 11101110</p>
        </div>
        <h4>Two ways to take the 2's complement</h4>
        <div class="two">
          <div class="card-in"><b>Method 1</b><p>Invert all the bits, then add 1.<br><span class="mono">00000110 → 11111001 → 11111010</span></p></div>
          <div class="card-in"><b>Method 2 (faster)</b><p>From the right, keep every bit up to and <b>including the first 1</b>, then flip everything to its left.<br><span class="mono">000001<u>10</u> → 111110<u>10</u></span></p></div>
        </div>
        <h4>2's complement → decimal (the fastest way)</h4>
        <p>The MSB has weight <b>−128</b> (for 8 bits). Add up the rest normally.</p>
        <div class="weights"><span>−128</span><span>64</span><span>32</span><span>16</span><span>8</span><span>4</span><span>2</span><span>1</span></div>
        <p class="mono">10000011 = −128 + 2 + 1 = −125 &nbsp;·&nbsp; 11111101 = −128 + 125 = −3 &nbsp;·&nbsp; 10001000 = −120</p>
        ${warn('Signed-magnitude <b>4-bit range is −7 to +7</b>, not −8 to +7 (that is 2\'s complement).')}
        <h4>Drawbacks of sign-magnitude</h4>
        <ul><li>Addition and subtraction are complicated: you must check the signs and compare magnitudes first.</li><li>There are two zeros (00000000 and 10000000).</li></ul>
        <h4>Why 2's complement wins</h4>
        <ul><li>Only one zero.</li><li>Subtraction is just addition (A + 2's complement of B).</li><li>Multiplication is repeated addition and division is repeated subtraction.</li><li>Used in practically every ALU.</li></ul>
        ${check('Unsigned, sign-magnitude and 2’s complement value of 11001010?', 'Unsigned 202 · Sign-magnitude −74 · 2’s complement −54')}
      ` },
      { id: 'addsub', title: 'Addition, subtraction & overflow', html: `
        <div class="steps"><div><b>1</b>Write both numbers in n-bit 2's complement</div><div><b>2</b>For A − B, take the 2's complement of B, then <b>add</b></div><div><b>3</b>Add the bits, <b>discarding</b> any carry out of the MSB</div><div><b>4</b>Check for overflow</div></div>
        <div class="formula">Overflow ⇔ (+) + (+) = (−) &nbsp;or&nbsp; (−) + (−) = (+)</div>
        ${key('Overflow can only happen when both operands (after negating B) have the <b>same sign</b>. A carry out of the MSB on its own is <b>not</b> overflow. <span class="mono">−1 + 1 = <s>1</s>00000000</span> is correct.')}
        <div class="example"><div class="ex-h">58 − 32 (8-bit)</div>
          <p class="mono">&nbsp;&nbsp;00111010 (58)<br>+ 11100000 (−32)<br>= <s>1</s>00011010 → 26 ✓ (carry discarded, no overflow)</p>
        </div>
        <div class="example"><div class="ex-h">−120 + (−20) (8-bit) → overflow</div>
          <p class="mono">&nbsp;&nbsp;10001000 (−120)<br>+ 11101100 (−20)<br>= <s>1</s>01110100 → looks like +116 ✗</p>
          <p>Two negatives gave a positive, so this is <b>overflow</b>. The true answer −140 is below −128. Last year's MCQ still expected <span class="mono">01110100</span> as "the result".</p>
        </div>
        <div class="example"><div class="ex-h">90 + 70 (8-bit) → overflow</div>
          <p class="mono">01011010 + 01000110 = 10100000 (reads as −96) ✗</p>
        </div>
        <h4>Tutorial 3 Q3 style (no fixed width)</h4>
        <p>M − N: pad both to the same length, then add M to the 2's complement of N.</p>
        <ul><li><b>If there is an end carry</b> → discard it. The result is positive.</li><li><b>If there is no end carry</b> → the result is negative. Take the 2's complement of the sum and put a − sign in front.</li></ul>
        <p class="mono">100101 − 011011: 100101 + 100101 = <s>1</s>001010 → +001010 (37 − 27 = 10 ✓)</p>
        ${check('Which 4-bit operation overflows: 5 − (−3) or 5 − (−2)?', '5 − (−3) = 8 > 7, so it <b>overflows</b> (0101 + 0011 = 1000). 5 − (−2) = 7 = 0111 is fine.')}
      ` },
      { id: 'mul', title: 'Multiplication', html: `
        <h4>Unsigned: add-shift method</h4>
        <p>Registers: <b>M</b> = multiplicand (never changes), <b>Q</b> = multiplier, <b>A</b> = accumulator (starts at 0), <b>C</b> = carry bit. Repeat n times:</p>
        <div class="steps"><div><b>Q<sub>0</sub> = 1</b>A ← A + M (carry goes into C), then shift C, A, Q right by 1</div><div><b>Q<sub>0</sub> = 0</b>Shift C, A, Q right by 1 only</div></div>
        <p>The product is in <b>A Q</b> (2n bits).</p>
        <div class="example"><div class="ex-h">13 × 11 (M = 1101, Q = 1011) → 143</div>
          ${T(['Cycle', 'Step', 'C', 'A', 'Q'], [['0', 'Initial', '0', '0000', '1011'], ['1', 'Q₀=1: A+M', '0', '1101', '1011'], ['', 'Shift', '0', '0110', '1101'], ['2', 'Q₀=1: A+M', '1', '0011', '1101'], ['', 'Shift', '0', '1001', '1110'], ['3', 'Q₀=0: Shift', '0', '0100', '1111'], ['4', 'Q₀=1: A+M', '1', '0001', '1111'], ['', 'Shift', '0', '1000', '1111']])}
          <p>A Q = <b class="mono">10001111</b> = 143 ✓</p>
        </div>
        <h4>Signed: Booth's algorithm</h4>
        <p>Registers: A = 0, Q = multiplier, <b>Q<sub>−1</sub> = 0</b>, M = multiplicand. Look at <b>Q<sub>0</sub>Q<sub>−1</sub></b> on each of the n cycles:</p>
        ${T(['Q₀ Q₋₁', 'Action'], [['0 0', 'Arithmetic shift right only'], ['1 1', 'Arithmetic shift right only'], ['1 0', '<b>A ← A − M</b> (add the 2’s complement of M), then shift'], ['0 1', '<b>A ← A + M</b>, then shift']])}
        ${key('An <b>arithmetic</b> shift right copies the sign bit of A into the new MSB. The bits move A → Q → Q₋₁. The product is A Q.')}
        <p>Advantages: it handles signed numbers directly and needs fewer operations when there are runs of 1s.</p>
        <p class="more">Full traces for Tutorial 3 Q5 (5 × 6) and Q6 (23 × 19) are on the <a href="#tutorials">Tutorials page</a>. Try your own in <a href="#tools">Tools</a>.</p>
      ` },
      { id: 'div', title: 'Division (restoring)', html: `
        <p>Registers: <b>Q</b> = dividend, <b>M</b> = divisor, <b>A</b> = 0. Repeat n times:</p>
        <div class="steps"><div><b>1</b>Shift A, Q left by 1</div><div><b>2</b>A ← A − M</div><div><b>3a</b>If A &lt; 0 (MSB = 1): Q₀ = 0 and <b>restore</b> A ← A + M</div><div><b>3b</b>If A ≥ 0: Q₀ = 1</div></div>
        <p>At the end the <b>quotient is in Q</b> and the <b>remainder is in A</b>.</p>
        <div class="example"><div class="ex-h">7 ÷ 3 (Q = 0111, M = 0011)</div>
          ${T(['Cycle', 'After shift A,Q', 'A − M', 'Result A', 'Q'], [['1', '0000 111_', '1101 (neg)', 'restore 0000', '1110'], ['2', '0001 110_', '1110 (neg)', 'restore 0001', '1100'], ['3', '0011 100_', '0000 (≥0)', '0000', '1001'], ['4', '0001 001_', '1110 (neg)', 'restore 0001', '0010']])}
          <p>Quotient Q = <b class="mono">0010</b> (2), remainder A = <b class="mono">0001</b> (1) ✓</p>
        </div>
      ` },
      { id: 'ieee', title: 'Floating point (IEEE 754)', html: `
        <p>Form: <b>± S × B<sup>±E</sup></b>. Single precision (32 bits):</p>
        <div class="ieee"><span class="s">Sign 1</span><span class="e">Biased exponent 8</span><span class="m">Significand (fraction) 23</span></div>
        <ul><li>Bias = 2<sup>k−1</sup> − 1 = <b>127</b> for 8 bits. Stored exponent = real exponent + 127.</li><li><b>Normalised</b>: 1.xxxx × 2<sup>e</sup>. The leading 1 is not stored (hidden bit), so 23 bits hold a 24-bit significand.</li><li>Formats: 32-bit (8-bit exponent), 64-bit (11), 128-bit (15).</li></ul>
        <div class="example"><div class="ex-h">−12.75 → IEEE 754</div>
          <p class="mono">12.75 = 1100.11 = 1.10011 × 2³<br>S = 1 · E = 3 + 127 = 130 = 10000010<br>Fraction = 10011000000000000000000<br><b>1 10000010 10011000000000000000000</b></p>
        </div>
        <h4>Floating-point problems</h4>
        ${T(['Problem', 'Meaning'], [['Exponent overflow', 'The exponent is above the maximum → ±∞'], ['Exponent underflow', 'The exponent is below the minimum → too small, reported as 0'], ['Significand underflow', 'Digits fall off the right end when the significands are aligned'], ['Significand overflow', 'Carry out of the MSB when adding two significands of the same sign']])}
        <p>FP addition is harder than multiplication because the exponents must be <b>aligned</b> first. It has 4 phases: check for zero, align, add, normalise.</p>
      ` },
    ],
  },
];

/* One-page cheat sheet */
const CHEAT = `
<div class="cheat">
  <section><h3>Topic 1 — Must-know facts</h3><ul>
    <li><b>Architecture</b> = what (programmer-visible, ISA). <b>Organisation</b> = how (hardware, transparent).</li>
    <li>Family = same architecture, different organisation (IBM 360, x86).</li>
    <li>4 functions: processing, storage, movement, control.</li>
    <li>Top level: CPU, memory, I/O, system interconnection. CPU: CU, ALU, registers, internal interconnection.</li>
    <li>Gen 1 vacuum tubes · Gen 2 transistors (Bell Labs 1947) · Gen 3 ICs · later VLSI / microprocessors.</li>
    <li>ENIAC: Eckert & Mauchly, artillery tables, 18,000 tubes. First task: H-bomb.</li>
    <li>IAS (von Neumann): <b>stored-program</b>. PC = next address, MAR = address, MBR = data, IR = opcode, AC/MQ = ALU.</li>
    <li>UNIVAC I: first commercial (census). IBM 701: IBM's first stored-program. IBM 360: family. PDP-8: first minicomputer, bus.</li>
    <li>Intel 4004 first µP (4-bit, 1971). 8080 first general-purpose µP.</li>
    <li>Moore: transistors ×2 every 18 months, cost about the same.</li>
    <li>ARM: RISC, low power, small die, embedded. x86: backward compatible.</li>
    <li>SaaS apps · PaaS dev platform · IaaS infrastructure.</li>
    <li>τ = 1/f · CPI = Σ CPIᵢ·fᵢ · T = Ic·CPI/f · MIPS = f/(CPI·10⁶).</li>
    <li>Amdahl: 1/((1−f)+f/N), max = 1/(1−f). Benchmarks: SPEC CPU2017.</li>
  </ul></section>
  <section><h3>Topic 2 — Conversions</h3><ul>
    <li>Base r digits: 0 … r−1. Hex A–F = 10–15.</li>
    <li>→ decimal: Σ digit × r<sup>pos</sup>. Fraction positions −1, −2 …</li>
    <li>decimal →: integer ÷r, remainders <b>bottom-up</b>. Fraction ×r, integers <b>top-down</b>.</li>
    <li>bin ↔ hex: 4 bits. bin ↔ oct: 3 bits. Group <b>from the point</b> outwards.</li>
    <li>oct ↔ hex via binary. Odd bases via decimal.</li>
    <li>BCD: 4 bits per digit. ASCII 7-bit (128). EBCDIC 8-bit (256), IBM.</li>
    <li>2ⁿ: 1 2 4 8 16 32 64 128 256 · 2⁻ⁿ: .5 .25 .125 .0625</li>
  </ul></section>
  <section><h3>Topic 3 — Arithmetic</h3><ul>
    <li>Unsigned 0…2ⁿ−1 · SM & 1’s ±(2ⁿ⁻¹−1), two zeros · 2’s −2ⁿ⁻¹…2ⁿ⁻¹−1, one zero.</li>
    <li>2’s comp: invert + 1, or keep up to the first 1 from the right and flip the rest.</li>
    <li>2’s → decimal: MSB weight −128 (8-bit).</li>
    <li>A − B = A + (2’s comp B). Discard the carry out.</li>
    <li><b>Overflow</b>: (+)+(+)=(−) or (−)+(−)=(+). A carry alone is not overflow.</li>
    <li>Add-shift: Q₀=1 → A+M then shift C,A,Q right; Q₀=0 → shift only. Product in AQ.</li>
    <li>Booth (Q₀Q₋₁): 10 → A−M; 01 → A+M; 00/11 → nothing. Then arithmetic shift right.</li>
    <li>Restoring division: shift left A,Q; A−M; if negative Q₀=0 and restore, else Q₀=1. Q = quotient, A = remainder.</li>
    <li>IEEE 754: 1 | 8 (bias 127) | 23. Normalise to 1.xxx × 2ᵉ, hidden 1.</li>
  </ul></section>
</div>`;
