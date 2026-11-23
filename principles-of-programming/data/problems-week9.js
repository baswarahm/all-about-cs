// Week 9 problems: Functions I (set 'week9', Test 2 and ProgrAss 2 material).
// CodeRunner "write a function" style: the answer box holds the function(s), placed above main.
// Each test is a few lines of main that call the function (shown in the Test column).
// Expected outputs (bottom of the file) come from running each model answer with g++ 13.
(function () {
  function T(mainBody) {
    return '#include <iostream>\n#include <iomanip>\n#include <cmath>\n#include <string>\nusing namespace std;\n\n' +
      '//type in your answer in the answer box: your function(s) go here, above main\n{{ANSWER}}\n\n' +
      'int main() {\n' + (mainBody || '{{VARS}}') + '\n    return 0;\n}';
  }
  function F(p) { p.set = 'week9'; p.topic = 'Functions (Week 9)'; p.template = p.template || T(); return p; }
  function c(lines) { return { vars: lines.split('\n').map(function (l) { return '    ' + l; }).join('\n') }; }
  function k(stdin) { return { vars: '', stdin: stdin }; }
  function hide(list) { return list.map(function (t, i) { t.hidden = i >= 2; return t; }); }

  window.PROBLEMS.push(
F({
  id: 'w9-stars', title: 'void printStars(int n)', level: 1,
  desc: `<p>Write a <code>void</code> function <code>printStars</code> that takes an <code>int n</code> and prints <code>n</code> stars on one line, then a newline. If <code>n</code> is 0 or less, it prints just the newline.</p>
<pre class="formula">printStars(5);   →   *****</pre>`,
  tests: hide([c('printStars(5);'), c('printStars(1);\nprintStars(3);'), c('printStars(0);\ncout << "end" << endl;'), c('printStars(10);'),
    c('for (int i = 1; i <= 4; i++)\n    printStars(i);'), c('printStars(-2);\ncout << "end" << endl;'), c('printStars(7);\nprintStars(2);')]),
  solution: `void printStars(int n)
{
    for (int i = 0; i < n; i++)
        cout << "*";
    cout << endl;
}`,
}),
F({
  id: 'w9-sum', title: 'int sum(int a, int b)', level: 1,
  desc: `<p>Write a value-returning function <code>sum</code> that takes two <code>int</code> values and <b>returns</b> their sum. Do not print inside the function: the test code prints the value you return.</p>
<pre class="formula">cout << sum(20, 40);   →   60</pre>`,
  tests: hide([c('cout << sum(20, 40) << endl;'), c('int total = sum(3, 4);\ncout << total * 2 << endl;'), c('cout << sum(-5, 5) << endl;'), c('cout << sum(0, 0) << endl;'),
    c('cout << sum(sum(1, 2), sum(3, 4)) << endl;'), c('cout << sum(-100, -23) << endl;'), c('cout << sum(123456, 654321) << endl;')]),
  solution: `int sum(int a, int b)
{
    return a + b;
}`,
}),
F({
  id: 'w9-average', title: 'double average(double a, double b, double c)', level: 1,
  desc: `<p>Write a function <code>average</code> that returns the average of its three <code>double</code> parameters. The test code prints the result with 2 decimal places.</p>
<pre class="formula">average(70, 85, 90)   →   81.67</pre>`,
  tests: hide([c('cout << fixed << setprecision(2) << average(70, 85, 90) << endl;'), c('cout << fixed << setprecision(2) << average(1, 2, 3) << endl;'),
    c('cout << fixed << setprecision(2) << average(0, 0, 0) << endl;'), c('cout << fixed << setprecision(2) << average(-3, 3, 9) << endl;'),
    c('cout << fixed << setprecision(2) << average(2.5, 3.5, 4.75) << endl;'), c('double m = average(100, 100, 99);\ncout << fixed << setprecision(2) << m << endl;')]),
  solution: `double average(double a, double b, double c)
{
    return (a + b + c) / 3;
}`,
}),
F({
  id: 'w9-is-even', title: 'bool isEven(int n)', level: 1,
  desc: `<p>Write a function <code>isEven</code> that returns <code>true</code> if <code>n</code> is even and <code>false</code> otherwise. The test code uses it as a condition.</p>
<pre class="formula">if (isEven(4)) ...   →   true</pre>`,
  tests: hide([c('cout << (isEven(4) ? "even" : "odd") << endl;'), c('cout << (isEven(7) ? "even" : "odd") << endl;'), c('cout << (isEven(0) ? "even" : "odd") << endl;'),
    c('cout << (isEven(-6) ? "even" : "odd") << endl;'), c('cout << (isEven(-3) ? "even" : "odd") << endl;'),
    c('int count = 0;\nfor (int i = 1; i <= 10; i++)\n    if (isEven(i)) count++;\ncout << count << endl;')]),
  solution: `bool isEven(int n)
{
    return n % 2 == 0;
}`,
}),
F({
  id: 'w9-max3', title: 'int maxOf3(int a, int b, int c)', level: 2,
  desc: `<p>Write a function <code>maxOf3</code> that returns the largest of its three <code>int</code> parameters.</p>
<pre class="formula">maxOf3(4, 9, 2)   →   9</pre>`,
  tests: hide([c('cout << maxOf3(4, 9, 2) << endl;'), c('cout << maxOf3(-1, -5, -3) << endl;'), c('cout << maxOf3(7, 7, 7) << endl;'), c('cout << maxOf3(10, 2, 10) << endl;'),
    c('cout << maxOf3(1, 2, 3) << endl;'), c('cout << maxOf3(3, 2, 1) << endl;'), c('cout << maxOf3(0, -100, 100) << endl;')]),
  solution: `int maxOf3(int a, int b, int c)
{
    int biggest = a;
    if (b > biggest)
        biggest = b;
    if (c > biggest)
        biggest = c;
    return biggest;
}`,
}),
F({
  id: 'w9-divide', title: 'void showQuotient(double a, double b) with an early return', level: 2,
  desc: `<p>Write a <code>void</code> function <code>showQuotient</code>. If <code>b</code> is 0, print <code>Error: cannot divide by zero.</code> and leave the function with <code>return;</code>. Otherwise print the division with 2 decimal places:</p>
<pre class="formula">showQuotient(7, 2);   →   7.00 / 2.00 = 3.50
showQuotient(5, 0);   →   Error: cannot divide by zero.</pre>`,
  tests: hide([c('showQuotient(7, 2);'), c('showQuotient(5, 0);'), c('showQuotient(-9, 3);'), c('showQuotient(0, 4);'), c('showQuotient(1, 3);\nshowQuotient(2, 0);'), c('showQuotient(10.5, -2);')]),
  solution: `void showQuotient(double a, double b)
{
    if (b == 0) {
        cout << "Error: cannot divide by zero." << endl;
        return;
    }
    cout << fixed << setprecision(2) << a << " / " << b << " = " << a / b << endl;
}`,
}),
F({
  id: 'w9-is-prime', title: 'bool isPrime(int n)', level: 2,
  desc: `<p>Write a function <code>isPrime</code> that returns <code>true</code> if <code>n</code> is a prime number and <code>false</code> otherwise. Numbers below 2 are not prime.</p>
<pre class="formula">isPrime(7) → true      isPrime(9) → false      isPrime(1) → false</pre>`,
  tests: hide([c('cout << boolalpha << isPrime(7) << endl;'), c('cout << boolalpha << isPrime(9) << endl;'), c('cout << boolalpha << isPrime(1) << endl;'), c('cout << boolalpha << isPrime(2) << endl;'),
    c('for (int i = 1; i <= 30; i++)\n    if (isPrime(i)) cout << i << " ";\ncout << endl;'), c('cout << boolalpha << isPrime(97) << " " << isPrime(91) << endl;'), c('cout << boolalpha << isPrime(-7) << " " << isPrime(0) << endl;')]),
  solution: `bool isPrime(int n)
{
    if (n < 2)
        return false;
    for (int d = 2; d * d <= n; d++)
        if (n % d == 0)
            return false;
    return true;
}`,
}),
F({
  id: 'w9-count-digits', title: 'int countDigits(int n)', level: 2,
  desc: `<p>Write a function <code>countDigits</code> that returns how many digits <code>n</code> has. Ignore the minus sign. 0 has one digit.</p>
<pre class="formula">countDigits(2026) → 4      countDigits(-45) → 2      countDigits(0) → 1</pre>`,
  tests: hide([c('cout << countDigits(2026) << endl;'), c('cout << countDigits(-45) << endl;'), c('cout << countDigits(0) << endl;'), c('cout << countDigits(7) << endl;'),
    c('cout << countDigits(1000000) << endl;'), c('cout << countDigits(-9) << endl;'), c('cout << countDigits(123456789) << endl;')]),
  solution: `int countDigits(int n)
{
    if (n < 0)
        n = -n;
    int count = 1;
    while (n >= 10) {
        n /= 10;
        count++;
    }
    return count;
}`,
}),
F({
  id: 'w9-by-value', title: 'Pass by value: void tryToDouble(int x)', level: 2,
  desc: `<p>Write a <code>void</code> function <code>tryToDouble</code> that doubles its <code>int</code> parameter and prints <code>Inside: </code> followed by the new value. The test code prints the caller's variable before and after the call, so you can see that <b>pass by value</b> does not change it.</p>
<pre class="formula">int n = 5; ... tryToDouble(n); ...
Before: 5
Inside: 10
After: 5</pre>`,
  tests: hide([c('int n = 5;\ncout << "Before: " << n << endl;\ntryToDouble(n);\ncout << "After: " << n << endl;'), c('int n = -3;\ncout << "Before: " << n << endl;\ntryToDouble(n);\ncout << "After: " << n << endl;'),
    c('tryToDouble(21);'), c('int n = 0;\ntryToDouble(n);\ntryToDouble(n);\ncout << "After: " << n << endl;'), c('int a = 4;\ntryToDouble(a + 1);\ncout << "After: " << a << endl;')]),
  solution: `void tryToDouble(int x)
{
    x = x * 2;
    cout << "Inside: " << x << endl;
}`,
}),
F({
  id: 'w9-menu', title: 'Menu-driven areas: three functions', level: 3,
  template: T('    int choice;\n    double a, b;\n    cout << fixed << setprecision(2);\n    cin >> choice;\n    if (choice == 1) {\n        cin >> a;\n        cout << "Circle area: " << circleArea(a) << endl;\n    } else if (choice == 2) {\n        cin >> a >> b;\n        cout << "Rectangle area: " << rectangleArea(a, b) << endl;\n    } else if (choice == 3) {\n        cin >> a >> b;\n        cout << "Triangle area: " << triangleArea(a, b) << endl;\n    } else {\n        cout << "Invalid choice." << endl;\n    }'),
  desc: `<p>The menu in <code>main</code> is given. Write the three value-returning functions it calls:</p>
<ul><li><code>double circleArea(double r)</code>: 3.14159 × r × r</li>
<li><code>double rectangleArea(double length, double width)</code></li>
<li><code>double triangleArea(double base, double height)</code>: base × height / 2</li></ul>
<p>The keyboard input is the menu choice followed by the measurements.</p>
<pre class="formula">input: 1 2     output: Circle area: 12.57</pre>`,
  tests: hide([k('1 2'), k('2 3 4.5'), k('3 10 5'), k('4'), k('1 0'), k('3 7.5 2'), k('2 0.5 0.5')]),
  solution: `double circleArea(double r)
{
    return 3.14159 * r * r;
}

double rectangleArea(double length, double width)
{
    return length * width;
}

double triangleArea(double base, double height)
{
    return base * height / 2;
}`,
})
  );

  var EXP = {
    "w9-stars": ["*****\n","*\n***\n","\nend\n","**********\n","*\n**\n***\n****\n","\nend\n","*******\n**\n"],
    "w9-sum": ["60\n","14\n","0\n","0\n","10\n","-123\n","777777\n"],
    "w9-average": ["81.67\n","2.00\n","0.00\n","3.00\n","3.58\n","99.67\n"],
    "w9-is-even": ["even\n","odd\n","even\n","even\n","odd\n","5\n"],
    "w9-max3": ["9\n","-1\n","7\n","10\n","3\n","3\n","100\n"],
    "w9-divide": ["7.00 / 2.00 = 3.50\n","Error: cannot divide by zero.\n","-9.00 / 3.00 = -3.00\n","0.00 / 4.00 = 0.00\n","1.00 / 3.00 = 0.33\nError: cannot divide by zero.\n","10.50 / -2.00 = -5.25\n"],
    "w9-is-prime": ["true\n","false\n","false\n","true\n","2 3 5 7 11 13 17 19 23 29 \n","true false\n","false false\n"],
    "w9-count-digits": ["4\n","2\n","1\n","1\n","7\n","1\n","9\n"],
    "w9-by-value": ["Before: 5\nInside: 10\nAfter: 5\n","Before: -3\nInside: -6\nAfter: -3\n","Inside: 42\n","Inside: 0\nInside: 0\nAfter: 0\n","Inside: 10\nAfter: 4\n"],
    "w9-menu": ["Circle area: 12.57\n","Rectangle area: 13.50\n","Triangle area: 25.00\n","Invalid choice.\n","Circle area: 0.00\n","Triangle area: 7.50\n","Rectangle area: 0.25\n"]
  };
  window.PROBLEM_EXPECTED = window.PROBLEM_EXPECTED || {};
  for (var id in EXP) window.PROBLEM_EXPECTED[id] = EXP[id];
})();
