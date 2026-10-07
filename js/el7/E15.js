/* E15 · لَوِّنْ — IX2 (+ART) · v7 · draft_unapproved · SPEC_v7 §E15 · تعزيز (5 · 8) · غير مسجَّل
   بعده: يتأمّل شكل «م» ويستدعي أسماء الأشياء أثناء التلوين.
   على الشاشة: color_page1 (م كبيرة مع بارق) ثم color_page2 (مانجو، موز، قمر، مشط، مفتاح، تمساح) · لوحة ٨ ألوان كبيرة ·
   لمس منطقة = تعبئة (تعبئة فيضية على لوحة رسم من فنّ الخطوط؛ الخطوط تبقى سوداء بالمزج «ضرب») · لمس شيء أوّل مرّة يُسمِع اسمه (bq7_W_*) ·
   زرّ «تَراجُع» أيقونة · الانتهاء bq7_E15_done. الطباعة A4 من دليل المعلّم فقط (لا زرّ «اطبع» على شاشة الطفل).
   v8 (?theme=8): إعادة تلبيس — اللوح الخشبيّ، الصفحة ورقة بيضاء بإطار ملصق، الألوان أقراص ملصقات، «تراجع» زرّ ملصق.
   OWNER_R3 E15 (2026-10-05): (١) الختام القياسيّ: بعد تلوين ٣ مناطق أو الحرف يُسجَّل الإنجاز (ctx.done) + bq7_E15_done ويظهر زرّ «التّالي»
   (bq8-pill ≥٦٤px) يفتح ورقة الختام الموحّدة (X.end ← BQ.ui.endCard: «أَحْسَنْتَ!» + «التّالي» + «أَعِدْ») مع bq7_G_end.
   (٢) التعبئة للمناطق المغلقة فقط: خلفية الصفحة (كلّ منطقة تلمس حافّة الصورة) وأيّ منطقة أكبر من ٢٢٪ من الصفحة (بطاقة الحرف) لا تتلوّن أبداً.
   v8 E15 meem glyph (2026-10-05 · OWNER_R3 «حرف الـ م به خطأ»): «م» الصفحة ١ كانت شكلاً مرسوماً (راية بلا فراغ) داخل color_page1.webp (ART).
   الآن: media/img8/color_page1_meem8.webp = color_page1_blank + «م» المنفصلة (U+0645) من خطّ Vazirmatn Bold (خطّ الحرف v8)، محيط الحرف
   مرسوم من مخطّط الحرف نفسه (fontTools) بخطّ أسود ١٢px مثل إطار البطاقة. جسم الحرف (الرأس + الذيل) منطقة واحدة، والفراغ الدائريّ منطقة مستقلّة
   تبقى بيضاء حين يُلوَّن الجسم. letter = نقطة داخل الجسم (لا الفراغ). السكربت: v7/ix2_v8/meem_page1/render.py */
