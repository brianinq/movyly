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
