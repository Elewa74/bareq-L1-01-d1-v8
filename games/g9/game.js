/* E10 «اِلْعَبْ» · v8 concept C «مِصْباحُ بارِقٍ» (warm evening) · three.js game · draft_unapproved · design: v7/game8/GDD_C_v8.md
   World: Blender scene authored by GPT/Codex on the owner's PC (g9_blender/build_c.py) → env.glb · props.glb · bariq.glb (meshopt + webp).
   Level 1 «حَقيبَةُ ماجِدٍ»: tap a glowing closed place → the camera glides there, it opens → tap what STARTS with «مَ» → into Majed's backpack.
   Level 2 «سِرُّ الصُّنْدوقِ»: the treasure box on the bookcase; 4 «أَكْمِلِ الكَلِمَةَ» locks (S5 مَوْز مُشْط · S6 قَمَر فَم), letters in HTML on the brass plates.
   Ladder (OWNER_R3 GLOBAL): name first · ✓ green + praise + star · ✗1 red ✗ + retry line · ✗2 Bariq lights the answer + encouraging line ·
   middle/last-م (قَلَم قَميص قَمَر) = gold «heard it» + word chip with the م coloured in its place, never red, not counted.
   No timer, no lose state, stars only for correct answers. Tap only; guided camera (no free look). */
import * as THREE from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './vendor/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from './vendor/jsm/libs/meshopt_decoder.module.js';

export const VERSION = 'g9-c1';
export function supported() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
}

/* ------------------------------------------------------------------ content (GDD §3) */
const ITEMS = {
  mawz: { role: 'target', word: 'مَوْزْ' }, manju: { role: 'target', word: 'مانْجو' }, tuffaha: { role: 'none', word: 'تُفّاحَةْ' },
  miftah: { role: 'target', word: 'مِفْتاحْ' }, qalam: { role: 'mid', pos: 'last', word: 'قَلَمْ', m: 2 },
  musht: { role: 'target', word: 'مُشْطْ' }, kura: { role: 'none', word: 'كُرَةْ' },
  qamis: { role: 'mid', pos: 'mid', word: 'قَميصْ', m: 1 }, qamar: { role: 'mid', pos: 'mid', word: 'قَمَرْ', m: 1 },
  maktab: { role: 'target', word: 'مَكْتَبْ' }, kitab: { role: 'none', word: 'كِتابْ' },
};
const PLACES = {
  lunchbag: { cam: 'CAM_lunchbag', opens: ['ANIM_lunchbag_flap'], items: ['mawz', 'manju', 'tuffaha'], target: 'manju', demo: 'mawz' },
  drawer_desk: { cam: 'CAM_drawer_desk', opens: ['ANIM_drawer_desk'], items: ['miftah', 'qalam'], target: 'miftah' },
  chest: { cam: 'CAM_chest', opens: ['ANIM_drawer_chest'], items: ['musht', 'kura'], target: 'musht' },
  wardrobe: { cam: 'CAM_wardrobe', opens: ['ANIM_wardrobe_L', 'ANIM_wardrobe_R'], items: ['qamis'], bonus: true },
  window: { cam: 'CAM_window', opens: ['ANIM_curtain_L', 'ANIM_curtain_R'], items: ['qamar'], bonus: true, wonder: 'bq7_E10c_moon' },
};
const FINAL = { cam: 'CAM_final', items: ['maktab', 'kitab'], target: 'maktab' };
const WORDS = [ // level 2 = SPEC §E10 round 2 (approved «أَكْمِلِ الكَلِمَةَ»), now the 4 locks of Majed's box
  { s: 'mawz', word: 'مَوْزْ', m: 0, parts: ['#', 'ـوْزْ'], right: 'مَـ', wrong: ['بَـ', 'فَـ'], skill: 'S5' },
  { s: 'musht', word: 'مُشْطْ', m: 0, parts: ['#', 'ـشْطْ'], right: 'مُـ', wrong: ['بُـ', 'فُـ'], skill: 'S5' },
  { s: 'qamar', word: 'قَمَرْ', m: 1, parts: ['قَـ', '#', 'ـرْ'], right: 'ـمَـ', wrong: ['ـبَـ', 'ـفَـ'], skill: 'S6' },
  { s: 'fam', word: 'فَمْ', m: 1, parts: ['فَـ', '#'], right: 'ـمْ', wrong: ['ـبْ', 'ـفْ'], skill: 'S6' },
];
const L = {
  intro: 'bq7_E10c_intro', light: 'bq7_E10c_light', rule: 'bq7_E10c_rule', demo: 'bq7_E10_demo', turn: 'bq7_E10c_turn',
  pickThing: 'bq7_E10c_pick_thing', pickPlace: 'bq7_E10c_pick_place', bag: 'bq7_E10c_bag', midYes: 'bq7_E10c_mid_yes', midRule: 'bq7_E10c_mid_rule',
  help: 'bq7_E10c_help', final: 'bq7_E10c_final', deskOk: 'bq7_E10c_desk_ok', l2: 'bq7_E10c_l2_intro', r2task: 'bq7_E10_r2_task',
  boxOpen: 'bq7_E10c_box_open', winMaj: 'bq7_E10c_win_maj', winBrq: 'bq7_E10c_win_brq', hintStart: 'bq7_G_hint_start', shape: 'bq7_G_look_shape',
  model: 'bq7_G_model', posMid: 'bq7_G_pos_mid', posLast: 'bq7_G_pos_last',
};
const PRAISE = ['bq7_G_yes1', 'bq7_E10_found', 'bq7_G_yes3', 'bq7_G_yes4', 'bq7_G_yes2'];
const TRY = ['bq7_E11_fb_try1', 'bq7_E11_fb_try2', 'bq7_E11_fb_try3'];
const SOLVE = ['bq7_E11_fb_solve1', 'bq7_E11_fb_solve2', 'bq7_E11_fb_solve3'];
const MIN_HIT = 120;      // layout px of the 1180-wide stage (≥ 96 CSS px on a 1024 iPad, ≥ 64 px on the smallest scale)
const MIN_HS = 160;       // closed places in the master shot
const GLIDE = 1.2;        // s, camera glide (ease-in-out, no roll)
const MARK_NO = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#E53935" stroke="#fff" stroke-width="4"/><path d="M16 16l16 16M32 16 16 32" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>';
const EAR = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#FFC21A" stroke="#fff" stroke-width="4"/><path d="M18 30c0 4 3 6 6 6s5-2 5-5c0-4 6-5 6-12a11 11 0 0 0-22 0" fill="none" stroke="#0B2D4F" stroke-width="3.6" stroke-linecap="round"/><path d="M20 19a4 4 0 0 1 8 0c0 3-3 4-3 6" fill="none" stroke="#0B2D4F" stroke-width="3.2" stroke-linecap="round"/></svg>';
const BAG_SVG = '<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M30 26c0-10 8-16 18-16s18 6 18 16" fill="none" stroke="#0B2D4F" stroke-width="6" stroke-linecap="round"/><rect x="16" y="24" width="64" height="62" rx="18" fill="#13848F" stroke="#0B2D4F" stroke-width="5"/><rect x="28" y="52" width="40" height="24" rx="8" fill="#1AA3AE" stroke="#0B2D4F" stroke-width="4"/><path d="M28 40h40" stroke="#0B2D4F" stroke-width="4" stroke-linecap="round"/></svg>';

