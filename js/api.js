// API INTEGRATION - OMDb API

async function searchMoviesPage(searchTerm, page = 1, type = '', year = '') {
    try {
        let url = `${BASE_URL}?s=${encodeURIComponent(searchTerm)}&page=${page}&apikey=${API_KEY}`;
        if (type && type !== 'all') url += `&type=${type}`;
        if (year) url += `&y=${year}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.Response === 'True') {
            return { movies: data.Search || [], total: parseInt(data.totalResults) || 0 };
        } else {
            return { movies: [], total: 0 };
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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.Response === 'True' ? data : null;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
}
