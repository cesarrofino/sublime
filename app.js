// SubLime — Main App

const DAILY_QUOTES = [
  { text: "Não procures que as coisas aconteçam como queres, mas deseja que aconteçam como são.", author: "Epicteto" },
  { text: "O homem sofre mais na imaginação do que na realidade.", author: "Sêneca" },
  { text: "Nunca te distraias com o que não importa.", author: "Marco Aurélio" },
  { text: "A vida é longa se souberes usá-la.", author: "Sêneca" },
  { text: "O que pensamos, nos tornamos.", author: "Buda" },
  { text: "O silêncio é o sono que alimenta a sabedoria.", author: "Francis Bacon" },
  { text: "Conhece-te a ti mesmo.", author: "Sócrates" },
  { text: "A leitura é para a mente o que o exercício é para o corpo.", author: "Joseph Addison" },
  { text: "Não há nada fora de ti que possa levar-te à felicidade.", author: "Ralph W. Emerson" },
  { text: "A sabedoria começa no espanto.", author: "Sócrates" },
  { text: "Sê a mudança que queres ver no mundo.", author: "Mahatma Gandhi" },
  { text: "O presente é tudo o que tens. É a única coisa real.", author: "Marco Aurélio" },
  { text: "Aprender sem pensar é trabalho perdido.", author: "Confúcio" },
  { text: "Prefere a paz interior a qualquer conquista exterior.", author: "Epicteto" },
  { text: "O amor ao destino — amar o que acontece.", author: "Nietzsche" }
];

function getDailyQuote() {
  const idx = (new Date().getDay() + new Date().getDate() + new Date().getMonth()) % DAILY_QUOTES.length;
  return DAILY_QUOTES[idx];
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-PT', { day:'2-digit', month:'short', year:'numeric' });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

window.showToast = function(msg, ms = 2200) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), ms);
};