const CSS = `
.g9 { position: absolute; inset: 0; overflow: hidden; border-radius: 22px; background: #2A2340; user-select: none; -webkit-user-select: none; touch-action: none;
  container-type: size; --u: calc(100cqw / 1130); direction: rtl; -webkit-tap-highlight-color: transparent; }
.g9-vig { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 95% at 50% 52%, rgba(0,0,0,0) 58%, rgba(36,18,40,.30) 100%); }
.g9 canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; }
.g9-load { position: absolute; inset: 0; z-index: 30; display: grid; place-items: center; align-content: center; gap: calc(var(--u)*22);
  background: radial-gradient(70% 70% at 50% 45%, #FFE9B0 0, #F7C873 45%, #C98A4A 100%); transition: opacity .6s; }
.g9-load img { width: calc(var(--u)*260); filter: drop-shadow(0 calc(var(--u)*18) calc(var(--u)*16) rgba(80,40,0,.35)); animation: g9Float 2.2s ease-in-out infinite; }
.g9-load .bar { width: calc(var(--u)*420); height: calc(var(--u)*26); border-radius: 99px; background: rgba(255,255,255,.55); border: calc(var(--u)*4) solid #0B2D4F; overflow: hidden; }
.g9-load .bar i { display: block; height: 100%; width: 0; background: #FFC21A; transition: width .25s; }
.g9-load.is-gone { opacity: 0; pointer-events: none; }
.g9-hud { position: absolute; z-index: 10; top: calc(var(--u)*18); inset-inline: calc(var(--u)*22); display: flex; align-items: center; gap: calc(var(--u)*16); pointer-events: none; }
.g9-hud > * { pointer-events: auto; }
.g9-hud .g9-sp { flex: 1; pointer-events: none; }
.g9 .bq8-btn { --bq8-btn: max(76px, calc(var(--u)*86)); }
.g9 .g9-mute { --h: #EEF2F7; --hd: #8FA3B8; width: max(64px, calc(var(--u)*70)); height: max(64px, calc(var(--u)*70)); font-size: max(42px, calc(var(--u)*46)); opacity: .85; }
.g9 .g9-mute.is-active { --h: #FFE1DC; --hd: #E4553F; opacity: 1; }
.g9-stars { position: absolute; z-index: 10; top: calc(var(--u)*22); left: 50%; transform: translateX(-50%); display: flex; direction: rtl; gap: calc(var(--u)*6);
  padding: calc(var(--u)*8) calc(var(--u)*16); border-radius: 999px; background: rgba(255,255,255,.82); box-shadow: 0 0 0 calc(var(--u)*4) #fff, 0 calc(var(--u)*6) calc(var(--u)*14) rgba(11,45,79,.3); pointer-events: none; }
.g9-stars i { width: calc(var(--u)*40); height: calc(var(--u)*40); background: url(../../assets/icons8/star_empty.svg) center / contain no-repeat; }
.g9-stars i.is-on { background-image: url(../../assets/icons8/star.svg); animation: g9Pop .45s cubic-bezier(.3,1.6,.5,1) both; }
.g9-stars i.gap { width: calc(var(--u)*10); background: none; }
.g9-bag { position: absolute; z-index: 10; left: calc(var(--u)*22); bottom: calc(var(--u)*20); width: calc(var(--u)*112); height: calc(var(--u)*112); pointer-events: none;
  filter: drop-shadow(0 calc(var(--u)*8) calc(var(--u)*10) rgba(0,0,0,.35)); transition: transform .25s cubic-bezier(.3,1.6,.5,1); }
.g9-bag svg { width: 100%; height: 100%; }
.g9-bag.is-pop { transform: scale(1.18) rotate(-4deg); }
.g9-bag b { position: absolute; top: calc(var(--u)*-8); right: calc(var(--u)*-8); min-width: calc(var(--u)*40); height: calc(var(--u)*40); border-radius: 99px; background: #FFC21A;
  border: calc(var(--u)*4) solid #fff; display: grid; place-items: center; font: 700 calc(var(--u)*24)/1 var(--font-ui, sans-serif); color: #0B2D4F; }
.g9-album { position: absolute; z-index: 25; inset: calc(var(--u)*70) calc(var(--u)*120); border-radius: calc(var(--u)*34); background: #FFF8E6; border: calc(var(--u)*5) solid #0B2D4F;
  box-shadow: 0 0 0 calc(var(--u)*8) #fff, 0 calc(var(--u)*30) calc(var(--u)*60) rgba(0,0,0,.45); display: grid; grid-template-columns: repeat(4, 1fr); gap: calc(var(--u)*22); padding: calc(var(--u)*40) calc(var(--u)*46) calc(var(--u)*40); align-content: start; }
.g9-album[hidden] { display: none; }
.g9-album .st { position: relative; aspect-ratio: 1; border-radius: calc(var(--u)*24); background: #fff; border: calc(var(--u)*4) dashed rgba(11,45,79,.25); display: grid; place-items: center; overflow: visible; }
.g9-album .st img { width: 86%; height: 86%; object-fit: contain; }
.g9-album .st.is-on { border-style: solid; border-color: #FFC21A; box-shadow: 0 calc(var(--u)*8) calc(var(--u)*14) rgba(11,45,79,.18); cursor: pointer; }
.g9-album .st .ear { position: absolute; width: calc(var(--u)*50); height: calc(var(--u)*50); top: calc(var(--u)*-14); left: calc(var(--u)*-14); }
.g9-album .x { position: absolute; top: calc(var(--u)*-34); left: calc(var(--u)*-34); }
.g9-no { position: absolute; z-index: 12; width: calc(var(--u)*70); height: calc(var(--u)*70); margin: calc(var(--u)*-35); pointer-events: none; animation: g9NoIn 1.8s ease-out forwards; }
.g9-no svg, .g9-ear svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 2px 3px rgba(0,0,0,.3)); }
.g9-ear { position: absolute; z-index: 11; width: calc(var(--u)*56); height: calc(var(--u)*56); margin: calc(var(--u)*-28); pointer-events: none; animation: g9Pop .4s ease-out both; }
.g9-chip { position: absolute; z-index: 13; display: grid; place-items: center; gap: calc(var(--u)*6); padding: calc(var(--u)*14) calc(var(--u)*34) calc(var(--u)*22);
  background: #fff; border: calc(var(--u)*5) solid #0B2D4F; border-radius: calc(var(--u)*30); box-shadow: 0 0 0 calc(var(--u)*7) #fff, 0 0 0 calc(var(--u)*13) #FFC21A, 0 calc(var(--u)*16) calc(var(--u)*24) rgba(11,45,79,.4);
  transform: translate(-50%, -100%) scale(.3); opacity: 0; transition: opacity .2s, transform .3s cubic-bezier(.3,1.6,.5,1); pointer-events: none; }
.g9-chip.is-on { opacity: 1; transform: translate(-50%, -100%); }
.g9-chip .w { direction: rtl; font: 700 calc(var(--u)*92)/1.6 var(--font-letter, 'Vazirmatn', sans-serif); color: #0B2D4F; white-space: nowrap; }
.g9-chip .w .m { color: #E4553F; }
.g9-chip .w.is-pulse .m { animation: g9Beat .5s ease-in-out 4; }
.g9-chip .d { display: flex; direction: rtl; gap: calc(var(--u)*26); }
.g9-chip .d i { width: calc(var(--u)*30); height: calc(var(--u)*30); border-radius: 50%; background: #DCE5F0; border: calc(var(--u)*5) solid #0B2D4F; }
.g9-chip .d i.on { background: #E4553F; transform: scale(1.3); }
.g9-chip .d i.want { animation: g9Blink .5s ease-in-out 6; }
.g9-rip { position: absolute; z-index: 9; width: calc(var(--u)*70); height: calc(var(--u)*70); margin: calc(var(--u)*-35); border-radius: 50%; border: calc(var(--u)*5) solid rgba(255,255,255,.9); pointer-events: none; animation: g9Rip .45s ease-out forwards; }
.g9-word { position: absolute; z-index: 12; left: 50%; top: calc(var(--u)*120); transform: translateX(-50%); display: flex; direction: rtl; align-items: center; gap: calc(var(--u)*30);
  padding: calc(var(--u)*16) calc(var(--u)*30); border-radius: calc(var(--u)*36); background: rgba(255,250,236,.96); border: calc(var(--u)*5) solid #0B2D4F; box-shadow: 0 0 0 calc(var(--u)*7) #fff, 0 calc(var(--u)*16) calc(var(--u)*26) rgba(11,45,79,.4); }
.g9-word[hidden] { display: none; }
.g9-word .card { width: calc(var(--u)*170); height: calc(var(--u)*170); border-radius: calc(var(--u)*24); border: calc(var(--u)*4) solid #fff; box-shadow: 0 0 0 calc(var(--u)*3) #0B2D4F; overflow: hidden; background: #fff; padding: 0; cursor: pointer; position: relative; }
.g9-word .card img { width: 100%; height: 100%; object-fit: cover; }
.g9-word .card .bq8-ic { position: absolute; bottom: calc(var(--u)*6); left: calc(var(--u)*6); font-size: calc(var(--u)*44); }
.g9-word .row { display: flex; direction: rtl; align-items: center; font: 700 calc(var(--u)*112)/1.6 var(--font-letter, 'Vazirmatn', sans-serif); color: #0B2D4F; white-space: nowrap; min-width: calc(var(--u)*330); justify-content: center; }
.g9-word .row .m { color: #E4553F; }
.g9-word .gap { display: inline-grid; place-items: center; width: calc(var(--u)*140); height: calc(var(--u)*150); margin-inline: calc(var(--u)*6); border-radius: calc(var(--u)*24);
  border: calc(var(--u)*5) dashed rgba(11,45,79,.4); background: rgba(255,240,184,.55); vertical-align: middle; }
.g9-word .gap.is-glow { border-style: solid; border-color: #FFC21A; animation: g9Ring 1.1s ease-in-out infinite; }
.g9-word .gap.is-ok { border-style: solid; border-color: #22C27A; background: rgba(34,194,122,.15); }
.g9-lock { position: absolute; z-index: 12; width: calc(var(--u)*150); height: calc(var(--u)*150); margin: calc(var(--u)*-75); border-radius: 50%; padding: 0; cursor: pointer;
  border: calc(var(--u)*6) solid #6B4310; background: radial-gradient(circle at 35% 30%, #FFF3C4 0, #F2C14E 45%, #C98A1E 100%);
  box-shadow: inset 0 calc(var(--u)*-8) 0 rgba(120,70,0,.35), 0 0 0 calc(var(--u)*5) #fff, 0 calc(var(--u)*12) calc(var(--u)*18) rgba(0,0,0,.4);
  font: 700 calc(var(--u)*64)/1.5 var(--font-letter, 'Vazirmatn', sans-serif); color: #0B2D4F; display: grid; place-items: center; transition: transform .15s; }
.g9-lock span { display: block; line-height: 1.5; padding-bottom: calc(var(--u)*8); }
.g9-lock:active { transform: scale(.95); }
.g9-lock.is-no { box-shadow: inset 0 calc(var(--u)*-8) 0 rgba(120,70,0,.35), 0 0 0 calc(var(--u)*5) #fff, 0 0 0 calc(var(--u)*14) #E53935; opacity: .8; }
.g9-lock.is-ok { box-shadow: inset 0 calc(var(--u)*-8) 0 rgba(120,70,0,.35), 0 0 0 calc(var(--u)*5) #fff, 0 0 0 calc(var(--u)*14) #22C27A; }
.g9-lock .x { position: absolute; top: calc(var(--u)*-14); right: calc(var(--u)*-14); width: calc(var(--u)*56); height: calc(var(--u)*56); }
.g9-lock.is-used { visibility: hidden; }
.g9-lock[hidden] { display: none; }
@keyframes g9Float { 50% { transform: translateY(calc(var(--u)*-14)); } }
@keyframes g9Pop { 0% { transform: scale(.2); opacity: 0; } 70% { transform: scale(1.2); opacity: 1; } 100% { transform: none; } }
@keyframes g9NoIn { 0% { transform: scale(.3); opacity: 0; } 12% { transform: scale(1.1); opacity: 1; } 20% { transform: scale(1); } 80% { opacity: 1; } 100% { opacity: 0; } }
@keyframes g9Rip { from { transform: scale(.3); opacity: 1; } to { transform: scale(1.4); opacity: 0; } }
@keyframes g9Beat { 50% { transform: scale(1.25); } }
@keyframes g9Blink { 50% { background: #FFC21A; transform: scale(1.35); } }
@keyframes g9Ring { 50% { box-shadow: 0 0 0 calc(var(--u)*8) rgba(255,194,26,.55); } }
`;

