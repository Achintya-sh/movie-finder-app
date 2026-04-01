// MOVIE FINDER - MAIN APPLICATION

// DOM Elements
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const loadingIndicator = document.getElementById('loading');
const typeFilter = document.getElementById('typeFilter');
const yearFilter = document.getElementById('yearFilter');
const themeToggle = document.getElementById('themeToggle');
const navbar = document.querySelector('.navbar');
const resultsHeader = document.getElementById('resultsHeader');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const popularSection = document.getElementById('popularSection');

// State
let allMovies = [];
let currentSort = null;

// INITIALIZE APP

window.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    setupEventListeners();
    loadPopularMovies();
});

// EVENT LISTENERS

function setupEventListeners() {
    // Search input with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(e.target.value), 500);
    });

    // Filters
    typeFilter.addEventListener('change', updateDisplay);
    yearFilter.addEventListener('input', updateDisplay);

    // Sort buttons
    document.getElementById('sortAZ').addEventListener('click', () => handleSort('az'));
    document.getElementById('sortZA').addEventListener('click', () => handleSort('za'));
    document.getElementById('sortYearNew').addEventListener('click', () => handleSort('year-new'));
    document.getElementById('sortYearOld').addEventListener('click', () => handleSort('year-old'));

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

// SEARCH FUNCTIONALITY

async function handleSearch(searchTerm) {
    searchTerm = searchTerm.trim();

    // If search is empty, show popular movies
    if (searchTerm.length === 0) {
        allMovies = [];
        resultsContainer.innerHTML = '';
        resultsHeader.classList.add('hidden');
        noResults.classList.add('hidden');
        popularSection.classList.remove('hidden');
        return;
    }

    // Search requires at least 3 characters
    if (searchTerm.length < 3) {
        return;
    }

    // Hide popular section
    popularSection.classList.add('hidden');

    // Show loading
    showLoading();

    try {
        // Fetch movies from API
        allMovies = await searchMovies(searchTerm);

        // Hide loading
        hideLoading();

        // Update display
        updateDisplay();
    } catch (error) {
        console.error('Search error:', error);
        hideLoading();
        showNoResults();
    }
}

// DISPLAY FUNCTIONS

function updateDisplay() {
    let filteredMovies = [...allMovies];

    // Apply filters
    const filters = {
        type: typeFilter.value,
        year: yearFilter.value
    };

    filteredMovies = applyFilters(filteredMovies, filters);

    // Apply sorting if active
    if (currentSort) {
        filteredMovies = applySorting(filteredMovies, currentSort);
    }

    // Display results
    displayMovies(filteredMovies);
}

function displayMovies(movies) {
    resultsContainer.innerHTML = '';

    if (movies.length === 0) {
        showNoResults();
        return;
    }

    // Show results header
    resultsHeader.classList.remove('hidden');
    noResults.classList.add('hidden');
    resultsCount.textContent = `${movies.length} result${movies.length !== 1 ? 's' : ''} found`;

    // Create movie cards using map() HOF
    const movieCards = movies.map(movie => createMovieCard(movie));
    movieCards.forEach(card => resultsContainer.appendChild(card));

    // Add stagger animation
    animateCards();
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const isFavorite = checkIfFavorite(movie.imdbID);
    const posterUrl = movie.Poster !== 'N/A' 
        ? movie.Poster 
        : 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';

    card.innerHTML = `
        <img 
            src="${posterUrl}" 
            alt="${movie.Title}"
            class="movie-poster"
            loading="lazy"
        >
        <div class="movie-info">
            <h3 class="movie-title">${movie.Title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${movie.Year}</span>
                <span class="movie-type">${movie.Type}</span>
            </div>
            <div class="movie-actions">
                <button 
                    class="btn-favorite ${isFavorite ? 'active' : ''}"
                    onclick="toggleFavorite('${movie.imdbID}', '${escapeHtml(movie.Title)}')"
                >
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
                <button 
                    class="btn-details"
                    onclick="showMovieDetails('${movie.imdbID}')"
                >
                    Details
                </button>
            </div>
        </div>
    `;

    return card;
}

// SORTING FUNCTIONS

function handleSort(sortType) {
    currentSort = sortType;
    
    // Update active state on buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const btnMap = {
        'az': 'sortAZ',
        'za': 'sortZA',
        'year-new': 'sortYearNew',
        'year-old': 'sortYearOld'
    };
    
    document.getElementById(btnMap[sortType])?.classList.add('active');
    
    updateDisplay();
}

function applySorting(movies, sortType) {
    switch(sortType) {
        case 'az':
            return sortAZ(movies);
        case 'za':
            return sortZA(movies);
        case 'year-new':
            return sortByYearNew(movies);
        case 'year-old':
            return sortByYearOld(movies);
        default:
            return movies;
    }
}

// FAVORITES FUNCTIONALITY

function toggleFavorite(imdbID, title) {
    let favorites = getFavorites();
    
    const index = favorites.findIndex(fav => fav.imdbID === imdbID);
    
    if (index > -1) {
        // Remove from favorites using filter() HOF
        favorites = favorites.filter(fav => fav.imdbID !== imdbID);
    } else {
        // Add to favorites
        favorites.push({ imdbID, title });
    }
    
    saveFavorites(favorites);
    updateDisplay(); // Refresh display to update button states
}

function checkIfFavorite(imdbID) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.imdbID === imdbID); // Using some() HOF
}

function getFavorites() {
    const favoritesJson = localStorage.getItem('movieFavorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
}

// MOVIE DETAILS

async function showMovieDetails(imdbID) {
    // This is a placeholder 
    alert(`Fetching details for movie ID: ${imdbID}\n\nYou can expand this to show a beautiful modal with full movie information!`);
    
    // Example of how to fetch details:
    // const details = await getMovieDetails(imdbID);c
    // displayDetailsModal(details);
}

// POPULAR MOVIES (Default View)

async function loadPopularMovies() {
    const popularSearches = ['Avengers', 'Batman', 'Star Wars'];
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];
    
    try {
        const movies = await searchMovies(randomSearch);
        displayPopularMovies(movies.slice(0, 8)); // Show first 8 results
    } catch (error) {
        console.error('Error loading popular movies:', error);
    }
}

function displayPopularMovies(movies) {
    const popularContainer = document.getElementById('popularMovies');
    popularContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        popularContainer.appendChild(card);
    });
}

// THEME TOGGLE

function toggleTheme() {
    const body = document.body;
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        localStorage.setItem('theme', 'light');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        localStorage.setItem('theme', 'dark');
    }
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// NAVBAR SCROLL EFFECT

function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// LOADING STATES

function showLoading() {
    loadingIndicator.classList.remove('hidden');
    resultsHeader.classList.add('hidden');
    resultsContainer.innerHTML = '';
    noResults.classList.add('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showNoResults() {
    resultsHeader.classList.add('hidden');
    resultsContainer.innerHTML = '';
    noResults.classList.remove('hidden');
}

// ANIMATIONS

function animateCards() {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50); // Stagger animation
    });
}

// UTILITY FUNCTIONS

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ERROR HANDLING

window.addEventListener('error', (e) => {
    console.error('Application error:', e);
});

// Prevent errors from breaking the app
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e);
});
