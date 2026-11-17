// Week 7 lab problems: Advanced File Processing (set 'week7').
// The lab asks the user for a file name; here the checker types it (stdin), so no prompt is printed.
// Test files are written for this site (not copied from the lab's input files).
// Expected outputs (bottom of the file) come from running each model answer with g++ 13.
(function () {
  function T(inc) {
    return ['iostream', 'fstream', 'string'].concat(inc || []).map(function (h) { return '#include <' + h + '>'; }).join('\n') +
      '\nusing namespace std;\n\nint main() {\n' +
      '    //type in your answer in the answer box for code within this section only\n{{ANSWER}}\n\n' +
      '    return 0;\n}';
  }
  function W(p) { p.set = 'week7'; p.topic = 'Files (Week 7 lab)'; p.template = p.template || T(p.inc); delete p.inc; return p; }
  function f(files, stdin) { return { vars: '', files: files, stdin: stdin || '' }; }
  function hide(list) { return list.map(function (t, i) { t.hidden = i >= 2; return t; }); }
  function lines(n, word) { var a = []; for (var i = 1; i <= n; i++) a.push((word || 'Line') + ' ' + i); return a.join('\n') + '\n'; }
  var POEM = 'Roses are red\nViolets are blue\nC++ is fun\nAnd so are you\n';
  var STORY = 'The clockmaker lived above his shop.\nEvery morning he wound forty clocks.\nHis daughters helped him.\nOne fixed the bells, the other the springs.\nThe town never missed an hour.\n';
  function enc(t) {   // the Question 7 code: letters 10 places forward
    return t.replace(/[a-zA-Z]/g, function (c) { var b = c < 'a' ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + 10) % 26 + b); });
  }

  window.PROBLEMS.push(
W({
  id: 'w7-alt-lines', title: 'Show the Odd-Numbered Lines', level: 1,
  desc: `<p>Lab Question 1. Read a <b>file name</b> with <code>getline(cin, name)</code>. If the file cannot be opened, print
<code>Error: cannot open NAME.</code>. Otherwise display lines 1, 3, 5, … of the file, each with its line number in front.</p>
<pre class="formula">file poem.txt:  Roses are red / Violets are blue / C++ is fun / And so are you
output:         1: Roses are red
                3: C++ is fun</pre>`,
  tests: hide([f({ 'poem.txt': POEM }, 'poem.txt'), f({}, 'missing.txt'), f({ 'story.txt': STORY }, 'story.txt'), f({ 'a.txt': 'only line\n' }, 'a.txt'),
    f({ 'empty.txt': '' }, 'empty.txt'), f({ 'n.txt': lines(9) }, 'n.txt'), f({ 'gap.txt': 'one\n\nthree\n\nfive\n' }, 'gap.txt'), f({ 'my notes.txt': 'first\nsecond\n' }, 'my notes.txt')]),
  solution: `string name, line;
getline(cin, name);
ifstream inFile(name);
if (!inFile) {
    cout << "Error: cannot open " << name << "." << endl;
} else {
    int n = 0;
    while (getline(inFile, line)) {
        n++;
        if (n % 2 == 1)
            cout << n << ": " << line << endl;
    }
    inFile.close();
}`,
}),
W({
  id: 'w7-pages', title: 'Show a File 24 Lines at a Time', level: 2,
  desc: `<p>Lab Question 2. Read a file name with <code>getline</code> and display the whole file. After every <b>24 lines</b>, if there are more lines, print
<code>-- Press Enter to see more --</code> and wait with <code>cin.get();</code> before showing the next 24. If the file cannot be opened, print <code>Error: cannot open NAME.</code></p>
<p>The checker presses Enter for you (its input has empty lines after the file name).</p>`,
  tests: hide([f({ 'big.txt': lines(30) }, 'big.txt\n\n\n'), f({}, 'nofile.txt'), f({ 'exact.txt': lines(24) }, 'exact.txt\n\n'), f({ 'small.txt': POEM }, 'small.txt'),
    f({ 'b50.txt': lines(50, 'Row') }, 'b50.txt\n\n\n\n'), f({ 'b25.txt': lines(25) }, 'b25.txt\n\n'), f({ 'e.txt': '' }, 'e.txt'), f({ 'b48.txt': lines(48, 'Tick') }, 'b48.txt\n\n\n')]),
  solution: `string name, line;
getline(cin, name);
ifstream inFile(name);
if (!inFile) {
    cout << "Error: cannot open " << name << "." << endl;
} else {
    int count = 0;
    while (getline(inFile, line)) {
        if (count > 0 && count % 24 == 0) {   // 24 lines shown and there is another one
            cout << "-- Press Enter to see more --" << endl;
            cin.get();
        }
        cout << line << endl;
        count++;
    }
    inFile.close();
}`,
}),
W({
  id: 'w7-numbered', title: 'Line Numbers with a Colon, 24 at a Time', level: 2,
  desc: `<p>Lab Question 5. Like the last question, but put the line number and a colon before every line (numbering starts at 1):</p>
<pre class="formula">1:George Rolland
2:127 Academy Street
3:Brasstown, NC 28706</pre>
<p>Pause after every 24 lines with <code>-- Press Enter to see more --</code> and <code>cin.get();</code>. If the file cannot be opened, print <code>Error: cannot open NAME.</code></p>`,
  tests: hide([f({ 'addr.txt': 'George Rolland\n127 Academy Street\nBrasstown, NC 28706\n' }, 'addr.txt'), f({ 'big.txt': lines(27) }, 'big.txt\n\n'), f({}, 'x.txt'),
    f({ 'poem.txt': POEM }, 'poem.txt'), f({ 'b49.txt': lines(49, 'Item') }, 'b49.txt\n\n\n'), f({ 'gap.txt': 'a\n\nb\n' }, 'gap.txt'), f({ 'e.txt': '' }, 'e.txt')]),
  solution: `string name, line;
getline(cin, name);
ifstream inFile(name);
if (!inFile) {
    cout << "Error: cannot open " << name << "." << endl;
} else {
    int n = 0;
    while (getline(inFile, line)) {
        if (n > 0 && n % 24 == 0) {
            cout << "-- Press Enter to see more --" << endl;
            cin.get();
        }
        n++;
        cout << n << ":" << line << endl;
    }
    inFile.close();
}`,
}),
W({
  id: 'w7-joke', title: 'Joke and Punch Line (seekg from the end)', level: 3,
  desc: `<p>Lab Question 3. <code>joke.txt</code> holds a joke without its punch line. <code>punchline.txt</code> has the punch line as its <b>last line</b>, after some garbage lines.</p>
<p>Display every line of <code>joke.txt</code>, then only the last line of <code>punchline.txt</code>. Find that line the way the lab asks: <b>seek to the end</b> of the file with <code>seekg(…, ios::end)</code>, then <b>back up</b> one character at a time until you reach the newline before the last line. If either file cannot be opened, print <code>Error: cannot open the files.</code></p>
<p>The lab wants two functions; the answer box is inside <code>main</code>, so write the two parts one after the other. The file may or may not end with a newline.</p>`,
  tests: hide([
    f({ 'joke.txt': 'Why did the student bring a ladder to class?\n', 'punchline.txt': 'xkcdqwerty\nasdfasdf\nBecause the course was on another level!\n' }),
    f({ 'joke.txt': 'Knock knock.\nWho is there?\nA compiler.\nA compiler who?\n', 'punchline.txt': 'zzzz\nError: missing semicolon on line 1\n' }),
    f({ 'joke.txt': 'Why do programmers prefer dark mode?\n' }),
    f({ 'joke.txt': 'Why was the math book sad?\n', 'punchline.txt': 'It had too many problems.' }),
    f({ 'joke.txt': 'What do you call a fake noodle?\n', 'punchline.txt': 'An impasta!\n' }),
    f({ 'joke.txt': 'Line one\nLine two\n', 'punchline.txt': 'g1\ng2\ng3\ng4\nThe end.\n' }),
    f({ 'joke.txt': 'Why did the loop stop?\n', 'punchline.txt': '@@@\n###\nIt hit a break.' })]),
  solution: `ifstream joke("joke.txt"), punch("punchline.txt");
if (!joke || !punch) {
    cout << "Error: cannot open the files." << endl;
} else {
    string line;
    while (getline(joke, line))          // part 1: the whole joke
        cout << line << endl;

    char c;                              // part 2: the last line of punchline.txt
    punch.seekg(-1, ios::end);           // the last character
    punch.get(c);
    long pos = (long)punch.tellg() - 1;  // where that character is
    if (c == '\\n')
        pos--;                           // skip the newline at the very end
    while (pos > 0) {                    // back up to the start of the last line
        punch.seekg(pos - 1);
        punch.get(c);
        if (c == '\\n')
            break;
        pos--;
    }
    punch.seekg(pos);
    getline(punch, line);
    cout << line << endl;
    joke.close();
    punch.close();
}`,
}),
W({
  id: 'w7-count', title: 'Count Words and Sentences', level: 1,
  desc: `<p>Lab Question 4. Read a file name with <code>getline</code>. Count the <b>words</b> (read them with <code>inFile &gt;&gt; word</code>) and the <b>sentences</b> (each sentence ends with a period, so count the <code>.</code> characters). Print:</p>
<pre class="formula">file:    I like C++. It is fast and fun to learn.
output:  Words: 10
         Sentences: 2</pre>
<p>If the file cannot be opened, print <code>Error: cannot open NAME.</code></p>`,
  tests: hide([f({ 's.txt': 'I like C++. It is fast and fun to learn.\n' }, 's.txt'), f({}, 'none.txt'), f({ 'story.txt': STORY }, 'story.txt'),
    f({ 'e.txt': '' }, 'e.txt'), f({ 'sp.txt': '   lots    of   spaces   \n\n here.  ' }, 'sp.txt'), f({ 'nodot.txt': 'no full stop here\nat all\n' }, 'nodot.txt'), f({ 'one.txt': 'Hi.' }, 'one.txt')]),
  solution: `string name, word;
getline(cin, name);
ifstream inFile(name);
if (!inFile) {
    cout << "Error: cannot open " << name << "." << endl;
} else {
    int words = 0, sentences = 0;
    while (inFile >> word) {
        words++;
        for (int i = 0; i < (int)word.length(); i++)
            if (word[i] == '.')
                sentences++;
    }
    cout << "Words: " << words << endl;
    cout << "Sentences: " << sentences << endl;
    inFile.close();
}`,
}),
W({
  id: 'w7-long-words', title: 'Words with at Least 10 Characters', level: 2,
  desc: `<p>Lab Question 6. Read a file name with <code>getline</code>. If the file cannot be opened, print <code>Error: cannot open NAME.</code>
Otherwise display only the words (read with <code>&gt;&gt;</code>) that have <b>at least 10 characters</b>, each followed by its length, then the total:</p>
<pre class="formula">industrialist (13)
Total words printed: 1</pre>
<p>Close the file before the program ends.</p>`,
  tests: hide([f({ 't.txt': 'This shrewd industrialist founded a postal service.\n' }, 't.txt'), f({}, 'gone.txt'), f({ 'story.txt': STORY }, 'story.txt'),
    f({ 'w.txt': 'abcdefghi abcdefghij abcdefghijk\n' }, 'w.txt'), f({ 'e.txt': '' }, 'e.txt'), f({ 'p.txt': 'Programming, computational thinking and responsibility.\n' }, 'p.txt')]),
  solution: `string name, word;
getline(cin, name);
ifstream inFile(name);
if (!inFile) {
    cout << "Error: cannot open " << name << "." << endl;
} else {
    int total = 0;
    while (inFile >> word) {
        if (word.length() >= 10) {
            cout << word << " (" << word.length() << ")" << endl;
            total++;
        }
    }
    inFile.close();
    cout << "Total words printed: " << total << endl;
}`,
}),
W({
  id: 'w7-encrypt', title: 'Encrypt a File (shift letters by 10)', level: 2, outFiles: ['coded.txt'],
  desc: `<p>Lab Question 7. Read <code>plain.txt</code> <b>one character at a time</b> with <code>get</code> and write a coded copy to <code>coded.txt</code> with <code>put</code>.</p>
<p>Code used here: move every <b>letter 10 places forward</b> in the alphabet and wrap round (<code>a→k</code>, <code>q→a</code>, <code>Z→J</code>). Anything else (spaces, digits, punctuation, newlines) is copied unchanged. Then print <code>Encrypted N characters.</code> (N counts every character read).</p>
<p>The lab's own idea, "add 10 to the ASCII code of every character", also works, but it turns newlines and letters near <code>z</code> into unreadable characters, so this checker uses the wrap-round version.</p>`,
  tests: hide([f({ 'plain.txt': 'Hello World\n' }), f({ 'plain.txt': 'abc xyz ABC XYZ\n' }), f({ 'plain.txt': POEM }), f({ 'plain.txt': '' }),
    f({ 'plain.txt': 'Test 1 is on 10/11, at 5:30pm!\n' }), f({ 'plain.txt': 'quiz' })]),
  solution: `ifstream in("plain.txt");
ofstream out("coded.txt");
char c;
int n = 0;
while (in.get(c)) {
    if (c >= 'a' && c <= 'z')
        c = (c - 'a' + 10) % 26 + 'a';
    else if (c >= 'A' && c <= 'Z')
        c = (c - 'A' + 10) % 26 + 'A';
    out.put(c);
    n++;
}
in.close();
out.close();
cout << "Encrypted " << n << " characters." << endl;`,
}),
W({
  id: 'w7-decrypt', title: 'Decrypt the Coded File', level: 2, outFiles: ['decoded.txt'],
  desc: `<p>Lab Question 8. Undo the last question: read <code>coded.txt</code> one character at a time, move every letter <b>10 places back</b> (wrap round: <code>a→q</code>, <code>J→Z</code>), and write the result to <code>decoded.txt</code>. Print <code>Decrypted N characters.</code></p>
<p>Tip: moving 10 back is the same as moving 16 forward, which avoids negative numbers with <code>%</code>.</p>`,
  tests: hide([f({ 'coded.txt': enc('Hello World\n') }), f({ 'coded.txt': enc('abc xyz ABC XYZ\n') }), f({ 'coded.txt': enc(POEM) }),
    f({ 'coded.txt': '' }), f({ 'coded.txt': enc('Test 1 is on 10/11!\n') })]),
  solution: `ifstream in("coded.txt");
ofstream out("decoded.txt");
char c;
int n = 0;
while (in.get(c)) {
    if (c >= 'a' && c <= 'z')
        c = (c - 'a' + 16) % 26 + 'a';
    else if (c >= 'A' && c <= 'Z')
        c = (c - 'A' + 16) % 26 + 'A';
    out.put(c);
    n++;
}
in.close();
out.close();
cout << "Decrypted " << n << " characters." << endl;`,
}),
W({
  id: 'w7-indata', title: 'inData.txt to outData.txt (paycheck, speed, sales)', level: 2, outFiles: ['outData.txt'], inc: ['iomanip'],
  desc: `<p>Lab Question 9. <code>inData.txt</code> holds: first name, last name, department; monthly gross salary, bonus %, tax %; distance and travel time; coffee cups sold and cost per cup:</p>
<pre class="formula">Giselle Robinson Accounting
5600 5 30
450 9
75 1.5</pre>
<p>Write <code>outData.txt</code> exactly like this (2 decimal places; paycheck = salary × (1 + bonus%) × (1 − tax%)):</p>
<pre class="formula">Name: Giselle Robinson, Department: Accounting
Monthly Gross Salary: $5600.00, Monthly Bonus: 5.00%, Taxes: 30.00%
Paycheck: $4116.00
Distance Traveled: 450.00 miles, Traveling Time: 9.00 hours
Average Speed: 50.00 miles per hour
Number of Coffee Cups Sold: 75, Cost: $1.50 per cup
Sales Amount = $112.50</pre>
<p>Then print <code>Done.</code> on the screen. It must work for any data in the file.</p>`,
  tests: hide([f({ 'inData.txt': 'Giselle Robinson Accounting\n5600 5 30\n450 9\n75 1.5\n' }), f({ 'inData.txt': 'Ahmad Faiz Marketing\n4200 10 12.5\n300 4\n120 2.25\n' }),
    f({ 'inData.txt': 'Mei Ling IT\n7350.5 0 20\n99 1.5\n0 3\n' }), f({ 'inData.txt': 'Raj Kumar Sales\n3000 7.5 8\n1000 12.5\n500 0.99\n' }), f({ 'inData.txt': 'Siti Aisyah Finance\n10000 15 35\n42 0.5\n33 4\n' })]),
  solution: `ifstream inFile;
ofstream outFile;
inFile.open("inData.txt");
outFile.open("outData.txt");
string first, last, dept;
double salary, bonus, tax, distance, hours, cost;
int cups;
inFile >> first >> last >> dept;
inFile >> salary >> bonus >> tax;
inFile >> distance >> hours;
inFile >> cups >> cost;
outFile << fixed << setprecision(2);
outFile << "Name: " << first << " " << last << ", Department: " << dept << endl;
outFile << "Monthly Gross Salary: $" << salary << ", Monthly Bonus: " << bonus << "%, Taxes: " << tax << "%" << endl;
outFile << "Paycheck: $" << salary * (1 + bonus / 100) * (1 - tax / 100) << endl;
outFile << "Distance Traveled: " << distance << " miles, Traveling Time: " << hours << " hours" << endl;
outFile << "Average Speed: " << distance / hours << " miles per hour" << endl;
outFile << "Number of Coffee Cups Sold: " << cups << ", Cost: $" << cost << " per cup" << endl;
outFile << "Sales Amount = $" << cups * cost << endl;
inFile.close();
outFile.close();
cout << "Done." << endl;`,
}),
W({
  id: 'w7-tickets', title: 'Stadium Ticket Sales', level: 1, inc: ['iomanip'],
  desc: `<p>Lab Question 10. <code>tickets.txt</code> holds pairs of numbers: a ticket price, then how many tickets were sold at that price (the numbers may be split over lines in any way). Print the total number of tickets and the total sales with 2 decimal places:</p>
<pre class="formula">file:    250 5750 / 100 28000 / 50 35750 / 25 18750
output:  Tickets sold: 88250
         Total sales: $6493750.00</pre>`,
  tests: hide([f({ 'tickets.txt': '250 5750\n100 28000\n50\n35750\n25\n18750\n' }), f({ 'tickets.txt': '300 100\n120 2000\n60 5000\n30 9000\n' }),
    f({ 'tickets.txt': '' }), f({ 'tickets.txt': '99.5 10 49.99 3' }), f({ 'tickets.txt': '250 0\n100 0\n50 0\n25 1\n' })]),
  solution: `ifstream inFile("tickets.txt");
double price, sales = 0;
int sold, tickets = 0;
while (inFile >> price >> sold) {
    tickets += sold;
    sales += price * sold;
}
inFile.close();
cout << fixed << setprecision(2);
cout << "Tickets sold: " << tickets << endl;
cout << "Total sales: $" << sales << endl;`,
}),
W({
  id: 'w7-raise', title: 'Pay Increase to Ch3_Ex6Output.dat', level: 2, outFiles: ['Ch3_Ex6Output.dat'], inc: ['iomanip'],
  desc: `<p>Lab Question 11. Each line of <code>Data.txt</code> has an employee's last name, first name, current salary and percent pay increase:</p>
<pre class="formula">Miller Andrew 65789.87 5</pre>
<p>Write one line per employee to <code>Ch3_Ex6Output.dat</code> as <code>firstName lastName updatedSalary</code> with 2 decimal places, for example <code>Andrew Miller 69079.36</code>. Then print <code>Saved N employees.</code></p>`,
  tests: hide([f({ 'Data.txt': 'Miller Andrew 65789.87 5\nGreen Sheila 75892.56 6\nSethi Amit 74900.50 6.1\n' }), f({ 'Data.txt': 'Tan Mei 3000 10\n' }),
    f({ 'Data.txt': '' }), f({ 'Data.txt': 'Ali Ahmad 4500.50 0\nLee Wei 5200 2.5\nKumar Raj 6100.75 12\nWong Ann 2999.99 3.3\n' })]),
  solution: `ifstream inFile("Data.txt");
ofstream outFile("Ch3_Ex6Output.dat");
string last, first;
double salary, raise;
int n = 0;
outFile << fixed << setprecision(2);
while (inFile >> last >> first >> salary >> raise) {
    outFile << first << " " << last << " " << salary * (1 + raise / 100) << endl;
    n++;
}
inFile.close();
outFile.close();
cout << "Saved " << n << " employees." << endl;`,
})
  );

  var EXP = {
    "w7-alt-lines": ["1: Roses are red\n3: C++ is fun\n","Error: cannot open missing.txt.\n","1: The clockmaker lived above his shop.\n3: His daughters helped him.\n5: The town never missed an hour.\n","1: only line\n","","1: Line 1\n3: Line 3\n5: Line 5\n7: Line 7\n9: Line 9\n","1: one\n3: three\n5: five\n","1: first\n"],
    "w7-pages": ["Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11\nLine 12\nLine 13\nLine 14\nLine 15\nLine 16\nLine 17\nLine 18\nLine 19\nLine 20\nLine 21\nLine 22\nLine 23\nLine 24\n-- Press Enter to see more --\nLine 25\nLine 26\nLine 27\nLine 28\nLine 29\nLine 30\n","Error: cannot open nofile.txt.\n","Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11\nLine 12\nLine 13\nLine 14\nLine 15\nLine 16\nLine 17\nLine 18\nLine 19\nLine 20\nLine 21\nLine 22\nLine 23\nLine 24\n","Roses are red\nViolets are blue\nC++ is fun\nAnd so are you\n","Row 1\nRow 2\nRow 3\nRow 4\nRow 5\nRow 6\nRow 7\nRow 8\nRow 9\nRow 10\nRow 11\nRow 12\nRow 13\nRow 14\nRow 15\nRow 16\nRow 17\nRow 18\nRow 19\nRow 20\nRow 21\nRow 22\nRow 23\nRow 24\n-- Press Enter to see more --\nRow 25\nRow 26\nRow 27\nRow 28\nRow 29\nRow 30\nRow 31\nRow 32\nRow 33\nRow 34\nRow 35\nRow 36\nRow 37\nRow 38\nRow 39\nRow 40\nRow 41\nRow 42\nRow 43\nRow 44\nRow 45\nRow 46\nRow 47\nRow 48\n-- Press Enter to see more --\nRow 49\nRow 50\n","Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11\nLine 12\nLine 13\nLine 14\nLine 15\nLine 16\nLine 17\nLine 18\nLine 19\nLine 20\nLine 21\nLine 22\nLine 23\nLine 24\n-- Press Enter to see more --\nLine 25\n","","Tick 1\nTick 2\nTick 3\nTick 4\nTick 5\nTick 6\nTick 7\nTick 8\nTick 9\nTick 10\nTick 11\nTick 12\nTick 13\nTick 14\nTick 15\nTick 16\nTick 17\nTick 18\nTick 19\nTick 20\nTick 21\nTick 22\nTick 23\nTick 24\n-- Press Enter to see more --\nTick 25\nTick 26\nTick 27\nTick 28\nTick 29\nTick 30\nTick 31\nTick 32\nTick 33\nTick 34\nTick 35\nTick 36\nTick 37\nTick 38\nTick 39\nTick 40\nTick 41\nTick 42\nTick 43\nTick 44\nTick 45\nTick 46\nTick 47\nTick 48\n"],
    "w7-numbered": ["1:George Rolland\n2:127 Academy Street\n3:Brasstown, NC 28706\n","1:Line 1\n2:Line 2\n3:Line 3\n4:Line 4\n5:Line 5\n6:Line 6\n7:Line 7\n8:Line 8\n9:Line 9\n10:Line 10\n11:Line 11\n12:Line 12\n13:Line 13\n14:Line 14\n15:Line 15\n16:Line 16\n17:Line 17\n18:Line 18\n19:Line 19\n20:Line 20\n21:Line 21\n22:Line 22\n23:Line 23\n24:Line 24\n-- Press Enter to see more --\n25:Line 25\n26:Line 26\n27:Line 27\n","Error: cannot open x.txt.\n","1:Roses are red\n2:Violets are blue\n3:C++ is fun\n4:And so are you\n","1:Item 1\n2:Item 2\n3:Item 3\n4:Item 4\n5:Item 5\n6:Item 6\n7:Item 7\n8:Item 8\n9:Item 9\n10:Item 10\n11:Item 11\n12:Item 12\n13:Item 13\n14:Item 14\n15:Item 15\n16:Item 16\n17:Item 17\n18:Item 18\n19:Item 19\n20:Item 20\n21:Item 21\n22:Item 22\n23:Item 23\n24:Item 24\n-- Press Enter to see more --\n25:Item 25\n26:Item 26\n27:Item 27\n28:Item 28\n29:Item 29\n30:Item 30\n31:Item 31\n32:Item 32\n33:Item 33\n34:Item 34\n35:Item 35\n36:Item 36\n37:Item 37\n38:Item 38\n39:Item 39\n40:Item 40\n41:Item 41\n42:Item 42\n43:Item 43\n44:Item 44\n45:Item 45\n46:Item 46\n47:Item 47\n48:Item 48\n-- Press Enter to see more --\n49:Item 49\n","1:a\n2:\n3:b\n",""],
    "w7-joke": ["Why did the student bring a ladder to class?\nBecause the course was on another level!\n","Knock knock.\nWho is there?\nA compiler.\nA compiler who?\nError: missing semicolon on line 1\n","Error: cannot open the files.\n","Why was the math book sad?\nIt had too many problems.\n","What do you call a fake noodle?\nAn impasta!\n","Line one\nLine two\nThe end.\n","Why did the loop stop?\nIt hit a break.\n"],
    "w7-count": ["Words: 10\nSentences: 2\n","Error: cannot open none.txt.\n","Words: 30\nSentences: 5\n","Words: 0\nSentences: 0\n","Words: 4\nSentences: 1\n","Words: 6\nSentences: 0\n","Words: 1\nSentences: 1\n"],
    "w7-long-words": ["industrialist (13)\nTotal words printed: 1\n","Error: cannot open gone.txt.\n","clockmaker (10)\nTotal words printed: 1\n","abcdefghij (10)\nabcdefghijk (11)\nTotal words printed: 2\n","Total words printed: 0\n","Programming, (12)\ncomputational (13)\nresponsibility. (15)\nTotal words printed: 3\n"],
    "w7-encrypt": ["Encrypted 12 characters.\n--- coded.txt ---\nRovvy Gybvn\n","Encrypted 16 characters.\n--- coded.txt ---\nklm hij KLM HIJ\n","Encrypted 57 characters.\n--- coded.txt ---\nBycoc kbo bon\nFsyvodc kbo lveo\nM++ sc pex\nKxn cy kbo iye\n","Encrypted 0 characters.\n--- coded.txt ---\n","Encrypted 31 characters.\n--- coded.txt ---\nDocd 1 sc yx 10/11, kd 5:30zw!\n","Encrypted 4 characters.\n--- coded.txt ---\naesj\n"],
    "w7-decrypt": ["Decrypted 12 characters.\n--- decoded.txt ---\nHello World\n","Decrypted 16 characters.\n--- decoded.txt ---\nabc xyz ABC XYZ\n","Decrypted 57 characters.\n--- decoded.txt ---\nRoses are red\nViolets are blue\nC++ is fun\nAnd so are you\n","Decrypted 0 characters.\n--- decoded.txt ---\n","Decrypted 20 characters.\n--- decoded.txt ---\nTest 1 is on 10/11!\n"],
    "w7-indata": ["Done.\n--- outData.txt ---\nName: Giselle Robinson, Department: Accounting\nMonthly Gross Salary: $5600.00, Monthly Bonus: 5.00%, Taxes: 30.00%\nPaycheck: $4116.00\nDistance Traveled: 450.00 miles, Traveling Time: 9.00 hours\nAverage Speed: 50.00 miles per hour\nNumber of Coffee Cups Sold: 75, Cost: $1.50 per cup\nSales Amount = $112.50\n","Done.\n--- outData.txt ---\nName: Ahmad Faiz, Department: Marketing\nMonthly Gross Salary: $4200.00, Monthly Bonus: 10.00%, Taxes: 12.50%\nPaycheck: $4042.50\nDistance Traveled: 300.00 miles, Traveling Time: 4.00 hours\nAverage Speed: 75.00 miles per hour\nNumber of Coffee Cups Sold: 120, Cost: $2.25 per cup\nSales Amount = $270.00\n","Done.\n--- outData.txt ---\nName: Mei Ling, Department: IT\nMonthly Gross Salary: $7350.50, Monthly Bonus: 0.00%, Taxes: 20.00%\nPaycheck: $5880.40\nDistance Traveled: 99.00 miles, Traveling Time: 1.50 hours\nAverage Speed: 66.00 miles per hour\nNumber of Coffee Cups Sold: 0, Cost: $3.00 per cup\nSales Amount = $0.00\n","Done.\n--- outData.txt ---\nName: Raj Kumar, Department: Sales\nMonthly Gross Salary: $3000.00, Monthly Bonus: 7.50%, Taxes: 8.00%\nPaycheck: $2967.00\nDistance Traveled: 1000.00 miles, Traveling Time: 12.50 hours\nAverage Speed: 80.00 miles per hour\nNumber of Coffee Cups Sold: 500, Cost: $0.99 per cup\nSales Amount = $495.00\n","Done.\n--- outData.txt ---\nName: Siti Aisyah, Department: Finance\nMonthly Gross Salary: $10000.00, Monthly Bonus: 15.00%, Taxes: 35.00%\nPaycheck: $7475.00\nDistance Traveled: 42.00 miles, Traveling Time: 0.50 hours\nAverage Speed: 84.00 miles per hour\nNumber of Coffee Cups Sold: 33, Cost: $4.00 per cup\nSales Amount = $132.00\n"],
    "w7-tickets": ["Tickets sold: 88250\nTotal sales: $6493750.00\n","Tickets sold: 16100\nTotal sales: $840000.00\n","Tickets sold: 0\nTotal sales: $0.00\n","Tickets sold: 13\nTotal sales: $1144.97\n","Tickets sold: 1\nTotal sales: $25.00\n"],
    "w7-raise": ["Saved 3 employees.\n--- Ch3_Ex6Output.dat ---\nAndrew Miller 69079.36\nSheila Green 80446.11\nAmit Sethi 79469.43\n","Saved 1 employees.\n--- Ch3_Ex6Output.dat ---\nMei Tan 3300.00\n","Saved 0 employees.\n--- Ch3_Ex6Output.dat ---\n","Saved 4 employees.\n--- Ch3_Ex6Output.dat ---\nAhmad Ali 4500.50\nWei Lee 5330.00\nRaj Kumar 6832.84\nAnn Wong 3098.99\n"]
  };
  window.PROBLEM_EXPECTED = window.PROBLEM_EXPECTED || {};
  for (var id in EXP) window.PROBLEM_EXPECTED[id] = EXP[id];
})();
