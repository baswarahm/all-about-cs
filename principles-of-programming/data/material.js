// Study notes, condensed from the CCA101 lecture slides.
// Each topic: { id, week, title, test: which assessments it appears in, sections: [{ h, html }] }
// Code inside <pre class="code"> gets a "Try it" button that opens it in the playground.
// To add Week 6/7 material, append a topic object at the end (or fill in the placeholder).

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
  id: 'week6',
  week: 'Week 6',
  title: 'Week 6 material (coming soon)',
  test: ['Test 1', 'ProgrAss 1'],
  placeholder: true,
  sections: [
    { h: 'Not added yet', html: `<p>This topic will be filled in once the Week 6 slides are available. ProgrAss 1 covers Week 6 <b>repetition structure only</b>; Test 1 covers up to Week 7 (basic file processing).</p>` },
  ],
},
];
