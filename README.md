# CS Courses: Year 1 Semester 1

One website with revision material for every course this semester. Made by [@baswara.hm](https://www.instagram.com/baswara.hm/).

| Course | Folder |
|---|---|
| CCA102 / CST131 Computer Organisation | [`computer-organisation/`](computer-organisation/) |
| CKC111 Discrete Structures | [`discrete-structures/`](discrete-structures/) |
| CCA101 / CPT111 Principles of Programming | [`principles-of-programming/`](principles-of-programming/) |

`index.html` at the root is the CS Courses home page that links to all three.

It is a static site (plain HTML, CSS and JavaScript, no build step).

## Lecturer material stays private

Each course has a `private/` folder with the lecturer's slides, tutorials and labs. `.gitignore` keeps every `private/` folder off GitHub, so the files are only on the owner's computer. On the website, links to these files show a short message instead.

## Run it locally

```bash
python -m http.server 8130
```

Then open http://localhost:8130.

## Publish on GitHub Pages

Repository **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`.
The site appears at `https://<username>.github.io/<repo>/`.
