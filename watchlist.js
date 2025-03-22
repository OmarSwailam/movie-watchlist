const BASE_URL = "http://www.omdbapi.com/?apikey=bebe1033"


document.addEventListener("DOMContentLoaded", async () => {
    const movieIds = JSON.parse(localStorage.getItem("movies")) || []
    const main = document.querySelector("main")

    if (movieIds) {
        main.innerHTML = await renderMovies(movieIds)
        const watchlistBtns = document.querySelectorAll("#watchlist-btn")
        watchlistBtns.forEach(btn => btn.addEventListener("click", removeFromWatchlist))
    }

    async function renderMovies(movieIds) {
        const movieHtmlArray = await Promise.all(movieIds.map(async (id) => {
            const movieDetailsResponse = await fetch(`${BASE_URL}&i=${id}`);
            const movieDetails = await movieDetailsResponse.json();

            return `
                <div class="movie">
                    <img class="movie-poster" src="${movieDetails.Poster}" alt="movie poster">
                    <div class="movie-text-container"> 
                        <h2 class="movie-title">
                            ${movieDetails.Title}
                            <span class="rating">
                                <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
                                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.172L12 18.897l-7.336 3.867 
                                            1.402-8.172L.132 9.21l8.2-1.192z"/>
                                </svg>
                                ${movieDetails.imdbRating}
                            </span> 
                        </h2>
                        <div class="movie-info">
                            <p class="runtime">${movieDetails.Runtime}</p>
                            <p class="genre">${movieDetails.Genre}</p>
                            <button id="watchlist-btn" class="watchlist-btn" data-id="${id}">
                                <svg class="remove-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                                <path d="M200-440v-80h560v80H200Z"/></svg> Watchlist
                            </button>
                        </div>
                        <p class="plot">${movieDetails.Plot}</p>
                    </div>
                </div>
            `
        }));

        return movieHtmlArray.join(" ");
    }

    function removeFromWatchlist(e) {
        const movieId = e.target.closest('button').dataset.id;
        const updatedWatchlist = movieIds.filter(id => id !== movieId);
        localStorage.setItem("movies", JSON.stringify(updatedWatchlist));
        location.reload();
    }

})