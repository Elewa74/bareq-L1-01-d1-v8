/* E01 · تَهَيَّأْ لِلدَّرْسِ — IX1 · v7 (قاعدة: النسخة الأولى — يقابل EL01 «تهيّأ») · draft_unapproved
   SPEC_v7 §E01 · الناتج 1 · S1. ماذا يستطيع بعده؟ أن يلاحظ أنّ صوتاً واحداً يتكرّر في بدايات كلمات مختلفة ويختاره من بين أصوات.
   1 بارق: bq7_E01_hello · 2 bq7_E01_intro ← ٤ بطاقات تظهر واحدة واحدة وكلّ منها تُسمَع (مَكْتَبْ · مانْجو · مُشْطْ · مِفْتاحْ)
   3 bq7_E01_tap (لمس البطاقة يعيدها — اختياري) · 4 bq7_E01_question ← bq7_G_listen_choose ← ٣ أزرار صوت (مَ ✓ · بَ · فَ؛ مخلوطة؛ كلّ زرّ يضيء وهو يُسمَع؛ اللمس يُسمِع ثم يُحكم)
   ✓ G_yes1 + E01_ok (البطاقات تضيء بالتتابع) · ✗١ E01_hint1 + الكلمات الأربع مقطّعة (_seg) · ✗٢ يخفت زرّ خاطئ + G_look_light · ③ E01_model · 5 E01_bridge.
   لا رمز ولا اسم حرف ولا نصّ على شاشة الطفل (DECISIONS ب، ج). الشكل: بطاقة اللعبة الذهبية كما في «تهيّأ» الأصليّ. record('S1', ok1).
   SCI-1 T2 (2026-10-07, sci comment «أي فقاعة فيها صوت الميم → اختر الصوت الصحيح (مَ – مِ – مُ)»; draft_unapproved):
   السؤال الجديد bq7_E01_q_s1 «بِأَيِّ صَوْتٍ تَبْدَأُ الكَلِماتُ؟ اِسْتَمِع، ثُمَّ اخْتَرِ الصَّوْتَ الصَّحيحَ.» · الأزرار الثلاثة (سمّاعة فقط — قرار المالك)
   تُسمِع سلاسل: مَ… مِ… مُ ✓ (S_chain_short) · بَ… بِ… بُ (S_chain_b) · فَ… فِ… فُ (S_chain_f) — لأنّ الكلمات تبدأ بـ مَ/ما/مُ/مِ لا بـ «مَ» وحدها.
   لا «المس»: bq7_E01_tap_s1 «اِخْتَر أَيَّ صورَةٍ، وَاسْتَمِع إِلَيْها.» */
