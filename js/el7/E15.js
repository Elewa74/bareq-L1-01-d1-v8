/* E15 · لَوِّنْ — IX2 (+ART) · v7 · draft_unapproved · SPEC_v7 §E15 · تعزيز (5 · 8) · غير مسجَّل
   بعده: يتأمّل شكل «م» ويستدعي أسماء الأشياء أثناء التلوين.
   على الشاشة: color_page1 (م كبيرة مع بارق) ثم color_page2 (مانجو، موز، قمر، مشط، مفتاح، تمساح) · لوحة ٨ ألوان كبيرة ·
   لمس منطقة = تعبئة (تعبئة فيضية على لوحة رسم من فنّ الخطوط؛ الخطوط تبقى سوداء بالمزج «ضرب») · لمس شيء أوّل مرّة يُسمِع اسمه (bq7_W_*) ·
   زرّ «تَراجُع» أيقونة · الانتهاء bq7_E15_done. الطباعة A4 من دليل المعلّم فقط (لا زرّ «اطبع» على شاشة الطفل).
   v8 (?theme=8): إعادة تلبيس فقط — اللوح الخشبيّ، الصفحة ورقة بيضاء بإطار ملصق، الألوان أقراص ملصقات، «تراجع» زرّ ملصق. لا تغيير في السلوك. */
