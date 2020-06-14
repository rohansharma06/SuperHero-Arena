const Favourites= (function(){
 
    // ---- display the details of selected superhero ----
    function renderFavourites(){
        const allFavouritesFromLocalStorage= Common.getFavouriteSuperheroes();
        const displayResults= document.getElementById('search-result-list');


        displayResults.innerHTML='';

        if(!allFavouritesFromLocalStorage || allFavouritesFromLocalStorage.length === 0){
            console.log("i am here");
            displayResults.innerHTML='<li class="no-results">There is no SuperHero in your favourites...  </li>';
            

        }
        else{
            allFavouritesFromLocalStorage.forEach((item)=>{
                const li= document.createElement('li');

                li.classList.add('search-result');

                li.innerHTML=`<div class="search-left">
                                <img src=${item.image.url} alt="" />
                            </div>
                            <div class="search-right">
                                <a href="./superHero.html?id=${item.id}">
                                    <div class="name">${item.name}</div>
                                </a>
                                <div class="full-name">${item.biography['full-name']}</div>

                                <div class="address">${item.biography['place-of-birth']}</div>
                                <button class="btn remove-from-fav" data-id=${item.id}>Remove from favourites</button>
                            </div>`;
                    displayResults.appendChild(li);
            });
        }
        Common.hideLoader();
        return;
    }

    // ---- handle add/remove from fav ----
    function handleDocumentClick(e){
        const target= e.target;

        if(target.classList.contains('remove-from-fav')){
            const searchResultClickedId = target.dataset.id;
            Common.removeHeroFromFav(searchResultClickedId);
            renderFavourites();
        }
    }

    function init(){
        Common.showLoader();
        renderFavourites();

        document.addEventListener('click', handleDocumentClick);
    }
    return{
        init
    }
})();