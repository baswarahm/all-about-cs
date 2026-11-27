/* ============ topic7.js: Topic 7, Central Processing Unit ============
   Loaded after topic56.js and before app.js. Adds: notes (TOPICS), the pipeline solver (EXTRA_TOOLS),
   bank questions with a reason per option (BANK) and the Topic 7 question-bank paper (DYNAMIC). */
(function () {
  const h = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ───────── pipeline solver ───────── */
  const STAGES6 = ['FI', 'DI', 'CO', 'FO', 'EI', 'WO'];
  function pipeReport(n, k, b, target) {
    if (!(n >= 1 && n <= 30)) return '<p class="err">Use 1 to 30 instructions.</p>';
    if (!(k >= 2 && k <= 10)) return '<p class="err">Use 2 to 10 stages.</p>';
    const names = k === 6 ? STAGES6 : Array.from({ length: k }, (_, i) => 'S' + (i + 1));
    const branch = b >= 1 && b < n;
    const rows = [];   // [label, start, stagesShown, flushed]
    for (let i = 1; i <= n; i++) {
      if (branch && i > b) break;
      rows.push(['I' + i, i, k, false]);
    }
    let total;
    if (branch) {
      const resolve = b + k - 2;                                    // the branch is decided at the end of its EI stage
      for (let m = b + 1; m <= Math.min(b + k - 2, b + 30); m++) rows.push(['I' + m + ' (flushed)', m, resolve - m + 1, true]);
      const t0 = b + k - 1, tgt = target > 0 ? target : b + 1;
      for (let j = 0; j < n - b; j++) rows.push(['I' + (tgt + j), t0 + j, k, false]);
      total = t0 + (n - b - 1) + k - 1;
    } else total = k + (n - 1);
    const T1 = n * k, Tk = k + (n - 1);
    let tb = `<div class="tbl-wrap"><table class="tbl pipe"><thead><tr><th>Instr.</th>${Array.from({ length: total }, (_, t) => `<th>${t + 1}</th>`).join('')}</tr></thead><tbody>`;
    rows.forEach(([lab, st, cnt, fl]) => {
      tb += `<tr class="${fl ? 'flush' : ''}"><td>${h(lab)}</td>`;
      for (let t = 1; t <= total; t++) { const s = t - st; tb += `<td class="${s >= 0 && s < cnt ? 'on' : ''}">${s >= 0 && s < cnt ? names[s] : ''}</td>`; }
      tb += '</tr>';
    });
    tb += '</tbody></table></div>';
    let out = `<p>Stages: ${names.join(' → ')}. Each stage takes one time unit, and a new instruction enters every unit.</p>${tb}`;
    out += `<div class="work"><p><b>Without a pipeline:</b> T<sub>1</sub> = n × k = ${n} × ${k} = <b>${T1}</b></p>
      <p><b>With a pipeline:</b> T<sub>k</sub> = k + (n − 1) = ${k} + ${n - 1} = <b>${Tk}</b></p>
      <p><b>Speedup:</b> S = T<sub>1</sub> / T<sub>k</sub> = nk / (k + n − 1) = ${T1} / ${Tk} = <b>${(T1 / Tk).toFixed(2)}</b> (the limit for very many instructions is k = ${k})</p></div>`;
    if (branch) out += `<p><b>With the branch:</b> instruction I${b} is a taken branch. It is decided at the end of its EI stage (time ${b + k - 2}), so the ${k - 2} instructions fetched after it are flushed and the target starts at time ${b + k - 1}. The program finishes at time <b>${total}</b> instead of ${Tk}: a penalty of <b>${total - Tk}</b> time units.</p>`;
    return out;
  }
  window.EXTRA_TOOLS.push(['pipe', 'Pipeline timing and speedup', 'Topic 7',
    `<label>Instructions n<input id="xPn" value="9" class="mono"></label><label>Stages k<input id="xPk" value="6" class="mono"></label><label>Taken branch at instruction (0 = none)<input id="xPb" value="0" class="mono"></label><label>Branch target number<input id="xPt" value="15" class="mono"></label>`,
    () => pipeReport(+document.getElementById('xPn').value, +document.getElementById('xPk').value, +document.getElementById('xPb').value, +document.getElementById('xPt').value)]);

  /* ───────── notes ───────── */
  TOPICS.push(
    { id: 't7', num: 7, title: 'Central Processing Unit', sub: 'CPU structure, user-visible and control/status registers, PSW, instruction cycle and data flow, interrupts, indirect cycle, pipelining, speedup and branch handling', weight: 'After Test 1 · Test 2 material',
      sections: [
        { id: 'cpu', title: 'What the CPU does and what it is made of', html: `
          <p>The CPU must <b>fetch</b> instructions from memory, <b>interpret</b> (decode) them, <b>fetch data</b> from memory or an I/O module, <b>process</b> the data (arithmetic or logic) and <b>write</b> data back to memory or I/O.</p>
          ${T(['Component', 'Job'], [['ALU (arithmetic and logic unit)', 'does the computation; contains a shifter, complementer, arithmetic and Boolean logic, and sets the status flags'], ['CU (control unit)', 'controls the movement of data and instructions'], ['Registers', 'fast internal storage, the top of the memory hierarchy (above cache and main memory)']])}
          <p>The CPU talks to memory and I/O through the <b>system bus</b>: the <b>address bus</b>, the <b>data bus</b> and the <b>control bus</b>. Inside the CPU an <b>internal CPU bus</b> joins the registers and the ALU.</p>` },
        { id: 'uvr', title: 'User-visible registers', html: `
          <p>Registers are the CPU's working space. Their number and use are a major design decision. There are two kinds: <b>user-visible registers</b> (used by assembly-language instructions) and <b>control and status registers</b>.</p>
          <ul>
            <li><b>General purpose:</b> can hold data or addresses (e.g. for register indirect or displacement addressing).</li>
            <li><b>Data registers:</b> hold data only (e.g. the accumulator); cannot be used to calculate an operand address.</li>
            <li><b>Address registers:</b> segment pointer (base of a segment), index register (indexed and autoindexed addressing), stack pointer (implicit addressing).</li>
            <li><b>Condition codes (flags):</b> single bits set by the hardware, e.g. "the last result was zero". Programs can read them implicitly (jump if zero) but usually cannot set them.</li>
          </ul>
          ${T(['Design issue', 'Notes'], [['General purpose or specialised?', 'General purpose: more flexible, but needs more instruction bits. Specialised: the register is implied by the opcode, so instructions are smaller and faster, but less flexible.'], ['How many?', 'Usually 8 to 32. Fewer means more memory references; more does not reduce them much and uses CPU resources. RISC designs may use hundreds.'], ['How big?', 'Address registers: big enough for the largest address. Data registers: big enough for most data types; some CPUs join 2 registers for double-length values.']])}` },
        { id: 'csr', title: 'Control and status registers; the PSW', html: `
          <p>Usually not visible to the user; they control how the CPU runs. The four used for executing instructions:</p>
          ${T(['Register', 'Holds'], [['<b>PC</b> (program counter)', 'the address of the next instruction to fetch; updated after each fetch; changed by branch/skip instructions'], ['<b>IR</b> (instruction register)', 'the instruction just fetched; its opcode and operand specifiers are analysed'], ['<b>MAR</b> (memory address register)', 'an address in memory; connected to the address bus'], ['<b>MBR</b> (memory buffer register)', 'data to be written to memory or just read from it; connected to the data bus']])}
          <p>The <b>program status word (PSW)</b> holds status information, including the condition codes: <b>Sign</b> (sign bit of the last result), <b>Zero</b> (result = 0), <b>Carry</b> (carry or borrow out), <b>Equal</b> (logical compare), <b>Overflow</b> (arithmetic overflow), <b>Interrupt enable/disable</b> and <b>Supervisor</b> (supervisor or user mode).</p>
          <p><b>Supervisor mode</b> (kernel mode, Intel ring zero) lets privileged instructions run. Only the operating system uses it; user programs cannot.</p>
          <p>Other registers may point to process control blocks, interrupt vectors, the stack, or the page table (virtual memory). CPU and operating-system design are closely linked.</p>
          ${T(['', 'Motorola MC68000', 'Intel 8086'], [['Style', 'very regular, no special-purpose registers', 'every register is special-purpose (some usable as general purpose)'], ['Registers', '8 data + 9 address registers (32-bit; 2 stack pointers), 32-bit PC, 16-bit status register', '4 data (AX, BX, CX, DX), 4 pointer/index (SP, BP, SI, DI), 4 segment (code, data, stack, extra), instruction pointer, flags (all 16-bit)']])}
          <p>There is <b>no single best</b> register organisation. For upward compatibility the Pentium II still contains the 8086 organisation.</p>
          ${check('Which register holds the address of the next instruction?', 'The program counter (PC).')}` },
        { id: 'cycle', title: 'The instruction cycle and its data flow', html: `
          <p>The instruction cycle has four subcycles: <b>fetch</b> (read the next instruction into the CPU), <b>indirect</b> (extra memory reads to fetch operand addresses), <b>execute</b> (interpret the opcode and do the operation) and <b>interrupt</b> (save the state and service an interrupt).</p>
          <div class="example"><div class="ex-h">Fetch cycle data flow</div><ol>
            <li>The PC holds the address of the next instruction; it is copied to the <b>MAR</b>.</li>
            <li>The MAR puts the address on the address bus and the control unit requests a memory read.</li>
            <li>The instruction comes back on the data bus into the <b>MBR</b>, then is copied to the <b>IR</b>.</li>
            <li>Meanwhile the <b>PC is incremented</b> (by 1 instruction) unless told otherwise.</li></ol></div>
          <p><b>Execute</b> can be: processor–memory transfer, processor–I/O transfer, data processing (arithmetic or logic), control (change the sequence, e.g. a jump), or a combination. Its data flow depends on the instruction: memory read/write, I/O, register transfers or ALU operations.</p>
          <p><b>Indirect cycle:</b> after the fetch the IR is examined. For indirect addressing, the rightmost N bits of the MBR (the address field) go to the MAR, the control unit requests a read, and the operand's address comes back into the MBR.</p>
          <div class="example"><div class="ex-h">Example program (opcodes 1 = Load AC, 2 = Store AC, 5 = Add to AC)</div>
            ${T(['PC', 'Instruction', 'Meaning', 'AC after'], [['300', '1 940', 'load AC from address 940 (holds 3)', '3'], ['301', '5 941', 'add the contents of 941 (holds 2)', '5'], ['302', '2 941', 'store AC to address 941', '5 (941 now holds 5)']])}
            <p>Each instruction is fetched (PC → MAR → memory → MBR → IR, PC + 1) and then executed.</p></div>
          ${check('List the fetch-cycle register transfers in order.', 'MAR ← PC; MBR ← memory; IR ← MBR; PC ← PC + 1 (the increment can happen at the same time as the read).')}` },
        { id: 'int', title: 'Interrupts and the interrupt cycle', html: `
          <p>An <b>interrupt</b> lets another module break the normal sequence. Classes: <b>program</b> (overflow, division by zero), <b>timer</b> (the processor's timer, used for pre-emptive multitasking), <b>I/O</b> (from an I/O controller) and <b>hardware failure</b> (e.g. a memory parity error).</p>
          <p>The <b>interrupt cycle</b> is added after execute. The CPU checks for an interrupt signal. If none, it fetches the next instruction. If one is pending, it suspends the program, <b>saves the context</b>, sets the PC to the start of the <b>interrupt handler</b>, runs it, then restores the context and continues.</p>
          <div class="example"><div class="ex-h">Interrupt data flow</div><ol>
            <li>The current PC is copied to the MBR (so the program can resume later).</li>
            <li>A special location (e.g. from the stack pointer) is loaded into the MAR, and the MBR is written to memory.</li>
            <li>The PC is loaded with the address of the interrupt-handling routine; the next fetch gets its first instruction.</li></ol></div>` },
        { id: 'pipe', title: 'Instruction pipelining and its speedup', html: `
          <p>Like an <b>assembly line</b>: different stages of different instructions are worked on at the same time. The simplest form is <b>instruction prefetch</b> (a 2-stage pipeline): fetch the next instruction while the current one executes, because execution usually does not use main memory.</p>
          <p>A 2-stage pipeline would halve the cycle time only if fetch and execute took equal time. It does not double the speed because fetch is usually shorter (fetch waits), and a <b>jump or branch</b> makes the prefetched instruction useless. So more stages are used:</p>
          ${T(['Stage', 'Job'], [['FI fetch instruction', 'read the next instruction'], ['DI decode instruction', 'find the opcode and operand specifiers'], ['CO calculate operands', 'work out the effective addresses (addressing mode)'], ['FO fetch operands', 'read operands from memory (not needed for registers)'], ['EI execute instruction', 'do the operation and store the result in the destination'], ['WO write operand', 'write the result to memory']])}
          <p>The timing diagram assumes each instruction uses all 6 stages and all stages can run in parallel (no memory conflicts), which is not always true: FO, EI and WO may all need memory.</p>
          <div class="example"><div class="ex-h">Performance (n instructions, k stages, one time unit per stage)</div>
            <p class="mono">T<sub>1</sub> = nk &nbsp;·&nbsp; T<sub>k</sub> = k + (n − 1) &nbsp;·&nbsp; S = T<sub>1</sub> / T<sub>k</sub> = nk / (k + n − 1)</p>
            <p>Slide example, 9 instructions and 6 stages: T<sub>1</sub> = 54, T<sub>k</sub> = 6 + 8 = 14, S = 54 / 14 = <b>3.86</b>.</p></div>
          <div class="callout"><b>Note on the slides:</b> the formula is printed as "nk / k + (n − 1)". The brackets are missing: it means nk / (k + n − 1), as the worked example 54 / 14 shows.</div>
          <p><b>Limits:</b> waiting when stages have unequal durations, conditional branches, interrupts, and memory/register conflicts in the operand stages. More stages do not always help: moving data between buffers and the extra control logic add overhead.</p>
          ${tip('The pipeline solver draws the timing diagram for any n and k, with or without a taken branch.')}` },
        { id: 'branch', title: 'Dealing with branches', html: `
          <p>A taken conditional branch means the instructions already in the pipeline are the wrong ones: they are flushed and the target is fetched, a <b>performance penalty</b>. Ways to reduce it:</p>
          ${T(['Approach', 'Idea', 'Drawback / example'], [['Multiple streams', 'two pipelines: prefetch both paths and use the right one', 'bus and register contention; branches inside branches need more pipelines (IBM 370/168, 3033)'], ['Prefetch branch target', 'also prefetch the target and keep it until the branch is executed', 'IBM 360/91'], ['Loop buffer', 'small, very fast memory holding the n most recently fetched instructions; checked before memory', 'good for small loops and short jumps; like a cache for sequential instructions (CRAY-1)'], ['Branch prediction', 'guess the next instruction; if wrong, empty the pipeline and restart', 'see below'], ['Delayed branch', 'do not take the jump until you have to: rearrange instructions so useful work fills the slot after the branch', 'no flushing circuit needed']])}
          <p><b>Static prediction:</b> predict never taken (always fetch the next instruction; 68020, VAX 11/780), predict always taken (fetch the target; more than 50% of conditional branches are taken), or predict by opcode (up to 75% success). <b>Dynamic prediction:</b> a taken/not-taken switch based on history (good for loops; IBM 3090/400), or a <b>branch history table</b>: a small cache with the branch address, history bits and target information, looked up during prefetch and updated after execution.</p>
          <p><b>Intel 80486</b> has a 5-stage pipeline: fetch (into 2 prefetch buffers), decode 1 (opcode and addressing mode), decode 2 (control signals for the ALU, complex addressing), execute (ALU, cache access, register update), write back (registers and flags).</p>
          ${check('Why is "predict always taken" better than "never taken" on average?', 'More than half of conditional branches are taken (e.g. the branch at the end of a loop body).')}` },
      ] });

  /* ───────── bank questions (w = why each option, in order) ───────── */
  const Qs = [
    [7, 'Which register holds the address of the next instruction to be fetched?', ['PC', 'IR', 'MBR', 'MAR'], ['Correct. It is incremented after each fetch.', 'The IR holds the instruction itself.', 'The MBR holds data read from or written to memory.', 'The MAR holds the address being accessed right now, copied from the PC during a fetch.']],
    [7, 'Which register is connected to the data bus?', ['MBR', 'MAR', 'PC', 'IR'], ['Correct. Data read from memory arrives in the MBR.', 'The MAR is connected to the address bus.', 'The PC is not connected to a bus directly.', 'The IR receives the instruction from the MBR.']],
    [7, 'In the fetch cycle, the instruction travels:', ['Memory → MBR → IR', 'Memory → MAR → IR', 'PC → MBR → IR', 'IR → MBR → memory'], ['Correct. The address goes PC → MAR, the instruction comes back into the MBR and then the IR.', 'The MAR holds the address, not the instruction.', 'The PC holds an address.', 'That is the wrong direction.']],
    [7, 'Which is NOT one of the four subcycles of the instruction cycle?', ['Compile', 'Fetch', 'Indirect', 'Interrupt'], ['Correct. The four are fetch, indirect, execute and interrupt.', 'Fetch is the first subcycle.', 'Indirect fetches operand addresses.', 'Interrupt saves the state and runs the handler.']],
    [7, 'Condition codes (flags) are usually:', ['Set by the hardware and read implicitly by programs', 'Set directly by user programs', 'Stored in main memory only', 'Part of the MAR'], ['Correct. e.g. "jump if zero" reads the Z flag.', 'Programs usually cannot set them.', 'They live in the status register (PSW).', 'The MAR holds an address.']],
    [7, 'Which flag shows that the CPU is running privileged operating-system code?', ['Supervisor', 'Carry', 'Zero', 'Equal'], ['Correct. Supervisor (kernel) mode allows privileged instructions.', 'Carry is about arithmetic.', 'Zero shows a zero result.', 'Equal is for logical compare.']],
    [7, 'A specialised (not general-purpose) register design gives:', ['Smaller, faster instructions but less flexibility', 'More flexibility and longer instructions', 'No need for an opcode', 'More memory references always'], ['Correct. The register is implied by the opcode.', 'That describes general-purpose registers.', 'There is always an opcode.', 'Not a property of specialisation.']],
    [7, 'During the interrupt cycle the CPU first:', ['Saves the current PC (the context)', 'Fetches the next instruction of the same program', 'Clears all registers', 'Turns off the clock'], ['Correct. So the program can resume after the handler.', 'It jumps to the handler instead.', 'Registers are saved, not cleared.', 'The clock keeps running.']],
    [7, 'A timer interrupt is mainly used for:', ['Pre-emptive multitasking', 'Division by zero', 'Memory parity errors', 'Keyboard input'], ['Correct.', 'That is a program interrupt.', 'That is a hardware-failure interrupt.', 'That is an I/O interrupt.']],
    [7, 'With n = 9 instructions and k = 6 stages, the pipelined time Tₖ is:', ['14', '54', '15', '9'], ['Correct. k + (n − 1) = 6 + 8.', 'That is T₁ = nk, without a pipeline.', 'One too many: the first instruction takes k units, then 1 each.', 'Each instruction still needs 6 stages.']],
    [7, 'For 9 instructions on a 6-stage pipeline, the speedup is about:', ['3.86', '6', '1.5', '9'], ['Correct. 54 / 14.', '6 is the limit for very many instructions.', 'Too small.', 'Speedup cannot exceed k.']],
    [7, 'The maximum speedup of a k-stage pipeline, for a very long program, approaches:', ['k', 'n', '2', '1'], ['Correct. nk / (k + n − 1) → k as n grows.', 'n is the number of instructions.', 'Only a 2-stage pipeline has limit 2.', '1 means no speedup.']],
    [7, 'Which stage works out the effective address of the operands?', ['CO', 'FI', 'EI', 'WO'], ['Correct. Calculate operands uses the addressing mode.', 'FI fetches the instruction.', 'EI executes it.', 'WO writes the result.']],
    [7, 'Why does a 2-stage pipeline not double the speed?', ['Fetch is usually shorter than execute, and branches waste prefetched instructions', 'Memory is always busy', 'The ALU runs twice', 'Registers are too small'], ['Correct. The fetch stage waits, and a branch empties the pipeline.', 'Execution usually does not use memory.', 'Not a pipeline issue.', 'Not related.']],
    [7, 'A loop buffer is:', ['A small, very fast memory with the most recently fetched instructions', 'A second pipeline for the other branch path', 'The branch history table', 'A register that counts loop iterations'], ['Correct. Very good for small loops (CRAY-1).', 'That is multiple streams.', 'That is used for dynamic prediction.', 'Not the slide meaning.']],
    [7, 'Predict never taken means:', ['Always fetch the next sequential instruction', 'Always fetch the branch target', 'Use a history table', 'Fetch both paths'], ['Correct. Used by the 68020 and VAX 11/780.', 'That is predict always taken.', 'That is dynamic prediction.', 'That is multiple streams.']],
    [7, 'Which branch approach rearranges instructions so the slot after a jump does useful work?', ['Delayed branch', 'Loop buffer', 'Multiple streams', 'Predict by opcode'], ['Correct. No flushing circuit is needed.', 'A loop buffer stores recent instructions.', 'Multiple streams fetch both paths.', 'That guesses from the instruction type.']],
    [7, 'The Intel 8086 register organisation is best described as:', ['Every register is special-purpose', 'All registers are fully general purpose', 'It has no registers', 'It has hundreds of registers'], ['Correct. Some can also be used as general purpose.', 'That describes the MC68000.', 'It has 14 registers.', 'That is typical of RISC.']],
  ];
  Qs.forEach(([t, q, o, w]) => BANK.push({ t, q, o, a: 0, w, e: w[0].replace(/^Correct\.\s*/, '') || 'See the notes.' }));
  DYNAMIC.push({ id: 'bank7', title: 'Topic 7 question bank', short: 'Topic 7 bank', minutes: 30, shuffle: true,
    build: () => shuffleArr(conceptPool(7)), blurb: 'Registers (PC, IR, MAR, MBR, PSW and flags), the instruction cycle and its data flow, interrupts, pipelining and speedup, and branch handling.' });
})();
