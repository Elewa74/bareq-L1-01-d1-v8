/* E04 · كَلِماتي — IX1 · v7 (قاعدة: النسخة الأولى — يقابل EL04 «مفرداتي»: صورة كبيرة + صفحة ورقية) · draft_unapproved
   SPEC_v7 §E04 · الناتج 8 · S9. ماذا يستطيع بعده؟ يعرف معنى الكلمات السبع وصورتها وينطقها، ويختار صورة الكلمة حين يسمعها.
   bq7_E04_intro ثم لكلّ كلمة (مَكْتَبْ · مُشْطْ · مِفْتاحْ · تِمْساحْ · مانْجو · نُمورْ · قَميصْ):
     ١ الصورة card_<w> ← ٢ الاستماع bq7_W_<w> ← ٣ التكرار bq7_E04_say_<w> + وقفة ٢٫٥ ث (بارق يضع يده على أذنه منتظراً) ← حبيبة تعيد bq7_W_<w>
     ← ٤ المعنى بالصورة: تنقلب البطاقة إلى ctx_<w> + ماجد bq7_E04_mean_<w> · «التّالي» يظهر بعد انتهاء الصوت.
   التحقّق bq7_E04_check_intro ثم ٣ جولات × ٣ بطاقات: q_maktab (مَكْتَب | قَميص · مُشْط) · q_miftah (مِفْتاح | مانْجو · تِمْساح) · q_numur (نُمور | تِمْساح · مَكْتَب)
     ✓ G_yes* + mean_<w> · ✗١ G_listen_again + W · ✗٢ G_look_light · ③ G_model + W. النهاية bq7_E04_end. record('S9', ok1) لكلّ جولة.
   لا كلمة مكتوبة على شاشة الطفل (قبل E06): الصفحة الورقية تحمل أيقونات الروتين الثلاث (أذن · فم · عين) بدل الكلمة. ctx.step 'check' ← التحقّق مباشرة.
   v8 owner-late 2026-10-05 (يلغي القاعدة السابقة في E04 وحده): «يجب ظهور الكلمة مع الصورة أيضاً، ليكون الكلمة والصورة والصوت» — الكلمة المشكولة
   (I.W، Vazirmatn، كحليّ، بلا تلوين للميم) تحت الصورة داخل إطار كلّ بطاقة: بطاقة التعليم (بوجهيها؛ لمس الكلمة يُسمِعها) · بطاقات التحقّق
   (لمسها = اختيار البطاقة) · صورة «قُلْها!».
   جولة إصلاح R1-9 (الناتج ٨ «يستعمل الكلمة»): بعد التحقّق بندان شفهيّان «قُلْها!» — صورة السياق + سؤال ماجد (قَميص ثم نُمور — لا تكرّر مواقف قياس E11) ← «دَوْرُكَ!» + وقفة ٣ ث
     (بلا ميكروفون) ← نموذج في جملة (bq7_E04_mean_<w>). حكم المعلّم من اللوحة المخفيّة (ضغط مطوَّل ١٫٥ ث على زاوية بارق) ← BQ.mastery.judge('S9', …)
     — قرينة تعبيرية تظهر في #mastery، لا تُغيّر حكم E11. ctx.step 'oral' ← البندان مباشرة. */
