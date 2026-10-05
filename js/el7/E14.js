/* E14 · خَريطَةٌ مَفاهيمِيَّةٌ — IX2 · v7 · draft_unapproved · SPEC_v7 §E14 · تعزيز (2 · 3 · 5) · غير مسجَّل
   بعده: يجمع ما تعلّمه في صورة واحدة: أشكال الميم وحركاتها وكلماتها.
   خلَف «الخريطة الذهنية» (EL15) في الأصل: مركز وفروع بأيقونات + بطاقات تُسحب إلى مكانها (سحب بالإصبع/الفأرة، أو لمس البطاقة ثم الفرع).
   المركز map_center وعليه «م» · ثلاثة فروع: أشكال المِيمِ (map_icon_forms) · المِيمُ مَعَ الحَرَكاتِ (map_icon_vowels) · كَلِماتٌ فيها المِيمُ (map_icon_words).
   ١٣ قطعة مخلوطة في الدرج: مـ ـمـ ـم م · مَ مِ مُ ما مي مو · مَكْتَبْ مانْجو نُمورْ (صورة + كلمة).
   ✓ تستقرّ بنقرة + صوتها · ✗ ترتدّ + «جَرِّبْ مَرَّةً أُخْرى.» · بعد خطأين على القطعة نفسها يضيء فرعها. النهاية: الفروع تضيء واحداً واحداً + الملخّص.
   الطباعة للمعلّم فقط (زرّ في دليل المعلّم).
   v8 (?theme=8 · OWNER_R3-14): (١) الإفلات يستقرّ مباشرة في الفرع (البطاقة نفسها تنتقل إلى جسم الفرع بارتداد قصير) — لا عودة ثم هبوط؛
   الخطأ = اهتزاز لطيف ثمّ تعود · (٢) كلّ حرف داخل بطاقته (Vazirmatn، الحجم من عرض البطاقة، فُحص «مِ» و«مُ» آليّاً) · (٣) كلّ فرع يقول
   ما يوضع فيه: صورة الفرع + شكل الحرف الذي يخصّه (مـ ـمـ ـم · مَ مِ مُ · بطاقات بصور) + سمّاعة؛ ٣ نجوم = فرع اكتمل. */
