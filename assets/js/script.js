// HTML Element selectors
const posterSearchEl = document.querySelectorAll(".poster-search");
const titleSearchEl = document.querySelectorAll(".movie");
const searchYearEl = document.querySelectorAll(".releaseYear");
const searchResult = document.querySelector("#searchform")
const movieInput = document.querySelector("#searchbar")
const searchResultsContainer = document.querySelector('.searchresults')
const mainContentContainer = document.querySelector('.maincontent')
const mRating = document.querySelector("#movieRating")
const mGenre = document.querySelector("#genre")
const mPlot = document.querySelector("#plot")
const mScore = document.querySelector("#ratingScore")
const mainPoster = document.querySelector('.main-poster')
const mainYear = document.querySelector('.main-year')
const mainTitle = document.querySelector('.titleofmovie')
const movieCard = document.querySelectorAll('.movieCard')
const videoEl = document.querySelector('.videos')
const clearButton = document.querySelector('.clearButton')
const backButton = document.querySelector('.backButton')
const favoriteEl = document.querySelector('.favorite')
const favoritesEl = document.querySelector('.favorites')
const favoriteBox = document.querySelector('.favbox')
console.log(favoriteBox)
// Constants
let movieTitle; //Change to user input value
let movieID;
let favorites = []
const youtubeAPI = 'AIzaSyARoCQOMM8wFTSsLyefC3mTZPCsXhr_pYg'

document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);
        console.log($target);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
});
















// YouTube Search API
function searchVideos(selectedTitle, year, videoType) {
    videoEl.replaceChildren()
    const embeded = document.createElement('iframe')
    const trailerTitle = document.createElement('h1')
    trailerTitle.classList.add("is-size-5");
    trailerTitle.classList.add("has-text-weight-bold")
    searchResultsContainer.classList.add('is-hidden')
    mainContentContainer.classList.remove('is-hidden')
    console.log(selectedTitle)

    // 
    // CHANGE WHEN USING YOUTUBE!!!!
    // 


    // const temp = document.createElement('img')
    // temp.setAttribute('src', './assets/images/default-video.png')
    // videoEl.append(temp)
    // trailerTitle.textContent = 'TITLE OF VIDEO'
    // videoEl.append(trailerTitle)


    // 
    // CHANGE WHEN USING YOUTUBE!!!!
    // 
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${selectedTitle} ${year} ${videoType}&key=${youtubeAPI}&type=video`)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            // console.log('youtube', data,title)
            embeded.setAttribute('src',`https://www.youtube.com/embed/${data.items[0].id.videoId}`)
            // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
            embeded.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
            embeded.setAttribute('allowfullscreen',true)
            trailerTitle.textContent = (data.items[0].snippet.title)
             videoEl.append(embeded)
            videoEl.append(trailerTitle)

        })
        .catch(err => {
            console.error(err);
        });
}

function goBack() {
    mainContentContainer.classList.add('is-hidden')
    searchResultsContainer.classList.remove('is-hidden')
    backButton.classList.add('is-hidden')

}

function getMovieDetails(movieId) {
    alreadyFavorited = false
    backButton.classList.remove('is-hidden')
    favorites.forEach(movie=>{
        if (movie.id === movieId){
            alreadyFavorited = true
        }
    })
    if (alreadyFavorited){
        favoriteEl.setAttribute("style", "color:yellow;");
    }else{
        favoriteEl.setAttribute("style", "color:black;");
    }
    fetch(`http://www.omdbapi.com/?apikey=6c411e7c&i=${movieId}`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            movieTitle = data.Title
            movieID = data.imdbID
            mainTitle.textContent = movieTitle
            mainTitle.classList.add('has-text-weight-bold')
            mainYear.textContent = data.Year
            if (data.Poster !== 'N/A') {
                mainPoster.setAttribute('src', data.Poster)
            } else {
                mainPoster.setAttribute('src', './assets/images/default-image.png')
            }
            mPlot.textContent = data.Plot
            mGenre.textContent = data.Genre
            mRating.textContent = data.Rated
            mScore.textContent = data.imdbRating
            // console.log(movieGenre, movieTitle, moviePoster, movieRated, movieYear, moviePlot)
            console.log(data)
            searchVideos(data.Title, data.Year, 'Trailer')
            // Pulls up a video for each type
            // searchVideos(year,'Trailer')
            // searchVideos(year,'Clips')
            // searchVideos(year,'Review')
        })
}


