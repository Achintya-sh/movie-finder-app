// UTILITY FUNCTIONS - ARRAY HOFs

function filterByType(movies, type) {
    if (type === 'all' || !type) {
        return movies;
    }
    
    // Using Array.filter() HOF - NO loops!
    return movies.filter(movie => movie.Type.toLowerCase() === type.toLowerCase());
}

function filterByYear(movies, year) {
    if (!year) {
        return movies;
    }
    
    // Using Array.filter() HOF - NO loops!
    return movies.filter(movie => {
        // Handle year ranges like "2010-2015"
        if (movie.Year.includes('–') || movie.Year.includes('-')) {
            const years = movie.Year.split(/[–-]/);
            const startYear = parseInt(years[0]);
            const endYear = parseInt(years[1]);
            return parseInt(year) >= startYear && parseInt(year) <= endYear;
        }
        return movie.Year === String(year);
    });
}

function applyFilters(movies, filters) {
    let filtered = movies;
    
    // Chain filters using HOFs - NO loops!
    if (filters.type) {
        filtered = filterByType(filtered, filters.type);
    }
    
    if (filters.year) {
        filtered = filterByYear(filtered, filters.year);
    }
    
    return filtered;
}

function sortAZ(movies) {
    // Create a copy to avoid mutating original array
    // Using Array.sort() HOF - NO loops!
    return [...movies].sort((a, b) => {
        return a.Title.localeCompare(b.Title);
    });
}

function sortZA(movies) {
    // Using Array.sort() HOF - NO loops!
    return [...movies].sort((a, b) => {
        return b.Title.localeCompare(a.Title);
    });
}

function sortByYearNew(movies) {
    // Using Array.sort() HOF - NO loops!
    return [...movies].sort((a, b) => {
        const yearA = extractYear(a.Year);
        const yearB = extractYear(b.Year);
        return yearB - yearA; // Descending order
    });
}

function sortByYearOld(movies) {
    // Using Array.sort() HOF - NO loops!
    return [...movies].sort((a, b) => {
        const yearA = extractYear(a.Year);
        const yearB = extractYear(b.Year);
        return yearA - yearB; // Ascending order
    });
}

function extractYear(yearString) {
    // Handle year ranges by taking the first year
    if (yearString.includes('–') || yearString.includes('-')) {
        return parseInt(yearString.split(/[–-]/)[0]);
    }
    return parseInt(yearString) || 0;
}

function searchInMovies(movies, searchTerm) {
    if (!searchTerm) {
        return movies;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Using Array.filter() HOF - NO loops!
    return movies.filter(movie => {
        return movie.Title.toLowerCase().includes(term);
    });
}

function getUniqueTypes(movies) {
    // Using Array.map() HOF to extract types
    const types = movies.map(movie => movie.Type);
    // Using Set to get unique values, then spread back to array
    return [...new Set(types)];
}

function getUniqueYears(movies) {
    // Using Array.map() HOF to extract years
    const years = movies.map(movie => extractYear(movie.Year));
    // Using Set to get unique values, then spread and sort
    return [...new Set(years)].sort((a, b) => b - a);
}

function countByType(movies) {
    // Using Array.reduce() HOF - NO loops!
    return movies.reduce((counts, movie) => {
        const type = movie.Type;
        counts[type] = (counts[type] || 0) + 1;
        return counts;
    }, {});
}

function filterByYearRange(movies, startYear, endYear) {
    // Using Array.filter() HOF - NO loops!
    return movies.filter(movie => {
        const year = extractYear(movie.Year);
        return year >= startYear && year <= endYear;
    });
}


function limitResults(movies, limit) {
    return movies.slice(0, limit);
}

function matchesCriteria(movie, criteria) {
    // Using Array.every() HOF with Object.entries()
    return Object.entries(criteria).every(([key, value]) => {
        if (!value) return true; // Skip empty criteria
        return movie[key] === value;
    });
}