(function () {
  'use strict';
  const ID = 'E15';
  const COLORS = ['#E4553F', '#FF9F1C', '#FEBA02', '#3DBB6B', '#00AEED', '#2E6CA6', '#8E6CD9', '#8B5A2B'];
  const NAMES = ['أَحْمَرُ', 'بُرْتُقالِيٌّ', 'أَصْفَرُ', 'أَخْضَرُ', 'أَزْرَقُ فاتِحٌ', 'أَزْرَقُ', 'بَنَفْسَجِيٌّ', 'بُنِّيٌّ'];
  /* SCI-1 T3 (2026-10-07) «لابد من تلوين أشياء تبدأ بالميم، وهو لوّن الحرف فقط» → ONE page: the correct Vazirmatn «م» (empty counter) +
     pictures of things that START with م; instruction «لَوِّنْ حَرْفَ المِيمِ، وَلَوِّنِ الصُّوَرَ الَّتي فيها صَوْتُ المِيمِ» (bq7_E15_intro8);
     done = the letter + at least 2 pictures. Page = media/img8/color_page_m8.webp made by v7/ix2_v8/e15_page8/build.py from T5's line art
     img8/color_page_m8_raw.png (6 pictures: مُشْط مِفْتاح مَوْز / مَكْتَب مِظَلَّة مانْجو + an empty frame) with the Vazirmatn «م» set in the frame:
     `python3 build.py <raw> musht miftah mawz maktab mizalla manju --frame=260,138,1339,629` → JSON pasted here. card = the frame (backdrop, never filled).
     letter = a point inside the «م» body · hole = the counter (its own region, never «the letter») · objects = picture boxes (page fractions) →
     a coloured region counts for the picture whose box holds its centre; the picture's name is said the first time it is coloured. */
  const PAGES = [{ key: 'color_page_m8', src: 'media/img8/color_page_m8.webp', letter: [0.4656, 0.1445], hole: [0.5294, 0.1246], card: [0.1812, 0.0742],
    objects: [{ k: 'musht', box: [0.6269, 0.3358, 0.9825, 0.5811] },
      { k: 'miftah', box: [0.3869, 0.3137, 0.6381, 0.5974] },
      { k: 'mawz', box: [0.0169, 0.3248, 0.3525, 0.5926] },
      { k: 'maktab', box: [0.6544, 0.658, 0.9844, 0.8979] },
      { k: 'mizalla', box: [0.3256, 0.6297, 0.6569, 0.8953] },
      { k: 'manju', box: [0.0281, 0.6253, 0.3175, 0.901] }] }];
  const MIN_OBJ = 2;        // done = the letter + ≥ 2 pictures (SCI-1)
  const BG_MAX = 0.22;      // منطقة أكبر من هذا (نسبة من الصفحة) = خلفية/بطاقة، لا تُلوَّن
  const PW = 760; // دقّة المعالجة (العرض بالبكسل)

  const CSS = `
.e15 { flex-direction: row; align-items: stretch; justify-content: center; gap: clamp(10px, 2.4cqi, 24px); }
.e15-pagewrap { position: relative; flex: 0 1 auto; display: flex; align-items: center; justify-content: center; min-width: 0; }
.e15-page { position: relative; height: calc(var(--H, 600px) - 28px); width: calc((var(--H, 600px) - 28px) * 0.7071); aspect-ratio: 1600 / 2263; max-width: 100%; border-radius: 16px; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 14px 28px var(--shade); overflow: hidden; touch-action: none; }
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
  .e15-page { height: calc(var(--H, 600px) - 150px); width: calc((var(--H, 600px) - 150px) * 0.7071); }
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
.e15-fin { flex: none; display: flex; align-items: center; justify-content: center; }
.e15-fin[hidden] { display: flex !important; visibility: hidden; }
.e15-finbtn { min-height: 64px; min-width: 64px; }
.e15-dot.is-no { background: transparent !important; border: 3px solid rgba(11,45,79,.35); }
.x7p.e15 .e15-finbtn { flex-direction: column; justify-content: center; gap: calc(var(--u)*4); min-width: max(64px, calc(var(--u)*132)); min-height: max(64px, calc(var(--u)*132));
  padding: calc(var(--u)*12) calc(var(--u)*16) calc(var(--u)*20); border-radius: calc(var(--u)*34); font: 700 max(20px, calc(var(--u)*30))/1.6 var(--font-ui); }
.x7p.e15 .e15-finbtn .bq8-ic { font-size: max(40px, calc(var(--u)*62)); margin: 0; }
.x7p.e15 .e15-finbtn.is-pulse { animation: e15Glow 1.6s ease-in-out 4; }
@keyframes e15Glow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
.x7p.e15.is-tall .e15-finbtn { min-width: max(64px, calc(var(--u)*110)); min-height: max(64px, calc(var(--u)*110)); }
@container stage (max-width: 620px) { .e15:not(.x7p) .e15-fin { order: 3; } }
@media (prefers-reduced-motion: reduce) { .e15-dot { animation: none; opacity: 0; } .e15-sw { transition: none; } .x7p.e15 .e15-finbtn.is-pulse { animation: none; } }
/* ---------- v8 iPad fix (OWNER_R3 2026-10-06 «لا يعرض الصورة للتلوين — المقاس به مشكلة») ----------
   iPad Safari / WebKit collapsed the page to its 5-px border: «height + aspect-ratio + max-width:100%» inside a shrink-to-fit flex item
   (.e15-pagewrap flex 0 1 auto) gave the wrapper a 0 max-content width → the canvas was drawn but 0 px wide (only the palette showed).
   Now the page has an EXPLICIT width AND height in stage units (no aspect-ratio, no % max-width), the wrapper never shrinks, and the board
   is filled: page (480 u tall) | palette 4×2 + tools row (undo · other page · «التّالي»). The fixed 1180×820 stage keeps this in portrait too. */
.x7p.e15 { gap: calc(var(--u)*56); padding: calc(var(--u)*6) calc(var(--u)*24); }
.x7p.e15 .e15-pagewrap { flex: none; }
.x7p.e15 .e15-page, .x7p.e15.is-tall .e15-page { height: calc(var(--u)*480); width: calc(var(--u)*339.4); aspect-ratio: auto; max-width: none; min-width: 0; flex: none; }
.x7p.e15 .e15-page > canvas, .x7p.e15 .e15-page > img.e15-img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: fill; }
.x7p.e15 .e15-side, .x7p.e15.is-tall .e15-side { flex-direction: column; gap: calc(var(--u)*30); }
.x7p.e15 .e15-pal, .x7p.e15.is-tall .e15-pal { grid-template-columns: repeat(4, auto); gap: calc(var(--u)*22) calc(var(--u)*20); }
.x7p.e15 .e15-sw { width: calc(var(--u)*86); height: calc(var(--u)*86); }
.x7p.e15 .e15-tools { flex-direction: row; gap: calc(var(--u)*28); }
.x7p.e15 .e15-undo8 { width: calc(var(--u)*96); height: calc(var(--u)*96); }
.x7p.e15 .e15-sw2 { width: calc(var(--u)*86); height: calc(var(--u)*120); }
.x7p.e15 .e15-tools > .e15-fin { margin-inline-start: calc(var(--u)*10); }
.x7p.e15 .e15-finbtn, .x7p.e15.is-tall .e15-finbtn { min-width: calc(var(--u)*132); min-height: calc(var(--u)*132); }
/* FIX12-B B-10: a bigger sheet. The A4 art is portrait, so the board HEIGHT is the limit: the page now fills the board height (570 u, was 480 u)
   and shows only the drawing (the empty paper margins are cropped: content box x 13–1590 · y 105–2054 of 1600×2263) → ≈ 1.6× the area.
   Taps still map through the canvas rect (getBoundingClientRect), so the crop needs no change in the fill code. */
.x7p.e15 { gap: calc(var(--u)*44); padding: 0 calc(var(--u)*20); }
.x7p.e15 .e15-page, .x7p.e15.is-tall .e15-page { height: calc(var(--u)*570); width: calc(var(--u)*461.2); overflow: hidden; }
.x7p.e15 .e15-page > canvas, .x7p.e15 .e15-page > img.e15-img { inset: auto; left: -0.824%; top: -5.387%; width: 101.458%; height: 116.11%; }
.x7p.e15 .e15-pal, .x7p.e15.is-tall .e15-pal { gap: calc(var(--u)*18) calc(var(--u)*16); }
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
    const srcOf = (i) => PAGES[i].src || ctx.img(PAGES[i].key);
    const setSwitch = () => { goBtn.style.backgroundImage = 'url("' + srcOf((pi + 1) % PAGES.length) + '")'; };
    const side = h('div.e15-side', null, h('div.e15-pal', { role: 'group', 'aria-label': 'الأَلْوانُ' }, sws), h('div.e15-tools', null, undoBtn, PAGES.length > 1 ? goBtn : null));
    // زرّ الختام «التّالي» — مخفيّ (يحجز مكانه) حتى يلوّن الطفل قدراً معقولاً
    const finLbl = h('span.e15-finlbl', null, 'التَّالِي'); // FIX12-B: one full-tashkeel form (A-05)
    const finBtn = V8 ? h('button.bq8-pill.e15-finbtn', { type: 'button', 'aria-label': 'التَّالِي' }, X.i8('next'), finLbl)
      : h('button.x7-btn.e15-finbtn', { type: 'button', 'aria-label': 'التَّالِي' }, finLbl, X.icon('next'));
    const fin = h('div.e15-fin', { hidden: true }, finBtn);
    if (V8) { side.lastChild.append(fin); root.append(pageWrap, side); } // v8: «التّالي» sits in the tools row under the palette
    else root.append(pageWrap, side, fin);
    const buddy = X.buddy(root);

    const state = PAGES.map(() => null); // لكلّ صفحة: {cv, g, w, h, lab, color(ImageData), line(img), fills:Map, undo:[], named:Set, n}
    let pi = 0, ready = false, ended = false;
    /* iPad-safe load (OWNER_R3 2026-10-06): decode the page with img.decode() (falls back to onload), draw it on a SMALL 2D canvas
       (backing store PW × ≈1.41 PW ≈ 0.8 Mpx ≤ the 4 Mpx cap — never × devicePixelRatio, never OffscreenCanvas/createImageBitmap/ImageDecoder).
       If the canvas cannot be read (context lost, memory limit, tainted) the plain <img> is shown instead so the picture is never blank. */
    const MAXPX = 4e6;
    async function decodeImg(src) {
      const img = new Image();
      img.decoding = 'async';
      const loaded = new Promise((r) => { img.onload = () => r(true); img.onerror = () => r(false); });
      img.src = src;
      let ok = false;
      if (img.decode) { try { await img.decode(); ok = true; } catch (e) { ok = await loaded; } } else ok = await loaded;
      if (!ok && !img.complete) ok = await loaded;
      return img.naturalWidth ? img : null;
    }
    function fallback(i, img) {
      const el = h('img.e15-img', { src: img ? img.src : srcOf(i), alt: '', draggable: 'false', width: 1600, height: 2263 });
      return { fallback: true, cv: el, undo: [], fills: new Map(), named: new Set() };
    }
    async function load(i) {
      if (state[i]) return state[i];
      const img = await decodeImg(srcOf(i));
      if (!img) return null;
      let w = PW, hh = Math.round(PW * img.naturalHeight / img.naturalWidth);
      if (w * hh > MAXPX) { const k = Math.sqrt(MAXPX / (w * hh)); w = Math.floor(w * k); hh = Math.floor(hh * k); }
      const cv = h('canvas', { width: w, height: hh });
      let g = null, src = null;
      try {
        g = cv.getContext('2d', { willReadFrequently: true }) || cv.getContext('2d');
        if (g) {
          g.fillStyle = '#fff'; g.fillRect(0, 0, w, hh);
          g.drawImage(img, 0, 0, w, hh);
          src = g.getImageData(0, 0, w, hh).data;
        }
      } catch (e) { console.warn('[E15] canvas ' + e.message); src = null; }
      if (!g || !src || cv.width !== w) { state[i] = fallback(i, img); return state[i]; }
      // قناع المناطق: فاتح = قابل للتلوين · ثمّ تسمية المكوّنات المتّصلة (٤-جوار)
      const N = w * hh, lab = new Int32Array(N).fill(-1);
      const light = new Uint8Array(N);
      for (let p = 0, q = 0; p < N; p++, q += 4) light[p] = (src[q] * 0.299 + src[q + 1] * 0.587 + src[q + 2] * 0.114) > 175 ? 1 : 0;
      let n = 0; const sizes = [], cxs = [], cys = []; const stack = new Int32Array(N);
      for (let p = 0; p < N; p++) {
        if (!light[p] || lab[p] >= 0) continue;
        let sp = 0, cnt = 0, sx = 0, sy = 0; stack[sp++] = p; lab[p] = n;
        while (sp) {
          const c = stack[--sp]; cnt++;
          const x = c % w; sx += x; sy += (c - x) / w;
          if (x > 0 && light[c - 1] && lab[c - 1] < 0) { lab[c - 1] = n; stack[sp++] = c - 1; }
          if (x < w - 1 && light[c + 1] && lab[c + 1] < 0) { lab[c + 1] = n; stack[sp++] = c + 1; }
          if (c >= w && light[c - w] && lab[c - w] < 0) { lab[c - w] = n; stack[sp++] = c - w; }
          if (c < N - w && light[c + w] && lab[c + w] < 0) { lab[c + w] = n; stack[sp++] = c + w; }
        }
        sizes.push(cnt); cxs.push(sx / cnt / w); cys.push(sy / cnt / hh); n++;
      }
      const color = g.createImageData(w, hh); color.data.fill(255);
      // الخلفية: كلّ منطقة تلمس حافّة الصورة + كلّ منطقة كبيرة جدّاً (بطاقة/ورقة) — لا تُلوَّن أبداً
      const blocked = new Set();
      for (let x = 0; x < w; x++) { blocked.add(lab[x]); blocked.add(lab[N - w + x]); }
      for (let y = 0; y < hh; y++) { blocked.add(lab[y * w]); blocked.add(lab[y * w + w - 1]); }
      sizes.forEach((c, r) => { if (c > N * BG_MAX) blocked.add(r); });
      if (PAGES[i].card) blocked.add(lab[Math.round(PAGES[i].card[1] * hh) * w + Math.round(PAGES[i].card[0] * w)]); // بطاقة الحرف = خلفية دائماً (≈٢٢٪ بعد الحرف الجديد، فلا نعتمد على BG_MAX وحده)
      blocked.delete(-1);
      let letter = -1;
      if (PAGES[i].letter) {
        const lx = Math.round(PAGES[i].letter[0] * w), ly = Math.round(PAGES[i].letter[1] * hh), r = lab[ly * w + lx];
        if (r >= 0 && !blocked.has(r) && sizes[r] > N * 0.004) letter = r;
      }
      const hole = PAGES[i].hole ? lab[Math.round(PAGES[i].hole[1] * hh) * w + Math.round(PAGES[i].hole[0] * w)] : -1;
      if (hole >= 0 && hole === letter) letter = -1; // الفراغ ليس جسم الحرف
      // every region → the picture it belongs to (its centre inside the picture box) · -1 = letter / decoration
      const objs = PAGES[i].objects || [];
      const objOf = sizes.map((c, r) => { if (r === letter || r === hole) return -1; const x = cxs[r], y = cys[r]; return objs.findIndex((o) => x >= o.box[0] && x <= o.box[2] && y >= o.box[1] && y <= o.box[3]); });
      const st = { cv, g, w, h: hh, lab, sizes, color, line: img, fills: new Map(), undo: [], named: new Set(), blocked, letter, hole, objOf, objs, bg: lab[w * 2 + 2] };
      try { draw(st); } catch (e) { console.warn('[E15] draw ' + e.message); state[i] = fallback(i, img); return state[i]; }
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
    const ok = (st, r) => r >= 0 && st.sizes[r] > 25 && !st.blocked.has(r);
    function regionAt(st, x, y) {
      const w = st.w;
      let r = st.lab[y * w + x];
      if (r >= 0 && st.blocked.has(r)) return -1; // لمس الخلفية/خارج الرسم: لا تعبئة
      if (ok(st, r)) return r;
      // على الخطّ: أقرب منطقة حقيقية حول نقطة اللمس
      for (let rad = 1; rad <= 10; rad++) for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
        const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= st.h) continue;
        r = st.lab[yy * w + xx]; if (ok(st, r)) return r;
      }
      return -1;
    }
    // the tap ring sits where the finger is, in % of the (cropped) page box
    const px = (e) => { const pr = page.getBoundingClientRect(); return (e.clientX - pr.left) / pr.width * 100; };
    const py = (e) => { const pr = page.getBoundingClientRect(); return (e.clientY - pr.top) / pr.height * 100; };
    function tap(st, e) {
      if (st.fallback || (e.button && e.button !== 0)) return;
      if (e.cancelable) e.preventDefault();
      const rc = st.cv.getBoundingClientRect();
      const fx = (e.clientX - rc.left) / rc.width, fy = (e.clientY - rc.top) / rc.height;
      const x = Math.max(0, Math.min(st.w - 1, Math.round(fx * st.w))), y = Math.max(0, Math.min(st.h - 1, Math.round(fy * st.h)));
      const r = regionAt(st, x, y);
      if (r < 0) { // لا شيء يُلوَّن هنا: حلقة خفيفة فقط
        const no = h('span.e15-dot.is-no', { 'aria-hidden': 'true', style: { left: px(e) + '%', top: py(e) + '%' } });
        page.append(no); setTimeout(() => no.remove(), 600);
        return;
      }
      const col = COLORS[cur];
      if (st.fills.get(r) === col) return;
      st.undo.push({ r, prev: st.fills.get(r) || null });
      undoBtn.disabled = false;
      paint(st, r, col);
      const dot = h('span.e15-dot', { 'aria-hidden': 'true', style: { left: px(e) + '%', top: py(e) + '%', background: col } });
      page.append(dot); setTimeout(() => dot.remove(), 600);
      S.fx(X.sfx.snap, 0.25);
      // the picture's name, the first time it gets colour
      const oi = st.objOf[r], o = oi >= 0 ? st.objs[oi] : null;
      let talk = null;
      if (o && o.k && !st.named.has(o.k)) { st.named.add(o.k); talk = S.say(X.wordId(o.k), { stim: true }); buddy.mood('talk', 1000); }
      const filled = st.fills.size;
      if (filled % 5 === 0) buddy.mood('clap', 1400);
      if (enough(st)) { if (!ready) Promise.resolve(talk).then(becomeReady); }
      else if (!ready && !st.reminded && objCount(st) >= MIN_OBJ && !st.fills.has(st.letter) && st.letter >= 0) {
        // pictures done, the letter not yet: Bariq points at the «م» once
        st.reminded = true; Promise.resolve(talk).then(() => { X.anim(page, 'fx7-pop', 400); return S.say('bq7_E15_intro8'); });
      }
    }
    /** pictures with at least one coloured region */
    const objCount = (st) => { const s = new Set(); st.fills.forEach((c, r) => { const oi = st.objOf ? st.objOf[r] : -1; if (oi >= 0) s.add(oi); }); return s.size; };
    const enough = (st) => !!st && (st.fallback || ((st.letter < 0 || st.fills.has(st.letter)) && objCount(st) >= Math.min(MIN_OBJ, (st.objs || []).length)));
    function glowOther() { /* one page only (SCI-1) */ }
    async function becomeReady() {
      if (ready) return;
      ready = true;
      ctx.done(); // يُسجَّل الإنجاز فوراً (سهم «التّالي» في المنصّة يعمل أيضاً)
      glowOther();
      fin.hidden = false;
      X.anim(finBtn, 'fx7-pop', 500);
      if (V8) finBtn.classList.add('is-pulse');
      if (X.fitInk) requestAnimationFrame(() => X.fitInk(finLbl, finBtn, { grow: true }));
      buddy.mood('cheer', 3000);
      X.burst(page, 14);
      await S.say('bq7_E15_done'); // «ما أَجْمَلَ أَلْوانَكَ!»
    }
    finBtn.addEventListener('click', () => {
      if (ended || !S.live) return; ended = true;
      finBtn.classList.remove('is-pulse');
      if (!BQ.state.done.has(ctx.meta.id)) ctx.done();
      buddy.mood('cheer', 3000);
      X.end(ctx, S, { line: ['bq7_G_end', 'bq7_G_yes2'] }); // ورقة الختام الموحّدة + «أَحْسَنْتَ! أَنْهَيْتَ النَّشاطَ.»
      setTimeout(() => { ended = false; }, 800);
    });
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
      if (st && st.fallback && !ready) becomeReady(); // no canvas (memory/taint): the picture is shown, the child can still finish
    }

    /* iOS may drop a canvas backing store while the tab is hidden or the stage is re-scaled → repaint the current page from its data */
    const repaint = () => { const st = state[pi]; if (st && !st.fallback && S.live) { try { draw(st); } catch (e) { /* */ } } };
    const onVis = () => { if (document.visibilityState === 'visible') requestAnimationFrame(repaint); };
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('bq-stagefit', repaint);
    window.addEventListener('pageshow', repaint);
    ctx.onCleanup(() => { document.removeEventListener('visibilitychange', onVis); document.removeEventListener('bq-stagefit', repaint); window.removeEventListener('pageshow', repaint); });

    note();
    (async () => {
      await show(0);
      ctx.instruction(X.text('bq7_E15_intro8'), 'bq7_E15_intro8', { icon: V8 ? 'touch' : 'hand' });
      await S.say('bq7_E15_intro8'); // SCI-1 wording verbatim (the letter + the pictures)
    })();

    function note() {
      const b1 = h('button', { type: 'button', class: 'bq-btn ghost', onclick: () => X.print(PAGES.map((p, i) => ({ img: srcOf(i) })), { title: 'لوّن — صوت الميم' }) }, 'اطبع صفحة التلوين (A4)');
      const b2 = h('button', { type: 'button', class: 'bq-btn ghost', onclick: () => { const pgs = state.filter((st) => st && !st.fallback).map((st) => ({ img: st.cv.toDataURL('image/png') })); if (pgs.length) X.print(pgs, { title: 'تلوين الطفل' }); } }, 'اطبع ما لوّنه الطفل');
      X.note(ctx, h('div', null,
        h('div', { html: '<p><b>ما يجري:</b> «لَوِّن حَرْفَ المِيمِ، وَلَوِّنِ الصُّوَرَ الَّتي فيها صَوْتُ المِيمِ». صفحة واحدة: «م» بشكلها الصحيح (رأس مستدير مفرَّغ وذيل) في إطار، وستّ صور أشياء تبدأ بصوت الميم (مُشط، مِفتاح، مَوز، مَكتب، مِظلّة، مانجو). يختار الطفل لوناً ثم يلمس منطقة فتتلوّن، وأوّل تلوين لكلّ صورة يُسمِع اسمها. «تراجع» يلغي آخر تلوين. خلفية الصفحة لا تتلوّن. حين يلوّن الحرف وصورتين على الأقلّ يظهر «التّالي» ويُسجَّل النشاط منجزاً، ويمكنه أن يكمل التلوين.</p>' +
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
