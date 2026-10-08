/* video.js — مشغّل المشاهد المتحرّكة داخل الصفحة (بديل مقاطع Grok إلى أن تصل)
   BQ.video.player(stage, ctx, script, opt) → مشغّل يعرض المقطع لقطةً لقطة داخل «شاشة» ١٦:٩ بإطار أسود:
   لوحة خلفية + شخصيات مقصوصة بمقياسها + حركة كاميرا (دفع/تحريك بعمق بين الطبقات) + حركة الشخصيات
   (دخول/مشي/تنفّس/تحليق/كلام) + انتقالات (قطع/تلاشٍ/سوط/ستارة/مطابقة) + الأسطر الصوتية الحقيقية
   تُنتظر فيتبع التوقيت الصوت + وقفات دعوة توقف المشهد فعلاً.
   كلّ الألوان من tokens.css؛ لا canvas. */
(function () {
  'use strict';
  const BQ = window.BQ; if (!BQ) return;
  const h = BQ.h;
  const CANCEL = { cancelled: true };
  const OS = 1.045;   // هامش الطبقات (overscan) حتى لا تنكشف الحوافّ مع الانجراف
  const PF = 0.9;     // عمق الخلفية (parallax): الخلفية تتحرّك ٩٠٪ من حركة الشخصيات
  const SRC = (id) => (/^(ROOM|comp)/.test(id) ? 'media/img/' + id + '.webp' : BQ.img(id));
  const rm = () => BQ.reduced();
  const AGE = () => BQ.state.age || '4-6';
  const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  /* سكتة الترديد ٤/٣/٢ ث · وقفة الدعوة ٥/٤/٣ ث (بحسب العمر) */
  BQ.silence = (kind) => ({ say: { '4-6': 4000, '7-9': 3000, '10-12': 2000 }, invite: { '4-6': 5000, '7-9': 4000, '10-12': 3000 } }[kind === 'say' || kind === 'phrase' ? 'say' : 'invite'][AGE()] || 3000);

  /* ---------- الشخصيات: الصور المقصوصة ووضعيّاتها ---------- */
  const P011 = (n) => ({ src: 'media/img/img-011-' + n + '.webp', box: [164 / 2048, 1884 / 2048] });
  const CAST = {
    MAJ: { ar: 379 / 1338, poses: { base: { src: BQ.char.MAJ }, wave: P011('wave'), listen: P011('listen'), happy: P011('happy'), curious: P011('curious') } },
    SAY: { ar: 440 / 1353, poses: { base: { src: BQ.char.SAY }, compass: { src: 'media/img/img-013.webp', box: [164 / 2048, 1884 / 2048] } } },
    BRQ: { ar: 809 / 692, poses: { base: { src: BQ.char.BRQ } } },
  };

  /* ---------- أيقونات الوقفات (SVG بلون currentColor) ---------- */
  const SV = {
    where: '<svg viewBox="0 0 64 48"><path d="M10 20a11 11 0 1 1 20 6c-2.5 3.4-5.6 4.4-5.6 8.6a5.4 5.4 0 0 1-10 2.4" fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round"/><path d="M15.5 21a4.6 4.6 0 1 1 8 2.4" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/><path d="M42 15.5c0-4.6 3.6-7.5 8-7.5s8 2.9 8 7.2c0 5.8-7.6 6.3-7.6 12.3" fill="none" stroke="currentColor" stroke-width="4.4" stroke-linecap="round"/><circle cx="50.4" cy="36.5" r="3" fill="currentColor"/></svg>',
    say: '<svg viewBox="0 0 64 48"><path d="M6 24c5.5-7 12-8 17.5-4.4C29 16 35.5 17 41 24c-5.5 8-11.5 10-17.5 10S11.5 32 6 24z" fill="currentColor"/><path d="M9 24h29" stroke="var(--paper)" stroke-width="2.4"/><path d="M47 17a10 10 0 0 1 0 14M53 11.5a18 18 0 0 1 0 25" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
    what: '<svg viewBox="0 0 64 48"><path d="M8 8h48a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H26l-10 8v-8H8a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M26.5 17.5c0-3.6 2.6-5.8 5.8-5.8s5.8 2.2 5.8 5.5c0 4.5-5.6 4.8-5.6 9.2" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/><circle cx="32.5" cy="32.5" r="2.4" fill="currentColor"/></svg>',
    wave: '<svg viewBox="0 0 120 40" preserveAspectRatio="none"><path d="M2 20q7.5-14 15 0t15 0 15 0 15 0 15 0 15 0 15 0 13 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
    ring: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="7"/></svg>',
    square: '<svg viewBox="0 0 100 100"><rect x="12" y="12" width="76" height="76" rx="4" fill="none" stroke="currentColor" stroke-width="7"/></svg>',
    swave: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/><path d="M22 50q7-12 14 0t14 0 14 0 14 0" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>',
  };

  /* ---------- تحليل المقاطع الصوتية (مواضع الصوت) لمزامنة الفم ---------- */
  const envCache = {};
  function voiced(id) {
    if (envCache[id]) return envCache[id];
    if (!BQ.hasAudio(id) || !window.OfflineAudioContext || !window.fetch) return (envCache[id] = Promise.resolve(null));
    envCache[id] = fetch(BQ.audioSrc ? BQ.audioSrc(id) : 'media/audio/' + id + '.mp3').then((r) => r.arrayBuffer())
      .then((b) => new OfflineAudioContext(1, 22050, 22050).decodeAudioData(b))
      .then((ab) => {
        const d = ab.getChannelData(0), W = Math.max(1, Math.round(ab.sampleRate * 0.02)), rms = [];
        for (let i = 0; i + W <= d.length; i += W) { let s = 0; for (let j = i; j < i + W; j++) s += d[j] * d[j]; rms.push(Math.sqrt(s / W)); }
        let mx = 0; for (const v of rms) if (v > mx) mx = v;
        const thr = Math.max(0.012, mx * 0.14), segs = []; let st = -1;
        rms.forEach((v, i) => { if (v > thr) { if (st < 0) st = i; } else if (st >= 0) { segs.push([st * 0.02, i * 0.02]); st = -1; } });
        if (st >= 0) segs.push([st * 0.02, rms.length * 0.02]);
        const out = [];
        for (const s of segs) { const l = out[out.length - 1]; if (l && s[0] - l[1] < 0.14) l[1] = s[1]; else out.push(s.slice()); }
        return { dur: ab.duration, segs: out.filter((s) => s[1] - s[0] > 0.07) };
      }).catch(() => null);
    return envCache[id];
  }
  BQ.voiced = voiced;

  /* ---------- الأنماط (تُحقن مرّة) ---------- */
  function injectCss() {
    if (document.getElementById('st-video')) return;
    const css = `
.vp{position:relative;width:100%;height:100%;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;direction:rtl}
.vp-frame{position:relative;background:var(--c-video-bg);border-radius:max(10px,1.8cqh);overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 .9cqh 0 var(--shell-deep)}
.vp-box{position:relative;overflow:hidden;background:var(--c-video-bg);direction:ltr;isolation:isolate;touch-action:manipulation}
.vp-view,.vp-shot,.vp-rig,.vp-drift,.vp-bgL,.vp-chL,.vp-fxL,.vp-shotui{position:absolute;inset:0}
.vp-shot{overflow:hidden;background:var(--c-video-bg)}
.vp-view::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:3;background:radial-gradient(120% 95% at 50% 45%,transparent 58%,color-mix(in srgb,var(--c-video-bg) 34%,transparent) 100%)}
.vp-bgL,.vp-chL,.vp-fxL{transform-origin:50% 50%;will-change:transform}
.vp-drift{animation:vpDrift 9s ease-in-out infinite}
@keyframes vpDrift{0%,100%{transform:translate(0,0) rotate(0)}33%{transform:translate(.35%,-.25%) rotate(.12deg)}66%{transform:translate(-.3%,.2%) rotate(-.1deg)}}
.vp-plate{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none}
.vp-half{position:absolute;top:0;bottom:0;width:50%;overflow:hidden}
.vp-half.r{right:0}.vp-half.l{left:0}
.vp-half>.vp-kb{position:absolute;inset:0;transform-origin:50% 50%}
.vp-split-line{position:absolute;top:0;bottom:0;left:50%;width:max(3px,.5%);margin-left:max(-1.5px,-.25%);background:var(--paper);z-index:3;box-shadow:0 0 1.2em color-mix(in srgb,var(--c-video-bg) 45%,transparent)}
.vp-panel{position:absolute;inset:0;background:radial-gradient(90% 80% at 50% 45%,var(--paper),color-mix(in srgb,var(--paper-edge) 45%,var(--paper)));display:grid;place-items:center}
.vp-glyph{font:700 40cqh/1 var(--ff-child);font-size:calc(var(--vh,1px)*40);color:var(--ink);margin-top:-.18em;opacity:0}
.vp-mouthO{opacity:0;transition:opacity 55ms linear}
.vp-mouthO.on{opacity:1}
.vp-hum{position:absolute;height:8%;width:26%;color:var(--c-brq);opacity:0;transition:opacity .15s;filter:drop-shadow(0 0 .35em var(--c-brq))}
.vp-hum svg{width:100%;height:100%;display:block}
.vp-hum.a{transform-origin:0 50%}.vp-hum.b{transform-origin:100% 50%}
.vp-lipglow{position:absolute;height:1.2%;width:17%;border-radius:1em;background:linear-gradient(90deg,transparent,var(--c-brq),transparent);opacity:0;transition:opacity .2s;filter:blur(1px)}
.vp-ch{position:absolute;transform:translate(-50%,-100%);pointer-events:none}
.vp-ch>div,.vp-ch>div>div,.vp-ch>div>div>div,.vp-ch>div>div>div>div,.vp-ch>div>div>div>div>div{position:absolute;inset:0;transform-origin:50% 100%}
.vp-ch img{position:absolute;display:block;pointer-events:none;user-select:none;transition:opacity .16s ease;filter:drop-shadow(0 .35em .5em color-mix(in srgb,var(--c-video-bg) 38%,transparent))}
.vp-ch img.full{inset:0;width:100%;height:100%;object-fit:contain;object-position:50% 100%}
.vp-ch img.off{opacity:0}
.vp-shadow{position:absolute;left:8%;right:8%;bottom:-2.4%;height:5%;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--c-video-bg) 45%,transparent),transparent);transform-origin:50% 50%}
.vp-BRQ .vp-shadow{bottom:-38%;height:12%;left:18%;right:18%;animation:vpShadowB 2.8s ease-in-out infinite}
@keyframes vpShadowB{50%{transform:scale(.8);opacity:.7}}
.vp-idle{animation:vpBreath 3.6s ease-in-out infinite}
@keyframes vpBreath{0%,100%{transform:scale(1,1)}50%{transform:scale(1.006,1.015)}}
.vp-BRQ .vp-idle{transform-origin:50% 50%;animation:vpFloat 2.8s ease-in-out infinite}
@keyframes vpFloat{0%,100%{transform:translateY(0) rotate(-2.2deg)}50%{transform:translateY(-7%) rotate(2.2deg)}}
.vp-idle.walk{animation:vpWalk .46s ease-in-out infinite}
@keyframes vpWalk{0%,100%{transform:translateY(0) rotate(-1.3deg)}50%{transform:translateY(-1.8%) rotate(1.3deg)}}
.vp-BRQ .vp-idle.walk{animation:vpZoom .5s ease-in-out infinite}
@keyframes vpZoom{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-9%) rotate(-3deg)}}
.vp-idle.dance{animation:vpDance calc(var(--beat,625ms)*2) ease-in-out infinite}
@keyframes vpDance{0%,50%,100%{transform:translateY(0) scale(1.018,.975) rotate(0)}25%{transform:translateY(-2.6%) scale(.99,1.02) rotate(-2.6deg)}75%{transform:translateY(-2.6%) scale(.99,1.02) rotate(2.6deg)}}
.vp-BRQ .vp-idle.dance{animation:vpDanceB calc(var(--beat,625ms)*2) ease-in-out infinite}
@keyframes vpDanceB{0%,50%,100%{transform:translateY(0) scale(1.06,.94)}25%{transform:translateY(-14%) rotate(-8deg) scale(.97,1.04)}75%{transform:translateY(-14%) rotate(8deg) scale(.97,1.04)}}
.vp-idle.frozen{animation-play-state:paused}
.vp-talk.on{animation:vpTalk .36s ease-in-out infinite}
@keyframes vpTalk{50%{transform:scale(1.012,.992) translateY(-.5%)}}
.vp-BRQ .vp-talk{transform-origin:50% 62%}
.vp-BRQ .vp-talk.on{animation:vpTalkB .3s ease-in-out infinite}
@keyframes vpTalkB{50%{transform:scale(1.045,.955)}}
.vp-ring{position:absolute;transform:translate(-50%,-50%);color:var(--c-topbar-fg);filter:drop-shadow(0 0 .5em color-mix(in srgb,var(--c-video-bg) 55%,transparent));pointer-events:none}
.vp-ring svg{width:100%;height:100%;display:block}
.vp-ripple{position:absolute;transform:translate(-50%,-50%);border:max(2px,.35cqh) solid color-mix(in srgb,var(--c-topbar-fg) 80%,transparent);border-radius:50%;pointer-events:none}
.vp-spot{position:absolute;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 5em 200vmax color-mix(in srgb,var(--c-video-bg) 58%,transparent);pointer-events:none;opacity:0;transition:opacity .5s}
.vp-card{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);height:56%;aspect-ratio:1;border-radius:6%;overflow:hidden;border:.8em solid var(--c-page-bg);box-shadow:0 1.2em 2.4em color-mix(in srgb,var(--c-video-bg) 45%,transparent);background:var(--c-page-bg)}
.vp-card img{width:100%;height:100%;object-fit:cover;display:block}
.vp-wordcard{position:absolute;left:50%;top:84%;transform:translate(-50%,-50%);background:var(--c-word-card);color:var(--c-title-text);border:.18em solid var(--c-page-bg);border-radius:.4em;font:700 1px/1.25 var(--ff-child);font-size:calc(var(--vh,1px)*10);padding:0 .55em .08em;box-shadow:0 .12em 0 var(--shell-deep);white-space:nowrap}
.vp-wordcard .m,.vp-lyr .m{color:var(--c-close-btn)}
.vp-dim{position:absolute;inset:0;background:var(--overlay-dim);opacity:0;transition:opacity .2s ease;pointer-events:none;z-index:4}
.vp-dim.on{opacity:.42}
.vp-dim.soft.on{opacity:.2}
.vp-ui{position:absolute;inset:0;z-index:6;pointer-events:none;direction:rtl}
.vp-ui>*{pointer-events:auto}
.vp-inv{position:absolute;inset:0;pointer-events:none}
.vp-inv>*{pointer-events:auto}
.vp-badge{position:absolute;top:5%;left:3.5%;height:max(46px,13%);aspect-ratio:4/3;background:var(--paper);border:max(3px,.5cqh) solid var(--paper-edge);border-radius:18%;color:var(--ink);display:grid;place-items:center;box-shadow:0 .5em 1em color-mix(in srgb,var(--c-video-bg) 35%,transparent);animation:vpBadge .45s cubic-bezier(.2,1.5,.4,1) both,vpBreathe 1.6s ease-in-out .5s infinite}
.vp-badge svg{width:78%;height:78%}
@keyframes vpBadge{from{transform:scale(.3) rotate(-12deg);opacity:0}to{transform:none;opacity:1}}
@keyframes vpBreathe{50%{transform:scale(1.07)}}
.vp-banner{position:absolute;left:50%;bottom:17%;transform:translateX(-50%);background:var(--c-modal-bg);color:var(--c-modal-text);font:700 1px/1.35 var(--ff-child);font-size:max(20px,calc(var(--vh,1px)*9));padding:.08em .9em .18em;border-radius:.6em;border:.09em solid var(--c-modal-text);white-space:nowrap;box-shadow:0 .2em .6em color-mix(in srgb,var(--c-video-bg) 45%,transparent);animation:vpBan .5s cubic-bezier(.2,1.4,.4,1) both}
@keyframes vpBan{from{transform:translate(-50%,60%);opacity:0}to{transform:translateX(-50%);opacity:1}}
.vp-pick{position:absolute;left:50%;bottom:15%;transform:translateX(-50%);display:flex;gap:4%;width:70%;justify-content:center;direction:rtl}
.vp-pick button{flex:0 0 auto;height:max(60px,20cqh);height:max(60px,calc(var(--vh,1px)*21));aspect-ratio:3/2;border-radius:18%;border:max(3px,.6cqh) solid var(--paper-edge);background:var(--paper);color:var(--ink);cursor:pointer;display:grid;place-items:center;padding:6%;position:relative;box-shadow:0 .35em 0 color-mix(in srgb,var(--paper-edge) 70%,var(--c-video-bg));transition:transform .2s ease,box-shadow .2s;animation:vpBadge .4s cubic-bezier(.2,1.5,.4,1) both}
.vp-pick button:nth-child(2){animation-delay:.08s}
.vp-pick button .bq-ic{width:100%;height:100%}
.vp-pick button.picked{transform:scale(1.14);border-color:var(--ok);box-shadow:0 0 0 max(3px,.7cqh) var(--ok),0 .35em 0 var(--shell-deep)}
.vp-pick button .tick{position:absolute;top:-12%;left:-8%;width:34%;aspect-ratio:1;border-radius:50%;background:var(--ok);color:var(--c-topbar-fg);display:none;place-items:center;padding:5%}
.vp-pick button.picked .tick{display:grid}
.vp-pick button:focus-visible,.vp-go:focus-visible,.vp-ctl button:focus-visible,.vp-big:focus-visible{outline:4px solid var(--c-brq);outline-offset:3px}
.vp-go{position:absolute;right:3%;top:6%;min-width:max(64px,calc(var(--vh,1px)*20));height:max(56px,calc(var(--vh,1px)*17));border-radius:999px;border:0;background:var(--btn);color:var(--c-title-text);font:700 max(16px,calc(var(--vh,1px)*6))/1 var(--ff-ui);display:inline-flex;align-items:center;justify-content:center;gap:.35em;padding:0 .8em;cursor:pointer;box-shadow:0 .25em 0 var(--btn-edge);animation:vpBadge .4s .15s cubic-bezier(.2,1.5,.4,1) both}
.vp-go .bq-ic{width:1.2em;height:1.2em;transform:scaleX(-1)}
.vp-lyr{position:absolute;left:50%;bottom:var(--lyrb,14%);transform:translateX(-50%);max-width:92%;z-index:5;background:color-mix(in srgb,var(--c-modal-bg) 86%,transparent);color:color-mix(in srgb,var(--c-topbar-fg) 70%,transparent);font:700 1px/1.5 var(--ff-child);font-size:max(16px,calc(var(--vh,1px)*8));padding:.05em .7em .2em;border-radius:.6em;direction:rtl;white-space:nowrap;pointer-events:none;transition:opacity .25s}
.vp-lyr[hidden]{display:none}
.vp-lyr b{font:700 .62em/1 var(--ff-ui);margin-inline-end:.45em;padding:.2em .5em;border-radius:1em;background:var(--sp,var(--c-brq));color:var(--c-title-text);vertical-align:.25em}
.vp-lyr span{display:inline-block;transition:color .12s,transform .12s}
.vp-lyr span.past{color:var(--c-modal-text)}
.vp-lyr span.now{color:var(--c-brq);transform:translateY(-.08em) scale(1.12)}
.vp-big{position:absolute;left:50%;top:50%;width:max(64px,calc(var(--vh,1px)*24));aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:max(3px,.6cqh) solid var(--c-page-bg);background:color-mix(in srgb,var(--btn) 92%,transparent);color:var(--c-topbar-fg);display:none;place-items:center;cursor:pointer;z-index:7;box-shadow:0 .4em 1.2em color-mix(in srgb,var(--c-video-bg) 45%,transparent)}
.vp-big .bq-ic{width:52%;height:52%;margin-left:8%}
.vp.is-paused .vp-big,.vp.is-ended .vp-big{display:grid}
.vp.is-ended .vp-big .bq-ic{margin-left:0}
.vp-ctl{position:relative;z-index:8;width:100%;display:flex;align-items:center;gap:max(8px,1.2cqw);padding:0 max(10px,1.4cqw);height:var(--ctlh,48px);color:var(--c-topbar-fg);direction:rtl;transition:opacity .35s}
.vp.overlay .vp-ctl{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(to top,color-mix(in srgb,var(--c-video-bg) 78%,transparent),transparent)}
.vp.overlay.idle:not(.is-paused) .vp-ctl{opacity:0}
.vp-ctl>button{flex:0 0 auto;width:calc(var(--ctlh,48px) - 6px);height:calc(var(--ctlh,48px) - 6px);min-width:40px;min-height:40px;border-radius:50%;border:0;background:color-mix(in srgb,var(--c-topbar-fg) 16%,transparent);color:var(--c-topbar-fg);display:grid;place-items:center;cursor:pointer;padding:0}
.vp-ctl>button.pp{background:var(--btn);color:var(--c-title-text)}
.vp-ctl>button .bq-ic{width:52%;height:52%}
.vp-segs{flex:1;display:flex;gap:max(4px,.5cqw);align-items:center;height:100%;direction:rtl}
.vp-seg{flex:1 1 0;height:100%;border:0;background:none;padding:0;cursor:pointer;display:flex;align-items:center;min-width:0}
.vp-seg i{position:relative;display:block;width:100%;height:max(6px,.9cqh);border-radius:1em;background:color-mix(in srgb,var(--c-topbar-fg) 28%,transparent);overflow:hidden;transition:height .15s}
.vp-seg:hover i,.vp-seg.cur i{height:max(9px,1.3cqh)}
.vp-seg i b{position:absolute;top:0;bottom:0;right:0;width:0;background:var(--c-brq);border-radius:inherit}
.vp-seg.done i b{width:100%}
.vp-num{font:700 max(12px,1.9cqh)/1 var(--ff-ui);white-space:nowrap;opacity:.9;min-width:3.2em;text-align:center}
.vp-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
.vp-strip button{border:2px solid var(--c-menu-divider);background:var(--c-page-bg);border-radius:8px;padding:0;cursor:pointer;overflow:hidden;text-align:center;font:700 11px/1.3 var(--ff-ui);color:var(--c-title-text)}
.vp-strip button img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}
.vp-strip button span{display:block;padding:3px 2px 4px}
.vp-strip button.cur{border-color:var(--c-topbar-bg)}
.vp-lyrics{margin:6px 0 0;padding:0 1.2em 0 0;font:400 14px/1.9 var(--ff-child)}
@media (prefers-reduced-motion: reduce){
 .vp-drift,.vp-idle,.vp-idle.walk,.vp-idle.dance,.vp-talk.on,.vp-badge,.vp-BRQ .vp-shadow{animation:none!important}
 .vp-banner,.vp-pick button,.vp-go{animation:none!important}
 .vp-pick button.picked{transform:none}
}`;
    document.head.append(h('style', { id: 'st-video' }, css));
  }

  /* ---------- حساب الكاميرا ---------- */
  function camXY(c, depth) {
    const z = OS * (1 + ((c.z || 1) - 1) * depth);
    const f = c.f || [50, 50];
    const lim = 50 * (z - 1);
    const cl = (v) => Math.max(-lim, Math.min(lim, v));
    return { z, tx: cl((50 - f[0]) * z), ty: cl((50 - f[1]) * z), f };
  }
  function camT(c) {
    const b = camXY(c, PF);
    const zc = OS * (c.z || 1);
    // تثبيت نقطة البؤرة بين الطبقتين: الشخصيات تُكبَّر أكثر فيظهر العمق
    const tcx = b.tx + (b.f[0] - 50) * (b.z - zc), tcy = b.ty + (b.f[1] - 50) * (b.z - zc);
    const r = c.r ? ' rotate(' + c.r + 'deg)' : '';
    return {
      bg: 'translate(' + b.tx.toFixed(3) + '%,' + b.ty.toFixed(3) + '%) scale(' + b.z.toFixed(4) + ')' + r,
      ch: 'translate(' + tcx.toFixed(3) + '%,' + tcy.toFixed(3) + '%) scale(' + zc.toFixed(4) + ')' + r,
    };
  }

  /* ---------- المشغّل ---------- */
  function player(stage, ctx, script, opt) {
    injectCss();
    opt = opt || {};
    const scenes = script.scenes;
    const segs = [];
    let run = null, paused = false, pausedAt = 0, pausedTotal = 0, ended = false, alive = true;
    let sceneIdx = 0, shotAcc = 0, shotStart = 0, shotNom = 0, curAudio = null, frozenAnims = [], pausedAnims = [];
    let bed = null, bedHold = false, bedVol = 0, bedTarget = 0, talking = 0;
    const fxSet = new Set();
    let layer = null;
    let resolveDone; const done = new Promise((r) => { resolveDone = r; });

    const root = h('div.vp', { role: 'region', 'aria-label': script.aria || 'مَقْطَعٌ مُصَوَّرٌ' });
    const frameEl = h('div.vp-frame');
    const box = h('div.vp-box');
    const view = h('div.vp-view');
    const dim = h('div.vp-dim');
    const lyr = h('div.vp-lyr', { hidden: true, 'aria-hidden': 'true' });
    const ui = h('div.vp-ui');
    const big = h('button.vp-big', { type: 'button', 'aria-label': 'تَشْغيل', onclick: () => toggle() }, BQ.icon('play'));
    const ppBtn = h('button.pp', { type: 'button', 'aria-label': 'إيقاف مؤقّت', onclick: () => toggle() }, BQ.icon('pause'));
    const segWrap = h('div.vp-segs', { role: 'group', 'aria-label': 'مَشاهِدُ المَقْطَعِ' });
    const num = h('span.vp-num', { 'aria-hidden': 'true' });
    const rpBtn = h('button', { type: 'button', 'aria-label': 'أَعِدِ المَشْهَدَ', title: 'أعد المشهد', onclick: () => goto(sceneIdx) }, BQ.icon('replay'));
    scenes.forEach((sc, i) => {
      const b = h('button.vp-seg', { type: 'button', 'aria-label': 'المَشْهَدُ ' + AR(i + 1) + (sc.title ? ': ' + sc.title : ''), title: sc.title || '', onclick: () => goto(i) }, h('i', null, h('b')));
      segs.push(b); segWrap.append(b);
    });
    const ctl = h('div.vp-ctl', null, ppBtn, segWrap, num, rpBtn);
    box.append(view, dim, lyr, ui, big);
    if (script.bpm) box.style.setProperty('--beat', Math.round(60000 / script.bpm) + 'ms');
    frameEl.append(box, ctl);
    root.append(frameEl);
    stage.append(root);

    /* تخطيط: صورة ١٦:٩ داخل إطار أسود؛ الأزرار تحت الصورة إن اتّسع المكان وإلا فوقها */
    const cap = ctx.frame && ctx.frame.querySelector('.bq-cap');
    let capTop = false;
    function layout() {
      if (!alive) return;
      const W = root.clientWidth, H = root.clientHeight;
      if (!W || !H) return;
      const ch = Math.round(Math.max(44, Math.min(58, H * 0.1)));
      let bw, bh, over;
      if (W * 9 / 16 + ch <= H) { bw = W; bh = Math.round(W * 9 / 16); over = false; }
      else { bh = H; bw = Math.min(W, Math.round(H * 16 / 9)); if (bw < W) { /* عرض محدود */ } bh = Math.round(bw * 9 / 16); over = true; }
      root.classList.toggle('overlay', over);
      root.style.setProperty('--ctlh', ch + 'px');
      box.style.width = bw + 'px'; box.style.height = bh + 'px';
      frameEl.style.width = (over ? W : bw) + 'px';
      frameEl.style.height = (over ? bh : bh + ch) + 'px';
      box.style.setProperty('--vh', (bh / 100) + 'px');
      frameEl.style.setProperty('--vh', (bh / 100) + 'px');
      lyr.style.setProperty('--lyrb', over ? (ch + 6) + 'px' : '5%');
      placeCap();
    }
    function placeCap() {
      if (!cap || !alive) return;
      const fr = ctx.frame.getBoundingClientRect(), br = box.getBoundingClientRect();
      if (!br.width) return;
      const ch = parseFloat(root.style.getPropertyValue('--ctlh')) || 48;
      const over = root.classList.contains('overlay');
      cap.style.left = Math.round(br.left - fr.left + br.width * 0.08) + 'px';
      cap.style.right = Math.round(fr.right - br.right + br.width * 0.08) + 'px';
      cap.style.insetInline = 'auto';
      cap.style.left = Math.round(br.left - fr.left + br.width * 0.08) + 'px';
      cap.style.right = Math.round(fr.right - br.right + br.width * 0.08) + 'px';
      if (capTop) { cap.style.bottom = 'auto'; cap.style.top = Math.round(br.top - fr.top + 8) + 'px'; }
      else { cap.style.top = 'auto'; cap.style.bottom = Math.round(fr.bottom - br.bottom + (over ? ch + 8 : 8)) + 'px'; }
      cap.style.fontSize = Math.round(Math.max(14, Math.min(24, br.height * 0.055))) + 'px';
    }
    const ro = window.ResizeObserver ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(root); else window.addEventListener('resize', layout);
    requestAnimationFrame(layout);

    /* إخفاء الأزرار فوق الصورة بعد لحظات من السكون */
    let idleT = 0;
    const wake = () => { root.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => root.classList.add('idle'), 2800); };
    box.addEventListener('pointermove', wake); box.addEventListener('pointerdown', wake); ctl.addEventListener('focusin', wake);
    wake();
    root.addEventListener('keydown', (e) => { if (e.key === ' ' && e.target === root) { e.preventDefault(); toggle(); } });

    /* ---------- الساعة والانتظار (يحترمان الإيقاف المؤقّت والإلغاء) ---------- */
    const clock = () => (paused ? pausedAt : performance.now()) - pausedTotal;
    function newRun() {
      if (run) kill(run);
      const r = { dead: false };
      r.abort = new Promise((_, rej) => { r.rej = rej; });
      r.abort.catch(() => {});
      run = r; return r;
    }
    function kill(r) { if (!r.dead) { r.dead = true; r.rej(CANCEL); } }
    const race = (r, p) => Promise.race([p, r.abort]);
    function chk(r) { if (r.dead || !alive) throw CANCEL; }
    function wait(r, ms) {
      return race(r, new Promise((res) => {
        const target = clock() + ms;
        const tick = () => { if (r.dead) return; const left = target - clock(); if (left <= 0) res(); else setTimeout(tick, Math.min(60, left)); };
        tick();
      }));
    }
    function gate(r) { return paused ? race(r, new Promise((res) => { const t = () => (r.dead ? 0 : paused ? setTimeout(t, 70) : res()); t(); })) : Promise.resolve(); }

    /* ---------- الموسيقى الخلفية ---------- */
    function ensureBed() {
      if (bed || !script.bed || !BQ.hasAudio(script.bed)) return;
      bed = BQ.audio.fx(script.bed, 0);
      if (bed.el) { bed.el.loop = script.bedLoop !== false; bed.el.volume = 0; }
      bedVol = 0; syncBed();
    }
    function syncBed() {
      if (!bed || !bed.el) return;
      bedTarget = bedHold || paused ? 0 : (talking > 0 ? (script.bedDuck != null ? script.bedDuck : 0.07) : (script.bedVol != null ? script.bedVol : 0.2));
      if (!bedHold && !paused && bed.el.paused && !ended) bed.el.play().catch(() => {});
    }
    let bedTimer = setInterval(() => {
      if (!bed || !bed.el) return;
      const d = bedTarget - bedVol;
      bedVol = Math.abs(d) < 0.01 ? bedTarget : bedVol + d * 0.25;
      try { bed.el.volume = Math.max(0, Math.min(1, bedVol)); } catch (e) {}
      if (bedVol === 0 && (bedHold || paused || ended) && !bed.el.paused) bed.el.pause();
    }, 50);
    function stopBed() { if (bed) { bed.stop(); bed = null; } }
    const BEAT = script.bpm ? 60000 / script.bpm : 625;
    function beatDelay() { const t = bed && bed.el ? bed.el.currentTime * 1000 : 0; return (-(t % (BEAT * 2))).toFixed(0) + 'ms'; }

    /* ---------- الإيقاف المؤقّت ---------- */
    function viewAnims() { try { return view.getAnimations({ subtree: true }); } catch (e) { return []; } }
    function setPaused(v) {
      if (v === paused) return;
      if (v) {
        pausedAt = performance.now(); paused = true;
        if (curAudio) try { curAudio.pause(); } catch (e) {}
        fxSet.forEach((a) => { try { a.pause(); } catch (e) {} });
        pausedAnims = viewAnims().filter((a) => a.playState === 'running'); pausedAnims.forEach((a) => a.pause());
      } else {
        pausedTotal += performance.now() - pausedAt; paused = false;
        if (curAudio && !curAudio.ended) curAudio.play().catch(() => {});
        fxSet.forEach((a) => { if (!a.ended) a.play().catch(() => {}); });
        pausedAnims.forEach((a) => { try { a.play(); } catch (e) {} }); pausedAnims = [];
      }
      root.classList.toggle('is-paused', paused);
      ppBtn.replaceChildren(BQ.icon(paused ? 'play' : 'pause'));
      ppBtn.setAttribute('aria-label', paused ? 'تَشْغيل' : 'إيقاف مؤقّت');
      syncBed(); wake();
    }
    function toggle() {
      if (ended) { goto(0); return; }
      setPaused(!paused);
    }
    function freeze(on, soft) {
      if (on) { frozenAnims = viewAnims().filter((a) => a.playState === 'running'); frozenAnims.forEach((a) => a.pause()); dim.classList.toggle('soft', !!soft); dim.classList.add('on'); }
      else { frozenAnims.forEach((a) => { try { a.play(); } catch (e) {} }); frozenAnims = []; dim.classList.remove('on'); }
    }

    /* ---------- التقدّم ---------- */
    let raf = 0;
    function progress() {
      if (!alive) return;
      const sc = scenes[sceneIdx];
      if (sc && !ended) {
        const tot = sc.shots.reduce((a, s) => a + (s.d || 3), 0);
        const inShot = Math.min((clock() - shotStart) / 1000, shotNom);
        const f = Math.max(0, Math.min(1, (shotAcc + inShot) / tot));
        const b = segs[sceneIdx].querySelector('b'); if (b) b.style.width = (f * 100).toFixed(1) + '%';
      }
      raf = requestAnimationFrame(progress);
    }
    function markScene(i) {
      segs.forEach((s, j) => { s.classList.toggle('done', j < i); s.classList.toggle('cur', j === i); const b = s.querySelector('b'); if (b && j !== i) b.style.width = j < i ? '100%' : '0%'; if (j === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); });
      num.textContent = (i + 1).toLocaleString('ar-EG') + ' / ' + scenes.length.toLocaleString('ar-EG');
      stripBtns.forEach((b, j) => b.classList.toggle('cur', j === i));
    }

    /* ---------- بناء اللقطة ---------- */
    function mkChar(sp) {
      const def = CAST[sp.c];
      const el = h('div.vp-ch.vp-' + sp.c, { style: { left: sp.x + '%', top: sp.y + '%', height: sp.h + '%', aspectRatio: String(def.ar), zIndex: String(sp.z || 2) } });
      const mv = h('div'), flip = h('div'), idle = h('div.vp-idle'), act = h('div'), talk = h('div.vp-talk');
      const shadow = h('span.vp-shadow');
      el.append(shadow, mv); mv.append(flip); flip.append(idle); idle.append(act); act.append(talk);
      idle.style.animationDelay = (-Math.random() * 3).toFixed(2) + 's';
      if (sp.c === 'BRQ') { act.style.transformOrigin = '50% 55%'; shadow.style.animationDelay = idle.style.animationDelay; }
      const imgs = {};
      const addPose = (name) => {
        if (imgs[name]) return imgs[name];
        const p = def.poses[name] || def.poses.base;
        const im = h('img', { src: p.src, alt: '', draggable: 'false', class: p.box ? 'off' : 'full off' });
        if (p.box) { const fr = p.box[1] - p.box[0]; Object.assign(im.style, { height: (100 / fr).toFixed(2) + '%', top: (-p.box[0] / fr * 100).toFixed(2) + '%', left: '50%', width: 'auto', transform: 'translateX(-50%)' }); }
        talk.append(im); imgs[name] = im; return im;
      };
      let cur = sp.pose || 'base';
      addPose(cur).classList.remove('off');
      let face = sp.face || 1;
      flip.style.transform = face < 0 ? 'scaleX(-1)' : '';
      if (sp.dance) { idle.classList.add('dance'); idle.style.animationDelay = beatDelay(); }
      const pos = { x: sp.x, y: sp.y };
      const H = {
        el, key: sp.c, pos,
        pose(n) { if (n === cur) return; const a = addPose(n); const b = imgs[cur]; cur = n; requestAnimationFrame(() => { a.classList.remove('off'); if (b) b.classList.add('off'); }); },
        talk(on) { talk.classList.toggle('on', !!on && !rm()); },
        dance(on) { idle.classList.toggle('dance', !!on); if (on) idle.style.animationDelay = beatDelay(); },
        freeze(on) { idle.classList.toggle('frozen', !!on); },
        face(d, r) {
          if (d === face) return Promise.resolve(); face = d;
          if (rm()) { flip.style.transform = d < 0 ? 'scaleX(-1)' : ''; return Promise.resolve(); }
          const a = flip.animate([{ transform: d < 0 ? 'scaleX(1)' : 'scaleX(-1)' }, { transform: 'scaleX(.15)', offset: .5 }, { transform: d < 0 ? 'scaleX(-1)' : 'scaleX(1)' }], { duration: 260, easing: 'ease-in-out', fill: 'forwards' });
          flip.style.transform = d < 0 ? 'scaleX(-1)' : '';
          return r ? race(r, a.finished).catch((e) => { if (e === CANCEL) throw e; }) : a.finished.catch(() => {});
        },
        act(kind, r) {
          if (rm() && kind !== 'lean0') return Promise.resolve();
          const K = {
            hop: [[{ transform: 'none' }, { transform: 'translateY(0) scale(1.07,.9)', offset: .16 }, { transform: 'translateY(-16%) scale(.95,1.07)', offset: .46 }, { transform: 'translateY(0) scale(1.06,.93)', offset: .8 }, { transform: 'none' }], 560],
            bigHop: [[{ transform: 'none' }, { transform: 'translateY(0) scale(1.1,.86)', offset: .14 }, { transform: 'translateY(-34%) scale(.94,1.1) rotate(-6deg)', offset: .45 }, { transform: 'translateY(0) scale(1.08,.9)', offset: .82 }, { transform: 'none' }], 700],
            wave: [[{ transform: 'rotate(0)' }, { transform: 'rotate(-9deg)', offset: .17 }, { transform: 'rotate(8deg)', offset: .38 }, { transform: 'rotate(-8deg)', offset: .6 }, { transform: 'rotate(6deg)', offset: .8 }, { transform: 'rotate(0)' }], 1000],
            squish: [[{ transform: 'none' }, { transform: 'scale(1.14,.88)', offset: .25 }, { transform: 'scale(.96,1.05)', offset: .5 }, { transform: 'scale(1.12,.9)', offset: .72 }, { transform: 'none' }], 620],
            pop: [[{ transform: 'none' }, { transform: 'scale(1.16)', offset: .35 }, { transform: 'scale(.97)', offset: .7 }, { transform: 'none' }], 420],
            nod: [[{ transform: 'none' }, { transform: 'translateY(1.2%) rotate(1.5deg)', offset: .3 }, { transform: 'translateY(-.6%)', offset: .65 }, { transform: 'none' }], 520],
            shrug: [[{ transform: 'none' }, { transform: 'translateY(-4%) rotate(-5deg)', offset: .4 }, { transform: 'translateY(-4%) rotate(5deg)', offset: .7 }, { transform: 'none' }], 700],
          };
          if (kind === 'lean' || kind === 'lean0') return Promise.resolve();
          const k = K[kind]; if (!k) return Promise.resolve();
          const a = act.animate(k[0], { duration: k[1], easing: 'ease-in-out' });
          return r ? race(r, a.finished) : a.finished.catch(() => {});
        },
        lean(deg, ms) {
          const a = act.animate([{ transform: act.dataset.lean || 'rotate(0deg)' }, { transform: 'rotate(' + deg + 'deg)' }], { duration: rm() ? 1 : (ms || 420), easing: 'cubic-bezier(.3,.1,.3,1)', fill: 'forwards' });
          act.dataset.lean = 'rotate(' + deg + 'deg)';
          return a.finished.catch(() => {});
        },
        /** انتقال إلى موضع (x,y) — للولدين مشي، ولبارق تحليق بقوس */
        to(x, y, ms, r, o) {
          o = o || {};
          const from = { left: pos.x + '%', top: pos.y + '%' };
          pos.x = x; pos.y = y == null ? pos.y : y;
          const toK = { left: pos.x + '%', top: pos.y + '%' };
          if (rm()) { el.style.left = toK.left; el.style.top = toK.top; return Promise.resolve(); }
          let frames = [from, toK];
          if (sp.c === 'BRQ' && o.arc !== 0) {
            const arc = o.arc || 6; const mx = (parseFloat(from.left) + pos.x) / 2, my = (parseFloat(from.top) + pos.y) / 2 - arc;
            frames = [from, { left: mx + '%', top: my + '%', offset: .5 }, toK];
          }
          const walk = sp.c !== 'BRQ' && o.walk !== false;
          idle.classList.add('walk');
          const a = el.animate(frames, { duration: ms || 1200, easing: o.ease || 'cubic-bezier(.35,.05,.35,1)', fill: 'forwards' });
          const fin = () => { el.style.left = toK.left; el.style.top = toK.top; try { a.cancel(); } catch (e) {} idle.classList.remove('walk'); };
          if (!walk && sp.c !== 'BRQ') idle.classList.remove('walk');
          const p = a.finished.then(fin, fin);
          return r ? race(r, p) : p;
        },
        path(pts, ms, r) {
          if (rm()) return Promise.resolve();
          const a = el.animate(pts.map((p) => ({ left: p[0] + '%', top: p[1] + '%' })), { duration: ms, easing: 'ease-in-out' });
          const last = pts[pts.length - 1]; pos.x = last[0]; pos.y = last[1];
          const fin = () => { el.style.left = last[0] + '%'; el.style.top = last[1] + '%'; };
          const p = a.finished.then(fin, fin);
          return r ? race(r, p) : p;
        },
        show(on, ms) { const a = el.animate([{ opacity: on ? 0 : 1 }, { opacity: on ? 1 : 0 }], { duration: ms || 300, fill: 'forwards' }); return a.finished.catch(() => {}); },
      };
      return H;
    }

    function mkBg(def, L) {
      const bg = def.bg;
      const kb = (el, a, b, ms) => { if (rm() || !a) return; el.animate([{ transform: 'scale(' + a + ')' }, { transform: 'scale(' + b + ')' }], { duration: ms, easing: 'ease-out', fill: 'forwards' }); };
      if (typeof bg === 'string') {
        const im = h('img.vp-plate', { src: SRC(bg), alt: '', draggable: 'false', style: { objectPosition: def.pos || '50% 50%' } });
        if (def.blur) im.style.filter = 'blur(' + def.blur + 'px)';
        L.bgL.append(im);
      } else if (bg && bg.split) {
        L.halves = bg.split.map((p, i) => {
          const half = h('div.vp-half.' + (i === 0 ? 'r' : 'l')); const k = h('div.vp-kb');
          if (p.glyph != null) { const pn = h('div.vp-panel'); const g = h('span.vp-glyph', null, p.glyph); pn.append(g); k.append(pn); half.glyph = g; }
          else k.append(h('img.vp-plate', { src: SRC(p.img), alt: '', draggable: 'false', style: { objectPosition: p.pos || '50% 50%' } }));
          if (p.mouth) { const o = h('img.vp-plate.vp-mouthO', { src: SRC(p.mouth), alt: '', draggable: 'false', style: { objectPosition: p.pos || '50% 50%' } }); k.append(o); half.mouthO = o; L.mouth = { open(v) { o.classList.toggle('on', !!v); }, hum() {} }; }
          half.append(k); L.bgL.append(half); kb(k, 1.0, p.kb || 1.06, (def.d || 4) * 1300);
          half.kb = k; return half;
        });
        L.bgL.append(h('span.vp-split-line'));
      } else if (bg && bg.mouth) {
        const c = h('img.vp-plate', { src: SRC(bg.mouth[0]), alt: '', draggable: 'false', style: { objectPosition: bg.pos || '50% 30%' } });
        const o = h('img.vp-plate.vp-mouthO', { src: SRC(bg.mouth[1]), alt: '', draggable: 'false', style: { objectPosition: bg.pos || '50% 30%' } });
        L.bgL.append(c, o);
        const lx = bg.lips[0], ly = bg.lips[1];
        const ha = h('span.vp-hum.a', { html: SV.wave, style: { left: (lx + 9) + '%', top: (ly - 4) + '%' } });
        const hb = h('span.vp-hum.b', { html: SV.wave, style: { left: (lx - 35) + '%', top: (ly - 4) + '%' } });
        const glow = h('span.vp-lipglow', { style: { left: (lx - 8.5) + '%', top: (ly - 0.6) + '%' } });
        L.fxL.append(glow, ha, hb);
        L.mouth = {
          open(v) { o.classList.toggle('on', !!v); },
          hum(p) {
            const on = p != null;
            [ha, hb].forEach((e) => { e.style.opacity = on ? '1' : '0'; if (on) e.style.transform = 'scaleX(' + (0.15 + 0.85 * p).toFixed(3) + ')'; });
            glow.style.opacity = on ? '1' : '0';
          },
        };
      } else if (bg && bg.panel) {
        const pn = h('div.vp-panel'); L.bgL.append(pn);
        if (bg.glyph) { const g = h('span.vp-glyph', { style: { opacity: '1' } }, bg.glyph); pn.append(g); L.glyph = g; }
      }
    }

    function mount(def, tr) {
      const L = { c: {} };
      L.el = h('div.vp-shot'); const rig = h('div.vp-rig'); const drift = h('div.vp-drift');
      L.bgL = h('div.vp-bgL'); L.chL = h('div.vp-chL'); L.fxL = h('div.vp-fxL'); L.ui = h('div.vp-shotui');
      drift.append(L.bgL, L.chL, L.fxL); rig.append(drift); L.el.append(rig, L.ui); L.rig = rig;
      if (def.drift === false || rm()) drift.style.animation = 'none';
      else drift.style.animationDelay = (-Math.random() * 8).toFixed(2) + 's';
      mkBg(def, L);
      for (const k in def.cast || {}) L.c[k] = mkChar(def.cast[k]);
      Object.values(L.c).forEach((c) => L.chL.append(c.el));
      // الكاميرا
      const c0 = (def.cam && def.cam[0]) || { z: 1 }, c1 = (def.cam && def.cam[1]) || c0;
      L.cam = c0;
      const t0 = camT(rm() ? c1 : c0);
      L.bgL.style.transform = t0.bg; L.chL.style.transform = t0.ch; L.fxL.style.transform = t0.ch;
      L.camTo = (c, ms, ease) => {
        if (rm()) { const t = camT(c); L.bgL.style.transform = t.bg; L.chL.style.transform = L.fxL.style.transform = t.ch; L.cam = c; return Promise.resolve(); }
        const a = camT(L.cam), b = camT(c); L.cam = c;
        const o = { duration: ms, easing: ease || 'cubic-bezier(.32,0,.28,1)', fill: 'forwards' };
        L.bgL.animate([{ transform: a.bg }, { transform: b.bg }], o);
        L.chL.animate([{ transform: a.ch }, { transform: b.ch }], o);
        return L.fxL.animate([{ transform: a.ch }, { transform: b.ch }], o).finished.catch(() => {});
      };
      if (c1 !== c0 && !rm()) L.camTo(c1, (def.camMs || (def.d || 4) * 1000 * 1.25), def.camEase || 'cubic-bezier(.3,.05,.4,1)');
      view.append(L.el);
      const prev = layer; layer = L;
      transition(prev, L, rm() ? (tr === 'cut' ? 'cut' : 'fade') : tr);
      return L;
    }

    function transition(prev, L, tr) {
      const rmPrev = () => { if (prev && prev.el.parentNode) prev.el.remove(); };
      const dir = (tr && tr.dir) || -1; const kind = (tr && tr.kind) || tr;
      if (!prev && kind !== 'black') { L.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350 }); return; }
      switch (kind) {
        case 'black': L.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out' }); rmPrev(); break;
        case 'fade': case 'dissolve': {
          const a = L.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: kind === 'fade' ? 450 : 700, easing: 'ease-in-out' });
          a.onfinish = rmPrev; a.oncancel = rmPrev; break;
        }
        case 'whip': {
          if (prev) prev.el.animate([{ transform: 'none', filter: 'blur(0)' }, { transform: 'translateX(' + (-dir * 40) + '%)', filter: 'blur(16px)' }], { duration: 260, easing: 'cubic-bezier(.6,0,.9,.5)', fill: 'forwards' });
          const a = L.el.animate([{ transform: 'translateX(' + (dir * 45) + '%)', filter: 'blur(16px)' }, { transform: 'translateX(' + (dir * 8) + '%)', filter: 'blur(6px)', offset: .5 }, { transform: 'none', filter: 'blur(0)' }], { duration: 420, easing: 'cubic-bezier(.1,.5,.3,1)' });
          a.onfinish = rmPrev; a.oncancel = rmPrev; break;
        }
        case 'wipe': {
          const a = L.el.animate([{ clipPath: dir < 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 900, easing: 'cubic-bezier(.5,0,.3,1)' });
          a.onfinish = rmPrev; a.oncancel = rmPrev; break;
        }
        case 'match': {
          if (prev) prev.el.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.22)', opacity: 0 }], { duration: 480, easing: 'ease-in', fill: 'forwards' });
          const a = L.el.animate([{ transform: 'scale(.86)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.2,.8,.3,1)' });
          a.onfinish = rmPrev; a.oncancel = rmPrev; break;
        }
        default: rmPrev();
      }
    }

    /* ---------- واجهة اللقطة للنصوص ---------- */
    function mkS(L, r) {
      const s = {
        L, c: L.c, r, age: AGE(), view: box,
        wait: (ms) => wait(r, ms),
        chk: () => chk(r),
        race: (p) => race(r, p),
        async say(id, who, o) {
          o = o || {};
          chk(r); await gate(r); chk(r);
          const w = typeof who === 'string' ? L.c[who] : who;
          const ws = Array.isArray(who) ? who.map((k) => L.c[k]).filter(Boolean) : w ? [w] : [];
          ws.forEach((c) => c.talk(true)); talking++; syncBed();
          const song = script.song && o.lyric !== false;
          const p = BQ.audio.play(id, song ? { noCaption: true } : undefined);
          curAudio = BQ.hasAudio(id) ? BQ.audio.cur : null;
          if (paused && curAudio) curAudio.pause();
          if (song) lyric(id, curAudio);
          try { await race(r, p); } finally { ws.forEach((c) => c.talk(false)); talking = Math.max(0, talking - 1); syncBed(); curAudio = null; if (song) lyric(null); }
          if (o.after) await wait(r, o.after);
        },
        /** سطر مع مزامنة الفم في اللقطة القريبة — pattern: لكلّ مقطع صوتيّ 'm' (مطبق طوال الهمهمة) · 'ma' (إطباق ثم فتح) · 'talk' */
        async mouthSay(id, pattern) {
          const M = L.mouth; if (!M) return s.say(id);
          const env = await race(r, voiced(id));
          chk(r); await gate(r);
          let alive2 = true; const t0 = clock();
          const pr = s.say(id);
          const au = curAudio;
          const loop = () => {
            if (!alive2 || r.dead) return;
            const t = au ? au.currentTime : (clock() - t0) / 1000;
            const dur = au && isFinite(au.duration) && au.duration ? au.duration : (env ? env.dur : Math.max(1.2, (BQ.line(id) ? BQ.line(id).t.length : 10) * 0.085));
            let S = env && env.segs.length ? env.segs : pattern.map((_, i) => [dur * (i / pattern.length) + 0.05, dur * ((i + 0.82) / pattern.length)]);
            let open = false, hum = null;
            for (let i = 0; i < S.length; i++) {
              const [a, b] = S[i]; if (t < a || t > b) continue;
              const kind = pattern[Math.min(i, pattern.length - 1)] || 'talk';
              const lt = t - a;
              if (kind === 'm') { open = false; hum = Math.min(1, lt / Math.max(0.3, b - a)); }
              else if (kind === 'ma') open = lt > 0.16 && t < b - 0.04;
              else open = Math.floor(lt / 0.13) % 3 !== 2 && lt > 0.05;
            }
            M.open(open); M.hum(hum);
            requestAnimationFrame(loop);
          };
          requestAnimationFrame(loop);
          try { await pr; } finally { alive2 = false; M.open(false); M.hum(null); }
        },
        /** مؤثّر صوتيّ يُنتظر (أو مدّته الاسمية إن لم يوجد الملفّ) */
        async fx(id, nominal, vol) {
          chk(r); await gate(r);
          const f = BQ.audio.fx(id, vol == null ? 0.9 : vol);
          if (f.el) { fxSet.add(f.el); f.done.then(() => fxSet.delete(f.el)); if (paused) f.el.pause(); await race(r, f.done); }
          else await wait(r, nominal || 1000);
        },
        fxBg(id, vol) { const f = BQ.audio.fx(id, vol == null ? 0.8 : vol); if (f.el) { fxSet.add(f.el); f.done.then(() => fxSet.delete(f.el)); } return f; },
        cam(c, ms, ease) { return race(r, L.camTo(c, ms, ease)); },
        shake(n) {
          if (rm()) return Promise.resolve();
          const k = []; for (let i = 0; i <= (n || 2) * 2; i++) k.push({ transform: i === (n || 2) * 2 ? 'none' : 'translate(' + (i % 2 ? -0.8 : 0.8) + '%,' + (i % 2 ? 0.3 : -0.3) + '%)' });
          return race(r, L.rig.animate(k, { duration: 90 * k.length, easing: 'linear' }).finished);
        },
        capTop(v) { capTop = !!v; placeCap(); },
        add(el, where) { (where === 'ui' ? L.ui : L.fxL).append(el); return el; },
        ring(kind, x, y, size, where, o) {
          o = o || {};
          const el = h('span.vp-ring', { html: SV[kind] || SV.ring, style: { left: x + '%', top: y + '%', width: size + '%', aspectRatio: '1' } });
          if (o.color) el.style.color = o.color;
          s.add(el, where);
          if (!rm()) el.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1.12)', opacity: 1, offset: .6 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: 480, easing: 'ease-out' });
          return el;
        },
        ripple(x, y, w, n) {
          if (rm()) return;
          for (let i = 0; i < (n || 3); i++) {
            const e = h('span.vp-ripple', { style: { left: x + '%', top: y + '%', width: w + '%', aspectRatio: '3.2' } });
            L.fxL.append(e);
            const a = e.animate([{ transform: 'translate(-50%,-50%) scale(.1)', opacity: .95 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }], { duration: 1500, delay: i * 420, easing: 'ease-out', fill: 'both' });
            a.onfinish = () => e.remove();
          }
        },
        /** إضاءة موضعية تمرّ على أماكن (بلا تمييز للصواب) */
        async spot(pts, each) {
          const sp = h('span.vp-spot', { style: { left: pts[0][0] + '%', top: pts[0][1] + '%', width: pts[0][2] + '%', aspectRatio: '1' } });
          L.fxL.append(sp); await wait(r, 30); sp.style.opacity = '1';
          for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            if (i > 0) { const a = sp.animate([{ left: pts[i - 1][0] + '%', top: pts[i - 1][1] + '%', width: pts[i - 1][2] + '%' }, { left: p[0] + '%', top: p[1] + '%', width: p[2] + '%' }], { duration: rm() ? 1 : 650, easing: 'ease-in-out', fill: 'forwards' }); await race(r, a.finished); }
            await wait(r, each || 1000);
          }
          sp.style.opacity = '0'; await wait(r, 450); sp.remove();
        },
        invite: (kind, o) => invite(r, kind, o),
        bed(on) { if (on) { ensureBed(); bedHold = false; } else bedHold = true; syncBed(); },
        get bedTime() { return bed && bed.el ? bed.el.currentTime : 0; },
        beatPulse(on) { if (!rm()) L.rig.style.animation = on ? 'vpPulse var(--beat,625ms) ease-out infinite' : ''; },
      };
      return s;
    }

    /* ---------- وقفات الدعوة: توقف المشهد فعلاً ---------- */
    async function invite(r, kind, o) {
      o = o || {};
      chk(r); await gate(r);
      freeze(true, kind === 'phrase');
      bedHold = true; syncBed();
      const lay = h('div.vp-inv.vp-inv-' + kind);
      ui.append(lay);
      let picked = null;
      const finish = () => { lay.remove(); freeze(false); bedHold = false; syncBed(); };
      try {
        if (kind === 'where' || kind === 'say' || kind === 'what') {
          lay.append(h('div.vp-badge', { role: 'img', 'aria-label': kind === 'where' ? 'أَيْنَ؟' : kind === 'say' ? 'قُل' : 'ما؟', html: SV[kind] }));
          await wait(r, o.ms || BQ.silence(kind === 'say' ? 'say' : 'invite'));
          if (o.model) { await gate(r); lay.remove(); freeze(false); bedHold = false; syncBed(); await o.model(); return { picked }; }
        } else if (kind === 'phrase') {
          lay.append(h('div.vp-banner', { lang: 'ar' }, o.text || 'سَمِعْتُ الْفَرْقَ.' /* FIX13 R13-B-06 (DRAFT) */));
          await wait(r, o.ms || BQ.silence('say'));
        }
        // v0-12 r3: لا طبقة «صوت واحد/مختلفان» بالرموز في مشغّل المشاهد أيضاً — يُكمل بلا سؤال.
      } finally { if (lay.parentNode) finish(); }
      return { picked };
    }

    /* ---------- النصّ المصاحب للأنشودة (وضع «غنِّ معي») ---------- */
    let lyrRaf = 0;
    const SPC = { 'سيف': 'var(--c-say)', 'ماجد': 'var(--c-maj-sleeve)', 'بارق': 'var(--c-brq)' };
    const SPN = { 'سيف': 'سَيْف', 'ماجد': 'ماجِد', 'بارق': 'بارِق' };
    function lyric(id, au) {
      cancelAnimationFrame(lyrRaf);
      if (!id) { lyr.hidden = true; return; }
      const L = BQ.line(id); if (!L) { lyr.hidden = true; return; }
      const text = L.t.replace(/⏸\S*/g, ' ').trim();
      const words = text.split(/\s+/);
      const spans = words.map((w) => h('span', { html: w.replace(/^مْـ/, '<i class="m" style="font-style:normal">مْـ</i>').replace(/^م(?!ْـ)([\u064B-\u0652]*)/, (m) => '<i class="m" style="font-style:normal">' + m + '&zwj;</i>&zwj;') + '&nbsp;' }));
      const tag = SPN[L.sp] ? h('b', { style: { '--sp': SPC[L.sp] } }, SPN[L.sp]) : null;
      lyr.replaceChildren(...(tag ? [tag] : []), ...spans);
      lyr.style.setProperty('--sp', SPC[L.sp] || 'var(--c-brq)');
      const lens = words.map((w) => w.replace(/[ً-ْٰـ…!.,:،؟]/g, '').length + 1);
      const tot = lens.reduce((a, b) => a + b, 0);
      const t0 = clock(); const est = Math.max(1.4, text.length * 0.085);
      const step = () => {
        lyr.hidden = !BQ.state.cc;
        const t = au ? au.currentTime : (clock() - t0) / 1000;
        const d = au && isFinite(au.duration) && au.duration ? au.duration * 0.92 : est;
        const k = Math.max(0, Math.min(1, t / d)) * tot;
        let acc = 0;
        spans.forEach((s, i) => { const a = acc; acc += lens[i]; s.className = k >= acc ? 'past' : k >= a ? 'now' : ''; });
        lyrRaf = requestAnimationFrame(step);
      };
      step();
    }

    /* ---------- التشغيل ---------- */
    async function runFrom(i) {
      const r = newRun();
      ended = false; root.classList.remove('is-ended');
      if (paused) setPaused(false);
      try {
        if (!script.bedManual || i > 0) ensureBed();
        syncBed();
        for (let k = i; k < scenes.length; k++) {
          sceneIdx = k; shotAcc = 0; markScene(k);
          opt.onScene && opt.onScene(k, scenes[k]);
          const sc = scenes[k];
          for (let j = 0; j < sc.shots.length; j++) {
            const def = sc.shots[j];
            chk(r); await gate(r); chk(r);
            shotStart = clock(); shotNom = def.d || 3;
            const L = mount(def, (k === i && j === 0) ? (k === 0 ? 'black' : 'fade') : (def.tr || 'cut'));
            await def.run(mkS(L, r));
            shotAcc += def.d || 3;
          }
          const b = segs[k].querySelector('b'); if (b) b.style.width = '100%';
          segs[k].classList.add('done');
        }
        chk(r);
        ended = true; root.classList.add('is-ended');
        big.setAttribute('aria-label', 'أَعِدِ المَقْطَعَ'); big.replaceChildren(BQ.icon('replay'));
        bedHold = true; syncBed();
        ppBtn.replaceChildren(BQ.icon('replay')); ppBtn.setAttribute('aria-label', 'أَعِدِ المَقْطَعَ');
        resolveDone(true);
      } catch (e) {
        if (e !== CANCEL) console.error(e);
      }
    }
    function clearStage() {
      capTop = false; placeCap();
      BQ.audio.stop(); curAudio = null; talking = 0;
      fxSet.forEach((a) => { try { a.pause(); } catch (e) {} }); fxSet.clear();
      ui.replaceChildren(); frozenAnims = []; pausedAnims = []; dim.classList.remove('on');
      lyric(null); bedHold = false;
    }
    function goto(i) {
      if (!alive) return;
      if (run) kill(run);
      clearStage();
      big.replaceChildren(BQ.icon('play')); big.setAttribute('aria-label', 'تَشْغيل');
      ppBtn.replaceChildren(BQ.icon('pause'));
      if (paused) { pausedTotal += performance.now() - pausedAt; paused = false; root.classList.remove('is-paused'); }
      runFrom(Math.max(0, Math.min(scenes.length - 1, i)));
    }

    /* شريط المشاهد في دليل المعلّم */
    const stripBtns = [];
    const adultP = ctx.frame && ctx.frame.querySelector('.bq-adult');
    if (adultP && opt.strip !== false) {
      const strip = h('div.vp-strip');
      scenes.forEach((sc, i) => { const b = h('button', { type: 'button', onclick: () => goto(i), title: sc.title }, h('img', { src: SRC(sc.thumb || 'ROOM-M_r01'), alt: '' }), h('span', null, AR(i + 1) + ' · ' + (sc.title || ''))); stripBtns.push(b); strip.append(b); });
      adultP.append(h('p', null, h('b', null, 'شريط المشاهد:'), ' اِخْتَر مَشْهَدًا لِإِعَادَتِهِ.' /* FIX13 R13-B-07 (DRAFT) */), strip);
      if (opt.adultExtra) adultP.append(opt.adultExtra);
    }

    function destroy() {
      if (!alive) return; alive = false;
      if (run) kill(run);
      clearStage(); stopBed(); clearInterval(bedTimer); cancelAnimationFrame(raf); cancelAnimationFrame(lyrRaf); clearTimeout(idleT);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', layout);
      if (cap) ['left', 'right', 'bottom', 'top', 'fontSize', 'insetInline'].forEach((k) => { cap.style[k] = ''; });
    }
    ctx.onCleanup(destroy);

    raf = requestAnimationFrame(progress);
    root.tabIndex = -1;
    const P = { root, box, done, goto, destroy, toggle, pause: () => setPaused(true), play: () => setPaused(false), get scene() { return sceneIdx; }, get ended() { return ended; }, start: () => runFrom(opt.from || 0) };
    if (opt.autoplay !== false) P.start();
    return P;
  }

  /* ================================================================================================
     BQ.video.mp4(stage, ctx, o) — المقطع المُصيَّر (MP4) في إطار فيديو المنصّة (خلفية سوداء · تشغيل/إيقاف · تقدّم)
     مع وقفات الدعوة ونقاط اللمس نفسها تقودها ملفّات media/video/<id>.cues.json:
     عند كلّ وقفة يتوقّف الفيديو، تظهر الطبقة (قُل / ما؟)، ثم يُستأنف من resume (وقفات الحكم بلا طبقة منذ v0-12 r3؛ o.noCues يلغي الوقفات كلّها).
     إن تعذّر تحميل الفيديو أو ملفّ الوقفات → o.fallback() (مشغّل المشاهد في الصفحة) تلقائياً.
     o = { id:'vid-102', aria, captions:true|false, adultExtra: () => Node, fallback: () => player }
     يعيد واجهة المشغّل نفسها: { root, done, goto(i), destroy(), scene, ended, pause(), play(), toggle() }
     ================================================================================================ */
  /** ملصق المقطع + رسالة عند تعذّر التشغيل (لا مشغّل مشاهد بديل) */
  const A_unlock = () => { try { BQ.audio.unlock(); } catch (e) { /* */ } };
  function posterFail(stage, ctx, o, why) {
    const base = o.base || ('media/video/' + o.id);
    let res; const done = new Promise((r) => { res = r; });
    const root = h('div.vp.vp-mp4.vp-fail' + (ctx.frame && ctx.frame.classList.contains('elp') ? '.vp-page' : ''), { role: 'region', 'aria-label': o.aria || 'مَقْطَعٌ مُصَوَّرٌ' });
    const box = h('div.vp-box', null, h('img', { src: base + '.jpg', alt: '', onerror: (e) => { if (o.poster && !e.target.dataset.alt) { e.target.dataset.alt = '1'; e.target.src = o.poster; } } }),
      h('div.vp-msg', { role: 'status' },
        BQ.ui && BQ.ui.brq ? BQ.ui.brq('think', 'vp-fail-brq') : null, // R3-F8: للطفل بارق «يفكّر» وزرّان فقط — الجملة في دليل المعلّم
        h('div', null,
          h('button.bq-btn', { type: 'button', onclick: () => BQ.open(ctx.meta.id, { skipCover: true }) }, BQ.icon('replay'), 'أَعِدِ المُحاوَلَةَ'),
          h('button.bq-btn.ghost', { type: 'button', onclick: () => { A_unlock(); res(false); } }, o.failNext || 'تابِع', BQ.icon('next')))));
    const frameEl = h('div.vp-frame', null, box);
    root.append(frameEl); stage.append(root);
    if (ctx.adultNote) ctx.adultNote('<p class="pause"><b>تعذّر تشغيل المقطع</b> على هذا الجهاز أو المتصفّح (' + String(why).replace(/</g, '&lt;') + '). جرّب «أَعِدِ المُحاوَلَةَ»، أو تابِع إلى العنصر التالي. على iPad استعمل Safari وشبكة أسرع، أو افتح الدرس من الرابط المنشور.</p>');
    const fit = () => { let W = root.clientWidth || stage.clientWidth; if (!W) return; const stg = root.closest('.elp-stage'); if (stg && stg.clientHeight > 300) W = Math.min(W, Math.floor((stg.clientHeight - 200) * 16 / 9)); const bh = Math.round(W * 9 / 16); box.style.width = W + 'px'; box.style.height = bh + 'px'; frameEl.style.width = W + 'px'; frameEl.style.height = bh + 'px'; };
    const ro = window.ResizeObserver ? new ResizeObserver(fit) : null; if (ro) ro.observe(root); requestAnimationFrame(fit);
    ctx.onCleanup(() => ro && ro.disconnect());
    try { console.warn('[BQ.video.mp4] ' + o.id + ' not playable (' + why + ') — poster shown'); } catch (e) {}
    return { root, done, goto() {}, destroy() { root.remove(); }, toggle() {}, pause() {}, play() {}, scene: 0, ended: false };
  }

  function mp4(stage, ctx, o) {
    injectCss();
    if (!document.getElementById('st-video-mp4')) document.head.append(h('style', { id: 'st-video-mp4' },
      '.vp-mp4 video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:var(--c-video-bg);display:block;z-index:0;opacity:.999}' +
      '.vp-mp4 .vp-dim{z-index:4;transform:translateZ(0)}.vp-mp4 .vp-ui{z-index:6;transform:translateZ(0)}.vp-mp4 .vp-big{z-index:7}' +
      '.vp-mp4 .vp-seg i b{transition:none;width:100%;transform:scaleX(0);transform-origin:100% 50%}' + /* progress = transform only (no relayout per frame) */
      '.vp.is-hold .vp-ctl{visibility:hidden}.vp.is-hold .vp-big{display:none!important}' + /* checkpoint question: controls hidden, frame keeps its size */
      '.vp.vp-page{height:auto;flex:none;width:100%;display:block}' +
      '.vp.vp-page .vp-frame{margin-inline:auto;border-radius:var(--r-lg,22px);box-shadow:0 14px 34px var(--shade,rgba(0,52,91,.12))}' +
      '.vp.vp-page .vp-ctl{background:var(--c-video-bg)}' +
      '.vp-fail .vp-box img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.8) brightness(.7)}' +
      '.vp-fail .vp-msg{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:14px;padding:16px;text-align:center;color:var(--c-topbar-fg);font:600 clamp(15px,2.4cqi,19px)/1.6 var(--ff-ui);z-index:3}' +
      '.vp-fail .vp-msg p{margin:0;max-width:34ch;background:color-mix(in srgb,var(--c-video-bg) 60%,transparent);padding:8px 14px;border-radius:12px}' +
      '.vp-fail .vp-msg div{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}' +
      /* «أَكْمِلْ» تحت الصورة في وضع الصفحة: زرّ المنصّة الموحّد، ≥ ١٢٠ بكسل عرضاً (QA-23 · D06) */
      '.vp-below{display:flex;justify-content:center;align-items:center;gap:12px;min-height:0}' +
      '.vp-below:not(:empty){padding-top:14px}' +
      '.vp-below .bq-btn.vp-go2{min-width:120px;min-height:64px;font-size:20px;padding:0 1.4em}' +
      '.vp-below .bq-btn.vp-go2 .bq-ic{transform:scaleX(-1)}' +
      '.vp-mp4 .vp-go{min-width:120px;min-height:64px}' +
      '.vp-mp4 .vp-box{cursor:pointer}.vp-mp4 .vp-ctl>button{min-width:44px;min-height:44px;touch-action:manipulation}' +
      /* v8 player: one continuous bar (hit area = the whole bar height), yellow elapsed fill, white thumb with a yellow ring */
      '.vp-mp4 .vp-track{flex:1 1 auto;min-width:0;align-self:stretch;min-height:44px;display:flex;align-items:center;padding:0 16px;cursor:pointer;touch-action:none;outline:none;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}' +
      '.vp-mp4 .vp-rail{position:relative;display:block;width:100%;height:10px;border-radius:999px;background:color-mix(in srgb,var(--c-topbar-fg) 28%,transparent)}' +
      '.vp-mp4 .vp-fill{position:absolute;inset:0;border-radius:inherit;background:var(--btn,#FEBA02);transform-origin:100% 50%;transform:scaleX(0)}' +
      '.vp-mp4 .vp-thumb{position:absolute;top:50%;right:-14px;width:28px;height:28px;margin-top:-14px;border-radius:50%;background:#fff;box-shadow:0 0 0 5px var(--btn,#FEBA02),0 2px 8px rgba(0,0,0,.45);transition:scale .12s}' +
      '.vp-mp4.is-scrub .vp-thumb{scale:1.25}.vp-mp4 .vp-track:focus-visible .vp-rail{outline:4px solid var(--c-brq);outline-offset:8px}' +
      '.vp-mp4 .vp-ctl>button.vp-fsb>svg{width:44%;height:44%}' +
      '.vp-mp4 .vp-ctl>button.vp-ccb[aria-pressed="true"]{color:var(--btn,#FEBA02)}' +
      '.vp-mp4 .vp-ctl>button.vp-ccb[aria-pressed="false"]{color:color-mix(in srgb,var(--c-topbar-fg) 60%,transparent);position:relative}' +
      '.vp-mp4 .vp-ctl>button.vp-ccb[aria-pressed="false"]::after{content:"";position:absolute;left:24%;right:24%;top:50%;height:4px;margin-top:-2px;border-radius:2px;background:currentColor;transform:rotate(-38deg)}' +
      '.vp-mp4 .vp-ctl>button[hidden]{display:none}' +
      /* captions INSIDE the picture (also in fullscreen) */
      '.vp-mp4 .vp-cc{position:absolute;left:50%;bottom:4.5%;transform:translateX(-50%);z-index:5;margin:0;width:max-content;max-width:72%;box-sizing:border-box;padding:.08em .8em .22em;border-radius:.6em;background:rgba(11,45,79,.78);color:#fff;font:700 1px/1.65 var(--ff-child);font-size:max(16px,calc(var(--vh,6px)*4.6));text-align:center;text-wrap:balance;pointer-events:none;direction:rtl}' +
      '.vp-mp4 .vp-cc[hidden]{display:none}.vp-mp4.cc-top .vp-cc{bottom:auto;top:4.5%}' +
      /* the paused-state play button: small, semi-transparent, in the picture corner (never on the board word in the middle) */
      '.vp-mp4 .vp-big{left:auto;top:auto;right:2.6%;bottom:4.5%;transform:none;width:max(var(--bq8-glass64,76px),calc(var(--vh,6px)*15));border-width:3px;border-color:rgba(255,255,255,.85);background:color-mix(in srgb,var(--btn,#FEBA02) 72%,transparent);box-shadow:0 4px 14px rgba(0,0,0,.3)}' +
      /* fullscreen (requestFullscreen on the player): black, 16:9 letter-boxed, control bar under the picture */
      '.vp-mp4.is-fs{position:fixed!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;padding:0!important;background:#000;display:flex!important;flex-direction:column;align-items:center;justify-content:center;--bq8-glass64:72px;z-index:2147483000}' +
      '.vp-mp4.is-fs .vp-frame{border-radius:0!important;box-shadow:none!important;margin:0!important;translate:none!important}' +
      '.vp-mp4:fullscreen::backdrop{background:#000}' +
      '.vp-page .vp-inv .bq-btn.vp-go2.vp-go-ov{position:absolute;z-index:9;bottom:max(12px,3cqh);inset-inline-end:max(12px,2.4cqw);min-width:132px;min-height:64px;font-size:20px;padding:0 1.4em;box-shadow:0 5px 0 var(--sun-edge),0 10px 26px rgba(0,0,0,.35);animation:vpGoIn .35s cubic-bezier(.2,.9,.3,1.2) both}' +
      '.vp-page .vp-inv .bq-btn.vp-go2.vp-go-ov .bq-ic{transform:scaleX(-1)}' +
      '.vp-page .vp-inv:has(.vp-go-ov) .vp-pick{padding-inline-end:170px!important}' +
      '@keyframes vpGoIn{from{opacity:0;transform:translateY(14px) scale(.9)}to{opacity:1;transform:none}}' +
      '@media (prefers-reduced-motion: reduce){.vp-page .vp-inv .bq-btn.vp-go2.vp-go-ov{animation:none}}' +
      '.vp-ctl>button.rate{width:auto;min-width:56px;border-radius:999px;padding:0 10px;font:700 15px/1 var(--ff-ui)}' +
      '.vp-ctl>button.rate[aria-pressed="true"]{background:var(--btn);color:var(--c-title-text)}' +
      '.vp-seg{position:relative}.vp-hand{position:absolute;top:2px;width:3px;height:calc(50% - 4px);margin-inline-start:-1.5px;border-radius:2px;background:var(--c-brq);pointer-events:none}' +
      '.vp-hand::after{content:"✋";position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font-size:11px;line-height:1}'));
    const base = o.base || ('media/video/' + o.id);
    let alive = true, fell = false, impl = null, cues = null, ended = false, started = false;
    let userPaused = false, inCue = null, lastT = 0, raf = 0, capId = null, capTop = false, idleT = 0, loadT = 0;
    let hold = false; // checkpoint question open (video7): video paused at that frame, controls + captions hidden, play blocked
    const seen = new Set();   // ثوانٍ شوهدت فعلاً بتشغيل عاديّ (لا بالقفز) — «انتهى المقطع حقّاً» (EL02)
    const handled = new Set();
    let resolveDone; const done = new Promise((r) => { resolveDone = r; });
    const adultNodes = [];

    const root = h('div.vp.vp-mp4', { role: 'region', 'aria-label': o.aria || 'مَقْطَعٌ مُصَوَّرٌ' });
    const frameEl = h('div.vp-frame');
    const box = h('div.vp-box');
    const video = h('video', { playsinline: '', 'webkit-playsinline': '', preload: 'auto', poster: o.posterSrc || base + '.jpg', 'aria-hidden': 'true', disablepictureinpicture: '' });
    video.disableRemotePlayback = true;
    const dim = h('div.vp-dim');
    const ui = h('div.vp-ui');
    const big = h('button.vp-big', { type: 'button', 'aria-label': 'تَشْغيل', onclick: () => toggle() }, BQ.icon('play'));
    const ppBtn = h('button.pp', { type: 'button', 'aria-label': 'إيقاف مؤقّت', onclick: () => toggle() }, BQ.icon('pause'));
    /* v8 player (OWNER_R3 2026-10-06 «لماذا يظهر عليه التقطيعات في شريط التشغيل؟ أريد إضافة زر الـ FULL SCREEN» · CC inside the player):
       ONE continuous progress bar (no chapter cuts, no «n / 7» counter — chapters stay internal for ↻ / the teacher strip), a clean thumb,
       tap or drag anywhere on the bar to seek (hit area = the whole control-bar height); a CC toggle (only when the video has caption lines;
       captions drawn INSIDE the picture, default ON, remembered for the session) and a fullscreen toggle. */
    const fill = h('i.vp-fill'), thumb = h('i.vp-thumb');
    const segWrap = h('div.vp-track', { role: 'slider', tabindex: '0', 'aria-label': 'شَريطُ التَّشْغيلِ', 'aria-valuemin': '0', 'aria-valuemax': '0', 'aria-valuenow': '0' }, h('span.vp-rail', null, fill, thumb));
    const rpBtn = h('button', { type: 'button', 'aria-label': 'أَعِدِ المَشْهَدَ', title: 'أعد المشهد', onclick: () => goto(sceneIdx()) }, BQ.icon('replay'));
    // ٠٫٧٥× لـ١٠–١٢ (يتحكّم فيه الطفل — QA-22)
    const rateBtn = o.slow ? h('button.rate', { type: 'button', 'aria-pressed': 'false', 'aria-label': 'إبطاء المقطع', title: 'إبطاء المقطع', onclick: () => { const on = video.playbackRate === 1; video.playbackRate = on ? 0.75 : 1; rateBtn.setAttribute('aria-pressed', String(on)); } }, h('bdi', { dir: 'ltr' }, '٠٫٧٥×')) : null;
    const ccOn = () => BQ.state.vcc !== false;
    const ccBtn = o.captions ? h('button.vp-ccb', { type: 'button', hidden: true, 'aria-label': 'النَّصُّ المُصاحِبُ', title: 'النَّصُّ المُصاحِبُ', 'aria-pressed': String(ccOn()), onclick: () => setCc(!ccOn()) }, BQ.icon('cc')) : null;
    const FS_IN = '<svg viewBox="18 20 64 64" aria-hidden="true"><path d="M24 40V28h12M64 28h12v12M76 64v12H64M36 76H24V64" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const FS_OUT = '<svg viewBox="18 20 64 64" aria-hidden="true"><path d="M24 40h12V28M64 28v12h12M76 64H64v12M36 76V64H24" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const fsApi = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || video.webkitSupportsFullscreen || typeof video.webkitEnterFullscreen === 'function');
    const fsBtn = h('button.vp-fsb', { type: 'button', 'aria-label': 'مِلْءُ الشّاشَةِ', title: 'مِلْءُ الشّاشَةِ', html: FS_IN, onclick: () => toggleFs() });
    if (!fsApi) fsBtn.hidden = true;
    const ctl = h('div.vp-ctl', null, ppBtn, segWrap, rateBtn, ccBtn, fsBtn, rpBtn);
    const below = h('div.vp-below');
    const ccEl = h('p.vp-cc', { hidden: true, 'aria-live': 'polite', lang: 'ar', dir: 'rtl' });
    box.append(video, dim, ui, ccEl, big);
    frameEl.append(box, ctl);
    root.append(frameEl, below);
    stage.append(root);
    root.tabIndex = -1;

    /* تخطيط ١٦:٩ كمشغّل المشاهد */
    const cap = ctx.frame && ctx.frame.querySelector('.bq-cap');
    const page = !!(ctx.frame && ctx.frame.classList.contains('elp')); // تصميم v2: المشغّل بعرض المسرح والأزرار تحته
    if (page) root.classList.add('vp-page');
    /* write a style only when it changes (no style churn → no needless relayout of the stage) */
    function setSt(el, k, v) { if (k[0] === '-') { if (el.style.getPropertyValue(k) !== v) el.style.setProperty(k, v); } else if (el.style[k] !== v) el.style[k] = v; }
    /* v8 fixed stage: put the frame's top-left corner on the device-pixel grid (the stage itself is snapped by core.js stageFit) — a composited
       <video> layer at a sub-pixel offset is re-snapped against its rounded clip on repaints and shimmers. translate = sub-layout-px correction. */
    let snapX = 0, snapY = 0;
    function snapPos(s) {
      const dpr = window.devicePixelRatio || 1, r = frameEl.getBoundingClientRect(); if (!r.width) return;
      const nx = snapX + (Math.round(r.left * dpr) / dpr - r.left) / s, ny = snapY + (Math.round(r.top * dpr) / dpr - r.top) / s;
      if (Math.abs(nx - snapX) < 1e-3 && Math.abs(ny - snapY) < 1e-3) return;
      snapX = nx; snapY = ny; frameEl.style.translate = nx.toFixed(3) + 'px ' + ny.toFixed(3) + 'px';
    }
    let fsOn = false, railW = 0;
    function layout() {
      if (!alive) return;
      if (fsOn) { // fullscreen: 16:9 letter-boxed in the screen, the control bar under the picture (overlaid only when the screen is too short)
        const W = root.clientWidth || window.innerWidth, H = root.clientHeight || window.innerHeight; if (!W || !H) return;
        const ch = 84; let bw = W, bh = Math.round(W * 9 / 16), over = false;
        if (bh + ch > H) { bh = Math.max(120, H - ch); bw = Math.min(W, Math.round(bh * 16 / 9)); bh = Math.round(bw * 9 / 16); if (bh + ch > H) over = true; }
        root.classList.toggle('overlay', over);
        setSt(root, '--ctlh', ch + 'px');
        setSt(box, 'width', bw + 'px'); setSt(box, 'height', bh + 'px');
        setSt(frameEl, 'width', bw + 'px'); setSt(frameEl, 'height', (over ? bh : bh + ch) + 'px');
        setSt(box, '--vh', (bh / 100) + 'px'); setSt(frameEl, '--vh', (bh / 100) + 'px');
        if (snapX || snapY) { snapX = snapY = 0; frameEl.style.translate = ''; }
        railW = 0; paintThumb(true);
        return;
      }
      railW = 0;
      if (page) {
        let W = root.clientWidth; if (!W) return;
        /* OWNER R3 «رعشة»: (1) the control-bar height comes from the AVAILABLE width, not from the result W (old: W → ch → avail → W, a 1-px
           rounding flip of ch could re-layout on every ResizeObserver tick); (2) v8 fixed stage: bar 84 layout px so the 76-px buttons/segments sit
           INSIDE it (they overflowed a 63–66 bar onto the picture); box/bar sizes and the frame's top-left are snapped to whole device px. */
        const s8 = BQ.fixedStage && BQ.fixedStage() ? BQ.stageScale() : 0;
        /* FIX12 C-16: buttons ≥ 64 VISUAL px at every stage scale (iPad portrait 820×1180 scale ≈ .68 → 76 layout px were ≈ 52 px):
           tap = max(76, 66 ÷ scale) layout px; the bar is tap + 8 (constant for a given window size — no jitter loop). */
        const tap = s8 ? Math.max(76, Math.ceil(66 / s8)) : 0;
        if (s8) setSt(root, '--vp-tap', tap + 'px');
        const ch = s8 ? tap + 8 /* TX-1: constant in the fixed stage (was 64 ÷ scale + 8 → the bar and the picture changed size with the window) */ : Math.round(Math.max(62, Math.min(66, W * 0.065))); // v8: ≥ the in-stage touch size (--bq8-glass64) + 8
        // v0-10: الإطار ثابت الارتفاع ⇒ يُحدّ عرض المشغّل بما يتّسع له ارتفاع المسرح (مع النقاط والزرّ تحته) فلا تمرير ولا قصّ
        const stg = root.closest('.elp-stage');
        if (stg && stg.clientHeight) {
          const cs = getComputedStyle(stg), padV = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
          let other = 0; for (const k of stg.children) { if (!k.contains(root) && k.offsetParent !== null && getComputedStyle(k).position !== 'absolute') other += k.offsetHeight + 20; }
          const avail = stg.clientHeight - padV - other - ch - 4; // شريط التحكّم وحده: «أَكْمِلْ» فوق الصورة (v0-12)
          if (avail > 160) W = Math.min(W, Math.floor(avail * 16 / 9));
        }
        let bw = W, bh = Math.round(W * 9 / 16), cb = ch;
        if (s8) { const dpr = window.devicePixelRatio || 1, px = (v) => Math.round(v * s8 * dpr) / (s8 * dpr); bw = px(W); bh = px(W * 9 / 16); cb = px(ch); }
        root.classList.remove('overlay');
        setSt(root, '--ctlh', cb + 'px');
        setSt(box, 'width', bw + 'px'); setSt(box, 'height', bh + 'px');
        setSt(frameEl, 'width', bw + 'px'); setSt(frameEl, 'height', (bh + cb) + 'px');
        setSt(box, '--vh', (bh / 100) + 'px'); setSt(frameEl, '--vh', (bh / 100) + 'px');
        if (s8) snapPos(s8);
        paintThumb(true);
        return;
      }
      const W = root.clientWidth, H = root.clientHeight; if (!W || !H) return;
      const ch = Math.round(Math.max(44, Math.min(58, H * 0.1)));
      let bw, bh, over;
      if (W * 9 / 16 + ch <= H) { bw = W; bh = Math.round(W * 9 / 16); over = false; }
      else { bw = Math.min(W, Math.round(H * 16 / 9)); bh = Math.round(bw * 9 / 16); over = true; }
      root.classList.toggle('overlay', over);
      root.style.setProperty('--ctlh', ch + 'px');
      box.style.width = bw + 'px'; box.style.height = bh + 'px';
      frameEl.style.width = (over ? W : bw) + 'px'; frameEl.style.height = (over ? bh : bh + ch) + 'px';
      box.style.setProperty('--vh', (bh / 100) + 'px'); frameEl.style.setProperty('--vh', (bh / 100) + 'px');
      placeCap(); paintThumb(true);
    }
    function placeCap() {
      if (!cap || !alive || page) return;
      const fr = ctx.frame.getBoundingClientRect(), br = box.getBoundingClientRect(); if (!br.width) return;
      const ch = parseFloat(root.style.getPropertyValue('--ctlh')) || 48, over = root.classList.contains('overlay');
      cap.style.insetInline = 'auto';
      cap.style.left = Math.round(br.left - fr.left + br.width * 0.08) + 'px';
      cap.style.right = Math.round(fr.right - br.right + br.width * 0.08) + 'px';
      if (capTop) { cap.style.bottom = 'auto'; cap.style.top = Math.round(br.top - fr.top + 8) + 'px'; }
      else { cap.style.top = 'auto'; cap.style.bottom = Math.round(fr.bottom - br.bottom + (over ? ch + 8 : 8)) + 'px'; }
      cap.style.fontSize = Math.round(Math.max(14, Math.min(24, br.height * 0.055))) + 'px';
    }
    const ro = window.ResizeObserver ? new ResizeObserver(layout) : null;
    if (ro) { ro.observe(root); const stg0 = root.closest('.elp-stage'); if (stg0) ro.observe(stg0); } else window.addEventListener('resize', layout); // the stage too: its height (instruction row) moves the frame
    requestAnimationFrame(layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (alive) layout(); });
    document.addEventListener('bq-stagefit', layout); // v8: the stage scale/position changed without a layout-size change → re-snap
    const wake = () => { root.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => root.classList.add('idle'), 2800); };
    box.addEventListener('pointermove', wake); box.addEventListener('pointerdown', wake); ctl.addEventListener('focusin', wake); wake();
    root.addEventListener('keydown', (e) => { if (e.key === ' ' && e.target === root) { e.preventDefault(); toggle(); } });

    /* ---------- اللمس (v0-12): نقرة على الصورة = تشغيل/إيقاف، وسحب على شريط المشاهد = تقديم/إرجاع ---------- */
    let idleAtDown = false;
    box.addEventListener('pointerdown', () => { idleAtDown = root.classList.contains('overlay') && root.classList.contains('idle'); }, true);
    box.addEventListener('click', (e) => {
      if (!alive || fell || inCue || hold || !cues) return;
      if (e.target.closest('button, .vp-inv, .vp-pick, .v7-eq-layer, .v5-end')) return;
      if (idleAtDown) { wake(); return; } // الطبقة كانت مخفيّة: النقرة الأولى تُظهر الأزرار فقط
      toggle();
    });
    function seekTo(t, resume) {
      if (!cues || fell) return;
      const D = video.duration || cues.duration || 0; t = Math.max(0, Math.min(D - 0.05, t));
      clearCue();
      cues.cues.forEach((c) => { if (c.t >= t - 0.02) handled.delete(c.id); });
      ended = false; root.classList.remove('is-ended');
      try { video.currentTime = t; } catch (err) {}
      lastT = t; paint(t);
      if (resume) { userPaused = false; video.play().catch(() => setPaused(true)); } else if (video.paused) userPaused = true;
      syncUi();
    }
    /* v8: one continuous bar — a tap anywhere seeks there, a drag scrubs (picture follows on release); keys ← → ±5 s, Home / End */
    const dur = () => video.duration || (cues && cues.duration) || 0;
    (function scrub() {
      let drag = null;
      const rail = segWrap.firstChild;
      const frac = (x) => { const r = rail.getBoundingClientRect(); return Math.max(0, Math.min(1, (r.right - x) / (r.width || 1))); }; // RTL: البداية يميناً
      const at = (x) => frac(x) * dur();
      segWrap.style.touchAction = 'none';
      segWrap.addEventListener('pointerdown', (e) => {
        if (!cues || fell || hold || e.button > 0) return;
        e.preventDefault();
        drag = { id: e.pointerId, x: e.clientX, moved: false, wasPlaying: (!video.paused || !!inCue) && !ended };
        try { segWrap.setPointerCapture(e.pointerId); } catch (err) {}
        root.classList.add('is-scrub'); paint(at(e.clientX)); wake();
      });
      segWrap.addEventListener('pointermove', (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        if (!drag.moved && Math.abs(e.clientX - drag.x) < 6) return;
        if (!drag.moved) { drag.moved = true; video.pause(); }
        paint(at(e.clientX)); wake();
      });
      const end = (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag; drag = null; root.classList.remove('is-scrub');
        e.preventDefault(); seekTo(at(e.clientX), d.wasPlaying);
      };
      segWrap.addEventListener('pointerup', end);
      segWrap.addEventListener('pointercancel', (e) => { if (drag && e.pointerId === drag.id) { drag = null; root.classList.remove('is-scrub'); paint(video.currentTime || 0); } });
      segWrap.addEventListener('keydown', (e) => {
        if (!cues || fell || hold) return;
        const t = video.currentTime || 0, D = dur();
        const k = { ArrowLeft: t + 5, ArrowRight: t - 5, ArrowUp: t + 5, ArrowDown: t - 5, Home: 0, End: D - 0.1, PageUp: t + 15, PageDown: t - 15 }[e.key];
        if (k == null) return;
        e.preventDefault(); e.stopPropagation(); seekTo(k, !video.paused || !!inCue); wake();
      });
    })();

    /* ---------- النصّ المصاحب داخل المشغّل (CC) ---------- */
    function capText(id) {
      const L = BQ.line(id); let t = L && L.t;
      if (!t && cues && cues.lines) { const l = cues.lines.find((x) => x.id === id); t = l && l.text; }
      if (!t || (L && (L.sp === 'مؤثّر' || L.sp === 'واجهة'))) return '';
      if (typeof window.BQ_NS === 'function') t = window.BQ_NS(t); // FIX-10: display form (no final sukun, no «!», full tashkeel) — also for the WebVTT track
      return t.replace(/⏸\S*/g, ' ').replace(/\s*[(\[][^)\]]*[)\]]/g, '').replace(/\s{2,}/g, ' ').trim();
    }
    function showCap(id) {
      const t = id ? capText(id) : '';
      if (ccEl.textContent !== t) ccEl.textContent = t;
      ccEl.hidden = !t || !ccOn() || hold || !!inCue;
    }
    function setCc(on) {
      BQ.state.vcc = !!on;
      try { sessionStorage.setItem('bq_vcc', on ? '1' : '0'); } catch (e) { /* */ }
      if (ccBtn) ccBtn.setAttribute('aria-pressed', String(!!on));
      root.classList.toggle('cc-off', !on);
      showCap(capId); syncTrack(); wake();
    }

    /* ---------- ملء الشاشة ---------- */
    const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;
    function toggleFs() {
      wake();
      try {
        if (fsEl() === root) { const x = document.exitFullscreen || document.webkitExitFullscreen; if (x) { const p = x.call(document); if (p && p.catch) p.catch(() => {}); } return; }
        if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) { video.webkitExitFullscreen(); return; }
        const rq = (document.fullscreenEnabled || document.webkitFullscreenEnabled) && (root.requestFullscreen || root.webkitRequestFullscreen);
        if (rq) { const p = rq.call(root); if (p && p.catch) p.catch(() => nativeFs()); return; }
        nativeFs();
      } catch (e) { nativeFs(); }
    }
    /* iPhone / older iPadOS: only the <video> can go fullscreen (native player) → the captions ride along as a WebVTT text track */
    let track = null;
    function nativeFs() {
      if (typeof video.webkitEnterFullscreen !== 'function') return;
      try { video.webkitEnterFullscreen(); } catch (e) { /* not allowed now */ }
    }
    function vttTrack() {
      if (track || !cues || !(cues.lines || []).length) return;
      const ts = (s) => { s = Math.max(0, s); const hh = Math.floor(s / 3600), mm = Math.floor(s / 60) % 60, ss = (s % 60).toFixed(3); return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':' + ss.padStart(6, '0'); };
      const body = cues.lines.map((l, i) => { const t = capText(l.id); return t ? (i + 1) + '\n' + ts(l.t) + ' --> ' + ts(l.end + 0.15) + '\n' + t + '\n' : ''; }).filter(Boolean).join('\n');
      if (!body) return;
      try {
        track = h('track', { kind: 'captions', srclang: 'ar', label: 'العربية', src: 'data:text/vtt;charset=utf-8,' + encodeURIComponent('WEBVTT\n\n' + body) });
        video.append(track);
        const hide = () => { try { if (video.textTracks[0]) video.textTracks[0].mode = 'hidden'; } catch (e) { /* */ } };
        hide(); track.addEventListener('load', hide);
      } catch (e) { track = null; }
    }
    function syncTrack() { try { const tt = video.textTracks && video.textTracks[0]; if (tt) tt.mode = video.webkitDisplayingFullscreen && ccOn() ? 'showing' : 'hidden'; } catch (e) { /* */ } }
    video.addEventListener('webkitbeginfullscreen', syncTrack);
    video.addEventListener('durationchange', () => { if (isFinite(video.duration)) segWrap.setAttribute('aria-valuemax', String(Math.round(video.duration))); });
    video.addEventListener('webkitendfullscreen', () => { syncTrack(); setTimeout(() => { if (!alive) return; if (video.paused && !userPaused && !ended && !hold && !inCue) { userPaused = true; syncUi(); } }, 50); });
    function onFsChange() {
      const on = fsEl() === root;
      if (on === fsOn) return;
      fsOn = on; root.classList.toggle('is-fs', on);
      fsBtn.innerHTML = on ? FS_OUT : FS_IN;
      const lbl = on ? 'اُخْرُج مِن مِلْءِ الشّاشَةِ' : 'مِلْءُ الشّاشَةِ';
      fsBtn.setAttribute('aria-label', lbl); fsBtn.title = lbl;
      layout(); requestAnimationFrame(layout); setTimeout(layout, 350); setTimeout(layout, 900); wake(); // + after the browser's fullscreen animation
    }
    document.addEventListener('fullscreenchange', onFsChange); document.addEventListener('webkitfullscreenchange', onFsChange);

    /* ---------- البديل التلقائي: مشغّل المشاهد ---------- */
    function fallback(why) {
      if (fell || !alive) return;
      fell = true;
      try { console.info('[BQ.video.mp4] ' + o.id + ' → scene player (' + why + ')'); } catch (e) {}
      teardown();
      root.remove();
      // لا عودة إلى الرسوم المقصوصة (قرار المالك): ملصق المقطع ورسالة، و«تابِعْ» للمعلّم
      impl = posterFail(stage, ctx, o, why);
      impl.done.then((v) => resolveDone(v));
    }

    /* ---------- المشاهد وشريط التقدّم ---------- */
    let scenes = [];
    const segs = [];
    const stripBtns = [];
    function sceneIdx(t) { t = t == null ? video.currentTime : t; let i = 0; scenes.forEach((s, j) => { if (t >= s.t - 0.05) i = j; }); return i; }
    function buildScenes() {
      scenes = (cues.scenes || [{ t: 0, title: '' }]).map((s, i, a) => Object.assign({}, s, { end: i + 1 < a.length ? a[i + 1].t : cues.duration }));
      /* v8: chapters stay internal (↻ «أعد المشهد», the teacher's strip); the child's bar is ONE continuous track — no cuts, no ✋ marks */
      segWrap.setAttribute('aria-valuemax', String(Math.round(dur())));
      if (ccBtn) ccBtn.hidden = !(cues.lines || []).some((l) => l && capText(l.id));
      vttTrack();
      const adultP = ctx.frame && (ctx.frame.querySelector('.elp-adult-body') || ctx.frame.querySelector('.bq-adult'));
      if (adultP) {
        const strip = h('div.vp-strip');
        scenes.forEach((sc, i) => { const b = h('button', { type: 'button', onclick: () => goto(i), title: sc.title }, h('img', { src: SRC(sc.thumb || 'ROOM-M_r01'), alt: '' }), h('span', null, AR(i + 1) + ' · ' + (sc.title || ''))); stripBtns.push(b); strip.append(b); });
        const p1 = h('p', null, h('b', null, 'شريط المشاهد:'), ' اِخْتَر مَشْهَدًا لِإِعَادَتِهِ.' /* FIX13 R13-B-07 (DRAFT) */);
        adultP.append(p1, strip); adultNodes.push(p1, strip);
        if (o.adultExtra) { const x = o.adultExtra(); if (x) { adultP.append(x); adultNodes.push(x); } }
      }
    }
    /* only what changed is written (old: every frame rewrote 7 widths, toggled classes, aria-current and REPLACED the «n / 7» text node → the
       control row was re-laid-out 60×/s inside the video frame). Progress = transform scaleX (compositor only). */
    let pCur = -1, pEnd = null, pF = -1, pSec = -1;
    function paint(t) {
      const cur = sceneIdx(t);
      if (cur !== pCur || ended !== pEnd) { pCur = cur; pEnd = ended; stripBtns.forEach((b, j) => b.classList.toggle('cur', j === cur)); }
      const D = dur(), f = ended ? 1 : D ? Math.max(0, Math.min(1, t / D)) : 0;
      const q = Math.round(f * 2000) / 2000;
      if (q !== pF) { pF = q; fill.style.transform = 'scaleX(' + q + ')'; paintThumb(); }
      const sec = Math.round(f * D);
      if (sec !== pSec) { pSec = sec; segWrap.setAttribute('aria-valuenow', String(sec)); segWrap.setAttribute('aria-valuetext', AR(Math.floor(sec / 60)) + ':' + AR(String(sec % 60).padStart(2, '0'))); }
    }
    /* the thumb rides on the rail with a transform only (rail width cached; re-measured after every layout) */
    function paintThumb(force) {
      if (force || !railW) railW = segWrap.firstChild.offsetWidth || 0;
      const x = -Math.max(0, pF) * railW;
      const v = 'translateX(' + x.toFixed(2) + 'px)';
      if (thumb.style.transform !== v) thumb.style.transform = v;
    }
    function captions(t) {
      if (!o.captions || !cues.lines) return;
      let id = null, top = false;
      if (!inCue && !hold) for (const l of cues.lines) if (t >= l.t && t <= l.end + 0.15) { id = l.id; top = !!l.capTop; }
      if (top !== capTop) { capTop = top; root.classList.toggle('cc-top', top); }
      if (id !== capId) { capId = id; showCap(id); }
    }

    /* ---------- الساعة ---------- */
    function tick() {
      if (!alive || fell) return;
      const t = video.currentTime || 0;
      if (!video.paused && !inCue && t >= lastT && t - lastT < 0.6) seen.add(Math.floor(t));
      if (t < lastT - 0.3) cues.cues.forEach((c) => { if (c.t >= t - 0.02) handled.delete(c.id); });
      if (!inCue && !video.paused && !ended) {
        for (const c of cues.cues) if (!handled.has(c.id) && t >= c.t - 0.04 && t < c.resume) { runCue(c); break; }
      }
      lastT = t;
      if (!root.classList.contains('is-scrub')) paint(t);
      captions(t);
      raf = requestAnimationFrame(tick);
    }

    /* انتظار يحترم الإيقاف المؤقّت وتبدّل المشهد */
    let gen = 0;
    function wait(ms) {
      const g = gen;
      return new Promise((res, rej) => {
        let left = ms, last = performance.now();
        const step = () => {
          if (!alive || g !== gen) { rej(CANCEL); return; }
          const now = performance.now(); if (!userPaused) left -= now - last; last = now;
          if (left <= 0) res(); else setTimeout(step, Math.min(60, left));
        };
        step();
      });
    }
    const guard = (p) => { const g = gen; return p.then((v) => { if (!alive || g !== gen) throw CANCEL; return v; }); };

    async function runCue(c) {
      inCue = c; handled.add(c.id);
      video.pause();
      try { if (Math.abs(video.currentTime - c.t) > 0.08 && canSeek(c.t)) video.currentTime = c.t; } catch (e) {}
      showCap(null); capId = null;
      dim.classList.toggle('soft', c.kind === 'phrase'); dim.classList.add('on');
      const lay = h('div.vp-inv.vp-inv-' + c.kind); ui.append(lay);
      const age = BQ.state.age || '4-6';
      try {
        if (c.kind === 'say' || c.kind === 'what' || c.kind === 'where') {
          lay.append(h('div.vp-badge', { role: 'img', 'aria-label': c.kind === 'where' ? 'أَيْنَ؟' : c.kind === 'say' ? 'قُل' : 'ما؟', html: SV[c.kind] }));
          await wait(c.ms || BQ.silence(c.kind === 'say' ? 'say' : 'invite'));
        } else if (c.kind === 'phrase') {
          lay.append(h('div.vp-banner', { lang: 'ar' }, c.text || 'سَمِعْتُ الْفَرْقَ.' /* FIX13 R13-B-06 (DRAFT) */));
          await wait(c.ms || BQ.silence('say'));
        }
        // v0-12 r3 (المالك: «المقطع مقطع» و«الرموز غير مفهومة»): وقفات judge/stop لا تعرض طبقة أسئلة ولا رموزاً — يُكمل المقطع؛ يوقفه المعلّم إن شاء.
      } catch (e) { if (e !== CANCEL) console.error(e); lay.remove(); return; }
      lay.remove(); dim.classList.remove('on');
      inCue = null;
      // تخطّي السكتة المصيَّرة في الملفّ (الوقفة الحيّة بديلها) — إن لم يكن الخادم يدعم القفز يُكمل الفيديو عبرها
      if (canSeek(c.resume)) { try { video.currentTime = c.resume; } catch (e) {} lastT = c.resume; }
      if (!userPaused) video.play().catch(() => setPaused(true));
    }
    function clearCue() { gen++; inCue = null; ui.replaceChildren(); below.replaceChildren(); dim.classList.remove('on'); }
    function canSeek(t) { try { const r = video.seekable; for (let i = 0; i < r.length; i++) if (t >= r.start(i) && t <= r.end(i)) return true; } catch (e) {} return false; }

    /* ---------- التشغيل والإيقاف ---------- */
    function setPaused(v) {
      if (hold && !v) return; // a checkpoint question is open: the video stays on its frame
      userPaused = v;
      if (v) video.pause(); else if (!inCue) video.play().catch(() => { userPaused = true; syncUi(); });
      syncUi(); wake();
    }
    function syncUi() {
      const p = userPaused && !ended;
      root.classList.toggle('is-paused', p);
      ppBtn.replaceChildren(BQ.icon(ended ? 'replay' : p ? 'play' : 'pause'));
      ppBtn.setAttribute('aria-label', ended ? 'أَعِدِ المَقْطَعَ' : p ? 'تَشْغيل' : 'إيقاف مؤقّت');
      big.replaceChildren(BQ.icon(ended ? 'replay' : 'play'));
      big.setAttribute('aria-label', ended ? 'أَعِدِ المَقْطَعَ' : 'تَشْغيل');
    }
    function toggle() { if (fell) return impl && impl.toggle(); if (hold) return; if (ended) { goto(0); return; } setPaused(!userPaused); }
    function goto(i) {
      if (fell) return impl && impl.goto(i);
      if (!cues || hold) return;
      clearCue();
      const sc = scenes[Math.max(0, Math.min(scenes.length - 1, i))];
      const t = sc ? sc.t : 0;
      cues.cues.forEach((c) => { if (c.t >= t - 0.02) handled.delete(c.id); });
      ended = false; root.classList.remove('is-ended');
      try { video.currentTime = t; } catch (e) {}
      lastT = t; userPaused = false; syncUi();
      video.play().catch(() => setPaused(true));
    }

    video.addEventListener('ended', () => {
      if (!alive || fell) return;
      ended = true; root.classList.add('is-ended'); clearCue(); showCap(null); capId = null;
      if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) try { video.webkitExitFullscreen(); } catch (e) { /* */ } // native (iPhone) fullscreen: back to the page for the end row / question
      syncUi(); paint(video.duration || cues.duration);
      if (!o.requireFull || watched() >= 0.85) resolveDone(true);
      else if (o.onPartial) o.onPartial(watched());
    });
    video.addEventListener('error', () => fallback('video error'));
    video.addEventListener('loadeddata', () => {
      clearTimeout(loadT);
      if (!started && alive && !fell) { started = true; if (video.paused) video.play().catch(() => setPaused(true)); }
    });
    // مهلة التحميل: تُمدَّد ما دامت البيانات تصل؛ البديل فقط عند الخطأ أو التوقّف أكثر من ٢٠ ث (T20)
    const arm = () => { clearTimeout(loadT); if (!started) loadT = setTimeout(() => { if (!started) fallback('stalled'); }, 20000); };
    ['loadstart', 'progress', 'loadedmetadata', 'suspend'].forEach((ev) => video.addEventListener(ev, arm));
    video.addEventListener('pause', () => { if (!inCue && !hold && !ended && !video.seeking && alive && !fell && started && !userPaused && video.currentTime < (video.duration || 1e9) - 0.05) { userPaused = true; syncUi(); } });
    video.addEventListener('play', () => { if (hold) { video.pause(); return; } if (userPaused) { userPaused = false; syncUi(); } });
    /* checkpoint hold (video7 questions): on → pause on this frame, hide captions + controls (CSS .is-hold), block play/seek/tap;
       off(resume) → controls/captions back and, if it was playing, the video continues from the same frame */
    function setHold(on, resume) {
      if (fell) return;
      on = !!on; if (on === hold) return;
      hold = on; root.classList.toggle('is-hold', hold);
      if (hold) {
        try { video.pause(); } catch (e) {} showCap(null); capId = null; wake();
        if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) try { video.webkitExitFullscreen(); } catch (e) { /* */ }
        else if (fsOn && !(BQ.fixedStage && BQ.fixedStage())) toggleFs(); // v7 theme: the question layer sits outside the player → leave fullscreen
      }
      else { syncUi(); wake(); if (resume && !ended && !userPaused) video.play().catch(() => setPaused(true)); }
    }

    /* ---------- التحميل: ملفّ الوقفات ثم الفيديو ---------- */
    arm();
    // المصدر والتشغيل داخل لمسة «ابْدَأْ» نفسها (iOS/iPadOS لا يسمح بالتشغيل بعد انتظار شبكيّ — T10)؛ الوقفات تُحمَّل بالتوازي
    video.src = o.src || (base + '.mp4'); // v7: o.src = نسخة 720p للشاشات الصغيرة/الشبكات البطيئة (R3-F10)
    if (o.autoplay !== false) { try { const pp = video.play(); if (pp && pp.catch) pp.catch(() => {}); } catch (e) {} }
    /* FIX12 C-18: the cues file is retried up to 2× (short backoff 400 / 1200 ms) — a single 503 used to drop captions + checkpoints */
    const cuesGet = (n) => fetch(base + '.cues.json').then((r) => { if (!r.ok) throw new Error('cues ' + r.status); return r.json(); })
      .catch((err) => (n < 2 && alive && !fell ? new Promise((res) => setTimeout(res, n ? 1200 : 400)).then(() => cuesGet(n + 1)) : Promise.reject(err)));
    (o.noCuesFile ? Promise.reject(new Error('no cues file')) : cuesGet(0)).then((j) => {
      if (!alive || fell) return;
      cues = j; cues.cues = (cues.cues || []).slice().sort((a, b) => a.t - b.t);
      // v5: أسطر المقطع بنصّها في ملفّ الوقفات (أسطر جديدة لم تدخل البيانات بعد) ⇒ نصّ مصاحب لها أيضاً
      (cues.lines || []).forEach((l) => { if (l && l.id && l.text && !BQ.line(l.id)) BQ.D.lines[l.id] = { sp: ({ HAB: 'حبيبة', SAY: 'سيف', MAJ: 'ماجد', BRQ: 'بارق' })[l.sp] || l.sp || '', t: l.text }; });
      /* FIX-10 (owner «ضيف الـ CC في الفيديو اللي بدون CC»): song videos — the SUNG lyrics (cues.karaoke: text + window, no LINES id) are
         captions too. They join cues.lines with a local id ('~k<n>', never an audio id); each window ends before the next sung line starts. */
      if (Array.isArray(cues.karaoke) && cues.karaoke.length) {
        const kar = cues.karaoke.filter((k) => k && k.text && isFinite(k.t)).sort((a, b) => a.t - b.t);
        const kl = kar.map((k, i) => ({ id: '~k' + i, t: k.t, end: Math.min(isFinite(k.end) ? k.end : k.t + 2.5, i + 1 < kar.length ? kar[i + 1].t - 0.16 : Infinity), text: k.text, sung: true }));
        cues.lines = (cues.lines || []).filter((l) => l && !l.sung).concat(kl).sort((a, b) => a.t - b.t);
      }
      if (o.handMarks !== false && !cues.marks) cues.marks = (cues.cues || []).filter((c) => /^(say|hand|mark|repeat)$/.test(c.kind)).map((c) => c.t);
      if (o.noCues) cues.cues = []; // v0-12 r3: «المقطع مقطع» — بلا وقفات ولا طبقات داخل الفيديو (EL02)
      buildScenes(); paint(video.currentTime || 0);
      if (j.src && !o.src && !video.currentSrc.endsWith(j.src)) { video.src = j.src; video.load(); }
      raf = requestAnimationFrame(tick);
    }).catch((e) => {
      if (!o.cuesOptional || !alive || fell) return fallback(String(e && e.message || e));
      // v5: ملفّ الوقفات اختياريّ — مشهد واحد بطول المقطع، بلا وقفات
      const go = () => { if (!alive || fell || cues) return; cues = { duration: video.duration || 0, scenes: [{ t: 0, title: o.title || '' }], cues: [], lines: [] }; buildScenes(); paint(video.currentTime || 0); raf = requestAnimationFrame(tick); };
      if (video.readyState >= 1 && isFinite(video.duration)) go(); else video.addEventListener('loadedmetadata', go, { once: true });
    });
    // نسبة ما شوهد فعلاً (بلا السكتات المصيَّرة التي تُقفز عند الوقفات)
    function watched() {
      if (!cues) return 0;
      const D = Math.floor(cues.duration || video.duration || 1);
      let need = 0, got = 0;
      for (let k = 0; k < D; k++) { if (cues.cues.some((c) => k >= Math.ceil(c.t) && k < Math.floor(c.resume))) continue; need++; if (seen.has(k)) got++; }
      return need ? got / need : 0;
    }

    function teardown() {
      clearTimeout(loadT); clearTimeout(idleT); cancelAnimationFrame(raf); gen++;
      try { video.pause(); video.removeAttribute('src'); video.load(); } catch (e) {}
      if (ro) ro.disconnect(); else window.removeEventListener('resize', layout);
      document.removeEventListener('bq-stagefit', layout);
      adultNodes.forEach((n) => n.remove());
      showCap(null);
      document.removeEventListener('fullscreenchange', onFsChange); document.removeEventListener('webkitfullscreenchange', onFsChange);
      if (fsEl() === root) { try { const x = document.exitFullscreen || document.webkitExitFullscreen; if (x) { const p = x.call(document); if (p && p.catch) p.catch(() => {}); } } catch (e) { /* */ } }
      if (cap) ['left', 'right', 'bottom', 'top', 'fontSize', 'insetInline'].forEach((k) => { cap.style[k] = ''; });
    }
    function destroy() {
      if (fell) { if (impl) impl.destroy(); }
      if (!alive) return;
      alive = false;
      if (!fell) teardown();
    }
    ctx.onCleanup(destroy);

    return {
      get root() { return fell && impl ? impl.root : root; }, done, goto, destroy, toggle,
      pause: () => (fell ? impl && impl.pause() : setPaused(true)), play: () => (fell ? impl && impl.play() : setPaused(false)),
      get scene() { return fell && impl ? impl.scene : sceneIdx(); }, get ended() { return fell && impl ? impl.ended : ended; },
      get mode() { return fell ? 'scenes' : 'mp4'; }, video, watched: () => (fell ? 0 : watched()),
      box, hold: (on, resume) => setHold(on, resume), get held() { return hold; },
    };
  }

  /* نبضة الإيقاع للكاميرا (أنشودة) */
  if (!document.getElementById('st-video-pulse')) document.head.append(h('style', { id: 'st-video-pulse' }, '@keyframes vpPulse{0%{transform:scale(1.014)}35%{transform:scale(1)}100%{transform:scale(1)}}@media (prefers-reduced-motion: reduce){.vp-rig{animation:none!important}}'));

  /* مؤشّر الخطوات الموحّد: BQ.ui.steps من المحرّك إن وُجد، وإلا نسخة محلّية بالشكل نفسه (نقاط بلا أرقام لـ٤–٩؛ «١ / ٣» لـ١٠–١٢) */
  function steps(parent, n, opt) {
    opt = opt || {};
    if (BQ.ui && typeof BQ.ui.steps === 'function') return BQ.ui.steps(parent, n, opt);
    if (!document.getElementById('st-vsteps')) document.head.append(h('style', { id: 'st-vsteps' },
      '.bq-steps.vx-steps{align-self:center;display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:4px 14px;background:var(--white);border-radius:999px;box-shadow:0 2px 8px var(--shade);font:700 13px/1 var(--ff-display);color:var(--navy)}' +
      '.vx-steps i{width:10px;height:10px;border-radius:10px;background:var(--sky-line);transition:width .25s,background .25s}' +
      '.vx-steps i.done{background:var(--sun)}.vx-steps i.cur{width:24px;background:var(--sky)}.vx-steps span{margin-inline-start:4px}'));
    const dots = Array.from({ length: n }, () => h('i'));
    const num = h('span');
    const el = h('div.bq-steps.vx-steps', { role: 'progressbar', 'aria-valuemin': '1', 'aria-valuemax': String(n), 'aria-label': opt.label || 'الخُطُواتُ' }, ...dots, opt.label ? h('span', null, opt.label) : null, num);
    parent.append(el);
    return { el, set(i) { dots.forEach((d, j) => { d.className = j < i ? 'done' : j === i ? 'cur' : ''; }); el.setAttribute('aria-valuenow', String(i + 1)); num.textContent = BQ.state.age === '10-12' ? AR(i + 1) + ' / ' + AR(n) : ''; } };
  }

  /* السطر المثبَّت أعلى «دليل المعلّم» (القرار ٤) — يُضاف مرّة واحدة إن لم يضفه المحرّك */
  const PIN = 'قُلِ الصَّوْتَ لا اسْمَ الحَرْفِ: «مْـ» ممدودةٌ والشَّفَتانِ مُطبَقَتانِ، بلا «مِيم» وبلا حَرَكةٍ بعدَها.';
  function pinAdult(ctx) {
    const body = ctx.frame && (ctx.frame.querySelector('.elp-adult-body') || ctx.frame.querySelector('.bq-adult'));
    if (!body || /لا اسْمَ الحَرْفِ|لا اسم الحرف/.test(ctx.frame.querySelector('.elp-adult, .bq-adult').textContent)) return;
    body.prepend(h('p.pin', { style: { background: 'var(--sun-soft)', borderRadius: '12px', padding: '8px 12px', fontWeight: '600' } }, PIN));
  }
  /** عقدة نصّ للمعلّم تُلحق بالدليل (تُزال عند مغادرة العنصر تلقائياً لأنّ الإطار يُبنى من جديد) */
  function adultNote(ctx, ...kids) {
    const body = ctx.frame && (ctx.frame.querySelector('.elp-adult-body') || ctx.frame.querySelector('.bq-adult'));
    if (!body) return null;
    const n = h('div.vx-adult', null, ...kids); body.append(n); return n;
  }
  /** حارس «العنصر ما زال مفتوحاً»: ctx.alive من المحرّك إن وُجد + علم محلّيّ يُطفأ عند المغادرة */
  function liveGuard(ctx) {
    let live = true; ctx.onCleanup(() => { live = false; });
    const alive = () => live && (typeof ctx.alive !== 'function' || ctx.alive());
    const say = (id, o) => (alive() ? (typeof ctx.say === 'function' ? ctx.say(id, o) : BQ.audio.play(id, o)) : Promise.resolve());
    return { alive, say };
  }

  BQ.video = { player, mp4, CAST, voiced, camT, steps, pinAdult, adultNote, liveGuard };
})();

