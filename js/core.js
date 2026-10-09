/* core.js — محرّك صفحة الدرس (بارق · L1-01-d1 · v0-8 → v7)
   v7 (PLAN_v7 · PLATFORM · الأساس = النسخة الأولى v0-14b بشكلها وقائمتها وأغلفتها): ١٦ عنصراً E01–E16 من البيانات (build_data_v7.py) ·
   أربعة أنواع: فيديو / تفاعلي / لعبة / طباعة · js/el7/<ID>.js تُحمَّل كسولاً (BQ.loadScript · BQ.ensureDef) وإلا «قيد الإنتاج» ·
   الأصوات media/audio7 ثم media/audio · الصور media/img7 · دليل المعلّم من guide_v7.json · ctx.record → BQ.mastery (mastery.js) ·
   صفحتا المعلّم #plan و#mastery · العقد كاملاً في v7/PLATFORM_status.md.
   الواجهة العامة: window.BQ — تستعملها ملفات العناصر js/el/ELxx.js عبر BQ.register(id, {render(stage, ctx)}).
   عقد v0-8 (تعتمده ملفات العناصر):
   · ctx.alive() · ctx.say(lineId, opt) · ctx.later(fn, ms) · ctx.sleep(ms) · ctx.adult(html) · ctx.adultMeta(html)
   · ctx.instruction(text, lineId?, {icon?}) — للأعمار ٤–٩ بلا «النص المصاحب» يظهر زرّ السمّاعة + أيقونة الوظيفة لا الجملة (قرار ١)
   · BQ.audio.play: مهلة توقّف max(4 ث، 2× المتوقَّع) · BQ.ui.steps(parent, n, {label}) → {el, set(i)}
   · BQ.ui.trace(parent, {glyph, path, ordered, startTol, onDone}) · BQ.ui.endCard(stage, {title, note, line, onReplay, home})
   · BQ.state.age افتراضياً '4-6' · BQ.state.cc افتراضياً false (true لـ١٠–١٢)
   · BQ.AR(n) أرقام عربية-هندية · BQ.doneAt(id) · BQ.hoursSince(id) · BQ.gate.el16() · حدث window 'bq:done'
   لا مكتبات خارجية. */
