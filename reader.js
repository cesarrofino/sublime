// SubLime — Reader Module

const Reader = (() => {
  let _book = null;
  let _page = 0;
  let _fontSize = 1.1;
  let _highlightText = '';
  let _transitioning = false;
  let _settingsOpen = false;

  function open(bookId) {
    let book;
    try { book = Library.loadBook(bookId); }
    catch(e) { showToast('Erro ao carregar o livro.'); return; }

    _book = book;
    const prog = DB.getProgress(bookId);
    _page = prog.page || 0;
    _fontSize = DB.getFontSize();

    const view = document.getElementById('reader-view');
    view.classList.add('active');
    document.body.style.overflow = 'hidden';

    renderReader();
    renderPage(_page, 'none');
  }

  function renderReader() {
    const view = document.getElementById('reader-view');
    view.innerHTML = `
      <div class="reader-header">
        <button class="reader-btn" id="rd-close">←</button>
        <div class="reader-book-title">${_book.title}</div>
        <div style="display:flex;gap:4px;">
          <button class="reader-btn" id="rd-reflect" title="Reflectir">✦</button>
          <button class="reader-btn" id="rd-settings" title="Configurações">⊕</button>
        </div>
      </div>

      <div class="reader-progress-bar">
        <div class="reader-progress-fill" id="rd-progress-fill" style="width:0%"></div>
      </div>

      <div class="reader-body" id="rd-body">
        <div class="reader-content" id="rd-content"></div>
      </div>

      <div class="reader-footer">
        <button class="reader-nav-btn" id="rd-prev">←</button>
        <div class="reader-page-counter" id="rd-counter"></div>
        <button class="reader-nav-btn" id="rd-next">→</button>
      </div>

      <div class="reader-settings" id="rd-settings-panel">
        <span class="settings-label">Tamanho da fonte</span>
        <div class="font-size-controls">
          <button id="rd-font-dec">A−</button>
          <div class="font-size-value" id="rd-font-val">${Math.round(_fontSize*100)}%</div>
          <button id="rd-font-inc">A+</button>
        </div>
        <span class="settings-label" style="margin-top:4px;">Tema</span>
        <div class="theme-toggle-row">
          <button class="theme-opt ${document.documentElement.dataset.theme !== 'light' ? 'active' : ''}" data-t="dark">Escuro</button>
          <button class="theme-opt ${document.documentElement.dataset.theme === 'light' ? 'active' : ''}" data-t="light">Claro</button>
        </div>
      </div>

      <!-- Highlight / sublinhar toolbar -->
      <div class="highlight-bar" id="highlight-bar">
        <button id="hb-underline">✏ Sublinhar</button>
        <button id="hb-quote">💬 Citar</button>
        <button id="hb-reflect">✦ Reflectir</button>
        <button id="hb-copy">⎘ Copiar</button>
      </div>

      <!-- Reflect panel -->
      <div class="reflect-panel" id="reflect-panel">
        <div class="reflect-card">
          <h3>Reflexão</h3>
          <p id="reflect-context-label">Sobre: ${_book.title}</p>
          <textarea class="reflect-textarea" id="reflect-input" placeholder="Escreve o teu pensamento..."></textarea>
          <div class="reflect-actions">
            <button class="btn-reflect-cancel" id="reflect-cancel">Cancelar</button>
            <button class="btn-reflect-save" id="reflect-save">Guardar reflexão</button>
          </div>
        </div>
      </div>
    `;
    bindEvents();
  }

  function bindEvents() {
    document.getElementById('rd-close').addEventListener('click', close);
    document.getElementById('rd-prev').addEventListener('click', () => navigate(-1));
    document.getElementById('rd-next').addEventListener('click', () => navigate(1));
    document.getElementById('rd-settings').addEventListener('click', toggleSettings);
    document.getElementById('rd-font-inc').addEventListener('click', () => changeFontSize(0.05));
    document.getElementById('rd-font-dec').addEventListener('click', () => changeFontSize(-0.05));

    document.querySelectorAll('.theme-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.t === 'light') document.documentElement.dataset.theme = 'light';
        else delete document.documentElement.dataset.theme;
        DB.setTheme(btn.dataset.t);
        document.querySelectorAll('.theme-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.getElementById('rd-reflect').addEventListener('click', () => openReflectPanel());
    document.getElementById('reflect-cancel').addEventListener('click', closeReflectPanel);
    document.getElementById('reflect-save').addEventListener('click', saveReflection);

    document.addEventListener('keydown', onKeyDown);

    const body = document.getElementById('rd-body');
    body.addEventListener('mouseup', onTextSelect);
    body.addEventListener('touchend', onTextSelect);
    document.addEventListener('mousedown', maybeClearBar);

    document.getElementById('hb-underline').addEventListener('click', saveHighlight);
    document.getElementById('hb-quote').addEventListener('click', saveSelectedQuote);
    document.getElementById('hb-reflect').addEventListener('click', reflectOnSelected);
    document.getElementById('hb-copy').addEventListener('click', copySelected);

    document.addEventListener('click', e => {
      const panel = document.getElementById('rd-settings-panel');
      const btn = document.getElementById('rd-settings');
      if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('open'); _settingsOpen = false;
      }
    });

    let touchStartX = 0;
    body.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    body.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) navigate(diff > 0 ? 1 : -1);
    }, { passive: true });
  }

  function onKeyDown(e) {
    if (!document.getElementById('reader-view').classList.contains('active')) return;
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === ' ') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'Escape') close();
  }

  // ─── Apply persistent highlights to text ───
  function applyHighlightsToText(rawText, highlights) {
    if (!highlights || highlights.length === 0) return escapeAndFormatContent(rawText);
    let result = escapeHtml(rawText);
    // Sort by length desc to avoid overlapping replacements
    const sorted = [...highlights].sort((a, b) => b.text.length - a.text.length);
    sorted.forEach(h => {
      const escaped = escapeHtml(h.text);
      const safe = escaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(
        new RegExp(safe, 'g'),
        `<mark class="reader-highlight" data-hl="${encodeURIComponent(h.text)}">${escaped}</mark>`
      );
    });
    return result.replace(/\n\n/g, '</p><p class="reader-para">').replace(/\n/g, '<br>');
  }

  function escapeAndFormatContent(text) {
    return escapeHtml(text)
      .replace(/\n\n/g, '</p><p class="reader-para">')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function renderPage(idx, direction) {
    const page = _book.pages[idx];
    const content = document.getElementById('rd-content');
    if (!content) return;

    if (direction !== 'none') {
      content.classList.add(direction === 'next' ? 'page-flip-left' : 'page-flip-right');
      setTimeout(() => content.classList.remove('page-flip-left','page-flip-right'), 350);
    }

    const highlights = DB.getHighlights(_book.id, idx);
    const formattedContent = applyHighlightsToText(page.content, highlights);

    content.innerHTML = `
      <div class="reader-page-title anim-fade-in">${page.title}</div>
      <div class="reader-page-text anim-fade-in anim-delay-1" style="font-size:${_fontSize}rem;">
        <p class="reader-para">${formattedContent}</p>
      </div>
    `;

    // Click on existing highlight → option to remove
    content.querySelectorAll('.reader-highlight').forEach(mark => {
      mark.addEventListener('click', e => {
        e.stopPropagation();
        const text = decodeURIComponent(mark.dataset.hl);
        window.showConfirm('Remover este sublinhado?', () => {
          DB.removeHighlight(_book.id, _page, text);
          renderPage(_page, 'none');
          showToast('Sublinhado removido.');
        });
      });
    });

    const total = _book.pages.length;
    const pct = total > 1 ? Math.round((idx / (total-1)) * 100) : 100;
    const fill = document.getElementById('rd-progress-fill');
    if (fill) fill.style.width = pct + '%';
    const counter = document.getElementById('rd-counter');
    if (counter) counter.textContent = `${idx+1} / ${total}`;
    document.getElementById('rd-prev').disabled = idx === 0;
    document.getElementById('rd-next').disabled = idx === total-1;
    const body = document.getElementById('rd-body');
    if (body) body.scrollTop = 0;

    DB.setProgress(_book.id, { page: idx, percent: pct });
    if (direction !== 'none') DB.incrementPage();
  }

  function navigate(dir) {
    if (_transitioning) return;
    const newPage = _page + dir;
    if (newPage < 0 || newPage >= _book.pages.length) return;
    _transitioning = true;
    _page = newPage;
    renderPage(_page, dir > 0 ? 'next' : 'prev');
    setTimeout(() => { _transitioning = false; }, 350);
  }

  function changeFontSize(delta) {
    _fontSize = Math.min(1.6, Math.max(0.8, _fontSize + delta));
    DB.setFontSize(_fontSize);
    const el = document.querySelector('.reader-page-text');
    if (el) el.style.fontSize = _fontSize + 'rem';
    const val = document.getElementById('rd-font-val');
    if (val) val.textContent = Math.round(_fontSize*100) + '%';
  }

  function toggleSettings() {
    _settingsOpen = !_settingsOpen;
    const panel = document.getElementById('rd-settings-panel');
    if (panel) panel.classList.toggle('open', _settingsOpen);
  }

  // ─── Text selection ───
  function onTextSelect() {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) { clearHighlightBar(); return; }
      const text = sel.toString().trim();
      if (text.length < 3) { clearHighlightBar(); return; }
      _highlightText = text;
      showHighlightBar();
    }, 50);
  }

  function showHighlightBar() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const bar = document.getElementById('highlight-bar');
    if (!bar) return;
    bar.style.top = (rect.top + window.scrollY - 56) + 'px';
    bar.style.left = Math.max(8, rect.left + rect.width/2 - 120) + 'px';
    bar.classList.add('visible');
  }

  function maybeClearBar(e) {
    const bar = document.getElementById('highlight-bar');
    if (bar && e && bar.contains(e.target)) return;
    if (bar) bar.classList.remove('visible');
  }

  function clearHighlightBar() {
    const bar = document.getElementById('highlight-bar');
    if (bar) bar.classList.remove('visible');
  }

  // ─── Actions ───
  function saveHighlight() {
    if (!_highlightText) return;
    DB.saveHighlight(_book.id, _page, _highlightText);
    clearHighlightBar();
    window.getSelection()?.removeAllRanges();
    renderPage(_page, 'none');
    showToast('✏ Frase sublinhada!');
  }

  function saveSelectedQuote() {
    if (!_highlightText) return;
    DB.saveQuote({ text: _highlightText, bookId: _book.id, bookTitle: _book.title, author: _book.author });
    clearHighlightBar();
    window.getSelection()?.removeAllRanges();
    showToast('💬 Citação guardada!');
  }

  function reflectOnSelected() {
    const text = _highlightText;
    clearHighlightBar();
    window.getSelection()?.removeAllRanges();
    openReflectPanel(text);
  }

  function copySelected() {
    if (!_highlightText) return;
    navigator.clipboard?.writeText(_highlightText).then(() => showToast('Copiado!')).catch(() => showToast('Não foi possível copiar.'));
    clearHighlightBar();
    window.getSelection()?.removeAllRanges();
  }

  function openReflectPanel(prefill = '') {
    const panel = document.getElementById('reflect-panel');
    const input = document.getElementById('reflect-input');
    const label = document.getElementById('reflect-context-label');
    if (!panel) return;
    if (label) label.textContent = `Sobre: ${_book.title} — ${_book.pages[_page].title}`;
    if (input) { input.value = prefill ? `"${prefill}"\n\n` : ''; setTimeout(() => input.focus(), 100); }
    panel.classList.add('open');
  }

  function closeReflectPanel() {
    const panel = document.getElementById('reflect-panel');
    if (panel) panel.classList.remove('open');
  }

  function saveReflection() {
    const input = document.getElementById('reflect-input');
    const text = input?.value.trim();
    if (!text) { showToast('Escreve algo primeiro.'); return; }
    DB.saveReflection({ text, bookId: _book.id, pageTitle: _book.pages[_page].title, source: 'reader', tags: [_book.category, _book.title] });
    closeReflectPanel();
    showToast('✦ Reflexão guardada!');
  }

  function close() {
    const view = document.getElementById('reader-view');
    if (view) view.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeyDown);
    _book = null;
    if (window.App) App.refreshCurrentScreen();
  }

  return { open, close };
})();

window.Reader = Reader;
