/* ix7b.js — أدوات مشتركة لفريق IX2 (E08 · E09 · E11 · E14 · E15) — بارق v7 · L1-01-d1 «صَوْتُ «م»» · draft_unapproved
   يُحمَّل كسولاً: await BQ.loadScript('js/el7/ix7b.js') — لا يعدّل المنصّة؛ يستعمل عقدها فقط (PLATFORM_status.md):
   ctx.say · ctx.instruction · ctx.record · ctx.img/hasImg · ctx.hasAudio · ctx.adultNote · ctx.done · BQ.h · BQ.ui.brq · BQ.audio.
   ─ الصوت: السطر يُشغَّل عبر ctx.say؛ لكلّ مقطع/كلمة قائمة مرشّحين (معرّفات محتملة من فريق الصوت) يُختار أوّل ما له ملفّ،
     وإن لم يوجد شيء يظهر النصّ المصاحب بزمن تقديريّ (العنصر يعمل في كلّ حال).
   ─ الصور: ctx.img(key) (media/img7/<key>.webp أو بديل محايد من المنصّة) + بطاقة احتياطية بالكلمة إن لم تُدرج الصورة.
   ─ السحب: أحداث المؤشّر (إصبع/فأرة/قلم) + بديل «المس ثم المس» + لوحة المفاتيح.
   ─ الكتابة: محرّك تتبّع v6 المعتمد للّمس (نقطة بدء + سهم اتّجاه + سماحية) معمَّم لأشكال الميم الأربعة: م · مـ · ـمـ · ـم. */
