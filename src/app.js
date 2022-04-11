import { removeAllChildNodes } from './util.js';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const searchGallery = document.querySelector('.search-gallery');
const logo = document.querySelector('.logo');

// const PEXELS_API_KEY = "Insert_Your_Key";

function isMoreButtonVisible(visible) {
  if (visible) {
    moreButton.classList.remove('hidden');
  } else {
    moreButton.classList.add('hidden');
  }
}

function clearGallery() {
  removeAllChildNodes(searchGallery);
}

// >>> - append photos to gallery
function appendPhotosToGalley(photos) {
  const photosDocumentFragment = document.createDocumentFragment();

  photos.forEach(photo => {
    const divEl = document.createElement('div');
    const imgEl = document.createElement('img');
    const divEl2 = document.createElement('div');
    const pEl = document.createElement('p');
    const aEl = document.createElement('a');
    const aEl2 = document.createElement('a');

    imgEl.setAttribute('src', photo.src.tiny);
    pEl.textContent = `Photographer: ${photo.photographer}`;
    aEl2.setAttribute('href', photo.photographer_url);
    aEl2.setAttribute('target', "_blank");

    aEl.setAttribute('href', photo.src.large);
    aEl.setAttribute('target', "_blank");
    aEl.textContent = "Download";

    divEl.appendChild(imgEl);
    aEl2.appendChild(pEl);
    divEl2.appendChild(aEl2);
    divEl2.appendChild(aEl);
    divEl.appendChild(divEl2);

    photosDocumentFragment.appendChild(divEl);
  })

  searchGallery.appendChild(photosDocumentFragment);
  isMoreButtonVisible(true);
}

// >>> - search photos
async function searchPhotos(query) {
  const queryUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${resultPerPage}&page=${resultPage}`;
  const queryOptions = {
    method: "GET",
    headers: {
      Authorization: PEXELS_API_KEY,
    }
  };

  const queryResult = await fetch(queryUrl, queryOptions);
  const queryData = await queryResult.json();
  return queryData.photos;
}


// >>> - form listener
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  isMoreButtonVisible(false);
  clearGallery();

  const query = searchInput.value;

  if (query.length === 0) {
    searchInput.setAttribute('placeholder', 'Nothing typed!');
    setTimeout(() => {
      searchInput.setAttribute('placeholder', '');
    }, 600);
    return;
  }

  logo.classList.add('logo-loading');

  resultPage = 1;
  currentQuery = query;

  searchPhotos(query).then(appendPhotosToGalley)
    /* --------------------- logo loading animation --------------------- */
    .then(() => {
      logo.addEventListener('animationiteration', () => {
        logo.classList.remove('logo-loading');
      }
        , { once: true });
    }
    );
});


/* ------------------------ clear search input ------------------------ */
searchForm.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  if (searchInput.value !== '') {
    searchInput.setAttribute('placeholder', searchInput.value)
    searchInput.value = '';
    setTimeout(() => {
      searchInput.setAttribute('placeholder', '');
    }, 600);
  }
}
);

/* ---------------------------- more button --------------------------- */
const moreButton = document.querySelector('.more');

let resultPage = 1;
let resultPerPage = 15;
let currentQuery = "";

async function loadMore() {
  resultPage += 1;
  searchPhotos(currentQuery).then(appendPhotosToGalley);
}

// >>> - more button listener
moreButton.addEventListener('click', loadMore);
