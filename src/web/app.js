'use strict';

// ============================================================
//  Утилиты
// ============================================================
const ICONS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  cursor: 'M5 3l14 7-6 2-2 6z',
  hand: 'M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3',
  note: 'M5 4h14a1 1 0 0 1 1 1v9l-6 6H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM20 14h-5a1 1 0 0 0-1 1v5',
  card: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 9h8M8 13h8M8 17h4',
  text: 'M5 6V4h14v2M12 4v16M9 20h6',
  arrow: 'M5 19L19 5M10 5h9v9',
  frame: 'M9 4H6a2 2 0 0 0-2 2v3M15 4h3a2 2 0 0 1 2 2v3M9 20H6a2 2 0 0 1-2-2v-3M15 20h3a2 2 0 0 0 2-2v-3',
  board: 'M4 5a1 1 0 0 1 1-1h5v7H4zM14 4h5a1 1 0 0 1 1 1v4h-6zM14 13h6v6a1 1 0 0 1-1 1h-5zM4 15h6v5H5a1 1 0 0 1-1-1z',
  image: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 16l4.5-4.5L13 16l3-3 4 4M15 9.5a1.5 1.5 0 1 0 0-.01',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  file: 'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5',
  smile: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5v.5M15 9.5v.5',
  template: 'M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3H4zM4 12h7v8H5a1 1 0 0 1-1-1zM15 12h5v7a1 1 0 0 1-1 1h-4z',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  redo: 'M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  fit: 'M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4M9 9h6v6H9z',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.5a6.5 6.5 0 0 1 3.5 5.5',
  more: 'M4.5 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M17.5 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3',
  copy: 'M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zM16 9V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3',
  front: 'M12 19V5M6 11l6-6 6 6',
  back: 'M12 5v14M6 13l6 6 6-6',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  open: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
  upload: 'M12 16V5M7 9l5-5 5 5M5 20h14',
  size: 'M4 18L9 6l5 12M6 14h6M15 18l3-7 3 7M16 16h4',
  x: 'M6 6l12 12M18 6L6 18',
  cloud: 'M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5 3.5 3.5 0 0 1-.5 6.5z',
  pc: 'M4 5h16v11H4zM9 20h6M12 16v4',
  keyboard: 'M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM7 10h.01M11 10h.01M15 10h.01M8 14h8',
  gamepad: 'M7 8h10a5 5 0 0 1 5 5v1a3 3 0 0 1-5.5 1.7l-1-1.7h-7l-1 1.7A3 3 0 0 1 2 14v-1a5 5 0 0 1 5-5zM7 10.5v3M5.5 12h3M16 11h.01M18 13h.01',
  mask: 'M4 5c5 2 11 2 16 0v6a8 8 0 0 1-16 0zM8 10h2M14 10h2M9 14a4 4 0 0 0 6 0',
  map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z',
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const SVGNS = 'http://www.w3.org/2000/svg';

function ic(name) {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('class', 'ic');
  svg.setAttribute('viewBox', '0 0 24 24');
  const p = document.createElementNS(SVGNS, 'path');
  p.setAttribute('d', ICONS[name] || '');
  svg.append(p);
  return svg;
}

function h(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (k === 'class') n.className = v;
    else if (k === 'icon') n.append(ic(v));
    else n.setAttribute(k, v === true ? '' : v);
  }
  n.append(...kids.flat().filter(k => k != null && k !== false));
  return n;
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const clone = o => JSON.parse(JSON.stringify(o));
function uid(n = 12) {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(n)), b => abc[b % abc.length]).join('');
}
function hash(s) { let x = 0; for (const ch of s) x = (x * 31 + ch.charCodeAt(0)) | 0; return Math.abs(x); }
function plural(n, forms) {
  const a = n % 10, b = n % 100;
  return forms[a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 1 : 2];
}
function fmtSize(n) {
  if (!n) return '';
  const u = ['Б', 'КБ', 'МБ', 'ГБ']; let i = 0;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return (i ? n.toFixed(1) : n) + ' ' + u[i];
}
function fmtDate(t) {
  if (!t) return '';
  const d = new Date(t), diff = (Date.now() - d) / 60000;
  if (diff < 1) return 'только что';
  if (diff < 60) return Math.floor(diff) + ' мин назад';
  if (diff < 1440) return Math.floor(diff / 60) + ' ч назад';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
}
const store = {
  get(k, d) { try { const v = localStorage.getItem('pl.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('pl.' + k, JSON.stringify(v)); } catch { /* хранилище недоступно */ } },
};
function safeUrl(s) {
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(s) ? s : 'https://' + s);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u : null;
  } catch { return null; }
}

function toast(text, ms = 2600) {
  const n = h('div', { class: 'toast' }, text);
  $('#toasts').append(n);
  setTimeout(() => n.remove(), ms);
}

// ============================================================
//  Окружение
// ============================================================
const HOST = window.__host || null;                 // задаётся настольным приложением
const ORIGIN = location.origin;
const hostPost = m => window.chrome?.webview?.postMessage(m);
const cid = uid(8);
const PEER_COLORS = ['#E0603F', '#2A6FDB', '#12A7A0', '#9B5DE5', '#D6336C', '#C98A1B', '#3A8F4F', '#5C6BC0'];
const me = { name: store.get('name', null) || HOST?.user || 'Гость', color: PEER_COLORS[hash(cid) % PEER_COLORS.length] };

const P = { server: ORIGIN, id: null, name: '' };   // открытый проект
const isLocalServer = s => s === ORIGIN && !!HOST;

// Сервер с учётными записями: вход, команды и проекты внутри команд (см. account.js).
let ACC = false;
const SCREENS = ['board', 'home', 'auth', 'acc'];
function showScreen(id) { for (const s of SCREENS) $('#' + s).hidden = s !== id; }
async function newProjectId(name) { return ACC ? accCreateProject(name) : uid(14); }
function launchProject(id, name, opts) { ACC ? accOpen(id, opts) : openProject({ server: ORIGIN, id, name }, opts); }

// ============================================================
//  Хранилище элементов и синхронизация
// ============================================================
const S = { els: new Map(), clock: 0, out: new Set(), outDel: new Map(), online: false, peers: new Map() };
const newer = (a, b) => a.v > b.v || (a.v === b.v && (a.by || '') > (b.by || ''));

let tx = null;
const undoStack = [], redoStack = [];

function begin() { if (!tx) tx = { before: new Map(), n: 0 }; tx.n++; }
function end() {
  if (!tx || --tx.n > 0) return;
  const t = tx; tx = null;
  if (!t.before.size) return;
  const after = new Map();
  for (const id of t.before.keys()) { const e = S.els.get(id); after.set(id, e ? clone(e) : null); }
  undoStack.push({ before: t.before, after });
  if (undoStack.length > 300) undoStack.shift();
  redoStack.length = 0;
  syncHistoryButtons();
}
function act(fn) { begin(); try { return fn(); } finally { end(); } }
function touch(id) {
  if (tx && !tx.before.has(id)) { const e = S.els.get(id); tx.before.set(id, e ? clone(e) : null); }
}
function commit(el) {
  el.v = ++S.clock; el.by = cid;
  S.els.set(el.id, el); S.outDel.delete(el.id); S.out.add(el.id);
  invalidate(el.id);
}
function add(el) { touch(el.id); commit(el); return el; }
function upd(id, patch) {
  const el = S.els.get(id);
  if (!el) return null;
  touch(id); Object.assign(el, patch); commit(el);
  return el;
}
function rem(id) {
  if (!S.els.has(id)) return;
  touch(id);
  S.els.delete(id); S.out.delete(id); S.outDel.set(id, ++S.clock);
  invalidate(id);
}
function applyState(map) {
  for (const [id, e] of map) { if (e) commit(clone(e)); else rem(id); }
  pruneSelection();
}
function undo() { const t = undoStack.pop(); if (!t) return; applyState(t.before); redoStack.push(t); syncHistoryButtons(); }
function redo() { const t = redoStack.pop(); if (!t) return; applyState(t.after); undoStack.push(t); syncHistoryButtons(); }
function syncHistoryButtons() {
  $('#btn-undo').disabled = !undoStack.length;
  $('#btn-redo').disabled = !redoStack.length;
}

let ws = null, wsTimer = 0, retry = 0, onFirstInit = null;

function connect() {
  clearTimeout(wsTimer);
  const q = `cid=${cid}&name=${encodeURIComponent(me.name)}&color=${encodeURIComponent(me.color)}`;
  const sock = ws = new WebSocket(`${P.server.replace(/^http/, 'ws')}/ws/${P.id}?${q}`);
  sock.onmessage = e => { if (ws === sock) onMessage(JSON.parse(e.data)); };
  sock.onclose = () => {
    if (ws !== sock) return;
    S.online = false; S.peers.clear();
    drawPeers(); drawStatus();
    wsTimer = setTimeout(connect, Math.min(5000, 700 * 2 ** retry++));
    if (ACC && retry === 2) accCheckAccess();
  };
}
function disconnect() {
  const s = ws; ws = null;
  clearTimeout(wsTimer);
  if (s) s.close();
  S.online = false;
}
function send(m) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); }

