// Study notes, condensed from the CCA101 lecture slides.
// Each topic: { id, week, title, test: which assessments it appears in, sections: [{ h, html }] }
// Code inside <pre class="code"> gets a "Try it" button that opens it in the playground.
// To add Week 7 material, append a topic object at the end.

window.MATERIAL = [
{
  id: 'ct',
  week: 'Week 1',
  title: 'Computational Thinking',
  test: ['Test 1'],
  sections: [
    { h: 'What is computational thinking?', html: `
<p>Computational thinking (CT) is <b>the thought process involved in formulating problems and their solutions</b> so that the solutions can be carried out by an information-processing agent (a human, a machine, or both). Wing (2010) called it <i>the new literacy of the 21st century</i>.</p>
<p>Why it matters: computers are expected to displace humans in many current jobs, and most unfilled jobs are in computer science, so CT skills bridge that gap.</p>` },
    { h: 'The six concepts', html: `
<table class="mini">
<tr><th>Concept</th><th>Meaning</th><th>Remember it as</th></tr>
<tr><td><b>Decomposition</b></td><td>Break a large task into small, manageable details. Lets you explain a process clearly to a person or a computer.</td><td>Brushing teeth → which brush, how long, how hard, which paste</td></tr>
<tr><td><b>Patterns</b></td><td>Notice similarities or common differences that help us make predictions or find shortcuts. Basis for designing algorithms. Lets us <b>generalise</b> from problems we solved before.</td><td>All cats have eyes, tails, fur</td></tr>
<tr><td><b>Abstraction</b></td><td>Filter out information that is not needed and generalise what is needed. Represent ideas in general terms (variables) so the solution can be reused.</td><td>Basic cake ingredients: flour, butter, egg, sugar</td></tr>
<tr><td><b>Algorithms</b></td><td>Develop a <b>step-by-step strategy</b> for solving a problem. Often built from decomposition + patterns; written with variables instead of specific numbers.</td><td>The recipe</td></tr>
<tr><td><b>Logical reasoning</b></td><td>Reason and make deductions from the information you have; <b>predict</b> what will happen when a decision or approach is made; debug by explaining what code actually does.</td><td>Why each step of the recipe is there</td></tr>
<tr><td><b>Evaluation</b></td><td>Make sure the solution does the job it was designed for, and think about how to improve it.</td><td>Taste the cake</td></tr>
</table>` },
    { h: 'Evaluating an algorithm', html: `
<p>Check that the algorithm:</p>
<ul>
<li>is <b>easily understood</b>: is it fully decomposed?</li>
<li>is <b>complete</b>: does it solve every aspect of the problem?</li>
<li>is <b>efficient</b>: does it make the best use of resources (fast, little space, little power)?</li>
<li><b>meets the design criteria</b> it was given.</li>
</ul>
<p>Other criteria: <b>correctness</b> (right answer, and does it produce an answer at all?), plus the "-ilities": simplicity and elegance, usability, modifiability, maintainability, cost.</p>
<div class="callout warn"><b>Exam trap:</b> CT is <i>not</i> "breaking a large problem to micro-manage people". Decomposition is about the <i>task</i>, not about managing people.</div>` },
  ],
},
{
  id: 'psm',
  week: 'Week 2',
  title: 'Problem Solving Method',
  test: ['Test 1'],
  sections: [
    { h: 'The 5 steps', html: `
<ol>
<li><b>Problem analysis</b>: identify the requirements: <b>input & output</b>, <b>process + formula</b>, <b>constraints</b>. <span class="tag">Decompose · Patterns · Abstraction</span></li>
<li><b>Design the solution (algorithm)</b>: pseudocode or flowchart. <span class="tag">Algorithm</span></li>
<li><b>Implement the algorithm</b>: write the program. <span class="tag">Logical reasoning</span></li>
<li><b>Testing & verification</b>. <span class="tag">Evaluation</span></li>
<li><b>Documentation</b>.</li>
</ol>` },
    { h: 'Pseudocode vs flowchart', html: `
<ul>
<li><b>Pseudocode</b>: a step-by-step description of the solution. It is <b>NOT code</b>. It uses logic & arithmetic operators and control structures.</li>
<li><b>Flowchart</b>: a graphical representation using geometric symbols, each with a specific meaning (oval = start/end, parallelogram = input/output, rectangle = process, diamond = decision).</li>
<li>Never copy pseudocode straight into a programming language: identify the structure, then translate.</li>
</ul>
<p>Every algorithm is built from just three <b>control structures</b>: <b>sequence</b>, <b>selection</b> (decision) and <b>repetition</b> (iteration).</p>` },
    { h: 'Three types of errors', html: `
<table class="mini">
<tr><th>Error</th><th>Also called</th><th>Detected by</th><th>Example</th></tr>
<tr><td><b>Syntax error</b></td><td>-</td><td>The <b>compiler</b></td><td>Missing <code>;</code>, misspelt keyword</td></tr>
<tr><td><b>Design error</b></td><td>Logic / semantic error</td><td>Hard to detect, compiler cannot find it. Happens in analysis & design.</td><td>Wrong formula, <code>&lt;</code> instead of <code>&lt;=</code></td></tr>
<tr><td><b>Execution error</b></td><td>Runtime error</td><td>Happens while running</td><td>Divide by zero</td></tr>
</table>` },
    { h: 'Documentation', html: `
<p>Documentation is the reference for the next programmer and the blueprint for maintaining the program. It includes: requirements specification, input/output/constraints/formulas, pseudocode/flowchart, source code, user manual.</p>
<p>Code documentation: a <b>header</b> (programmer name, date created/updated, purpose), meaningful variable names, and meaningful comments, though <i>not</i> on every single line.</p>` },
    { h: 'Worked example: sales tax', html: `
<p>State tax 4%, city tax 1.5%, luxury tax 10% if the item costs over $100,000.</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    double salePrice = 120000;
    double stateTax = salePrice * 0.04;
    double cityTax = salePrice * 0.015;
    double luxTax = 0;
    if (salePrice > 100000)
        luxTax = salePrice * 0.1;
    double salesTax = stateTax + cityTax + luxTax;
    double finalPrice = salePrice + salesTax;
    cout << "Sales tax: " << salesTax << endl;
    cout << "Final price: " << finalPrice << endl;
    return 0;
}</pre>` },
  ],
},
{
  id: 'computers',
  week: 'Week 2-3',
  title: 'Computers, Hardware & Programs',
  test: ['Test 1'],
  sections: [
    { h: 'Why program?', html: `
<p><b>Computer</b>: a programmable machine designed to follow instructions. <b>Program</b>: instructions in memory that make it do something. <b>Programmer</b>: the person who writes them. Without programs, a computer cannot do anything.</p>` },
    { h: 'Hardware: 5 main categories', html: `
<ol>
<li><b>CPU</b>: made of the <b>Control Unit</b> (retrieves & decodes instructions, coordinates all other parts) and the <b>ALU</b> (arithmetic + true/false comparisons).</li>
<li><b>Main memory (RAM)</b>: <b>volatile</b>, erased when the program ends or power goes off. Organised in <b>bits</b> (0/1, smallest unit) and <b>bytes</b> (8 bits). Each byte has a unique <b>address</b>.</li>
<li><b>Secondary storage</b>: <b>non-volatile</b>. Magnetic (hard disk with moving arm), solid-state (chips, no moving parts), optical (CD/DVD), flash drives.</li>
<li><b>Input devices</b>: keyboard, mouse, touchscreen, scanner, camera, microphone, disk drives.</li>
<li><b>Output devices</b>: monitor, printer, speakers, disk drives.</li>
</ol>` },
    { h: 'System unit components (additional reading)', html: `
<ul>
<li><b>Motherboard</b>: the main circuit board. A chip contains integrated circuits.</li>
<li><b>Machine cycle</b>: 4 basic operations for every instruction: <b>fetch → decode → execute → store</b>. <b>Pipelining</b>: start fetching the next instruction before finishing the current one.</li>
<li><b>Registers</b>: temporary storage inside the processor. <b>System clock</b> sets the pace; clock speed is measured in <b>GHz</b>.</li>
<li><b>Multi-core</b>: dual-core, quad-core processors. <b>Parallel processing</b>: several processors on one task.</li>
<li>Cooling: heat sinks, liquid cooling.</li>
<li><b>Volatile</b> memory loses contents without power (RAM). <b>Non-volatile</b> keeps them (ROM, flash, CMOS).</li>
<li>RAM types: DRAM, SRAM, MRAM.</li>
<li><b>Cache</b> speeds up the computer by storing frequently used instructions and data. L1 is built into the processor (fastest, smallest), then L2, then L3. Cache is faster than RAM.</li>
<li><b>ROM</b> holds permanent data (firmware). PROM can be written once; EEPROM can be erased. <b>Flash memory</b> can be erased electronically and rewritten.</li>
<li><b>Access time</b> is measured in nanoseconds.</li>
<li><b>Port</b>: where a peripheral attaches. <b>Connector</b>: joins a cable to a port. A USB port can connect up to <b>127</b> devices.</li>
<li><b>Bus</b>: lets devices communicate. Data bus + address bus. <b>Word size</b> = bits the processor can handle at one time.</li>
<li><b>Power supply</b>: converts AC from the wall into DC.</li>
</ul>
<div class="callout"><b>Memory speed order (fastest → slowest):</b> registers → L1 → L2 → L3 cache → RAM → secondary storage. Among the <i>volatile</i> memories, RAM is the slowest.</div>` },
    { h: 'Software', html: `
<ul>
<li><b>System software</b>: manages the hardware: operating systems, utility programs, software development tools.</li>
<li><b>Application software</b>: provides services to the user: word processors, games, specific problem solvers.</li>
</ul>` },
    { h: 'From source code to executable', html: `
<ol>
<li>Write the <b>source file</b> in a text editor.</li>
<li><b>Preprocessor</b> converts directives (<code>#include</code>) into source code.</li>
<li><b>Compiler</b> translates the source into <b>machine language</b> (object code).</li>
<li><b>Linker</b> connects library/hardware-specific code to the object code, producing the <b>executable</b>.</li>
</ol>
<p>Order: preprocessor → compiler → linker. An error at one step stops the following steps. An <b>IDE</b> (e.g. Dev-C++, Visual C++) bundles editor, compiler and debugger in one application.</p>
<p><b>Low-level</b> languages are close to hardware (binary machine code). <b>High-level</b> languages are closer to human language (C++, Java, Python).</p>
<div class="callout warn"><b>Exam trap:</b> the compiler is called <i>before</i> the linker, and the linker does <i>not</i> "call the monitor". The compiler translates to machine-readable instructions.</div>` },
    { h: 'What a program is made of', html: `
<ul>
<li><b>Key words</b> (reserved words): <code>int, double, return, using, namespace</code>…, cannot be used as names.</li>
<li><b>Programmer-defined identifiers</b>: names you create (<code>hours, rate, pay</code>).</li>
<li><b>Operators</b>: <code>+ - * / = &lt;&lt; &gt;&gt;</code></li>
<li><b>Punctuation</b>: <code>;</code> and <code>,</code></li>
<li><b>Syntax</b>: the grammar rules of the language.</li>
</ul>
<p>Programs typically do <b>input → processing → output</b>. <b>Procedural</b> programming focuses on processes/functions; <b>object-oriented</b> programming focuses on objects holding data and the functions that work on it.</p>` },
  ],
},
{
  id: 'cpp-intro',
  week: 'Week 2-3',
  title: 'Introduction to C++',
  test: ['Test 1', 'ProgrAss 1'],
  sections: [
    { h: 'Parts of a program', html: `
<pre class="code">// sample C++ program        &lt;- comment
#include &lt;iostream&gt;         // preprocessor directive (no semicolon!)
using namespace std;        // which namespace to use

int main()                  // beginning of function main
{
    cout << "Hello, there!" << endl;   // output statement
    return 0;               // send 0 to the operating system
}</pre>
<table class="mini">
<tr><th>Char</th><th>Meaning</th></tr>
<tr><td><code>//</code></td><td>start of a comment</td></tr>
<tr><td><code>#</code></td><td>start of a preprocessor directive</td></tr>
<tr><td><code>&lt; &gt;</code></td><td>enclose file name in #include</td></tr>
<tr><td><code>( )</code></td><td>used when naming a function</td></tr>
<tr><td><code>{ }</code></td><td>enclose a group of statements (a block)</td></tr>
<tr><td><code>" "</code></td><td>enclose a string literal</td></tr>
<tr><td><code>;</code></td><td>end of a statement</td></tr>
</table>` },
    { h: 'cout, endl and \\n', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    cout << "Programming is ";
    cout << "fun!" << endl;          // endl: lowercase L, no quotes
    cout << "Line two\\nLine three\\n"; // \\n goes INSIDE the string
    return 0;
}</pre>` },
    { h: 'Identifiers', html: `
<ul>
<li>First character: a letter or underscore <code>_</code>. After that: letters, digits, underscores.</li>
<li>Case-sensitive: <code>total</code> and <code>Total</code> are different.</li>
<li>Cannot be a key word.</li>
</ul>
<p>Valid: <code>totalSales, total_Sales, _x</code> · Invalid: <code>total.Sales</code> (dot), <code>4thQtrSales</code> (starts with digit), <code>totalSale$</code> ($), <code>int</code> (key word)</p>` },
    { h: 'Data types & literals', html: `
<table class="mini">
<tr><th>Type</th><th>Holds</th><th>Literal examples</th></tr>
<tr><td><code>int, short, long, long long</code> (+ <code>unsigned</code>)</td><td>whole numbers</td><td><code>12, -99, 1234L, 324LL, 075</code> (octal), <code>0x75A</code> (hex)</td></tr>
<tr><td><code>char</code></td><td>one character (stored as its ASCII number, 1 byte)</td><td><code>'C'</code> = 67, <code>'A'</code> = 65, <code>'a'</code> = 97</td></tr>
<tr><td><code>string</code> (needs <code>#include &lt;string&gt;</code>)</td><td>text</td><td><code>"Hello"</code>, stored with a null terminator <code>\\0</code></td></tr>
<tr><td><code>float, double, long double</code></td><td>real numbers (always signed)</td><td><code>31.4159, 3.14159E1, 6.25e-5</code>. Double by default; <code>3.14f</code> is float</td></tr>
<tr><td><code>bool</code></td><td>true / false (stored as 1 / 0)</td><td><code>true, false</code></td></tr>
</table>
<ul>
<li><code>sizeof(double)</code> gives the size in bytes.</li>
<li>Initialization: <code>int length = 12, width = 5, area;</code></li>
<li><code>auto amount = 100;</code> lets the compiler pick the type from the value (C++11).</li>
<li>Assignment: the variable must be on the left: <code>12 = item;</code> is an error.</li>
<li><b>Scope</b>: a variable cannot be used before it is defined, and only inside its block.</li>
<li>Named constant: <code>const double TAX_RATE = 0.0675;</code> (cannot change, usually UPPERCASE).</li>
</ul>` },
    { h: 'Arithmetic operators', html: `
<p>Unary (1 operand) <code>-5</code> · Binary (2 operands) <code>13 - 7</code> · Ternary (3 operands) <code>a ? b : c</code></p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    cout << 7 / 3 << endl;     // 2   integer division (both ints)
    cout << 7 % 3 << endl;     // 1   remainder
    cout << 13 / 5.0 << endl;  // 2.6 one operand is floating point
    cout << 91.0 / 7 << endl;  // 13
    // cout << 13 % 5.0;       // ERROR: % needs two integers
    return 0;
}</pre>` },
    { h: 'Comments', html: `<p>Single line: <code>// ...</code> · Multi-line: <code>/* ... */</code>. Ignored by the compiler; used to explain the purpose of the program, the variables, and complex code.</p>` },
  ],
},
{
  id: 'expressions',
  week: 'Week 3',
  title: 'Expressions & Interactivity',
  test: ['Test 1', 'ProgrAss 1'],
  sections: [
    { h: 'cin', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int height, width;
    cout << "Enter height and width: ";   // always prompt first
    cin >> height >> width;              // separated by spaces, in order
    cout << "Area: " << height * width << endl;
    return 0;
}</pre>
<p>cin converts the input to the variable's type. Put input in the <b>stdin</b> box of the playground.</p>` },
    { h: 'Order of operations', html: `
<ol>
<li><code>-</code> unary negation (right to left)</li>
<li><code>* / %</code> left to right</li>
<li><code>+ -</code> left to right</li>
</ol>
<p><code>2 + 2 * 2 - 2</code> = 4 · <code>(2 + 2) * 2 - 2</code> = 6 · <code>2 + 2 * (2 - 2)</code> = 2</p>
<p>No exponent operator: write <code>pow(s, 2)</code> (needs <code>&lt;cmath&gt;</code>). Multiplication must be written: <code>area = l * w;</code></p>` },
    { h: 'Type conversion', html: `
<p>Hierarchy (highest → lowest): <code>long double, double, float, unsigned long, long, unsigned int, int</code></p>
<ol>
<li><code>char, short, unsigned short</code> are automatically promoted to <code>int</code>.</li>
<li>With two different types, the lower one is <b>promoted</b> to the higher one.</li>
<li>With <code>=</code>, the right side is converted to the type of the variable on the left (can be a <b>demotion</b>: <code>int x = 3.9;</code> stores 3).</li>
</ol>
<p><b>Overflow / underflow</b>: a value too large/small for the variable "wraps around".</p>` },
    { h: 'Type casting', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int y2 = 7, y1 = 2, x2 = 4, x1 = 2;
    double m = static_cast&lt;double&gt;(y2 - y1) / (x2 - x1);  // 2.5 not 2
    char ch = 'C';
    cout << m << endl;
    cout << ch << " is " << static_cast&lt;int&gt;(ch) << endl;  // C is 67
    cout << (int)ch << " " << int(ch) << endl;  // C-style and prestandard casts
    return 0;
}</pre>
<div class="callout warn"><b>Float trap (ProgrAss!):</b> <code>float t = 14.15;</code> then <code>static_cast&lt;int&gt;((t - 14) * 100)</code> gives <b>14</b>, not 15, because 14.15 cannot be stored exactly. Round first: <code>static_cast&lt;int&gt;(t * 100 + 0.5) % 100</code>.</div>` },
    { h: 'Multiple & combined assignment', html: `
<p><code>x = y = z = 5;</code> works right to left. Combined: <code>sum += 1;</code> <code>x -= 2;</code> <code>x *= 3;</code> <code>x /= 2;</code> <code>x %= 4;</code></p>
<p><code>x *= a + b;</code> means <code>x = x * (a + b);</code></p>` },
    { h: 'Formatting output (iomanip)', html: `
<ul>
<li><code>setw(x)</code>: field at least x wide; affects <b>only the next</b> value.</li>
<li><code>fixed</code>: decimal notation; stays until changed.</li>
<li><code>setprecision(x)</code>: with fixed = x digits <b>after the decimal point</b>; without fixed = x <b>significant digits</b>.</li>
<li><code>showpoint</code>: always show the decimal point.</li>
</ul>
<pre class="code">#include &lt;iostream&gt;
#include &lt;iomanip&gt;
using namespace std;

int main() {
    double v = 3.14159;
    cout << setprecision(3) << v << endl;          // 3.14  (3 significant digits)
    cout << fixed << setprecision(3) << v << endl; // 3.142 (3 after the point)
    cout << setw(8) << 42 << "|" << endl;          // "      42|"
    return 0;
}</pre>` },
    { h: 'Characters and strings', html: `
<ul>
<li><code>cin &gt;&gt;</code> skips leading whitespace and stops at a space, so use <code>getline(cin, name);</code> for a full line.</li>
<li><code>cin.get(ch);</code> reads the next character <i>including</i> whitespace.</li>
<li><code>cin.ignore();</code> skips one character; <code>cin.ignore(10, '\\n');</code> skips up to 10 chars or until a newline. Use it when mixing <code>cin &gt;&gt;</code> with getline/get.</li>
<li><code>s.length()</code> gives the length; <code>+</code> or <code>+=</code> joins strings.</li>
</ul>` },
    { h: 'Math library', html: `
<p><code>&lt;cmath&gt;</code>: <code>sqrt, pow, sin, cos, tan, log</code> (natural log), <code>abs</code>. These take and return double.</p>
<p><code>&lt;cstdlib&gt;</code>: <code>rand()</code> returns a random int (same sequence every run); <code>srand(x)</code> seeds it.<br>
<code>&lt;random&gt;</code>: <code>random_device myEngine; uniform_int_distribution&lt;int&gt; randomInt(0, 100); int n = randomInt(myEngine);</code></p>
<p><b>Hand tracing</b>: act as the computer, executing one statement at a time and recording variable values in a table. Useful to find logic errors.</p>` },
  ],
},
{
  id: 'selection',
  week: 'Week 4',
  title: 'Making Decisions (Selection)',
  test: ['Test 1', 'ProgrAss 1'],
  sections: [
    { h: 'Relational operators', html: `
<p><code>&gt; &lt; &gt;= &lt;= == !=</code>. Each gives true (1) or false (0). <code>result = x &lt;= y;</code> stores 0 or 1.</p>
<div class="callout warn">Do not confuse <code>=</code> (assignment) with <code>==</code> (comparison). <code>if (x = 5)</code> assigns 5 and is always true.</div>
<p>Why we need them: to make decisions, control program flow, and validate data & conditions.</p>` },
    { h: 'if / if-else / if-else-if', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int x = -4;
    if (x > 0)
        cout << "Positive" << endl;
    else if (x < 0)
        cout << "Negative" << endl;
    else
        cout << "Zero" << endl;   // trailing else catches everything else
    return 0;
}</pre>
<ul>
<li>No <code>;</code> after <code>if (expression)</code>.</li>
<li>More than one statement → use <code>{ }</code> to make a block.</li>
<li>0 is false; any other value is true.</li>
<li>Be careful testing floats/doubles for equality.</li>
<li>C++17: <code>if (int len = pw.length(); len &lt; 8) { ... }</code> (if with initialization).</li>
</ul>` },
    { h: 'Nested if', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int score = 72;
    if (score >= 50) {
        cout << "You passed!" << endl;
        if (score >= 80) cout << "Grade: A" << endl;
        else if (score >= 65) cout << "Grade: B" << endl;
        else cout << "Grade: C" << endl;
    } else {
        cout << "You failed. Grade: F" << endl;
    }
    return 0;
}</pre>` },
    { h: 'Flags', html: `
<p>A <b>flag</b> is a variable (usually <code>bool</code>) that signals a condition. It must be initialised before use. Why: to remember a condition's result, to control the program's decisions, and to simplify complex logic.</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int password = 1234;
    bool loginSuccess = false;
    if (password == 1234) loginSuccess = true;
    if (loginSuccess) cout << "Welcome!" << endl;
    else cout << "Access denied." << endl;
    return 0;
}</pre>` },
    { h: 'Logical operators', html: `
<table class="mini">
<tr><th>Op</th><th>True when</th></tr>
<tr><td><code>&amp;&amp;</code> AND</td><td>both sides are true</td></tr>
<tr><td><code>||</code> OR</td><td>either side is true</td></tr>
<tr><td><code>!</code> NOT</td><td>reverses the value</td></tr>
</table>
<p>Precedence: <code>!</code> → <code>&amp;&amp;</code> → <code>||</code>. <b>Short-circuit evaluation</b>: if the left side already decides the result, the right side is not evaluated.</p>
<p>With x = 12, y = 5, z = -4: <code>(x &gt; y) &amp;&amp; (y &gt; z)</code> true · <code>(x &gt; y) &amp;&amp; (z &gt; y)</code> false · <code>(x &lt;= z) || (y == z)</code> false · <code>(x &lt;= z) || (y != z)</code> true · <code>!(x &gt;= z)</code> false</p>
<p>Range check: <code>if (grade &gt;= 0 &amp;&amp; grade &lt;= 100)</code>. <b><code>if (0 &lt;= grade &lt;= 100)</code> does NOT work.</b></p>
<p>Why: combine multiple conditions, simplify nested ifs, improve readability and efficiency.</p>` },
    { h: 'Menus, validation, comparing chars/strings', html: `
<ul>
<li><b>Menu-driven program</b>: display choices, read the selection, test it with if/else-if or switch.</li>
<li><b>Input validation</b> tests: range, reasonableness, valid menu choice, divide by zero.</li>
<li>Characters compare by ASCII: <code>'A'</code>(65) &lt; <code>'B'</code>(66), <code>'1'</code>(49) &lt; <code>'2'</code>(50), lowercase &gt; uppercase so <code>'a' &gt; 'Z'</code>.</li>
<li>Strings compare character by character: <code>"Mary" &gt; "Mark"</code> is true (y &gt; k); <code>"Mary" &lt; "Mary Jane"</code> is true.</li>
</ul>` },
    { h: 'Conditional (ternary) operator', html: `
<p><code>expr1 ? expr2 : expr3</code>. If expr1 is true the value is expr2, otherwise expr3.</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int a = 7, b = 12;
    int bigger = (a > b) ? a : b;
    int num = -9;
    int absolute = (num < 0) ? -num : num;
    cout << bigger << " " << absolute << endl;
    cout << (num % 2 == 0 ? "even" : "odd") << endl;
    return 0;
}</pre>` },
    { h: 'switch', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    char grade = 'B';
    switch (grade) {
        case 'A': cout << "Excellent" << endl; break;
        case 'B':
        case 'b': cout << "Good" << endl; break;   // two cases share code
        default:  cout << "Invalid grade" << endl;
    }
    return 0;
}</pre>
<ol>
<li>The switch expression must be an <b>integer</b> (char counts, string and double do not).</li>
<li>Case labels must be <b>constant</b> integer expressions or literals, and <b>unique</b>.</li>
<li><code>default</code> is optional but recommended.</li>
<li>Without <code>break</code> execution <b>falls through</b> into the following cases.</li>
</ol>` },
    { h: 'Blocks & scope', html: `<p>A variable's scope is the block it is defined in, from its definition to the closing <code>}</code>. An inner block may define a variable with the same name as an outer one (it hides the outer one, which is not a good idea).</p>` },
  ],
},
{
  id: 'loops',
  week: 'Week 5',
  title: 'Loops (Repetition)',
  test: ['Test 1', 'ProgrAss 1'],
  sections: [
    { h: 'Increment & decrement', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int num, val = 12;
    cout << val++ << endl;   // displays 12, val is now 13
    cout << ++val << endl;   // val becomes 14, displays 14
    num = --val;             // val 13, num 13
    num = val--;             // num 13, val 12
    cout << num << " " << val << endl;
    return 0;
}</pre>
<p><b>Prefix</b> (<code>++val</code>): change first, then use. <b>Postfix</b> (<code>val++</code>): use first, then change. <code>(a + b)++</code> is illegal (needs a memory location).</p>` },
    { h: 'while: pretest loop', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int number = 1;
    while (number <= 5) {
        cout << "Hello " << number << endl;
        number++;            // without this: infinite loop
    }
    return 0;
}</pre>
<p>The condition is tested <b>before</b> each iteration, so the body may run <b>zero</b> times. Good for <b>input validation</b> and sentinel-terminated input.</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int number;
    cout << "Enter a number less than 10: ";
    cin >> number;
    while (number >= 10) {
        cout << "Invalid Entry! Enter a number less than 10: ";
        cin >> number;
    }
    cout << "You entered " << number << endl;
    return 0;
}</pre>` },
    { h: 'do-while: posttest loop', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int x = 1;
    do {
        cout << x << endl;   // runs once even though x < 0 is false
    } while (x < 0);         // semicolon required!
    return 0;
}</pre>
<p>Always runs <b>at least once</b>. Useful for <b>repeating a menu</b>.</p>` },
    { h: 'for: counter-controlled pretest loop', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    for (int count = 1; count <= 5; count++)
        cout << "Hello" << endl;

    int x, y;
    for (x = 1, y = 1; x <= 5; x++, y++)   // commas allowed
        cout << x << " plus " << y << " equals " << x + y << endl;
    return 0;
}</pre>
<p>Order: initialization (once) → test → body → update → test → … No semicolon after <code>)</code>. Any part can be omitted: <code>for (; num &lt;= 10; num++)</code>. A variable declared in the initialization only exists inside the loop. Use it when the number of iterations is known.</p>` },
    { h: 'Counters, running totals, sentinels', html: `
<ul>
<li><b>Counter</b>: incremented/decremented each iteration; must be initialised. Can be the <b>loop control variable</b>.</li>
<li><b>Accumulator</b>: holds a <b>running total</b>; initialise to 0 before the loop.</li>
<li><b>Sentinel</b>: special value (e.g. -1, -999) that marks the end of data and cannot be confused with valid data. Used when the user does not know how many values there are.</li>
</ul>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int points, total = 0;
    cin >> points;               // try stdin: 10 20 30 -1
    while (points != -1) {
        total += points;
        cin >> points;
    }
    cout << "Total points: " << total << endl;
    return 0;
}</pre>` },
    { h: 'Choosing a loop', html: `
<table class="mini">
<tr><th>Loop</th><th>Type</th><th>Use for</th></tr>
<tr><td>while</td><td>conditional pretest</td><td>validating input, sentinel lists</td></tr>
<tr><td>do-while</td><td>conditional posttest (≥ 1 time)</td><td>repeating a menu</td></tr>
<tr><td>for</td><td>pretest with init/test/update built in</td><td>known number of iterations</td></tr>
</table>` },
    { h: 'Nested loops', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    for (int row = 1; row <= 3; row++) {        // outer
        for (int col = 1; col <= 4; col++)      // inner
            cout << row * col << "\\t";
        cout << endl;
    }
    return 0;
}</pre>
<p>The inner loop completes all its iterations for <b>each</b> iteration of the outer loop. Total inner iterations = outer × inner (3 × 4 = 12 here).</p>` },
    { h: 'break and continue', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    for (int i = 1; i <= 10; i++) {
        if (i % 2 == 0) continue;   // skip the rest, go to update i++
        if (i > 7) break;           // leave the loop completely
        cout << i << " ";
    }
    cout << endl;                   // prints 1 3 5 7
    return 0;
}</pre>
<p><code>break</code> inside an inner loop only exits <b>that</b> inner loop. <code>continue</code>: in while/do-while jump to the test; in for, do the update then the test. Use both sparingly.</p>` },
  ],
},
{
  id: 'files',
  week: 'Week 3 & 6–7',
  title: 'Random Numbers & Files',
  test: ['Test 1'],
  sections: [
    { h: 'Random numbers: rand() and srand()', html: `
<p><code>rand()</code> (header <code>&lt;cstdlib&gt;</code>) returns a <b>pseudo-random</b> int from 0 up to the largest int the computer holds.
Without <code>srand()</code> it gives the <b>same sequence every time</b> the program runs.</p>
<p><code>srand(x)</code> <b>seeds</b> the generator with an unsigned int <code>x</code>. Using the time as the seed gives a different sequence on every run:</p>
<pre class="code">#include &lt;iostream&gt;
#include &lt;cstdlib&gt;
#include &lt;ctime&gt;
using namespace std;

int main() {
    unsigned seed = time(0);   // get the system time
    srand(seed);               // seed the random number generator
    int dice = rand() % 6 + 1; // 1 to 6
    cout &lt;&lt; "You rolled " &lt;&lt; dice &lt;&lt; endl;
    return 0;
}</pre>
<p><code>seed</code> is <b>just a variable</b>; any unsigned value works. Range formula: <code>rand() % (max - min + 1) + min</code>.</p>
<p>The addendum slides also show the C++11 way: <code>#include &lt;random&gt;</code>, a <code>random_device</code> engine and a <code>uniform_int_distribution&lt;int&gt; randomInt(0, 100);</code> object.</p>` },
    { h: 'Files: why and how (slides 5.11)', html: `
<p>A program can use <b>files</b> instead of the keyboard and screen for input and output. Data in a file is <b>kept between program runs</b>.</p>
<p>Three steps, every time: <b>open</b> the file → <b>use</b> it (read from it, write to it, or both) → <b>close</b> it.</p>
<table class="mini"><tr><th>What you need</th><th>Meaning</th></tr>
<tr><td><code>#include &lt;fstream&gt;</code></td><td>the header for file access</td></tr>
<tr><td><code>ifstream</code></td><td>input file stream: read <b>from</b> a file</td></tr>
<tr><td><code>ofstream</code></td><td>output file stream: write <b>to</b> a file</td></tr>
<tr><td><code>fstream</code></td><td>input from or output to a file</td></tr></table>
<p>Define stream objects like variables: <code>ifstream infile;</code> and <code>ofstream outfile;</code></p>` },
    { h: 'Opening a file and testing for errors', html: `
<p><code>open</code> links a file name (outside the program) to a stream object (inside the program):</p>
<pre class="code">infile.open("inventory.dat");
outfile.open("report.txt");</pre>
<ul>
<li>The file name may include a drive and path.</li>
<li>An <b>output</b> file is <b>created</b> if needed. If it already exists, it is <b>erased first</b>.</li>
<li>An <b>input</b> file <b>must already exist</b>, or the open fails.</li>
</ul>
<p>Always test whether the open worked. Test the stream object itself, or use its <code>fail()</code> member function:</p>
<pre class="code">#include &lt;iostream&gt;
#include &lt;fstream&gt;
using namespace std;

int main() {
    ifstream infile;
    infile.open("test.txt");      // this file does not exist
    if (!infile)                  // same as: if (infile.fail())
        cout &lt;&lt; "File open failure!" &lt;&lt; endl;
    else
        cout &lt;&lt; "Opened test.txt" &lt;&lt; endl;
    return 0;
}</pre>` },
    { h: 'Writing to a file, then reading it back', html: `
<p>Use <code>&lt;&lt;</code> with an output file object (like <code>cout</code>) and <code>&gt;&gt;</code> with an input file object (like <code>cin</code>):</p>
<pre class="code">#include &lt;iostream&gt;
#include &lt;fstream&gt;
#include &lt;string&gt;
using namespace std;

int main() {
    ofstream outputFile;
    outputFile.open("demofile.txt");   // created, or erased if it exists
    outputFile &lt;&lt; "Bach" &lt;&lt; endl;
    outputFile &lt;&lt; "Beethoven" &lt;&lt; endl;
    outputFile &lt;&lt; "Mozart" &lt;&lt; endl;
    outputFile.close();                // writes everything out
    cout &lt;&lt; "Data written to demofile.txt" &lt;&lt; endl;

    ifstream inputFile;
    string name;
    inputFile.open("demofile.txt");
    inputFile &gt;&gt; name;                 // reads one word, like cin
    cout &lt;&lt; name &lt;&lt; endl;
    inputFile &gt;&gt; name;
    cout &lt;&lt; name &lt;&lt; endl;
    inputFile.close();
    return 0;
}</pre>
<p><code>&gt;&gt;</code> skips spaces and newlines and reads one value at a time. To read a whole line (with spaces), use <code>getline(inputFile, line)</code>.</p>` },
    { h: 'Using loops to process files', html: `
<p><code>inputFile &gt;&gt; number</code> gives <b>true</b> when a value was read and <b>false</b> otherwise (for example at the end of the file). So it can be the condition of a <code>while</code> loop:</p>
<pre class="code">#include &lt;iostream&gt;
#include &lt;fstream&gt;
using namespace std;

int main() {
    ofstream out("numbers.txt");       // make a file to read (open in one step)
    out &lt;&lt; "2 3 5 7 11" &lt;&lt; endl;
    out.close();

    ifstream inputFile;
    int number, total = 0, count = 0;
    inputFile.open("numbers.txt");
    while (inputFile &gt;&gt; number) {      // stops when no more numbers
        total += number;
        count++;
    }
    inputFile.close();
    cout &lt;&lt; count &lt;&lt; " numbers, total " &lt;&lt; total &lt;&lt; endl;
    return 0;
}</pre>
<p>This one loop pattern answers most lab questions: total (accumulator), count (counter), largest (start from the first value), average (total / count, but check count is not 0), copy only some values (an <code>if</code> inside the loop).</p>
<div class="callout"><b>Read a file line by line:</b> <code>while (getline(inFile, line)) { ... }</code>. Copying a file is this loop with <code>outFile &lt;&lt; line &lt;&lt; endl;</code> inside.</div>` },
    { h: 'Closing files', html: `
<pre class="code">infile.close();
outfile.close();</pre>
<p>Do not wait for the operating system to close files when the program ends: there may be a <b>limit on the number of open files</b>, and there may be <b>buffered output data</b> still waiting to be sent to the file.</p>` },
    { h: 'Letting the user choose the file name', html: `
<p>Since <b>C++11</b> you can pass a <code>string</code> object straight to <code>open</code>:</p>
<pre class="code">#include &lt;iostream&gt;
#include &lt;fstream&gt;
#include &lt;string&gt;
using namespace std;

int main() {
    string filename, line;
    ifstream inputFile;
    cout &lt;&lt; "Enter the filename: ";
    cin &gt;&gt; filename;                    // try stdin: notes.txt
    inputFile.open(filename);
    if (inputFile) {
        while (getline(inputFile, line))
            cout &lt;&lt; line &lt;&lt; endl;
        inputFile.close();
    } else {
        cout &lt;&lt; "Error opening the file." &lt;&lt; endl;
    }
    return 0;
}</pre>
<p><b>Older C++ (before C++11):</b> <code>open</code> needs a <b>C-string</b> (a null-terminated string). String literals are stored as C-strings, but <code>string</code> objects are not. Use the <code>c_str()</code> member function, which returns the contents as a C-string:</p>
<pre class="code">inputFile.open(filename.c_str());</pre>` },
    { h: 'File access flags (past Test 1)', html: `
<table class="mini"><tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>ios::in</code></td><td>open for input (reading)</td></tr>
<tr><td><code>ios::out</code></td><td>open for output (writing); on its own an existing file's contents are <b>wiped out</b></td></tr>
<tr><td><code>ios::app</code></td><td>append: new data is written at the <b>end</b>, the old content is kept</td></tr>
<tr><td><code>ios::trunc</code></td><td>if the file exists, delete its contents</td></tr>
<tr><td><code>ios::binary</code></td><td>binary mode (not text)</td></tr></table>
<p>Combine flags with <code>|</code>. For a file that must be <b>read from and written to</b> without losing what is in it, the past Test 1 answer was
<code>myFile.open("inout.txt", ios::in | ios::app);</code> (its feedback: <i>ios::out will wipe out the existing content</i>). The flags are not in the Week 6 slides, but they were in the past test.</p>
<div class="callout"><b>Practise:</b> the ProgrAss practice page (open it from the <a href="#/archive">ProgrAss 1 archive</a>) has the 10 file-processing lab questions (filter <b>Files</b>). The checker creates the input files for you and shows the files your program writes.</div>` },
  ],
},
{
  id: 'week6',
  week: 'Week 6',
  title: 'Loops Part 2',
  test: ['Test 1', 'ProgrAss 1'],
  sections: [
    { h: 'One loop, three ways', html: `
<p>The Week 6 lab asks you to redo the Week 5 questions with a <code>while</code> loop, then a <code>do-while</code> loop. The same count from 1 to 5:</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    for (int i = 1; i &lt;= 5; i++)        // for: init; test; update in one line
        cout &lt;&lt; i &lt;&lt; " ";
    cout &lt;&lt; endl;

    int j = 1;                          // while: init before the loop
    while (j &lt;= 5) {                    // test
        cout &lt;&lt; j &lt;&lt; " ";
        j++;                            // update at the end of the body
    }
    cout &lt;&lt; endl;

    int k = 1;                          // do-while: same pieces
    do {
        cout &lt;&lt; k &lt;&lt; " ";
        k++;
    } while (k &lt;= 5);                   // test at the end, semicolon!
    cout &lt;&lt; endl;
    return 0;
}</pre>
<table class="mini"><tr><th>Change</th><th>What to do</th></tr>
<tr><td>for → while</td><td>Move the <b>initialisation</b> above the loop and the <b>update</b> to the end of the body; keep the test. Small change, but do not forget the update (infinite loop).</td></tr>
<tr><td>while → do-while</td><td>Move the test to the end: <code>do { … } while (test);</code>. The body now runs <b>at least once</b>, so check the first value still makes sense.</td></tr></table>` },
    { h: 'Prime numbers', html: `
<p>Lab hint: an even number is prime only if it is 2. An odd number is prime if no odd number from 3 up to its square root divides it. Testing up to the square root is enough: if n = a × b, one of a and b is at most √n.</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int n;
    cout &lt;&lt; "Enter a positive integer: ";
    cin &gt;&gt; n;                            // try stdin: 91
    bool prime = n &gt;= 2;
    if (n &gt; 2 &amp;&amp; n % 2 == 0)
        prime = false;
    for (int d = 3; d * d &lt;= n &amp;&amp; prime; d += 2)   // d * d &lt;= n means d &lt;= sqrt(n)
        if (n % d == 0)
            prime = false;
    if (prime)
        cout &lt;&lt; n &lt;&lt; " is a prime number." &lt;&lt; endl;
    else
        cout &lt;&lt; n &lt;&lt; " is not a prime number." &lt;&lt; endl;
    return 0;
}</pre>
<p>The <code>bool</code> variable is a <b>flag</b>: start by assuming "prime", and switch it off as soon as a divisor is found. Putting <code>&amp;&amp; prime</code> in the test stops the loop early.</p>` },
    { h: 'Patterns with nested loops', html: `
<p>Every pattern question is the same plan: the <b>outer loop</b> counts the rows, and for each row the <b>inner loops</b> print the spaces and then the symbols. Work out a formula for each row first.</p>
<table class="mini"><tr><th>Pattern (row i of n)</th><th>spaces</th><th>symbols</th></tr>
<tr><td>Growing triangle</td><td>0</td><td>i</td></tr>
<tr><td>Shrinking triangle</td><td>0</td><td>n − i + 1</td></tr>
<tr><td>Right-aligned triangle</td><td>n − i</td><td>i</td></tr>
<tr><td>Centred (diamond top half, "* * *")</td><td>n − i</td><td>i stars with a space between</td></tr></table>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int rows = 4;
    for (int i = 1; i &lt;= rows; i++) {          // top half of a diamond
        for (int s = 0; s &lt; rows - i; s++)
            cout &lt;&lt; " ";
        for (int k = 1; k &lt;= i; k++)
            cout &lt;&lt; (k &gt; 1 ? " *" : "*");
        cout &lt;&lt; endl;
    }
    for (int i = rows - 1; i &gt;= 1; i--) {      // bottom half: the same rows backwards
        for (int s = 0; s &lt; rows - i; s++)
            cout &lt;&lt; " ";
        for (int k = 1; k &lt;= i; k++)
            cout &lt;&lt; (k &gt; 1 ? " *" : "*");
        cout &lt;&lt; endl;
    }
    return 0;
}</pre>
<p>Two shapes one after the other (like the past assessment's + triangle then * triangle) are just two separate nested loops in a row.</p>` },
    { h: 'Input validation with a loop', html: `
<p>Keep asking until the input is valid (lab question 5: n must be within 10 to 20):</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int n;
    cout &lt;&lt; "Enter n (10 to 20): ";
    cin &gt;&gt; n;                                  // try stdin: 5 25 12
    while (n &lt; 10 || n &gt; 20) {
        cout &lt;&lt; "Invalid. Enter n (10 to 20): ";
        cin &gt;&gt; n;
    }
    cout &lt;&lt; "OK, n = " &lt;&lt; n &lt;&lt; endl;
    return 0;
}</pre>
<p>Note the <b>||</b>: n is invalid if it is too small <i>or</i> too big. With <b>&amp;&amp;</b> the condition could never be true.</p>` },
    { h: 'break vs continue (lab question 6)', html: `
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int main() {
    int x, sum = 0;
    for (int i = 1; i &lt;= 10; i++) {
        cin &gt;&gt; x;                     // try stdin: -2 -5 4 -1 -1 -1 -1 -1 -1 -1
        if (x &gt;= 0)
            break;                    // change to continue and compare
        sum += x;
    }
    cout &lt;&lt; "Sum: " &lt;&lt; sum &lt;&lt; endl;
    return 0;
}</pre>
<ul>
<li>With <code>break</code>: the first number that is not negative <b>ends the loop</b>. Sum = −7.</li>
<li>With <code>continue</code>: that number is <b>skipped</b>, and the loop goes on to read all ten. Sum = −14.</li>
</ul>
<p>Conclusion: <code>continue</code> skips the rest of the current iteration only; in a <code>for</code> loop it jumps to the update (<code>i++</code>) and then the test.</p>` },
    { h: 'Random symbol guessing game', html: `
<p>Past assessment questions 3 and 4. A random printable symbol is ASCII 33 (<code>!</code>) to 126 (<code>~</code>), so use <code>rand() % 94 + 33</code>. Comparing two <code>char</code> values compares their ASCII numbers.</p>
<pre class="code">#include &lt;iostream&gt;
#include &lt;cstdlib&gt;
#include &lt;ctime&gt;
using namespace std;

int main() {
    srand(time(0));
    char secret = static_cast&lt;char&gt;(rand() % 94 + 33);
    char guess = ' ';
    int guesses = 0;
    do {
        cout &lt;&lt; "Guess the symbol: ";
        cin &gt;&gt; guess;
        guesses++;
        if (guess &gt; secret)
            cout &lt;&lt; "Symbol ASCII too high, try again." &lt;&lt; endl;
        else if (guess &lt; secret)
            cout &lt;&lt; "Symbol's ASCII too low, try again." &lt;&lt; endl;
    } while (guess != secret &amp;&amp; cin);   // cin is false when the input runs out
    if (guess == secret)
        cout &lt;&lt; "Correct! You needed " &lt;&lt; guesses &lt;&lt; " guesses." &lt;&lt; endl;
    return 0;
}</pre>
<p>A <code>do-while</code> fits well: the user must guess at least once. It is best in your own IDE (for example Visual Studio), where you can react to each hint. The "Try it" box sends all its input at once, so the <code>&amp;&amp; cin</code> part stops the loop when your typed guesses run out. The ProgrAss version of this question gives you the secret symbol so it can be tested.</p>` },
  ],
},
{
  id: 'week7',
  week: 'Week 7',
  title: 'Advanced File Processing',
  test: ['Week 7 lab'],
  sections: [
    { h: 'Ask for the file name, then check it opened', html: `
<p>Most Week 7 lab questions start the same way: ask the user for a file name, open it, and stop with an error if it is not there.</p>
<pre class="code">string name;
getline(cin, name);            // getline: file names can contain spaces
ifstream inFile(name);         // open while declaring (C++11)
// older compilers: inFile.open(name.c_str());
if (!inFile) {                 // true when the file could not be opened
    cout &lt;&lt; "Error: cannot open " &lt;&lt; name &lt;&lt; "." &lt;&lt; endl;
} else {
    // ... read the file ...
    inFile.close();
}</pre>
<p><code>if (!inFile)</code> and <code>if (inFile.fail())</code> mean the same thing. Always <b>close</b> a file when you are done.</p>` },
    { h: 'Three ways to read: word, line, character', html: `
<table class="tbl"><tr><th>Read</th><th>Code</th><th>Good for</th></tr>
<tr><td>a word or number</td><td><code>while (inFile &gt;&gt; word)</code></td><td>counting words, reading numbers (Q4, Q6, Q10, Q11)</td></tr>
<tr><td>a whole line</td><td><code>while (getline(inFile, line))</code></td><td>showing lines, line numbers (Q1, Q2, Q5)</td></tr>
<tr><td>one character</td><td><code>while (inFile.get(c))</code></td><td>copying or changing every character, even spaces and newlines (Q7, Q8)</td></tr></table>
<p>Write one character with <code>outFile.put(c);</code>. <code>&gt;&gt;</code> <b>skips</b> spaces and newlines; <code>get</code> does not.</p>
<p>Each loop stops by itself at the end of the file, because the read fails. Do not write <code>while (!inFile.eof())</code>: it runs one time too many.</p>` },
    { h: 'Counting patterns', html: `
<pre class="code">int n = 0;
while (getline(inFile, line)) {
    n++;                                   // line number, starting at 1
    if (n % 2 == 1)                        // only lines 1, 3, 5, ...
        cout &lt;&lt; n &lt;&lt; ": " &lt;&lt; line &lt;&lt; endl;
}</pre>
<p><b>Pause every 24 lines</b> (Q2, Q5): before printing a line, if 24, 48, … lines are already shown, wait for Enter:</p>
<pre class="code">if (count &gt; 0 &amp;&amp; count % 24 == 0) {
    cout &lt;&lt; "-- Press Enter to see more --" &lt;&lt; endl;
    cin.get();                             // waits for a key (Enter)
}</pre>
<p><b>Sentences</b> (Q4): count the <code>'.'</code> characters inside each word. <b>Word length</b> (Q6): <code>word.length()</code>.</p>` },
    { h: 'Random access: seekg and tellg', html: `
<p>A file has a <b>read position</b> (the "get" pointer) and a <b>write position</b> (the "put" pointer). You can move them:</p>
<table class="tbl"><tr><th>Code</th><th>Meaning</th></tr>
<tr><td><code>inFile.seekg(10, ios::beg)</code></td><td>go to byte 10 from the <b>beginning</b></td></tr>
<tr><td><code>inFile.seekg(-1, ios::end)</code></td><td>go to the <b>last</b> character</td></tr>
<tr><td><code>inFile.seekg(5, ios::cur)</code></td><td>move 5 bytes forward from where you are</td></tr>
<tr><td><code>inFile.tellg()</code></td><td>the current read position (a number)</td></tr>
<tr><td><code>outFile.seekp(…)</code> / <code>tellp()</code></td><td>the same for the write position</td></tr></table>
<p><b>Last line of a file</b> (Q3): go to the end, then back up one character at a time until the character before you is <code>'\\n'</code>:</p>
<pre class="code">char c;
punch.seekg(-1, ios::end);             // the last character
punch.get(c);
long pos = (long)punch.tellg() - 1;    // its position
if (c == '\\n') pos--;                  // skip a final newline
while (pos &gt; 0) {
    punch.seekg(pos - 1);
    punch.get(c);
    if (c == '\\n') break;              // found the start of the last line
    pos--;
}
punch.seekg(pos);
getline(punch, line);</pre>
<p>If the file already hit the end (the end-of-file flag is set), call <code>inFile.clear();</code> before <code>seekg</code>, or the move is ignored.</p>` },
    { h: 'A file filter: simple encryption', html: `
<p>A <b>filter</b> reads one file, changes the data, and writes another file (Q7, Q8). Read and write one character at a time so nothing is lost:</p>
<pre class="code">ifstream in("plain.txt");
ofstream out("coded.txt");
char c;
while (in.get(c)) {
    if (c &gt;= 'a' &amp;&amp; c &lt;= 'z')
        c = (c - 'a' + 10) % 26 + 'a';   // a→k ... q→a
    out.put(c);
}</pre>
<p>To decrypt, move the other way: <code>(c - 'a' + 16) % 26 + 'a'</code> (16 = 26 − 10, so <code>%</code> never sees a negative number). The lab's simplest idea, <code>c + 10</code> on every character, also works as long as the decrypter does <code>c - 10</code>.</p>` },
    { h: 'Formatted output to a file', html: `
<p><code>fixed</code> and <code>setprecision</code> (header <code>&lt;iomanip&gt;</code>) work on an <code>ofstream</code> exactly like on <code>cout</code> (Q9, Q11):</p>
<pre class="code">outFile &lt;&lt; fixed &lt;&lt; setprecision(2);
outFile &lt;&lt; "Paycheck: $" &lt;&lt; salary * (1 + bonus / 100) * (1 - tax / 100) &lt;&lt; endl;</pre>
<p>Read numbers in the order they appear: <code>inFile &gt;&gt; first &gt;&gt; last &gt;&gt; dept;</code> then <code>inFile &gt;&gt; salary &gt;&gt; bonus &gt;&gt; tax;</code>. Line breaks in the file do not matter to <code>&gt;&gt;</code>.</p>
<p>Reading pairs until the file ends (Q10): <code>while (inFile &gt;&gt; price &gt;&gt; sold) { … }</code>.</p>` },
    { h: 'Common mistakes', html: `
<ul>
<li>Using <code>cin &gt;&gt; name</code> for a file name with spaces. Use <code>getline</code>.</li>
<li>Forgetting <code>if (!inFile)</code>, so a missing file prints nothing and gives no error.</li>
<li><code>while (!inFile.eof())</code>: the last value is processed twice.</li>
<li>Using <code>&gt;&gt;</code> in a copy or encryption program: spaces and newlines disappear. Use <code>get</code> and <code>put</code>.</li>
<li>Opening an output file you also need to read: <code>ofstream</code> (or <code>ios::out</code>) <b>wipes</b> it first.</li>
<li><code>seekg</code> after reaching the end without <code>clear()</code>.</li>
</ul>
<div class="callout"><b>Practise:</b> all 11 Week 7 lab questions are in the <a href="#/progass">problem bank</a> (filter <b>Week 7 lab</b>), with test files and automatic checking.</div>` },
  ],
},
{
  id: 'week9',
  week: 'Week 9',
  title: 'Functions I',
  test: ['Test 2', 'ProgrAss 2'],
  sections: [
    { h: 'Modular programming', html: `
<p><b>Modular programming</b> means breaking a program into smaller, manageable <b>functions</b> (modules). A <b>function</b> is a collection of statements that performs one task.</p>
<p>Why: the program is <b>easier to maintain</b> (fix one function without touching the rest) and <b>easier to write</b> (solve one small task at a time, and reuse it). Instead of one long <code>main</code>, <code>main</code> calls a few well-named functions.</p>` },
    { h: 'Defining and calling a function', html: `
<p>A <b>function definition</b> is the statements that make up the function. A <b>function call</b> is the statement that makes it run.</p>
<table class="tbl"><tr><th>Part</th><th>Meaning</th><th>In <code>int sum(int a, int b)</code></th></tr>
<tr><td>return type</td><td>type of the value sent back; <code>void</code> if nothing is returned</td><td><code>int</code></td></tr>
<tr><td>name</td><td>same rules as variable names</td><td><code>sum</code></td></tr>
<tr><td>parameter list</td><td>variables that receive the values passed in</td><td><code>(int a, int b)</code></td></tr>
<tr><td>body</td><td>the statements, inside <code>{ }</code></td><td><code>{ return a + b; }</code></td></tr></table>
<p>The first line (return type, name, parameter list) is the <b>function header</b>. <code>int main()</code> is a function header too.</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

void printHeading()            // void: returns nothing
{
    cout &lt;&lt; "Monthly Sales" &lt;&lt; endl;
}

int main()
{
    cout &lt;&lt; "Start of main" &lt;&lt; endl;
    printHeading();             // call: name, (), ;
    cout &lt;&lt; "Back in main" &lt;&lt; endl;
    return 0;
}</pre>
<p><b>Flow of control:</b> at the call, the program jumps into the function and runs its body. When the function ends, execution <b>resumes in the caller, right after the call</b>. <code>main</code> can call any number of functions, and functions can call other functions.</p>` },
    { h: 'Function prototypes', html: `
<p>The compiler must know a function's <b>name, return type, number of parameters and the type of each parameter</b> before the function is called. Two ways:</p>
<ol><li>Put the whole function definition <b>above</b> the function that calls it, or</li>
<li>Put a <b>prototype</b> (function declaration) near the top: the header with a semicolon and no body.</li></ol>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

void evenOrOdd(int);           // prototype: parameter names are optional

int main()
{
    int val = 7;
    evenOrOdd(val);            // call: the argument is val
    return 0;
}

void evenOrOdd(int num)        // header: must name each parameter
{
    if (num % 2 == 0)
        cout &lt;&lt; num &lt;&lt; " is even." &lt;&lt; endl;
    else
        cout &lt;&lt; num &lt;&lt; " is odd." &lt;&lt; endl;
}</pre>
<p>With prototypes, the definitions can go in any order. Without a prototype or an earlier definition, calling the function is a <b>compiler error</b>.</p>` },
    { h: 'Arguments and parameters', html: `
<p>Values passed in a call are <b>arguments</b> (also called <i>actual</i> parameters or arguments). The variables in the function that receive them are <b>parameters</b> (also called <i>formal</i> parameters or arguments). In <code>c = pow(a, b);</code>, a and b are arguments.</p>
<ul><li>A parameter's <b>scope</b> is its function: it does not exist outside it.</li>
<li>With several parameters, the number of arguments must match, and they are matched <b>by position</b>: the first argument goes to the first parameter, the second to the second, and so on.</li>
<li>Arguments are <b>promoted or demoted</b> to the parameter type: passing <code>4.7</code> to an <code>int</code> parameter gives <code>4</code>.</li></ul>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

void showSum(int num1, int num2, int num3)
{
    cout &lt;&lt; num1 + num2 + num3 &lt;&lt; endl;
}

int main()
{
    int value1 = 2, value2 = 4, value3 = 6;
    showSum(value1, value2, value3);   // 12
    showSum(1, 2, 3.9);                // 3.9 is demoted to 3, so 6
    return 0;
}</pre>` },
    { h: 'Passing by value', html: `
<p><b>Pass by value:</b> the argument's <b>value is copied</b> into the parameter. Changing the parameter inside the function does <b>not</b> change the argument.</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

void changeMe(int num)
{
    num = 0;                       // changes the copy only
    cout &lt;&lt; "Inside: " &lt;&lt; num &lt;&lt; endl;
}

int main()
{
    int val = 5;
    changeMe(val);
    cout &lt;&lt; "After: " &lt;&lt; val &lt;&lt; endl;   // still 5
    return 0;
}</pre>
<p>Output: <code>Inside: 0</code> then <code>After: 5</code>. (Week 10 shows reference parameters, which <i>can</i> change the argument.)</p>` },
    { h: 'Functions in menu-driven programs', html: `
<p>In a menu program, each choice can call its own function, and those functions can call shared general-purpose functions. This keeps <code>main</code> short and avoids repeating code.</p>
<pre class="code">#include &lt;iostream&gt;
#include &lt;iomanip&gt;
using namespace std;

void showMenu()
{
    cout &lt;&lt; "1. Circle  2. Rectangle  3. Quit" &lt;&lt; endl;
}
double circleArea(double r) { return 3.14159 * r * r; }
double rectArea(double l, double w) { return l * w; }

int main()
{
    int choice;
    double a, b;
    cout &lt;&lt; fixed &lt;&lt; setprecision(2);
    do {
        showMenu();
        cin &gt;&gt; choice;
        if (choice == 1 &amp;&amp; cin &gt;&gt; a)
            cout &lt;&lt; "Area: " &lt;&lt; circleArea(a) &lt;&lt; endl;
        else if (choice == 2 &amp;&amp; cin &gt;&gt; a &gt;&gt; b)
            cout &lt;&lt; "Area: " &lt;&lt; rectArea(a, b) &lt;&lt; endl;
    } while (choice != 3 &amp;&amp; cin);
    return 0;
}</pre>` },
    { h: 'The return statement', html: `
<p><code>return</code> ends the function straight away. It can be anywhere in the function; the statements after it do not run. A <code>void</code> function without <code>return</code> ends at its closing <code>}</code>.</p>
<p>Use an early <code>return</code> to stop bad input, for example dividing by zero:</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

void divide(double a, double b)
{
    if (b == 0) {
        cout &lt;&lt; "Sorry, I cannot divide by zero." &lt;&lt; endl;
        return;                    // leave now
    }
    cout &lt;&lt; a &lt;&lt; " / " &lt;&lt; b &lt;&lt; " = " &lt;&lt; a / b &lt;&lt; endl;
}

int main()
{
    divide(12, 4);
    divide(5, 0);
    return 0;
}</pre>` },
    { h: 'Returning a value', html: `
<p>A <b>value-returning function</b> sends one value back to the point of call, like <code>pow(2.0, 10.0)</code> does. Its prototype and header give the return type (not <code>void</code>).</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

int sum(int num1, int num2)
{
    return num1 + num2;            // can return an expression
}

int main()
{
    int total = sum(20, 40);       // 1. assign it to a variable
    cout &lt;&lt; total &lt;&lt; endl;
    cout &lt;&lt; sum(1, 2) &lt;&lt; endl;     // 2. send it to cout
    cout &lt;&lt; sum(3, 4) * 2 &lt;&lt; endl; // 3. use it in an expression
    return 0;
}</pre>
<p>The caller should use the returned value; calling <code>sum(1, 2);</code> on its own line throws the result away.</p>
<div class="callout"><b>Note on the slides:</b> the slide example declares <code>double result;</code> inside <code>int sum(...)</code>. It compiles (the double is converted back to int when returned), but the types should match: use <code>int result;</code> or just <code>return num1 + num2;</code>.</div>` },
    { h: 'Returning a Boolean value', html: `
<p>A function can return <code>true</code> or <code>false</code>: declare the return type as <code>bool</code> and make every path return a value. The caller can use the call directly as a condition.</p>
<pre class="code">#include &lt;iostream&gt;
using namespace std;

bool isEven(int number)
{
    return number % 2 == 0;       // same as: if (...) return true; else return false;
}

int main()
{
    int n = 7;
    if (isEven(n))
        cout &lt;&lt; n &lt;&lt; " is even." &lt;&lt; endl;
    else
        cout &lt;&lt; n &lt;&lt; " is odd." &lt;&lt; endl;
    return 0;
}</pre>` },
    { h: 'Common mistakes', html: `
<ul>
<li>Calling a function before its prototype or definition: compiler error.</li>
<li>Forgetting the semicolon after a prototype, or adding one after a function header.</li>
<li>A prototype that does not match the header (different parameter types or return type).</li>
<li>Arguments in the wrong order: they are matched by position, not by name.</li>
<li>Expecting a pass-by-value parameter to change the caller's variable.</li>
<li>A value-returning function where some path has no <code>return</code>.</li>
<li>Writing <code>return</code> in a <code>void</code> function with a value, like <code>return 0;</code>.</li>
<li>Printing inside the function when the question asks you to <b>return</b> the value (CodeRunner checks the caller's output).</li>
</ul>
<div class="callout"><b>Practise:</b> 10 function-writing questions are in the <a href="#/progass/f:Week 9 functions">problem bank</a> (filter <b>Week 9 functions</b>). You write the function above <code>main</code>; the checker calls it with many values.</div>` },
  ],
},
];
