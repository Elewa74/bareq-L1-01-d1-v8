/* E06 · اِكْتَشِفِ الحَرْفَ — IX1 · v7 (قاعدة: النسخة الأولى — عنصر جديد بلغة «اقرأ» الأصليّ: بطاقة ورقية للحرف + صور) · draft_unapproved
   SPEC_v7 §E06 · الناتج 2 · S5 · DECISIONS (ب): هنا فقط يظهر الرمز «م» واسمه «المِيم» — والاسم يتبعه الصوت دائماً.
   ماذا يستطيع بعده ولم يكن قبله؟ يربط صوت /م/ بالرمز «م»، ويعرف اسمه مقروناً بصوته، ويجده بعينه داخل كلمة مكتوبة سمعها.
   ١ bq7_E06_recall (لقطة الفم، بلا كتابة) · ٢ الكشف: لوح بارق (e06_board) ← «م» يُرسَم كبيراً لحظة bq7_E06_reveal ← bq7_E06_brq_wow
   ٣ bq7_E06_vowels ← مَ مِ مُ مكتوبة · bq7_E06_tap_vowels (يجب لمس الثلاث؛ كلّ لمسة تُسمِع المقطع)
   ٤ bq7_E06_find_intro ← مُشْطْ · مِفْتاحْ · نُمورْ (الميم في الوسط): الكلمة بخطّ النسخ الحقيقيّ وكلّ حرف منطقة لمس (عقدة نصّ واحدة بتشكيل حقيقيّ + مناطق لمس مقيسة بـ Range — I.tapWord)
     ✓ الميم تضيء مرجانياً + G_yes* + E06_ok_letter + _seg · ✗١ G_look_shape («م» الكبيرة تنبض) · ✗٢ G_look_light (الميم تتوهّج) · ③ G_model + _seg
   ٥ bq7_E06_match_intro — من الصوت إلى الرمز، الخيارات مكتوبة **صامتة** حتى الحكم: مُ (بُ · فُ) · مِ (نِ · فِ) · ما (با · فا)
     ✓ G_yes* + المقطع · ✗١ G_look_shape + إعادة الصوت · ✗٢ يخفت مشتّت + G_look_light · ③ G_model + المقطع. النهاية bq7_E06_end.
   record('S5', ok1) لكلّ بند في ٤ و٥. ctx.step 'words' | 'match'.
   جولة إصلاح 2026-10-05: الاسم «المِيم» لا يُقال وحده أبداً — يتبعه الصوت «مَ» فوراً (DECISIONS ب · R1-10):
   الكشف ← bq7_E06_brq_wow مباشرة («حَرْفُ المِيمِ! صَوْتُهُ: مَ!») · الإصابة في الكلمة ← brq_wow بدل ok_letter (الاسم وحده) ·
   find_intro (الاسم وحده إلى أن يُعاد تسجيله) ← يتبعه «مَ» وبطاقة «م» تنبض. مناطق لمس الحروف ≥ ٦٠ نقطة (R3-F3، I.tapWord). */