function flush() {
  if (!S.online || !ws || ws.readyState !== 1) return;
  if (S.out.size) {
    const els = [];
    for (const id of S.out) { const e = S.els.get(id); if (e) els.push(e); }
    S.out.clear();
    for (let i = 0; i < els.length; i += 150) send({ t: 'set', els: els.slice(i, i + 150) });
  }
  if (S.outDel.size) { send({ t: 'del', ids: [...S.outDel] }); S.outDel.clear(); }
}
setInterval(flush, 50);

function onMessage(m) {
  switch (m.t) {
    case 'init': {
      // Сливаем снимок сервера с тем, что успели изменить без связи.
      const seen = new Set();
      for (const el of m.els) {
        seen.add(el.id);
        S.clock = Math.max(S.clock, el.v);
        if ((S.outDel.get(el.id) ?? -1) > el.v) continue;
        const cur = S.els.get(el.id);
        if (cur && S.out.has(el.id) && newer(cur, el)) continue;
        S.els.set(el.id, el); S.out.delete(el.id); S.outDel.delete(el.id);
      }
      for (const id of [...S.els.keys()]) if (!seen.has(id) && !S.out.has(id)) S.els.delete(id);
      S.peers.clear();
      for (const p of m.peers) S.peers.set(p.cid, p);
      S.online = true; retry = 0;
      if (m.name) setProjectName(m.name, false);
      else if (P.name) send({ t: 'meta', name: P.name });
      pruneSelection();
      invalidateAll(); drawPeers(); drawStatus();
      const first = onFirstInit; onFirstInit = null;
      if (first) first();
      break;
    }
    case 'set':
      for (const el of m.els) {
        S.clock = Math.max(S.clock, el.v);
        if ((S.outDel.get(el.id) ?? -1) >= el.v) continue;
        const cur = S.els.get(el.id);
        if (cur && !newer(el, cur)) continue;
        S.els.set(el.id, el); S.out.delete(el.id);
        invalidate(el.id);
      }
      break;
    case 'del':
      for (const [id, v] of m.ids) {
        S.clock = Math.max(S.clock, v);
        const cur = S.els.get(id);
        if (!cur || cur.v > v) continue;
        if (V.edit?.id === id) stopEdit();
        S.els.delete(id); S.out.delete(id);
        invalidate(id);
      }
      pruneSelection();
      break;
    case 'cur': drawCursor(m); break;
    case 'join': S.peers.set(m.peer.cid, m.peer); drawPeers(); drawStatus(); break;
    case 'leave': S.peers.delete(m.cid); removeCursor(m.cid); drawPeers(); drawStatus(); break;
    case 'meta': setProjectName(m.name, false); break;
  }
}

// ============================================================
//  Вид: панорама, масштаб, отрисовка
// ============================================================
const V = { board: 'root', x: 0, y: 0, k: 1, tool: 'select', sel: new Set(), edit: null, views: new Map() };
const vp = $('#viewport'), world = $('#world'), elsBox = $('#els');
const arrowList = $('#arrow-list'), arrowDraft = $('#arrow-draft');
const nodes = new Map();
const AUTO_H = new Set(['note', 'card', 'text']);
const COLORED = new Set(['note', 'card', 'frame', 'board']);
const DEFAULTS = {
  note: { w: 200, h: 150, text: '', c: 0 },
  card: { w: 280, h: 130, title: '', text: '', c: 1 },
  text: { w: 260, h: 34, text: '', s: 1 },
  frame: { w: 520, h: 360, title: '', c: 1 },
  board: { w: 220, h: 140, title: '', c: 2 },
};

const toWorld = (cx, cy) => ({ x: (cx - V.x) / V.k, y: (cy - V.y) / V.k });
const viewCenter = () => toWorld(innerWidth / 2, innerHeight / 2);

function applyView() {
  world.style.transform = `translate(${V.x}px,${V.y}px) scale(${V.k})`;
  world.style.setProperty('--inv', 1 / V.k);
  let g = 26 * V.k;
  while (g < 16) g *= 2;
  while (g > 56) g /= 2;
  vp.style.backgroundSize = `${g}px ${g}px`;
  vp.style.backgroundPosition = `${V.x}px ${V.y}px`;
  $('#zoom-val').textContent = Math.round(V.k * 100) + '%';
  placeSelbar();
}
function zoomAt(cx, cy, k) {
  k = clamp(k, 0.08, 4);
  const w = toWorld(cx, cy);
  V.k = k; V.x = cx - w.x * k; V.y = cy - w.y * k;
  applyView();
}
function fitRect(r, maxK = 1) {
  const padX = 150, padY = 130;
  V.k = clamp(Math.min((innerWidth - padX * 2) / r.w, (innerHeight - padY * 2) / r.h, maxK), 0.08, 4);
  V.x = innerWidth / 2 - (r.x + r.w / 2) * V.k;
  V.y = innerHeight / 2 - (r.y + r.h / 2) * V.k;
  applyView();
}
function fitAll() {
  const r = bbox([...boardEls()].filter(e => e.t !== 'arrow').map(e => e.id));
  if (r) fitRect(r); else { V.k = 1; V.x = innerWidth / 2; V.y = innerHeight / 2; applyView(); }
}

function* boardEls(b = V.board) { for (const el of S.els.values()) if (el.p === b) yield el; }
function nextZ(dir = 1) {
  let z = 0;
  for (const el of boardEls()) if (el.t !== 'arrow') z = dir > 0 ? Math.max(z, el.z || 0) : Math.min(z, el.z || 0);
  return z + dir;
}
function rectOf(el) {
  const n = nodes.get(el.id);
  const hgt = n && AUTO_H.has(el.t) ? Math.max(el.h, n.offsetHeight) : el.h;
  return { x: el.x, y: el.y, w: el.w, h: hgt };
}
function bbox(ids) {
  let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
  for (const id of ids) {
    const el = S.els.get(id);
    if (!el) continue;
    let pts;
    if (el.t === 'arrow') { const e = arrowEnds(el); if (!e) continue; pts = e; }
    else { const r = rectOf(el); pts = [{ x: r.x, y: r.y }, { x: r.x + r.w, y: r.y + r.h }]; }
    for (const p of pts) { a = Math.min(a, p.x); b = Math.min(b, p.y); c = Math.max(c, p.x); d = Math.max(d, p.y); }
  }
  return a === Infinity ? null : { x: a, y: b, w: Math.max(1, c - a), h: Math.max(1, d - b) };
}

// ---------- отрисовка элементов ----------
let raf = 0, drawAll = false;
const dirty = new Set();
function invalidate(id) { dirty.add(id); if (!raf) raf = requestAnimationFrame(render); }
function invalidateAll() { drawAll = true; if (!raf) raf = requestAnimationFrame(render); }

function makeNode(el) {
  const n = h('div', { class: 'el ' + el.t, 'data-id': el.id });
  switch (el.t) {
    case 'note': n.append(h('div', { class: 'tx', 'data-f': 'text', 'data-ph': 'Заметка…' })); break;
    case 'card': n.append(h('div', { class: 'tt', 'data-f': 'title', 'data-ph': 'Заголовок' }), h('div', { class: 'tx', 'data-f': 'text', 'data-ph': 'Описание…' })); break;
    case 'text': n.append(h('div', { class: 'tx', 'data-f': 'text', 'data-ph': 'Текст' })); break;
    case 'frame': n.append(h('div', { class: 'ft', 'data-f': 'title', 'data-ph': 'Группа' })); break;
    case 'board': n.append(h('div', { class: 'cover', icon: 'board' }), h('div', { class: 'info' }, h('div', { class: 'tt', 'data-f': 'title', 'data-ph': 'Новая доска' }), h('div', { class: 'meta' }))); break;
    case 'img': n.append(h('img', { draggable: 'false', alt: '' })); break;
    case 'sticker': n.append(el.src ? h('img', { draggable: 'false', alt: '' }) : h('div', { class: 'emo' })); break;
    case 'link': n.append(h('div', { class: 'badge', icon: 'link' }), h('div', { class: 'body' }, h('div', { class: 'tt', 'data-f': 'title' }), h('div', { class: 'meta' }))); break;
    case 'file': n.append(h('div', { class: 'badge', icon: 'file' }), h('div', { class: 'body' }, h('div', { class: 'tt' }), h('div', { class: 'meta' }))); break;
  }
  elsBox.append(n);
  nodes.set(el.id, n);
  return n;
}

function draw(el) {
  const n = nodes.get(el.id) || makeNode(el);
  const st = n.style;
  st.left = el.x + 'px'; st.top = el.y + 'px'; st.width = el.w + 'px';
  if (AUTO_H.has(el.t)) st.minHeight = el.h + 'px'; else st.height = el.h + 'px';
  st.zIndex = el.t === 'frame' ? ((el.z || 0) % 50000 + 50000) % 50000 : 100000 + (el.z || 0);
  let cls = 'el ' + el.t;
  if (COLORED.has(el.t)) cls += ' k' + (el.c || 0);
  if (el.t === 'text') cls += ' s' + (el.s ?? 1);
  if (V.sel.has(el.id)) cls += ' sel';
  if (n.className !== cls) n.className = cls;

  for (const f of $$('[data-f]', n)) {
    if (V.edit && V.edit.fld === f) continue;
    const val = el[f.dataset.f] || '';
    if (f.textContent !== val) f.textContent = val;
  }
  switch (el.t) {
    case 'board': {
      let count = 0;
      for (const c of boardEls(el.id)) if (c.t !== 'arrow') count++;
      $('.meta', n).textContent = count ? `${count} ${plural(count, ['элемент', 'элемента', 'элементов'])}` : 'Пустая доска';
      break;
    }
    case 'img': case 'sticker': {
      const img = $('img', n);
      if (img) { const src = P.server + el.src; if (img.getAttribute('src') !== src) img.src = src; }
      else { const e = $('.emo', n); e.textContent = el.e; e.style.fontSize = Math.min(el.w, el.h) * 0.8 + 'px'; }
      break;
    }
    case 'link': {
      const u = safeUrl(el.url);
      $('.tt', n).dataset.ph = u ? u.hostname : 'Ссылка';
      $('.meta', n).textContent = el.url || '';
      break;
    }
    case 'file':
      $('.tt', n).textContent = el.name || 'Файл';
      $('.meta', n).textContent = fmtSize(el.size);
      break;
  }
}

