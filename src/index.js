import './style.css';
import "simplelightbox/dist/simple-lightbox.min.css";

import NewApiService from "./fetchGallery";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';


const refs = {
    searchForm: document.querySelector(".search-form"),
    btnLoadMore: document.querySelector(".load-more"),
    gallery: document.querySelector(".gallery"),
};

refs.btnLoadMore.classList.add('is-hidden');

const newApiService = new NewApiService();
refs.searchForm.addEventListener("submit", onSubmitForm)
refs.btnLoadMore.addEventListener('click', onClickLoadMore)

let page = 1;
let lightbox = {};
async function onSubmitForm(evt) {
    evt.preventDefault();
    refs.btnLoadMore.classList.add('is-hidden'); 
    newApiService.query = evt.currentTarget.searchQuery.value;
    // при повторном сабмите сбрасываем номер страницы до 1
    newApiService.resetPage();
    // при повторном сабмите чистим галерею 
    clearGallery();
    // запрос на сервер
    const response = await newApiService.fetchGallery();
    // lightbox.refresh();
    // если знчение инпута =0 или пустой массив, то тогда останавливаем выполнение кода и выдаем информационное поле.,
    // если общее кол-во обьектов больше чем 0, то инф поле 
        if (newApiService.query === "" || response.hits.length === 0 ) {
             return Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");  
        } else if (response.totalHits > 0) { 
             Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images`);
            }  
    // если все хорошо, то выполняется try (рендерится разметка, появляется кнопка рид мор, лайбокс рефреш )
    try {
      
            refs.btnLoadMore.classList.remove('is-hidden');
            renderCardImage(response.hits);
        } catch (error) {
            console.log(error);
        }
   
    // если колво обьетов на первой странице = общему количеству обьектов 
    if (response.hits.length === response.totalHits) {
        refs.btnLoadMore.classList.add('is-hidden');
        return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
          lightbox.refresh();
}
async function onClickLoadMore() {
    page += 1;
// при клике на рид море - запрос на сервер 
    const response = await newApiService.fetchGallery();
 // если все ок - віполняем трай  
    try {
        renderCardImage(response.hits);
       } catch (error) {
         console.log(error);
    }
    // если  номер открытой страницы > больше если totalHits/40, то кнопка пропадает 
    let perPage = 40;
    const totalPage = response.totalHits / perPage;
    console.log(totalPage);
   if (page > totalPage) {
        refs.btnLoadMore.classList.add('is-hidden');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }  
    lightbox.refresh();
}

function renderCardImage(photos) {
    const markup = photos.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return`<div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags} loading="lazy"/></a>
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

// lightbox
refs.gallery.addEventListener("click", onImgClick)
 lightbox = new SimpleLightbox('.photo-card a', {
    showCounter: false,
    captionsData: 'alt',
    captionDelay: 250,
  });

    
function onImgClick(evt) {
    evt.preventDefault();
     if (!evt.target.nodeName != 'IMG') {
        return;
    }
   }
// При сабмите и рид море необходимо вызывать функцию lightbox.refresh();
// <<------------------------------------->>
