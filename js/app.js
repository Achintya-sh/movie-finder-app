// MOVIE FINDER - MAIN APPLICATION

const searchInput   = document.getElementById('searchInput');
const searchBtn     = document.getElementById('searchBtn');
const typeFilter    = document.getElementById('typeFilter');
const yearFilter    = document.getElementById('yearFilter');
const genreFilter   = document.getElementById('genreFilter');
const ratingFilter  = document.getElementById('ratingFilter');
const orderBy       = document.getElementById('orderBy');
const loadingEl     = document.getElementById('loading');
const movieGrid     = document.getElementById('movieGrid');
const noResults     = document.getElementById('noResults');
const paginationTop = document.getElementById('paginationTop');
const paginationBot = document.getElementById('paginationBottom');
const navbar        = document.querySelector('.navbar');

// State
let currentPage   = 1;
let totalResults  = 0;
const PER_PAGE    = 10; // OMDb returns exactly 10 per page

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    fetchAndRender();
});

// ===== EVENTS =====
function setupEventListeners() {
    let debounce;
    const triggerSearch = () => { currentPage = 1; fetchAndRender(); };

    searchInput.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(triggerSearch, 600);
    });
    searchBtn.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') triggerSearch(); });

    // API-level filters — re-fetch
    typeFilter.addEventListener('change', triggerSearch);
    yearFilter.addEventListener('input',  () => { clearTimeout(debounce); debounce = setTimeout(triggerSearch, 600); });

    // Client-side filters — re-render current results
    if (genreFilter)  genreFilter.addEventListener('change',  () => renderCards(getFilteredMovies()));
    if (ratingFilter) ratingFilter.addEventListener('change', () => renderCards(getFilteredMovies()));
    orderBy.addEventListener('change', () => renderCards(getFilteredMovies()));

    window.addEventListener('scroll', () => {
        navbar.style.background = '#000';
    });
}

// ===== RAW RESULTS CACHE =====
let rawMovies = [];

// ===== FETCH & RENDER =====
async function fetchAndRender() {
    const term = searchInput.value.trim() || 'movie';
    const type = typeFilter.value !== 'all' ? typeFilter.value : '';
    const year = yearFilter.value || '';

    showLoading();

    try {
        const { movies, total } = await searchMoviesPage(term, currentPage, type, year);
        totalResults = total;
        rawMovies    = movies;

        hideLoading();

        if (movies.length === 0) {
            renderPagination(0);
            showNoResults();
            return;
        }

        renderCards(getFilteredMovies());
        renderPagination(Math.ceil(total / PER_PAGE));
    } catch (e) {
        console.error(e);
        hideLoading();
        showNoResults();
    }
}

// Apply client-side genre / rating / sort on top of fetched results
function getFilteredMovies() {
    let movies = [...rawMovies];

    // Genre filter (OMDb search results don't include genre, but we try)
    const genre = genreFilter ? genreFilter.value : 'all';
    if (genre && genre !== 'all') {
        movies = movies.filter(m => m.Genre && m.Genre.toLowerCase().includes(genre.toLowerCase()));
    }

    // Rating filter
    const rating = ratingFilter ? ratingFilter.value : 'all';
    if (rating && rating !== 'all') {
        const minRating = parseFloat(rating.replace('+', ''));
        movies = movies.filter(m => {
            const r = parseFloat(m.imdbRating);
            return !isNaN(r) && r >= minRating;
        });
    }

    // Sort
    const order = orderBy.value;
    if (order === 'az')       movies.sort((a,b) => a.Title.localeCompare(b.Title));
    if (order === 'za')       movies.sort((a,b) => b.Title.localeCompare(a.Title));
    if (order === 'year-new') movies.sort((a,b) => (parseInt(b.Year)||0) - (parseInt(a.Year)||0));
    if (order === 'year-old') movies.sort((a,b) => (parseInt(a.Year)||0) - (parseInt(b.Year)||0));

    return movies;
}

// ===== RENDER CARDS =====
function renderCards(movies) {
    movieGrid.innerHTML = '';
    noResults.classList.add('hidden');

    if (movies.length === 0) { showNoResults(); return; }

    movies.forEach((m, i) => {
        const card = createCard(m);
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        movieGrid.appendChild(card);
        setTimeout(() => {
            card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
        }, i * 30);
    });
}

