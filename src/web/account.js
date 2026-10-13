'use strict';
// Веб-версия с учётными записями: вход, команды, проекты внутри команд.
// Работает, когда сервер сообщает accounts: true; использует общие функции из app.js.

ICONS.logout = 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10';
ICONS.back = 'M15 6l-6 6 6 6';

const A = { user: null, team: null, projectTeam: null, pending: null };

async function api(path, method = 'GET', body) {
  const r = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await r.json(); } catch { /* пустой ответ */ }
  if (!r.ok) {
    const e = new Error(data?.error || 'Сервер не смог выполнить запрос');
    e.status = r.status;
    throw e;
  }
  return data;
}
function go(hash) { if (location.hash.slice(1) === hash) accRoute(); else location.hash = hash; }
function leaveBoard() { if (P.id) { disconnect(); P.id = null; } }
function sessionLost(e) {
  if (e.status !== 401) return false;
  A.user = null;
  showAuth();
  return true;
}

let routing = 0;
async function accRoute() {
  const turn = ++routing;
  const q = new URLSearchParams(location.hash.slice(1));
  if (!A.user) {
    try { A.user = await api('/api/me'); } catch { return showAuth(); }
    if (turn !== routing) return;
  }
  me.name = A.user.name;

  const invite = q.get('invite');
  if (invite) {
    try {
      const r = await api('/api/invites/' + encodeURIComponent(invite), 'POST');
      toast('Вы в команде');
      return go('t=' + r.id);
    } catch (e) {
      if (sessionLost(e)) return;
      toast(e.message, 4000);
      return go('');
    }
  }

  const b = q.get('b');
  if (b) {
    if (b === P.id) return;
    try {
      const p = await api('/api/projects/' + encodeURIComponent(b));
      if (turn !== routing) return;
      A.projectTeam = { id: p.teamId, name: p.teamName };
      const opts = A.pending?.id === b ? A.pending.opts : {};
      A.pending = null;
      openProject({ server: ORIGIN, id: b, name: p.name }, opts);
    } catch (e) {
      if (sessionLost(e)) return;
      toast(e.message, 4000);
      go('');
    }
    return;
  }

  leaveBoard();
  const t = q.get('t');
  if (t) return showTeam(t);
  showTeams();
}

// Вызывается из app.js
function accHome() { go(A.projectTeam ? 't=' + A.projectTeam.id : ''); }
function accOpen(id, opts) { A.pending = { id, opts }; go('b=' + id); }
async function accCreateProject(name) {
  if (!A.team) throw new Error('Сначала откройте команду');
  return (await api(`/api/teams/${A.team.id}/projects`, 'POST', { name })).id;
}
async function accCheckAccess() {
  if (!P.id) return;
  try { await api('/api/projects/' + P.id); }
  catch (e) {
    if (sessionLost(e)) return;
    if (e.status === 404) { toast('Доступ к проекту закрыт', 4000); go(''); }
  }
}