/* ------------------------------------------------------------------ helpers */
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const h = (tag, attrs, ...kids) => {
  const [t, ...cls] = tag.split('.'); const e = document.createElement(t || 'div'); if (cls.length) e.className = cls.join(' ');
  if (attrs) for (const [k, v] of Object.entries(attrs)) { if (k === 'html') e.innerHTML = v; else if (k === 'style') Object.assign(e.style, v); else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v != null) e.setAttribute(k, v); }
  kids.flat().forEach((c) => { if (c != null) e.append(c); }); return e;
};
function wordParts(word, mIdx) { // split the connected word around its «م» (ZWJ keeps the joins → the word stays connected)
  let i0 = 0, n = -1; for (let i = 0; i < word.length; i++) { if (/[ً-ٰٟ]/.test(word[i])) continue; n++; if (n === mIdx) { i0 = i; break; } }
  let i1 = i0 + 1; while (i1 < word.length && /[ً-ٰٟ]/.test(word[i1])) i1++;
  const Z = '‍';
  return [word.slice(0, i0) + (i0 ? Z : ''), (i0 ? Z : '') + word.slice(i0, i1) + (i1 < word.length ? Z : ''), (i1 < word.length ? Z : '') + word.slice(i1)];
}
function radialTex(stops, size = 128) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2); stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr; g.fillRect(0, 0, size, size); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function ringTex(col) {
  const s = 128, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d');
  g.lineWidth = 12; g.strokeStyle = '#fff'; g.beginPath(); g.arc(s / 2, s / 2, s / 2 - 14, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 7; g.strokeStyle = col; g.stroke(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function placeTex() { // R-fix (review F1): «tap a glowing place» — a gold halo + rim that reads on the light walls (the additive glow was invisible)
  const s = 256, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d');
  const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); gr.addColorStop(0, 'rgba(255,214,90,.34)'); gr.addColorStop(0.62, 'rgba(255,200,70,.26)'); gr.addColorStop(0.8, 'rgba(255,190,60,.5)'); gr.addColorStop(1, 'rgba(255,190,60,0)');
  g.fillStyle = gr; g.fillRect(0, 0, s, s);
  g.lineWidth = 9; g.strokeStyle = 'rgba(255,255,236,.95)'; g.beginPath(); g.arc(s / 2, s / 2, s * 0.39, 0, 7); g.stroke();
  g.lineWidth = 5; g.strokeStyle = 'rgba(255,184,28,1)'; g.beginPath(); g.arc(s / 2, s / 2, s * 0.39 + 7, 0, 7); g.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function starTex() {
  const s = 128, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d');
  const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); gr.addColorStop(0, 'rgba(255,214,90,.42)'); gr.addColorStop(0.45, 'rgba(255,200,80,.12)'); gr.addColorStop(1, 'rgba(255,200,80,0)');
  g.fillStyle = gr; g.fillRect(0, 0, s, s);
  g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 19 : 46, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(s / 2 + Math.cos(a) * r, s / 2 + Math.sin(a) * r); }
  g.closePath(); g.lineJoin = 'round'; g.lineWidth = 7; g.strokeStyle = 'rgba(255,255,240,.95)'; g.stroke(); g.fillStyle = '#FFD23F'; g.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ------------------------------------------------------------------ the game */
export async function run(host, api) {
  if (!document.getElementById('st-g9')) document.head.append(h('style', { id: 'st-g9' }, CSS));
  const BASE = api.base || 'games/g9/';
  const reduced = !!(api.reduced && api.reduced());
  const box = h('div.g9', { 'data-shot': 'load', 'data-lock': '1' });
  host.append(box);
  const res = { found: 0, targets: 4, wrong: 0, mid_heard: [], picks: [], words: [], items: [], first_try: 0, after_hint: 0, shown: 0, views_used: [], build_ok: true, build: VERSION };
  const LOG = (window.__g9log = []); const t0 = performance.now();
  const logEv = (k, v) => LOG.push({ t: Math.round(performance.now() - t0), k, v });
  let alive = true; let muted = false;
  const ok = () => alive && api.alive();
  const say = async (id) => { if (!id || !ok()) return; logEv('say', id); await api.say(id, { volume: muted ? 0 : 1 }); };
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 60) : ms));

  /* ---------- loading screen (Bariq) */
  const bar = h('i');
  const load = h('div.g9-load', null, h('img', { src: api.brqImg || '', alt: '' }), h('div.bar', null, bar));
  box.append(load);

  /* ---------- renderer */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  let pr = Math.min(window.devicePixelRatio || 1, 2);
  try { const q = +new URLSearchParams(location.search).get('g9pr'); if (q > 0 && q <= 2) pr = q; } catch (e) { /* */ } // QA/capture only
  box.prepend(renderer.domElement); renderer.domElement.after(h('i.g9-vig'));
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#1d2440');
  const camera = new THREE.PerspectiveCamera(40, 1.4, 0.05, 60);
  const lookTmp = new THREE.Vector3();

  /* ---------- load the world */
  const mgr = new THREE.LoadingManager();
  mgr.onProgress = (u, a, b) => { bar.style.width = Math.round(a / Math.max(1, b) * 100) + '%'; };
  const gl = new GLTFLoader(mgr);
  gl.setMeshoptDecoder(MeshoptDecoder);
  const draco = new DRACOLoader(); draco.setDecoderPath(BASE + 'vendor/jsm/libs/draco/'); gl.setDRACOLoader(draco);
  const loadG = (f) => new Promise((ok2, no) => gl.load(BASE + 'assets/' + f, ok2, undefined, no));
  const [env, props, bq] = await Promise.all([loadG('env.glb'), loadG('props.glb'), loadG('bariq.glb')]);
  let man = {}; try { man = await (await fetch(BASE + 'assets/manifest.json', { cache: 'no-cache' })).json(); } catch (e) { man = {}; }
  const texL = new THREE.TextureLoader();
  const ldTex = async (f) => { if (!f) return null; try { const t = await texL.loadAsync(BASE + 'assets/' + f); t.colorSpace = THREE.SRGBColorSpace; return t; } catch (e) { return null; } };
  const majTex = await ldTex(man.majed_sit), majWin = await ldTex(man.majed_win);
  if (!ok()) { renderer.dispose(); return res; }
  scene.add(env.scene, props.scene, bq.scene);
  scene.updateMatrixWorld(true);
  /* C3 (Codex props round after the review): the soft quilted lunch bag ships in props.glb but its DECO nodes live in env.glb (env stays
     byte-identical) → move them into the env parents (g9_blender/c3_runtime.mjs logic) and use the re-framed CAM_lunchbag + its Bariq mark.
     CAM_final is NOT taken: Codex's closer frame crops the desk (its own verdict WEAK); the C2 frame shows the whole desk + the turned book. */
  if (!props.scene.userData.c3Applied && props.scene.getObjectByName('DECO_lunchbag')) {
    ['DECO_lunchbag', 'DECO_lunchbag_liner', 'DECO_lunchbag_stitch'].forEach((n) => { const old = env.scene.getObjectByName(n), rep2 = props.scene.getObjectByName(n);
      if (!old || !old.parent || !rep2) return; old.parent.attach(rep2); old.removeFromParent(); rep2.traverse((o) => { o.userData.c3 = 1; }); });
    const C3CAM = { position: [-1.55, 1.24, -3.1], quaternion: [-0.39971795678138733, 0, 0, 0.916638195514679], yfov: 0.43569620622152294, aspect: 1.401985111662531 };
    const cl = env.scene.getObjectByName('CAM_lunchbag');
    if (cl && cl.isPerspectiveCamera) { const P = new THREE.Vector3().fromArray(C3CAM.position); cl.parent.worldToLocal(P); cl.position.copy(P);
      const pq = cl.parent.getWorldQuaternion(new THREE.Quaternion()).invert(); cl.quaternion.fromArray(C3CAM.quaternion).premultiply(pq);
      cl.aspect = C3CAM.aspect; cl.fov = C3CAM.yfov * 180 / Math.PI; cl.updateProjectionMatrix(); }
    const ml = env.scene.getObjectByName('MARK_bariq_lunchbag');
    if (ml) { const P = new THREE.Vector3(-1.6508619785308838, 0.8126373291015625, -3.5950119495391846); ml.parent.worldToLocal(P); ml.position.copy(P); }
    props.scene.userData.c3Applied = true; scene.updateMatrixWorld(true);
  }

  const byName = {};
  scene.traverse((o) => { if (o.name && !byName[o.name]) byName[o.name] = o; });
  const get = (n) => byName[n] || byName[n.replace(/\./g, '')] || null;
  const extras = (o) => (o && o.userData) || {};

  /* R-fix (review F13): the Cycles bake reads flat and lilac-pink next to the approved film stills; a light warm-evening grade on the env only
     (contrast 1.1, saturation 1.08, lilac pulled toward warm, −4 % exposure) — props and Bariq are untouched */
  const gradeEnv = (sh) => { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
      { vec3 c = diffuseColor.rgb; float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); c = mix(vec3(l), c, 1.08);
        c = (c - 0.42) * 1.1 + 0.42; c *= vec3(1.03, 0.985, 0.92) * 0.96; diffuseColor.rgb = max(c, 0.0); }`); };
  // baked environment → unlit (the Cycles bake carries the warm-evening grade); props stay lit
  const envMeshes = [];
  env.scene.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material; const map = (m && (m.emissiveMap || m.map)) || null;
    if (/^HIT_/.test(o.name) || /^HIT_/.test((o.parent && o.parent.name) || '')) { o.visible = false; return; }
    const baked = !extras(o).c3 && (extras(o).baked || extras(o.parent).baked || (m && m.emissiveMap && !m.map));
    if (baked && map) { map.colorSpace = THREE.SRGBColorSpace; o.material = new THREE.MeshBasicMaterial({ map, transparent: !!m.transparent, alphaTest: m.alphaTest || 0, side: m.side }); o.material.onBeforeCompile = gradeEnv; }
    envMeshes.push(o);
  });
  /* R-fix (v8_E10c_review F2): the Codex PROPS_AO atlas came out ~black (bake failed) → three used it to kill all ambient light on every
     prop: black curtains, black chest-drawer front, muddy lunch bag. Drop the AO maps; props are lit by hemi + key + Bariq + a soft front fill. */
  { let aoOk = false; props.scene.traverse((o) => { if (o.name === 'PROP_manju' && extras(o).ao_c3) aoOk = true; }); // C3 re-bake flags a good AO atlas
    if (!aoOk) [env, props, bq].forEach((g) => g.scene.traverse((o) => { if (o.isMesh && o.material && o.material.aoMap) { o.material.aoMap = null; o.material.needsUpdate = true; } })); }
  props.scene.traverse((o) => { if (o.isMesh && /^HIT_/.test(o.name)) o.visible = false; if (o.isMesh && /^HIT_/.test((o.parent && o.parent.name) || '')) o.visible = false; });
  // lights for the moving things (mirror of LIGHT_key / LIGHT_hemi)
  const lh = extras(get('LIGHT_hemi'));
  scene.add(new THREE.HemisphereLight(new THREE.Color(lh.sky || '#FFE2B8'), new THREE.Color(lh.ground || '#6A4A3A'), 1.25));
  const key = new THREE.DirectionalLight('#FFD39A', 1.6);
  const lk = get('LIGHT_key');
  if (lk) { lk.getWorldPosition(key.position); const d = new THREE.Vector3(0, 0, -1).applyQuaternion(lk.getWorldQuaternion(new THREE.Quaternion())); key.target.position.copy(key.position).add(d); }
  else key.position.set(-2, 3, 1);
  scene.add(key, key.target);
  const moon = new THREE.DirectionalLight('#9FB8FF', 0.45); moon.position.set(-1.5, 2.5, -5); scene.add(moon);
  const fill = new THREE.DirectionalLight('#FFE6C4', 0.45); scene.add(fill, fill.target); // soft front fill, follows the camera (set per frame)

  /* cameras (Blender CAM_* → glTF cameras): keep the authored HORIZONTAL framing on our 1130×806 box */
  const cams = {};
  const camNode = (n) => { const o = get(n); if (!o) return null; let c = null; o.traverse((x) => { if (x.isCamera && !c) c = x; }); return { o, c: c || (o.isCamera ? o : null) }; };
  Object.keys(byName).filter((n) => /^CAM_/.test(n)).forEach((n) => {
    const r = camNode(n); if (!r || !r.c) return; if (cams[n.replace(/_Orientation$/, '')]) return;
    const pos = new THREE.Vector3(), q = new THREE.Quaternion(); r.c.getWorldPosition(pos); r.c.getWorldQuaternion(q);
    const hf = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(r.c.fov) / 2) * (r.c.aspect || 1.6));
    let ex = extras(r.o).exclude_objects || extras(r.c).exclude_objects || ''; if (typeof ex === 'string') ex = ex.split(',');
    cams[n.replace(/_Orientation$/, '')] = { pos, q, hf, near: r.c.near, far: r.c.far, ex: ex.map((x) => String(x).trim()).filter(Boolean) };
  });
  const aspect = () => box.clientWidth / Math.max(1, box.clientHeight);
  const setFovFromH = (hf) => { camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hf / 2) / aspect())); camera.updateProjectionMatrix(); };
  let camCur = null, glideT = null;
  function snapCam(name) { const c = cams[name]; if (!c) return; if (typeof applyEx === 'function') applyEx(c); camCur = { pos: c.pos.clone(), q: c.q.clone(), hf: c.hf }; camera.position.copy(c.pos); camera.quaternion.copy(c.q); setFovFromH(c.hf); }
  /* per-camera exclude_objects (Blender CAM_*.exclude_objects): the desk lamp «مِصْباح» (a م-word) leaves the close decision shots;
     swapped at the middle of a glide so nothing pops on a still frame */
  let exNow = [];
  function applyEx(c) { exNow.forEach((o) => { o.visible = true; }); exNow = (c.ex || []).map((n) => get(n)).filter(Boolean); exNow.forEach((o) => { o.visible = false; }); }
  function glideCam(name, dur = GLIDE) {
    const c = cams[name]; if (!c) return Promise.resolve();
    const from = { pos: camera.position.clone(), q: camera.quaternion.clone(), hf: camCur ? camCur.hf : c.hf };
    return new Promise((r) => { glideT = { from, to: c, t: 0, dur: reduced ? 0.05 : dur, done: r }; });
  }

  /* things */
  const items = {};
  Object.keys(ITEMS).forEach((s) => {
    const prop = get('PROP_' + s), hit = get('HIT_' + s) || prop;
    if (!prop && !hit) return;
    const it = { s, ...ITEMS[s], prop, hit, gone: false, heard: false, hinted: false };
    if (prop) { it.rest = prop.position.clone(); it.mats = []; prop.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); it.mats.push(o.material); } }); }
    items[s] = it;
  });
  /* R-fix (review F5): the moon was a flat grey hatched disc (fabric-like «moon_craters» map on black) → a glowing cream moon with soft craters + halo */
  { const mo = get('PROP_qamar'); if (mo) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const gr = g.createRadialGradient(108, 100, 10, 128, 128, 128); gr.addColorStop(0, '#FFFDF2'); gr.addColorStop(0.7, '#FBF0CF'); gr.addColorStop(1, '#EAD9A6'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    [[90, 80, 26], [160, 120, 18], [120, 170, 30], [180, 70, 12], [70, 150, 14]].forEach(([x, y, r]) => { g.fillStyle = 'rgba(214,196,150,.45)'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    mo.traverse((o) => { if (o.isMesh) o.material = new THREE.MeshBasicMaterial({ map: t, toneMapped: false }); });
    const halo2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTex([[0, 'rgba(255,248,215,.75)'], [0.45, 'rgba(255,240,200,.22)'], [1, 'rgba(255,240,200,0)']]), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    const mb = new THREE.Box3().setFromObject(mo, true); halo2.position.copy(mb.getCenter(new THREE.Vector3())); halo2.position.z -= 0.02; halo2.scale.setScalar(0.62); scene.add(halo2); } }
  /* R-fix (review F9): the picture book stood flat against the wall → read as a framed picture. Turn it 34° on the shelf so its page block
     and thickness show (it still rests on the shelf, centred in the shelf depth); its hit proxy turns with it */
  if (!extras(get('PROP_kitab')).c3_book) ['PROP_kitab', 'HIT_kitab'].forEach((n) => { const o = get(n); if (!o) return; o.rotation.y += THREE.MathUtils.degToRad(-34); o.position.z = -4.69; o.position.x += 0.03; o.updateMatrixWorld(true); });
  /* review F15: the C3 comb (18 cm, real size) is ~90 design px long in CAM_chest — too small to recognise on an iPad; 1.35× (≈ 24 cm, still a
     believable comb) keeps it flat on the drawer floor (scaled about its own origin on the floor) */
  ['PROP_musht', 'HIT_musht'].forEach((n) => { const o = get(n); if (o && extras(get('PROP_kitab')).c3_book) { o.scale.multiplyScalar(1.35); o.updateMatrixWorld(true); } });
  const showWhen = []; props.scene.traverse((o) => { const v = extras(o).visible_when; if (v) { showWhen.push({ o, v }); o.visible = false; } });
  const reveal = (place) => showWhen.forEach((x) => { if (x.v === place + '_open' && !(items[x.o.name.replace(/^PROP_/, '')] || {}).gone) x.o.visible = true; });
  const anims = {};
  const mixers = [];
  [env, props].forEach((g) => {
    if (!g.animations || !g.animations.length) return;
    const mx = new THREE.AnimationMixer(g.scene); mixers.push(mx);
    g.animations.forEach((clip) => { anims[clip.name] = { mx, clip, act: mx.clipAction(clip) }; });
  });
  const clipFor = (obj) => { const k = Object.keys(anims).find((n) => n === 'ACT_' + obj.replace(/^ANIM_/, '') + '_open' || n.includes(obj.replace(/^ANIM_/, '')) || n.includes(obj)); return k ? anims[k] : null; };
  function playOpen(names, open = true) {
    const ps = names.map((n) => {
      const a = clipFor(n); if (!a) return Promise.resolve();
      const act = a.act; act.setLoop(THREE.LoopOnce, 1); act.clampWhenFinished = true; act.enabled = true;
      act.timeScale = (open ? 1 : -1) * (reduced ? 8 : 1);
      if (open) { act.reset(); act.paused = false; act.play(); } else { act.paused = false; if (!act.isRunning()) { act.time = a.clip.duration; act.play(); } }
      return new Promise((r) => setTimeout(r, (a.clip.duration * 1000) / Math.abs(act.timeScale) + 30));
    });
    return Promise.all(ps);
  }
  // hotspots of the closed places
  const hs = {};
  Object.keys(PLACES).forEach((p) => { hs[p] = { p, ...PLACES[p], hit: get('HIT_hs_' + p) || get('HS_' + p), mark: get('HS_' + p), done: false, visited: false }; });
  const goalBag = get('GOAL_backpack');
  const backpack = get('ANIM_backpack');
  const morph = (obj, key2, v) => { if (!obj) return; obj.traverse((o) => { if (o.morphTargetDictionary && key2 in o.morphTargetDictionary) o.morphTargetInfluences[o.morphTargetDictionary[key2]] = v; }); };
  const boxStars = [1, 2, 3, 4].map((i) => get('ANIM_box_star_' + i)).filter(Boolean);
  boxStars.forEach((s2) => s2.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); o.material.emissive = new THREE.Color('#000'); } }));
  const locks = [1, 2, 3].map((i) => get('LOCK_' + i)).filter(Boolean);
  { const st2 = get('DECO_lunchbag_stitch'); if (st2 && !extras(st2).c3) st2.visible = false; } // C2 loose threads; the C3 seam is flush
  const boxLamp = get('DECO_box_lamp'); if (boxLamp) boxLamp.visible = false;

  /* Bariq (3D, rigged): float + bob, faces the child, warm point light = the «lamp» of the concept */
  const brq = bq.scene; const brqRoot = new THREE.Group(); scene.add(brqRoot); brqRoot.add(brq); brq.position.set(0, 0, 0);
  const bones = {}; brq.traverse((o) => { if (o.isBone) bones[o.name] = o; if (o.isMesh) { o.frustumCulled = false; if (o.material) { o.material = o.material.clone(); } } });
  brq.traverse((o) => { if (!o.isMesh || !o.material) return; const m = o.material; const n = m.name || '';
    if (/^bq$|body/i.test(n)) { m.emissive = new THREE.Color('#FFB21E'); m.emissiveIntensity = /painted/i.test(n) ? 0.2 : 0.32; }
    else if (/white/i.test(n)) { m.emissive = new THREE.Color('#FFF4E2'); m.emissiveIntensity = 0.22; } });
  const boneRest = {}; Object.entries(bones).forEach(([n, b]) => { boneRest[n] = b.quaternion.clone(); });
  const glowTex = radialTex([[0, 'rgba(255,214,120,0.85)'], [0.35, 'rgba(255,190,90,0.35)'], [1, 'rgba(255,170,60,0)']]);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 }));
  halo.scale.set(1.3, 1.3, 1); brqRoot.add(halo); halo.renderOrder = -1;
  const brqLight = new THREE.PointLight('#FFC46B', 1.2, 3.2, 1.6); brqRoot.add(brqLight);
  let brqGlow = 1.0, brqGlowTo = 1.0;
  /* Bariq is 0.45 m; in the close shots Blender gives a display scale per mark (MARK_bariq_<shot>.display_scale) so he stays ≈ ¼ of the
     frame and never hides the things (he floats — the only thing that may) */
  const brqState = { from: new THREE.Vector3(), to: new THREE.Vector3(), t: 1, dur: 0.8, act: null, actT: 0, s0: 1, s1: 1, sc: 1 };
  function brqGo(p, sc, dur) { brqState.from.copy(brqRoot.position); brqState.to.copy(p); brqState.s0 = brqState.sc; brqState.s1 = sc; brqState.t = 0; brqState.dur = reduced ? 0.05 : dur; return sleep(brqState.dur * 1000); }
  /* R-fix (review F4): Codex marks put him behind the chair back (lunch bag) and 1 m from the lens (final, ⅓ of the frame).
     Resolve every mark against its shot camera: keep the mark's screen spot (or a per-shot override), pull him in front of any occluder
     (scale shrinks with the distance → same screen size), then clamp his height to a band of the frame. */
  const BRQ_H = 0.45;
  const BRQ_SHOT = { // frac = [min, max] of frame height; at = NDC override of his centre
    CAM_master: { frac: [0.1, 0.16] }, CAM_win: { frac: [0.12, 0.17] }, CAM_final: { frac: [0.14, 0.2], at: [0.6, 0.38] },
    CAM_lunchbag: { frac: [0.16, 0.22] }, CAM_box: { frac: [0.15, 0.2], at: [0.8, -0.12] },
  };
  const rc = new THREE.Raycaster(); const tmpCam = new THREE.PerspectiveCamera();
  const isShown = (o, ex) => { for (let x = o; x; x = x.parent) { if (!x.visible || ex.includes(x.name)) return false; if (/^HIT_|^BB_|majed_bb/.test(x.name)) return false; } return true; };
  function brqResolve(p, sc, camName, live) {
    const c = live || cams[camName]; if (!c) return [p, sc];
    tmpCam.position.copy(c.pos); tmpCam.quaternion.copy(c.q); tmpCam.aspect = aspect(); tmpCam.near = 0.05; tmpCam.far = 60;
    tmpCam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(c.hf / 2) / tmpCam.aspect)); tmpCam.updateMatrixWorld(true); tmpCam.updateProjectionMatrix();
    const cfg = live ? { frac: [0, 9] } : (BRQ_SHOT[camName] || { frac: [0.16, 0.24] });
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(c.q);
    let q = p.clone();
    if (cfg.at) { const depth = q.clone().sub(c.pos).dot(fwd); q = new THREE.Vector3(cfg.at[0], cfg.at[1], 0.5).unproject(tmpCam).sub(c.pos).normalize(); q.multiplyScalar(depth / q.dot(fwd)).add(c.pos); }
    const ndc = q.clone().project(tmpCam); // keep him in the free band under the HUD
    if (!live && (ndc.y > 0.42 || Math.abs(ndc.x) > 0.8)) { const depth = q.clone().sub(c.pos).dot(fwd); ndc.y = Math.min(ndc.y, 0.42); ndc.x = clamp(ndc.x, -0.8, 0.8); ndc.z = 0.5; q = ndc.unproject(tmpCam).sub(c.pos).normalize(); q.multiplyScalar(depth / q.dot(fwd)).add(c.pos); }
    const tanV = Math.tan(THREE.MathUtils.degToRad(tmpCam.fov) / 2);
    let d = q.clone().sub(c.pos).dot(fwd), s = sc;
    let f = (BRQ_H * s) / (2 * d * tanV); f = clamp(f, cfg.frac[0], cfg.frac[1]); s = (f * 2 * d * tanV) / BRQ_H;
    // occlusion: 5 rays to his centre and corners; pull him toward the lens in front of the nearest hit
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(c.q), up = new THREE.Vector3(0, 1, 0).applyQuaternion(c.q);
    let k = 1;
    [[0, 0], [-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1]].forEach(([a, b]) => {
      const t = q.clone().addScaledVector(right, a * 0.26 * s).addScaledVector(up, b * 0.24 * s); const dir = t.clone().sub(c.pos); const L = dir.length(); dir.normalize();
      rc.set(c.pos, dir); rc.far = L; const hit = rc.intersectObjects([env.scene, props.scene], true).find((x) => isShown(x.object, c.ex || []));
      if (hit) k = Math.min(k, (hit.distance / L) * 0.86);
    });
    if (k < 1) { k = Math.max(k, 0.25); q = c.pos.clone().add(q.clone().sub(c.pos).multiplyScalar(k)); s *= k; }
    return [q, s];
  }
  function brqTo(markName, dur = 0.9) {
    const m = get(markName); if (!m) return Promise.resolve();
    const p = new THREE.Vector3(); m.getWorldPosition(p);
    const [q, s] = brqResolve(p, +(extras(m).display_scale || 1), extras(m).shot || ('CAM_' + markName.replace('MARK_bariq_', '')));
    return brqGo(q, s, dur);
  }
  function brqNear(obj, dur = 0.8) { // float just ABOVE a thing (help / demo): points down at it, never covers it or its neighbours
    const b = new THREE.Box3().setFromObject(obj, true); const c = b.getCenter(new THREE.Vector3()); const sz = b.getSize(new THREE.Vector3());
    const sc = brqState.s1 || 1;
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize(); // screen-up direction in the world
    const p = c.clone().addScaledVector(up, sz.y * 0.5 + 0.27 * sc + 0.04);
    const toCam = camera.position.clone().sub(p).normalize(); p.addScaledVector(toCam, 0.05 * sc);
    const ndc = p.clone().project(camera); if (ndc.y > 0.62) { ndc.y = 0.62; p.copy(ndc.unproject(camera)); } // stay under the HUD
    const [q, s2] = brqResolve(p, sc, null, { pos: camera.position.clone(), q: camera.quaternion.clone(), hf: camCur ? camCur.hf : 1, ex: exNow.map((o) => o.name) }); // never behind the chair back
    return brqGo(q, s2, dur);
  }
  const brqAct = (k) => { brqState.act = k; brqState.actT = 0; };
  {
    const m0 = get('MARK_bariq_master'); if (m0) { const p0 = new THREE.Vector3(); m0.getWorldPosition(p0); const [q0, s0] = brqResolve(p0, +(extras(m0).display_scale || 1), 'CAM_master'); brqRoot.position.copy(q0); brqState.sc = brqState.s1 = s0; brqRoot.scale.setScalar(s0); }
  }

  /* majed billboard (2.5D from art, if present) */
  if (majTex && get('BB_majed')) {
    const im = majTex.image; const ar = im.width / im.height; const H = +(man.majed_h || 1.0);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(H * ar, H), new THREE.MeshBasicMaterial({ map: majTex, transparent: true, alphaTest: 0.05 }));
    mesh.position.y = H / 2; const g = new THREE.Group(); g.add(mesh); get('BB_majed').getWorldPosition(g.position); g.name = 'majed_bb'; scene.add(g);
    byName.majed_bb = g; g.userData.mesh = mesh;
    if (backpack) backpack.visible = false; // Majed holds his backpack in the billboard art
  }

  /* fx sprites */
  const ringG = ringTex('#22C27A'), ringGold = ringTex('#FFC21A'), plTex = placeTex();
  const sTex = starTex();
  const fxList = [];
  function spriteAt(tex, pos, size, life, opts = {}) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: opts.add === false ? THREE.NormalBlending : THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true }));
    sp.position.copy(pos); sp.scale.set(size, size, 1); sp.renderOrder = 20; scene.add(sp);
    fxList.push({ sp, t: 0, life, size, grow: opts.grow == null ? 0.35 : opts.grow, vel: opts.vel || null, keep: !!opts.keep });
    return sp;
  }
  const sparkTex = {};
  function sparks(pos, n = 14, col = '#FFD34E') {
    const tex = sparkTex[col] || (sparkTex[col] = radialTex([[0, '#fff'], [0.3, col], [1, 'rgba(255,200,60,0)']], 64));
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const v = new THREE.Vector3(Math.cos(a), 0.6 + Math.random() * 0.6, Math.sin(a)).multiplyScalar(0.55); spriteAt(tex, pos, 0.06, 0.7, { vel: v, grow: -0.5 }); }
  }
  const ceilStars = [];
  function ceilingStar(i) {
    const P = [[-1.2, -3.2], [0.4, -2.6], [1.4, -3.6], [-0.4, -1.8], [1.0, -1.6], [-1.8, -2.2], [0.0, -4.0], [1.9, -2.5]][i % 8];
    const sp = spriteAt(sTex, new THREE.Vector3(P[0], 2.6, P[1]), 0.0, 1e9, { keep: true, grow: 0, add: false }); sp.material.depthTest = true; sp.material.opacity = 1;
    ceilStars.push({ sp, t: 0 });
  }

  /* ---------- HUD (HTML, RTL) */
  const hud = h('div.g9-hud');
  const instrSlot = h('div.g9-ins');
  const muteBtn = h('button.bq8-btn.bq8-btn--sm.g9-mute', { type: 'button', 'aria-label': 'كَتْمُ الصَّوْتِ' }, h('i.bq8-ic.bq8-ic--sound_off'));
  const homeBtn = h('button.bq8-btn.bq8-btn--home', { type: 'button', 'aria-label': 'الغُرْفَةُ', hidden: '' }, h('i.bq8-ic.bq8-ic--home'));
  const albumBtn = h('button.bq8-btn.bq8-btn--hint', { type: 'button', 'aria-label': 'الأَلْبومُ' }, h('i.bq8-ic.bq8-ic--book'));
  hud.append(instrSlot, h('i.g9-sp'), homeBtn, muteBtn, albumBtn);
  const starsEl = h('div.g9-stars', { 'aria-hidden': 'true' }); const stars = [];
  for (let i = 0; i < 8; i++) { if (i === 4) starsEl.append(h('i.gap')); const s2 = h('i'); stars.push(s2); starsEl.append(s2); }
  const bagEl = h('div.g9-bag', { html: BAG_SVG }); const bagN = h('b'); bagN.textContent = '٠'; bagEl.append(bagN);
  const album = h('div.g9-album', { hidden: '' });
  const ALB = ['manju', 'miftah', 'musht', 'maktab', 'mawz', 'qalam', 'qamis', 'qamar'];
  const albSt = {}; ALB.forEach((s) => { const st = h('div.st', { 'data-s': s }); st.addEventListener('click', () => { if (st.classList.contains('is-on')) say('bq7_W_' + s); }); albSt[s] = st; album.append(st); });
  const albX = h('button.bq8-btn.bq8-btn--home.x', { type: 'button', 'aria-label': 'إِغْلاقٌ' }, h('i.bq8-ic.bq8-ic--close'));
  album.append(albX);
  const chip = h('div.g9-chip', { 'aria-hidden': 'true' });
  const wordBox = h('div.g9-word', { hidden: '' });
  box.append(hud, starsEl, bagEl, chip, wordBox, album);
  if (api.mountInstr) api.mountInstr(instrSlot);
  let nStar = 0; const starOn = () => { if (stars[nStar]) stars[nStar].classList.add('is-on'); nStar++; ceilingStar(nStar - 1); };
  let nBag = 0; const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const bagPop = () => { nBag++; bagN.textContent = AR(nBag); bagEl.classList.remove('is-pop'); void bagEl.offsetWidth; bagEl.classList.add('is-pop'); setTimeout(() => bagEl.classList.remove('is-pop'), 300); };
  const albAdd = (s, heard) => { const st = albSt[s]; if (!st || st.classList.contains('is-on')) return; st.classList.add('is-on'); st.append(h('img', { src: man.icons ? BASE + 'assets/icons/icon_' + s + '.webp' : api.img('card_' + s), alt: '' })); if (heard) st.append(h('span.ear', { html: EAR })); };
  muteBtn.addEventListener('click', () => { muted = !muted; muteBtn.classList.toggle('is-active', muted); if (muted && api.stopAudio) api.stopAudio(); });
  albumBtn.addEventListener('click', () => { album.hidden = !album.hidden; });
  albX.addEventListener('click', () => { album.hidden = true; });

  /* ---------- picking (projected boxes grown to ≥ MIN px; the smaller thing wins) */
  const W = () => box.clientWidth, Hh = () => box.clientHeight;
  const k1180 = () => W() / 1130;
  const v3 = new THREE.Vector3();
  function screenRect(obj) {
    const b = new THREE.Box3().setFromObject(obj, true); if (b.isEmpty()) return null;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, behind = false;
    for (let i = 0; i < 8; i++) {
      v3.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(camera);
      if (v3.z > 1) behind = true;
      const x = (v3.x + 1) / 2 * W(), y = (1 - v3.y) / 2 * Hh(); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
    if (behind) return null;
    return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  }
  function grown(r, min) {
    const m = min * k1180(); const w = Math.max(r.x1 - r.x0, m), hh = Math.max(r.y1 - r.y0, m);
    return { x0: r.cx - w / 2, x1: r.cx + w / 2, y0: r.cy - hh / 2, y1: r.cy + hh / 2, cx: r.cx, cy: r.cy, area: w * hh };
  }
  let targetsNow = []; // [{key, obj, min, fn}]
  function pick(x, y) {
    let best = null;
    targetsNow.forEach((t) => { const r0 = screenRect(t.obj); if (!r0) return; const r = grown(r0, t.min); if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1 && (!best || r.area < best.r.area)) best = { t, r }; });
    return best && best.t;
  }
  let lock = true; const setLock = (v) => { lock = v; box.dataset.lock = v ? '1' : '0'; };
  let idleT = 0;
  const toLayout = (e) => { const r = box.getBoundingClientRect(); const k = r.width / W(); return [(e.clientX - r.left) / k, (e.clientY - r.top) / k]; };
  renderer.domElement.addEventListener('pointerdown', (e) => {
    idleT = 0; const [x, y] = toLayout(e);
    const rp = h('i.g9-rip'); rp.style.left = x + 'px'; rp.style.top = y + 'px'; box.append(rp); setTimeout(() => rp.remove(), 480);
    if (lock || !album.hidden) return;
    const t = pick(x, y); if (t) { logEv('tap', t.key); t.fn(); }
  });

  /* ---------- per-frame */
  const clock = new THREE.Clock(); let frames = 0, fpsAcc = 0, fps = 60, slow = 0;
  const glowSprites = {}; // hotspot glows
  function hsGlow(p, on) {
    let g = glowSprites[p];
    if (!g && on) { const o = hs[p].hit || hs[p].mark; if (!o) return; const b = new THREE.Box3().setFromObject(o, true); const c = b.getCenter(new THREE.Vector3()); const s = b.getSize(new THREE.Vector3());
      const d = camera.position.distanceTo(c), wpp = 2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) / Math.max(1, Hh());
      const sz = Math.max(Math.min(Math.max(s.x, s.y) * 1.05, 1.5), MIN_HS * k1180() * wpp * 1.05);
      g = glowSprites[p] = spriteAt(plTex, c, sz, 1e9, { keep: true, grow: 0, add: false }); g.userData.size = sz; g.material.opacity = 0; }
    if (g) g.userData.on = on;
  }
  let itemGlow = {};
  function thingGlow(s, kind) { // kind: null | 'say' | 'help' | 'gold' | 'ok'
    const it = items[s]; if (!it || !it.mats) return; itemGlow[s] = kind;
    const col = { say: '#FFB347', help: '#FFD34E', gold: '#FFC21A', ok: '#22C27A' }[kind];
    it.mats.forEach((m) => { if (!m.emissive) return; m.emissive.set(col || '#000'); m.emissiveIntensity = kind ? (kind === 'help' ? 0.35 : 0.45) : 0; });
  }
  const lifts = {};
  function lift(s, up) { const it = items[s]; if (!it || !it.prop) return; lifts[s] = { t: 0, from: it.prop.position.y, to: it.rest.y + (up ? 0.03 : 0) }; }
  function resize() {
    const w = W(), hh = Hh(); if (!w || !hh) return;
    renderer.setPixelRatio(pr * (api.stageScale ? api.stageScale() : 1)); renderer.setSize(w, hh, false);
    camera.aspect = w / hh; if (camCur) setFovFromH(camCur.hf); else camera.updateProjectionMatrix();
  }
  let ro = null; try { ro = new ResizeObserver(resize); ro.observe(box); } catch (e) { window.addEventListener('resize', resize); }
  resize();
  let raf = 0;
  function frame() {
    if (!alive || !api.alive() || !box.isConnected) { alive = false; try { ro && ro.disconnect(); } catch (e) { /* */ } renderer.dispose(); return; }
    raf = requestAnimationFrame(frame); { const now = performance.now(); if (frame.last) { const g = now - frame.last; frame.gaps = (frame.gaps || []).concat(Math.round(g)).slice(-40); } frame.last = now; }
    const dtR = Math.min(clock.getDelta(), 0.5), dt = Math.min(dtR, 0.1), T = clock.elapsedTime; // tweens use real time (dtR) so a slow device never stretches a glide
    frames++; fpsAcc += dtR; if (fpsAcc >= 1) { fps = frames / fpsAcc; frames = 0; fpsAcc = 0; if (fps < 50 && pr > 1) { slow++; if (slow >= 2) { pr = Math.max(1, pr - 0.25); resize(); slow = 0; } } else slow = 0; }
    mixers.forEach((m) => m.update(dtR));
    if (glideT) {
      glideT.t += dtR / glideT.dur; const k = ease(clamp(glideT.t, 0, 1));
      camera.position.lerpVectors(glideT.from.pos, glideT.to.pos, k);
      camera.quaternion.slerpQuaternions(glideT.from.q, glideT.to.q, k);
      const hf = glideT.from.hf + (glideT.to.hf - glideT.from.hf) * k; setFovFromH(hf); camCur = { hf };
      if (!glideT.exDone && glideT.t >= 0.5) { glideT.exDone = true; applyEx(glideT.to); }
      if (glideT.t >= 1) { const d = glideT.done; camCur = { pos: glideT.to.pos.clone(), q: glideT.to.q.clone(), hf: glideT.to.hf }; glideT = null; d(); }
    }
    // Bariq: travel, bob, face the camera, actions
    if (brqState.t < 1) { brqState.t = Math.min(1, brqState.t + dtR / brqState.dur); const e3 = ease(brqState.t); brqRoot.position.lerpVectors(brqState.from, brqState.to, e3); brqState.sc = brqState.s0 + (brqState.s1 - brqState.s0) * e3; brqRoot.scale.setScalar(brqState.sc); }
    let bob = Math.sin(T * Math.PI) * 0.025, tilt = 0, sq = 1, armL = 0, armR = 0;
    if (brqState.act) {
      brqState.actT += dt; const a = brqState.actT;
      if (brqState.act === 'hop') { bob += Math.sin(Math.min(1, a / 0.5) * Math.PI) * 0.14; sq = 1 + Math.sin(Math.min(1, a / 0.5) * Math.PI) * 0.06; armL = armR = Math.sin(Math.min(1, a / 0.5) * Math.PI) * 1.4; if (a > 0.6) brqState.act = null; }
      else if (brqState.act === 'think') { tilt = Math.sin(Math.min(1, a / 1.1) * Math.PI) * 0.22; if (a > 1.2) brqState.act = null; }
      else if (brqState.act === 'clap') { armL = armR = 0.9 + Math.abs(Math.sin(a * 9)) * 0.5; if (a > 1.2) brqState.act = null; }
      else if (brqState.act === 'point') { armR = 1.2; if (a > 1.6) brqState.act = null; }
      else if (brqState.act === 'cheer') { bob += Math.abs(Math.sin(a * 5)) * 0.08; armL = 1.5 + Math.sin(a * 9) * 0.45; armR = 1.5 + Math.sin(a * 9 + 1.6) * 0.45; if (a > 2.2) brqState.act = null; }
    }
    brq.position.y = bob * 1; brq.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
    fill.position.copy(camera.position).add(new THREE.Vector3(0, 0.35, 0)); camera.getWorldDirection(fill.target.position); fill.target.position.multiplyScalar(2).add(camera.position);
    if (byName.majed_bb) { const g = byName.majed_bb, d = camera.position.distanceTo(g.position); g.visible = d > 1.1; } // never sweeps through the lens during a glide
    camera.getWorldPosition(lookTmp); const yaw = Math.atan2(lookTmp.x - brqRoot.position.x, lookTmp.z - brqRoot.position.z);
    brq.rotation.set(0, yaw, tilt);
    const armBone = (n, v, sgn) => { const b = bones[n]; if (!b || !boneRest[n]) return; b.quaternion.copy(boneRest[n]); if (v) b.rotateZ(sgn * v * 0.6); };
    armBone('arm_L1', armL, 1); armBone('arm_R1', armR, -1);
    if (byName.majed_bb) { const g = byName.majed_bb; g.rotation.y = Math.atan2(lookTmp.x - g.position.x, lookTmp.z - g.position.z); }
    brqGlow += (brqGlowTo - brqGlow) * Math.min(1, dt * 2);
    brqLight.intensity = 0.55 + 0.3 * brqGlow; /* review: capped (the open lunch bag liner burned out at glow 2.4) */ brqLight.distance = 3.2 * Math.max(0.35, brqState.sc); halo.material.opacity = 0.35 + 0.18 * brqGlow + Math.sin(T * 2) * 0.04; halo.scale.setScalar(1.1 + 0.15 * brqGlow);
    // blink
    const bl = (T % 3.7) < 0.12 ? 1 : 0; brq.traverse((o) => { if (o.morphTargetDictionary && 'blink' in o.morphTargetDictionary) o.morphTargetInfluences[o.morphTargetDictionary.blink] = bl; });
    // lifts
    Object.entries(lifts).forEach(([s, l]) => { l.t = Math.min(1, l.t + dt / 0.12); const it = items[s]; if (it && it.prop) it.prop.position.y = l.from + (l.to - l.from) * l.t; if (l.t >= 1) delete lifts[s]; });
    // pulsing help glows
    Object.entries(itemGlow).forEach(([s, k]) => { if (k !== 'help') return; const it = items[s]; it.mats.forEach((m) => { if (m.emissive) m.emissiveIntensity = 0.12 + 0.2 * (0.5 + 0.5 * Math.sin(T * 5)); }); });
    // hotspot glows breathe
    fxList.forEach((f) => { if (f.sp.userData.pulse) f.sp.material.opacity = 0.55 + 0.4 * (0.5 + 0.5 * Math.sin(T * 5)); });
    Object.values(glowSprites).forEach((g) => { const want = g.userData.on ? (0.82 + 0.18 * Math.sin(T * 3)) : 0; g.material.opacity += (want - g.material.opacity) * Math.min(1, dt * 4);
      g.scale.setScalar(g.userData.size * (1 + (idleT > 10 ? 0.07 : 0.035) * Math.sin(T * 3))); });
    ceilStars.forEach((c) => { c.t = Math.min(1, c.t + dt / 0.8); c.sp.scale.setScalar(0.3 * ease(c.t) * (1 + Math.sin(T * 2 + c.sp.id) * 0.05)); });
    for (let i = fxList.length - 1; i >= 0; i--) {
      const f = fxList[i]; if (f.keep) continue; f.t += dt; const k = f.t / f.life;
      if (f.vel) { f.sp.position.addScaledVector(f.vel, dt); f.vel.y -= dt * 1.2; }
      f.sp.scale.setScalar(Math.max(0.001, f.size * (1 + f.grow * k))); f.sp.material.opacity = 1 - k;
      if (k >= 1) { scene.remove(f.sp); f.sp.material.dispose(); fxList.splice(i, 1); } // textures are shared (cached), only the material goes
    }
    idleT += dt;
    if (idleT > 20) hudEar(true);
    renderer.render(scene, camera);
  }
  const hudEar = (on) => { const b = instrSlot.querySelector('.elp-say, button'); if (b) b.classList.toggle('is-pulse', !!on); };

  /* QA hooks (no visual effect): current shot / lock / tappable keys, a thing's on-screen box in client px, fps */
  window.__g9 = {
    state: () => ({ gaps: (frame.gaps || []).join(','), shot: box.dataset.shot, lock, keys: targetsNow.map((t) => t.key), found: res.found, wrong: res.wrong, stars: nStar, fps: Math.round(fps), pr, calls: renderer.info.render.calls, tris: renderer.info.render.triangles, tex: renderer.info.memory.textures, geo: renderer.info.memory.geometries }),
    rect: (key) => { const t = targetsNow.find((x) => x.key === key); if (!t) return null; const r0 = screenRect(t.obj); if (!r0) return null; const g = grown(r0, t.min);
      const b = box.getBoundingClientRect(), k = b.width / W(); const cx = (v) => b.left + v * k, cy = (v) => b.top + v * k;
      return { x: cx(r0.cx), y: cy(r0.cy), vis: [cx(r0.x0), cy(r0.y0), cx(r0.x1), cy(r0.y1)], hit: [cx(g.x0), cy(g.y0), cx(g.x1), cy(g.y1)] }; },
    log: LOG,
    q: (n) => { const o = get(n); if (!o) return null; const b = new THREE.Box3().setFromObject(o, true); const m = []; o.traverse((x) => { if (x.isMesh) m.push({ n: x.name, t: x.material.type, c: x.material.color && x.material.color.getHexString(), map: !!x.material.map, e: x.material.emissive && x.material.emissive.getHexString(), side: x.material.side, op: x.material.opacity, tr: x.material.transparent, vc: !!x.geometry.attributes.color, uv2: !!x.geometry.attributes.uv1 }); });
      return { min: b.min.toArray().map((v) => +v.toFixed(3)), max: b.max.toArray().map((v) => +v.toFixed(3)), vis: o.visible, m }; },
    names: () => Object.keys(byName),
    boxes: () => targetsNow.map((t) => { const it = items[t.key]; const ro = (o) => { const r = o && screenRect(o); return r ? [r.x0, r.y0, r.x1, r.y1].map(Math.round) : null; };
      const r0 = screenRect(t.obj); const g = r0 && grown(r0, t.min); return { key: t.key, hit: g ? [g.x0, g.y0, g.x1, g.y1].map(Math.round) : null, prop: ro(it && it.prop), proxy: ro(t.obj) }; }),
  };
  /* ---------- world ready */
  snapCam('CAM_master');
  /* warm-up behind the loading card: compile every material and upload every texture now (incl. things hidden until a place
     opens), so the first glide into a place does not stall on shader compiles / texture uploads */
  try {
    showWhen.forEach((x) => { x.o.visible = true; });
    const texs = new Set(); scene.traverse((o) => { if (o.material) [].concat(o.material).forEach((m) => { ['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'].forEach((k) => { if (m[k]) texs.add(m[k]); }); }); });
    texs.forEach((t) => renderer.initTexture(t));
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera); else renderer.compile(scene, camera);
    Object.keys(cams).forEach((n) => { snapCam(n); renderer.render(scene, camera); });
    showWhen.forEach((x) => { x.o.visible = false; });
    snapCam('CAM_master');
  } catch (e) { /* warm-up is best effort */ }
  if (!ok()) return res;
  frame();
  load.classList.add('is-gone'); setTimeout(() => load.remove(), 700);
  box.dataset.shot = 'master';
  // close everything that should start closed
  backpack && morph(backpack, 'bulge', 0);

  /* ---------- feedback pieces */
  const flyItem = async (it) => { // the thing arcs toward the HUD backpack (bottom-left) and goes in
    const o = it.prop; if (!o) return;
    const start = new THREE.Vector3(); o.getWorldPosition(start); const s0 = o.scale.clone();
    const r = bagEl.getBoundingClientRect(), bx = box.getBoundingClientRect(), k = bx.width / W();
    const sx = ((r.left - bx.left) / k + r.width / k / 2) / W() * 2 - 1, sy = -(((r.top - bx.top) / k + r.height / k / 2) / Hh() * 2 - 1);
    const end = new THREE.Vector3(sx, sy, 0.5).unproject(camera); const dir = end.sub(camera.position).normalize(); const target = camera.position.clone().add(dir.multiplyScalar(0.6));
    const mid = start.clone().lerp(target, 0.5).add(new THREE.Vector3(0, 0.25, 0));
    const t1 = performance.now(), dur = reduced ? 60 : 750;
    await new Promise((res2) => { const step = () => { const t = clamp((performance.now() - t1) / dur, 0, 1); const e2 = ease(t);
      const a = start.clone().lerp(mid, e2), b = mid.clone().lerp(target, e2); const p = a.lerp(b, e2);
      o.parent.worldToLocal(p); o.position.copy(p); o.scale.copy(s0).multiplyScalar(1 - 0.75 * e2); o.rotation.y += 0.15;
      if (t < 1 && alive) requestAnimationFrame(step); else res2(); }; step(); });
    o.visible = false; bagPop(); morph(backpack, 'bulge', Math.min(1, nBag / 4));
  };
  const markNo = (it) => { const r = screenRect(it.hit || it.prop); if (!r) return; const m = h('span.g9-no', { html: MARK_NO }); m.style.left = r.cx + 'px'; m.style.top = Math.max(70 * k1180(), r.y0 + (r.y1 - r.y0) * 0.32) + 'px'; box.append(m); setTimeout(() => m.remove(), 1900); };
  const earBadge = (it) => { const r = screenRect(it.hit || it.prop); if (!r) return null; const m = h('span.g9-ear', { html: EAR }); m.style.left = r.x1 + 'px'; m.style.top = r.y0 + 'px'; box.append(m); return m; };
  const center = (it) => { const b = new THREE.Box3().setFromObject(it.hit || it.prop, true); return b.getCenter(new THREE.Vector3()); };
  const ringSize = (it) => { const b = new THREE.Box3().setFromObject(it.prop || it.hit, true); const z = b.getSize(new THREE.Vector3()); return clamp(Math.max(z.x, z.y, z.z) * 1.5, 0.14, 0.7); };
  let pI = 0; const praise = () => PRAISE[(pI++) % PRAISE.length];
  let tI = 0, sI = 0, midSeen = false, streak = 0, clean = true, earEls = [];
  const instr = (id) => { curInstr = id; return api.instruction ? api.instruction(id) : say(id); };
  let curInstr = null;

  async function showChip(it) {
    const [a, m, z] = wordParts(it.word, it.m);
    const w = h('span.w', { lang: 'ar' }, h('span', null, a), h('span.m', null, m), h('span', null, z));
    const d = h('span.d', null, [0, 1, 2].map((k) => h('i', { class: (k === (it.pos === 'mid' ? 1 : 2) ? 'on' : '') })));
    chip.replaceChildren(w, d);
    const r = screenRect(it.hit || it.prop) || { cx: W() / 2, cy: Hh() / 2, x0: W() / 2, x1: W() / 2, y0: Hh() / 2, y1: Hh() / 2 };
    /* R-fix (review F12): the chip must not cover a thing that is still to be found (قَلَم's chip hid the key) → try above, below, beside */
    const k = k1180(), cw = 300 * k, ch = 290 * k; // chip box ≈ 300 × 290 design px; anchor = bottom centre
    const others = targetsNow.filter((t) => t.key !== it.s && items[t.key] && !items[t.key].gone).map((t) => screenRect(t.obj)).filter(Boolean);
    const hits = (x, y) => others.reduce((a, o) => a + Math.max(0, Math.min(x + cw / 2, o.x1) - Math.max(x - cw / 2, o.x0)) * Math.max(0, Math.min(y, o.y1) - Math.max(y - ch, o.y0)), 0);
    const cands = [[r.cx, r.y0 - 16 * k], [r.cx, r.y1 + ch + 10 * k], [r.x0 - cw / 2 - 12 * k, r.cy + ch / 2], [r.x1 + cw / 2 + 12 * k, r.cy + ch / 2]]
      .map(([x, y]) => [clamp(x, 200 * k, W() - 200 * k), clamp(y, 140 * k + ch, Hh() - 20 * k)]);
    others.push(r); // never on the thing itself either
    let best = cands[0], bv = 1e18; cands.forEach((c2, i) => { const v = hits(c2[0], c2[1]) + i; if (v < bv) { bv = v; best = c2; } });
    chip.style.left = best[0] + 'px'; chip.style.top = best[1] + 'px'; chip.classList.add('is-on');
    return { w, d };
  }
  async function midHeard(it) { // OWNER 2026-10-05: «قميص/قلم ليست خطأ» — praise hearing the meem, show where it sits, remind the rule
    const first = !midSeen; midSeen = true;
    if (!res.mid_heard.some((x) => x.slug === it.s)) res.mid_heard.push({ slug: it.s, pos: it.pos });
    res.items.push({ slug: it.s, ok: true, how: 'mid_heard', view: box.dataset.shot });
    thingGlow(it.s, 'gold'); spriteAt(ringGold, center(it), ringSize(it), 1.2, { grow: 0.6 }); brqAct('clap');
    if (api.fx) api.fx('ok', 0.5);
    if (first) { await say(L.midYes); if (!ok()) return; }
    const c = await showChip(it); c.w.classList.add('is-pulse');
    await say('bq7_W_' + it.s + '_seg'); if (!ok()) return;
    await say(it.pos === 'mid' ? L.posMid : L.posLast); if (!ok()) return;
    if (first) { c.d.children[0].classList.add('want'); await say(L.midRule); if (!ok()) return; }
    chip.classList.remove('is-on'); thingGlow(it.s, null);
    if (!it.heard) { it.heard = true; const e = earBadge(it); if (e) earEls.push(e); albAdd(it.s, true); }
  }
  async function wrongTap(it, place, targetS) {
    res.wrong++; streak++; clean = false; res.items.push({ slug: it.s, ok: false, how: 'distractor', view: box.dataset.shot });
    markNo(it); brqAct('think'); if (api.fx) api.fx('no', 0.4);
    await sleep(250);
    await say(TRY[(tI++) % TRY.length]); if (!ok()) return;
    if (streak < 2) { await say(L.hintStart); return; }
    // ✗2 in a row → Bariq floats beside the answer and lights it; the child still touches it (no star? yes a star: the find is correct, S1 = not first-try)
    streak = 0; const tg = items[targetS]; if (!tg || tg.gone) return;
    tg.hinted = true; thingGlow(targetS, 'help');
    const hb = new THREE.Box3().setFromObject(tg.hit || tg.prop, true); const hz = hb.getSize(new THREE.Vector3());
    tg.halo = spriteAt(plTex, hb.getCenter(new THREE.Vector3()), Math.max(hz.x, hz.y, hz.z) * 1.9, 1e9, { keep: true, grow: 0, add: false }); tg.halo.userData.pulse = true;
    await brqNear(tg.hit || tg.prop); brqAct('point');
    await say(L.help);
  }
  async function found(it, place) {
    const how = it.hinted ? 'hint' : clean ? 'first' : 'after_wrong';
    const good = clean && !it.hinted;
    if (it.halo) { scene.remove(it.halo); it.halo = null; }
    thingGlow(it.s, 'ok'); spriteAt(ringG, center(it), ringSize(it), 1.0, { grow: 0.5 }); sparks(center(it));
    if (api.fx) api.fx('ok', 1);
    brqAct('hop'); brqGlowTo = Math.min(2.4, brqGlowTo + 0.3);
    res.found++; res.picks.push({ slug: it.s, ok: good, how }); res.items.push({ slug: it.s, ok: good, how, view: box.dataset.shot });
    if (how === 'first') res.first_try++; else res.after_hint++;
    api.record('S1', good, { item: it.s, from: 'E10' });
    starOn(); albAdd(it.s, false);
    streak = 0; clean = true;
    await say(praise()); if (!ok()) return;
    if (it.s !== 'maktab') { it.gone = true; thingGlow(it.s, null); await flyItem(it); if (res.found <= 2) await say(L.bag); }
  }

  async function tapThing(it, ctx2) {
    if (lock || it.gone) return;
    setLock(true); idleT = 0; hudEar(false);
    lift(it.s, true); thingGlow(it.s, itemGlow[it.s] === 'help' ? 'help' : 'say');
    await say('bq7_W_' + it.s); if (!ok()) return;
    lift(it.s, false); if (itemGlow[it.s] === 'say') thingGlow(it.s, null);
    if (it.role === 'target') { await found(it, ctx2); if (!ok()) return; ctx2.solved = true; }
    else if (it.role === 'mid') { if (it.heard) { /* a second touch only replays the name */ } else await midHeard(it); if (!ok()) return; if (ctx2.bonus) ctx2.solved = true; }
    else { await wrongTap(it, ctx2, ctx2.target); if (!ok()) return; }
    if (ctx2.solved) { ctx2.resolve(); return; }
    setLock(false);
  }

  /* ---------- a place: glide in, open, decide, glide back */
  async function enterPlace(p, opts = {}) {
    const P = hs[p]; P.visited = true; hsGlow(p, false); Object.keys(hs).forEach((q) => hsGlow(q, false));
    setLock(true); targetsNow = [];
    box.dataset.shot = p; if (!res.views_used.includes(p)) res.views_used.push(p);
    if (api.fx) api.fx('open', 0.6);
    await Promise.all([glideCam(P.cam), brqTo('MARK_bariq_' + p, GLIDE)]); if (!ok()) return;
    homeBtn.hidden = !!opts.demo; // the first, guided place has no way out
    reveal(p); await playOpen(P.opens, true); if (!ok()) return;
    if (P.wonder) { brqAct('cheer'); await say(P.wonder); if (!ok()) return; }
    const ctx2 = { place: p, target: P.target, bonus: !!P.bonus, solved: false };
    const done = new Promise((r) => { ctx2.resolve = r; P.leave = () => { ctx2.left = true; r(); }; });
    if (opts.demo) { await opts.demo(ctx2); if (!ok()) return; }
    targetsNow = P.items.filter((s) => items[s] && !items[s].gone).map((s) => ({ key: s, obj: items[s].hit || items[s].prop, min: MIN_HIT, fn: () => tapThing(items[s], ctx2) }));
    box.dataset.items = P.items.filter((s) => items[s] && !items[s].gone).join(',');
    if (!opts.demo) { await instr(L.pickThing); if (!ok()) return; }
    setLock(false); idleT = 0;
    await done; if (!ok()) return;
    setLock(true); targetsNow = []; P.leave = null;
    if (ctx2.solved && !P.bonus) P.done = true;
    if (P.bonus && ctx2.solved) P.done = true;
    homeBtn.hidden = true;
    await sleep(350);
    await playOpen(P.opens, false);
    Object.values(items).forEach((it) => { if (itemGlow[it.s]) thingGlow(it.s, null); });
    earEls.forEach((e) => e.remove()); earEls = [];
    box.dataset.shot = 'master';
    await Promise.all([glideCam('CAM_master'), brqTo('MARK_bariq_master', GLIDE)]);
  }
  homeBtn.addEventListener('click', () => { if (lock) return; const P = Object.values(hs).find((x) => x.leave); if (P) P.leave(); });

  function masterPick() {
    return new Promise((resolve) => {
      targetsNow = Object.values(hs).filter((P) => !P.done && (P.hit || P.mark)).map((P) => ({ key: 'hs_' + P.p, obj: P.hit || P.mark, min: MIN_HS, fn: () => { setLock(true); resolve(P.p); } }));
      Object.values(hs).forEach((P) => hsGlow(P.p, !P.done));
      box.dataset.items = targetsNow.map((t) => t.key).join(',');
      setLock(false); idleT = 0;
    });
  }

  /* ================= LEVEL 1 ================= */
  setLock(true);
  await sleep(500);
  brqAct('cheer'); await say(L.intro); if (!ok()) return res;
  brqGlowTo = 1.6; await say(L.light); if (!ok()) return res;
  await instr(L.rule); if (!ok()) return res;
  // demo in the lunch bag: Bariq touches the banana, it goes in the backpack; then the child chooses mango vs apple
  await enterPlace('lunchbag', { demo: async (ctx2) => {
    const m = items.mawz; if (!m) return;
    await brqNear(m.hit || m.prop); brqAct('point'); lift('mawz', true); thingGlow('mawz', 'say');
    await say('bq7_W_mawz'); if (!ok()) return;
    await say(L.demo); if (!ok()) return;
    lift('mawz', false); thingGlow('mawz', null); m.gone = true; brqAct('hop');
    await flyItem(m); albAdd('mawz', false);
    await brqTo('MARK_bariq_lunchbag', 0.6);
    await say(L.turn); if (!ok()) return;
    await instr(L.pickThing);
  } });
  if (!ok()) return res;
  hs.lunchbag.done = true;
  while (ok()) {
    const left = ['drawer_desk', 'chest'].filter((p) => !hs[p].done);
    if (!left.length) break;
    await instr(L.pickPlace); if (!ok()) return res;
    const p = await masterPick(); if (!ok()) return res;
    await enterPlace(p); if (!ok()) return res;
  }
  Object.keys(hs).forEach((q) => hsGlow(q, false));
  // the last decision: the room itself — the desk (مَكْتَب) vs the picture book (كِتاب)
  {
    setLock(true); box.dataset.shot = 'final'; res.views_used.push('final');

    await Promise.all([glideCam(FINAL.cam), brqTo('MARK_bariq_final', GLIDE)]); if (!ok()) return res;
    const ctx2 = { place: 'final', target: 'maktab', solved: false };
    const done = new Promise((r) => { ctx2.resolve = r; });
    targetsNow = FINAL.items.filter((s) => items[s]).map((s) => ({ key: s, obj: items[s].hit || items[s].prop, min: MIN_HIT, fn: () => tapThing(items[s], ctx2) }));
    box.dataset.items = FINAL.items.join(',');
    await instr(L.final); if (!ok()) return res;
    setLock(false); idleT = 0;
    await done; if (!ok()) return res;
    setLock(true); targetsNow = [];
    // the backpack stays in Majed's hands (billboard art); without the billboard the 3D backpack goes onto the desk for the morning
    if (!byName.majed_bb) {
      const spot = get('SPOT_backpack_desk'), desk = get('ENV_desk');
      if (backpack && (spot || desk)) { const p = new THREE.Vector3();
        if (spot) spot.getWorldPosition(p); else { const db = new THREE.Box3().setFromObject(desk, true); p.set(db.max.x - 0.32, db.max.y, (db.min.z + db.max.z) / 2); }
        backpack.parent.worldToLocal(p); backpack.position.copy(p); backpack.rotation.set(0, 0, 0); }
      morph(backpack, 'zip', 1);
      await say(L.deskOk); if (!ok()) return res;
    }
  }

  /* ================= LEVEL 2 · Majed's box ================= */
  box.dataset.shot = 'box'; res.views_used.push('box');
  await Promise.all([glideCam('CAM_box'), brqTo('MARK_bariq_box', GLIDE)]); if (!ok()) return res;
  await say(L.l2); if (!ok()) return res;
  let nTry2 = 0, nSolve2 = 0, studs = 0;
  const lockEls = [0, 1, 2].map(() => { const b = h('button.g9-lock', { type: 'button' }); box.append(b); return b; });
  const placeLocks = () => lockEls.forEach((b, i) => { const o = locks[i]; let x = W() * (0.35 + 0.15 * i), y = Hh() * 0.7; if (o) { const r = screenRect(o); if (r) { x = r.cx; y = r.cy; } } b.style.left = x + 'px'; b.style.top = y + 'px'; });
  for (let k = 0; k < WORDS.length && ok(); k++) {
    const w = WORDS[k];
    await new Promise((resolve) => {
      const gap = h('span.gap');
      const row = h('div.row', { lang: 'ar' }, w.parts.map((p) => (p === '#' ? gap : h('span', null, p))));
      const card = h('button.card', { type: 'button', 'aria-label': 'اِسْمَعِ الكَلِمَةَ' }, h('img', { src: api.img('card_' + w.s), alt: '' }), h('i.bq8-ic.bq8-ic--listen'));
      card.addEventListener('click', () => say('bq7_W_' + w.s));
      wordBox.replaceChildren(card, row); wordBox.hidden = false;
      const opts = [w.right, ...w.wrong].sort(() => Math.random() - 0.5);
      if (k === 0 && opts[0] === w.right) opts.push(opts.shift()); // never the same answer place every time
      let tier = 0, busy = true; wordBox.dataset.ready = '0';
      lockEls.forEach((b, i) => { b.className = 'g9-lock'; b.hidden = false; b.replaceChildren(h('span', null, opts[i])); b.dataset.t = opts[i]; b.removeAttribute('aria-disabled'); b.onclick = () => judge(b); });
      placeLocks();
      const finishWord = async (b, how, juicy) => {
        busy = true; lockEls.forEach((x) => { if (x !== b) x.classList.add('is-used'); });
        const okk = how === 'first';
        res.words.push({ slug: w.s, skill: w.skill, ok: okk, how }); if (how === 'shown') res.build_ok = false;
        api.record(w.skill, okk, { item: w.s, from: 'E10' });
        b.classList.add('is-ok'); gap.classList.remove('is-glow');
        await sleep(300);
        const [a, m, z] = wordParts(w.word, w.m); row.replaceChildren(h('span', null, a), h('span.m', null, m), h('span', null, z));
        if (juicy) { if (api.fx) api.fx('ok', 1); brqAct('hop'); starOn(); }
        const st = boxStars[studs++]; if (st) st.traverse((o) => { if (o.isMesh && o.material.emissive) { o.material.emissive.set('#FFC21A'); o.material.emissiveIntensity = 1.2; } });
        if (api.fx) api.fx('click', 0.8);
        await say('bq7_W_' + w.s); if (!ok()) return;
        await say(juicy ? praise() : SOLVE[(nSolve2++) % SOLVE.length]); if (!ok()) return;
        await sleep(300);
        resolve();
      };
      const judge = async (b) => {
        if (busy || !ok() || b.classList.contains('is-no')) return; busy = true; wordBox.dataset.ready = '0'; idleT = 0; logEv('lock', b.dataset.t);
        if (b.dataset.t === w.right) { await finishWord(b, tier === 0 ? 'first' : 'hint', true); return; }
        tier++; b.classList.add('is-no'); b.append(h('span.x', { html: MARK_NO })); b.setAttribute('aria-disabled', 'true'); brqAct('think'); if (api.fx) api.fx('no', 0.4);
        await sleep(250);
        if (tier === 1) { await say(TRY[(nTry2++) % TRY.length]); if (!ok()) return; await say(L.shape); busy = false; wordBox.dataset.ready = '1'; return; }
        const rb = lockEls.find((x) => x.dataset.t === w.right); gap.classList.add('is-glow'); rb.classList.add('is-ok'); brqAct('point');
        await say(L.model); if (!ok()) return; await finishWord(rb, 'shown', false);
      };
      (async () => {
        await sleep(250); if (!ok()) return;
        if (k === 0) { await instr(L.r2task); if (!ok()) return; }
        await say('bq7_W_' + w.s); if (!ok()) return;
        busy = false; wordBox.dataset.ready = '1'; setLock(false);
      })();
    });
    setLock(true);
  }
  if (!ok()) return res;
  wordBox.hidden = true; lockEls.forEach((b) => b.remove());
  // the box opens: star night-light shines on the ceiling
  await playOpen(['ANIM_box_lid'], true); if (boxLamp) boxLamp.visible = true;
  sparks(locks[1] ? center({ hit: locks[1] }) : brqRoot.position.clone(), 22, '#FFF2B0'); if (api.fx) api.fx('win', 0.8);
  brqAct('cheer'); await say(L.boxOpen); if (!ok()) return res;

  /* ================= WIN ================= */
  box.dataset.shot = 'win';
  await Promise.all([glideCam('CAM_win', 1.6), brqTo('MARK_bariq_win', 1.6)]); if (!ok()) return res;
  ceilStars.forEach((c) => { c.sp.material.opacity = 1; });
  if (majWin && byName.majed_bb) { const ms = byName.majed_bb.userData.mesh; const H2 = +(man.majed_h || 1.0); const ar2 = majWin.image.width / majWin.image.height;
    ms.geometry.dispose(); ms.geometry = new THREE.PlaneGeometry(H2 * ar2, H2); ms.material.map = majWin; ms.material.needsUpdate = true; }
  await say(L.winMaj); if (!ok()) return res;
  brqGlowTo = 0.6; await say(L.winBrq); if (!ok()) return res;
  await sleep(600);
  res.fps = Math.round(fps);
  return res;

  // (unreachable) cleanup is via destroy()
}

/* public: the caller can stop the game (element left) */
export function destroy(host) {
  const b = host && host.querySelector('.g9'); if (!b) return;
  const c = b.querySelector('canvas'); if (c) { try { const g = c.getContext('webgl2') || c.getContext('webgl'); const ext = g && g.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); } catch (e) { /* */ } }
  b.remove();
}
