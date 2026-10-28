// Builds the full C++ program for a problem + test case + student answer.
// Shared by the problem page and the runner.
window.buildSource = function (problem, test, answer) {
  var body = String(answer || '').replace(/\r\n/g, '\n').split('\n')
    .map(function (l) { return l.length ? '    ' + l : l; }).join('\n');
  return problem.template
    .replace('{{VARS}}', function () { return test.vars || ''; })
    .replace('{{ANSWER}}', function () { return body; });
};

// CodeRunner-style comparison: ignore \r, trailing spaces on each line and trailing blank lines.
window.normalizeOutput = function (s) {
  return String(s || '').replace(/\r\n?/g, '\n').split('\n')
    .map(function (l) { return l.replace(/[ \t]+$/, ''); }).join('\n').replace(/\n+$/, '');
};
