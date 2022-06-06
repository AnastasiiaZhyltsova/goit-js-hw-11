import NewApiService from "./fetchGallery";
import './css/style.css';

const refs = {
    searchForm: document.querySelector(".search-form"),
    btnLoadMore: document.querySelector(".load-more"),
    gallery: document.queryCommandIndeterm(".gallery"),
};
refs.btnLoadMore.classList.add('is-hidden');
const newApiService = new NewApiService();
refs.searchForm.addEventListener("submit", onSubmitForm)
refs.btnLoadMore.addEventListener('click', onClickLoadMore)

 

async function onSubmitForm(evt) {
    evt.preventDefault();
    newApiService.query = evt.currentTarget.searchQuery.value;
    newApiService.resetPage();
  
    try {
        const response = await newApiService.fetchGallery();
        refs.btnLoadMore.classList.remove('is-hidden');
        console.log(response.hits);
    
    } catch (error) {
         console.log(error);
    }
}
async function onClickLoadMore() {
    const response = await newApiService.fetchGallery();
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