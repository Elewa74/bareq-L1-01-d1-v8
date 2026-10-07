/* fb.js — FB-1 (2026-10-07) · ONE shared feedback mechanism for every interactive element and game (OWNER_R3 GLOBAL, binding).
   OWNER: «لا أعلم إذا جاوبت خطأ أو صح … لمّا بجاوب صح بيقولي شكراً … لو غلط علامة حمرا وجملة تحفيزية … لو مرتين غلط يحلّ هو ويقولي أكمل وركّز …
          النجوم بتزيد وأنا بجاوب غلط» + «على أن تراعي التعديلات والملاحظات دي في باقي العناصر».
   THE LADDER (same everywhere):
     ✓      the child's answer is right → clear GREEN mark (ring + check) on the chosen item + a VARIED praise sentence from BQ.fb.yes()
            (never «شُكْرًا», never the same line twice in a row).
     ✗1     first wrong answer → clear RED mark (ring + ✗) on the chosen item (it stays marked, cannot be chosen again) + a motivating
            retry line from BQ.fb.tryL(); the child tries again. If only ONE live choice is left after ✗1, there is no real choice any more
            → Bariq solves at once (✗2 rule; no star).
     ✗2     second wrong answer → Bariq solves: the right item turns green and its model is heard + an encouraging line from BQ.fb.solveL()
            («… أَكْمِلْ وَرَكِّزْ»).
   STAR / PROGRESS RULE (same everywhere): a star (or a filled progress mark) is earned ONLY by the child's own right answer, on the
     1st or the 2nd try (BQ.fb.credit). Bariq-solved items earn NO star: their slot shows the «helped» state (`is-help`: empty star,
     dimmed). Wrong answers never add a star and never get praise. A stage/round star (E14) is gold only when the child placed every
     piece of that stage himself; otherwise it is «helped». Mastery records are unchanged (first-try correctness, per element).
   No answer is ever pre-coloured, glowed or highlighted before the child answers.
   All lines: approved Bariq voice (BRQ), eleven_v4, −17 LUFS · texts are DRAFTS for owner review (LINES_v7.json «use»). */