function render() {
  raf = 0;
  if (V.board !== 'root' && !S.els.has(V.board)) { enterBoard('root'); return; }
  if (drawAll) {
    for (const n of nodes.values()) n.remove();
    nodes.clear();
    for (const el of boardEls()) if (el.t !== 'arrow') draw(el);
  } else {
    for (const id of dirty) {
      const el = S.els.get(id);
      if (el && el.p === V.board && el.t !== 'arrow') { draw(el); continue; }
      const n = nodes.get(id);
      if (n) { n.remove(); nodes.delete(id); }
      // изменилось содержимое вложенной доски — обновляем счётчик на её плитке
      const parent = el && S.els.get(el.p);
      if (parent && parent.p === V.board) draw(parent);
    }
  }
  drawAll = false; dirty.clear();
  drawArrows();
  drawSelection();
  drawCrumbs();
  $('#empty-hint').hidden = nodes.size > 0 || !S.online;
}

// ---------- стрелки ----------
function clipToRect(r, to, pad = 8) {
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  const dx = to.x - cx, dy = to.y - cy;
  if (!dx && !dy) return { x: cx, y: cy };
  const t = Math.min((r.w / 2 + pad) / Math.abs(dx || 1e-9), (r.h / 2 + pad) / Math.abs(dy || 1e-9));
  return t >= 1 ? { x: cx, y: cy } : { x: cx + dx * t, y: cy + dy * t };
}
function arrowEnds(el) {
  const A = el.a ? S.els.get(el.a) : null, B = el.b ? S.els.get(el.b) : null;
  if ((el.a && !A) || (el.b && !B)) return null;
  const ra = A && rectOf(A), rb = B && rectOf(B);
  const ca = ra ? { x: ra.x + ra.w / 2, y: ra.y + ra.h / 2 } : { x: el.ax, y: el.ay };
  const cb = rb ? { x: rb.x + rb.w / 2, y: rb.y + rb.h / 2 } : { x: el.bx, y: el.by };
  return [ra ? clipToRect(ra, cb) : ca, rb ? clipToRect(rb, ca) : cb];
}
function svg(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}
function drawArrows() {
  arrowList.replaceChildren();
  for (const el of boardEls()) {
    if (el.t !== 'arrow') continue;
    const ends = arrowEnds(el);
    if (!ends) continue;
    const [a, b] = ends, len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len < 4) continue;
    const ux = (b.x - a.x) / len, uy = (b.y - a.y) / len, hs = 11;
    const base = { x: b.x - ux * hs, y: b.y - uy * hs };
    const d = `M${a.x},${a.y}L${base.x},${base.y}`;
    const g = svg('g', { 'data-id': el.id, class: V.sel.has(el.id) ? 'sel' : '' });
    g.append(
      svg('path', { class: 'hit', d: `M${a.x},${a.y}L${b.x},${b.y}` }),
      svg('path', { class: 'ln', d }),
      svg('path', { class: 'hd', d: `M${b.x},${b.y}L${base.x - uy * hs * 0.5},${base.y + ux * hs * 0.5}L${base.x + uy * hs * 0.5},${base.y - ux * hs * 0.5}Z` }),
    );
    arrowList.append(g);
  }
}

// ---------- выделение ----------
function select(ids) {
  V.sel = new Set(ids);
  drawSelection(); drawArrows(); buildSelbar();
}
function pruneSelection() {
  let changed = false;
  for (const id of V.sel) if (!S.els.has(id)) { V.sel.delete(id); changed = true; }
  if (changed) buildSelbar();
}
function drawSelection() {
  $$('.h-rs, .h-cn', elsBox).forEach(x => x.remove());
  for (const [id, n] of nodes) n.classList.toggle('sel', V.sel.has(id));
  if (V.sel.size === 1 && !V.edit) {
    const id = [...V.sel][0], n = nodes.get(id), el = S.els.get(id);
    if (n && el) {
      n.append(h('div', { class: 'h-rs' }));
      if (el.t !== 'frame') n.append(h('div', { class: 'h-cn' }));
    }
  }
  placeSelbar();
}

const selbar = $('#selbar');
function sbtn(icon, tip, fn) { return h('button', { class: 'ib', icon, 'data-tip': tip, onclick: fn }); }
function buildSelbar() {
  selbar.replaceChildren();
  const els = [...V.sel].map(id => S.els.get(id)).filter(Boolean);
  if (!els.length) { selbar.hidden = true; return; }
  const one = els.length === 1 ? els[0] : null;
  const colored = els.filter(e => COLORED.has(e.t));
  if (colored.length) {
    for (let c = 0; c < 6; c++) {
      selbar.append(h('button', {
        class: 'sw' + (colored.every(e => (e.c || 0) === c) ? ' on' : ''), style: `background:var(--c${c})`, 'aria-label': 'Цвет ' + (c + 1),
        onclick: () => { act(() => colored.forEach(e => upd(e.id, { c }))); buildSelbar(); },
      }));
    }
    selbar.append(h('hr'));
  }
  const texts = els.filter(e => e.t === 'text');
  if (texts.length) selbar.append(sbtn('size', 'Размер текста', () => act(() => texts.forEach(e => upd(e.id, { s: ((e.s ?? 1) + 1) % 4 })))));
  if (one && (one.t === 'board' || one.t === 'link')) selbar.append(sbtn('edit', 'Переименовать · F2', () => startEdit(one.id, 'title')));
  if (one && (one.t === 'board' || one.t === 'link')) selbar.append(sbtn('open', 'Открыть · Enter', () => openEl(one)));
  if (one && one.t === 'file') selbar.append(sbtn('download', 'Скачать', () => openEl(one)));
  if (els.some(e => e.t !== 'arrow')) {
    selbar.append(sbtn('front', 'На передний план', () => act(() => { let z = nextZ(1); els.forEach(e => e.t !== 'arrow' && upd(e.id, { z: z++ })); })));
    selbar.append(sbtn('back', 'На задний план', () => act(() => { let z = nextZ(-1); els.forEach(e => e.t !== 'arrow' && upd(e.id, { z: z-- })); })));
    selbar.append(sbtn('copy', 'Дублировать · Ctrl+D', duplicate));
  }
  if (els.filter(e => e.t !== 'arrow' && e.t !== 'frame').length > 1) selbar.append(sbtn('frame', 'Сгруппировать · Ctrl+G', groupSelection));
  selbar.append(sbtn('trash', 'Удалить · Del', () => deleteIds([...V.sel])));
  placeSelbar();
}
function placeSelbar() {
  if (!V.sel.size || drag || V.edit) { selbar.hidden = true; return; }
  const r = bbox(V.sel);
  if (!r || !selbar.childElementCount) { selbar.hidden = true; return; }
  selbar.hidden = false;
  const w = selbar.offsetWidth, hgt = selbar.offsetHeight;
  const cx = V.x + (r.x + r.w / 2) * V.k;
  let top = V.y + r.y * V.k - hgt - 44;
  if (top < 70) top = V.y + (r.y + r.h) * V.k + 22;
  selbar.style.left = clamp(cx - w / 2, 70, innerWidth - w - 14) + 'px';
  selbar.style.top = clamp(top, 70, innerHeight - hgt - 70) + 'px';
}

// ---------- редактирование текста ----------
function startEdit(id, f) {
  const n = nodes.get(id);
  if (!n) return;
  const fld = (f && $(`[data-f="${f}"]`, n)) || $('[data-f]', n);
  if (!fld) return;
  stopEdit();
  V.sel = new Set([id]);
  begin();
  V.edit = { id, f: fld.dataset.f, fld };
  drawSelection(); drawArrows();
  fld.contentEditable = 'plaintext-only';
  fld.focus();
  const r = document.createRange();
  r.selectNodeContents(fld);
  const s = getSelection();
  s.removeAllRanges(); s.addRange(r);
}
function stopEdit() {
  const ed = V.edit;
  if (!ed) return;
  V.edit = null;
  ed.fld.contentEditable = 'false';
  ed.fld.blur();
  getSelection().removeAllRanges();
  const el = S.els.get(ed.id);
  if (el && el.t === 'text' && !(el.text || '').trim()) { rem(el.id); V.sel.delete(el.id); }
  end();
  invalidate(ed.id);
  buildSelbar();
}
elsBox.addEventListener('input', e => {
  if (V.edit && e.target === V.edit.fld) upd(V.edit.id, { [V.edit.f]: e.target.innerText.replace(/\n$/, '') });
});
elsBox.addEventListener('focusout', e => { if (V.edit && e.target === V.edit.fld) stopEdit(); });

