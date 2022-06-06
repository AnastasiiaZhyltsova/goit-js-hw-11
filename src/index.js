import './style.css';
import NewApiService from "./fetchGallery";
import Notiflix from 'notiflix';


const refs = {
    searchForm: document.querySelector(".search-form"),
    btnLoadMore: document.querySelector(".load-more"),
    gallery: document.querySelector(".gallery"),
};
refs.btnLoadMore.classList.add('is-hidden');
const newApiService = new NewApiService();
refs.searchForm.addEventListener("submit", onSubmitForm)
refs.btnLoadMore.addEventListener('click', onClickLoadMore)

 

async function onSubmitForm(evt) {
    evt.preventDefault();
    newApiService.query = evt.currentTarget.searchQuery.value;
    newApiService.resetPage();
    clearGallery();
    if (newApiService.query === "" ) {
        return Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");  
    }
      try {
          const response = await newApiService.fetchGallery();
          const totalHits = response.totalHits;
        if (response.hits.length === 0) {
            Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
            return
        } else if (totalHits > 0) { 
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
        }
           
        refs.btnLoadMore.classList.remove('is-hidden');
        renderCardImage(response.hits);
        console.log(response.hits);
    
    } catch (error) {
         console.log(error);
    }
}
async function onClickLoadMore() {
     if (newApiService.query === "" ) {
        return Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");  
    }
    const response = await newApiService.fetchGallery();
      renderCardImage(response.hits);
    console.log(response.hits);
    
}

function renderCardImage(photos) {
    const markup = photos.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return`<div class="photo-card">
  <img src="${webformatURL}" alt="${tags} loading="lazy"/>
  <div class="info">
    <p class="info-item"><b>Likes</b><span>${likes}</span></p>
    <p class="info-item"><b>Views</b><span>${views}</span></p>
    <p class="info-item"><b>Comments</b><span>${comments}</span></p>
    <p class="info-item"><b>Downloads</b><span>${downloads}</span></p>
  </div>
</div>`})
        .join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
};
function clearGallery() {
    refs.gallery.innerHTML = '';
}