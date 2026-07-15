const app = document.querySelector('#app');
const productions = window.PRODUCTIONS;

const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const getLibrary = () => JSON.parse(localStorage.getItem('starscreen-library') || '{}');
const saveLibrary = data => localStorage.setItem('starscreen-library', JSON.stringify(data));
const getMyReviews = () => JSON.parse(localStorage.getItem('starscreen-reviews') || '{}');
const saveMyReviews = data => localStorage.setItem('starscreen-reviews', JSON.stringify(data));

function card(p) {
  return `<a class="card" href="#/produkcja/${p.id}">
    <img class="cover" src="${p.cover}" alt="Okładka: ${escapeHtml(p.title)}">
    <div class="card-body">
      <h3>${escapeHtml(p.title)}</h3>
      <div class="meta">${escapeHtml(p.director)} · ${p.type}<br>${p.episodes.length} ${p.type === 'Film' ? 'część' : 'odc.'}</div>
      <div><span class="badge">${p.status}</span> <span class="rating">★ ${p.rating}</span></div>
    </div>
  </a>`;
}

function home() {
  const newest = [...productions].sort((a,b) => b.added.localeCompare(a.added));
  app.innerHTML = `<section class="hero">
    <h1>Filmy i seriale Filmowców MSP</h1>
    <a class="button" href="#/produkcje">Przeglądaj</a>
  </section>
  <div class="section-head"><h2>Nowości</h2><a href="#/produkcje">Zobacz wszystkie →</a></div>
  <div class="grid">${newest.map(card).join('')}</div>`;
}

function catalog() {
  app.innerHTML = `<div class="section-head"><div><h1>Wszystkie produkcje</h1><div class="meta">Filmy i seriale twórców MSP</div></div></div>
  <div class="toolbar">
    <input id="search" type="search" placeholder="Szukaj po tytule lub reżyserze">
    <select id="genre"><option value="">Wszystkie gatunki</option>${[...new Set(productions.flatMap(p => p.genres))].sort().map(g => `<option>${g}</option>`).join('')}</select>
    <select id="status"><option value="">Wszystkie statusy</option>${[...new Set(productions.map(p => p.status))].map(s => `<option>${s}</option>`).join('')}</select>
  </div>
  <div id="catalog-grid" class="grid"></div>`;

  const render = () => {
    const query = document.querySelector('#search').value.trim().toLowerCase();
    const genre = document.querySelector('#genre').value;
    const status = document.querySelector('#status').value;
    const filtered = productions.filter(p =>
      (!query || `${p.title} ${p.director}`.toLowerCase().includes(query)) &&
      (!genre || p.genres.includes(genre)) &&
      (!status || p.status === status)
    );
    document.querySelector('#catalog-grid').innerHTML = filtered.length ? filtered.map(card).join('') : '<div class="empty">Brak pasujących produkcji.</div>';
  };
  document.querySelectorAll('#search, #genre, #status').forEach(el => el.addEventListener('input', render));
  render();
}

