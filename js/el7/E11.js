/* E11 · تَحَقَّقْ مِنْ تَقَدُّمي — IX2 · v7 · draft_unapproved · SPEC_v7 §E11 · DECISIONS (ح) · كلّ النواتج · S1–S9
   بعده: يعرف الطفل (والمعلّم ووليّ الأمر) ما أتقنه، ويتلقّى مراجعة قصيرة موجّهة من بارق لما لم يتقنه بعد.
   خلَف «اختبر نفسك» (EL16) في الأصل: محاولة واحدة لكلّ بند · ردّ محايد واحد بعد كلّ بند (شُكْرًا / هَيّا إِلى التّالي) · لا صواب/خطأ ·
   لا رقم ولا عدد أمام الطفل · زرّ السمّاعة يعيد السؤال وأصواته فقط · ترتيب الخيارات مخلوط.
   ١٧ بنداً بالترتيب S1→S9 (S4: البند ١ إدراكيّ «أيّهما صحيحة؟» + البند ٢ «قُلْ» بحكم المعلّم/وليّ الأمر من لوحة مخفيّة: ضغط مطوَّل ١٫٥ ث على بارق).
   التسجيل (عقد المنصّة): record(S, ok, {kind:'item', item:1|2}) · بعد المراجعة بند إعادة واحد {kind:'retest'} · تدريب المراجعة {kind:'practice'} (لا يُحتسب).
   النتيجة: ٩ أيقونات بلا أسماء — المتقنة ذهبية، وعلى غيرها بارق صغير يلوّح ← مراجعات تلقائية بالترتيب (≤ ٤٠ ث لكلّ مهارة) بتلميحات كاملة ← بند إعادة محايد.
   الحكم من BQ.mastery (E11 وحده يقرّر «أتقن»).
   v8 (?theme=8 · OWNER_R3-11) — ما يُقاس لم يتغيّر (البنود والمهارات والمحاولة الواحدة كما هي)؛ تغيّر العرض فقط:
   · إعادة الاستماع: المرور بالفأرة فوق الخيار يُسمعه ثانيةً · على اللمس: ضغطة مطوّلة على الخيار أو لمس شريحة الأذن تُسمعه بلا إجابة.
   · الصور: بطاقات كبيرة بصورة الكلمة الصحيحة + شريحة أذن (للخيارات المسموعة فقط؛ القراءة S7 وS9 تبقى صامتة كما في المواصفة).
   · «أيّ فقّاعة…» (S2): بطاقات سمّاعة مرقّمة «١ ٢ ٣» تضيء وتهتزّ موجاتها حين تُسمِع صوتها.
   · «أقول الكلمة مرّتين» (S4): صورة الكلمة فوق، وتحتها بطاقتا بارق مرقّمتان «١ ٢» تتكلّم كلّ منهما حين تُسمِع قولها.
   · «قصير أم طويل؟» (S3): بطاقة الصوت فوق + بارق يقفز (نقطة قصيرة) / بارق ينزلق (شريط طويل).
   · أوّل مرّة يظهر كلّ نوع: يد صغيرة تشير إلى شرائح الأذن ثمّ تنقر الصفّ (عرض «كيف ألعب» بلا إجابة).
   v8 E11 fix (OWNER on E11 — قرار المالك يلغي «E11 المحايد»): سلّم تغذية واضح لكلّ بند:
   · ✓ علامة خضراء + توهّج + شرارات + جملة مدح متنوّعة (bq7_E11_fb_yes1–5؛ لا «شُكْرًا») · النجوم تمتلئ بالإجابات الصحيحة فقط (نجمة لكلّ ٣).
   · ✗١ علامة حمراء على الاختيار + «حاوِلْ مَرَّةً أُخْرى»… (fb_try1–3) والطفل يعيد · ✗٢ بارق يحلّ: الصواب يضيء + نموذجه المسموع + «أَكْمِلْ وَرَكِّزْ»… (fb_solve1–3).
   · السجلّ (الإتقان) = صواب المحاولة الأولى — لم يتغيّر. نقاط التقدّم في الشريط تمتلئ للصواب فقط.
   · «بأيّ حرف تبدأ؟»: صورة الكلمة فوق الخيارات، والحروف كلّها بلون واحد · «المس حرف الميم»: نصّ واحد مُشكَّل، وصندوق اللمس يُقاس على الحرف نفسه
     (Range.getClientRects)، والبطاقة تتّسع لكلّ الحركات · «وَالآنَ، وَحْدَكَ.» تُقال والبند ظاهر. */
