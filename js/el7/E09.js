/* E09 · اُكْتُبْ — IX2 · v7 · draft_unapproved
   الناتج ٥ · المهارة S8 «كتابة الحرف». ماذا يستطيع الطفل بعده: يكتب الميم بإصبعه بالشكل المناسب لموقعها (م · مـ · ـمـ · ـم) من نقطة البدء وفي الاتّجاه الصحيح.
   التدرّج (مراجعة فريق المادة): ١ تتبّع «م» (نموذج القلم أوّلاً) ← ٢ نسخ «م ← م» ← ٣ إنتاج موجّه: ـوْزْ · قَـ ـرْ · فَـ (المسار منقّط)
   ← ٤ إنتاج مستقلّ: الميم في مَوْزْ · قَمَرْ · فَمْ (بلا مسار؛ الطفل يختار الشكل).
   التغذية (قرار ز/ح): نجاح «✔ الشَّكْلُ صَحيحٌ.» · محاولة ١ «جَرِّبْ مَرَّةً أُخْرى. اِبْدَأْ مِنْ هُنا.» + نقطة البدء تنبض ·
   محاولة ٢: المسار المنقّط أوضح + نقطة تجري عليه · محاولة ٣: بارق يرسم الحرف ببطء ثم نمضي. لا «خطأ».
   يُسجَّل S8 (قرينة) لبنود الموجّه والمستقلّ الستّة: ok = نجح من الأولى أو الثانية بلا مساعدة.
   محرّك اللمس: X.writePad (ix7b.js) — امتداد لمحرّك v6 المعتمد على الآيباد (أحداث المؤشّر · touch-action:none · سماحية · نقطة بدء + أسهم).
   v8 (?theme=8 · OWNER_R3-9 «الفونت وشكل الميم هذا غير مناسب»): كلّ نموذج وكلّ مسار تتبّع بخطّ Vazirmatn Bold — المسارات مُشتقّة من
   خطوط الحرف نفسه (X.FORMS8 · v7/ix2_v8/meem_paths.py)، والممرّ = شكل الحرف الحقيقيّ، وبقيّة الكلمة بالخطّ والحجم نفسيهما فتلتحم.
   اللوح الخشبيّ (.bq8-board) · ٤ نجوم = المراحل الأربع. */
