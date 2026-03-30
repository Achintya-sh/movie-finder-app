// API INTEGRATION - OMDb API

async function searchMovies(searchTerm) {
    try {
        const url = `${BASE_URL}?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.Response === "True") {
            return data.Search || [];
        } else {
            console.warn('API returned no results:', data.Error);
            return [];
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

async function getMovieDetails(imdbID) {
    try {
        const url = `${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.Response === "True") {
            return data;
        } else {
            console.warn('API returned no details:', data.Error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
}


async function searchMoviesWithFilters(searchTerm, type = '', year = '') {
    try {
        let url = `${BASE_URL}?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;
        
        if (type && type !== 'all') {
            url += `&type=${type}`;
        }
        
        if (year) {
            url += `&y=${year}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.Response === "True") {
            return data.Search || [];
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching filtered movies:', error);
        throw error;
    }
}