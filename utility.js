const API_KEY = '21c755ee'; // my OMDB API key, not using Node to access it
let currentPage = 1;

async function fetchMovies(page = 1) {
    try {
        const response = await fetch(
            `https://www.omdbapi.com/?s=movie&page=${page}&type=movie&apikey=${API_KEY}`
        );
        const data = await response.json();
        if (data.ok) {
            //console.log("Fetch Succesfull")
            console.log(data)
        }
        console.log("Fetch Succesfull")
        displayMovies(data.Search);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movieList'); // Anchor element locating insert place
    movieGrid.innerHTML = '';
    if (movies) {
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'col-lg-3 col-md-4 col-sm-6 mb-3';
            movieCard.innerHTML = `
            <div class="card h-100 ">  
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <span class="badge rating-badge">⭐ ${movie.imdbRating || 'N/A'}</span>
                </div>
                <div class="card-overlay">
                    <h5>${movie.Title}</h5>
                    <p>Year: ${movie.Year}</p>
                    <p>Type: ${movie.Type}</p>
                    <p>ID: ${movie.imdbID}</p>
                </div>
            </div>
        `;
            movieGrid.appendChild(movieCard);
        });
    }
    else{
        const movieCard = document.createElement('div');
        movieCard.innerHTML = `<p>Please Wait</p>`
    }
}

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    document.getElementById('currentPage').textContent = currentPage;
    fetchMovies(currentPage);
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('currentPage').textContent = currentPage;
        fetchMovies(currentPage);
    }
});

// Initial load
fetchMovies(currentPage);