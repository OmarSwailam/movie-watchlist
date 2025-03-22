const BASE_URL = "http://www.omdbapi.com/?apikey=bebe1033"

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form")
    const main = document.querySelector("main")

    async function renderMovies(movies) {
        const movieHtmlArray = await Promise.all(movies.map(async (movie) => {
            const movieDetailsResponse = await fetch(`${BASE_URL}&i=${movie.imdbID}`);
            const movieDetails = await movieDetailsResponse.json();
            console.log(movieDetails);
            return `
                <div class="movie">
                    <img class="movie-poster" src="${movie.Poster}" alt="movie poster">
                    <div class="movie-text-container"> 
                        <h2 class="movie-title">
                            ${movie.Title}
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
                            <button class="watchlist-btn" data-movie="${movie.imdbID}">
                                <svg class="plus-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                                    <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                                </svg> Watchlist
                            </button>
                        </div>
                        <p class="plot">${movieDetails.Plot}</p>
                    </div>
                </div>
            `
        }));

        return movieHtmlArray.join(" ");
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(form);
        const movieTitle = formData.get("title");
        if (movieTitle) {
            const response = await fetch(`${BASE_URL}&s=${movieTitle}`);
            const data = await response.json()
            const movies = data.Search
            if (movies) {
                main.innerHTML = await renderMovies(movies.slice(0, 5))
            } else {
                main.innerHTML = `
                    <p class="error-text">Unable to find what you’re looking for. Please try another search.</p>
                `
            }
        }


    }

    form.addEventListener("submit", handleSubmit)
})