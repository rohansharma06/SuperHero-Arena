const Main= (function(){

 const search = document.getElementById('search');
 const displayList= document.getElementById('search-result-list');

 let searchResults=[];
 const SEARCH_TEXT_LIMIT = 2;

//  ---- display all search results ----
 function renderSearchResults(){

    if(!searchResults || searchResults.length === 0){
        displayList.innerHTML= '<li class="no-results"> Please enter valid name! </li>';
        return;
    }

    const favSuperHeroes= Common.getFavouriteSuperheroes();
    displayList.innerHTML='';

    searchResults.forEach((element) => {
        const li= document.createElement('li');
       

        // ---- find if superHero exists in fav ----
        const indexOfSuperHeroInFav= favSuperHeroes.findIndex(
            (hero) => hero.id === element.id
        );
        li.classList.add('search-result');
        li.innerHTML=`
                    <div class="search-left">
                        <img src=${element.image.url} alt="" />
                    </div>
                    <div class="search-right">
                        <a href="superHero.html?id=${element.id}">
                            <div class="name">${element.name}</div>
                        </a>
                        <div class="full-name">${element.biography['full-name']}</div>

                        <div class="address">${element.biography['place-of-birth']}</div>
                        <button class="btn add-to-fav" data-id=${element.id} style="display: ${indexOfSuperHeroInFav === -1 ? 'block':'none'}">
                            Add to favourites
                        </button>
                        <button class="btn remove-from-fav" data-id=${element.id} style="display: ${indexOfSuperHeroInFav === -1 ? 'none':'block'}">
                            Remove from favourites
                        </button>
                    </div>`;

        displayList.appendChild(li);
    });
 }

//  ---- Empty search list ----
function emptySearchResults(){
    displayList.innerHTML='';
    searchResults= [];
}

// ---- handle searching when user want to search ----
async function handleSearch(e) {
    const searchTerm = e.target.value; //---- fetching value from search box
    const url = Common.apiUrl;

    if (searchTerm.length <= SEARCH_TEXT_LIMIT) {
      emptySearchResults();
      return;
    }

    // Show loader and remove existing search results
    Common.showLoader();
    emptySearchResults();

    try {
      const data = await Common.apiRequest(`${url}/search/${searchTerm}`);
      //console.log('data:',data.data.results)
      Common.hideLoader();

      if (data.success) {
        searchResults = data.data.results;
        renderSearchResults();
      }
    } catch (error) {
      console.log('error', error);
      Common.hideLoader();
    }
  }

// ---- handle add/remove from fav ----
function handleDocumentClick(e) {
    // console.log('handle',e);
    const target = e.target;

    if (target.classList.contains('add-to-fav')) {
        // Find the hero data and store it in favourites and localstorage
        const searchResultClickedId = target.dataset.id;
        const hero = searchResults.filter(
            (hero) => hero.id === searchResultClickedId
        );
        Common.addHeroToFav(hero[0]);
        renderSearchResults();
    } else if (target.classList.contains('remove-from-fav')) {
        // Find the hero data and remove from local storage
        const searchResultClickedId = target.dataset.id;

        // Show add to fav button and hide the remove from fav button
        const addToFavBtn = document.querySelector(
        `button[data-id="${searchResultClickedId}"].add-to-fav`
        );
        if (addToFavBtn) addToFavBtn.style.display = 'block';

        const removeFromFavBtn = document.querySelector(
        `button[data-id="${searchResultClickedId}"].remove-from-fav`
        );
        if (removeFromFavBtn) removeFromFavBtn.style.display = 'none';

        Common.removeHeroFromFav(searchResultClickedId);
    }
}

function init(){
    search.addEventListener('keyup', Common.debounce(handleSearch, 500));
    document.addEventListener('click', handleDocumentClick);
}

return{
    init,
};

})();