const API_KEY = '21c755ee'; // my OMDB API key, not using Node to access it
let currentPage = 1;

async function fetchMovies(page = 1) {
    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&page=${page}&s=movie&r=json`
        );
        const data = await response.json();
        if (data.ok) {
            console.log("Fetch Succesfull")

        }
        console.log(data)
        console.log("Fetch Succesfull")
        displayMovies(data.Search);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

async function fetchMovieDetails(imdbID) {
    try {
        console.log(imdbID)
        let response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
        console.log(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
        response = await response.json();
        console.log(response)

        return response;
    } catch (error) {
        console.error("Error fetching details:", error);
        return null;
    }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById('movieList'); // Anchor element locating insert place
    movieGrid.innerHTML = '';
    if (movies) {
        movies.forEach(async movie => {     //fetching each using this
            const details = await fetchMovieDetails(movie.imdbID);
            const movieCard = document.createElement('div');
            movieCard.className = 'col-lg-3 col-md-4 col-sm-6 mb-3';
            movieCard.innerHTML = `
            <div class="card h-100">  
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <span class="badge rating-star">🌟 ${details.Ratings[0].Value || 'N/A'}</span> 
                </div>
                <!--<div id="PopupBox" style="display: none; position: absolute; background-color: white; border: 1px solid #ccc; padding: 10px; z-index: 1000;"></div>-->

            </div>
        `;
            movieGrid.appendChild(movieCard);
            
            //Event listner for hover.. and now, the listeners and data passed to them are part of the component
            movieCard.addEventListener('mouseenter', () => {
                showPopupBox(movie, details, movieCard);
            });

            movieCard.addEventListener('mouseleave', () => {
                hidePopupBox();
            });
        });

    }
    else {
        const movieCard = document.createElement('div mb-3');
        movieCard.innerHTML = `<p>Please Wait</p>`
        movieGrid.appendChild(movieCard);
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


function showPopupBox(movie, details, card) {
    const PopupBox = document.getElementById('PopupBox');
    if (!details) {
        PopupBox.innerHTML = `<p>Loading details...</p>`; // Show loading message
        PopupBox.style.display = 'block';
        return;
    }

    PopupBox.innerHTML = `
        <p>Year: ${movie.Year}</p>
        <p>Genre: ${details.Genre}</p>
        <p>Plot: ${details.Plot}</p>
        <p>Actors: ${details.Actors}</p>
        <p>Director: ${details.Director}</p>
        <p>Runtime: ${details.Runtime}</p>
        <p>Rated: ${details.Rated}
        `;
    const curr_card = card.getBoundingClientRect();
    PopupBox.style.top = (curr_card.top + window.scrollY) + 'px';
    const spaceRight = window.innerWidth - curr_card.right;
    console.log(spaceRight)
    if (spaceRight < 250) {
        PopupBox.style.left = (curr_card.left + window.scrollX - 260) + 'px';
    } else {
        PopupBox.style.left = (curr_card.right + window.scrollX + 10) + 'px';
    }
    PopupBox.style.display = 'block';
    $("#PopupBox").fadeIn(1500);

}

function hidePopupBox() {
    const PopupBox = document.getElementById('PopupBox');
    PopupBox.style.display = 'none';
}


// Initial first load
fetchMovies(currentPage);