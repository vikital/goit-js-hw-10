import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const selectEl = document.querySelector('.breed-select');
const divEl = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');
const errorEl = document.querySelector('.error');
const loaderSt = document.querySelector('.loader_style');

loaderEl.style.display = 'none';
errorEl.style.display = 'none';
let breeds = [];

function takeBreeds(response) {
  for (let breed in response) {
    breeds.push({ name: response[breed].name, id: response[breed].id });
  }
}

async function addBreeds() {
  try {
    const response = await fetchBreeds(errorEl);
    takeBreeds(response);
    let listOfBreedsEl = breeds.map(element => {
      let optionEl = document.createElement('option');
      optionEl.value = element.id;
      optionEl.textContent = element.name;
      return optionEl;
    });
    selectEl.append(...listOfBreedsEl);
  } catch (error) {
    errorEl.textContent = 'Oops! Something went wrong! Try reloading the page!';
  }
}

addBreeds();

function getElements(elements) {
  if (elements[0] && elements[0].breeds) {
    const name = elements[0].breeds[0].name;
    const description = elements[0].breeds[0].description;
    const temperament = elements[0].breeds[0].temperament;
    const image = elements[0].url;
    return {
      name: name,
      description: description,
      temperament: temperament,
      image: image,
    };
  } else {
    return null;
  }
}

function showBreed(returnedPromise) {
  if (!returnedPromise || returnedPromise.length === 0) {
    divEl.innerHTML = '';
    divEl.style.display = 'none';
    loaderSt.style.display = 'none';
    loaderEl.style.display = 'none';
    errorEl.textContent = 'Oops! Something went wrong! Try reloading the page!';
    errorEl.style.display = 'block';
  } else {
    const elements = getElements(returnedPromise);
    if (elements) {
      const { name, description, temperament, image } = elements;
      let htmlEls = `<img src="${image}" alt="${name}" class="image">
                        <div class="cat-details">
                        <h1 class="title">${name}</h1>
                        <p class="description">${description}</p>
                        <p class="temperament"><b class="title-temperament">Temperament: </b>${temperament}</p> </div>`;

      divEl.innerHTML = htmlEls;
      loaderSt.style.display = 'none';
      loaderEl.style.display = 'none';
      errorEl.style.display = 'none';
      divEl.style.display = 'block';
    } else {
      divEl.innerHTML = '';
      divEl.style.display = 'none';
      loaderSt.style.display = 'none';
      loaderEl.style.display = 'none';
      errorEl.textContent =
        'Oops! Something went wrong! Try reloading the page!';
      errorEl.style.display = 'block';
    }
  }
}

async function onSelectChange(event) {
  const breedId = selectEl.options[selectEl.selectedIndex].value;
  selectEl.style.display = 'none';
  divEl.style.display = 'none';
  loaderSt.style.display = 'block';
  loaderEl.style.display = 'block';
  const returnedPromise = await fetchCatByBreed(
    breedId,
    errorEl,
    loaderEl,
    loaderSt,
    selectEl
  );
  showBreed(returnedPromise);
  divEl.style.display = 'flex';
  selectEl.style.display = 'block';
}

new SlimSelect({
  select: '.select-breed',
});

selectEl.addEventListener('change', onSelectChange);