// OMDB api
function searchMovie(movieTitle) {
    console.log("searchMovie");
    fetch(`http://www.omdbapi.com/?apikey=6c411e7c&s=${movieTitle}`)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log('OMDB', data)

            // Checks if a movie was found
            if (data.Response === 'True') {
                searchResultsContainer.classList.remove('is-hidden')
                for (i = 0; i < 3; i++) {
                    movieCard[i].setAttribute('data-id', data.Search[i].imdbID)
                    movieCard[i].onclick = function (event) {

                        getMovieDetails(this.getAttribute('data-id'))

                    }
                    titleSearchEl[i].textContent = data.Search[i].Title
                    console.log(data.Search[i].Poster)
                    if (data.Search[i].Poster != 'N/A') {
                        posterSearchEl[i].setAttribute("src", data.Search[i].Poster)
                    } else {
                        posterSearchEl[i].setAttribute("src", './assets/images/default-image.png')
                    }
                    searchYearEl[i].textContent = data.Search[i].Year
                }
                // Random Id
                // const movieId = data.Search[0].imdbID
                // Extracting the year from first omdb result.  Change later to Whichever result the user clicks on
                // const year = data.Search[0].Year

                // getMovieDetails(movieId)

                // Pulls up a video for each type

                // searchVideos(year,'Clips')
                // searchVideos(year,'Review')
            } else {

                // Change from an alert to display on page
                alert('No such movie')
            }

        })
        .catch(err => {
            console.error(err);
        });
}

function clearResults() {
    mainContentContainer.classList.add('is-hidden')
    searchResultsContainer.classList.add('is-hidden')
    backButton.classList.add('is-hidden')
    movieTitle = ''
    movieID = ''
}

function handleSubmit(event) {
    event.preventDefault()
    movieTitle = movieInput.value
    searchMovie(movieTitle)
    movieInput.value = ''
    mainContentContainer.classList.add('is-hidden')

    backButton.classList.add('is-hidden')
}

function loadFavorites() {
    console.log(favoriteBox.children.length)
    // for(i=0; i<favoriteBox.childElementCount; i++){
    //     favoriteBox.removeChild(favoriteBox.firstElementChild);
    //     console.log(favoriteBox.firstChild)
    // }
    favoriteBox.innerHTML=''
    const favoritetwo = JSON.parse(localStorage.getItem('favorites'))
    if (favoritetwo) {
        // favorites = JSON.parse(localStorage.getItem('favorites'))
        // for(i=0; i<favorites.length; i++){
        //     let favbox = document.createElement("p")
        //     favbox.textContent=favorites[i].name
        //     favbox.setAttribute("data-name", favorites[i].name)
        //     favbox.onclick = function(){
        //         getMovieDetails(this.getAttribute("data-name"))
        //     }
        //     favoriteBox.append(favbox)

        favoritetwo.forEach((movie)=>{
            let favbox = document.createElement("p")
            favbox.textContent=movie.name
            favbox.setAttribute("data-name", movie.name)
            favbox.onclick = function(){
                getMovieDetails(this.getAttribute("data-name"))
            }
            favoriteBox.append(favbox)
        })

        }
    
    // console.log(favorites)
    
}

function saveFavorite() {
    alreadySaved = false;
    const currentfavorite = ({
        name: movieTitle,
        id: movieID
    })

    for (let i=0;i<favorites.length;i++){
        if (favorites[i].id===currentfavorite.id){
            alreadySaved = true;
        }
    }

    if (alreadySaved) {
        // favorites.splice(favorites.indexOf(currentfavorite), 1)
        // console.log(favorites)
        favoriteEl.setAttribute("style", "color:black;");
        favorites = favorites.filter(function(v) {
            return v.id !== currentfavorite.id;
        });
        
    } else {
        favorites.push({
            name: movieTitle,
            id: movieID
        }) 
        favoriteEl.setAttribute("style", "color:yellow;");
    }
    localStorage.setItem('favorites', JSON.stringify(favorites))
    loadFavorites()
}

loadFavorites()
searchResult.addEventListener("submit", handleSubmit)
clearButton.onclick = clearResults
backButton.onclick = goBack
favoriteEl.onclick = saveFavorite
favoritesEl.onclick = loadFavorites