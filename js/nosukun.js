/* nosukun.js — display rules for every child-facing Arabic string (safety net; the sources are fixed too).
   1. TEXT v8 · owner GLOBAL TEXT RULE (OWNER_R3 2026-10-06, binding): «لا تقم بوضع علامة السكون في آخر الكلمات» — U+0652 is removed
      only from a word's LAST letter (internal sukun stays: «مُشْطْ» → «مُشْط»). Kept on purpose: «مْ» (E05 closed-lip demo) and the
      closed first syllables «مَكْ مِفْ تِمْ تِبْ بَكْ» + the tile «وْ» (their sukun is word-internal).
   2. SCI-1 (scientific team 2026-10-07, binding) — same rules as /home/claude/web/tashkeel.py:
      · full tashkeel: the short vowel before a madd letter (مَا مِي مُو، فِي، إِلَى، هَذَا، صُورَة) and the sukun on the lām of a
        moon-letter article (الْقَلَمُ، بِالْمُشْطِ، لِلْمِيمِ); lām + hamzat-wasl → «الِاخْتِيار». Only vowelled text is touched
        (teacher text without marks is left as written).
      · wording: «اِسْمَعْ» → «اِسْتَمِعْ»; the verb «اِلْمِسْ» → «حَدِّدْ» (before «حَرْفَ / المِيمَ») or «اِخْتَرْ»; «مُهِمَّة» → «مَهَمَّة»;
        «تَحَقَّقْ مِنْ تَقَدُّمي» → «اِخْتَبِرْ نَفْسَكَ»; «قَصيرٌ / طَويلٌ» (alone) → «حَرَكَةٌ قَصيرَةٌ / حَرَكَةٌ طَويلَةٌ».
      · no «!» in vowelled Arabic text (→ «.» / «،»).
   BQ_NS(s) returns the display form of a string. A MutationObserver applies it to text nodes and aria-label/title/alt as they
   enter the page; a word split over inline elements (<b>م</b> inside a word) is completed as ONE word (marks go to the node that
   holds their letter). Opt-out: [data-keep-sukun] (keeps everything as written). Display only — never audio ids / TTS. */
