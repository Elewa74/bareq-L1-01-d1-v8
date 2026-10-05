/* E05 · اُنْطُقْ مَعي — IX1 · v7 (قاعدة: النسخة الأولى — يقابل EL10 «تحدّث» / EL11 «اقرأ»: لقطة الفم + صفحة ورقية + نقاط الخطوات) · draft_unapproved
   SPEC_v7 §E05 · الناتج 3 (+1) · S4 · S3. ماذا يستطيع بعده؟ ينطق مَ مِ مُ ما مي مو نطقاً مفهوماً، ويفرّق سمعاً القصير من الطويل.
   ١ النموذج: bq7_E05_intro · bq7_E05_demo_lips (فم مطبق ← مفتوح — الموضع الوحيد لـ«مْ» القصيرة في الدرس)
   ٢ القصير: bq7_E05_short_intro (بارق يقفز مرّة) ← لكلّ مقطع: الفم + bq7_E05_say_ma|mi|mu ← G_your_turn + وقفة ٢ ث ← كلمة مثال _seg (مَكْتَبْ · مِفْتاحْ · مُشْطْ)
   ٣ الطويل: bq7_E05_long_intro (بارق ينزلق) ← say_maa|mii|muu + وقفة ← _seg (مانْجو · قَميصْ · نُمورْ) · شريط ضوء يمتدّ بطول الصوت (إشارة مدّة لا رمز)
   ٤ الفرق: bq7_E05_pairs_intro ← S_pair_a|i|u (قفزة ثم انزلاق) + G_your_turn بعد كلّ زوج · ٥ الساكن: tim_intro + W_timsah_seg
   ٦ قصير/طويل (٤ بنود: ما · مُ · مي · مَ؛ زرّان: بارق يقفز / بارق ينزلق): ✓ G_yes* + المقطع + is_long|is_short · ✗١ S_pair_* · ③ G_model + المقطع + is_* → record('S3')
   ٧ ساعِدْ بارِقًا (قرينة النطق): puppet_intro ← زرّان بوجه بارق (مَكْتَبْ/بَكْتَبْ · مُشْطْ/فُشْطْ) ✓ puppet_ok + الصحيحة · ✗١ G_listen_again · ③ G_model + W → record('S4')
   ٨ حكم المعلّم (مخفي): ضغط مطوَّل ١٫٥ ث على بارق ← «أتقن · قريب · ليس بعد» → BQ.mastery.judge('S4', …). لا مايكروفون. النهاية bq7_E05_end. ctx.step 'long' ← من ٣. */
