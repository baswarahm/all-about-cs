// Code runner. Everyone uses the same engine: real g++ (GCC 13) on godbolt.org (Compiler Explorer).
// Only when godbolt.org cannot be reached at all (offline) does it fall back to the
// JSCPP interpreter bundled in vendor/, which is a simplified C++.
// run() resolves to { ok, stdout, stderr, compileOutput, exitCode, timedOut, offline }.
(function () {
  var GODBOLT_URL = 'https://godbolt.org/api/compiler/g132/compile';   // x86-64 gcc 13.2

  // g++ colours its messages with ANSI escape codes; remove them.
  function stripAnsi(s) { return String(s || '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, ''); }
  function textOf(arr) { return (arr || []).map(function (x) { return stripAnsi(x.text); }).join('\n'); }

  function tidyCompilerOutput(s) {
    return s.replace(/<source>/g, 'main.cpp')
      .split('\n').filter(function (l) { return !/^Compiler returned:|^Execution build compiler returned:/.test(l); })
      .join('\n').trim();
  }

  function postGodbolt(source, stdin) {
    var body = {
      source: source,
      options: {
        userArguments: '-std=c++17 -O0 -fdiagnostics-color=never',
        executeParameters: { args: [], stdin: stdin || '' },
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
        tools: [], libraries: [],
      },
      lang: 'c++',
      allowStoreCodeDebug: false,
    };
    return fetch(GODBOLT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    }).then(function (r) {
      if (!r.ok) { var e = new Error('server replied HTTP ' + r.status); e.status = r.status; throw e; }
      return r.json();
    });
  }

  function runGodbolt(source, stdin) {
    return postGodbolt(source, stdin).catch(function (err) {
      // busy server: wait a moment and try once more
      if (err.status === 429 || err.status >= 500) {
        return new Promise(function (res) { setTimeout(res, 1500); }).then(function () { return postGodbolt(source, stdin); });
      }
      throw err;
    }).then(function (j) {
      var build = j.buildResult || {};
      var compileOutput = tidyCompilerOutput(textOf(build.stderr));
      if (build.code !== undefined && build.code !== 0) {
        return { ok: false, compileOutput: compileOutput || 'Compilation failed.' };
      }
      var out = textOf(j.stdout);
      if ((j.stdout || []).length) out += '\n';
      return {
        ok: true, stdout: out, stderr: textOf(j.stderr), exitCode: j.code,
        timedOut: !!j.timedOut || /timed? ?out|killed/i.test(textOf(j.stderr)) && j.code !== 0,
        compileOutput: compileOutput,
      };
    });
  }

  // ---- offline fallback (JSCPP) ----------------------------------------
  // JSCPP lacks static_cast<T>(x) and big LL literals, so rewrite them first.
  function preprocessForJscpp(src) {
    var out = '', i = 0, key = 'static_cast<';
    while (i < src.length) {
      var k = src.indexOf(key, i);
      if (k < 0) { out += src.slice(i); break; }
      out += src.slice(i, k);
      var close = src.indexOf('>', k + key.length);
      var type = src.slice(k + key.length, close).trim();
      var j = close + 1;
      while (src[j] === ' ') j++;
      if (src[j] !== '(') { out += key; i = k + key.length; continue; }
      var depth = 0, e = j;
      for (; e < src.length; e++) {
        if (src[e] === '(') depth++;
        else if (src[e] === ')' && --depth === 0) break;
      }
      out += '((' + type + ')(' + preprocessForJscpp(src.slice(j + 1, e)) + '))';
      i = e + 1;
    }
    // literals above the int range overflow in JSCPP: split into (long long)hi * 1000000 + lo
    return out.replace(/\b(\d+)(?:LL|ll|L|l)?\b/g, function (m, digits) {
      if (digits.length < 10 || Number(digits) <= 2147483647) return digits;
      return '((long long)' + digits.slice(0, -6) + ' * 1000000 + ' + Number(digits.slice(-6)) + ')';
    });
  }

  function runOffline(source, stdin) {
    return new Promise(function (resolve) {
      if (!window.JSCPP) { resolve({ ok: false, compileOutput: 'No internet connection, and the offline runner failed to load.' }); return; }
      var out = '';
      try {
        window.JSCPP.run(preprocessForJscpp(source), stdin || '', {
          stdio: { write: function (s) { out += s; } },
          maxTimeout: 4000,
        });
        resolve({ ok: true, stdout: out });
      } catch (e) {
        var msg = String(e && e.message || e);
        if (/Time limit/i.test(msg)) resolve({ ok: true, stdout: out, timedOut: true });
        else if (/Parsing Failure|cannot find library|not defined|no member|is not/i.test(msg) && !out) resolve({ ok: false, compileOutput: msg });
        else resolve({ ok: true, stdout: out, stderr: msg, runtimeError: true });
      }
    });
  }

  function run(source, stdin) {
    return runGodbolt(source, stdin).catch(function (err) {
      return runOffline(source, stdin).then(function (r) {
        r.offline = true;
        r.note = 'Could not reach the online compiler (' + err.message + '), so a simplified offline interpreter was used. Results may differ from real g++.';
        return r;
      });
    });
  }

  window.Runner = { run: run, preprocessForJscpp: preprocessForJscpp, stripAnsi: stripAnsi };
})();