// ---------- вход и регистрация ----------
function themeButton() {
  const icon = () => ic(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon');
  const b = h('button', { class: 'ib', type: 'button', 'data-tip': 'Тема', 'aria-label': 'Сменить тему', onclick: () => { toggleTheme(); b.replaceChildren(icon()); } }, icon());
  return b;
}

function showAuth(mode = 'login') {
  leaveBoard();
  showScreen('auth');
  $('#modals').replaceChildren();
  document.title = 'Плеяда';
  const reg = mode === 'register';
  const invited = new URLSearchParams(location.hash.slice(1)).has('invite');
  const err = h('p', { class: 'err', role: 'alert' });
  const name = h('input', { type: 'text', id: 'au-name', autocomplete: 'name', maxlength: '40', required: true });
  const email = h('input', { type: 'email', id: 'au-email', autocomplete: 'email', maxlength: '254', required: true });
  const pass = h('input', { type: 'password', id: 'au-pass', autocomplete: reg ? 'new-password' : 'current-password', minlength: '8', maxlength: '200', required: true });
  const submit = h('button', { class: 'btn primary', type: 'submit' }, reg ? 'Создать аккаунт' : 'Войти');
  const form = h('form', {
    class: 'auth-card', onsubmit: async e => {
      e.preventDefault();
      submit.disabled = true; err.textContent = '';
      const body = { email: email.value, password: pass.value };
      if (reg) body.name = name.value;
      try { A.user = await api('/api/auth/' + mode, 'POST', body); accRoute(); }
      catch (ex) { err.textContent = ex.message; submit.disabled = false; }
    },
  },
    h('div', { class: 'brand' }, h('img', { src: 'logo.svg', alt: '' }), h('div', null, h('h1', null, 'Плеяда'), h('p', null, 'Доски для творческих проектов'))),
    h('h2', null, reg ? 'Регистрация' : 'Вход'),
    invited && h('p', { class: 'hint' }, 'Вас пригласили в команду. Войдите или зарегистрируйтесь, чтобы присоединиться.'),
    reg && h('label', { for: 'au-name' }, 'Имя'), reg && name,
    h('label', { for: 'au-email' }, 'Почта'), email,
    h('label', { for: 'au-pass' }, reg ? 'Пароль (не короче 8 символов)' : 'Пароль'), pass,
    err, submit,
    h('p', { class: 'switch-mode' }, reg ? 'Уже есть аккаунт? ' : 'Впервые здесь? ',
      h('button', { type: 'button', class: 'linkish', onclick: () => showAuth(reg ? 'login' : 'register') }, reg ? 'Войти' : 'Зарегистрироваться')));
  $('#auth').replaceChildren(h('div', { class: 'auth-theme' }, themeButton()), form);
  setTimeout(() => (reg ? name : email).focus(), 30);
}

async function logout() {
  try { await api('/api/auth/logout', 'POST'); } catch { /* сессии уже нет */ }
  A.user = null; A.team = null; A.projectTeam = null;
  history.replaceState(null, '', '#');
  showAuth();
}

// ---------- команды ----------
function accHeader() {
  const u = A.user;
  return h('header', null,
    h('div', { class: 'brand' }, h('img', { src: 'logo.svg', alt: '' }), h('div', null, h('h1', null, 'Плеяда'), h('p', null, 'Бесконечные доски для творческих проектов'))),
    h('div', { class: 'user-bar' },
      h('div', { class: 'user-chip' }, h('i', null, u.name.charAt(0).toUpperCase()), h('div', null, h('b', null, u.name), h('small', null, u.email))),
      themeButton(),
      h('button', { class: 'ib', icon: 'logout', 'data-tip': 'Выйти', 'aria-label': 'Выйти', onclick: logout })));
}
function cover(id, label) {
  const k = hash(id) % 5;
  const c = h('div', { class: 'cover', style: `--c:var(--c${k});--ci:var(--c${k}i)` });
  if (label) return c.append(h('span', null, label)), c;
  for (let i = 0, s = hash(id + 'x'); i < 5; i++, s = (s * 7919 + 13) % 100003)
    c.append(h('i', { style: `left:${8 + (s % 70)}%;top:${10 + ((s >> 3) % 55)}%;width:${26 + (s % 40)}px;height:${18 + ((s >> 5) % 26)}px` }));
  return c;
}
function tile(coverNode, title, meta, onOpen, onDelete) {
  const card = h('div', { class: 'proj', tabindex: '0', role: 'button', onclick: onOpen }, coverNode,
    h('div', { class: 'info' }, h('b', null, title), h('small', null, meta)),
    onDelete && h('button', { class: 'ib x', icon: 'trash', 'aria-label': 'Удалить', onclick: e => { e.stopPropagation(); onDelete(); } }));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target === card) onOpen(); });
  return card;
}
const people = n => `${n} ${plural(n, ['участник', 'участника', 'участников'])}`;
const projectsWord = n => `${n} ${plural(n, ['проект', 'проекта', 'проектов'])}`;

