/* video7.js — عناصر الفيديو في v7 (E02 E07 E12 E13) + «سؤال النهاية» (PLATFORM · draft_unapproved)
   · BQ.video.element7def(id) → تعريف عنصر فيديو: media/video7/<ID>.mp4 (+ .jpg ملصق · .cues.json اختياري) في مشغّل v6 (BQ.video.mp4)؛
     المقطع غير موجود ⇒ بطاقة «قيد الإنتاج» الموحّدة. يُستعمل تلقائياً ما لم يوجد js/el7/<ID>.js.
   · سؤال النهاية اختياري من بيانات العنصر meta.endq (أو media/video7/<ID>.endq.json عبر المولّد):
       {prompt, prompt_text, skill, img?, options:[{id, audio?, img?, glyph?, label?}], correct, fb_yes, fb_retry, fb_show}
       يجوز أن تكون endq مصفوفة أسئلة تُعرض تباعاً. حقول إضافية: pre (سطر قبل الخيارات) · word:true (الخيارات أجزاء كلمة متلاصقة) ·
       shuffle · fb_yes/fb_retry/fb_glow/fb_show/model: معرّف سطر أو مصفوفة أسطر تُشغَّل تباعاً (fb_yes مصفوفة مصفوفات = تدوير).
   · BQ.video.endQuestion(host, ctx, q) → Promise<{ok, tries}> — سلّم المالك (R3 GLOBAL): صواب = أخضر + ثناء متغيّر (بلا «شكراً») ·
     خطأ ١ = علامة حمراء + fb_retry · خطأ ٢ = بارق يحلّ (fb_show + model + fb_end)؛ q.attempts=3 يعيد خطوة الإضاءة القديمة.
     q.word + q.parts = كلمة واحدة متّصلة بمناطق لمس مقيسة على الحروف (لا تُقطَّع الكلمة). يسجّل q.skill في دليل الإتقان (المحاولة الأولى).
   بلا همهمة في التغذية، وبلا كلمة «خطأ». */
