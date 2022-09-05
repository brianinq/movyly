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
const liked = document.querySelector("#favs")
const theater = document.querySelector("#theaters")
const heroFav = document.querySelector(".cta button.left")
const favourites = []
const next = document.querySelector("#next")
const previous = document.querySelector("#prev")
const current = document.querySelector("#current")
let page = 1
let currentApi = API
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
        page=1
        current.textContent = page
        getMovies(page, SERIES_ENDPOINT)
        currentApi = SERIES_ENDPOINT
    })
    movies.addEventListener("click",()=>{
        page=1
        current.textContent = page
        getMovies(page, API)
        currentApi = SERIES_ENDPOINT
    })
    theater.addEventListener("click", ()=>{
        page=1
        current.textContent = page
        const [start, end] = getDates()
        const link = `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=${start}&primary_release_date.lte=${end}&api_key=${API_KEY}&page=`
        console.log(link);
        getMovies(page, link)
        currentApi = link
    })
    liked.addEventListener("click",()=>{
        if (!favourites.length) {
            container.innerHTML = `You have no favourites yet click on<i class="fa-regular fa-heart"></i>to favourite a title.`
            hero.remove()
            return
        }
        displayMovies(favourites, false)
    })
    next.addEventListener("click", ()=>{
        page+=1
        current.textContent = page
        getMovies(page, currentApi)
        window.scrollTo({top: 0})
    })
    previous.addEventListener("click", ()=>{
        if (page===1) return
        page-=1
        current.textContent = page
        getMovies(page, currentApi)
        window.scrollTo({top: 0})
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
        let fav = moviecard.querySelector("button")
        fav.addEventListener("click", ()=>{
            favourites.push(movie)
            fav.innerHTML = `<i class="fa-solid fa-heart"></i> Favourited`
        })

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
                page=1
                current.textContent = page
                currentApi = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1cf50e6248dc270629e802686245c2c8&with_genres=${e.target.id}&page=`
                fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1cf50e6248dc270629e802686245c2c8&with_genres=${e.target.id}&page=${page}`)
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
        page=1
        current.textContent = page
        currentApi = SEARCH_ENDPOINT
    }
});


function setHero(movie){
    hero.querySelector(".about .title").textContent = movie.title? movie.title: movie.name
    hero.querySelector(".about .desc").textContent = movie.overview
    hero.style.background = `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.83)), url(${IMAGE_PATH}${movie.backdrop_path}) center center/cover`

    heroFav.addEventListener("click", ()=>{
            favourites.push(movie)
            heroFav.innerHTML = `<i class="fa-solid fa-heart"></i> Favourited`
        })
}