(function () {
  'use strict';
  const BQ = window.BQ; if (!BQ || BQ.ix7b) return;
  const h = BQ.h;
  const X = {};
  const never = () => new Promise(() => {});
  const AR = BQ.AR || ((n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]));
  const reduced = () => (BQ.reduced ? BQ.reduced() : false);
  X.AR = AR; X.never = never; X.reduced = reduced;
  const ZWJ = '‍';

  /* ================= النصوص ================= */
  /* الأسطر كلّها من LINES_v7.json (بيانات المنصّة: BQ.line). هنا احتياط للنصّ المصاحب فقط إن غاب السطر من البيانات. */
  const T = (X.T = {});
  X.text = (id) => { const L = BQ.line && BQ.line(id); if (L && L.t) return L.t; return T[id] ? T[id][1] : ''; };
  X.addText = (map) => Object.assign(T, map);
  const YES = ['bq7_G_yes1', 'bq7_G_yes2', 'bq7_G_yes3', 'bq7_G_yes4'];
  let yesI = 0;
  // FB-1: praise / retry / «Bariq solved» lines come from the ONE shared pool (js/fb.js · BQ.fb); local fallback only if it is missing
  X.yes = () => (BQ.fb ? BQ.fb.yes() : YES[yesI++ % YES.length]);
  X.tryL = () => (BQ.fb ? BQ.fb.tryL() : 'bq7_G_try');
  X.solveL = () => (BQ.fb ? BQ.fb.solveL() : 'bq7_E11_fb_solve1');
  X.G = { try: 'bq7_G_try', listen: 'bq7_G_listen_again', hintStart: 'bq7_G_hint_start', light: 'bq7_G_look_light', shape: 'bq7_G_look_shape', model: 'bq7_G_model', next: 'bq7_G_next', choose: 'bq7_G_listen_choose', end: 'bq7_G_end', pos: { ini: 'bq7_G_pos_first', mid: 'bq7_G_pos_mid', fin: 'bq7_G_pos_last' } };

  /* ================= المفردات والمقاطع (SPEC v7 · DECISIONS و) ================= */
  /* الكلمة تُنطق بالوقف وتُكتب بلا سكون على آخر حرف (OWNER_R3 2026-10-06 · nosukun.js) · img: card_<k> · au: bq7_W_<k> · seg: bq7_W_<k>_seg */
  const W = (X.W = {
    maktab: { t: 'مَكْتَب', syl: ['مَكْ', 'تَب'], pos: 'ini' },
    musht: { t: 'مُشْط', syl: ['مُ', 'شْط'], pos: 'ini' },
    miftah: { t: 'مِفْتاح', syl: ['مِفْ', 'تاح'], pos: 'ini' },
    timsah: { t: 'تِمْساح', syl: ['تِمْ', 'ساح'], pos: 'mid' },
    manju: { t: 'مانْجو', syl: ['ما', 'نْجو'], pos: 'ini' },
    numur: { t: 'نُمُور', syl: ['نُ', 'مُور'], letters: ['نُ', 'مُ', 'و', 'ر'], pos: 'mid' }, // FIX12-B B-01: replaces «قَمَر» in E08 «حَلِّل» (middle م)
    qamis: { t: 'قَميص', syl: ['قَ', 'ميص'], pos: 'mid' },
    mawz: { t: 'مَوْز', letters: ['مَ', 'وْ', 'ز'], pos: 'ini' },
    // FIX12-B B-01: «قَمَر» removed everywhere (owner: no «قَمَر» — مُعَلِّم / مُثَلَّث / نُمُور)
    fam: { t: 'فَم', letters: ['فَ', 'م'], pos: 'fin' },
    qalam: { t: 'قَلَم', letters: ['قَ', 'لَ', 'م'], pos: 'fin' },
    // مشتِّتات سمعية/صورية فقط (لا تُكتب على شاشة الطفل — قرار أ)
    bab: { t: 'باب', dis: true }, fil: { t: 'فيل', dis: true }, batta: { t: 'بَطَّة', dis: true }, farasha: { t: 'فَراشَة', dis: true }, kura: { t: 'كُرَة', dis: true },
  });
  /* SCI-1 T3 (2026-10-07, additive): مُ-initial words that replace «قَمَر» in E11 (SCI «نغيّر كلمة قمر ونجيب كلمة تبدأ بالميم مضمومة: مُثلث / مُعلّم»).
     Picture: T5 media/img8/w8_<k>.webp once listed in X.IMG8 (or D.img8) — until then an inline drawing (ph) — never a request for a missing file.
     Audio: T2 bq7_W_<k>; until it exists, T3's own HAB take bq7_W_<k>_t3 (X.wordId resolves to the first one that has a file). */
  W.muthallath = { t: 'مُثَلَّث', pos: 'ini', img8: 'w8_muthallath', alt: 'bq7_W_muthallath_t3' };
  W.muallim = { t: 'مُعَلِّم', pos: 'ini', img8: 'w8_muallim', alt: 'bq7_W_muallim_t3' };
  Object.keys(W).forEach((k) => { const w = W[k]; w.key = k; w.img = 'card_' + k; w.au = 'bq7_W_' + k; w.seg = 'bq7_W_' + k + '_seg'; T[w.au] = ['HAB', w.t]; });
  /** img8 keys known to exist (img8 is not indexed in data.js yet) — T5 adds w8_muallim / w8_muthallath here when the files land */
  X.IMG8 = new Set(['w8_muthallath', 'w8_muallim']); // T5 delivered 2026-10-07
  X.has8 = (k) => !!k && !!((BQ.D && BQ.D.img8 && BQ.D.img8[k]) || X.IMG8.has(k));
  const PH8 = {
    w8_muthallath: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#FFF7E6"/><path d="M200 70 345 320H55z" fill="#FFC21A" stroke="#0B2D4F" stroke-width="16" stroke-linejoin="round"/><path d="M200 112 300 286" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".55"/></svg>',
    w8_muallim: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#EAF6FF"/><rect x="40" y="60" width="320" height="190" rx="14" fill="#2E7D5B" stroke="#0B2D4F" stroke-width="12"/><circle cx="200" cy="270" r="48" fill="#F6C9A0" stroke="#0B2D4F" stroke-width="10"/><path d="M110 380c10-50 45-70 90-70s80 20 90 70" fill="#3D7BF0" stroke="#0B2D4F" stroke-width="10"/></svg>',
  };
  /** picture of word k: T5 img8 when present · inline drawing for the new words · else the img7 card */
  X.wimg = function (ctx, k) {
    const w = W[k]; if (!w) return '';
    if (w.img8 && X.has8(w.img8)) return (BQ.D && BQ.D.img8 && BQ.D.img8[w.img8]) || 'media/img8/' + w.img8 + '.webp';
    if (w.img8 && PH8[w.img8]) return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(PH8[w.img8]);
    return ctx && ctx.img ? ctx.img(w.img) : (BQ.img7 ? BQ.img7(w.img) : '');
  };
  /** المقاطع ← ملفّ الصوت (LINES_v7: bq7_S_*) */
  const SYL = (X.SYL = { 'مَ': 'bq7_S_ma', 'مِ': 'bq7_S_mi', 'مُ': 'bq7_S_mu', 'ما': 'bq7_S_maa', 'مي': 'bq7_S_mii', 'مو': 'bq7_S_muu', 'مْ': 'bq7_S_m0',
    'بَ': 'bq7_S_ba', 'بِ': 'bq7_S_bi', 'بُ': 'bq7_S_bu', 'با': 'bq7_S_baa', 'بو': 'bq7_S_buu', 'فَ': 'bq7_S_fa', 'فِ': 'bq7_S_fi', 'فُ': 'bq7_S_fu', 'في': 'bq7_S_fii',
    'فا': 'bq7_S_faa', 'فو': 'bq7_S_fuu', 'نَ': 'bq7_S_na', 'نُ': 'bq7_S_nu', 'مَكْ': 'bq7_S_mak', 'مِفْ': 'bq7_S_mif', 'تِمْ': 'bq7_S_tim',
    // FIX12-B B-08: the same syllables written with full tashkeel («مَا» «مُو» «مِي» · «بَا») share the recorded takes
    'مَا': 'bq7_S_maa', 'مُو': 'bq7_S_muu', 'مِي': 'bq7_S_mii', 'بَا': 'bq7_S_baa', 'بُو': 'bq7_S_buu', 'فَا': 'bq7_S_faa', 'فُو': 'bq7_S_fuu', 'فِي': 'bq7_S_fii' });
  Object.keys(SYL).forEach((k) => { T[SYL[k]] = ['HAB', k]; });
  /** أوّل معرّف له ملفّ صوت (أو الأوّل) */
  X.pick = function (ctx, list) {
    list = [].concat(list || []);
    const has = (id) => (ctx && ctx.hasAudio ? ctx.hasAudio(id) : BQ.hasAudio && BQ.hasAudio(id));
    return list.find(has) || list[0];
  };
  X.sylId = (s) => SYL[s] || null;
  X.wordId = (k) => { const w = W[k]; return w && w.alt ? X.pick(null, ['bq7_W_' + k, w.alt]) : 'bq7_W_' + k; };
  X.segId = (k) => 'bq7_W_' + k + '_seg';

  /* ================= وصل الحروف (ZWJ) ================= */
  const NOLEFT = 'اأإآٱدذرزوؤةء'; // لا تتّصل بما بعدها
  const HARAKA = /[ً-ْٰـ]/g;
  const bare = (s) => String(s).replace(HARAKA, '').replace(/‍/g, '');
  const lastBase = (s) => { const b = bare(s); return b[b.length - 1] || ''; };
  const firstBase = (s) => bare(s)[0] || '';
  X.bare = bare;
  /** حروف الكلمة بحركاتها: «قَميصْ» ← [قَ، مي… ] */
  X.letters = (w) => String(w).replace(/\u200D/g, '').match(/[^\u064B-\u0652\u0670][\u064B-\u0652\u0670]*/g) || [];
  /** قطع كلمة → نصوص تُظهر الشكل السياقيّ وحدها: [{t, joinPrev, joinNext}] — إذا تجاورت القطع بلا فراغ اتّصلت بصرياً */
  X.pieces = function (parts) {
    return parts.map((p, i) => {
      const prev = parts[i - 1], next = parts[i + 1];
      const joinNext = !!next && !NOLEFT.includes(lastBase(p)) && firstBase(next) !== 'ء';
      const joinPrev = !!prev && !NOLEFT.includes(lastBase(prev)) && firstBase(p) !== 'ء';
      return { src: p, t: (joinPrev ? ZWJ : '') + p + (joinNext ? ZWJ : ''), joinPrev, joinNext };
    });
  };
  /** إبراز الميم في كلمة: يلفّ كلّ «م» (وحركاتها) بـ<b> مع الحفاظ على الوصل (ZWJ داخل الوسم وخارجه) */
  X.markMeem = function (word, cls) {
    const out = h('span.x7-w' + (cls ? '.' + cls : ''), { lang: 'ar' });
    const re = /(م[ً-ْ]*)/g;
    let last = 0, m;
    while ((m = re.exec(word))) {
      const before = word.slice(last, m.index);
      const after = word.slice(m.index + m[0].length);
      const jp = before && !NOLEFT.includes(lastBase(before));
      const jn = after.length > 0;
      if (before) out.append(before + (jp ? ZWJ : ''));
      out.append(h('b', null, (jp ? ZWJ : '') + m[0] + (jn ? ZWJ : '')));
      last = m.index + m[0].length;
      if (jn) out.append(ZWJ);
    }
    out.append(word.slice(last));
    if (X.v8 && X.v8()) { X.suk(out); X.kas(out); }
    return out;
  };
  /** SCI-1 T3 (additive): Vazirmatn draws the kasra of an isolated/final «مِ» far under the TAIL (it reads as «م», and its ink overflows the tile).
   *  Same fix as E06 (IX1): the letter is set bare and the kasra is drawn as its own short stroke under the head (.x7-kas, current colour).
   *  Only a «مِ» that does not join forward (end of text / no ZWJ after) — an initial/medial «مِـ» keeps the font's kasra. */
  X.kas = function (node) {
    if (!node) return node;
    if (!document.getElementById('st-x7kas')) document.head.append(h('style', { id: 'st-x7kas' }, '.x7-mi{position:relative;display:inline-block;line-height:1.25}.x7-kas{position:absolute;top:1.02em;right:.04em;width:.26em;height:.085em;border-radius:.05em;background:currentColor;transform:rotate(-20deg);pointer-events:none}'));
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); const list = []; let n;
    while ((n = walk.nextNode())) if (/م\u0650(?![\u200D\u0621-\u064A])/.test(n.nodeValue)) list.push(n);
    list.forEach((tn) => {
      const frag = document.createDocumentFragment(); const v = tn.nodeValue; const re = /م\u0650(?![\u200D\u0621-\u064A])/g; let last = 0, m;
      while ((m = re.exec(v))) { if (m.index > last) frag.append(v.slice(last, m.index)); frag.append(h('span.x7-mi', { 'aria-label': 'مِ' }, 'م', h('i.x7-kas', { 'aria-hidden': 'true' }))); last = m.index + 2; }
      frag.append(v.slice(last)); tn.replaceWith(frag);
    });
    return node;
  };
  /** v8 · سكون واضح: «رْ» بخطّ Vazirmatn تبدو قريبة من «ز» (السكون الصغيرة تقع حيث نقطة الزاي). القرار: نُبقي السكون (لازمة تربويّاً)
   *  ونرسمها حلقةً مفرغة أكبر وأعلى قليلاً فوق الحرف — للحروف التي لها أخت منقوطة من فوق: ر/ز · د/ذ · ح/خ · ص/ض · ع/غ.
   *  النصّ يبقى متّصلاً (الحرف في span واحد، والحلقة ::after)؛ aria-label على الأب يحفظ النصّ كاملاً. */
  X.suk = function (node) {
    if (!node) return node;
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const list = []; let n;
    while ((n = walk.nextNode())) if (/[ردحصع]ْ/.test(n.nodeValue)) list.push(n);
    list.forEach((tn) => {
      const frag = document.createDocumentFragment();
      const v = tn.nodeValue; let last = 0, m;
      const re = /[ردحصع]ْ/g;
      while ((m = re.exec(v))) {
        if (m.index > last) frag.append(v.slice(last, m.index));
        frag.append(h('span.x7-suk', null, m[0][0]));
        last = m.index + m[0].length;
      }
      frag.append(v.slice(last));
      tn.replaceWith(frag);
    });
    return node;
  };

  /* ================= الجلسة والصوت ================= */
  X.session = function (ctx) {
    let live = true;
    const timers = new Set();
    ctx.onCleanup(() => { live = false; timers.forEach(clearTimeout); timers.clear(); });
    const alive = () => live && (typeof ctx.alive !== 'function' || ctx.alive());
    const gate = (p) => p.then((v) => (alive() ? v : never()));
    const capEl = () => BQ.audio && BQ.audio.capEl;
    const SPN = { BRQ: 'بارِق', SAY: 'سَيْف', MAJ: 'ماجِد' };
    function caption(id) {
      const cap = capEl(); if (!cap || !T[id]) return;
      cap.replaceChildren(SPN[T[id][0]] ? h('b', null, SPN[T[id][0]] + ': ') : '', T[id][1]);
      cap.hidden = !BQ.state.cc;
    }
    function capOff() { const cap = capEl(); if (cap) { cap.hidden = true; cap.textContent = ''; } }
    const S = {
      ctx,
      get live() { return alive(); },
      gate,
      /** يقول سطراً (أو أوّل الموجود من قائمة). stim: مثير مسموع بلا نصّ مصاحب */
      say(idOrList, opt) {
        if (!alive()) return never();
        opt = opt || {};
        const id = X.pick(ctx, idOrList);
        const known = (ctx.hasAudio && ctx.hasAudio(id)) || (BQ.line && BQ.line(id));
        if (known) return gate(ctx.say(id, { noCaption: !!opt.stim, rate: opt.rate }));
        // لا ملفّ ولا نصّ في البيانات: نصّنا الاحتياطيّ بزمن تقديريّ (يقطعه أيّ صوت آخر)
        BQ.audio.stop();
        if (!opt.stim) caption(id);
        const my = BQ.audio.token;
        const ms = Math.max(800, (X.text(id) || '').length * 80);
        return gate(new Promise((res) => {
          const t = setTimeout(() => { timers.delete(t); if (BQ.audio.token === my) capOff(); res(); }, ms);
          timers.add(t);
          const iv = setInterval(() => { if (BQ.audio.token !== my || !alive()) { clearInterval(iv); clearTimeout(t); res(); } }, 120);
          setTimeout(() => clearInterval(iv), ms + 50);
        }));
      },
      sleep(ms) { return alive() ? gate(new Promise((r) => { const t = setTimeout(() => { timers.delete(t); r(); }, ms); timers.add(t); })) : never(); },
      later(fn, ms) { const t = setTimeout(() => { timers.delete(t); if (alive()) fn(); }, ms); timers.add(t); return t; },
      clear(t) { clearTimeout(t); timers.delete(t); },
      fx(id, vol) { try { return alive() && BQ.audio.fx ? BQ.audio.fx(id, vol == null ? 0.6 : vol) : null; } catch (e) { return null; } },
      stop() { BQ.audio.stop(); },
      async seq(list) { for (const it of list) { if (!alive()) return never(); if (typeof it === 'number') await S.sleep(it); else if (typeof it === 'function') await it(); else await S.say(it); } },
    };
    return S;
  };
  X.sfx = (BQ.sfx) || { ok: 'bariq_L1-01_sfx-check-done', snap: 'bariq_L1-01_sfx-tile-snap' };

  /* ================= الإتقان ================= */
  X.record = function (ctx, skill, ok, extra) {
    try {
      if (ctx && typeof ctx.record === 'function') return ctx.record(skill, !!ok, extra);
      if (BQ.mastery && BQ.mastery.record) return BQ.mastery.record(skill, !!ok, (ctx && ctx.meta && ctx.meta.id) || 'IX2', extra);
    } catch (e) { /* */ }
    return null;
  };

  /* ================= الصور ================= */
  X.hasImg = (ctx, key) => !!(ctx && ctx.hasImg ? ctx.hasImg(key) : BQ.hasImg7 && BQ.hasImg7(key));
  /** صورة كلمة داخل إطار: صورة img7 إن أُدرجت، وإلا بطاقة دافئة بالكلمة (أو علامة استفهام للمشتِّت الذي لا يُكتب) */
  X.pic = function (ctx, key, opt) {
    opt = opt || {};
    const wk = key.replace(/^(w|card)_/, '');
    const box = h('span.x7-pic' + (opt.cls ? '.' + opt.cls : ''), { 'aria-hidden': 'true', dataset: { k: key } });
    if (X.hasImg(ctx, key)) box.append(h('img', { src: ctx.img(key), alt: '', draggable: 'false', decoding: 'async' }));
    else {
      box.classList.add('is-ph');
      const w = W[wk];
      const txt = opt.noText || !w || w.dis ? '' : w.t;
      box.append(h('span.x7-pic-ph', null, txt ? h('span.x7-pic-w', { lang: 'ar' }, txt) : h('span.x7-pic-q', null, '?')));
    }
    return box;
  };

  /* ================= بارق ================= */
  X.brq = (state, cls) => (BQ.ui && BQ.ui.brq ? BQ.ui.brq(state || 'idle', cls) : h('span.bq-brq' + (cls ? '.' + cls : '')));
  /** بارق صغير يتفاعل في زاوية المسرح */
  X.buddy = function (host) {
    const b = X.brq('idle', 'x7-buddy');
    if (host && host._8) host._8.bariq.append(b); else host.append(b);
    let t = 0;
    b.mood = (s, ms) => { clearTimeout(t); if (b.brq) b.brq(s); if (ms) t = setTimeout(() => b.brq && b.brq('idle'), ms); };
    return b;
  };
  /** نجوم صغيرة تتطاير من عنصر (لا شيء مع تقليل الحركة) */
  X.burst = function (el, n) {
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect(); if (!r.width) return;
    const host = document.body;
    const cols = ['#FEBA02', '#FBE65B', '#00AEED', '#E4553F', '#3DBB6B'];
    for (let i = 0; i < (n || 10); i++) {
      const s = h('i.x7-spark', { 'aria-hidden': 'true' });
      const a = (Math.PI * 2 * i) / (n || 10) + Math.random() * 0.5, d = 50 + Math.random() * 60;
      Object.assign(s.style, { left: r.left + r.width / 2 + 'px', top: r.top + r.height / 2 + 'px', background: cols[i % cols.length], '--dx': Math.cos(a) * d + 'px', '--dy': Math.sin(a) * d + 'px' });
      host.append(s);
      setTimeout(() => s.remove(), 800);
    }
  };
  X.anim = function (el, cls, ms) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms || 600); };

  /** مؤشّر تقدّم بلا أرقام (نقاط) */
  X.dots = function (parent, n) {
    if (X.v8() && cur8) return X.progress8(n);
    const el = h('div.x7-dots', { 'aria-hidden': 'true' });
    const ds = Array.from({ length: n }, () => h('i'));
    el.append(...ds); parent.append(el);
    return { el, set(i) { ds.forEach((d, j) => { d.className = j < i ? 'on' : j === i ? 'cur' : ''; }); } };
  };
  /** شارة مرحلة (أ / ب) */
  X.phase = function (parent, labels) {
    if (X.v8() && cur8) return { el: h('div', { hidden: true }), set() {} }; // v8: no word pills on the child screen — the HUD icon says what to do
    const el = h('div.x7-phase', { role: 'list' });
    const ps = labels.map((l) => h('span', { role: 'listitem' }, l));
    el.append(...ps); parent.append(el);
    return { el, set(i) { ps.forEach((p, j) => p.classList.toggle('on', j === i)); } };
  };

  /** ختام النشاط (فوق منطقة اللعب): بارق يصفّق + «أَعِدْ» + «التّالي» */
  X.end = function (ctx, S, opt) {
    opt = opt || {};
    if (BQ.ui && BQ.ui.endCard && !opt.custom) return BQ.ui.endCard(ctx.stage, { title: opt.title || 'أَحْسَنْتَ.', line: opt.line ? X.pick(ctx, opt.line) : null, onReplay: () => BQ.open(ctx.meta.id, { skipCover: true, history: 'replace' }) });
    return null;
  };

  /* ================= السحب والإفلات (إصبع / فأرة / المس-ثم-المس / لوحة المفاتيح) ================= */
  /** X.dnd({root, onDrop(tile, zone) → true|false|Promise, canDrag(tile)}) → {tile(el, data), zone(el, data), selected, clearSel()} */
  X.dnd = function (opt) {
    const root = opt.root;
    const tiles = new Set(), zones = new Set();
    let sel = null, drag = null;
    const zoneAt = (x, y) => {
      let best = null, bd = 1e9;
      zones.forEach((z) => {
        if (z.classList.contains('is-full') || z.hidden || !z.isConnected) return;
        const r = z.getBoundingClientRect(); const pad = Math.max(12, r.width * 0.12);
        if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) {
          const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
          if (d < bd) { bd = d; best = z; }
        }
      });
      return best;
    };
    const setSel = (t) => { if (sel) sel.classList.remove('is-sel'); sel = t; if (t) t.classList.add('is-sel'); root.classList.toggle('x7-has-sel', !!t); };
    async function attempt(tile, zone, ghost) {
      setSel(null);
      let ok = false;
      try { ok = await opt.onDrop(tile, zone); } catch (e) { ok = false; }
      if (ghost) {
        // v8 (owner R3-14): a correct drop snaps STRAIGHT into the target — the ghost vanishes at once and the element
        // shows the piece in its slot with a short settle bounce (no flight to the zone centre, no fly-back-then-land)
        if (ok) ghost.remove();
        else back(tile, ghost, true);
      }
      tile.classList.remove('is-lifted');
      return ok;
    }
    /* drag ghost (OWNER_R3 2026-10-06 E14 iPad «الصورة بحجمها الأصليّ بعرض الشاشة»): the ghost used to be a clone in <body>, outside the
       element root → element-scoped rules («.e14 .e14-wt img { width: … }») no longer matched and a word card's <img> was drawn at its
       NATURAL size (1024 px webp) across the screen. Now (theme 8) the clone is placed INSIDE the element root (same CSS scope, same --u),
       sized in stage layout px (offsetWidth/Height) and positioned/moved in layout px (client deltas ÷ BQ.stageScale()); every media child
       (img/svg/canvas/video) is pinned to its measured box. No native HTML5 drag image is ever used (pointer events only). */
    function ghostOf(el) {
      const r = el.getBoundingClientRect();
      const g = el.cloneNode(true);
      g.classList.add('x7-ghost'); g.classList.remove('is-sel', 'is-lifted');
      g.removeAttribute('id'); g.setAttribute('aria-hidden', 'true'); g.tabIndex = -1;
      // pin every media child to its on-stage box (layout px) — never natural size
      const src = el.querySelectorAll('img, svg, canvas, video, picture'), dst = g.querySelectorAll('img, svg, canvas, video, picture');
      src.forEach((m, i) => {
        const d = dst[i]; if (!d) return;
        const w = m.offsetWidth != null ? m.offsetWidth : (m.getBoundingClientRect().width / (BQ.stageScale ? BQ.stageScale() : 1));
        const hh = m.offsetHeight != null ? m.offsetHeight : (m.getBoundingClientRect().height / (BQ.stageScale ? BQ.stageScale() : 1));
        const cs = getComputedStyle(m);
        Object.assign(d.style, { width: w + 'px', height: hh + 'px', maxWidth: w + 'px', maxHeight: hh + 'px', minWidth: '0', minHeight: '0', objectFit: cs.objectFit || 'contain', flex: 'none' });
        if (d.tagName === 'IMG') { d.setAttribute('width', String(Math.round(w))); d.setAttribute('height', String(Math.round(hh))); d.draggable = false; }
      });
      const st8 = el.closest('.bq8-stage');
      const host = st8 ? (el.closest('.x7p') || root) : null;
      if (host && host !== el && host.contains(el)) {
        const s = (BQ.stageScale && BQ.stageScale()) || 1;
        const w = el.offsetWidth, hh = el.offsetHeight;
        g.classList.add('x7-ghost8', 'x7-ghost-in');
        g.style.rotate = getComputedStyle(el).rotate;
        Object.assign(g.style, { left: '0px', top: '0px', width: w + 'px', height: hh + 'px', maxWidth: 'none', maxHeight: 'none' });
        host.append(g);
        const g0 = g.getBoundingClientRect();
        const k = (g0.width && w) ? g0.width / w : s; // the real visual scale of the host (== stage scale)
        g._s = k;
        g.style.left = ((r.left + r.width / 2 - (g0.left + g0.width / 2)) / k) + 'px';
        g.style.top = ((r.top + r.height / 2 - (g0.top + g0.height / 2)) / k) + 'px';
        return g;
      }
      Object.assign(g.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
      if (st8) { g.style.setProperty('--u', (st8.clientWidth / 1180) + 'px'); g.style.rotate = getComputedStyle(el).rotate; g.classList.add('x7-ghost8'); }
      document.body.append(g);
      g._s = 1;
      return g;
    }
    function back(tile, ghost, shake) {
      const go = () => {
        const tr = tile.getBoundingClientRect(), gr = ghost.getBoundingClientRect(), gs = ghost._s || 1;
        const cur = (ghost.style.transform.match(/translate\(([-\d.e]+)px, *([-\d.e]+)px\)/) || [0, 0, 0]).slice(1).map(Number);
        ghost.style.transition = reduced() ? 'none' : 'transform .28s cubic-bezier(.3,1.4,.5,1)';
        // home = the tile's centre (the ghost is drawn at 1.08 around its own centre)
        const dx = (tr.left + tr.width / 2 - (gr.left + gr.width / 2)) / gs + cur[0], dy = (tr.top + tr.height / 2 - (gr.top + gr.height / 2)) / gs + cur[1];
        ghost.style.transform = `translate(${dx}px, ${dy}px)`;
        setTimeout(() => { ghost.remove(); tile.classList.remove('is-lifted'); }, reduced() ? 0 : 300);
      };
      // wrong drop: a gentle shake where it was dropped, then it slides home
      if (shake && !reduced()) { ghost.classList.add('x7-ghost-shake'); setTimeout(go, 300); } else go();
    }
    function tile(el, data) {
      el._d = data; tiles.add(el);
      el.classList.add('x7-tile');
      el.setAttribute('role', 'button'); el.tabIndex = 0;
      el.style.touchAction = 'none';
      el.addEventListener('pointerdown', (e) => {
        if (el.classList.contains('is-used') || (opt.canDrag && !opt.canDrag(el))) return;
        if (e.button && e.button !== 0) return;
        if (e.cancelable) e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (x) { /* */ }
        drag = { el, id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, ghost: null, over: null };
      });
      el.addEventListener('pointermove', (e) => {
        if (!drag || drag.el !== el || drag.id !== e.pointerId) return;
        if (e.cancelable) e.preventDefault();
        const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
        if (!drag.moved && Math.hypot(dx, dy) < 8) return;
        if (!drag.moved) {
          drag.moved = true;
          drag.ghost = ghostOf(el);
          el.classList.add('is-lifted');
          setSel(null);
        }
        const gs = drag.ghost._s || 1; // visual → ghost-layout px (the v8 ghost lives INSIDE the scaled stage)
        drag.ghost.style.transform = `translate(${dx / gs}px, ${dy / gs}px)`; // exactly the card's on-screen size (owner 2026-10-06)
        const z = zoneAt(e.clientX, e.clientY);
        if (z !== drag.over) { if (drag.over) drag.over.classList.remove('is-over'); if (z) z.classList.add('is-over'); drag.over = z; }
      });
      const end = (e, cancel) => {
        if (!drag || drag.el !== el || (e && drag.id !== e.pointerId)) return;
        const d = drag; drag = null;
        try { el.releasePointerCapture(d.id); } catch (x) { /* */ }
        if (d.over) d.over.classList.remove('is-over');
        if (!d.moved) { if (!cancel) { setSel(sel === el ? null : el); if (opt.onPick) opt.onPick(el); } return; }
        const z = cancel ? null : zoneAt(e.clientX, e.clientY);
        if (z) attempt(el, z, d.ghost); else { back(el, d.ghost, false); if (opt.onMiss) opt.onMiss(el); }
      };
      el.addEventListener('pointerup', (e) => end(e, false));
      el.addEventListener('pointercancel', (e) => end(e, true));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!el.classList.contains('is-used')) { setSel(sel === el ? null : el); if (opt.onPick) opt.onPick(el); } } });
      el.addEventListener('contextmenu', (e) => e.preventDefault());
      return el;
    }
    function zone(el, data) {
      el._d = data; zones.add(el);
      el.classList.add('x7-zone');
      if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
      const put = (e) => { if (!sel || el.classList.contains('is-full')) return false; if (e) e.preventDefault(); attempt(sel, el, null); return true; };
      el.addEventListener('click', (e) => { if (sel) put(e); else if (opt.onZoneTap) opt.onZoneTap(el); });
      el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && sel) put(e); });
      return el;
    }
    return { tile, zone, get selected() { return sel; }, clearSel: () => setSel(null), tiles, zones };
  };

  /* ================= الكتابة باللمس ================= */
  /* الأشكال: مسار واحد بحركة واحدة. iso = مسار v6 المعتمد كما هو. ini/med/fin في صندوق عرضه 60 وخطّه 55.
     الاتّجاه: من نقطة البدء الخضراء؛ الرأس يُدار كما في v6؛ الوصلة الداخلة من اليمين (وسط/آخر) تُكتب أوّلاً. */
  const FORMS = (X.FORMS = {
    iso: { d: 'M45.81 53.19 A13 13 0 1 1 68 44 A13 13 0 0 1 45.81 53.19 Q40.5 60 40.5 72 L40.5 82 Q40.5 88 35 89.5', vb: [24, 22, 56, 72], base: 57, glyph: 'م', arrows: [0.18, 0.62, 0.86] },
    ini: { d: 'M29.64 52.36 A9 9 0 1 1 45 46 A9 9 0 0 1 29.64 52.36 Q26 55 18 55 L2 55', vb: [0, 4, 60, 80], base: 55, glyph: 'مـ', arrows: [0.2, 0.62, 0.9], exitL: [2, 55] },
    med: { d: 'M58 55 L30 55 A9 9 0 0 1 30 37 A9 9 0 0 1 30 55 L2 55', vb: [0, 4, 60, 80], base: 55, glyph: 'ـمـ', arrows: [0.12, 0.5, 0.92], exitL: [2, 55], exitR: [58, 55] },
    fin: { d: 'M58 55 L32 55 A9 9 0 0 1 32 37 A9 9 0 0 1 32 55 Q24 60 24 72 L24 84 Q24 90 18 91', vb: [6, 4, 54, 92], base: 55, glyph: 'ـم', arrows: [0.1, 0.42, 0.85], exitR: [58, 55] },
  });
  /* v8 (owner R3-9 · THEME8): the meem the child knows — Vazirmatn Bold. Paths RE-DERIVED from the font outlines with fontTools
     (v7/ix2_v8/meem_paths.py: glyph uniFEE1/FEE3/FEE4/FEE2 → medial axis → ordered by the same stroke order as v6/v7: the closed head is
     drawn from its lower-left joint, up and clockwise, back to the joint, then the tail / the left join; medial & final first come in
     from the right join along the bottom of the head). Pad units = 0.05 × font units, baseline y 55. d = centre line (pen path) ·
     o = the glyph outline (the trace corridor drawn on the pad) · hw = half the pen width · box = glyph box · origin/adv = where the
     rest of the word joins (left / right) · fs = font-size that makes the context text match the glyph exactly. */
  const FORMS8 = (X.FORMS8 = {
    iso: {"d": "M26.70 41.90 C26.78 41.47 27.01 40.19 27.18 39.35 C27.35 38.50 27.50 37.64 27.73 36.81 C27.97 35.97 28.27 35.16 28.58 34.35 C28.89 33.54 29.24 32.75 29.62 31.96 C29.99 31.18 30.38 30.41 30.82 29.66 C31.26 28.92 31.73 28.18 32.25 27.49 C32.77 26.80 33.33 26.13 33.93 25.51 C34.54 24.89 35.18 24.30 35.88 23.79 C36.57 23.28 37.32 22.82 38.11 22.47 C38.89 22.12 39.74 21.86 40.59 21.70 C41.43 21.55 42.31 21.51 43.18 21.53 C44.04 21.56 44.91 21.67 45.75 21.85 C46.60 22.02 47.45 22.26 48.24 22.60 C49.03 22.93 49.81 23.36 50.51 23.85 C51.22 24.34 51.88 24.92 52.48 25.54 C53.08 26.16 53.62 26.85 54.09 27.57 C54.57 28.30 54.97 29.08 55.31 29.87 C55.65 30.66 55.94 31.49 56.15 32.33 C56.36 33.16 56.48 34.03 56.56 34.89 C56.64 35.75 56.66 36.63 56.61 37.49 C56.57 38.35 56.48 39.22 56.30 40.07 C56.13 40.91 55.88 41.75 55.55 42.55 C55.22 43.35 54.84 44.14 54.35 44.85 C53.86 45.56 53.28 46.23 52.63 46.79 C51.98 47.35 51.23 47.84 50.45 48.20 C49.68 48.56 48.82 48.79 47.97 48.94 C47.12 49.09 46.24 49.12 45.38 49.09 C44.52 49.07 43.65 48.94 42.80 48.77 C41.96 48.60 41.13 48.33 40.30 48.07 C39.48 47.81 38.66 47.52 37.85 47.21 C37.04 46.90 36.24 46.56 35.44 46.23 C34.64 45.90 33.84 45.56 33.04 45.23 C32.24 44.89 31.44 44.57 30.65 44.20 C29.87 43.83 29.14 43.33 28.35 43.01 C27.56 42.68 26.75 42.29 25.92 42.25 C25.09 42.22 24.22 42.60 23.38 42.81 C22.54 43.02 21.66 43.16 20.88 43.51 C20.10 43.86 19.34 44.33 18.70 44.90 C18.07 45.47 17.53 46.19 17.08 46.92 C16.62 47.65 16.28 48.46 15.98 49.27 C15.68 50.08 15.47 50.93 15.28 51.77 C15.08 52.61 14.93 53.47 14.80 54.33 C14.67 55.18 14.58 56.05 14.50 56.91 C14.42 57.77 14.37 58.64 14.32 59.50 C14.27 60.37 14.24 61.23 14.21 62.10 C14.19 62.97 14.19 63.83 14.17 64.70 C14.16 65.57 14.14 66.43 14.14 67.30 C14.14 68.16 14.15 69.03 14.16 69.90 C14.17 70.76 14.18 71.63 14.20 72.50 C14.22 73.36 14.24 74.23 14.27 75.10 C14.30 75.96 14.34 76.83 14.38 77.69 C14.42 78.56 14.45 79.42 14.50 80.29 C14.56 81.16 14.62 82.10 14.68 82.88 C14.74 83.67 14.82 84.65 14.85 85.00", "o": "M50.800000000000004 36.7Q50.800000000000004 39.05 49.675000000000004 40.825Q48.550000000000004 42.6 45.900000000000006 42.6Q44.550000000000004 42.6 42.6 42.0Q40.65 41.4 38.325 40.425Q36.0 39.45 33.5 38.349999999999994Q34.1 36.55 34.95 34.724999999999994Q35.8 32.9 36.925 31.375Q38.050000000000004 29.849999999999998 39.5 28.924999999999997Q40.95 28.0 42.7 28.0Q45.150000000000006 28.0 46.95 29.2Q48.75 30.4 49.775000000000006 32.4Q50.800000000000004 34.4 50.800000000000004 36.7ZM21.7 36.3Q17.1 37.099999999999994 14.325000000000001 39.65Q11.55 42.2 10.175 46.225Q8.8 50.25 8.350000000000001 55.575Q7.9 60.9 7.9 67.25Q7.9 71.85 8.100000000000001 76.725Q8.3 81.6 8.600000000000001 86.85H21.3Q21.2 85.0 20.975 81.95Q20.75 78.9 20.6 75.075Q20.45 71.25 20.45 67.15Q20.45 63.15 20.625 59.9Q20.8 56.65 21.275 54.325Q21.75 52.0 22.575000000000003 50.775Q23.400000000000002 49.55 24.700000000000003 49.55Q26.200000000000003 49.55 28.6 50.5Q31.0 51.45 33.925 52.675Q36.85 53.9 39.900000000000006 54.849999999999994Q42.95 55.8 45.7 55.8Q51.300000000000004 55.8 55.075 53.2Q58.85 50.6 60.75 46.275000000000006Q62.650000000000006 41.95 62.650000000000006 36.75Q62.650000000000006 30.25 60.10000000000001 25.375Q57.550000000000004 20.5 53.050000000000004 17.799999999999997Q48.550000000000004 15.099999999999994 42.5 15.099999999999994Q38.6 15.099999999999994 35.325 16.774999999999995Q32.05 18.449999999999996 29.45 21.4Q26.85 24.349999999999998 24.925 28.15Q23.0 31.95 21.7 36.3Z", "hw": 6.3, "box": [4.9, 12.1, 60.8, 77.8], "origin": 4.0, "adv": 66.95, "fs": 102.4, "base": 55.0, "arrows": [0.1, 0.36, 0.86]},
    ini: {"d": "M19.30 40.20 C19.37 39.77 19.54 38.48 19.74 37.64 C19.94 36.80 20.17 35.95 20.49 35.15 C20.80 34.35 21.23 33.59 21.64 32.82 C22.05 32.06 22.49 31.31 22.94 30.57 C23.40 29.84 23.87 29.11 24.37 28.40 C24.87 27.70 25.40 27.00 25.96 26.35 C26.53 25.69 27.12 25.05 27.76 24.48 C28.41 23.91 29.10 23.35 29.84 22.92 C30.58 22.49 31.39 22.12 32.22 21.88 C33.04 21.64 33.92 21.54 34.78 21.49 C35.64 21.43 36.52 21.46 37.38 21.55 C38.23 21.65 39.10 21.82 39.92 22.09 C40.74 22.35 41.54 22.70 42.30 23.13 C43.05 23.55 43.77 24.05 44.42 24.62 C45.07 25.18 45.67 25.83 46.20 26.51 C46.73 27.19 47.20 27.93 47.61 28.69 C48.01 29.46 48.34 30.27 48.61 31.09 C48.87 31.91 49.07 32.76 49.20 33.62 C49.33 34.47 49.39 35.34 49.40 36.21 C49.40 37.07 49.36 37.95 49.25 38.80 C49.13 39.66 48.96 40.52 48.71 41.34 C48.47 42.17 48.16 42.99 47.76 43.76 C47.37 44.53 46.91 45.28 46.36 45.94 C45.81 46.60 45.16 47.22 44.45 47.70 C43.75 48.18 42.94 48.57 42.13 48.85 C41.32 49.13 40.45 49.29 39.59 49.38 C38.74 49.47 37.86 49.47 37.00 49.41 C36.14 49.35 35.27 49.22 34.43 49.03 C33.59 48.83 32.76 48.55 31.96 48.23 C31.15 47.91 30.37 47.53 29.61 47.12 C28.85 46.71 28.10 46.25 27.38 45.78 C26.65 45.31 25.96 44.79 25.26 44.28 C24.56 43.76 23.90 43.20 23.19 42.70 C22.49 42.19 21.81 41.56 21.05 41.23 C20.28 40.90 19.37 40.56 18.61 40.72 C17.84 40.87 17.14 41.63 16.46 42.16 C15.78 42.69 15.18 43.33 14.54 43.91 C13.89 44.49 13.28 45.12 12.60 45.64 C11.91 46.17 11.20 46.71 10.43 47.06 C9.65 47.41 8.77 47.57 7.93 47.75 C7.08 47.92 6.01 48.02 5.35 48.11 C4.70 48.20 4.23 48.27 4.00 48.30", "o": "M35.7 27.849999999999998Q39.35 27.849999999999998 41.45 30.375Q43.550000000000004 32.9 43.550000000000004 36.45Q43.550000000000004 39.15 42.275000000000006 41.05Q41.0 42.95 38.15 42.95Q36.95 42.95 35.375 42.5Q33.8 42.05 31.950000000000003 41.0Q30.75 40.3 29.375 39.275Q28.0 38.25 26.55 36.849999999999994Q27.450000000000003 34.9 28.775000000000002 32.825Q30.1 30.75 31.825 29.299999999999997Q33.55 27.849999999999998 35.7 27.849999999999998ZM38.1 56.15Q43.85 56.15 47.675 53.575Q51.5 51.0 53.45 46.5Q55.400000000000006 42.0 55.400000000000006 36.2Q55.400000000000006 30.5 52.95 25.7Q50.5 20.9 45.975 17.974999999999998Q41.45 15.049999999999997 35.3 15.049999999999997Q30.75 15.049999999999997 27.450000000000003 16.95Q24.150000000000002 18.85 21.700000000000003 21.9Q19.25 24.95 17.275 28.325Q15.3 31.7 13.450000000000001 34.725Q11.600000000000001 37.75 9.600000000000001 39.65Q7.6 41.55 4.95 41.55H3.0V55.0H5.2Q9.0 55.0 11.5 54.1Q14.0 53.2 15.9 51.675Q17.8 50.15 19.65 48.2Q22.6 50.55 25.525000000000002 52.349999999999994Q28.450000000000003 54.15 31.550000000000004 55.15Q34.650000000000006 56.15 38.1 56.15Z", "hw": 6.35, "box": [0.0, 12.0, 58.4, 47.1], "origin": 4.0, "adv": 59.6, "fs": 102.4, "base": 55.0, "arrows": [0.12, 0.4, 0.92]},
    med: {"d": "M63.40 48.30 C62.98 48.20 61.71 47.92 60.87 47.72 C60.02 47.52 59.15 47.41 58.34 47.12 C57.53 46.83 56.75 46.43 56.01 45.98 C55.28 45.54 54.65 44.92 53.94 44.42 C53.22 43.93 52.52 43.25 51.75 43.02 C50.98 42.78 50.04 42.72 49.31 43.01 C48.58 43.30 48.00 44.14 47.37 44.74 C46.74 45.34 46.20 46.03 45.55 46.60 C44.91 47.17 44.24 47.76 43.50 48.18 C42.75 48.60 41.92 48.93 41.09 49.14 C40.26 49.35 39.37 49.41 38.51 49.43 C37.65 49.46 36.77 49.42 35.92 49.31 C35.06 49.19 34.21 48.99 33.38 48.74 C32.56 48.49 31.75 48.16 30.96 47.80 C30.17 47.44 29.41 47.02 28.66 46.58 C27.92 46.14 27.19 45.67 26.48 45.18 C25.77 44.68 25.10 44.13 24.40 43.61 C23.71 43.09 23.02 42.56 22.31 42.06 C21.61 41.57 20.61 41.26 20.16 40.62 C19.71 39.98 19.60 39.03 19.62 38.21 C19.64 37.39 19.99 36.51 20.28 35.70 C20.57 34.88 20.96 34.10 21.36 33.33 C21.75 32.56 22.20 31.82 22.65 31.07 C23.09 30.33 23.55 29.59 24.04 28.88 C24.53 28.17 25.04 27.46 25.59 26.79 C26.14 26.12 26.71 25.47 27.34 24.87 C27.97 24.28 28.63 23.70 29.35 23.23 C30.07 22.76 30.86 22.34 31.66 22.06 C32.47 21.77 33.34 21.60 34.20 21.51 C35.05 21.41 35.93 21.44 36.79 21.50 C37.65 21.57 38.53 21.69 39.36 21.91 C40.19 22.14 41.02 22.45 41.78 22.84 C42.55 23.23 43.28 23.72 43.95 24.27 C44.62 24.81 45.23 25.44 45.78 26.10 C46.34 26.77 46.83 27.49 47.26 28.24 C47.69 28.99 48.06 29.79 48.36 30.59 C48.66 31.40 48.88 32.25 49.06 33.09 C49.25 33.94 49.35 34.80 49.48 35.66 C49.61 36.52 49.74 37.37 49.84 38.23 C49.95 39.09 50.24 40.00 50.13 40.82 C50.01 41.63 49.63 42.45 49.15 43.13 C48.67 43.80 47.86 44.28 47.23 44.88 C46.61 45.48 46.07 46.17 45.42 46.74 C44.76 47.30 44.08 47.87 43.33 48.28 C42.58 48.68 41.74 48.99 40.90 49.18 C40.07 49.37 39.18 49.42 38.32 49.43 C37.45 49.45 36.58 49.41 35.72 49.29 C34.87 49.16 34.02 48.95 33.20 48.69 C32.37 48.43 31.57 48.08 30.79 47.72 C30.00 47.35 29.24 46.94 28.50 46.49 C27.75 46.05 27.03 45.56 26.33 45.06 C25.62 44.56 24.94 44.02 24.25 43.50 C23.55 42.98 22.88 42.43 22.16 41.95 C21.43 41.48 20.69 40.76 19.91 40.66 C19.14 40.56 18.25 40.97 17.51 41.36 C16.78 41.75 16.16 42.43 15.50 43.00 C14.85 43.57 14.26 44.22 13.61 44.78 C12.95 45.35 12.30 45.94 11.57 46.39 C10.84 46.84 10.04 47.23 9.22 47.48 C8.40 47.74 7.52 47.79 6.66 47.93 C5.81 48.06 4.53 48.23 4.09 48.29 C3.64 48.35 4.01 48.30 4.00 48.30", "o": "M5.2 55.0Q9.0 55.0 11.5 54.1Q14.0 53.2 15.9 51.675Q17.8 50.15 19.65 48.2Q22.6 50.55 25.525000000000002 52.349999999999994Q28.450000000000003 54.15 31.550000000000004 55.15Q34.650000000000006 56.15 38.1 56.15Q42.5 56.15 45.575 54.625Q48.650000000000006 53.1 51.1 49.9Q52.95 52.1 56.050000000000004 53.55Q59.150000000000006 55.0 62.35 55.0H63.7V41.55H62.400000000000006Q60.800000000000004 41.55 59.325 40.7Q57.85 39.85 56.75 37.849999999999994Q55.650000000000006 35.849999999999994 55.050000000000004 32.55Q54.2 27.65 51.625 23.674999999999997Q49.050000000000004 19.699999999999996 44.975 17.374999999999996Q40.9 15.049999999999997 35.3 15.049999999999997Q30.75 15.049999999999997 27.450000000000003 16.95Q24.150000000000002 18.85 21.700000000000003 21.9Q19.25 24.95 17.275 28.325Q15.3 31.7 13.450000000000001 34.725Q11.600000000000001 37.75 9.600000000000001 39.65Q7.6 41.55 4.95 41.55H3.05L3.0 55.0ZM35.7 27.849999999999998Q39.35 27.849999999999998 41.45 30.375Q43.550000000000004 32.9 43.550000000000004 36.45Q43.550000000000004 39.15 42.275000000000006 41.05Q41.0 42.95 38.15 42.95Q37.0 42.95 35.525 42.55Q34.05 42.15 32.3 41.2Q31.0 40.5 29.55 39.4Q28.1 38.3 26.55 36.849999999999994Q27.450000000000003 34.9 28.775000000000002 32.825Q30.1 30.75 31.825 29.299999999999997Q33.55 27.849999999999998 35.7 27.849999999999998Z", "hw": 6.35, "box": [0.0, 12.0, 66.7, 47.1], "origin": 4.0, "adv": 62.7, "fs": 102.4, "base": 55.0, "arrows": [0.04, 0.46, 0.95]},
    fin: {"d": "M70.50 48.30 C70.08 48.19 68.82 47.88 67.98 47.67 C67.14 47.45 66.26 47.33 65.46 47.01 C64.67 46.70 63.91 46.26 63.19 45.78 C62.48 45.30 61.88 44.64 61.18 44.13 C60.49 43.62 59.78 42.91 59.01 42.70 C58.25 42.48 57.32 42.52 56.59 42.84 C55.87 43.16 55.31 44.01 54.69 44.61 C54.07 45.21 53.51 45.89 52.87 46.46 C52.22 47.03 51.56 47.63 50.81 48.03 C50.06 48.44 49.20 48.71 48.36 48.89 C47.52 49.07 46.64 49.11 45.77 49.11 C44.91 49.10 44.04 49.00 43.19 48.85 C42.34 48.70 41.50 48.45 40.67 48.20 C39.85 47.94 39.04 47.63 38.22 47.33 C37.41 47.03 36.61 46.71 35.80 46.38 C35.00 46.06 34.20 45.72 33.40 45.39 C32.60 45.05 31.79 44.74 31.01 44.38 C30.22 44.01 29.36 43.71 28.69 43.21 C28.01 42.71 27.21 42.11 26.98 41.38 C26.74 40.65 27.12 39.66 27.27 38.81 C27.43 37.96 27.64 37.11 27.89 36.29 C28.14 35.46 28.46 34.65 28.78 33.85 C29.11 33.05 29.46 32.25 29.85 31.48 C30.24 30.70 30.65 29.94 31.10 29.20 C31.56 28.47 32.05 27.74 32.58 27.06 C33.12 26.39 33.69 25.72 34.31 25.13 C34.94 24.53 35.60 23.96 36.32 23.48 C37.04 23.00 37.81 22.57 38.61 22.26 C39.41 21.96 40.28 21.74 41.13 21.63 C41.98 21.51 42.86 21.51 43.72 21.57 C44.58 21.62 45.45 21.75 46.29 21.96 C47.12 22.17 47.96 22.46 48.74 22.83 C49.51 23.20 50.27 23.66 50.95 24.18 C51.64 24.70 52.29 25.30 52.86 25.94 C53.43 26.58 53.95 27.29 54.40 28.03 C54.84 28.77 55.21 29.57 55.52 30.37 C55.84 31.18 56.05 32.02 56.26 32.86 C56.47 33.70 56.61 34.56 56.76 35.41 C56.91 36.27 57.05 37.12 57.18 37.98 C57.30 38.84 57.63 39.74 57.52 40.55 C57.42 41.37 57.03 42.18 56.56 42.87 C56.08 43.55 55.28 44.04 54.66 44.64 C54.04 45.25 53.48 45.93 52.83 46.49 C52.19 47.06 51.52 47.65 50.77 48.05 C50.01 48.45 49.15 48.71 48.31 48.89 C47.47 49.06 46.59 49.11 45.73 49.10 C44.86 49.10 43.99 49.00 43.14 48.85 C42.29 48.69 41.46 48.43 40.63 48.18 C39.80 47.93 38.99 47.63 38.17 47.33 C37.36 47.03 36.56 46.69 35.76 46.37 C34.95 46.04 34.15 45.71 33.36 45.37 C32.56 45.04 31.75 44.71 30.97 44.35 C30.18 43.99 29.43 43.54 28.64 43.19 C27.86 42.84 27.08 42.32 26.26 42.24 C25.44 42.17 24.56 42.54 23.72 42.73 C22.87 42.92 22.00 43.07 21.20 43.39 C20.41 43.71 19.62 44.14 18.96 44.68 C18.30 45.22 17.74 45.92 17.26 46.63 C16.79 47.34 16.42 48.15 16.10 48.95 C15.79 49.76 15.56 50.60 15.35 51.44 C15.14 52.28 14.98 53.13 14.85 53.99 C14.71 54.84 14.61 55.71 14.53 56.57 C14.45 57.43 14.39 58.30 14.34 59.16 C14.29 60.03 14.25 60.89 14.22 61.76 C14.20 62.63 14.19 63.49 14.17 64.36 C14.16 65.23 14.15 66.09 14.15 66.96 C14.15 67.82 14.14 68.69 14.15 69.56 C14.16 70.42 14.18 71.29 14.19 72.16 C14.21 73.02 14.23 73.89 14.26 74.76 C14.29 75.62 14.33 76.49 14.36 77.35 C14.40 78.22 14.44 79.09 14.49 79.95 C14.53 80.82 14.59 81.70 14.65 82.54 C14.72 83.39 14.82 84.59 14.85 85.00", "o": "M50.800000000000004 36.7Q50.800000000000004 39.05 49.675000000000004 40.825Q48.550000000000004 42.6 45.900000000000006 42.6Q44.550000000000004 42.6 42.6 42.0Q40.65 41.4 38.325 40.425Q36.0 39.45 33.5 38.349999999999994Q34.1 36.55 34.95 34.724999999999994Q35.8 32.9 36.925 31.375Q38.050000000000004 29.849999999999998 39.5 28.924999999999997Q40.95 28.0 42.7 28.0Q45.150000000000006 28.0 46.95 29.2Q48.75 30.4 49.775000000000006 32.4Q50.800000000000004 34.4 50.800000000000004 36.7ZM62.25 32.0Q61.400000000000006 26.799999999999997 58.7 23.025Q56.0 19.25 51.875 17.174999999999997Q47.75 15.099999999999994 42.5 15.099999999999994Q38.6 15.099999999999994 35.325 16.774999999999995Q32.05 18.449999999999996 29.45 21.4Q26.85 24.349999999999998 24.925 28.15Q23.0 31.95 21.7 36.3Q17.1 37.099999999999994 14.325000000000001 39.65Q11.55 42.2 10.175 46.225Q8.8 50.25 8.350000000000001 55.575Q7.9 60.9 7.9 67.25Q7.9 71.85 8.100000000000001 76.725Q8.3 81.6 8.600000000000001 86.85H21.3Q21.2 85.0 20.975 81.95Q20.75 78.9 20.6 75.075Q20.45 71.25 20.45 67.15Q20.45 63.15 20.625 59.9Q20.8 56.65 21.275 54.325Q21.75 52.0 22.575000000000003 50.775Q23.400000000000002 49.55 24.700000000000003 49.55Q26.150000000000002 49.55 28.550000000000004 50.5Q30.950000000000003 51.45 33.875 52.675Q36.800000000000004 53.9 39.875 54.849999999999994Q42.95 55.8 45.7 55.8Q50.300000000000004 55.8 53.275000000000006 54.3Q56.25 52.8 58.35 49.8Q60.25 52.05 63.325 53.525Q66.4 55.0 69.55 55.0H70.9V41.55H69.55Q67.6 41.55 66.1 40.074999999999996Q64.6 38.599999999999994 63.599999999999994 36.4Q62.6 34.2 62.25 32.0Z", "hw": 6.3, "box": [4.9, 12.1, 69.0, 77.8], "origin": 4.0, "adv": 69.9, "fs": 102.4, "base": 55.0, "arrows": [0.035, 0.4, 0.9]},
  });
  X.forms = () => (X.v8 && X.v8() ? FORMS8 : FORMS);
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
  let mkN = 0;
  /**
   * X.writePad(parent, {form, guide:'road'|'dots'|'none', arrows:true|'faint'|false, start:true|false, ink:'path'|'free',
   *                     ctxBefore, ctxAfter (نصّ قبل/بعد في الكلمة، مثل 'قَـ' و'ـرْ'), tol, onFail(reason, n), onOk(info), lenient})
   * → {el, done:Promise, reset(), showStart(), setGuide(g), setArrows(a), demo(ms), runner(), fill(word), get fails}
   * reason: 'start' (بدأ بعيداً عن نقطة البدء) · 'off' (رفع إصبعه قبل الإكمال أو خرج عن الشكل)
   */
  X.writePad = function (parent, opt) {
    opt = opt || {};
    const V8 = !!(X.v8 && X.v8());
    const F = (V8 ? FORMS8 : FORMS)[opt.form || 'iso'];
    const id = 'x7w' + (++mkN);
    const el = h('div.x7-wp' + (opt.cls ? '.' + opt.cls : ''), { role: 'img', 'aria-label': 'لَوْحَةُ الكِتابَةِ: اُكْتُب بِإِصْبَعِكَ' });
    const svg = svgEl('svg', { class: 'x7-wp-svg' });
    svg.innerHTML = '<defs><marker id="' + id + 'a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.6" markerHeight="3.6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#E4553F"/></marker></defs>';
    el.append(svg);
    parent.append(el);
    // سطر الكتابة
    const [vx, vy, vw, vh] = V8 ? F.box : F.vb;
    let X0 = vx, W0 = vw;
    const lines = svgEl('g', { class: 'x7-wp-lines' }, svg);
    const box = svgEl('rect', { class: 'x7-wp-box', x: vx + 1, y: vy + 1, width: vw - 2, height: vh - 2, rx: 4 }, svg);
    const gCtx = svgEl('g', { class: 'x7-wp-ctx' }, svg);
    // v8: the corridor IS the Vazirmatn glyph (outline fill) — the child traces inside the real letter shape
    const road = svgEl('path', { d: V8 ? F.o : F.d, class: V8 ? 'road o8' : 'road' }, svg);
    const dots = svgEl('path', { d: F.d, class: 'dots' }, svg);
    const ghost = svgEl('path', { d: F.d, class: 'ghost' }, svg); // للتحقّق والعرض بعد النجاح
    const demoInk = svgEl('path', { d: F.d, class: 'demo' }, svg);
    const ink = svgEl('path', { d: F.d, class: 'ink' }, svg);
    const free = svgEl('path', { d: '', class: 'free' }, svg);
    const arr = svgEl('g', { class: 'arr' }, svg);
    const runnerDot = svgEl('circle', { class: 'runner', r: 2.4, cx: -9999, cy: -9999 }, svg);
    const nextp = svgEl('circle', { class: 'nextp', r: 3, cx: -9999, cy: -9999 }, svg);
    const startRing = svgEl('circle', { class: 'start-ring', r: 6, cx: 0, cy: 0 }, svg);
    const start = svgEl('circle', { class: 'start pulse', r: 3.2, cx: 0, cy: 0 }, svg);
    const tip = h('div.x7-wp-tip', { hidden: true }, 'اِبْدَأ مِن هُنا');
    el.append(tip);
    const Ltot = ghost.getTotalLength();
    const N = 160;
    const pts = Array.from({ length: N + 1 }, (_, i) => { const q = ghost.getPointAtLength(Ltot * i / N); return [q.x, q.y]; });
    start.setAttribute('cx', pts[0][0]); start.setAttribute('cy', pts[0][1]);
    startRing.setAttribute('cx', pts[0][0]); startRing.setAttribute('cy', pts[0][1]);
    [ink, demoInk].forEach((p) => { p.style.strokeDasharray = Ltot + ' ' + Ltot; p.style.strokeDashoffset = Ltot; });
    // أسهم الاتّجاه
    (F.arrows || []).forEach((f) => {
      const a = ghost.getPointAtLength(Ltot * f), b = ghost.getPointAtLength(Math.min(Ltot, Ltot * f + 5));
      const tx = b.x - a.x, ty = b.y - a.y, tl = Math.hypot(tx, ty) || 1;
      let nx = -ty / tl, ny = tx / tl;
      const off = V8 ? F.hw + 4.6 : 6.5, al = V8 ? 5 : 4;
      if (V8) { // arrow outside the letter: the side farther from the centre of the glyph box
        const cx = F.box[0] + F.box[2] / 2, cy = F.box[1] + F.box[3] / 2;
        if (Math.hypot(a.x + nx * off - cx, a.y + ny * off - cy) < Math.hypot(a.x - nx * off - cx, a.y - ny * off - cy)) { nx = -nx; ny = -ny; }
      }
      const x1 = a.x + nx * off - (tx / tl) * al, y1 = a.y + ny * off - (ty / tl) * al, x2 = a.x + nx * off + (tx / tl) * al, y2 = a.y + ny * off + (ty / tl) * al;
      svgEl('path', { d: `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`, 'marker-end': 'url(#' + id + 'a)' }, arr);
    });
    // سياق الكلمة (نصّ قبل الشكل وبعده) — بعد تحميل الخطّ نقيس ونعيد ضبط الصندوق
    const FS = V8 ? F.fs : opt.fontSize || 36;
    const tBefore = opt.ctxBefore ? svgEl('text', { class: 'ctx', 'font-size': FS, y: F.base || 55 }, gCtx) : null;
    const tAfter = opt.ctxAfter ? svgEl('text', { class: 'ctx', 'font-size': FS, y: F.base || 55 }, gCtx) : null;
    if (tBefore) tBefore.textContent = opt.ctxBefore;
    if (tAfter) tAfter.textContent = opt.ctxAfter;
    function layout() {
      if (V8) return layout8();
      let left = vx, right = vx + vw;
      if (tAfter) { const w = tAfter.getComputedTextLength() || FS; tAfter.setAttribute('x', (F.exitL ? F.exitL[0] : vx) + 0.6); tAfter.setAttribute('text-anchor', 'start'); left = Math.min(left, (F.exitL ? F.exitL[0] : vx) - w - 3); }
      if (tBefore) { const w = tBefore.getComputedTextLength() || FS; tBefore.setAttribute('x', (F.exitR ? F.exitR[0] : vx + vw) - 0.6); tBefore.setAttribute('text-anchor', 'end'); right = Math.max(right, (F.exitR ? F.exitR[0] : vx + vw) + w + 3); }
      X0 = left; W0 = right - left;
      svg.setAttribute('viewBox', `${X0} ${vy} ${W0} ${vh}`);
      el.style.setProperty('--wp-ar', (W0 / vh).toFixed(3));
      lines.replaceChildren();
      const base = F.base || (vy + vh * 0.62);
      svgEl('line', { x1: X0, x2: X0 + W0, y1: base, y2: base, class: 'baseline' }, lines);
      svgEl('line', { x1: X0, x2: X0 + W0, y1: base - 22, y2: base - 22, class: 'midline' }, lines);
      placeTip();
    }
    /* v8: the rest of the word is typeset in the same font at the same size, placed at the glyph's own join points
       (text after = ends at the meem's origin · text before = starts at its advance), so it joins the traced meem exactly */
    function layout8() {
      let left = vx, right = vx + vw, top = vy, bot = vy + vh;
      if (tAfter) { const w = tAfter.getComputedTextLength() || FS; tAfter.setAttribute('x', F.origin); tAfter.setAttribute('text-anchor', 'start'); left = Math.min(left, F.origin - w - 3); }
      if (tBefore) { const w = tBefore.getComputedTextLength() || FS; tBefore.setAttribute('x', F.adv); tBefore.setAttribute('text-anchor', 'end'); right = Math.max(right, F.adv + w + 3); }
      if (tAfter || tBefore) { top = Math.min(top, F.base - FS * 0.74); bot = Math.max(bot, F.base + FS * 0.3); }
      // SCI-1 T2 (owner GLOBAL «diacritics inside the frame»): grow the box to the context text's real extent (e.g. the damma of «نُـ»)
      [tBefore, tAfter].forEach((t) => { if (!t) return; try { const bb = t.getBBox(); if (bb.height) { top = Math.min(top, bb.y); bot = Math.max(bot, bb.y + bb.height); } } catch (e) { /* not rendered yet */ } });
      // SCI-1 T2: the direction arrows sit outside the letter — keep them (and their arrow heads) inside the writing card too
      try { const ab = arr.getBBox(); if (ab.width) { left = Math.min(left, ab.x - 3); right = Math.max(right, ab.x + ab.width + 3); top = Math.min(top, ab.y - 3); bot = Math.max(bot, ab.y + ab.height + 3); } } catch (e) { /* */ }
      top -= 4; bot += 4; left -= 3; right += 3;
      X0 = left; W0 = right - left;
      svg.setAttribute('viewBox', `${X0} ${top} ${W0} ${bot - top}`);
      el.style.setProperty('--wp-ar', (W0 / (bot - top)).toFixed(3));
      lines.replaceChildren();
      svgEl('line', { x1: X0, x2: X0 + W0, y1: F.base, y2: F.base, class: 'baseline' }, lines);
      svgEl('line', { x1: X0, x2: X0 + W0, y1: F.base - FS * 0.39, y2: F.base - FS * 0.39, class: 'midline' }, lines);
      placeTip();
    }
    function placeTip() {
      const r = svg.viewBox.baseVal; if (!r || !r.width) return;
      tip.style.left = ((pts[0][0] - r.x) / r.width * 100) + '%';
      tip.style.top = ((pts[0][1] - r.y) / r.height * 100) + '%';
    }
    // ملاحظة: نصّ SVG بالعربية يحتاج dir=rtl ليختار text-anchor جهة البداية الصحيحة
    [tBefore, tAfter].forEach((t) => { if (t) { t.setAttribute('direction', 'rtl'); t.style.direction = 'rtl'; } });
    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (el.isConnected) layout(); });
    if (document.fonts && document.fonts.load) document.fonts.load(V8 ? '700 46px "BQ8 Letter"' : '700 46px "Scheherazade New"').then(() => { if (el.isConnected) layout(); }).catch(() => {});

    let guide = opt.guide || 'road', arrows = opt.arrows == null ? true : opt.arrows, showStartDot = opt.start !== false;
    const inkMode = opt.ink || (guide === 'none' ? 'free' : 'path');
    function apply() {
      el.dataset.guide = guide;
      el.classList.toggle('arr-faint', arrows === 'faint');
      el.classList.toggle('arr-off', !arrows);
      el.classList.toggle('no-start', !showStartDot);
    }
    apply();
    // v8: the corridor = the glyph's own pen width (half-width hw) + a small margin for small fingers
    const TOL = opt.tol || (V8 ? F.hw + 3 : opt.form === 'iso' ? 9 : 7.5), START = opt.startTol || (V8 ? 8 : 7.5);
    let prog = 0, down = false, lost = false, done = false, fails = 0, resolveDone, trail = [], bad = null;
    const donePromise = new Promise((r) => { resolveDone = r; });
    const setInk = () => { ink.style.strokeDashoffset = Ltot * (1 - prog / N); };
    const toSvg = (e) => { const m = svg.getScreenCTM(); if (!m) return null; const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(m.inverse()); return [q.x, q.y]; };
    const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const flashNext = () => { const i = Math.min(N, prog + 14); nextp.setAttribute('cx', pts[i][0]); nextp.setAttribute('cy', pts[i][1]); nextp.classList.remove('on'); void nextp.getBBox(); nextp.classList.add('on'); };
    function showStart() {
      showStartDot = true; apply();
      start.classList.remove('pulse'); void start.getBBox(); start.classList.add('pulse');
      startRing.classList.remove('on'); void startRing.getBBox(); startRing.classList.add('on');
      placeTip(); tip.hidden = false; X.anim(tip, 'is-in', 2600);
      clearTimeout(tip._t); tip._t = setTimeout(() => { tip.hidden = true; }, 2600);
    }
    function clearInk() { prog = 0; lost = false; trail = []; free.setAttribute('d', ''); setInk(); }
    function fail(reason) {
      fails++;
      clearInk();
      el.classList.add('is-retry'); setTimeout(() => el.classList.remove('is-retry'), 500);
      if (opt.onFail) opt.onFail(reason, fails);
    }
    function finish(info) {
      if (done) return; done = true; down = false;
      if (!(info && info.failed)) { prog = N; setInk(); el.classList.add('is-done'); } else el.classList.add('is-over');
      tip.hidden = true;
      const out = Object.assign({ fails }, info || {});
      resolveDone(out);
      if (opt.onOk) opt.onOk(out);
    }
    const drawFreeAny = () => { free.setAttribute('d', trail.length ? 'M' + trail.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') : ''); };
    const drawFree = () => { if (inkMode !== 'free') return; free.setAttribute('d', trail.length ? 'M' + trail.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') : ''); };
    const advance = (p) => {
      trail.push(p); drawFree();
      let best = -1, bd = 1e9;
      const lo = Math.max(0, prog - 6), hi = Math.min(N, prog + 24);
      for (let i = lo; i <= hi; i++) { const dd = d2(p, pts[i]); if (dd < bd) { bd = dd; best = i; } }
      if (bd > TOL) { if (!lost) { lost = true; if (guide !== 'none') flashNext(); } return; }
      if (lost) { if (Math.abs(best - prog) > 12) return; lost = false; }
      if (best > prog) { prog = best; if (inkMode === 'path') setInk(); }
      if (prog >= N - 3) finish({});
    };
    svg.addEventListener('pointerdown', (e) => {
      if (done || el.classList.contains('is-demo') || el.classList.contains('is-locked')) return;
      if (e.button && e.button !== 0) return;
      if (e.cancelable) e.preventDefault();
      const p = toSvg(e); if (!p) return;
      if (opt.oneShot && d2(p, pts[0]) > START + 4) {
        // قياس محايد: ضربة تبدأ بعيداً تُحسب محاولةً (لا تلميح)؛ اللمسة بلا حركة تُتجاهل
        bad = { p, moved: false }; trail = [p];
        try { svg.setPointerCapture(e.pointerId); } catch (x) { /* */ }
        return;
      }
      if (d2(p, pts[0]) > START + 4) {
        if (opt.lenient && prog > 0 && d2(p, pts[prog]) <= TOL * 1.3) { /* يكمل من حيث توقّف (التتبّع الأوّل فقط) */ }
        else { fail('start'); showStart(); return; }
      } else if (prog > 0) clearInk();
      down = true; lost = false; start.classList.remove('pulse'); tip.hidden = true;
      try { svg.setPointerCapture(e.pointerId); } catch (x) { /* */ }
      advance(p);
    });
    svg.addEventListener('pointermove', (e) => {
      if (bad && !done) { const p = toSvg(e); if (p) { trail.push(p); if (d2(p, bad.p) > 4) bad.moved = true; const m = inkMode; drawFreeAny(); void m; } return; }
      if (!down || done) return; if (e.cancelable) e.preventDefault();
      const ev = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      (ev && ev.length ? ev : [e]).forEach((c) => { const p = toSvg(c); if (p && down) advance(p); });
    });
    const up = (e) => {
      if (bad) { const b = bad; bad = null; try { svg.releasePointerCapture(e.pointerId); } catch (x) { /* */ } if (b.moved && !done) { fails++; finish({ failed: true }); } else { trail = []; free.setAttribute('d', ''); } return; }
      if (!down) return; down = false;
      try { svg.releasePointerCapture(e.pointerId); } catch (x) { /* */ }
      if (done) return;
      if (prog >= N * 0.8 && !lost) { finish({}); return; }
      if (opt.lenient && prog > 0 && !lost) { flashNext(); return; } // التتبّع الأوّل: يُسمح بالرفع والمتابعة
      if (opt.oneShot) { if (trail.length > 3) { fails++; finish({ failed: true }); } return; }
      fail('off'); showStart();
    };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    const noScroll = (e) => { if (e.cancelable) e.preventDefault(); };
    el.addEventListener('touchstart', noScroll, { passive: false });
    el.addEventListener('touchmove', noScroll, { passive: false });
    el.addEventListener('contextmenu', noScroll);
    let runT = 0;
    return {
      el, done: donePromise,
      get fails() { return fails; },
      get progress() { return prog / N; },
      showStart,
      setGuide(g) { guide = g; apply(); },
      setArrows(a) { arrows = a; apply(); },
      lock(v) { el.classList.toggle('is-locked', v !== false); },
      /** نقطة تجري على المسار وتعيد (تلميح المحاولة الثانية) */
      runner(on) {
        cancelAnimationFrame(runT);
        if (on === false || reduced()) { runnerDot.setAttribute('cx', -9999); return; }
        const t0 = performance.now(), dur = 2200;
        const tick = () => { if (!el.isConnected || done) { runnerDot.setAttribute('cx', -9999); return; } const k = ((performance.now() - t0) % (dur + 600)) / dur; const q = pts[Math.round(Math.min(1, k) * N)]; runnerDot.setAttribute('cx', q[0]); runnerDot.setAttribute('cy', q[1]); runT = requestAnimationFrame(tick); };
        runT = requestAnimationFrame(tick);
      },
      /** القلم يرسم الشكل بحركة واحدة (النموذج / بارق يرسم ببطء) */
      demo(ms, keep) {
        ms = reduced() ? 350 : ms || 2600;
        el.classList.add('is-demo');
        const pen = svgEl('circle', { class: 'pen', r: 3, cx: pts[0][0], cy: pts[0][1] }, svg);
        demoInk.style.opacity = 1; demoInk.style.strokeDashoffset = Ltot;
        return new Promise((res) => {
          const t0 = performance.now();
          const tick = () => {
            if (!el.isConnected) { pen.remove(); res(); return; }
            const k = Math.min(1, (performance.now() - t0) / ms);
            const q = pts[Math.round(k * N)];
            pen.setAttribute('cx', q[0]); pen.setAttribute('cy', q[1]);
            demoInk.style.strokeDashoffset = Ltot * (1 - k);
            if (k < 1) requestAnimationFrame(tick);
            else { pen.remove(); el.classList.remove('is-demo'); if (!keep) setTimeout(() => { demoInk.style.strokeDashoffset = Ltot; }, 500); res(); }
          };
          requestAnimationFrame(tick);
        });
      },
      /** يُتمّ الشكل (بمساعدة) */
      fill() { finish({ assisted: true }); },
      reset() { done = false; fails = 0; down = false; el.classList.remove('is-done'); clearInk(); start.classList.add('pulse'); },
      /** بعد النجاح: يستبدل اللوحة بالكلمة مطبوعة والميم مرجانية */
      typeset(word) {
        const w = h('div.x7-wp-word', null, X.markMeem(word));
        // v8: the printed word replaces the pad at the SAME letter size the child just traced
        if (V8) { const vb = svg.viewBox.baseVal; if (vb && vb.height && el.clientHeight) w.style.fontSize = (el.clientHeight * FS / vb.height).toFixed(1) + 'px'; }
        el.classList.add('is-typeset');
        el.append(w);
        return w;
      },
      pts, svg,
    };
  };

  /* ================= أفواه (S4) وأيقونات ================= */
  X.ICON = {
    ear: '<svg viewBox="0 0 48 48"><path d="M16 20a10 10 0 1 1 18 6c-2 3-5 4-5 8a5 5 0 0 1-9 2" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M21 21a4 4 0 1 1 7 2" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
    speaker: '<svg viewBox="0 0 48 48"><path d="M8 18h8l11-9v30l-11-9H8z" fill="currentColor"/><path d="M32 17a9 9 0 0 1 0 14M36.5 12a16 16 0 0 1 0 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 48 48"><path d="M11 25l9 9 17-19" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    star: '<svg viewBox="0 0 48 48"><path d="M24 4l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 33.2 12.1 39.9 15 26.7l-10-9 13.4-1.4z" fill="#FEBA02" stroke="#C98F00" stroke-width="2" stroke-linejoin="round"/></svg>',
    sprout: '<svg viewBox="0 0 48 48"><path d="M24 44V24" stroke="#1B7F53" stroke-width="4" stroke-linecap="round"/><path d="M24 26c-2-9-9-13-17-12 1 8 8 13 17 12zM24 22c2-8 8-12 16-11-1 8-7 12-16 11z" fill="#3DBB6B" stroke="#1B7F53" stroke-width="2" stroke-linejoin="round"/><path d="M12 44h24" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/></svg>',
    print: '<svg viewBox="0 0 48 48"><path d="M14 18V6h20v12" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/><rect x="6" y="18" width="36" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M14 28h20v14H14z" fill="#fff" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/></svg>',
    undo: '<svg viewBox="0 0 48 48"><path d="M18 14 8 24l10 10" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 24h19a11 11 0 0 1 0 22h-6" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/></svg>',
    trash: '<svg viewBox="0 0 48 48"><path d="M10 14h28M19 14V9h10v5M14 14l2 26h16l2-26" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pencil: '<svg viewBox="0 0 48 48"><path d="M8 40l3-11L31 9l8 8-20 20z" fill="#FEBA02" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M8 40l3-11 8 8z" fill="#F7D9B0" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
    book: '<svg viewBox="0 0 48 48"><path d="M6 10c6-2 12-1 18 3 6-4 12-5 18-3v28c-6-2-12-1-18 3-6-4-12-5-18-3z" fill="#D6EEFE" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M24 13v28" stroke="currentColor" stroke-width="3"/></svg>',
    chat: '<svg viewBox="0 0 48 48"><path d="M6 10h36v22H20l-9 8v-8H6z" fill="#FBE65B" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
    train: '<svg viewBox="0 0 96 48"><rect x="4" y="12" width="26" height="22" rx="5" fill="currentColor" opacity=".35"/><rect x="35" y="12" width="26" height="22" rx="5" fill="currentColor" opacity=".35"/><rect x="66" y="12" width="26" height="22" rx="5" fill="currentColor"/><circle cx="12" cy="38" r="4" fill="currentColor"/><circle cx="23" cy="38" r="4" fill="currentColor"/><circle cx="43" cy="38" r="4" fill="currentColor"/><circle cx="54" cy="38" r="4" fill="currentColor"/><circle cx="74" cy="38" r="4" fill="currentColor"/><circle cx="85" cy="38" r="4" fill="currentColor"/></svg>',
    shortlong: '<svg viewBox="0 0 64 48"><circle cx="50" cy="16" r="6" fill="currentColor"/><rect x="6" y="30" width="52" height="10" rx="5" fill="currentColor"/></svg>',
    ears2: '<svg viewBox="0 0 64 48"><circle cx="18" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="4"/><path d="M40 14h16v20H40z" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
    letter: '<svg viewBox="0 0 48 48"><rect x="5" y="5" width="38" height="38" rx="9" fill="#FEFEDE" stroke="currentColor" stroke-width="3"/><text x="24" y="31" font-size="24" text-anchor="middle" font-family="Scheherazade New" fill="#E4553F" font-weight="700">م</text></svg>',
    mouth: '<svg viewBox="0 0 48 48"><path d="M8 24c5-6 11-7 16-4 5-3 11-2 16 4-5 7-11 9-16 9s-11-2-16-9z" fill="#E4553F"/><path d="M11 24h26" stroke="#FEFEDE" stroke-width="2.5"/></svg>',
  };
  X.icon = (name, cls) => h('span.x7-ic' + (cls ? '.' + cls : ''), { 'aria-hidden': 'true', html: X.ICON[name] || '' });

  /* ================= لوحة المعلّم المخفيّة (ضغط مطوَّل ١٫٥ ث) ================= */
  X.longPress = function (el, ms, fn) {
    let t = 0;
    const start = (e) => { clearTimeout(t); el.classList.add('is-hold'); t = setTimeout(() => { el.classList.remove('is-hold'); fn(); }, ms || 1500); };
    const stop = () => { clearTimeout(t); el.classList.remove('is-hold'); };
    el.addEventListener('pointerdown', start); el.addEventListener('pointerup', stop); el.addEventListener('pointerleave', stop); el.addEventListener('pointercancel', stop);
    el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(); } });
    el.addEventListener('keyup', stop);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  };

  /* ================= دليل المعلّم (درج «ملاحظات النشاط») ================= */
  X.esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  X.note = function (ctx, html) {
    try { if (ctx.adultNote) ctx.adultNote(html); else if (ctx.adult) ctx.adult(html); } catch (e) { /* */ }
  };


  /* ================= الطباعة (للمعلّم/وليّ الأمر فقط — من دليل المعلّم) ================= */
  /** يطبع صفحات A4: pages = [{img: url} | {node: Element}] — إطار مخفيّ، لا نافذة منبثقة */
  X.print = function (pages, opt) {
    opt = opt || {};
    const old = document.getElementById('x7-print'); if (old) old.remove();
    const st = document.getElementById('x7-print-st') || document.head.appendChild(h('style', { id: 'x7-print-st' }));
    st.textContent = '#x7-print { display: none; } @media print { @page { size: A4 ' + (opt.landscape ? 'landscape' : 'portrait') + '; margin: 10mm; } ' +
      'html body.x7-printing > *:not(#x7-print) { display: none !important; } body.x7-printing { background: #fff !important; margin: 0 !important; } ' +
      'body.x7-printing #x7-print { display: block !important; } #x7-print .pg { page-break-after: always; break-after: page; display: flex; align-items: center; justify-content: center; height: ' + (opt.landscape ? '186mm' : '273mm') + '; overflow: hidden; } ' +
      '#x7-print .pg:last-child { page-break-after: auto; break-after: auto; } #x7-print .pg img { max-width: 100%; max-height: 100%; object-fit: contain; } #x7-print .x7-tile, #x7-print .x7-zone { box-shadow: none !important; } }';
    const box = h('div', { id: 'x7-print', dir: 'rtl', lang: 'ar', 'aria-hidden': 'true' });
    pages.forEach((p) => { const pg = h('section.pg'); if (p.img) pg.append(h('img', { src: p.img, alt: '' })); else if (p.node) pg.append(p.node); box.append(pg); });
    document.body.append(box);
    document.body.classList.add('x7-printing');
    const cleanup = () => { document.body.classList.remove('x7-printing'); box.remove(); window.removeEventListener('afterprint', cleanup); document.removeEventListener('pointerdown', cleanup, true); };
    window.addEventListener('afterprint', cleanup);
    const imgs = [...box.querySelectorAll('img')];
    Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? 1 : new Promise((r) => { i.onload = i.onerror = r; })))).then(() => (document.fonts && document.fonts.ready) || 1).then(() => {
      setTimeout(() => { try { window.print(); } catch (e) { /* */ } /* iPad Safari: print() لا يحجب — التنظيف عند afterprint، أو عند أوّل لمسة بعد العودة */ setTimeout(() => document.addEventListener('pointerdown', cleanup, { once: true, capture: true }), 1200); }, 150);
    });
    return box;
  };

  /** اسم الحرف يُقرن بصوته (DECISIONS ب · R1-10): يقول سطر الافتتاح، وإن لم يذكر نصُّه «صَوْتُهُ/صَوْتُها مَ» أتبعه بارق «حَرْفُ المِيمِ! صَوْتُهُ: مَ!» */
  X.NAME_SOUND = 'bq7_E06_brq_wow';
  X.saysSound = (id) => /صَوْتُ(?:هُ|ها)[:،\s]*مَ/.test(X.text(id) || '');
  X.nameSound = async function (S, id) {
    await S.say(id);
    if (!X.saysSound(id)) await S.say(X.NAME_SOUND);
  };

  /* ================= v8 (THEME8.md · owner R3) — draft_unapproved ================= */
  /* ?theme=8 → <html data-theme="8"> + theme8.css. Then every IX2 element is drawn on a .bq8-stage (island or wooden board):
     HUD (the platform's own instruction row — speaker + function chip + bubble/caption — is MOVED into the HUD so CC, replay and
     captions keep working; restored on cleanup) · framed panel (= the element root) · stars · Bariq slot. Without theme 8: v7 as before. */
  X.v8 = () => document.documentElement.dataset.theme === '8';
  let cur8 = null;
  X.cur8 = () => cur8;
  X.i8 = (name, cls) => h('i.bq8-ic.bq8-ic--' + name + (cls ? '.' + cls : ''), { 'aria-hidden': 'true' });
  /** round sticker button: X.btn8('ear', {hue:'ear', size:'sm', label:'…', onclick}) */
  X.btn8 = (icon, o) => { o = o || {}; return h('button.bq8-btn.bq8-btn--' + (o.hue || icon) + (o.size ? '.bq8-btn--' + o.size : '') + (o.cls ? '.' + o.cls : ''), { type: 'button', 'aria-label': o.label || '', onclick: o.onclick || null }, X.i8(icon)); };
  const FN8 = { ear: 'ear', hand: 'hand_drag', mouth: 'mouth', eye: 'eye', pencil: 'pencil', touch: 'touch', puzzle: 'puzzle' };
  X.frame8 = function (ctx, cls, opt) {
    opt = opt || {};
    const a = (ctx.age && ctx.age()) || BQ.state.age || '4-6';
    const ageCls = a === '4-6' ? '.a46' : a === '10-12' ? '.a1012' : '.a79';
    const wrap = h('div.x7v8', { dir: 'rtl', lang: 'ar' });
    const st = h('div.bq8-stage.' + (opt.board ? 'bq8-board' : 'bq8-island') + (opt.nobariq ? '.bq8-stage--nobariq' : '') + (opt.bariqTop ? '.x7-brq-top' : ''));
    const hud = h('div.bq8-hud');
    const panel = h('div.bq8-panel.x7.x7p' + (cls ? '.' + cls : '') + ageCls + (opt.panel || []).map((m) => '.bq8-panel--' + m).join(''), { dir: 'rtl', lang: 'ar' });
    const stars = opt.stars ? h('div.bq8-stars' + (opt.stars > 3 ? '.bq8-stars--' + opt.stars : ''), { 'aria-hidden': 'true' }, Array.from({ length: opt.stars }, () => h('i.bq8-star'))) : null;
    const bq = h('div.bq8-bariq', { 'aria-hidden': 'true' });
    st.append(hud, panel); if (stars) st.append(stars); st.append(bq);
    wrap.append(st); ctx.stage.append(wrap);
    ctx.stage.classList.add('x7v8-host');
    // the platform instruction row → HUD (speaker = big listen sticker · function chip = icons8 · bubble = instruction / caption)
    const instr = ctx.frame && ctx.frame.querySelector('.elp-instr');
    if (instr) {
      const home = instr.parentNode, nextSib = instr.nextSibling;
      const say = instr.querySelector('.elp-say');
      const bub = instr.querySelector('.elp-bubble');
      let ic = null;
      if (say) { ic = X.i8('listen', 'x7-say8'); say.append(ic); }
      if (bub) bub.classList.add('x7-bub8');
      hud.prepend(instr);
      ctx.onCleanup(() => { if (ic) ic.remove(); if (bub) bub.classList.remove('x7-bub8'); if (home && home.isConnected) home.insertBefore(instr, nextSib && nextSib.parentNode === home ? nextSib : home.firstChild); ctx.stage.classList.remove('x7v8-host'); });
      const orig = ctx.instruction;
      /* FIX12-B B-05: the platform's ctx.instruction(text, line) STARTS the line, and every IX2 element then says the same line itself
         (S.say / X.nameSound) → the first words were heard twice. Here the bubble + replay are set WITHOUT starting it; the element says it once. */
      ctx.instruction = function (text, lineId, o) {
        hud.dataset.fn = FN8[(o && o.icon) || ''] || 'ear';
        if (!lineId) return orig.call(ctx, text, lineId, o);
        const realSay = ctx.say;
        ctx.say = () => Promise.resolve();
        try { orig.call(ctx, text, lineId, o); } finally { ctx.say = realSay; }
        nowrapGroups();
        return Promise.resolve();
      };
      /* FIX12-B B-07: a bracketed syllable list «(مَ – مِ – مُ)» (+ its «؟») stays on ONE line in the bubble */
      const nowrapGroups = () => {
        const tEl = instr.querySelector('.elp-instr-t'); if (!tEl) return;
        const t = tEl.textContent || ''; const re = /\([^()]{1,30}\)[؟،.:]?/g; if (!re.test(t)) return;
        re.lastIndex = 0; const out = []; let last = 0, m;
        while ((m = re.exec(t))) { if (m.index > last) out.push(t.slice(last, m.index)); out.push(h('span', { style: { whiteSpace: 'nowrap' } }, m[0])); last = m.index + m[0].length; }
        out.push(t.slice(last)); tEl.replaceChildren(...out);
      };
      ctx.onCleanup(() => { ctx.instruction = orig; });
    }
    // fit: the 1180×820 stage, as large as the play area allows; in a tall (portrait) area the stage grows taller (--u stays width-based)
    const fit = () => {
      const W = wrap.clientWidth, H = wrap.clientHeight; if (!W || !H) return;
      let w = W, hh = W * 820 / 1180;
      if (hh > H) { hh = H; w = H * 1180 / 820; }
      else if (opt.tall !== false) hh = Math.min(H, W * 1.42);
      st.style.width = Math.floor(w) + 'px'; st.style.height = Math.floor(hh) + 'px';
      const tall = hh / w > 0.86;
      st.classList.toggle('is-tall', tall);
      panel.classList.toggle('is-tall', tall);
      panel.style.setProperty('--H', Math.round(hh) + 'px');
      if (opt.onFit) opt.onFit({ w, h: hh, tall });
    };
    fit();
    if (window.ResizeObserver) { const ro = new ResizeObserver(fit); ro.observe(wrap); ctx.onCleanup(() => ro.disconnect()); }
    let starN = 0;
    const api = {
      wrap, stage: st, hud, panel, starsEl: stars, bariq: bq, fit,
      /** light the next star (RTL: the first star is the right-most) */
      star() { if (!stars) return; const s = stars.children[starN]; if (s) { s.classList.add('is-on'); starN++; } },
      starsTo(n) { if (!stars) return; while (starN < Math.min(n, stars.children.length)) api.star(); },
      get stars() { return starN; },
    };
    panel._8 = api; cur8 = api;
    ctx.onCleanup(() => { if (cur8 === api) cur8 = null; });
    return panel;
  };
  /** v8 progress dots in the HUD (no numbers) — same API as X.dots */
  X.progress8 = function (n) {
    const el = h('div.bq8-progress', { 'aria-hidden': 'true' });
    const ds = Array.from({ length: n }, () => h('i'));
    el.append(...ds);
    if (cur8) cur8.hud.append(el);
    return { el, set(i) { ds.forEach((d, j) => { d.className = j < i ? 'is-done' : j === i ? 'is-now' : ''; }); } };
  };
  /** E11-style replay: hover (mouse/pen) replays after a short dwell · touch-hold replays WITHOUT answering · the ear chip replays
   *  (tap) without answering. play() → Promise. canPlay() false while the question is being asked. o.holdMs / o.onHeld optional. Returns {held} */
  X.replayable = function (card, play, o) {
    o = o || {};
    let last = 0, dwell = 0, holdT = 0, held = false;
    const can = () => !o.canPlay || o.canPlay();
    const fire = () => { const now = Date.now(); if (now - last < 1200 || !can()) return; last = now; card.classList.add('is-say'); Promise.resolve(play()).finally(() => card.classList.remove('is-say')); };
    card.classList.add('bq8-card--hoverplay');
    card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'touch') return; clearTimeout(dwell); dwell = setTimeout(fire, 180); });
    card.addEventListener('pointerleave', () => clearTimeout(dwell));
    // o.holdMs: touch-hold time (default 480 ms, unchanged) · o.onHeld(): called after a held replay (e.g. show «not answered yet — tap»)
    card.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return; held = false; clearTimeout(holdT); holdT = setTimeout(() => { held = true; last = 0; fire(); if (o.onHeld) o.onHeld(); }, o.holdMs || 480); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => card.addEventListener(t, () => clearTimeout(holdT)));
    card.addEventListener('click', (e) => { if (held) { held = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    card.addEventListener('contextmenu', (e) => e.preventDefault());
    if (o.ear) o.ear.addEventListener('click', (e) => { e.stopImmediatePropagation(); e.preventDefault(); last = 0; fire(); }, true);
    return { get held() { return held; } };
  };
  /** first-time coach: a hand glides to each ear chip (= «you can listen again here»), then taps the row (= «now touch one») */
  /* FIX12-B B-06: a touch on the row (or anywhere on the stage) during the hand ends the coaching AT ONCE (the promise resolves on
     pointerdown), so the element's tap handler — attached right after — receives that same tap's click. */
  X.coach = async function (S, targets, row) {
    if (!cur8 || reduced() || !targets.length) return;
    const st = cur8.stage, sr = () => st.getBoundingClientRect();
    const hand = h('i.bq8-ic.bq8-ic--touch.x7-coach', { 'aria-hidden': 'true' });
    st.append(hand);
    const at = (el, dy) => { const r = el.getBoundingClientRect(), s = sr(); hand.style.left = (r.left + r.width / 2 - s.left) + 'px'; hand.style.top = (r.top + r.height / 2 - s.top + (dy || 0)) + 'px'; };
    let stop = false, wake;
    const cut = new Promise((r) => { wake = r; });
    const onDown = () => { stop = true; hand.remove(); targets.forEach((t) => t.classList.remove('x7-coach-hit')); wake(); };
    st.addEventListener('pointerdown', onDown, true);
    const run = (async () => {
      at(targets[0], 60); await S.sleep(30); if (stop) return; hand.classList.add('on');
      for (const t of targets) { if (stop) return; at(t, 0); await S.sleep(520); if (stop) return; t.classList.add('x7-coach-hit'); await S.sleep(380); t.classList.remove('x7-coach-hit'); }
      if (row && !stop) { at(row, 0); await S.sleep(500); if (stop) return; hand.classList.add('tap'); await S.sleep(900); }
    })();
    try { await Promise.race([run, cut]); } finally { st.removeEventListener('pointerdown', onDown, true); hand.remove(); }
  };

  /* ================= الأنماط ================= */
  const CSS = `
.x7 { --x7-touch: 60px; position: relative; width: 100%; flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: clamp(8px, 2cqi, 18px); padding: 0 4px; box-sizing: border-box; }
.x7.a79, .x7.a1012 { --x7-touch: 48px; }
.x7, .x7 * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
.x7 :is(button, [role="button"]) { touch-action: manipulation; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; font-family: inherit; }
.x7 img, .x7 svg { -webkit-user-drag: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
.x7-in { animation: x7In .38s cubic-bezier(.2,.9,.3,1.15) both; }
@keyframes x7In { from { opacity: 0; transform: translateY(12px) scale(.97); } }
.x7-row { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2.4cqi, 22px); flex-wrap: wrap; max-width: 100%; }
.x7-sr { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.x7-ic { display: inline-grid; place-items: center; width: 1em; height: 1em; line-height: 0; }
.x7-ic svg { width: 100%; height: 100%; }
/* النصّ العربيّ للطفل */
.x7-w { font-family: var(--ff-child, 'Scheherazade New', serif); font-weight: 700; color: var(--navy, #00345B); line-height: 1.5; white-space: nowrap; }
.x7-w b { color: var(--coral, #E4553F); font-weight: 700; }
/* الصورة */
.x7-pic { position: relative; display: block; width: 100%; height: 100%; overflow: hidden; border-radius: inherit; background: #FFF8EC; }
.x7-pic > img { display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.x7-pic.is-ph { background: radial-gradient(circle at 50% 40%, #FFFDF5, #FBEFD5); }
.x7-pic-ph { position: absolute; inset: 0; display: grid; place-items: center; padding: 6%; }
.x7-pic-w { font: 700 clamp(18px, 5cqi, 40px)/1.3 var(--ff-child); color: var(--navy); text-align: center; }
.x7-pic-q { font: 700 clamp(28px, 8cqi, 64px)/1 var(--ff-ui, sans-serif); color: #C9B48A; }
/* أزرار عامّة */
.x7-btn { min-height: var(--x7-touch); min-width: var(--x7-touch); padding: 0 22px; border: 0; border-radius: 999px; background: var(--sun, #FEBA02); color: var(--navy); font: 700 19px/1 var(--ff-ui, sans-serif); display: inline-flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; box-shadow: 0 5px 0 var(--sun-edge, #D99A00); }
.x7-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--sun-edge, #D99A00); }
.x7-btn.ghost { background: var(--white); box-shadow: 0 4px 0 var(--sky-line, #D5EBF7), 0 0 0 2px var(--sky-line) inset; }
.x7-btn .x7-ic { width: 28px; height: 28px; }
.x7-btn:focus-visible, .x7-tile:focus-visible, .x7-zone:focus-visible, .x7-choice:focus-visible, .x7-ear:focus-visible { outline: 4px solid var(--navy); outline-offset: 3px; }
.x7-ear { flex: none; width: var(--x7-touch); height: var(--x7-touch); border-radius: 50%; border: 0; background: var(--sky, #00AEED); color: #fff; display: inline-grid; place-items: center; cursor: pointer; box-shadow: 0 4px 0 #0084B5; padding: 0; }
.x7-ear .x7-ic { width: 58%; height: 58%; }
.x7-ear.is-on { animation: x7Pulse .9s ease-in-out infinite; }
.x7-ear:active { transform: translateY(3px); box-shadow: 0 1px 0 #0084B5; }
@keyframes x7Pulse { 50% { transform: scale(1.1); } }
/* بلاطة قابلة للسحب */
.x7-tile:not(.x7-8) { position: relative; flex: none; min-width: max(var(--x7-touch), 64px); min-height: max(var(--x7-touch), 64px); padding: 4px 14px 10px; border-radius: 18px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 5px 0 #E2C98A, 0 10px 18px var(--shade); display: inline-flex; align-items: center; justify-content: center; cursor: grab; touch-action: none; -webkit-user-select: none; user-select: none; transition: transform .15s, opacity .2s, box-shadow .2s; }
.x7-tile:not(.x7-8) .x7-w { font-size: clamp(30px, 6.4cqi, 54px); line-height: 1.45; }
.x7-tile:not(.x7-8).is-sel { border-color: var(--sky); box-shadow: 0 0 0 5px rgba(0,174,237,.35), 0 5px 0 #E2C98A; transform: translateY(-3px); }
.x7-tile.is-lifted { opacity: .25; }
.x7-tile.is-used { visibility: hidden; }
.x7-tile:not(.x7-8).is-glow { box-shadow: 0 0 0 6px var(--sun), 0 0 26px var(--sun); }
.x7-tile.is-dim { opacity: .35; pointer-events: none; }
.x7-ghost { position: fixed !important; z-index: 9999; pointer-events: none; margin: 0 !important; box-shadow: 0 16px 30px rgba(0,52,91,.28) !important; opacity: .96; }
.x7-ghost.x7-ghost-in { position: absolute !important; z-index: 60; inset: auto; transform-origin: 50% 50%; }
.x7-ghost img, .x7-ghost video, .x7-ghost canvas { max-width: 100%; -webkit-user-drag: none; -webkit-touch-callout: none; }
.x7-tile img { -webkit-user-drag: none; -webkit-touch-callout: none; user-select: none; -webkit-user-select: none; }
.x7-zone { transition: box-shadow .15s, background .15s, transform .15s; }
.x7-zone:not(.x7-8).is-over, .x7-has-sel .x7-zone:not(.x7-8):not(.is-full):not(.x7-off) { box-shadow: 0 0 0 4px rgba(0,174,237,.45); }
.x7-zone:not(.x7-8).is-over { transform: scale(1.04); background: #E3F5FD; }
.x7-zone:not(.x7-8).is-glow { box-shadow: 0 0 0 6px var(--sun), 0 0 24px var(--sun) !important; }
/* مؤشّرات */
.x7-dots { display: inline-flex; gap: 7px; justify-content: center; align-items: center; min-height: 32px; padding: 7px 14px; border-radius: 999px; background: var(--white, #fff); border: 1.5px solid var(--sky-line, #D5EBF7); }
.x7-dots i { width: 9px; height: 9px; border-radius: 99px; background: var(--sky-line, #D5EBF7); transition: width .35s, background .35s; }
.x7-dots i.on { background: var(--sun); }
.x7-dots i.cur { width: 24px; background: var(--sky); }
.x7-phase { display: inline-flex; gap: 6px; padding: 4px; border-radius: 999px; background: rgba(255,255,255,.8); box-shadow: 0 2px 8px var(--shade); }
.x7-phase span { padding: 4px 14px; border-radius: 999px; font: 700 15px/1.4 var(--ff-child); color: #6A879E; }
.x7-phase span.on { background: var(--navy); color: #fff; }
/* بارق الصغير */
.x7-buddy { position: absolute; z-index: 4; inset-inline-start: 2px; bottom: 2px; width: clamp(64px, 13cqi, 120px); aspect-ratio: 1; pointer-events: none; }
.x7-buddy img { width: 100%; height: 100%; object-fit: contain; }
@container stage (max-width: 520px) { .x7-buddy { width: 58px; } }
/* شرارات */
.x7-spark { position: fixed; z-index: 10000; width: 10px; height: 10px; border-radius: 3px; pointer-events: none; transform: translate(-50%, -50%); animation: x7Spark .75s ease-out forwards; }
@keyframes x7Spark { to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(200deg) scale(.4); opacity: 0; } }
.fx7-pop { animation: x7Pop .45s ease-out; }
@keyframes x7Pop { 40% { transform: scale(1.1); } }
.fx7-wob { animation: x7Wob .45s ease-in-out; }
@keyframes x7Wob { 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
/* لوحة الكتابة */
.x7-wp { position: relative; width: min(100%, calc(var(--wp-h, 300px) * var(--wp-ar, 1))); aspect-ratio: var(--wp-ar, 1); touch-action: none; -webkit-user-select: none; user-select: none; background: #fff; border-radius: 22px; box-shadow: 0 6px 0 var(--sky-line), 0 12px 26px var(--shade); }
.x7-wp-svg { width: 100%; height: 100%; display: block; overflow: visible; touch-action: none; cursor: crosshair; }
.x7-wp .x7-wp-box { fill: none; stroke: none; }
.x7-wp .baseline { stroke: #9CC9E6; stroke-width: .6; }
.x7-wp .midline { stroke: #D8EAF6; stroke-width: .45; stroke-dasharray: 2 2; }
.x7-wp .ctx { font-family: var(--ff-child, 'Scheherazade New'); font-weight: 700; fill: var(--navy); }
.x7-wp .road { fill: none; stroke: rgba(0,52,91,.09); stroke-width: 11; stroke-linecap: round; stroke-linejoin: round; }
.x7-wp .dots { fill: none; stroke: rgba(0,52,91,.45); stroke-width: 1.3; stroke-dasharray: .1 3.2; stroke-linecap: round; }
.x7-wp .ghost { fill: none; stroke: transparent; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
.x7-wp .ink, .x7-wp .free { fill: none; stroke: var(--navy); stroke-width: 6.5; stroke-linecap: round; stroke-linejoin: round; }
.x7-wp .free { stroke-width: 5.5; }
.x7-wp .demo { fill: none; stroke: #2E6CA6; stroke-width: 6.5; stroke-linecap: round; stroke-linejoin: round; opacity: .85; }
.x7-wp .arr path { fill: none; stroke: #E4553F; stroke-width: 1.5; stroke-linecap: round; }
.x7-wp.arr-faint .arr { opacity: .35; } .x7-wp.arr-off .arr { display: none; }
.x7-wp[data-guide="dots"] .road { stroke: rgba(0,52,91,.04); }
.x7-wp[data-guide="none"] .road, .x7-wp[data-guide="none"] .dots { display: none; }
.x7-wp[data-guide="bold"] .road { stroke: rgba(0,174,237,.16); } .x7-wp[data-guide="bold"] .dots { stroke: rgba(0,52,91,.75); stroke-width: 1.8; }
.x7-wp .start { fill: #22B14C; stroke: #fff; stroke-width: 1.1; }
.x7-wp .start.pulse { animation: x7Dot 1.1s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.x7-wp .start-ring { fill: none; stroke: #22B14C; stroke-width: 1.4; opacity: 0; transform-box: fill-box; transform-origin: center; }
.x7-wp .start-ring.on { animation: x7Ring 1s ease-out 3; }
@keyframes x7Ring { 0% { opacity: .9; transform: scale(.6); } 100% { opacity: 0; transform: scale(2.2); } }
.x7-wp.no-start .start, .x7-wp.no-start .start-ring { display: none; }
@keyframes x7Dot { 50% { transform: scale(1.5); } }
.x7-wp .runner { fill: var(--sun); stroke: #fff; stroke-width: .8; }
.x7-wp .nextp { fill: none; stroke: var(--sun); stroke-width: 1.5; opacity: 0; }
.x7-wp .nextp.on { animation: x7Next .9s ease-out 2; }
@keyframes x7Next { 0% { opacity: 1; r: 2; } 100% { opacity: 0; r: 7; } }
.x7-wp .pen { fill: #fff; stroke: #2E6CA6; stroke-width: 1.1; }
.x7-wp.is-done .start, .x7-wp.is-done .start-ring, .x7-wp.is-done .arr, .x7-wp.is-done .runner { display: none; }
.x7-wp.is-done .free { stroke: var(--ok, #1B7F53); }
.x7-wp.is-done { box-shadow: 0 0 0 4px var(--ok, #1B7F53), 0 12px 26px var(--shade); }
.x7-wp.is-retry { animation: x7Wob .4s ease-in-out; }
.x7-wp.is-typeset svg { opacity: 0; transition: opacity .3s; }
.x7-wp-word { position: absolute; inset: 0; display: grid; place-items: center; font-size: clamp(54px, 13cqi, 120px); animation: x7In .4s ease-out both; }
.x7-wp-tip { position: absolute; z-index: 3; transform: translate(-50%, calc(-100% - 22px)); padding: 6px 14px 8px; border-radius: 14px; background: #22B14C; color: #fff; font: 700 18px/1.3 var(--ff-child); white-space: nowrap; pointer-events: none; box-shadow: 0 6px 14px rgba(0,0,0,.18); }
.x7-wp-tip::after { content: ''; position: absolute; left: 50%; bottom: -9px; transform: translateX(-50%); border: 9px solid transparent; border-bottom: 0; border-top-color: #22B14C; }
.x7-wp-tip.is-in { animation: x7In .3s ease-out both; }
/* تغذية مكتوبة قصيرة (فقاعة) */
.x7-fb { min-height: 48px; display: flex; align-items: center; justify-content: center; }
.x7-fb > span { padding: 6px 18px 9px; border-radius: 16px; font: 700 clamp(19px, 3.6cqi, 26px)/1.4 var(--ff-child); animation: x7In .3s ease-out both; }
.x7-fb .ok { background: #E6F5EC; color: var(--ok, #1B7F53); border: 2px solid #9ED3B4; }
.x7-fb .try { background: #FFF6E0; color: #8A5A00; border: 2px solid #F3D48A; }

/* ================= v8 (theme 8) ================= */
.x7v8-host.elp-stage { overflow: hidden !important; padding: 6px 0 10px !important; }
.x7v8 { position: absolute; inset: 6px 0 10px; display: grid; place-items: center; }
.x7v8 > .bq8-stage { aspect-ratio: auto; flex: none; width: 100%; }
.bq8-stage > .bq8-panel.x7 { position: absolute; width: auto; flex: none; min-height: 0; padding: calc(var(--u)*30); gap: calc(var(--u)*22); justify-content: center; }
.bq8-stage.is-tall > .bq8-panel { bottom: calc(var(--u)*140); }
.bq8-stage.is-tall > .bq8-bariq { width: calc(var(--u)*230); }
.bq8-stage.x7-brq-top > .bq8-bariq { top: calc(var(--u)*10); bottom: auto; width: calc(var(--u)*122); }
.bq8-stage.x7-brq-top > .bq8-bariq::after { display: none; }
/* HUD = the platform's instruction row, restyled */
.bq8-hud > .elp-instr { flex: 1 1 auto; min-width: 0; min-height: 0; gap: calc(var(--u)*18); }
.bq8-hud .elp-say { flex: none; position: relative; width: var(--bq8-btn-lg); height: var(--bq8-btn-lg); border-radius: 50%; padding: 0; display: grid; place-items: center;
  border: var(--bq8-line) solid var(--bq8-navy); color: var(--bq8-navy); font-size: calc(var(--bq8-btn-lg) * .66);
  background: radial-gradient(circle at 38% 30%, #fff 0, #FFE38A 58%);
  box-shadow: inset 0 calc(var(--u)*-6) 0 color-mix(in srgb, var(--bq8-star-d) 45%, transparent), 0 0 0 var(--bq8-rim) #fff, 0 calc(var(--u)*8) calc(var(--u)*12) rgba(11,45,79,.28); }
.bq8-hud .elp-say > svg, .bq8-hud .elp-say > .bq-ic { display: none; }
.bq8-hud .elp-say:active { transform: translateY(calc(var(--u)*3)) scale(.97); box-shadow: 0 0 0 var(--bq8-rim) #fff; }
.bq8-hud .elp-fn { flex: none; width: max(56px, calc(var(--u)*78)); height: max(56px, calc(var(--u)*78)); border-radius: 50%; background: #fff center / 76% no-repeat url(assets/icons8/ear.svg);
  box-shadow: 0 0 0 var(--bq8-line) rgba(11,45,79,.9), 0 0 0 calc(var(--u)*8.5) rgba(255,255,255,.85), var(--bq8-sh-1); }
.bq8-hud .elp-fn > * { display: none !important; }
.bq8-hud .elp-fn[hidden] { display: none; }
.bq8-hud[data-fn="hand_drag"] .elp-fn { background-image: url(assets/icons8/hand_drag.svg); }
.bq8-hud[data-fn="touch"] .elp-fn { background-image: url(assets/icons8/touch.svg); }
.bq8-hud[data-fn="mouth"] .elp-fn { background-image: url(assets/icons8/mouth.svg); }
.bq8-hud[data-fn="eye"] .elp-fn { background-image: url(assets/icons8/eye.svg); }
.bq8-hud[data-fn="pencil"] .elp-fn { background-image: url(assets/icons8/pencil.svg); }
.bq8-hud[data-fn="puzzle"] .elp-fn { background-image: url(assets/icons8/puzzle.svg); }
.bq8-hud .elp-bubble.x7-bub8 { flex: 0 1 auto; min-width: 0; }
.bq8-hud .x7-bub8:not(:has(> :not([hidden]))) { display: none; }
.bq8-hud .x7-bub8 > .elp-instr-t, .bq8-hud .x7-bub8 > .elp-cap { background: #fff; border: 0; border-radius: calc(var(--u)*30); padding: calc(var(--u)*8) calc(var(--u)*26) calc(var(--u)*10);
  font: 700 max(17px, calc(var(--u)*30))/1.9 var(--font-bubble); color: var(--bq8-navy);
  box-shadow: 0 0 0 var(--bq8-line) rgba(11,45,79,.9), 0 0 0 calc(var(--u)*8.5) rgba(255,255,255,.85), var(--bq8-sh-2); } /* FIX-10: 1.7 → 1.9 (= ix1 bubble): TX E11 820×1180 two-line bubble, line-2 marks touched line 1 (−2 px) */
.bq8-hud .x7-bub8 > .elp-cap b { color: var(--bq8-eye-d); }
.bq8-hud > .bq8-progress { flex: none; }
.bq8-progress > i { transition: width .3s, background .3s; }
/* Bariq slot */
.bq8-bariq > .bq-brq { position: static; display: flow-root; width: 100%; height: auto; aspect-ratio: 809 / 692; inset: auto; }
/* letters (Vazirmatn) · meem colour · clear sukun ring */
:root[data-theme="8"] .x7-w { font-family: var(--font-letter); font-weight: 700; color: inherit; line-height: 1.3; }
:root[data-theme="8"] .x7-w b { color: var(--bq8-meem); font-weight: 700; }
:root[data-theme="8"] .x7-suk { position: relative; }
:root[data-theme="8"] .x7-suk::after { content: ''; position: absolute; box-sizing: border-box; width: .25em; height: .25em; border: .062em solid currentColor; border-radius: 50%;
  top: .05em; left: 50%; transform: translateX(-35%); pointer-events: none; }
/* drag & drop in v8 */
.x7-ghost8 { box-sizing: border-box; box-shadow: none !important; filter: drop-shadow(0 18px 18px rgba(11,45,79,.35)); opacity: 1; }
.x7-ghost8.bq8-tile { box-shadow: 0 0 0 5px #fff, 0 22px 30px -8px rgba(11,45,79,.5) !important; filter: none; }
.x7-ghost-shake { animation: bq8-shake-soft .3s ease; }
.x7-tile.x7-8 { touch-action: none; -webkit-user-select: none; user-select: none; cursor: grab; transition: opacity .2s, transform .15s; }
.x7-tile.x7-8.is-lifted { opacity: .28; }
.x7-tile.x7-8.is-used { visibility: hidden; }
.x7-tile.x7-8.is-dim { opacity: .35; pointer-events: none; filter: grayscale(.6); }
.x7-tile.x7-8.is-sel { filter: drop-shadow(0 0 calc(var(--u)*8) var(--bq8-eye)) drop-shadow(0 0 calc(var(--u)*4) var(--bq8-eye)); transform: translateY(calc(var(--u)*-6)); }
.x7-tile.x7-8.is-glow { filter: drop-shadow(0 0 calc(var(--u)*10) var(--bq8-yellow)) drop-shadow(0 0 calc(var(--u)*6) var(--bq8-yellow)); }
.x7-zone.x7-8 { transition: transform .15s, filter .15s, background .15s; }
.x7-zone.x7-8.is-over, .x7-has-sel .x7-zone.x7-8:not(.is-full):not(.x7-off) { filter: drop-shadow(0 0 calc(var(--u)*8) var(--bq8-yellow)); }
.x7-zone.x7-8.is-over { transform: scale(1.04); }
.x7-zone.x7-8.is-glow { filter: drop-shadow(0 0 calc(var(--u)*12) var(--bq8-yellow)) drop-shadow(0 0 calc(var(--u)*6) var(--bq8-yellow)); }
/* say/replay feedback on cards */
.bq8-card.is-say, .x7-say8card.is-say { transform: translateY(calc(var(--u)*-6)); box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-listen), var(--bq8-sh-2); }
/* coach hand */
.x7-coach { position: absolute; z-index: 30; width: 1em; height: 1em; font-size: calc(var(--u)*100); margin: -.12em 0 0 -.3em; opacity: 0; pointer-events: none;
  transition: left .45s cubic-bezier(.4,0,.2,1), top .45s cubic-bezier(.4,0,.2,1), opacity .25s; filter: drop-shadow(0 8px 10px rgba(11,45,79,.35)); }
.x7-coach.on { opacity: 1; }
.x7-coach.tap { animation: x7Tap .45s ease 2; }
@keyframes x7Tap { 50% { scale: .8; } }
.x7-coach-hit { animation: bq8-wiggle .4s ease; }
/* written feedback (writing) */
:root[data-theme="8"] .x7-fb > span { font: 700 max(17px, calc(var(--u)*28))/1.4 var(--font-bubble); border-radius: 999px; padding: calc(var(--u)*6) calc(var(--u)*24) calc(var(--u)*9); border: 0; box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-1); }
:root[data-theme="8"] .x7-fb .ok { background: #CFF5E2; color: #0F6B40; }
:root[data-theme="8"] .x7-fb .try { background: #FFE9D6; color: #8A4A00; }
/* writing pad (v8: the corridor is the Vazirmatn glyph) */
:root[data-theme="8"] .x7-wp { background: #fff; border-radius: calc(var(--u)*30); box-shadow: 0 0 0 var(--bq8-line) var(--bq8-navy), 0 0 0 calc(var(--u)*10) #fff, var(--bq8-sh-2); }
:root[data-theme="8"] .x7-wp .baseline { stroke: #9CC9E6; stroke-width: .7; }
:root[data-theme="8"] .x7-wp .midline { stroke: #D4E6F4; stroke-width: .5; stroke-dasharray: 2 2; }
:root[data-theme="8"] .x7-wp .road.o8 { fill: rgba(11,45,79,.085); stroke: rgba(11,45,79,.22); stroke-width: .4; }
:root[data-theme="8"] .x7-wp[data-guide="dots"] .road.o8 { fill: rgba(11,45,79,.04); stroke: rgba(11,45,79,.14); }
:root[data-theme="8"] .x7-wp[data-guide="bold"] .road.o8 { fill: rgba(31,162,242,.16); stroke: rgba(31,162,242,.55); }
:root[data-theme="8"] .x7-wp[data-guide="none"] .road.o8 { display: none; }
:root[data-theme="8"] .x7-wp .dots { stroke: rgba(11,45,79,.5); stroke-width: 1.7; stroke-dasharray: .1 3.8; }
:root[data-theme="8"] .x7-wp .ink, :root[data-theme="8"] .x7-wp .demo { stroke-width: 10.5; }
:root[data-theme="8"] .x7-wp .free { stroke-width: 9; }
:root[data-theme="8"] .x7-wp .demo { stroke: #3D7BF0; }
:root[data-theme="8"] .x7-wp .ctx { font-family: var(--font-letter); font-weight: 700; fill: var(--bq8-navy); }
:root[data-theme="8"] .x7-wp .start { r: 4.4px; fill: var(--bq8-ok); stroke-width: 1.4; }
:root[data-theme="8"] .x7-wp .start-ring { r: 7.5px; stroke: var(--bq8-ok); }
:root[data-theme="8"] .x7-wp .pen { r: 4px; stroke: #3D7BF0; }
:root[data-theme="8"] .x7-wp .runner { r: 3.2px; }
:root[data-theme="8"] .x7-wp .arr path { stroke: var(--bq8-meem); stroke-width: 2; }
:root[data-theme="8"] .x7-wp.is-done { box-shadow: 0 0 0 var(--bq8-line) var(--bq8-ok), 0 0 0 calc(var(--u)*10) #fff, 0 0 0 calc(var(--u)*16) var(--bq8-ok), var(--bq8-sh-2); }
:root[data-theme="8"] .x7-wp-word { font-size: calc(var(--u)*130); color: var(--bq8-navy); }
:root[data-theme="8"] .x7-wp-tip { background: var(--bq8-ok); font: 700 max(16px, calc(var(--u)*26))/1.3 var(--font-bubble); }
:root[data-theme="8"] .x7-wp-tip::after { border-top-color: var(--bq8-ok); }
@media (prefers-reduced-motion: reduce) { .x7-coach, .x7-coach.tap { animation: none; transition: none; } }
@media (prefers-reduced-motion: reduce) {
  .x7-in, .x7-ear.is-on, .x7-wp .start.pulse, .x7-wp .start-ring.on, .x7-wp-tip.is-in, .fx7-pop, .fx7-wob, .x7-wp.is-retry, .x7-wp-word, .x7-fb > span { animation: none !important; }
  .x7-tile, .x7-zone { transition: none; }
}`;
  /* ================= glyph measuring (v8 E11 fix · owner E11_e) ================= */
  /** Ink box of the text inside `el` in client px {top, bottom, left, right}: vertical extents from the font's real ink
   *  (canvas actualBoundingBox*, measured from the DOM baseline of a zero-size probe), plus the v8 sukun rings (.x7-suk::after). */
  /** client-px per CSS-px of an element (1 unless an ancestor is scaled, e.g. the platform's transform-scaled v8 stage) */
  X.scaleOf = function (el) {
    if (!el || !el.offsetWidth) return 1;
    const k = el.getBoundingClientRect().width / el.offsetWidth;
    return isFinite(k) && k > 0.05 && k < 20 ? k : 1;
  };
  X.inkBox = function (el) {
    if (!el || !el.isConnected) return null;
    const raw = (el.dataset && el.dataset.ink) || el.textContent || '';
    if (!raw.replace(/‍/g, '').trim()) return null;
    const cs = getComputedStyle(el);
    const cv = X._cv || (X._cv = document.createElement('canvas').getContext('2d'));
    cv.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    try { cv.direction = 'rtl'; } catch (e) { /* */ }
    const m = cv.measureText(raw);
    const probe = h('i', { 'aria-hidden': 'true', style: { display: 'inline-block', width: '0', height: '0', verticalAlign: 'baseline', padding: '0', margin: '0', border: '0' } });
    el.insertBefore(probe, el.firstChild);
    const base = probe.getBoundingClientRect().bottom;
    probe.remove();
    const rg = document.createRange(); rg.selectNodeContents(el); const rr = rg.getBoundingClientRect();
    const k = X.scaleOf(el); // canvas metrics are CSS px; rects are client px
    let top = base - m.actualBoundingBoxAscent * k, bottom = base + m.actualBoundingBoxDescent * k;
    el.querySelectorAll('.x7-suk').forEach((sp) => { const r = sp.getBoundingClientRect(), fs = parseFloat(getComputedStyle(sp).fontSize) || 0; top = Math.min(top, r.top + (0.05 * fs - 1) * k); });
    return { top, bottom, left: rr.left, right: rr.right, base };
  };
  /** Fit the text's ink inside `box` (its border-box minus border, with a margin):
   *  grow → add padding top/bottom so every haraka sits inside · shrink → scale the font down (fixed tiles). */
  X.fitInk = function (el, box, o) {
    o = o || {};
    if (!el || !box || !el.isConnected) return null;
    if (o.grow) { box.style.paddingTop = ''; box.style.paddingBottom = ''; }
    if (o.shrink) el.style.fontSize = '';
    for (let pass = 0; pass < 6; pass++) {
      const ink = X.inkBox(el); if (!ink) return null;
      const cs = getComputedStyle(box), r = box.getBoundingClientRect(), k = X.scaleOf(box); // k: client px per CSS px
      const fs = parseFloat(getComputedStyle(el).fontSize) || 40;
      const mg = (o.margin != null ? o.margin : Math.max(4, fs * 0.06)) * k;
      const inT = r.top + (parseFloat(cs.borderTopWidth) || 0) * k + mg, inB = r.bottom - (parseFloat(cs.borderBottomWidth) || 0) * k - mg;
      const inL = r.left + (parseFloat(cs.borderLeftWidth) || 0) * k + mg, inR = r.right - (parseFloat(cs.borderRightWidth) || 0) * k - mg;
      const needT = inT - ink.top, needB = ink.bottom - inB;
      if (o.grow) {
        if (needT > 0.5) box.style.paddingTop = ((parseFloat(cs.paddingTop) || 0) + needT / k) + 'px';
        if (needB > 0.5) box.style.paddingBottom = ((parseFloat(cs.paddingBottom) || 0) + needB / k) + 'px';
        if (needT <= 0.5 && needB <= 0.5) return ink;
      } else if (o.shrink) {
        const k = Math.min((inB - inT) / Math.max(1, ink.bottom - ink.top), (inR - inL) / Math.max(1, ink.right - ink.left), 1);
        if (k >= 0.995 && needT <= 0.5 && needB <= 0.5) return ink;
        el.style.fontSize = (fs * Math.min(k, 0.97)).toFixed(1) + 'px';
      } else return ink;
    }
    return X.inkBox(el);
  };
  /** Client rect of each letter (base char + its harakat) inside ONE shaped text run, via Range.getClientRects per character.
   *  `letters` = X.letters(word). Works across the .x7-suk spans (the sukun char is drawn as a ring there). */
  X.charBoxes = function (el, letters) {
    const chars = [];
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let tn;
    while ((tn = walk.nextNode())) for (let i = 0; i < tn.nodeValue.length; i++) chars.push({ n: tn, i, c: tn.nodeValue[i] });
    const isBase = (c) => !/[ً-ْٰـ‍]/.test(c);
    const starts = []; let p = 0;
    letters.forEach((L) => { const b = X.bare(L)[0]; while (p < chars.length && !(isBase(chars[p].c) && chars[p].c === b)) p++; starts.push(p < chars.length ? p : -1); p++; });
    return letters.map((L, k) => {
      const a = starts[k]; if (a < 0) return null;
      let e = chars.length; for (let j = k + 1; j < starts.length; j++) if (starts[j] > a) { e = starts[j]; break; }
      const rg = document.createRange();
      rg.setStart(chars[a].n, chars[a].i);
      const last = chars[e - 1]; rg.setEnd(last.n, last.i + 1);
      const rs = [...rg.getClientRects()].filter((r) => r.width > 0.5);
      if (!rs.length) return null;
      // Range gives the glyph's ADVANCE box (pen positions). Arabic glyphs overhang their advance (e.g. initial ق reaches into the next
      // letter), so the box is moved onto the INK: the same contextual form (ZWJ on the joined sides) is measured on a canvas in the
      // same font — ink = advance-left − actualBoundingBoxLeft … advance-left + actualBoundingBoxRight.
      const rb = document.createRange(); rb.setStart(chars[a].n, chars[a].i); rb.setEnd(chars[a].n, chars[a].i + 1);
      const r0 = [...rb.getClientRects()].filter((r) => r.width > 0.5)[0] || rs[0];
      const prev = letters[k - 1], next = letters[k + 1], base = X.bare(L)[0];
      const jp = !!prev && !NOLEFT.includes(X.bare(prev).slice(-1)), jn = !!next && !NOLEFT.includes(base);
      const cs = getComputedStyle(chars[a].n.parentElement);
      const cv = X._cv || (X._cv = document.createElement('canvas').getContext('2d'));
      cv.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      try { cv.direction = 'ltr'; } catch (e) { /* */ }
      cv.textAlign = 'left';
      const m = cv.measureText((jp ? ZWJ : '') + L.replace(/ْ/g, '') + (jn ? ZWJ : ''));
      const sc = m.width > 0 ? (r0.right - r0.left) / m.width : 1; // tiny rounding between canvas and layout
      const il = r0.left - m.actualBoundingBoxLeft * sc, ir = r0.left + m.actualBoundingBoxRight * sc;
      const ok = isFinite(il) && isFinite(ir) && ir - il > 2;
      return { left: ok ? il : r0.left, right: ok ? ir : r0.right, adv: [r0.left, r0.right], top: Math.min(...rs.map((r) => r.top)), bottom: Math.max(...rs.map((r) => r.bottom)) };
    });
  };

  X.style = function (id, css) { if (!document.getElementById(id)) document.head.append(h('style', { id }, css)); };
  X.style('st-ix7b', CSS);

  /** جذر العنصر مع صنف العمر (أحجام اللمس ٦٠ لـ٤–٦) */
  X.root = function (ctx, cls, opt8) {
    if (X.v8()) return X.frame8(ctx, cls, opt8);
    const a = (ctx.age && ctx.age()) || BQ.state.age || '4-6';
    const r = h('div.x7' + (cls ? '.' + cls : '') + (a === '4-6' ? '.a46' : a === '10-12' ? '.a1012' : '.a79'), { dir: 'rtl', lang: 'ar' });
    ctx.stage.append(r);
    return r;
  };
  /** فقاعة تغذية مكتوبة (للكتابة: «✔ الشَّكْلُ صَحيحٌ» / «جَرِّبْ مَرَّةً أُخْرى. اِبْدَأْ مِنْ هُنا.») */
  X.fbBox = function (parent) {
    const el = h('div.x7-fb', { 'aria-live': 'polite' });
    parent.append(el);
    return { el, ok(t) { el.replaceChildren(h('span.ok', null, t)); }, tryAgain(t) { el.replaceChildren(h('span.try', null, t)); }, clear() { el.replaceChildren(); } };
  };

  BQ.ix7b = X;
})();