(function () {
  'use strict';
  const ID = 'E15';
  const COLORS = ['#E4553F', '#FF9F1C', '#FEBA02', '#3DBB6B', '#00AEED', '#2E6CA6', '#8E6CD9', '#8B5A2B'];
  const NAMES = ['أَحْمَرُ', 'بُرْتُقالِيٌّ', 'أَصْفَرُ', 'أَخْضَرُ', 'أَزْرَقُ فاتِحٌ', 'أَزْرَقُ', 'بَنَفْسَجِيٌّ', 'بُنِّيٌّ'];
  /* الصفحة ٢: شبكة ٢×٣ (الصورة: يسار/يمين × ٣ صفوف) ← اسم الشيء */
  const GRID2 = [['manju', 'mawz'], ['qamar', 'musht'], ['miftah', 'timsah']];
  const PAGES = [{ key: 'color_page1', min: 4 }, { key: 'color_page2', min: 6, grid: GRID2 }];
  const PW = 760; // دقّة المعالجة (العرض بالبكسل)

  const CSS = `
.e15 { flex-direction: row; align-items: stretch; justify-content: center; gap: clamp(10px, 2.4cqi, 24px); }
.e15-pagewrap { position: relative; flex: 0 1 auto; display: flex; align-items: center; justify-content: center; min-width: 0; }
.e15-page { position: relative; height: calc(var(--H, 600px) - 28px); aspect-ratio: 1600 / 2263; max-width: 100%; border-radius: 16px; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 14px 28px var(--shade); overflow: hidden; touch-action: none; }
.e15-page canvas { width: 100%; height: 100%; display: block; touch-action: none; cursor: pointer; }
.e15-side { flex: none; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
.e15-pal { display: grid; grid-template-columns: repeat(2, auto); gap: 10px; }
.e15-sw { width: 64px; height: 64px; border: 0; padding: 0; border-radius: 18px; cursor: pointer; background: var(--c); box-shadow: inset 0 -6px 0 rgba(0,0,0,.18), 0 4px 10px var(--shade); position: relative; transition: transform .15s; }
.e15-sw::after { content: ''; position: absolute; inset: 9px 9px auto auto; width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,.45); }
.e15-sw[aria-pressed="true"] { transform: scale(1.14); box-shadow: 0 0 0 4px #fff, 0 0 0 7px var(--navy), 0 6px 12px var(--shade); }
.e15-tools { display: flex; gap: 10px; }
.e15-tool { width: 64px; height: 64px; border-radius: 50%; border: 0; background: #fff; color: var(--navy); display: grid; place-items: center; cursor: pointer; box-shadow: 0 4px 0 var(--sky-line), 0 6px 12px var(--shade); }
.e15-tool .x7-ic { width: 32px; height: 32px; }
.e15-tool:disabled { opacity: .4; cursor: default; }
.e15-tool.is-go { background: var(--sun); box-shadow: 0 5px 0 var(--sun-edge, #D99A00); }
.e15-tool.is-go[hidden] { display: none; }
.e15-sw2 { width: 64px; height: 80px; border-radius: 12px; border: 3px solid #fff; padding: 0; background: #fff center/cover no-repeat; box-shadow: 0 4px 0 var(--sky-line), 0 6px 12px var(--shade); cursor: pointer; position: relative; }
.e15-sw2.is-go { box-shadow: 0 0 0 5px var(--sun), 0 0 22px var(--sun); animation: x7Pulse 1.3s ease-in-out 3; }
.e15.is-short .e15-pal { grid-template-columns: repeat(4, auto); gap: 8px; }
.e15.is-short .e15-side { gap: 8px; }
.e15.is-short .e15-sw { width: 60px; height: 60px; border-radius: 16px; }
.e15-dot { position: absolute; z-index: 3; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; pointer-events: none; animation: e15Pop .5s ease-out forwards; }
@keyframes e15Pop { from { transform: scale(.4); opacity: .9; } to { transform: scale(2.6); opacity: 0; } }
.e15-wait { position: absolute; inset: 0; display: grid; place-items: center; font: 700 22px/1 var(--ff-ui); color: #9CC9E6; }
@container stage (max-width: 620px) {
  .e15 .x7-buddy { display: none; }
  .e15 { flex-direction: column; align-items: center; }
  .e15-page { height: calc(var(--H, 600px) - 150px); }
  .e15-side { flex-direction: row; flex-wrap: nowrap; gap: 8px; }
  .e15-pal { grid-template-columns: repeat(4, auto); gap: 6px; }
  .e15-tools { flex-direction: column; gap: 6px; }
  .e15-sw2 { width: 60px; height: 60px; }
  .e15-sw { width: 60px; height: 60px; border-radius: 16px; }
  .e15-tool { width: 60px; height: 60px; }
}
/* ---------- v8 (restyle only) ---------- */
.x7p.e15 { flex-direction: row; align-items: center; justify-content: center; gap: calc(var(--u)*40); padding: calc(var(--u)*6) calc(var(--u)*20); }
.x7p.e15 .e15-page { height: calc(var(--u)*452); border-radius: calc(var(--u)*20); border: var(--bq8-line) solid var(--bq8-navy); box-shadow: 0 0 0 calc(var(--u)*8) #fff, var(--bq8-sh-2); }
.x7p.e15 .e15-side { gap: calc(var(--u)*22); }
.x7p.e15 .e15-pal { grid-template-columns: repeat(2, auto); gap: calc(var(--u)*16); }
.x7p.e15 .e15-sw { width: max(64px, calc(var(--u)*80)); height: max(64px, calc(var(--u)*80)); border-radius: 50%; border: var(--bq8-line) solid var(--bq8-navy);
  box-shadow: inset 0 calc(var(--u)*-7) 0 rgba(0,0,0,.18), 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-1); }
.x7p.e15 .e15-sw::after { inset: 18% 18% auto auto; width: 24%; height: 24%; }
.x7p.e15 .e15-sw[aria-pressed="true"] { transform: scale(1.12); box-shadow: inset 0 calc(var(--u)*-7) 0 rgba(0,0,0,.18), 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*13) var(--bq8-navy), var(--bq8-sh-1); }
.x7p.e15 .e15-tools { gap: calc(var(--u)*20); align-items: center; }
.x7p.e15 .e15-undo8:disabled { filter: grayscale(.8); opacity: .5; }
.x7p.e15 .e15-sw2 { width: max(64px, calc(var(--u)*76)); height: max(80px, calc(var(--u)*100)); border-radius: calc(var(--u)*14); border: var(--bq8-line) solid var(--bq8-navy); box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-1); }
.x7p.e15 .e15-sw2.is-go { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*12) var(--bq8-yellow), 0 0 calc(var(--u)*26) var(--bq8-yellow); }
.x7p.e15.is-tall { flex-direction: column; gap: calc(var(--u)*24); }
.x7p.e15.is-tall .e15-page { height: calc(var(--u)*720); }
.x7p.e15.is-tall .e15-side { flex-direction: row; }
.x7p.e15.is-tall .e15-pal { grid-template-columns: repeat(4, auto); }
@media (prefers-reduced-motion: reduce) { .e15-dot { animation: none; opacity: 0; } .e15-sw { transition: none; } }
`;

  function run(stage, ctx) {
    const X = BQ.ix7b, h = BQ.h;
    X.style('st-e15', CSS);
    const S = X.session(ctx);
    const V8 = X.v8();
    const root = X.root(ctx, 'e15', { board: true, panel: ['wide', 'tall'] });
    const fitH = () => { const H = stage.clientHeight || 600; root.style.setProperty('--H', H + 'px'); root.classList.toggle('is-short', H < 470); };
    if (!V8) {
      fitH();
      if (window.ResizeObserver) { const ro = new ResizeObserver(fitH); ro.observe(stage); ctx.onCleanup(() => ro.disconnect()); }
    }
    const page = h('div.e15-page', { role: 'img', 'aria-label': 'صَفْحَةُ التَّلْوينِ' }, h('div.e15-wait', null, '…'));
    const pageWrap = h('div.e15-pagewrap', null, page);
    let cur = 0;
    const sws = COLORS.map((c, i) => {
      const b = h('button.e15-sw', { type: 'button', 'aria-label': NAMES[i], 'aria-pressed': String(i === 0), dataset: { i } });
      b.style.setProperty('--c', c);
      b.addEventListener('click', () => { cur = i; sws.forEach((x, j) => x.setAttribute('aria-pressed', String(j === i))); X.anim(b, 'fx7-pop', 400); });
      return b;
    });
    const undoBtn = V8 ? h('button.bq8-btn.bq8-btn--replay.e15-undo8', { type: 'button', 'aria-label': 'تَراجُعٌ', disabled: true }, X.i8('replay')) : h('button.e15-tool', { type: 'button', 'aria-label': 'تَراجُعٌ', disabled: true }, X.icon('undo'));
    // زرّ واحد يبدّل الصفحة (صورة مصغّرة للصفحة الأخرى) ويضيء حين تكتمل الصفحة الأولى
    const goBtn = h('button.e15-sw2', { type: 'button', 'aria-label': 'الصَّفْحَةُ الأُخْرى' });
    const setSwitch = () => { goBtn.style.backgroundImage = 'url("' + ctx.img(PAGES[(pi + 1) % PAGES.length].key) + '")'; };
    const side = h('div.e15-side', null, h('div.e15-pal', { role: 'group', 'aria-label': 'الأَلْوانُ' }, sws), h('div.e15-tools', null, undoBtn, goBtn));
    root.append(pageWrap, side);
    const buddy = X.buddy(root);

    const state = PAGES.map(() => null); // لكلّ صفحة: {cv, g, w, h, lab, color(ImageData), line(img), fills:Map, undo:[], named:Set, n}
    let pi = 0, finished = false, doneSaid = false;
    async function load(i) {
      if (state[i]) return state[i];
      const img = new Image();
      img.decoding = 'async';
      img.src = ctx.img(PAGES[i].key);
      await new Promise((r) => { img.onload = r; img.onerror = r; });
      if (!img.naturalWidth) return null;
      const w = PW, hh = Math.round(PW * img.naturalHeight / img.naturalWidth);
      const cv = h('canvas', { width: w, height: hh });
      const g = cv.getContext('2d', { willReadFrequently: true });
      g.fillStyle = '#fff'; g.fillRect(0, 0, w, hh);
      g.drawImage(img, 0, 0, w, hh);
      const src = g.getImageData(0, 0, w, hh).data;
      // قناع المناطق: فاتح = قابل للتلوين · ثمّ تسمية المكوّنات المتّصلة (٤-جوار)
      const N = w * hh, lab = new Int32Array(N).fill(-1);
      const light = new Uint8Array(N);
      for (let p = 0, q = 0; p < N; p++, q += 4) light[p] = (src[q] * 0.299 + src[q + 1] * 0.587 + src[q + 2] * 0.114) > 175 ? 1 : 0;
      let n = 0; const sizes = []; const stack = new Int32Array(N);
      for (let p = 0; p < N; p++) {
        if (!light[p] || lab[p] >= 0) continue;
        let sp = 0, cnt = 0; stack[sp++] = p; lab[p] = n;
        while (sp) {
          const c = stack[--sp]; cnt++;
          const x = c % w;
          if (x > 0 && light[c - 1] && lab[c - 1] < 0) { lab[c - 1] = n; stack[sp++] = c - 1; }
          if (x < w - 1 && light[c + 1] && lab[c + 1] < 0) { lab[c + 1] = n; stack[sp++] = c + 1; }
          if (c >= w && light[c - w] && lab[c - w] < 0) { lab[c - w] = n; stack[sp++] = c - w; }
          if (c < N - w && light[c + w] && lab[c + w] < 0) { lab[c + w] = n; stack[sp++] = c + w; }
        }
        sizes.push(cnt); n++;
      }
      const color = g.createImageData(w, hh); color.data.fill(255);
      const st = { cv, g, w, h: hh, lab, sizes, color, line: img, fills: new Map(), undo: [], named: new Set(), bg: lab[w * 2 + 2] };
      draw(st);
      cv.addEventListener('pointerdown', (e) => tap(st, e));
      cv.addEventListener('contextmenu', (e) => e.preventDefault());
      state[i] = st;
      return st;
    }
    function draw(st) {
      st.g.globalCompositeOperation = 'source-over';
      st.g.putImageData(st.color, 0, 0);
      st.g.globalCompositeOperation = 'multiply';
      st.g.drawImage(st.line, 0, 0, st.w, st.h);
      st.g.globalCompositeOperation = 'source-over';
    }
    const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    function paint(st, r, col) {
      const d = st.color.data, lab = st.lab;
      const rgb = col ? hex(col) : [255, 255, 255];
      for (let p = 0, q = 0; p < lab.length; p++, q += 4) if (lab[p] === r) { d[q] = rgb[0]; d[q + 1] = rgb[1]; d[q + 2] = rgb[2]; }
      if (col) st.fills.set(r, col); else st.fills.delete(r);
      draw(st);
    }
    function regionAt(st, x, y) {
      const w = st.w;
      let r = st.lab[y * w + x];
      if (r >= 0 && st.sizes[r] > 25) return r;
      // على الخطّ: أقرب منطقة حقيقية حول نقطة اللمس
      for (let rad = 1; rad <= 10; rad++) for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
        const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= st.h) continue;
        r = st.lab[yy * w + xx]; if (r >= 0 && st.sizes[r] > 25) return r;
      }
      return -1;
    }
    function tap(st, e) {
      if (e.button && e.button !== 0) return;
      if (e.cancelable) e.preventDefault();
      const rc = st.cv.getBoundingClientRect();
      const fx = (e.clientX - rc.left) / rc.width, fy = (e.clientY - rc.top) / rc.height;
      const x = Math.max(0, Math.min(st.w - 1, Math.round(fx * st.w))), y = Math.max(0, Math.min(st.h - 1, Math.round(fy * st.h)));
      const r = regionAt(st, x, y); if (r < 0) return;
      const col = COLORS[cur];
      if (st.fills.get(r) === col) return;
      st.undo.push({ r, prev: st.fills.get(r) || null });
      undoBtn.disabled = false;
      paint(st, r, col);
      const dot = h('span.e15-dot', { 'aria-hidden': 'true', style: { left: (fx * 100) + '%', top: (fy * 100) + '%', background: col } });
      page.append(dot); setTimeout(() => dot.remove(), 600);
      S.fx(X.sfx.snap, 0.25);
      // اسم الشيء أوّل مرّة (الصفحة ٢: الشبكة ٢×٣؛ لا خلفية)
      const grid = PAGES[pi].grid;
      if (grid && r !== st.bg && st.sizes[r] < st.w * st.h * 0.25) {
        const row = Math.min(2, Math.floor(fy * 3)), colI = fx < 0.5 ? 0 : 1;
        const k = grid[row][colI];
        if (!st.named.has(k)) { st.named.add(k); S.say(X.wordId(k), { stim: true }); buddy.mood('talk', 1000); }
      }
      const filled = st.fills.size;
      if (filled % 5 === 0) buddy.mood('clap', 1400);
      if (filled >= PAGES[pi].min) {
        if (pi < PAGES.length - 1) goBtn.classList.add('is-go');
        else if (!doneSaid) { doneSaid = true; complete(); }
      }
    }
    undoBtn.addEventListener('click', () => {
      const st = state[pi]; if (!st || !st.undo.length) return;
      const u = st.undo.pop(); paint(st, u.r, u.prev);
      undoBtn.disabled = !st.undo.length;
    });
    goBtn.addEventListener('click', () => show((pi + 1) % PAGES.length));
    async function show(i) {
      if (i < 0 || i >= PAGES.length) return;
      pi = i;
      setSwitch();
      goBtn.classList.remove('is-go');
      page.replaceChildren(h('div.e15-wait', null, '…'));
      const st = await load(i);
      if (!S.live || pi !== i) return;
      page.replaceChildren(st ? st.cv : h('div.e15-wait', null, '…'));
      undoBtn.disabled = !(st && st.undo.length);
      if (st && i < PAGES.length - 1 && st.fills.size >= PAGES[i].min) goBtn.classList.add('is-go');
    }
    async function complete() {
      buddy.mood('cheer', 3500);
      X.burst(page, 14);
      await S.say('bq7_E15_done');
      if (!finished) { finished = true; ctx.done(); }
      note();
    }

    note();
    (async () => {
      await show(0);
      ctx.instruction(X.text('bq7_E15_intro'), 'bq7_E15_intro', { icon: V8 ? 'touch' : 'hand' });
      await X.nameSound(S, 'bq7_E15_intro');
      load(1); // تحميل مسبق للصفحة الثانية
    })();

    function note() {
      const b1 = h('button', { type: 'button', class: 'bq-btn ghost', onclick: () => X.print([{ img: ctx.img('color_page1') }, { img: ctx.img('color_page2') }], { title: 'لوّن — صوت الميم' }) }, 'اطبع الصفحتين للتلوين (A4)');
      const b2 = h('button', { type: 'button', class: 'bq-btn ghost', onclick: () => { const pgs = state.filter(Boolean).map((st) => ({ img: st.cv.toDataURL('image/png') })); if (pgs.length) X.print(pgs, { title: 'تلوين الطفل' }); } }, 'اطبع ما لوّنه الطفل');
      X.note(ctx, h('div', null,
        h('div', { html: '<p><b>ما يجري:</b> يختار الطفل لوناً ثم يلمس منطقة فتتلوّن (الصفحة ١: «م» كبيرة مع بارق · الصفحة ٢: مانجو، موز، قمر، مشط، مفتاح، تمساح — لمس الشيء أوّل مرّة يُسمِع اسمه). «تراجع» يلغي آخر تلوين.</p>' +
          '<p><b>اسأله أثناء التلوين:</b> «ما هذا؟ أين الميم في اسمه؟» — دون ضغط؛ هذا نشاط تعزيز غير مسجَّل.</p>' }),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, b1, b2)));
    }
  }

  BQ.register(ID, {
    render(stage, ctx) {
      BQ.loadScript('js/el7/ix7b.js').then(() => { if (ctx.alive()) run(stage, ctx); })
        .catch((e) => { console.warn('[E15] ' + e.message); if (ctx.placeholder) ctx.placeholder(); });
    },
  });
})();
