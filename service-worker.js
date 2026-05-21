const CACHE = 'sublime-v10';
const ASSETS = [
  './', './index.html', './style.css', './reader.css', './animations.css',
  './storage.js', './library.js', './reader.js', './notes.js', './dicionario.js', './app.js',
  './manifest.json', './icon-192.png', './icon-512.png',
  './book-meditacoes.json',
  './book-estoicismo.json',
  './book-estoicismo-vida.json',
  './book-assim-falou.json',
  './book-poder-agora.json',
  './book-poder-habito.json',
  './book-pequeno-principe.json',
  './book-sidarta.json',
  './book-cartas-seneca.json',
  './book-homem-em-busca.json',
  './book-alquimista.json',
  './book-arte-amar.json',
  './book-sair-depressao.json',
  './book-ser-eu-mesmo.json',
  './book-4-acordos.json',
  './book-despertar.json',
  './book-despertar-gigante.json',
  './book-encarar-realidade.json',
  './book-ser-verdadeiro.json',
  './book-inteligencia-emocional.json',
  './book-clube-5am.json',
  './book-tao-te-ching.json',
  './book-12-regras.json',
  './book-monge-ferrari.json',
  './book-pensar-devagar.json',
  './book-habitos-atomicos.json',
  './book-coragem-imperfeicao.json',
  './book-conversa-feliz.json',
  './book-arte-comunicar.json',
  './book-idiomas-amor.json',
  './book-amor-tempos-colera.json',
  './book-leveza-ser.json',
  './book-filosofia-mente.json',
  './book-arte-reflexao.json',
  './book-virtude-coragem.json',
  './book-mundo-ansiedade.json',
  './book-razao-continuar.json',
  './book-nietzsche-chorou.json',
  './book-poder-silencio.json',
  './book-peso-leveza.json',
  './book-caminhos-paz.json',
  './book-ikigai.json',
  './book-presenca.json',
  './book-a-arte-da-guerra.json',
  './book-o-principe.json',
  './book-inteligencia-espiritual.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