async function showTeams() {
  let teams;
  try { teams = await api('/api/teams'); } catch (e) { if (sessionLost(e)) return; toast(e.message, 4000); teams = []; }
  A.team = null;
  showScreen('acc');
  document.title = 'Команды — Плеяда';
  const grid = h('div', { class: 'grid' });
  for (const t of teams)
    grid.append(tile(cover(t.id, t.name.trim().charAt(0).toUpperCase()), t.name,
      `${people(t.members)} · ${projectsWord(t.projects)}${t.role === 'owner' ? ' · вы владелец' : ''}`, () => go('t=' + t.id)));
  if (!teams.length)
    grid.append(h('div', { class: 'home-empty' }, h('b', null, 'Вы пока не состоите ни в одной команде'), 'Создайте свою или вступите по ссылке-приглашению от коллег'));
  $('#acc .home-in').replaceChildren(accHeader(),
    h('div', { class: 'home-actions' },
      h('button', { class: 'btn primary', icon: 'plus', onclick: createTeam }, 'Создать команду'),
      h('button', { class: 'btn', icon: 'users', onclick: joinByInvite }, 'Вступить по приглашению')),
    h('h2', { class: 'sec' }, 'Мои команды'), grid);
}
async function createTeam() {
  const name = await ask({ title: 'Новая команда', label: 'Название', placeholder: 'Например, «Студия Орион»', ok: 'Создать' });
  if (name == null) return;
  try { go('t=' + (await api('/api/teams', 'POST', { name })).id); } catch (e) { toast(e.message, 4000); }
}
async function joinByInvite() {
  const text = await ask({ title: 'Вступить в команду', text: 'Вставьте ссылку-приглашение, которую вам прислали.', placeholder: 'http://…/#invite=…', ok: 'Вступить' });
  if (text == null) return;
  const code = (/invite=([A-Za-z0-9]+)/.exec(text) || /^\s*([A-Za-z0-9]{10,})\s*$/.exec(text) || [])[1];
  if (!code) return toast('В ссылке нет кода приглашения');
  go('invite=' + code);
}

