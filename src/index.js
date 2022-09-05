const API_KEY = "09a0341a69c2c30c14120fe3b8831a27";
const SEARCH_ENDPOINT = `https://api.themoviedb.org/3/search/movie?&api_key=${API_KEY}&query=`;
const API = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=`
const SERIES_ENDPOINT = `https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=${API_KEY}&page=`
// const API = "https://api.themoviedb.org/3/movie/550?api_key=09a0341a69c2c30c14120fe3b8831a27"
const CATEGORIES_ENDPOINT = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
const categories = document.querySelector(".categories")
const hero = document.querySelector(".hero")
const main = document.querySelector("main")
const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280"
const container = document.querySelector("#container")
const form = document.querySelector("#form")
const series = document.querySelector("#series")
const movies = document.querySelector("#movies")
const theater = document.querySelector("#theaters")
let page = 1

function getDates(){
    let date = new Date()
    let today = date.toISOString().split("T")[0]
    let pastMonth = Number(date.getMonth())
    const arr  = today.split("-")
    arr[1] = pastMonth >=10 ? pastMonth.toString() : `0${pastMonth}`
    return [arr.join("-"), today]
}

document.addEventListener("DOMContentLoaded",()=>{
    getCategories(CATEGORIES_ENDPOINT)
    getMovies(page, API)
    
    series.addEventListener("click",()=>{
        getMovies(page, SERIES_ENDPOINT)
    })
    movies.addEventListener("click",()=>{
        getMovies(page, API)
    })
    theater.addEventListener("click", ()=>{
        const [start, end] = getDates()
        const link = `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${start}&primary_release_date.lte=${end}&api_key=${API_KEY}&page=`
        console.log(link);
        getMovies(page, link)
    })
})


function getMovies(page,api){
    fetch(api+page)
    .then(res=> res.json())
    .then(data => displayMovies(data.results))
    .catch(error=>container.innerHTML = error.message)
}

function displayMovies(movies, heroState=true){
    // 
    heroState?setHero(movies[Math.floor(Math.random() * movies.length)]): hero.style.display = "none"
    container.innerHTML = ""
    movies.forEach(movie=>{
        let {title, poster_path, vote_average, overview, id, name} = movie
        title = title? title: name
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
            li.addEventListener("click",(e)=>{
                fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1cf50e6248dc270629e802686245c2c8&with_genres=${e.target.id}`)
                .then(res=> res.json())
                .then(data => displayMovies(data.results, false))
                .catch(error=>container.innerHTML = error.message)
            })
        });
    })
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("#search")
    console.log(input.value); 
    const search = input.value;

    if (search) {
        fetch(SEARCH_ENDPOINT + search)
        .then(res=> res.json())
        .then(data => displayMovies(data.results, false))
        .catch(error=>container.innerHTML = error.message)
        input.value = "";
    }
});


function setHero(movie){
    hero.querySelector(".about .title").textContent = movie.title? movie.title: movie.name
    hero.querySelector(".about .desc").textContent = movie.overview
    hero.style.background = `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.83)), url(${IMAGE_PATH}${movie.backdrop_path}) center center/cover`
}