// ─── Custom Modal System ───
window.showConfirm = function(message, onOk, onCancel) {
  let overlay = document.getElementById('custom-confirm-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'custom-confirm-overlay';
    overlay.className = 'custom-modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML =
    '<div class="custom-modal-card">' +
      '<div class="custom-modal-msg">' + message + '</div>' +
      '<div class="custom-modal-actions">' +
        '<button class="custom-modal-cancel" id="cm-cancel">Cancelar</button>' +
        '<button class="custom-modal-ok" id="cm-ok">Eliminar</button>' +
      '</div>' +
    '</div>';
  overlay.classList.add('open');
  overlay.querySelector('#cm-cancel').onclick = () => {
    overlay.classList.remove('open');
    if (onCancel) onCancel();
  };
  overlay.querySelector('#cm-ok').onclick = () => {
    overlay.classList.remove('open');
    if (onOk) onOk();
  };
  overlay.onclick = (e) => {
    if (e.target === overlay) { overlay.classList.remove('open'); if (onCancel) onCancel(); }
  };
};

window.showConfirmClear = function(message, onOk) {
  let overlay = document.getElementById('custom-confirm-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'custom-confirm-overlay';
    overlay.className = 'custom-modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML =
    '<div class="custom-modal-card">' +
      '<div class="custom-modal-msg">' + message + '</div>' +
      '<div class="custom-modal-actions">' +
        '<button class="custom-modal-cancel" id="cm-cancel">Cancelar</button>' +
        '<button class="custom-modal-ok" id="cm-ok">Limpar</button>' +
      '</div>' +
    '</div>';
  overlay.classList.add('open');
  overlay.querySelector('#cm-cancel').onclick = () => overlay.classList.remove('open');
  overlay.querySelector('#cm-ok').onclick = () => { overlay.classList.remove('open'); if (onOk) onOk(); };
  overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('open'); };
};


const App = (() => {
  let _screen = 'home';

  function init() {
    applyTheme();
    const user = DB.getUser();
    if (!user) { showScreen('onboarding'); }
    else { showScreen('login'); setupLoginPin(user); }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  function applyTheme() {
    const t = DB.getTheme();
    if (t === 'light') document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
  }

  function showScreen(name) {
    document.getElementById('onboarding').classList.toggle('hidden', name !== 'onboarding');
    document.getElementById('pin-login').classList.toggle('hidden', name !== 'login');
    document.getElementById('app').classList.toggle('active', name === 'app');
  }

  function setupPinPad(padId, dotsId, onComplete) {
    const pad = document.getElementById(padId);
    const dotsEl = document.getElementById(dotsId);
    if (!pad || !dotsEl) return;
    const fresh = pad.cloneNode(true);
    pad.parentNode.replaceChild(fresh, pad);
    let entered = '';
    const dots = dotsEl.querySelectorAll('.pin-dot');
    const update = () => dots.forEach((d, i) => { d.classList.toggle('filled', i < entered.length); d.classList.remove('error'); });
    fresh.querySelectorAll('.pin-key').forEach(key => {
      key.addEventListener('click', () => {
        const v = key.dataset.v;
        if (!v) return;
        if (v === 'del') { entered = entered.slice(0,-1); update(); return; }
        if (entered.length >= 4) return;
        entered += v; update();
        if (entered.length === 4) {
          const pin = entered; entered = ''; update();
          setTimeout(() => onComplete(pin), 150);
        }
      });
    });
  }

  function shakeDots(dotsId) {
    document.querySelectorAll(`#${dotsId} .pin-dot`).forEach(d => {
      d.classList.remove('filled'); d.classList.add('error');
      setTimeout(() => d.classList.remove('error'), 500);
    });
  }

  function setupOnboarding() {
    let obPin1 = '';
    const btn1 = document.getElementById('ob-next-1');
    if (!btn1) return;
    const freshBtn = btn1.cloneNode(true);
    btn1.parentNode.replaceChild(freshBtn, btn1);

    freshBtn.addEventListener('click', () => {
      const name = document.getElementById('ob-name').value.trim();
      const year = document.getElementById('ob-year').value.trim();
      if (!name) { showToast('Escreve o teu nome.'); return; }
      if (!year || isNaN(+year) || +year < 1920) { showToast('Indica um ano válido.'); return; }
      window._obName = name; window._obYear = year;
      gotoObStep(2);
      setupPinPad('ob-pin-pad','ob-pin-dots', pin1 => {
        obPin1 = pin1; gotoObStep(3);
        setupPinPad('ob-pin-pad-confirm','ob-pin-dots-confirm', pin2 => {
          if (pin2 !== obPin1) {
            shakeDots('ob-pin-dots-confirm'); showToast('PINs diferentes. Tenta de novo.');
            setTimeout(() => { gotoObStep(2); setupPinPad('ob-pin-pad','ob-pin-dots', p1 => { obPin1=p1; gotoObStep(3); }); }, 700);
            return;
          }
          DB.setUser({ name: window._obName, year: window._obYear, pin: obPin1 });
          showScreen('app'); launchApp();
        });
      });
    });
    ['ob-name','ob-year'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') freshBtn.click(); });
    });
  }

  function gotoObStep(n) {
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`ob-step-${n}`);
    if (el) el.classList.add('active');
  }

  function setupLoginPin(user) {
    const nameEl = document.getElementById('login-name');
    const timeEl = document.getElementById('login-time');
    if (nameEl) nameEl.textContent = user.name;
    if (timeEl) timeEl.textContent = getTimeGreeting();
    _setupLoginQuotes();
    _setupQuickNote();
    const tryPin = () => {
      setupPinPad('login-pin-pad','login-pin-dots', pin => {
        if (pin !== user.pin) { shakeDots('login-pin-dots'); showToast('PIN incorrecto.'); setTimeout(tryPin, 700); return; }
        showScreen('app'); launchApp();
      });
    };
    tryPin();
  }

  function _setupLoginQuotes() {
    let _qIdx = (new Date().getHours() + new Date().getDate()) % DAILY_QUOTES.length;
    let _qTimer = null;
    const total = Math.min(DAILY_QUOTES.length, 6);
    const textEl = document.getElementById('login-quote-text');
    const authorEl = document.getElementById('login-quote-author');
    const dotsEl = document.getElementById('login-quote-dots');
    if (!textEl || !dotsEl) return;
    dotsEl.innerHTML = Array.from({length:total}, (_,i) =>
      `<div class="login-quote-dot${i===(_qIdx%total)?' active':''}" data-i="${i}"></div>`).join('');
    dotsEl.querySelectorAll('.login-quote-dot').forEach(dot => {
      dot.addEventListener('click', () => { _qIdx=parseInt(dot.dataset.i); showQ(_qIdx); resetTimer(); });
    });
    function showQ(idx) {
      const q = DAILY_QUOTES[idx % DAILY_QUOTES.length];
      textEl.style.opacity='0'; authorEl.style.opacity='0';
      setTimeout(() => {
        textEl.textContent=q.text; textEl.style.transition='opacity 0.6s'; textEl.style.opacity='1';
        authorEl.textContent='— '+q.author; authorEl.style.transition='opacity 0.6s'; authorEl.style.opacity='1';
        dotsEl.querySelectorAll('.login-quote-dot').forEach((d,i) => d.classList.toggle('active', i===idx%total));
      }, 300);
    }
    function resetTimer() { clearInterval(_qTimer); _qTimer=setInterval(() => { _qIdx=(_qIdx+1)%total; showQ(_qIdx); }, 8000); }
    showQ(_qIdx); resetTimer();
  }

  function _setupQuickNote() {
    const openBtn  = document.getElementById('login-quick-note-btn');
    const panel    = document.getElementById('quick-note-panel');
    const cancelBtn= document.getElementById('quick-note-cancel');
    const saveBtn  = document.getElementById('quick-note-save');
    const textarea = document.getElementById('quick-note-input');
    if (!openBtn || !panel) return;
    openBtn.addEventListener('click', () => { if (textarea) textarea.value=''; panel.classList.add('open'); setTimeout(() => textarea&&textarea.focus(), 150); });
    cancelBtn?.addEventListener('click', () => panel.classList.remove('open'));
    panel.addEventListener('click', e => { if (e.target===panel) panel.classList.remove('open'); });
    saveBtn?.addEventListener('click', () => {
      const text = textarea?.value.trim();
      if (!text) { showToast('Escreve algo primeiro.'); return; }
      DB.saveNote({ title: '', content: text, tags: ['anotação rápida'] });
      panel.classList.remove('open');
      showToast('✦ Pensamento guardado!');
    });
  }

  function launchApp() {
    document.querySelectorAll('.nav-item').forEach(item => {
      const f = item.cloneNode(true);
      item.parentNode.replaceChild(f, item);
      f.addEventListener('click', () => navigateTo(f.dataset.screen));
    });
    navigateTo('home');
  }

  function navigateTo(name) {
    _screen = name;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.screen===name));
    const el = document.getElementById(`${name}-screen`);
    if (el) el.classList.add('active');
    if (name==='home')        renderHome();
    if (name==='library')     Library.render();
    if (name==='notes')       Notes.render();
    if (name==='reflections') renderReflections();
    if (name==='quotes')      renderQuotes();
    if (name==='dicionario')   Dicionario.render();
  }

  function refreshCurrentScreen() { navigateTo(_screen); }

  function toggleTheme() {
    const isLight = document.documentElement.dataset.theme === 'light';
    if (isLight) { delete document.documentElement.dataset.theme; DB.setTheme('dark'); }
    else { document.documentElement.dataset.theme = 'light'; DB.setTheme('light'); }
  }

  // ── HOME ──
  function renderHome() {
    const user   = DB.getUser();
    const screen = document.getElementById('home-screen');
    const quote  = getDailyQuote();
    const lastId = DB.getLastBook();
    const stats  = DB.getStats();
    const refs   = DB.getReflections().slice(0,3);

    let lastBookHTML = `<div class="empty-state"><div class="empty-state-icon">📚</div>Ainda não leste nenhum livro.<br>Vai à Biblioteca para começar.</div>`;

    if (lastId) {
      try {
        const book = Library.loadBook(lastId);
        const prog = DB.getProgress(lastId);
        const pct  = prog.percent || 0;
        lastBookHTML = `
          <div class="last-book-card" id="continue-card" data-id="${lastId}">
            <div class="last-book-cover" style="background:${book.cover_color||'#1a1a2e'};">
              <div class="last-book-cover-letter" style="color:${book.accent||'#c9a96e'};">${book.title[0]}</div>
            </div>
            <div class="last-book-info">
              <div class="last-book-title">${escapeHtml(book.title)}</div>
              <div class="last-book-author">${escapeHtml(book.author)}</div>
              <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
              <div class="progress-label">${pct>0?Math.round(pct)+'% lido':'Não iniciado'}</div>
            </div>
            <button class="continue-btn" id="continue-btn">Continuar</button>
          </div>`;
      } catch(e) {}
    }

    const notesCount = DB.getNotes().length;

    screen.innerHTML = `
      <div class="home-header anim-fade-in">
        <div>
          <div class="home-greeting-small">${getTimeGreeting()}</div>
          <div class="home-greeting-name">${escapeHtml(user?.name||'Leitor')}</div>
        </div>
        <div class="home-actions">
          <button class="icon-btn" id="theme-btn" title="Tema">◑</button>
        </div>
      </div>

      <div class="stats-bar anim-fade-in anim-delay-1">
        <div class="stat-card">
          <div class="stat-value">${notesCount}</div>
          <div class="stat-label">Notas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${DB.getReflections().length}</div>
          <div class="stat-label">Reflexões</div>
        </div>
      </div>

      <div class="quote-card anim-fade-in anim-delay-2">
        <div class="quote-label">Pensamento do dia</div>
        <div class="quote-text">${escapeHtml(quote.text)}</div>
        <div class="quote-author">— ${escapeHtml(quote.author)}</div>
      </div>

      <div class="section-header anim-fade-in anim-delay-3">
        <div class="section-title">Último livro</div>
        <div class="section-link" id="go-lib">Ver biblioteca →</div>
      </div>
      ${lastBookHTML}

      <div class="section-header anim-fade-in anim-delay-4" style="margin-top:28px;">
        <div class="section-title">Notas recentes</div>
        <div class="section-link" id="go-notes">Ver todas →</div>
      </div>
      <div id="home-notes">
        ${DB.getNotes().slice(0,3).length===0
          ? `<div class="empty-state"><div class="empty-state-icon">📝</div>As tuas notas aparecerão aqui.</div>`
          : DB.getNotes().slice(0,3).map(n=>`
              <div class="note-chip">
                <div class="note-chip-text">${escapeHtml(n.title||n.content||'')}</div>
                <div class="note-chip-meta">
                  <span class="note-chip-tag">${(n.tags||[])[0]?'#'+(n.tags[0]):''}</span>
                  <span class="note-chip-date">${formatDate(n.updatedAt||n.createdAt)}</span>
                </div>
              </div>`).join('')
        }
      </div>
    `;

    document.getElementById('theme-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('go-lib')?.addEventListener('click', () => navigateTo('library'));
    document.getElementById('go-notes')?.addEventListener('click', () => navigateTo('notes'));

    const contCard = document.getElementById('continue-card');
    if (contCard) {
      const openBook = () => Reader.open(contCard.dataset.id);
      contCard.addEventListener('click', openBook);
      document.getElementById('continue-btn')?.addEventListener('click', e => { e.stopPropagation(); openBook(); });
    }
  }

  // ── REFLECTIONS ──
  function renderReflections() {
    const screen = document.getElementById('reflections-screen');
    const all = DB.getReflections();
    let _filter = '';

    function draw() {
      const filtered = _filter ? all.filter(r=>(r.tags||[]).includes(_filter)) : all;
      const list = document.getElementById('ref-list');
      if (!list) return;
      list.innerHTML = filtered.length===0
        ? `<div class="empty-state"><div class="empty-state-icon">✦</div>Sem reflexões aqui ainda.</div>`
        : filtered.map(r=>`
            <div class="reflection-card">
              <div class="reflection-actions-btns">
                <button class="r-action-btn fav" data-id="${r.id}">${r.favorite?'♥':'♡'}</button>
                <button class="r-action-btn del" data-id="${r.id}">✕</button>
              </div>
              <div class="reflection-card-text">${escapeHtml(r.text)}</div>
              <div class="reflection-card-footer">
                <div class="reflection-tags">${(r.tags||[]).map(t=>`<span class="r-tag">#${t}</span>`).join('')}</div>
                <div class="reflection-date">${formatDate(r.date)}</div>
              </div>
            </div>`).join('');

      list.querySelectorAll('.r-action-btn.del').forEach(b =>
        b.addEventListener('click', () => { DB.deleteReflection(b.dataset.id); renderReflections(); showToast('Reflexão eliminada.'); }));
      list.querySelectorAll('.r-action-btn.fav').forEach(b =>
        b.addEventListener('click', () => { const f=DB.toggleFavorite(b.dataset.id); b.textContent=f?'♥':'♡'; showToast(f?'♥ Favorito':'Removido'); }));
    }

    const tags = [...new Set(all.flatMap(r=>r.tags||[]))].slice(0,10);
    const pillsHTML = tags.length ? `
      <div class="category-pills" id="ref-pills">
        <button class="pill active" data-tag="">Todas</button>
        ${tags.map(t=>`<button class="pill" data-tag="${t}">${t}</button>`).join('')}
      </div>` : '';

    screen.innerHTML = `
      <div class="screen-header anim-fade-in">
        <div class="screen-title">Reflexões</div>
        <div class="screen-subtitle">${all.length} pensamento${all.length!==1?'s':''} guardado${all.length!==1?'s':''}</div>
      </div>
      <button class="new-note-btn anim-fade-in" id="new-note-btn"><span>✦</span> Nova reflexão</button>
      ${pillsHTML}
      <div id="ref-list"></div>
      <div class="modal-overlay" id="note-modal">
        <div class="modal-card">
          <h3>Nova reflexão</h3>
          <textarea class="modal-textarea" id="note-text" placeholder="Escreve o teu pensamento..."></textarea>
          <div class="tag-input-wrap" id="tag-wrap"><input type="text" class="tag-input" id="tag-input" placeholder="Tag + Enter"></div>
          <div class="modal-actions">
            <button class="btn-secondary" id="note-cancel">Cancelar</button>
            <button class="btn-primary" id="note-save">Guardar</button>
          </div>
        </div>
      </div>`;

    draw();
    screen.querySelectorAll('.pill[data-tag]').forEach(pill => {
      pill.addEventListener('click', () => {
        _filter=pill.dataset.tag;
        screen.querySelectorAll('.pill[data-tag]').forEach(p=>p.classList.remove('active'));
        pill.classList.add('active'); draw();
      });
    });

    let noteTags = [];
    screen.querySelector('#new-note-btn').addEventListener('click', () => {
      noteTags=[]; screen.querySelector('#note-text').value='';
      screen.querySelector('#tag-wrap').innerHTML=`<input type="text" class="tag-input" id="tag-input" placeholder="Tag + Enter">`;
      bindTagInput(); screen.querySelector('#note-modal').classList.add('open');
      setTimeout(()=>screen.querySelector('#note-text').focus(),120);
    });
    screen.querySelector('#note-cancel').addEventListener('click', () => screen.querySelector('#note-modal').classList.remove('open'));
    screen.querySelector('#note-save').addEventListener('click', () => {
      const text=screen.querySelector('#note-text').value.trim();
      if (!text) { showToast('Escreve algo primeiro.'); return; }
      DB.saveReflection({ text, tags: noteTags });
      screen.querySelector('#note-modal').classList.remove('open');
      showToast('✦ Reflexão guardada!'); renderReflections();
    });
    screen.querySelector('#note-modal').addEventListener('click', e => {
      if (e.target===screen.querySelector('#note-modal')) screen.querySelector('#note-modal').classList.remove('open');
    });

    function bindTagInput() {
      const input = screen.querySelector('#tag-input');
      if (!input) return;
      input.addEventListener('keydown', e => {
        if (e.key!=='Enter'&&e.key!==',') return;
        e.preventDefault();
        const tag=input.value.trim().replace(/^#/,'');
        if (!tag||noteTags.includes(tag)){input.value='';return;}
        noteTags.push(tag);
        const chip=document.createElement('div');
        chip.className='tag-chip';
        chip.innerHTML=`#${tag} <button>✕</button>`;
        chip.querySelector('button').addEventListener('click',()=>{noteTags=noteTags.filter(t=>t!==tag);chip.remove();});
        screen.querySelector('#tag-wrap').insertBefore(chip,input);
        input.value='';
      });
    }
  }

  // ── QUOTES ──
  function renderQuotes() {
    const screen = document.getElementById('quotes-screen');
    const quotes = DB.getQuotes();
    screen.innerHTML = `
      <div class="screen-header anim-fade-in">
        <div class="screen-title">Citações</div>
        <div class="screen-subtitle">${quotes.length} frase${quotes.length!==1?'s':''} guardada${quotes.length!==1?'s':''}</div>
      </div>
      <div class="quotes-grid">
        ${quotes.length===0
          ? `<div class="empty-state"><div class="empty-state-icon">💬</div>As tuas citações favoritas aparecerão aqui.<br><small style="margin-top:8px;display:block;opacity:0.6">Selecciona texto no leitor para guardar.</small></div>`
          : quotes.map((q,i)=>`
              <div class="saved-quote-chip" style="animation:fadeIn 0.3s ease ${i*0.05}s both">
                <button class="quote-del" data-id="${q.id}" title="Eliminar">✕</button>
                ${escapeHtml(q.text)}
                ${q.bookTitle?`<div style="font-size:0.7rem;color:var(--text-muted);margin-top:8px;font-family:var(--font-ui);">— ${escapeHtml(q.bookTitle)}${q.author?', '+escapeHtml(q.author):''}</div>`:''}
              </div>`).join('')
        }
      </div>`;
    screen.querySelectorAll('.quote-del').forEach(btn => {
      btn.addEventListener('click', () => { window.showConfirm('Eliminar esta citação?', () => { DB.deleteQuote(btn.dataset.id); showToast('Citação eliminada.'); renderQuotes(); }); });
    });
  }

  return { init, setupOnboarding, navigateTo, refreshCurrentScreen };
})();

window.App = App;




document.addEventListener('DOMContentLoaded', () => {
  // ── Splash de 8 segundos ──
  const SPLASH_MS = 8000;
  const splashEl  = document.getElementById('splash-screen');
  const barEl     = document.getElementById('splash-bar');
  const startTime = Date.now();

  let rafId;
  function animateBar() {
    const elapsed = Date.now() - startTime;
    const pct = Math.min((elapsed / SPLASH_MS) * 100, 100);
    if (barEl) barEl.style.width = pct + '%';
    if (elapsed < SPLASH_MS) {
      rafId = requestAnimationFrame(animateBar);
    }
  }
  animateBar();

  setTimeout(() => {
    cancelAnimationFrame(rafId);
    if (barEl) barEl.style.width = '100%';
    if (splashEl) {
      splashEl.classList.add('fade-out');
      setTimeout(() => splashEl.classList.add('hidden'), 650);
    }
    App.init();
    App.setupOnboarding();
  }, SPLASH_MS);
});