(function () {
  'use strict';
  const BQ = (window.BQ = window.BQ || {});
  const has = (id) => { try { return !BQ.hasAudio || BQ.hasAudio(id); } catch (e) { return true; } };
  const POOL = {
    // ✓ praise: sentences (owner) — the bare «نَعَم، هَذا هُوَ» (G_yes1) is a confirmation, not praise → not in the pool
    yes: ['bq7_FB_yes1', 'bq7_E11_fb_yes1', 'bq7_FB_yes2', 'bq7_E11_fb_yes2', 'bq7_FB_yes3', 'bq7_E11_fb_yes3', 'bq7_FB_yes4',
      'bq7_E11_fb_yes5', 'bq7_FB_yes5', 'bq7_E11_fb_yes4', 'bq7_G_yes2', 'bq7_G_yes4'],
    /* FIX12 D-07: ✗1 must say «حَاوِلْ مَرَّةً أُخْرَى» → only the lines that do. Removed (off-rule): E11_fb_try2 «لَا بَأْسَ، جَرِّب مِن جَدِيدٍ»,
       FB_try2 «… فَكِّر وَجَرِّب مَرَّةً أُخْرَى» (جَرِّب), FB_try1 «أَنْتَ قَرِيبٌ، …» (misleading for an unrelated pick, R11 C-12). */
    try: ['bq7_E11_fb_try1', 'bq7_E11_fb_try3'],
    /* ✗2 = Bariq solved + encouraging line. Removed: E11_fb_solve3 «اُنْظُر جَيِّدًا. أَنْتَ تَسْتَطِيعُ» (does not close a solved item, R11 D-07). */
    solve: ['bq7_E11_fb_solve1', 'bq7_FB_solve1', 'bq7_E11_fb_solve2'],
  };
  /* rotation: shuffled once per page, walks the whole pool before any line comes back, never the same line twice in a row */
  const rot = (k) => {
    let order = [], i = 0, last = null;
    const refill = () => { order = POOL[k].filter(has); if (!order.length) order = POOL[k].slice(); for (let j = order.length - 1; j > 0; j--) { const r = Math.floor(Math.random() * (j + 1)); [order[j], order[r]] = [order[r], order[j]]; } if (order.length > 1 && order[0] === last) order.push(order.shift()); i = 0; };
    return () => { if (i >= order.length) refill(); const id = order[i++]; last = id; log(k, id); return id; };
  };
  const QA = () => !!window.BQ_QA;
  function log(ev, id, extra) { if (!QA()) return; (window.__fb = window.__fb || []).push(Object.assign({ ev, id, t: Date.now() }, extra || {})); }

  const MARK_OK = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#22C27A" stroke="#fff" stroke-width="4"/><path d="M13 25l8 8 15-17" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const MARK_NO = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#E53935" stroke="#fff" stroke-width="4"/><path d="M16 16l16 16M32 16 16 32" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>';
  const CSS = `
/* owner «علامة حمراء»: the v8 «wrong» token was a soft orange → clear red everywhere (same specificity as theme8.css, loaded after it) */
html:root[data-theme="8"] { --bq8-no: #E53935; }
.fb-ok { outline: 6px solid #22C27A !important; outline-offset: 3px; box-shadow: 0 0 0 3px #fff, 0 0 26px rgba(34,194,122,.7) !important; }
.fb-no { outline: 6px solid #E53935 !important; outline-offset: 3px; }
.fb-no.fb-stay { opacity: .82; }
.fb-badge { position: absolute; z-index: 6; top: 4px; inset-inline-start: 4px; width: clamp(30px, 3.6vmin, 46px); height: clamp(30px, 3.6vmin, 46px); pointer-events: none; animation: fbPop .4s cubic-bezier(.3,1.6,.5,1) both; }
.fb-badge svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 2px 3px rgba(0,0,0,.25)); }
@keyframes fbPop { from { transform: scale(.2); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes fbShake { 0%,100% { translate: 0; } 20% { translate: -7px; } 40% { translate: 7px; } 60% { translate: -5px; } 80% { translate: 4px; } }
.fb-shake { animation: fbShake .45s ease-in-out; }
/* jigsaw pieces / slots are drawn by an SVG background: the red / green mark follows their real outline (no rectangle) */
.bq8-piece.fb-no { outline: none !important; filter: drop-shadow(4px 0 0 #E53935) drop-shadow(-4px 0 0 #E53935) drop-shadow(0 4px 0 #E53935) drop-shadow(0 -4px 0 #E53935); }
.bq8-piece.fb-ok { outline: none !important; box-shadow: none !important; filter: drop-shadow(4px 0 0 #22C27A) drop-shadow(-4px 0 0 #22C27A) drop-shadow(0 4px 0 #22C27A) drop-shadow(0 -4px 0 #22C27A); }
.bq8-star.is-help { background-image: url(assets/icons8/star_empty.svg); opacity: .45; }
@media (prefers-reduced-motion: reduce) { .fb-badge, .fb-shake { animation: none; } }`;
  let styled = false;
  const style = () => { if (styled || !document.head) return; styled = true; const s = document.createElement('style'); s.id = 'st-fb'; s.textContent = CSS; document.head.append(s); };
  const badge = (el, kind) => {
    if (!el || !el.append) return;
    el.querySelectorAll(':scope > .fb-badge').forEach((b) => b.remove());
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const b = document.createElement('span'); b.className = 'fb-badge fb-badge--' + kind; b.setAttribute('aria-hidden', 'true'); b.innerHTML = kind === 'no' ? MARK_NO : MARK_OK;
    el.append(b);
  };

  BQ.fb = {
    POOL,
    yes: rot('yes'), tryL: rot('try'), solveL: rot('solve'),
    /** the star rule: right by the child on try 1 or 2 → true; Bariq solved → false */
    credit(tries, solved) { return !solved && tries >= 1 && tries <= 2; },
    /** live choices (not marked wrong / dimmed) */
    live(opts) { return (opts || []).filter((x) => x && x.classList && !x.classList.contains('is-no') && !x.classList.contains('is-dim') && !x.classList.contains('fb-no')); },
    /** forced-choice rule: after a miss, only one live choice left → Bariq solves now */
    forced(opts) { return BQ.fb.live(opts).length <= 1; },
    /** generic visuals (for elements without their own ✓/✗ marks) */
    markOk(el) { style(); if (!el) return; el.classList.remove('fb-no', 'is-glow', 'is-hint'); el.classList.add('fb-ok'); badge(el, 'ok'); },
    markNo(el, o) {
      style(); if (!el) return; o = o || {};
      el.classList.remove('fb-shake'); void el.offsetWidth; el.classList.add('fb-no', 'fb-shake'); badge(el, 'no');
      if (o.stay === false) setTimeout(() => { el.classList.remove('fb-no', 'fb-shake'); el.querySelectorAll(':scope > .fb-badge--no').forEach((b) => b.remove()); }, o.ms || 1400);
      else el.classList.add('fb-stay');
    },
    clear(el) { if (!el) return; el.classList.remove('fb-ok', 'fb-no', 'fb-stay', 'fb-shake'); el.querySelectorAll(':scope > .fb-badge').forEach((b) => b.remove()); },
    /** star slot of a Bariq-solved item → «helped» (no gold) */
    helpSlot(slot) { style(); if (!slot) return; slot.classList.remove('is-on'); slot.classList.add('is-help'); log('help'); },
    /** QA only: tag a choice right/wrong for automated play-through */
    qa(el, right) { if (QA() && el && el.dataset) el.dataset.fbqa = right ? 'r' : 'w'; },
    log,
    MARK_OK, MARK_NO,
  };
  if (document.head) style(); else document.addEventListener('DOMContentLoaded', style);
})();
