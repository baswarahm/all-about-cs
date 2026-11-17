/* shared/theme.js — one light/dark choice for the whole site.
   Load it at the top of <head> on every page (no defer): it applies the saved choice before the page draws,
   then saves every later change (each page's own toggle button changes data-theme on <html>). */
(function () {
  var KEY = 'cs:theme', root = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  var t = get(KEY);
  if (!t) {   // first visit since the change: take the choice from a course page's old key
    var old = [get('hub:theme'), get('co1:theme'), get('cca-theme')];
    for (var i = 0; i < old.length && !t; i++) { var v = (old[i] || '').replace(/"/g, ''); if (v === 'dark' || v === 'light') t = v; }
  }
  if (t === 'dark' || t === 'light') root.setAttribute('data-theme', t);
  new MutationObserver(function () {
    var v = root.getAttribute('data-theme');
    try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {}
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
})();
