// SubLime — Notes Module (iOS Notes style, contenteditable)

const Notes = (() => {
  let _currentNote = null;
  let _isNew = false;
  let _searchQuery = '';
  let _noteTags = [];
  let _saveTimer = null;
  let _penMode = false;
  let _drawing = false;
  let _lastX = 0, _lastY = 0;
  let _penColor = '#c9a96e';
  let _penSize = 2;
  let _penHistory = [];
  let _eraserMode = false;

  /* ─── RENDER LIST ─── */
  function render() {
    const screen = document.getElementById('notes-screen');
    screen.innerHTML = `
      <div class="notes-container">
        <div class="notes-header">
          <div class="notes-header-top">
            <div>
              <div class="notes-title">Notas</div>
              <div class="notes-count" id="notes-count"></div>
            </div>
            <button class="notes-new-btn" id="notes-new-btn">+</button>
          </div>
          <div class="notes-search-bar">
            <span class="notes-search-icon">⌕</span>
            <input type="text" class="notes-search-input" id="notes-search"
              placeholder="Pesquisar notas..." autocomplete="off" value="${_searchQuery}">
          </div>
        </div>
        <div class="notes-list" id="notes-list"></div>
      </div>

      <!-- ═══ EDITOR OVERLAY ═══ -->
      <div class="note-editor-overlay" id="note-editor">

        <!-- Header -->
        <div class="sn-header">
          <button class="sn-back" id="note-back">‹ <span>Notas</span></button>
          <div class="sn-header-title" id="sn-header-title">Título</div>
          <div class="sn-header-actions">
            <button class="sn-icon-btn" id="note-mode-btn" title="Caneta">🖊</button>
            <button class="sn-icon-btn" id="note-pin-btn" title="Fixar">📌</button>
            <button class="sn-icon-btn sn-del-btn" id="note-del-btn" title="Eliminar">🗑</button>
          </div>
        </div>

        <!-- KEYBOARD MODE -->
        <div class="sn-body" id="note-keyboard-body">
          <!-- Title -->
          <div class="sn-title-input" id="note-title"
            contenteditable="true"
            data-placeholder="Título"
            spellcheck="true"></div>

          <div class="sn-date-line" id="note-editor-date"></div>

          <!-- Tags -->
          <div class="sn-tags-row" id="note-tags-row"></div>

          <!-- Rich text content -->
          <div class="sn-content-input" id="note-content"
            contenteditable="true"
            data-placeholder="Escreve aqui..."
            spellcheck="true"></div>

          <div class="sn-wordcount" id="note-wordcount">0 palavras</div>
        </div>

        <!-- PEN MODE -->
        <div class="sn-pen-body hidden" id="note-pen-body">
          <div class="pen-toolbar">
            <div class="pen-colors" id="pen-colors">
              <button class="pen-color-btn active" data-color="#c9a96e" style="background:#c9a96e;"></button>
              <button class="pen-color-btn" data-color="#333333" style="background:#333333;"></button>
              <button class="pen-color-btn" data-color="#8fbe8f" style="background:#8fbe8f;"></button>
              <button class="pen-color-btn" data-color="#9b7fa6" style="background:#9b7fa6;"></button>
              <button class="pen-color-btn" data-color="#e05a5a" style="background:#e05a5a;"></button>
              <button class="pen-color-btn" data-color="#5a9fe0" style="background:#5a9fe0;"></button>
            </div>
            <div class="pen-tools">
              <button class="pen-tool-btn active" id="pen-draw-btn">✏</button>
              <button class="pen-tool-btn" id="pen-eraser-btn">◻</button>
              <button class="pen-tool-btn" id="pen-undo-btn">↩</button>
              <button class="pen-tool-btn" id="pen-clear-btn">✕</button>
            </div>
            <div class="pen-sizes">
              <button class="pen-size-btn" data-size="1">●</button>
              <button class="pen-size-btn active" data-size="2">●</button>
              <button class="pen-size-btn" data-size="4">●</button>
            </div>
          </div>
          <div class="pen-canvas-wrap" id="pen-canvas-wrap">
            <canvas id="pen-canvas"></canvas>
            <div class="pen-lines-bg" id="pen-lines-bg"></div>
          </div>
        </div>

        <!-- Footer toolbar -->
        <div class="sn-footer" id="sn-footer">
          <div class="sn-toolbar" id="sn-toolbar">
            <button class="sn-tool" id="tb-bold" title="Negrito"><b>B</b></button>
            <button class="sn-tool" id="tb-italic" title="Itálico"><i>I</i></button>
            <button class="sn-tool" id="tb-underline" title="Sublinhado"><u>U</u></button>
            <div class="sn-tool-sep"></div>
            <button class="sn-tool" id="tb-bullet" title="Lista">≡</button>
            <button class="sn-tool" id="tb-quote" title="Citação">❝</button>
            <button class="sn-tool" id="tb-h1" title="Título">H</button>
            <div class="sn-tool-sep"></div>
            <button class="sn-tool" id="tb-divider" title="Divisor">—</button>
          </div>
          <div class="sn-footer-right">
            <button class="sn-save-btn" id="note-save-btn">Guardar</button>
          </div>
        </div>

      </div>
    `;

    drawList();
    bindListEvents();
  }

  /* ─── LIST ─── */
  function drawList() {
    const allNotes = DB.getNotes();
    const countEl = document.getElementById('notes-count');
    if (countEl) countEl.textContent = allNotes.length + ' nota' + (allNotes.length !== 1 ? 's' : '');

    const q = _searchQuery.toLowerCase();
    let filtered = q
      ? allNotes.filter(n => (n.title + n.content + (n.tags || []).join(' ')).toLowerCase().includes(q))
      : allNotes;

    const list = document.getElementById('notes-list');
    if (!list) return;

    if (!filtered.length) {
      list.innerHTML = '<div class="notes-empty">' +
        '<div class="notes-empty-icon">📝</div>' +
        '<div class="notes-empty-title">' + (q ? 'Sem resultados' : 'Ainda não há notas') + '</div>' +
        '<div class="notes-empty-sub">' + (q ? 'Tenta outra pesquisa.' : 'Toca em + para criar a tua primeira nota.') + '</div>' +
        '</div>';
      return;
    }

    const pinned = filtered.filter(n => n.pinned);
    const unpinned = filtered.filter(n => !n.pinned);
    let html = '';
    if (pinned.length) {
      html += '<div class="notes-section-label">Fixadas</div>';
      html += pinned.map(noteItemHTML).join('');
    }
    if (unpinned.length) {
      if (pinned.length) html += '<div class="notes-section-label">Todas as notas</div>';
      html += unpinned.map(noteItemHTML).join('');
    }
    list.innerHTML = html;
    list.querySelectorAll('.note-item').forEach(item =>
      item.addEventListener('click', () => openEditor(item.dataset.id))
    );
  }

  function noteItemHTML(n) {
    // Strip HTML tags for preview
    const plainContent = (n.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 70);
    const dateStr = formatNoteDate(n.updatedAt || n.createdAt);
    const hasPen = n.penData ? '🖊 ' : '';
    const title = n.title ? n.title.replace(/<[^>]+>/g, '') : '';
    return '<div class="note-item' + (n.pinned ? ' pinned' : '') + '" data-id="' + n.id + '">' +
      (n.pinned ? '<span class="note-item-pin">📌</span>' : '') +
      '<div class="note-item-body">' +
        '<div class="note-item-title' + (!title ? ' untitled' : '') + '">' + hasPen + escH(title || 'Sem título') + '</div>' +
        '<div class="note-item-meta">' +
          '<span class="note-item-date">' + dateStr + '</span>' +
          '<span class="note-item-preview">' + escH(plainContent) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function bindListEvents() {
    const newBtn = document.getElementById('notes-new-btn');
    if (newBtn) newBtn.onclick = () => openEditor(null);
    const search = document.getElementById('notes-search');
    if (search) search.addEventListener('input', e => {
      _searchQuery = e.target.value;
      drawList();
      document.getElementById('notes-list')?.querySelectorAll('.note-item')
        .forEach(item => item.addEventListener('click', () => openEditor(item.dataset.id)));
    });
  }

  /* ─── EDITOR OPEN ─── */
  function openEditor(noteId) {
    _isNew = !noteId;
    _noteTags = [];
    _penMode = false;
    _eraserMode = false;
    _penHistory = [];
    _currentNote = noteId ? (DB.getNotes().find(n => n.id === noteId) || null) : null;

    const titleEl   = document.getElementById('note-title');
    const contentEl = document.getElementById('note-content');
    const dateEl    = document.getElementById('note-editor-date');
    const headerTitle = document.getElementById('sn-header-title');

    // Fill with saved HTML or empty
    if (titleEl)   titleEl.innerHTML   = _currentNote?.title   || '';
    if (contentEl) contentEl.innerHTML = _currentNote?.content || '';

    const plainTitle = titleEl ? titleEl.innerText.trim() : '';
    if (headerTitle) headerTitle.textContent = plainTitle || 'Título';

    _noteTags = [...(_currentNote?.tags || [])];
    renderTagsRow();

    if (dateEl) {
      const d = _currentNote ? new Date(_currentNote.updatedAt || _currentNote.createdAt) : new Date();
      dateEl.textContent = d.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    }

    // Live header title update
    if (titleEl) {
      titleEl.addEventListener('input', () => {
        const t = titleEl.innerText.trim();
        if (headerTitle) headerTitle.textContent = t || 'Título';
        scheduleSave();
      });
    }
    if (contentEl) {
      contentEl.addEventListener('input', () => {
        updateWordCount();
        scheduleSave();
      });
    }

    updateWordCount();

    // Pin button
    const pinBtn = document.getElementById('note-pin-btn');
    if (pinBtn) {
      pinBtn.classList.toggle('active', !!_currentNote?.pinned);
      pinBtn.onclick = () => {
        if (!_currentNote) return;
        DB.toggleNotePin(_currentNote.id);
        pinBtn.classList.toggle('active');
        showToast(_currentNote.pinned ? '📌 Fixada.' : 'Desafixada.');
      };
    }

    // Delete button
    const delBtn = document.getElementById('note-del-btn');
    if (delBtn) {
      delBtn.onclick = () => {
        if (_currentNote) {
          window.showConfirm('Eliminar esta nota?', () => {
            DB.deleteNote(_currentNote.id);
            closeEditor();
            showToast('Nota eliminada.');
          });
        } else if (_isNew) closeEditor();
      };
    }

    // Mode toggle (pen/keyboard)
    const modeBtn = document.getElementById('note-mode-btn');
    if (modeBtn) {
      modeBtn.textContent = '🖊';
      modeBtn.onclick = () => togglePenMode();
    }

    // Save button
    const saveBtn = document.getElementById('note-save-btn');
    if (saveBtn) saveBtn.onclick = () => { forceSave(); showToast('✓ Guardado!'); };

    // Back button
    const backBtn = document.getElementById('note-back');
    if (backBtn) backBtn.onclick = () => { clearTimeout(_saveTimer); forceSave(); closeEditor(); };

    // Toolbar
    bindToolbar();

    // Open overlay
    document.getElementById('note-editor')?.classList.add('open');

    // If has pen data, open pen mode
    if (_currentNote?.penData) {
      setTimeout(() => { togglePenMode(true); loadPenData(_currentNote.penData); }, 360);
    } else {
      setTimeout(() => {
        if (_isNew && titleEl) { titleEl.focus(); placeCaretAtEnd(titleEl); }
        else if (contentEl) { contentEl.focus(); placeCaretAtEnd(contentEl); }
      }, 360);
    }
  }

  function closeEditor() {
    clearTimeout(_saveTimer);
    document.getElementById('note-editor')?.classList.remove('open');
    _currentNote = null; _isNew = false; _penMode = false; _penHistory = [];
    setTimeout(() => { drawList(); bindListEvents(); }, 350);
  }

  /* ─── TOOLBAR (execCommand — real formatting) ─── */
  function bindToolbar() {
    function cmd(command, value) {
      document.getElementById('note-content')?.focus();
      document.execCommand(command, false, value);
      updateToolbarState();
      scheduleSave();
    }

    const boldBtn = document.getElementById('tb-bold');
    const italicBtn = document.getElementById('tb-italic');
    const underlineBtn = document.getElementById('tb-underline');
    const bulletBtn = document.getElementById('tb-bullet');
    const quoteBtn = document.getElementById('tb-quote');
    const h1Btn = document.getElementById('tb-h1');
    const dividerBtn = document.getElementById('tb-divider');

    if (boldBtn)      boldBtn.onclick      = () => cmd('bold');
    if (italicBtn)    italicBtn.onclick    = () => cmd('italic');
    if (underlineBtn) underlineBtn.onclick = () => cmd('underline');
    if (bulletBtn)    bulletBtn.onclick    = () => cmd('insertUnorderedList');
    if (quoteBtn)     quoteBtn.onclick     = () => insertBlockquote();
    if (h1Btn)        h1Btn.onclick        = () => cmd('formatBlock', 'h3');
    if (dividerBtn)   dividerBtn.onclick   = () => insertHR();

    // Update toolbar state on selection change
    document.addEventListener('selectionchange', updateToolbarState);
  }

  function updateToolbarState() {
    const content = document.getElementById('note-content');
    if (!content || !content.contains(window.getSelection()?.anchorNode)) return;
    const boldBtn      = document.getElementById('tb-bold');
    const italicBtn    = document.getElementById('tb-italic');
    const underlineBtn = document.getElementById('tb-underline');
    if (boldBtn)      boldBtn.classList.toggle('active', document.queryCommandState('bold'));
    if (italicBtn)    italicBtn.classList.toggle('active', document.queryCommandState('italic'));
    if (underlineBtn) underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
  }

  function insertBlockquote() {
    const content = document.getElementById('note-content');
    if (!content) return;
    content.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const bq = document.createElement('blockquote');
    bq.style.cssText = 'border-left:3px solid var(--accent);margin:8px 0;padding:4px 12px;color:var(--text-secondary);font-style:italic;';
    bq.innerHTML = sel.toString() || '&#8203;';
    range.deleteContents();
    range.insertNode(bq);
    placeCaretAtEnd(bq);
    scheduleSave();
  }

  function insertHR() {
    const content = document.getElementById('note-content');
    if (!content) return;
    content.focus();
    document.execCommand('insertHTML', false,
      '<hr style="border:none;border-top:1px solid var(--border-2);margin:12px 0;"><br>');
    scheduleSave();
  }

  /* ─── PEN MODE ─── */
  function togglePenMode(forceOn) {
    _penMode = forceOn === true ? true : !_penMode;
    _eraserMode = false;
    const keyBody = document.getElementById('note-keyboard-body');
    const penBody = document.getElementById('note-pen-body');
    const toolbar = document.getElementById('sn-toolbar');
    const modeBtn = document.getElementById('note-mode-btn');
    keyBody?.classList.toggle('hidden', _penMode);
    penBody?.classList.toggle('hidden', !_penMode);
    if (toolbar) toolbar.style.display = _penMode ? 'none' : '';
    if (modeBtn) modeBtn.textContent = _penMode ? '⌨️' : '🖊';
    if (_penMode) { initCanvas(); bindPenTools(); }
  }

  /* ─── CANVAS ─── */
  function initCanvas() {
    const wrap = document.getElementById('pen-canvas-wrap');
    const canvas = document.getElementById('pen-canvas');
    if (!canvas || !wrap) return;

    const linesDiv = document.getElementById('pen-lines-bg');
    if (linesDiv) {
      linesDiv.innerHTML = '';
      for (let i = 0; i < 40; i++) {
        const d = document.createElement('div');
        d.className = 'pen-ruled-line';
        linesDiv.appendChild(d);
      }
    }

    const W = wrap.clientWidth || window.innerWidth;
    const H = Math.max(wrap.clientHeight || 0, window.innerHeight * 0.65);
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    if (_currentNote?.penData && _penHistory.length === 0) loadPenData(_currentNote.penData);

    const fresh = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(fresh, canvas);
    fresh.addEventListener('touchstart',  onTouchStart, { passive: false });
    fresh.addEventListener('touchmove',   onTouchMove,  { passive: false });
    fresh.addEventListener('touchend',    onTouchEnd,   { passive: true });
    fresh.addEventListener('mousedown',   onMouseDown);
    fresh.addEventListener('mousemove',   onMouseMove);
    fresh.addEventListener('mouseup',     onMouseUp);
    fresh.addEventListener('mouseleave',  onMouseUp);
  }

  function getCtx() { const c = document.getElementById('pen-canvas'); return c ? c.getContext('2d') : null; }
  function getPos(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) };
  }
  function onTouchStart(e) { e.preventDefault(); const t = e.touches[0]; startDraw(getPos(e.target, t.clientX, t.clientY)); }
  function onTouchMove(e)  { e.preventDefault(); if (!_drawing) return; const t = e.touches[0]; continueDraw(getPos(e.target, t.clientX, t.clientY)); }
  function onTouchEnd()    { endDraw(); }
  function onMouseDown(e)  { startDraw(getPos(e.target, e.clientX, e.clientY)); }
  function onMouseMove(e)  { if (!_drawing) return; continueDraw(getPos(e.target, e.clientX, e.clientY)); }
  function onMouseUp()     { endDraw(); }

  function startDraw(pos) {
    _drawing = true; _lastX = pos.x; _lastY = pos.y;
    const ctx = getCtx(); const c = document.getElementById('pen-canvas');
    if (ctx && c) { _penHistory.push(ctx.getImageData(0, 0, c.width, c.height)); if (_penHistory.length > 40) _penHistory.shift(); }
    continueDraw(pos);
  }
  function continueDraw(pos) {
    if (!_drawing) return; const ctx = getCtx(); if (!ctx) return;
    if (_eraserMode) { ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = _penSize * 8; }
    else { ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = _penColor; ctx.lineWidth = _penSize; }
    ctx.beginPath(); ctx.moveTo(_lastX, _lastY); ctx.lineTo(pos.x, pos.y); ctx.stroke();
    _lastX = pos.x; _lastY = pos.y;
  }
  function endDraw() { _drawing = false; }

  function bindPenTools() {
    document.querySelectorAll('.pen-color-btn').forEach(btn => {
      btn.onclick = () => { _penColor = btn.dataset.color; _eraserMode = false; document.querySelectorAll('.pen-color-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.getElementById('pen-draw-btn')?.classList.add('active'); document.getElementById('pen-eraser-btn')?.classList.remove('active'); };
    });
    document.querySelectorAll('.pen-size-btn').forEach(btn => {
      btn.onclick = () => { _penSize = parseFloat(btn.dataset.size); document.querySelectorAll('.pen-size-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); };
    });
    document.getElementById('pen-draw-btn')?.addEventListener('click', () => { _eraserMode = false; document.getElementById('pen-draw-btn')?.classList.add('active'); document.getElementById('pen-eraser-btn')?.classList.remove('active'); });
    document.getElementById('pen-eraser-btn')?.addEventListener('click', () => { _eraserMode = true; document.getElementById('pen-eraser-btn')?.classList.add('active'); document.getElementById('pen-draw-btn')?.classList.remove('active'); });
    document.getElementById('pen-undo-btn')?.addEventListener('click', () => { const ctx = getCtx(); const c = document.getElementById('pen-canvas'); if (!ctx || !c) return; if (_penHistory.length > 0) ctx.putImageData(_penHistory.pop(), 0, 0); else ctx.clearRect(0, 0, c.width, c.height); });
    document.getElementById('pen-clear-btn')?.addEventListener('click', () => { window.showConfirmClear('Limpar todo o desenho?', () => { const ctx2 = getCtx(); const c2 = document.getElementById('pen-canvas'); if (ctx2 && c2) { _penHistory = []; ctx2.clearRect(0, 0, c2.width, c2.height); } }); return; const ctx = getCtx(); const c = document.getElementById('pen-canvas'); if (ctx && c) { _penHistory = []; ctx.clearRect(0, 0, c.width, c.height); } });
  }

  function getPenDataURL() { const c = document.getElementById('pen-canvas'); return c ? c.toDataURL('image/png') : null; }
  function loadPenData(dataURL) {
    if (!dataURL) return; const c = document.getElementById('pen-canvas'); const ctx = getCtx();
    if (!c || !ctx) return; const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0); img.src = dataURL;
  }

  /* ─── SAVE ─── */
  function scheduleSave() {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(forceSave, 1200);
  }

  function forceSave() {
    const titleEl   = document.getElementById('note-title');
    const contentEl = document.getElementById('note-content');
    const title   = titleEl   ? titleEl.innerHTML.trim()   : '';
    const content = contentEl ? contentEl.innerHTML.trim() : '';
    const penData = _penMode ? getPenDataURL() : (_currentNote?.penData || null);

    if (!title && !content && !penData) return;

    const data = { title, content, tags: _noteTags, penData };
    if (_currentNote) data.id = _currentNote.id;

    const saved = DB.saveNote(data);
    _currentNote = saved; _isNew = false;

    const dateEl = document.getElementById('note-editor-date');
    if (dateEl) {
      const d = new Date();
      dateEl.textContent = d.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    }
  }

  /* ─── HELPERS ─── */
  function renderTagsRow() {
    const row = document.getElementById('note-tags-row');
    if (!row) return;
    row.innerHTML = '';
    _noteTags.forEach(tag => {
      const pill = document.createElement('span');
      pill.className = 'note-tag-pill';
      pill.innerHTML = '#' + tag + ' <button>✕</button>';
      pill.querySelector('button').onclick = () => { _noteTags = _noteTags.filter(t => t !== tag); renderTagsRow(); };
      row.appendChild(pill);
    });
    const input = document.createElement('input');
    input.type = 'text'; input.className = 'note-tag-add-input'; input.placeholder = '+ tag';
    input.onkeydown = e => {
      if (e.key !== 'Enter' && e.key !== ',') return;
      e.preventDefault();
      const tag = input.value.trim().replace(/^#/, '');
      if (!tag || _noteTags.includes(tag)) { input.value = ''; return; }
      _noteTags.push(tag); input.value = ''; renderTagsRow();
    };
    row.appendChild(input);
  }

  function updateWordCount() {
    const contentEl = document.getElementById('note-content');
    const el        = document.getElementById('note-wordcount');
    if (!contentEl || !el) return;
    const text  = contentEl.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    el.textContent = words + ' palavra' + (words !== 1 ? 's' : '');
  }

  function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function formatNoteDate(iso) {
    if (!iso) return '';
    const d = new Date(iso), now = new Date(), diff = now - d;
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return 'agora';
    if (mins < 60)  return 'há ' + mins + 'min';
    if (hours < 24) return 'há ' + hours + 'h';
    if (days === 1) return 'ontem';
    if (days < 7)   return 'há ' + days + ' dias';
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  }

  function escH(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return { render, openEditor };
})();

window.Notes = Notes;