(function () {
  'use strict';
  const ID = 'E06';
  const lib = () => (BQ.ix1 ? Promise.resolve(BQ.ix1) : BQ.loadScript('js/el7/lib/ix1.js').then(() => BQ.ix1));

  const CSS = `
.e06 { justify-content: space-between; }
.e06 .e06-main { position: relative; flex: 1 1 auto; min-height: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(10px, 2.4cqi, 22px); }
.e06 .e06-mouthw { width: min(30cqi, calc(var(--i7-h) - 140px), 320px); }
.e06 .e06-mouthw .i7-mouth { width: 100%; border-radius: var(--r-lg, 26px); }
/* اللوح */
.e06 .e06-boardw { position: relative; width: min(72cqi, calc((var(--i7-h) - 90px) * 1.5), 720px); aspect-ratio: 3 / 2; }
.e06 .e06-board { position: absolute; inset: 6% 4% 10% 22%; border-radius: 22px; background: linear-gradient(180deg, #FFFDF4, var(--paper, #FFFBEA)); border: 8px solid #D9A35C;
  box-shadow: inset 0 0 0 3px #F1DFA6, 0 14px 30px rgba(110,60,10,.22); display: grid; place-items: center; overflow: hidden; }
.e06 .e06-board.is-art { inset: 0; border: 0; background: center/cover no-repeat; box-shadow: 0 14px 30px var(--shade); border-radius: var(--r-lg, 26px); }
.e06 .e06-board svg { width: 78%; height: 88%; overflow: visible; }
.e06 .e06-board svg text { font-family: var(--ff-child); font-weight: 700; font-size: 232px; fill: rgba(228,85,63,0); stroke: var(--coral, #E4553F); stroke-width: 5; stroke-linejoin: round; stroke-dasharray: 1700; stroke-dashoffset: 1700; }
.e06 .e06-board.drawn svg text { animation: e06Draw 1.5s ease-out forwards; }
.e06 .e06-board.lit svg text { fill: var(--coral, #E4553F); stroke: #F7A08F; filter: drop-shadow(0 0 14px rgba(254,186,2,.65)); transition: fill .5s; }
@keyframes e06Draw { to { stroke-dashoffset: 0; } }
.e06 .e06-holder { position: absolute; bottom: 0; inset-inline-end: 0; width: 30%; aspect-ratio: 1; }
.e06 .e06-holder .bq-brq { width: 100%; height: 100%; }
.e06 .e06-holder .bq-brq img { width: 100%; height: 100%; object-fit: contain; }
.e06 .e06-boardw.is-art .e06-holder { display: none; }
/* لوح ART (1600×900): السطح الأبيض ≈ 7%–62% أفقياً و19%–78% عمودياً — الحرف يُرسم داخله لا فوق بارق */
.e06 .e06-boardw.is-art { aspect-ratio: 16 / 9; width: min(76cqi, calc((var(--i7-h) - 90px) * 1.78), 820px); }
.e06 .e06-board.is-art svg { position: absolute; left: 7.5%; top: 19%; width: 55%; height: 58%; }
/* بطاقات الحرف (ورقية كما في «اقرأ» الأصليّ) */
.e06 .e06-tiles { display: flex; gap: clamp(14px, 4cqi, 40px); justify-content: center; }
.e06 .e06-tile { position: relative; width: min(22cqi, calc(var(--i7-h) - 230px), 180px); min-width: 96px; aspect-ratio: 1; border-radius: var(--r-lg, 26px); border: 2px solid var(--paper-edge, #F1DFA6); background: var(--paper, #FFFBEA); cursor: pointer; padding: 0;
  box-shadow: 0 6px 0 var(--paper-edge, #F1DFA6), 0 12px 22px var(--shade); display: grid; place-items: center; transition: transform .2s, opacity .3s, box-shadow .25s; }
.e06 .e06-tile span { font: 700 min(11cqi, 92px)/1 var(--ff-child); color: var(--ink, #0F2A44); transform: translateY(-15%); } /* الضمّة فوق والكسرة تحت داخل البطاقة */
.e06 .e06-tile span b { color: var(--coral); font-weight: 700; }
.e06 .e06-tile.is-play { box-shadow: 0 0 0 6px var(--sky), 0 12px 22px var(--shade); transform: translateY(-5px); }
.e06 .e06-tile.is-heard::after { content: ''; position: absolute; top: -10px; inset-inline-end: -10px; width: 32px; height: 32px; border-radius: 50%; background: var(--sky) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M11 25l9 9 17-19' fill='none' stroke='%23fff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/70% no-repeat; }
.e06 .e06-tile.is-ok { box-shadow: 0 0 0 6px var(--ok), 0 12px 22px var(--shade); }
.e06 .e06-tile.is-soft, .e06 .e06-tile.is-glow { box-shadow: 0 0 0 7px var(--sun-soft), 0 0 30px var(--sun-soft); }
.e06 .e06-tile.is-dim { opacity: .35; }
.e06 .e06-tile:active { transform: scale(.95); }
.e06 .e06-tile.need:not(.is-heard) { animation: i7Pulse 1.6s ease-in-out infinite; }
/* الكلمة */
.e06 .e06-wrow { display: flex; align-items: center; justify-content: center; gap: clamp(14px, 4cqi, 44px); flex-wrap: wrap; }
.e06 .e06-wpic { --s: min(24cqi, calc(var(--i7-h) - 300px), 210px); min-width: 96px; }
.e06 .e06-word { font-size: clamp(72px, 13cqi, 140px); padding: 0 .4em; text-align: center; border-radius: var(--r-lg, 26px); background: var(--paper, #FFFBEA); border: 2px solid var(--paper-edge, #F1DFA6); box-shadow: 0 10px 24px var(--shade); }
.e06 .e06-ref { display: inline-grid; place-items: center; width: 92px; height: 92px; border-radius: 26px; background: var(--paper, #FFFBEA); color: var(--coral); font: 700 66px/1 var(--ff-child); border: 2px solid var(--paper-edge); box-shadow: 0 5px 0 var(--paper-edge); padding: 0; cursor: pointer; }
.e06 .e06-ref span { transform: translateY(-8%); }
.e06 .e06-ref.is-hint { animation: i7Pulse .8s ease-in-out 3; box-shadow: 0 0 0 5px var(--sun), 0 0 24px var(--sun); }
@container stage (max-width: 600px) {
  .e06 .e06-boardw, .e06 .e06-boardw.is-art { width: 94cqi; }
  .e06 .e06-tile { width: 27cqi; min-width: 92px; } .e06 .e06-tile span { font-size: 14cqi; }
  .e06 .e06-word { font-size: 22cqi; padding: 0 .4em; min-width: min(100cqi, 312px); } .e06 .e06-wpic { --s: min(36cqi, calc(var(--i7-h) - 440px), 150px); }
  .e06 .e06-mouthw { width: 56cqi; }
}
@media (max-height: 500px) {
  .e06 .e06-main { flex-direction: row; gap: 16px; }
  .e06 .e06-mouthw { width: max(120px, calc(var(--i7-h) - 40px)); }
  .e06 .e06-boardw.is-art, .e06 .e06-boardw { width: calc((var(--i7-h) - 30px) * 1.78); }
  .e06 .e06-wrow { flex-wrap: nowrap; gap: 16px; }
  .e06 .e06-word { font-size: min(80px, calc((var(--i7-h) - 40px) / 2.3)); min-width: 312px; }
  .e06 .e06-wpic { --s: max(96px, calc(var(--i7-h) - 110px)); }
  .e06 .e06-ref { width: 64px; height: 64px; font-size: 46px; border-radius: 18px; }
  .e06 .e06-tile { width: max(96px, calc(var(--i7-h) - 100px)); }
  .e06 .e06-tile span { font-size: min(64px, calc(var(--i7-h) / 3.6)); }
}
@media (prefers-reduced-motion: reduce) { .e06 .e06-board.drawn svg text { animation: none; stroke-dashoffset: 0; } .e06 .e06-ref.is-hint, .e06 .e06-tile.need { animation: none !important; } }`;
  /* v8 (OWNER_R3-6 · THEME8 D1 · mockup style_v8/BOARD.png): carved wooden board · every letter / syllable / word in Vazirmatn (--font-letter,
     the familiar closed-head meem) · the big «م» reference tile on the right · syllable tiles with a speaker chip (they are heard when touched) ·
     the written choices of the «match» step stay SILENT until judged (DECISIONS ج) — so they carry no speaker chip · 3 star slots per part. */
  const CSS8 = `
.e06-8 .e06-main { position: relative; flex: 1 1 auto; min-height: 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*56); }
.e06-8 .e06-mouthw { width: calc(var(--u)*330); }
.e06-8 .bq8-tile { cursor: pointer; touch-action: manipulation; }
.e06-8 .bq8-tile > span { position: relative; display: inline-block; line-height: 1.25; }
.e06-8 .e06-kas { position: absolute; top: 1.2em; right: -.02em; width: .26em; height: .085em; border-radius: .05em; background: currentColor; transform: rotate(-24deg); }
.e06-8 .bq8-tile .bq8-m, .e06-8 .bq8-tile b { color: var(--bq8-meem); font-weight: 700; }
.e06-8 .bq8-tile b { position: relative; display: inline-block; line-height: 1.25; }
.e06-8 .e06-big8 { --w: calc(var(--u)*300); --fs: .66; background: linear-gradient(#FFF6D6, #FFE7A0); cursor: default; }
.e06-8 .e06-big8 svg { width: 100%; height: 100%; overflow: visible; }
.e06-8 .e06-big8 svg text { font-family: var(--font-letter); font-weight: 700; font-size: 250px; fill: rgba(226,87,76,0); stroke: var(--bq8-meem); stroke-width: 5; stroke-linejoin: round; stroke-dasharray: 1900; stroke-dashoffset: 1900; }
.e06-8 .e06-big8.drawn svg text { animation: e06Draw 1.5s ease-out forwards; }
.e06-8 .e06-big8.lit svg text { fill: var(--bq8-meem); stroke: #F7A08F; filter: drop-shadow(0 0 10px rgba(255,194,26,.7)); transition: fill .5s; }
.e06-8 .e06-ref { --w: calc(var(--u)*170); --fs: .62; color: var(--bq8-meem); background: linear-gradient(#FFF6D6, #FFE7A0); }
.e06-8 .e06-ref.is-hint { animation: i7Pulse .8s ease-in-out 3; box-shadow: inset 0 calc(var(--u)*-6) 0 rgba(214,143,0,.22), 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*12) var(--bq8-yellow), 0 0 calc(var(--u)*30) var(--bq8-yellow); }
.e06-8 .e06-tiles { display: flex; gap: calc(var(--u)*44); align-items: flex-start; justify-content: center; }
.e06-8 .e06-t8 { display: flex; flex-direction: column; align-items: center; gap: calc(var(--u)*16); }
.e06-8 .e06-tile.bq8-tile { --w: calc(var(--u)*170); --fs: .56; }
.e06-8 .e06-ref.e06-ref-big { --w: calc(var(--u)*250); }
.e06-8 .e06-tile .e06-spk { position: absolute; bottom: calc(var(--u)*-82); left: 50%; translate: -50% 0; width: calc(var(--u)*70); height: calc(var(--u)*70); border-radius: 50%;
  display: grid; place-items: center; font-size: calc(var(--u)*50); background: radial-gradient(circle at 38% 30%, #fff, #FFE38A 62%); border: calc(var(--u)*3) solid var(--bq8-navy); box-shadow: 0 0 0 calc(var(--u)*4) #fff; }
.e06-8 .e06-tile:has(.e06-spk) { margin-bottom: calc(var(--u)*82); overflow: visible; }
.e06-8 .e06-tile.is-play { transform: translateY(calc(var(--u)*-6)); box-shadow: inset 0 calc(var(--u)*-6) 0 rgba(214,143,0,.22), 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-listen), var(--bq8-sh-2); }
.e06-8 .e06-tile.is-heard::after { content: ''; position: absolute; top: calc(var(--u)*-16); inset-inline-end: calc(var(--u)*-16); width: calc(var(--u)*50); aspect-ratio: 1; background: url(assets/icons8/check.svg) center / contain no-repeat; }
.e06-8 .e06-tile.is-ok { box-shadow: inset 0 calc(var(--u)*-6) 0 rgba(214,143,0,.22), 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-ok), var(--bq8-sh-2); }
.e06-8 .e06-tile.is-soft, .e06-8 .e06-tile.is-glow { box-shadow: inset 0 calc(var(--u)*-6) 0 rgba(214,143,0,.22), 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-yellow), 0 0 calc(var(--u)*30) var(--bq8-yellow); }
.e06-8 .e06-tile.is-dim { opacity: .38; filter: grayscale(.5); }
.e06-8 .e06-tile.need:not(.is-heard) { animation: i7Pulse 1.6s ease-in-out infinite; }
.e06-8 .e06-wrow { display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*40); }
.e06-8 .e06-wpic.i7-card.i8-card { --s: calc(var(--u)*230); }
/* step 4 «find the م»: the word card takes the board width — font 180 u so the narrowest «م» zone (medial, «نُمورْ») is ≥ 64 px on a portrait iPad (scale 0.664) */
.e06-8 .e06-main.is-words { gap: calc(var(--u)*26); }
.e06-8 .e06-main.is-words .e06-wrow { gap: calc(var(--u)*26); }
.e06-8 .e06-main.is-words .e06-ref { --w: calc(var(--u)*130); }
.e06-8 .e06-main.is-words .e06-wpic.i7-card.i8-card { --s: calc(var(--u)*184); }
.e06-8 .e06-main.is-words .e06-word { font-size: calc(var(--u)*180); line-height: 1.62; padding: 0 calc(var(--u)*30); min-width: calc(var(--u)*500); }
.bq8-stage .e06-8 .i7-tw-d.is-no { color: var(--bq8-no); text-shadow: none; }
.bq8-stage .e06-8 .i7-tw-hit.is-no { border-radius: calc(var(--u)*18); box-shadow: inset 0 0 0 calc(var(--u)*6) #E53935 !important; background: rgba(229,57,53,.10); } /* FB-1: clear RED, drawn INSIDE the card */
.bq8-stage .e06-8 .i7-tw-d.is-no { color: #E53935; }
.bq8-stage .e06-8 .i7-tw-hit.i8-ok { border-radius: calc(var(--u)*18); box-shadow: inset 0 0 0 calc(var(--u)*6) #22C27A !important; background: rgba(34,194,122,.12); }
.bq8-stage .e06-8 .i7-tw-hit.i8-ok::after { content: ''; position: absolute; top: calc(var(--u)*4); left: 50%; translate: -50% 0; width: calc(var(--u)*46); aspect-ratio: 1;
  background: url(assets/icons8/check.svg) center / 100% no-repeat; animation: i7Pop .4s ease-out; }
.bq8-stage .e06-8 .i7-tw-hit.i8-x::after { content: ''; position: absolute; top: calc(var(--u)*4); left: 50%; translate: -50% 0; width: calc(var(--u)*46); aspect-ratio: 1;
  background: #fff url(assets/icons8/close.svg) center / 100% no-repeat; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,.25); animation: i7Pop .4s ease-out; }
.e06-8 .e06-word { font-family: var(--font-letter); font-weight: 700; font-size: calc(var(--u)*120); line-height: 1.75; padding: 0 calc(var(--u)*40); min-width: max(340px, calc(var(--u)*420)); text-align: center;
  border-radius: calc(var(--u)*30); background: #fff; border: var(--bq8-line) solid var(--bq8-navy); box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-2); color: var(--bq8-navy); }
.e06-8 .i7-tw-d.is-m { color: var(--bq8-meem); }
.bq8-stage.is-tall .e06-8 .e06-main { flex-direction: column; gap: calc(var(--u)*40); }
.bq8-stage.is-tall .e06-8 .e06-wrow { flex-direction: column; }
.bq8-stage.is-tall .e06-8 .e06-mouthw { width: calc(var(--u)*520); }
@media (prefers-reduced-motion: reduce) { .e06-8 .e06-big8.drawn svg text { animation: none; stroke-dashoffset: 0; } .e06-8 .e06-ref.is-hint, .e06-8 .e06-tile.need { animation: none !important; } }`;

  function render(stage, ctx) {
    lib().then((I) => { if (ctx.alive()) run(I, stage, ctx); })
      .catch((e) => { console.warn('E06 lib', e); if (ctx.placeholder) ctx.placeholder(); });
  }

  function run(I, stage, ctx) {
    const h = BQ.h;
    if (!document.getElementById('st-e06')) document.head.append(h('style', { id: 'st-e06' }, CSS));
    if (!document.getElementById('st-e06-8')) document.head.append(h('style', { id: 'st-e06-8' }, CSS8));
    const S = I.session(ctx, { noText: false });
    const V8 = I.v8();
    /* v8 element builders */
    const ref8 = (big) => { const sp = h('span', null, 'م'); const t = h('button.e06-ref.bq8-tile.bq8-tile--letter' + (big ? '.e06-ref-big' : ''), { type: 'button', 'aria-label': 'م', lang: 'ar' }, sp); I.fitGlyph(t, sp, 0.16); return t; };
    // Vazirmatn draws the kasra of an isolated «مِ» INTO the tail (owner: unreadable) → the letter is set bare and the kasra is drawn
    // as its own clear stroke under the head (same colour, same size class as the font's kasra). Other marks stay real font marks.
    const kas8 = (g) => g.replace(/\u0645\u0650/g, '\u0645<i class="e06-kas" aria-hidden="true"></i>');
    const tile8 = (g, aria, spk) => { const sp = h('span', { html: kas8(g) }); const t = h('button.e06-tile.bq8-tile.bq8-tile--syll', { type: 'button', 'aria-label': aria, lang: 'ar' }, sp); if (spk) t.append(h('span.e06-spk', { 'aria-hidden': 'true' }, I.i8('listen'))); I.fitGlyph(t, sp, 0.13); return t; };
    I.lines({
      bq7_E06_recall: 'سَمِعْنا هَذا الصَّوْتَ: مَ… مِ… مُ.', bq7_E06_reveal: 'وَهَذا شَكْلُهُ: م. هَذا حَرْفُ المِيمِ.', bq7_E06_brq_wow: 'حَرْفُ الْمِيمِ، صَوْتُهُ: مَ – مِ – مُ.',
      bq7_E06_vowels: 'المِيمُ مَعَ الحَرَكاتِ: مَ… مِ… مُ.', bq7_E06_tap_vowels: 'اِخْتَرْ كُلَّ وَاحِدَةٍ، وَاسْتَمِعْ.',
      bq7_E06_find_intro: 'اِسْتَمِعْ إِلَى الْكَلِمَةِ، وَحَدِّدْ حَرْفَ الْمِيمِ، صَوْتُهُ: مَ – مِ – مُ.', bq7_E06_ok_letter: 'هَذَا حَرْفُ الْمِيمِ، صَوْتُهُ: مَ – مِ – مُ.',
      bq7_E06_match_intro: 'اِسْتَمِعْ، ثُمَّ اخْتَرِ الْمَكْتُوبَ الَّذِي سَمِعْتَهُ.', bq7_E06_end: 'الآنَ نَعْرِفُ شَكْلَ صَوْتِنا: م.',
    });
    const SYL = [{ s: 'ma', g: 'مَ' }, { s: 'mi', g: 'مِ' }, { s: 'mu', g: 'مُ' }];
    const WORDS = [{ slug: 'musht' }, { slug: 'miftah' }, { slug: 'numur' }];
    const MATCH = [{ s: 'mu', opts: ['مُ', 'بُ', 'فُ'] }, { s: 'mi', opts: ['مِ', 'نِ', 'فِ'] }, { s: 'maa', opts: ['ما', 'با', 'فا'] }];
    const sid = (s) => 'bq7_S_' + s;
    const colorM = (g) => (g[0] === 'م' ? '<b>' + g + '</b>' : g);

    const f8 = V8 ? I.frame8(S, 'e06-8', { board: true, pose: 'point' }) : null;
    const root = V8 ? f8.panel : I.root(stage, 'e06');
    const top = h('div.i7-row');
    const steps = I.stars(top, 2 + WORDS.length + MATCH.length);
    const main = h('div.e06-main');
    if (V8) root.append(main); else root.append(top, main);
    const buddy = I.buddy(S, root, 'wave');
    let busy = true, si = 0;
    const log = [];

    async function recall() {
      steps.cur(si);
      const mw = h('div.e06-mouthw'); const mouth = V8 ? I.mouth8(S) : I.mouth(S); mw.append(mouth.el);
      main.replaceChildren(mw);
      I.instr(S, 'bq7_E06_recall', 'ear', async () => { if (busy) return; busy = true; await mouth.sayLine('bq7_E06_recall', 'a', 1.6); busy = false; });
      await S.sleep(400);
      await mouth.sayLine('bq7_E06_recall', 'a', 1.6);
    }

    async function reveal8() {
      const big = h('div.bq8-tile.e06-big8', { role: 'img', 'aria-label': 'الحَرْفُ م' });
      big.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 400 400" aria-hidden="true"><text x="200" y="250" text-anchor="middle">م</text></svg>');
      main.replaceChildren(big);
      buddy.set('point');
      I.instr(S, 'bq7_E06_reveal', 'eye', async () => { if (busy) return; busy = true; await S.say('bq7_E06_reveal'); busy = false; });
      await S.sleep(400);
      const p = S.say('bq7_E06_reveal');
      await S.wait(1100);
      I.sfx('rise'); big.classList.add('drawn');
      await S.wait(I.reduced() ? 150 : 1400);
      big.classList.add('lit'); I.sfx('sparkle'); I.burst(root, big, 26);
      await p;
      buddy.cheer();
      await S.say('bq7_E06_brq_wow', { talk: true });
      steps.on(si++);
    }
    async function reveal() {
      if (V8) return reveal8();
      const art = I.hasImg('e06_board');
      const board = h('div.e06-board' + (art ? '.is-art' : ''), { role: 'img', 'aria-label': 'الحَرْفُ م' });
      if (art) board.style.backgroundImage = 'url("' + I.imgSrc('e06_board') + '")';
      board.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 400 300" aria-hidden="true"><text x="200" y="176" text-anchor="middle">م</text></svg>');
      const wrap = h('div.e06-boardw' + (art ? '.is-art' : ''), null, board, h('span.e06-holder', null, BQ.ui.brq('point')));
      main.replaceChildren(wrap);
      buddy.el.style.visibility = 'hidden';
      I.instr(S, 'bq7_E06_reveal', 'eye', async () => { if (busy) return; busy = true; await S.say('bq7_E06_reveal'); busy = false; });
      await S.sleep(400);
      const p = S.say('bq7_E06_reveal');
      await S.wait(1100);
      I.sfx('rise'); board.classList.add('drawn');
      await S.wait(I.reduced() ? 150 : 1400);
      board.classList.add('lit'); I.sfx('sparkle'); I.burst(root, board, 26);
      await p;
      wrap.querySelector('.e06-holder .bq-brq').brq && wrap.querySelector('.e06-holder .bq-brq').brq('cheer');
      await S.say('bq7_E06_brq_wow', { talk: true }); // بلا فاصل: «…حَرْفُ المِيمِ.» ← «حَرْفُ المِيمِ! صَوْتُهُ: مَ!» (الاسم لا يبقى وحده)
      buddy.el.style.visibility = '';
      steps.on(si++);
    }

    async function vowels() {
      steps.cur(si);
      const wrap = h('div.e06-tiles', { role: 'group', 'aria-label': 'مَ مِ مُ' });
      const tiles = SYL.map((x, i) => { const t = V8 ? tile8(colorM(x.g), x.g, true) : h('button.e06-tile', { type: 'button', 'aria-label': x.g, lang: 'ar' }, h('span', { html: colorM(x.g) })); t.x = x; t.classList.add('i7-in'); t.style.animationDelay = (i * 0.12) + 's'; wrap.append(t); return t; });
      if (V8) { const rb = ref8(true); rb.tabIndex = -1; rb.addEventListener('click', async () => { if (busy) return; busy = true; rb.classList.add('is-hint'); await S.say('bq7_E06_brq_wow', { talk: true }); rb.classList.remove('is-hint'); busy = false; }); main.replaceChildren(rb, wrap); }
      else main.replaceChildren(wrap);
      const p = S.say('bq7_E06_vowels');
      for (const t of tiles) { await S.wait(900); t.classList.add('is-play'); setTimeout(() => t.classList.remove('is-play'), 600); }
      await p;
      I.instr(S, 'bq7_E06_tap_vowels', 'hand', async () => { if (busy) return; busy = true; await S.say('bq7_E06_tap_vowels'); busy = false; });
      await S.say('bq7_E06_tap_vowels');
      tiles.forEach((t) => t.classList.add('need'));
      let res = null;
      tiles.forEach((t) => t.addEventListener('click', async () => {
        if (busy) return; busy = true;
        await I.playOn(S, t, sid(t.x.s));
        t.classList.add('is-heard'); busy = false;
        if (res && tiles.every((x) => x.classList.contains('is-heard'))) { const r = res; res = null; r(); }
      }));
      busy = false;
      await S.gate(new Promise((r) => { res = r; }));
      busy = true;
      I.sfx('sparkle'); buddy.cheer();
      await S.sleep(500);
      steps.on(si++);
    }

    async function words() {
      for (const w of WORDS) {
        steps.cur(si);
        const info = I.W[w.slug];
        const tw = I.tapWord(info.w, { aria: info.w, minW: V8 ? 64 : 60, whole: (c) => c.b === 'م' }); // تشكيل حقيقيّ + مناطق لمس مقيسة (lib) · منطقة «م» تشمل رسمها وحركتها كاملين
        const word = tw.el; word.classList.add('e06-word');
        const spans = tw.cl.map((c) => c.hit);
        const tIdx = tw.cl.findIndex((c) => c.b === 'م');
        const target = spans[tIdx];
        if (BQ.fb) spans.forEach((x) => BQ.fb.qa(x, x === target)); // automated QA only
        const pic = I.card(w.slug, { aria: info.w, text: true }); pic.classList.add('e06-wpic', 'i7-in');
        const refB = V8 ? ref8() : h('button.e06-ref', { type: 'button', 'aria-label': 'م', lang: 'ar' }, h('span', null, 'م'));
        main.replaceChildren(refB, h('div.e06-wrow', null, pic, word)); main.classList.add('is-words');
        if (V8 && w === WORDS[0]) f8.stars(WORDS.length);
        word.classList.add('i7-in');
        const sayWord = () => I.playOn(S, pic, I.wordId(w.slug));
        pic.addEventListener('click', async () => { if (busy) return; busy = true; await sayWord(); busy = false; });
        refB.addEventListener('click', async () => { if (busy) return; busy = true; refB.classList.add('is-hint'); await S.stim(sid('ma')); refB.classList.remove('is-hint'); busy = false; });
        // الاسم يتبعه الصوت: سطر find_intro المسجَّل يذكر «حَرْفَ المِيمِ» وحده ← «مَ» فوراً مع نبض بطاقة «م»
        const findIntro = async () => { await S.say('bq7_E06_find_intro'); refB.classList.remove('is-hint'); void refB.offsetWidth; refB.classList.add('is-hint'); await S.stim(sid('ma')); await S.sleep(250); };
        I.instr(S, 'bq7_E06_find_intro', 'hand', async () => { if (busy) return; busy = true; await findIntro(); await sayWord(); busy = false; });
        let n = 0, first = null;
        await new Promise((resolve) => {
          const tap = async (s) => {
            if (busy || s.classList.contains('is-m') || s.classList.contains('i8-x')) return;
            busy = true;
            if (s === target) {
              if (first == null) { first = true; I.record(S, 'S5', true, { item: w.slug }); log.push([info.w, true]); }
              tw.unpaint(tIdx, 'is-hint'); tw.paint(tIdx, 'is-m'); s.classList.add('i8-ok'); I.sfx('ok'); I.burst(root, s, 16); buddy.cheer(); if (V8) f8.star();
              await S.say(I.yes(), { talk: true });
              await S.say('bq7_E06_brq_wow', { talk: true }); // «حَرْفُ المِيمِ! صَوْتُهُ: مَ!» — الاسم مقروناً بالصوت (ok_letter المسجَّل يقول الاسم وحده)
              await I.playOn(S, pic, I.segId(w.slug));
              await S.sleep(350);
              return resolve();
            }
            if (first == null) { first = false; I.record(S, 'S5', false, { item: w.slug }); log.push([info.w, false]); }
            // OWNER_R3 ladder: ✗1 the tapped letter turns red + retry line (+ the «م» card pulses — a shape cue, not the answer)
            // FB-1: the red mark STAYS on the wrong letter (owner «علامة حمراء على الاختيار»); it cannot be chosen again
            const si2 = s.idx; tw.paint(si2, 'is-no'); s.classList.add('i8-x'); I.sfx('soft');
            n++; buddy.think();
            if (n === 1) { await S.say(I.tryL(), { talk: true }); refB.classList.remove('is-hint'); void refB.offsetWidth; refB.classList.add('is-hint'); await S.say('bq7_G_look_shape'); busy = false; return; }
            // ✗2 Bariq solves: the meem lights up + the word in parts + an encouraging line
            tw.paint(tIdx, 'is-m'); target.classList.add('i8-ok'); buddy.point(); I.helped = true; if (V8) f8.help(); // FB-1: no star for a Bariq-solved word
            await I.playOn(S, pic, I.segId(w.slug)); await S.say(I.solveL(), { talk: true });
            return resolve();
          };
          spans.forEach((s) => s.addEventListener('click', () => tap(s)));
          (async () => { busy = true; await S.sleep(450); if (w === WORDS[0]) await findIntro(); await sayWord(); busy = false; })();
        });
        steps.on(si++);
        busy = true;
      }
    }

    async function match() {
      for (let k = 0; k < MATCH.length; k++) {
        const it = MATCH[k];
        steps.cur(si);
        const refB = V8 ? ref8() : h('button.e06-ref', { type: 'button', 'aria-label': 'م', lang: 'ar', tabindex: '-1' }, h('span', null, 'م'));
        if (V8) { refB.tabIndex = -1; if (k === 0) f8.stars(MATCH.length); }
        const wrap = h('div.e06-tiles', { role: 'group', 'aria-label': 'مَكْتوبٌ' });
        const tiles = BQ.shuffle(it.opts).map((g, i) => { const t = V8 ? tile8(g, g, false) : h('button.e06-tile', { type: 'button', 'aria-label': g, lang: 'ar' }, h('span', { html: g })); t.g = g; t.classList.add('i7-in'); t.style.animationDelay = (i * 0.1) + 's'; wrap.append(t); return t; });
        main.replaceChildren(refB, wrap); main.classList.remove('is-words');
        const right = () => tiles.find((t) => t.g === it.opts[0]);
        const ask = () => S.stim(sid(it.s));
        I.instr(S, 'bq7_E06_match_intro', 'ear', async () => { if (busy) return; busy = true; await ask(); busy = false; });
        let first = null;
        const pol = I.policy(S, {
          opts: tiles, right,
          async hint1() { refB.classList.remove('is-hint'); void refB.offsetWidth; refB.classList.add('is-hint'); await S.say('bq7_G_look_shape'); await ask(); },
          async model() { await I.playOn(S, right(), sid(it.s)); },
        });
        await new Promise((resolve) => {
          tiles.forEach((t) => t.addEventListener('click', async () => {
            if (busy || I.isNo(t)) return;
            busy = true; // الخيار المكتوب صامت حتى الحكم (DECISIONS ج)
            if (t === right()) {
              if (first == null) { first = true; I.record(S, 'S5', true, { item: 'match-' + it.s }); log.push([it.opts[0], true]); }
              t.classList.remove('is-soft'); t.classList.add('is-ok'); I.anim(t, 'i7-pop', 450); I.sfx('ok'); I.burst(root, t, 12); buddy.cheer();
              tiles.forEach((x) => { if (x !== t && !x.classList.contains('is-no')) x.classList.add('is-dim'); });
              if (V8) f8.star();
              await S.say(I.yes(), { talk: true });
              await I.playOn(S, t, sid(it.s));
              await S.sleep(350);
              return resolve();
            }
            if (first == null) { first = false; I.record(S, 'S5', false, { item: 'match-' + it.s, picked: t.g }); log.push([it.opts[0], false]); }
            const st = await pol.wrong(t);
            if (st === 'model') { if (V8) f8.help(); return resolve(); } // FB-1: no star for a Bariq-solved item
            busy = false;
          }));
          (async () => { busy = true; await S.sleep(400); if (k === 0) await S.say('bq7_E06_match_intro'); await ask(); busy = false; })();
        });
        steps.on(si++);
        busy = true;
      }
    }

    (async () => {
      const st = ctx.step;
      if (st !== 'words' && st !== 'match') { if (!ctx.review) await recall(); await reveal(); await vowels(); } else { steps.on(si++); steps.on(si++); }
      if (st !== 'match') await words(); else { WORDS.forEach(() => steps.on(si++)); }
      await match();
      const okN = log.filter((x) => x[1]).length;
      I.note(S, '<p><b>نتيجة «اكتشف الحرف» (S5):</b> ' + I.AR(okN) + ' من ' + I.AR(log.length) + ' من المحاولة الأولى (النجاح: ٥ من ٦).' +
        (log.some((x) => !x[1]) ? ' احتاج تلميحاً في: ' + log.filter((x) => !x[1]).map((x) => x[0]).join('، ') + '.' : '') + '</p><p>اربط دائماً: الاسم «مِيم» ← الصوت «مَ». اقبل لمس الحرف في أيّ شكل من أشكاله.</p>');
      main.replaceChildren();
      buddy.set('cheer');
      await S.say('bq7_E06_end', { talk: true });
      I.finish(S, { pose: 'cheer' });
    })();
  }

  BQ.register(ID, { render });
})();