(function () {
  'use strict';
  const BQ = window.BQ; if (!BQ || !BQ.video) return;
  const h = BQ.h, V = BQ.video, D = BQ.D;
  const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const SND = ['#00AEED', '#F89928', '#43A047', '#9B6BD3'];

  /* ---------- سؤال النهاية ---------- */
  /* VIDEO_E07 r4 (owner GLOBAL feedback ladder, R3 2026-10-05): ✓ = green + a ROTATING praise line (never «شكراً») ·
     ✗1 = red mark on the chosen option + a motivating retry line (fb_retry, default bq7_G_try) · ✗2 (default attempts = 2) = Bariq solves:
     he appears pointing, the answer lights green, fb_show + model, then an encouraging line (fb_end). The mastery record stays = first try.
     q.word + q.parts = ONE connected word (never split into letter tiles): the word is drawn once in --font-letter and each part
     ({id, a, b} = character offsets incl. marks) gets an invisible hit box measured from the real glyphs (Range.getClientRects). */
  let praiseN = 0;                                  // praise rotates across questions and replays
  const NO_THANKS = /شُكْ?رًا|شكرا|شكراً/;
  const lineOk = (id) => { const l = BQ.line && BQ.line(id); return !(l && NO_THANKS.test(l.t || l.text || '')); };
  function endQuestion(host, ctx, q) {
    q = q || {};
    const isWord = typeof q.word === 'string' && Array.isArray(q.parts) && q.parts.length;
    const opts = isWord ? q.parts.slice() : q.shuffle ? BQ.shuffle(q.options || []) : (q.options || []).slice();
    let res; const done = new Promise((r) => { res = r; });
    let tries = 0, over = false;
    const alive = () => !ctx || !ctx.alive || ctx.alive();
    const say = async (id) => { if (!id) return; if (Array.isArray(id)) { for (const x of id) { if (!alive()) return; await say(x); } return; } if (!lineOk(id)) return; await BQ.audio.play(id); };
    const yesLine = () => { const y = q.fb_yes; if (Array.isArray(y) && y.length && Array.isArray(y[0])) return y[(praiseN++) % y.length]; return y; };
    /* v8: the question text is part of the question (no CC setting hides it); before E06 no Arabic text on the child's screen (lesson rule) */
    const showText = BQ.state.age === '10-12' || !(ctx && ctx.meta && /^E0[1-5]$/.test(ctx.meta.id));
    const picks = [];
    const card = h('div.v7-eq' + (isWord ? '.is-wordq' : ''), { role: 'group', 'aria-label': q.prompt_text || 'سُؤالٌ' });
    const replay = h('button.v7-eq-say', { type: 'button', 'aria-label': 'أَعِدِ السُّؤالَ', onclick: () => { BQ.audio.unlock(); intro(); } }, BQ.icon('speaker'));
    const head = h('div.v7-eq-head', null, replay, showText && q.prompt_text ? h('p.v7-eq-t', null, q.prompt_text) : null);
    const pic = q.img ? h('div.v7-eq-img', null, h('img', { src: BQ.img7(q.img), alt: '', draggable: 'false' })) : null;
    let row, wordBox = null, wordText = null;
    if (isWord) {
      wordText = h('span.v7-eq-wt', { lang: 'ar', 'aria-hidden': 'true' }, q.word);
      wordBox = h('div.v7-eq-word', { role: 'group', 'aria-label': 'الكَلِمَةُ: ' + q.word, dir: 'rtl' }, wordText);
      opts.forEach((o, i) => {
        const b = h('button.v7-eq-hit', { type: 'button', 'aria-label': o.aria || ('الجُزْءُ ' + BQ.AR(i + 1) + ' مِنَ الكَلِمَةِ'), dataset: { id: o.id } },
          h('span.bq-tick', { 'aria-hidden': 'true', html: BQ.icons.check }), h('span.v7-eq-x', { 'aria-hidden': 'true' }, '✕'));
        b.addEventListener('click', () => pick(o, b));
        picks.push(b); wordBox.append(b);
      });
      row = h('div.v7-eq-opts.is-word1', null, wordBox);
    } else {
      row = h('div.v7-eq-opts' + (opts.some((o) => o.img) ? '.has-img' : '') + (q.word ? '.is-word' : ''), { role: 'group', 'aria-label': 'الخِياراتُ' });
      opts.forEach((o, i) => {
        const vis = o.img ? h('img', { src: BQ.img7(o.img), alt: '', draggable: 'false' })
          : o.glyph ? h('span.v7-eq-g', { lang: 'ar' }, o.glyph)
          : o.label ? h('span.v7-eq-l', { lang: 'ar' }, o.label)
          : h('span.v7-eq-snd', { style: { color: SND[i % SND.length] }, html: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 18h8l11-9v30l-11-9H8z" fill="currentColor"/><path d="M32 17a9 9 0 0 1 0 14M36.5 12a16 16 0 0 1 0 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>' });
        const b = h('button.v7-eq-pick', { type: 'button', 'aria-label': o.aria || o.glyph || o.label || ('الخِيارُ ' + BQ.AR(i + 1)), dataset: { id: o.id } }, vis,
          h('span.bq-tick', { 'aria-hidden': 'true', html: BQ.icons.check }), h('span.v7-eq-x', { 'aria-hidden': 'true' }, '✕'));
        b.addEventListener('click', () => pick(o, b));
        const ear = o.audio ? h('button.v7-eq-ear', { type: 'button', 'aria-label': 'اِسْتَمِعْ', onclick: (e) => { e.stopPropagation(); BQ.audio.unlock(); hear(o, b); } }, BQ.icon('ear')) : null;
        picks.push(b);
        row.append(h('div.v7-eq-opt', null, ear, b));
      });
    }
    const brq = h('img.v7-eq-brq', { src: 'media/img8/brq8_point.webp', alt: '', draggable: 'false', 'aria-hidden': 'true' });
    card.append(...[head, pic, row, brq].filter(Boolean));
    host.append(card);
    /* word mode: hit boxes from the shaped glyphs (layout px of the word box; works inside the scaled v8 stage) */
    function layoutHits() {
      if (!wordBox || !wordText.firstChild || !wordBox.isConnected) return;
      const box = wordBox.getBoundingClientRect(); const s = box.width / (wordBox.offsetWidth || 1) || 1;
      const tn = wordText.firstChild, n = tn.length;
      const spans = opts.map((o) => {
        const r = document.createRange(); r.setStart(tn, Math.max(0, Math.min(n, o.a))); r.setEnd(tn, Math.max(0, Math.min(n, o.b)));
        const rs = Array.from(r.getClientRects()).filter((x) => x.width > 0.5);
        if (!rs.length) return null;
        const x0 = Math.min(...rs.map((x) => x.left)), x1 = Math.max(...rs.map((x) => x.right));
        return { x0: (x0 - box.left) / s, x1: (x1 - box.left) / s };
      });
      const W = wordBox.offsetWidth, H = wordBox.offsetHeight;
      if (spans.some((x) => !x)) { opts.forEach((o, i) => { spans[i] = { x0: W * (opts.length - 1 - i) / opts.length, x1: W * (opts.length - i) / opts.length }; }); }
      const order = spans.map((x, i) => ({ i, c: (x.x0 + x.x1) / 2 })).sort((p, q2) => p.c - q2.c);
      order.forEach((p, k) => {           // neighbours share the midpoint between their glyphs → the whole word is covered, no gaps or overlaps
        const sp = spans[p.i];
        const L = k === 0 ? 0 : (spans[order[k - 1].i].x1 + sp.x0) / 2;
        const R = k === order.length - 1 ? W : (sp.x1 + spans[order[k + 1].i].x0) / 2;
        const b = picks[p.i]; b.style.left = L + 'px'; b.style.width = Math.max(0, R - L) + 'px'; b.style.top = '0px'; b.style.height = H + 'px';
        b.dataset.ink = Math.round(sp.x0) + ',' + Math.round(sp.x1);
        b.style.setProperty('--ink-l', (sp.x0 - L) + 'px'); b.style.setProperty('--ink-w', (sp.x1 - sp.x0) + 'px');
      });
    }
    if (isWord) {
      const relayout = () => requestAnimationFrame(layoutHits);
      relayout(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
      card.addEventListener('transitionend', relayout);
      if (window.ResizeObserver) { const ro = new ResizeObserver(relayout); ro.observe(wordBox); done.then(() => ro.disconnect()); }
      setTimeout(relayout, 400);
    }
    async function hear(o, b) { b.classList.add('is-hear'); await say(o.audio); b.classList.remove('is-hear'); }
    async function intro() {
      if (over) return;
      await say(q.prompt);
      if (q.pre && opts.some((o) => o.audio)) await say(q.pre);
      for (const [i, o] of opts.entries()) { if (!alive() || over) break; if (o.audio) { await BQ.sleep(250); await hear(o, picks[i]); } }
    }
    let busy = false;
    async function pick(o, b) {
      if (over || busy || b.classList.contains('is-dim') || b.classList.contains('is-wrong')) return;
      BQ.audio.unlock();
      const ok = o.id === q.correct;
      if (ok) {
        over = true; BQ.ui.ok(b); b.classList.add('is-ok'); card.classList.add('is-done');
        if (tries === 0 && q.skill && ctx && ctx.record) ctx.record(q.skill, true, { from: 'endq' });
        await say(yesLine());
        res({ ok: true, tries: tries + 1 });
        return;
      }
      tries++;
      BQ.ui.shake(b); b.classList.remove('is-dim'); b.classList.add('is-wrong');   // ✗ red mark stays on the chosen option (not a grey-out)
      if (tries === 1 && q.skill && ctx && ctx.record) ctx.record(q.skill, false, { from: 'endq' });
      const good = picks.find((x) => x.dataset.id === q.correct);
      const max = q.attempts || 2;
      if (tries >= max) {                                                  // Bariq solves it + encouraging line
        over = true;
        card.classList.add('is-solve');
        if (good) { BQ.ui.glow(good); good.classList.add('is-ok'); }
        await say(q.fb_show); await say(q.model); await say(q.fb_end);
        await BQ.sleep(700);
        res({ ok: false, tries });
        return;
      }
      busy = true;
      if (max >= 3 && tries === max - 1) { if (good) BQ.ui.glow(good); await say(q.fb_glow || q.fb_retry || 'bq7_G_try'); }
      else await say(q.fb_retry || 'bq7_G_try');
      busy = false;
    }
    requestAnimationFrame(() => card.classList.add('in'));
    setTimeout(intro, 350);
    done.card = card;
    return done;
  }

  /* ---------- عنصر الفيديو v7 ---------- */
  function element7def(id) {
    return {
      kind: 'video',
      render(stage, ctx) {
        const meta = ctx.meta, vid = meta.video || id, base = 'media/video7/' + vid;
        const { alive } = V.liveGuard(ctx);
        ctx.frame.dataset.kind = 'video';
        const has = meta.video_ok || ((D.videos7 || []).includes(vid + '.mp4')) || BQ.scan;
        const qs = (Array.isArray(meta.endq) ? meta.endq : meta.endq ? [meta.endq] : []).filter((x) => x && ((x.options || []).length || (Array.isArray(x.parts) && x.parts.length))); // word-mode questions carry «parts», not «options»
        const q = qs.length ? qs : null;
        ctx.adultNote('<p>' + (q ? 'بعد نهاية المقطع يظهر سؤال قصير للطفل (يُسجَّل في دليل الإتقان).' : 'مقطع للمشاهدة بلا أسئلة.') +
          ' يمكنك إيقاف المقطع بلمس الصورة.</p>');
        if (!has) { ctx.placeholder(); return; }
        let finished = false;
        const next = () => { BQ.audio.unlock(); BQ.goNext(); };
        const finish = () => { if (finished || !alive()) return; finished = true; ctx.done(); };
        /* R3-F10: نسخة 720p (<ID>_720.mp4 من VIDEO) على الشاشات ≤ ١١٨٠ أو الشبكة البطيئة/توفير البيانات؛ 1080p للعرض على الشاشة الكبيرة */
        const cn = navigator.connection || {};
        const small = Math.max(screen.width || 0, screen.height || 0) <= 1180 || (window.innerWidth || 0) <= 1180;
        const slow = cn.saveData || (cn.downlink && cn.downlink < 5) || /(^|-)2g|3g/.test(cn.effectiveType || '');
        const src = meta.video_720 && (small || slow) ? base + '_720.mp4' : null;
        const P = V.mp4(stage, ctx, { id: vid, base, src, aria: 'مَقْطَعُ «' + (meta.cover_title || meta.name) + '»', captions: true, noCues: true, cuesOptional: true,
          noCuesFile: !meta.video_cues && !BQ.scan, posterSrc: meta.video_poster ? base + '.jpg' : (meta.cover_file || BLANK), poster: meta.cover_file || BLANK,
          title: meta.name, failNext: 'التّالي', slow: false });
        /* OWNER R3 «تداخل الفيديو والنشاط» (E07, 2026-10-05): a question card is a clean CHECKPOINT — the video is PAUSED on that frame
           (P.hold: play/seek/tap blocked, controls + captions hidden), the card sits centred on a soft scrim that covers the VIDEO BOX ONLY
           (theme 8; v7 keeps its play-area layer), nothing else layered; after the answer the card closes, controls/captions return and the video
           resumes (mid-video checkpoint) or the end row shows (end question). Mid-video checkpoint = a question with «at» (seconds) before the end.
           Old bug: the header ↻ (ctx.onReplay → P.goto) restarted the video UNDER the open end-question layer → card + caption + playing controls. */
        ctx.onReplay(() => { if (inQ) { const b = endEl && endEl.querySelector('.v7-eq-say'); if (b) b.click(); return; } P.goto(P.scene); });
        let endEl = null, asked = false, inQ = false;
        const fixed8 = BQ.fixedStage && BQ.fixedStage();
        const clearEnd = () => { if (endEl) { endEl.remove(); endEl = null; } if (P.root) P.root.classList.remove('v5-ended'); };
        const endRow = () => {
          const box = P.root && P.root.querySelector('.vp-box'); if (!box || !alive()) return;
          clearEnd();
          P.root.classList.add('v5-ended');
          const nx = BQ.nextInfo && BQ.nextInfo();
          endEl = h('div.v5-end', { role: 'group', 'aria-label': 'انْتَهى المَقْطَعُ' },
            h('button.bq-btn.ghost', { type: 'button', onclick: () => { clearEnd(); asked = false; P.goto(0); } }, BQ.icon('replay'), 'أَعِدِ المَقْطَعَ'),
            nx ? h('button.bq-btn.go', { type: 'button', onclick: next }, 'التّالي', BQ.icon('next')) : null);
          box.append(endEl);
        };
        const hold = (on, resume) => { if (P.hold) P.hold(on, resume); else if (on && P.pause) P.pause(); ctx.frame.classList.toggle('is-vq', !!on); };
        async function ask(list, mid) {
          const box = P.root && P.root.querySelector('.vp-box'); if (!box || !alive()) return false;
          inQ = true; hold(true);
          if (!mid) { clearEnd(); P.root.classList.add('v5-ended'); }
          const layer = h('div.v7-eq-layer' + (fixed8 ? '.is-box' : ''), { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'سُؤالٌ' });
          (fixed8 ? box : (P.root.closest('.elp-play') || box)).append(layer); endEl = layer; // v7: فوق منطقة اللعب كلّها (الهاتف: إطار الفيديو صغير)
          for (const one of list) { if (!alive()) break; layer.replaceChildren(); await endQuestion(layer, ctx, one); }
          if (!alive()) return false;
          layer.remove(); if (endEl === layer) endEl = null;
          inQ = false; hold(false, mid);
          if (mid) P.root.classList.remove('v5-ended');
          return true;
        }
        const dur = () => (P.video && isFinite(P.video.duration) ? P.video.duration : 1e9);
        const isCp = (x) => typeof x.at === 'number' && x.at >= 0;
        const cps = (q || []).filter(isCp).sort((a, b) => a.at - b.at), endQs = (q || []).filter((x) => !isCp(x));
        const cpDone = new Set();
        if (cps.length && P.video) (function watch() { // mid-video checkpoints: stop ON the frame at «at»
          if (!alive()) return;
          const v = P.video, t = v.currentTime || 0;
          if (!inQ && !v.paused && !v.ended) {
            const cp = cps.find((x) => !cpDone.has(x) && t >= x.at && x.at < dur() - 0.4);
            if (cp) { cpDone.add(cp); ask([cp], true); }
          }
          requestAnimationFrame(watch);
        })();
        const onEnd = async () => {
          if (!alive() || inQ) return;
          if (endQs.length && !asked) {
            asked = true;
            if (!(await ask(endQs, false))) return;
            finish(); endRow();
            return;
          }
          finish(); endRow();
        };
        if (P.video) {
          P.video.addEventListener('ended', onEnd);
          ['play', 'seeking'].forEach((ev) => P.video.addEventListener(ev, () => { if (!P.video.ended && !inQ) clearEnd(); }));
        }
        P.done.then((ok) => { if (ok === false) { if (alive()) next(); return; } onEnd(); });
      },
    };
  }
  V.endQuestion = endQuestion;
  V.element7def = element7def;
})();
