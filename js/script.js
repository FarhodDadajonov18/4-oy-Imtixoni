let elForm = document.querySelector(".form");
let elSelect = document.querySelector(".select");
let elInput = document.querySelector(".input");

let elList = document.querySelector(".list");
let elTemplate = document.querySelector("#template").content;

let elPage = document.querySelector(".list-page");
let elMoviesPage = document.querySelector(".pagination-list");

let bookmarkList = document.querySelector(".bookmark-list")


let page = 1; 
let bookmarkArr = JSON.parse(localStorage.getItem("movies")) || [];
console.log(bookmarkArr);

let movieInfo = async (movie, type = "movie") => {
    try{
      let response = await fetch(`http://www.omdbapi.com/?apikey=8660115b&s=${movie}&page=${page}&type=${type}`);
      let data = await response.json()

      renderMovie(data.Search);
    } catch(e) {
     
      console.log(e.message);
    }
}
movieInfo("man")

let movieBookmark = async (imdb) => {
  try{
    let response = await fetch(`http://www.omdbapi.com/?apikey=8660115b&i=${imdb}`);
    let data = await response.json()
    // console.log(data);
    bookMovie(data);
  } catch(e) {
   
    console.log(e.message);
  }
}






elForm.addEventListener("submit", function(evt){
  evt.preventDefault()
  movieInfo(elInput.value, elSelect.value) 


})



function createItem (movie) {
  let elItem  = elTemplate.cloneNode(true);

  elItem.querySelector(".js-img").src = movie.Poster;
  elItem.querySelector(".card-title").textContent = movie.Title.slice(0,20);
  elItem.querySelector(".card-text").textContent =` Year: ${ movie.Year}`;
  elItem.querySelector(".js-button").dataset.imdbId = movie.imdbID
  elItem.querySelector(".js-bookmark").dataset.imdbId = movie.imdbID
  return elItem;
}

let renderMovie = movies => {
  elList.innerHTML=null;

  modalItem(movies)

  let elFragement = document.createDocumentFragment();

  movies.forEach(movie => { 
      elFragement.appendChild(createItem(movie))
  })

    elList.appendChild(elFragement)

}


elPage.addEventListener("click", function(evt){
  if(evt.target.matches(".next-item") ){
    if(elInput.value == ""){
    elInput.value = "man";
    }
    page++
    elMoviesPage.textContent = page
    movieInfo(elInput.value);    

  }

  if(evt.target.matches(".prev-item")){

    if( page > 1){
      page--
      elMoviesPage.textContent = page
      movieInfo(elInput.value);  
    }  

  }
})


//modal 

function modalItem(arr) {
  elList.addEventListener("click", (evt) => {
    if(evt.target.matches(".js-button")) {
        let moviIndex = evt.target.dataset.imdbId
        let findMovie = arr.find(el => el.imdbID == moviIndex)
       
        let modalImg = document.querySelector(".modal-img").src = findMovie.Poster
        let modaltitle = document.querySelector(".modal-title").textContent = findMovie.Title
    }
  })
}

//Bookmark
elList.addEventListener("click", (evt) => {
  if(evt.target.matches(".js-bookmark")) {
      let bookMoveIdex = evt.target.dataset.imdbId
      movieBookmark(bookMoveIdex)
  }

})

function bookMovie(obj) {
  bookmarkArr.push(obj)
  localStorage.setItem("movies", JSON.stringify(bookmarkArr))
  bookmarkItemRender()

}


function bookmarkItemRender () {
  bookmarkList.innerHTML = ""

  bookmarkArr.forEach(el => {
    bookmarkList.innerHTML +=`
      <li>
        <span>${el.Title}</span> 
        <button type="button" class="btn btn-danger delet-item" id = ${el.imdbID}>delete</button>
      </li>
    `
  })
}

bookmarkItemRender()


bookmarkList,addEventListener("click", evt => {
  if(evt.target.matches(".delet-item")) {
    let moveId = evt.target.id

    let bookMoveIndex = bookmarkArr.findIndex(el => el.imdbID === moveId)
    bookmarkArr.splice(bookMoveIndex,1)
    localStorage.setItem("movies", JSON.stringify(bookmarkArr))
    bookmarkItemRender()
    
  }
})

function bookmarkRemove () {

}




