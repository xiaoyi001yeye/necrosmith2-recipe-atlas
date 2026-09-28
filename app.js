(() => {
  const config = window.APP_CONFIG;
  const allRecipes = window.RECIPE_DATA || [];
  const labels = config.labels;
  const translatePart = window.PARTS_ZH_CN.translate;
  const $ = (selector) => document.querySelector(selector);
  const els = {
    search: $('#search'), category: $('#category-filter'), size: $('#page-size'), rows: $('#recipe-rows'),
    resultCount: $('#result-count'), empty: $('#empty-state'), pageButtons: $('#page-buttons'), pageCaption: $('#page-caption'),
    first: $('#first-page'), prev: $('#prev-page'), next: $('#next-page'), last: $('#last-page'), backdrop: $('#drawer-backdrop'), drawer: $('#detail-drawer')
  };
  let page = 1;
  let pageSize = Number(els.size.value);
  let filtered = [...allRecipes];
  let activeRecipe = null;
  const columns = [
    ['头部', '头'], ['身体', '身'], ['左手', '左手'], ['右手', '右手'], ['左腿', '左腿'], ['右腿', '右腿']
  ];

  document.querySelectorAll('[data-label]').forEach((el) => { const value = labels[el.dataset.label]; if (value) el.textContent = value; });
  document.querySelectorAll('[data-placeholder]').forEach((el) => { const value = labels[el.dataset.placeholder]; if (value) el.placeholder = value; });
  $('#stat-total').textContent = allRecipes.length.toLocaleString(config.locale);
  $('#stat-groups').textContent = new Set(allRecipes.map((row) => row['分组（中文）'])).size.toString().padStart(2, '0');
  $('#stat-craftable').textContent = allRecipes.filter((row) => row['可制作'] === '是').length.toLocaleString(config.locale);
  $('#result-count').textContent = allRecipes.length;
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const categoryEnglishOf = (row) => String(row['分组（英文）'] || '').trim();
  const categoryOf = (row) => {
    const english = categoryEnglishOf(row);
    const canonical = config.categoryOrder.find((item) => item.key.toLowerCase() === english.toLowerCase());
    return canonical?.label || row['分组（中文）'] || row['分组(中文)'] || english;
  };
  const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase(config.locale);
  const groupRanks = (row) => {
    const components = categoryEnglishOf(row).split(/[\/／]/).map((part) => part.trim()).filter(Boolean);
    const ranks = components.map((component) => {
      const exact = config.categoryOrder.findIndex((item) => item.key.toLocaleLowerCase() === component.toLocaleLowerCase());
      if (exact >= 0) return exact;
      const prefix = config.categoryOrder
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => component.toLocaleLowerCase().startsWith(`${item.key.toLocaleLowerCase()} `))
        .sort((a, b) => b.item.key.length - a.item.key.length)[0];
      return prefix?.index ?? config.categoryOrder.length;
    }).filter((rank) => rank < config.categoryOrder.length);
    return ranks.length ? [...new Set(ranks)].sort((a, b) => a - b) : [config.categoryOrder.length];
  };
  const compareRanks = (left, right) => {
    for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
      if (left[index] !== right[index]) return left[index] - right[index];
    }
    return left.length - right.length;
  };
  const groupsByLabel = new Map();
  allRecipes.forEach((row) => {
    const label = categoryOf(row).trim();
    if (label && !groupsByLabel.has(normalize(label))) {
      const english = categoryEnglishOf(row);
      const baseRank = config.categoryOrder.findIndex((item) => item.key.toLowerCase() === english.toLowerCase());
      groupsByLabel.set(normalize(label), { label, baseRank, ranks: groupRanks(row), english });
    }
  });
  const groups = [...groupsByLabel.values()].sort((a, b) => {
    if (a.baseRank >= 0 || b.baseRank >= 0) {
      if (a.baseRank < 0) return 1;
      if (b.baseRank < 0) return -1;
      return a.baseRank - b.baseRank;
    }
    return compareRanks(a.ranks, b.ranks) || a.english.localeCompare(b.english, 'en') || a.label.localeCompare(b.label, config.locale);
  });
  groups.forEach(({ label }) => { const option = document.createElement('option'); option.value = normalize(label); option.textContent = label; els.category.append(option); });

  function updateFilters() {
    const query = normalize(els.search.value);
    const group = normalize(els.category.value);
    filtered = allRecipes.filter((row) => {
      const searchableValues = [...Object.values(row), categoryOf(row), ...columns.map(([, key]) => translatePart(row[key]))];
      const matchesQuery = !query || searchableValues.some((value) => normalize(value).includes(query));
      return matchesQuery && (!group || normalize(categoryOf(row)) === group);
    });
    page = 1;
    render();
  }
  function render() {
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, pageCount);
    const start = (page - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);
    els.resultCount.textContent = filtered.length.toLocaleString(config.locale);
    els.rows.innerHTML = pageRows.map((row) => {
      const statusClass = row['可制作'] === '是' ? '' : ' no';
      return `<tr tabindex="0" data-id="${escapeHtml(row['序号'])}" aria-label="查看 ${escapeHtml(row['配方中文译名'])} 配方详情">
        <td class="number-cell">${String(row['序号']).padStart(3, '0')}</td>
        <td class="group-cell">${escapeHtml(categoryOf(row))}</td>
        <td class="recipe-cell"><span class="recipe-cn">${escapeHtml(row['配方中文译名'])}</span><span class="recipe-en">${escapeHtml(row['配方英文名'])}</span></td>
        <td><span class="status-tag${statusClass}">${row['可制作'] === '是' ? labels.craftableOnly : labels.unavailable}</span></td>
        ${columns.map(([name, key]) => `<td class="part-cell" title="${escapeHtml(translatePart(row[key]))}">${escapeHtml(translatePart(row[key]))}</td>`).join('')}
      </tr>`;
    }).join('');
    els.empty.hidden = filtered.length !== 0;
    $('.table-scroll').classList.toggle('has-results', filtered.length !== 0);
    const makeButton = (text, target, current) => `<button class="page-number${target === current ? ' is-current' : ''}" data-page="${target}" aria-label="第 ${target} 页" ${target === current ? 'aria-current="page"' : ''}>${text}</button>`;
    const visiblePages = new Set([1, pageCount, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pageCount));
    const sorted = [...visiblePages].sort((a, b) => a - b);
    const pageMarkup = [];
    sorted.forEach((num, index) => {
      if (index && num - sorted[index - 1] > 1) pageMarkup.push('<span class="ellipsis">…</span>');
      pageMarkup.push(makeButton(num, num, page));
    });
    els.pageButtons.innerHTML = pageMarkup.join('');
    els.first.disabled = els.prev.disabled = page <= 1;
    els.next.disabled = els.last.disabled = page >= pageCount;
    els.first.setAttribute('aria-label', labels.firstPage); els.prev.setAttribute('aria-label', labels.previousPage);
    els.next.setAttribute('aria-label', labels.nextPage); els.last.setAttribute('aria-label', labels.lastPage);
    const from = filtered.length ? start + 1 : 0;
    const to = Math.min(start + pageSize, filtered.length);
    els.pageCaption.textContent = `${from}–${to} / ${filtered.length}`;
  }
  function moveTo(target) { const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); page = Math.max(1, Math.min(pageCount, target)); render(); }
  function openDetail(row) {
    activeRecipe = row;
    $('#drawer-number').textContent = String(row['序号']).padStart(3, '0');
    $('#drawer-category').textContent = categoryOf(row);
    $('#detail-title').textContent = row['配方中文译名'];
    $('#drawer-english').textContent = row['配方英文名'];
    $('#drawer-status').innerHTML = `<span class="status-tag${row['可制作'] === '是' ? '' : ' no'}">${row['可制作'] === '是' ? labels.craftableOnly : labels.unavailable}</span>`;
    $('#drawer-parts').innerHTML = columns.map(([name, key]) => `<div class="part-detail"><span>${name}</span><strong>${escapeHtml(translatePart(row[key]))}</strong></div>`).join('');
    $('#copy-name').querySelector('span:first-child').textContent = labels.copyName;
    els.backdrop.hidden = false;
    els.drawer.classList.add('is-open');
    els.drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-visible');
    $('#close-drawer').focus();
  }
  function closeDetail() {
    els.drawer.classList.remove('is-open');
    els.drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-visible');
    window.setTimeout(() => { els.backdrop.hidden = true; }, 240);
    activeRecipe = null;
  }
  els.search.addEventListener('input', updateFilters);
  els.category.addEventListener('change', updateFilters);
  els.size.addEventListener('change', () => { pageSize = Number(els.size.value); page = 1; render(); });
  $('#clear-filters').addEventListener('click', () => { els.search.value = ''; els.category.value = ''; updateFilters(); els.search.focus(); });
  els.rows.addEventListener('click', (event) => { const row = event.target.closest('tr[data-id]'); if (row) openDetail(allRecipes.find((item) => item['序号'] === row.dataset.id)); });
  els.rows.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { const row = event.target.closest('tr[data-id]'); if (row) { event.preventDefault(); openDetail(allRecipes.find((item) => item['序号'] === row.dataset.id)); } } });
  els.pageButtons.addEventListener('click', (event) => { const button = event.target.closest('[data-page]'); if (button) moveTo(Number(button.dataset.page)); });
  els.first.addEventListener('click', () => moveTo(1)); els.prev.addEventListener('click', () => moveTo(page - 1)); els.next.addEventListener('click', () => moveTo(page + 1)); els.last.addEventListener('click', () => moveTo(Math.ceil(filtered.length / pageSize)));
  $('#close-drawer').addEventListener('click', closeDetail); els.backdrop.addEventListener('click', closeDetail);
  $('#copy-name').addEventListener('click', async () => {
    if (!activeRecipe) return;
    const button = $('#copy-name').querySelector('span:first-child');
    try { await navigator.clipboard.writeText(activeRecipe['配方中文译名']); button.textContent = labels.copied; }
    catch { button.textContent = labels.noCopy; }
    window.setTimeout(() => { button.textContent = labels.copyName; }, 1600);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && els.drawer.classList.contains('is-open')) closeDetail();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); els.search.focus(); }
  });
  render();
})();