// ============================================================
//  Действия над элементами
// ============================================================
function createAt(type, pt, extra = {}) {
  const d = DEFAULTS[type];
  const centered = type !== 'frame';
  const el = { id: uid(), t: type, p: V.board, ...d, ...extra, z: nextZ(1) };
  el.x = Math.round(pt.x - (centered ? el.w / 2 : 0));
  el.y = Math.round(pt.y - (centered ? el.h / 2 : 0));
  act(() => add(el));
  return el;
}

function deleteIds(ids) {
  if (!ids.length) return;
  if (V.edit) stopEdit();
  act(() => {
    const kill = id => {
      const el = S.els.get(id);
      if (!el) return;
      if (el.t === 'board') for (const c of [...boardEls(id)]) kill(c.id);
      for (const a of [...boardEls(el.p)]) if (a.t === 'arrow' && (a.a === id || a.b === id)) rem(a.id);
      rem(id);
    };
    ids.forEach(kill);
  });
  select([]);
}

// Заготовки (шаблоны, вставка из буфера) → элементы. Ключ k связывает стрелки и вложенность.
function insertSpecs(specs, at) {
  const ids = new Map();
  for (const s of specs) if (s.k) ids.set(s.k, uid());
  const top = specs.filter(s => !s.p && s.t !== 'arrow');
  let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
  for (const s of top) { a = Math.min(a, s.x); b = Math.min(b, s.y); c = Math.max(c, s.x + s.w); d = Math.max(d, s.y + s.h); }
  const ox = top.length ? Math.round(at.x - (a + c) / 2) : 0, oy = top.length ? Math.round(at.y - (b + d) / 2) : 0;
  let z = nextZ(1);
  const created = [];
  act(() => {
    for (const s of specs) {
      const el = { ...s, id: (s.k && ids.get(s.k)) || uid() };
      delete el.k;
      el.p = s.p ? ids.get(s.p) : V.board;
      if (s.t === 'arrow') {
        if (s.a) el.a = ids.get(s.a);
        if (s.b) el.b = ids.get(s.b);
        if ((s.a && !el.a) || (s.b && !el.b)) continue;
        if (!s.p) { if (el.ax != null) { el.ax += ox; el.ay += oy; } if (el.bx != null) { el.bx += ox; el.by += oy; } }
      } else {
        if (!s.p) { el.x += ox; el.y += oy; }
        el.z = z++;
      }
      add(el);
      if (!s.p) created.push(el.id);
    }
  });
  return created;
}

// Копия выделенного в виде заготовок (с содержимым вложенных досок и стрелками между элементами).
function specsFrom(ids) {
  const set = new Map();
  const take = id => {
    const el = S.els.get(id);
    if (!el || set.has(id)) return;
    set.set(id, el);
    if (el.t === 'board') for (const c of boardEls(id)) take(c.id);
  };
  ids.forEach(take);
  for (const a of boardEls()) if (a.t === 'arrow' && a.a && a.b && set.has(a.a) && set.has(a.b)) set.set(a.id, a);
  const specs = [];
  for (const el of set.values()) {
    if (el.t === 'arrow' && ((el.a && !set.has(el.a)) || (el.b && !set.has(el.b)))) continue;
    const s = clone(el);
    s.k = el.id;
    s.p = set.has(el.p) ? el.p : undefined;
    delete s.id; delete s.v; delete s.by; delete s.z;
    specs.push(s);
  }
  return specs;
}
function pasteSpecs(specs, at) {
  const created = insertSpecs(specs, at);
  select(created);
  return created;
}
function duplicate() {
  const r = bbox(V.sel);
  if (!r) return;
  pasteSpecs(specsFrom([...V.sel]), { x: r.x + r.w / 2 + 28, y: r.y + r.h / 2 + 28 });
}
function groupSelection() {
  const ids = [...V.sel].filter(id => { const e = S.els.get(id); return e && e.t !== 'arrow'; });
  const r = bbox(ids);
  if (!r) return;
  const el = { id: uid(), t: 'frame', p: V.board, title: '', c: 1, x: r.x - 32, y: r.y - 32, w: r.w + 64, h: r.h + 64, z: nextZ(1) };
  act(() => add(el));
  select([el.id]);
  requestAnimationFrame(() => startEdit(el.id, 'title'));
}
function frameContents(frame) {
  const out = [];
  for (const el of boardEls()) {
    if (el.id === frame.id || el.t === 'arrow') continue;
    const r = rectOf(el), cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    if (cx >= frame.x && cx <= frame.x + frame.w && cy >= frame.y && cy <= frame.y + frame.h) out.push(el.id);
  }
  return out;
}
function openEl(el) {
  if (el.t === 'board') enterBoard(el.id);
  else if (el.t === 'link') { const u = safeUrl(el.url); if (u) window.open(u.href, '_blank', 'noopener'); }
  else if (el.t === 'file') {
    const a = h('a', { href: `${P.server}${el.src}?name=${encodeURIComponent(el.name || 'file')}`, download: el.name || 'file' });
    document.body.append(a); a.click(); a.remove();
  }
}

// ---------- файлы и картинки ----------
const MAX_BLOB = 64 * 1024 * 1024;
async function upload(blob, name, server = P.server, room = P.id) {
  const r = await fetch(`${server}/api/blob/${room}?name=${encodeURIComponent(name || 'file')}`, { method: 'POST', body: blob });
  if (!r.ok) throw new Error('Сервер отклонил файл');
  return (await r.json()).url;
}
function imageSize(blob) {
  return new Promise(res => {
    const img = new Image(), url = URL.createObjectURL(blob);
    img.onload = () => { URL.revokeObjectURL(url); res({ w: img.naturalWidth, h: img.naturalHeight }); };
    img.onerror = () => { URL.revokeObjectURL(url); res(null); };
    img.src = url;
  });
}
const RASTER = /^image\/(png|jpeg|gif|webp)$/;
async function addFiles(files, at, asSticker = false) {
  const created = [];
  let i = 0;
  for (const f of files) {
    if (f.size > MAX_BLOB) { toast(`«${f.name}» больше 64 МБ — пропущен`); continue; }
    try {
      const pt = { x: at.x + i * 28, y: at.y + i * 28 };
      const dim = RASTER.test(f.type) ? await imageSize(f) : null;
      const src = await upload(f, f.name);
      let el;
      if (dim) {
        const max = asSticker ? 120 : 380, k = Math.min(1, max / Math.max(dim.w, dim.h));
        const w = Math.round(dim.w * k), hgt = Math.round(dim.h * k);
        el = { id: uid(), t: asSticker ? 'sticker' : 'img', p: V.board, src, w, h: hgt, x: Math.round(pt.x - w / 2), y: Math.round(pt.y - hgt / 2), z: nextZ(1) };
      } else {
        el = { id: uid(), t: 'file', p: V.board, src, name: f.name, size: f.size, w: 280, h: 72, x: Math.round(pt.x - 140), y: Math.round(pt.y - 36), z: nextZ(1) };
      }
      act(() => add(el));
      created.push(el.id);
      i++;
    } catch (err) {
      toast(`Не удалось загрузить «${f.name}»: ${err.message}`);
    }
  }
  if (created.length) select(created);
}
async function addLink(at) {
  const url = await ask({ title: 'Добавить ссылку', label: 'Адрес', placeholder: 'https://…', ok: 'Добавить' });
  if (url == null) return;
  const u = safeUrl(url.trim());
  if (!u) { toast('Это не похоже на ссылку'); return; }
  const el = { id: uid(), t: 'link', p: V.board, url: u.href, title: '', w: 300, h: 76, x: Math.round(at.x - 150), y: Math.round(at.y - 38), z: nextZ(1) };
  act(() => add(el));
  select([el.id]);
}

// ---------- вложенные доски ----------
function enterBoard(id) {
  if (V.edit) stopEdit();
  V.views.set(V.board, { x: V.x, y: V.y, k: V.k });
  V.board = id;
  V.sel = new Set();
  buildSelbar();
  $('#cursors').replaceChildren(); cursorNodes.clear();
  drawAll = true;
  render();
  const v = V.views.get(id);
  if (v) { Object.assign(V, v); applyView(); } else fitAll();
}
function drawCrumbs() {
  const path = [];
  for (let id = V.board; id !== 'root';) {
    const el = S.els.get(id);
    if (!el) break;
    path.unshift({ id, name: el.title || 'Новая доска' });
    id = el.p;
  }
  const box = $('#crumbs');
  const sig = path.map(p => p.id + p.name).join('|');
  if (box.dataset.sig === sig) return;
  box.dataset.sig = sig;
  box.replaceChildren();
  if (!path.length) return;
  box.append(h('span', null, '/'), h('button', { onclick: () => enterBoard('root') }, 'Главная'));
  for (const p of path) box.append(h('span', null, '›'), h('button', { onclick: () => enterBoard(p.id) }, p.name));
}

// ============================================================
//  Указатель: перетаскивание, выделение, стрелки
// ============================================================
let drag = null, spaceDown = false;
const editable = t => t.closest?.('[contenteditable]:not([contenteditable="false"])');