function productionPage(id) {
  const p = productions.find(x => x.id === id);
  if (!p) return notFound();
  const library = getLibrary();
  const currentStatus = library[id] || '';
  const myReviews = getMyReviews();
  const reviews = [...(window.REVIEWS[id] || [])];
  if (myReviews[id]) reviews.unshift({ user: 'Ty', ...myReviews[id] });
  const related = p.related.map(r => productions.find(x => x.id === r)).filter(Boolean);

  app.innerHTML = `<div class="detail">
    <img class="detail-cover" src="${p.cover}" alt="Okładka: ${escapeHtml(p.title)}">
    <div>
      <h1>${escapeHtml(p.title)}</h1>
      <p>${escapeHtml(p.description)}</p>
      <div>${p.genres.map(g => `<span class="badge">${g}</span>`).join('')} <span class="badge">${p.status}</span></div>
      <p class="meta">Reżyser: <a href="#/rezyser/${p.directorSlug}"><strong>${escapeHtml(p.director)}</strong></a> · ${p.type} · ${p.episodes.length} ${p.type === 'Film' ? 'część' : 'odcinków'}</p>
      <div class="stats">
        <div class="stat"><strong class="rating">★ ${p.rating}</strong><br><span class="meta">${p.ratingsCount} ocen</span></div>
        <div class="stat"><strong>${p.watchedCount}</strong><br><span class="meta">obejrzało</span></div>
      </div>
      <div class="panel">
        <label for="user-status"><strong>Twój status</strong></label>
        <select id="user-status">
          <option value="">Nie ustawiono</option>
          <option value="watched" ${currentStatus === 'watched' ? 'selected' : ''}>Obejrzane</option>
          <option value="watching" ${currentStatus === 'watching' ? 'selected' : ''}>W trakcie</option>
          <option value="planned" ${currentStatus === 'planned' ? 'selected' : ''}>Planuję</option>
          <option value="dropped" ${currentStatus === 'dropped' ? 'selected' : ''}>Porzucone</option>
        </select>
      </div>
    </div>
  </div>
  <section class="panel"><h2>Odcinki</h2><ol class="episodes">${p.episodes.map((e,i) => `<li><strong>${i+1}.</strong> ${escapeHtml(e)}</li>`).join('')}</ol></section>
  <section class="panel"><h2>Dodaj ocenę i recenzję</h2>
    <form id="review-form">
      <label>Ocena 1–10<input id="score" type="number" min="1" max="10" required value="${myReviews[id]?.score || ''}"></label><br>
      <label>Recenzja<textarea id="review-text" required>${escapeHtml(myReviews[id]?.text || '')}</textarea></label><br>
      <button type="submit">Zapisz recenzję</button>
    </form>
  </section>
  <section class="panel"><h2>Recenzje użytkowników</h2>${reviews.length ? reviews.map(r => `<article class="review"><strong>${escapeHtml(r.user)} · ★ ${r.score}</strong><p>${escapeHtml(r.text)}</p></article>`).join('') : '<div class="empty">Brak recenzji.</div>'}</section>
  ${related.length ? `<div class="section-head"><h2>Powiązane produkcje</h2></div><div class="grid">${related.map(card).join('')}</div>` : ''}`;

  document.querySelector('#user-status').addEventListener('change', e => {
    const next = getLibrary();
    if (e.target.value) next[id] = e.target.value; else delete next[id];
    saveLibrary(next);
  });
  document.querySelector('#review-form').addEventListener('submit', e => {
    e.preventDefault();
    const next = getMyReviews();
    next[id] = { score: Number(document.querySelector('#score').value), text: document.querySelector('#review-text').value.trim() };
    saveMyReviews(next);
    productionPage(id);
  });
}

function directorPage(slug) {
  const list = productions.filter(p => p.directorSlug === slug);
  if (!list.length) return notFound();
  app.innerHTML = `<h1>${escapeHtml(list[0].director)}</h1><p class="meta">Reżyser · ${list.length} produkcji</p><div class="grid">${list.map(card).join('')}</div>`;
}

function profilePage() {
  const library = getLibrary();
  const groups = [
    ['watching','W trakcie'], ['watched','Obejrzane'], ['planned','Planuję'], ['dropped','Porzucone']
  ];
  app.innerHTML = `<h1>Profil użytkownika</h1><p class="meta">Wersja demonstracyjna — dane są zapisane tylko w tej przeglądarce.</p>
  ${groups.map(([key,label]) => {
    const list = productions.filter(p => library[p.id] === key);
    return `<section><div class="section-head"><h2>${label}</h2><span class="meta">${list.length}</span></div>${list.length ? `<div class="profile-list">${list.map(card).join('')}</div>` : '<div class="empty">Tutaj jeszcze nic nie ma.</div>'}</section>`;
  }).join('')}`;
}

function notFound() { app.innerHTML = '<div class="empty"><h1>Nie znaleziono strony</h1><a class="button" href="#/">Wróć na stronę główną</a></div>'; }

function router() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!parts.length) return home();
  if (parts[0] === 'produkcje') return catalog();
  if (parts[0] === 'produkcja' && parts[1]) return productionPage(parts[1]);
  if (parts[0] === 'rezyser' && parts[1]) return directorPage(parts[1]);
  if (parts[0] === 'profil') return profilePage();
  notFound();
}
window.addEventListener('hashchange', router);
router();