(function () {
  'use strict';
  const ID = 'E04';
  const lib = () => (BQ.ix1 ? Promise.resolve(BQ.ix1) : BQ.loadScript('js/el7/lib/ix1.js').then(() => BQ.ix1));

  const CSS = `
.e04 { justify-content: space-between; }
.e04 .e04-main { flex: 1 1 auto; min-height: 0; width: 100%; display: flex; align-items: center; justify-content: center; }
.e04 .e04-spread { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: clamp(18px, 4cqi, 44px); align-items: center; width: 100%;
  max-width: min(880px, max(320px, calc((var(--i7-h) - 70px) * 1.75))); }
.e04 .e04-photo { position: relative; aspect-ratio: 1; perspective: 1000px; cursor: pointer; border: 0; padding: 0; background: none; }
.e04 .e04-face { position: absolute; inset: 0; border-radius: var(--r-lg, 26px); overflow: hidden; background: #fff; border: 6px solid #fff; box-shadow: 0 16px 36px var(--shade); backface-visibility: hidden; transition: transform .7s cubic-bezier(.3,.8,.3,1.1); }
.e04 .e04-face .i7-pic { border-radius: calc(var(--r-lg, 26px) - 6px); }
.e04 .e04-ctx { transform: rotateY(180deg); }
.e04 .e04-ctx .i7-pic img { object-fit: cover; }
.e04 .e04-photo.is-ctx .e04-card { transform: rotateY(-180deg); }
.e04 .e04-photo.is-ctx .e04-ctx { transform: rotateY(0); }
.e04 .e04-photo.is-play .e04-face { box-shadow: 0 0 0 6px var(--sky), 0 16px 36px var(--shade); }
.e04 .e04-photo { animation: i7In .5s cubic-bezier(.2,1.2,.4,1) both; }
.e04 .e04-page { display: flex; flex-direction: column; align-items: center; gap: clamp(14px, 2.6cqi, 22px); }
.e04 .e04-slot { position: relative; width: 100%; min-height: clamp(120px, 22cqi, 190px); display: flex; align-items: center; justify-content: center; gap: clamp(8px, 1.6cqi, 14px);
  border-radius: var(--r-lg, 26px); background: var(--paper, #FFFBEA); border: 2px solid var(--paper-edge, #F1DFA6); box-shadow: 0 10px 24px var(--shade); padding: 14px; }
.e04 .e04-chip { position: relative; flex: none; width: clamp(54px, 8cqi, 74px); aspect-ratio: 1; border-radius: 22px; background: #fff; color: #A9BDCB; display: grid; place-items: center; box-shadow: 0 4px 0 var(--paper-edge), 0 6px 12px var(--shade); transition: transform .3s, color .3s, background .3s, box-shadow .3s; }
.e04 .e04-chip svg { width: 60%; height: 60%; }
.e04 .e04-chip.is-on { background: #FFF3BF; color: var(--navy); transform: translateY(-4px) scale(1.12); box-shadow: 0 0 0 4px var(--sun), 0 8px 16px var(--shade); }
.e04 .e04-chip.is-done { color: var(--ok); }
.e04 .e04-arrow { width: 18px; height: 5px; border-radius: 3px; background: var(--paper-edge); flex: none; }
.e04 .e04-ring { position: absolute; inset: -10px; width: calc(100% + 20px); height: calc(100% + 20px); transform: rotate(-90deg); pointer-events: none; }
.e04 .e04-ring circle { fill: none; stroke: var(--sky); stroke-width: 5; stroke-linecap: round; }
.e04 .e04-ctl { min-height: 64px; display: flex; align-items: center; justify-content: center; }
/* «قُلْها!» */
.e04 .e04-oral { display: flex; align-items: center; justify-content: center; gap: clamp(16px, 4cqi, 44px); }
.e04 .e04-oral .e04-opic { width: min(40cqi, calc(var(--i7-h) - 110px), 420px); aspect-ratio: 1; border-radius: var(--r-lg, 26px); overflow: hidden; border: 6px solid #fff; box-shadow: 0 16px 36px var(--shade); animation: i7In .45s ease-out both; }
.e04 .e04-oral .e04-chip { width: clamp(74px, 11cqi, 104px); }
.e04 .e04-oral .e04-chip.is-on { animation: i7Pulse 1s ease-in-out infinite; }
/* التحقّق */
.e04 .e04-quiz { display: flex; gap: clamp(14px, 3.5cqi, 34px); justify-content: center; flex-wrap: wrap; }
.e04 .e04-quiz .i7-card { --s: min(26cqi, calc(var(--i7-h) - 200px), 240px); min-width: 96px; border-radius: var(--r-lg, 26px); }
@container stage (max-width: 600px) {
  .e04 .e04-spread { grid-template-columns: 1fr; gap: 12px; max-width: min(92cqi, calc(var(--i7-h) - 200px)); }
  .e04 .e04-quiz .i7-card { --s: min(42cqi, calc((var(--i7-h) - 240px) / 2), 170px); }
  .e04 .e04-oral { flex-direction: column; gap: 14px; } .e04 .e04-oral .e04-opic { width: min(78cqi, calc(var(--i7-h) - 190px)); }
}
@media (max-height: 500px) {
  .e04 .e04-spread { grid-template-columns: auto 250px; max-width: none; width: auto; gap: 22px; }
  .e04 .e04-photo { width: max(140px, calc(var(--i7-h) - 56px)); }
  .e04 .e04-page { gap: 10px; }
  .e04 .e04-slot { min-height: 0; padding: 10px 8px; gap: 6px; }
  .e04 .e04-chip { flex: none; width: 56px; border-radius: 18px; }
  .e04 .e04-arrow { width: 10px; }
  .e04 .e04-quiz { flex-wrap: nowrap; }
  .e04 .e04-quiz .i7-card { --s: max(96px, calc(var(--i7-h) - 70px)); }
  .e04 .e04-oral .e04-opic { width: max(140px, calc(var(--i7-h) - 50px)); }
}
@media (prefers-reduced-motion: reduce) { .e04 .e04-face { transition: none; } .e04 .e04-photo { animation: none; } }`;
  /* v8 (OWNER_R3-4 · mockup style_v8/E04.png): one big sticker picture card + a row of three clear stickers that light up in turn —
     ear (listen) → mouth (say it) → eye (look: what it is for). icons8 ear / mouth / eye in natural colours (a 4-year-old reads them).
     The stickers are real buttons: ear = hear the word again · mouth = «قُلْ…» again · eye = the meaning again (after it was shown). */
  const CSS8 = `
.e04-8 .e04-main { position: relative; flex: 1 1 auto; min-height: 0; width: 100%; display: flex; align-items: center; justify-content: center; }
.e04-8 .e04-col { display: flex; flex-direction: column; align-items: center; gap: calc(var(--u)*30); }
.e04-8 .e04-photo { position: relative; width: calc(var(--u)*330); aspect-ratio: 1; perspective: 1000px; cursor: pointer; border: 0; padding: 0; background: none; animation: bq8-pop .45s cubic-bezier(.3,1.5,.5,1) both; }
.e04-8 .e04-face { position: absolute; inset: 0; padding: calc(var(--u)*10); border-radius: calc(var(--u)*32); background: #fff; border: var(--bq8-line) solid var(--bq8-navy);
  box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-2); backface-visibility: hidden; transition: transform .7s cubic-bezier(.3,.8,.3,1.1); }
.e04-8 .e04-face .i7-pic { border-radius: calc(var(--u)*22); }
.e04-8 .e04-ctx { transform: rotateY(180deg); }
.e04-8 .e04-photo.is-ctx .e04-card { transform: rotateY(-180deg); }
.e04-8 .e04-photo.is-ctx .e04-ctx { transform: rotateY(0); }
.e04-8 .e04-photo.is-play .e04-face { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-listen), var(--bq8-sh-2); }
.e04-8 .bq8-skillrow { gap: calc(var(--u)*46); }
.e04-8 .e04-chip.is-on { box-shadow: inset 0 calc(var(--u)*-6) 0 color-mix(in srgb, var(--hd) 45%, transparent), 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--hd), 0 calc(var(--u)*10) calc(var(--u)*16) rgba(11,45,79,.32); transform: scale(1.08); }
.e04-8 .e04-chip.is-done::after { content: ''; position: absolute; top: -14%; inset-inline-start: -14%; width: 44%; aspect-ratio: 1; background: url(assets/icons8/check.svg) center / contain no-repeat; animation: bq8-pop .35s cubic-bezier(.3,1.6,.5,1) both; }
.e04-8 .e04-ring { position: absolute; inset: -14%; width: 128%; height: 128%; transform: rotate(-90deg); pointer-events: none; }
.e04-8 .e04-ring circle { fill: none; stroke: var(--bq8-mouth); stroke-width: 5; stroke-linecap: round; }
.e04-8 .e04-ctl { position: absolute; bottom: calc(var(--u)*-8); inset-inline-end: calc(var(--u)*-6); min-height: 0; }
.e04-8 .e04-quiz { display: flex; gap: calc(var(--u)*44); justify-content: center; }
.e04-8 .e04-quiz .i7-card.i8-card { --s: calc(var(--u)*250); }
.e04-8 .e04-oral { display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*56); }
.e04-8 .e04-opic { width: calc(var(--u)*400); aspect-ratio: 1; padding: calc(var(--u)*10); border-radius: calc(var(--u)*32); background: #fff; border: var(--bq8-line) solid var(--bq8-navy); box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-2); animation: bq8-pop .45s ease-out both; }
.e04-8 .e04-opic .i7-pic { border-radius: calc(var(--u)*22); }
.e04-8 .e04-oral .e04-chip { width: max(80px, calc(var(--u)*130)); height: max(80px, calc(var(--u)*130)); font-size: max(56px, calc(var(--u)*94)); cursor: default; }
.e04-8 .e04-oral .e04-chip.is-on { animation: i7Pulse 1s ease-in-out infinite; }
.bq8-stage.is-tall .e04-8 .e04-photo { width: calc(var(--u)*560); }
.bq8-stage.is-tall .e04-8 .e04-quiz { flex-direction: column; gap: calc(var(--u)*40); }
.bq8-stage.is-tall .e04-8 .e04-quiz .i7-card.i8-card { --s: calc(var(--u)*300); }
.bq8-stage.is-tall .e04-8 .e04-oral { flex-direction: column; }
.bq8-stage.is-tall .e04-8 .e04-opic { width: calc(var(--u)*560); }
/* owner-late 2026-10-05 «الكلمة والصورة والصوت»: the written word (full tashkeel, Vazirmatn, navy, NO coloured meem) under every picture,
   INSIDE the card frame — fixed bands sized so every haraka stays inside the frame and clear of the ear/mouth/eye stickers. */
.e04-8 .e04-col { gap: calc(var(--u)*18); }
.e04-8 .e04-photo { width: calc(var(--u)*284); height: auto; aspect-ratio: 284 / 376; }
.e04-8 .e04-face { display: flex; flex-direction: column; }
.e04-8 .e04-face > .i7-pic, .e04-8 .e04-qc > .i7-pic, .e04-8 .e04-opic > .i7-pic { flex: none; width: 100%; height: auto; aspect-ratio: 1; }
.e04-8 .e04-w { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; direction: rtl; white-space: nowrap;
  font: 700 calc(var(--u)*60)/1 var(--font-letter); color: var(--bq8-navy); padding-top: calc(var(--u)*10); cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.e04-8 .e04-w > span { display: block; line-height: 1.6; }
.e04-8 .e04-quiz .i7-card.e04-qc { aspect-ratio: auto; height: calc(var(--s) + var(--u)*86); display: flex; flex-direction: column; }
.e04-8 .e04-qc .e04-w { font-size: calc(var(--u)*54); cursor: inherit; }
.e04-8 .e04-opic { width: calc(var(--u)*380); height: auto; aspect-ratio: 380 / 490; display: flex; flex-direction: column; }
.e04-8 .e04-opic .e04-w { font-size: calc(var(--u)*72); }
@media (prefers-reduced-motion: reduce) { .e04-8 .e04-face { transition: none; } .e04-8 .e04-photo { animation: none; } }`;

  function render(stage, ctx) {
    lib().then((I) => { if (ctx.alive()) run(I, stage, ctx); })
      .catch((e) => { console.warn('E04 lib', e); if (ctx.placeholder) ctx.placeholder(); });
  }

  function run(I, stage, ctx) {
    const h = BQ.h;
    if (!document.getElementById('st-e04')) document.head.append(h('style', { id: 'st-e04' }, CSS));
    if (!document.getElementById('st-e04-8')) document.head.append(h('style', { id: 'st-e04-8' }, CSS8));
    const S = I.session(ctx, { noText: true });
    const V8 = I.v8();
    const WORDS = ['maktab', 'musht', 'miftah', 'timsah', 'manju', 'numur', 'qamis'];
    I.lines({
      bq7_E04_intro: 'هَذِهِ كَلِمَاتٌ جَدِيدَةٌ. اُنْظُرْ، وَاسْتَمِعْ، ثُمَّ قُلْ.', bq7_E04_check_intro: 'الْآنَ اسْتَمِعْ، وَاخْتَرِ الصُّورَةَ.', bq7_E04_end: 'صارَت عِنْدَكَ كَلِماتٌ جَديدَةٌ.',
      bq7_E04_q_maktab: 'أَيْنَ المَكْتَبُ؟', bq7_E04_q_miftah: 'أَيْنَ المِفْتاحُ؟', bq7_E04_q_numur: 'أَيْنَ النُّمورُ؟',
      bq7_E04_say_maktab: 'قُل: مَكْتَب.', bq7_E04_say_musht: 'قُل: مُشْط.', bq7_E04_say_miftah: 'قُل: مِفْتاح.', bq7_E04_say_timsah: 'قُل: تِمْساح.',
      bq7_E04_say_manju: 'قُل: مانْجو.', bq7_E04_say_numur: 'قُل: نُمور.', bq7_E04_say_qamis: 'قُل: قَميص.',
      bq7_E04_mean_maktab: 'أَجْلِسُ إِلى المَكْتَبِ، وَأَرْسُمُ.', bq7_E04_mean_musht: 'أُسَرِّحُ شَعْري بِالمُشْطِ.', bq7_E04_mean_miftah: 'أَفْتَحُ الدُّرْجَ بِالمِفْتاحِ.',
      bq7_E04_mean_timsah: 'التِّمْساحُ يَعيشُ في النَّهْرِ.', bq7_E04_mean_manju: 'المانْجو فاكِهَةٌ حُلْوَةٌ.', bq7_E04_mean_numur: 'النُّمورُ في حَديقَةِ الحَيَوانِ.', bq7_E04_mean_qamis: 'أَلْبَسُ قَميصي الأَصْفَرَ.',
    });
    const QUIZ = [{ t: 'maktab', d: ['qamis', 'musht'] }, { t: 'miftah', d: ['manju', 'timsah'] }, { t: 'numur', d: ['timsah', 'maktab'] }];
    // R1-9 / R1b-N2: البندان الشفهيّان بمواقف غير مواقف قياس E11 (S9 = مُشْط/مِفْتاح) — قَميص ثم نُمور، سؤال ماجد.
    // إن لم يُسجَّل السؤال بعد: الصورة + «قُلْها!» وحدهما (لا بديل من أسطر E11).
    const ORAL = [{ w: 'qamis', q: 'bq7_E04_o_qamis' }, { w: 'numur', q: 'bq7_E04_o_numur' }];
    const JUDGE = { m: 'mastered', n: 'near', x: 'notyet' };
    const f8 = V8 ? I.frame8(S, 'e04-8', { pose: 'wave' }) : null;
    const root = V8 ? f8.panel : I.root(stage, 'e04');
    const top = h('div.i7-row');
    const steps = I.stars(top, WORDS.length + QUIZ.length + 1);
    const main = h('div.e04-main');
    if (V8) root.append(main); else root.append(top, main);
    const buddy = I.buddy(S, root, 'wave');
    let busy = true, cur = null, judged = null;
    // owner-late: the written word (exactly I.W, plain navy ink — no coloured meem in E04)
    const wordEl = (slug) => h('span.e04-w', { lang: 'ar', 'aria-hidden': 'true' }, h('span', null, I.W[slug].w));
    const RING = '<svg class="e04-ring" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="36"/></svg>';
    const chip = V8 ? (cls, svg, aria) => h('button.bq8-btn.e04-chip.' + cls + '.bq8-btn--' + cls, { type: 'button', 'aria-label': aria }, I.i8(cls))
      : (cls, svg, aria) => h('span.e04-chip.' + cls, { role: 'img', 'aria-label': aria, html: svg });

    async function teach(slug, i, pre) {
      const wid = I.wordId(slug);
      const photo = h('button.e04-photo', { type: 'button', 'aria-label': V8 ? I.W[slug].w : 'اِسْتَمِعْ إِلَى الْكَلِمَةِ' },
        h('span.e04-face.e04-card', null, I.pic(slug), V8 ? wordEl(slug) : null), h('span.e04-face.e04-ctx', null, I.pic(slug, { key: ['ctx_' + slug, 'ctx_mango', 'card_' + slug, 'w_' + slug, 'w_mango'].filter((k) => slug === 'manju' || !/mango/.test(k)) }), V8 ? wordEl(slug) : null));
      // owner-late: touching the written word always says the WORD (also on the meaning side of the card)
      photo.querySelectorAll('.e04-w').forEach((we) => we.addEventListener('click', async (e) => { e.stopPropagation(); if (busy) return; busy = true; photo.classList.add('is-play'); await S.stim(wid); photo.classList.remove('is-play'); busy = false; }));
      const cEar = chip('ear', I.IC.ear, 'اِسْتَمِعْ'), cSay = chip('mouth', I.IC.mouth, 'قُل'), cEye = chip('eye', I.IC.eye, 'المَعْنى');
      const ctl = h('div.e04-ctl');
      if (V8) {
        const slot = h('div.bq8-skillrow.e04-slot', { role: 'group', 'aria-label': 'اِسْتَمِعْ · قُلْ · اُنْظُرْ' }, cEar, cSay, cEye);
        main.replaceChildren(h('div.e04-col', null, photo, slot), ctl);
        const tapChip = (fn) => async () => { if (busy) return; busy = true; I.sfx('tick'); try { await fn(); } finally { busy = false; } };
        cEar.onclick = tapChip(async () => { photo.classList.add('is-play'); await S.stim(wid); photo.classList.remove('is-play'); });
        cSay.onclick = tapChip(() => S.say('bq7_E04_say_' + slug));
        cEye.onclick = tapChip(async () => { if (photo.classList.contains('is-ctx')) await S.say('bq7_E04_mean_' + slug); });
      } else {
        const slot = h('div.e04-slot', { 'aria-hidden': 'true' }, cEar, h('i.e04-arrow'), cSay, h('i.e04-arrow'), cEye);
        main.replaceChildren(h('div.e04-spread', null, photo, h('div.e04-page', null, slot, ctl)));
      }
      cur = { slug, photo };
      steps.cur(i);
      photo.addEventListener('click', async () => { if (busy) return; busy = true; photo.classList.add('is-play'); await S.stim(photo.classList.contains('is-ctx') ? 'bq7_E04_mean_' + slug : wid); photo.classList.remove('is-play'); busy = false; });
      if (pre) await pre(); // the intro line plays over the first card (no empty board while it is heard)
      await S.sleep(450);
      // ٢ الاستماع
      cEar.classList.add('is-on'); photo.classList.add('is-play');
      await S.stim(wid);
      photo.classList.remove('is-play'); cEar.classList.remove('is-on'); cEar.classList.add('is-done');
      await S.sleep(250);
      // ٣ التكرار: «قُلْ: …» + وقفة ٢٫٥ ث (بارق ينتظر) ← حبيبة تعيد الكلمة
      cSay.classList.add('is-on');
      await S.say('bq7_E04_say_' + slug);
      buddy.set('idle'); buddy.el.classList.add('is-listen');
      cSay.insertAdjacentHTML('beforeend', RING);
      const c = cSay.querySelector('circle'), len = 2 * Math.PI * 36;
      c.style.strokeDasharray = len; c.style.strokeDashoffset = 0; void c.getBoundingClientRect();
      c.style.transition = 'stroke-dashoffset 2.5s linear'; c.style.strokeDashoffset = len;
      await S.wait(2550);
      buddy.el.classList.remove('is-listen');
      const r = cSay.querySelector('.e04-ring'); if (r) r.remove();
      photo.classList.add('is-play'); await S.stim(wid); photo.classList.remove('is-play');
      cSay.classList.remove('is-on'); cSay.classList.add('is-done');
      // ٤ المعنى بالصورة: تنقلب البطاقة إلى صورة السياق + ماجد
      cEye.classList.add('is-on'); I.sfx('flip');
      photo.classList.add('is-ctx');
      await S.sleep(500);
      await S.say('bq7_E04_mean_' + slug);
      cEye.classList.remove('is-on'); cEye.classList.add('is-done');
      steps.on(i);
      busy = false;
      await I.goBtn(ctl, 'next');
      busy = true;
    }

    function quizRound(q, qi) {
      return new Promise((resolve) => {
        const wq = 'bq7_E04_q_' + q.t;
        const wrap = h('div.e04-quiz', { role: 'group', 'aria-label': 'ثَلاثُ صُوَرٍ' });
        const opts = BQ.shuffle([q.t].concat(q.d)).map((slug, i) => {
          const c = I.card(slug, { aria: 'صورة ' + I.AR(i + 1) });
          c.slug = slug; c.classList.add('i7-in'); c.style.animationDelay = (i * 0.08) + 's';
          if (V8) { c.classList.add('e04-qc'); c.append(wordEl(slug)); c.setAttribute('aria-label', I.W[slug].w); } // the word is part of the card: touching it chooses the card
          wrap.append(c);
          return c;
        });
        main.replaceChildren(wrap);
        const right = () => opts.find((c) => c.slug === q.t);
        I.instr(S, wq, 'hand', async () => { if (busy) return; busy = true; await S.say(wq); busy = false; });
        let first = null;
        const pol = I.policy(S, {
          opts, right,
          async hint1() { await S.stim(I.wordId(q.t)); },
          async model() { await I.playOn(S, right(), I.wordId(q.t)); },
        });
        opts.forEach((c) => c.addEventListener('click', async () => {
          if (busy || I.isNo(c)) return;
          busy = true;
          if (c === right()) {
            if (first == null) { first = true; I.record(S, 'S9', true, { item: q.t }); }
            c.classList.remove('is-soft'); c.classList.add('is-ok'); I.anim(c, 'i7-pop', 450); I.sfx('ok'); I.burst(root, c, 16); buddy.cheer();
            opts.forEach((x) => { if (x !== c && !x.classList.contains('is-no')) x.classList.add('is-dim'); });
            await S.say(I.yes(), { talk: true });
            await S.say('bq7_E04_mean_' + q.t);
            await S.sleep(300);
            return resolve(first);
          }
          if (first == null) { first = false; I.record(S, 'S9', false, { item: q.t, picked: c.slug }); }
          const st = await pol.wrong(c);
          if (st === 'model') { await S.sleep(300); return resolve(false); }
          busy = false;
        }));
        (async () => { busy = true; steps.cur(WORDS.length + qi); await S.sleep(450); if (qi === 0) { await S.say('bq7_E04_check_intro'); await S.sleep(150); } await S.say(wq); busy = false; })();
      });
    }

    /** «قُلْها!» — R1-9: الطفل يستعمل الكلمة (الناتج ٨). بلا ميكروفون؛ المعلّم يسمع ويحكم من اللوحة المخفيّة. */
    async function oral() {
      const si = WORDS.length + QUIZ.length;
      steps.cur(si);
      I.teacherPanel(S, {
        title: 'يستعمل الكلمة (S9) — حكم المعلّم',
        opts: [{ id: 'm', label: 'أتقن' }, { id: 'n', label: 'قريب', ghost: true }, { id: 'x', label: 'ليس بعد', ghost: true }],
        onPick(id) { judged = id; try { if (BQ.mastery && BQ.mastery.judge) BQ.mastery.judge('S9', JUDGE[id]); } catch (e) { /* */ } },
      });
      for (const it of ORAL) {
        const qid = I.hasAudio(it.q) ? it.q : null;
        const pic = h('div.e04-opic', null, I.pic(it.w, { key: ['ctx_' + it.w, 'card_' + it.w] }), V8 ? wordEl(it.w) : null);
        const ow = pic.querySelector('.e04-w'); if (ow) ow.addEventListener('click', async () => { if (busy) return; busy = true; await I.playOn(S, pic, I.wordId(it.w)); busy = false; });
        const cSay = V8 ? h('span.bq8-btn.bq8-btn--mouth.e04-chip.mouth', { role: 'img', 'aria-label': 'قُل' }, I.i8('mouth')) : h('span.e04-chip.mouth', { role: 'img', 'aria-label': 'قُل', html: I.IC.mouth });
        main.replaceChildren(h('div.e04-oral', null, pic, cSay));
        I.instr(S, qid || 'bq7_E04_o_say', 'mouth', async () => { if (busy) return; busy = true; await S.say(qid || 'bq7_E04_o_say'); busy = false; });
        await S.sleep(450);
        if (qid) await S.say(qid);
        await S.sleep(200);
        cSay.classList.add('is-on');
        await S.say(I.pick('bq7_E04_o_say', 'bq7_G_your_turn'));
        buddy.set('idle'); buddy.el.classList.add('is-listen');
        cSay.insertAdjacentHTML('beforeend', RING);
        const c = cSay.querySelector('circle'), len = 2 * Math.PI * 36;
        c.style.strokeDasharray = len; c.style.strokeDashoffset = 0; void c.getBoundingClientRect();
        c.style.transition = 'stroke-dashoffset 3s linear'; c.style.strokeDashoffset = len;
        await S.wait(3050);
        buddy.el.classList.remove('is-listen');
        const r = cSay.querySelector('.e04-ring'); if (r) r.remove();
        cSay.classList.remove('is-on'); cSay.classList.add('is-done');
        await S.say('bq7_E04_mean_' + it.w); // نموذج الكلمة في جملة
        await S.sleep(500);
      }
      steps.on(si);
    }

    I.instr(S, 'bq7_E04_intro', 'ear', async () => { if (busy || !cur) return; busy = true; await S.stim(I.wordId(cur.slug)); busy = false; });

    (async () => {
      await S.sleep(400);
      const onlyOral = ctx.step === 'oral';
      const start = ctx.step === 'check' || ctx.step === 'quiz' || onlyOral ? WORDS.length : 0;
      // مراجعة موجّهة (S9): تُعاد الكلمات الثلاث المسؤول عنها فقط ثم التحقّق
      const teachList = ctx.review && !start ? WORDS.map((w, i) => [w, i]).filter(([w]) => QUIZ.some((q) => q.t === w)) : WORDS.map((w, i) => [w, i]).slice(start);
      if (ctx.review) WORDS.forEach((w, i) => { if (!teachList.some((x) => x[1] === i)) steps.on(i); });
      if (!teachList.length) await S.say('bq7_E04_intro');
      for (const [w, i] of teachList) await teach(w, i, w === teachList[0][0] ? () => S.say('bq7_E04_intro') : null);
      if (onlyOral) WORDS.forEach((w, i) => steps.on(i));
      const res = [];
      if (!onlyOral) for (let q = 0; q < QUIZ.length; q++) { res.push(await quizRound(QUIZ[q], q)); steps.on(WORDS.length + q); }
      else QUIZ.forEach((q, i) => steps.on(WORDS.length + i));
      await oral();
      I.note(S, '<p><b>«قُلْها!» (S9 — استعمال الكلمة):</b> بعد التحقّق يسأل ماجد سؤالين (القَميص ثم النُّمور) ويتوقّف ٣ ث ليقول الطفل الكلمة، ثم يُسمَع النموذج في جملة. ' +
        '<b>احكم أنت:</b> اضغط مطوّلاً ١٫٥ ث على زاوية بارق ← «أتقن · قريب · ليس بعد» (أو من صفحة «دليل الإتقان»). ' + (judged ? 'سُجِّل حكمك.' : 'بلا حكم = لا تسجيل.') + '</p>' +
        (res.length ? '<p><b>نتيجة «كلماتي» (S9):</b> ' + QUIZ.map((q, i) => I.W[q.t].w + ' ' + (res[i] ? '✓ من الأولى' : '— بعد تلميح')).join(' · ') + ' (النجاح: ٣/٣، منها ٢ من الأولى).</p>' : '') +
        '<p>وقفة «قُل» بلا ميكروفون: استمع أنت إلى ترديد الطفل، واربط الكلمة بشيء حقيقيّ في الغرفة إن أمكن. في الحصّة التالية: جملة من كلّ طفل عن شيء أحضره («هَذا مِفْتاحٌ»).</p>');
      main.replaceChildren();
      buddy.set('cheer');
      await S.say('bq7_E04_end', { talk: true });
      I.finish(S, { pose: 'cheer' });
    })();
  }

  BQ.register(ID, { render });
})();
