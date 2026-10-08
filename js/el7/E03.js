/* E03 · اِسْمَعْ وَمَيِّزْ — IX1 · v7 (قاعدة: النسخة الأولى · عنصر جديد بلغة «تدرّب/اقرأ» الأصليّين) · draft_unapproved
   SPEC_v7 §E03 · الناتج 1 · S2 (+S1). ماذا يستطيع بعده؟ أن يفرّق /م/ عن أصوات قريبة (ب، ف) في كلمات ثم في مقاطع — بأذنه وحدها.
   جولة إصلاح R1/R2/R3 (2026-10-05):
   المستوى ١ «سَلَّةُ بارِق» — سيناريو فريق المادة (R1-8): ٤ بطاقات، «اِلْمِسْ كُلَّ كَلِمَةٍ فيها صَوْتُنا»، تنتهي الجولة حين تُلمس كلّ الصحيحة:
     ج١ مَوْزْ ✓ · بابْ · مِفْتاحْ ✓ · قَمَرْ ✓ (ترتيب الفريق)   ج٢ نُمورْ ✓ · فيلْ · فَمْ ✓ · بَطَّةْ (مخلوطة)
     صحيحة ← تُعلَّم + _seg + تطير إلى السلّة (نقطة تمتلئ) · مشتّت ✗١ G_listen_again + كلمته + كلمة صحيحة باقية (مقارنة) ثم يخفت · ✗٢ G_look_light + الباقية تضيء.
     التسجيل: S1 وS2 لكلّ جولة = نجاح إذا لُمست كلّ الصحيحة قبل أيّ مشتّت.
   المستوى ٢ «فُقّاعاتُ الصَّوْتِ» — ٣ فقاعات بلا كتابة؛ المشتّتات تختلف عن الهدف في الصامت وحده (الحركة والمدّة واحدة — R1-7):
     ج١ مَ ✓ · بَ · فَ   ج٢ مِ ✓ · فِ · بِ   ج٣ مُ ✓ · بُ · فُ   ج٤ ما ✓ · با · (فا ← نا إن سُجِّلا؛ وإلا خياران)
     ✗١ (R1-4) بارق «اِسْمَعْ مَعي الفَرْقَ» ← الزوج المسجَّل مَ… بَ أو مَ… فَ (صامت المشتّت الملموس) ← إعادة الفقاعات — لا لقطات فم هنا (تلميح الشفتين يصدق على بَ أيضاً)
     ✗٢ يخفت مشتّت + G_look_light · ③ G_model + المقطع. النهاية bq7_E03_end. التسجيل S2 (المحاولة الأولى).
   ctx.step 'l1' | 'l2' (مراجعة موجّهة).
   SCI-1 T2 (2026-10-07 · review/sci1 · draft_unapproved): التعليمة «اِسْتَمِع، وَحَدِّد كُلَّ كَلِمَةٍ فيها صَوْتُنا: مَ… مِ… مُ.» (bq7_E03_l1_s1، مركّبة) ·
     «قَمَر» تُحذف («بلاش قمر») وكلّ الأهداف تبدأ بالميم: ج١ مَوْز ✓ · باب · مِفْتاح ✓ · مُعَلِّم ✓ (مَ/مِ/مُ معاً) · ج٢ مُثَلَّث ✓ · فيل · مَكْتَب ✓ · بَطَّة ·
     صورتا مُعَلِّم/مُثَلَّث من ART (img8/w8_*)، وإلى أن تصلا بطاقة بديلة نظيفة · المستوى ٢ «… اِسْتَمِع، ثُمَّ اخْتَر صَوْتَنا.» (bq7_E03_l2_s1) — لا «المس». */
