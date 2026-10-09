/* E14 · خَريطَةٌ مَفاهيمِيَّةٌ — IX2 · v7 · draft_unapproved · SPEC_v7 §E14 · تعزيز (2 · 3 · 5) · غير مسجَّل
   بعده: يجمع ما تعلّمه في صورة واحدة: أشكال الميم وحركاتها وكلماتها.
   خلَف «الخريطة الذهنية» (EL15) في الأصل: مركز وفروع بأيقونات + بطاقات تُسحب إلى مكانها (سحب بالإصبع/الفأرة، أو لمس البطاقة ثم الفرع).
   المركز map_center وعليه «م» · ثلاثة فروع: أشكال المِيمِ (map_icon_forms) · المِيمُ مَعَ الحَرَكاتِ (map_icon_vowels) · كَلِماتٌ فيها المِيمُ (map_icon_words).
   ١٣ قطعة مخلوطة في الدرج: مـ ـمـ ـم م · مَ مِ مُ ما مي مو · مَكْتَبْ مانْجو نُمورْ (صورة + كلمة).
   ✓ تستقرّ بنقرة + صوتها · ✗ ترتدّ + «جَرِّبْ مَرَّةً أُخْرى.» · بعد خطأين على القطعة نفسها يضيء فرعها. النهاية: الفروع تضيء واحداً واحداً + الملخّص.
   الطباعة للمعلّم فقط (زرّ في دليل المعلّم).
   v8 (?theme=8 · OWNER_R3-14): (١) الإفلات يستقرّ مباشرة في الفرع (البطاقة نفسها تنتقل إلى جسم الفرع بارتداد قصير) — لا عودة ثم هبوط؛
   الخطأ = اهتزاز لطيف ثمّ تعود · (٢) كلّ حرف داخل بطاقته (Vazirmatn، الحجم من عرض البطاقة، فُحص «مِ» و«مُ» آليّاً) · (٣) كلّ فرع يقول
   ما يوضع فيه: صورة الفرع + شكل الحرف الذي يخصّه (مـ ـمـ ـم · مَ مِ مُ · بطاقات بصور) + سمّاعة؛ ٣ نجوم = فرع اكتمل.
   v8 E14 fixed slots (المالك 2026-10-06 «ثبّت مقاس مربعات الإجابة»): لكلّ فرع خانات ثابتة فارغة ظاهرة بعدد إجاباته (٤ · ٦ · ٣)،
   القطعة تستقرّ في وسط أوّل خانة فارغة وتصغر إن لزم؛ الفروع والدرج بمقاسات ثابتة على مسرح 1180×820 فلا تداخل ولا خروج عن الإطار.
   SCI-1 T3 (2026-10-07): v8 = ٣ مراحل واحدة بعد واحدة (قصيرة ← طويلة ← أشكال الحرف)، لكلّ قطعة خانتها بصورة باهتة، ثم الخريطة كاملة (انظر run8).
   مسار v7 (?theme=0) بقي كما هو (قديم). */
