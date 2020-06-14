const Common= (function(){

    const apiToken= '2617170791722668';
    const apiUrl= `https://www.superheroapi.com/api.php/${apiToken}/`;
    const toastContainer = document.getElementById('toast');
    const FAVOURITES = 'favourites';
    const loader = document.querySelector('.loader');

    // ---- to display loding while fetching API ----
    function showLoader() {
        loader.style.display = 'block';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    // ---- sending api Request ----
    async function apiRequest(url){
        try{
            const response= await fetch(url);
            const data= await response.json();

            return{
                data,
                success: true
            };
        }catch(err){
            return{
                error: err.message,
                success: false
            }
        }
    }

    /* Display Toast Notification*/
    function showNotification(type, message) {
        if (type === 'error') {
            toastContainer.classList.remove('toast-success');
            toastContainer.classList.add('toast-error');
        } 
        else if (type === 'success') {
            toastContainer.classList.remove('toast-error');
            toastContainer.classList.add('toast-success');
        }
        toastContainer.style.display = 'block';
        toastContainer.innerText = message;

        setTimeout(() => {
        toastContainer.style.display = 'none';
        }, 3000);
    }

    // ---- Add superHero to local storage ----
    function addHeroToFav(hero){
        console.log("common",hero);
        if(!hero){
            return;
        }

        // ---- get all hero from localStorage then push another one to it
        const allFavouritesFromLocalStorage = getFavouriteSuperheroes();
        allFavouritesFromLocalStorage.push(hero);

        // Save in localstorage
        localStorage.setItem(
            FAVOURITES,
            JSON.stringify(allFavouritesFromLocalStorage)
        );
    
        showNotification('success', 'Added to favourites');
    }

    // ---- Delete superHore from localStorage ----
    function removeHeroFromFav(heroId){
        //console.log('remove:',hero)
        if (!heroId){
            return;
        }

        let allFavouritesFromLocalStorage = getFavouriteSuperheroes();

        // Remove hero from localstorage
        allFavouritesFromLocalStorage = allFavouritesFromLocalStorage.filter(
            (item) => item.id !== heroId
        );

        // Save in localstorage
        localStorage.setItem(
            FAVOURITES,
            JSON.stringify(allFavouritesFromLocalStorage)
        );

        showNotification('error', 'Removed from favourites');
    }

    // ---- Display all favourite super Hero ----
    function getFavouriteSuperheroes() {
        return localStorage.getItem(FAVOURITES)
          ? JSON.parse(localStorage.getItem(FAVOURITES))
          : [];
    }

    // ---- Debounce use to call Api at a certain interval ----
    function debounce(func, delay) {
        let timeout;
        return function () {
          const context = this;
          const args = arguments;
    
          clearTimeout(timeout);
    
          timeout = setTimeout(function () {
            timeout = null;
            func.apply(context, args);
          }, delay);
        };
    }

    return{
        apiUrl,
        showLoader,
        hideLoader,
        apiRequest,
        showNotification,
        addHeroToFav,
        removeHeroFromFav,
        getFavouriteSuperheroes,
        debounce,
    }
})();