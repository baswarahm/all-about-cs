// Week 9 lab (Functions I): the lab questions that ask you to write code, checked like CodeRunner (set 'week9').
// The answer box holds the function(s), placed above main. Expected outputs (bottom) come from g++ 13.
(function () {
  function T(mainBody) {
    return '#include <iostream>\n#include <iomanip>\n#include <cmath>\n#include <string>\nusing namespace std;\n\n' +
      '//type in your answer in the answer box: your function(s) go here, above main\n{{ANSWER}}\n\n' +
      'int main() {\n' + (mainBody || '{{VARS}}') + '\n    return 0;\n}';
  }
  function F(p) { p.set = 'week9'; p.topic = 'Functions (Week 9 lab)'; p.template = p.template || T(); return p; }
  function c(lines) { return { vars: lines.split('\n').map(function (l) { return '    ' + l; }).join('\n') }; }
  function k(stdin) { return { vars: '', stdin: stdin }; }
  function hide(list) { return list.map(function (t, i) { t.hidden = i >= 2; return t; }); }
  var QUALIFY_MAIN = '    double salary;\n    int years;\n    cout << "This program will determine if you qualify\\n";\n    cout << "for our credit card.\\n";\n' +
    '    cout << "What is your annual salary? ";\n    cin >> salary;\n    cout << "How many years have you worked at your ";\n    cout << "current job? ";\n    cin >> years;\n' +
    '    if (salary >= 17000.0 && years >= 2)\n        qualify();\n    else\n        noQualify();';
  var WAGES_MAIN = '    double payRate, hoursWorked, wages;\n    cout << "How many hours have you worked? ";\n    cin >> hoursWorked;\n    cout << "What is your hourly pay rate? ";\n' +
    '    cin >> payRate;\n    wages = hoursWorked * payRate;\n    showDollars(wages);';
  var RECT_MAIN = '    double length = getLength();\n    double width = getWidth();\n    double area = getArea(length, width);\n    displayData(length, width, area);';

  window.PROBLEMS.push(
F({
  id: 'w9l-timesten', title: 'Lab Q6: void timesTen(int number)', level: 1,
  desc: `<p>Lab Question 6. Write a function <code>timesTen</code> with an <code>int</code> parameter named <code>number</code>. When it is called, it displays the product of <code>number</code> times ten, then a newline.</p>
<pre class="formula">timesTen(7);   →   70</pre>`,
  tests: hide([c('timesTen(7);'), c('timesTen(0);\ntimesTen(-3);'), c('for (int i = 1; i <= 5; i++)\n    timesTen(i);'), c('timesTen(12345);'), c('int n = 9;\ntimesTen(n + 1);')]),
  solution: `void timesTen(int number)
{
    cout << number * 10 << endl;
}`,
}),
F({
  id: 'w9l-qualify', title: 'Lab Q4: qualify and noQualify', level: 2, template: T(QUALIFY_MAIN),
  desc: `<p>Lab Question 4. <code>main</code> (given) decides whether a person qualifies for a credit card: at least 2 years in the current job and a salary of at least $17,000. Write the two functions it calls:</p>
<ul><li><code>qualify</code> prints <code>Congratulations! You qualify for our credit card.</code> then <code>The annual interest rate is 12%.</code> (two lines)</li>
<li><code>noQualify</code> prints <code>Sorry, you do not qualify for our credit card.</code> then <code>You need at least 2 years at your current job and a salary of at least $17,000.</code></li></ul>
<p>Because your functions are written above <code>main</code>, you do not need prototypes. In the lab, where they go after <code>main</code>, add <code>void qualify();</code> and <code>void noQualify();</code> above it.</p>`,
  tests: hide([k('25000 3'), k('16000 5'), k('17000 2'), k('50000 1'), k('17000.0 1'), k('16999.99 10')]),
  solution: `void qualify()
{
    cout << "Congratulations! You qualify for our credit card." << endl;
    cout << "The annual interest rate is 12%." << endl;
}

void noQualify()
{
    cout << "Sorry, you do not qualify for our credit card." << endl;
    cout << "You need at least 2 years at your current job and a salary of at least $17,000." << endl;
}`,
}),
F({
  id: 'w9l-showdollars', title: 'Lab Q10: void showDollars(double)', level: 1, template: T(WAGES_MAIN),
  desc: `<p>Lab Question 10. <code>main</code> (given) reads the hours worked and the hourly pay rate. Write <code>showDollars</code>: it takes one <code>double</code> and displays <code>Your wages are RM</code> followed by the value with 2 digits after the decimal point, in fixed notation, with the decimal point always shown.</p>
<pre class="formula">input: 40 12.5     output: ... Your wages are RM500.00</pre>`,
  tests: hide([k('40 12.5'), k('10 7'), k('0 15'), k('37.5 9.99'), k('1 0.005')]),
  solution: `void showDollars(double pay)
{
    cout << fixed << showpoint << setprecision(2);
    cout << "Your wages are RM" << pay << endl;
}`,
}),
F({
  id: 'w9l-celsius', title: 'Lab Q17: double celsius(double fahrenheit)', level: 2,
  desc: `<p>Lab Question 17. Write a function <code>celsius</code> that takes a Fahrenheit temperature and <b>returns</b> it in Celsius: C = 5/9 × (F − 32). The test code prints the results with 1 decimal place.</p>
<p>Careful: in C++ <code>5 / 9</code> is integer division and gives 0. Write <code>5.0 / 9</code>.</p>
<pre class="formula">celsius(212) → 100.0      celsius(32) → 0.0</pre>`,
  tests: hide([c('cout << fixed << setprecision(1) << celsius(212) << endl;'), c('cout << fixed << setprecision(1) << celsius(32) << endl;'),
    c('cout << fixed << setprecision(1);\nfor (int f = 0; f <= 20; f++)\n    cout << f << "\\t" << celsius(f) << endl;'), c('cout << fixed << setprecision(1) << celsius(-40) << endl;'),
    c('cout << fixed << setprecision(1) << celsius(98.6) << endl;'), c('double c = celsius(50);\ncout << fixed << setprecision(1) << c * 2 << endl;')]),
  solution: `double celsius(double fahrenheit)
{
    return 5.0 / 9 * (fahrenheit - 32);
}`,
}),
F({
  id: 'w9l-rectangle', title: 'Lab Q18: rectangle area with four functions', level: 3, template: T(RECT_MAIN),
  desc: `<p>Lab Question 18. <code>main</code> (given) calls four functions. Write them:</p>
<ul><li><code>getLength()</code>: prints <code>Enter the rectangle's length: </code>, reads a <code>double</code> and returns it.</li>
<li><code>getWidth()</code>: prints <code>Enter the rectangle's width: </code>, reads a <code>double</code> and returns it.</li>
<li><code>getArea(length, width)</code>: returns length × width.</li>
<li><code>displayData(length, width, area)</code>: prints three lines, <code>Length: </code>, <code>Width: </code> and <code>Area: </code>, each value with 2 decimal places.</li></ul>
<pre class="formula">input: 4 2.5
output: Enter the rectangle's length: Enter the rectangle's width: Length: 4.00
        Width: 2.50
        Area: 10.00</pre>`,
  tests: hide([k('4 2.5'), k('10 10'), k('0 7'), k('3.333 3'), k('12.75 0.5')]),
  solution: `double getLength()
{
    double length;
    cout << "Enter the rectangle's length: ";
    cin >> length;
    return length;
}

double getWidth()
{
    double width;
    cout << "Enter the rectangle's width: ";
    cin >> width;
    return width;
}

double getArea(double length, double width)
{
    return length * width;
}

void displayData(double length, double width, double area)
{
    cout << fixed << setprecision(2);
    cout << "Length: " << length << endl;
    cout << "Width: " << width << endl;
    cout << "Area: " << area << endl;
}`,
})
  );

  var EXP = {
    "w9l-timesten": ["70\n","0\n-30\n","10\n20\n30\n40\n50\n","123450\n","100\n"],
    "w9l-qualify": ["This program will determine if you qualify\nfor our credit card.\nWhat is your annual salary? How many years have you worked at your current job? Congratulations! You qualify for our credit card.\nThe annual interest rate is 12%.\n","This program will determine if you qualify\nfor our credit card.\nWhat is your annual salary? How many years have you worked at your current job? Sorry, you do not qualify for our credit card.\nYou need at least 2 years at your current job and a salary of at least $17,000.\n","This program will determine if you qualify\nfor our credit card.\nWhat is your annual salary? How many years have you worked at your current job? Congratulations! You qualify for our credit card.\nThe annual interest rate is 12%.\n","This program will determine if you qualify\nfor our credit card.\nWhat is your annual salary? How many years have you worked at your current job? Sorry, you do not qualify for our credit card.\nYou need at least 2 years at your current job and a salary of at least $17,000.\n","This program will determine if you qualify\nfor our credit card.\nWhat is your annual salary? How many years have you worked at your current job? Sorry, you do not qualify for our credit card.\nYou need at least 2 years at your current job and a salary of at least $17,000.\n","This program will determine if you qualify\nfor our credit card.\nWhat is your annual salary? How many years have you worked at your current job? Sorry, you do not qualify for our credit card.\nYou need at least 2 years at your current job and a salary of at least $17,000.\n"],
    "w9l-showdollars": ["How many hours have you worked? What is your hourly pay rate? Your wages are RM500.00\n","How many hours have you worked? What is your hourly pay rate? Your wages are RM70.00\n","How many hours have you worked? What is your hourly pay rate? Your wages are RM0.00\n","How many hours have you worked? What is your hourly pay rate? Your wages are RM374.62\n","How many hours have you worked? What is your hourly pay rate? Your wages are RM0.01\n"],
    "w9l-celsius": ["100.0\n","0.0\n","0\t-17.8\n1\t-17.2\n2\t-16.7\n3\t-16.1\n4\t-15.6\n5\t-15.0\n6\t-14.4\n7\t-13.9\n8\t-13.3\n9\t-12.8\n10\t-12.2\n11\t-11.7\n12\t-11.1\n13\t-10.6\n14\t-10.0\n15\t-9.4\n16\t-8.9\n17\t-8.3\n18\t-7.8\n19\t-7.2\n20\t-6.7\n","-40.0\n","37.0\n","20.0\n"],
    "w9l-rectangle": ["Enter the rectangle's length: Enter the rectangle's width: Length: 4.00\nWidth: 2.50\nArea: 10.00\n","Enter the rectangle's length: Enter the rectangle's width: Length: 10.00\nWidth: 10.00\nArea: 100.00\n","Enter the rectangle's length: Enter the rectangle's width: Length: 0.00\nWidth: 7.00\nArea: 0.00\n","Enter the rectangle's length: Enter the rectangle's width: Length: 3.33\nWidth: 3.00\nArea: 10.00\n","Enter the rectangle's length: Enter the rectangle's width: Length: 12.75\nWidth: 0.50\nArea: 6.38\n"]
  };
  window.PROBLEM_EXPECTED = window.PROBLEM_EXPECTED || {};
  for (var id in EXP) window.PROBLEM_EXPECTED[id] = EXP[id];
})();