(function () {
  'use strict';
  const D = window.BQ_DATA;
  const AGES = ['4-6', '7-9', '10-12'];
  const BQ = (window.BQ = { D, defs: {}, state: { current: null, done: new Set(), seqPos: -1, cc: false, age: '4-6', vcc: (() => { try { return sessionStorage.getItem('bq_vcc') !== '0'; } catch (e) { return true; } })() } });
  /* v8 (OWNER_R3 2026-10-06 «CC»): captions live INSIDE the video player only (BQ.state.vcc · default ON · per session, js/video.js).
     BQ.state.cc (spoken-line captions in activity bubbles) is always false — no setting shows/hides anything in activities, and the
     instruction text of an activity is ALWAYS shown (renderInstr). The header «النص المصاحب» button is gone. */

  /* ---------- أدوات عامة ---------- */
  BQ.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  BQ.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  BQ.reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const AR = (BQ.AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]));
  const ageLabel = (a) => AR(String(a).replace('-', '–'));
  BQ.h = function h(tag, props, ...kids) {
    const [t, ...cls] = tag.split('.');
    const el = document.createElement(t || 'div');
    if (cls.length) el.className = cls.join(' ');
    if (props) for (const k in props) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className += (el.className ? ' ' : '') + v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
    return el;
  };
  const h = BQ.h;
  const PFX = 'bq-L1-01-d1-';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(PFX + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch (e) { /* تخزين غير متاح */ } },
    del(k) { try { localStorage.removeItem(PFX + k); } catch (e) { /* */ } },
  };
  BQ.store = store;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const cleanName = (n) => String(n || '').replace(/\s*\(.*\)/, '');

  /* ---------- الأصول ---------- */
  const norm = (id) => String(id).replace(/^L1-01-AS-/, '').replace(/^L1-01_/, '');
  BQ.img = function (id) {
    const k = norm(id);
    if (D.img7 && D.img7[k]) return D.img7[k]; // v7
    if (D.assets[k]) return D.assets[k];
    const info = D.asset_info[k];
    const label = info ? info.purpose : k;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" rx="24" fill="#F1FAFE"/><rect x="8" y="8" width="384" height="284" rx="20" fill="none" stroke="#82C3E8" stroke-width="4" stroke-dasharray="14 10"/><text x="200" y="150" font-family="sans-serif" font-size="22" fill="#00345B" text-anchor="middle">${label.replace(/[<&]/g, '')}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };
  BQ.hasImg = (id) => !!((D.img7 && D.img7[norm(id)]) || D.assets[norm(id)]);
  /** v7: صورة من media/img7 أو بديل هادئ (لا صورة معطوبة ولا نصّ للطفل) */
  BQ.img7 = (k) => (D.img7 && D.img7[k]) || (scan ? 'media/img7/' + k + '.webp' : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" rx="28" fill="#F1FAFE"/><rect x="10" y="10" width="380" height="280" rx="22" fill="none" stroke="#B9DDF1" stroke-width="5" stroke-dasharray="16 12"/><circle cx="200" cy="138" r="38" fill="#DDF0FA"/><path d="M150 214h100" stroke="#B9DDF1" stroke-width="10" stroke-linecap="round"/></svg>'));
  BQ.hasImg7 = (k) => !!(D.img7 && D.img7[k]);

  BQ.char = { BRQ: 'media/img/comp_cut_BRQ_huefix.webp', MAJ: 'media/img/comp_cut_MAJ.webp', SAY: 'media/img/comp_cut_SAY.webp' };
  /* [brq-anim v1] بارق المتحرّك (Grok i2v → WebP شفّاف): idle · talk · cheer · clap · wave · point · think — مع صورة ثابتة لكلّ حالة */
  BQ.char.MOTIONS = ['idle', 'talk', 'cheer', 'clap', 'wave', 'point', 'think'];
  BQ.char.anim = (s) => 'media/brq/brq_' + (BQ.char.MOTIONS.includes(s) ? s : 'idle') + '.webp';
  BQ.char.still = (s) => 'media/brq/brq_' + (BQ.char.MOTIONS.includes(s) ? s : 'idle') + '_still.webp';
  /* FIX12 A-19 (display only; audio untouched): the Name of Allah fully voweled — «بَارَكَ اللهُ» → «بَارَكَ اللَّهُ» (source fix requested from VOICE/TEXT) */
  try { Object.keys(D.lines || {}).forEach((k) => { const L = D.lines[k]; if (L && typeof L.t === 'string' && /(^|[\s،.])الله[َُِ]/.test(L.t)) L.t = L.t.replace(/(^|[\s،.])الله([َُِ])/g, '$1اللَّه$2'); }); } catch (e) { /* */ }
  BQ.line = (id) => D.lines[id] || null;
  /** v7: نوع العنصر — 'video' | 'interactive' | 'game' | 'print' (من البيانات) */
  const KINDS = { video: 'فيديو', interactive: 'تفاعلي', game: 'لعبة', print: 'طباعة' };
  const KIND_IC = {
    video: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
    interactive: '<svg viewBox="0 0 24 24"><path d="M9.2 3.5a1.8 1.8 0 0 1 1.8 1.8v6.2l5.6 1.1a2.4 2.4 0 0 1 1.9 2.7l-.7 4.6a2.4 2.4 0 0 1-2.4 2.1h-4.6a2.4 2.4 0 0 1-1.9-.9l-3.6-4.6a1.6 1.6 0 0 1 2.3-2.2l1.6 1.4V5.3a1.8 1.8 0 0 1 1.8-1.8z" fill="currentColor"/></svg>',
    game: '<svg viewBox="0 0 24 24"><path d="M7.2 7h9.6a4.6 4.6 0 0 1 4.5 3.7l1 5.3a2.6 2.6 0 0 1-4.5 2.2L15.5 16h-7l-2.3 2.2A2.6 2.6 0 0 1 1.7 16l1-5.3A4.6 4.6 0 0 1 7.2 7z" fill="currentColor"/><path d="M7.5 10v4M5.5 12h4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="11" r="1.1" fill="#fff"/><circle cx="18" cy="13" r="1.1" fill="#fff"/></svg>',
    print: '<svg viewBox="0 0 24 24"><path d="M7 3h10v5H7z" fill="currentColor"/><path d="M4.5 9h15A1.5 1.5 0 0 1 21 10.5V17h-4v4H7v-4H3v-6.5A1.5 1.5 0 0 1 4.5 9z" fill="currentColor"/><path d="M9 15h6v4H9z" fill="#fff"/></svg>',
  };
  BQ.typeOf = (id) => { const k = (D.elements.find((e) => e.id === id) || {}).kind; return KINDS[k] ? k : 'interactive'; };
  BQ.typeLabel = (id) => KINDS[BQ.typeOf(id)];
  /* FIX12 D-09/A-01: theme 8 hides the type chips (owner) → not rendered at all, so screen readers never read them */
  const typeBadge = (id, cls) => document.documentElement.dataset.theme === '8' ? null : h('span.bq-type.is-' + BQ.typeOf(id) + (cls ? '.' + cls : ''), { 'aria-label': 'النوع: ' + BQ.typeLabel(id) },
    h('span.bq-type-ic', { 'aria-hidden': 'true', html: KIND_IC[BQ.typeOf(id)] }),
    h('span', { 'aria-hidden': 'true' }, BQ.typeLabel(id)));
  BQ.typeBadge = typeBadge;
  const audioSet = new Set(D.audio);
  const audio7 = new Set(D.audio7 || []);
  (D.audio7 || []).forEach((x) => audioSet.add(x));
  const scan = /[?&]scan=1/.test(location.search);
  BQ.scan = scan;
  BQ.hasAudio = (id) => audioSet.has(id);
  /** v7: مسار السطر — media/audio7 أوّلاً (v7) ثم media/audio (v6) */
  BQ.audioSrc = (id) => (audio7.has(id) || (scan && !audioSet.has(id) && /^bq7_/.test(id)) ? 'media/audio7/' : 'media/audio/') + id + '.mp3';
  if (scan) BQ.hasAudio = (id) => audioSet.has(id) || /^bq7_/.test(id);

  /* CODE-14 · D3 (DECIDE_VOICE 2026-10-09): a SENTENCE is one whole take, then the syllables «مَ – مِ – مُ» are a separate DRILL
     (isolated clips, each chip lit while it sounds; gaps 0.6 s after the sentence, 1.0 s between syllables).
     The VOICE team swaps the composite files for the whole-take carriers under the SAME ids. Until a carrier is live the old
     composite (which already contains the syllables) keeps playing alone — so nothing is heard twice and nothing regresses.
     Carrier detection = real duration of the live file (decoded, no autoplay needed) ≤ max s (composites: 10.3 / 6.6 / 6.9 / 10.0 s)
     + the drill/tail clips it needs exist. BQ.SPLIT_FORCE = {id: true|false} overrides (QA). */
  BQ.SPLIT = {
    bq7_E03_l2_intro: { max: 8.3, drill: 'hab' }, bq7_E06_vowels: { max: 4.6, drill: 'hab' },
    bq7_E06_brq_wow: { max: 5.0, drill: 'brq' }, bq7_E11_s1_q: { max: 6.2, drill: 'hab', tail: 'bq7_E11_s1_lc' },
  };
  BQ.DRILL = { hab: ['bq7_S_ma', 'bq7_S_mi', 'bq7_S_mu'], brq: ['bq7_SB_ma', 'bq7_SB_mi', 'bq7_SB_mu'] };
  BQ.DRILL_T = ['مَ', 'مِ', 'مُ'];
  BQ.SPLIT_FORCE = BQ.SPLIT_FORCE || {};
  const splitP = {};
  BQ.splitReady = (id) => {
    const c = BQ.SPLIT[id]; if (!c) return Promise.resolve(false);
    if (id in BQ.SPLIT_FORCE) return Promise.resolve(!!BQ.SPLIT_FORCE[id]);
    if (splitP[id]) return splitP[id];
    const need = [id].concat(BQ.DRILL[c.drill] || [], c.tail ? [c.tail] : []);
    if (!need.every((x) => BQ.hasAudio(x)) || BQ.scan) return (splitP[id] = Promise.resolve(false));
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const dur = new Promise((res) => {
      const t = setTimeout(() => res(null), 4000);
      fetch(BQ.audioSrc(id)).then((r) => (r.ok ? r.arrayBuffer() : null)).then((buf) => {
        if (!buf || !OAC) return null;
        const oc = new OAC(1, 1, 44100);
        return new Promise((ok2) => { const pr = oc.decodeAudioData(buf, (ab) => ok2(ab.duration), () => ok2(null)); if (pr && pr.catch) pr.catch(() => ok2(null)); });
      }).catch(() => null).then((d) => { clearTimeout(t); res(d); });
    });
    return (splitP[id] = dur.then((d) => !!(d && d <= c.max)));
  };
  /** drill(S, ids, chips) — each syllable clip with its chip lit (chips: elements, or none → a transient chip strip in the stage) */
  BQ.drill = async (S, ids, chips, o) => {
    o = o || {};
    let strip = null;
    if (!chips || !chips.length) {
      const host = o.host || document.querySelector('.elp-play .bq8-stage, .elp-play') || document.body;
      strip = h('div.bq-drill', { 'aria-hidden': 'true', lang: 'ar' }, BQ.DRILL_T.slice(0, ids.length).map((t) => h('span.bq-drill-c', null, t)));
      host.append(strip); chips = [...strip.children];
    }
    const pause = (ms) => (S.wait ? S.wait(ms) : S.sleep(ms)); // speech gaps are not motion: never shortened by reduced-motion
    try {
      await pause(o.gap0 == null ? 600 : o.gap0);
      for (let i = 0; i < ids.length; i++) {
        const c = chips[i]; if (c) c.classList.add('is-play');
        try { await S.stim(ids[i]); } finally { if (c) c.classList.remove('is-play'); }
        if (i < ids.length - 1) await pause(o.gap == null ? 1000 : o.gap);
      }
    } finally { if (strip) setTimeout(() => strip.remove(), 350); }
  };
  /** sayDrill(S, id, chips, opt) — the whole-take sentence, then (when its carrier is live) the drill and the optional tail line */
  BQ.sayDrill = async (S, id, chips, opt) => {
    const c = BQ.SPLIT[id]; const ready = c ? await BQ.splitReady(id) : false;
    await S.say(id, opt);
    if (!ready) return false;
    await BQ.drill(S, BQ.DRILL[c.drill], chips, opt);
    if (c.tail) { await (S.wait ? S.wait(600) : S.sleep(600)); await S.say(c.tail); }
    return true;
  };
  /* CODE-14 · U2: the «rotate the iPad» hint (icon only · portrait + covers/end cards only, via CSS · dismissable for this visit) */
  (function rotHint() {
    const mk = () => {
      if (document.querySelector('.bq-rot')) return;
      let off = false; try { off = sessionStorage.getItem('bq-rot-off') === '1'; } catch (e) { /* */ }
      if (off) return;
      const b = h('button.bq-rot', { type: 'button', 'aria-label': 'أَدِرِ الْجِهَازَ' });
      b.innerHTML = '<svg viewBox="0 0 72 72" aria-hidden="true"><g class="bq-rot-pad"><rect x="22" y="10" width="28" height="52" rx="6" fill="#fff" stroke="currentColor" stroke-width="4"/><circle cx="36" cy="55" r="2.6" fill="currentColor"/></g><path d="M58 22a26 26 0 0 0-14-12" fill="none" stroke="#13A3AE" stroke-width="4" stroke-linecap="round"/><path d="M45 5l-2 6 6 2" fill="none" stroke="#13A3AE" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="bq-rot-x" aria-hidden="true">×</span>';
      b.addEventListener('click', () => { b.hidden = true; try { sessionStorage.setItem('bq-rot-off', '1'); } catch (e) { /* */ } });
      document.body.append(b);
    };
    if (document.body) mk(); else document.addEventListener('DOMContentLoaded', mk);
  })();
  BQ.splitWarm = (ids) => { try { ids.forEach((id) => BQ.splitReady(id)); } catch (e) { /* */ } }; // elements call it on start


  /* ---------- الصوت + النصّ المصاحب ---------- */
  const SPEAKER = { 'ماجد': 'ماجِد', 'سيف': 'سَيْف', 'بارق': 'بارِق', 'واجهة': '', 'مؤثّر': '' };
  const A = (BQ.audio = { cur: null, token: 0, capEl: null, onLine: null, ctxs: new Set() });
  /** FIX12 D-01: one shared WebAudio context, created suspended-aware; never resumed while muted */
  A.getCtx = function () {
    try { const C = window.AudioContext || window.webkitAudioContext; if (!A.ctx && C) { A.ctx = new C(); A.ctxs.add(A.ctx); } if (A.ctx && A.isMuted() && A.ctx.state === 'running') A.ctx.suspend().catch(() => {}); } catch (e) { /* */ }
    return A.ctx || null;
  };
  A.isMuted = () => !!(BQ.state && BQ.state.muted);
  /* OWNER 2026-10-07 «لو عايز أعمل كتم للصوت في النشاط؟» — global mute (all lesson audio + video), remembered for the session */
  BQ.state = BQ.state || {};
  try { BQ.state.muted = sessionStorage.getItem('bq_muted') === '1'; } catch (e) { BQ.state.muted = false; }
  const mediaSeen = new Set();
  (function () {
    const MP = window.HTMLMediaElement && HTMLMediaElement.prototype; if (!MP || MP._bqMutePatched) return;
    const op = MP.play; MP._bqMutePatched = true;
    MP.play = function () { try { this.muted = !!BQ.state.muted; mediaSeen.add(this); } catch (e) { /* */ } return op.apply(this, arguments); };
  })();
  BQ.setMuted = function (on) {
    BQ.state.muted = !!on;
    try { sessionStorage.setItem('bq_muted', on ? '1' : '0'); } catch (e) { /* */ }
    mediaSeen.forEach((m) => { try { m.muted = !!on; } catch (e) { /* */ } });
    document.querySelectorAll('audio, video').forEach((m) => { try { m.muted = !!on; } catch (e) { /* */ } });
    /* FIX12 D-01: muted = NO sound at all — suspend every WebAudio context; resume ONLY here on unmute */
    (BQ.audio && BQ.audio.ctxs ? Array.from(BQ.audio.ctxs) : []).concat(BQ.audio && BQ.audio.ctx ? [BQ.audio.ctx] : []).forEach((c) => {
      try { if (on) { if (c.state === 'running') c.suspend().catch(() => {}); } else if (c.state !== 'running') c.resume().catch(() => {}); } catch (e) { /* */ }
    });
    document.querySelectorAll('.elp-mute').forEach((b) => {
      b.setAttribute('aria-pressed', String(!!on)); b.classList.toggle('is-on', !!on);
      const lbl = on ? 'تَشْغِيلُ الصَّوْتِ' : 'كَتْمُ الصَّوْتِ'; b.setAttribute('aria-label', lbl); b.title = lbl;
      const ic = b.querySelector('.bq-ic, svg'); if (ic) ic.replaceWith(BQ.icon(on ? 'mute' : 'speaker'));
    });
  };
  A.pending = null; // مُحلّل السطر الجاري — يُستدعى عند المقاطعة حتى لا يتجمّد من ينتظره
  const settle = () => { const r = A.pending; A.pending = null; if (r) r(); };
  /* عنصر صوت واحد مشترك يُفتح بلمسة «ابْدَأْ» (سياسة التشغيل في iOS/iPadOS تحفظ الفتح للعنصر نفسه) — T10 */
  let shared = null, unlocked = false;
  const silentURL = (() => {
    try {
      const n = 800, b = new Uint8Array(44 + n), dv = new DataView(b.buffer), w = (o, s) => { for (let i = 0; i < s.length; i++) b[o + i] = s.charCodeAt(i); };
      w(0, 'RIFF'); dv.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
      dv.setUint32(24, 8000, true); dv.setUint32(28, 8000, true); dv.setUint16(32, 1, true); dv.setUint16(34, 8, true); w(36, 'data'); dv.setUint32(40, n, true); b.fill(128, 44);
      return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
    } catch (e) { return ''; }
  })();
  const mkAudio = () => { try { const a = new Audio(); a.preload = 'auto'; a.setAttribute('playsinline', ''); return a; } catch (e) { return null; } };
  const sharedEl = () => { if (!shared) shared = mkAudio(); return shared; };
  /* v0-12 · iOS/iPadOS: كلّ تشغيل يمرّ بعناصر صوت «مفتوحة» بلمسة — عنصر الكلام المشترك + مجمّع للمؤثّرات/المقاطع.
     أوّل لمسة/نقرة/مفتاح في الصفحة (لا «ابْدَأْ» وحدها) تفتحها كلّها وتستأنف AudioContext؛ ما رُفض يُعاد عند اللمسة التالية،
     ويُستأنف الكلام المعلّق عند العودة إلى الصفحة (visibilitychange). */
  const POOL_N = 6, pool = [], queue = [];
  let gestured = false;
  function poolEl() {
    const now = Date.now();
    let a = pool.find((x) => (x.paused || x.ended) && !(x._bqClaim > now - 500));
    if (!a) { a = mkAudio(); if (!a) return null; if (pool.length < 12) pool.push(a); }
    a._bqClaim = now;
    if (a._bqOff) { a._bqOff(); a._bqOff = null; }
    return a;
  }
  function unlockEl(a) {
    if (!a || a._bqUnlocked || !silentURL || !a.paused) return;
    try { a.src = silentURL; const p = a.play(); if (p && p.then) p.then(() => { a._bqUnlocked = true; if (a.src === silentURL || a.currentSrc === silentURL) a.pause(); }).catch(() => {}); } catch (e) { /* */ }
  }
  /** يُستدعى داخل لمسة المستخدم (ابْدَأْ · التالي · أيّ لمسة أولى) */
  A.unlock = function () {
    const au = sharedEl(); if (!au || unlocked || !silentURL) return;
    try {
      if (A.pending && A.cur === au) { const p = au.play(); if (p && p.then) p.then(() => { unlocked = true; }).catch(() => {}); } // السطر المعلّق نفسه يفتح العنصر
      else if (au.paused) { au.src = silentURL; const p = au.play(); if (p && p.then) p.then(() => { unlocked = true; }).catch(() => {}); }
    } catch (e) { /* */ }
  };
  function onGesture() {
    A.unlock();
    if (!gestured) { gestured = true; while (pool.length < POOL_N) { const a = mkAudio(); if (!a) break; pool.push(a); } }
    pool.forEach(unlockEl);
    try {
      const c = A.getCtx();
      if (c && c.state !== 'running' && !A.isMuted()) c.resume().catch(() => {}); // FIX12 D-01: never while muted
    } catch (e) { /* */ }
    const now = Date.now();
    queue.splice(0).forEach((q) => { if (now - q.t < 6000) { try { q.fn(); } catch (e) { /* */ } } });
  }
  ['touchend', 'pointerup', 'click', 'keydown'].forEach((ev) => document.addEventListener(ev, onGesture, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (A.ctx && A.ctx.state !== 'running' && !A.isMuted()) A.ctx.resume().catch(() => {});
    const c = A.cur; if (c && c.paused && !c.ended && (A.pending || A.segLive)) { const p = c.play(); if (p && p.catch) p.catch(() => {}); }
  });
  /** عنصر الكلام المفتوح (للمقاطع المقصوصة: kit.playSeg) */
  A.voice = () => sharedEl();
  /** عنصر مؤثّر مفتوح من المجمّع */
  A.pooled = () => poolEl() || mkAudio();
  /** رفض المتصفّح التشغيل: زرّ «اضْغَطْ لِلاسْتِماعِ» + إعادة تلقائية عند أيّ لمسة تالية */
  A.whenUnlocked = (fn) => { queue.push({ fn, t: Date.now() }); };
  /** FIX13 R13-A-01: leaving an element drops every retry queued for the next gesture (a blocked line/effect of element N never starts in N+1) */
  A.flush = () => { queue.length = 0; A.segLive = false; A.pending = null; };
  A.blocked = (retry) => { let once = false; const go = () => { if (once) return; once = true; hideUnlock(); retry(); }; showUnlock(go); A.whenUnlocked(go); };
  A.stop = function () {
    A.token++;
    if (A.cur) { try { A.cur.pause(); } catch (e) {} A.cur = null; }
    settle();
    A.caption(null);
    hideUnlock();
  };
  A.caption = function (id) {
    const cap = A.capEl; if (!cap) return;
    const L = id && BQ.line(id);
    if (!L || !L.t || L.sp === 'مؤثّر' || L.sp === 'واجهة') { cap.hidden = true; cap.textContent = ''; return; }
    const t = L.t.replace(/⏸\S*/g, ' ').replace(/\s*\[[^\]]*\]/g, '').replace(/\s*\([^)؀-ۿ]*\)/g, '') /* SCI-1 T1: keep Arabic parentheses «(مَ – مِ – مُ)»; strip only [tags] / Latin (notes) */.replace(/\s{2,}/g, ' ').trim();
    if (!t) { cap.hidden = true; cap.textContent = ''; return; }
    cap.replaceChildren(SPEAKER[L.sp] ? h('b', null, SPEAKER[L.sp] + ': ') : '', t);
    cap.hidden = !BQ.state.cc;
  };
  const estMs = (id) => { const L = BQ.line(id); return L ? Math.max(1200, L.t.length * 85) : 900; };
  /** play(id) → Promise تُحلّ عند انتهاء السطر، أو فوراً إن أوقف، أو بعد مهلة التوقّف max(4 ث، 2× المتوقَّع) */
  A.play = function (id, opt) {
    opt = opt || {};
    const my = ++A.token;
    if (A.cur) { try { A.cur.pause(); } catch (e) {} A.cur = null; }
    settle();
    hideUnlock();
    if (!opt.noCaption) A.caption(id);
    if (A.onLine) A.onLine(id);
    if (id === 'bq7_E06_reveal' && BQ.reveal) BQ.reveal(); // R1-1: الرمز يُكشف في E06 لحظة سطر الكشف
    return new Promise((resolve) => {
      let fin = false, wd = 0, au = null;
      const off = () => { if (!au) return; au.removeEventListener('ended', finish); au.removeEventListener('error', finish); au.removeEventListener('loadedmetadata', onMeta); };
      function finish() { if (fin) return; fin = true; clearTimeout(wd); off(); if (A.pending === finish) A.pending = null; if (my === A.token && !opt.keepCaption) A.caption(null); resolve(); }
      const arm = (ms) => { clearTimeout(wd); wd = setTimeout(finish, Math.max(4000, ms)); };
      function onMeta() { const d = au && au.duration; if (d && isFinite(d)) arm(2 * d * 1000 / (opt.rate || 1)); }
      A.pending = finish;
      if (!BQ.hasAudio(id)) { setTimeout(finish, estMs(id)); return; }
      au = sharedEl() || new Audio();
      try { au.pause(); } catch (e) {}
      au.src = BQ.audioSrc(id);
      au.volume = opt.volume == null ? 1 : opt.volume;
      try { au.defaultPlaybackRate = opt.rate || 1; au.playbackRate = opt.rate || 1; } catch (e) { /* */ }
      A.cur = au;
      au.addEventListener('ended', finish);
      au.addEventListener('error', finish);
      au.addEventListener('loadedmetadata', onMeta);
      arm(2 * estMs(id));
      let p; try { p = au.play(); } catch (e) { p = null; }
      if (p && p.catch) p.catch((err) => {
        if (fin || my !== A.token) return;
        if (err && err.name === 'NotAllowedError') { clearTimeout(wd); A.blocked(() => { if (fin || my !== A.token) return; arm(2 * estMs(id)); const q = au.play(); if (q && q.catch) q.catch(() => setTimeout(finish, 600)); }); }
        else setTimeout(finish, 600);
      });
    });
  };
  /** seq([...]) — عناصر: معرّف سطر · رقم (سكتة بالمللي ث) · {id, rate} · دالة */
  A.seq = async function (list) {
    const my = ++A.token;
    for (const it of list) {
      if (my !== A.token) return false;
      if (typeof it === 'number') await BQ.sleep(it);
      else if (typeof it === 'function') await it();
      else if (typeof it === 'string') { A.token = my - 1; await A.play(it); }
      else if (it && it.id) { A.token = my - 1; await A.play(it.id, it); }
      if (A.token !== my) return false;
    }
    return true;
  };
  /** مؤثّر أو موسيقى بلا نصّ مصاحب ولا يقطع الكلام */
  A.fx = function (id, vol) {
    if (A.isMuted()) return { stop() {}, done: Promise.resolve() }; // FIX12 D-01: muted → no effect at all (callers fall back to nominal timing)
    if (!BQ.hasAudio(id)) return { stop() {}, done: Promise.resolve() };
    const au = A.pooled(); if (!au) return { stop() {}, done: Promise.resolve() };
    let fin = false, stopped = false, res;
    const done = new Promise((r) => { res = r; });
    const end = () => { if (fin) return; fin = true; au.removeEventListener('ended', end); au.removeEventListener('error', end); au._bqClaim = 0; res(); };
    au._bqOff = end;
    au.addEventListener('ended', end); au.addEventListener('error', end);
    au.src = BQ.audioSrc(id); au.volume = vol == null ? 0.8 : vol;
    const go = () => { if (stopped || fin) return; let p; try { p = au.play(); } catch (e) { p = null; } if (p && p.catch) p.catch((err) => { if (err && err.name === 'NotAllowedError') A.whenUnlocked(go); else end(); }); };
    go();
    return { el: au, stop() { stopped = true; try { au.pause(); } catch (e) {} end(); }, done };
  };
  BQ.sfx = { ok: 'bariq_L1-01_sfx-check-done', snap: 'bariq_L1-01_sfx-tile-snap', flip: 'bariq_L1-01_sfx-card-flip', bead: 'bariq_L1-01_sfx-compass-bead' };
  /* زرّ «اضْغَطْ لِلاسْتِماعِ» حين يرفض المتصفّح التشغيل */
  let unlockBtn = null;
  function hideUnlock() { if (unlockBtn) { unlockBtn.remove(); unlockBtn = null; } }
  function showUnlock(retry) {
    hideUnlock();
    const host = $('.elp-play') || $('#content'); if (!host) return;
    unlockBtn = h('button.bq-unlock', { type: 'button', onclick: () => { hideUnlock(); A.unlock(); retry(); } }, BQ.icon('speaker'), 'اضْغَط لِلاسْتِماعِ');
    host.prepend(unlockBtn);
  }

  /* ---------- أيقونات ---------- */
  const I = (BQ.icons = {
    speaker: '<svg viewBox="0 0 48 48"><path d="M8 18h8l11-9v30l-11-9H8z" fill="currentColor"/><path d="M32 17a9 9 0 0 1 0 14M36.5 12a16 16 0 0 1 0 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 48 48"><path d="M8 18h8l11-9v30l-11-9H8z" fill="currentColor"/><path d="M33 18l10 12M43 18L33 30" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
    next: '<svg viewBox="0 0 48 48"><path d="M30 10 16 24l14 14" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    prev: '<svg viewBox="0 0 48 48"><path d="M18 10l14 14-14 14" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    home: '<svg viewBox="0 0 48 48"><path d="M8 23 24 9l16 14M13 20v18h9V29h4v9h9V20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cc: '<svg viewBox="0 0 48 48"><rect x="5" y="10" width="38" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M21 20.5a5 5 0 1 0 0 7M34 20.5a5 5 0 1 0 0 7" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
    adult: '<svg viewBox="0 0 48 48"><circle cx="24" cy="15" r="7" fill="currentColor"/><path d="M10 41c1-9 7-14 14-14s13 5 14 14z" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 48 48"><path d="M16 10v28l24-14z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 48 48"><path d="M13 10h8v28h-8zM27 10h8v28h-8z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 48 48"><path d="M12 24a12 12 0 1 0 4-9" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/><path d="M9 8v10h10" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 48 48"><path d="M11 25l9 9 17-19" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    same: '<svg viewBox="0 0 96 48"><circle cx="26" cy="24" r="15" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="70" cy="24" r="15" fill="none" stroke="currentColor" stroke-width="5"/></svg>',
    diff: '<svg viewBox="0 0 96 48"><circle cx="26" cy="24" r="15" fill="none" stroke="currentColor" stroke-width="5"/><rect x="56" y="10" width="28" height="28" rx="2" fill="none" stroke="currentColor" stroke-width="5"/></svg>',
    ear: '<svg viewBox="0 0 48 48"><path d="M16 20a10 10 0 1 1 18 6c-2 3-5 4-5 8a5 5 0 0 1-9 2" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M21 21a4 4 0 1 1 7 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
    mouth: '<svg viewBox="0 0 48 48"><path d="M8 24c5-6 11-7 16-4 5-3 11-2 16 4-5 7-11 9-16 9s-11-2-16-9z" fill="currentColor"/><path d="M11 24h26" stroke="var(--c-card-fill)" stroke-width="2.5"/></svg>',
    hand: '<svg viewBox="0 0 48 48"><path d="M18 27V11a3 3 0 0 1 6 0v12-15a3 3 0 0 1 6 0v15-12a3 3 0 0 1 6 0v17c0 8-5 13-12 13-6 0-9-3-12-8l-5-8a3 3 0 0 1 5-3z" fill="currentColor"/></svg>',
    eye: '<svg viewBox="0 0 48 48"><path d="M4 24c5-9 12-14 20-14s15 5 20 14c-5 9-12 14-20 14S9 33 4 24z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><circle cx="24" cy="24" r="7" fill="currentColor"/></svg>',
    wave: '<svg viewBox="0 0 48 48"><path d="M6 24h4M14 16v16M20 10v28M26 18v12M32 13v22M38 20v8M42 24h1" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
    star: '<svg viewBox="0 0 48 48"><path d="M24 5l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 34.2 12.1 40.9 15 27.7l-10-9 13.4-1.4z" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 48 48"><path d="M14 14l20 20M34 14 14 34" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
    menu: '<svg viewBox="0 0 48 48"><path d="M9 14h30M9 24h30M9 34h30" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>',
  });
  BQ.icon = (name, cls) => h('span.bq-ic' + (cls ? '.' + cls : ''), { 'aria-hidden': 'true', html: I[name] || '' });

  /* ---------- مكوّنات الواجهة ---------- */
  const UI = (BQ.ui = {});
  const anim = (el, cls, ms) => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms || 700); };
  UI.ok = (el) => { el.classList.add('is-ok'); anim(el, 'fx-pop', 400); };
  UI.shake = (el) => { if (!BQ.reduced()) anim(el, 'fx-shake', 500); else anim(el, 'fx-mark', 650); el.classList.add('is-dim'); };
  UI.pulse = (el) => anim(el, 'fx-pulse', 1300);
  UI.glow = (el, on) => el.classList.toggle('is-glow', on !== false);
  UI.reset = (el) => el.classList.remove('is-ok', 'is-dim', 'is-glow', 'is-hidden', 'is-picked');

  /** زرّ المثير (اسمع الصوت) — هويّة مختلفة عن سمّاعة التعليمة (تصميم D12) */
  UI.listenBtn = (onClick, label) => h('button.bq-listen.bq-hear', { type: 'button', 'aria-label': label || 'اِسْتَمِع إِلَى الصَّوْتِ', onclick: onClick }, BQ.icon('ear'));

  /** بطاقات اختيار — items: [{id, img, label, icon, aria}] */
  UI.choices = function (parent, opt) {
    const wrap = h('div.bq-choices' + (opt.cls ? '.' + opt.cls : ''), { role: 'group', 'aria-label': opt.aria || 'صُوَرٌ لِلاخْتِيارِ' });
    const btns = opt.items.map((it) => {
      const b = h('button.bq-choice', { type: 'button', 'aria-label': it.aria || it.label || 'صورة', dataset: { id: it.id } },
        it.img ? h('img', { src: BQ.img(it.img), alt: '', draggable: 'false' }) : null,
        it.icon ? BQ.icon(it.icon, 'big') : null,
        it.glyph ? h('span.bq-glyph', null, it.glyph) : null,
        it.label ? h('span.bq-lbl', null, it.label) : null,
        h('span.bq-tick', { 'aria-hidden': 'true', html: I.check }));
      b.addEventListener('click', () => { if (!wrap.classList.contains('is-locked') && !b.classList.contains('is-hidden')) opt.onPick && opt.onPick(it, b, btns); });
      return b;
    });
    wrap.append(...btns);
    parent.append(wrap);
    wrap.lock = (v) => wrap.classList.toggle('is-locked', v !== false);
    wrap.btns = btns;
    return wrap;
  };

  /** خرزات البوصلة (تقدّم لا درجة) — للجولات المرصودة وحدها */
  UI.beads = function (parent, n) {
    const w = h('div.bq-beads', { 'aria-label': 'التَّقَدُّمُ' });
    const bs = Array.from({ length: n }, () => h('span.bq-bead'));
    w.append(...bs); parent.append(w);
    return { el: w, set(i, st) { if (bs[i]) { bs[i].className = 'bq-bead is-' + (st || 'on'); if (st !== 'cur') BQ.audio.fx(BQ.sfx.bead, 0.5); } }, cur(i) { bs.forEach((b, j) => b.classList.toggle('is-cur', j === i)); } };
  };

  /** مؤشّر الخطوات الموحّد: نقاط + الحاليّة؛ بلا أرقام لـ٤–٩، و«١ / ٣» لـ١٠–١٢ — {el, set(i)} */
  UI.steps = function (parent, n, opt) {
    opt = opt || {}; n = Math.max(1, n | 0);
    const el = h('div.bq-steps', { role: 'img' });
    const dots = Array.from({ length: n }, () => h('span.bq-step', { 'aria-hidden': 'true' }));
    const txt = h('span.bq-steps-t', { 'aria-hidden': 'true' });
    el.append(...dots, txt);
    if (parent) parent.append(el);
    let cur = 0;
    const set = (i) => {
      cur = Math.max(0, Math.min(n - 1, i | 0));
      dots.forEach((d, j) => { d.className = 'bq-step' + (j < cur ? ' is-done' : j === cur ? ' is-cur' : ''); });
      const num = BQ.state.age === '10-12';
      txt.hidden = !num;
      txt.textContent = (opt.label ? opt.label + ' ' : '') + AR(cur + 1) + ' / ' + AR(n);
      el.setAttribute('aria-label', (opt.label || 'الخُطْوَةُ') + ' ' + AR(cur + 1) + ' مِن ' + AR(n));
    };
    set(0);
    return { el, set, get i() { return cur; }, n };
  };

  /** [brq-anim v1] بارق متحرّك: <span.bq-brq><img></span> بإطار ثابت بنسبة الصورة القديمة؛ el.brq(state) يبدّل الحالة.
   *  prefers-reduced-motion ← الصورة الثابتة للحالة نفسها. */
  let brqPre = false;
  UI.brq = function (state, cls, settle) {
    if (!brqPre) { brqPre = true; if (!BQ.reduced()) ['talk', 'cheer', 'think', 'idle'].forEach((s) => { const i = new Image(); i.src = BQ.char.anim(s); }); }
    const img = h('img', { alt: '', decoding: 'async', draggable: 'false' });
    const el = h('span.bq-brq' + (cls ? '.' + cls : ''), { 'aria-hidden': 'true' }, img);
    el.brq = (s) => { s = BQ.char.MOTIONS.includes(s) ? s : 'idle'; if (el.dataset.s === s) return el; el.dataset.s = s; img.src = BQ.reduced() ? BQ.char.still(s) : BQ.char.anim(s); return el; };
    el.brq(state || 'idle');
    if (settle) setTimeout(() => el.brq('idle'), settle); // يهدأ بعد مدّة
    return el;
  };
  const MOOD = (id) => (/fb-yes|FB_0[35]|EL06_05/.test(id || '') ? 'cheer' : /retry/.test(id || '') ? 'think' : '');

  /** بارق يطلّ من حافّة المسرح ويقول سطراً — يتكلّم أثناء السطر، ثم opt.mood (cheer|think|clap…) ثم يهدأ ويخرج */
  UI.bariq = async function (stage, lineId, opt) {
    opt = opt || {};
    const brq = UI.brq(lineId ? 'talk' : 'wave');
    const pop = h('div.bq-bariq.has-anim' + (opt.side === 'left' ? '.left' : ''), { 'aria-hidden': 'true' }, brq);
    // v0-12: فوق منطقة اللعب (غير متمرّرة) لا داخل المسرح المتمرّر — ظهوره لا يصنع تمريراً
    ((stage && stage.closest && stage.closest('.elp-play')) || stage).append(pop);
    requestAnimationFrame(() => pop.classList.add('in'));
    if (lineId) await BQ.audio.play(lineId); else await BQ.sleep(opt.ms || 1400);
    const mood = opt.mood || MOOD(lineId);
    if (mood) { brq.brq(mood); if (opt.mood) await BQ.sleep(opt.moodMs || 900); } else brq.brq('idle');
    pop.classList.remove('in'); setTimeout(() => pop.remove(), 450);
  };

  /** ورقة ختام العنصر — opt: {title, note, line, onReplay, home:[≤٣ أسطر «في البيت اليوم»]} */
  UI.endCard = function (stage, opt) {
    opt = opt || {};
    const nx = nextInfo();
    const tid = 'bq-end-' + Math.random().toString(36).slice(2, 7);
    const home = (opt.home || []).filter(Boolean).slice(0, 3);
    const nextBtn = nx ? h('button.bq-btn', { type: 'button', onclick: () => { A.unlock(); BQ.goNext(); } }, 'التَّالِي', BQ.icon('next')) : null;
    /* FIX13 R13-A-08: the LAST element (no next) ends the lesson — no «التَّالِي» to a missing element; «أَعِدِ النَّشاطَ» + the lesson menu instead */
    const toMenu = () => { A.unlock(); const mb = document.getElementById('menuBtn'); if (mb && mb.offsetParent) mb.click(); else { const p = BQ.path && BQ.path()[0]; if (p) BQ.open(p.id); } };
    const menuBtn = nx ? null : h('button.bq-btn.bq-end-menu', { type: 'button', onclick: toMenu }, BQ.icon('menu'), 'عَنَاصِرُ الدَّرْسِ');
    /* v0-12: الورقة فوق منطقة اللعب كلّها (لا داخل المسرح المتمرّر) وتتّسع للإطار بلا تمرير: الأزرار قبل «في البيت اليوم» */
    const card = h('div.bq-end' + (nx ? '' : '.is-lesson-end'), { role: 'dialog', 'aria-labelledby': tid },
      h('div.bq-end-card', null,
        UI.brq('cheer', 'bq-end-brq', 6000), // [brq-anim v1]
        h('p.bq-end-t', { id: tid }, opt.title || 'أَحْسَنْتَ.'),
        opt.note ? h('p.bq-end-n', null, opt.note) : null,
        h('div.bq-end-row', null,
          h('button.bq-btn.ghost', { type: 'button', onclick: () => { card.remove(); opt.onReplay && opt.onReplay(); } }, BQ.icon('replay'), 'أَعِدِ النَّشَاطَ'),
          nextBtn, menuBtn),
        nx ? h('p.bq-end-next', null, h('small', null, 'التَّالِي'), ' ', h('b', null, nx.name)) : null, // R3-N9
        home.length ? homeBox(home) : null));
    const host = (stage && stage.closest && stage.closest('.elp-play')) || stage;
    host.append(card);
    requestAnimationFrame(() => { try { (nextBtn || menuBtn || card.querySelector('button')).focus({ preventScroll: true }); } catch (e) { /* */ } });
    if (opt.line) BQ.audio.play(opt.line);
    return card;
  };
  function homeBox(lines) {
    return h('div.bq-home', null, h('p.bq-home-t', null, BQ.icon('home'), 'في البيت اليوم'), h('ul', null, lines.map((t) => h('li', null, t))));
  }

  /** تتبّع الحرف بالإصبع/الفأرة — opt: {glyph, path:[[x,y],…] (0..1), ordered, startTol, tol, onDone} */
  UI.trace = function (parent, opt) {
    opt = opt || {};
    const box = h('div.bq-trace');
    const cv = h('canvas', { width: 800, height: 800, 'aria-label': 'سِر مَعَ النِّقَاطِ', role: 'img' });
    box.append(h('span.bq-trace-glyph', { 'aria-hidden': 'true' }, opt.glyph || 'م'), cv);
    parent.append(box);
    const g = cv.getContext('2d');
    // مسار «م» المنفصلة: رأس دائريّ ثم ذيل نازل — نقاط مرجعية للتحقّق (نسبة من المربّع)
    const path = opt.path || [[0.62, 0.40], [0.52, 0.33], [0.40, 0.38], [0.40, 0.48], [0.52, 0.52], [0.62, 0.45], [0.62, 0.40], [0.66, 0.52], [0.66, 0.66], [0.66, 0.80]];
    const ordered = !!opt.ordered, TOL = opt.tol || 0.075, START = opt.startTol || 0.11;
    const hit = path.map(() => false);
    let drawing = false, last = null, done = false, next = 0;
    const start = h('span.bq-trace-start', { style: { left: path[0][0] * 100 + '%', top: path[0][1] * 100 + '%' }, 'aria-hidden': 'true' });
    box.append(start);
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    const finish = (info) => { if (done) return; done = true; box.classList.add('is-done'); opt.onDone && opt.onDone(info || {}); };
    const check = (p) => {
      if (ordered) { while (next < path.length && dist(p, path[next]) < TOL) { hit[next] = true; next++; } if (next >= path.length) finish(); }
      else { path.forEach((q, i) => { if (dist(q, p) < TOL) hit[i] = true; }); if (hit.every(Boolean)) finish(); }
    };
    const draw = (p) => {
      g.strokeStyle = getComputedStyle(box).getPropertyValue('--trace-ink').trim() || '#00345B';
      g.lineWidth = 44; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(last[0] * 800, last[1] * 800); g.lineTo(p[0] * 800, p[1] * 800); g.stroke();
      const steps = Math.max(1, Math.ceil(dist(last, p) / 0.02));
      for (let s = 1; s <= steps; s++) check([last[0] + (p[0] - last[0]) * s / steps, last[1] + (p[1] - last[1]) * s / steps]);
      last = p;
    };
    const flash = () => { start.hidden = false; anim(start, 'is-flash', 900); };
    /* v0-12 · اللمس: اللوحة تمتلك الإصبع (لا تمرير ولا تكبير ولا قائمة لمس) — touch-action:none + منع الافتراضيّ + التقاط المؤشّر */
    box.style.touchAction = 'none'; cv.style.touchAction = 'none';
    const noScroll = (e) => { if (e.cancelable) e.preventDefault(); };
    cv.addEventListener('touchstart', noScroll, { passive: false });
    cv.addEventListener('touchmove', noScroll, { passive: false });
    cv.addEventListener('contextmenu', noScroll);
    cv.addEventListener('pointerdown', (e) => {
      if (e.cancelable) e.preventDefault();
      const p = pos(e);
      if (ordered && !done && next === 0 && dist(p, path[0]) > START) { flash(); return; } // يبدأ من النقطة الخضراء
      drawing = true; last = p; try { cv.setPointerCapture(e.pointerId); } catch (x) { /* */ } start.hidden = true; check(p); draw(p);
    });
    cv.addEventListener('pointermove', (e) => { if (!drawing) return; if (e.cancelable) e.preventDefault(); const ev = e.getCoalescedEvents ? e.getCoalescedEvents() : null; if (ev && ev.length > 1) ev.forEach((c) => draw(pos(c))); else draw(pos(e)); });
    const up = (e) => { drawing = false; try { if (e && cv.hasPointerCapture && cv.hasPointerCapture(e.pointerId)) cv.releasePointerCapture(e.pointerId); } catch (x) { /* */ } };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    // مسار بديل للوحة المفاتيح/المفاتيح الخاصّة: ضغطة مطوّلة من المعلّم تُتمّ التتبّع «بمساعدة» (T25)
    let hold = 0;
    const adultBtn = h('button.bq-trace-adult', { type: 'button', title: 'اضغط مطوّلاً', 'aria-label': 'للمعلّم: اضغط مطوّلاً لإتمام التتبّع بمساعدة' }, 'للمعلّم: أتمِم');
    const hs = () => { clearTimeout(hold); adultBtn.classList.add('is-hold'); hold = setTimeout(() => { adultBtn.classList.remove('is-hold'); finish({ assisted: true }); }, 900); };
    const he = () => { clearTimeout(hold); adultBtn.classList.remove('is-hold'); };
    adultBtn.addEventListener('pointerdown', hs); adultBtn.addEventListener('pointerup', he); adultBtn.addEventListener('pointerleave', he);
    adultBtn.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); hs(); } });
    adultBtn.addEventListener('keyup', he);
    if (opt.adultComplete !== false) box.append(adultBtn);
    box.clear = () => { g.clearRect(0, 0, 800, 800); hit.fill(false); next = 0; done = false; start.hidden = false; box.classList.remove('is-done'); };
    return box;
  };

  /** بطاقة كلمة مشكولة تظهر لحظة نطقها */
  UI.word = (text, cls) => h('span.bq-word' + (cls ? '.' + cls : ''), { lang: 'ar' }, text);

  /** إشعار قصير للمعلّم */
  UI.toast = function (text) {
    let t = $('#bqToast');
    if (!t) { t = h('div.bq-toast', { id: 'bqToast', role: 'status', 'aria-live': 'polite' }); ($('.page-root') || document.body).append(t); }
    t.textContent = text; t.classList.add('in');
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('in'), 3600);
  };

  /* ---------- البيانات المشتقّة: المسار ----------
     v0-12 (المالك: «عايز أشيل تقسيم العناصر بالجلسات»): لا جلسات ولا تخطٍّ بالعمر — «التالي» خطّيّ بترتيب القائمة ١–١٦،
     و«اختبر نفسك» (EL16) آخره ببوّابة «اليوم التالي» كما هي. */
  BQ.register = function (id, def) { BQ.defs[id] = def; };
  const alias = (id) => ((D.alias || {})[id] || id);
  BQ.meta = (id) => D.elements.find((e) => e.id === alias(id));
  let PATH = null;
  BQ.path = function () { if (!PATH) PATH = D.elements.slice().sort((x, y) => x.menu - y.menu).map((e) => ({ id: e.id })); return PATH; };
  function posOf(id, hint) {
    const p = BQ.path();
    if (hint != null && p[hint] && p[hint].id === id) return hint;
    return p.findIndex((q) => q.id === id);
  }
  function nextFrom(cur, pos) {
    const p = BQ.path(); const i = pos >= 0 ? pos : p.findIndex((q) => q.id === cur);
    const n = i >= 0 ? p[i + 1] : null;
    return n ? { id: n.id, pos: i + 1 } : null; // v7: لا «التالي» بعد آخر عنصر
  }
  function prevFrom(cur, pos) {
    const p = BQ.path(); const i = pos >= 0 ? pos : p.findIndex((q) => q.id === cur);
    return i > 0 ? { id: p[i - 1].id, pos: i - 1 } : null;
  }
  const nameOf = (id) => (id === 'plan' ? 'خطة الدرس' : cleanName((BQ.meta(id) || {}).name));
  /** وصف «التالي» للعنصر الجاري: {small, name} */
  function nextInfo() {
    const cur = BQ.state.current; if (!cur || !BQ.meta(cur)) return null;
    const n = nextFrom(cur, posOf(cur)); if (!n) return null;
    return { small: 'التَّالِي', name: nameOf(n.id), to: n };
  }
  BQ.nextInfo = nextInfo;

  /* ---------- الإنجاز والتوقيت ---------- */
  let cleanups = [], life = null;
  /* v0-10 (المالك: «ظلّ الصوت القديم يعمل وحدث تداخل»): كل وسيط صوت/فيديو يُشغَّل يُسجَّل، وعند ترك العنصر
     يُوقَف كلّ ما بدأ قبل الانتقال (صوت، فيديو، مؤثّر، سرير موسيقى) وتُفرَّغ أيّ لعبة Godot قديمة */
  const MEDIA = new Set();
  try {
    const _play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { MEDIA.add(this); return _play.apply(this, arguments); };
  } catch (e) {}
  function hushAll() {
    MEDIA.forEach((m) => { try { if (!m.paused) m.pause(); } catch (e) {} });
    MEDIA.clear();
    document.querySelectorAll('#content iframe').forEach((f) => { try { f.src = 'about:blank'; } catch (e) {} });
  }
  BQ.hushAll = hushAll;
  function teardown() {
    if (life) { life.alive = false; life.timers.forEach(clearTimeout); life.timers.clear(); }
    BQ.audio.stop();
    try { BQ.audio.flush(); } catch (e) { /* */ }
    hushAll();
    cleanups.forEach((f) => { try { f(); } catch (e) {} }); cleanups = [];
    closeConfirm();
  }
  BQ.doneAt = (id) => { try { const v = localStorage.getItem(PFX + 'ts-' + id); return v ? +v : null; } catch (e) { return null; } };
  BQ.hoursSince = (id) => { const t = BQ.doneAt(id); return t ? (Date.now() - t) / 36e5 : null; };
  /** «اختبر نفسك» تحقّق مؤجَّل: يُفتح مبكّراً (<١٢ ساعة بعد «تدرّب» أو بلا سجلّ) معاينةً للمعلّم فقط */
  BQ.gate = { el16() { return { hours: null, early: false, preview: false }; } }; // v6/v0 قديم — لا بوّابة في v7
  BQ.markDone = function (id) {
    if (id === 'E06' && BQ.reveal) BQ.reveal();
    const first = !BQ.state.done.has(id);
    BQ.state.done.add(id); store.set('done', [...BQ.state.done]);
    const ts = Date.now();
    try { localStorage.setItem(PFX + 'ts-' + id, String(ts)); } catch (e) { /* */ }
    $$('.item[data-id="' + id + '"]').forEach((it) => it.classList.add('is-done'));
    updateProgress();
    try { window.dispatchEvent(new CustomEvent('bq:done', { detail: { id, ts, first } })); } catch (e) { /* */ }
  };
  BQ.goNext = function () {
    const cur = BQ.state.current;
    const n = nextFrom(cur, posOf(cur));
    if (n) BQ.open(n.id, { pos: n.pos, src: 'next' });
  };
  BQ.goPrev = function () {
    const cur = BQ.state.current; const p = prevFrom(cur, posOf(cur));
    if (p) BQ.open(p.id, { pos: p.pos, src: 'next' });
  };

  /* ---------- رأس العنصر ---------- */
  /* v0-12: لا رقائق في الرأس — المحطّة معلومة للمعلّم (في دليله)، والزمن في السطر الصغير فوق العنوان */
  function stationLine(meta) {
    const st = meta.station_short || String(meta.station || '').split('—')[0].trim();
    return [kicker(meta.id), meta.kind_ar, meta.time_label].filter(Boolean).join(' · '); // v7
  }
  function kicker(id) { return 'الْعُنْصُرُ ' + AR((BQ.meta(id) || {}).menu || '') + ' مِن ' + AR(D.elements.length); }

  const FN = [[/قول|قُل|غَنّ|رَدِّد|ما هَذا|سَمِعْتُ فَرْقاً|سَمِعْتُ الْفَرْقَ/, 'mouth'], [/أَيْنَ|مَنْ|المِسْ|الْمِسْ|تَتَبَّع|ضَعْ|اقْلِب|رَتِّب|اخْتَر|حَدِّد|سِرْ مَعَ|لَوِّن/, 'hand'], [/انْظُر|شاهِد|حَرْفُ|هَذِهِ الميمُ|^ماء/, 'eye']];
  const fnIcon = (text, line) => { const t = text || ((BQ.line(line) || {}).t) || ''; for (const [re, ic] of FN) if (re.test(t)) return ic; return 'ear'; };

  /* ---------- v8 FIXED STAGE (owner R3 «STAGE» 2026-10-05: «مقاس النشاط وشكل عرضه يكون ثابت») · css/stage8.css ----------
     Theme 8: .elp-play is ALWAYS 1180×820 layout px (THEME8 design units) and is scaled uniformly (transform) to fit .elp-fit, centred and letter-boxed —
     the same composition on every screen (no reflow / no portrait layout). Layout sizes inside the stage never change, so element
     fit() code (clientWidth/clientHeight) always sees the same box; rect-based hit tests (getBoundingClientRect, getScreenCTM) stay right.
     Code that moves an in-stage element by a raw clientX/Y delta must divide it by BQ.stageScale(). */
  const STAGE = (BQ.STAGE = { w: 1180, h: 820 });
  const fixed8 = (BQ.fixedStage = () => document.documentElement.dataset.theme === '8');
  let stageS = 1;
  BQ.stageScale = () => (fixed8() ? stageS : 1);
  function stageFit(box, play) {
    if (!fixed8()) return;
    /* OWNER R3 «رعشة في الفريم» (2026-10-05): the stage is placed on WHOLE DEVICE PIXELS. Before, «left/top 50% + translate(-50%,-50%) scale(s)»
       put the stage (and so the composited <video> layer inside it) at sub-pixel offsets (e.g. video at x 109.06 / y 196.01, 961.88 × 541.38 px);
       the compositor snaps such a layer differently from its rounded clip on every repaint → the whole video box shimmered while playing.
       Now: scale floored so the drawn width is whole device px, top-left corner rounded to the device grid (--bq-tx/--bq-ty, origin 0 0).
       Writes only when a value changes (no style churn) and tells in-stage code (video player) to re-snap: document event «bq-stagefit». */
    let last = '';
    const fit = () => {
      const W = box.clientWidth, H = box.clientHeight; if (!W || !H) return;
      const dpr = window.devicePixelRatio || 1;
      const s0 = Math.min(W / STAGE.w, H / STAGE.h);
      stageS = Math.floor(s0 * STAGE.w * dpr + 1e-6) / (STAGE.w * dpr);
      const r = box.getBoundingClientRect(), snap = (v) => Math.round(v * dpr) / dpr;
      const tx = snap(r.left + (W - STAGE.w * stageS) / 2) - r.left, ty = snap(r.top + (H - STAGE.h * stageS) / 2) - r.top;
      const s = String(+stageS.toFixed(6)), key = s + '|' + tx.toFixed(3) + '|' + ty.toFixed(3);
      if (key === last) return;
      last = key;
      play.style.setProperty('--bq-s', s); document.documentElement.style.setProperty('--bq-stage-s', s);
      play.style.setProperty('--bq-tx', tx.toFixed(3) + 'px'); play.style.setProperty('--bq-ty', ty.toFixed(3) + 'px');
      box.classList.add('is-fit');
      document.dispatchEvent(new CustomEvent('bq-stagefit', { detail: { s: stageS } }));
    };
    fit();
    requestAnimationFrame(fit); // position settles after the element head / fonts lay out
    if (window.ResizeObserver) { const ro = new ResizeObserver(fit); ro.observe(box); cleanups.push(() => ro.disconnect()); }
    window.addEventListener('resize', fit); cleanups.push(() => window.removeEventListener('resize', fit)); // position-only moves (no size change)
  }
  /* element <style> blocks (theme 8): viewport @media (width/height/orientation/aspect) are switched off and vw/vh/vmin/vmax become px
     of the 1180×820 reference screen, so nothing inside the stage reacts to the window. Teacher pages / print styles are left alone. */
  const VP_MQ = /(width|height|aspect-ratio|orientation)/, VP_U = /(-?\d*\.?\d+)(?:s|d|l)?(vw|vh|vmin|vmax)\b/g, VP_SKIP = /^(st-plan7|x7-print-st)$/;
  const vpPx = (v) => v.replace(VP_U, (m, n, u) => +(parseFloat(n) * (u === 'vw' ? 1180 : u === 'vh' ? 820 : u === 'vmin' ? 820 : 1180) / 100).toFixed(2) + 'px');
  function tameRules(rules) {
    for (const r of Array.from(rules || [])) {
      if (r.media && r.cssRules) { const mt = r.media.mediaText || ''; if (VP_MQ.test(mt) && !/print/.test(mt)) { try { r.media.mediaText = 'not all'; } catch (e) { /* */ } continue; } }
      if (r.cssRules) { tameRules(r.cssRules); continue; }
      if (!r.style) continue;
      for (const p of Array.from(r.style)) {
        const v = r.style.getPropertyValue(p); VP_U.lastIndex = 0;
        if (v && VP_U.test(v)) { VP_U.lastIndex = 0; try { r.style.setProperty(p, vpPx(v), r.style.getPropertyPriority(p)); } catch (e) { /* */ } }
      }
    }
  }
  function tameStyle(el) { if (!el || el.tagName !== 'STYLE' || el._bqTamed || VP_SKIP.test(el.id || '')) return; el._bqTamed = true; try { tameRules(el.sheet && el.sheet.cssRules); } catch (e) { /* */ } }
  /* element JS that asks the window's ORIENTATION (E10's «أَدِرِ الجِهازَ» card) gets «no match» in theme 8: the stage is always landscape
     (same rule as the element CSS above). Platform queries (drawer, reduced motion) have no orientation term and are untouched. */
  if (fixed8() && window.matchMedia) {
    const mm = window.matchMedia.bind(window);
    window.matchMedia = function (q) {
      if (!/orientation/i.test(String(q))) return mm(q);
      const noop = () => {};
      return { matches: false, media: String(q), onchange: null, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop, dispatchEvent: () => false };
    };
  }
  if (fixed8() && window.MutationObserver) {
    document.querySelectorAll('head style').forEach(tameStyle);
    new MutationObserver((recs) => recs.forEach((r) => r.addedNodes.forEach(tameStyle))).observe(document.head, { childList: true });
    /* drag ghosts live in <body> (outside the scaled stage) with the stage unit --u copied from layout px → carry the scale too */
    new MutationObserver((recs) => recs.forEach((r) => r.addedNodes.forEach((n) => {
      if (n.nodeType !== 1 || !n.style || n._bqU) return;
      const u = parseFloat(n.style.getPropertyValue('--u'));
      if (u && stageS !== 1) { n._bqU = true; n.style.setProperty('--u', (u * stageS) + 'px'); }
    }))).observe(document.body, { childList: true });
  }

  /** صفحة العنصر: رأس + [تعليمة + مسرح] + نصّ مصاحب + تنقّل + دليل المعلّم (درج) */
  function frame(meta) {
    const content = $('#content');
    const stage = h('div.bq-stage.elp-stage');
    /* v0-12: النصّ المصاحب داخل صفّ التعليمة (فقاعة بجوار السمّاعة) — لا تحت الإطار ولا فوق الأزرار */
    const cap = h('p.bq-cap.elp-cap', { hidden: true, 'aria-live': 'polite' });
    BQ.audio.capEl = cap;
    const L = (life = { alive: true, timers: new Set() });
    let replayFn = null;
    let ins = { text: '', line: null, icon: null };
    const instrText = h('p.elp-instr-t');
    const fnChip = h('span.elp-fn', { 'aria-hidden': 'true' });
    const srText = h('span.sr-only');
    const sayBtn = h('button.elp-say', { type: 'button', 'aria-label': 'أَعِدِ التَّعْليمَةَ', title: 'أعد التعليمة (R)', onclick: () => { A.unlock(); if (replayFn) replayFn(); else if (ins.line) ctx.say(ins.line); } }, BQ.icon('speaker'), srText);
    const instr = h('div.bq-instr.elp-instr.is-empty', null, sayBtn, fnChip, h('div.elp-bubble', null, instrText, cap));
    function renderInstr() {
      const has = !!(ins.text || ins.line);
      const showText = !!ins.text; // v8: never hidden by a setting (owner: «من الخطأ أن يخفي التعليمات في النشاط»)
      instr.classList.toggle('is-empty', !has);
      instrText.textContent = (ins.text || '').replace(/ ([–-]) (?=\S{1,3}(?:\s|$|[)،؟.]))/g, '\u00a0$1\u00a0'); // TX-1: a syllable list «مَ – مِ – مُ» never breaks over two lines (layout only, same text)
      instrText.hidden = !showText;
      fnChip.hidden = showText || !has;
      fnChip.innerHTML = I[ins.icon || fnIcon(ins.text, ins.line)] || '';
      srText.textContent = ins.text ? ': ' + ins.text : '';
    }
    /* شريط الفعل داخل الإطار: يستقبل «أَكْمِلْ» وأمثاله إن وقعت خارج المساحة المرئيّة من المسرح (لا تمرير للوصول إليها) */
    const dock = h('div.elp-dock');
    const play = h('div.elp-play', null, instr, stage, dock);
    const fitBox = h('div.elp-fit', null, play); // v8 fixed stage: the free area; outside theme 8 it is display:contents
    const docked = new Set();
    const PRIM = '.kx-cont, .vp-go2, .bq-btn';
    const SKIP = '.bq-end, .bq-sess, .elp-cover, .bq-adult, .elp-dock';
    function dockCheck(btn) {
      if (!btn.isConnected || btn.closest(SKIP) || !stage.contains(btn)) return;
      const r = btn.getBoundingClientRect(); if (!r.height) return;
      const sr = stage.getBoundingClientRect();
      const top = Math.max(sr.top, 0), bot = Math.min(sr.bottom, innerHeight);
      if (r.bottom <= bot + 1 && r.top >= top - 1) return;
      let node = btn; const p = btn.parentElement;
      if (p && p !== stage && p.children.length <= 3 && [...p.children].every((c) => c.tagName === 'BUTTON')) node = p;
      const ph = document.createComment('bq-dock');
      node.before(ph); dock.append(node); docked.add({ ph, node });
    }
    const dockMO = window.MutationObserver ? new MutationObserver((recs) => {
      for (const r of recs) for (const n of r.addedNodes) {
        if (n.nodeType !== 1) continue;
        const list = n.matches(PRIM) ? [n] : [...n.querySelectorAll(PRIM)];
        list.forEach((b) => requestAnimationFrame(() => requestAnimationFrame(() => dockCheck(b))));
      }
      docked.forEach((d) => { if (!d.ph.isConnected || !d.node.isConnected) { d.node.remove(); docked.delete(d); } });
    }) : null;
    if (dockMO) { dockMO.observe(stage, { childList: true, subtree: true }); cleanups.push(() => dockMO.disconnect()); }

    /* دليل المعلّم: «للمعلّم» + «ملاحظات المراجِع» (مطويّة) */
    const adultBody = h('div.elp-adult-body');
    const metaEl = h('div.elp-meta-el');
    const metaData = h('div.elp-meta-data');
    const scrim = h('div.elp-scrim', { hidden: true });
    const closeBtn = h('button.bq-adult-x', { type: 'button', 'aria-label': 'إغلاق', onclick: () => toggleAdult(false) }, BQ.icon('close'));
    const adultPanel = h('aside.bq-adult.elp-adult', { hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'elp-adult-h', tabindex: '-1' },
      h('div.elp-adult-top', null, h('div', null, h('h3', { id: 'elp-adult-h' }, 'دليل المعلّم'), h('p.elp-adult-st', null, stationLine(meta))), closeBtn),
      meta.pinned ? h('p.elp-pin', null, BQ.icon('mouth'), h('span', null, meta.pinned)) : null,
      adultBody,
      h('section.elp-adult-meta.gd-notes', { hidden: true }, h('p.lbl', null, 'ملاحظات النشاط'), metaEl, metaData));
    const notesSec = adultPanel.querySelector('.gd-notes');
    const toolLbl = (full, short) => [h('span.elp-tool-l', null, full), h('span.elp-tool-s', { 'aria-hidden': 'true' }, short)];
    const adultBtn = h('button.elp-tool', { type: 'button', 'aria-label': 'دَلِيلُ الْمُعَلِّمِ', title: 'دَلِيلُ الْمُعَلِّمِ', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', onclick: () => toggleAdult() }, BQ.icon('adult'), toolLbl('دَلِيلُ الْمُعَلِّمِ', 'الدَّلِيلُ')); // FIX12 D-10: the three tools = voweled noun labels, one style
    let inertEls = [];
    function toggleAdult(v) {
      const on = v == null ? adultPanel.hidden : v;
      if (on === !adultPanel.hidden) return;
      adultPanel.hidden = !on; scrim.hidden = !on; adultBtn.setAttribute('aria-expanded', String(on));
      if (on) {
        inertEls = [head, play, nav, $('.menu'), $('.hdr'), $('.footer')].filter(Boolean);
        inertEls.forEach((e) => { e.inert = true; });
        document.addEventListener('keydown', drawerKeys, true);
        setTimeout(() => closeBtn.focus(), 30);
      } else {
        inertEls.forEach((e) => { e.inert = false; }); inertEls = [];
        document.removeEventListener('keydown', drawerKeys, true);
        if (adultBtn.isConnected) adultBtn.focus({ preventScroll: true });
      }
    }
    function drawerKeys(e) {
      if (adultPanel.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); toggleAdult(false); return; }
      if (e.key === 'Tab') {
        const f = $$('button, [href], summary, input, select, textarea, [tabindex]:not([tabindex="-1"])', adultPanel).filter((x) => !x.disabled && x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || !adultPanel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !adultPanel.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    }
    cleanups.push(() => { if (!adultPanel.hidden) { inertEls.forEach((e) => { e.inert = false; }); document.removeEventListener('keydown', drawerKeys, true); } });
    scrim.addEventListener('click', () => toggleAdult(false));
    const restartBtn = h('button.elp-tool', { type: 'button', 'aria-label': 'مِنَ الْبِدَايَةِ', title: 'مِنَ الْبِدَايَةِ', onclick: () => BQ.open(meta.id, { pos: posOf(meta.id), history: 'replace' }) }, BQ.icon('replay'), toolLbl('مِنَ الْبِدَايَةِ', 'الْإِعَادَةُ'));
    const muteBtn = h('button.elp-tool.elp-mute', { type: 'button', 'aria-pressed': String(!!BQ.state.muted), 'aria-label': BQ.state.muted ? 'تَشْغِيلُ الصَّوْتِ' : 'كَتْمُ الصَّوْتِ', title: BQ.state.muted ? 'تَشْغِيلُ الصَّوْتِ' : 'كَتْمُ الصَّوْتِ', onclick: () => BQ.setMuted(!BQ.state.muted) }, BQ.icon(BQ.state.muted ? 'mute' : 'speaker'), toolLbl('الصَّوْتُ', 'الصَّوْتُ'));
    if (BQ.state.muted) muteBtn.classList.add('is-on');
    const head = h('header.elp-head', null,
      h('div.elp-ic', null, h('img', { src: meta.icon, alt: '' })),
      h('div.elp-titles', null,
        h('p.elp-kicker', null, h('span', null, kicker(meta.id)), typeBadge(meta.id, 'is-sm')),
        h('h2.elp-title', { id: 'elp-t', tabindex: '-1' }, cleanName(meta.name))),
      h('div.elp-tools', { role: 'group', 'aria-label': 'أدوات المعلّم' }, adultBtn, muteBtn, restartBtn)); // v8: the CC toggle lives in the video player controls
    const nav = navBar(meta.id);
    const f = h('section.bq-frame.elp', { dataset: { el: meta.id }, 'aria-labelledby': 'elp-t' }, head, fitBox, nav, scrim, adultPanel);
    content.replaceChildren(f);
    stageFit(fitBox, play);
    const ctx = {
      meta, stage, frame: f,
      alive: () => L.alive && BQ.state.current === meta.id && f.isConnected,
      say(lineId, opt) { return ctx.alive() ? BQ.audio.play(lineId, opt) : Promise.resolve(); },
      later(fn, ms) { const t = setTimeout(() => { L.timers.delete(t); if (ctx.alive()) fn(); }, ms); L.timers.add(t); return t; },
      sleep(ms) { return new Promise((r) => { if (!ctx.alive()) return r(); const t = setTimeout(() => { L.timers.delete(t); r(); }, ms); L.timers.add(t); }); },
      instruction(text, lineId, o) {
        ins = { text: text || '', line: lineId || null, icon: (o && o.icon) || null };
        renderInstr();
        if (lineId) { replayFn = () => ctx.say(lineId); return ctx.say(lineId); }
        return Promise.resolve();
      },
      onReplay(fn) { replayFn = fn; },
      /* v7: دليل المعلّم من SPEC يبقى؛ ملاحظات العنصر في قسم «ملاحظات النشاط» (لا على شاشة الطفل) */
      adultNote(html) { if (html && html.nodeType) metaEl.replaceChildren(html); else metaEl.innerHTML = html || ''; notesSec.hidden = !metaEl.childNodes.length; },
      adult(html) { ctx.adultNote(html); },
      adultMeta(html) { metaData.innerHTML = html || ''; notesSec.hidden = !(metaEl.childNodes.length || metaData.childNodes.length); },
      /* v7 */
      record(skill, ok, extra) { return BQ.mastery ? BQ.mastery.record(skill, ok, meta.id, extra) : null; },
      review: (BQ.state.openOpt && BQ.state.openOpt.review) || null,
      step: (BQ.state.openOpt && BQ.state.openOpt.step) || null,
      img: (k) => BQ.img7(k), hasImg: (k) => BQ.hasImg7(k),
      audioSrc: (id) => BQ.audioSrc(id), hasAudio: (id) => BQ.hasAudio(id),
      placeholder(text) { return placeholderCard(stage, meta, text); },
      endCard(o) { return UI.endCard(stage, o); },
      openAdult: () => toggleAdult(true),
      done() { BQ.markDone(meta.id); },
      onCleanup(fn) { cleanups.push(fn); },
      clear() { BQ.audio.stop(); stage.replaceChildren(); },
      age: () => BQ.state.age,
      _renderInstr: renderInstr,
      stageScale: () => BQ.stageScale(), // v8 fixed stage: visual px per layout px (1 outside theme 8)
    };
    adultBody.replaceChildren(h('div', { html: guideHtml(meta) }));
    return ctx;
  }
  /* ---------- دليل المعلّم v7: guide_v7.json (SPEC) بمرونة، وإلا نصّ الـPLAN من البيانات ---------- */
  const esc = (x) => String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const GL = { what: 'ماذا يحدث في العنصر', how_to_run: 'طريقة التشغيل', how_to_correct: 'كيف تصحّح', teacher_rules: 'قواعد للمعلّم', lesson_goal: 'هدف الدرس', breaks: 'الاستراحات', goal: 'ماذا سيتمكّن الطالب من فعله', objective: 'ماذا سيتمكّن الطالب من فعله', can_do: 'ماذا سيتمكّن الطالب من فعله', outcome: 'الناتج',
    desc: 'وصف العنصر', description: 'وصف العنصر', summary: 'وصف العنصر', purpose: 'الغرض التعليمي', method: 'كيف يخدم المنهجية', rationale: 'لماذا هنا', why: 'لماذا هنا',
    flow: 'مسار النشاط', steps: 'مسار النشاط', run: 'طريقة التشغيل', how: 'طريقة التشغيل', teacher: 'دور المعلّم', teacher_role: 'دور المعلّم', teacher_text: 'للمعلّم', guide: 'للمعلّم', text: 'للمعلّم',
    before: 'قبل النشاط', during: 'أثناء النشاط', after: 'بعد النشاط', items: 'البنود', attempts: 'سياسة المحاولات', attempts_policy: 'سياسة المحاولات',
    success: 'معيار النجاح', success_criterion: 'معيار النجاح', criterion: 'معيار النجاح', feedback: 'التغذية الراجعة', correct: 'كيف تصحّح', fix: 'كيف تصحّح', errors: 'أخطاء شائعة', common_errors: 'أخطاء شائعة',
    observe: 'ماذا تلاحظ وتسجّل', notes: 'ملاحظات', differentiation: 'التمايز', support: 'دعم إضافيّ', extension: 'إثراء', time: 'المدّة', duration: 'المدّة',
    skills: 'مهارات دليل الإتقان', mastery: 'دليل الإتقان', outcomes: 'النواتج', materials: 'المواد', print: 'للطباعة', home: 'في البيت' };
  const SKIPK = /^(id|name|title|title_ar|kind|type|owner|lines|line_ids|audio|art|assets|speaker|status|version|outcome_ids|skills|time|parent_role)$/; // النواتج والمهارات والمدّة تُعرض من البيانات أسفل الدليل
  function gv(v, depth) {
    if (v == null || v === '') return '';
    if (Array.isArray(v)) {
      if (!v.length) return '';
      if (v.every((x) => typeof x !== 'object' || x == null)) return '<ul class="do">' + v.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
      return '<ol class="do">' + v.map((x) => '<li>' + (typeof x === 'object' ? gObj(x, depth + 1, true) : esc(x)) + '</li>').join('') + '</ol>';
    }
    if (typeof v === 'object') return gObj(v, depth + 1);
    return '<p>' + esc(v) + '</p>';
  }
  function gObj(o, depth, inline) {
    return Object.keys(o).filter((k) => !SKIPK.test(k)).map((k) => {
      const lbl = GL[k] || GL[k.toLowerCase()] || k.replace(/_/g, ' ');
      const body = gv(o[k], depth || 0); if (!body) return '';
      return inline ? '<div class="gd-sub"><b>' + esc(lbl) + ':</b> ' + body + '</div>' : '<section class="gd-row"><p class="lbl">' + esc(lbl) + '</p>' + body + '</section>';
    }).join('');
  }
  BQ.guideFor = function (id) {
    const G = D.guide7; if (!G || typeof G !== 'object') return null;
    const pool = G.elements || G.guide || G;
    if (Array.isArray(pool)) return pool.find((x) => x && (x.id === id || x.element === id)) || null;
    return pool[id] || null;
  };
  const skillLabel = (s) => { const k = (D.skills || []).find((x) => x.id === s); return k ? k.label : s; };
  function guideHtml(meta) {
    const g = BQ.guideFor(meta.id);
    const head = '<p class="goal"><b>' + esc(meta.kind_ar) + ' · ' + esc(meta.time_label) + ':</b> ' + esc(meta.goal) + '</p>';
    const outs = (meta.outcomes || []).length ? '<section class="gd-row"><p class="lbl">نواتج التعلّم</p><ul class="do">' + meta.outcomes.map((n) => '<li><b>' + AR(n) + '.</b> ' + esc((D.outcomes || [])[n - 1]) + '</li>').join('') + '</ul></section>' : '<section class="gd-row"><p class="lbl">نواتج التعلّم</p><p>عنصر تعزيز (وسيلة لا ناتج مستقلّ).</p></section>';
    const sk = (meta.skills || []).length ? '<section class="gd-row"><p class="lbl">مهارات دليل الإتقان</p><p>' + meta.skills.map((s) => esc(s + ' ' + skillLabel(s))).join(' · ') + '</p></section>' : '';
    let body;
    if (g) body = typeof g === 'string' ? '<section class="gd-row"><p>' + esc(g) + '</p></section>' : gObj(g, 0);
    else body = '<section class="gd-row"><p class="lbl">وصف العنصر</p><p>' + esc(meta.desc) + '</p></section>' +
      ((meta.run || []).length ? '<section class="gd-row"><p class="lbl">طريقة التشغيل</p><ol class="do">' + meta.run.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ol></section>' : '') +
      '<p class="gd-src">النصّ من خطّة الدرس (v8 — مسوّدة) إلى أن يصل دليل الفريق العلمي.</p>';
    const pr = meta.id === 'E16' ? '' : '';
    return head + body + outs + sk + pr + '<section class="gd-row"><p class="lbl">المدّة</p><p>' + esc(meta.time_label) + '</p></section>';
  }
  BQ.guideHtml = guideHtml;
  /** بطاقة «قيد الإنتاج» الموحّدة (للطفل: العنوان المشكول + «التَّالِي» فقط) */
  function placeholderCard(stage, meta, text) {
    const CLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7v5.5l3.5 2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
    const cov = meta.cover_file || '';
    const el = h('div.v7-ph', { role: 'region', 'aria-label': meta.cover_title || meta.name || '' },
      cov ? h('img', { src: cov, alt: '', draggable: 'false' }) : null,
      h('div.v7-ph-in', null,
        UI.brq('think', 'v7-ph-brq'),
        h('p.v7-ph-t', null, meta.cover_title || meta.name),
        text ? h('p.v7-ph-n', null, text) : null,
        h('button.bq-btn', { type: 'button', onclick: () => { A.unlock(); BQ.goNext(); } }, 'التَّالِي', BQ.icon('next'))));
    stage.append(el);
    return el;
  }
  BQ.placeholder = (stage, meta, text) => placeholderCard(stage, meta || {}, text);
  function navBar(id) {
    const pos = posOf(id);
    const pv = prevFrom(id, pos);
    const nx = nextFrom(id, pos);
    const small = 'التَّالِي';
    return h('nav.elp-nav', { 'aria-label': 'التنقّل في مسار الدرس' },
      pv ? h('button.elp-navbtn.ghost', { type: 'button', onclick: () => BQ.open(pv.id, { pos: pv.pos, src: 'next' }) }, BQ.icon('prev'), h('span', null, h('small', null, 'السَّابِقُ'), nameOf(pv.id))) : h('span'),
      nx ? h('button.elp-navbtn.primary.nextbtn', { type: 'button', onclick: () => { A.unlock(); BQ.goNext(); } }, h('span', null, h('small', null, small), nameOf(nx.id)), BQ.icon('next')) : h('span'));
  }

  /* ---------- غلاف العنصر (v0-12): لوحة مصمَّمة بملء منطقة اللعب ----------
     الفنّ: media/cover/ELxx.webp إن وُجد (١٦:١٠، الجهة اليمنى أهدأ للعنوان)، وإلا الصورة البطلة للعنصر بتدرّج ناعم.
     فوقه: رقم العنصر والجلسة · العنوان مشكولاً · جملة للطفل · بارق المتحرّك بوضعية تناسب العنصر · زرّ بدء دائريّ كبير
     · سطر المعلّم ثانوياً. لون الجلسة لمسة (أ سماويّ · ب مرجانيّ · ج أخضر · د بنفسجيّ). الحركة تحترم prefers-reduced-motion.
     النصوص هنا مسوّدة للمراجعة؛ يمكن أن تأتي من البيانات: meta.cover_title · meta.cover_child · meta.cover_pose. */
  /* v7: أغلفة الأصل نفسها (الرسم + «n مِنْ ١٦» + العنوان المشكول + جملة الطفل + بارق + «ابْدَأْ»)؛ الفنّ: media/cover7/<ID>.webp (cover_file)
     أو صورة البطل من img7 (meta.hero)، وإلا خلفية هادئة + بارق — ولا رمز «م» قبل E06 (الصوت قبل الرمز). */
  const COVER = {};
  function designedCover(id) { const m = BQ.meta(id) || {}; return Promise.resolve(m.cover_file || null); }
  BQ.coverInfo = (id) => { const m = BQ.meta(id) || {}; const c = COVER[id] || []; return { title: m.cover_title || c[0] || cleanName(m.name), child: m.cover_child || c[1] || '', pose: m.cover_pose || c[2] || 'wave' }; };
  /* v8 (COVERS · THEME8 §D6 · قالبا المالك 2026-10-05) · OWNER R3 «الأغلفة» (2026-10-05، مُلزِم): كلّ غلاف = صورة + عنوان + زرّ واحد فقط —
     بلا شارة «نَشاطٌ تَفاعُلِيٌّ» / «فيديو» وبلا مدّة. غلاف الفيديو بتخطيط غلاف النشاط نفسه حرفيّاً (الصورة يساراً بحافّتها المنحنية، العنوان والزرّ يميناً)؛
     الفرق الوحيد: مكان «اِبْدَأِ النَّشاطَ» زرّ تشغيل دائريّ أصفر كبير (‎≥ 88 بكسل على الشاشة) — لا زرّ فوق الصورة.
     الصورة media/img8/cov8_<ID>.webp (GPT)، وإن غابت فالغلاف القديم cover_file. البطاقة كلّها تبدأ العنصر. */
  const BLANK8 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const COV8_POS = { E06: '3% 50%', E15: '2% 50%', E16: '3% 50%' }; // قصّ خاصّ لصورة غلاف (الشخصية قريبة من الحافة)
  function cover8(ctx, onStart) {
    const meta = ctx.meta, id = meta.id, info = BQ.coverInfo(id), isVid = meta.kind === 'video';
    const play = ctx.frame.querySelector('.elp-play');
    if (play) play.classList.add('has-cover');
    ctx.frame.classList.add('has-cover');
    let c = null;
    let started = false; // the whole card is one tap target (≥ 64 px at every stage scale) → start only once
    const go = () => { if (started) return; started = true; A.unlock(); if (play) play.classList.remove('has-cover'); ctx.frame.classList.remove('has-cover'); if (c) c.remove(); onStart(); };
    /* known v8 covers (data.js «cov8», scanned by build_data_v7.py) → never request a missing file (no 404); old data without the list → try + fallback */
    /* ART-16 · DECIDE_DESIGN U1 d2 «شريط الحكاية»: a cov9_<ID>.webp picture (data «cov9») → full-bleed picture + cream ribbon (inline SVG)
       + title zone (right) + ONE button zone (left); otherwise the older cov8 layout below stays as fallback. */
    const d2 = Array.isArray(D.cov9) && D.cov9.includes(id);
    const has8 = !d2 && (!Array.isArray(D.cov8) || D.cov8.includes(id));
    const img = h('img', { src: d2 ? 'media/img8/cov9_' + id + '.webp' : has8 ? 'media/img8/cov8_' + id + '.webp' : (meta.cover_file || BLANK8), alt: '', decoding: 'async', draggable: 'false' });
    if (has8 && COV8_POS[id]) img.style.objectPosition = COV8_POS[id];
    img.addEventListener('error', () => { img.style.objectPosition = ''; if (meta.cover_file) img.src = meta.cover_file; }, { once: true });
    const tid = 'elp-cv-t';
    const title = h('h3.bq8-cover__title', { id: tid }, info.title);
    const stop = (e) => { e.stopPropagation(); go(); };
    const btn = isVid
      ? h('button.bq8-cover__playbtn', { type: 'button', 'aria-label': 'شَغِّلِ الفيديو', onclick: stop })
      : h('button.bq8-cover__go', { type: 'button', onclick: stop }, 'اِبْدَأِ النَّشاطَ', h('i.bq8-ic.bq8-ic--next', { 'aria-hidden': 'true' }));
    const card = d2
      ? h('div.bq8-cover.bq8-cover--d2.bq8-cover--' + (isVid ? 'video' : 'activity'), { role: 'group', 'aria-labelledby': tid, onclick: go },
          h('div.bq8-cover__art', null, img),
          h('div.bq8-cover__ribbon', { 'aria-hidden': 'true', html: COV9_RIBBON }),
          h('div.bq8-cover__tz', null, title),
          h('div.bq8-cover__bz', null, btn))
      : h('div.bq8-cover.bq8-cover--' + (isVid ? 'video' : 'activity'), { role: 'group', 'aria-labelledby': tid, onclick: go },
          h('div.bq8-cover__art', null, img),
          h('div.bq8-cover__side', null, title, btn));
    c = h('div.elp-start.elp-cover', { dataset: { el: id } }, card);
    (play || ctx.stage).append(c);
    if (d2) cov9InkFit(title); else cov8FitTitle(title);
  }
  /* d2 ribbon (U1 §2): ONE inline SVG in stage units 1180×820 — paper top edge y 600, scroll curls x 0–70 / 1110–1180, #FBF3E0→#F6EAD0, soft navy shadow */
  const COV9_RIBBON = '<svg viewBox="0 0 1180 820" preserveAspectRatio="none" focusable="false"><defs>'
    + '<linearGradient id="cv9p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF3E0"/><stop offset="1" stop-color="#F6EAD0"/></linearGradient>'
    + '<linearGradient id="cv9c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EBD9B4"/><stop offset="1" stop-color="#E0C99C"/></linearGradient>'
    + '<filter id="cv9s" x="-5%" y="-30%" width="110%" height="160%"><feDropShadow dx="0" dy="-4" stdDeviation="7" flood-color="#0B2D4F" flood-opacity=".18"/></filter></defs>'
    + '<path d="M0 600 H1180 V820 H0 Z" fill="url(#cv9p)" filter="url(#cv9s)"/>'
    + '<path d="M0 600 Q35 588 70 600 V786 Q35 774 0 786 Z" fill="url(#cv9c)" opacity=".85"/>'
    + '<path d="M1180 600 Q1145 588 1110 600 V786 Q1145 774 1180 786 Z" fill="url(#cv9c)" opacity=".85"/>'
    + '<path d="M70 600 V786 M1110 600 V786" stroke="#D8C08F" stroke-width="2" opacity=".7"/>'
    + '<path d="M0 601 H1180" stroke="#FFFDF6" stroke-width="3" opacity=".9"/></svg>';
  /* U1 §3 ink-fit: the title glyphs INCLUDING tashkeel (canvas actualBoundingBox) sit centred inside the safe ink box x 575–1110 · y 612–736
     of the 1180×820 stage; one line, max 96 / min 64 px (below 64 the content team rewords — logged, never wrapped). Layout px of the card,
     so the result is the same at every stage scale. */
  const COV9_SAFE = [575, 612, 1110, 736];
  function cov9InkFit(t) {
    const fit = () => {
      if (!t.isConnected) return;
      const card = t.closest('.bq8-cover'), z = t.parentNode, k = card.offsetWidth / 1180;
      if (!(k > 0)) return;
      const S = COV9_SAFE.map((v) => v * k), W = S[2] - S[0], H = S[3] - S[1], T = t.textContent;
      const ff = getComputedStyle(t).fontFamily, cv = document.createElement('canvas').getContext('2d');
      cv.direction = 'rtl'; cv.textAlign = 'right'; cv.textBaseline = 'alphabetic';
      const m = (f) => { cv.font = '700 ' + f + 'px ' + ff; const r = cv.measureText(T); return { L: r.actualBoundingBoxLeft, R: r.actualBoundingBoxRight, A: r.actualBoundingBoxAscent, D: r.actualBoundingBoxDescent }; };
      let f = 96 * k, q = m(f);
      while (f > 30 * k && (q.L + q.R > W || q.A + q.D > H)) { f -= 1; q = m(f); }
      if (f < 64 * k) console.warn('cover title below 64 px — needs a shorter title (content team):', T);
      t.style.fontSize = f + 'px';
      /* canvas textAlign right: x = right anchor; ink spans [x-L, x+R]; text-box right edge = anchor. Baseline from a 0-size marker. */
      let mk = t.querySelector('.bq8-bl'); if (!mk) { mk = document.createElement('span'); mk.className = 'bq8-bl'; t.appendChild(mk); }
      const sc = card.getBoundingClientRect().width / card.offsetWidth || 1, tb = t.getBoundingClientRect();
      const base = (mk.getBoundingClientRect().top - tb.top) / sc, tw = tb.width / sc;
      const cx = (S[0] + S[2]) / 2, cy = (S[1] + S[3]) / 2, xr = cx - (q.R - q.L) / 2, yb = cy - (q.D - q.A) / 2;
      t.style.left = (xr - tw) + 'px'; t.style.top = (yb - base) + 'px';
      t.dataset.ink = [xr - q.L, yb - q.A, xr + q.R, yb + q.D].map((v) => Math.round(v / k)).join(',');
      t.dataset.fs = Math.round(f / k);
    };
    requestAnimationFrame(fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }
  /* العنوان سطرٌ واحد دائماً (عيب المالك E16: حركات «الأُ» في فراغ السطرين تصطدم بالسطر الأوّل) — يُصغَّر الخطّ حتى يتّسع؛
     المسرح ثابت 1180×820 فالقياس بوحدات التخطيط نفسها في كلّ مقاس. */
  function cov8FitTitle(t) {
    const fit = () => {
      if (!t.isConnected) return;
      t.style.fontSize = '';
      const side = t.parentNode, ss = getComputedStyle(side);
      const avail = side.clientWidth - parseFloat(ss.paddingLeft) - parseFloat(ss.paddingRight), need = t.scrollWidth;
      if (avail > 0 && need > avail) t.style.fontSize = Math.max(30, parseFloat(getComputedStyle(t).fontSize) * avail / need * 0.97).toFixed(1) + 'px';
    };
    requestAnimationFrame(fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }
  function cover(ctx, def, onStart) {
    if (document.documentElement.dataset.theme === '8') return cover8(ctx, onStart);
    const meta = ctx.meta, id = meta.id;
    const info = BQ.coverInfo(id);
    const hk = (def && def.hero) || meta.hero;
    const heroSrc = hk && BQ.hasImg7(hk) ? BQ.img7(hk) : null;
    const glyphOK = (meta.menu || 0) >= 6; // الرمز من «اكتشف الحرف» فصاعداً
    const play = ctx.frame.querySelector('.elp-play');
    if (play) play.classList.add('has-cover');
    ctx.frame.classList.add('has-cover');
    const go = () => { if (play) play.classList.remove('has-cover'); ctx.frame.classList.remove('has-cover'); c.remove(); onStart(); };
    const tid = 'elp-cv-t';
    const early = false;

    /* الفنّ */
    const art = h('div.cv-art.is-wait' + (heroSrc ? '' : glyphOK ? '.is-glyph' : '.is-plain'), { 'aria-hidden': 'true' },
      heroSrc ? h('img.cv-img', { src: heroSrc, alt: '', decoding: 'async', draggable: 'false' }) : glyphOK ? h('span.cv-glyph', null, 'م') : h('span.cv-plain', null, h('img', { src: meta.icon, alt: '' })));
    designedCover(id).then((src) => {
      // الغلاف المصمَّم يحمل بارق نفسه ⇒ لا بارق متحرّك فوقه (يُخفى إلى أن يُعرف وجود الغلاف)
      art.classList.remove('is-wait');
      if (!src) { brq.classList.remove('is-wait'); return; }
      brq.remove();
      if (!c.isConnected) return;
      art.classList.remove('is-glyph', 'is-plain'); art.classList.add('is-designed');
      art.replaceChildren(h('img.cv-img', { src, alt: '', decoding: 'async', draggable: 'false' }));
    });

    /* بارق + زرّ البدء */
    const brq = UI.brq(info.pose, 'cv-brq.is-wait');
    let action;
    if (early) {
      action = h('button.bq-btn.ghost.elp-preview.cv-preview', { type: 'button', onclick: () => { A.unlock(); go(); } }, BQ.icon('adult'), 'معاينة الآن (للمعلّم)');
    } else {
      action = h('button.bq-start.cv-start', { type: 'button', 'aria-label': 'ابْدَأ: ' + info.title, onclick: () => { A.unlock(); go(); } },
        h('span.cv-start-disc', { 'aria-hidden': 'true' }, h('span.bq-start-ic', { html: I.play })),
        h('span.cv-start-l', null, 'ابْدَأ'));
    }
    const c = h('div.elp-start.elp-cover', { role: 'group', 'aria-labelledby': tid, dataset: { el: id } }, h('div.cv-in', null,
      art,
      h('div.cv-shade', { 'aria-hidden': 'true' }),
      h('div.cv-text', null,
        h('p.cv-kicker', { 'aria-label': kicker(id) }, h('span.cv-num', { 'aria-hidden': 'true' }, AR(meta.menu || '')), h('span', { 'aria-hidden': 'true' }, 'مِن ' + AR(D.elements.length)), typeBadge(id, 'cv-type')),
        h('h3.cv-title', { id: tid }, info.title),
        info.child ? h('p.cv-child', { lang: 'ar' }, info.child) : null),
      h('div.cv-go', null, brq, action)));
    (play || ctx.stage).append(c);
  }

  /* ---------- التمرير والتركيز ---------- */
  const behavior = () => (BQ.reduced() ? 'auto' : 'smooth');
  /* v0-12: الإطار يبدأ تحت الرأس مباشرةً ويتّسع للشاشة ⇒ النشاط كلّه مرئيّ عند أعلى الصفحة؛ لا تمرير إلى الإطار */
  function toTop() { const se = document.scrollingElement || document.documentElement; if (se && se.scrollTop > 0) window.scrollTo({ top: 0, behavior: 'auto' }); }
  function reveal() { toTop(); }
  function focusIn(root) {
    const f = $$('button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])', root).find((x) => x.offsetParent !== null && !x.closest('.elp-instr'));
    const t = f || $('.elp-say', root.closest('.elp') || document);
    if (t) try { t.focus({ preventScroll: true }); } catch (e) { /* */ }
  }

  /* ---------- الفتح والتاريخ ---------- */
  function setHistory(id, pos, mode) {
    if (mode === 'none') return;
    const st = { id, pos: pos == null ? -1 : pos };
    try {
      if (mode === 'push' && location.hash !== '#' + id) history.pushState(st, '', '#' + id);
      else history.replaceState(st, '', '#' + id);
    } catch (e) { /* */ }
  }
  function markMenu(id, pos) {
    $$('.item').forEach((b) => {
      const on = b.dataset.id === id && (b.dataset.pos == null || +b.dataset.pos === pos || !$$('.item[data-pos][data-id="' + id + '"]').some((x) => +x.dataset.pos === pos));
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    // القائمة تتمرّر داخلياً فقط (لا تمرير للصفحة): تُظهر العنصر الحاليّ
    const menu = $('.menu'); const sel = $('.menu-list:not([hidden]) .item[aria-current]');
    if (menu && sel) { const mr = menu.getBoundingClientRect(), r = sel.getBoundingClientRect(); if (r.top < mr.top + 90 || r.bottom > mr.bottom - 8) menu.scrollTop += r.top - mr.top - mr.height / 2 + r.height / 2; }
  }
  let lastEl = null, pendingAge = null;
  /* ---------- v7: التحميل الكسول لملفّات العناصر ---------- */
  const scripts = {};
  BQ.loadScript = (src) => scripts[src] || (scripts[src] = new Promise((res, rej) => {
    const el = document.createElement('script');
    el.src = src + (D.build ? (src.includes('?') ? '&' : '?') + 'v=' + D.build : '');
    el.onload = () => res(); el.onerror = () => { delete scripts[src]; el.remove(); rej(new Error('load ' + src)); };
    document.head.append(el);
  }));
  const builtin = (id) => { const m = BQ.meta(id); return m && m.kind === 'video' && BQ.video && BQ.video.element7def ? BQ.video.element7def(id) : null; };
  BQ.ensureDef = function (id) {
    if (BQ.defs[id]) return Promise.resolve(BQ.defs[id]);
    const listed = (D.el7 || []).includes(id);
    if (!listed && !(scan && /^E\d\d$/.test(id) && !builtin(id))) return Promise.resolve(builtin(id));
    return BQ.loadScript('js/el7/' + id + '.js').then(() => BQ.defs[id] || builtin(id)).catch((e) => { if (listed) console.warn('[v7] ' + e.message); return builtin(id); });
  };
  const PAGES = { plan: { sel: '#plan', title: 'خطة الدرس · صوت الميم · بارق', render: () => window.BQ_PLAN }, mastery: { sel: '#mastery', title: 'دليل الإتقان · صوت الميم · بارق', render: () => BQ.masteryView } };
  /** BQ.open(id, {pos, skipCover, review, step, history:'push'|'replace'|'none', src:'menu'|'next'|'boot'|'history'}) */
  BQ.open = function (id, opt) {
    opt = opt || {};
    if (id === 'last') id = lastEl || BQ.path()[0].id;
    id = alias(id);
    const src = opt.src || 'api';
    const hmode = opt.history || (src === 'boot' ? 'replace' : 'push');
    if (!PAGES[id] && !BQ.meta(id)) return;
    teardown();
    if (pendingAge) applyAge(pendingAge, true);
    if (PAGES[id]) { showPage(id, hmode); return; }
    hidePage();
    const meta = BQ.meta(id);
    BQ.state.current = id;
    BQ.state.seqPos = posOf(id, opt.pos);
    BQ.state.openOpt = { review: opt.review || null, step: opt.step || null };
    lastEl = id;
    const saveLast = () => store.set('last', { id, pos: BQ.state.seqPos, t: Date.now() });
    if (src !== 'boot') saveLast(); // R-01: فتح الصفحة وحده لا يمحو نقطة المتابعة المحفوظة
    markMenu(id, BQ.state.seqPos);
    setHistory(id, BQ.state.seqPos, hmode);
    updateProgress();
    childHeader();
    const ctx = frame(meta);
    BQ.state.openOpt = null;
    const defP = BQ.ensureDef(id); // يبدأ التحميل أثناء الغلاف
    const run = () => {
      const spin = h('div.v7-load', { role: 'status', 'aria-label': 'جارٍ التحميل' }, h('span.v7-spin', { 'aria-hidden': 'true' }));
      ctx.stage.append(spin);
      defP.then((def) => {
        spin.remove();
        if (!ctx.alive()) return;
        if (!def) { placeholderCard(ctx.stage, meta); return; }
        ctx.frame.classList.add('is-running');
        try { def.render(ctx.stage, ctx); } catch (e) { console.error(e); ctx.stage.replaceChildren(); placeholderCard(ctx.stage, meta); }
      });
    };
    const started = () => { if (src === 'boot') saveLast(); run(); requestAnimationFrame(() => { reveal(ctx.frame.querySelector('.elp-play'), true); focusIn(ctx.stage); }); };
    if (opt.skipCover || opt.review) started(); else cover(ctx, null, started);
    updateResume();
    if (src !== 'boot') requestAnimationFrame(() => {
      reveal(ctx.frame);
      if (src !== 'menu' && src !== 'history') { const t = $('#elp-t'); if (t) t.focus({ preventScroll: true }); }
    });
  };

  /* «خطة الدرس» (#plan) و«دليل الإتقان» (#mastery): صفحتان للمعلّم تُخفيان واجهة الطفل كلّها، ولهما «العودة إلى الدرس» */
  /* R1-1 (BLOCK): الصوت قبل الرمز — ترويسة الطفل محايدة «صَوْتٌ جَديدٌ» بشارة أذن في E01–E05 (وفي E06 قبل سطر الكشف)،
     وتصير «صَوْتُ «م»» بشارة «م» بعد الكشف (علم bq7_revealed) أو في E07 فصاعداً. صفحات المعلّم: «صَوْتُ المِيمِ». */
  const revealed = () => { try { return localStorage.getItem('bq7_revealed') === '1'; } catch (e) { return false; } };
  function childHeader() {
    const m = BQ.meta(BQ.state.current) || {};
    const on = revealed() || (m.menu || 0) >= 7;
    const lt = $('#lesson-title'), bd = $('.hdr-badge');
    if (lt) lt.textContent = on ? (lt.dataset.child || 'صَوْتُ «م»') : (lt.dataset.neutral || 'صَوْتٌ جَديدٌ');
    if (bd) { bd.classList.toggle('is-ear', !on); bd.innerHTML = on ? 'م' : I.ear; }
    document.title = on ? 'بارِق · صَوْتُ «م»' : 'بارِق · صَوْتٌ جَدِيدٌ'; // FIX12 D-03: no version/draft label on child screens
  }
  BQ.reveal = () => { try { localStorage.setItem('bq7_revealed', '1'); } catch (e) { /* */ } if (!document.body.classList.contains('show-plan')) childHeader(); };
  BQ.childHeader = childHeader;
  function showPage(name, hmode) {
    const P = PAGES[name];
    BQ.state.current = name;
    document.body.classList.add('show-plan');
    document.body.dataset.page = name;
    closeMenu(); closeAdultPop();
    markMenu(null, -1);
    const lv = $('#lessonView'); if (lv) lv.hidden = true;
    Object.keys(PAGES).forEach((k) => { const el = $(PAGES[k].sel); if (el) el.hidden = k !== name; });
    const p = $(P.sel);
    const R = P.render();
    if (p && R && (name === 'mastery' || !p.dataset.ready)) { R.render(p); p.dataset.ready = '1'; }
    setHistory(name, null, hmode || 'push');
    document.title = P.title;
    const lt = $('#lesson-title'); if (lt && lt.dataset.plan) lt.textContent = lt.dataset.plan; // اسم الدرس كاملاً في صفحة المعلّم وحدها
    const bd = $('.hdr-badge'); if (bd) { bd.classList.remove('is-ear'); bd.textContent = 'م'; }
    window.scrollTo({ top: 0, behavior: 'auto' }); requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
    const t = p && p.querySelector('.lp-bar-t h2, h2'); if (t) { t.setAttribute('tabindex', '-1'); try { t.focus({ preventScroll: true }); } catch (e) { /* */ } }
  }
  function hidePage() {
    if (!document.body.classList.contains('show-plan')) return;
    document.body.classList.remove('show-plan'); delete document.body.dataset.page;
    const lv = $('#lessonView'); if (lv) lv.hidden = false;
    Object.keys(PAGES).forEach((k) => { const el = $(PAGES[k].sel); if (el) el.hidden = true; });
    childHeader();
  }

  /* ---------- قائمة العناصر (درج على الهاتف/اللوح الطوليّ) و«للمعلّم» ---------- */
  const DRAWER_MQ = '(max-width: 1180px), (pointer: coarse) and (max-width: 1366px)'; // v7: درج على اللوح (طوليّ وأفقيّ) والهاتف؛ عمود ثابت يميناً على الكمبيوتر
  const isDrawer = () => !!(window.matchMedia && matchMedia(DRAWER_MQ).matches);
  function openMenu() {
    const m = $('.menu'), b = $('#menuBtn'), sc = $('#menuScrim'); if (!m || !isDrawer()) return;
    m.classList.add('is-open'); if (sc) sc.hidden = false; if (b) b.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    markMenu(BQ.state.current, BQ.state.seqPos);
    setTimeout(() => { const f = $('.menu-list .item[aria-current]') || $('.menu .item'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function closeMenu(refocus) {
    const m = $('.menu'), b = $('#menuBtn'), sc = $('#menuScrim'); if (!m || !m.classList.contains('is-open')) return;
    m.classList.remove('is-open'); if (sc) sc.hidden = true; if (b) b.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (refocus && b) b.focus({ preventScroll: true });
  }
  function closeAdultPop(refocus) {
    const p = $('#adultMenu'), b = $('#adultBtn'); if (!p || p.hidden) return;
    p.hidden = true; if (b) b.setAttribute('aria-expanded', 'false'); closeConfirm();
    if (refocus && b) b.focus({ preventScroll: true });
  }
  function toggleAdultPop() {
    const p = $('#adultMenu'), b = $('#adultBtn'); if (!p) return;
    if (!p.hidden) { closeAdultPop(); return; }
    closeMenu(); p.hidden = false; if (b) b.setAttribute('aria-expanded', 'true');
    const f = p.querySelector('input:checked') || p.querySelector('input, a, button'); if (f) setTimeout(() => f.focus({ preventScroll: true }), 30);
  }

  /* ---------- التقدّم والمتابعة ---------- */
  function updateProgress() {
    const n = BQ.state.done.size, t = D.elements.length;
    const el = $('#progress');
    if (el) {
      const c = el.querySelector('circle.val'); const L = 2 * Math.PI * 18;
      if (c) { c.style.strokeDasharray = L; c.style.strokeDashoffset = L * (1 - n / t); }
      const b = el.querySelector('b'); if (b) b.textContent = AR(n);
      el.setAttribute('aria-label', 'أُنْجِزَ ' + AR(n) + ' مِن ' + AR(t) + ' عُنْصُرًا');
    }
    const mc = $('#menuCount'); if (mc) mc.textContent = AR(n) + ' / ' + AR(t);
    updateResume();
  }
  /** وجهة «تابِعْ»: آخر عنصر لم يكتمل، أو ما بعده في المسار */
  function resumeTarget() {
    const p = BQ.path(); const last = store.get('last', null);
    if (!last || typeof last !== 'object') return p.length ? { id: p[0].id, pos: 0, fresh: true } : null;
    if (last.end) return p.length ? { id: p[0].id, pos: 0 } : null; // سجلّ قديم من «نهاية الجلسة»
    if (!BQ.meta(last.id)) return { id: p[0].id, pos: 0, fresh: true };
    if (!BQ.state.done.has(last.id)) return { id: last.id, pos: posOf(last.id, last.pos) };
    const n = nextFrom(last.id, posOf(last.id, last.pos));
    if (!n) { const p = BQ.path(), l = p[p.length - 1]; return { id: l.id, pos: p.length - 1 }; }
    return n;
  }
  function updateResume() {
    const r = resumeTarget(); const b = $('#resumeBtn'); const hs = $('#hdrStart');
    if (!r) return;
    const p0 = BQ.path()[0];
    const fresh = !BQ.state.done.size && (!!r.fresh || (p0 && r.id === p0.id));
    if (b) {
      b.querySelector('.lh-resume-l').textContent = fresh ? 'ابْدَأِ الدَّرْسَ' : 'تابِع';
      b.querySelector('.lh-resume-n').textContent = nameOf(r.id);
      b.setAttribute('aria-label', (fresh ? 'ابدأ الدرس: ' : 'تابع من حيث توقّفت: ') + nameOf(r.id));
    }
    if (hs) hs.textContent = fresh ? 'ابدأ الدرس' : 'تابع الدرس';
  }
  function resume() { const r = resumeTarget(); if (!r) return; A.unlock(); BQ.open(r.id, { pos: r.pos, src: 'next' }); }

  /* ---------- القائمة: قائمة واحدة ١–١٦ (v0-12: لا عرض بالجلسات) ---------- */
  function itemBtn(e, pos, extra) {
    const b = h('button.item' + (BQ.state.done.has(e.id) ? '.is-done' : '') + (extra || ''), { type: 'button', dataset: { id: e.id }, onclick: () => {
      closeMenu();
      if (BQ.state.current === e.id && (pos == null || pos === BQ.state.seqPos)) { reveal(); return; } // T15: لا إعادة صامتة
      BQ.open(e.id, { pos: pos == null ? undefined : pos, src: 'menu' });
    } },
      h('span.ic', null, h('img', { src: e.icon, alt: '' })),
      h('span.name', null, cleanName(e.name)), typeBadge(e.id, 'is-sm'),
      h('span.num', { 'aria-hidden': 'true' }, AR(e.menu)));
    if (pos != null) b.dataset.pos = String(pos);
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 15 11'); s.setAttribute('class', 'done'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = '<path d="M1.5 5.5 5.5 9.5 13.5 1.5"/>';
    b.append(s);
    return b;
  }
  function buildMenu() {
    const menu = $('#menu'); if (!menu) return;
    menu.replaceChildren();
    D.elements.slice().sort((a, b) => a.menu - b.menu).forEach((e) => menu.append(h('li', null, itemBtn(e))));
    updateProgress();
    markMenu(BQ.state.current, BQ.state.seqPos);
  }


  /* ---------- العمر ---------- */
  function applyAge(a, silent) {
    pendingAge = null;
    if (!AGES.includes(a)) return;
    BQ.state.age = a;
    BQ.state.cc = false; // v8: no caption setting for activities (video captions: BQ.state.vcc in the player)
    const root = $('.page-root'); if (root) root.dataset.age = a;
    $$('#ageSeg input').forEach((r) => { r.checked = r.value === a; });
    buildMenu();
    if (!silent) updateResume();
  }

  /* ---------- «بدء من جديد» بتأكيد داخل الصفحة ---------- */
  let confirmEl = null;
  function closeConfirm() { if (confirmEl) { confirmEl.remove(); confirmEl = null; document.removeEventListener('keydown', confirmKeys, true); } }
  function confirmKeys(e) { if (e.key === 'Escape' && confirmEl) { e.preventDefault(); const b = $('#resetBtn'); closeConfirm(); if (b) b.focus({ preventScroll: true }); } }
  function askReset(btn) {
    if (confirmEl) { closeConfirm(); return; }
    const yes = h('button.bq-btn.blue', { type: 'button', onclick: () => {
      BQ.state.done.clear(); store.set('done', []); store.del('last');
      if (BQ.mastery) BQ.mastery.reset(); // v7
      try { localStorage.removeItem('bq7_revealed'); } catch (x) { /* */ } childHeader();
      for (const e of D.elements) { try { localStorage.removeItem(PFX + 'ts-' + e.id); } catch (x) { /* */ } }
      $$('.item').forEach((i) => i.classList.remove('is-done'));
      updateProgress(); closeConfirm(); UI.toast('مُسح تقدّم الدرس.'); btn.focus({ preventScroll: true });
    } }, 'نعم، امسح');
    const no = h('button.bq-btn.ghost', { type: 'button', onclick: () => { closeConfirm(); btn.focus({ preventScroll: true }); } }, 'إلغاء');
    confirmEl = h('div.lh-confirm', { role: 'alertdialog', 'aria-label': 'تأكيد البدء من جديد' }, h('p', null, 'سيُمسح تقدّم الدرس ونتائج دليل الإتقان على هذا الجهاز. متابعة؟'), h('div', null, yes, no));
    btn.insertAdjacentElement('afterend', confirmEl);
    document.addEventListener('keydown', confirmKeys, true);
    no.focus({ preventScroll: true });
  }

  /* ---------- الإقلاع ---------- */
  function boot() {
    const d = store.get('done', []);
    BQ.state.done = new Set(Array.isArray(d) ? d.filter((x) => typeof x === 'string' && BQ.meta(x)) : []);
    const a = store.get('age', '4-6');
    applyAge(AGES.includes(a) ? a : '4-6', true);
    const hs = $('#hdrStart'); if (hs) hs.addEventListener('click', resume);
    const rb = $('#resumeBtn'); if (rb) rb.addEventListener('click', resume);
    const nt = $('#navToggle'); if (nt) nt.addEventListener('click', () => { const n = $('.header .nav'); const on = !n.classList.contains('is-open'); n.classList.toggle('is-open', on); nt.setAttribute('aria-expanded', String(on)); });
    window.addEventListener('popstate', (e) => {
      const k = location.hash.slice(1); const st = e.state || {};
      if (PAGES[k] || BQ.meta(k)) BQ.open(k, { pos: st.pos, history: 'none', src: 'history' });
    });
    window.addEventListener('hashchange', () => {
      const k = location.hash.slice(1);
      if (k !== BQ.state.current && (PAGES[k] || BQ.meta(k))) BQ.open(k, { history: 'replace', src: 'history' });
    });
    $('#planBtn').addEventListener('click', (e) => { e.preventDefault(); closeAdultPop(); BQ.open('plan'); });
    const mb7 = $('#masteryBtn'); if (mb7) mb7.addEventListener('click', (e) => { e.preventDefault(); closeAdultPop(); BQ.open('mastery'); });
    const hl = $('#homeLink'); if (hl) hl.addEventListener('click', (e) => { e.preventDefault(); if (PAGES[BQ.state.current]) BQ.open(lastEl || BQ.path()[0].id); else toTop(); });
    // «العناصر» (درج) و«للمعلّم» (قائمة منبثقة)
    const mb = $('#menuBtn'); if (mb) mb.addEventListener('click', () => ($('.menu').classList.contains('is-open') ? closeMenu(true) : openMenu()));
    const mx = $('#menuClose'); if (mx) mx.addEventListener('click', () => closeMenu(true));
    const ms = $('#menuScrim'); if (ms) ms.addEventListener('click', () => closeMenu(true));
    const ab = $('#adultBtn'); if (ab) ab.addEventListener('click', (e) => { e.stopPropagation(); toggleAdultPop(); });
    document.addEventListener('click', (e) => { const pop = $('#adultMenu'); if (pop && !pop.hidden && !e.target.closest('.hdr-adult')) closeAdultPop(); });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if ($('.menu.is-open')) { e.preventDefault(); closeMenu(true); }
      else if ($('#adultMenu') && !$('#adultMenu').hidden) { e.preventDefault(); closeAdultPop(true); }
    });
    window.addEventListener('resize', () => { if (!isDrawer()) closeMenu(); });
    // «العودة إلى الدرس» في الخطة تعيد إلى آخر عنصر (QA-11)
    document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('.lp-back'); if (b) { e.preventDefault(); e.stopImmediatePropagation(); BQ.open(lastEl || BQ.path()[0].id); } }, true);
    $$('#ageSeg input').forEach((r) => {
      r.addEventListener('change', () => {
        if (!r.checked) return;
        store.set('age', r.value);
        const running = BQ.state.current && /^E\d/.test(BQ.state.current) && !$('.elp-start') && $('.elp.is-running');
        if (running) { pendingAge = r.value; UI.toast('يُطبَّق العمر الجديد على النشاط التالي.'); return; }
        applyAge(r.value);
        if (BQ.state.current && !PAGES[BQ.state.current]) BQ.open(BQ.state.current, { history: 'replace', src: 'menu' });
      });
    });
    const rs = $('#resetBtn'); if (rs) rs.addEventListener('click', () => askReset(rs));
    updateProgress();
    const hsh = location.hash.slice(1);
    const lp = store.get('last', null);
    if (PAGES[hsh]) BQ.open(hsh, { src: 'boot' });
    else if (BQ.meta(hsh)) BQ.open(hsh, { src: 'boot', pos: lp && lp.id === hsh ? lp.pos : undefined });
    else { const r = resumeTarget() || { id: BQ.path()[0].id, pos: 0 }; BQ.open(r.id, { src: 'boot', pos: r.pos }); }
    window.addEventListener('keydown', (e) => {
      if (e.code !== 'KeyR' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (PAGES[BQ.state.current] || (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], .elp-adult'))) return;
      const b = $('.elp-say'); if (b && !b.closest('.is-empty')) b.click();
    });
  }
  function safeBoot() {
    try { boot(); } catch (e) {
      console.error(e);
      const c = $('#content'); if (c) c.replaceChildren(h('p.bq-missing', null, 'تعذّر تشغيل الصفحة. امسح بيانات الموقع ثم أعد التحميل.'));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeBoot); else setTimeout(safeBoot, 0);
})();