(function () {
  'use strict';
  const ID = 'E11';
  const SK = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'];
  /* مواصفة البنود: type pic | snd | txt | img | tapword | write | say · opts[0] = الصواب (يُخلط العرض) */
  const P = (k) => ({ pic: k });
  const ITEMS = {
    S1: [{ type: 'pic', q: 'bq7_E11_s1_q', opts: ['numur', 'batta', 'kura'].map(P), announce: true },
         { type: 'pic', q: 'bq7_E11_s1_q', opts: ['qamis', 'farasha', 'fil'].map(P), announce: true }],
    S2: [{ type: 'snd', q: 'bq7_E11_s2_q', opts: ['مَ', 'بَ', 'فَ'], announce: true },
         { type: 'snd', q: 'bq7_E11_s2_q', opts: ['مُ', 'نُ', 'بُ'], announce: true }],
    S3: [{ type: 'img', q: 'bq7_E11_s3_q1', stim: 'bq7_S_muu', opts: ['glide', 'hop'] },
         { type: 'snd', q: 'bq7_E11_s3_q2', opts: ['ما', 'مَ'], announce: true }],
    S4: [{ type: 'brq', q: 'bq7_E05_puppet_intro', opts: ['bq7_E11_brq_miftah_ok', 'bq7_E11_brq_miftah_bad'] },
         { type: 'say', q: 'bq7_E11_s4_q2' }],
    S5: [{ type: 'txt', q: 'bq7_E11_s5_q1', stim: 'bq7_S_mi', opts: ['مِ', 'فِ', 'بِ'] },
         { type: 'txt', q: 'bq7_E11_s5_q2', opts: ['م', 'ب', 'ف'], pic: 'musht' }],
    S6: [{ type: 'tapword', q: 'bq7_E11_s6_q1', word: 'qamis', pic: 'qamis' },
         { type: 'form', q: 'bq7_E11_s6_q2', before: 'فَـ', word: 'fam', opts: ['ـم', 'مـ', 'ـمـ'], pic: 'fam' }],
    S7: [{ type: 'read', q: 'bq7_E08_read_intro', word: 'mawz', opts: ['mawz', 'qamar', 'fam'].map(P) },
         { type: 'read', q: 'bq7_E08_read_intro', word: 'miftah', opts: ['miftah', 'musht', 'maktab'].map(P) }],
    S8: [{ type: 'write', q: 'bq7_E11_s8_q1', form: 'iso' },
         { type: 'write', q: 'bq7_E11_s8_q2', form: 'med', before: 'قَـ', after: 'ـرْ', word: 'قَمَرْ', pic: 'qamar' }],
    S9: [{ type: 'pic', q: 'bq7_E11_s9_q1', opts: ['musht', 'miftah', 'manju'].map(P) },
         { type: 'pic', q: 'bq7_E11_s9_q2', opts: ['miftah', 'musht', 'mawz'].map(P) }],
  };
  /* المراجعة التكيّفية (SPEC: بارق يعيد · بندان تدريبيان · بند إعادة محايد) */
  const REVIEW = {
    S1: { teach: [{ line: 'bq7_E11_r_s1' }, { line: 'bq7_W_maktab_seg', pic: 'maktab' }, { line: 'bq7_W_musht_seg', pic: 'musht' }, { line: 'bq7_W_miftah_seg', pic: 'miftah' }],
      practice: [{ type: 'pic', q: 'bq7_E03_intro', opts: ['miftah', 'fil'].map(P), announce: true }, { type: 'pic', q: 'bq7_E03_intro', opts: ['numur', 'batta'].map(P), announce: true }],
      retest: { type: 'pic', q: 'bq7_E11_s1_q', opts: ['musht', 'kura', 'bab'].map(P), announce: true } },
    S2: { teach: [{ line: 'bq7_E11_r_s2' }, { line: 'bq7_S_pair_mb', snd: ['مَ', 'بَ'] }, { line: 'bq7_S_pair_mf', snd: ['مَ', 'فَ'] }],
      practice: [{ type: 'snd', q: 'bq7_E11_s2_q', opts: ['مِ', 'بِ'], announce: true }, { type: 'snd', q: 'bq7_E11_s2_q', opts: ['مُ', 'فُ'], announce: true }],
      retest: { type: 'snd', q: 'bq7_E11_s2_q', opts: ['ما', 'با', 'فا'], announce: true } }, // كلّها طويلة، تختلف في الصامت وحده (R1b N4)
    S3: { teach: [{ line: 'bq7_E11_r_s3', hopglide: true }, { line: 'bq7_S_pair_a', hopglide: true }, { line: 'bq7_S_pair_i', hopglide: true }, { line: 'bq7_S_pair_u', hopglide: true }],
      practice: [{ type: 'img', q: 'bq7_E05_q_len', stim: 'bq7_S_mii', opts: ['glide', 'hop'] }, { type: 'img', q: 'bq7_E05_q_len', stim: 'bq7_S_mi', opts: ['hop', 'glide'] }],
      retest: { type: 'img', q: 'bq7_E11_s3_q1', stim: 'bq7_S_maa', opts: ['glide', 'hop'] } },
    S4: { teach: [{ line: 'bq7_E11_r_s4', mouth: 'mouth_closed' }, { line: 'bq7_G_hint_lips', mouth: 'mouth_a' }, { line: 'bq7_S_chain_short', mouth: 'mouth_a', turn: true }, { line: 'bq7_S_chain_long', mouth: 'mouth_u', turn: true }],
      practice: [],
      retest: { type: 'brq', q: 'bq7_E05_puppet_intro', opts: ['bq7_E11_brq_qamis_ok', 'bq7_E11_brq_qamis_bad'] } },
    S5: { teach: [{ line: 'bq7_E11_r_s5', glyph: 'م' }],
      practice: [{ type: 'txt', q: 'bq7_G_listen_choose', stim: 'bq7_S_ma', opts: ['مَ', 'بَ', 'فَ'] }, { type: 'txt', q: 'bq7_G_listen_choose', stim: 'bq7_S_muu', opts: ['مو', 'بو', 'فو'] }], // تختلف في الصامت وحده (R1b N4)
      retest: { type: 'txt', q: 'bq7_E11_s5_q1', stim: 'bq7_S_mii', opts: ['مي', 'في', 'بي'] } },
    S6: { teach: [{ line: 'bq7_E11_r_s6', words: ['maktab', 'numur', 'qalam'] }],
      practice: [{ type: 'tapword', q: 'bq7_E08_b_intro', word: 'mawz', say: true }, { type: 'tapword', q: 'bq7_E08_b_intro', word: 'qalam', say: true }],
      retest: { type: 'tapword', q: 'bq7_E11_retest', word: 'qamar', say: true } },
    S7: { teach: [{ line: 'bq7_E11_r_s7', chain: ['مَ', 'ما', 'مانْجو'] }],
      practice: [{ type: 'read', q: 'bq7_E08_read_intro', word: 'musht', opts: ['musht', 'miftah', 'maktab'].map(P) }, { type: 'read', q: 'bq7_E08_read_intro', word: 'qamar', opts: ['qamar', 'fam', 'qalam'].map(P) }],
      retest: { type: 'read', q: 'bq7_E08_read_intro', word: 'maktab', opts: ['maktab', 'musht', 'miftah'].map(P) } },
    S8: { teach: [{ line: 'bq7_E11_r_s8' }],
      practice: [{ type: 'trace', q: 'bq7_E09_trace' }, { type: 'trace', q: 'bq7_E09_trace' }],
      retest: { type: 'write', q: 'bq7_E11_s8_q1', form: 'iso' } },
    S9: { teach: [{ line: 'bq7_E11_r_s9' }, { line: 'bq7_E04_mean_musht', ctxImg: 'ctx_musht' }, { line: 'bq7_E04_mean_miftah', ctxImg: 'ctx_miftah' }, { line: 'bq7_E04_mean_manju', ctxImg: 'ctx_manju' }],
      practice: [{ type: 'pic', q: 'bq7_E11_r9_q1', opts: ['manju', 'maktab', 'qamis'].map(P) }],
      retest: { type: 'pic', q: 'bq7_E11_r9_q2', opts: ['maktab', 'numur', 'mawz'].map(P) } },
  };
  const LBL = { S1: 'تمييز صوت م', S2: 'تمييز م عن أصوات أخرى', S3: 'التمييز بين مَ وما', S4: 'نطق م', S5: 'ربط الصوت بالحرف', S6: 'تمييز موقع الحرف', S7: 'قراءة كلمات', S8: 'كتابة الحرف', S9: 'استخدام المفردة' };
  const SND_COL = ['#00AEED', '#E4553F', '#3DBB6B', '#8E6CD9'];
  /* v8 E11 fix (OWNER on E11): feedback ladder lines — ✓ praise (rotates, never «شكراً») · ✗1 «حاول مرة أخرى» · ✗2 Bariq solves + «أكمل وركّز» */
  const FB = {
    yes: ['bq7_E11_fb_yes1', 'bq7_E11_fb_yes2', 'bq7_E11_fb_yes3', 'bq7_E11_fb_yes4', 'bq7_E11_fb_yes5'],
    try: ['bq7_E11_fb_try1', 'bq7_E11_fb_try2', 'bq7_E11_fb_try3'],
    solve: ['bq7_E11_fb_solve1', 'bq7_E11_fb_solve2', 'bq7_E11_fb_solve3'],
  };
  const STAR_EVERY = 3; // one HUD star per 3 correct answers (5 stars) — stars fill ONLY on correct answers
  const MARK_OK = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#22C27A" stroke="#fff" stroke-width="4"/><path d="M13 25l8 8 15-17" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const MARK_NO = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#E53935" stroke="#fff" stroke-width="4"/><path d="M16 16l16 16M32 16 16 32" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>';

  const CSS = `
.e11 { justify-content: flex-start; }
.e11-top { display: flex; justify-content: center; }
.e11-body { flex: 1 1 auto; min-height: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(10px, 2.6cqi, 24px); }
.e11-opts { display: flex; direction: rtl; flex-wrap: wrap; justify-content: center; align-items: center; gap: clamp(12px, 3cqi, 30px); }
.e11-opt { position: relative; cursor: pointer; padding: 0; border: 0; background: none; transition: transform .15s, box-shadow .2s, opacity .3s; }
.e11-opt:active { transform: scale(.96); }
.e11-card { --s: min(clamp(96px, 23cqi, 210px), calc(var(--H, 600px) * .32)); width: var(--s); aspect-ratio: 1; border-radius: 24px; border: 5px solid #fff; overflow: hidden; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 12px 24px var(--shade); }
.e11-card .x7-pic { border-radius: 19px; }
.e11-snd { width: clamp(96px, 18cqi, 140px); aspect-ratio: 1; border-radius: 50%; color: #fff; display: grid; place-items: center; box-shadow: 0 7px 0 rgba(0,0,0,.18), 0 12px 22px var(--shade); background: radial-gradient(circle at 34% 30%, rgba(255,255,255,.55), transparent 42%), var(--c, #00AEED); }
.e11-snd .x7-ic { width: 46%; height: 46%; }
.e11-snd[data-c="1"] { --c: #E4553F; } .e11-snd[data-c="2"] { --c: #3DBB6B; } .e11-snd[data-c="3"] { --c: #8E6CD9; }
.e11-txt { min-width: clamp(96px, 17cqi, 150px); min-height: clamp(96px, 17cqi, 150px); padding: 0 16px 12px; border-radius: 24px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 6px 0 #E2C98A; display: inline-flex; align-items: center; justify-content: center; }
.e11-txt .x7-w { font-size: clamp(52px, 11cqi, 96px); line-height: 1.35; color: var(--navy); }
.e11-imgopt { width: min(clamp(110px, 24cqi, 220px), calc(var(--H, 600px) * .34)); aspect-ratio: 1; border-radius: 26px; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 12px 24px var(--shade); overflow: hidden; display: grid; place-items: center; }
.e11-imgopt img { width: 92%; height: 92%; object-fit: contain; }
.e11-opt.is-play { box-shadow: 0 0 0 6px var(--sun), 0 0 26px var(--sun) !important; transform: scale(1.05); }
.e11-opt.is-pick { box-shadow: 0 0 0 6px var(--sky), 0 12px 24px var(--shade) !important; }
.e11-opts.is-locked .e11-opt:not(.is-pick) { opacity: .55; }
.e11-opt.is-ok { box-shadow: 0 0 0 6px var(--ok, #1B7F53), 0 12px 24px var(--shade) !important; }
.e11-opt.is-dim { opacity: .4; filter: saturate(.4); }
.e11-opt.is-glow { box-shadow: 0 0 0 6px var(--sun), 0 0 30px var(--sun) !important; }
.e11-word { font-size: clamp(54px, 12cqi, 110px); padding: 0 24px 12px; border-radius: 24px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 6px 0 #E2C98A; }
.e11-tw { position: relative; display: inline-block; direction: rtl; padding: 10px 30px 14px; cursor: pointer; border-radius: 24px; background: #FFFDF2; border: 3px solid #E9D7A6; box-shadow: 0 6px 0 #E2C98A; }
.e11-twword { display: block; font: 700 clamp(60px, 13cqi, 116px)/1.25 var(--ff-child); color: var(--navy); white-space: nowrap; pointer-events: none; }
.e11-form { display: flex; direction: rtl; align-items: center; gap: 6px; }
.e11-form .x7-w { font-size: clamp(60px, 13cqi, 116px); }
.e11-blank { width: clamp(70px, 13cqi, 110px); height: clamp(84px, 14cqi, 120px); border-radius: 18px; border: 3px dashed #9CC9E6; background: rgba(255,255,255,.8); display: grid; place-items: center; }
.e11-blank .x7-w { color: var(--coral); }
.e11-brqs .e11-opt { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.e11-brqbtn { width: clamp(110px, 20cqi, 170px); aspect-ratio: 1; border-radius: 28px; background: #fff; box-shadow: 0 6px 0 var(--sky-line), 0 12px 24px var(--shade); display: grid; place-items: center; position: relative; }
.e11-brqbtn .bq-brq { width: 82%; height: 82%; }
.e11-brqbtn .bq-brq img { width: 100%; height: 100%; object-fit: contain; }
.e11-brqbtn .e11-n { position: absolute; top: 8px; inset-inline-end: 8px; width: 34px; height: 34px; border-radius: 50%; background: var(--sky); color: #fff; display: grid; place-items: center; }
.e11-brqbtn .e11-n .x7-ic { width: 20px; height: 20px; }
.e11-say { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.e11-saybrq { width: clamp(130px, 24cqi, 220px); aspect-ratio: 1; touch-action: none; -webkit-user-select: none; user-select: none; border-radius: 50%; }
.e11-saybrq .bq-brq, .e11-saybrq .bq-brq img { width: 100%; height: 100%; object-fit: contain; }
.e11-saybrq.is-hold { box-shadow: 0 0 0 6px rgba(0,52,91,.15); }
.e11-chain { display: flex; direction: rtl; gap: 12px; flex-wrap: wrap; justify-content: center; }
.e11-chain .x7-w { font-size: clamp(44px, 9cqi, 80px); padding: 0 14px 8px; border-radius: 18px; background: #FFFDF2; box-shadow: 0 5px 0 #E2C98A; }
.e11-chain .is-lit { box-shadow: 0 0 0 5px var(--sun), 0 0 22px var(--sun); }
.e11-judge { position: absolute; z-index: 20; inset-inline: 0; top: 8px; margin: auto; width: max-content; display: flex; gap: 10px; padding: 10px 14px; border-radius: 22px; background: var(--navy); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
.e11-judge button { min-width: 64px; min-height: 64px; border: 0; border-radius: 16px; background: #fff; display: grid; place-items: center; cursor: pointer; padding: 6px; }
.e11-judge button .x7-ic { width: 40px; height: 40px; }
.e11-judge button[aria-pressed="true"] { box-shadow: 0 0 0 4px var(--sun); }
.e11-res { display: grid; grid-template-columns: repeat(3, auto); gap: clamp(10px, 2.6cqi, 22px); justify-content: center; }
.e11-ri { position: relative; width: min(clamp(80px, 14cqi, 124px), calc(var(--H, 600px) * .2)); aspect-ratio: 1; border-radius: 26px; background: #fff; box-shadow: 0 5px 0 var(--sky-line), 0 10px 20px var(--shade); display: grid; place-items: center; transition: box-shadow .4s, background .4s; }
.e11-ri img.ic { width: 74%; height: 74%; object-fit: contain; filter: saturate(.55); opacity: .8; transition: filter .4s, opacity .4s; }
.e11-ri.is-gold { background: radial-gradient(circle at 50% 40%, #FFF6C4, #FBE65B); box-shadow: 0 0 0 4px var(--sun), 0 0 26px rgba(254,186,2,.65); }
.e11-ri.is-gold img.ic { filter: none; opacity: 1; }
.e11-ri.is-cur { box-shadow: 0 0 0 5px var(--sky), 0 10px 20px var(--shade); }
.e11-ri .e11-wave { position: absolute; bottom: -12px; inset-inline-start: -12px; width: 52%; aspect-ratio: 1; }
.e11-ri .e11-wave img { width: 100%; height: 100%; object-fit: contain; }
.e11-ri .e11-glyph { position: absolute; left: 31%; top: 47%; transform: translate(-50%, -50%); font: 700 clamp(14px, 2.6cqi, 24px)/1 var(--ff-child); color: var(--coral); padding-bottom: .2em; }
.e11-teach { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.e11-teach .e11-big { font: 700 clamp(90px, 20cqi, 170px)/1 var(--ff-child); color: var(--coral); padding-bottom: 20px; }
.e11-ctx { width: min(clamp(160px, 44cqi, 420px), calc(var(--H, 600px) * .7 * 16 / 9)); aspect-ratio: 16/9; border-radius: 22px; overflow: hidden; border: 5px solid #fff; box-shadow: 0 10px 22px var(--shade); }
.e11-mouth { width: min(clamp(160px, 40cqi, 380px), calc(var(--H, 600px) * .6 * 16 / 9)); aspect-ratio: 16/9; border-radius: 22px; overflow: hidden; border: 5px solid #fff; box-shadow: 0 10px 22px var(--shade); }
.e11-ctx img, .e11-mouth img { width: 100%; height: 100%; object-fit: cover; }
.e11 .x7-wp { --wp-h: calc(var(--H, 600px) - 150px); width: min(100%, calc((var(--H, 600px) - 150px) * var(--wp-ar, 1))); }
.e11-go { min-width: 96px; min-height: 96px; border-radius: 50%; padding: 0; }
.e11-go .x7-ic { width: 44px; height: 44px; }
.e11.is-short .x7-buddy { display: none; }
.e11.is-short .e11-top { position: absolute; top: 2px; inset-inline-end: 168px; z-index: 2; }
.e11.is-short .e11-body { padding-top: 34px; }
.e11.is-short .e11-say { flex-direction: row; gap: 12px; }
.e11.is-short .e11-saybrq { width: 104px; }
.e11.is-short .e11-chain { flex-wrap: nowrap; gap: 6px; }
.e11.is-short .e11-chain .x7-w { font-size: 34px; padding: 0 8px 4px; }
.e11.is-short .e11-word { font-size: 56px; min-height: 80px; } .e11.is-short .e11-twword { font-size: 56px; }
.e11.is-short .e11-teach { flex-direction: row; }
.e11.is-short .e11-teach .e11-big { font-size: 90px; }
.e11.is-short .e11-snd, .e11.is-short .e11-txt { width: 88px; min-width: 88px; min-height: 88px; }
.e11.is-short .e11-txt .x7-w { font-size: 48px; }
.e11-card > .e11-mark, .e11-imgopt > .e11-mark { top: 6px; inset-inline-start: 6px; width: 42px; height: 42px; } /* v7 cards clip their overflow */
@container stage (max-width: 520px) { .e11-res { gap: 10px; } .e11-snd { width: 92px; } .e11-twword { font-size: 72px; } }
@media (prefers-reduced-motion: reduce) { .e11-opt, .e11-ri { transition: none; } .e11-mark, .e11-shake { animation: none !important; } }
`;
  const CSS8 = `
.x7p.e11 { gap: calc(var(--u)*18); }
.x7p.e11 .e11-top { display: none; }
.x7p.e11 .e11-body { flex: 1 1 auto; min-height: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: calc(var(--u)*30); }
.x7p.e11 .e11-opts { display: flex; direction: rtl; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: calc(var(--u)*46); }
.x7p.e11 .e11-opt { position: relative; cursor: pointer; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; touch-action: manipulation; }
.x7p.e11 .e11-opt:focus-visible { outline: 4px solid var(--bq8-navy); outline-offset: 6px; }
.x7p.e11 .e11-opts.is-locked .e11-opt { cursor: default; }
.x7p.e11 .e11-opt.bq8-card { width: calc(var(--u)*250); }
.x7p.e11.is-tall .e11-opts { gap: calc(var(--u)*28); }
.x7p.e11.is-tall .e11-opt.bq8-card { width: calc(var(--u)*236); }
.x7p.e11 .e11-opt.bq8-card .bq8-card__ear .bq8-btn { width: max(64px, calc(var(--u)*72)); height: max(64px, calc(var(--u)*72)); font-size: max(46px, calc(var(--u)*54)); }
/* states (one shared look for cards, tiles, speaker cards) */
.x7p.e11 .e11-opt.is-play, .x7p.e11 .e11-opt.is-say { transform: translateY(calc(var(--u)*-8)); box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-listen), var(--bq8-sh-2); }
.x7p.e11 .e11-opt.is-pick { transform: translateY(calc(var(--u)*-6)); box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-eye), var(--bq8-sh-2); }
.x7p.e11 .e11-opts.is-locked .e11-opt:not(.is-pick):not(.is-play):not(.is-say) { opacity: .62; }
.x7p.e11 .e11-opt.is-ok { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-ok), var(--bq8-sh-2); }
.x7p.e11 .e11-opt.is-dim { opacity: .4; filter: grayscale(.6); }
.x7p.e11 .e11-opt.is-glow { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-yellow), 0 0 calc(var(--u)*40) var(--bq8-yellow); }
/* numbered speaker cards (S2 sounds · S4 Bariq says it twice) */
.x7p.e11 .e11-sc { --c: var(--bq8-eye); --cl: var(--bq8-eye-l); width: calc(var(--u)*214); padding: calc(var(--u)*16) calc(var(--u)*14) calc(var(--u)*48); border-radius: calc(var(--u)*34); background: #fff;
  border: var(--bq8-line) solid var(--bq8-navy); box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-2); display: flex; flex-direction: column; align-items: center; transition: transform .16s, box-shadow .16s, opacity .2s; }
.x7p.e11 .e11-sc[data-c="1"] { --c: var(--bq8-mouth); --cl: var(--bq8-mouth-l); } .x7p.e11 .e11-sc[data-c="2"] { --c: var(--bq8-ear); --cl: var(--bq8-ear-l); }
.x7p.e11 .e11-sc[data-c="3"] { --c: var(--bq8-replay); --cl: var(--bq8-replay-l); }
.x7p.e11 .e11-num { font-family: var(--font-letter) !important; position: absolute; top: calc(var(--u)*-20); inset-inline-start: calc(var(--u)*-20); width: calc(var(--u)*62); height: calc(var(--u)*62); border-radius: 50%; display: grid; place-items: center;
  background: var(--c); color: #fff; font: 700 calc(var(--u)*38)/1 var(--font-kid); box-shadow: 0 0 0 var(--bq8-line) var(--bq8-navy), 0 0 0 calc(var(--u)*8) #fff, var(--bq8-sh-1); padding-bottom: calc(var(--u)*4); }
.x7p.e11 .e11-spk { position: relative; width: calc(var(--u)*150); height: calc(var(--u)*150); border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 38% 30%, #fff 0, var(--cl) 62%); box-shadow: inset 0 0 0 calc(var(--u)*4) var(--c); }
.x7p.e11 .e11-spk .bq8-ic { font-size: calc(var(--u)*104); }
.x7p.e11 .e11-spk .e11-brqface { width: 92%; height: 92%; object-fit: contain; }
.x7p.e11 .e11-spk .bq-brq { width: 96%; display: flow-root; }
.x7p.e11 .e11-spk::before, .x7p.e11 .e11-spk::after { content: ''; position: absolute; inset: calc(var(--u)*-6); border-radius: 50%; border: calc(var(--u)*5) solid var(--c); opacity: 0; pointer-events: none; }
.x7p.e11 .e11-opt:is(.is-play, .is-say) .e11-spk::before { animation: x7Wave 1s ease-out infinite; }
.x7p.e11 .e11-opt:is(.is-play, .is-say) .e11-spk::after { animation: x7Wave 1s .45s ease-out infinite; }
@keyframes x7Wave { 0% { transform: scale(.9); opacity: .9; } 100% { transform: scale(1.35); opacity: 0; } }
.x7p.e11 .e11-sc .bq8-card__ear { bottom: calc(var(--u)*-34); }
.x7p.e11 .e11-sc .bq8-card__ear .bq8-btn { width: max(64px, calc(var(--u)*72)); height: max(64px, calc(var(--u)*72)); font-size: max(46px, calc(var(--u)*54)); }
.x7p.e11 .e11-wordpic { width: calc(var(--u)*176); cursor: default; }
.x7p.e11 .e11-wordpic:hover { transform: none; }
/* short / long (S3) */
.x7p.e11 .e11-len { display: block; margin: calc(var(--u)*10) auto 0; height: calc(var(--u)*26); border-radius: 999px; background: var(--bq8-navy); }
.x7p.e11 .e11-len.is-short { width: calc(var(--u)*26); } .x7p.e11 .e11-len.is-long { width: 78%; }
.x7p.e11 .e11-stim { display: flex; align-items: center; gap: calc(var(--u)*18); }
/* written options & words */
.x7p.e11 .e11-opt.bq8-tile { --w: calc(var(--u)*170); --fs: .56; cursor: pointer; }
.x7p.e11 .e11-word.bq8-tile { --w: calc(var(--u)*380); --fs: .3; cursor: default; }
.x7p.e11 .e11-form { display: flex; direction: rtl; align-items: center; gap: calc(var(--u)*14); }
.x7p.e11 .e11-form .bq8-tile { --w: calc(var(--u)*170); --fs: .56; cursor: default; }
.x7p.e11 .e11-blank { width: calc(var(--u)*170); height: calc(var(--u)*170); border-radius: calc(var(--u)*24); border: calc(var(--u)*5) dashed rgba(11,45,79,.35); background: rgba(255,255,255,.7); display: grid; place-items: center; font: 700 calc(var(--u)*80)/1 var(--font-letter); color: rgba(11,45,79,.35); }
.x7p.e11 .e11-tw { position: relative; display: inline-block; direction: rtl; padding: calc(var(--u)*14) calc(var(--u)*44) calc(var(--u)*14); cursor: pointer; border-radius: calc(var(--u)*34); background: linear-gradient(#FFFDF6, #FFF2D2);
  border: var(--bq8-line) solid var(--bq8-navy); box-shadow: inset 0 calc(var(--u)*-6) 0 rgba(214,143,0,.22), 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-2); }
.x7p.e11 .e11-twword { display: block; font: 700 calc(var(--u)*130)/1 var(--font-letter); color: var(--bq8-navy); white-space: nowrap; pointer-events: none; } /* tight line box: X.fitInk adds exactly the room the harakat need */
.x7p.e11 .e11-twhit::before { border-radius: calc(var(--u)*18); }
.x7p.e11 .e11-twhit.is-pick::before { box-shadow: inset 0 0 0 calc(var(--u)*5) var(--bq8-eye); background: rgba(31,162,242,.14); }
.x7p.e11 .e11-twhit > .e11-mark { top: auto; bottom: calc(-1 * var(--mb, 0px) - var(--u)*50); inset-inline-start: auto; inset-inline-end: auto; left: 50%; right: auto; width: calc(var(--u)*56); height: calc(var(--u)*56); margin-left: calc(var(--u)*-28); }
.x7p.e11 .e11-taphint { position: absolute; z-index: 7; left: 50%; top: 50%; width: 1em; height: 1em; font-size: calc(var(--u)*96); margin: -.25em 0 0 -.35em; pointer-events: none; animation: x7Tap .45s ease 3; filter: drop-shadow(0 4px 6px rgba(0,0,0,.25)); }
.x7p.e11 .e11-wrow { display: flex; direction: rtl; align-items: center; justify-content: center; gap: calc(var(--u)*30); width: 100%; }
.x7p.e11.is-tall .e11-wrow { flex-direction: column; gap: calc(var(--u)*20); }
.x7p.e11 .e11-wrow > .e11-wp8 { flex: 1 1 0; min-width: 0; width: auto; }
.x7p.e11.is-tall .e11-wrow > .e11-wp8 { flex: none; width: 100%; }
.x7p.e11 .e11-wrow > .e11-wordpic { flex: none; }
.x7p.e11 .e11-form > .e11-wordpic { width: calc(var(--u)*170); flex: none; }
.x7p.e11 .e11-formgap { width: calc(var(--u)*30); flex: none; }
.x7p.e11 .e11-twrow, .x7p.e11.is-tall .e11-twrow { flex-direction: row; gap: calc(var(--u)*30); }
.x7p.e11 .e11-twrow > .e11-wordpic { width: calc(var(--u)*136); flex: none; }
.x7p.e11 .e11-twrow > .e11-tw { flex: none; padding-inline: calc(var(--u)*30); }
/* say (S4 item 2) */
.x7p.e11 .e11-say { display: flex; flex-direction: column; align-items: center; gap: calc(var(--u)*22); }
.x7p.e11 .e11-saybrq { width: calc(var(--u)*230); touch-action: none; -webkit-user-select: none; user-select: none; border-radius: 50%; }
.x7p.e11 .e11-saybrq .bq-brq { width: 100%; display: flow-root; }
.x7p.e11 .e11-saybrq.is-hold { box-shadow: 0 0 0 calc(var(--u)*10) rgba(11,45,79,.15); }
.x7p.e11 .e11-chain { display: flex; direction: rtl; gap: calc(var(--u)*14); flex-wrap: wrap; justify-content: center; }
.x7p.e11 .e11-chain .bq8-tile { --w: calc(var(--u)*112); --fs: .52; cursor: default; }
.x7p.e11 .e11-chain .bq8-tile--word { --w: calc(var(--u)*220); --fs: .3; }
.x7p.e11 .e11-chain .is-lit { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-yellow), var(--bq8-sh-2); }
.x7p.e11 .e11-judge { position: absolute; z-index: 20; inset-inline: 0; top: calc(var(--u)*10); margin: auto; width: max-content; display: flex; gap: 10px; padding: 10px 14px; border-radius: 22px; background: var(--bq8-navy); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
.x7p.e11 .e11-judge button { min-width: 64px; min-height: 64px; border: 0; border-radius: 16px; background: #fff; display: grid; place-items: center; cursor: pointer; padding: 6px; }
.x7p.e11 .e11-judge button .x7-ic { width: 40px; height: 40px; }
.x7p.e11 .e11-judge button[aria-pressed="true"] { box-shadow: 0 0 0 4px var(--bq8-yellow); }
/* results */
.x7p.e11 .e11-res { display: grid; grid-template-columns: repeat(3, auto); gap: calc(var(--u)*20) calc(var(--u)*30); justify-content: center; }
.x7p.e11 .e11-ri { position: relative; width: calc(var(--u)*124); aspect-ratio: 1; border-radius: calc(var(--u)*30); background: #fff; border: var(--bq8-line) solid var(--bq8-navy); box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-1); display: grid; place-items: center; transition: box-shadow .4s, background .4s; }
.x7p.e11 .e11-ri img.ic { width: 76%; height: 76%; object-fit: contain; filter: saturate(.55); opacity: .82; transition: filter .4s, opacity .4s; }
.x7p.e11 .e11-ri.is-gold { background: radial-gradient(circle at 50% 40%, #FFF6C4, #FFD54A); box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-yellow), 0 0 calc(var(--u)*26) rgba(255,194,26,.65); }
.x7p.e11 .e11-ri.is-gold img.ic { filter: none; opacity: 1; }
.x7p.e11 .e11-ri.is-cur { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) var(--bq8-eye), var(--bq8-sh-1); }
.x7p.e11 .e11-ri .e11-wave { position: absolute; bottom: calc(var(--u)*-16); inset-inline-start: calc(var(--u)*-16); width: 52%; }
.x7p.e11 .e11-ri .e11-wave .bq-brq { width: 100%; display: flow-root; }
.x7p.e11 .e11-ri .e11-glyph { position: absolute; left: 31%; top: 47%; transform: translate(-50%, -50%); font: 700 calc(var(--u)*24)/1 var(--font-letter); color: var(--bq8-meem); }
/* Bariq re-teaches */
.x7p.e11 .e11-teach { display: flex; flex-direction: column; align-items: center; gap: calc(var(--u)*18); }
.x7p.e11 .e11-teach .e11-big { font: 700 calc(var(--u)*190)/1.2 var(--font-letter); color: var(--bq8-meem); }
.x7p.e11 .e11-ctx, .x7p.e11 .e11-mouth { width: calc(var(--u)*460); aspect-ratio: 16/9; border-radius: calc(var(--u)*28); overflow: hidden; border: var(--bq8-line) solid var(--bq8-navy); box-shadow: 0 0 0 var(--bq8-rim) #fff, var(--bq8-sh-2); }
.x7p.e11 .e11-ctx img, .x7p.e11 .e11-mouth img { width: 100%; height: 100%; object-fit: cover; display: block; }
.x7p.e11 .e11-teach .e11-opts .e11-opt { cursor: default; }
.x7p.e11 .e11-go.bq8-btn { width: max(64px, calc(var(--u)*104)); height: max(64px, calc(var(--u)*104)); font-size: max(46px, calc(var(--u)*74)); }
.x7p.e11 .e11-wp8 { display: flex; justify-content: center; width: 100%; }
.x7p.e11 .x7-wp { --wp-h: calc(var(--u)*400); width: min(100%, calc(var(--u)*400 * var(--wp-ar, 1))); }
.x7p.e11.is-tall .x7-wp { --wp-h: calc(var(--u)*560); width: min(100%, calc(var(--u)*560 * var(--wp-ar, 1))); }
.bq8-stage.is-tall > .x7p.e11 { --u: calc(100cqw / 1040); }
.x7p.e11 .e11-opt.is-right, .x7p.e11 .e11-opt.is-solved { transform: translateY(calc(var(--u)*-6)); box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*12) var(--bq8-ok), 0 0 calc(var(--u)*48) rgba(34,194,122,.8) !important; opacity: 1 !important; filter: none !important; }
.x7p.e11 .e11-opt.is-no { box-shadow: 0 0 0 var(--bq8-rim) #fff, 0 0 0 calc(var(--u)*11) #E53935, var(--bq8-sh-2) !important; opacity: .82 !important; }
.x7p.e11 .e11-mark { top: calc(var(--u)*-24); inset-inline-start: calc(var(--u)*-24); width: calc(var(--u)*70); height: calc(var(--u)*70); }
.x7p.e11 .e11-sc > .e11-mark { inset-inline-start: auto; inset-inline-end: calc(var(--u)*-24); }
.x7p.e11 .bq8-tile > .e11-mark { top: calc(var(--u)*6); inset-inline-start: calc(var(--u)*6); width: calc(var(--u)*50); height: calc(var(--u)*50); }
.x7p.e11 .e11-picq { width: calc(var(--u)*200); cursor: pointer; }
.x7p.e11 .e11-plain { color: var(--bq8-navy); }
.bq8-stage .e11-flystar { width: 64px; height: 64px; }
@media (prefers-reduced-motion: reduce) { .x7p.e11 .e11-opt, .x7p.e11 .e11-ri { transition: none; } .x7p.e11 .e11-spk::before, .x7p.e11 .e11-spk::after { animation: none !important; } }
`;
  /* shared by v7 and v8: feedback ladder marks, glow, shake, flying star, measured tap-word boxes, HUD dots */
  const CSSF = `
.e11-twhit { position: absolute; padding: 0; margin: 0; border: 0; background: transparent; pointer-events: none; }
.e11-twhit::before { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; width: calc(var(--bw, 40px) + 10px); transform: translateX(-50%); border-radius: 14px; transition: background .2s, box-shadow .2s; }
.e11-twhit:focus-visible::before { outline: 4px solid var(--navy); }
.e11-twhit.is-pick::before { background: rgba(0,174,237,.16); box-shadow: inset 0 0 0 3px #00AEED; }
.e11-twhit:is(.is-right, .is-solved)::before { background: rgba(34,194,122,.18); box-shadow: inset 0 0 0 4px #22C27A, 0 0 22px rgba(34,194,122,.6); }
.e11-twhit.is-no::before { background: rgba(229,57,53,.12); box-shadow: inset 0 0 0 4px #E53935; }
.e11-twhit.is-glow::before { background: rgba(254,186,2,.3); }
/* v8 E11 fix — feedback ladder (also in v7) */
.e11-opt.is-right, .e11-opt.is-solved { box-shadow: 0 0 0 6px #22C27A, 0 0 34px rgba(34,194,122,.75) !important; opacity: 1 !important; filter: none !important; }
.e11-opt.is-no { box-shadow: 0 0 0 6px #E53935, 0 10px 20px var(--shade) !important; opacity: .8 !important; cursor: default; }
.e11-mark { position: absolute; z-index: 6; top: -18px; inset-inline-start: -18px; width: 52px; height: 52px; pointer-events: none; display: block; animation: e11Pop .4s cubic-bezier(.3,1.6,.5,1) both; }
.e11-mark svg { width: 100%; height: 100%; display: block; }
.e11-twhit > .e11-mark { top: auto; bottom: calc(-1 * var(--mb, 0px) - 38px); inset-inline-start: auto; left: 50%; right: auto; width: 44px; height: 44px; margin-left: -22px; }
.e11-wrow { display: flex; direction: rtl; align-items: center; justify-content: center; gap: 24px; width: 100%; }
.x7-wp.is-no { box-shadow: 0 0 0 6px #E53935 !important; } .x7-wp.is-solved { box-shadow: 0 0 0 6px #22C27A !important; }
.e11-picq { cursor: pointer; }
.e11-shake { animation: e11Shake .42s ease; }
@keyframes e11Shake { 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
@keyframes e11Pop { from { transform: scale(.2); opacity: 0; } }
.e11-flystar { position: fixed; z-index: 10001; width: 56px; height: 56px; transform: translate(-50%, -50%); transition: transform .65s cubic-bezier(.5,0,.3,1), opacity .65s; pointer-events: none; }
.e11-flystar svg { width: 100%; height: 100%; display: block; }
.x7-dots i.is-miss, .bq8-progress > i.is-miss { background: #fff !important; box-shadow: inset 0 0 0 3px #B9C6D6 !important; }
`;
  const NEXT_SVG = '<svg viewBox="0 0 48 48"><path d="M30 10 16 24l14 14" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function run(stage, ctx) {
    const X = BQ.ix7b, h = BQ.h, W = X.W;
    const V8 = X.v8();
    X.style('st-e11', V8 ? CSS8 : CSS);
    X.style('st-e11f', CSSF);
    X.ICON.next = NEXT_SVG;
    X.ICON.near = '<svg viewBox="0 0 48 48"><path d="M24 4l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 33.2 12.1 39.9 15 26.7l-10-9 13.4-1.4z" fill="#FFF6C4" stroke="#C98F00" stroke-width="2" stroke-linejoin="round"/><path d="M24 4l5.6 12.3 13.4 1.4-10 9 2.9 13.2L24 33.2z" fill="#FEBA02"/></svg>';
    const S = X.session(ctx);
    const root = X.root(ctx, 'e11', { panel: ['tall', 'col'], stars: 5 });
    const F8 = root._8;
    const AR = X.AR;
    const coached = new Set(); // v8 «how to play» hand: once per item type
    const top = h('div.e11-top');
    const nItems = SK.reduce((a, s) => a + ITEMS[s].length, 0);
    const dots = X.dots(top, nItems);
    const body = h('div.e11-body');
    root.append(top, body);
    // fix 2: the entrance animation (.x7-in) must not replay after a pop / shake / tap hint on the same card
    // (animation-name went x7Pop → x7In again: the card blinked out and slid back in for ≈ 0.4 s)
    ['animationend', 'animationcancel'].forEach((t) => body.addEventListener(t, (e) => { if (e.animationName === 'x7In' && e.target.classList) e.target.classList.remove('x7-in'); }));
    const buddy = X.buddy(root);
    const fitH = () => { const H = stage.clientHeight || 600; root.style.setProperty('--H', H + 'px'); root.classList.toggle('is-short', H < 420); };
    if (!V8) {
      fitH();
      if (window.ResizeObserver) { const ro = new ResizeObserver(fitH); ro.observe(stage); ctx.onCleanup(() => ro.disconnect()); }
    }
    const M = () => BQ.mastery;
    const log = {}; SK.forEach((s) => { log[s] = { items: [], practice: [], retest: null, judge: null }; });
    const clear = () => body.replaceChildren();
    const status = (s) => { try { return M() ? M().status(s) : null; } catch (e) { return null; } };
    /* ---- feedback ladder (owner on E11) ---- */
    const fbI = { yes: 0, try: 0, solve: 0 };
    const fb = (k) => FB[k][fbI[k]++ % FB[k].length];
    const res = []; // per main item: true = correct (by the child) · false = not — the HUD dots fill only for correct answers
    let nCorrect = 0, qaN = 0;
    const paintDots = (k) => {
      dots.set(k);
      const ds = dots.el ? [...dots.el.children] : [];
      ds.forEach((d, j) => { if (j < k && res[j] !== true) { d.className = 'is-miss'; } });
    };
    function mark(el, kind) {
      if (!el) return;
      el.querySelectorAll(':scope > .e11-mark').forEach((m) => m.remove());
      el.append(h('span.e11-mark.is-' + kind, { 'aria-hidden': 'true', html: kind === 'no' ? MARK_NO : MARK_OK }));
    }
    function flyStar(from, lit) {
      const target = F8 && F8.starsEl;
      if (!target || X.reduced() || !from) return Promise.resolve();
      const a = from.getBoundingClientRect(), slot = target.children[Math.max(0, Math.min(target.children.length - 1, lit - 1))] || target, b = slot.getBoundingClientRect();
      const s = h('i.e11-flystar', { 'aria-hidden': 'true', html: X.ICON.star });
      Object.assign(s.style, { left: (a.left + a.width / 2) + 'px', top: (a.top + a.height / 2) + 'px' });
      document.body.append(s);
      return new Promise((r) => {
        requestAnimationFrame(() => requestAnimationFrame(() => { s.style.transform = `translate(calc(-50% + ${b.left + b.width / 2 - a.left - a.width / 2}px), calc(-50% + ${b.top + b.height / 2 - a.top - a.height / 2}px)) scale(.6)`; s.style.opacity = '.2'; }));
        setTimeout(() => { s.remove(); r(); }, 720);
      });
    }
    /** ✓: clear green success (check + glow + sparkle) + a varied praise line · the star moves only here.
     *  credit=false (no real choice was left) → no star/progress credit (review fix: forced «retry» on 2-choice items). */
    async function praise(el, credit) {
      el.classList.remove('is-pick', 'is-glow');
      el.classList.add('is-right'); mark(el, 'ok'); X.anim(el, 'fx7-pop', 450);
      X.burst(el, 14); S.fx(X.sfx.ok, 0.5); buddy.mood('cheer', 1800);
      if (credit !== false) {
        nCorrect++;
        const lit = Math.min(5, Math.floor(nCorrect / STAR_EVERY));
        // a star flies only when a star actually lights (no star that «lands nowhere»)
        if (F8 && lit > F8.stars) flyStar(el, lit).then(() => F8.starsTo(lit));
      }
      await S.say(fb('yes'));
    }
    /** owner rule «show the word's picture when a word is asked about»: listen-only card (touch = hear the word again; never an answer) */
    function wordPicEl(key, isBusy) {
      if (!key || !W[key]) return null;
      const el = V8
        ? h('div.bq8-card.bq8-card--sm.e11-wordpic.e11-picq.x7-in', { role: 'button', tabindex: '0', 'aria-label': 'اِسْمَعِ الكَلِمَةَ' }, h('img', { src: ctx.img(W[key].img), alt: '', draggable: 'false' }))
        : h('div.e11-card.e11-picq.x7-in', { role: 'button', tabindex: '0', 'aria-label': 'اِسْمَعِ الكَلِمَةَ' }, X.pic(ctx, W[key].img));
      el.addEventListener('click', () => { if (!isBusy()) S.say(X.wordId(key), { stim: true }); });
      return el;
    }
    /** long touch on a heard choice = replay only: the card pops and a small hand taps on it («now touch to answer») */
    function tapHint(b) {
      X.anim(b, 'fx7-pop', 420);
      b.querySelectorAll(':scope > .e11-taphint').forEach((x) => x.remove());
      const hd = X.i8('touch', 'e11-taphint'); b.append(hd);
      setTimeout(() => hd.remove(), 1500);
    }
    /** ✗1: red mark on the chosen answer + a motivating line; the child tries again (that answer stays marked) */
    async function wrong1(el) {
      el.classList.remove('is-pick');
      el.classList.add('is-no'); mark(el, 'no'); X.anim(el, 'e11-shake', 420); buddy.mood('think', 1600);
      await S.say(fb('try'));
    }
    /** ✗2: the chosen answer gets the red mark, then Bariq shows the right one (highlight + model audio) + an encouraging line */
    async function solve(wrongEl, rightEl, it) {
      if (wrongEl) { wrongEl.classList.remove('is-pick'); wrongEl.classList.add('is-no'); mark(wrongEl, 'no'); X.anim(wrongEl, 'e11-shake', 420); }
      await S.sleep(450);
      if (rightEl) { rightEl.classList.add('is-solved'); mark(rightEl, 'ok'); X.anim(rightEl, 'fx7-pop', 450); }
      buddy.mood('talk', 2600);
      await evidence(it);
      await S.say(fb('solve'));
    }

    note();
    (async () => {
      // review fix: the opening line is said with item 1 already on the board (never an empty board — owner E11_g)
      buddy.mood('wave', 1800);
      let k = 0;
      for (const s of SK) {
        for (let i = 0; i < ITEMS[s].length; i++) {
          paintDots(k);
          const it = ITEMS[s][i];
          // الاسم يُقرن بصوته بعد بنود S2 وS5 (لا تلقين لجوابهما — R1b N5): قبل أوّل بند من S6
          if (s === 'S6' && i === 0) await S.say(X.NAME_SOUND);
          if (it.type === 'say') { await sayItem(it); res[k++] = null; continue; }
          const r = await runItem(it, 'neutral', k === 0 ? { lead: 'bq7_E11_intro' } : null);
          log[s].items.push(r.ok);
          X.record(ctx, s, r.ok, { kind: 'item', item: i + 1 }); // mastery = first-try correctness (unchanged)
          res[k++] = !!r.right;
          note();
          await S.sleep(350);
        }
      }
      paintDots(nItems);
      await results();
    })();

    /* ================= البنود ================= */
    /** يشغّل بنداً: mode 'neutral' (قياس: السجلّ = المحاولة الأولى؛ للطفل سلّم تغذية ✓ / ✗١ أعد / ✗٢ بارق يحلّ) · 'learn' (تدريب المراجعة) → {ok, right, tries} */
    async function runItem(it, mode, o) {
      o = o || {};
      clear();
      if (window.BQ_QA) body.dataset.qa = String(++qaN); // test hook only
      if (it.type === 'write' || it.type === 'trace') return writeItem(it, mode, o);
      const learn = mode === 'learn';
      const correctKey = optKey(it, 0);
      let opts = (it.opts || []).map((x, i) => ({ o: x, key: optKey(it, i), i }));
      opts = BQ.shuffle(opts);
      // الرأس: الكلمة المكتوبة / الشكل / صورة الكلمة
      let wrapOpts, btns = [];
      // «بأيّ حرف تبدأ؟» (owner E11_d): the word's picture sits above the letter choices; touching it says the word again (never answers)
      // (review fix: also on every tap-word and the form item — the global «word picture» rule)
      const wordPic = wordPicEl(it.pic || (it.type === 'tapword' ? it.word : null), () => asking || busy);
      // form item: the picture sits in the word row · tap-word: picture BESIDE the word card (the word gets the full height to grow)
      if (wordPic && !(V8 && it.type === 'form') && it.type !== 'tapword') body.append(wordPic);
      if (V8) {
        if (it.type === 'read') body.append(h('div.e11-word.bq8-tile.bq8-tile--word.x7-in', null, X.markMeem(W[it.word].t)));
        if (it.type === 'form') body.append(h('div.e11-form.x7-in', null, h('div.bq8-tile.bq8-tile--syll', null, X.markMeem(it.before)), h('div.e11-blank', { 'aria-hidden': 'true' }, '?'), wordPic ? h('span.e11-formgap', { 'aria-hidden': 'true' }) : null, wordPic));
        // «I say the word twice»: the picture of the word Bariq says sits above his two numbered cards
        if (it.type === 'brq') { const wk = brqWord(it); if (wk) body.append(h('div.bq8-card.bq8-card--sm.e11-wordpic.x7-in', { 'aria-hidden': 'true' }, h('img', { src: ctx.img(W[wk].img), alt: '', draggable: 'false' }))); }
        // the sound to judge (S3 short/long · S5) is a big replay sticker above the options
        if (it.stim && it.type !== 'tapword') body.append(h('div.e11-stim.x7-in', null, X.btn8('listen', { size: 'lg', label: 'اِسْمَعِ الصَّوْتَ', cls: 'e11-stimbtn', onclick: () => { if (!asking && !busy) S.say(it.stim, { stim: true }); } })));
      } else {
        if (it.type === 'read') body.append(h('div.e11-word.x7-w.x7-in', null, X.markMeem(W[it.word].t)));
        if (it.type === 'form') body.append(h('div.e11-form.x7-in', null, h('span.x7-w', null, it.before), h('div.e11-blank', null, h('span.x7-w', null, '?'))));
      }
      if (it.type === 'tapword') {
        // owner E11_e: ONE shaped text run (marks and joins exactly as typeset); the touch/highlight box of each letter is measured
        // on the glyphs themselves (Range.getClientRects per character) — never fixed offsets; the card grows to fit every haraka.
        const w = W[it.word];
        const letters = X.letters(w.t);
        const wordEl = h('span.e11-twword', { lang: 'ar', 'aria-hidden': 'true', dataset: { ink: w.t } }, w.t);
        if (V8) X.suk(wordEl);
        wrapOpts = h('div.e11-tw.x7-in', { role: 'group', 'aria-label': 'الكَلِمَةُ' }, wordEl);
        btns = letters.map((L, i) => { const b = h('button.e11-twhit', { type: 'button', 'aria-label': 'حَرْفٌ ' + X.AR(i + 1), dataset: { k: X.bare(L) === 'م' ? 'm' : 'x' + i } }); wrapOpts.append(b); return b; });
        const MIN_GAP = 64;
        const layout = () => {
          if (!wrapOpts.isConnected) return;
          wordEl.style.fontSize = '';
          let boxes;
          for (let pass = 0; pass < 6; pass++) {
            X.fitInk(wordEl, wrapOpts, { grow: true });
            boxes = X.charBoxes(wordEl, letters); // always measured AFTER the last font change (boxes match the final size)
            const cs = boxes.filter(Boolean).map((r) => (r.left + r.right) / 2).sort((a, b) => a - b);
            let gap = 1e9; for (let j = 1; j < cs.length; j++) gap = Math.min(gap, cs[j] - cs[j - 1]);
            wrapOpts.dataset.gap = isFinite(gap) ? gap.toFixed(1) : '';
            if (gap >= MIN_GAP - 0.5 || !isFinite(gap) || gap <= 0 || pass === 5) break;
            // scale the word by 64/gap, capped so the card stays inside the panel width
            const fs = parseFloat(getComputedStyle(wordEl).fontSize) || 100;
            const chrome = wrapOpts.offsetWidth - wordEl.offsetWidth;
            const row = wrapOpts.parentElement && wrapOpts.parentElement.classList.contains('e11-twrow') ? wrapOpts.parentElement : null;
            const side = row && wordPic ? wordPic.offsetWidth + (parseFloat(getComputedStyle(row).columnGap) || 0) : 0;
            // caps: the card stays inside the panel (width beside the picture; height incl. room for the ✓/✗ badge below)
            const kW = (body.clientWidth * 0.97 - side - chrome) / Math.max(1, wordEl.offsetWidth);
            const kH = (body.clientHeight - 56) / Math.max(1, wrapOpts.offsetHeight);
            const kMax = Math.max(1, Math.min(kW, kH));
            const k = Math.min((MIN_GAP / gap) * 1.03, kMax);
            if (k <= 1.002) break;
            wordEl.style.fontSize = (fs * k).toFixed(1) + 'px';
          }
          const wr = wrapOpts.getBoundingClientRect();
          // the v8 stage may be scaled (transform: scale) — client rects are screen px, style values are local CSS px
          const sx = wrapOpts.offsetWidth ? (wr.width / wrapOpts.offsetWidth) || 1 : 1;
          const bl = parseFloat(getComputedStyle(wrapOpts).borderLeftWidth) || 0, bt = parseFloat(getComputedStyle(wrapOpts).borderTopWidth) || 0;
          const wy = wordEl.getBoundingClientRect();
          // fix 2 (owner «التشكيل داخل المربع»): the letter box spans the word's real ink (harakat, dots, sukun rings) + 6 px, inside the card
          const ink = X.inkBox(wordEl), ch = wrapOpts.clientHeight;
          let iT = ink ? (ink.top - wr.top) / sx - bt - 6 : (wy.top - wr.top) / sx - bt + 4;
          let iB = ink ? (ink.bottom - wr.top) / sx - bt + 6 : (wy.bottom - wr.top) / sx - bt - 4;
          iT = Math.max(2, iT); iB = Math.min(ch - 2, Math.max(iB, iT + 64 / sx));
          btns.forEach((b, i) => {
            const r = boxes[i]; if (!r) return;
            const cx = ((r.left + r.right) / 2 - wr.left) / sx - bl, bw = (r.right - r.left) / sx, hw = Math.max(64 / sx, bw);
            const tY = iT, hY = iB - iT;
            Object.assign(b.style, { left: (cx - hw / 2) + 'px', width: hw + 'px', top: tY + 'px', height: hY + 'px' });
            b.style.setProperty('--bw', bw.toFixed(1) + 'px');
            b.style.setProperty('--mb', Math.max(0, wrapOpts.clientHeight - tY - hY).toFixed(1) + 'px'); // ✓/✗ badge goes under the card's ink area (clear of a final م tail)
            b._cx = (r.left + r.right) / 2;
          });
        };
        body.append(wordPic ? h('div.e11-wrow.e11-twrow', null, wordPic, wrapOpts) : wrapOpts);
        layout();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
        if (window.ResizeObserver) { const ro = new ResizeObserver(() => requestAnimationFrame(layout)); ro.observe(body); ctx.onCleanup(() => ro.disconnect()); }
        // the letters are narrow, joined targets: a touch anywhere on the word card goes to the nearest letter (measured centres)
        wrapOpts.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          let best = null, bd = 1e9;
          btns.forEach((b) => { const d = Math.abs(e.clientX - (b._cx != null ? b._cx : 0)); if (d < bd) { bd = d; best = b; } });
          if (best) best.click();
        });
      } else {
        wrapOpts = h('div.e11-opts' + (it.type === 'brq' ? '.e11-brqs' : ''), { role: 'group' });
        btns = opts.map((x, n) => { const b = optEl(it, x.o, n); b.dataset.k = x.key; wrapOpts.append(b); return b; });
        body.append(wrapOpts);
        if (V8) btns.forEach((b) => {
          if (b.getAttribute('role') === 'button') b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } });
          // owner R3-11: «لمّا أعمل هوفر عليها أسمع تاني» — hover (mouse) replays; touch-hold or the ear chip replays without answering
          const au = audioOf(it, b.dataset.k);
          if (au && (it.announce || it.type === 'brq')) X.replayable(b, () => replayOne(b, au), { ear: b.querySelector('.e11-ear8'), canPlay: () => !asking && !replaying && !busy, holdMs: 800, onHeld: () => { if (!busy && !asking) tapHint(b); } });
        });
        // written letters/forms: every glyph (with its harakat) must fit inside its tile
        if (it.type === 'txt' || it.type === 'form') { const fit = () => btns.forEach((b) => { const t = b.querySelector('.x7-w'); if (t) X.fitInk(t, b, { shrink: true }); }); fit(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); }
      }
      const ck = it.type === 'tapword' ? 'm' : correctKey;
      if (window.BQ_QA) wrapOpts.dataset.ck = ck; // للاختبار الآليّ فقط
      // السؤال + المثير + إسماع الخيارات بالترتيب (كلّ خيار يضيء)
      let asking = null, busy = false;
      const ask = async () => {
        if (it.q) await S.say(it.q);
        if (it.type === 'tapword' && it.say) await S.say(X.wordId(it.word), { stim: true });
        if (it.stim) await S.say(it.stim, { stim: true });
        if (it.announce || it.type === 'brq') for (const b of btns) { b.classList.add('is-play'); if (b._face) b._face.brq('talk'); await S.say(audioOf(it, b.dataset.k), { stim: true }); if (b._face) b._face.brq('idle'); b.classList.remove('is-play'); await S.sleep(180); }
      };
      wrapOpts.classList.add('is-locked');
      // owner E11_g: «وَالآنَ، وَحْدَكَ.» is said WITH the retest item on the board (never an empty board)
      if (o.lead) { ctx.instruction(X.text(o.lead), o.lead, { icon: 'ear' }); asking = S.say(o.lead); await asking; asking = null; }
      ctx.instruction(X.text(it.q), it.q, { icon: it.type === 'read' ? 'eye' : 'ear' });
      ctx.onReplay(() => { if (!asking && !busy) asking = ask().finally(() => { asking = null; }); });
      asking = ask(); await asking; asking = null;
      // v8: the first time each kind of item appears, a small hand shows «listen again here · then touch one» (no answer shown)
      const ct = it.type + (it.announce ? '+' : '');
      if (V8 && !coached.has(ct) && (it.announce || it.type === 'brq')) {
        coached.add(ct);
        asking = X.coach(S, btns.map((b) => b.querySelector('.e11-ear8')).filter(Boolean), wrapOpts); await asking; asking = null;
      }
      wrapOpts.classList.remove('is-locked');
      let tries = 0;
      return new Promise((resolve) => {
        let over = false;
        btns.forEach((b) => b.addEventListener('click', async () => {
          if (over || busy || asking || b.classList.contains('is-dim') || b.classList.contains('is-no')) return;
          if (V8 && replaying) { BQ.audio.stop(); replaying = false; b.classList.remove('is-say'); }
          busy = true; tries++;
          const live = btns.filter((x) => !x.classList.contains('is-no') && !x.classList.contains('is-dim')).length; // real choices incl. this one
          wrapOpts.classList.add('is-locked');
          b.classList.add('is-pick'); X.anim(b, 'fx7-pop', 420);
          // touching a heard option says it once more, then the answer is judged
          if (it.announce || it.type === 'brq') { b.classList.add('is-play'); if (b._face) b._face.brq('talk'); await S.say(audioOf(it, b.dataset.k), { stim: true }); if (b._face) b._face.brq('idle'); b.classList.remove('is-play'); }
          else await S.sleep(200);
          const right = btns.find((x) => x.dataset.k === ck);
          if (b.dataset.k === ck) {
            over = true;
            const credit = live >= 2;
            await praise(b, credit);
            if (learn) await evidence(it);
            resolve({ ok: tries === 1, right: credit, tries }); return;
          }
          // review fix: a first miss that leaves only ONE choice would make the «retry» forced → Bariq solves at once (no star, no green dot)
          if (tries === 1 && live - 1 <= 1) {
            over = true;
            await solve(b, right, it);
            resolve({ ok: false, right: false, tries }); return;
          }
          if (learn && btns.length > 2 && tries === 2) {
            // practice (review): second miss → the right answer glows, the child still touches it
            b.classList.remove('is-pick'); b.classList.add('is-no'); mark(b, 'no'); X.anim(b, 'e11-shake', 420);
            right.classList.add('is-glow'); await S.say(X.G.light);
          } else if (tries === 1) {
            await wrong1(b);
            const hi = learn && btns.length > 2 ? hintOf(it) : null; // content hint only (no second «try again» line)
            if (hi) await S.say(hi);
          } else {
            over = true;
            right.classList.remove('is-glow');
            await solve(b, right, it);
            resolve({ ok: false, right: false, tries }); return;
          }
          busy = false; wrapOpts.classList.remove('is-locked');
        }));
      });
    }
    let replaying = false;
    async function replayOne(b, au) {
      replaying = true; b.classList.add('is-say'); if (b._face) b._face.brq('talk');
      try { await S.say(au, { stim: true }); } finally { replaying = false; b.classList.remove('is-say'); if (b._face) b._face.brq('idle'); }
    }
    function brqWord(it) { const m = /brq_([a-z]+)_ok/.exec((it.opts || [])[0] || ''); return m && W[m[1]] ? m[1] : null; }
    function optKey(it, i) {
      const o = it.opts ? it.opts[i] : null;
      if (o == null) return '';
      return typeof o === 'string' ? o : o.pic;
    }
    function audioOf(it, key) {
      if (it.type === 'pic') return X.wordId(key);
      if (it.type === 'snd') return X.sylId(key);
      if (it.type === 'brq') return key;
      return null;
    }
    function hintOf(it) {
      if (it.type === 'pic' && it.announce) return X.G.hintStart;
      if (it.type === 'snd' || it.type === 'img') return X.G.listen;
      if (it.type === 'tapword' || it.type === 'form') return X.G.shape;
      return null; // Bariq's «حاوِلْ مَرَّةً أُخْرى!» already said it — no second try line
    }
    /** model audio for the right answer (Bariq's «solve» step; practice evidence) */
    async function evidence(it) {
      const k0 = optKey(it, 0);
      if (it.type === 'pic' && it.announce) return S.say(X.pick(ctx, [X.segId(k0), X.wordId(k0)]), { stim: true });
      if (it.type === 'pic') return S.say(X.wordId(k0), { stim: true });
      if (it.type === 'read') return S.say(X.wordId(it.word), { stim: true });
      if (it.type === 'tapword') { await S.say(X.pick(ctx, [X.segId(it.word), X.wordId(it.word)]), { stim: true }); return S.say(X.G.pos[W[it.word].pos]); }
      if (it.type === 'form' && it.word) return S.say(X.G.pos[W[it.word].pos]);
      if (it.type === 'brq') return S.say(k0, { stim: true });
      if (it.type === 'img' && it.stim) return S.say(it.stim, { stim: true });
      if (it.type === 'txt' && it.pic) return S.say(X.pick(ctx, [X.segId(it.pic), X.wordId(it.pic)]), { stim: true });
      if (it.type === 'snd' || it.type === 'txt') { const a = X.sylId(k0); return a ? S.say(a, { stim: true }) : (it.stim ? S.say(it.stim, { stim: true }) : null); }
      return null;
    }
    function optEl(it, o, n) {
      const aria = 'خِيارٌ ' + X.AR(n + 1);
      if (V8) return optEl8(it, o, n, aria);
      if (it.type === 'pic' || it.type === 'read') return h('button.e11-opt.e11-card.x7-in', { type: 'button', 'aria-label': aria }, X.pic(ctx, W[o.pic].img));
      if (it.type === 'snd') return h('button.e11-opt.e11-snd.x7-in', { type: 'button', 'aria-label': aria, dataset: { c: n % SND_COL.length } }, X.icon('speaker'));
      if (it.type === 'txt' || it.type === 'form') return h('button.e11-opt.e11-txt.x7-in', { type: 'button', 'aria-label': aria }, h('span.x7-w', null, o));
      if (it.type === 'img') return h('button.e11-opt.e11-imgopt.x7-in', { type: 'button', 'aria-label': o === 'hop' ? 'قَصيرٌ' : 'طَويلٌ' }, h('img', { src: ctx.img(o === 'hop' ? 'bariq_hop' : 'bariq_glide'), alt: '', draggable: 'false' }));
      if (it.type === 'brq') return h('button.e11-opt.x7-in', { type: 'button', 'aria-label': aria }, h('span.e11-brqbtn', null, X.brq(n ? 'think' : 'talk'), h('span.e11-n', null, X.icon('speaker'))));
      return h('button.e11-opt', { type: 'button' }, String(o));
    }

    /** v8 options. Cards are div[role=button] so the ear chip inside can be a real button. */
    function ear8() { return h('span.bq8-card__ear', null, h('button.bq8-btn.bq8-btn--sm.bq8-btn--ear.e11-ear8', { type: 'button', 'aria-label': 'اِسْمَعْ مَرَّةً أُخْرى' }, X.i8('ear'))); }
    function optEl8(it, o, n, aria) {
      const card = (cls, kids) => h('div.e11-opt.x7-in' + cls, { role: 'button', tabindex: '0', 'aria-label': aria }, kids);
      if (it.type === 'pic' || it.type === 'read') {
        const kids = [h('img', { src: ctx.img(W[o.pic].img), alt: '', draggable: 'false' })];
        if (it.type === 'pic' && it.announce) kids.push(ear8()); // only options that are heard can be heard again (S7 reading and S9 stay silent)
        return card('.bq8-card', kids);
      }
      if (it.type === 'snd') { const c = card('.e11-sc', [h('span.e11-num', { 'aria-hidden': 'true' }, AR(n + 1)), h('span.e11-spk', { 'aria-hidden': 'true' }, X.i8('listen')), ear8()]); c.dataset.c = String(n % 4); return c; }
      if (it.type === 'brq') {
        const face = X.brq(n ? 'think' : 'idle');
        const c = card('.e11-sc', [h('span.e11-num', { 'aria-hidden': 'true' }, AR(n + 1)), h('span.e11-spk', { 'aria-hidden': 'true' }, face), ear8()]);
        c.dataset.c = String(n); c._face = face;
        return c;
      }
      if (it.type === 'img') return card('.bq8-card', [h('img', { src: ctx.img(o === 'hop' ? 'bariq_hop' : 'bariq_glide'), alt: '', draggable: 'false', style: { objectFit: 'contain', background: '#EAF6FF' } }), h('span.e11-len' + (o === 'hop' ? '.is-short' : '.is-long'), { 'aria-hidden': 'true' })]);
      // owner E11_d: every letter choice in the SAME colour — the answer is never coloured
      if (it.type === 'txt' || it.type === 'form') return card('.bq8-tile.bq8-tile--syll', [h('span.x7-w.e11-plain', { lang: 'ar' }, o)]);
      return card('', [String(o)]);
    }

    /* الكتابة: قياس = محاولة واحدة بلا دليل · تدريب (trace) = سياسة E09 */
    async function writeItem(it, mode, o) {
      o = o || {};
      const learn = mode === 'learn';
      const trace = it.type === 'trace';
      const wrap = V8 ? h('div.e11-wp8.x7-in') : h('div.x7-in', { style: { display: 'flex', justifyContent: 'center', width: '100%' } });
      const wp = wordPicEl(it.pic, () => false);
      if (wp) body.append(h('div.e11-wrow', null, wp, wrap)); else body.append(wrap);
      if (!learn) {
        // check item: same ladder as the other items — ✓ praise · ✗1 red mark + try again (new empty box, start dot shown) · ✗2 Bariq writes it
        const mk = (n, model) => { wrap.replaceChildren(); return X.writePad(wrap, { form: it.form || 'iso', ctxBefore: it.before, ctxAfter: it.after, guide: model ? 'road' : 'none', arrows: !!model, start: !!model || n > 1, lenient: false, ink: model ? 'path' : 'free', oneShot: !model }); };
        let pad = mk(1);
        if (o.lead) { ctx.instruction(X.text(o.lead), o.lead, { icon: 'hand' }); await S.say(o.lead); }
        ctx.instruction(X.text(it.q), it.q, { icon: 'hand' });
        ctx.onReplay(() => S.say(it.q));
        await S.say(it.q);
        const r1 = await S.gate(pad.done);
        if (!r1.failed && !r1.assisted) { await praise(pad.el); return { ok: true, right: true, tries: 1 }; }
        await wrong1(pad.el);
        pad = mk(2); pad.showStart();
        const r2 = await S.gate(pad.done);
        if (!r2.failed && !r2.assisted) { await praise(pad.el); return { ok: false, right: true, tries: 2 }; }
        pad.el.classList.add('is-no'); mark(pad.el, 'no'); X.anim(pad.el, 'e11-shake', 420);
        await S.sleep(700);
        pad = mk(3, true); pad.lock(true); buddy.mood('talk', 3000);
        await S.say('bq7_E09_watch');
        await pad.demo(3200, true); pad.fill();
        pad.el.classList.add('is-solved'); mark(pad.el, 'ok');
        await S.say(fb('solve'));
        return { ok: false, right: false, tries: 2 };
      }
      ctx.instruction(X.text(it.q), it.q, { icon: 'hand' });
      ctx.onReplay(() => S.say(it.q));
      let fails = 0;
      const pad = X.writePad(wrap, {
        form: it.form || 'iso', ctxBefore: it.before, ctxAfter: it.after,
        guide: trace ? 'road' : 'none', arrows: trace, start: trace, lenient: trace, ink: trace ? 'path' : 'free',
        oneShot: false,
        onFail: async (reason, n) => {
          fails = n;
          if (n === 1) { pad.showStart(); buddy.mood('think', 1400); S.say('bq7_E09_retry'); }
          else if (n === 2) { pad.setGuide('bold'); pad.setArrows(true); pad.showStart(); pad.runner(true); S.say(X.G.light); }
          else { pad.runner(false); pad.lock(true); await S.say('bq7_E09_watch'); await pad.demo(3400, true); pad.fill(); }
        },
      });
      await S.say(it.q);
      const res = await S.gate(pad.done);
      pad.runner(false);
      if (!res.assisted) await praise(pad.el);
      return { ok: !res.assisted && fails <= 1, right: !res.assisted, tries: fails + 1 };
    }

    /* S4 البند ٢: «قُلْ…» — يقول الطفل؛ الحكم للمعلّم/وليّ الأمر (ضغط مطوَّل ١٫٥ ث على بارق) */
    async function sayItem(it) {
      clear();
      ctx.instruction(X.text(it.q), it.q, { icon: 'mouth' });
      ctx.onReplay(() => S.say(it.q));
      const brqWrap = h('div.e11-saybrq.x7-in', { role: 'img', 'aria-label': 'بارِق' }, X.brq('talk'));
      const chain = h('div.e11-chain', { 'aria-hidden': 'true' }, ['مَ', 'مِ', 'مُ', 'ما', 'مي', 'مو'].map((t) => (V8 ? h('span.bq8-tile.bq8-tile--syll', null, X.markMeem(t)) : h('span.x7-w', null, X.markMeem(t)))));
      const go = V8 ? h('button.bq8-btn.bq8-btn--next.e11-go', { type: 'button', 'aria-label': 'التّالي', disabled: true }, X.i8('next')) : h('button.x7-btn.e11-go', { type: 'button', 'aria-label': 'التّالي', disabled: true }, X.icon('next'));
      body.append(h('div.e11-say', null, brqWrap, chain, go));
      X.longPress(brqWrap, 1500, () => judgePanel(body));
      await S.say(it.q);
      brqWrap.firstChild.brq && brqWrap.firstChild.brq('idle');
      go.disabled = false;
      await new Promise((r) => go.addEventListener('click', r, { once: true }));
      const p = body.querySelector('.e11-judge'); if (p) p.remove();
    }
    function judgePanel(host) {
      let p = host.querySelector('.e11-judge');
      if (p) { p.remove(); return; }
      const cur = (M() && M().get && M().get().S4 && M().get().S4.judge) || null;
      const opt = [['mastered', 'star', 'أَتْقَنَ'], ['near', 'near', 'قَريبٌ'], ['notyet', 'sprout', 'لَيْسَ بَعْدُ']];
      p = h('div.e11-judge', { role: 'group', 'aria-label': 'حُكْمُ المُعَلِّمِ عَلى النُّطْقِ' },
        opt.map(([k, ic, a]) => h('button', { type: 'button', 'aria-label': a, title: a, 'aria-pressed': String(cur === k), onclick: () => { try { M().judge('S4', k); } catch (e) { /* */ } log.S4.judge = k; note(); p.remove(); } }, X.icon(ic))));
      host.append(p);
    }

    /* ================= النتيجة والمراجعة ================= */
    async function results() {
      clear();
      ctx.instruction(X.text('bq7_E11_results'), 'bq7_E11_results', { icon: 'eye' });
      ctx.onReplay(() => S.say('bq7_E11_results'));
      const grid = h('div.e11-res', { role: 'list' });
      const cells = {};
      SK.forEach((s, i) => {
        const st = status(s);
        const c = h('div.e11-ri.x7-in', { role: 'listitem', 'aria-label': st === 'mastered' ? 'أَتْقَنْتَ' : 'نَتَدَرَّبُ', style: { animationDelay: (i * 60) + 'ms' } },
          h('img.ic', { src: ctx.img('icon_' + s.toLowerCase()), alt: '', draggable: 'false' }));
        if (s === 'S5') c.append(h('span.e11-glyph', { 'aria-hidden': 'true' }, 'م'));
        cells[s] = c; grid.append(c);
      });
      body.append(grid);
      const weak = SK.filter((s) => status(s) !== 'mastered');
      const paint = () => SK.forEach((s) => {
        const c = cells[s]; const st = status(s);
        c.classList.toggle('is-gold', st === 'mastered');
        const wv = c.querySelector('.e11-wave');
        if (st !== 'mastered' && !wv) c.append(h('span.e11-wave', null, X.brq('wave')));
        if (st === 'mastered' && wv) wv.remove();
      });
      await S.sleep(500);
      paint();
      await S.say('bq7_E11_results');
      if (!weak.length) { buddy.mood('cheer', 4000); await S.say('bq7_E11_all'); return finish(true); }
      await S.say('bq7_E11_some');
      const follow = [];
      for (const s of weak) {
        await review(s, grid, cells);
        if (log[s].retest === false) follow.push(s);
        clear(); body.append(grid); paint();
        await S.sleep(500);
      }
      buddy.mood('cheer', 3000);
      await S.say('bq7_E11_review_done');
      if (follow.length) await S.say('bq7_E11_followup');
      finish(SK.every((s) => status(s) === 'mastered'));
    }
    async function review(s, grid, cells) {
      const R = REVIEW[s];
      SK.forEach((x) => cells[x].classList.toggle('is-cur', x === s));
      clear();
      // بارق يعيد
      const box = h('div.e11-teach.x7-in');
      body.append(box);
      buddy.mood('talk', 1500);
      for (const t of R.teach) {
        box.replaceChildren();
        if (t.pic) box.append(V8 ? h('div.bq8-card.e11-wordpic.bq8-pop', null, h('img', { src: ctx.img(W[t.pic].img), alt: '' })) : h('div.e11-card', null, X.pic(ctx, W[t.pic].img)));
        if (t.ctxImg) box.append(h('div.e11-ctx', null, h('img', { src: ctx.img(t.ctxImg), alt: '', draggable: 'false' })));
        if (t.mouth) box.append(h('div.e11-mouth', null, h('img', { src: ctx.img(t.mouth), alt: '', draggable: 'false' })));
        if (t.glyph) box.append(h('div.e11-big', { 'aria-hidden': 'true' }, t.glyph));
        if (V8) {
          if (t.hopglide) box.append(h('div.e11-opts', null, ['hop', 'glide'].map((o) => h('div.e11-opt.bq8-card', null, h('img', { src: ctx.img('bariq_' + o), alt: '', style: { objectFit: 'contain', background: '#EAF6FF' } }), h('span.e11-len' + (o === 'hop' ? '.is-short' : '.is-long'))))));
          if (t.snd) box.append(h('div.e11-opts', null, t.snd.map((x, i) => h('div.e11-opt.e11-sc', { dataset: { c: String(i) } }, h('span.e11-num', null, AR(i + 1)), h('span.e11-spk', null, X.i8('listen'))))));
          if (t.words) box.append(h('div.e11-chain', null, t.words.map((w) => h('span.bq8-tile.bq8-tile--word.is-lit', null, X.markMeem(W[w].t)))));
          if (t.chain) { const ch = h('div.e11-chain', null, t.chain.map((w) => h('span.bq8-tile' + (w.length > 3 ? '.bq8-tile--word' : '.bq8-tile--syll'), null, X.markMeem(w)))); box.append(ch); [...ch.children].forEach((c, i) => setTimeout(() => c.classList.add('is-lit'), 500 + i * 700)); }
        } else {
        if (t.hopglide) box.append(h('div.e11-opts', null, h('span.e11-imgopt', null, h('img', { src: ctx.img('bariq_hop'), alt: '' })), h('span.e11-imgopt', null, h('img', { src: ctx.img('bariq_glide'), alt: '' }))));
        if (t.snd) box.append(h('div.e11-opts', null, t.snd.map((x, i) => h('span.e11-snd', { dataset: { c: i } }, X.icon('speaker')))));
        if (t.words) box.append(h('div.e11-chain', null, t.words.map((w) => h('span.x7-w.is-lit', null, X.markMeem(W[w].t)))));
        if (t.chain) { const ch = h('div.e11-chain', null, t.chain.map((w) => h('span.x7-w', null, X.markMeem(w)))); box.append(ch); [...ch.children].forEach((c, i) => setTimeout(() => c.classList.add('is-lit'), 500 + i * 700)); }
        }
        ctx.instruction(X.text(t.line), t.line, { icon: 'ear' });
        await S.say(t.line, { stim: /^bq7_(W|S)_/.test(t.line) });
        if (t.turn) { await S.say('bq7_G_your_turn'); await S.sleep(2600); }
        await S.sleep(250);
      }
      // تدريب (تعلّميّ — لا يُحتسب)
      for (const p of R.practice) {
        const r = await runItem(p, 'learn');
        log[s].practice.push(r.ok);
        X.record(ctx, s, r.ok, { kind: 'practice' });
        await S.sleep(400);
      }
      // بند الإعادة: «وَالآنَ، وَحْدَكَ.» يُقال والبند ظاهر على اللوح (لا لوح فارغ — owner E11_g)
      const r = await runItem(R.retest, 'neutral', { lead: 'bq7_E11_retest' });
      log[s].retest = r.ok;
      X.record(ctx, s, r.ok, { kind: 'retest' });
      note();
      await S.sleep(350);
    }
    async function finish(all) {
      ctx.done();
      note();
      X.end(ctx, S, { title: all ? 'أَحْسَنْتَ!' : 'تَعَلَّمْتَ كَثيرًا!' });
    }

    /* ================= دليل المعلّم: النتيجة لكلّ مهارة ================= */
    function note() {
      const esc = X.esc;
      const g = (M() && M().get) ? M().get() : {};
      const mark = (v) => (v === true ? '✔' : v === false ? '✗' : '—');
      const rows = SK.map((s) => {
        const L = log[s], st = g[s] || {};
        return '<tr><td><b>' + s + '</b> ' + esc(LBL[s]) + '</td><td>' + (L.items.map(mark).join(' ') || '—') + '</td><td>' + (L.retest == null ? '—' : mark(L.retest)) + '</td><td>' + esc(st.status_ar || '') + '</td></tr>';
      }).join('');
      const node = h('div', null,
        h('div', { html: '<p><b>التحقّق:</b> يُحتسب للإتقان صواب <b>المحاولة الأولى</b> فقط. يرى الطفل التغذية: ✓ مدح وعلامة خضراء · ✗ أولى علامة حمراء و«حاول مرة أخرى» · ✗ ثانية يُظهر بارق الإجابة ويشجّعه. لا تساعده أثناء البنود. بعدها نتيجة بالأيقونات ومراجعة قصيرة من بارق لما لم يُتقَن ثم بند إعادة واحد.</p>' +
          '<p><b>النطق (S4):</b> بعد «قُلْ: مَ، مِ، مُ، ما، مي، مو» احكم أنت: اضغط مطوّلاً (١٫٥ ث) على بارق في شاشة البند، أو من هنا:</p>' }),
        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '6px 0 10px' } },
          [['mastered', 'أتقن'], ['near', 'قريب'], ['notyet', 'ليس بعد']].map(([k, a]) => h('button', { type: 'button', class: 'bq-btn ghost', 'aria-pressed': String((g.S4 && g.S4.judge) === k), onclick: () => { try { M().judge('S4', k); } catch (e) { /* */ } log.S4.judge = k; note(); } }, a))),
        h('div', { html: '<table class="x7-log"><thead><tr><th>المهارة</th><th>البندان</th><th>الإعادة</th><th>الحالة</th></tr></thead><tbody>' + rows + '</tbody></table>' +
          '<p><a href="#mastery">افتح «دليل الإتقان ودور الأسرة» (قابل للطباعة)</a></p>' }));
      X.note(ctx, node);
    }
  }

  BQ.register(ID, {
    render(stage, ctx) {
      BQ.loadScript('js/el7/ix7b.js').then(() => { if (ctx.alive()) run(stage, ctx); })
        .catch((e) => { console.warn('[E11] ' + e.message); if (ctx.placeholder) ctx.placeholder(); });
    },
  });
})();
