/* E16 · مُهِمَّةٌ مَعَ الأُسْرَةِ — IX1 · v8 (owner R3-16) · draft_unapproved · SPEC_v7 §E16 (pedagogy unchanged: take the sound /م/ home)
   OWNER_R3-16: «في تداخل في النص + النشاط مع الأسرة محتاج يكون فيه أكتر من فكرة، مش سؤال واحد فقط» →
   ١ the child PICKS one of 4 family missions (picture cards; each card reads its mission aloud — Bariq):
      m1 find 3 things at home whose name starts with «مَ» → photograph or draw them · m2 taste a «مَ» fruit (مَوْز / مانْجو) and say its name ·
      m3 hunt the letter «م» in a picture book or a box with a family member · m4 draw «م» with a finger on a sand / flour tray or on a parent's palm.
   ٢ mission view: the picture + the read-aloud line (big text, line-height 2.1 — no diacritic collisions) + 3 slots: each slot = take a photo
      (camera / photo picker) or draw (finger drawing pad). Photos stay on THIS device only (localStorage, downscaled) — nothing is uploaded.
   ٣ any mission with 3 filled slots → the element is done (ctx.done) + bq7_E16_bye. The child may do more missions.
   No «/م/» on the child screen (the line says «بِصَوْتِ مَ»). No adult text on the child screen: the parent note + print are in the teacher drawer.
   theme 8 → island frame (THEME8); otherwise the same content in the v7 frame. Lines: bq7_E16_pick · bq7_E16_m1..m4 · bq7_E16_add · bq7_E16_bye. */
