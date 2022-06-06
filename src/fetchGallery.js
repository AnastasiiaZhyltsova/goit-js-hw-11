import axios from "axios";

export default class NewApiService{
    
    constructor() {
        this.seachQuery = '';
        this.page = 1;
    }

    async fetchGallery() {
        // console.log(this);
       const BASE_URL = 'https://pixabay.com/api/';
        const KEY = '27868120-ecbda89988110022223138572';
        const options = `&q=${this.seachQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

        return await axios.get(`${BASE_URL}?key=${KEY}${options}`)
            .then(response => {
                this.page += 1;
                return response.data
            });
    } 

    get query() {
        return this.seachQuery;
    }
    set query(newQuery) {
        this.seachQuery = newQuery;
    }
// Ессли после рид мор клиент кливает на сабмит необходимо обновить поиск с 1 страницы 
    resetPage() {
        this.page = 1;
    }
}