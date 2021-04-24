window.onload = function(e) { 
    const movies = document.getElementById("movies")
    const addArea = document.getElementById("addArea")
    const addForm = document.getElementById("addForm")
    const searchMovies = document.getElementById("searchMovies")

    const storedMovies = localStorage.getItem("movies")

    if(storedMovies != null) {
        const storedMoviesJSON = JSON.parse(storedMovies)
        const resultsArray = []
        for(const key in storedMoviesJSON) {
            resultsArray.push({id: key, title: storedMoviesJSON[key].title, poster_path: storedMoviesJSON[key].poster_path, rating: storedMoviesJSON[key].rating, review: storedMoviesJSON[key].review})
        }
        resultsArray.reverse()
        resultsArray.forEach((m) => {
            if(m.poster_path != null && m.title != null) {
                let rating = ""
                if(m.rating.split(" ").join("").length != 0) {
                    rating = `Rating given: ${m.rating}/10` 
                } else {
                    rating = "unrated"
                }
                movies.innerHTML += `<div class="movie-card"><img src="https://image.tmdb.org/t/p/w300${m.poster_path}" /><h1>${m.title}</h1><p class="rating">${rating}</p><p class="review">${m.review}</p><button onclick="deleteMovie('${m.id}');">Delete</button></div>` 
            }
        })
    }

    document.addEventListener("click", function (e) {
        if(e.target.id == "addMovieButton") {
            movies.style.display = "none"
            addArea.style.display = "block"
            document.title += " | Add Movie"
        }
    })

    addForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const messageInput = document.getElementById("searchBar").value
        if(messageInput.split(" ").join("").length != 0) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };
              
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=c467ddab940734b55111748d4ef3b4da&query=${messageInput}&page=1`, requestOptions)
                .then(async (result) => {
                    const response = await result.json() 
                    const results = response.results
                    searchMovies.innerHTML = ""
                    results.forEach((m) => {
                        if(m.poster_path != null && m.title != null) {
                            searchMovies.innerHTML += `<div class="movie-card"><img src="https://image.tmdb.org/t/p/w300${m.poster_path}" /><h1>${m.title}</h1><button onclick="addMovie('${m.id}','${m.title}', '${m.poster_path}');">Add</button></div>` 
                        }
                    })
                })
                .catch(error => console.log('error', error));
        }
    })

};

function addMovie(id, title, poster_path) {
    const storedMovies = localStorage.getItem("movies")
    if(storedMovies == null) {
        const intialJSON = {}
        let rating = prompt("Rate out of 10")
        let review = prompt("Review")
        intialJSON[1] = {title, poster_path, rating, review}
        localStorage.setItem("movies", JSON.stringify(intialJSON))
        window.location.reload()
    } else {
        const storedMoviesJSON = JSON.parse(storedMovies)
        giveAlert = false
        for(const key in storedMoviesJSON) {
            if(key == id) {
                giveAlert = true
            }
        }
        if(giveAlert) {
            alert("You have already logged this movie")
        } else {
            let rating = prompt("Rate out of 10")
            if(rating == null) {
               rating = "unrated" 
            }
            let review = prompt("Review")
            if(review == null) {
                review = ""
            }
            var biggestIndexKey = 1
            Object.keys(storedMoviesJSON).forEach(key => {
                if(Number(key) > biggestIndexKey) {
                    biggestIndexKey = key
                }
            })
            storedMoviesJSON[Number(biggestIndexKey)+1] = {title, poster_path, rating, review}
            localStorage.setItem("movies", JSON.stringify(storedMoviesJSON))
            window.location.reload()
        }
    } 
};

function deleteMovie(id) {
    const storedMovies = localStorage.getItem("movies")
    const storedMoviesJSON = JSON.parse(storedMovies)
    for(const key in storedMoviesJSON) {
        if(key == id) {
            delete storedMoviesJSON[key]
            localStorage.setItem("movies", JSON.stringify(storedMoviesJSON))
            window.location.reload()
        }
    }
}