function hitEl(cx, cy) {
  for (const n of document.elementsFromPoint(cx, cy)) {
    const e = n.closest?.('#els .el');
    if (e) return e.dataset.id;
    const g = n.closest?.('#arrow-list g');
    if (g) return g.dataset.id;
  }
  return null;
}
function setTool(t) {
  V.tool = t;
  $$('#dock [data-tool]').forEach(b => b.classList.toggle('on', b.dataset.tool === t));
  vp.className = 't-' + t + (spaceDown ? ' space' : '');
}
function startDrag(e, d) {
  drag = d;
  vp.setPointerCapture(e.pointerId);
  if (d.type === 'pan') vp.classList.add('panning');
  placeSelbar();
}

vp.addEventListener('mousedown', e => { if (!editable(e.target)) e.preventDefault(); });
vp.addEventListener('contextmenu', e => e.preventDefault());

vp.addEventListener('pointerdown', e => {
  closePop();
  if (editable(e.target)) return;
  if (V.edit) stopEdit();
  if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  const pt = toWorld(e.clientX, e.clientY);

  if (e.button === 1 || e.button === 2 || spaceDown || V.tool === 'hand')
    return startDrag(e, { type: 'pan', sx: e.clientX, sy: e.clientY, ox: V.x, oy: V.y });
  if (e.button !== 0) return;

  const node = e.target.closest('.el'), id = node?.dataset.id;
  if (e.target.classList.contains('h-rs')) { begin(); return startDrag(e, { type: 'resize', id, start: pt, orig: clone(S.els.get(id)) }); }
  if (e.target.classList.contains('h-cn')) return startDrag(e, { type: 'connect', from: id, start: pt, handle: true });
  if (V.tool === 'arrow') { const src = id && S.els.get(id); return startDrag(e, { type: 'connect', from: src ? id : null, start: pt }); }
  if (DEFAULTS[V.tool]) {
    const el = createAt(V.tool, pt);
    setTool('select');
    render();
    startEdit(el.id);
    return;
  }

  const hit = id || e.target.closest('#arrow-list g')?.dataset.id;
  if (hit) {
    if (e.shiftKey) { const s = new Set(V.sel); s.has(hit) ? s.delete(hit) : s.add(hit); select(s); }
    else if (!V.sel.has(hit)) select([hit]);
    if (V.sel.has(hit)) startDrag(e, { type: 'move', start: pt, moved: false });
    return;
  }
  if (!e.shiftKey) select([]);
  startDrag(e, { type: 'marquee', sx: e.clientX, sy: e.clientY, base: new Set(V.sel) });
});

function collectMove() {
  const ids = new Set(V.sel);
  for (const id of V.sel) { const el = S.els.get(id); if (el?.t === 'frame') frameContents(el).forEach(c => ids.add(c)); }
  const items = [];
  for (const id of ids) {
    const el = S.els.get(id);
    if (!el) continue;
    if (el.t === 'arrow') items.push({ id, arrow: true, ax: el.ax, ay: el.ay, bx: el.bx, by: el.by });
    else items.push({ id, x: el.x, y: el.y });
  }
  return items;
}

let lastCursorSent = 0;
vp.addEventListener('pointermove', e => {
  const pt = toWorld(e.clientX, e.clientY);
  if (S.online && S.peers.size && performance.now() - lastCursorSent > 50) {
    lastCursorSent = performance.now();
    send({ t: 'cur', x: Math.round(pt.x), y: Math.round(pt.y), b: V.board });
  }
  const d = drag;
  if (!d) return;
  switch (d.type) {
    case 'pan':
      V.x = d.ox + e.clientX - d.sx; V.y = d.oy + e.clientY - d.sy;
      applyView();
      break;
    case 'move': {
      const dx = pt.x - d.start.x, dy = pt.y - d.start.y;
      if (!d.moved) {
        if (Math.hypot(dx, dy) * V.k < 3) return;
        d.moved = true; begin(); d.items = collectMove();
      }
      for (const it of d.items) {
        if (!it.arrow) upd(it.id, { x: Math.round(it.x + dx), y: Math.round(it.y + dy) });
        else {
          const patch = {};
          if (it.ax != null) { patch.ax = it.ax + dx; patch.ay = it.ay + dy; }
          if (it.bx != null) { patch.bx = it.bx + dx; patch.by = it.by + dy; }
          if (patch.ax != null || patch.bx != null) upd(it.id, patch);
        }
      }
      break;
    }
    case 'resize': {
      const o = d.orig, dx = pt.x - d.start.x, dy = pt.y - d.start.y;
      const min = o.t === 'sticker' ? 32 : o.t === 'text' ? 60 : 90;
      let w = Math.max(min, o.w + dx), hgt = Math.max(o.t === 'text' ? 24 : Math.min(min, 60), o.h + dy);
      if (o.t === 'img' || o.t === 'sticker') {
        const k = Math.max(w / o.w, hgt / o.h);
        w = o.w * k; hgt = o.h * k;
      }
      upd(d.id, { w: Math.round(w), h: Math.round(hgt) });
      break;
    }
    case 'marquee': {
      const x = Math.min(d.sx, e.clientX), y = Math.min(d.sy, e.clientY), w = Math.abs(e.clientX - d.sx), hgt = Math.abs(e.clientY - d.sy);
      const m = $('#marquee');
      m.hidden = false;
      Object.assign(m.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hgt + 'px' });
      const a = toWorld(x, y), b = toWorld(x + w, y + hgt);
      const s = new Set(d.base);
      for (const el of boardEls()) {
        const r = bbox([el.id]);
        if (!r) continue;
        const inside = r.x >= a.x && r.y >= a.y && r.x + r.w <= b.x && r.y + r.h <= b.y;
        const touches = r.x < b.x && r.x + r.w > a.x && r.y < b.y && r.y + r.h > a.y;
        if (el.t === 'frame' || el.t === 'arrow' ? inside : touches) s.add(el.id);
      }
      V.sel = s;
      drawSelection(); drawArrows();
      break;
    }
    case 'connect': {
      const src = d.from && S.els.get(d.from);
      const from = src ? clipToRect(rectOf(src), pt) : d.start;
      arrowDraft.hidden = false;
      arrowDraft.setAttribute('d', `M${from.x},${from.y}L${pt.x},${pt.y}`);
      break;
    }
  }
});

function endDrag(e) {
  const d = drag;
  if (!d) return;
  drag = null;
  vp.classList.remove('panning');
  const pt = toWorld(e.clientX, e.clientY);
  switch (d.type) {
    case 'move': if (d.moved) end(); break;
    case 'resize': end(); break;
    case 'marquee': $('#marquee').hidden = true; buildSelbar(); break;
    case 'connect': {
      arrowDraft.hidden = true;
      const far = Math.hypot(pt.x - d.start.x, pt.y - d.start.y) * V.k > 24;
      let target = hitEl(e.clientX, e.clientY);
      if (target === d.from || S.els.get(target)?.t === 'arrow') target = null;
      const arrow = { id: uid(), t: 'arrow', p: V.board };
      let note = null;
      if (d.from) arrow.a = d.from; else { arrow.ax = d.start.x; arrow.ay = d.start.y; }
      if (target) arrow.b = target;
      else if (!far) break;
      else if (d.handle) { note = createAt('note', pt); arrow.b = note.id; }
      else { arrow.bx = pt.x; arrow.by = pt.y; }
      if (!arrow.a && !arrow.b && !far) break;
      act(() => add(arrow));
      setTool('select');
      if (note) { render(); startEdit(note.id); } else select([arrow.id]);
      break;
    }
  }
  placeSelbar();
}
vp.addEventListener('pointerup', endDrag);
vp.addEventListener('pointercancel', endDrag);

vp.addEventListener('dblclick', e => {
  if (editable(e.target) || V.tool !== 'select') return;
  const id = hitEl(e.clientX, e.clientY), el = id && S.els.get(id);
  if (!el) {
    const n = createAt('note', toWorld(e.clientX, e.clientY));
    render();
    startEdit(n.id);
    return;
  }
  if (el.t === 'board' || el.t === 'link' || el.t === 'file') return openEl(el);
  const f = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.dataset?.f && n.closest('.el')?.dataset.id === id);
  startEdit(id, f?.dataset.f);
});

vp.addEventListener('wheel', e => {
  e.preventDefault();
  zoomAt(e.clientX, e.clientY, V.k * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)));
}, { passive: false });

vp.addEventListener('dragover', e => e.preventDefault());
vp.addEventListener('drop', e => {
  e.preventDefault();
  if (e.dataTransfer.files.length) addFiles([...e.dataTransfer.files], toWorld(e.clientX, e.clientY));
});

// ---------- клавиатура и буфер обмена ----------
const boardActive = () => !$('#board').hidden && !$('#modals').childElementCount;
const typing = t => t.closest?.('input, textarea') || editable(t);
const TOOL_KEYS = { KeyV: 'select', KeyH: 'hand', KeyN: 'note', KeyC: 'card', KeyT: 'text', KeyA: 'arrow', KeyG: 'frame', KeyB: 'board' };

addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#modals').childElementCount) { $('#modals').lastChild.dispatchEvent(new Event('dismiss')); return; }
  if (typing(e.target)) {
    if (e.key === 'Escape') e.target.blur();
    if (e.key === 'Enter' && !e.shiftKey && V.edit && (V.edit.f === 'title')) { e.preventDefault(); stopEdit(); }
    return;
  }
  if (!boardActive()) return;
  const mod = e.ctrlKey || e.metaKey;
  if (e.code === 'Space') { spaceDown = true; vp.classList.add('space'); e.preventDefault(); return; }
  if (mod) {
    switch (e.code) {
      case 'KeyZ': e.preventDefault(); e.shiftKey ? redo() : undo(); break;
      case 'KeyY': e.preventDefault(); redo(); break;
      case 'KeyA': e.preventDefault(); select([...boardEls()].map(x => x.id)); break;
      case 'KeyD': e.preventDefault(); duplicate(); break;
      case 'KeyG': e.preventDefault(); groupSelection(); break;
      case 'Digit0': e.preventDefault(); fitAll(); break;
      case 'Equal': e.preventDefault(); zoomAt(innerWidth / 2, innerHeight / 2, V.k * 1.25); break;
      case 'Minus': e.preventDefault(); zoomAt(innerWidth / 2, innerHeight / 2, V.k / 1.25); break;
    }
    return;
  }
  if (e.key === 'Delete' || e.key === 'Backspace') { deleteIds([...V.sel]); return; }
  if (e.key === 'Escape') { closePop(); select([]); setTool('select'); return; }
  const one = V.sel.size === 1 ? S.els.get([...V.sel][0]) : null;
  if (e.key === 'Enter' && one) { e.preventDefault(); (one.t === 'board' || one.t === 'link' || one.t === 'file') ? openEl(one) : startEdit(one.id); return; }
  if (e.key === 'F2' && one) { e.preventDefault(); startEdit(one.id); return; }
  if (e.key.startsWith('Arrow') && V.sel.size) {
    e.preventDefault();
    const s = e.shiftKey ? 10 : 1, dx = e.key === 'ArrowLeft' ? -s : e.key === 'ArrowRight' ? s : 0, dy = e.key === 'ArrowUp' ? -s : e.key === 'ArrowDown' ? s : 0;
    act(() => collectMove().forEach(it => !it.arrow && upd(it.id, { x: it.x + dx, y: it.y + dy })));
    return;
  }
  if (TOOL_KEYS[e.code]) setTool(TOOL_KEYS[e.code]);
});
addEventListener('keyup', e => { if (e.code === 'Space') { spaceDown = false; vp.classList.remove('space'); } });
addEventListener('blur', () => { spaceDown = false; vp.classList.remove('space'); });

const CLIP_MARK = 'pleiada-clip:';
function onCopy(e, cut) {
  if (typing(e.target) || !boardActive() || !V.sel.size) return;
  e.preventDefault();
  e.clipboardData.setData('text/plain', CLIP_MARK + JSON.stringify(specsFrom([...V.sel])));
  if (cut) deleteIds([...V.sel]);
}
addEventListener('copy', e => onCopy(e, false));
addEventListener('cut', e => onCopy(e, true));
addEventListener('paste', e => {
  if (typing(e.target) || !boardActive()) return;
  e.preventDefault();
  const at = viewCenter();
  const files = [...e.clipboardData.files];
  if (files.length) return addFiles(files, at);
  const text = e.clipboardData.getData('text/plain');
  if (!text.trim()) return;
  if (text.startsWith(CLIP_MARK)) {
    try { pasteSpecs(JSON.parse(text.slice(CLIP_MARK.length)), at); } catch { toast('Не удалось вставить'); }
    return;
  }
  const u = /^https?:\/\/\S+$/i.test(text.trim()) && safeUrl(text.trim());
  const el = u
    ? { id: uid(), t: 'link', p: V.board, url: u.href, title: '', w: 300, h: 76, x: Math.round(at.x - 150), y: Math.round(at.y - 38), z: nextZ(1) }
    : { id: uid(), t: 'note', p: V.board, text: text.slice(0, 20000), c: 0, w: 240, h: 150, x: Math.round(at.x - 120), y: Math.round(at.y - 75), z: nextZ(1) };
  act(() => add(el));
  select([el.id]);
});

// ============================================================
//  Участники
// ============================================================
const cursorNodes = new Map();
function drawCursor(m) {
  const p = S.peers.get(m.from);
  if (!p || m.b !== V.board) return removeCursor(m.from);
  let n = cursorNodes.get(m.from);
  if (!n) {
    const s = svg('svg', { viewBox: '0 0 20 20' });
    s.append(svg('path', { d: 'M3 2l13 6.5-5.5 1.8L8.5 16z', fill: p.color, stroke: '#fff', 'stroke-width': 1.2 }));
    n = h('div', { class: 'cur' }, h('div', null, s, h('span', { style: `background:${p.color}` }, p.name)));
    $('#cursors').append(n);
    cursorNodes.set(m.from, n);
  }
  n.style.transform = `translate(${m.x}px,${m.y}px)`;
}
function removeCursor(id) { cursorNodes.get(id)?.remove(); cursorNodes.delete(id); }
function drawPeers() {
  const box = $('#peers');
  box.replaceChildren();
  for (const p of [...S.peers.values()].slice(0, 6))
    box.append(h('div', { class: 'peer', style: `background:${/^#[0-9a-f]{6}$/i.test(p.color) ? p.color : '#888'}`, 'data-tip': p.name }, (p.name || '?').trim().charAt(0).toUpperCase()));
}
function drawStatus() {
  const s = $('#status');
  s.dataset.state = S.online ? 'on' : 'off';
  $('span', s).textContent = !S.online ? 'Нет связи…' : S.peers.size ? `Онлайн: ${S.peers.size + 1}` : 'Сохранено';
}

// ============================================================
//  Поповеры, модальные окна
// ============================================================
const pop = $('#pop');
let popAnchor = null;
function closePop() { pop.hidden = true; popAnchor = null; }
function openPop(anchor, content, cls = '') {
  if (popAnchor === anchor) return closePop();
  popAnchor = anchor;
  pop.className = 'float pop ' + cls;
  pop.replaceChildren(...content);
  pop.hidden = false;
  const a = anchor.getBoundingClientRect(), w = pop.offsetWidth, hgt = pop.offsetHeight;
  const side = !!anchor.closest('#dock');
  const left = side ? a.right + 14 : a.right - w;
  const top = side ? a.top + a.height / 2 - hgt / 2 : a.bottom + 12;
  pop.style.left = clamp(left, 10, innerWidth - w - 10) + 'px';
  pop.style.top = clamp(top, 10, innerHeight - hgt - 10) + 'px';
}
addEventListener('pointerdown', e => {
  if (!pop.hidden && !pop.contains(e.target) && !popAnchor?.contains(e.target) && !vp.contains(e.target)) closePop();
}, true);

