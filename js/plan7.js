/* plan7.js — «خطة الدرس ودليل المعلّم» لـ v7 (L1-01-d1 · صوت الميم) — draft_unapproved
   من BQ_DATA (build_data_v7.py): ١٦ عنصراً E01–E16 · نواتج الفريق التسع · مهارات دليل الإتقان S1–S9 · دور وليّ الأمر ·
   دليل المعلّم لكلّ عنصر (guide_v7.json إن وصل، وإلا نصّ الـPLAN). الخطاب للمعلّم؛ لا شيء هنا يظهر على شاشة الطفل. */
(function () {
  'use strict';
  const D = window.BQ_DATA || {};
  const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ELS = (D.elements || []).slice().sort((a, b) => a.menu - b.menu);
  const SK = {}; (D.skills || []).forEach((s) => { SK[s.id] = s; });
  const CSS = `
.lp7 .lp7-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--lp-line);border-radius:var(--lp-radius);margin:10px 0 6px}
.lp7 table{width:100%;border-collapse:collapse;font-size:14.5px;line-height:1.6;min-width:640px}
.lp7 th,.lp7 td{padding:9px 10px;border-bottom:1px solid var(--lp-line);text-align:start;vertical-align:top}
.lp7 thead th{background:var(--lp-soft);color:var(--lp-ink);font-weight:700;position:sticky;top:0}
.lp7 tbody tr:last-child>*{border-bottom:0}
.lp7 .lp7-n{color:var(--lp-blue);font-weight:700;width:2.5em}
.lp7 .lp7-el{font-family:var(--ff-child);font-weight:700;font-size:17px;color:var(--lp-ink);white-space:nowrap}
.lp7 .lp7-mx td,.lp7 .lp7-mx th{text-align:center;padding:7px 6px}
.lp7 .lp7-mx th.lp7-oh{text-align:start;font-weight:600;min-width:240px}
.lp7 .lp7-dot{display:inline-block;width:18px;height:18px;border-radius:50%;background:var(--c-status-done)}
.lp7 .lp7-open{min-height:44px;min-width:44px;padding:6px 14px;border-radius:22px;border:2px solid var(--lp-ink);background:var(--c-page-bg);color:var(--lp-ink);font-weight:700}
.lp7 .lp7-open:hover{background:var(--lp-ink);color:var(--c-topbar-fg)}
.lp7 .lp7-list{margin:0;padding-inline-start:1.6em;list-style:arabic-indic}
.lp7 .lp7-list li{margin:4px 0}
.lp7 details.lp7-gd{border:1px solid var(--lp-line);border-radius:12px;margin:8px 0;background:var(--c-page-bg)}
.lp7 details.lp7-gd>summary{cursor:pointer;min-height:48px;display:flex;align-items:center;gap:10px;padding:8px 14px;font-weight:700;color:var(--lp-ink)}
.lp7 details.lp7-gd>div{padding:0 16px 12px;font-size:14.5px}
.lp7 details.lp7-gd .lbl{margin:10px 0 2px;font-weight:700;color:var(--lp-ink);font-size:13.5px}
.lp7 details.lp7-gd .goal{background:var(--lp-soft);padding:8px 12px;border-radius:10px}
.lp7 .gd-src{font-size:12.5px;color:var(--lp-muted)}
.lp7 .lp7-kpi{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0 14px;padding:0;list-style:none}
.lp7 .lp7-kpi li{background:var(--lp-soft);border-radius:12px;padding:8px 14px;font-size:14px}
.lp7 .lp7-kpi b{font-size:18px;color:var(--lp-ink);margin-inline-end:4px}
.lp7 .lp7-role{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:10px 0}
.lp7 .lp7-role div{background:var(--lp-cream);border:1px solid var(--lp-cream-edge);border-radius:12px;padding:10px 14px}
.lp7 .lp7-role b{display:block;color:var(--lp-ink)}
.lp7 .lp7-bar-act{display:flex;gap:8px;flex-wrap:wrap}
.lp7 .lp7-bar-act .bq-btn{min-height:44px}
@media (max-width:640px){.lp7 table{font-size:13.5px}}
@media print{.lp7 .lp7-open,.lp7 .lp7-bar-act{display:none}.lp7 .lp7-wrap{overflow:visible;border:0}.lp7 table{min-width:0}.lp7 details.lp7-gd{break-inside:avoid}.lp7 details.lp7-gd>div{display:block}}`;
  const typeAr = (e) => e.kind_ar || '';
  const minutes = ELS.reduce((t, e) => t + (e.minutes || 0), 0);

  function sec(id, n, title, body) { return '<section class="lp-sec" id="' + id + '"><h2><span class="lp-num">' + AR(n) + '</span>' + esc(title) + '</h2>' + body + '</section>'; }
  function render(root) {
    if (!document.getElementById('st-plan7')) { const st = document.createElement('style'); st.id = 'st-plan7'; st.textContent = CSS; document.head.append(st); }
    root.classList.add('lp7');
    const kinds = {}; ELS.forEach((e) => { kinds[e.kind_ar] = (kinds[e.kind_ar] || 0) + 1; });
    const card = '<p class="lp-lead">الهدف العامّ: أن يكتشف الطفل صوت /م/ سمعيًا أوّلاً، ثم يربطه بالرمز «م»، فيقرؤه ويكتبه في مواقعه الثلاثة ويستعمل كلماته. كلّ عنصر يجيب عن سؤال: ماذا سيتمكّن الطالب من فعله بعده ولم يكن قادرًا عليه قبله؟</p>' +
      '<ul class="lp7-kpi"><li><b>' + AR(ELS.length) + '</b>عنصراً</li>' + Object.keys(kinds).map((k) => '<li><b>' + AR(kinds[k]) + '</b>' + esc(k) + '</li>').join('') +
      '<li><b>' + AR(minutes) + '</b>دقيقة تقريباً على الشاشة</li><li><b>' + AR((D.outcomes || []).length) + '</b>نواتج قابلة للقياس</li></ul>' +
      '<p><strong>المفردات:</strong> <span class="lp-k">' + esc((D.vocab || []).join(' · ')) + '</span></p>' +
      '<p class="lp-note">الصوت قبل الرمز: لا يظهر الرمز «م» ولا اسم الحرف «ميم» على شاشة الطفل قبل العنصر ٦ «اكتشف الحرف». «باب» مشتّت سماعيّ فقط في «اسمع وميّز». لا همهمة طويلة؛ «مْ» قصيرة طبيعية واحدة في «انطق معي».</p>';
    const outs = '<ol class="lp7-list">' + (D.outcomes || []).map((t) => '<li>' + esc(t) + '</li>').join('') + '</ol><p class="lp-note">الأنشودة والقصّة والخريطة المفاهيمية والتلوين وسائل تعزيز، لا نواتج مستقلّة.</p>';
    const table = '<div class="lp7-wrap"><table><thead><tr><th>#</th><th>العنصر</th><th>النوع</th><th>ماذا سيتمكّن الطالب من فعله</th><th>النواتج</th><th>المهارات</th><th>المدّة</th><th><span class="sr-only">فتح</span></th></tr></thead><tbody>' +
      ELS.map((e) => '<tr><td class="lp7-n">' + AR(e.menu) + '</td><td class="lp7-el">' + esc(e.name) + '</td><td>' + esc(typeAr(e)) + '</td><td>' + esc(e.goal) + '</td><td>' +
        ((e.outcomes || []).length ? (e.outcomes.length === 9 ? 'كلّها' : e.outcomes.map(AR).join('، ')) : 'تعزيز') + '</td><td>' + ((e.skills || []).length ? (e.skills.length === 9 ? 'S1–S9' : e.skills.join('، ')) : '—') + '</td><td>' + esc(e.time_label) + '</td>' +
        '<td><button type="button" class="lp7-open" data-open="' + e.id + '">افتح</button></td></tr>').join('') + '</tbody></table></div>';
    const mx = '<div class="lp7-wrap"><table class="lp7-mx"><thead><tr><th class="lp7-oh">الناتج</th>' + ELS.map((e) => '<th title="' + esc(e.name) + '">' + AR(e.menu) + '</th>').join('') + '</tr></thead><tbody>' +
      (D.outcomes || []).map((t, i) => '<tr><th class="lp7-oh" scope="row">' + AR(i + 1) + '. ' + esc(t) + '</th>' + ELS.map((e) => '<td>' + ((e.outcomes || []).includes(i + 1) ? '<span class="lp7-dot" role="img" aria-label="نعم"></span>' : '') + '</td>').join('') + '</tr>').join('') +
      '</tbody></table></div><p class="lp-note">الأعمدة بأرقام العناصر كما في القائمة (١ = «تَهَيَّأ لِلدَّرْسِ» … ١٦ = «مُهِمَّةٌ مَعَ الأُسْرَةِ»).</p>';
    const ms = '<p>تُسجَّل المحاولة الأولى في كلّ بند مرصود. «أتقن» = محاولتان على الأقلّ و٨٠٪ من آخر خمس صحيحة؛ وإلا «يحتاج مراجعة»، ويقدّم بارق مراجعة قصيرة موجّهة إلى الجزء المناسب.</p>' +
      '<div class="lp7-wrap"><table><thead><tr><th>#</th><th>المهارة</th><th>تُقاس في</th><th>المراجعة الموجّهة</th></tr></thead><tbody>' +
      (D.skills || []).map((s, i) => '<tr><td class="lp7-n">' + AR(i + 1) + '</td><td>' + esc(s.label) + ' <small>(' + s.id + ')</small></td><td>' +
        ELS.filter((e) => (e.skills || []).includes(s.id)).map((e) => esc(e.name)).join('، ') + '</td><td>' + (s.review ? esc((ELS.find((e) => e.id === s.review.id) || {}).name || s.review.id) : '—') + '</td></tr>').join('') +
      '</tbody></table></div><p><button type="button" class="lp7-open" data-page="mastery">افتح «دليل الإتقان» (قابل للطباعة)</button></p>';
    const r = D.parent_role || {};
    const role = '<p><strong>هدف اليوم:</strong> ' + esc(r.goal) + '</p><div class="lp7-role"><div><b>قبل البدء</b>' + esc(r.before) + '</div><div><b>أثناء التعلّم</b>' + esc(r.during) + '</div><div><b>بعد الدرس</b>' + esc(r.after) + '</div></div>' +
      '<p>بطاقة المهمّة للطفل في العنصر ١٦ «مُهِمَّةٌ مَعَ الأُسْرَةِ» وتُطبع على A4.</p>';
    const gd = ELS.map((e) => '<details class="lp7-gd"><summary><span class="lp7-n">' + AR(e.menu) + '</span><span class="lp-k">' + esc(e.name) + '</span> <small>· ' + esc(typeAr(e)) + '</small></summary><div>' +
      (window.BQ && BQ.guideHtml ? BQ.guideHtml(e) : esc(e.desc)) + '</div></details>').join('');
    root.innerHTML = '<div class="lp-bar"><div class="lp-bar-t"><h2>خطة الدرس ودليل المعلّم</h2><p><span class="lp-k">صَوْتُ «م»</span> · L1-01-d1 · النسخة v8 — مسوّدة للمراجعة</p></div>' +
      '<div class="lp7-bar-act"><button type="button" class="bq-btn ghost" data-print="1">اطبع</button><a class="lp-back" href="#">العودة إلى الدرس</a></div><span class="lp-status" title="مسوّدة غير معتمدة">draft_unapproved</span></div>' +
      '<div class="lp-doc">' + sec('lp7-card', 1, 'بطاقة الدرس', card) + sec('lp7-out', 2, 'نواتج التعلّم', outs) + sec('lp7-els', 3, 'عناصر الدرس الستة عشر', table) +
      sec('lp7-mx', 4, 'مصفوفة النواتج والعناصر', mx) + sec('lp7-ms', 5, 'دليل الإتقان والمراجعة الموجّهة', ms) + sec('lp7-role', 6, 'دور وليّ الأمر', role) +
      sec('lp7-gd', 7, 'دليل المعلّم لكلّ عنصر', gd) +
      '<p class="lp-end">المصدر: خطة v7 (هيكل الفريق العلمي، ٢٠٢٦-١٠-٠٤) — draft_unapproved. يحلّ دليل الفريق العلمي (guide_v7.json) محلّ نصوص الخطة حين يصل. الأزمنة تقديرية.</p></div>';
    root.onclick = (ev) => {
      const b = ev.target.closest('[data-open],[data-page],[data-print]'); if (!b || !root.contains(b)) return;
      ev.preventDefault();
      if (b.dataset.print) { root.querySelectorAll('details').forEach((d) => { d.open = true; }); window.print(); return; }
      if (window.BQ && BQ.open) BQ.open(b.dataset.open || b.dataset.page);
    };
  }
  window.BQ_PLAN = { render };
})();
