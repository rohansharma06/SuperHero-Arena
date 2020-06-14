const profile=(function(){

    // ---- Get the id of SuperHero from query ----
    function getHeroIDFromParameter(){
        const urlparams = new URLSearchParams(window.location.search);
        //console.log(urlparams.get('id'));
        return urlparams.get('id');
    }

    // ---- Show all infomation of the requested SuperHero ----
    function displaySuperHeroProfile(details){
        //console.log(details);
        Common.hideLoader();
        const superHeroDetails= document.querySelector('.superHero-details');
        Common.hideLoader();

        const indexOfSuperHeroInFav= Common.getFavouriteSuperheroes().findIndex(
            (hero) => hero.id === details.id
        );

        if(!details){
            superHeroDetails.innerHTML= `<div class="error-inFinding-Hero">Error in finding superHero plz go back to Home! </div>`
        }else{
        superHeroDetails.innerHTML=`
                <div class="left">
                    <img src= ${details.image.url} alt="Image" >
                    <button class="btn add-to-fav" data-id=${details.id} style="display: ${indexOfSuperHeroInFav === -1 ? 'block':'none'}">
                        Add to favourites
                    </button>
                    <button class="btn remove-from-fav" data-id=${details.id} style="display: ${indexOfSuperHeroInFav === -1 ? 'none':'block'}">
                        Remove from favourites
                    </button>
                </div>
                <div class="right">
                    <div class="bio margin">
                        <h2 class="bio-title">Biography</h2>
                        <h3>Name: <span>${details.name}</span> </h3>
                        <h3>Full Name: <span>${details.biography["full-name"]}</span> </h3>
                        <h3>Alter-Egos: <span>${details.biography["alter-egos"]}</span> </h3>
                        <h3>Place-of-Birth: <span>${details.biography["place-of-birth"]}</span> </h3>
                        <h3>First-Appearance: <span>${details.biography["first-appearance"]}</span> </h3>
                        <h3>Publisher: <span>${details.biography["publisher"]}</span> </h3>
                        <h3>Alignment: <span>${details.biography["alignment"]}</span> </h3>
                    </div>

                    <div class="bio margin">
                        <h2 class="bio-title">Powerstats</h2>
                        <h3>Intelligence: <span>${details.powerstats.intelligence}</span> </h3>
                        <h3>Strength: <span>${details.powerstats.strength}</span> </h3>
                        <h3>Speed: <span>${details.powerstats.speed}</span> </h3>
                        <h3>Durability: <span>${details.powerstats.durability}</span> </h3>
                        <h3>Power: <span>${details.powerstats.power}</span> </h3>
                        <h3>Combat: <span>${details.powerstats.combat}</span> </h3>
                    </div>

                    <div class="bio margin">
                        <h2 class="bio-title">Appearance</h2>
                        <h3>Gender: <span>${details.appearance.gender}</span> </h3>
                        <h3>Race: <span>${details.appearance.race}</span> </h3>
                        <h3>Height: <span>${details.appearance.height[1]}</span> </h3>
                        <h3>Weigh: <span>${details.appearance.weight[1]}</span> </h3>
                        <h3>Eye-color: <span>${details.appearance["eye-color"]}</span> </h3>
                        <h3>Hair-color: <span>${details.appearance["hair-color"]}</span> </h3>
                    </div>

                    <div class="bio margin">
                        <h2 class="bio-title">Work</h2>
                        <h3>Occupation: <span>${details.work.occupation}</span> </h3>
                        <h3>Base: <span>${details.work.base}</span> </h3>
                    </div>
                </div>`;
        }
        getinfo(details);
    }

    // ---- fetching all details of requested superhero ----
    async function fetchSuperHeroDetails(id){
        const url= Common.apiUrl+id;
        //console.log(url);
        try{
            const info= await Common.apiRequest(`${url}`);
            //console.log(info);
            if(info.success){
                displaySuperHeroProfile(info.data);
            }else{
                displaySuperHeroProfile(null);
            }
        }catch(err){
            console.log('Error in finding superHero profile',err);
            displaySuperHeroProfile(null);
        }

    }

    //----
    let selectedHeroDetails;
    function getinfo(info){
        selectedHeroDetails=info;
    }
    function handleDocumentClick(e) {
        const target= e.target;
        //const searchResultClickedId = target.dataset.id;
        //console.log(target.classList);
        //console.log(searchResultClickedId);

        if(target.classList.contains('add-to-fav')){
            //const searchResultClickedId = target.dataset.id;
            //console.log(selectedHeroDetails);
            Common.addHeroToFav(selectedHeroDetails);
            displaySuperHeroProfile(selectedHeroDetails);
        }
        else if(target.classList.contains('remove-from-fav')){
            const searchResultClickedId = target.dataset.id;

            const addToFavBtn = document.querySelector(
                `button[data-id="${searchResultClickedId}"].add-to-fav`
                );
            if (addToFavBtn) addToFavBtn.style.display = 'block';
        
            const removeFromFavBtn = document.querySelector(
                `button[data-id="${searchResultClickedId}"].remove-from-fav`
                );
            if (removeFromFavBtn) removeFromFavBtn.style.display = 'none';

            Common.removeHeroFromFav(searchResultClickedId);
            //displaySuperHeroProfile(selectedHeroDetails);
        }
    }

    function init(){
        const heroId= getHeroIDFromParameter();
        console.log(heroId);
        Common.showLoader();

        fetchSuperHeroDetails(heroId);
        document.addEventListener('click',handleDocumentClick);
    }

    return{
        init
    }
})();