function openModal(...content) {
  const scrim = h('div', { class: 'scrim' }, h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' }, ...content));
  const close = () => scrim.remove();
  scrim.addEventListener('pointerdown', e => { if (e.target === scrim) scrim.dispatchEvent(new Event('dismiss')); });
  scrim.addEventListener('dismiss', close);
  $('#modals').append(scrim);
  setTimeout(() => $('input', scrim)?.focus(), 30);
  return { close, scrim };
}
function ask({ title, text, label, value = '', placeholder = '', ok = 'Готово' }) {
  return new Promise(res => {
    const input = h('input', { type: 'text', value, placeholder, spellcheck: 'false' });
    const done = v => { m.close(); res(v); };
    const m = openModal(
      h('h2', null, title), text && h('p', null, text), label && h('label', null, label), input,
      h('div', { class: 'actions' },
        h('button', { class: 'btn ghost', onclick: () => done(null) }, 'Отмена'),
        h('button', { class: 'btn primary', onclick: () => done(input.value) }, ok)),
    );
    input.addEventListener('keydown', e => { if (e.key === 'Enter') done(input.value); });
    m.scrim.addEventListener('dismiss', () => res(null));
    setTimeout(() => input.select(), 40);
  });
}
function confirmBox({ title, text, ok = 'Удалить', danger = true }) {
  return new Promise(res => {
    const done = v => { m.close(); res(v); };
    const m = openModal(h('h2', null, title), h('p', null, text),
      h('div', { class: 'actions' },
        h('button', { class: 'btn ghost', onclick: () => done(false) }, 'Отмена'),
        h('button', { class: 'btn ' + (danger ? 'danger' : 'primary'), onclick: () => done(true) }, ok)));
    m.scrim.addEventListener('dismiss', () => res(false));
  });
}

// ---------- стикеры и шаблоны ----------
const STICKERS = {
  'Игры': ['🎮', '🕹️', '👾', '🎲', '🧩', '🏆', '⚔️', '🛡️', '🗡️', '🏹', '🧙', '🧝', '🐉', '👑', '💎', '🗝️', '🧪', '🗺️', '🏰', '🚀', '👻', '🤖', '💀', '🪙', '💣', '🧟', '🦄', '🛸'],
  'Реакции': ['⭐', '🔥', '💡', '❤️', '👍', '👎', '✅', '❌', '❓', '❗', '⚠️', '🎯', '🚧', '💬', '👀', '🎉', '💯', '⏳', '📌', '🔒', '🤔'],
  'Творчество': ['🎨', '✏️', '🎬', '🎵', '📷', '📖', '🎭', '🧠', '✨', '🌈', '🌙', '☀️', '🌊', '🌲', '⚡', '❄️', '🌋', '🏝️', '🌌', '🍀', '🌸'],
};
let stickerShift = 0;
function addSticker(e) {
  const c = viewCenter(), o = (stickerShift++ % 6) * 26;
  const el = { id: uid(), t: 'sticker', p: V.board, e, w: 88, h: 88, x: Math.round(c.x - 44 + o), y: Math.round(c.y - 44 + o), z: nextZ(1) };
  act(() => add(el));
  select([el.id]);
}
function stickersPanel() {
  const out = [h('h3', null, 'Стикеры'), h('p', null, 'Нажмите, чтобы наклеить на доску')];
  for (const [name, list] of Object.entries(STICKERS))
    out.push(h('h4', null, name), h('div', { class: 'emo-grid' }, list.map(e => h('button', { onclick: () => addSticker(e), 'aria-label': e }, e))));
  out.push(h('h4', null, 'Свои'), h('button', { class: 'btn', style: 'width:100%', icon: 'upload', onclick: () => $('#file-sticker').click() }, 'Загрузить картинку-стикер'));
  return out;
}
function applyTemplate(t) {
  closePop();
  const ids = insertSpecs(t.build(), viewCenter());
  select(ids);
  render();
  const r = bbox(ids);
  if (r) fitRect(r);
}
function templatesPanel() {
  return [h('h3', null, 'Шаблоны'), h('p', null, 'Готовые структуры для геймдизайна — добавляются на текущую доску'),
    ...TEMPLATES.map(t => h('button', { class: 'tpl', onclick: () => applyTemplate(t) },
      h('div', { class: 'badge', icon: t.icon }), h('div', null, h('b', null, t.name), h('small', null, t.desc))))];
}

// ============================================================
//  Проекты
// ============================================================
function recents() { return store.get('recents', []); }
function remember(p) {
  const list = recents().filter(r => !(r.s === p.server && r.id === p.id));
  list.unshift({ s: p.server, id: p.id, name: p.name, t: Date.now() });
  store.set('recents', list.slice(0, 60));
}
function forget(server, id) { store.set('recents', recents().filter(r => !(r.s === server && r.id === id))); }

function setProjectName(name, local) {
  P.name = name;
  const input = $('#project-name');
  if (document.activeElement !== input) input.value = name;
  input.style.width = clamp(name.length + 2, 8, 32) + 'ch';
  document.title = name ? `${name} — Плеяда` : 'Плеяда';
  if (local) send({ t: 'meta', name });
  if (P.id) remember(P);
}

function openProject(p, opts = {}) {
  disconnect();
  Object.assign(P, { server: p.server, id: p.id, name: p.name || '' });
  S.els.clear(); S.out.clear(); S.outDel.clear(); S.peers.clear(); S.clock = 0;
  undoStack.length = redoStack.length = 0; tx = null; syncHistoryButtons();
  Object.assign(V, { board: 'root', x: innerWidth / 2, y: innerHeight / 2, k: 1, sel: new Set(), edit: null });
  V.views.clear();
  showScreen('board');
  $('#modals').replaceChildren();
  closePop(); setTool('select'); setProjectName(P.name, false); buildSelbar();
  drawPeers(); drawStatus(); applyView(); invalidateAll();
  history.replaceState(null, '', P.server === ORIGIN ? '#b=' + P.id : '#');
  onFirstInit = () => {
    if (opts.els) act(() => opts.els.forEach(el => add(el)));
    if (opts.template) insertSpecs(opts.template.build(), { x: 0, y: 0 });
    undoStack.length = 0; syncHistoryButtons();
    render();
    fitAll();
  };
  connect();
}

async function showHome() {
  disconnect();
  P.id = null;
  if (ACC) return accHome();
  showScreen('home');
  $('#modals').replaceChildren();
  document.title = 'Плеяда';
  history.replaceState(null, '', '#');
  const box = $('#projects');
  let list = recents().map(r => ({ server: r.s, id: r.id, name: r.name, t: r.t }));
  if (HOST) {
    try {
      const r = await fetch('/api/boards', { headers: { 'X-Admin': HOST.token } });
      const local = await r.json();
      list = list.filter(p => p.server !== ORIGIN);
      for (const b of local) list.push({ server: ORIGIN, id: b.id, name: b.name, t: Date.parse(b.updated), count: b.count });
    } catch { /* остаёмся со списком недавних */ }
  }
  list.sort((a, b) => (b.t || 0) - (a.t || 0));
  box.replaceChildren();
  if (!list.length) {
    box.append(h('div', { class: 'home-empty' }, h('b', null, 'Проектов пока нет'), 'Создайте первый — например, из шаблона Game Design Document'));
    return;
  }
  for (const p of list) {
    const local = isLocalServer(p.server), k = hash(p.id) % 5;
    const cover = h('div', { class: 'cover k' + k, style: `--c:var(--c${k});--ci:var(--c${k}i)` });
    for (let i = 0, s = hash(p.id + 'x'); i < 5; i++, s = (s * 7919 + 13) % 100003)
      cover.append(h('i', { style: `left:${8 + (s % 70)}%;top:${10 + ((s >> 3) % 55)}%;width:${26 + (s % 40)}px;height:${18 + ((s >> 5) % 26)}px` }));
    const card = h('div', { class: 'proj', tabindex: '0', role: 'button', onclick: () => openProject(p) },
      cover,
      h('div', { class: 'info' }, h('b', null, p.name || 'Без названия'),
        h('small', null, ic(local ? 'pc' : 'cloud'), `${local ? 'На этом компьютере' : new URL(p.server).host} · ${fmtDate(p.t)}`)),
      h('button', {
        class: 'ib x', icon: 'trash', 'aria-label': 'Удалить', onclick: async e => {
          e.stopPropagation();
          if (local) {
            if (!await confirmBox({ title: 'Удалить проект?', text: `«${p.name || 'Без названия'}» будет удалён с этого компьютера без возможности восстановления.` })) return;
            await fetch('/api/boards/' + p.id, { method: 'DELETE', headers: { 'X-Admin': HOST.token } });
          } else if (!await confirmBox({ title: 'Убрать из списка?', text: 'Проект останется на сервере — его можно снова открыть по ссылке.', ok: 'Убрать' })) return;
          forget(p.server, p.id);
          showHome();
        },
      }));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target === card) openProject(p); });
    box.append(card);
  }
}

function newProjectDialog() {
  let chosen = null, busy = false;
  const name = h('input', { type: 'text', value: 'Новый проект', maxlength: '120' });
  const options = [{ id: '', name: 'Пустая доска', desc: 'Начать с чистого листа', icon: 'plus' }, ...TEMPLATES];
  const grid = h('div', { class: 'tpl-grid' }, options.map((t, i) => {
    const b = h('button', { class: 'tpl' + (i ? '' : ' on'), onclick: () => { chosen = t.build ? t : null; $$('.tpl', grid).forEach(x => x.classList.toggle('on', x === b)); } },
      h('div', { class: 'badge', icon: t.icon }), h('div', null, h('b', null, t.name), h('small', null, t.desc)));
    return b;
  }));
  const create = async () => {
    if (busy) return;
    busy = true;
    const title = name.value.trim() || 'Новый проект';
    try { launchProject(await newProjectId(title), title, { template: chosen }); m.close(); }
    catch (err) { toast(err.message, 4000); busy = false; }
  };
  name.addEventListener('keydown', e => { if (e.key === 'Enter') create(); });
  const m = openModal(h('h2', null, 'Новый проект'), h('label', null, 'Название'), name, h('label', null, 'С чего начать'), grid,
    h('div', { class: 'actions' }, h('button', { class: 'btn ghost', onclick: () => m.close() }, 'Отмена'), h('button', { class: 'btn primary', onclick: create }, 'Создать')));
  setTimeout(() => name.select(), 40);
}

function parseLink(text) {
  const u = safeUrl(text.trim());
  const id = u && new URLSearchParams(u.hash.slice(1)).get('b');
  return id && /^[A-Za-z0-9_-]{6,40}$/.test(id) ? { server: u.origin, id } : null;
}
async function joinDialog() {
  const link = await ask({ title: 'Открыть по ссылке', text: 'Вставьте ссылку, которой с вами поделились.', placeholder: 'http://…/#b=…', ok: 'Открыть' });
  if (link == null) return;
  const p = parseLink(link);
  if (!p) return toast('В ссылке нет кода проекта');
  openProject(p);
}