(function () {
  'use strict';
  const ID = 'E09';
  /* الأسطر (LINES_v7.json) */
  const L = {
    intro: 'bq7_E09_intro', watch: 'bq7_E09_watch', trace: 'bq7_E09_trace', copy: 'bq7_E09_copy', guided: 'bq7_E09_guided', indep: 'bq7_E09_indep',
    ok: 'bq7_E09_ok', retry: 'bq7_E09_retry', light: 'bq7_G_look_light', end: 'bq7_E09_end',
  };
  /* البنود (SPEC §E09) — form: شكل الميم · before/after: بقيّة الكلمة حول الخانة (قبل = يمين) · word: الكلمة بعد النجاح · wk: صوت الكلمة */
  const STAGES = [
    { key: 'trace', label: 'تَتَبَّع', line: L.trace, items: [
      { form: 'iso', guide: 'road', arrows: true, start: true, lenient: true, demo: true, scored: false },
      { form: 'iso', guide: 'road', arrows: true, start: true, lenient: true, scored: false },
    ] },
    { key: 'copy', label: 'اُنْسَخ', line: L.copy, items: [{ form: 'iso', guide: 'none', arrows: false, start: true, model: true, scored: false }] },
    { key: 'guided', label: 'أَكْمِل', line: L.guided, items: [
      { form: 'ini', after: 'ـوْز', word: 'مَوْز', img: 'card_mawz', wk: 'mawz', guide: 'dots', arrows: 'faint', start: true, scored: true },
      { form: 'med', before: 'قَـ', after: 'ـر', word: 'قَمَر', img: 'card_qamar', wk: 'qamar', guide: 'dots', arrows: 'faint', start: true, scored: true },
      { form: 'fin', before: 'فَـ', word: 'فَم', img: 'card_fam', wk: 'fam', guide: 'dots', arrows: 'faint', start: true, scored: true },
    ] },
    { key: 'indep', label: 'اُكْتُب', line: L.indep, items: [
      { form: 'ini', after: 'ـوْز', word: 'مَوْز', img: 'card_mawz', wk: 'mawz', guide: 'none', arrows: false, start: false, scored: true, sayFirst: true },
      { form: 'med', before: 'قَـ', after: 'ـر', word: 'قَمَر', img: 'card_qamar', wk: 'qamar', guide: 'none', arrows: false, start: false, scored: true, sayFirst: true },
      { form: 'fin', before: 'فَـ', word: 'فَم', img: 'card_fam', wk: 'fam', guide: 'none', arrows: false, start: false, scored: true, sayFirst: true },
    ] },
  ];

  const CSS = `
.e09 { justify-content: flex-start; padding-top: 2px; }
.e09-top { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
.e09-main { flex: 1 1 auto; min-height: 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: clamp(10px, 3cqi, 30px); }
.e09-side { flex: none; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.e09-model { width: clamp(84px, 17cqi, 150px); aspect-ratio: 1; border-radius: 22px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 5px 0 #E2C98A; display: grid; place-items: center; }
.e09-model .x7-w { font-size: clamp(56px, 12cqi, 110px); line-height: 1; color: var(--coral); padding-bottom: 12%; }
.e09-picbox { width: clamp(90px, 18cqi, 170px); aspect-ratio: 1; border-radius: 22px; overflow: hidden; border: 4px solid #fff; box-shadow: 0 6px 0 var(--sky-line), 0 10px 20px var(--shade); }
.e09-padwrap { flex: 1 1 0; min-width: 0; max-width: 100%; display: flex; align-items: center; justify-content: center; }
.e09-main:has(.e09-side[hidden]) .e09-padwrap { flex-basis: 100%; }
.e09 .x7-wp { --wp-h: var(--e09-h, 320px); width: min(100%, calc(var(--e09-h, 320px) * var(--wp-ar, 1))); flex: none; }
.e09-bottom { flex: none; min-height: 52px; display: flex; align-items: center; justify-content: center; }
.e09.is-short .x7-phase, .e09.is-short .x7-buddy { display: none; }
.e09.is-short .e09-top { position: absolute; top: 2px; inset-inline-end: 168px; z-index: 2; }
.e09.is-short .e09-main { padding-top: 34px; }
.e09.is-short .e09-bottom { position: absolute; bottom: 0; inset-inline: 0; z-index: 3; min-height: 0; pointer-events: none; }
.e09.is-short { padding-top: 0; }
/* ---------- v8 ---------- */
.x7p.e09 { justify-content: center; gap: calc(var(--u)*14); padding: calc(var(--u)*10) calc(var(--u)*20); }
.x7p.e09 .e09-main { gap: calc(var(--u)*34); }
.x7p.e09 .e09-side { gap: calc(var(--u)*16); }
.x7p.e09 .e09-model8.bq8-tile { --w: calc(var(--u)*170); --fs: .62; color: var(--bq8-meem); cursor: default; }
.x7p.e09 .e09-pic8 { width: calc(var(--u)*176); cursor: default; }
.x7p.e09 .e09-pic8:hover { transform: none; }
.x7p.e09 .x7-wp { --wp-h: var(--e09-h); width: min(100%, calc(var(--e09-h) * var(--wp-ar, 1))); }
.x7p.e09 { --e09-h: calc(var(--u)*430); }
.x7p.e09 .e09-bottom { position: absolute; z-index: 4; bottom: calc(var(--u)*-34); inset-inline: 0; min-height: 0; pointer-events: none; }
.x7p.e09.is-tall { --e09-h: calc(var(--u)*600); }
.x7p.e09.is-tall .e09-main { flex-direction: column; }
.x7p.e09.is-tall .e09-side { flex-direction: row; }
.x7p.e09.is-tall .e09-padwrap { align-self: stretch; flex: 0 0 auto; width: 100%; }
.x7p.e09.is-tall .e09-main { justify-content: center; }
@container stage (max-width: 620px) { .e09-main { flex-direction: column; gap: 8px; } .e09-side { flex-direction: row; } .e09-model, .e09-picbox { width: 78px; } .e09-model .x7-w { font-size: 54px; } }
`;

  function run(stage, ctx) {
    const X = BQ.ix7b, h = BQ.h;
    X.style('st-e09', CSS);
    const S = X.session(ctx);
    const V8 = X.v8();
    const root = X.root(ctx, 'e09', { board: true, stars: 4, panel: ['wide', 'tall'] });
    const F8 = root._8;
    const top = h('div.e09-top');
    const ph = X.phase(top, STAGES.map((s) => s.label));
    const nItems = STAGES.reduce((a, s) => a + s.items.length, 0);
    const dots = X.dots(top, nItems);
    const main = h('div.e09-main');
    const side = h('div.e09-side');
    const padWrap = h('div.e09-padwrap');
    main.append(side, padWrap);
    const bottom = h('div.e09-bottom');
    root.append(top, main, bottom);
    const fb = X.fbBox(bottom);
    const buddy = X.buddy(root);
    const log = [];

    // ارتفاع اللوحة المتاح
    const fit = () => {
      if (V8) return;
      const H = stage.clientHeight || 500;
      const narrow = stage.clientWidth < 620;
      const short = H < 400;
      root.classList.toggle('is-short', short);
      root.style.setProperty('--e09-h', Math.max(120, H - (short ? 98 : narrow ? 240 : 156)) + 'px');
    };
    fit();
    if (window.ResizeObserver) { const ro = new ResizeObserver(fit); ro.observe(stage); ctx.onCleanup(() => ro.disconnect()); }

    // وضع المراجعة: من ctx.review/ctx.step (S8 ← E09) نبدأ من النسخ مباشرة
    let startStage = 0;
    if (ctx.step) { const i = STAGES.findIndex((s) => s.key === ctx.step); if (i >= 0) startStage = i; }
    else if (ctx.review) startStage = 2;

    note();
    let k = STAGES.slice(0, startStage).reduce((a, s) => a + s.items.length, 0);
    (async () => {
      if (F8) F8.starsTo(startStage);
      for (let si = startStage; si < STAGES.length; si++) {
        const st = STAGES[si];
        ph.set(si);
        for (let ii = 0; ii < st.items.length; ii++) {
          dots.set(k);
          await item(st, st.items[ii], ii === 0);
          k++;
        }
        if (F8) F8.star(); // one star per stage: trace · copy · guided · independent
      }
      dots.set(nItems);
      ctx.done();
      buddy.mood('cheer', 4000);
      await S.say(L.end);
      X.end(ctx, S, { title: 'أَحْسَنْتَ!' });
    })();

    async function item(st, it, firstOfStage) {
      fb.clear();
      side.replaceChildren(); padWrap.replaceChildren();
      if (it.model) side.append(V8 ? h('div.e09-model8.bq8-tile.bq8-tile--letter.x7-in', { 'aria-hidden': 'true' }, h('span', null, 'م')) : h('div.e09-model.x7-in', { 'aria-hidden': 'true' }, h('span.x7-w', null, 'م')));
      if (it.img) side.append(V8 ? h('div.bq8-card.e09-pic8.x7-in', null, h('img', { src: ctx.img(it.img), alt: '', draggable: 'false' })) : h('div.e09-picbox.x7-in', null, X.pic(ctx, it.img, { noText: st.key === 'indep' })));
      side.hidden = !side.childNodes.length;
      let stage2 = false, failsHandled = 0, assisted = false;
      const pad = X.writePad(padWrap, {
        form: it.form, guide: it.guide, arrows: it.arrows, start: it.start, lenient: !!it.lenient,
        ctxBefore: it.before, ctxAfter: it.after, ink: it.guide === 'none' ? 'free' : 'path',
        onFail: (reason, n) => onFail(reason, n),
      });
      pad.el.classList.add('x7-in');
      ctx.instruction(X.text(st.line), st.line, { icon: V8 ? 'pencil' : 'hand' });
      // التعليمة: النموذج أوّلاً في أوّل بند من التتبّع
      if (it.demo) {
        pad.lock(true);
        await X.nameSound(S, L.intro);
        await S.say(L.watch);
        await pad.demo(2600);
        pad.lock(false);
      }
      if (firstOfStage || it.demo) await S.say(st.line);
      if (it.wk && (it.sayFirst || firstOfStage || st.key === 'guided')) await S.say(X.wordId(it.wk));
      async function onFail(reason, n) {
        if (n <= failsHandled) return;
        failsHandled = n;
        if (n === 1) { pad.showStart(); fb.tryAgain(X.text(L.retry)); buddy.mood('think', 1600); S.say(L.retry); }
        else if (n === 2) {
          fb.tryAgain(X.text(L.retry));
          pad.setGuide('bold'); pad.setArrows(true); pad.showStart(); pad.runner(true); stage2 = true;
          buddy.mood('point', 2000);
          S.say(L.light);
        } else if (n >= 3 && !assisted) {
          assisted = true;
          pad.runner(false); pad.lock(true); fb.clear();
          buddy.mood('talk', 3000);
          await S.say(L.watch);
          await pad.demo(3600, true);
          pad.fill();
        }
      }
      const res = await S.gate(pad.done);
      pad.runner(false);
      const ok = !res.assisted && res.fails <= 1;
      log.push({ stage: st.key, form: it.form, word: it.word || 'م', fails: res.fails, assisted: !!res.assisted, ok });
      if (it.scored) X.record(ctx, 'S8', ok, { form: it.form, fails: res.fails, assisted: !!res.assisted, stage: st.key });
      note();
      if (!res.assisted) { fb.ok('✔ ' + 'الشَّكْلُ صَحيحٌ.'); X.burst(pad.el, 12); buddy.mood('cheer', 2200); S.fx(X.sfx.ok, 0.5); }
      else fb.clear();
      if (it.word) { await S.sleep(350); pad.typeset(it.word); }
      if (!res.assisted) await S.say(L.ok);
      if (it.wk) await S.say(X.wordId(it.wk), { stim: true });
      await S.sleep(it.word ? 900 : 500);
      void stage2;
    }

    function note() {
      const esc = X.esc;
      const rows = log.map((r) => '<tr><td>' + esc(r.word) + '</td><td>' + esc({ trace: 'تتبّع', copy: 'نسخ', guided: 'موجّه', indep: 'مستقلّ' }[r.stage]) + '</td><td>' + (r.assisted ? 'بمساعدة بارق' : r.fails === 0 ? 'من المحاولة الأولى' : 'بعد ' + X.AR(r.fails) + ' محاولة') + '</td></tr>').join('');
      const sheet = () => {
        // ورقة كتابة A4 مكافئة: صفّ «م» منقّطة بنقطة بدء، ثم مـ / ـمـ / ـم في كلماتها
        const F = X.forms(), V8s = F === X.FORMS8, LF = V8s ? 'BQ8 Letter' : 'Scheherazade New', row = (form, n, before, after, word) => {
          if (V8s) return row8(form, n, before, after, word);
          const f = F[form], [vx, vy, vw, vh] = f.vb;
          const cell = (i) => '<svg viewBox="' + (vx - (after ? 34 : 4)) + ' ' + vy + ' ' + (vw + (after ? 34 : 4) + (before ? 34 : 4)) + ' ' + vh + '" style="height:24mm;flex:none">' +
            '<line x1="-60" x2="120" y1="' + (f.base || 57) + '" y2="' + (f.base || 57) + '" stroke="#9CC9E6" stroke-width=".6"/>' +
            (i < 2 ? '<path d="' + f.d + '" fill="none" stroke="#8aa" stroke-width="1.3" stroke-dasharray=".1 3.2" stroke-linecap="round"/>' : '') +
            '<circle cx="' + f.d.match(/M([\d.]+) ([\d.]+)/)[1] + '" cy="' + f.d.match(/M([\d.]+) ([\d.]+)/)[2] + '" r="2.6" fill="#22B14C"/>' +
            (before ? '<text x="' + (f.exitR ? f.exitR[0] : vx + vw) + '" y="' + f.base + '" font-size="36" font-family="Scheherazade New" font-weight="700" direction="rtl" text-anchor="end" fill="#00345B">' + before + '</text>' : '') +
            (after ? '<text x="' + (f.exitL ? f.exitL[0] : vx) + '" y="' + f.base + '" font-size="36" font-family="Scheherazade New" font-weight="700" direction="rtl" text-anchor="start" fill="#00345B">' + after + '</text>' : '') + '</svg>';
          return '<div style="display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;gap:3mm;margin:3mm 0;padding-bottom:2mm;border-bottom:1px dashed #cde;width:100%">' + (word ? '<b style="font:700 26px Scheherazade New;min-width:30mm;color:#00345B">' + word + '</b>' : '') + Array.from({ length: n }, (_, i) => cell(i)).join('') + '</div>';
        };
        /* v8: the Vazirmatn meem — light outline + dotted centre line + green start dot; the rest of the word in the same font */
        const row8 = (form, n, before, after, word) => {
          const f = F[form], m = f.d.match(/M([\d.]+) ([\d.]+)/);
          const top = (before || after) ? f.base - f.fs * 0.78 : f.box[1] - 4, bot = (before || after) ? Math.max(f.box[1] + f.box[3], f.base + f.fs * 0.3) + 4 : f.box[1] + f.box[3] + 4;
          const left = f.box[0] - (after ? f.fs * 0.75 : 4), right = f.box[0] + f.box[2] + (before ? f.fs * 0.6 : 4);
          const cell = (i) => '<svg viewBox="' + left + ' ' + top + ' ' + (right - left) + ' ' + (bot - top) + '" style="height:26mm;flex:none">' +
            '<line x1="' + left + '" x2="' + right + '" y1="' + f.base + '" y2="' + f.base + '" stroke="#9CC9E6" stroke-width=".7"/>' +
            (i < 2 ? '<path d="' + f.o + '" fill="#0B2D4F" fill-opacity=".07" stroke="#0B2D4F" stroke-opacity=".3" stroke-width=".4"/><path d="' + f.d + '" fill="none" stroke="#7a8fa6" stroke-width="1.6" stroke-dasharray=".1 3.8" stroke-linecap="round"/>' : '') +
            '<circle cx="' + m[1] + '" cy="' + m[2] + '" r="3.4" fill="#22C27A"/>' +
            (before ? '<text x="' + f.adv + '" y="' + f.base + '" font-size="' + f.fs + '" font-family="BQ8 Letter" font-weight="700" direction="rtl" text-anchor="end" fill="#0B2D4F">' + before + '</text>' : '') +
            (after ? '<text x="' + f.origin + '" y="' + f.base + '" font-size="' + f.fs + '" font-family="BQ8 Letter" font-weight="700" direction="rtl" text-anchor="start" fill="#0B2D4F">' + after + '</text>' : '') + '</svg>';
          return '<div style="display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;gap:3mm;margin:3mm 0;padding-bottom:2mm;border-bottom:1px dashed #cde;width:100%">' + (word ? '<b style="font:700 26px \'' + LF + '\';min-width:30mm;color:#0B2D4F">' + word + '</b>' : '') + Array.from({ length: n }, (_, i) => cell(i)).join('') + '</div>';
        };
        const d = document.createElement('div');
        d.setAttribute('dir', 'rtl'); d.style.cssText = 'width:100%;align-self:flex-start';
        d.innerHTML = '<h2 style="font:700 24px Scheherazade New;margin:0 0 4mm">اُكْتُبِ المِيمَ — اِبْدَأ مِنَ النُّقْطَةِ الخَضْراءِ</h2>' +
          row('iso', 7) + row('iso', 7) + row('ini', 3, null, 'ـوْز', 'مَوْز') + row('med', 3, 'قَـ', 'ـر', 'قَمَر') + row('fin', 4, 'فَـ', null, 'فَم') +
          '<p style="font:16px Scheherazade New;margin-top:6mm">الاسم: ……………………………</p>';
        return d;
      };
      const printBtn = BQ.h('button', { type: 'button', class: 'bq-btn ghost', onclick: () => X.print([{ node: sheet() }], { title: 'ورقة كتابة الميم' }) }, 'اطبع ورقة الكتابة (A4)');
      X.note(ctx, BQ.h('div', null, BQ.h('div', { html: '<p><b>ما يجري:</b> تتبّع «م» بعد نموذج القلم ← نسخ «م» ← إكمال «ـوز / قـ ـر / فـ» على النقط ← كتابة الميم مستقلّة في «موز / قمر / فم» بعد سماع الكلمة (يختار الطفل الشكل: مـ ـمـ ـم).</p>' +
        '<p><b>المحاولات:</b> الأولى ← «جرّب مرّة أخرى. ابدأ من هنا» ونقطة البدء تنبض · الثانية ← المسار المنقّط أوضح ونقطة تجري عليه · الثالثة ← بارق يرسم ببطء ونمضي. يُسجَّل S8 (كتابة الحرف) قرينةً لبنود الإنتاج الموجّه والمستقلّ (٦): صحيح من الأولى أو الثانية. النجاح: ٥ من ٦.</p>' +
        '<p><b>انتبه:</b> نقطة البدء والاتّجاه جزء من المهارة؛ إن تعثّر الطفل فأمسك إصبعه وارسم معه مرّة، ثم دعه وحده.</p>' +
        (rows ? '<table class="x7-log"><thead><tr><th>البند</th><th>المرحلة</th><th>النتيجة</th></tr></thead><tbody>' + rows + '</tbody></table>' : '') }), printBtn));
    }
  }

  BQ.register(ID, {
    render(stage, ctx) {
      BQ.loadScript('js/el7/ix7b.js').then(() => { if (ctx.alive()) run(stage, ctx); })
        .catch((e) => { console.warn('[E09] ' + e.message); if (ctx.placeholder) ctx.placeholder(); });
    },
  });
})();