(function () {
  'use strict';
  var SUK = 'ْ', FAT = 'َ', DAM = 'ُ', KAS = 'ِ', SHD = 'ّ', ZWJ = '‍';
  var MARKS = /[ً-ٰٕ]/;
  var VOWEL = /[ً-ْٰ]/;
  var LETTER = /[ء-غف-يٱ]/;
  var TOK = /[ء-غف-ٰٕٱـ‍]+/g;
  var SUN = 'تثدذرزسشصضطظلن';
  var KEEP = { 'مَكْ': 1, 'مِفْ': 1, 'تِمْ': 1, 'تِبْ': 1, 'بَكْ': 1, 'مْ': 1, 'وْ': 1 };
  var NOFIX = { 'اللهُ': 1, 'اللهِ': 1, 'اللهَ': 1, 'الله': 1 };
  var SYLW = { 'ما': 'مَا', 'مي': 'مِي', 'مو': 'مُو', 'با': 'بَا', 'بو': 'بُو', 'بي': 'بِي', 'فا': 'فَا', 'فو': 'فُو', 'نا': 'نَا', 'نو': 'نُو', 'باب': 'بَاب', 'فيل': 'فِيل' };
  var SYL = /^[\s\u2026.,،:؛()\-\u2013\u2014/مايوبفنل\u064e\u064f\u0650]*$/;

  function parse(w) { // [[letter, marks(+ZWJ)]], leading ZWJ kept in pre
    var out = [], pre = '';
    for (var i = 0; i < w.length; i++) {
      var c = w.charAt(i);
      if (c === ZWJ || MARKS.test(c)) { if (out.length) out[out.length - 1][1] += c; else pre += c; }
      else out.push([c, '']);
    }
    return { pre: pre, p: out };
  }
  function core(m) { return m.replace(/‍/g, ''); }
  function setm(p, k, v) { var z = p[k][1].indexOf(ZWJ) >= 0; p[k][1] = v + (z ? ZWJ : ''); }
  function art(p) {
    var L = p.map(function (x) { return x[0]; }), n = L.length;
    for (var j = 0; j <= 2; j++) {
      var ok = true;
      for (var k = 0; k < j; k++) if ('وفبكل'.indexOf(L[k]) < 0) ok = false;
      if (ok && n > j + 2 && L[j] === 'ا' && L[j + 1] === 'ل' && !core(p[j][1])) return j + 1;
    }
    if (n > 2 && L[0] === 'ل' && L[1] === 'ل' && core(p[0][1]).indexOf(KAS) >= 0) return 1;
    if (n > 3 && 'وف'.indexOf(L[0]) >= 0 && L[1] === 'ل' && L[2] === 'ل' && core(p[1][1]).indexOf(KAS) >= 0) return 2;
    return -1;
  }
  function fixWord(w) {
    var c0 = w.replace(/‍/g, '');
    if (KEEP[c0] || NOFIX[c0] || w.indexOf('ـ') >= 0) return w;
    var r = parse(w), p = r.p, n = p.length;
    if (n < 2) return w;
    var a = art(p);
    if (a >= 0 && a + 1 < n && p[a + 1][0] === 'ا' && (core(p[a][1]) === '' || core(p[a][1]) === SUK)) { setm(p, a, KAS); setm(p, a + 1, ''); }
    else if (a >= 0 && !core(p[a][1]) && a + 1 < n && SUN.indexOf(p[a + 1][0]) < 0) setm(p, a, SUK);
    for (var k = 1; k < n; k++) {
      var c = p[k][0], m = core(p[k][1]);
      if (m) continue;
      var pc = p[k - 1][0], pm = core(p[k - 1][1]);
      if (pm === SHD) {
        var v = { 'ا': FAT, 'ى': FAT, 'ي': KAS, 'و': DAM }[c];
        if (v && !(c === 'ا' && k === n - 1 && pc === 'و')) setm(p, k - 1, v + SHD);
        continue;
      }
      if (c === 'ا') {
        if (a >= 0 && k === a - 1) continue;
        if (k === n - 1 && pc === 'و') continue;
        if (!pm && pc !== 'ا' && pc !== 'ى') setm(p, k - 1, FAT);
      } else if (c === 'ى') { if (!pm) setm(p, k - 1, FAT); }
      else if (c === 'ي' || c === 'و') { if (!pm && pc !== 'ا') setm(p, k - 1, c === 'ي' ? KAS : DAM); }
    }
    var last = p[n - 1], lm = core(last[1]);
    if (lm.indexOf(SUK) >= 0 && !KEEP[c0]) last[1] = last[1].replace(SUK, '');
    return r.pre + p.map(function (x) { return x[0] + x[1]; }).join('');
  }
  function density(s) {
    var l = 0, m = 0;
    for (var i = 0; i < s.length; i++) { var c = s.charAt(i); if (LETTER.test(c)) l++; else if (VOWEL.test(c) || c === SHD) m++; }
    return l ? m / l : 0;
  }
  // nosuk only (the v8 rule) — kept for any caller that wants the old behaviour
  function nosuk(s) {
    return (typeof s === 'string' && s.indexOf(SUK) >= 0) ? s.replace(TOK, function (t) {
      var c0 = t.replace(/‍/g, '');
      if (KEEP[c0] || c0.charAt(c0.length - 1) === 'ـ') return t;
      return t.replace(/ْ(?=[ً-ٰ]*‍?$)/, '');
    }) : s;
  }
  function tash(s) { // tashkeel completion + final-sukun removal (same length class: marks only)
    if (typeof s !== 'string' || !LETTER.test(s)) return s;
    if (SYL.test(s)) s = s.replace(/(^|[^\u0621-\u0652])(باب|فيل|ما|مي|مو|با|بو|بي|فا|فو|نا|نو)(?![\u0621-\u0652])/g, function (m0, b, w) { return b + SYLW[w]; });
    var dn = density(s), ws = s.match(TOK) || [];
    var all = dn >= 0.4 || (ws.length > 0 && ws.length <= 3 && ws.every(function (w) { return /[\u064b-\u0650\u0652]/.test(w); })); // short labels «مانْجو»
    return s.replace(TOK, function (w) {
      if (!all && density(w) < 0.5) return (dn >= 0.1 && SYLW[w]) ? SYLW[w] : w; // teacher text: only clearly vowelled words
      return fixWord(w);
    });
  }
  // wording (SCI-1) — per string, before tashkeel
  var WORD = [
    [/مُهِمَّ/g, 'مَهَمَّ'],
    [/تَحَقَّقْ?\s+مِنْ?\s+تَقَدُّمي/g, 'اِخْتَبِرْ نَفْسَكَ'], [/تحقّق من تقدّمي|تحقق من تقدمي/g, 'اختبر نفسك'],
    [/اسمع واكتشف/g, 'استمع واكتشف'], [/اسمع وميّز|اسمع وميز/g, 'استمع وميّز'],
    [/(اِ|ا)سْمَعِ\s+ال(كَ|ْكَ)لِمَةَ/g, 'اِسْتَمِعْ إِلَى الْكَلِمَةِ'], [/(اِ|ا)سْمَعِ\s+الصَّوْتَ/g, 'اِسْتَمِعْ إِلَى الصَّوْتِ'],
    [/(اِ|ا)سْمَعِ\s+ال(أَ|ْأَ)صْواتَ/g, 'اِسْتَمِعْ إِلَى الْأَصْوَاتِ'], [/(اِ|ا)سْمَعِ\s+ال(كَ|ْكَ)لِمَتَيْنِ/g, 'اِسْتَمِعْ إِلَى الْكَلِمَتَيْنِ'],
    [/(اِ|ا)سْمَعِ\s+ال(فَ|ْفَ)رْقَ/g, 'اِسْتَمِعْ إِلَى الْفَرْقِ'],
    [/(اِ|ا)سْمَعِ(?=\s)/g, '$1سْتَمِعِ'], [/(اِ|ا)سْمَعْ?(?![ء-ي])/g, '$1سْتَمِعْ'],
    [/(^|[\s«(،.:])(وَ|)(?:اِ|ا)لْمِس[ِْ]?\s+(?=ال\u0652?مِيمَ)/g, '$1$2حَدِّدِ '],
    [/(^|[\s«(،.:])(وَ|)(?:اِ|ا)لْمِس[ِْ]?\s+(?=حَرْفَ)/g, '$1$2حَدِّدْ '],
    [/(^|[\s«(،.:])(وَ|)(اِ|ا)لْمِسِ(?=\s)/g, function (m0, b, w, al) { return b + w + (w ? 'ا' : al) + 'خْتَرِ'; }],
    [/(^|[\s«(،.:])(وَ|)(اِ|ا)لْمِسْ?(?![\u0621-\u064a\u064b-\u0652])/g, function (m0, b, w, al) { return b + w + (w ? 'ا' : al) + 'خْتَرْ'; }],
  ];
  var EXACT = { 'قَصيرٌ': 'حَرَكَةٌ قَصِيرَةٌ', 'طَويلٌ': 'حَرَكَةٌ طَوِيلَةٌ', 'قَصيرٌ.': 'حَرَكَةٌ قَصِيرَةٌ.', 'طَويلٌ.': 'حَرَكَةٌ طَوِيلَةٌ.' };
  function words(s) {
    if (typeof s !== 'string' || !LETTER.test(s)) return s;
    var t = s.trim();
    if (EXACT[t]) return s.replace(t, EXACT[t]);
    if (!/سْمَع|لْمِس|مُهِمَّ|تَقَدُّمي|تقدّمي|تقدمي|اسمع/.test(s)) return s;
    for (var i = 0; i < WORD.length; i++) s = s.replace(WORD[i][0], WORD[i][1]);
    return s;
  }
  function excl(s) { // «!» → «.» / «،» in vowelled Arabic text (same length: one char for one char)
    if (s.indexOf('!') < 0 || !LETTER.test(s) || /[<{};=]/.test(s)) return s;
    return s.replace(/!(?=\s*$)/, '.').replace(/!(?=\s*[؟.…])/g, '‌').replace(/!/g, '.').replace(/‌/g, '');
  }
  function ns(s) { return (typeof s === 'string' && LETTER.test(s)) ? tash(excl(words(s))) : s; }
  window.BQ_NS = ns;
  window.BQ_NS.nosuk = nosuk; window.BQ_NS.tash = tash;

  // ---------- DOM ----------
  // a word split over formatting elements (<b>م</b>, letter spans, .x7-w words) is completed as ONE word; other inline boxes
  // (<small> label + name in a button, chips) stay separate texts so two words are never glued together
  var INL = { B: 1, I: 1, EM: 1, STRONG: 1, MARK: 1, U: 1 };
  function inline(e) {
    if (!e) return false;
    if (!INL[e.tagName] && !(e.tagName === 'SPAN' && ((e.textContent || '').length <= 3 || (e.classList && (e.classList.contains('x7-w') || e.classList.contains('x7-suk')))))) return false;
    try { var d = getComputedStyle(e).display; return d === 'inline' || d === 'contents'; } catch (x) { return true; }
  }
  function rootOf(n) { var e = n.parentElement; while (e && inline(e) && e.parentElement) e = e.parentElement; return e; }
  function skipEl(e) { return !e || !!(e.closest && e.closest('[data-keep-sukun],script,style,textarea,input,[contenteditable="true"],svg text')); }
  function textsOf(root) {
    var out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) if (n.nodeValue && !skipEl(n.parentElement) && rootOf(n) === root) out.push(n);
    return out;
  }
  function fixRoot(root) {
    if (!root || skipEl(root)) return;
    var tn = textsOf(root);
    if (!tn.length) return;
    // 1) wording + «!» per node (whole words live in one node)
    for (var i = 0; i < tn.length; i++) {
      var v = tn[i].nodeValue; if (!LETTER.test(v)) continue;
      var v2 = excl(words(v)); if (v2 !== v) tn[i].nodeValue = v2;
    }
    // 2) tashkeel on the joined text, marks mapped back to the node of their letter
    var vals = tn.map(function (x) { return x.nodeValue; }), joined = vals.join('');
    if (!LETTER.test(joined)) return;
    var fixed = tash(joined);
    if (fixed === joined) return;
    var outs = vals.map(function () { return ''; }), ni = 0, off = 0, j = 0, lastNode = 0;
    for (var g = 0; g < joined.length; g++) {
      while (ni < vals.length && off >= vals[ni].length) { ni++; off = 0; }
      var ch = joined.charAt(g);
      while (j < fixed.length && fixed.charAt(j) !== ch && MARKS.test(fixed.charAt(j))) { outs[lastNode] += fixed.charAt(j); j++; } // inserted marks
      if (j < fixed.length && fixed.charAt(j) === ch) { outs[ni] += ch; j++; if (!MARKS.test(ch)) lastNode = ni; }
      else if (MARKS.test(ch)) { /* removed mark */ }
      else { outs[ni] += ch; } // should not happen (only marks change)
      off++;
    }
    while (j < fixed.length) { outs[lastNode] += fixed.charAt(j); j++; }
    for (var q = 0; q < tn.length; q++) if (outs[q] !== vals[q]) tn[q].nodeValue = outs[q];
  }
  var ATTR = ['aria-label', 'title', 'alt'];
  function fixAttr(e) {
    if (!e.getAttribute || (e.closest && e.closest('[data-keep-sukun]'))) return;
    for (var i = 0; i < ATTR.length; i++) { var v = e.getAttribute(ATTR[i]); if (v && LETTER.test(v)) { var w2 = ns(v); if (w2 !== v) e.setAttribute(ATTR[i], w2); } }
  }
  var pending = null, roots = new Set(), attrs = new Set();
  function flush() {
    pending = null;
    var rs = Array.from(roots), as = Array.from(attrs); roots.clear(); attrs.clear();
    for (var i = 0; i < rs.length; i++) { try { if (rs[i].isConnected) fixRoot(rs[i]); } catch (x) { /* never break the page */ } }
    for (var k = 0; k < as.length; k++) { try { fixAttr(as[k]); } catch (x) { } }
  }
  function queue() { if (!pending) { pending = true; Promise.resolve().then(flush); } }
  function addText(n) { if (n.nodeValue && LETTER.test(n.nodeValue)) { var r = rootOf(n); if (r) roots.add(r); } }
  function addTree(root) {
    if (root.nodeType === 3) { addText(root); return; }
    if (root.nodeType !== 1) return;
    attrs.add(root); if (root.querySelectorAll) { var es = root.querySelectorAll('[aria-label],[title],[alt]'); for (var k = 0; k < es.length; k++) attrs.add(es[k]); }
    if (!root.textContent || !LETTER.test(root.textContent)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) addText(n);
  }
  function start() {
    if (!document.body || !window.MutationObserver) return;
    addTree(document.body); flush();
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === 'characterData') addText(m.target);
        else if (m.type === 'attributes') attrs.add(m.target);
        else for (var j = 0; j < m.addedNodes.length; j++) addTree(m.addedNodes[j]);
      }
      queue();
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