// ===== CARD =====
function createCard(movie) {
    const card   = document.createElement('div');
    card.className = 'yts-card';

    const fav    = checkIfFavorite(movie.imdbID);
    const poster = movie.Poster && movie.Poster !== 'N/A'
        ? movie.Poster
        : `https://via.placeholder.com/300x450/141414/333?text=${encodeURIComponent(movie.Title)}`;

    card.innerHTML = `
        <div class="yts-poster-wrap">
            <img src="${poster}" alt="${escapeHtml(movie.Title)}" class="yts-poster" loading="lazy">
            <div class="yts-quality-badge"><span class="yts-quality-tag">HD</span></div>
            <div class="yts-overlay">
                <button class="yts-overlay-btn" onclick="showMovieDetails('${movie.imdbID}')">View Details</button>
                <button class="yts-fav-overlay-btn" onclick="toggleFavorite('${movie.imdbID}', '${escapeHtml(movie.Title)}')">
                    ${fav ? '❤️ Saved' : '🤍 Save'}
                </button>
            </div>
        </div>
        <div class="yts-info">
            <div class="yts-title">${movie.Title}</div>
            <div class="yts-year">${movie.Year || '—'}</div>
        </div>
    `;
    return card;
}

// ===== PAGINATION =====
function renderPagination(totalPages) {
    [paginationTop, paginationBot].forEach(el => {
        el.innerHTML = '';
        if (totalPages <= 1) return;

        const pages = buildPageNumbers(totalPages, currentPage);
        if (currentPage > 1) el.appendChild(makePageBtn('«', currentPage - 1));
        pages.forEach(p => {
            if (p === '...') {
                const s = document.createElement('span');
                s.textContent = '...';
                s.style.cssText = 'color:#555;padding:0 6px;line-height:36px;font-size:.85rem;';
                el.appendChild(s);
            } else {
                el.appendChild(makePageBtn(p, p, p === currentPage));
            }
        });
        if (currentPage < totalPages) el.appendChild(makePageBtn('»', currentPage + 1));
    });
}

function makePageBtn(label, page, active = false) {
    const b = document.createElement('button');
    b.className = 'pg-btn' + (active ? ' active' : '');
    b.textContent = label;
    b.addEventListener('click', () => {
        currentPage = page;
        fetchAndRender();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return b;
}

function buildPageNumbers(total, current) {
    if (total <= 11) return Array.from({length: total}, (_, i) => i + 1);
    const pages = [];
    const left  = Math.max(2, current - 2);
    const right = Math.min(total - 1, current + 2);
    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push('...');
    pages.push(total);
    return pages;
}

// ===== FAVOURITES =====
function toggleFavorite(imdbID, title) {
    let favs = getFavorites();
    const idx = favs.findIndex(f => f.imdbID === imdbID);
    if (idx > -1) favs = favs.filter(f => f.imdbID !== imdbID);
    else favs.push({ imdbID, title });
    localStorage.setItem('movieFavorites', JSON.stringify(favs));
    renderCards(getFilteredMovies());
}

function checkIfFavorite(imdbID) {
    return getFavorites().some(f => f.imdbID === imdbID);
}

function getFavorites() {
    try { return JSON.parse(localStorage.getItem('movieFavorites')) || []; }
    catch { return []; }
}

// ===== DETAILS =====
async function showMovieDetails(imdbID) {
    alert(`Movie details for: ${imdbID}\n\nExpand this to show a modal with full info!`);
}

// ===== LOADING =====
function showLoading() {
    loadingEl.classList.remove('hidden');
    movieGrid.innerHTML   = '';
    noResults.classList.add('hidden');
    paginationTop.innerHTML = '';
    paginationBot.innerHTML = '';
}
function hideLoading()   { loadingEl.classList.add('hidden'); }
function showNoResults() { noResults.classList.remove('hidden'); }

// ===== UTILS =====
function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

window.addEventListener('error', e => console.error('App error:', e));
window.addEventListener('unhandledrejection', e => console.error('Unhandled:', e));
