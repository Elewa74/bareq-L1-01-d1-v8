/* E05 · اُنْطُقْ مَعي — IX1 · SCI-1 T2 redesign (2026-10-07) · draft_unapproved
   SPEC_v7 §E05 · S3 (القصير والطويل) + S4 (النطق: الترديد + حكم المعلّم).
   Sci team (review/sci1/SCI_comments_2026-10-07.txt, binding): «هدف انطق معي: تمييز الحركات القصيرة من الطويلة — لم يتحقّق… نُظهر الحرف
   بالحركة وننطق ثم الطويلة، صوتاً ومرئياً» · «بلاش جملة اسمع الفرق» · «حذف المس → حدّد، اختر» · «قصير أم طويل… التعبير غير مناسب».
   → DECISIONS_v7 (D-E05-S1, DRAFT): E05 SHOWS the letter with its vowel before E06 (sci overrides the sound-before-symbol rule for E05 only;
     no letter name, header stays neutral). Cards in Vazirmatn (owner font decision), full tashkeel incl. the madd vowel (مَا مِي مُو), no final sukun.
   ١ التعليم (لكلّ حركة a/i/u): بطاقة القصير «مَ» + شريط قصير ← S_ma + «هَذِهِ حَرَكَةٌ قَصيرَةٌ.» ← «قُل مَعي: مَ.» + دَوْرُكَ ·
     ثم بطاقة الطويل «مَا» (حرف المدّ ملوَّن) + شريط طويل ← S_maa + «وَهَذِهِ حَرَكَةٌ طَويلَةٌ.» (+ أوّل مرّة «اُنْظُر: الحَرْفُ المُلَوَّنُ يَمُدُّ الصَّوْتَ.»)
     ← «قُل مَعي: ما.» + دَوْرُكَ ← الزوج «مَ… ما» والبطاقتان تضيئان بالتتابع. صورة فم ماجد (m8) تبقى بجانب البطاقات: شكل الشفتين لكلّ حركة.
   ٢ المهامّ (٦ نجوم): «اِسْتَمِع، ثُمَّ اخْتَرِ البِطاقَةَ الَّتي سَمِعْتَها.» ×٤ (مو · مِ · ما · مُ؛ بطاقتان) ·
     «حَدِّدِ الحَرَكَةَ الطَّويلَةَ.» (مَ · مِي · مُ) · «حَدِّدِ الحَرَكَةَ القَصيرَةَ.» (مَا · مُو · مِ).
     سُلَّم المالك: ✓ أخضر + مديح متنوّع + الدليل المسموع · ✗١ علامة حمراء + جملة تحفيز + إعادة المثير · ✗٢ بارق يحلّ + «أَكْمِل وَرَكِّز».
     النجمة للإجابة الصحيحة فقط (لا نجمة حين يحلّ بارق). البطاقة المكتوبة لا تُسمِع صوتها قبل الحكم (DECISIONS ج).
   التسجيل: record('S3', صحيح من الأولى, item) · حكم المعلّم S4 (ضغط مطوّل ١٫٥ ث) باقٍ. حُذف: demo_lips · قفزة/انزلاق بارق · pairs_intro «اِسْمَعِ الفَرْقَ» ·
   q_len «قَصيرٌ أَم طَويلٌ؟» · تِمْساح · «ساعِد بارِقًا». ctx.review S3 → المهامّ وحدها · S4 → التعليم وحده. */