async function showTeam(id) {
  let t;
  try { t = await api('/api/teams/' + encodeURIComponent(id)); }
  catch (e) { if (sessionLost(e)) return; toast(e.message, 4000); return go(''); }
  A.team = t;
  A.projectTeam = { id: t.id, name: t.name };
  showScreen('acc');
  document.title = `${t.name} — Плеяда`;
  const owner = t.role === 'owner';
  const reload = () => showTeam(id);
  const run = async (fn, after = reload) => { try { await fn(); after(); } catch (e) { if (!sessionLost(e)) toast(e.message, 4000); } };

  const projects = h('div', { class: 'grid' });
  for (const p of [...t.projects].sort((a, b) => Date.parse(b.updated) - Date.parse(a.updated))) {
    const mine = owner || p.by === A.user.id;
    projects.append(tile(cover(p.id), p.name || 'Без названия', fmtDate(Date.parse(p.updated)), () => go('b=' + p.id), mine && (async () => {
      if (await confirmBox({ title: 'Удалить проект?', text: `«${p.name || 'Без названия'}» будет удалён для всей команды без возможности восстановления.` }))
        run(() => api('/api/projects/' + p.id, 'DELETE'));
    })));
  }
  if (!t.projects.length)
    projects.append(h('div', { class: 'home-empty' }, h('b', null, 'В команде пока нет проектов'), 'Создайте первый — например, из шаблона Game Design Document'));

  const members = h('div', { class: 'members' });
  for (const m of t.members) {
    const self = m.id === A.user.id;
    members.append(h('div', { class: 'member' },
      h('i', { style: `background:${PEER_COLORS[hash(m.id) % PEER_COLORS.length]}` }, m.name.charAt(0).toUpperCase()),
      h('div', null, h('b', null, m.name + (self ? ' (вы)' : '')), h('small', null, m.email)),
      h('span', { class: 'role' }, m.role === 'owner' ? 'Владелец' : 'Участник'),
      owner && !self && h('button', {
        class: 'ib', icon: 'x', 'data-tip': 'Исключить', 'aria-label': 'Исключить ' + m.name, onclick: async () => {
          if (await confirmBox({ title: 'Исключить участника?', text: `${m.name} потеряет доступ ко всем проектам команды.`, ok: 'Исключить' }))
            run(() => api(`/api/teams/${id}/members/${m.id}`, 'DELETE'));
        },
      })));
  }

  const invite = owner && h('div', { class: 'invite' },
    h('p', null, 'Отправьте эту ссылку тем, кого хотите добавить. Перейдя по ней, человек войдёт или зарегистрируется и попадёт в команду.'),
    copyRow(`${ORIGIN}/#invite=${t.invite}`),
    h('button', {
      class: 'btn ghost', onclick: async () => {
        if (await confirmBox({ title: 'Сбросить ссылку?', text: 'Старая ссылка-приглашение перестанет работать. Те, кто уже в команде, останутся.', ok: 'Сбросить', danger: false }))
          run(() => api('/api/teams/' + id, 'POST', { resetInvite: true }));
      },
    }, 'Сбросить ссылку'));

  const tail = owner
    ? h('button', {
      class: 'btn ghost danger-text', icon: 'trash', onclick: async () => {
        if (await confirmBox({ title: 'Удалить команду?', text: `Команда «${t.name}» и все её проекты (${t.projects.length}) будут удалены без возможности восстановления.` }))
          run(() => api('/api/teams/' + id, 'DELETE'), () => go(''));
      },
    }, 'Удалить команду')
    : h('button', {
      class: 'btn ghost danger-text', icon: 'logout', onclick: async () => {
        if (await confirmBox({ title: 'Покинуть команду?', text: 'Вы потеряете доступ к её проектам. Вернуться можно по новому приглашению.', ok: 'Покинуть' }))
          run(() => api(`/api/teams/${id}/members/${A.user.id}`, 'DELETE'), () => go(''));
      },
    }, 'Покинуть команду');

  $('#acc .home-in').replaceChildren(...[accHeader(),
    h('button', { class: 'btn ghost back', icon: 'back', onclick: () => go('') }, 'Все команды'),
    h('div', { class: 'team-title' }, h('h2', null, t.name),
      owner && h('button', {
        class: 'ib', icon: 'edit', 'data-tip': 'Переименовать', 'aria-label': 'Переименовать команду', onclick: async () => {
          const name = await ask({ title: 'Название команды', value: t.name, ok: 'Сохранить' });
          if (name != null) run(() => api('/api/teams/' + id, 'POST', { name }));
        },
      })),
    h('div', { class: 'home-actions' },
      h('button', { class: 'btn primary', icon: 'plus', onclick: () => newProjectDialog() }, 'Новый проект'),
      h('button', { class: 'btn', icon: 'upload', onclick: () => $('#file-import').click() }, 'Импорт из файла')),
    h('h2', { class: 'sec' }, 'Проекты'), projects,
    h('h2', { class: 'sec' }, `Участники · ${t.members.length}`), members,
    owner && h('h2', { class: 'sec' }, 'Пригласить в команду'), invite,
    h('div', { class: 'team-tail' }, tail)].filter(Boolean));
}

// Окно «Поделиться» на доске
async function accShare() {
  const team = A.projectTeam;
  const body = h('div');
  const m = openModal(h('h2', null, 'Совместная работа'),
    h('p', null, `Проект открыт для всех участников команды «${team?.name || ''}». Чтобы работать вместе, добавьте людей в команду.`),
    body,
    h('div', { class: 'actions' },
      h('button', { class: 'btn ghost', onclick: () => { m.close(); showHome(); } }, 'Открыть команду'),
      h('button', { class: 'btn primary', onclick: () => m.close() }, 'Готово')));
  try {
    const t = await api('/api/teams/' + team.id);
    body.append(t.invite
      ? h('div', null, h('label', null, 'Ссылка-приглашение в команду'), copyRow(`${ORIGIN}/#invite=${t.invite}`))
      : h('p', null, 'Ссылку-приглашение выдаёт владелец команды.'),
      h('label', null, `В команде: ${people(t.members.length)}`),
      h('p', null, t.members.map(x => x.name).join(', ')));
  } catch (e) { if (!sessionLost(e)) body.append(h('p', null, e.message)); }
}