(function () {
  'use strict';
  const ID = 'E01';
  const lib = () => (BQ.ix1 ? Promise.resolve(BQ.ix1) : BQ.loadScript('js/el7/lib/ix1.js').then(() => BQ.ix1));

  const CSS = `
.e01 { justify-content: center; }
.e01 .e01-panel { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: clamp(10px, 2.2cqi, 22px);
  width: min(100%, 980px); height: 100%; max-height: calc(var(--i7-h) - 4px); padding: clamp(14px, 2.6cqi, 26px) clamp(12px, 2.6cqi, 30px);
  border-radius: 34px; background: radial-gradient(ellipse at 50% 0%, #FFFDF3, var(--paper, #FFFBEA) 60%, #FFF2C9); border: 6px solid #F4C24A;
  box-shadow: inset 0 0 0 3px #FFE7A3, 0 10px 0 #E0A821, 0 18px 34px var(--shade); }
.e01 .e01-shelf { display: grid; grid-template-columns: repeat(4, auto); gap: clamp(10px, 2.4cqi, 26px); }
.e01 .i7-card { --s: min(19cqi, calc((var(--i7-h) - 300px) * .95), 200px); min-width: 84px; }
.e01 .i7-card { opacity: 0; transform: translateY(16px) scale(.9); transition: opacity .35s, transform .45s cubic-bezier(.3,1.4,.4,1), box-shadow .25s; }
.e01 .i7-card.in { opacity: 1; transform: none; }
.e01 .e01-q { display: flex; gap: clamp(16px, 4.5cqi, 48px); justify-content: center; align-items: center; min-height: 112px; }
.e01 .i7-snd { --sz: clamp(96px, 12cqi, 118px); }
.e01 .e01-q .i7-snd, .e01 .e01-ear { opacity: 0; transform: translateY(14px); pointer-events: none; } /* بلا تصغير: الحجم الحقيقيّ ثابت (≥ ٦٤) */
.e01 .e01-q .i7-snd.in, .e01 .e01-ear.in { opacity: 1; transform: none; pointer-events: auto; transition: opacity .35s, transform .45s cubic-bezier(.3,1.4,.4,1); }
.e01 .e01-ear { width: 64px; height: 64px; border-radius: 50%; border: 4px solid #fff; padding: 0; background: var(--sky); color: #fff; display: grid; place-items: center; cursor: pointer; box-shadow: 0 4px 0 #0084b6, 0 6px 12px var(--shade); }
.e01 .e01-ear svg { width: 60%; height: 60%; }
.e01 .e01-ear:active { transform: translateY(3px); box-shadow: 0 1px 0 #0084b6; }
@container stage (max-width: 600px) {
  .e01 .e01-panel { border-width: 5px; border-radius: 26px; padding: 12px 10px; }
  .e01 .e01-shelf { grid-template-columns: repeat(2, auto); }
  .e01 .i7-card { --s: min(36cqi, calc((var(--i7-h) - 290px) / 2 - 12px), 180px); }
  .e01 .e01-q { gap: 10px 14px; flex-wrap: wrap; min-height: 0; }
  .e01 .i7-snd { --sz: 96px; }
  .e01 .e01-ear { order: 9; }
  .e01 .e01-q::after { content: ''; order: 8; flex-basis: 100%; height: 0; }
}
@media (max-height: 500px) {
  .e01 .e01-panel { flex-direction: row; justify-content: center; gap: 22px; padding: 10px 16px; border-width: 4px; border-radius: 24px; }
  .e01 .e01-shelf { grid-template-columns: repeat(2, auto); gap: 8px; }
  .e01 .i7-card { --s: max(76px, calc((var(--i7-h) - 46px) / 2)); min-width: 76px; border-width: 4px; border-radius: 20px; }
  .e01 .e01-q { min-height: 0; gap: 12px; flex-wrap: nowrap; }
  .e01 .i7-snd { --sz: 84px; }
}
@media (prefers-reduced-motion: reduce) { .e01 .i7-card, .e01 .e01-q .i7-snd.in, .e01 .e01-ear.in { transition: none; } }`;
  /* v8 (OWNER_R3-1 · mockup style_v8/E01.png): beach scene · big Bariq on the right greets the child · gold-rim panel on the left:
     4 picture cards land one by one on a «shelf», then a tray of 3 coloured sound stickers (no letters) + the ear sticker (hear them again). */
  const CSS8 = `
.bq8-stage.e01s > .bq8-panel { top: calc(var(--u)*150); bottom: calc(var(--u)*64); inset-inline-start: calc(var(--u)*320); inset-inline-end: calc(var(--u)*56); }
.bq8-stage.e01s > .bq8-bariq { inset-inline-start: calc(var(--u)*18); inset-inline-end: auto; bottom: calc(var(--u)*120); width: calc(var(--u)*300); }
.bq8-stage.e01s > .bq8-bariq .i8-talk { top: -16%; inset-inline-start: 6%; inset-inline-end: auto; width: 42%; }
.e01-8 { justify-content: space-evenly !important; }
.e01-8 .e01-shelf { display: grid; grid-template-columns: repeat(4, auto); gap: calc(var(--u)*24); }
.e01-8 .i7-card.i8-card { --s: calc(var(--u)*160); opacity: 0; transform: translateY(calc(var(--u)*18)) scale(.9); transition: opacity .35s, transform .45s cubic-bezier(.3,1.4,.4,1), box-shadow .25s; }
.e01-8 .i7-card.i8-card.in { opacity: 1; transform: none; }
.e01-8 .i7-card.i8-card.in.is-play { transform: translateY(calc(var(--u)*-6)); }
.e01-8 .e01-q { display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*40); padding: calc(var(--u)*16) calc(var(--u)*44); border-radius: 999px;
  background: rgba(214,170,90,.16); box-shadow: inset 0 calc(var(--u)*3) calc(var(--u)*8) rgba(120,80,20,.12); min-height: calc(var(--u)*156); }
.e01-8 .e01-q .i7-snd, .e01-8 .e01-ear8 { opacity: 0; transform: translateY(calc(var(--u)*14)); pointer-events: none; }
.e01-8 .e01-q .i7-snd.in, .e01-8 .e01-ear8.in { opacity: 1; transform: none; pointer-events: auto; transition: opacity .35s, transform .45s cubic-bezier(.3,1.4,.4,1); }
.e01-8 .e01-ear8 { margin-inline-start: calc(var(--u)*6); width: max(var(--i8-t), calc(var(--u)*96)); height: max(var(--i8-t), calc(var(--u)*96)); min-width: 0; min-height: 0; font-size: calc(max(var(--i8-t), calc(var(--u)*96)) * .62); }
.bq8-stage.e01s.is-tall > .bq8-panel { inset-inline: calc(var(--u)*40); top: calc(var(--u)*150); bottom: calc(var(--u)*300); }
.bq8-stage.e01s.is-tall > .bq8-bariq { inset-inline-start: calc(var(--u)*40); bottom: calc(var(--u)*24); width: calc(var(--u)*280); }
.bq8-stage.e01s.is-tall .e01-shelf { grid-template-columns: repeat(2, auto); gap: calc(var(--u)*34); }
.bq8-stage.e01s.is-tall .i7-card.i8-card { --s: calc(var(--u)*290); }
@media (prefers-reduced-motion: reduce) { .e01-8 .i7-card, .e01-8 .e01-q .i7-snd.in, .e01-8 .e01-ear8.in { transition: none; } }`;

  function render(stage, ctx) {
    lib().then((I) => { if (ctx.alive()) run(I, stage, ctx); })
      .catch((e) => { console.warn('E01 lib', e); if (ctx.placeholder) ctx.placeholder(); });
  }

  function run(I, stage, ctx) {
    const h = BQ.h;
    if (!document.getElementById('st-e01')) document.head.append(h('style', { id: 'st-e01' }, CSS));
    if (!document.getElementById('st-e01-8')) document.head.append(h('style', { id: 'st-e01-8' }, CSS8));
    const S = I.session(ctx, { noText: true });
    const V8 = I.v8();
    I.lines({
      bq7_E01_hello: 'مَرْحَبًا، أَنا بارِقٌ.', bq7_E01_intro: 'اِسْتَمِع إِلَى هَذِهِ الْكَلِمَاتِ.', bq7_E01_tap_s1: 'اِخْتَر أَيَّ صورَةٍ، وَاسْتَمِع إِلَيْها.',
      bq7_E01_q_s1: 'بِأَيِّ صَوْتٍ تَبْدَأُ الكَلِماتُ؟ اِسْتَمِع، ثُمَّ اخْتَرِ الصَّوْتَ الصَّحيحَ.', bq7_E01_ok: 'نَعَم، سَمِعْناهُ في كُلِّ كَلِمَةٍ: مَ… ما… مُ… مِ.',
      bq7_E01_hint1: 'اِسْتَمِع إِلَى أَوَّلِ كُلِّ كَلِمَةٍ.', bq7_E01_model: 'هَذَا هُوَ: مَ – مِ – مُ. مَكْتَب، مَانْجُو، مُشْط، مِفْتَاح.', bq7_E01_bridge: 'هَيّا نَبْحَث عَن هَذا الصَّوْتِ.',
    });
    const L = { hello: 'bq7_E01_hello', intro: 'bq7_E01_intro', tap: 'bq7_E01_tap_s1', q: 'bq7_E01_q_s1',
      ok: 'bq7_E01_ok', hint1: 'bq7_E01_hint1', model: 'bq7_E01_model', bridge: 'bq7_E01_bridge' };
    const WORDS = ['maktab', 'manju', 'musht', 'miftah'];
    // SCI-1 T2: each sound button plays the sound family (مَ… مِ… مُ ✓ · بَ… بِ… بُ · فَ… فِ… فُ) — composed from the approved syllable clips
    const OPTS = [{ key: 'm', id: 'bq7_S_chain_short', c: 1 }, { key: 'b', id: 'bq7_S_chain_b', c: 2 }, { key: 'f', id: 'bq7_S_chain_f', c: 3 }];

    const f8 = V8 ? I.frame8(S, 'e01-8', { scene: true, pose: 'wave', stageCls: 'e01s' }) : null;
    const root = V8 ? f8.panel : I.root(stage, 'e01');
    const panel = h('div.e01-panel');
    const shelf = h('div.e01-shelf', { role: 'group', 'aria-label': 'صُوَرٌ' });
    const qrow = h('div.e01-q', { role: 'group', 'aria-label': 'أَصْواتٌ' });
    panel.append(shelf, qrow);
    root.append(panel);
    const buddy = I.buddy(S, root, 'wave');
    let phase = 'intro', busy = true;

    const cards = WORDS.map((slug, i) => {
      const c = I.card(slug, { aria: 'صورة ' + I.AR(i + 1) });
      c.classList.add('is-gold'); c.slug = slug;
      c.addEventListener('click', async () => { if (busy || phase === 'end' || !c.classList.contains('in')) return; busy = true; I.sfx('tick'); await I.playOn(S, c, I.wordId(c.slug)); busy = false; });
      shelf.append(c);
      return c;
    });
    const btns = BQ.shuffle(OPTS).map((o, i) => { const b = I.sndBtn({ id: o.id, key: o.key, c: o.c, aria: 'صَوْتٌ ' + I.AR(i + 1) }); b.o = o; qrow.append(b); return b; });
    const earAll = V8 ? h('button.bq8-btn.bq8-btn--ear.e01-ear8', { type: 'button', 'aria-label': 'أَعِدِ الأَصْواتَ' }, I.i8('ear'))
      : h('button.e01-ear', { type: 'button', 'aria-label': 'أَعِدِ الأَصْواتَ', html: I.IC.ear });
    qrow.append(earAll);
    const right = () => btns.find((b) => b.o.key === 'm');
    btns.forEach((b) => I.hoverReplay(b, async () => { busy = true; await I.playOn(S, b, b.sid); busy = false; }, () => !busy && phase === 'q'));

    const playOpts = async () => {
      for (const b of btns) { if (!b.classList.contains('in')) { b.classList.add('in'); I.sfx('pop'); await S.sleep(140); } }
      earAll.classList.add('in');
      await S.sleep(200);
      for (const b of btns) { if (I.isNo(b)) continue; await I.playOn(S, b, b.sid); await S.sleep(420); }
    };
    const ask = async () => { buddy.set('point', 1500); await S.say(L.q); await playOpts(); };
    earAll.addEventListener('click', async () => { if (busy || phase !== 'q') return; busy = true; await playOpts(); busy = false; });
    I.instr(S, L.intro, 'ear', async () => { if (busy) return; busy = true; if (phase === 'q') await ask(); else await S.say(L.tap); busy = false; });

    let first = null;
    const pol = I.policy(S, {
      opts: btns, right, next: false,
      async hint1() { await S.say(L.hint1); for (const c of cards) { c.classList.add('is-play'); await S.stim(I.segId(c.slug)); c.classList.remove('is-play'); await S.sleep(380); } await S.sleep(200); await playOpts(); },
      async hint2() { await playOpts(); },
      async model() { const r = right(); await I.playOn(S, r, r.sid); await S.sleep(300); for (const c of cards.slice(0, 2)) { c.classList.add('is-play'); await S.stim(I.segId(c.slug)); c.classList.remove('is-play'); await S.sleep(250); } },
    });

    btns.forEach((b) => b.addEventListener('click', async () => {
      if (busy || phase !== 'q' || I.isNo(b)) return;
      busy = true;
      await I.playOn(S, b, b.sid); // اللمس يُسمِع الصوت ثم يُحكم
      if (b.o.key === 'm') {
        if (first == null) { first = true; I.record(S, 'S1', true, { item: 'repeat-sound' }); }
        I.markOk(b); I.anim(b, 'i7-pop', 450); I.sfx('ok'); I.burst(root, b, 18); buddy.cheer();
        btns.forEach((x) => { if (x !== b && !x.classList.contains('is-no')) x.classList.add('is-dim'); });
        await S.say(I.yes(), { talk: true });
        const pl = S.say(L.ok);
        for (const c of cards) { await S.sleep(560); c.classList.add('is-glow'); I.sfx('sparkle'); }
        await pl; await S.sleep(300);
        cards.forEach((c) => c.classList.remove('is-glow'));
        return finish();
      }
      if (first == null) { first = false; I.record(S, 'S1', false, { item: 'repeat-sound', picked: b.o.key }); }
      const st = await pol.wrong(b);
      if (st === 'model') return finish(true);
      busy = false;
    }));

    /** FIX12 A-09: a closing line is heard to its END before the end card covers the screen — S.say resolves on «ended»; if it resolved
     *  early (watchdog / an interrupted start) we still wait for the clip's «ended», at most until its duration + 1 s after the start. */
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

    async function finish(solved) {
      phase = 'end';
      I.note(S, '<p><b>نتيجة «تهيّأ للدرس» (S1):</b> ' + (first ? 'اختار «مَ… مِ… مُ» من المحاولة الأولى.' : pol.n >= 3 ? 'رأى النموذج بعد محاولتين — أعِد معه «اسمع واكتشف».' : 'اختاره بعد تلميح.') + ' (قرينة للمعلّم؛ الإتقان يُقرَّر في «تحقّق من تقدّمي».)</p>');
      buddy.set('cheer');
      await sayFull(L.bridge, { talk: true });
      // FIX12 A-11: Bariq solved the only item (the child did not find it) → no «أَحْسَنْتَ.» on the end card
      I.finish(S, solved ? { pose: 'cheer', title: 'هَيَّا نُكْمِل.' } : { pose: 'cheer' });
    }

    (async () => {
      await S.sleep(450);
      await S.say(L.hello, { talk: true });
      buddy.set('idle');
      await S.say(L.intro);
      for (const c of cards) {
        c.classList.add('in'); I.sfx('flip');
        await S.sleep(380);
        await I.playOn(S, c, I.wordId(c.slug));
        await S.sleep(320);
      }
      phase = 'tap'; busy = false;
      I.instr(S, L.tap, 'hand', async () => { if (busy) return; busy = true; await S.say(L.tap); busy = false; });
      await S.say(L.tap);
      await S.sleep(2600);
      while (busy) await S.sleep(200); // ينتظر انتهاء إعادة بطاقة لمسها الطفل
      busy = true; phase = 'q';
      I.instr(S, L.q, 'hand', async () => { if (busy) return; busy = true; await ask(); busy = false; });
      await ask();
      busy = false;
    })();
  }

  BQ.register(ID, { render });
})();
