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
        console.log(response.hits);
        renderCardImage(response.hits);
     } catch (error) {
        console.log(error);
    }
}
async function onClickLoadMore() {
    const response = await newApiService.fetchGallery();
    console.log(response.hits);
    
}

function renderCardImage(photos) {
    const markup = photos.map(photo => {
        `<div class="photo-card">
  <img src="${photo.webformatURL}" alt="${photo.tags} loading="lazy"/>
  <div class="info">
    <p class="info-item"><b>Likes</b><span>${photo.likes}</span></p>
    <p class="info-item"><b>Views</b><span>${photo.views}</span></p>
    <p class="info-item"><b>Comments</b><span>${photo.comments}</span></p>
    <p class="info-item"><b>Downloads</b><span>${photo.downloads}</span></p>
  </div>
</div>`})
        .join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}