# CCA101 Prep

Study site for CCA101 / CPT111 Principles of Programming:

- **Material**: notes condensed from the lecture slides, with runnable examples ("Try it").
- **Test 1 Mock**: Moodle-style quiz (single + "select one or more") with a bank of 141 questions. 30 random questions in 60 minutes, or practice by topic.
- **ProgrAss 1**: 55 CodeRunner-style problems with 10 tests each (extra hidden tests are in `data/tests-more.js`), including a 20-question "Step by step" set (`data/problems-new.js`) that goes from easy to hard across Weeks 2–5. A partial program, computer-generated variables, Precheck / Check, hidden tests (shown in full once you pass), a penalty regime and plain-English hints for compiler errors. Includes a timed mock with 3–6 questions (40 minutes each).
- **Question generator**: endless new CodeRunner questions (10 tests each) from 10 question types (tiered pricing, digit manipulation, ranges, series, nested-loop patterns, classification, unit conversion, sentinel loops, number properties, switch menus). Each question has a shareable code such as `digits-482913`. The mock can use generated questions too.
- **Scratchpad**: run any C++ program with stdin.

To add a question type, add a `family({...})` block in `assets/generator.js`. Its `make(R)` returns the description, template, tests (with `expected` computed in JS) and the C++ model answer.

It is a static site (plain HTML/JS, no build step).

## Where the C++ code runs

Everyone uses the same engine: real **g++ 13** on [Compiler Explorer](https://godbolt.org). Code is sent to godbolt.org when you press Run / Precheck / Check, so an internet connection is needed.

Only if godbolt.org cannot be reached at all does the site fall back to the bundled [JSCPP](https://github.com/felixhao28/JSCPP) interpreter (`vendor/jscpp.bundle.js`), and it says so on screen. JSCPP is a simplified C++ (no `std::string`).

## Publish on GitHub Pages

1. Push the contents of this folder to a GitHub repository (the `index.html` must be at the repo root, or in `/docs`).
2. Repository **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/` after a minute.

## Run it locally

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
```

## Adding content

- **Notes**: `data/material.js`. Replace the `week6` placeholder topic or append a new one. Code inside `<pre class="code">` that has `int main(` gets a "Try it" button. Escape `<` as `&lt;`.
- **Quiz questions**: `data/quiz.js` and `data/quiz-more.js`. `t` = topic id from material.js, `a` = indexes of correct options, `m: true` for "select one or more".
- **Coding problems**: `data/problems.js` and `data/problems-more.js`. The template uses `{{VARS}}` (per-test variables) and `{{ANSWER}}` (student code).
  Then add the expected output of every test to `data/expected.js` under the problem id, in the same order as `tests`.
  An easy way to get it: paste the full program (template + model answer) into the Playground, run it, and copy the output.
