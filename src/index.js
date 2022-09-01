const API_KEY = "09a0341a69c2c30c14120fe3b8831a27";
const SEARCH_ENDPOINT = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`;
const API = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=`
// const API = "https://api.themoviedb.org/3/movie/550?api_key=09a0341a69c2c30c14120fe3b8831a27"
const CATEGORIES_ENDPOINT = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
const categories = document.querySelector(".categories")
const hero = document.querySelector(".hero")
const main = document.querySelector("main")
const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280"
const container = document.querySelector("#container")
let page = 1
document.addEventListener("DOMContentLoaded",()=>{
    getCategories(CATEGORIES_ENDPOINT)
    getMovies(page)
    // setHero(heroMovie)
})


function getMovies(page){
    fetch(API+page)
    .then(res=> res.json())
    .then(data => displayMovies(data.results))
    .catch(error=>container.innerHTML = error.message)
}

function displayMovies(movies, heroState=true){
    // 
    heroState?setHero(movies[Math.floor(Math.random() * movies.length)]): hero.style.display = "none"
    container.innerHTML = ""
    movies.forEach(movie=>{
        const {title, poster_path, vote_average, overview, id} = movie
        let moviecard = document.createElement("div")
        moviecard.innerHTML = `
             <img src="${poster_path ? IMAGE_PATH + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">

            <div class="about-movie">
                <h3>${title}</h3>
                <h4>${vote_average}</h4>
            </div>

            <div class="overview">

                <h3>${title}</h3>
                <p>${overview}</p>
                <button class="btn" id="${id}"><i class="fa-regular fa-heart"></i> Favourite</button
            </div>
        
        `
        moviecard.classList.add("card")
        container.appendChild(moviecard)

    })
}
function getCategories(api){
    fetch(api)
    .then(res=> res.json())
    .then(data=>{
        data.genres.forEach(genre => {
            const {name, id} = genre
            let li = document.createElement("li")
            li.id = id
            li.textContent = name
            categories.appendChild(li)
            li.addEventListener("click",fetchByCategory)
        });
    })
}
