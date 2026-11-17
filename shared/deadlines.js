/* shared/deadlines.js — tests, assessments and coursework from the three course planners (Sem 1 2026/27).
   Edit the list when a lecturer gives an exact date. Times are Malaysia time (+08:00).
   exact: false = the planner gives only the week, so the date shown is that week's Monday–Sunday.
   The main page shows them in <section id="soon">; an item disappears once its end has passed. */
(function () {
  var W = function (n) {   // planner week n: Week 8 (mid-semester break) starts Mon 16 Nov 2026
    var start = new Date(Date.UTC(2026, 10, 16 + (n - 8) * 7) - 8 * 36e5);
    return { start: start, end: new Date(start.getTime() + 7 * 864e5 - 1) };
  };
  function at(s) { return new Date(s + '+08:00'); }
  var L = [
    { c: 'all', kind: 'Break', t: 'Mid-semester break', d: 'No classes. Good time to catch up on Weeks 1–7.', start: W(8).start, end: W(8).end, exact: true },
    { c: 'co', kind: 'Released', t: 'CO Assignment 2 released', d: 'Week 10 · due Week 14', start: W(10).start, end: W(10).end },
    { c: 'ds', kind: 'Released', t: 'Discrete Tutorial CW#2 released', d: 'Week 10 · topics up to Week 12 · worth 5%', start: W(10).start, end: W(10).end },
    { c: 'pop', kind: 'Due', t: 'Report-based Programming Assessment due', d: 'Sun 13 Dec 2026 · worth 8% · late work not accepted without approval', start: at('2026-12-13T23:59:00'), end: at('2026-12-13T23:59:00'), exact: true },
    { c: 'ds', kind: 'Due', t: 'Discrete Tutorial CW#2 due', d: 'Week 13', start: W(13).start, end: W(13).end },
    { c: 'pop', kind: 'Test', t: 'Programming Test 2', d: 'Wed 30 Dec 2026 · functions, arrays, pointers · 10%', start: at('2026-12-30T00:00:00'), end: at('2026-12-30T23:59:00'), exact: true },
    { c: 'ds', kind: 'Test', t: 'Discrete Test 2', d: 'Week 14 · topics 9–13 (sets to counting) · 15%', start: W(14).start, end: W(14).end },
    { c: 'co', kind: 'Due', t: 'CO Assignment 2 due', d: 'Week 14', start: W(14).start, end: W(14).end },
    { c: 'pop', kind: 'Test', t: 'Timed Programming Assessment 2', d: 'Wed 6 Jan 2027 · functions and arrays · Lockdown Browser', start: at('2027-01-06T00:00:00'), end: at('2027-01-06T23:59:00'), exact: true },
    { c: 'co', kind: 'Test', t: 'CO Test 2', d: 'Week 15 · CPU, control unit, I/O, memory, cache, virtual memory · 10%', start: W(15).start, end: W(15).end },
    { c: 'all', kind: 'Exam', t: 'Revision week, then final exams', d: 'Revision Week 16 · finals Weeks 17–19 (dates TBA)', start: W(16).start, end: W(19).end }
  ];
  window.CS_DEADLINES = L;

  var box = document.getElementById('soon');
  if (!box) return;
  var NAMES = { co: 'CO', ds: 'Discrete', pop: 'Programming', all: 'All courses' };
  var LINK = { co: 'computer-organisation/', ds: 'discrete-structures/', pop: 'principles-of-programming/' };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function myt(d) { return new Date(d.getTime() + 8 * 36e5); }   // read the date in Malaysia time
  function day(d) { var m = myt(d); return m.getUTCDate() + ' ' + MON[m.getUTCMonth()]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render() {
    var now = Date.now(), all = box.classList.contains('all');
    var list = L.filter(function (x) { return x.end.getTime() >= now; });
    var shown = all ? list : list.slice(0, 5);
    box.innerHTML = '<div class="soon-head"><h2>📅 Coming up</h2><span>From the course planners</span></div>' +
      (list.length ? '<ol class="soon-list">' + shown.map(function (x) {
        var days = Math.ceil((x.start.getTime() - now) / 864e5), live = x.start.getTime() <= now;
        var when = live ? (x.kind === 'Break' || x.kind === 'Released' || !x.exact ? 'this week' : 'today') :
          days <= 1 ? 'tomorrow' : 'in ' + days + ' days';
        var urgent = !live && days <= 7 && x.kind !== 'Released' && x.kind !== 'Break';
        var date = x.exact ? day(x.start) + (x.end - x.start > 864e5 ? ' – ' + day(x.end) : '') : day(x.start) + ' – ' + day(x.end);
        var tag = LINK[x.c] ? '<a class="soon-c" href="' + LINK[x.c] + '">' + NAMES[x.c] + '</a>' : '<span class="soon-c">' + NAMES[x.c] + '</span>';
        return '<li class="soon-' + x.c + (urgent || (live && x.kind !== 'Break' && x.kind !== 'Released') ? ' urgent' : '') + '">' +
          '<span class="soon-k k-' + x.kind.toLowerCase() + '">' + x.kind + '</span>' +
          '<div class="soon-m"><b>' + esc(x.t) + '</b><span>' + tag + ' · ' + esc(x.d) + '</span></div>' +
          '<div class="soon-w"><b>' + when + '</b><span>' + date + (x.exact ? '' : ' (week)') + '</span></div></li>';
      }).join('') + '</ol>' : '<p>Nothing left this semester. 🎉</p>') +
      (list.length > 5 ? '<button type="button" class="soon-more">' + (all ? 'Show less' : 'Show all ' + list.length) + '</button>' : '');
    var b = box.querySelector('.soon-more');
    if (b) b.onclick = function () { box.classList.toggle('all'); render(); };
  }
  render(); setInterval(render, 6e4);
})();
