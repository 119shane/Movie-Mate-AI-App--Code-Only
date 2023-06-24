import {process} from "./env"
import {Configuration, OpenAIApi} from 'openai'

const configuration = new Configuration({
    apiKey: process.env.KEY
})

const openai = new OpenAIApi(configuration)


const genre = document.getElementById("select_genre")
const rating = document.getElementById("select_imdb_rating")
const year = document.getElementById("select_year")
const language = document.getElementById("select_language")
const submitBtn = document.getElementById("submit_btn")
const movieName = document.getElementById("movie")
const movieYearSub = document.getElementById("movie_year_sub")
const moviePoster = document.getElementById("movie_poster")
const span = document.getElementById("span")
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const inputGenre = genre.value
    const inputRating = rating.value
    const inputYear = year.value
    const inputLanguage = language.value
    getMovie(inputGenre,inputRating,inputYear,inputLanguage)
})

async function getMovie(genre, rating, year, language) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
        find the name of the best movie (stricly do not show released year and IMDB rating) in given language that has given genre, in this year (or one year in the range) with this given IMDB rating, if there are several movies, pick a random movie name among them
        ###
        genre: War
        rating: 7+
        year: 2021
        language: Hindi
        Movie: Shershaah
        ###
        genre: Comedy
        rating: 7+
        year: 1998
        language: French
        Movie: Le Dîner de Cons
        ###
        genre: Drama
        rating: 8+
        year: 2016
        language: Korean
        Movie:  The Handmaiden
        ###
        genre: ${genre}
        rating: ${rating}
        year: ${year}
        language: ${language}
        Movie:
        `,
        max_tokens: 30
    })
    const choosedMovie = response.data.choices[0].text
    movieName.textContent = choosedMovie
    span.textContent =  year
    getMoviePoster(choosedMovie)
}

async function getMoviePoster(movie) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=b2a034b6f1cb96b2952d4af67739ef84&language=en-US&query=${movie}&page=1&include_adult=false`;
    
    const response = await fetch(url)
    const data = await response.json()
    const imgSrcPart = `${data.results[0].poster_path}`
    const imgSrcFull = `https://image.tmdb.org/t/p/w185_and_h278_bestv2/${imgSrcPart}`
    
    moviePoster.innerHTML = `<img src=${imgSrcFull} />`


}