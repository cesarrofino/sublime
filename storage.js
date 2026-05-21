// SubLime — Storage Module

const DB = {
  getUser() { try { return JSON.parse(localStorage.getItem('sublime_user')) || null; } catch { return null; } },
  setUser(data) { localStorage.setItem('sublime_user', JSON.stringify(data)); },
  getTheme() { return localStorage.getItem('sublime_theme') || 'light'; },
  setTheme(t) { localStorage.setItem('sublime_theme', t); },

  getProgress(bookId) {
    try { const all = JSON.parse(localStorage.getItem('sublime_progress')) || {}; return all[bookId] || { page: 0, percent: 0 }; }
    catch { return { page: 0, percent: 0 }; }
  },
  setProgress(bookId, data) {
    try { const all = JSON.parse(localStorage.getItem('sublime_progress')) || {}; all[bookId] = { ...data, lastRead: new Date().toISOString() }; localStorage.setItem('sublime_progress', JSON.stringify(all)); }
    catch(e) { console.error(e); }
  },
  getAllProgress() { try { return JSON.parse(localStorage.getItem('sublime_progress')) || {}; } catch { return {}; } },
  getLastBook() {
    try {
      const all = JSON.parse(localStorage.getItem('sublime_progress')) || {};
      let last = null, lastTime = 0;
      for (const [id, data] of Object.entries(all)) {
        const t = data.lastRead ? new Date(data.lastRead).getTime() : 0;
        if (t > lastTime) { lastTime = t; last = id; }
      }
      return last;
    } catch { return null; }
  },

  getReflections() { try { return JSON.parse(localStorage.getItem('sublime_reflections')) || []; } catch { return []; } },
  saveReflection(data) {
    const all = this.getReflections();
    const entry = { id: Date.now().toString(), text: data.text, tags: data.tags || [], bookId: data.bookId || null, pageTitle: data.pageTitle || null, source: data.source || 'manual', date: new Date().toISOString(), favorite: false };
    all.unshift(entry);
    localStorage.setItem('sublime_reflections', JSON.stringify(all));
    return entry;
  },
  deleteReflection(id) { localStorage.setItem('sublime_reflections', JSON.stringify(this.getReflections().filter(r => r.id !== id))); },
  toggleFavorite(id) {
    const all = this.getReflections();
    const idx = all.findIndex(r => r.id === id);
    if (idx !== -1) all[idx].favorite = !all[idx].favorite;
    localStorage.setItem('sublime_reflections', JSON.stringify(all));
    return idx !== -1 ? all[idx].favorite : false;
  },

  getQuotes() { try { return JSON.parse(localStorage.getItem('sublime_quotes')) || []; } catch { return []; } },
  saveQuote(data) {
    const all = this.getQuotes();
    const entry = { id: Date.now().toString(), text: data.text, bookId: data.bookId || null, bookTitle: data.bookTitle || null, author: data.author || null, date: new Date().toISOString() };
    all.unshift(entry);
    localStorage.setItem('sublime_quotes', JSON.stringify(all));
    return entry;
  },
  deleteQuote(id) { localStorage.setItem('sublime_quotes', JSON.stringify(this.getQuotes().filter(q => q.id !== id))); },

  // ─── Highlights (sublinhamentos persistentes por livro/página) ───
  getHighlights(bookId, pageIdx) {
    try {
      const all = JSON.parse(localStorage.getItem('sublime_highlights')) || {};
      return all[`${bookId}_${pageIdx}`] || [];
    } catch { return []; }
  },
  saveHighlight(bookId, pageIdx, text) {
    try {
      const all = JSON.parse(localStorage.getItem('sublime_highlights')) || {};
      const key = `${bookId}_${pageIdx}`;
      if (!all[key]) all[key] = [];
      if (!all[key].find(h => h.text === text)) {
        all[key].push({ text, date: new Date().toISOString() });
        localStorage.setItem('sublime_highlights', JSON.stringify(all));
      }
    } catch(e) { console.error(e); }
  },
  removeHighlight(bookId, pageIdx, text) {
    try {
      const all = JSON.parse(localStorage.getItem('sublime_highlights')) || {};
      const key = `${bookId}_${pageIdx}`;
      if (all[key]) { all[key] = all[key].filter(h => h.text !== text); localStorage.setItem('sublime_highlights', JSON.stringify(all)); }
    } catch(e) { console.error(e); }
  },

  // ─── Notes (iOS-style) ───
  getNotes() { try { return JSON.parse(localStorage.getItem('sublime_notes')) || []; } catch { return []; } },
  saveNote(data) {
    const all = this.getNotes();
    const now = new Date().toISOString();
    if (data.id) {
      const idx = all.findIndex(n => n.id === data.id);
      if (idx !== -1) { all[idx] = { ...all[idx], ...data, penData: data.penData !== undefined ? data.penData : all[idx].penData, updatedAt: now }; localStorage.setItem('sublime_notes', JSON.stringify(all)); return all[idx]; }
    }
    const entry = { id: Date.now().toString(), title: data.title || '', content: data.content || '', tags: data.tags || [], mood: data.mood || null, penData: data.penData || null, pinned: false, createdAt: now, updatedAt: now };
    all.unshift(entry);
    localStorage.setItem('sublime_notes', JSON.stringify(all));
    return entry;
  },
  deleteNote(id) { localStorage.setItem('sublime_notes', JSON.stringify(this.getNotes().filter(n => n.id !== id))); },
  toggleNotePin(id) {
    const all = this.getNotes();
    const idx = all.findIndex(n => n.id === id);
    if (idx !== -1) all[idx].pinned = !all[idx].pinned;
    localStorage.setItem('sublime_notes', JSON.stringify(all));
    return idx !== -1 ? all[idx].pinned : false;
  },

  getFontSize() { return parseFloat(localStorage.getItem('sublime_font_size')) || 1.1; },
  setFontSize(size) { localStorage.setItem('sublime_font_size', size.toString()); },

  getStats() { try { return JSON.parse(localStorage.getItem('sublime_stats')) || { pagesRead: 0, daysActive: 0, lastDay: null }; } catch { return { pagesRead: 0, daysActive: 0, lastDay: null }; } },
  incrementPage() {
    const s = this.getStats();
    s.pagesRead = (s.pagesRead || 0) + 1;
    const today = new Date().toDateString();
    if (s.lastDay !== today) { s.daysActive = (s.daysActive || 0) + 1; s.lastDay = today; }
    localStorage.setItem('sublime_stats', JSON.stringify(s));
  }
};

window.DB = DB;