(function () {
  'use strict';
  const ID = 'E14';
  const BR = [
    { id: 'forms', icon: 'map_icon_forms', line: 'bq7_E14_br_forms', label: 'أَشْكالُ المِيمِ' },
    { id: 'vowels', icon: 'map_icon_vowels', line: 'bq7_E14_br_vowels', label: 'المِيمُ مَعَ الحَرَكاتِ' },
    { id: 'words', icon: 'map_icon_words', line: 'bq7_E14_br_words', label: 'كَلِمَاتٌ فِيهَا حَرْفُ الْمِيمِ' } /* CODE-14 P6-6 */,
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
.e14 img, .x7-ghost img { max-width: 100%; -webkit-user-drag: none; -webkit-touch-callout: none; user-select: none; -webkit-user-select: none; }
`;

  /* ---------- v8 · SCI-1 T3 (2026-10-07) ----------
     SCI «الخريطة المفاهيمية غير واضحة ولا تؤدي للهدف … التقسيم إلى حركات قصيرة ثم طويلة ثم أشكال الحرف» + «هيا نكمل الشكل، انظر، ثم ضع كل قطعة في مكانها الصحيح».
     The map is built in 3 clear stages, ONE AT A TIME: (1) short vowels مَ مِ مُ → (2) long vowels ما مي مو → (3) letter forms مـ ـمـ ـم م.
     Every answer slot shows a faint picture of the piece that belongs there («اُنْظُرْ»), so each piece has ONE right place («في مَكانِها الصَّحيحِ»).
     The stage's branch lights up, Bariq says its title with the sounds, only that stage's pieces are in the tray; finished branch = a star + its
     connector lights; after stage 3 the whole map lights and Bariq reads it (summary). Feedback (OWNER_R3 global ladder): ✓ the piece snaps into
     its slot (green) + its sound · ✗1 red slot shake + «جَرِّبْ» and the piece goes back · ✗2 on the same piece → Bariq puts it in its place + model.
     FIXED big slots (owner 2026-10-06 «ثبّت مقاس مربعات الإجابة» — kept): all sizes are constants of the 1180×820 stage (--u):
       slot 100u (inner 94u) ← placed tile 88u · tray tile 96u (≥ 64 px on the glass in iPad landscape 0.85 and portrait 0.664)
       top row: short 400u | centre 170u | long 400u (+2×24u) = 1018u ≤ 1058u · forms row 806u
       heights: top 214u + 14u + forms 140u = 368u · + 14u + tray 156u = 538u ≤ 550u → nothing grows, nothing overlaps, nothing leaves the frame. */
  const STAGES = [
    { id: 'short', line: 'bq7_E14_st_short', label: 'حَرَكاتٌ قَصيرَةٌ', cue: 'short',
      pieces: [{ t: 'مَ', au: 'bq7_S_ma' }, { t: 'مِ', au: 'bq7_S_mi' }, { t: 'مُ', au: 'bq7_S_mu' }] },
    { id: 'long', line: 'bq7_E14_st_long', label: 'حَرَكاتٌ طَويلَةٌ', cue: 'long',
      pieces: [{ t: 'مَا', au: 'bq7_S_maa' }, { t: 'مِي', au: 'bq7_S_mii' }, { t: 'مُو', au: 'bq7_S_muu' }] }, // full tashkeel incl. the long vowels (SCI «بحركات المدود»)
    { id: 'forms', line: 'bq7_E14_st_forms', label: 'أَشْكالُ الحَرْفِ', icon: 'map_icon_forms',
      pieces: [{ t: 'مـ', au: 'bq7_G_pos_first' }, { t: 'ـمـ', au: 'bq7_G_pos_mid' }, { t: 'ـم', au: 'bq7_G_pos_last' }, { t: 'م', au: 'bq7_E14_alone' }] },
  ];
  const CSS8 = `
.x7p.e14 { padding: calc(var(--u)*16) calc(var(--u)*18); gap: calc(var(--u)*14); justify-content: center; }
.e14-map8 { --S: calc(var(--u)*100); --SG: calc(var(--u)*12); position: relative; flex: none; width: 100%; height: calc(var(--u)*368); display: grid; justify-content: center;
  grid-template-columns: calc(var(--u)*400) calc(var(--u)*170) calc(var(--u)*400); grid-template-rows: calc(var(--u)*214) calc(var(--u)*140); column-gap: calc(var(--u)*24); row-gap: calc(var(--u)*14); }
.e14-lines8 { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 0; }
.e14-lines8 path { fill: none; stroke: rgba(11,45,79,.28); stroke-width: calc(var(--u)*6); stroke-linecap: round; stroke-dasharray: 0 calc(var(--u)*16); transition: stroke .3s; }
.e14-lines8 path.on { stroke: var(--bq8-yellow); stroke-dasharray: none; }
.e14-c8 { grid-column: 2; grid-row: 1; justify-self: center; align-self: center; position: relative; z-index: 1; --w: calc(var(--u)*150); color: var(--bq8-meem); cursor: default; }
.e14-c8.bq8-tile { --fs: .62; }
.e14-c8.is-lit { box-shadow: inset 0 calc(var(--u)*-6) 0 rgba(214,143,0,.22), 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*14) var(--bq8-yellow), var(--bq8-sh-2); }
.e14 .bq8-slot { position: relative; z-index: 1; box-sizing: border-box; justify-content: center; align-items: center; gap: calc(var(--u)*8); min-width: 0; min-height: 0; overflow: visible;
  padding: calc(var(--u)*8); border-width: calc(var(--u)*3); background: rgba(255,255,255,.72); transition: opacity .3s, box-shadow .3s, background .3s; }
.e14 .bq8-slot[data-br="short"] { grid-column: 1; grid-row: 1; --slot-c: var(--bq8-mouth); }
.e14 .bq8-slot[data-br="long"] { grid-column: 3; grid-row: 1; --slot-c: var(--bq8-ear); }
.e14 .bq8-slot[data-br="forms"] { grid-column: 1 / -1; grid-row: 2; justify-self: center; flex-direction: row; width: calc(var(--u)*806); --slot-c: var(--bq8-eye); }
.e14 .bq8-slot.is-later { opacity: .5; }
.e14 .bq8-slot.is-cur { opacity: 1; border-style: solid; border-color: var(--bq8-yellow); background: rgba(255,250,228,.95); box-shadow: 0 0 0 calc(var(--u)*6) rgba(255,194,26,.35), var(--bq8-sh-2); }
.e14 .bq8-slot.is-filled { opacity: 1; }
.e14 .bq8-slot__label { flex: none; border: 0; cursor: pointer; height: calc(var(--u)*76); min-height: max(64px, calc(var(--u)*76)); padding: calc(var(--u)*4) calc(var(--u)*16) calc(var(--u)*4) calc(var(--u)*10); gap: calc(var(--u)*10);
  font: 700 calc(var(--u)*30)/1.9 var(--font-kid, var(--font-ui)); white-space: nowrap; }
.e14 .bq8-slot__label img { width: calc(var(--u)*56); height: calc(var(--u)*56); object-fit: contain; border-radius: 0; }
.e14 .e14-cue { flex: none; display: block; height: calc(var(--u)*22); border-radius: 999px; background: var(--bq8-navy); }
.e14 .e14-cue.is-short { width: calc(var(--u)*22); } .e14 .e14-cue.is-long { width: calc(var(--u)*70); }
.e14 .e14-say8 { font-size: calc(var(--u)*34); }
.e14 .bq8-slot__body { flex: none; min-height: 0; min-width: 0; display: flex; flex-wrap: nowrap; direction: rtl; justify-content: center; align-items: center; gap: var(--SG); }
.e14-slot { position: relative; box-sizing: border-box; flex: none; width: var(--S); height: var(--S); display: grid; place-items: center;
  border-radius: calc(var(--u)*20); border: calc(var(--u)*3) dashed rgba(11,45,79,.32); background: rgba(255,255,255,.6); transition: background .2s, border-color .2s; }
.e14-slot > .e14-gh { font: 700 calc(var(--S) * var(--fs, .54))/1.25 var(--font-letter); color: #CDD3D9; white-space: nowrap; padding-bottom: calc(var(--S) * .06); pointer-events: none; user-select: none; -webkit-user-select: none; }
.e14-slot.is-full { border-style: solid; border-color: rgba(31,157,99,.5); background: rgba(207,245,226,.6); }
.e14-slot.is-full > .e14-gh { display: none; }
.e14-slot.is-over:not(.is-full) { border-color: var(--bq8-star-d); border-style: solid; background: rgba(255,240,184,.95); }
.e14-slot.is-no { border-color: #E53935; border-style: solid; background: rgba(229,57,53,.12); animation: bq8-shake-soft .35s ease; }
.e14-slot.is-hint:not(.is-full) { border-color: var(--bq8-yellow); border-style: solid; box-shadow: 0 0 0 calc(var(--u)*6) rgba(255,194,26,.55); }
.e14-tray8 { flex: none; box-sizing: border-box; width: calc(var(--u)*806); height: calc(var(--u)*156); display: flex; direction: rtl; flex-wrap: nowrap; justify-content: center; align-items: center;
  gap: calc(var(--u)*30); padding: calc(var(--u)*10); border-radius: calc(var(--u)*28); background: rgba(255,255,255,.55); border: calc(var(--u)*3) dashed rgba(11,45,79,.18); }
.e14 .bq8-tile.e14-t8 { --w: calc(var(--u)*110); --fs: .6; } /* FIX12-B B-13: 110u ≈ 73 px on the glass in iPad portrait (×0.664) — was 96u = 64 px */
.e14 .bq8-tile.e14-t8.is-syll, .e14-slot.is-syll { --fs: .54; }
.e14 .e14-slot > .bq8-tile { --w: calc(var(--u)*88); margin: 0; cursor: pointer; box-shadow: inset 0 calc(var(--u)*-5) 0 rgba(31,157,99,.18), 0 calc(var(--u)*3) calc(var(--u)*6) rgba(11,45,79,.22); }
.e14 .bq8-tile.is-in { animation: e14-snap .3s cubic-bezier(.3,1.6,.5,1) both; }
@keyframes e14-snap { 0% { transform: scale(1.06); } 100% { transform: scale(1); } }
.e14 img, .x7-ghost img { max-width: 100%; -webkit-user-drag: none; -webkit-touch-callout: none; user-select: none; -webkit-user-select: none; }
@media (prefers-reduced-motion: reduce) { .e14-slot.is-no { animation: none; } .e14 .bq8-tile.is-in { animation: none; } }
`;

  function run8(stage, ctx) {
    const X = BQ.ix7b, h = BQ.h;
    X.style('st-e14v8t3', CSS8);
    const S = X.session(ctx);
    const root = X.root(ctx, 'e14', { panel: ['wide', 'tall', 'col'], stars: 3, bariqTop: true });
    const F8 = root._8;
    const map = h('div.e14-map8');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'e14-lines8'); svg.setAttribute('aria-hidden', 'true');
    const center = h('div.e14-c8.bq8-tile.bq8-tile--letter', { role: 'img', 'aria-label': 'خَريطَةُ المِيمِ' }, h('span', null, 'م'));
    map.append(svg, center);
    const isSyll = (t) => X.bare(t).length > 1 || /[ًٌٍَُِّْ]/.test(t);
    const brEl = {}, slotsOf = {}, paths = {};
    STAGES.forEach((st) => {
      const lead = st.cue ? h('span.e14-cue.is-' + st.cue, { 'aria-hidden': 'true' }) : h('img', { src: ctx.img(st.icon), alt: '', draggable: 'false' });
      const label = h('button.bq8-slot__label', { type: 'button', 'aria-label': st.label, onclick: () => { if (!S.live) return; S.say(st.line); } }, lead, h('span', null, st.label), X.i8('listen', 'e14-say8'));
      // FIX12-B B-02 (owner rule «never show the answer before the child answers»): the slots are EMPTY — no faint glyph. Any piece of the
      // lit branch goes into any empty slot of that branch; ✗ = a piece dropped on another branch. Order is tidied when the branch is full.
      const slots = st.pieces.map((p) => h('div.e14-slot' + (isSyll(p.t) ? '.is-syll' : ''), { dataset: { t: p.t, br: st.id }, 'aria-label': 'خانَةٌ' }));
      const body = h('div.bq8-slot__body.e14-slots', null, slots);
      const el = h('div.bq8-slot.x7-8.x7-in.is-later', { role: 'group', 'aria-label': st.label, dataset: { br: st.id } }, label, body);
      brEl[st.id] = el; slotsOf[st.id] = slots;
      paths[st.id] = document.createElementNS('http://www.w3.org/2000/svg', 'path'); svg.append(paths[st.id]);
      map.append(el);
    });
    const tray = h('div.e14-tray8', { role: 'group', 'aria-label': 'القِطَعُ' });
    root.append(map, tray);
    const buddy = X.buddy(root);
    function lines() {
      const mr = map.getBoundingClientRect(); if (!mr.width || !map.offsetWidth) return;
      const k = mr.width / map.offsetWidth;
      const L = (e) => { const r = e.getBoundingClientRect(); return { l: (r.left - mr.left) / k, t: (r.top - mr.top) / k, r: (r.right - mr.left) / k, b: (r.bottom - mr.top) / k }; };
      const c = L(center), cx = (c.l + c.r) / 2, cy = (c.t + c.b) / 2, f = (n) => n.toFixed(1);
      STAGES.forEach((st) => {
        const r = L(brEl[st.id]); let d;
        if (st.id === 'forms') d = `M${f(cx)} ${f(c.b)} L ${f(cx)} ${f(r.t)}`;
        else if (r.l >= c.r) d = `M${f(c.r)} ${f(cy)} L ${f(r.l)} ${f(cy)}`;
        else d = `M${f(c.l)} ${f(cy)} L ${f(r.r)} ${f(cy)}`;
        paths[st.id].setAttribute('d', d);
      });
    }
    requestAnimationFrame(lines);
    if (window.ResizeObserver) { const ro = new ResizeObserver(() => lines()); ro.observe(map); ctx.onCleanup(() => ro.disconnect()); }

    let si = -1, got = 0, intro = true, finished = false, helpedSt = false;
    const errs = new Map();
    const slotFor = () => slotsOf[STAGES[si].id].find((s) => !s.classList.contains('is-full'));
    const dnd = X.dnd({
      root,
      canDrag: () => !intro && !finished,
      onDrop: (t, z) => {
        const p = t._d;
        if (z.dataset.br === STAGES[si].id && !z.classList.contains('is-full')) { settle(t, p, z); return true; }
        const n = (errs.get(p.t) || 0) + 1; errs.set(p.t, n);
        z.classList.remove('is-no'); void z.offsetWidth; z.classList.add('is-no'); setTimeout(() => z.classList.remove('is-no'), 700);
        if (BQ.fb) BQ.fb.markNo(z, { stay: false, ms: 1300 }); // FB-1: clear red mark on the chosen slot
        buddy.mood('think', 1300);
        if (n >= 2) {
          // ✗2: Bariq puts the piece in its place and says it (no star credit change — the stage still completes)
          setTimeout(async () => {
            if (!t.isConnected || !dnd.tiles.has(t)) return;
            const s = slotFor(p); if (!s) return;
            s.classList.add('is-hint'); buddy.mood('talk', 1800);
            await S.say(X.G.model);
            if (t.isConnected && dnd.tiles.has(t)) { helpedSt = true; settle(t, p, s, true); }
          }, 380);
        } else S.say(X.tryL()); // FB-1 shared retry pool
        return false;
      },
    });

    function settle(t, p, slot, solved) {
      dnd.tiles.delete(t); dnd.zones.delete(slot);
      const tc = t.cloneNode(true); // fresh node: no drag listeners → in its slot it only plays its sound
      tc.classList.remove('x7-tile', 'is-lifted', 'is-sel', 'is-used'); tc.classList.add('is-placed', 'is-in');
      tc.removeAttribute('style'); tc.setAttribute('role', 'button'); tc.tabIndex = 0;
      tc.addEventListener('click', () => S.say(p.au, { stim: !/_G_|_E14_/.test(p.au) }));
      t.remove();
      slot.classList.remove('is-hint', 'is-over', 'is-no'); slot.classList.add('is-full'); slot.append(tc);
      const fit = () => { tc.style.scale = ''; const k = Math.min(1, (slot.clientWidth - 2) / (tc.offsetWidth || 1), (slot.clientHeight - 2) / (tc.offsetHeight || 1)); if (k < 1) tc.style.scale = k.toFixed(3); };
      fit(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
      S.fx(X.sfx.snap, 0.5); X.burst(tc, 8); buddy.mood(solved ? 'talk' : 'clap', 1200);
      // FB-1: ✗2 → encouraging line · right after a ✗1 → a praise sentence (the child needs to hear that the retry was right)
      const sayP = S.say(p.au, { stim: !/_G_|_E14_/.test(p.au) }).then(() => (solved ? S.say(X.solveL()) : (errs.get(p.t) || 0) >= 1 ? S.say(X.yes()) : null));
      if (++got === STAGES[si].pieces.length) sayP.then(() => stageDone());
    }
    async function stageDone() {
      const st = STAGES[si];
      // tidy: the placed pieces take the canonical order of the branch (مَ مِ مُ · مَا مِي مُو · مـ ـمـ ـم م)
      const placed = new Map(slotsOf[st.id].map((s) => s.querySelector('.bq8-tile')).filter(Boolean).map((tc) => [tc.dataset.t, tc]));
      slotsOf[st.id].forEach((s) => { const tc = placed.get(s.dataset.t); if (tc && tc.parentNode !== s) s.append(tc); });
      brEl[st.id].classList.remove('is-cur'); brEl[st.id].classList.add('is-filled');
      paths[st.id].classList.add('on'); buddy.mood('cheer', 1600);
      // FB-1 star rule: the stage star is gold only when the child placed every piece himself; Bariq placed one → «helped» slot
      if (helpedSt && F8.starsEl) { const sl = F8.starsEl.children[F8.stars]; F8.star(); if (BQ.fb) BQ.fb.helpSlot(sl); } else F8.star();
      if (!helpedSt) await S.say(X.yes()); // praise only for a stage the child completed himself (the solve line was already said)
      if (si + 1 < STAGES.length) startStage(si + 1); else finish();
    }
    async function startStage(i) {
      si = i; got = 0; intro = true; errs.clear(); helpedSt = false;
      const st = STAGES[i];
      STAGES.forEach((x, j) => { brEl[x.id].classList.toggle('is-later', j > i); brEl[x.id].classList.toggle('is-cur', j === i); });
      tray.replaceChildren();
      // every still-empty slot of every branch is a drop zone (a piece on another branch = ✗); the lit branch is the right one
      STAGES.forEach((x) => slotsOf[x.id].forEach((s) => { if (!s.classList.contains('is-full') && !dnd.zones.has(s)) dnd.zone(s, { t: s.dataset.t }); }));
      // the stage title with its sounds, said while its branch lights (look first: the faint pieces show where each one goes)
      buddy.mood('talk', 2000);
      await S.say(st.line);
      if (!S.live) return;
      BQ.shuffle(st.pieces.slice()).forEach((p) => {
        const tl = h('div.bq8-tile.e14-t8.x7-8' + (isSyll(p.t) ? '.is-syll' : ''), { 'aria-label': p.t, dataset: { br: st.id, t: p.t } }, X.markMeem(p.t));
        tray.append(dnd.tile(tl, p));
      });
      intro = false;
    }
    async function finish() {
      if (finished) return; finished = true;
      tray.replaceChildren();
      ctx.instruction(X.text('bq7_E14_summary8'), 'bq7_E14_summary8', { icon: 'eye' });
      center.classList.add('is-lit');
      for (const st of STAGES) { brEl[st.id].classList.add('is-cur'); await S.sleep(350); }
      buddy.mood('cheer', 4000);
      await S.say('bq7_E14_summary8');
      ctx.done();
      X.end(ctx, S, {});
    }
    note8();
    (async () => {
      ctx.instruction(X.text('bq7_E14_intro8'), 'bq7_E14_intro8', { icon: 'hand' });
      await S.say('bq7_E14_intro8');
      if (S.live) startStage(0);
    })();
    function note8() {
      const btn = h('button', { type: 'button', class: 'bq-btn ghost', onclick: () => {
        const box = h('div', { dir: 'rtl', style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7mm', width: '255mm', font: '700 30px BQ8 Letter' } });
        STAGES.forEach((st) => {
          const col = h('div', { style: { border: '2px dashed #9ab', borderRadius: '6mm', padding: '4mm', textAlign: 'center' } }, h('div', { style: { font: '700 22px Scheherazade New', marginBottom: '3mm' } }, st.label));
          st.pieces.forEach((p) => col.append(h('div', { style: { margin: '2mm', display: 'inline-block', padding: '1mm 4mm', border: '2px solid #0B2D4F', borderRadius: '4mm' } }, X.markMeem(p.t))));
          box.append(col);
        });
        X.print([{ node: box }], { title: 'خريطة الميم', landscape: true });
      } }, 'اطبع الخريطة (A4)');
      X.note(ctx, h('div', null,
        h('div', { html: '<p><b>ما يجري (٣ مراحل، واحدة في كلّ مرّة):</b> (١) الحركات القصيرة مَ مِ مُ ← (٢) الحركات الطويلة ما مي مو ← (٣) أشكال الحرف مـ ـمـ ـم م. في كلّ مرحلة يضيء فرعها ويقول بارق عنوانه بأصواته، وفي كلّ خانة صورة باهتة للقطعة التي تُوضع فيها («اُنْظُر، ثُمَّ ضَع كُلَّ قِطْعَةٍ في مَكانِها الصَّحيحِ»). يسحب الطفل القطعة أو يلمسها ثم يلمس الخانة. في الختام تضيء الخريطة كاملة ويقرؤها بارق.</p>' +
          '<p><b>التغذية:</b> الصحيحة تستقرّ في خانتها وتُسمِع صوتها · الخطأ الأوّل: الخانة تهتزّ بالأحمر و«جرّب مرّة أخرى» · الخطأ الثاني على القطعة نفسها: بارق يضعها في مكانها ويُسمِعها. نجمة لكلّ مرحلة. غير مسجَّل (تعزيز).</p>' +
          '<p><b>بعده:</b> اطلب منه أن «يقرأ» الخريطة: يلمس كلّ قطعة ويقولها معها، ثم يقارن مَ بـ ما.</p>' }),
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