(function () {
  'use strict';
  const ID = 'E16';
  const lib = () => (BQ.ix1 ? Promise.resolve(BQ.ix1) : BQ.loadScript('js/el7/lib/ix1.js').then(() => BQ.ix1));

  const MISSIONS = [
    { id: 'm1', img: 'family_card', label: 'أَشْياءُ في البَيْتِ', line: 'bq7_E16_m1',
      text: 'اِبْحَثْ مَعَ أُسْرَتِكَ في البَيْتِ عَنْ ثَلاثَةِ أَشْياءَ يَبْدَأُ اسْمُها بِصَوْتِ مَ، وَصَوِّرْها، أَوِ ارْسُمْها.' },
    { id: 'm2', img: 'ctx_manju', label: 'فاكِهَةٌ لَذيذَةٌ', line: 'bq7_E16_m2',
      text: 'تَذَوَّقْ مَعَ أُسْرَتِكَ فاكِهَةً يَبْدَأُ اسْمُها بِصَوْتِ مَ: مَوْزٌ أَوْ مانْجو، وَقُلِ اسْمَها!' },
    { id: 'm3', img: 'card_kitab', label: 'كِتابٌ أَوْ عُلْبَةٌ', line: 'bq7_E16_m3',
      text: 'اِفْتَحْ مَعَ أَحَدٍ مِنْ أُسْرَتِكَ كِتابَ صُوَرٍ أَوْ عُلْبَةً، وَابْحَثا مَعًا عَنْ حَرْفِ المِيمِ، صَوْتُهُ مَ.' },
    { id: 'm4', img: null, label: 'اُرْسُمْ بِإِصْبَعِكَ', line: 'bq7_E16_m4',   // ART need: e16_sand_tray (child's finger drawing «م» in a sand tray, parent's hand near)
      text: 'اُرْسُمْ بِإِصْبَعِكَ حَرْفَ المِيمِ، صَوْتُهُ مَ، عَلى صينِيَّةِ رَمْلٍ أَوْ طَحينٍ، أَوْ عَلى كَفِّ أَحَدٍ مِنْ أُسْرَتِكَ.' },
  ];
  const LINES = { bq7_E16_pick: 'اِخْتَرْ مُهِمَّةً، وَالْمِسْ صورَتَها.', bq7_E16_add: 'صَوِّرْ ما وَجَدْتَ، أَوِ ارْسُمْهُ هُنا.', bq7_E16_bye: 'إِلى اللِّقاءِ يا صَديقي!' };
  MISSIONS.forEach((m) => { LINES[m.line] = m.text; });

  const CAM = '<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="14" y="34" width="92" height="66" rx="16" fill="#3D7BF0" stroke="#0B2D4F" stroke-width="5"/><path d="M42 34l7-12h22l7 12" fill="#D6E4FF" stroke="#0B2D4F" stroke-width="5" stroke-linejoin="round"/><circle cx="60" cy="66" r="21" fill="#fff" stroke="#0B2D4F" stroke-width="5"/><circle cx="60" cy="66" r="10" fill="#0B2D4F"/><circle cx="91" cy="48" r="5" fill="#FFC21A"/></svg>';

  const CSS = `
.e16w { --k: calc(100cqi / 1180); }
.bq8-panel.e16w { --k: var(--u); }
.i7.e16w { width: 100%; height: 100%; }
.e16w { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: calc(var(--k)*22); }
.e16w .e16-title { margin: 0; padding-block: .3em; display: inline-flex; align-items: center; gap: calc(var(--k)*12); font: 700 max(18px, calc(var(--k)*34))/2 var(--font-bubble, var(--ff-child)); color: #166B46; }
.e16w .e16-title .bq8-ic, .e16w .e16-title img { width: max(34px, calc(var(--k)*54)); height: max(34px, calc(var(--k)*54)); }
.e16w .e16-grid { display: grid; grid-template-columns: repeat(4, auto); gap: calc(var(--k)*30); justify-content: center; }
.e16w .e16-mc { position: relative; width: calc(var(--k)*200); display: flex; flex-direction: column; align-items: stretch; gap: calc(var(--k)*4); padding: calc(var(--k)*9) calc(var(--k)*9) calc(var(--k)*4); cursor: pointer;
  border-radius: calc(var(--k)*28); background: #fff; border: max(2px, calc(var(--k)*3.5)) solid #0B2D4F; box-shadow: 0 0 0 max(3px, calc(var(--k)*5)) #fff, 0 calc(var(--k)*12) calc(var(--k)*24) calc(var(--k)*-8) rgba(11,45,79,.4);
  transition: transform .16s, box-shadow .16s; font: inherit; color: #0B2D4F; animation: bq8-pop .4s cubic-bezier(.3,1.6,.5,1) both; }
.e16w .e16-mc:active { transform: scale(.96); }
.e16w .e16-mc.is-play { transform: translateY(calc(var(--k)*-6)); box-shadow: 0 0 0 max(3px, calc(var(--k)*5)) #fff, 0 0 0 calc(var(--k)*11) #FF9F1C, 0 calc(var(--k)*12) calc(var(--k)*24) calc(var(--k)*-8) rgba(11,45,79,.4); }
.e16w .e16-mc.is-done::after { content: ''; position: absolute; top: calc(var(--k)*-22); inset-inline-start: calc(var(--k)*-22); width: max(40px, calc(var(--k)*60)); aspect-ratio: 1; background: url(assets/icons8/check.svg) center / contain no-repeat; }
.e16w .e16-pic { display: block; width: 100%; aspect-ratio: 1; border-radius: calc(var(--k)*18); overflow: hidden; background: #F4EAD2; }
.e16w .e16-pic img { width: 100%; height: 100%; object-fit: cover; display: block; }
.e16w .e16-lbl { display: block; text-align: center; font: 700 max(15px, calc(var(--k)*26))/2.1 var(--font-bubble, var(--ff-child)); white-space: nowrap; }
/* m4 placeholder picture: a sand tray with a finger-drawn «م» (until ART e16_sand_tray) */
.e16w .e16-sand { display: grid; place-items: center; width: 100%; height: 100%; background: radial-gradient(circle at 50% 45%, #F7E3B5 0, #E9C98A 70%, #C99A56 100%); box-shadow: inset 0 0 0 calc(var(--k)*12) #B07A3E, inset 0 0 calc(var(--k)*30) calc(var(--k)*14) rgba(120,70,20,.45); }
.e16w .e16-sand span { font: 700 calc(var(--k)*120)/1 var(--font-letter, 'Vazirmatn', sans-serif); color: rgba(150,95,40,.75); text-shadow: 0 calc(var(--k)*-2) 0 rgba(255,250,235,.9), 0 calc(var(--k)*3) calc(var(--k)*3) rgba(110,60,15,.4); transform: translateY(-8%); }
/* mission view */
.e16w .e16-mv { display: flex; align-items: center; justify-content: center; gap: calc(var(--k)*34); width: 100%; }
.e16w .e16-mv .e16-mc { width: calc(var(--k)*250); cursor: default; animation: none; }
.e16w .e16-side { display: flex; flex-direction: column; align-items: center; gap: calc(var(--k)*24); max-width: calc(var(--k)*600); }
.e16w .e16-text { margin: 0; padding: calc(var(--k)*10) calc(var(--k)*28) calc(var(--k)*14); border-radius: calc(var(--k)*28); background: #fff; color: #0B2D4F; text-wrap: balance; text-align: center;
  font: 700 max(18px, calc(var(--k)*31))/2.15 var(--font-bubble, var(--ff-child)); box-shadow: 0 0 0 max(2px, calc(var(--k)*3)) rgba(11,45,79,.85), 0 0 0 calc(var(--k)*9) rgba(255,255,255,.85), 0 calc(var(--k)*12) calc(var(--k)*24) calc(var(--k)*-8) rgba(11,45,79,.4); }
.e16w .e16-slots { display: flex; gap: calc(var(--k)*26); justify-content: center; }
.e16w .e16-slot { position: relative; width: max(150px, calc(var(--k)*176)); aspect-ratio: 1; border-radius: calc(var(--k)*28); background: rgba(255,255,255,.75); border: max(3px, calc(var(--k)*4)) dashed rgba(11,45,79,.38);
  display: flex; align-items: center; justify-content: center; gap: calc(var(--k)*8); overflow: hidden; }
.e16w .e16-slot.is-filled { border-style: solid; border-color: #22C27A; background: #fff; }
.e16w .e16-slot > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.e16w .e16-slot .e16-sb { position: relative; z-index: 1; width: 64px; height: 64px; border-radius: 50%; padding: 6px; display: grid; place-items: center; cursor: pointer; font-size: 46px;
  border: 3px solid #0B2D4F; background: radial-gradient(circle at 38% 30%, #fff, #D6E4FF 62%); box-shadow: 0 0 0 4px #fff, 0 6px 10px rgba(11,45,79,.28); }
.e16w .e16-slot .e16-sb svg { width: 100%; height: 100%; }
.e16w .e16-slot .e16-sb.pen { background: radial-gradient(circle at 38% 30%, #fff, #FFE38A 62%); }
.e16w .e16-slot.is-filled .e16-sb { width: 64px; height: 64px; align-self: flex-end; margin-bottom: 6px; opacity: .92; }
.e16w .e16-slot.is-filled .e16-star { position: absolute; z-index: 2; top: 4px; inset-inline-end: 4px; width: 40px; height: 40px; background: url(assets/icons8/star.svg) center / contain no-repeat; }
.e16w .e16-back { position: absolute; top: calc(var(--k)*6); inset-inline-end: calc(var(--k)*6); }
.e16w input[type=file] { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
/* finger drawing pad */
.e16-pad { position: absolute; inset: 0; z-index: 60; display: grid; place-items: center; background: rgba(11,45,79,.55); animation: bq8-pop .25s ease-out both; }
.e16-pad .pbox { position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 14px; border-radius: 28px; background: #FFF8E8; box-shadow: 0 0 0 5px #fff, 0 20px 40px rgba(0,0,0,.35); }
.e16-pad canvas { display: block; width: min(70vw, 560px); aspect-ratio: 4 / 3; border-radius: 20px; background: #fff; box-shadow: inset 0 0 0 3px #0B2D4F; touch-action: none; cursor: crosshair; }
.e16-pad .prow { display: flex; gap: 14px; align-items: center; }
.e16-pad .pc { width: 64px; height: 64px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 0 0 3px #0B2D4F; cursor: pointer; padding: 0; }
.e16-pad .pc.on { box-shadow: 0 0 0 3px #0B2D4F, 0 0 0 9px #FFC21A; }
.e16-pad .pt { width: 72px; height: 72px; border-radius: 50%; border: 3px solid #0B2D4F; background: #fff; display: grid; place-items: center; font-size: 52px; cursor: pointer; padding: 0; box-shadow: 0 0 0 4px #fff; }
.e16-pad .pt.ok { background: radial-gradient(circle at 38% 30%, #fff, #CFF5E2 62%); }
/* tall (portrait) */
.bq8-stage.is-tall .e16w .e16-grid { grid-template-columns: repeat(2, auto); gap: calc(var(--k)*44) calc(var(--k)*50); }
.bq8-stage.is-tall .e16w .e16-mc { width: calc(var(--k)*290); }
.bq8-stage.is-tall .e16w .e16-mv { flex-direction: column; gap: calc(var(--k)*24); }
.bq8-stage.is-tall .e16w .e16-mv .e16-mc { width: calc(var(--k)*300); }
.bq8-stage.is-tall .e16w .e16-side { max-width: calc(var(--k)*900); }
@container stage (max-width: 640px) { .e16w .e16-grid { grid-template-columns: repeat(2, auto); } .e16w .e16-mv { flex-direction: column; } .e16w .e16-mc { width: calc(var(--k)*360); } .e16w .e16-text { font-size: 18px; } }
@media (max-height: 500px) { .e16w .e16-mv .e16-mc { width: calc(var(--k)*200); } .e16w .e16-slot { width: 96px; } .e16w .e16-slot .e16-sb { width: 64px; height: 64px; } }
@media (prefers-reduced-motion: reduce) { .e16w .e16-mc, .e16-pad { animation: none; } }
.e16-print { display: none; }
@media print {
  @page { size: A4 portrait; margin: 12mm; }
  body.e16-printing > *:not(.e16-print) { display: none !important; }
  body.e16-printing { background: #fff !important; display: block !important; min-height: 0 !important; }
  body.e16-printing .e16-print { display: block !important; color: #000; font: 400 12pt/1.65 'Readex Pro', 'Noto Sans Arabic', sans-serif; direction: rtl; }
  .e16-print .p-h { font: 700 17pt/1.9 'Scheherazade New', serif; margin: 0 0 4pt; color: #166B46; }
  .e16-print .p-m { display: grid; grid-template-columns: 60pt 1fr; gap: 4pt 10pt; align-items: center; border: 2pt solid #DEC68E; border-radius: 12pt; padding: 6pt 10pt; margin-bottom: 6pt; background: #FEFEDE; break-inside: avoid; }
  .e16-print .p-m img, .e16-print .p-m .p-sand { width: 60pt; height: 60pt; object-fit: cover; border-radius: 8pt; background: #E9C98A; }
  .e16-print .p-k { font: 700 13.5pt/2 'Scheherazade New', serif; margin: 0; }
  .e16-print .p-boxes { grid-column: 1 / -1; display: flex; gap: 8pt; }
  .e16-print .p-box { flex: 1; height: 62pt; border: 1.5pt dashed #82C3E8; border-radius: 8pt; background: #fff; }
  .e16-print .p-cut { border: 0; border-top: 1.2pt dashed #999; margin: 10pt 0 8pt; }
  .e16-print h2 { font-size: 14pt; margin: 0 0 4pt; color: #00345B; }
  .e16-print .p-role { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8pt; }
  .e16-print .p-role ul { margin: 2pt 0 0; padding-inline-start: 1.1em; font-size: 10pt; line-height: 1.5; }
  .e16-print .p-foot { margin-top: 8pt; font-size: 8.5pt; color: #777; }
  .e16-print .p-ms { break-before: page; }
  .e16-print .p-ms .ms-bar-act, .e16-print .p-ms .ms-foot, .e16-print .p-ms .ms-parent, .e16-print .p-ms .ms-intro, .e16-print .p-ms .ms-judge { display: none !important; }
}`;
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  function parentRole() {
    const D = BQ.D, G = D.guide7 || {};
    const pr = (G.parent_role && typeof G.parent_role === 'object') ? G.parent_role : (D.parent_role || {});
    return { title: pr.title || 'دور وليّ الأمر', goal: pr.goal || '', before: list(pr.before), during: list(pr.during), after: list(pr.after) };
  }
  const store = {
    key: (m, i) => 'bq7_e16_' + m + '_' + i,
    get(m, i) { try { return localStorage.getItem(store.key(m, i)); } catch (e) { return null; } },
    set(m, i, v) { try { localStorage.setItem(store.key(m, i), v); return true; } catch (e) { return false; } },
  };
  /** downscale an image file to a small JPEG data URL (kept on this device only) */
  const shrink = (file) => new Promise((res) => {
    const url = URL.createObjectURL(file); const im = new Image();
    im.onload = () => { const k = Math.min(1, 360 / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.72)); };
    im.onerror = () => { URL.revokeObjectURL(url); res(null); };
    im.src = url;
  });

  function render(stage, ctx) {
    lib().then((I) => { if (ctx.alive()) run(I, stage, ctx); })
      .catch((e) => { console.warn('E16 lib', e); if (ctx.placeholder) ctx.placeholder(); });
  }

  function run(I, stage, ctx) {
    const h = BQ.h, D = BQ.D;
    if (!document.getElementById('st-e16')) document.head.append(h('style', { id: 'st-e16' }, CSS));
    const S = I.session(ctx, { noText: false });
    I.lines(LINES);
    const V8 = I.v8();
    const f8 = V8 ? I.frame8(S, 'e16w', { pose: 'wave' }) : null;
    const root = V8 ? f8.panel : I.root(stage, 'e16w');
    const buddy = I.buddy(S, root, 'wave');
    const title = D.family_title || 'مُهِمَّتي مَعَ أُسْرَتي';
    let busy = false, finished = false;

    const pic = (m) => {
      const box = h('span.e16-pic', { 'aria-hidden': 'true' });
      if (m.img && BQ.hasImg7 && BQ.hasImg7(m.img)) box.append(h('img', { src: BQ.img7(m.img), alt: '', draggable: 'false', decoding: 'async' }));
      else box.append(h('span.e16-sand', null, h('span', null, 'م')));
      return box;
    };
    const filled = (m) => [0, 1, 2].filter((i) => store.get(m.id, i)).length;
    const say = async (id, el, o) => { if (el) el.classList.add('is-play'); try { await S.say(id, o); } finally { if (el) el.classList.remove('is-play'); } };

    /* ---------- 1 · pick a mission ---------- */
    function pick(first) {
      const head = h('p.e16-title', { lang: 'ar' }, V8 ? I.i8('family') : BQ.icon('home'), h('span', null, title));
      const grid = h('div.e16-grid', { role: 'group', 'aria-label': 'المُهِمّاتُ' });
      MISSIONS.forEach((m, i) => {
        const c = h('button.e16-mc' + (filled(m) >= 3 ? '.is-done' : ''), { type: 'button', 'aria-label': m.label, lang: 'ar', dataset: { m: m.id } }, pic(m), h('span.e16-lbl', null, m.label));
        c.style.animationDelay = (i * 0.08) + 's';
        c.addEventListener('click', async () => { if (busy) return; busy = true; I.sfx('pop'); await say(m.line, c, { talk: true }); busy = false; open(m); });
        grid.append(c);
      });
      root.replaceChildren(head, grid);
      I.instr(S, 'bq7_E16_pick', 'hand', async () => { if (busy) return; busy = true; await S.say('bq7_E16_pick', { talk: true }); busy = false; });
      if (first) (async () => { busy = true; await S.sleep(400); await S.say('bq7_E16_pick', { talk: true }); busy = false; })();
    }

    /* ---------- 2 · one mission ---------- */
    function open(m) {
      const card = h('div.e16-mc', { role: 'img', 'aria-label': m.label }, pic(m), h('span.e16-lbl', null, m.label));
      const text = h('p.e16-text', { lang: 'ar' }, m.text);
      const slots = [0, 1, 2].map((i) => slot(m, i));
      const back = V8 ? h('button.bq8-btn.bq8-btn--back.bq8-btn--lg.e16-back', { type: 'button', 'aria-label': 'المُهِمّاتُ' }, I.i8('back'))
        : h('button.bq-btn.ghost.e16-back', { type: 'button', 'aria-label': 'المُهِمّاتُ' }, '→');
      back.addEventListener('click', () => { if (busy) return; S.stop(); I.sfx('flip'); pick(false); });
      root.replaceChildren(h('div.e16-mv', null, card, h('div.e16-side', null, text, h('div.e16-slots', { role: 'group', 'aria-label': 'صُوَرُكَ وَرُسومُكَ' }, slots.map((s) => s.el)))), back);
      I.instr(S, m.line, 'family', async () => { if (busy) return; busy = true; await say(m.line, null, { talk: true }); busy = false; });
      (async () => { busy = true; await S.sleep(350); await S.say('bq7_E16_add', { talk: true }); busy = false; })();
    }

    function slot(m, i) {
      const el = h('div.e16-slot', { role: 'group', 'aria-label': 'خانَةٌ ' + I.AR(i + 1) });
      const file = h('input', { type: 'file', accept: 'image/*', capture: 'environment', tabindex: '-1', 'aria-hidden': 'true' });
      const cam = h('button.e16-sb.cam', { type: 'button', 'aria-label': 'صَوِّرْ', html: CAM });
      const pen = h('button.e16-sb.pen', { type: 'button', 'aria-label': 'اُرْسُمْ' }, V8 ? I.i8('pencil') : '✏️');
      const show = (src) => {
        el.querySelectorAll(':scope > img, :scope > .e16-star').forEach((x) => x.remove());
        if (src) { el.prepend(h('img', { src, alt: '' }), h('span.e16-star', { 'aria-hidden': 'true' })); el.classList.add('is-filled'); }
      };
      const put = (src) => {
        if (!src) return;
        store.set(m.id, i, src); show(src); I.sfx('ok'); I.burst(root, el, 14); buddy.cheer();
        if (V8 && f8) { /* stars live only on the mission view */ }
        if (filled(m) >= 3 && !finished) { finished = true; ctx.done(); (async () => { await S.sleep(500); await S.say('bq7_E16_bye', { talk: true }); })(); }
      };
      cam.addEventListener('click', () => { S.stop(); try { file.value = ''; file.click(); } catch (e) { /* */ } });
      file.addEventListener('change', async () => { const f = file.files && file.files[0]; if (!f) return; put(await shrink(f)); });
      pen.addEventListener('click', () => { S.stop(); drawPad((src) => put(src)); });
      el.append(cam, pen, file);
      show(store.get(m.id, i));
      return { el };
    }

    /* ---------- finger drawing pad ---------- */
    function drawPad(done) {
      const host = V8 ? f8.stage : root;
      const cv = h('canvas', { width: 800, height: 600, 'aria-label': 'لَوْحَةُ الرَّسْمِ' });
      const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 800, 600); g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 14;
      const COLS = ['#0B2D4F', '#E2574C', '#22C27A', '#FF9F1C'];
      let col = COLS[0], down = false, last = null, drew = false;
      const cBtns = COLS.map((c, k) => { const b = h('button.pc' + (k ? '' : '.on'), { type: 'button', 'aria-label': 'لَوْنٌ ' + I.AR(k + 1) }); b.style.background = c; b.onclick = () => { col = c; cBtns.forEach((x) => x.classList.toggle('on', x === b)); }; return b; });
      const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 800 / r.width, (e.clientY - r.top) * 600 / r.height]; };
      cv.addEventListener('pointerdown', (e) => { down = true; last = pos(e); try { cv.setPointerCapture(e.pointerId); } catch (x) { /* */ } g.fillStyle = col; g.beginPath(); g.arc(last[0], last[1], 7, 0, 7); g.fill(); drew = true; });
      cv.addEventListener('pointermove', (e) => { if (!down) return; const p = pos(e); g.strokeStyle = col; g.beginPath(); g.moveTo(last[0], last[1]); g.lineTo(p[0], p[1]); g.stroke(); last = p; drew = true; });
      ['pointerup', 'pointercancel'].forEach((t) => cv.addEventListener(t, () => { down = false; }));
      const close = () => pad.remove();
      const ok = h('button.pt.ok', { type: 'button', 'aria-label': 'تَمَّ' }, V8 ? I.i8('check') : '✓');
      const clr = h('button.pt', { type: 'button', 'aria-label': 'اِمْسَحْ' }, V8 ? I.i8('replay') : '↺');
      const x = h('button.pt', { type: 'button', 'aria-label': 'أَغْلِقْ' }, V8 ? I.i8('close') : '×');
      ok.onclick = () => { const src = drew ? cv.toDataURL('image/jpeg', 0.7) : null; close(); if (src) { const c2 = document.createElement('canvas'); c2.width = 320; c2.height = 240; c2.getContext('2d').drawImage(cv, 0, 0, 320, 240); done(c2.toDataURL('image/jpeg', 0.75)); } };
      clr.onclick = () => { g.fillStyle = '#fff'; g.fillRect(0, 0, 800, 600); drew = false; };
      x.onclick = close;
      // tap-robust: the pad buttons also answer pointerup (the first tap right after a stroke can lose its synthetic click)
      [ok, clr, x, ...cBtns].forEach((b) => { const f = b.onclick; b.onclick = null; let t = 0; const go = () => { const n = Date.now(); if (n - t < 400) return; t = n; f(); };
        b.addEventListener('pointerup', go); b.addEventListener('click', go); });
      const pad = h('div.e16-pad', { role: 'dialog', 'aria-label': 'اُرْسُمْ' }, h('div.pbox', null, cv, h('div.prow', null, ...cBtns, clr, x, ok)));
      host.append(pad);
      ctx.onCleanup(() => pad.remove());
    }

    /* ---------- teacher / parent drawer (never on the child screen) ---------- */
    const role = parentRole();
    const pbtn = h('button.bq-btn', { type: 'button', onclick: () => doPrint() }, 'اطبع المهمّات ودور وليّ الأمر ودليل الإتقان (A4)');
    ctx.adultNote(h('div', null, h('div', { html:
      '<p><b>المهمّة مع الأسرة (٤ اختيارات):</b> يختار الطفل مهمّة ويسمعها من بارق: (١) ثلاثة أشياء في البيت يبدأ اسمها بصوت «مَ» — يصوّرها أو يرسمها · ' +
      '(٢) فاكهة يبدأ اسمها بصوت «مَ» (مَوْز، مانْجو) يتذوّقها ويقول اسمها · (٣) البحث عن حرف «م» في كتاب صور أو على علبة مع فرد من الأسرة · ' +
      '(٤) رسم «م» بالإصبع على صينيّة رمل أو طحين أو على كفّ أحد أفراد الأسرة.</p>' +
      '<p><b>دور الأسرة:</b> اقرأ المهمّة مع طفلك، وساعده في التصوير أو الرسم في الخانات الثلاث. قل الاسم مع طفلك بوضوح وابدأ بصوت «مَ» (مَوْز) — لا تقل «مِيم» بدل الصوت. اقبل أيّ شيء صحيح يبدأ بصوت «مَ» ولو لم يكن من كلمات الدرس.</p>' +
      '<p><b>الخصوصية:</b> الصور والرسوم تبقى على هذا الجهاز فقط ولا تُرسَل إلى أيّ مكان. يكفي إكمال مهمّة واحدة (٣ خانات) ليُعدّ النشاط منجزاً، ويمكن إكمال أكثر.</p>' +
      '<p><b>في الحصّة التالية:</b> يعرض كلّ طفل صوره أو رسومه ويقول جملة عن واحد منها («هَذا مِفْتاحٌ»)؛ سجّل حكمك على «استخدام المفردة» (S9) في «دليل الإتقان».</p>' +
      '<p><b>' + esc(role.title) + '</b> — في المطبوع وصفحة الأسرة.</p>' }), pbtn));

    function doPrint() {
      BQ.audio.stop();
      let p = document.querySelector('.e16-print'); if (p) p.remove();
      p = h('div.e16-print', { dir: 'rtl', lang: 'ar' });
      const ul = (a) => '<ul>' + a.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
      const box = '<div class="p-box"></div>';
      p.innerHTML = '<p class="p-h">' + esc(title) + ' — اِخْتَرْ مُهِمَّةً</p>' +
        MISSIONS.map((m) => '<div class="p-m">' + (m.img && BQ.hasImg7 && BQ.hasImg7(m.img) ? '<img src="' + BQ.img7(m.img) + '" alt="">' : '<div class="p-sand"></div>') +
          '<p class="p-k">' + esc(m.text) + '</p><div class="p-boxes">' + box + box + box + '</div></div>').join('') +
        '<hr class="p-cut"><h2>' + esc(role.title) + '</h2><p><b>هدف اليوم:</b> ' + esc(role.goal) + '</p>' +
        '<div class="p-role"><div><b>قبل الدرس</b>' + ul(role.before) + '</div><div><b>أثناء الدرس</b>' + ul(role.during) + '</div><div><b>بعد الدرس</b>' + ul(role.after) + '</div></div>' +
        '<p class="p-foot">بارق · L1-01-d1 · صوت الميم · v8 مسوّدة (draft_unapproved)</p>';
      if (BQ.masteryView) { const ms = h('div.p-ms.lp.ms-view'); BQ.masteryView.render(ms); p.append(ms); }
      document.body.append(p);
      document.body.classList.add('e16-printing');
      const done = () => { document.body.classList.remove('e16-printing'); const q = document.querySelector('.e16-print'); if (q) q.remove();
        window.removeEventListener('afterprint', done); document.removeEventListener('pointerdown', done, true); };
      window.addEventListener('afterprint', done);
      setTimeout(() => { try { window.print(); } catch (e) { /* */ } setTimeout(() => document.addEventListener('pointerdown', done, true), 400); }, 60);
    }
    ctx.onCleanup(() => { document.body.classList.remove('e16-printing'); const q = document.querySelector('.e16-print'); if (q) q.remove(); });

    pick(true);
  }

  BQ.register(ID, { render });
})();
