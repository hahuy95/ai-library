(() => {
  'use strict';

  // ------------------------------------------------------------------------
  // Config
  // ------------------------------------------------------------------------
  const CATEGORIES = [
    { id: 'models', label: 'AI Models', icon: 'smart_toy', tone: 'primary', blurb: 'Chat assistants and the models behind them.' },
    { id: 'plugins', label: 'Plugins', icon: 'extension', tone: 'tertiary', blurb: 'Plugins, MCP servers and integrations for your agents.' },
    { id: 'skills', label: 'Skills', icon: 'psychology', tone: 'secondary', blurb: 'Skills and prompts that teach your agent new abilities and taste.' },
    { id: 'references', label: 'References', icon: 'menu_book', tone: 'primary', blurb: 'Design systems, guidelines and real-world patterns.' },
    { id: 'inspiration', label: 'Inspiration', icon: 'lightbulb', tone: 'tertiary', blurb: 'Galleries and showcases to spark ideas.' },
    { id: 'components', label: 'Components', icon: 'widgets', tone: 'secondary', blurb: 'UI blocks, elements and assets ready to use.' },
    { id: 'tools', label: 'Tools', icon: 'handyman', tone: 'primary', blurb: 'Design and productivity apps.' },
  ];
  const NAV = [
    { id: 'all', label: 'All', icon: 'apps', blurb: 'Your library of AI models, plugins, skills, references, inspiration, components and tools.' },
    ...CATEGORIES,
    { id: 'favorites', label: 'Favorites', icon: 'favorite', blurb: 'Resources you have starred.', sep: true },
  ];
  const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

  const SEEDS = [
    { name: 'Baseline', hex: '#6750A4' },
    { name: 'Blue', hex: '#0B57D0' },
    { name: 'Teal', hex: '#006A6A' },
    { name: 'Green', hex: '#386A20' },
    { name: 'Orange', hex: '#8B5000' },
    { name: 'Red', hex: '#BA1A1A' },
    { name: 'Pink', hex: '#984061' },
    { name: 'Slate', hex: '#4A5C6A' },
  ];
  const BASELINE = SEEDS[0].hex;

  const KEYS = { custom: 'ail.custom', favs: 'ail.favs', mode: 'ail.mode', seed: 'ail.seed', sort: 'ail.sort' };

  // ------------------------------------------------------------------------
  // Storage (fails silently in private mode etc.)
  // ------------------------------------------------------------------------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v == null ? fallback : JSON.parse(v);
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    },
  };

  // ------------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------------
  const SOURCES = window.LIBRARY_SOURCES || {};
  const builtins = (window.LIBRARY_DATA || []).map((item, i) => ({
    ...item,
    source: typeof item.source === 'string' ? SOURCES[item.source] : item.source,
    builtin: true,
    order: i,
  }));
  let custom = store.get(KEYS.custom, []);
  const favs = new Set(store.get(KEYS.favs, []));

  const state = {
    category: 'all',
    query: '',
    tags: new Set(),
    sort: store.get(KEYS.sort, 'newest'),
    editingId: null,
  };

  const allItems = () => [
    ...custom.map((item, i) => ({ ...item, builtin: false, order: 100000 + i })),
    ...builtins,
  ];

  // ------------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------------
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hostOf = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };
  const prettyUrl = url => { try { const u = new URL(url); return (u.hostname.replace(/^www\./, '') + u.pathname).replace(/\/$/, ''); } catch { return url; } };
  const normalizeUrl = raw => {
    const s = raw.trim();
    if (!s) return '';
    const withProto = /^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : 'https://' + s;
    try {
      const u = new URL(withProto);
      return /^https?:$/.test(u.protocol) && u.hostname.includes('.') ? u.href : '';
    } catch { return ''; }
  };
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  const parseTags = s => [...new Set(s.split(',').map(t => t.trim().toLowerCase()).filter(Boolean))].slice(0, 8);

  // ------------------------------------------------------------------------
  // Filtering
  // ------------------------------------------------------------------------
  function inCategory(item) {
    if (state.category === 'all') return true;
    if (state.category === 'favorites') return favs.has(item.id);
    return item.category === state.category;
  }

  function matchesQuery(item) {
    const q = state.query.trim().toLowerCase();
    if (!q) return true;
    const hay = [item.name, item.description, item.url, CAT[item.category]?.label, ...(item.tags || []), item.source?.label]
      .join(' ').toLowerCase();
    return q.split(/\s+/).every(word => hay.includes(word));
  }

  function visibleItems() {
    const items = allItems().filter(i => inCategory(i) && matchesQuery(i) &&
      [...state.tags].every(t => (i.tags || []).includes(t)));
    if (state.sort === 'az') items.sort((a, b) => a.name.localeCompare(b.name));
    else items.sort((a, b) => b.order - a.order);
    return items;
  }

  // ------------------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------------------
  function countFor(id) {
    const items = allItems();
    if (id === 'all') return items.length;
    if (id === 'favorites') return items.filter(i => favs.has(i.id)).length;
    return items.filter(i => i.category === id).length;
  }

  function renderNav() {
    $('#catChips').innerHTML = NAV.map(n => `
      <button class="chip state" role="tab" data-cat="${n.id}" aria-pressed="${state.category === n.id}" aria-selected="${state.category === n.id}">
        <span class="icon">${state.category === n.id ? 'check' : n.icon}</span>${esc(n.label)}
      </button>`).join('');
  }

  function renderHero() {
    const nav = NAV.find(n => n.id === state.category);
    $('#pageTitle').textContent = state.category === 'all' ? 'All resources' : nav.label;
    $('#pageSubtitle').textContent = nav.blurb;
    $('#heroStats').innerHTML = state.category === 'all'
      ? CATEGORIES.map(c => `<button class="stat state" data-cat="${c.id}"><span class="icon">${c.icon}</span><b>${countFor(c.id)}</b> ${esc(c.label)}</button>`).join('')
      : `<span class="stat"><span class="icon">${nav.icon}</span><b>${countFor(nav.id)}</b> items</span>`;
  }

  function renderTags() {
    const counts = new Map();
    allItems().filter(i => inCategory(i) && matchesQuery(i)).forEach(i =>
      (i.tags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
    // Keep selected tags visible even if they fall out of the top list.
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 14).map(e => e[0]);
    const tags = [...new Set([...state.tags, ...top])];
    $('#tagChips').innerHTML = tags.map(t => {
      const on = state.tags.has(t);
      return `<button class="chip state" data-tag="${esc(t)}" aria-pressed="${on}">${on ? '<span class="icon">check</span>' : ''}${esc(t)}</button>`;
    }).join('') + (state.tags.size ? '<button class="chip clear state" data-action="clear-tags"><span class="icon">close</span>Clear</button>' : '');
  }

  // Built-in items use screenshots captured into thumbs/. Anything without a
  // local file (including items added in the browser) falls back to a live
  // screenshot service, then to the letter placeholder.
  const liveShot = url => `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=640&h=400`;
  const thumbnailOf = item => item.thumbnail || (item.builtin ? `thumbs/${item.id}.png` : liveShot(item.url));
  window.thumbError = img => {
    const next = img.dataset.fallback;
    if (next && img.src !== next) { img.removeAttribute('data-fallback'); img.src = next; }
    else img.remove();
  };

  function cardHtml(item, index) {
    const cat = CAT[item.category] || CATEGORIES[0];
    const host = hostOf(item.url);
    const fav = favs.has(item.id);
    const initial = esc((item.name || '?').trim().charAt(0).toUpperCase());
    return `
      <article class="card" style="animation-delay:${Math.min(index, 12) * 30}ms">
        <a class="thumb" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
          <img src="${esc(thumbnailOf(item))}" alt="" loading="lazy" decoding="async"
            data-fallback="${esc(liveShot(item.url))}" onerror="thumbError(this)">
          <span class="thumb-fallback">${initial}</span>
        </a>
        <div class="card-head">
          <div class="avatar" aria-hidden="true">${initial}
            <img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64" alt="" loading="lazy" onerror="this.remove()">
          </div>
          <div class="card-title">
            <h3><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.name)}</a></h3>
            <span class="domain">${esc(prettyUrl(item.url))}</span>
          </div>
          <div class="card-actions-top">
            ${item.builtin ? '' : `
              <button class="icon-btn state" data-action="edit" data-id="${esc(item.id)}" title="Edit"><span class="icon">edit</span></button>
              <button class="icon-btn state" data-action="delete" data-id="${esc(item.id)}" title="Delete"><span class="icon">delete</span></button>`}
            <button class="icon-btn state fav" data-action="fav" data-id="${esc(item.id)}" aria-pressed="${fav}" title="${fav ? 'Remove from favorites' : 'Add to favorites'}">
              <span class="icon">favorite</span>
            </button>
          </div>
        </div>
        ${item.description ? `<p class="desc">${esc(item.description)}</p>` : '<p class="desc"></p>'}
        ${(item.tags || []).length ? `<div class="tags">${item.tags.map(t => `<button class="tag state" data-tag="${esc(t)}">#${esc(t)}</button>`).join('')}</div>` : ''}
        <div class="card-foot">
          <div class="foot-left">
            <button class="cat-badge state" data-cat="${cat.id}" data-tone="${cat.tone}"><span class="icon filled">${cat.icon}</span>${esc(cat.label)}</button>
            ${item.source?.url ? `<a class="via" href="${esc(item.source.url)}" target="_blank" rel="noopener noreferrer" title="Where this was found">via ${esc(item.source.label || hostOf(item.source.url))}</a>` : ''}
          </div>
          <a class="btn tonal small state" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Open<span class="icon">arrow_outward</span></a>
        </div>
      </article>`;
  }

  // ------------------------------------------------------------------------
  // Sections with "Load more"
  // ------------------------------------------------------------------------
  const shown = {}; // section id -> number of cards revealed
  const pageSize = () => (state.category === 'all' ? 4 : 12);
  const resetPaging = () => Object.keys(shown).forEach(k => delete shown[k]);

  function sectionsFor(items) {
    if (state.category === 'all') {
      return CATEGORIES.map(c => ({ ...c, items: items.filter(i => i.category === c.id) })).filter(s => s.items.length);
    }
    const nav = NAV.find(n => n.id === state.category);
    return items.length ? [{ ...nav, tone: nav.tone || 'tertiary', items }] : [];
  }

  function moreHtml(total, limit) {
    if (total <= pageSize()) return '';
    return `<div class="section-more">${limit < total
      ? `<button class="btn tonal state" data-action="more"><span class="icon">expand_more</span>Load more<span class="more-count">${total - limit}</span></button>`
      : '<button class="btn text state" data-action="less"><span class="icon">expand_less</span>Show less</button>'}</div>`;
  }

  function sectionHtml(s) {
    const limit = shown[s.id] || pageSize();
    const n = s.items.length;
    return `
      <section class="section" data-section="${s.id}" aria-labelledby="sec-${s.id}">
        <div class="section-head">
          <span class="section-icon" data-tone="${s.tone}"><span class="icon filled">${s.icon}</span></span>
          <div class="section-title">
            <h2 id="sec-${s.id}">${esc(s.label)} <span class="section-count">${n}</span></h2>
            <p>${esc(s.blurb)}</p>
          </div>
          ${state.category === 'all' && n > limit ? `<button class="btn text state view-all" data-cat="${s.id}">View all<span class="icon">arrow_forward</span></button>` : ''}
        </div>
        <div class="grid">${s.items.slice(0, limit).map(cardHtml).join('')}</div>
        ${moreHtml(n, limit)}
      </section>`;
  }

  function sectionItems(id) {
    return sectionsFor(visibleItems()).find(s => s.id === id);
  }

  function loadMore(sectionEl) {
    const s = sectionItems(sectionEl.dataset.section);
    if (!s) return;
    const from = shown[s.id] || pageSize();
    const to = from + pageSize();
    shown[s.id] = to;
    const grid = sectionEl.querySelector('.grid');
    grid.insertAdjacentHTML('beforeend', s.items.slice(from, to).map((item, i) => cardHtml(item, i)).join(''));
    sectionEl.querySelector('.section-more').outerHTML = moreHtml(s.items.length, to);
    sectionEl.querySelector('.view-all')?.remove();
    grid.children[from]?.querySelector('h3 a')?.focus({ preventScroll: true });
  }

  function showLess(sectionEl) {
    delete shown[sectionEl.dataset.section];
    const s = sectionItems(sectionEl.dataset.section);
    if (!s) return;
    sectionEl.outerHTML = sectionHtml(s);
    const fresh = document.querySelector(`[data-section="${s.id}"]`);
    if (fresh.getBoundingClientRect().top < 0) fresh.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderGrid() {
    const items = visibleItems();
    $('#sections').innerHTML = sectionsFor(items).map(sectionHtml).join('');
    $('#empty').hidden = items.length > 0;
    const total = allItems().filter(inCategory).length;
    $('#resultCount').textContent = items.length === total
      ? `${items.length} ${items.length === 1 ? 'resource' : 'resources'}`
      : `Showing ${items.length} of ${total}`;
    document.querySelectorAll('.seg').forEach(b => b.setAttribute('aria-pressed', b.dataset.sort === state.sort));
  }

  function render() {
    renderNav();
    renderHero();
    renderTags();
    renderGrid();
  }

  // ------------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------------
  function setCategory(id) {
    state.category = id;
    state.tags.clear();
    resetPaging();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const chip = document.querySelector(`#catChips [data-cat="${id}"]`);
    chip?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  function toggleTag(tag) {
    state.tags.has(tag) ? state.tags.delete(tag) : state.tags.add(tag);
    resetPaging();
    renderTags();
    renderGrid();
  }

  function toggleFav(id) {
    favs.has(id) ? favs.delete(id) : favs.add(id);
    store.set(KEYS.favs, [...favs]);
    render();
  }

  function saveCustom() { store.set(KEYS.custom, custom); }

  function deleteItem(id) {
    const index = custom.findIndex(i => i.id === id);
    if (index < 0) return;
    const [removed] = custom.splice(index, 1);
    saveCustom();
    render();
    snackbar(`Deleted "${removed.name}"`, 'Undo', () => {
      custom.splice(index, 0, removed);
      saveCustom();
      render();
    });
  }

  // ------------------------------------------------------------------------
  // Dialog
  // ------------------------------------------------------------------------
  const dialog = $('#itemDialog');
  const form = $('#itemForm');
  form.category.innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${esc(c.label)}</option>`).join('');

  function openDialog(item) {
    state.editingId = item ? item.id : null;
    form.reset();
    form.querySelectorAll('[data-invalid]').forEach(f => f.removeAttribute('data-invalid'));
    $('#formError').hidden = true;
    $('#dialogTitle').textContent = item ? 'Edit resource' : 'Add resource';
    $('#saveBtn').textContent = item ? 'Save changes' : 'Add';
    if (item) {
      form.name.value = item.name;
      form.url.value = item.url;
      form.category.value = item.category;
      form.description.value = item.description || '';
      form.tags.value = (item.tags || []).join(', ');
      form.sourceUrl.value = item.source?.url || '';
    } else if (CAT[state.category]) {
      form.category.value = state.category;
    }
    dialog.showModal();
    form.name.focus();
  }

  function formError(field, message) {
    field.closest('.field').setAttribute('data-invalid', '');
    $('#formError').textContent = message;
    $('#formError').hidden = false;
    field.focus();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelectorAll('[data-invalid]').forEach(f => f.removeAttribute('data-invalid'));
    const name = form.name.value.trim();
    const url = normalizeUrl(form.url.value);
    const sourceRaw = form.sourceUrl.value.trim();
    const sourceUrl = sourceRaw ? normalizeUrl(sourceRaw) : '';
    if (!name) return formError(form.name, 'Give the resource a name.');
    if (!url) return formError(form.url, 'Enter a valid web address, e.g. https://example.com');
    if (sourceRaw && !sourceUrl) return formError(form.sourceUrl, 'The "found via" link is not a valid web address.');

    const data = {
      name,
      url,
      category: form.category.value,
      description: form.description.value.trim(),
      tags: parseTags(form.tags.value),
      ...(sourceUrl ? { source: { label: hostOf(sourceUrl), url: sourceUrl } } : {}),
    };

    if (state.editingId) {
      const i = custom.findIndex(x => x.id === state.editingId);
      if (i >= 0) custom[i] = { ...custom[i], ...data, ...(sourceUrl ? {} : { source: undefined }) };
      snackbar('Changes saved');
    } else {
      const ids = new Set(allItems().map(x => x.id));
      let id = slug(name), n = 2;
      while (ids.has(id)) id = `${slug(name)}-${n++}`;
      custom.push({ id, ...data, added: new Date().toISOString() });
      snackbar(`Added "${name}"`);
    }
    saveCustom();
    dialog.close();
    render();
  });

  $('#cancelBtn').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  // ------------------------------------------------------------------------
  // Snackbar
  // ------------------------------------------------------------------------
  let snackTimer;
  function snackbar(text, actionLabel, onAction) {
    const bar = $('#snackbar');
    const action = $('#snackAction');
    clearTimeout(snackTimer);
    bar.hidden = true;
    $('#snackText').textContent = text;
    action.hidden = !actionLabel;
    action.textContent = actionLabel || '';
    action.onclick = () => { bar.hidden = true; onAction?.(); };
    void bar.offsetWidth; // restart animation
    bar.hidden = false;
    snackTimer = setTimeout(() => { bar.hidden = true; }, actionLabel ? 6000 : 3000);
  }

  // ------------------------------------------------------------------------
  // Menus
  // ------------------------------------------------------------------------
  let openMenu = null;
  function toggleMenu(menu, anchor) {
    if (openMenu === menu) return closeMenu();
    closeMenu();
    menu.hidden = false;
    const r = anchor.getBoundingClientRect();
    const w = menu.offsetWidth;
    menu.style.top = `${r.bottom + 4}px`;
    menu.style.left = `${Math.max(16, Math.min(r.right - w, window.innerWidth - w - 16))}px`;
    openMenu = menu;
  }
  function closeMenu() {
    if (openMenu) openMenu.hidden = true;
    openMenu = null;
  }

  $('#paletteBtn').addEventListener('click', e => { e.stopPropagation(); toggleMenu($('#paletteMenu'), e.currentTarget); });
  $('#moreBtn').addEventListener('click', e => { e.stopPropagation(); toggleMenu($('#moreMenu'), e.currentTarget); });
  document.addEventListener('click', e => { if (openMenu && !openMenu.contains(e.target)) closeMenu(); });
  window.addEventListener('resize', closeMenu);

  $('#moreMenu').addEventListener('click', e => {
    const btn = e.target.closest('[data-menu]');
    if (!btn) return;
    closeMenu();
    if (btn.dataset.menu === 'export') exportJson();
    if (btn.dataset.menu === 'import') $('#importFile').click();
    if (btn.dataset.menu === 'reset') {
      if (!custom.length) return snackbar('You have not added any items yet');
      const backup = custom;
      custom = [];
      saveCustom();
      render();
      snackbar(`Removed ${backup.length} added ${backup.length === 1 ? 'item' : 'items'}`, 'Undo', () => {
        custom = backup;
        saveCustom();
        render();
      });
    }
  });

  function exportJson() {
    const payload = custom.map(({ id, name, url, category, description, tags, source }) =>
      ({ id, name, url, category, description, tags, ...(source ? { source } : {}) }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ai-library-items.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    snackbar(custom.length ? `Exported ${custom.length} items` : 'Exported an empty list (no added items yet)');
  }

  $('#importFile').addEventListener('change', async e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) throw new Error('not an array');
      const ids = new Set(allItems().map(x => x.id));
      let added = 0;
      for (const raw of parsed) {
        const url = normalizeUrl(String(raw?.url || ''));
        if (!raw?.name || !url) continue;
        let id = slug(String(raw.id || raw.name)), n = 2;
        const base = id;
        while (ids.has(id)) id = `${base}-${n++}`;
        ids.add(id);
        const sourceUrl = raw.source?.url ? normalizeUrl(String(raw.source.url)) : '';
        custom.push({
          id,
          name: String(raw.name).slice(0, 80),
          url,
          category: CAT[raw.category] ? raw.category : 'tools',
          description: String(raw.description || '').slice(0, 280),
          tags: Array.isArray(raw.tags) ? parseTags(raw.tags.join(',')) : [],
          ...(sourceUrl ? { source: { label: String(raw.source.label || hostOf(sourceUrl)), url: sourceUrl } } : {}),
          added: new Date().toISOString(),
        });
        added++;
      }
      saveCustom();
      render();
      snackbar(added ? `Imported ${added} items` : 'No valid items found in that file');
    } catch {
      snackbar('Could not read that file. Expected a JSON array of items.');
    }
  });

  // ------------------------------------------------------------------------
  // Theme: light / dark / system + dynamic color
  // ------------------------------------------------------------------------
  const MODES = ['system', 'light', 'dark'];
  const MODE_ICON = { system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' };
  const MODE_LABEL = { system: 'Theme: system', light: 'Theme: light', dark: 'Theme: dark' };
  let mode = store.get(KEYS.mode, 'system');
  let seed = store.get(KEYS.seed, BASELINE);
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => mode === 'dark' || (mode === 'system' && darkQuery.matches);

  function applyMode() {
    if (mode === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', mode);
    $('#modeIcon').textContent = MODE_ICON[mode];
    $('#modeBtn').title = MODE_LABEL[mode];
    applySeed();
  }

  $('#modeBtn').addEventListener('click', () => {
    mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    store.set(KEYS.mode, mode);
    applyMode();
    snackbar(MODE_LABEL[mode]);
  });
  darkQuery.addEventListener?.('change', () => { if (mode === 'system') applySeed(); });

  const ROLES = [
    'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
    'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
    'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
    'error', 'onError', 'errorContainer', 'onErrorContainer',
    'surface', 'onSurface', 'onSurfaceVariant',
    'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
    'outline', 'outlineVariant', 'inverseSurface', 'inverseOnSurface', 'inversePrimary',
  ];
  const kebab = s => s.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
  let mcu = null;
  let mcuLoading = null;

  function loadMcu() {
    if (!mcuLoading) {
      mcuLoading = import('https://cdn.jsdelivr.net/npm/@material/material-color-utilities@0.3.0/+esm')
        .then(m => (mcu = m))
        .catch(() => null);
    }
    return mcuLoading;
  }

  function clearDynamic() {
    ROLES.forEach(r => document.documentElement.style.removeProperty(`--md-sys-color-${kebab(r)}`));
  }

  async function applySeed() {
    renderSwatches();
    if (seed.toUpperCase() === BASELINE.toUpperCase()) return clearDynamic(); // CSS baseline tokens
    const m = mcu || await loadMcu();
    if (!m) return clearDynamic();
    try {
      const scheme = new m.SchemeTonalSpot(m.Hct.fromInt(m.argbFromHex(seed)), isDark(), 0);
      const root = document.documentElement.style;
      for (const role of ROLES) {
        const color = m.MaterialDynamicColors[role];
        if (color) root.setProperty(`--md-sys-color-${kebab(role)}`, m.hexFromArgb(color.getArgb(scheme)));
      }
    } catch {
      clearDynamic();
    }
  }

  function renderSwatches() {
    $('#swatches').innerHTML = SEEDS.map(s => `
      <button class="swatch" data-seed="${s.hex}" style="background:${s.hex}" title="${s.name}" aria-label="${s.name}"
        aria-pressed="${s.hex.toUpperCase() === seed.toUpperCase()}"><span class="icon">check</span></button>`).join('');
    $('#customColor').value = seed.length === 7 ? seed.toLowerCase() : BASELINE.toLowerCase();
  }

  function setSeed(hex) {
    seed = hex;
    store.set(KEYS.seed, seed);
    applySeed();
  }

  $('#swatches').addEventListener('click', e => {
    const s = e.target.closest('[data-seed]');
    if (s) setSeed(s.dataset.seed);
  });
  $('#customColor').addEventListener('input', e => setSeed(e.target.value));

  // ------------------------------------------------------------------------
  // Global events
  // ------------------------------------------------------------------------
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-cat], [data-tag], [data-action], [data-sort]');
    if (!el || el.closest('.menu')) return;
    if (el.dataset.sort) {
      state.sort = el.dataset.sort;
      resetPaging();
      store.set(KEYS.sort, state.sort);
      return renderGrid();
    }
    if (el.dataset.cat) return setCategory(el.dataset.cat);
    if (el.dataset.tag) return toggleTag(el.dataset.tag);
    const id = el.dataset.id;
    switch (el.dataset.action) {
      case 'add': return openDialog(null);
      case 'fav': return toggleFav(id);
      case 'edit': return openDialog(custom.find(i => i.id === id));
      case 'delete': return deleteItem(id);
      case 'clear-tags': state.tags.clear(); resetPaging(); renderTags(); return renderGrid();
      case 'more': return loadMore(el.closest('[data-section]'));
      case 'less': return showLess(el.closest('[data-section]'));
    }
  });

  let searchTimer;
  $('#search').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = e.target.value;
      resetPaging();
      renderTags();
      renderGrid();
    }, 120);
  });

  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if (e.key === '/' && !typing && !dialog.open) {
      e.preventDefault();
      $('#search').focus();
    } else if (e.key === 'Escape') {
      if (openMenu) closeMenu();
      else if (document.activeElement === $('#search') && $('#search').value) {
        $('#search').value = '';
        state.query = '';
        resetPaging();
        renderTags();
        renderGrid();
      }
    }
  });

  // ------------------------------------------------------------------------
  // Init
  // ------------------------------------------------------------------------
  applyMode();
  render();
})();
