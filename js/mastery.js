/* mastery.js — «دليل الإتقان» لـ v7 (PLATFORM · draft_unapproved · الأساس = النسخة الأولى)
   العقد (v7/PLATFORM_status.md §2):
     BQ.mastery.record(skillId, ok, elementId, extra?) · get() · reset() · status(skillId) · reviewFor(skillId) · review(skillId) · judge(skillId, level) · SKILLS
     التخزين: localStorage «bq7_mastery» داخل try/catch · حدث window 'bq:mastery'.
   القاعدة (SPEC_v7 §E11 · DECISIONS): الحكم يصدر من E11 وحده؛ تسجيلات العناصر الأخرى «قرائن» للمعلّم.
     بنود E11: extra.kind = 'item' (الافتراضيّ) · 'retest' (بند الإعادة بعد المراجعة) · 'practice' (تدريب المراجعة — لا يُحتسب).
     أتقن = آخر بندين صحيحان (S4: البند ١ صحيح + حكم المعلّم «أتقن»، وبلا حكم ← «أتقن — يُنتظر حكم المعلّم») ·
     بند واحد ← «قريب» · لا شيء ← «ليس بعد» (كلاهما «يحتاج مراجعة») · بعد المراجعة: الإعادة صحيحة ← «أتقن بعد مراجعة»، وإلا «يحتاج متابعة».
   العرض: BQ.masteryView.render(el) — صفحة المعلّم/الأسرة #mastery (الجدول + دور وليّ الأمر) قابلة للطباعة A4. */