(function () {
  'use strict';
  const ID = 'E03';
  const lib = () => (BQ.ix1 ? Promise.resolve(BQ.ix1) : BQ.loadScript('js/el7/lib/ix1.js').then(() => BQ.ix1));

  const CSS = `
.e03 { justify-content: space-between; }
.e03 .e03-field { position: relative; flex: 1 1 auto; width: 100%; min-height: 0; display: flex; align-items: center; justify-content: center; }
.e03 .e03-pair { display: flex; gap: clamp(24px, 7cqi, 80px); justify-content: center; align-items: center; }
.e03 .i7-card { --s: min(30cqi, calc(var(--i7-h) - 290px), 260px); min-width: 120px; }
.e03 .e03-bottom { position: relative; width: 100%; height: clamp(80px, 14cqi, 116px); display: flex; align-items: flex-end; justify-content: center; flex: none; }
.e03 .e03-basket { position: relative; width: clamp(130px, 22cqi, 190px); height: 100%; }
.e03 .e03-basket svg { position: absolute; inset: auto 0 0 0; width: 100%; height: 78%; filter: drop-shadow(0 6px 8px rgba(110,60,10,.25)); }
.e03 .e03-in { position: absolute; inset-inline: 14%; bottom: 46%; height: 42%; display: flex; justify-content: center; align-items: flex-end; }
.e03 .e03-in > span { width: 32%; max-width: 46px; aspect-ratio: 1; border-radius: 10px; overflow: hidden; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,.2); margin-inline: -5px; animation: i7In .35s ease-out both; }
.e03 .e03-in > span:nth-child(2) { transform: rotate(-8deg); } .e03 .e03-in > span:nth-child(3) { transform: rotate(7deg); }
.e03 .e03-basket.is-bump { animation: i7Pop .4s ease-out; }
/* المستوى ١: أربع بطاقات + نقاط «كم بقي» فوق السلّة */
.e03 .e03-four { display: flex; gap: clamp(14px, 3.4cqi, 40px); justify-content: center; align-items: center; flex-wrap: nowrap; }
.e03 .e03-four .i7-card { --s: min(19cqi, calc(var(--i7-h) - 260px), 220px); min-width: 96px; }
.e03 .e03-need { position: absolute; z-index: 2; top: -28px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
.e03 .e03-need i { width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid #D9A35C; box-shadow: 0 2px 4px rgba(110,60,10,.2); transition: background .3s, transform .3s; }
.e03 .e03-need i.on { background: var(--ok, #1B7F53); border-color: #fff; transform: scale(1.15); }
/* الفقاعات */
.e03 .e03-sky { display: flex; justify-content: center; align-items: center; gap: clamp(16px, 5cqi, 56px); }
.e03 .e03-bub { --c: #7FD3FF; position: relative; width: min(clamp(110px, 20cqi, 180px), calc(var(--i7-h) - 300px)); min-width: 96px; aspect-ratio: 1; border-radius: 50%; border: 0; padding: 0; cursor: pointer;
  background: radial-gradient(circle at 32% 28%, rgba(255,255,255,.95) 0 9%, rgba(255,255,255,.25) 10% 30%, transparent 31%), radial-gradient(circle at 50% 50%, rgba(255,255,255,.08) 55%, color-mix(in srgb, var(--c) 55%, transparent) 72%, color-mix(in srgb, var(--c) 85%, #fff) 100%);
  box-shadow: inset 0 0 0 3px rgba(255,255,255,.75), inset -10px -14px 30px color-mix(in srgb, var(--c) 35%, transparent), 0 10px 22px var(--shade);
  display: grid; place-items: center; color: color-mix(in srgb, var(--c) 70%, #003);
  animation: e03Bob 3.4s ease-in-out infinite; transition: transform .8s cubic-bezier(.4,0,.6,1), opacity .8s, filter .3s, box-shadow .25s; }
.e03 .e03-bub:nth-child(2) { animation-delay: -1.2s; } .e03 .e03-bub:nth-child(3) { animation-delay: -2.3s; }
.e03 .e03-bub svg { width: 34%; height: 34%; opacity: .9; }
.e03 .e03-bub.is-play { animation: e03Ping .7s ease-in-out infinite; box-shadow: inset 0 0 0 4px #fff, 0 0 0 6px var(--sky), 0 10px 22px var(--shade); }
.e03 .e03-bub.is-soft { box-shadow: inset 0 0 0 4px #fff, 0 0 0 6px rgba(251,230,91,.9), 0 0 26px rgba(251,230,91,.9); }
.e03 .e03-bub.is-glow { box-shadow: inset 0 0 0 4px #fff, 0 0 0 7px var(--sun-soft), 0 0 34px var(--sun-soft); }
.e03 .e03-bub.is-dim { opacity: .3; filter: saturate(.3); }
.e03 .e03-bub.is-ok { box-shadow: inset 0 0 0 4px #fff, 0 0 0 7px var(--ok, #1B7F53), 0 10px 22px var(--shade); }
.e03 .e03-bub.is-fly { opacity: 0; pointer-events: none; animation: none; }
.e03 .e03-bub.is-mute { filter: grayscale(1); opacity: .55; }
@keyframes e03Bob { 50% { transform: translateY(-9px); } }
@keyframes e03Ping { 50% { transform: scale(1.07); } }
@container stage (max-width: 600px) {
  .e03 .i7-card { --s: min(43cqi, calc(var(--i7-h) - 300px), 210px); min-width: 120px; }
  .e03 .e03-pair { gap: 18px; }
  .e03 .e03-sky { gap: 10px; }
  .e03 .e03-bub { width: 28cqi; min-width: 96px; }
  .e03 .e03-four { display: grid; grid-template-columns: repeat(2, auto); gap: 14px 18px; }
  .e03 .e03-four .i7-card { --s: min(38cqi, calc((var(--i7-h) - 250px) / 2), 170px); min-width: 96px; }
}
/* هاتف أفقيّ: المسرح قصير — البطاقات أصغر قليلاً والسلّة أقصر */
@media (max-height: 500px) {
  .e03 .e03-four, .e03 .e03-four { display: flex; gap: 16px; }
  .e03 .e03-four .i7-card { --s: max(96px, calc(var(--i7-h) - 128px)); }
  .e03 .e03-bottom { height: 58px; }
  .e03 .e03-basket { width: 110px; }
  .e03 .e03-bub { width: max(96px, calc(var(--i7-h) - 130px)); min-width: 96px; }
}
@media (prefers-reduced-motion: reduce) { .e03 .e03-bub { animation: none !important; transition: opacity .3s; } }`;
  /* v8 (OWNER_R3-3 · mockup style_v8/E03.png): island frame · NO basket — star slots under the panel fill one per right answer
     (the right card flies into its star) · unified sticker cards with an ear chip (= hear it again, never answers) · level 2 = sound stickers. */
  const CSS8 = `
.e03-8 .e03-field { position: relative; width: 100%; flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; }
/* word rounds: the wide board, 4 big picture cards centred (owner R3 «layout too plain») */
.e03-8 .e03-four { display: flex; gap: calc(var(--u)*22); justify-content: center; align-items: center; margin-bottom: calc(var(--u)*24); }
.e03-8 .e03-four .i7-card.i8-card { --s: calc(var(--u)*218); }
/* sound rounds: Bariq comes INTO the board and listens (right side), the 3 sound stickers sit on a listening tray with an ear chip (= hear all again) */
.bq8-stage.e03-l2 > .bq8-bariq { inset-inline-end: auto; inset-inline-start: calc(var(--u)*92); bottom: calc(var(--u)*196); width: calc(var(--u)*270);
  transition: inset-inline-start .5s cubic-bezier(.3,1.2,.4,1), bottom .5s cubic-bezier(.3,1.2,.4,1), width .5s; }
.bq8-stage.e03-l2 .e03-8 .e03-field { padding-inline-start: calc(var(--u)*290); padding-inline-end: calc(var(--u)*20); }
.e03-8 .e03-tray8 { display: flex; align-items: center; gap: calc(var(--u)*28); padding: calc(var(--u)*28) calc(var(--u)*36); border-radius: calc(var(--u)*70);
  background: linear-gradient(#FFF6DC, #F6E2B0); box-shadow: inset 0 calc(var(--u)*-8) 0 rgba(176,122,62,.25), 0 0 0 calc(var(--u)*4) rgba(176,122,62,.35), 0 calc(var(--u)*14) calc(var(--u)*26) calc(var(--u)*-10) rgba(11,45,79,.35); }
.e03-8 .e03-tray8 .e03-ear8 { width: max(var(--i8-t), calc(var(--u)*96)); height: max(var(--i8-t), calc(var(--u)*96)); min-width: 0; min-height: 0; font-size: calc(var(--i8-t) * .66); }
.e03-8 .e03-tray8 .e03-ear8.is-play { animation: bq8-wiggle .6s ease infinite; }
.e03-8 .e03-tray8 .e03-sep { width: calc(var(--u)*4); align-self: stretch; margin-block: calc(var(--u)*10); border-radius: 2px; background: rgba(176,122,62,.35); }
.e03-8 .e03-sky { display: flex; gap: calc(var(--u)*34); justify-content: center; align-items: center; }
.e03-8 .e03-sky .i7-snd.i8-snd { --sz: max(var(--i8-t), calc(var(--u)*140)); }
.e03-8 .e03-sky .i7-snd.is-fly { opacity: 0; pointer-events: none; }
.e03-8 .i7-in { animation: bq8-pop .4s cubic-bezier(.3,1.6,.5,1) both; }
.bq8-stage.is-tall .e03-8 .e03-four { display: grid; grid-template-columns: repeat(2, auto); gap: calc(var(--u)*60) calc(var(--u)*70); }
.bq8-stage.is-tall .e03-8 .e03-four .i7-card.i8-card { --s: calc(var(--u)*280); }
.bq8-stage.is-tall .e03-8 .e03-sky { flex-direction: column; gap: calc(var(--u)*50); }`;

  const BASKET = '<svg viewBox="0 0 200 110" aria-hidden="true"><path d="M20 30 Q100 -30 180 30" fill="none" stroke="#9B6A35" stroke-width="9" stroke-linecap="round"/><path d="M10 34 H190 L172 104 Q100 112 28 104 Z" fill="#D9A35C" stroke="#9B6A35" stroke-width="4"/><path d="M16 52 H184 M22 72 H178 M26 90 H174" stroke="#B5793A" stroke-width="5"/><path d="M50 36 L56 106 M100 36 V108 M150 36 L144 106" stroke="#B5793A" stroke-width="5"/><rect x="6" y="28" width="188" height="12" rx="6" fill="#B5793A"/></svg>';
  const BUB_COL = ['#3FB8F0', '#9B7BF0', '#2FC79A', '#F7954D'];

  function render(stage, ctx) {
    lib().then((I) => { if (ctx.alive()) run(I, stage, ctx); })
      .catch((e) => { console.warn('E03 lib', e); if (ctx.placeholder) ctx.placeholder(); });
  }

  function run(I, stage, ctx) {
    const h = BQ.h;
    if (!document.getElementById('st-e03')) document.head.append(h('style', { id: 'st-e03' }, CSS));
    if (!document.getElementById('st-e03-8')) document.head.append(h('style', { id: 'st-e03-8' }, CSS8));
    const S = I.session(ctx, { noText: true });
    const V8 = I.v8();
    I.lines({
      bq7_E03_l1_s1: 'اِسْتَمِع، وَحَدِّد كُلَّ كَلِمَةٍ فيها صَوْتُنا: مَ… مِ… مُ.',
      bq7_E03_l2_s1: 'الآنَ نَسْتَمِعُ إِلى أَصْواتٍ. اِسْتَمِع، ثُمَّ اخْتَر صَوْتَنا.',
      bq7_E03_end: 'أُذُنُكَ قَوِيَّةٌ.',
    });
    // المستوى ١ — سيناريو الفريق: المس كلّ كلمة فيها /م/ (R1-8)
    // SCI-1 T2: every target STARTS with the sound (مَ مِ مُ) — no «قَمَر»
    const L1 = [{ list: ['mawz', 'bab', 'miftah', 'muallim'], yes: ['mawz', 'miftah', 'muallim'], fixed: true },
      { list: ['muthallath', 'fil', 'maktab', 'batta'], yes: ['muthallath', 'maktab'] }];
    // المستوى ٢ — الفرق في الصامت وحده (R1-7)
    const longSet = ['maa', 'baa'].concat(I.hasAudio('bq7_S_faa') ? ['faa'] : I.hasAudio('bq7_S_naa') ? ['naa'] : []);
    const L2 = [['ma', 'ba', 'fa'], ['mi', 'fi', 'bi'], ['mu', 'bu', 'fu'], longSet];
    const GL = { ma: 'مَ', mi: 'مِ', mu: 'مُ', maa: 'ما' };
    const sid = (s) => 'bq7_S_' + s;
    const startL2 = ctx.step === 'l2';
    const onlyL1 = !!ctx.review && ctx.step === 'l1'; // مراجعة موجّهة S1: المستوى ١ وحده
    const nRounds = (startL2 ? 0 : L1.length) + (onlyL1 ? 0 : L2.length);
    // سطر تعليمة المستوى ١: الجديد إن سُجِّل، وإلا «اِسْمَعْ، ثُمَّ اخْتَرْ.» + «مَ… مِ… مُ» (لا سطر يقول «كلمتين»)
    const l1Intro = async () => { if (I.hasAudio('bq7_E03_l1_s1')) await S.say('bq7_E03_l1_s1'); else { await S.say('bq7_G_listen_choose'); await S.stim('bq7_S_chain_short'); } };

    const f8 = V8 ? I.frame8(S, 'e03-8', { pose: 'wave', panel: ['wide'] }) : null;
    const root = V8 ? f8.panel : I.root(stage, 'e03');
    const top = h('div.i7-row');
    const steps = I.stars(top, nRounds);
    const field = h('div.e03-field');
    const basket = h('div.e03-basket', { 'aria-hidden': 'true', html: BASKET });
    const bin = h('div.e03-in'); basket.append(bin);
    const need = h('div.e03-need', { 'aria-hidden': 'true' }); basket.append(need);
    const bottom = h('div.e03-bottom', null, basket);
    if (V8) root.append(field); else root.append(top, field, bottom);
    const buddy = I.buddy(S, root, 'wave');
    let busy = true, ri = 0, own = 0; // own: answers the child found himself (FIX12 A-11)
    const log = [];

    /** FIX12 A-14: a closing line is heard to its END before the end card — waits for the clip's «ended» (≤ duration + 1 s after the start) */
    async function sayFull(id, o) {
      const t0 = performance.now();
      await S.say(id, o);
      const au = BQ.audio && BQ.audio.voice ? BQ.audio.voice() : null;
      if (!au || au.ended || String(au.currentSrc || au.src || '').indexOf(id + '.mp3') < 0) return;
      const d = isFinite(au.duration) && au.duration > 0 ? au.duration : 0;
      const left = Math.max(0, (d + 1) * 1000 - (performance.now() - t0));
      if (!d || !left) return;
      await S.gate(new Promise((r) => { const t = setTimeout(r, left); au.addEventListener('ended', () => { clearTimeout(t); r(); }, { once: true }); }));
    }

    async function wordRound(R, r) {
      const order = R.fixed ? R.list.slice() : BQ.shuffle(R.list);
      const wrap = h('div.e03-four', { role: 'group', 'aria-label': 'أَرْبَعُ صُوَرٍ' });
      const cards = order.map((slug, i) => {
        const c = I.card(slug, { aria: 'صورة ' + I.AR(i + 1), earId: I.wordId(slug), ear: async (e) => { if (busy) return; busy = true; e.classList.add('is-play'); await I.playOn(S, c, I.wordId(slug)); e.classList.remove('is-play'); busy = false; } });
        I.hoverReplay(c, async () => { busy = true; await I.playOn(S, c, I.wordId(slug)); busy = false; }, () => !busy && !c.classList.contains('is-ok'));
        c.slug = slug; c.yes = R.yes.includes(slug); if (BQ.fb) BQ.fb.qa(c, c.yes); c.classList.add('i7-in'); c.style.animationDelay = (i * 0.1) + 's';
        wrap.append(c);
        return c;
      });
      field.replaceChildren(wrap);
      bin.replaceChildren();
      need.replaceChildren(...R.yes.map(() => h('i')));
      if (V8) f8.stars(R.yes.length); // v8: one star slot per word to find (replaces the basket)
      const left = () => cards.filter((c) => c.yes && !c.classList.contains('is-ok'));
      const playAll = async (slow) => { for (const c of cards) { if (I.isNo(c) || c.classList.contains('is-ok')) continue; await I.playOn(S, c, I.wordId(c.slug), slow ? { rate: 0.85 } : null); await S.sleep(320); } };
      I.instr(S, 'bq7_E03_l1_s1', 'hand', async () => { if (busy) return; busy = true; await l1Intro(); await playAll(); busy = false; });
      steps.cur(ri);
      await S.sleep(500);
      if (r === 0) await l1Intro();
      await playAll();
      let clean = true, wrongN = 0;
      busy = false;
      await new Promise((resolve) => {
        cards.forEach((c) => c.addEventListener('click', async () => {
          if (busy || I.isNo(c) || c.classList.contains('is-ok')) return;
          busy = true;
          if (c.yes) {
            own++; c.classList.remove('is-soft'); c.classList.add('is-ok'); I.anim(c, 'i7-pop', 450); I.sfx('ok'); I.burst(root, c, 12);
            const dot = need.children[R.yes.length - left().length - 1]; if (dot) dot.classList.add('on');
            await I.playOn(S, c, I.segId(c.slug));
            await toBasket(c, c.slug);
            if (!left().length) {
              I.record(S, 'S1', clean, { item: 'l1-' + (r + 1), kind: 'all' }); I.record(S, 'S2', clean, { item: 'l1-' + (r + 1) });
              buddy.cheer(); cards.forEach((x) => { if (!x.yes) x.classList.add('is-dim'); });
              await S.say(I.yes(), { talk: true });
              return resolve();
            }
            busy = false; return;
          }
          // مشتّت — OWNER_R3 ladder: ✗1 red mark + retry line + the word heard again slowly (no target is shown) ·
          // ✗2 Bariq solves: the remaining words turn green one by one and are heard in parts + an encouraging line (no star for them)
          clean = false; wrongN++;
          buddy.think(); I.markNo(c);
          if (wrongN === 1) {
            await S.say(I.tryL(), { talk: true });
            await I.playOn(S, c, I.wordId(c.slug), { rate: 0.85 });
            busy = false; return;
          }
          I.helped = true; buddy.point();
          for (const y of left()) { y.classList.add('is-ok'); if (V8) f8.help(); await I.playOn(S, y, I.segId(y.slug)); await S.sleep(250); } // FB-1: Bariq-found words → «helped» slots, no gold
          cards.forEach((x) => { if (!x.yes && !x.classList.contains('is-no')) x.classList.add('is-dim'); });
          I.record(S, 'S1', false, { item: 'l1-' + (r + 1), kind: 'all' }); I.record(S, 'S2', false, { item: 'l1-' + (r + 1) });
          await S.say(I.solveL(), { talk: true });
          return resolve();
        }));
      });
      log.push(['كلمات: ' + R.yes.map((x) => I.W[x].w).join('، ') + ' (مع ' + R.list.filter((x) => !R.yes.includes(x)).map((x) => I.W[x].w).join('، ') + ')', clean]);
      steps.on(ri++);
      busy = true;
      await S.sleep(450);
    }
    async function toBasket(c, slug) {
      if (V8) { await I.flyTo(root, c.querySelector('.i7-pic') || c, f8.starAt() || f8.starsEl, 650); f8.star(); I.sfx('pop'); return; }
      await I.flyTo(root, c.querySelector('.i7-pic') || c, basket, 650);
      bin.append(h('span', null, I.pic(slug)));
      basket.classList.remove('is-bump'); void basket.offsetWidth; basket.classList.add('is-bump');
      I.sfx('pop');
    }

    async function sylRound(set, r) {
      const yes = set[0];
      const sky = h('div.e03-sky', { role: 'group', 'aria-label': 'فُقّاعاتٌ' });
      if (V8 && r === 0) f8.stars(L2.length); // v8: one star per sound round
      const bubs = BQ.shuffle(set).map((s, i) => {
        if (V8) { const b = I.sndBtn({ id: sid(s), c: [2, 1, 3, 4, 5, 6][(i + r) % 6], aria: 'صَوْتٌ ' + I.AR(i + 1) }); b.s = s; b.classList.add('i7-in', 'e03-bub8'); b.style.animationDelay = (i * 0.1) + 's'; sky.append(b); return b; }
        const b = h('button.e03-bub' + (I.hasAudio(sid(s)) ? '' : '.is-mute'), { type: 'button', 'aria-label': 'فُقّاعَةٌ ' + I.AR(i + 1), html: I.IC.snd });
        b.style.setProperty('--c', BUB_COL[(i + r) % BUB_COL.length]);
        b.s = s; b.classList.add('i7-in'); b.style.animationDelay = (i * 0.1) + 's';
        sky.append(b);
        return b;
      });
      bubs.forEach((b) => I.hoverReplay(b, async () => { busy = true; await I.playOn(S, b, sid(b.s)); busy = false; }, () => !busy));
      const right = () => bubs.find((b) => b.s === yes);
      const playAll = async () => { for (const b of bubs) { if (I.isNo(b)) continue; await I.playOn(S, b, sid(b.s)); await S.sleep(420); } };
      if (V8) {
        const ear = h('button.bq8-btn.bq8-btn--ear.e03-ear8', { type: 'button', 'aria-label': 'اِسْتَمِع إِلَى الْأَصْوَاتِ مَرَّةً أُخْرَى' }, I.i8('ear'));
        ear.addEventListener('click', async () => { if (busy) return; busy = true; ear.classList.add('is-play'); await playAll(); ear.classList.remove('is-play'); busy = false; });
        field.replaceChildren(h('div.e03-tray8.i7-in', null, ear, h('span.e03-sep', { 'aria-hidden': 'true' }), sky));
        f8.stage.classList.add('e03-l2'); f8.bariq.classList.add('is-listen'); buddy.set('listen');
      } else field.replaceChildren(sky);
      // R1-6: سطر «الآنَ أَصْواتٌ قَصيرَةٌ» المسجَّل لا يصدق على جولة ما/با — في الجولة الطويلة تُعاد «اِسْمَعْ، ثُمَّ اخْتَرْ.»
      const longR = yes.length > 2;
      const introId = longR ? 'bq7_G_listen_choose' : 'bq7_E03_l2_s1';
      I.instr(S, introId, 'hand', async () => { if (busy) return; busy = true; await S.say(introId); await playAll(); busy = false; });
      steps.cur(ri);
      await S.sleep(500);
      if (r === 0) await S.say('bq7_E03_l2_s1');
      else if (longR) await S.say('bq7_G_listen_choose');
      await playAll();
      let first = null;
      const pol = I.policy(S, {
        opts: bubs, right,
        // R1-4: تلميح يفرّق فعلاً — الزوج المسجَّل بين صوتنا وصامت المشتّت الملموس (لا «الشفتان تلتقيان» التي تصدق على بَ)
        async hint1(picked) {
          // SCI-1 T2: no «اِسْمَع مَعي الفَرْقَ» line (sci: «بلاش جملة اسمع الفرق») — the contrast pair itself is heard after the retry line
          // FIX12 A-13: the pair is VOWEL-MATCHED to the round — our syllable then the touched one (مِ… بِ · مُ… فُ · ما… با), from the
          // approved single-syllable clips (S_<syl>); the old recorded fatha pairs (S_pair_mb/mf) only if a clip is missing
          if (picked && picked.s && I.hasAudio(sid(yes)) && I.hasAudio(sid(picked.s))) { await S.stim(sid(yes)); await S.sleep(600); await S.stim(sid(picked.s)); }
          else { const c = picked && picked.s ? picked.s[0] : 'b'; await S.stim(I.pick(c === 'f' ? 'bq7_S_pair_mf' : c === 'n' ? 'bq7_S_pair_mn' : 'bq7_S_pair_mb', 'bq7_S_pair_mb')); }
          await S.sleep(450);
          await playAll();
        },
        async model() { await I.playOn(S, right(), sid(yes)); },
      });
      busy = false;
      await new Promise((resolve) => {
        bubs.forEach((b) => b.addEventListener('click', async () => {
          if (busy || I.isNo(b)) return;
          busy = true;
          await I.playOn(S, b, sid(b.s)); // يُسمَع ثم يُحكم
          if (b.s === yes) {
            own++;
            if (first == null) { first = true; I.record(S, 'S2', true, { item: yes }); }
            if (V8) I.markOk(b); else b.classList.add('is-glow'); I.sfx('rise'); I.burst(root, b, 14); buddy.cheer();
            bubs.forEach((x) => { if (x !== b && !x.classList.contains('is-no')) x.classList.add('is-dim'); });
            if (V8) { await I.flyTo(root, b, f8.starAt() || buddy.el, 700); f8.star(); } else await I.flyTo(root, b, buddy.el, 700);
            b.classList.add('is-fly');
            await S.say(I.yes(), { talk: true });
            await S.stim(sid(yes));
            return resolve();
          }
          if (first == null) { first = false; I.record(S, 'S2', false, { item: yes, picked: b.s }); }
          const st = await pol.wrong(b);
          if (st === 'model') { if (V8) f8.help(); return resolve(); } // FB-1 star rule
          busy = false;
        }));
      });
      log.push(['مقاطع: ' + GL[yes] + ' (مع ' + set.slice(1).map((x) => ({ ba: 'بَ', fa: 'فَ', bi: 'بِ', fi: 'فِ', bu: 'بُ', fu: 'فُ', baa: 'با', faa: 'فا', naa: 'نا' })[x] || x).join('، ') + ')', first]);
      steps.on(ri++);
      busy = true;
      await S.sleep(400);
    }

    (async () => {
      await S.sleep(400);
      if (!startL2) {
        basket.style.visibility = '';
        for (let r = 0; r < L1.length; r++) await wordRound(L1[r], r);
      }
      basket.style.visibility = 'hidden';
      if (!onlyL1) for (let r = 0; r < L2.length; r++) await sylRound(L2[r], r);
      const okN = log.filter((x) => x[1]).length;
      I.note(S, (ctx.review ? '<p><b>مراجعة موجّهة (' + ctx.review.skill + ')</b> — ' + (onlyL1 ? 'المستوى ١ (كلمات)' : startL2 ? 'المستوى ٢ (مقاطع)' : 'النشاط كاملاً') + '.</p>' : '') +
        '<p><b>نتيجة «اِستمع وميّز»:</b> ' + I.AR(okN) + ' من ' + I.AR(log.length) + ' من المحاولة الأولى (مؤشّر للمعلّم: ٥ من ٦ — جولتا الكلمات تُحسبان ناجحتين إذا لُمست كلّ الصحيحة قبل أيّ مشتّت).</p><ul>' +
        log.map((x) => '<li>' + x[0] + ' — ' + (x[1] ? 'من الأولى' : 'بعد تلميح/نموذج') + '</li>').join('') + '</ul>' +
        '<p>إن تكرّر لمس «باب» أو «بَ»: قولا «مَ… بَ» متتاليتين، والمسا الأنف معاً — في /م/ يهتزّ الأنف، وفي /ب/ لا يهتزّ.</p>' +
        (longSet.length < 3 ? '<p>الجولة «ما / با» بخيارين مؤقّتاً حتى يُسجَّل «فا» أو «نا».</p>' : ''));
      field.replaceChildren();
      if (V8) { f8.stage.classList.remove('e03-l2'); f8.bariq.classList.remove('is-listen'); }
      buddy.set('cheer');
      // FIX12 A-11: «أُذُنُكَ قَوِيَّةٌ» / «أَحْسَنْتَ.» only if the child found at least one answer himself (not when Bariq solved everything)
      if (own > 0) { await sayFull('bq7_E03_end', { talk: true }); I.finish(S, { pose: 'cheer' }); } // FIX12 A-14: heard to its end before the end card
      else I.finish(S, { pose: 'cheer', title: 'هَيَّا نُكْمِل.' });
    })();
  }

  BQ.register(ID, { render });
})();