(function () {
  'use strict';
  const ID = 'E05';
  const lib = () => (BQ.ix1 ? Promise.resolve(BQ.ix1) : BQ.loadScript('js/el7/lib/ix1.js').then(() => BQ.ix1));

  const CSS = `
.e05 { justify-content: space-between; }
.e05 .e05-stage { flex: 1 1 auto; min-height: 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: clamp(14px, 4cqi, 44px); }
.e05 .e05-mouthw { flex: none; width: min(38cqi, calc(var(--i7-h) - 150px), 430px); }
.e05 .e05-mouthw .i7-mouth { width: 100%; border-radius: var(--r-lg, 26px); }
.e05 .e05-side { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(10px, 2.2cqi, 20px); width: min(46cqi, 500px); min-height: min(38cqi, calc(var(--i7-h) - 150px), 430px);
  padding: clamp(12px, 2cqi, 20px); border-radius: var(--r-lg, 26px); background: var(--paper, #FFFBEA); border: 2px solid var(--paper-edge, #F1DFA6); box-shadow: 0 10px 24px var(--shade); }
/* بارق يقفز / ينزلق */
.e05 .e05-fly { position: relative; display: block; width: 100%; height: clamp(84px, 12cqi, 118px); }
.e05 .e05-fly .b { position: absolute; z-index: 2; bottom: 0; inset-inline-start: 0; height: 100%; aspect-ratio: 1; }
.e05 .e05-fly .b img { width: 100%; height: 100%; object-fit: contain; transform: scale(1.35); transform-origin: 50% 80%; }
.e05 .e05-fly .g { position: absolute; z-index: 1; pointer-events: none; }
.e05 .e05-fly.hop .g { bottom: 30%; inset-inline-start: 10%; width: 34%; height: 44%; border: 4px dotted var(--sun); border-bottom: 0; border-radius: 50% 50% 0 0 / 100% 100% 0 0; }
.e05 .e05-fly.glide .g { bottom: 52%; inset-inline-start: 12%; width: 84%; height: 0; border-top: 4px dashed var(--sun); }
.e05 .e05-fly.glide .g::after { content: ''; position: absolute; inset-inline-end: -4px; top: -10px; border: 8px solid transparent; border-inline-start: 12px solid var(--sun); }
.e05 .e05-fly.hop .b.go { animation: e05Hop .55s cubic-bezier(.3,.7,.4,1) both; }
.e05 .e05-fly.glide .b.go { animation: e05Glide 1.25s ease-in-out both; }
@keyframes e05Hop { 50% { transform: translate(calc(var(--run, 60px) * -.5 * var(--dir, 1)), -55%); } 100% { transform: translate(calc(var(--run, 60px) * -1 * var(--dir, 1)), 0); } }
@keyframes e05Glide { 18% { transform: translate(calc(var(--run, 200px) * -.08 * var(--dir, 1)), -48%); } 82% { transform: translate(calc(var(--run, 200px) * -.92 * var(--dir, 1)), -48%); } 100% { transform: translate(calc(var(--run, 200px) * -1 * var(--dir, 1)), 0); } }
.e05 .e05-pairs { flex-wrap: nowrap; width: 100%; align-items: flex-end; }
.e05 .e05-pairs .ps { flex: 0 0 34%; display: flex; flex-direction: column; gap: 8px; }
.e05 .e05-pairs .pl { flex: 1 1 0; display: flex; flex-direction: column; gap: 8px; }
.e05 .e05-pairs .e05-track.short { width: 100%; }
/* شريط الضوء */
.e05 .e05-track { position: relative; width: 100%; height: 30px; border-radius: 16px; background: #fff; box-shadow: inset 0 2px 5px rgba(0,52,91,.12); }
.e05 .e05-track i { position: absolute; inset-block: 5px; inset-inline-start: 6px; width: 0; max-width: calc(100% - 12px); border-radius: 12px; background: linear-gradient(90deg, #FFD84D, var(--sun)); box-shadow: 0 0 12px rgba(254,186,2,.7); }
.e05 .e05-track.short { width: 34%; }
.e05 .e05-word { --s: min(18cqi, calc(var(--i7-h) - 360px), 170px); min-width: 92px; }
.e05 .e05-turn { position: relative; width: 74px; height: 74px; border-radius: 24px; background: #fff; display: grid; place-items: center; box-shadow: 0 0 0 4px var(--sun), 0 6px 14px var(--shade); }
.e05 .e05-turn svg.m { width: 64%; height: 64%; animation: e05Talk .5s ease-in-out infinite; }
.e05 .e05-turn svg.ring { position: absolute; inset: -10px; width: calc(100% + 20px); height: calc(100% + 20px); transform: rotate(-90deg); }
.e05 .e05-turn svg.ring circle { fill: none; stroke: var(--sky); stroke-width: 5; stroke-linecap: round; }
@keyframes e05Talk { 50% { transform: scaleY(.7); } }
/* زرّا القصير/الطويل وزرّا بارق */
.e05 .e05-two { display: flex; gap: clamp(14px, 3cqi, 30px); justify-content: center; align-items: stretch; flex-wrap: wrap; }
.e05 .e05-two:not(.e05-pairs) { flex-wrap: nowrap; width: 100%; }
.e05 .e05-two:not(.e05-pairs) .e05-lb { flex: 1 1 0; width: auto; min-width: 0; max-width: 220px; }
.e05 .e05-lb { position: relative; width: clamp(140px, 19cqi, 200px); min-height: 110px; border-radius: var(--r-lg, 26px); border: 4px solid #fff; padding: 6px 8px; cursor: pointer;
  background: linear-gradient(180deg, #fff, var(--sky-wash)); box-shadow: 0 6px 0 var(--sky-line), 0 12px 24px var(--shade); transition: transform .2s, opacity .3s, box-shadow .25s, filter .3s; }
.e05 .e05-lb .e05-fly { height: 100px; }
.e05 .e05-lb:active { transform: translateY(4px); }
.e05 .e05-lb.is-play { box-shadow: 0 0 0 6px var(--sky), 0 12px 24px var(--shade); }
.e05 .e05-lb.is-ok { box-shadow: 0 0 0 6px var(--ok), 0 12px 24px var(--shade); }
.e05 .e05-lb.is-soft, .e05 .e05-lb.is-glow { box-shadow: 0 0 0 7px var(--sun-soft), 0 0 30px var(--sun-soft); }
.e05 .e05-lb.is-dim { opacity: .4; filter: saturate(.4); }
.e05 .e05-pb { display: grid; place-items: center; min-height: 128px; }
.e05 .e05-pb .bq-brq { width: 100px; }
.e05 .e05-pb .e05-badge { position: absolute; top: 8px; inset-inline-end: 10px; width: 30px; height: 30px; border-radius: 50%; background: var(--sun); color: var(--navy); display: grid; place-items: center; }
.e05 .e05-pb .e05-badge svg { width: 70%; height: 70%; }
@container stage (max-width: 640px) {
  .e05 .e05-stage { flex-direction: column; gap: 10px; }
  .e05 .e05-mouthw { width: min(46cqi, calc(var(--i7-h) - 470px), 220px); min-width: 120px; }
  .e05 .e05-side { width: 94cqi; min-height: 0; }
  .e05 .e05-word { --s: min(30cqi, 120px); }
  .e05 .e05-lb { width: 42cqi; }
}
@media (max-height: 500px) {
  .e05 .e05-stage { gap: 18px; }
  .e05 .e05-mouthw { width: max(130px, calc(var(--i7-h) - 50px)); }
  .e05 .e05-side { min-height: 0; max-height: calc(var(--i7-h) - 34px); padding: 8px 12px; gap: 6px; width: min(52cqi, 440px); }
  .e05 .e05-fly { height: 66px; }
  .e05 .e05-lb { min-height: 96px; } .e05 .e05-lb .e05-fly { height: 76px; }
  .e05 .e05-pb { min-height: 104px; } .e05 .e05-pb .bq-brq { width: 80px; }
  .e05 .e05-word { --s: 84px; min-width: 84px; border-width: 4px; }
  .e05 .e05-turn { width: 60px; height: 60px; }
  .e05 .e05-track { height: 24px; }
}
@media (prefers-reduced-motion: reduce) { .e05 .e05-fly .b.go, .e05 .e05-turn svg.m { animation: none !important; } }`;
  /* v8 (OWNER_R3-5): «the boy is not Majed · Bariq changed · the lip motion is wrong — use real expressive drawings».
     → NO lip animation and no overlay on a face: Majed's mouth is shown as big still PICTURES, one per sound step, in sync with the audio
       (lips together → open مَ / spread مِ / rounded مُ), with a two-frame strip under it that names the step. ART m8_mouth_* (+ e05_majed_portrait)
       replace the approved img7 mouth_* by themselves when they land. Bariq = the approved squircle (img8/brq8_*; e05_bariq_portrait when present). */
  const CSS8 = `
.e05-8 .e05-stage { flex: 1 1 auto; min-height: 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*48); }
.e05-8 .e05-mouthw { flex: none; width: calc(var(--u)*360); }
.e05-8 .e05-side { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: calc(var(--u)*18); width: calc(var(--u)*450); min-height: calc(var(--u)*400);
  padding: calc(var(--u)*20); border-radius: calc(var(--u)*32); background: rgba(255,255,255,.72); box-shadow: 0 0 0 calc(var(--u)*3) rgba(11,45,79,.10); }
.e05-8 .e05-fly { position: relative; display: block; width: 100%; height: calc(var(--u)*120); }
.e05-8 .e05-fly .b { position: absolute; z-index: 2; bottom: 0; inset-inline-start: 0; height: 100%; aspect-ratio: 1; }
.e05-8 .e05-fly .b img { width: 100%; height: 100%; object-fit: contain; transform: scale(1.25); transform-origin: 50% 80%; }
.e05-8 .e05-fly .g { position: absolute; z-index: 1; pointer-events: none; }
.e05-8 .e05-fly.hop .g { bottom: 30%; inset-inline-start: 10%; width: 34%; height: 44%; border: calc(var(--u)*5) dotted var(--bq8-star-d); border-bottom: 0; border-radius: 50% 50% 0 0 / 100% 100% 0 0; }
.e05-8 .e05-fly.glide .g { bottom: 52%; inset-inline-start: 12%; width: 84%; height: 0; border-top: calc(var(--u)*5) dashed var(--bq8-star-d); }
.e05-8 .e05-fly.glide .g::after { content: ''; position: absolute; inset-inline-end: -4px; top: calc(var(--u)*-12); border: calc(var(--u)*10) solid transparent; border-inline-start: calc(var(--u)*14) solid var(--bq8-star-d); }
.e05-8 .e05-fly.hop .b.go { animation: e05Hop .55s cubic-bezier(.3,.7,.4,1) both; }
.e05-8 .e05-fly.glide .b.go { animation: e05Glide 1.25s ease-in-out both; }
.e05-8 .e05-track { position: relative; width: 100%; height: calc(var(--u)*34); border-radius: 999px; background: #fff; box-shadow: inset 0 calc(var(--u)*2) calc(var(--u)*5) rgba(11,45,79,.15), 0 0 0 calc(var(--u)*3) rgba(11,45,79,.12); }
.e05-8 .e05-track i { position: absolute; inset-block: calc(var(--u)*6); inset-inline-start: calc(var(--u)*6); width: 0; max-width: calc(100% - 12px); border-radius: 999px; background: linear-gradient(90deg, #FFE38A, var(--bq8-yellow)); box-shadow: 0 0 calc(var(--u)*12) rgba(255,194,26,.7); }
.e05-8 .e05-track.short { width: 34%; }
.e05-8 .e05-pairs { display: flex; gap: calc(var(--u)*24); width: 100%; align-items: flex-end; }
.e05-8 .e05-pairs .ps { flex: 0 0 34%; display: flex; flex-direction: column; gap: calc(var(--u)*10); }
.e05-8 .e05-pairs .pl { flex: 1 1 0; display: flex; flex-direction: column; gap: calc(var(--u)*10); }
.e05-8 .e05-pairs .e05-track.short { width: 100%; }
.e05-8 .e05-word.i7-card.i8-card { --s: calc(var(--u)*170); }
.e05-8 .e05-side .i8-seq.is-big { gap: calc(var(--u)*16); padding: calc(var(--u)*18) calc(var(--u)*20); }
.e05-8 .e05-side .i8-seq.is-big .i8-th { width: calc(var(--u)*150); border-radius: calc(var(--u)*30); }
.e05-8 .e05-side .i8-seq.is-big .i8-arr { font-size: calc(var(--u)*64); }
.e05-8 .e05-turn { position: relative; width: max(72px, calc(var(--u)*110)); height: max(72px, calc(var(--u)*110)); font-size: max(52px, calc(var(--u)*80)); cursor: default; }
.e05-8 .e05-turn .bq8-ic { animation: e05Talk8 .9s ease-in-out infinite; }
@keyframes e05Talk8 { 50% { transform: scale(1.12); } }
.e05-8 .e05-turn svg.ring { position: absolute; inset: -14%; width: 128%; height: 128%; transform: rotate(-90deg); }
.e05-8 .e05-turn svg.ring circle { fill: none; stroke: var(--bq8-mouth); stroke-width: 5; stroke-linecap: round; }
.e05-8 .e05-two { display: flex; gap: calc(var(--u)*30); justify-content: center; align-items: stretch; width: 100%; }
.e05-8 .e05-lb { position: relative; flex: 1 1 0; min-width: 0; max-width: calc(var(--u)*220); min-height: max(96px, calc(var(--u)*170)); padding: calc(var(--u)*10); cursor: pointer; border-radius: calc(var(--u)*28);
  background: #fff; border: var(--bq8-line) solid var(--bq8-navy); box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-2); transition: transform .2s, opacity .3s, box-shadow .25s, filter .3s; }
.e05-8 .e05-lb .e05-fly { height: calc(var(--u)*130); }
.e05-8 .e05-lb:active { transform: translateY(calc(var(--u)*4)); }
.e05-8 .e05-lb.is-play { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-listen), var(--bq8-sh-2); }
.e05-8 .e05-lb.is-ok { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-ok), var(--bq8-sh-2); }
.e05-8 .e05-lb.is-soft, .e05-8 .e05-lb.is-glow { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-yellow), 0 0 calc(var(--u)*30) var(--bq8-yellow); }
.e05-8 .e05-lb.is-dim { opacity: .4; filter: grayscale(.5); }
.e05-8 .e05-pb { display: grid; place-items: center; }
.e05-8 .e05-pb img { width: calc(var(--u)*150); aspect-ratio: 1; object-fit: contain; }
.e05-8 .e05-pb.is-play img { animation: e05Talk8 .5s ease-in-out infinite; }
.e05-8 .e05-badge { position: absolute; top: calc(var(--u)*-18); inset-inline-end: calc(var(--u)*-18); width: calc(var(--u)*58); aspect-ratio: 1; border-radius: 50%; display: grid; place-items: center; font-size: calc(var(--u)*42);
  background: radial-gradient(circle at 38% 30%, #fff, #FFE38A 62%); border: calc(var(--u)*3) solid var(--bq8-navy); box-shadow: 0 0 0 calc(var(--u)*4) #fff; }
.bq8-stage.is-tall .e05-8 .e05-stage { flex-direction: column; gap: calc(var(--u)*30); }
.bq8-stage.is-tall .e05-8 .e05-mouthw { width: calc(var(--u)*420); }
.bq8-stage.is-tall .e05-8 .e05-side { width: calc(var(--u)*760); min-height: 0; }
@media (prefers-reduced-motion: reduce) { .e05-8 .e05-fly .b.go, .e05-8 .e05-turn .bq8-ic, .e05-8 .e05-pb.is-play img { animation: none !important; } }`;

  function render(stage, ctx) {
    lib().then((I) => { if (ctx.alive()) run(I, stage, ctx); })
      .catch((e) => { console.warn('E05 lib', e); if (ctx.placeholder) ctx.placeholder(); });
  }

  function run(I, stage, ctx) {
    const h = BQ.h;
    if (!document.getElementById('st-e05')) document.head.append(h('style', { id: 'st-e05' }, CSS));
    if (!document.getElementById('st-e05-8')) document.head.append(h('style', { id: 'st-e05-8' }, CSS8));
    const S = I.session(ctx, { noText: true });
    const V8 = I.v8();
    const turnIcon = () => (V8 ? h('span.bq8-btn.bq8-btn--mouth.e05-turn', { 'aria-hidden': 'true' }, I.i8('mouth')) : null);
    I.lines({
      bq7_E05_intro: 'اُنْظُرْ إِلى الفَمِ، وَقُلْ مَعي.', bq7_E05_demo_lips: 'الشَّفَتانِ مُغْلَقَتانِ: مْ… ثُمَّ تَنْفَتِحانِ: مَ.',
      bq7_E05_short_intro: 'صَوْتٌ قَصيرٌ، مِثْلُ قَفْزَةِ بارِقٍ.', bq7_E05_long_intro: 'صَوْتٌ طَويلٌ، مِثْلُ انْزِلاقِ بارِقٍ.',
      bq7_E05_say_ma: 'قُلْ مَعي: مَ.', bq7_E05_say_mi: 'قُلْ مَعي: مِ.', bq7_E05_say_mu: 'قُلْ مَعي: مُ.',
      bq7_E05_say_maa: 'قُلْ مَعي: ما.', bq7_E05_say_mii: 'قُلْ مَعي: مي.', bq7_E05_say_muu: 'قُلْ مَعي: مو.',
      bq7_E05_pairs_intro: 'اِسْمَعِ الفَرْقَ: قَصيرٌ… طَويلٌ.', bq7_E05_tim_intro: 'وَفي هَذِهِ الكَلِمَةِ، اِسْمَعْ جَيِّدًا:',
      bq7_E05_q_len: 'قَصيرٌ أَمْ طَويلٌ؟', bq7_E05_is_short: 'قَصيرٌ.', bq7_E05_is_long: 'طَويلٌ.',
      bq7_E05_puppet_intro: 'أَنا أَقولُ الكَلِمَةَ مَرَّتَيْنِ. أَيُّهُما صَحيحَةٌ؟', bq7_E05_puppet_ok: 'شُكْرًا! الآنَ أَقولُها صَحيحَةً.', bq7_E05_end: 'أَحْسَنْتَ! نَطَقْتَ جَيِّدًا.',
    });
    const SHORT = [{ s: 'ma', v: 'a', w: 'maktab', p: 'a' }, { s: 'mi', v: 'i', w: 'miftah', p: 'i' }, { s: 'mu', v: 'u', w: 'musht', p: 'u' }];
    const LONG = [{ s: 'maa', v: 'a', w: 'manju', p: 'a' }, { s: 'mii', v: 'i', w: 'qamis', p: 'i' }, { s: 'muu', v: 'u', w: 'numur', p: 'u' }];
    const CHECK = [LONG[0], SHORT[2], LONG[1], SHORT[0]]; // ما · مُ · مي · مَ
    const PUP = [{ w: 'maktab', ok: 'bq7_E05_brq_maktab_ok', bad: 'bq7_E05_brq_maktab_bad' }, { w: 'musht', ok: 'bq7_E05_brq_musht_ok', bad: 'bq7_E05_brq_musht_bad' }];
    const sid = (s) => 'bq7_S_' + s;
    const isLong = (it) => it.s.length > 2;
    const dir = document.documentElement.dir === 'rtl' || (ctx.frame && getComputedStyle(ctx.frame).direction === 'rtl') ? 1 : -1;

    const f8 = V8 ? I.frame8(S, 'e05-8', { pose: 'wave' }) : null;
    const root = V8 ? f8.panel : I.root(stage, 'e05');
    const top = h('div.i7-row');
    const steps = I.stars(top, 7);
    const mouthW = h('div.e05-mouthw');
    const mouth = V8 ? I.mouth8(S) : I.mouth(S); mouthW.append(mouth.el);
    const side = h('div.e05-side');
    if (V8) root.append(h('div.e05-stage', null, mouthW, side)); else root.append(top, h('div.e05-stage', null, mouthW, side));
    const buddy = I.buddy(S, root, 'wave');
    let busy = true, judged = false;

    // حكم المعلّم المخفي (S4)
    I.teacherPanel(S, {
      title: 'نطق الطفل (S4) — حكم المعلّم',
      opts: [{ id: 'm', label: 'أتقن' }, { id: 'n', label: 'قريب', ghost: true }, { id: 'x', label: 'ليس بعد', ghost: true }],
      // حكم المعلّم = BQ.mastery.judge (عقد المنصّة: S4 = البند ١ في E11 + حكم «أتقن») — لا يُسجَّل محاولةً
      onPick(id) { judged = id; try { if (BQ.mastery && BQ.mastery.judge) BQ.mastery.judge('S4', { m: 'mastered', n: 'near', x: 'notyet' }[id]); else I.record(S, 'S4', id === 'm', { by: 'teacher', judge: id }); } catch (e) { /* */ } },
    });

    /* بارق يقفز (قصير) / ينزلق (طويل): صورة bariq_hop|glide إن وُجدت، وإلا بارق الثابت */
    const flyer = (kind) => {
      const key = kind === 'hop' ? 'bariq_hop' : 'bariq_glide';
      // v8: the approved squircle Bariq (the img7 hop/glide plates read as a box — ART audit)
      const src = V8 ? I.brq8(kind === 'hop' ? 'cheer' : 'hi') : I.hasImg(key) ? I.imgSrc(key) : BQ.char.still(kind === 'hop' ? 'cheer' : 'wave');
      const el = h('span.e05-fly.' + kind, { 'aria-hidden': 'true' }, h('i.g'));
      const b = h('span.b', null, h('img', { src, alt: '', draggable: 'false' }));
      b.style.setProperty('--dir', dir);
      el.append(b);
      el.go = () => {
        const run = Math.max(30, (el.clientWidth - b.clientWidth) * (kind === 'hop' ? 0.42 : 1));
        b.style.setProperty('--run', run + 'px');
        b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
        I.sfx(kind === 'hop' ? 'pop' : 'whoosh');
      };
      return el;
    };
    const bar = (long) => { const t = h('div.e05-track' + (long ? '' : '.short'), { 'aria-hidden': 'true' }, h('i')); t.run = (ms) => { const f = t.firstChild; f.style.transition = 'none'; f.style.width = '0'; void f.offsetWidth; f.style.transition = 'width ' + (I.reduced() ? 1 : ms) + 'ms linear'; f.style.width = 'calc(100% - 12px)'; }; return t; };
    const turn = async (ms) => {
      await S.say('bq7_G_your_turn');
      const box = V8 ? turnIcon() : h('span.e05-turn', { 'aria-hidden': 'true', html: I.IC.mouth.replace('<svg', '<svg class="m"') + '<svg class="ring" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36"/></svg>' });
      if (V8) box.insertAdjacentHTML('beforeend', '<svg class="ring" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36"/></svg>');
      side.append(box); buddy.el.classList.add('is-listen');
      const c = box.querySelector('circle'), len = 2 * Math.PI * 36;
      c.style.strokeDasharray = len; c.style.strokeDashoffset = 0; void c.getBoundingClientRect();
      c.style.transition = 'stroke-dashoffset ' + (ms / 1000) + 's linear'; c.style.strokeDashoffset = len;
      await S.wait(ms + 50);
      box.remove(); buddy.el.classList.remove('is-listen');
    };
    /** مقطع وحده (الفم + الشريط) */
    const syl = async (it, track) => { await mouth.say(sid(it.s), it.v, { onStart: () => { if (track) track.run(isLong(it) ? 1000 : 420); } }); };

    async function model() {
      steps.cur(0);
      // v8: no empty side panel — the two mouth pictures (lips together → open) are shown BIG there during the demo, lit in sync with the audio
      const seq = V8 ? mouth.el.querySelector('.i8-seq') : null;
      if (seq) { seq.classList.add('is-big'); side.replaceChildren(seq); }
      else side.replaceChildren(h('span.e05-turn', { 'aria-hidden': 'true', html: I.IC.mouth.replace('<svg', '<svg class="m"') }));
      await S.say('bq7_E05_intro');
      mouth.lips(true);
      await mouth.sayLine('bq7_E05_demo_lips', 'a', 0.55);
      mouth.lips(false);
      if (seq) { seq.classList.remove('is-big'); mouth.el.append(seq); }
      steps.on(0);
    }

    async function teach(list, long, si) {
      steps.cur(si);
      const fl = flyer(long ? 'glide' : 'hop');
      side.replaceChildren(fl);
      await S.sleep(200);
      fl.go(); if (!long) buddy.hop();
      await S.say(long ? 'bq7_E05_long_intro' : 'bq7_E05_short_intro');
      for (const it of list) {
        const track = bar(long);
        side.replaceChildren(fl, track);
        await S.sleep(250);
        await syl(it, track); fl.go();
        await S.sleep(300);
        let tailT = 0;
        const tp = mouth.sayLine('bq7_E05_say_' + it.s, it.v, long ? 0.9 : 0.55);
        tailT = setTimeout(() => { if (S.live) track.run(long ? 1000 : 420); }, Math.max(400, I.text('bq7_E05_say_' + it.s).length * 55));
        await tp; clearTimeout(tailT);
        await turn(2000);
        const card = I.card(it.w, { aria: 'كَلِمَةُ مِثالٍ' });
        card.classList.add('e05-word', 'i7-in');
        side.append(card);
        card.addEventListener('click', async () => { if (busy) return; busy = true; await I.playOn(S, card, I.segId(it.w)); busy = false; });
        await I.playOn(S, card, I.segId(it.w));
        await S.sleep(500);
      }
      steps.on(si);
    }

    async function pairs() {
      steps.cur(3);
      await S.say('bq7_E05_pairs_intro');
      for (let k = 0; k < 3; k++) {
        const sh = SHORT[k];
        const fh = flyer('hop'), fg = flyer('glide'), ts = bar(false), tl = bar(true);
        side.replaceChildren(h('div.e05-two.e05-pairs', null, h('div.ps', null, fh, ts), h('div.pl', null, fg, tl)));
        await S.sleep(250);
        // «مَ… ما»: الفم ينطبق وينفتح قصيراً ثم طويلاً (تقريب زمنيّ)
        const p = S.stim('bq7_S_pair_' + sh.p);
        if (mouth.shape) mouth.shape(sh.v);
        mouth.set('closed'); await S.wait(120); mouth.set(sh.v); fh.go(); ts.run(420); await S.wait(420); mouth.set('rest');
        await S.wait(520); mouth.set('closed'); await S.wait(120); mouth.set(sh.v); fg.go(); tl.run(1000);
        await p; await S.wait(120); mouth.set('rest');
        await turn(2000);
      }
      steps.on(3);
    }

    async function sukun() {
      steps.cur(4);
      const card = I.card('timsah', { aria: 'كَلِمَةُ مِثالٍ' }); card.classList.add('e05-word', 'i7-in');
      side.replaceChildren(card);
      await S.say('bq7_E05_tim_intro');
      await I.playOn(S, card, I.segId('timsah'));
      card.addEventListener('click', async () => { if (busy) return; busy = true; await I.playOn(S, card, I.segId('timsah')); busy = false; });
      await S.sleep(400);
      steps.on(4);
    }

    async function lenCheck() {
      steps.cur(5);
      const log = [];
      for (let n = 0; n < CHECK.length; n++) {
        const it = CHECK[n];
        const bHop = h('button.e05-lb', { type: 'button', 'aria-label': 'قَصيرٌ — بارِقٌ يَقْفِزُ' }, flyer('hop'));
        const bGl = h('button.e05-lb', { type: 'button', 'aria-label': 'طَويلٌ — بارِقٌ يَنْزَلِقُ' }, flyer('glide'));
        side.replaceChildren(h('div.e05-two', null, bHop, bGl));
        const opts = [bHop, bGl], right = () => (isLong(it) ? bGl : bHop);
        const ask = async () => { await syl(it, null); await S.sleep(200); await S.say('bq7_E05_q_len'); };
        I.instr(S, 'bq7_E05_q_len', 'ear', async () => { if (busy) return; busy = true; await ask(); busy = false; });
        const evid = () => S.say(isLong(it) ? 'bq7_E05_is_long' : 'bq7_E05_is_short');
        let first = null;
        const pol = I.policy(S, {
          opts, right,
          async hint1() { await S.stim('bq7_S_pair_' + it.p); await S.sleep(300); await ask(); },
          async model() { await syl(it, null); right().querySelector('.e05-fly').go(); await evid(); },
        });
        await new Promise((resolve) => {
          opts.forEach((b) => { b.onclick = async () => {
            if (busy || I.isNo(b)) return;
            busy = true;
            b.querySelector('.e05-fly').go();
            if (b === right()) {
              if (first == null) { first = true; I.record(S, 'S3', true, { item: it.s }); log.push([it.s, true]); }
              b.classList.add('is-ok'); I.sfx('ok'); I.burst(root, b, 12); buddy.cheer();
              await S.say(I.yes(), { talk: true });
              await syl(it, null); await evid();
              await S.sleep(300);
              return resolve();
            }
            if (first == null) { first = false; I.record(S, 'S3', false, { item: it.s }); log.push([it.s, false]); }
            const st = await pol.wrong(b);
            if (st === 'model') { await S.sleep(300); return resolve(); }
            busy = false;
          }; });
          (async () => { busy = true; await S.sleep(350); await ask(); busy = false; })();
        });
        busy = true;
      }
      steps.on(5);
      return log;
    }

    async function puppet() {
      steps.cur(6);
      side.replaceChildren(V8 ? h('span.bq8-btn.bq8-btn--ear.e05-turn', { 'aria-hidden': 'true' }, I.i8('ear')) : h('span.e05-turn', { 'aria-hidden': 'true', html: I.IC.ear }));
      await S.say('bq7_E05_puppet_intro', { talk: true });
      const log = [];
      for (const it of PUP) {
        const vs = BQ.shuffle([{ id: it.ok, ok: true }, { id: it.bad, ok: false }]);
        const btns = vs.map((v, i) => {
          const b = V8 ? h('button.e05-lb.e05-pb', { type: 'button', 'aria-label': 'بارِقٌ يَقولُ ' + I.AR(i + 1) },
            h('img', { alt: '', draggable: 'false', src: I.has8('e05_bariq_portrait') ? I.src8('e05_bariq_portrait') : I.brq8(i ? 'front' : 'happy') }), h('span.e05-badge', { 'aria-hidden': 'true' }, I.i8('listen')))
            : h('button.e05-lb.e05-pb', { type: 'button', 'aria-label': 'بارِقٌ يَقولُ ' + I.AR(i + 1) }, BQ.ui.brq('talk'), h('span.e05-badge', { 'aria-hidden': 'true', html: I.IC.snd }));
          b.v = v; return b;
        });
        const wp = I.card(it.w, { aria: 'الكَلِمَةُ' }); wp.classList.add('e05-word', 'i7-in'); wp.tabIndex = -1; wp.style.pointerEvents = 'none';
        side.replaceChildren(wp, h('div.e05-two', null, btns));
        const right = () => btns.find((b) => b.v.ok);
        btns.forEach((b) => I.hoverReplay(b, async () => { busy = true; await I.playOn(S, b, b.v.id); busy = false; }, () => !busy));
        const playBoth = async () => { for (const b of btns) { if (I.isNo(b)) continue; await I.playOn(S, b, b.v.id); await S.sleep(450); } };
        I.instr(S, 'bq7_E05_puppet_intro', 'ear', async () => { if (busy) return; busy = true; await playBoth(); busy = false; });
        let first = null;
        const pol = I.policy(S, {
          opts: btns, right,
          async hint1() { await playBoth(); },
          async model() { await S.stim(I.wordId(it.w)); },
        });
        await new Promise((resolve) => {
          btns.forEach((b) => { b.onclick = async () => {
            if (busy || I.isNo(b)) return;
            busy = true;
            await I.playOn(S, b, b.v.id); // يُسمَع ثم يُحكم
            if (b.v.ok) {
              if (first == null) { first = true; I.record(S, 'S4', true, { item: it.w, by: 'puppet' }); log.push([it.w, true]); }
              b.classList.add('is-ok'); I.sfx('ok'); buddy.cheer();
              await S.say(I.yes(), { talk: true }); // OWNER_R3: varied praise, never «شُكْرًا»
              await S.stim(it.ok);
              await S.sleep(300);
              return resolve();
            }
            if (first == null) { first = false; I.record(S, 'S4', false, { item: it.w, by: 'puppet' }); log.push([it.w, false]); }
            const st = await pol.wrong(b);
            if (st === 'model') { await S.sleep(300); return resolve(); }
            busy = false;
          }; });
          (async () => { busy = true; await S.sleep(300); await playBoth(); busy = false; })();
        });
        busy = true;
      }
      steps.on(6);
      return log;
    }

    I.instr(S, 'bq7_E05_intro', 'mouth', async () => { if (busy) return; busy = true; await S.say('bq7_E05_intro'); busy = false; });

    (async () => {
      await S.sleep(400);
      const fromLong = ctx.step === 'long';
      const rv = ctx.review ? (fromLong ? 'S3' : ctx.review.skill) : null; // مراجعة موجّهة: S3 ← الطويل والفرق والتحقّق · S4 ← النموذج والقصير وبارق
      if (!fromLong) { await model(); await teach(SHORT, false, 1); } else { steps.on(0); steps.on(1); }
      let lens = [], pup = [];
      if (rv !== 'S4') { await teach(LONG, true, 2); await pairs(); if (!rv) await sukun(); else steps.on(4); lens = await lenCheck(); } else { [2, 3, 4, 5].forEach((k) => steps.on(k)); }
      if (rv !== 'S3') pup = await puppet(); else steps.on(6);
      const okL = lens.filter((x) => x[1]).length, okP = pup.filter((x) => x[1]).length;
      I.note(S, '<p><b>نتيجة «انطق معي»:</b> قصير/طويل (S3) ' + I.AR(okL) + ' من ' + I.AR(lens.length) + ' · «ساعِدْ بارِقًا» (S4 قرينة) ' + I.AR(okP) + ' من ' + I.AR(pup.length) + ' (النجاح: ٣/٤ + ٢/٢).</p>' +
        '<p><b>حكمك على النطق (S4):</b> اضغط مطوّلاً ١٫٥ ث على بارق في زاوية النشاط ← «أتقن · قريب · ليس بعد». ' + (judged ? 'سُجِّل حكمك.' : 'بلا حكم = لا تسجيل (لا يُعدّ إخفاقاً).') + '</p><p>لا ميكروفون: استمع أنت في وقفات «دَوْرُكَ!». الطويل يُمدّ قليلاً فقط.</p>');
      side.replaceChildren();
      buddy.set('cheer');
      await S.say('bq7_E05_end', { talk: true });
      I.finish(S, { pose: 'cheer' });
    })();
  }

  BQ.register(ID, { render });
})();
