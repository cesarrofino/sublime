// SubLime — Library Module
// Carrega cada livro do seu ficheiro JSON individual via fetch

const BOOK_IDS = [
  "meditacoes",
  "estoicismo",
  "estoicismo-vida",
  "assim-falou",
  "poder-agora",
  "poder-habito",
  "pequeno-principe",
  "sidarta",
  "cartas-seneca",
  "homem-em-busca",
  "alquimista",
  "arte-amar",
  "sair-depressao",
  "ser-eu-mesmo",
  "4-acordos",
  "despertar",
  "despertar-gigante",
  "encarar-realidade",
  "ser-verdadeiro",
  "inteligencia-emocional",
  "clube-5am",
  "tao-te-ching",
  "12-regras",
  "monge-ferrari",
  "pensar-devagar",
  "habitos-atomicos",
  "coragem-imperfeicao",
  "conversa-feliz",
  "arte-comunicar",
  "idiomas-amor",
  "amor-tempos-colera",
  "leveza-ser",
  "filosofia-mente",
  "arte-reflexao",
  "virtude-coragem",
  "mundo-ansiedade",
  "razao-continuar",
  "nietzsche-chorou",
  "poder-silencio",
  "peso-leveza",
  "caminhos-paz",
  "ikigai",
  "presenca",
  "a-arte-da-guerra",
  "o-principe",
  "inteligencia-espiritual"
]

const Library = (() => {
  let _books = []
  let _loaded = false;
  let _currentCategory = 'Todos';
  let _searchQuery = '';

  async function loadAll() {
    if (_loaded) return _books;
    const results = await Promise.all(
      BOOK_IDS.map(id =>
        fetch('./book-' + id + '.json')
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    );
    _books = results.filter(Boolean);
    _loaded = true;
    return _books;
  }

  function loadBook(id) {
    const book = _books.find(b => b.id === id);
    if (!book) throw new Error('Book not found: ' + id);
    return book;
  }

  async function render() {
    const container = document.getElementById('library-screen');

    // Show loading state
    container.innerHTML =
      '<div class="screen-title" style="margin-bottom:4px;">Biblioteca</div>' +
      '<div class="screen-subtitle" style="margin-bottom:20px;">A carregar...</div>';

    const books = await loadAll();

    container.innerHTML =
      '<div class="screen-title" style="margin-bottom:4px;">Biblioteca</div>' +
      '<div class="screen-subtitle" style="margin-bottom:16px;">' + books.length + ' livros disponíveis</div>' +
      '<div class="search-bar" style="margin-bottom:12px;">' +
        '<span class="search-icon">⌕</span>' +
        '<input type="text" id="lib-search" placeholder="Pesquisar livros..." autocomplete="off">' +
      '</div>' +
      '<div class="category-pills" id="cat-pills" style="margin-bottom:16px;"></div>' +
      '<div class="book-grid" id="book-grid"></div>';

    renderCategoryPills(books);
    renderBooks(books);

    const searchEl = document.getElementById('lib-search');
    if (searchEl) {
      searchEl.value = _searchQuery;
      searchEl.addEventListener('input', function(e) {
        _searchQuery = e.target.value.toLowerCase();
        renderBooks(books);
      });
    }
  }

  function renderCategoryPills(books) {
    const cats = ['Todos'].concat(
      books.map(b => b.category)
        .filter((v, i, a) => a.indexOf(v) === i)
    );
    const el = document.getElementById('cat-pills');
    if (!el) return;

    el.innerHTML = cats.map(function(c) {
      return '<button class="pill' + (c === _currentCategory ? ' active' : '') +
        '" data-cat="' + c + '">' + c + '</button>';
    }).join('');

    el.querySelectorAll('.pill').forEach(function(btn) {
      btn.addEventListener('click', function() {
        _currentCategory = btn.dataset.cat;
        el.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        renderBooks(books);
      });
    });
  }

  function renderBooks(books) {
    const grid = document.getElementById('book-grid');
    if (!grid) return;

    let filtered = books.slice();
    if (_currentCategory !== 'Todos') {
      filtered = filtered.filter(function(b) { return b.category === _currentCategory; });
    }
    if (_searchQuery) {
      filtered = filtered.filter(function(b) {
        return (b.title + b.author + b.category).toLowerCase().indexOf(_searchQuery) !== -1;
      });
    }

    const progress = DB.getAllProgress();

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">📚</div>Nenhum livro encontrado.</div>';
      return;
    }

    var html = '';
    filtered.forEach(function(b) {
      var p = progress[b.id] || {};
      var pct = p.percent || 0;
      html +=
        '<div class="book-card" data-id="' + b.id + '">' +
          '<div class="book-cover" style="background:' + (b.cover_color || '#1a1a2e') + ';">' +
            '<div class="book-cover-letter" style="color:' + (b.accent || '#c9a96e') + ';">' + b.title[0] + '</div>' +
          '</div>' +
          '<div class="book-info">' +
            '<div class="category-badge">' + b.category + '</div>' +
            '<div class="book-title">' + b.title + '</div>' +
            '<div class="book-author">' + b.author + '</div>' +
            '<div style="font-size:0.67rem;color:var(--text-muted);margin-bottom:6px;font-style:italic;line-height:1.4;">' + (b.summary || '') + '</div>' +
            '<div class="book-progress-bar"><div class="book-progress-fill" style="width:' + pct + '%"></div></div>' +
            '<div style="font-size:0.65rem;color:var(--text-muted);margin-top:4px;">' + (pct > 0 ? Math.round(pct) + '% lido' : 'Não iniciado') + '</div>' +
          '</div>' +
        '</div>';
    });
    grid.innerHTML = html;

    grid.querySelectorAll('.book-card').forEach(function(card) {
      card.addEventListener('click', function() {
        window.Reader.open(card.dataset.id);
      });
    });
  }

  return { render, loadBook, loadAll };
})();

window.Library = Library;