/* ================================================================================================
   v5 — BQ.video.element(id, o): عنصر «فيديو» نظيف (اللوحات v5 · الإطار v2 القاعدة ٥: «فيديو أو تفاعلي — لا خلط»)
   · مشغّل المقطع media/video/v5-ELxx.mp4 (+ .cues.json: المشاهد · النصّ المصاحب · مواضع ✋) بإطار المنصّة الأسود.
   · بلا مهامّ ولا أدراج ولا أسئلة داخل الفيديو، ولا يتوقّف وحده؛ المعلّم يوقفه (نقرة على الصورة · زرّ الإيقاف · مسافة).
   · عند النهاية: «التَّالِي» و«أَعِدِ المَقْطَعَ» فوق آخر لقطة، ويُعلَّم العنصر منجَزاً.
   · إلى أن يصل المقطع الجديد (غير مدرج في BQ_DATA.videos): بطاقة هادئة «قيد الإنتاج» بفنّ الغلاف و«التَّالِي» — لا مشغّل معطوب.
   · دليل المعلّم: مواضع ✋ (من البيانات) + سلسلة أحداث المقطع مطويّة + تعليم العنصر منجَزاً يدوياً.
   ================================================================================================ */
(function () {
  'use strict';
  const BQ = window.BQ; if (!BQ || !BQ.video) return;
  const h = BQ.h, V = BQ.video;
  const CSS = `
.bq-frame[data-kind="video"] .elp-stage { justify-content: center; }
.v5-ph { position: relative; width: min(100%, calc((var(--play-h, 600px) - 40px) * 16 / 9)); aspect-ratio: 16 / 9; max-height: 100%; margin-inline: auto; border-radius: var(--r-lg, 22px); overflow: hidden;
  background: var(--c-cover-bg); box-shadow: 0 14px 34px var(--shade, rgba(0, 52, 91, .12)); container-type: inline-size; }
.v5-ph > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(.75) brightness(1.04); opacity: .55; }
.v5-ph-in { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(8px, 3cqi, 18px); padding: 16px; text-align: center;
  background: radial-gradient(70% 70% at 50% 50%, rgba(255, 255, 255, .92), rgba(255, 255, 255, .55)); }
.v5-ph-tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px 7px; border-radius: 999px; background: var(--c-topbar-bg); color: var(--c-topbar-fg); font: 700 clamp(15px, 3.4cqi, 20px)/1.3 var(--ff-ui); }
.v5-ph-tag svg { width: 1.1em; height: 1.1em; }
.v5-ph-t { margin: 0; font: 700 clamp(22px, 6cqi, 40px)/1.45 var(--ff-child); color: var(--navy); }
.v5-ph-n { margin: 0; font: 500 clamp(13px, 2.6cqi, 16px)/1.6 var(--ff-ui); color: var(--muted); max-width: 40ch; }
.elp .bq-stage .v5-ph .bq-btn, .v5-ph .bq-btn { min-height: 60px; min-width: 132px; font-size: 19px; }
.v5-ph .bq-btn .bq-ic { transform: scaleX(-1); }
.v5-end { position: absolute; inset: 0; z-index: 9; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(10px, 3cqi, 22px); padding: 12px;
  background: color-mix(in srgb, var(--c-video-bg) 52%, transparent); animation: v5In .3s ease-out both; container-type: inline-size; }
.elp .bq-stage .v5-end .bq-btn, .v5-end .bq-btn { min-height: 60px; min-width: 132px; font-size: 19px; }
.v5-end .bq-btn.go .bq-ic { transform: scaleX(-1); }
.vp.v5-ended .vp-big { display: none !important; }
@keyframes v5In { from { opacity: 0; } }
.elp-adult-body details.v5-chain { margin: 8px 0; }
.elp-adult-body details.v5-chain summary { cursor: pointer; font-weight: 600; color: var(--navy); }
.elp-adult-body details.v5-chain ol { margin: 6px 0 0; padding-inline-start: 1.3em; font-size: 13.5px; line-height: 1.75; }
.elp-adult-body details.v5-chain li span { color: var(--muted); }
@media (prefers-reduced-motion: reduce) { .v5-end { animation: none; } }`;
  const CLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7v5.5l3.5 2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const has = (vid) => Array.isArray(BQ.D.videos) && BQ.D.videos.includes(vid);
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function element(id, o) {
    o = o || {};
    BQ.register(id, {
      kind: 'video',
      render(stage, ctx) {
        if (!document.getElementById('st-v5-video')) document.head.append(h('style', { id: 'st-v5-video' }, CSS));
        const meta = ctx.meta, vid = meta.video || ('v5-' + id);
        const { alive } = V.liveGuard(ctx);
        ctx.frame.dataset.kind = 'video';
        const coverSrc = meta.cover_file || ((BQ.D.covers || []).includes(id) ? 'media/cover/' + id + '.webp' : (meta.hero && BQ.hasImg(meta.hero) ? BQ.img(meta.hero) : '')); // v6: غلاف مستعار/صورة بطلة
        let finished = false, P = null;
        const next = () => { BQ.audio.unlock(); BQ.goNext(); };
        const finish = () => { if (finished || !alive()) return; finished = true; ctx.done(); };
        const nextBtn = (cls) => h('button.bq-btn' + (cls || ''), { type: 'button', onclick: next }, 'التَّالِي', BQ.icon('next'));

        /* دليل المعلّم: سلسلة أحداث المقطع (مطويّة) + تعليم منجَز */
        const chain = (meta.frames || []).length ? h('details.v5-chain', null, h('summary', null, 'ما في المقطع (سلسلة الأحداث)'),
          h('ol', { html: meta.frames.map((f) => '<li><b>' + esc(f.title) + ':</b> ' + esc(f.see) + (f.hear && f.hear !== '—' ? ' <span>— ' + esc(f.hear) + '</span>' : '') + '</li>').join('') })) : null;
        const mark = h('button.bq-btn.ghost', { type: 'button', onclick: () => { const sc = ctx.frame.querySelector('.elp-scrim'); if (sc && !sc.hidden) sc.click(); if (P) P.pause(); finish(); BQ.ui.toast('عُلِّم العنصر منجَزاً.'); } }, BQ.icon('check'), 'شاهدناه — علِّمْه منجَزاً');
        V.adultNote(ctx, chain, has(vid) ? h('p.v5-interim', null, h('b', null, 'نسخة مؤقّتة: '), 'بعض لقطات هذا المقطع صور ثابتة إلى أن تصل مقاطع الحركة؛ الصوت والتوقيت نهائيّان.') : null, h('p', null, has(vid) ? 'يُعلَّم العنصر منجَزاً حين ينتهي المقطع. إن شاهدتموه بطريقة أخرى فعلِّمه أنت:' : 'المقطع الجديد لهذا العنصر قيد الإنتاج؛ يمكنك أن تروي سلسلة الأحداث أعلاه للأطفال، ثم تعلِّمه منجَزاً:'), mark);

        if (!has(vid)) {
          /* «قيد الإنتاج»: بطاقة هادئة لا مشغّل معطوب */
          const ph = h('div.v5-ph', { role: 'region', 'aria-label': BQ.coverInfo(id).title },
            coverSrc ? h('img', { src: coverSrc, alt: '', draggable: 'false' }) : null,
            h('div.v5-ph-in', null,
              h('p.v5-ph-t', null, BQ.coverInfo(id).title),
              nextBtn()));
          stage.append(ph);
          const fit = () => { const pl = ctx.frame.querySelector('.elp-play'); if (pl) ph.style.setProperty('--play-h', stage.clientHeight + 'px'); };
          requestAnimationFrame(fit);
          return;
        }

        P = V.mp4(stage, ctx, { id: vid, aria: o.aria || ('مَقْطَعُ «' + BQ.coverInfo(id).title + '»'), captions: true, noCues: true, cuesOptional: true,
          title: meta.name, poster: coverSrc, failNext: 'التَّالِي', slow: false });
        ctx.onReplay(() => P.goto(P.scene));
        let endEl = null;
        const clearEnd = () => { if (endEl) { endEl.remove(); endEl = null; } if (P.root) P.root.classList.remove('v5-ended'); };
        const showEnd = () => {
          if (!alive() || endEl) return;
          const box = P.root && P.root.querySelector('.vp-box'); if (!box) return;
          P.root.classList.add('v5-ended');
          endEl = h('div.v5-end', { role: 'group', 'aria-label': 'انْتَهى المَقْطَعُ' },
            h('button.bq-btn.ghost', { type: 'button', onclick: () => { clearEnd(); P.goto(0); } }, BQ.icon('replay'), 'أَعِدِ المَقْطَعَ'),
            nextBtn('.go'));
          box.append(endEl);
          requestAnimationFrame(() => { const b = endEl && endEl.querySelector('.go'); if (b) try { b.focus({ preventScroll: true }); } catch (e) { /* */ } });
        };
        if (P.video) {
          P.video.addEventListener('ended', () => { finish(); showEnd(); });
          ['play', 'seeking'].forEach((ev) => P.video.addEventListener(ev, () => { if (!P.video.ended) clearEnd(); }));
        }
        P.done.then((ok) => { if (ok === false) { if (alive()) next(); return; } finish(); showEnd(); }); // تعذّر التشغيل ثم «التَّالِي» ⇒ العنصر التالي (بلا إنجاز)
      },
    });
  }
  V.element = element;
})();