(function () {
  'use strict';
  const BQ = window.BQ; if (!BQ) return;
  const D = BQ.D, h = BQ.h, AR = BQ.AR;
  const KEY = 'bq7_mastery';
  const SKILLS = (D.skills || []).map((s) => ({ id: s.id, label: s.label, review: s.review || null }));
  const G = (D.guide7 && D.guide7.mastery) || {};
  const RULE = { judgeSkills: ['S4'], judgeShow: ['S4', 'S9'] }; // R1-9: S9 «استخدام المفردة» يُضاف إليه حكم المعلّم/وليّ الأمر (قرينة تعبيرية؛ لا يغيّر حكم E11)
  const REVIEW = {}; SKILLS.forEach((s) => { REVIEW[s.id] = s.review; });
  if (G.review_map && typeof G.review_map === 'object') Object.keys(G.review_map).forEach((k) => {
    const v = G.review_map[k]; REVIEW[k] = typeof v === 'string' ? { id: v, step: null } : Object.assign({ step: null }, v);
  });
  const LBL = { none: 'لم يُقَس', review: 'يحتاج مراجعة', mastered: 'أتقن', followup: 'يحتاج متابعة' };
  const SUB = { near: 'قريب', notyet: 'ليس بعد', after: 'بعد مراجعة', pending: 'يُنتظر حكم المعلّم' };
  const JUDGE = { mastered: 'أتقن', near: 'قريب', notyet: 'ليس بعد' };
  const blank = () => ({ n: 0, ok: 0, last: [], els: [], ts: 0, items: [], retest: null, judge: null });
  function load() { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && typeof v === 'object' && v.skills ? v : { v: 2, skills: {} }; } catch (e) { return { v: 2, skills: {} }; } }
  function save(st) { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* تخزين غير متاح */ } }
  let S = load();
  const rec = (id) => { const r = S.skills[id] || (S.skills[id] = blank()); ['items', 'last', 'els'].forEach((k) => { if (!Array.isArray(r[k])) r[k] = []; }); return r; };
  /** {status, sub} من سجلّ المهارة */
  function verdict(id, r) {
    if (!r || !r.items || !r.items.length) return { status: 'none', sub: '' };
    const need = RULE.judgeSkills.includes(id) ? 1 : 2;
    const items = r.items.slice(-need), okN = items.filter(Boolean).length;
    if (RULE.judgeSkills.includes(id)) {
      if (okN === need && r.judge === 'mastered') return { status: 'mastered', sub: '' };
      if (okN === need && !r.judge && r.retest == null) return { status: 'mastered', sub: 'pending' };
    } else if (okN === need && items.length === need) return { status: 'mastered', sub: '' };
    if (r.retest === true) return { status: 'mastered', sub: 'after' };
    if (r.retest === false) return { status: 'followup', sub: '' };
    return { status: 'review', sub: okN ? 'near' : 'notyet' };
  }
  const evt = (d) => { try { window.dispatchEvent(new CustomEvent('bq:mastery', { detail: d })); } catch (e) { /* */ } };
  const M = {
    SKILLS, RULE, LABELS: LBL, SUBLABELS: SUB,
    record(skillId, ok, elementId, extra) {
      if (!SKILLS.some((s) => s.id === skillId)) { try { console.warn('[mastery] unknown skill', skillId); } catch (e) { /* */ } return null; }
      const r = rec(skillId); extra = extra || {};
      r.n++; if (ok) r.ok++;
      r.last.push(!!ok); if (r.last.length > 10) r.last = r.last.slice(-10);
      if (elementId && !r.els.includes(elementId)) r.els.push(elementId);
      r.ts = Date.now();
      if (elementId === 'E11') {
        const kind = extra.kind || 'item';
        if (kind === 'retest') r.retest = !!ok;
        else if (kind === 'item') { r.items.push(!!ok); if (r.items.length > 6) r.items = r.items.slice(-6); if (extra.item === 1) r.retest = null; /* جولة قياس جديدة */ }
      } else { r.cn = (r.cn || 0) + 1; if (ok) r.cok = (r.cok || 0) + 1; }
      save(S);
      const v = verdict(skillId, r);
      evt({ skillId, ok: !!ok, elementId: elementId || null, status: v.status, sub: v.sub, extra });
      return v.status;
    },
    /** حكم المعلّم/وليّ الأمر (S4 النطق): 'mastered' | 'near' | 'notyet' | null */
    judge(skillId, level) { const r = rec(skillId); r.judge = JUDGE[level] ? level : null; r.ts = Date.now(); save(S); evt({ skillId, judge: r.judge }); return verdict(skillId, r).status; },
    get() {
      const out = {};
      SKILLS.forEach((s) => { const r = S.skills[s.id] || blank(); const v = verdict(s.id, r);
        out[s.id] = { label: s.label, n: r.n || 0, ok: r.ok || 0, last: (r.last || []).slice(-5), els: (r.els || []).slice(), ts: r.ts || 0,
          items: (r.items || []).slice(), retest: r.retest == null ? null : r.retest, judge: r.judge || null, clues: { n: r.cn || 0, ok: r.cok || 0 },
          status: v.status, sub: v.sub, status_ar: LBL[v.status] + (v.sub ? ' — ' + SUB[v.sub] : '') }; });
      return out;
    },
    status(skillId) { return verdict(skillId, S.skills[skillId]).status; },
    reset() { S = { v: 2, skills: {} }; try { localStorage.removeItem(KEY); } catch (e) { /* */ } evt({ reset: true }); },
    reviewFor(skillId) { const r = REVIEW[skillId]; return r ? { id: r.id, step: r.step || null } : null; },
    review(skillId, from) { const r = M.reviewFor(skillId); if (!r) return false; BQ.open(r.id, { review: { skill: skillId, from: from || BQ.state.current }, step: r.step, src: 'next' }); return true; },
    weak() { const g = M.get(); return SKILLS.filter((s) => g[s.id].status === 'review' || g[s.id].status === 'followup').map((s) => s.id); },
    complete() { const g = M.get(); return SKILLS.every((s) => g[s.id].status === 'mastered'); },
  };
  BQ.mastery = M;

  /* ---------- صفحة «دليل الإتقان ودور الأسرة» (للمعلّم ولوليّ الأمر — لا على شاشة الطفل) ---------- */
  const esc = (x) => String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const nameOf = (id) => { const m = BQ.meta(id); return m ? m.name : id; };
  const KID = ['أَسْمَعُ صَوْتَ المِيمِ', 'أُفَرِّقُ المِيمَ عَن غَيْرِها', 'أَعْرِفُ القَصيرَ وَالطَّويلَ', 'أَنْطِقُ المِيمَ', 'أَعْرِفُ شَكْلَ المِيمِ', 'أَجِدُ المِيمَ في الكَلِمَةِ', 'أَقْرَأُ كَلِماتٍ فيها المِيمُ', 'أَكْتُبُ المِيمَ', 'أَسْتَعْمِلُ كَلِماتي'];
  const ICON = { none: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray="3 3"/></svg>',
    review: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.3-5.2" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M4 4v5h5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    followup: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v10M12 18.5v.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    mastered: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' };
  const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  function render(root) {
    const g = M.get();
    const counts = { mastered: 0, review: 0, followup: 0, none: 0 }; SKILLS.forEach((s) => counts[g[s.id].status]++);
    const date = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    root.replaceChildren();
    const bar = h('div.lp-bar.ms-bar', null,
      h('div.lp-bar-t', null, h('h2', null, 'دليل الإتقان ودور الأسرة'), h('p', null, 'L1-01-d1 · صوت الميم /م/ · للطالب ووليّ الأمر والمعلّم · v7 مسوّدة')),
      h('div.ms-bar-act', null,
        h('button.bq-btn.ghost.ms-print', { type: 'button', onclick: () => window.print() }, h('span.bq-ic', { 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24"><path d="M7 3h10v5H7z" fill="currentColor"/><path d="M4.5 9h15A1.5 1.5 0 0 1 21 10.5V17h-4v4H7v-4H3v-6.5A1.5 1.5 0 0 1 4.5 9z" fill="currentColor"/></svg>' }), 'اطبع (A4)'),
        h('a.bq-btn.lp-back', { href: '#' }, 'العودة إلى الدرس')));
    const sum = h('div.ms-sum', null,
      h('p.ms-intro', null, 'يملأ التطبيق عمود «النتيجة» آلياً من «تحقّق من تقدّمي» (E11)؛ وتسجيلات العناصر الأخرى قرائن للمعلّم لا درجات. يلوّن الطالب الوجه، ويضع وليّ الأمر والمعلّم علامة. إن لم يُتقن الطفل مهارة فلا نقول «أكملت الدرس»؛ بل يقدّم له بارق مراجعة قصيرة موجّهة.'),
      h('ul.ms-counts', null, ['mastered', 'review', 'followup', 'none'].map((k) => h('li.ms-c.is-' + k, null, h('span.ms-ic', { html: ICON[k] }), h('b', null, AR(counts[k])), ' ' + LBL[k]))),
      h('p.ms-meta', null, 'التاريخ: ' + date + ' · اسم الطفل: ', h('span.ms-blank', null, '')));
    const judgeCtl = (id) => h('div.ms-judge', { role: 'group', 'aria-label': 'حكم المعلّم على النطق' },
      Object.keys(JUDGE).map((k) => h('button.ms-jb', { type: 'button', 'aria-pressed': String(g[id].judge === k), onclick: () => { M.judge(id, g[id].judge === k ? null : k); render(root); } }, JUDGE[k])));
    const tb = h('table.ms-table', null,
      h('thead', null, h('tr', null, ['#', 'المهارة', 'النتيجة (آلياً)', 'قرائن من العناصر', 'مراجعة موجّهة', 'الطالب', 'وليّ الأمر', 'المعلّم'].map((t) => h('th', { scope: 'col' }, t)))),
      h('tbody', null, SKILLS.map((s, i) => {
        const r = g[s.id], rv = M.reviewFor(s.id);
        const clue = r.clues.n ? AR(r.clues.ok) + ' من ' + AR(r.clues.n) + ' صحيحة من أوّل مرّة' : '—';
        return h('tr.is-' + r.status, null,
          h('td.ms-n', null, AR(i + 1)),
          h('th.ms-sk', { scope: 'row' }, s.label, h('small', { lang: 'ar' }, '«' + (KID[i] || '') + '»')),
          h('td', null, h('span.ms-st.is-' + r.status, null, h('span.ms-ic', { html: ICON[r.status] }), LBL[r.status]), r.sub ? h('small.ms-sub', null, SUB[r.sub]) : null,
            RULE.judgeShow.includes(s.id) ? judgeCtl(s.id) : null, RULE.judgeShow.includes(s.id) && !RULE.judgeSkills.includes(s.id) ? h('small.ms-sub', null, 'حكم المعلّم/وليّ الأمر: هل يقول الكلمة في جملة؟') : null),
          h('td.ms-els', null, clue, r.els.length ? h('small', null, r.els.map(nameOf).join('، ')) : null),
          h('td.ms-rv', null, rv ? h('button.ms-go', { type: 'button', onclick: () => M.review(s.id, 'mastery'), 'aria-label': 'مراجعة ' + s.label + ' في ' + nameOf(rv.id) }, nameOf(rv.id)) : '—'),
          h('td.ms-face', { 'aria-label': 'يلوّن الطالب' }, '😀 🙂 😐'),
          h('td.ms-tick', null, 'نعم / أحياناً / ليس بعد'),
          h('td.ms-tick', null, 'أتقن / قريب / يحتاج دعماً'));
      })));
    const role = D.parent_role || {};
    const li = (v) => asList(v).map((t) => h('li', null, t));
    const pr = h('section.ms-parent', null, h('h3', null, role.title || 'دور وليّ الأمر'),
      role.goal ? h('p', null, h('b', null, 'هدف اليوم: '), role.goal) : null,
      h('div.ms-role', null,
        h('div', null, h('b', null, 'قبل الدرس'), h('ul', null, li(role.before))),
        h('div', null, h('b', null, 'أثناء الدرس'), h('ul', null, li(role.during))),
        h('div', null, h('b', null, 'بعد الدرس'), h('ul', null, li(role.after)))));
    const foot = h('div.ms-foot', null,
      h('button.bq-btn.ghost.ms-reset', { type: 'button', onclick: (e) => { const b = e.currentTarget; if (b.dataset.sure) { M.reset(); render(root); BQ.ui.toast('مُسحت نتائج دليل الإتقان.'); } else { b.dataset.sure = '1'; b.textContent = 'تأكيد: امسح النتائج'; } } }, 'مسح النتائج على هذا الجهاز'),
      h('p.ms-draft', null, 'مسوّدة غير معتمدة (draft_unapproved) — النتائج تُحسب على هذا الجهاز فقط.'));
    root.append(h('div.lp-in.ms-in', null, bar, sum, h('div.ms-wrap', null, tb), pr, foot));
  }
  BQ.masteryView = { render };
  window.addEventListener('bq:mastery', () => { if (BQ.state.current === 'mastery') { const p = document.getElementById('mastery'); if (p) render(p); } });
})();
