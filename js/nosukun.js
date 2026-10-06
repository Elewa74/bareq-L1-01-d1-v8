/* nosukun.js — TEXT v8 · owner GLOBAL TEXT RULE (OWNER_R3 2026-10-06, binding): «لا تقم بوضع علامة السكون في آخر الكلمات».
   BQ_NS(s) removes U+0652 only when it sits on a word's LAST letter (internal sukun stays: «مُشْطْ» → «مُشْط», «نُمورْ» → «نُمور»).
   Kept on purpose (same list as /home/claude/web/nosukun.py): a lone letter+sukun sound symbol «مْ» (E05 closed-lip /m/ demo) and the
   closed first syllables shown as chips «مَكْ مِفْ تِمْ تِبْ بَكْ» (their sukun is word-internal). Display only — never audio ids / TTS.
   The sources are already clean (build_data_v7.py, LINES_v7.json, js/el7, games/g9); this file is a safety net for any text that is
   added later: a MutationObserver cleans text nodes (and aria-label/title/alt) as they enter the page (skip a subtree with data-keep-sukun). */
(function () {
  'use strict';
  var SUK = 'ْ';
  var TOK = /[ء-غف-يٱ-ۓً-ٰٟـ‍]+/g;
  var MK = /[ً-ٰٟـ]/g;
  var KEEP = { 'مَكْ': 1, 'مِفْ': 1, 'تِمْ': 1, 'تِبْ': 1, 'بَكْ': 1, 'مْ': 1, 'وْ': 1 }; // وْ = middle-letter tile of مَوْز (E08 analysis)
  var FIN = /ْ(?=[ً-ٰٟ]*‍?$)/;
  function tok(t) {
    var core = t.replace(/‍/g, '');
    if (KEEP[core] || core.charAt(core.length - 1) === 'ـ') return t;
    return t.replace(FIN, '');
  }
  function ns(s) { return (typeof s === 'string' && s.indexOf(SUK) >= 0) ? s.replace(TOK, tok) : s; }
  window.BQ_NS = ns;

  function skip(n) { var e = n.parentElement; return !e || !!(e.closest && e.closest('[data-keep-sukun],script,style,textarea,[contenteditable="true"]')); }
  function fixText(n) { if (n.nodeValue && n.nodeValue.indexOf(SUK) >= 0 && !skip(n)) { var v = ns(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; } }
  var ATTR = ['aria-label', 'title', 'alt'];
  function fixAttr(e) { for (var i = 0; i < ATTR.length; i++) { var v = e.getAttribute(ATTR[i]); if (v && v.indexOf(SUK) >= 0 && !(e.closest && e.closest('[data-keep-sukun]'))) { var w2 = ns(v); if (w2 !== v) e.setAttribute(ATTR[i], w2); } } }
  function walk(root) {
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1) return;
    fixAttr(root); if (root.querySelectorAll) { var es = root.querySelectorAll('[aria-label],[title],[alt]'); for (var k = 0; k < es.length; k++) fixAttr(es[k]); }
    if (!root.textContent || root.textContent.indexOf(SUK) < 0) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) fixText(n);
  }
  function start() {
    if (!document.body || !window.MutationObserver) return;
    walk(document.body);
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === 'characterData') fixText(m.target);
        else if (m.type === 'attributes') fixAttr(m.target);
        else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