(function () {
  'use strict';
  const ID = 'E14';
  const BR = [
    { id: 'forms', icon: 'map_icon_forms', line: 'bq7_E14_br_forms', label: 'أَشْكالُ المِيمِ' },
    { id: 'vowels', icon: 'map_icon_vowels', line: 'bq7_E14_br_vowels', label: 'المِيمُ مَعَ الحَرَكاتِ' },
    { id: 'words', icon: 'map_icon_words', line: 'bq7_E14_br_words', label: 'كَلِماتٌ فيها المِيمُ' },
  ];
  const PIECES = [
    { br: 'forms', t: 'مـ', au: 'bq7_G_pos_first' }, { br: 'forms', t: 'ـمـ', au: 'bq7_G_pos_mid' }, { br: 'forms', t: 'ـم', au: 'bq7_G_pos_last' }, { br: 'forms', t: 'م', au: 'bq7_E14_alone' },
    { br: 'vowels', t: 'مَ', au: 'bq7_S_ma' }, { br: 'vowels', t: 'مِ', au: 'bq7_S_mi' }, { br: 'vowels', t: 'مُ', au: 'bq7_S_mu' },
    { br: 'vowels', t: 'ما', au: 'bq7_S_maa' }, { br: 'vowels', t: 'مي', au: 'bq7_S_mii' }, { br: 'vowels', t: 'مو', au: 'bq7_S_muu' },
    { br: 'words', w: 'maktab', au: 'bq7_W_maktab' }, { br: 'words', w: 'manju', au: 'bq7_W_manju' }, { br: 'words', w: 'numur', au: 'bq7_W_numur' },
  ];
  const CSS = `
.e14 { justify-content: space-between; gap: clamp(6px, 1.6cqi, 14px); }
.e14-map { position: relative; width: 100%; flex: 1 1 auto; min-height: 0; grid-template-rows: auto minmax(max(100px, calc(var(--H, 600px) * .22)), 1fr); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: auto minmax(0, 1fr); column-gap: clamp(8px, 2.4cqi, 24px); row-gap: clamp(14px, 3cqi, 30px); align-items: stretch; }
.e14-lines { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 0; }
.e14-lines path { fill: none; stroke: #E9C27A; stroke-width: 6; stroke-linecap: round; transition: stroke .4s; }
.e14-lines path.on { stroke: var(--sun); filter: drop-shadow(0 0 6px rgba(254,186,2,.8)); }
.e14-center { grid-column: 1 / -1; justify-self: center; position: relative; z-index: 1; width: min(clamp(96px, 17cqi, 170px), calc(var(--H, 600px) * .24)); aspect-ratio: 1; }
.e14-center img { width: 100%; height: 100%; object-fit: contain; }
.e14-center .e14-m { position: absolute; left: 49.8%; top: 62.5%; transform: translate(-50%, -50%); font: 700 calc(min(clamp(96px, 17cqi, 170px), calc(var(--H, 600px) * .24)) * .34)/1 var(--ff-child); color: var(--coral); padding-bottom: .22em; }
.e14-br { position: relative; z-index: 1; min-height: max(100px, calc(var(--H, 600px) * .22)); display: flex; flex-direction: column; align-items: stretch; border-radius: 24px; background: rgba(255,255,255,.92); border: 3px solid #F1DFAF; box-shadow: 0 6px 0 #EBD39A, 0 12px 22px var(--shade); padding: 6px 8px 10px; transition: box-shadow .3s, transform .2s; }
.e14-br.is-over { transform: scale(1.03); }
.e14-br.is-lit { box-shadow: 0 0 0 5px var(--sun), 0 0 28px rgba(254,186,2,.7); }
.e14-bh { display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 60px; min-width: 60px; border: 0; background: none; padding: 0; cursor: pointer; }
.e14-bh img { width: clamp(44px, 7cqi, 64px); height: clamp(44px, 7cqi, 64px); object-fit: contain; }
.e14-bh .x7-ic { width: 26px; height: 26px; color: var(--sky); }
.e14-bb { flex: 1 1 auto; min-height: 56px; display: flex; flex-wrap: wrap; align-content: flex-start; justify-content: center; gap: 6px; direction: rtl; padding-top: 4px; }
.e14-chip { min-width: 60px; min-height: 60px; padding: 0 8px 6px; border-radius: 14px; background: #FFFDF2; border: 2px solid #E9D7A6; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; animation: x7In .35s ease-out both; cursor: pointer; }
.e14-chip .x7-w { font-size: clamp(24px, 4.2cqi, 38px); line-height: 1.35; color: var(--coral); }
.e14-chip .x7-w b { color: var(--coral); }
.e14-chip.is-word .x7-w { font-size: clamp(15px, 2.4cqi, 22px); color: var(--navy); }
.e14-chip .e14-cp { width: clamp(38px, 6cqi, 58px); aspect-ratio: 1; border-radius: 10px; overflow: hidden; margin-top: 4px; }
.e14-tray { flex: none; width: 100%; display: flex; direction: rtl; flex-wrap: wrap; justify-content: center; gap: clamp(8px, 1.6cqi, 14px); padding: 10px 12px; border-radius: 22px; background: rgba(255,255,255,.6); border: 2px dashed #CFE5F2; }
.e14-tray:empty { display: none; }
.e14-tray .x7-tile { min-width: 64px; min-height: 64px; padding: 0 10px 6px; }
.e14-tray .x7-tile .x7-w { line-height: 1.25; }
.e14-tray .x7-tile .x7-w { font-size: clamp(30px, 5.4cqi, 46px); color: var(--coral); }
.e14-tray .x7-tile.is-word { flex-direction: column; padding: 6px 8px 4px; gap: 2px; }
.e14-tray .x7-tile.is-word .x7-w { font-size: clamp(17px, 2.6cqi, 24px); color: var(--navy); line-height: 1.3; }
.e14-tray .x7-tile .e14-tp { width: min(clamp(44px, 7cqi, 64px), calc(var(--H, 600px) * .08)); aspect-ratio: 1; border-radius: 12px; overflow: hidden; }
.e14 .x7-buddy { bottom: auto; top: 0; }
.e14.is-short .x7-buddy, .e14.is-short .e14-lines, .e14.is-short .e14-center { display: none; }
.e14.is-short { flex-direction: row; align-items: stretch; justify-content: center; }
.e14.is-short .e14-map { flex: 1 1 52%; grid-template-columns: minmax(0, 1fr); grid-template-rows: repeat(3, minmax(60px, 1fr)); row-gap: 6px; }
.e14.is-short .e14-br { min-height: 0; padding: 2px 6px; flex-direction: row; align-items: center; }
.e14.is-short .e14-bh img { width: 40px; height: 40px; }
.e14.is-short .e14-bb { padding-top: 0; justify-content: flex-start; align-content: center; }
.e14.is-short .e14-chip { min-height: 60px; }
.e14.is-short .e14-chip .e14-cp { width: 30px; }
.e14.is-short .e14-tray { flex: 1 1 48%; align-content: center; padding: 6px; gap: 6px; }
.e14.is-short .e14-tray .x7-tile { min-height: 60px; }
.e14.is-short .e14-tray .x7-tile .e14-tp { width: 34px; }
/* هاتف عمودي: الفروع صفوف كاملة العرض (رقائق ≥ ٦٠ تتّسع) */
.e14.is-narrow .x7-buddy, .e14.is-narrow .e14-lines { display: none; }
.e14.is-narrow .e14-map { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto repeat(3, minmax(64px, auto)); row-gap: 6px; }
.e14.is-narrow .e14-center { grid-column: 1; width: 64px; }
.e14.is-narrow .e14-center .e14-m { font-size: 22px; }
.e14.is-narrow .e14-br { min-height: 64px; padding: 2px 6px; flex-direction: row; align-items: center; }
.e14.is-narrow .e14-bh img { width: 40px; height: 40px; }
.e14.is-narrow .e14-bb { padding-top: 0; justify-content: flex-start; align-content: center; }
.e14.is-narrow .e14-chip .e14-cp { width: 30px; }
.e14.is-narrow .e14-tray .x7-tile .e14-tp { width: 36px; }
@container stage (max-width: 560px) {
  .e14-map { column-gap: 6px; row-gap: 14px; }
  .e14-br { padding: 4px 4px 8px; border-radius: 18px; }
  .e14-chip { min-width: 60px; min-height: 60px; padding: 0 5px 4px; }
  .e14-tray { gap: 8px; padding: 8px; }
  .e14-tray .x7-tile { min-width: 60px; min-height: 60px; }
}
`;

  /* ---------- v8 ---------- */
  const LBL8 = { forms: ['مـ', 'ـمـ', 'ـم'], vowels: ['مَ', 'مِ', 'مُ'], words: null };
  const CSS8 = `
.x7p.e14 { padding: calc(var(--u)*22) calc(var(--u)*26); gap: calc(var(--u)*14); justify-content: space-between; }
.e14-map8 { position: relative; width: 100%; flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: auto minmax(0, 1fr); column-gap: calc(var(--u)*22); row-gap: calc(var(--u)*34); }
.e14-lines8 { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 0; }
.e14-lines8 path { fill: none; stroke: rgba(11,45,79,.28); stroke-width: calc(var(--u)*6); stroke-linecap: round; stroke-dasharray: 0 calc(var(--u)*16); transition: stroke .3s; }
.e14-lines8 path.on { stroke: var(--bq8-yellow); }
.e14-c8 { grid-column: 1 / -1; justify-self: center; position: relative; z-index: 1; --w: calc(var(--u)*104); color: var(--bq8-meem); cursor: default; }
.e14-c8.bq8-tile { --fs: .62; }
.e14 .bq8-slot { position: relative; z-index: 1; justify-content: flex-start; min-width: 0; padding: calc(var(--u)*10) calc(var(--u)*10) calc(var(--u)*12); background: rgba(255,255,255,.72); }
.e14 .bq8-slot[data-br="forms"] { --slot-c: var(--bq8-eye); } .e14 .bq8-slot[data-br="vowels"] { --slot-c: var(--bq8-mouth); } .e14 .bq8-slot[data-br="words"] { --slot-c: var(--bq8-ear); }
.e14 .bq8-slot__label { border: 0; cursor: pointer; min-height: max(64px, calc(var(--u)*72)); padding: calc(var(--u)*6) calc(var(--u)*16) calc(var(--u)*6) calc(var(--u)*8); gap: calc(var(--u)*10); }
.e14 .bq8-slot__label img { width: calc(var(--u)*58); height: calc(var(--u)*58); object-fit: contain; border-radius: 0; }
.e14 .e14-ex { display: inline-flex; gap: calc(var(--u)*8); font: 700 calc(var(--u)*34)/1.5 var(--font-letter); color: var(--bq8-meem); white-space: nowrap; }
.e14 .e14-ex.is-pics { gap: calc(var(--u)*4); }
.e14 .e14-ex.is-pics img { width: calc(var(--u)*44); height: calc(var(--u)*44); border-radius: calc(var(--u)*8); object-fit: cover; box-shadow: 0 0 0 calc(var(--u)*2) #fff, var(--bq8-sh-1); }
.e14 .e14-say8 { font-size: calc(var(--u)*34); }
.e14 .bq8-slot__body { width: 100%; flex: 1 1 auto; min-height: calc(var(--u)*120); align-content: center; gap: calc(var(--u)*8); }
.e14 .bq8-slot.is-lit { border-style: solid; border-color: var(--bq8-yellow); box-shadow: 0 0 0 calc(var(--u)*6) rgba(255,194,26,.45); }
.e14-tray8 { flex: none; width: 100%; display: flex; direction: rtl; flex-wrap: wrap; justify-content: center; align-content: center; gap: calc(var(--u)*12); padding: calc(var(--u)*12); min-height: calc(var(--u)*100);
  border-radius: calc(var(--u)*28); background: rgba(255,255,255,.55); border: calc(var(--u)*3) dashed rgba(11,45,79,.18); }
.e14-tray8:empty { display: none; }
.e14 .bq8-tile.e14-t8 { --w: max(64px, calc(var(--u)*84)); --fs: .6; }
.e14 .bq8-tile.e14-t8.is-syll { --fs: .54; }
.e14 .e14-wt.bq8-tile { width: auto; aspect-ratio: auto; height: max(64px, calc(var(--u)*84)); --w: max(64px, calc(var(--u)*84)); display: inline-flex; gap: calc(var(--u)*8); padding: 0 calc(var(--u)*14) 0 calc(var(--u)*8); }
.e14 .e14-wt img { width: calc(var(--w) * .72); height: calc(var(--w) * .72); border-radius: calc(var(--u)*12); object-fit: cover; pointer-events: none; }
.e14 .e14-wt > span { font-size: calc(var(--w) * .34); }
.e14 .bq8-slot__body .bq8-tile.e14-t8 { --w: max(64px, calc(var(--u)*76)); }
.e14 .bq8-slot__body .e14-wt.bq8-tile { --w: max(64px, calc(var(--u)*72)); }
.e14 .bq8-slot__body .bq8-tile { cursor: pointer; }
.e14 .bq8-tile.is-in { animation: bq8-snap .3s cubic-bezier(.3,1.6,.5,1) both; }
/* tall (portrait): branches become full-width rows */
.x7p.e14.is-tall .e14-map8 { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto repeat(3, minmax(0, 1fr)); row-gap: calc(var(--u)*20); }
.x7p.e14.is-tall .e14-lines8 { display: none; }
.x7p.e14.is-tall .bq8-slot { flex-direction: row; align-items: center; }
.x7p.e14.is-tall .bq8-slot__label { flex-direction: column; border-radius: calc(var(--u)*24); padding: calc(var(--u)*8); min-width: max(64px, calc(var(--u)*100)); }
.x7p.e14.is-tall .bq8-slot__body { justify-content: flex-start; min-height: 0; }
`;

  function run8(stage, ctx) {
    const X = BQ.ix7b, h = BQ.h, W = X.W;
    X.style('st-e14v8', CSS8);
    const S = X.session(ctx);
    const root = X.root(ctx, 'e14', { panel: ['wide', 'tall', 'col'], stars: 3, bariqTop: true });
    const F8 = root._8;
    const map = h('div.e14-map8');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'e14-lines8'); svg.setAttribute('aria-hidden', 'true');
    const center = h('div.e14-c8.bq8-tile.bq8-tile--letter', { role: 'img', 'aria-label': 'خَريطَةُ المِيمِ' }, h('span', null, 'م'));
    map.append(svg, center);
    const brEl = {}, bodyEl = {}, paths = {}, need = {}, got = {};
    BR.forEach((b) => {
      const ex = LBL8[b.id]
        ? h('span.e14-ex', { 'aria-hidden': 'true' }, LBL8[b.id].map((t) => h('span', null, t)))
        : h('span.e14-ex.is-pics', { 'aria-hidden': 'true' }, ['mawz', 'qamar'].map((k) => h('img', { src: ctx.img(W[k].img), alt: '', draggable: 'false' })));
      const label = h('button.bq8-slot__label', { type: 'button', 'aria-label': b.label, onclick: () => S.say(b.line) }, h('img', { src: ctx.img(b.icon), alt: '', draggable: 'false' }), ex, X.i8('listen', 'e14-say8'));
      const bb = h('div.bq8-slot__body');
      const el = h('div.bq8-slot.x7-8.x7-in', { role: 'group', 'aria-label': b.label, dataset: { br: b.id } }, label, bb);
      brEl[b.id] = el; bodyEl[b.id] = bb;
      need[b.id] = PIECES.filter((p) => p.br === b.id).length; got[b.id] = 0;
      paths[b.id] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svg.append(paths[b.id]);
      map.append(el);
    });
    const tray = h('div.e14-tray8', { role: 'group', 'aria-label': 'القِطَعُ' });
    root.append(map, tray);
    const buddy = X.buddy(root);
    function lines() {
      const mr = map.getBoundingClientRect(), cr = center.getBoundingClientRect(); if (!mr.width) return;
      const cx = cr.left + cr.width / 2 - mr.left, cy = cr.bottom - mr.top;
      BR.forEach((b) => {
        const r = brEl[b.id].getBoundingClientRect();
        const x = r.left + r.width / 2 - mr.left, y = r.top - mr.top;
        paths[b.id].setAttribute('d', `M${cx.toFixed(1)} ${cy.toFixed(1)} C ${cx.toFixed(1)} ${((cy + y) / 2).toFixed(1)}, ${x.toFixed(1)} ${((cy + y) / 2).toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`);
      });
    }
    requestAnimationFrame(lines);
    if (window.ResizeObserver) { const ro = new ResizeObserver(() => lines()); ro.observe(map); ctx.onCleanup(() => ro.disconnect()); }

    const errs = new Map();
    let placed = 0, busy = false;
    const dnd = X.dnd({
      root,
      onPick: (t) => { if (t._d.w) S.say(t._d.au, { stim: true }); },
      onDrop: (t, z) => {
        const p = t._d;
        if (z.dataset.br === p.br) { settle(t, p); return true; }
        const n = (errs.get(t) || 0) + 1; errs.set(t, n);
        z.classList.add('is-wrong'); setTimeout(() => z.classList.remove('is-wrong'), 320);
        buddy.mood('think', 1300);
        S.say(X.G.try);
        if (n >= 2) { brEl[p.br].classList.add('is-lit'); setTimeout(() => brEl[p.br].classList.remove('is-lit'), 2600); }
        return false;
      },
    });
    BR.forEach((b) => dnd.zone(brEl[b.id], { br: b.id }));
    BQ.shuffle(PIECES).forEach((p) => {
      const t = p.w
        ? h('div.bq8-tile.e14-wt.x7-8', { 'aria-label': W[p.w].t }, h('img', { src: ctx.img(W[p.w].img), alt: '', draggable: 'false' }), X.markMeem(W[p.w].t))
        : h('div.bq8-tile.e14-t8.x7-8' + (X.bare(p.t).length > 1 || /[ًٌٍَُِّْ]/.test(p.t) ? '.is-syll' : ''), { 'aria-label': p.t }, X.markMeem(p.t));
      t.dataset.br = p.br;
      tray.append(dnd.tile(t, p));
    });

    function settle(t, p) {
      // the tile itself moves into the branch body at once (no ghost flight, no fly-back) + a short settle bounce
      dnd.tiles.delete(t);
      t.classList.remove('x7-tile', 'is-lifted', 'is-sel');
      t.classList.add('is-placed', 'is-in');
      t.setAttribute('role', 'button'); t.tabIndex = 0;
      const tc = t.cloneNode(true); // fresh node: drops the drag listeners → in the branch it only plays its sound
      tc.addEventListener('click', () => S.say(p.au, { stim: !/_G_|_E14_/.test(p.au) }));
      t.replaceWith(tc);
      bodyEl[p.br].append(tc);
      brEl[p.br].classList.add('is-filled');
      S.fx(X.sfx.snap, 0.5);
      X.burst(tc, 8);
      buddy.mood('clap', 1200);
      S.say(p.au, { stim: !/_G_|_E14_/.test(p.au) });
      if (++got[p.br] === need[p.br]) { F8.star(); paths[p.br].classList.add('on'); }
      if (++placed === PIECES.length) setTimeout(finish, 900);
      requestAnimationFrame(lines);
    }

    note8();
    (async () => {
      ctx.instruction(X.text('bq7_E14_intro'), 'bq7_E14_intro', { icon: 'hand' });
      await X.nameSound(S, 'bq7_E14_intro');
      for (const b of BR) { brEl[b.id].classList.add('is-lit'); paths[b.id].classList.add('on'); await S.say(b.line); brEl[b.id].classList.remove('is-lit'); if (got[b.id] < need[b.id]) paths[b.id].classList.remove('on'); }
    })();

    async function finish() {
      if (busy) return; busy = true;
      ctx.instruction(X.text('bq7_E14_summary'), 'bq7_E14_summary', { icon: 'eye' });
      for (const b of BR) { brEl[b.id].classList.add('is-lit'); paths[b.id].classList.add('on'); await S.sleep(450); }
      buddy.mood('cheer', 4000);
      await S.say('bq7_E14_summary');
      ctx.done();
      X.end(ctx, S, {});
    }
    function note8() {
      const btn = h('button', { type: 'button', class: 'bq-btn ghost', onclick: () => {
        const box = h('div', { dir: 'rtl', style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7mm', width: '255mm', font: '700 30px BQ8 Letter' } });
        BR.forEach((b) => {
          const col = h('div', { style: { border: '2px dashed #9ab', borderRadius: '6mm', padding: '4mm', textAlign: 'center' } }, h('div', { style: { font: '700 22px Scheherazade New', marginBottom: '3mm' } }, b.label));
          PIECES.filter((p) => p.br === b.id).forEach((p) => col.append(h('div', { style: { margin: '2mm', display: 'inline-block', padding: '1mm 4mm', border: '2px solid #0B2D4F', borderRadius: '4mm' } }, X.markMeem(p.w ? W[p.w].t : p.t))));
          box.append(col);
        });
        X.print([{ node: box }], { title: 'خريطة الميم', landscape: true });
      } }, 'اطبع الخريطة (A4)');
      X.note(ctx, h('div', null,
        h('div', { html: '<p><b>ما يجري:</b> يسحب الطفل ١٣ قطعة إلى فروعها الثلاثة: أشكال الميم (مـ ـمـ ـم م) · الميم مع الحركات (مَ مِ مُ ما مي مو) · كلمات فيها الميم (مكتب، مانجو، نمور). يمكنه أيضاً لمس القطعة ثم لمس الفرع. على كلّ فرع صورته وأمثلة ممّا يوضع فيه، ولمس رأس الفرع يُسمِع اسمه.</p>' +
          '<p><b>التغذية:</b> القطعة الصحيحة تستقرّ في الفرع مباشرة وتُسمِع صوتها؛ غيرها تهتزّ وتعود مع «جرّب مرّة أخرى»، وبعد خطأين يضيء فرعها. نجمة لكلّ فرع يكتمل. غير مسجَّل (تعزيز).</p>' +
          '<p><b>بعده:</b> اطلب منه أن «يقرأ» الخريطة لك: يلمس كلّ قطعة ويقولها معها.</p>' }),
        btn));
    }
  }

  function run(stage, ctx) {
    const X = BQ.ix7b, h = BQ.h, W = X.W;
    if (X.v8()) return run8(stage, ctx);
    X.style('st-e14', CSS);
    const S = X.session(ctx);
    const root = X.root(ctx, 'e14');
    const fitH = () => { const H = stage.clientHeight || 600; root.style.setProperty('--H', H + 'px'); root.classList.toggle('is-short', H < 420); root.classList.toggle('is-narrow', H >= 420 && stage.clientWidth < 600); };
    fitH();
    const map = h('div.e14-map');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'e14-lines'); svg.setAttribute('aria-hidden', 'true');
    const center = h('div.e14-center', { role: 'img', 'aria-label': 'خَريطَةُ المِيمِ' }, h('img', { src: ctx.img('map_center'), alt: '', draggable: 'false' }), h('span.e14-m', { 'aria-hidden': 'true' }, 'م'));
    map.append(svg, center);
    const brEl = {}, bodyEl = {}, paths = {};
    BR.forEach((b) => {
      const head = h('button.e14-bh', { type: 'button', 'aria-label': b.label, onclick: () => S.say(b.line) }, h('img', { src: ctx.img(b.icon), alt: '', draggable: 'false' }), X.icon('speaker'));
      const bb = h('div.e14-bb');
      const el = h('div.e14-br.x7-in', { role: 'group', 'aria-label': b.label, dataset: { br: b.id } }, head, bb);
      brEl[b.id] = el; bodyEl[b.id] = bb;
      paths[b.id] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svg.append(paths[b.id]);
      map.append(el);
    });
    const tray = h('div.e14-tray', { role: 'group', 'aria-label': 'القِطَعُ' });
    root.append(map, tray);
    const buddy = X.buddy(root);
    function lines() {
      const mr = map.getBoundingClientRect(), cr = center.getBoundingClientRect();
      const cx = cr.left + cr.width / 2 - mr.left, cy = cr.top + cr.height * 0.8 - mr.top;
      BR.forEach((b) => {
        const r = brEl[b.id].getBoundingClientRect();
        const x = r.left + r.width / 2 - mr.left, y = r.top - mr.top + 4;
        paths[b.id].setAttribute('d', `M${cx.toFixed(1)} ${cy.toFixed(1)} C ${cx.toFixed(1)} ${((cy + y) / 2).toFixed(1)}, ${x.toFixed(1)} ${((cy + y) / 2).toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`);
      });
    }
    requestAnimationFrame(lines);
    if (window.ResizeObserver) { const ro = new ResizeObserver(() => { fitH(); lines(); }); ro.observe(stage); ro.observe(map); ctx.onCleanup(() => ro.disconnect()); }

    const errs = new Map();
    let placed = 0, busy = false;
    const dnd = X.dnd({
      root,
      onPick: (t) => { if (t._d.w) S.say(t._d.au, { stim: true }); },
      onDrop: (t, z) => {
        const p = t._d;
        if (z.dataset.br === p.br) { settle(t, p); return true; }
        const n = (errs.get(t) || 0) + 1; errs.set(t, n);
        X.anim(t, 'fx7-wob', 450); buddy.mood('think', 1300);
        S.say(X.G.try);
        if (n >= 2) { brEl[p.br].classList.add('is-lit'); setTimeout(() => brEl[p.br].classList.remove('is-lit'), 2600); }
        return false;
      },
    });
    BR.forEach((b) => dnd.zone(brEl[b.id], { br: b.id }));
    BQ.shuffle(PIECES).forEach((p) => {
      const t = p.w
        ? h('div.is-word', { 'aria-label': 'بِطاقَةٌ' }, h('span.e14-tp', null, X.pic(ctx, W[p.w].img)), X.markMeem(W[p.w].t))
        : h('div', { 'aria-label': 'قِطْعَةٌ' }, h('span.x7-w', null, p.t));
      t.dataset.br = p.br; // للاختبار الآليّ وقارئ الشاشة لا يقرؤه
      tray.append(dnd.tile(t, p));
    });

    function settle(t, p) {
      t.classList.add('is-used');
      const chip = p.w
        ? h('span.e14-chip.is-word', { role: 'button', tabindex: '0', 'aria-label': W[p.w].t, onclick: () => S.say(p.au, { stim: true }) }, h('span.e14-cp', null, X.pic(ctx, W[p.w].img)), X.markMeem(W[p.w].t))
        : h('span.e14-chip', { role: 'button', tabindex: '0', 'aria-label': p.t, onclick: () => S.say(p.au, { stim: true }) }, h('span.x7-w', null, p.t));
      bodyEl[p.br].append(chip);
      S.fx(X.sfx.snap, 0.5);
      X.burst(chip, 8);
      buddy.mood('clap', 1200);
      S.say(p.au, { stim: !/_G_|_E14_/.test(p.au) });
      setTimeout(() => t.remove(), 300);
      if (++placed === PIECES.length) setTimeout(finish, 900);
      requestAnimationFrame(lines);
    }

    note();
    (async () => {
      ctx.instruction(X.text('bq7_E14_intro'), 'bq7_E14_intro', { icon: 'hand' });
      await X.nameSound(S, 'bq7_E14_intro');
      for (const b of BR) { brEl[b.id].classList.add('is-lit'); paths[b.id].classList.add('on'); await S.say(b.line); brEl[b.id].classList.remove('is-lit'); paths[b.id].classList.remove('on'); }
    })();

    async function finish() {
      if (busy) return; busy = true;
      ctx.instruction(X.text('bq7_E14_summary'), 'bq7_E14_summary', { icon: 'eye' });
      for (const b of BR) { brEl[b.id].classList.add('is-lit'); paths[b.id].classList.add('on'); await S.sleep(450); }
      buddy.mood('cheer', 4000);
      await S.say('bq7_E14_summary');
      ctx.done();
      X.end(ctx, S, {});
    }

    function note() {
      const btn = h('button', { type: 'button', class: 'bq-btn ghost', onclick: () => {
        // الخريطة كاملة (مرجع للمعلّم) أيّاً كان تقدّم الطفل
        const c = map.cloneNode(true);
        c.querySelectorAll('.is-lit, .x7-in').forEach((e) => e.classList.remove('is-lit', 'x7-in'));
        const ln = c.querySelector('.e14-lines'); if (ln) ln.remove();
        c.querySelectorAll('.e14-br').forEach((br) => {
          const bb = br.querySelector('.e14-bb'); bb.replaceChildren();
          PIECES.filter((p) => p.br === br.dataset.br).forEach((p) => bb.append(p.w
            ? h('span.e14-chip.is-word', { style: { animation: 'none' } }, h('span.e14-cp', null, X.pic(ctx, W[p.w].img)), X.markMeem(W[p.w].t))
            : h('span.e14-chip', { style: { animation: 'none' } }, h('span.x7-w', null, p.t))));
        });
        c.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:auto auto;gap:7mm;width:165mm;--H:700px';
        X.print([{ node: h('div.x7.e14', { dir: 'rtl', style: { width: '170mm', zoom: '1.5' } }, c) }], { title: 'خريطة الميم', landscape: true });
      } }, 'اطبع الخريطة (A4)');
      X.note(ctx, h('div', null,
        h('div', { html: '<p><b>ما يجري:</b> يسحب الطفل ١٣ قطعة إلى فروعها الثلاثة: أشكال الميم (مـ ـمـ ـم م) · الميم مع الحركات (مَ مِ مُ ما مي مو) · كلمات فيها الميم (مكتب، مانجو، نمور). يمكنه أيضاً لمس القطعة ثم لمس الفرع.</p>' +
          '<p><b>التغذية:</b> القطعة الصحيحة تستقرّ وتُسمِع صوتها؛ غيرها ترتدّ مع «جرّب مرّة أخرى»، وبعد خطأين يضيء فرعها. غير مسجَّل (تعزيز).</p>' +
          '<p><b>بعده:</b> اطلب منه أن «يقرأ» الخريطة لك: يلمس كلّ قطعة ويقولها معها.</p>' }),
        btn));
    }
  }

  BQ.register(ID, {
    render(stage, ctx) {
      BQ.loadScript('js/el7/ix7b.js').then(() => { if (ctx.alive()) run(stage, ctx); })
        .catch((e) => { console.warn('[E14] ' + e.message); if (ctx.placeholder) ctx.placeholder(); });
    },
  });
})();