(function () {
  'use strict';
  const ID = 'E05';
  const lib = () => (BQ.ix1 ? Promise.resolve(BQ.ix1) : BQ.loadScript('js/el7/lib/ix1.js').then(() => BQ.ix1))
    .then((I) => (BQ.ix7b ? I : BQ.loadScript('js/el7/ix7b.js').then(() => I, () => I))); // FIX12 A-22: X.kas (shared kasra fix)

  /* one stylesheet for v8 (--u = stage unit) and the v7 fallback (--u fixed) */
  const CSS = `
.e05 { --u: .82px; justify-content: center; }
.e05-8, .e05 { --e05-madd: #E98300; }
.e05x { position: relative; display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*46); width: 100%; flex: 1 1 auto; min-height: 0; }
.e05x .e05-mouthw { flex: none; width: calc(var(--u)*270); transition: opacity .3s; }
.e05x .e05-mouthw .i8-seq { display: none; }
.e05x .e05-mouthw.is-off { display: none; }
.e05x .e05-cards { display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*34); }
.e05x .e05-ask { display: flex; flex-direction: column; align-items: center; gap: calc(var(--u)*30); }
/* the letter card: a big Vazirmatn syllable + a duration bar (short = a dot-long bar, long = a long bar) */
.e05-lc { --w: calc(var(--u)*230); position: relative; display: flex; flex-direction: column; align-items: center; justify-content: space-between; flex: none;
  width: var(--w); height: calc(var(--u)*290); padding: calc(var(--u)*14) calc(var(--u)*16) calc(var(--u)*22); border-radius: calc(var(--u)*34);
  background: linear-gradient(#FFFDF6, #FFF2D2); border: calc(var(--u)*3.5) solid var(--bq8-navy, #0B2D4F);
  box-shadow: inset 0 calc(var(--u)*-7) 0 rgba(214,143,0,.22), 0 0 0 calc(var(--u)*5) #fff, 0 calc(var(--u)*12) calc(var(--u)*24) calc(var(--u)*-8) rgba(11,45,79,.4);
  color: var(--bq8-navy, #0B2D4F); cursor: pointer; font: inherit; transition: transform .2s, box-shadow .25s, opacity .3s, filter .3s; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.e05-lc.is-long { --w: calc(var(--u)*300); }
.e05-lc.is-static { cursor: default; }
.e05-lc .e05-gw { position: relative; width: 100%; flex: 1 1 auto; min-height: 0; display: grid; place-items: center; overflow: hidden; }
.e05-lc .e05-g { display: block; font: 700 calc(var(--u)*170)/1.25 var(--font-letter, 'Vazirmatn', sans-serif); white-space: nowrap; direction: rtl; }
.e05-lc .e05-madd { color: var(--e05-madd); }
.e05-lc .e05-bar { position: relative; flex: none; width: 34%; height: calc(var(--u)*24); border-radius: 999px; background: #fff; box-shadow: inset 0 calc(var(--u)*2) calc(var(--u)*5) rgba(11,45,79,.15), 0 0 0 calc(var(--u)*3) rgba(11,45,79,.12); }
.e05-lc.is-long .e05-bar { width: 84%; }
.e05-lc .e05-bar i { position: absolute; inset-block: calc(var(--u)*5); inset-inline-start: calc(var(--u)*5); width: calc(100% - var(--u)*10); border-radius: 999px; background: linear-gradient(90deg, #FFE38A, #FFC21A); transform-origin: right center; transform: scaleX(1); }
.e05-lc.is-long .e05-bar i { background: linear-gradient(90deg, #FFD08A, var(--e05-madd)); }
.e05-lc .e05-bar.is-run i { animation: e05Fill var(--ms, 400ms) linear both; }
@keyframes e05Fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.e05-lc.is-in { animation: e05In .4s cubic-bezier(.3,1.4,.5,1) both; }
@keyframes e05In { from { transform: scale(.86); opacity: .4; } to { transform: none; opacity: 1; } } /* never an empty board: the card is visible from its first frame */
.e05-lc.is-play { transform: translateY(calc(var(--u)*-6)); box-shadow: inset 0 calc(var(--u)*-7) 0 rgba(214,143,0,.22), 0 0 0 calc(var(--u)*5) #fff, 0 0 0 calc(var(--u)*12) var(--bq8-listen, #FF9F1C), 0 calc(var(--u)*12) calc(var(--u)*24) calc(var(--u)*-8) rgba(11,45,79,.4); }
.e05-lc.is-ok { box-shadow: inset 0 calc(var(--u)*-7) 0 rgba(34,194,122,.25), 0 0 0 calc(var(--u)*5) #fff, 0 0 0 calc(var(--u)*12) var(--bq8-ok, #22C27A), 0 calc(var(--u)*12) calc(var(--u)*24) calc(var(--u)*-8) rgba(11,45,79,.4); background: linear-gradient(#F4FFF9, #D8F7E8); }
.e05-lc.is-dim { opacity: .4; filter: grayscale(.5); pointer-events: none; }
.e05-lc.is-hint .e05-madd { animation: e05Glow .7s ease-in-out 3; }
@keyframes e05Glow { 50% { color: #FF5F00; text-shadow: 0 0 calc(var(--u)*18) rgba(255,160,0,.9); } }
/* FIX12 A-20: while the child is answering, the card shows the plain syllable only — no duration bar, no orange madd letter
   (they give the answer away). They appear after the answer as feedback (or when Bariq solves). */
.e05-lc.is-task .e05-bar { visibility: hidden; }
.e05-lc.is-task .e05-madd { color: inherit; }
/* …and every task card has the SAME width (a wider «long» card would show the answer too) */
.e05x .e05-lc.is-eq, .e05x .e05-lc.is-eq.is-long { --w: calc(var(--u)*270); }
.bq8-stage.is-tall .e05x .e05-lc.is-eq, .bq8-stage.is-tall .e05x .e05-lc.is-eq.is-long { --w: calc(var(--u)*300); }
.bq8-stage.is-tall .e05x .e05-cards.is-3 .e05-lc.is-eq, .bq8-stage.is-tall .e05x .e05-cards.is-3 .e05-lc.is-eq.is-long { --w: calc(var(--u)*260); }
.e05-lc:not(.is-static):active { transform: translateY(calc(var(--u)*4)); }
.e05x .e05-ear { width: max(var(--i8-t, 76px), calc(var(--u)*110)); height: max(var(--i8-t, 76px), calc(var(--u)*110)); min-width: 0; min-height: 0; font-size: calc(max(var(--i8-t, 76px), calc(var(--u)*110)) * .62); }
.e05x .e05-ear.is-play { animation: bq8-wiggle .6s ease infinite; }
.e05x .e05-turn { position: absolute; z-index: 5; top: calc(var(--u)*-6); left: 50%; transform: translateX(-50%); width: calc(var(--u)*104); height: calc(var(--u)*104); font-size: calc(var(--u)*72); cursor: default; pointer-events: none; }
.e05x .e05-turn .bq8-ic { animation: e05Talk8 .9s ease-in-out infinite; }
.e05x .e05-turn svg.ring { position: absolute; inset: -14%; width: 128%; height: 128%; transform: rotate(-90deg); }
.e05x .e05-turn svg.ring circle { fill: none; stroke: var(--bq8-mouth, #FF5A4E); stroke-width: 5; stroke-linecap: round; }
@keyframes e05Talk8 { 50% { transform: scale(1.12); } }
.bq8-stage.is-tall .e05x { flex-direction: column; gap: calc(var(--u)*40); }
.bq8-stage.is-tall .e05x .e05-mouthw { width: calc(var(--u)*300); }
.bq8-stage.is-tall .e05-lc { --w: calc(var(--u)*270); height: calc(var(--u)*330); }
.bq8-stage.is-tall .e05-lc.is-long { --w: calc(var(--u)*340); }
.bq8-stage.is-tall .e05x .e05-cards.is-3 { gap: calc(var(--u)*24); }
.bq8-stage.is-tall .e05x .e05-cards.is-3 .e05-lc { --w: calc(var(--u)*240); }
.bq8-stage.is-tall .e05x .e05-cards.is-3 .e05-lc.is-long { --w: calc(var(--u)*300); }
@media (prefers-reduced-motion: reduce) { .e05-lc, .e05-lc.is-in, .e05-lc .e05-bar.is-run i, .e05x .e05-turn .bq8-ic { animation: none !important; transition: none !important; } }`;

  /* syllable → [the letter with its vowel, the madd letter] (full tashkeel, the madd letter carries no mark) */
  const GL = { ma: ['مَ', ''], mi: ['مِ', ''], mu: ['مُ', ''], maa: ['مَ', 'ا'], mii: ['مِ', 'ي'], muu: ['مُ', 'و'] };
  const SAYW = { ma: 'مَ', mi: 'مِ', mu: 'مُ', maa: 'مَا', mii: 'مِي', muu: 'مُو' };
  const ZWJ = '‍';

  function render(stage, ctx) {
    lib().then((I) => { if (ctx.alive()) run(I, stage, ctx); })
      .catch((e) => { console.warn('E05 lib', e); if (ctx.placeholder) ctx.placeholder(); });
  }

  function run(I, stage, ctx) {
    const h = BQ.h;
    if (!document.getElementById('st-e05s1')) document.head.append(h('style', { id: 'st-e05s1' }, CSS));
    const S = I.session(ctx, { noText: true });
    const V8 = I.v8();
    I.lines({
      bq7_E05_s1_intro: 'اُنْظُر إِلى الحَرْفِ، وَاسْتَمِع، ثُمَّ قُل مَعي.',
      bq7_E05_s1_short: 'هَذِهِ حَرَكَةٌ قَصيرَةٌ.', bq7_E05_s1_long: 'وَهَذِهِ حَرَكَةٌ طَويلَةٌ.',
      bq7_E05_s1_look: 'اُنْظُر: الحَرْفُ المُلَوَّنُ يَمُدُّ الصَّوْتَ.',
      bq7_E05_s1_q: 'اِسْتَمِع، ثُمَّ اخْتَرِ البِطاقَةَ الَّتي سَمِعْتَها.',
      bq7_E05_s1_find_long: 'حَدِّدِ الحَرَكَةَ الطَّويلَةَ.', bq7_E05_s1_find_short: 'حَدِّدِ الحَرَكَةَ القَصيرَةَ.',
      bq7_E05_s1_end: 'أَحْسَنْتَ. عَرَفْتَ الحَرَكاتِ القَصيرَةَ وَالطَّويلَةَ.',
      bq7_E05_say_ma: 'قُل مَعِي: مَ.', bq7_E05_say_mi: 'قُل مَعِي: مِ.', bq7_E05_say_mu: 'قُل مَعِي: مُ.',
      bq7_E05_say_maa: 'قُل مَعِي: مَا.', bq7_E05_say_mii: 'قُل مَعِي: مِي.', bq7_E05_say_muu: 'قُل مَعِي: مُو.', // FIX13 R13-B-04 (DRAFT)
    });
    const PAIRS = [{ v: 'a', s: 'ma', l: 'maa' }, { v: 'i', s: 'mi', l: 'mii' }, { v: 'u', s: 'mu', l: 'muu' }];
    const TASKS = [
      { t: 'A', s: 'muu', opts: ['mu', 'muu'], v: 'u' },
      { t: 'A', s: 'mi', opts: ['mi', 'mii'], v: 'i' },
      { t: 'A', s: 'maa', opts: ['ma', 'maa'], v: 'a' },
      { t: 'A', s: 'mu', opts: ['mu', 'muu'], v: 'u' },
      { t: 'B', find: 'long', s: 'mii', opts: ['ma', 'mii', 'mu'] },
      { t: 'B', find: 'short', s: 'mi', opts: ['maa', 'muu', 'mi'] },
    ];
    const sid = (s) => 'bq7_S_' + s;
    const isLong = (s) => s.length > 2;
    const SOLVE = 'bq7_E11_fb_solve1'; // «هَذا هُوَ الصَّحيحُ. أَكْمِل وَرَكِّز» (owner/sci ✗2 line)

    const f8 = V8 ? I.frame8(S, 'e05-8', { pose: 'wave' }) : null;
    const root = V8 ? f8.panel : I.root(stage, 'e05');
    const top = h('div.i7-row');
    const steps = I.stars(top, 4);
    const mouthW = h('div.e05-mouthw');
    const mouth = V8 ? I.mouth8(S) : I.mouth(S); mouthW.append(mouth.el);
    const board = h('div.e05-cards');
    const area = h('div.e05x', null, mouthW, board);
    if (V8) root.append(area); else root.append(top, area);
    const buddy = I.buddy(S, root, 'wave');
    let busy = true, judged = false, own = 0; // own: items the child answered himself (FIX12 A-11)

    I.teacherPanel(S, {
      title: 'نطق الطفل (S4) — حكم المعلّم',
      opts: [{ id: 'm', label: 'أتقن' }, { id: 'n', label: 'قريب', ghost: true }, { id: 'x', label: 'ليس بعد', ghost: true }],
      onPick(id) { judged = id; try { if (BQ.mastery && BQ.mastery.judge) BQ.mastery.judge('S4', { m: 'mastered', n: 'near', x: 'notyet' }[id]); else I.record(S, 'S4', id === 'm', { by: 'teacher', judge: id }); } catch (e) { /* */ } },
    });

    /** a letter card «مَ» / «مَا» (madd letter coloured, joined with ZWJ so the colour never breaks the joining) */
    function card(s, opt) {
      opt = opt || {};
      const [base, madd] = GL[s];
      const g = h('span.e05-g', { lang: 'ar' });
      if (madd) g.append(base + ZWJ, h('span.e05-madd', null, ZWJ + madd)); else g.append(base);
      if (BQ.ix7b && BQ.ix7b.kas) BQ.ix7b.kas(g); // FIX12 A-22: the kasra of a lone «مِ» under the head, not far under the tail (same fix as E06)
      const gw = h('span.e05-gw', { 'aria-hidden': 'true' }, g);
      const bar = h('span.e05-bar', { 'aria-hidden': 'true' }, h('i'));
      const b = h((opt.static ? 'div' : 'button') + '.e05-lc' + (madd ? '.is-long' : '') + (opt.static ? '.is-static' : ''),
        opt.static ? { 'aria-hidden': 'true', dataset: { k: s } } : { type: 'button', 'aria-label': 'بِطاقَةُ ' + SAYW[s], dataset: { k: s } }, gw, bar);
      b.s = s;
      b.run = (ms) => { bar.style.setProperty('--ms', (ms || (madd ? 1000 : 420)) + 'ms'); bar.classList.remove('is-run'); void bar.offsetWidth; bar.classList.add('is-run'); };
      // the glyph shows only once it has been fitted (ink incl. marks inside the card from the first painted frame)
      g.style.visibility = 'hidden';
      requestAnimationFrame(() => { I.fitGlyph(gw, g, madd ? 0.14 : 0.1); const show = () => requestAnimationFrame(() => requestAnimationFrame(() => { g.style.visibility = ''; }));
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(show); else show(); }); // the madd ي / و reach lower: a little more room
      return b;
    }
    /** play a syllable on a card (mouth shape + bar + «playing» ring) */
    async function sylOn(c, s, v) {
      c.classList.add('is-play'); c.run();
      try { if (v && mouth.say && !mouthW.classList.contains('is-off')) await mouth.say(sid(s), v); else await S.stim(sid(s)); } finally { c.classList.remove('is-play'); }
    }
    const turn = async (ms) => {
      await S.say('bq7_G_your_turn');
      const box = V8 ? h('span.bq8-btn.bq8-btn--mouth.e05-turn', { 'aria-hidden': 'true' }, I.i8('mouth')) : h('span.e05-turn', { 'aria-hidden': 'true', html: I.IC.mouth });
      box.insertAdjacentHTML('beforeend', '<svg class="ring" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36"/></svg>');
      area.append(box); buddy.el.classList.add('is-listen');
      const c = box.querySelector('circle'), len = 2 * Math.PI * 36;
      c.style.strokeDasharray = len; c.style.strokeDashoffset = 0; void c.getBoundingClientRect();
      c.style.transition = 'stroke-dashoffset ' + (ms / 1000) + 's linear'; c.style.strokeDashoffset = len;
      await S.wait(ms + 50);
      box.remove(); buddy.el.classList.remove('is-listen');
    };
    const sayWith = async (id, v) => { if (mouth.sayLine) await mouth.sayLine(id, v, 0.55); else await S.say(id); };

    /* ===== ١ التعليم: القصير ثم الطويل لكلّ حركة ===== */
    async function teach(p, k) {
      steps.cur(k);
      mouthW.classList.remove('is-off');
      board.className = 'e05-cards';
      const cs = card(p.s, { static: true }), cl = card(p.l, { static: true });
      cl.style.visibility = 'hidden';
      board.replaceChildren(cs, cl);
      cs.classList.add('is-in'); I.sfx('pop');
      await S.sleep(350);
      await sylOn(cs, p.s, p.v);
      await S.say('bq7_E05_s1_short');
      await sayWith('bq7_E05_say_' + p.s, p.v);
      await turn(1800);
      cl.style.visibility = ''; cl.classList.add('is-in'); I.sfx('pop');
      await S.sleep(350);
      await sylOn(cl, p.l, p.v);
      await S.say('bq7_E05_s1_long');
      if (k === 0) { cl.classList.add('is-hint'); await S.say('bq7_E05_s1_look'); cl.classList.remove('is-hint'); }
      await sayWith('bq7_E05_say_' + p.l, p.v);
      await turn(2000);
      // the pair «مَ… ما»: the two cards light in turn with the sound (S_pair_* = short +0.6 s long)
      const pp = S.stim('bq7_S_pair_' + p.v);
      cs.classList.add('is-play'); cs.run();
      await S.wait(Math.round(I.reduced() ? 300 : 900));
      cs.classList.remove('is-play'); cl.classList.add('is-play'); cl.run();
      await pp; await S.sleep(400); cl.classList.remove('is-play');
      steps.on(k);
      await S.sleep(300);
    }

    /* ===== ٢ المهامّ: اِسْتَمِع… اِخْتَر · حَدِّد ===== */
    async function tasks() {
      steps.cur(3);
      mouthW.classList.add('is-off');
      if (V8) f8.stars(TASKS.length);
      const log = [];
      for (let n = 0; n < TASKS.length; n++) {
        const T = TASKS[n];
        const opts = BQ.shuffle(T.opts).map((s) => { const c = card(s); c.classList.add('is-task', 'is-eq'); return c; });
        const reveal = () => opts.forEach((c) => c.classList.remove('is-task')); // FIX12 A-20: bars + madd colour only after the answer
        const right = () => opts.find((c) => c.s === T.s);
        if (window.BQ_QA) opts.forEach((c) => { c.dataset.qa = c.s === T.s ? 'r' : 'w'; }); // automated QA only
        const row = h('div.e05-cards' + (opts.length > 2 ? '.is-3' : ''), { role: 'group', 'aria-label': 'بِطاقاتٌ' }, opts);
        opts.forEach((c, i) => { c.classList.add('is-in'); c.style.animationDelay = (i * 0.08) + 's'; });
        let ear = null;
        if (T.t === 'A') {
          ear = V8 ? h('button.bq8-btn.bq8-btn--ear.e05-ear', { type: 'button', 'aria-label': 'اِسْتَمِع مَرَّةً أُخْرى' }, I.i8('ear'))
            : h('button.i7-snd.i7-c1.e05-ear', { type: 'button', 'aria-label': 'اِسْتَمِع مَرَّةً أُخْرى', html: I.IC.ear });
          board.className = 'e05-ask'; board.replaceChildren(ear, row);
        } else { board.className = 'e05-ask'; board.replaceChildren(row); }
        const stim = async () => { if (ear) ear.classList.add('is-play'); try { await S.stim(sid(T.s)); } finally { if (ear) ear.classList.remove('is-play'); } };
        const lineId = T.t === 'A' ? 'bq7_E05_s1_q' : T.find === 'long' ? 'bq7_E05_s1_find_long' : 'bq7_E05_s1_find_short';
        const ask = async () => { await S.say(lineId); if (T.t === 'A') { await S.sleep(250); await stim(); } };
        I.instr(S, lineId, T.t === 'A' ? 'ear' : 'hand', async () => { if (busy) return; busy = true; await ask(); busy = false; });
        if (ear) {
          ear.addEventListener('click', async () => { if (busy) return; busy = true; await stim(); busy = false; });
          I.hoverReplay(ear, async () => { busy = true; await stim(); busy = false; }, () => !busy);
        }
        let first = null;
        const pol = I.policy(S, {
          opts: T.t === 'A' ? [] : opts, right, // FIX12 A-21: no forced-choice shortcut for the 2-card tasks · FB-1: ✗2 line from the shared pool (BQ.fb.solveL — all end in an encouraging «أَكْمِلْ…/نُكْمِلُ…»)
          // FIX12 A-21: two-card tasks — ✗1 is a real retry (the red mark shows during the retry line, then both cards are live again)
          async hint1(picked) {
            if (T.t === 'A') {
              if (picked) { picked.classList.remove('is-no'); picked.querySelectorAll(':scope > .i7-nob, :scope > .fb-badge').forEach((x) => x.remove()); }
              await S.sleep(200); await stim();
            } else { await S.sleep(200); await S.say(lineId); } // FIX12 A-20: no glowing madd letter (it would show the answer) — the instruction again
          },
          async model() { reveal(); const r = right(); if (I.justHeard(sid(r.s))) { r.classList.add('is-play'); r.run(); await S.sleep(650); r.classList.remove('is-play'); } else await sylOn(r, r.s); }, // FIX13 R13-A-04: the hint sound is not repeated back-to-back
        });
        await new Promise((resolve) => {
          opts.forEach((c) => c.addEventListener('click', async () => {
            if (busy || I.isNo(c) || c.classList.contains('is-ok')) return;
            busy = true;
            if (c === right()) {
              if (first == null) { first = true; I.record(S, 'S3', true, { item: T.t + ':' + T.s }); log.push([T, true]); }
              own++; reveal(); c.classList.add('is-ok'); I.sfx('ok'); I.burst(root, c, 14); buddy.cheer();
              opts.forEach((x) => { if (x !== c && !I.isNo(x)) x.classList.add('is-dim'); });
              if (V8) { await I.flyTo(root, c.querySelector('.e05-gw') || c, f8.starAt() || f8.starsEl, 600); f8.star(); }
              await S.say(I.yes(), { talk: true });
              await sylOn(c, c.s); // the evidence: the chosen card is heard now (never before the choice)
              await S.sleep(450);
              return resolve();
            }
            if (first == null) { first = false; I.record(S, 'S3', false, { item: T.t + ':' + T.s, picked: c.s }); log.push([T, false]); }
            const st = await pol.wrong(c);
            if (st === 'model') {
              if (T.t === 'A') opts.forEach((x) => { if (x !== right()) { x.classList.add('is-dim'); } });
              // Bariq solved: this item's star stays empty (owner: stars only for the child's own right answers)
              if (V8) f8.help(); // FB-1 star rule: Bariq solved → «helped» slot, no gold
              await S.sleep(400); return resolve();
            }
            busy = false;
          }));
          (async () => { busy = true; await S.sleep(450); await ask(); busy = false; })();
        });
        busy = true;
      }
      steps.on(3);
      return log;
    }

    I.instr(S, 'bq7_E05_s1_intro', 'mouth', async () => { if (busy) return; busy = true; await S.say('bq7_E05_s1_intro'); busy = false; });

    (async () => {
      await S.sleep(400);
      const rv = ctx.review ? (ctx.step === 'long' ? 'S3' : ctx.review.skill) : (ctx.step === 'long' ? 'S3' : null);
      let log = [];
      if (rv !== 'S3') {
        board.replaceChildren(card('ma', { static: true }));
        board.firstChild.classList.add('is-in');
        await S.say('bq7_E05_s1_intro');
        for (let k = 0; k < PAIRS.length; k++) await teach(PAIRS[k], k);
      } else { [0, 1, 2].forEach((k) => steps.on(k)); }
      if (rv !== 'S4') log = await tasks(); else steps.on(3);
      const ok = log.filter((x) => x[1]).length;
      I.note(S, '<p><b>نتيجة «انطق معي» (S3 — القصير والطويل):</b> ' + I.AR(ok) + ' من ' + I.AR(log.length) + ' من المحاولة الأولى (النجاح: ٥ من ٦).</p>' +
        (log.length ? '<ul>' + log.map(([T, y]) => '<li>' + (T.t === 'A' ? 'سمع «' + SAYW[T.s] + '» واختار' : 'حدّد ' + (T.find === 'long' ? 'الطويلة' : 'القصيرة') + ' «' + SAYW[T.s] + '»') + ' — ' + (y ? 'من الأولى' : 'بعد محاولة/بمساعدة بارق') + '</li>').join('') + '</ul>' : '') +
        '<p><b>النطق (S4):</b> استمع إلى الطفل في وقفات «دَوْرُكَ»، ثم اضغط مطوّلاً ١٫٥ ث على بارق ← «أتقن · قريب · ليس بعد». ' + (judged ? 'سُجِّل حكمك.' : 'بلا حكم = لا تسجيل (لا يُعدّ إخفاقاً).') + '</p>' +
        '<p>الحركة القصيرة تُنطق سريعة (مَ مِ مُ)، والطويلة تُمدّ بقدر حركتين (مَا مِي مُو). الحرف الملوّن (ا ي و) هو الذي يمدّ الصوت.</p>');
      board.replaceChildren();
      buddy.set('cheer');
      // FIX12 A-11: praise («أَحْسَنْتَ…») only when the child answered himself; if Bariq solved everything → no praise line, neutral end title
      if (own > 0 || !log.length) { await S.say('bq7_E05_s1_end', { talk: true }); I.finish(S, { pose: 'cheer' }); }
      else I.finish(S, { pose: 'cheer', title: 'هَيَّا نُكْمِل.' });
    })();
  }

  BQ.register(ID, { render });
})();