// ---------- экспорт, импорт, публикация ----------
const blobToDataUrl = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
async function exportData() {
  const els = [...S.els.values()].map(clone), blobs = {};
  for (const el of els) {
    if (!el.src || blobs[el.src]) continue;
    try { blobs[el.src] = await blobToDataUrl(await (await fetch(P.server + el.src)).blob()); } catch { /* файл недоступен — пропускаем */ }
  }
  return { app: 'pleiada', version: 1, name: P.name, els, blobs };
}
async function importData(data, server, id) {
  if (data?.app !== 'pleiada' || !Array.isArray(data.els)) throw new Error('Это не файл проекта «Плеяды»');
  const map = {};
  for (const [path, url] of Object.entries(data.blobs || {})) {
    if (!/^data:/.test(url)) continue;
    map[path] = await upload(await (await fetch(url)).blob(), path.split('/').pop(), server, id);
  }
  return data.els.filter(el => el && typeof el.id === 'string').map(el => (el.src ? { ...el, src: map[el.src] || el.src } : el));
}
async function exportFile() {
  toast('Готовим файл…');
  const data = await exportData();
  const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' })), download: (P.name || 'project').replace(/[\\/:*?"<>|]/g, '_') + '.pleiada.json' });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
async function importFile(file) {
  try {
    const data = JSON.parse(await file.text());
    if (data?.app !== 'pleiada') throw new Error('Это не файл проекта «Плеяды»');
    const name = String(data.name || file.name.replace(/\.pleiada\.json$|\.json$/i, '')).slice(0, 120) || 'Импорт';
    const id = await newProjectId(name);
    launchProject(id, name, { els: await importData(data, ORIGIN, id) });
  } catch (err) { toast('Не удалось импортировать: ' + err.message, 4000); }
}
async function publishTo(input) {
  const u = safeUrl(input.trim());
  if (!u) throw new Error('Некорректный адрес сервера');
  const server = u.origin;
  if (server === P.server) throw new Error('Проект уже на этом сервере');
  let info;
  try { info = await (await fetch(server + '/api/info')).json(); } catch { throw new Error('Сервер не отвечает'); }
  if (info?.app !== 'pleiada') throw new Error('По этому адресу нет сервера «Плеяды»');
  if (info.accounts) throw new Error('Этот сервер требует входа. Экспортируйте проект в файл и импортируйте его в команду в веб-версии');
  const id = uid(14), els = await importData(await exportData(), server, id);
  openProject({ server, id, name: P.name }, { els });
  toast('Проект опубликован — поделитесь ссылкой');
}

// ---------- окно «Поделиться» ----------
let lan = { on: false, urls: [], error: null }, lanChanged = null;
window.chrome?.webview?.addEventListener('message', e => {
  if (e.data?.type === 'lan') { lan = e.data; lanChanged?.(); }
});
function copyRow(text) {
  const input = h('input', { type: 'text', readonly: true, value: text });
  return h('div', { class: 'row' }, input, h('button', { class: 'btn', icon: 'copy', onclick: async () => {
    try { await navigator.clipboard.writeText(text); } catch { input.select(); document.execCommand('copy'); }
    toast('Ссылка скопирована');
  } }, 'Копировать'));
}
function shareDialog() {
  if (ACC) return accShare();
  const name = h('input', { type: 'text', value: me.name, maxlength: '40' });
  name.addEventListener('change', () => {
    me.name = name.value.trim() || 'Гость';
    store.set('name', me.name);
    send({ t: 'who', name: me.name });
  });
  const body = h('div');
  const local = isLocalServer(P.server);
  const draw = () => {
    body.replaceChildren();
    if (!local) {
      body.append(h('label', null, 'Ссылка на проект'), copyRow(`${P.server}/#b=${P.id}`),
        h('p', { style: 'margin-top:10px;font-size:13px' }, 'Все, у кого есть ссылка, могут открыть проект в приложении или прямо в браузере и редактировать его вместе с вами.'));
      return;
    }
    const sw = h('button', { class: 'switch' + (lan.on ? ' on' : ''), role: 'switch', 'aria-checked': String(lan.on), 'aria-label': 'Доступ по сети', onclick: () => hostPost({ type: 'lan', on: !lan.on }) });
    const sec = h('section', null, h('h3', null, 'Доступ по локальной сети', sw),
      h('p', null, 'Проект хранится на этом компьютере. Включите доступ — и участники в той же сети (Wi‑Fi, VPN) смогут открыть его по ссылке, пока приложение запущено.'));
    if (lan.error) sec.append(h('p', { style: 'color:var(--danger)' }, lan.error));
    if (lan.on) for (const u of lan.urls) sec.append(copyRow(`${u}/#b=${P.id}`));
    if (lan.on && !lan.urls.length) sec.append(h('p', null, 'Сетевых подключений не найдено.'));
    const addr = h('input', { type: 'text', placeholder: 'https://boards.example.com', value: store.get('cloud', ''), spellcheck: 'false' });
    const btn = h('button', { class: 'btn primary', icon: 'cloud', onclick: async () => {
      btn.disabled = true;
      try { store.set('cloud', addr.value.trim()); await publishTo(addr.value); }
      catch (err) { toast(err.message, 4000); btn.disabled = false; }
    } }, 'Опубликовать');
    body.append(sec, h('section', null, h('h3', null, 'Облачный сервер'),
      h('p', null, 'Чтобы проект был доступен всегда и из любой точки, перенесите его на сервер «Плеяды» (Pleiada.Server), развёрнутый на хостинге. Копия на этом компьютере сохранится.'),
      h('div', { class: 'row' }, addr, btn)));
  };
  draw();
  lanChanged = draw;
  const m = openModal(h('h2', null, 'Совместная работа'), h('label', null, 'Ваше имя для других участников'), name, body,
    h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: () => m.close() }, 'Готово')));
}

function shortcutsDialog() {
  const rows = [
    ['Двойной щелчок по холсту', 'новая заметка'], ['Двойной щелчок по элементу', 'редактировать / открыть'],
    ['Колесо мыши', 'масштаб'], ['Пробел + перетаскивание, средняя или правая кнопка', 'панорама'],
    ['V H N C T A G B', 'инструменты'], ['Синяя точка справа от элемента', 'протянуть стрелку'],
    ['Ctrl+Z / Ctrl+Y', 'отменить / вернуть'], ['Ctrl+C / Ctrl+V / Ctrl+D', 'копировать / вставить / дублировать'],
    ['Ctrl+G', 'сгруппировать выделенное'], ['Ctrl+A', 'выделить всё'], ['Ctrl+0', 'показать всё'], ['Delete', 'удалить'],
    ['Ctrl+V с картинкой или ссылкой', 'вставить на доску'], ['Перетащить файлы в окно', 'добавить картинки и файлы'],
  ];
  const m = openModal(h('h2', null, 'Горячие клавиши'),
    h('div', { style: 'display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin-top:14px' }, rows.flatMap(([k, v]) => [h('code', null, k), h('span', { style: 'color:var(--ink-2)' }, v)])),
    h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: () => m.close() }, 'Понятно')));
}

// ============================================================
//  Тема и привязка интерфейса
// ============================================================
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('pl.theme', t); } catch { /* хранилище недоступно */ }
  for (const b of [$('#btn-theme'), $('#home-theme')]) b.replaceChildren(ic(t === 'dark' ? 'sun' : 'moon'));
  hostPost({ type: 'theme', dark: t === 'dark' });
}
const toggleTheme = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');

for (const n of $$('[data-icon]')) n.prepend(ic(n.dataset.icon));
$('#btn-theme').onclick = $('#home-theme').onclick = toggleTheme;
$('#btn-home').onclick = showHome;
$('#btn-share').onclick = shareDialog;
$('#btn-undo').onclick = undo;
$('#btn-redo').onclick = redo;
$('#zoom-in').onclick = () => zoomAt(innerWidth / 2, innerHeight / 2, V.k * 1.25);
$('#zoom-out').onclick = () => zoomAt(innerWidth / 2, innerHeight / 2, V.k / 1.25);
$('#zoom-val').onclick = () => zoomAt(innerWidth / 2, innerHeight / 2, 1);
$('#zoom-fit').onclick = fitAll;
$('#home-new').onclick = () => newProjectDialog();
$('#home-join').onclick = joinDialog;
$('#home-import').onclick = () => $('#file-import').click();

$('#btn-menu').onclick = e => openPop(e.currentTarget, [
  h('button', { icon: 'download', onclick: () => { closePop(); exportFile(); } }, 'Экспорт в файл'),
  h('button', { icon: 'fit', onclick: () => { closePop(); fitAll(); } }, 'Показать всё'),
  h('button', { icon: 'keyboard', onclick: () => { closePop(); shortcutsDialog(); } }, 'Горячие клавиши'),
  h('button', { icon: 'home', onclick: showHome }, 'Все проекты'),
], 'menu');

$$('#dock [data-tool]').forEach(b => b.onclick = () => { closePop(); setTool(b.dataset.tool); });
$$('#dock [data-act]').forEach(b => b.onclick = () => {
  const act = b.dataset.act;
  if (act === 'stickers') return openPop(b, stickersPanel());
  if (act === 'templates') return openPop(b, templatesPanel());
  closePop();
  if (act === 'image') $('#file-img').click();
  if (act === 'file') $('#file-any').click();
  if (act === 'link') addLink(viewCenter());
});
function onPick(sel, fn) {
  $(sel).addEventListener('change', e => { const files = [...e.target.files]; e.target.value = ''; if (files.length) fn(files); });
}
onPick('#file-img', f => addFiles(f, viewCenter()));
onPick('#file-any', f => addFiles(f, viewCenter()));
onPick('#file-sticker', f => addFiles(f, viewCenter(), true));
onPick('#file-import', f => importFile(f[0]));

const nameInput = $('#project-name');
nameInput.addEventListener('change', () => setProjectName(nameInput.value.trim() || 'Без названия', true));
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') nameInput.blur(); });
nameInput.addEventListener('blur', () => { nameInput.value = P.name; });

addEventListener('resize', applyView);
addEventListener('hashchange', route);

function route() {
  if (ACC) return accRoute();
  const id = new URLSearchParams(location.hash.slice(1)).get('b');
  if (id && /^[A-Za-z0-9_-]{6,40}$/.test(id)) { if (id !== P.id) openProject({ server: ORIGIN, id }); }
  else if (P.id == null || P.server === ORIGIN) showHome();
}

setTheme(document.documentElement.dataset.theme);
syncHistoryButtons();

async function boot() {
  if (!HOST) {
    try { ACC = !!(await (await fetch('/api/info')).json()).accounts; } catch { /* сервер без учётных записей */ }
  }
  route();
}
boot();
