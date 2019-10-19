const body = document.querySelector('body');
const titleInput = document.getElementById('title-input');
const ideaInput = document.getElementById('idea-input');
const saveIdeaBtn = document.getElementById('save-idea-btn');
const ideasContainer = document.getElementById('ideas-container');
let isFilteringByFav = false;
let isFilteringBySwill = false;
let isFilteringByPlausible = false;
let isFilteringByGenius = false;
let ideas = [];

ideaInput.value = '';

appendStoredIdeas();

body.addEventListener('keyup', e => {
  if(e.target.id === 'title-input' || e.target.id === 'idea-input') {
    const isTitleGood = titleInput.value !== '';
    const isIdeaGood = ideaInput.value !== '';
    isTitleGood && isIdeaGood ? saveIdeaBtn.disabled = false : saveIdeaBtn.disabled = true;
  }

  if(e.target.id === 'search-input') {
    const searchValue = e.target.value.toLowerCase();
    const ideaElements = document.querySelectorAll('.idea');
    ideaElements.forEach(idea => idea.remove());
    const ideasFoundInSearch = ideas.filter( idea => {
      if(idea.title.toLowerCase().includes(searchValue) || idea.content.toLowerCase().includes(searchValue)) {
        return true;
      }
    });
    ideasFoundInSearch.forEach(idea => appendIdeaFromLocal(idea));
  }
});

body.addEventListener('click', e => {
  if(e.target.id === 'save-idea-btn') {
    e.preventDefault();
    const currentIdeas = JSON.parse(localStorage.getItem('ideas'));
    const newIdea = {
      title: titleInput.value,
      content: ideaInput.value,
      isFavorite: false,
      quality: 'Swill',
    }
    const updatedIdeas = currentIdeas ? [...currentIdeas, newIdea] : [newIdea];
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
    resetInputs([titleInput, ideaInput]);
    appendIdea(newIdea);
  }

  if(e.target.classList.contains('favorite-btn')) {
    e.preventDefault();
    toggleFavorite(e);
  }

  if(e.target.id === 'filter-by-starred-btn') {
    e.preventDefault();
    toggleFilterByStarred(e);
  }

  if(e.target.classList.contains('remove-idea-btn')) {
    e.preventDefault();
    const idea = e.target.closest('section');
    const title = idea.children[1].innerText;
    const content = idea.children[2].innerText;
    idea.remove();
    const updatedIdeas = ideas.filter(idea => idea.title !== title && idea.content !== content);
    ideas = updatedIdeas.length > 0 ? updatedIdeas : [];
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
  }

  if(e.target.classList.contains('up-arrow')) {
    e.preventDefault();
    const idea = e.target.closest('section');
    const title = idea.children[1].innerText;
    const content = idea.children[2].innerText;
    const updatedIdeas = ideas.map(idea => idea);
    const updatedIdea = updatedIdeas.find(idea => idea.title === title && idea.content === content);
    let currentQuality = updatedIdea.quality;
    switch(currentQuality) {
    case 'Swill':
      updatedIdea.quality = 'Plausible';
      break;
    case 'Plausible':
      updatedIdea.quality = 'Genius';
      break;
    case 'Genius':
      break;
    }
    ideas = updatedIdeas;
    localStorage.setItem('ideas', JSON.stringify(ideas));
    let quality = e.target.closest('section').children[3].children[1];
    quality.innerText = `Quality: ${updatedIdea.quality}`; 
  }

  if(e.target.classList.contains('down-arrow')) {
    e.preventDefault();
    const idea = e.target.closest('section');
    const title = idea.children[1].innerText;
    const content = idea.children[2].innerText;
    const updatedIdeas = ideas.map(idea => idea);
    console.log(ideas);
    const updatedIdea = updatedIdeas.find(idea => idea.title === title && idea.content === content);
    let currentQuality = updatedIdea.quality;
    switch(currentQuality) {
    case 'Swill':
      break;
    case 'Plausible':
      updatedIdea.quality = 'Swill';
      break;
    case 'Genius':
      updatedIdea.quality = 'Plausible';
      break;
    }
    ideas = updatedIdeas;
    localStorage.setItem('ideas', JSON.stringify(ideas)); 
    let quality = e.target.closest('section').children[3].children[1];
    quality.innerText = `Quality: ${updatedIdea.quality}`;
  }

  if(e.target.id === 'filter-by-swill-btn') {
    const ideaElements = document.querySelectorAll('.idea');
    ideaElements.forEach(idea => idea.remove());
    isFilteringBySwill = !isFilteringBySwill;
    if(isFilteringBySwill) {
      isFilteringByFav = false;
      isFilteringByPlausible = false;
      isFilteringByGenius = false;
      const swillIdeas = ideas.filter(idea => idea.quality === 'Swill');
      swillIdeas.forEach(idea => appendIdeaFromLocal(idea));
    } else {
      ideas.forEach(idea => appendIdeaFromLocal(idea));
    }
  }

  if(e.target.id === 'filter-by-plausible-btn') {
    const ideaElements = document.querySelectorAll('.idea');
    ideaElements.forEach(idea => idea.remove());
    isFilteringByPlausible = !isFilteringByPlausible;
    if(isFilteringByPlausible) {
      isFilteringByFav = false;
      isFilteringBySwill = false;
      isFilteringByGenius = false;
      const plausibleIdeas = ideas.filter(idea => idea.quality === 'Plausible');
      plausibleIdeas.forEach(idea => appendIdeaFromLocal(idea));
    } else {
      ideas.forEach(idea => appendIdeaFromLocal(idea));
    }
  }

  if(e.target.id === 'filter-by-genius-btn') {
    const ideaElements = document.querySelectorAll('.idea');
    ideaElements.forEach(idea => idea.remove());
    isFilteringByGenius = !isFilteringByGenius;
    if(isFilteringByGenius) {
      isFilteringByFav = false;
      isFilteringBySwill = false;
      isFilteringByPlausible = false;
      const geniusIdeas = ideas.filter(idea => idea.quality === 'Genius');
      geniusIdeas.forEach(idea => appendIdeaFromLocal(idea));
    } else {
      ideas.forEach(idea => appendIdeaFromLocal(idea));
    }
  }
});

const resetInputs = inputsArray => {
  inputsArray.forEach(input => {
    input.value = '';
  })
}

function appendIdea(newIdea) {
  ideas = [...ideas, newIdea];
  const ideaElement = `
    <section class='idea'>
      <img class='favorite-btn' src='./images/inactive-star.png' alt='favorite button' />
      <h4>${newIdea.title}</h4>
      <p>${newIdea.content}</p>
      <div class='idea-rating'>
        <button class='down-arrow'>Down</button>
        <p>Quality: ${newIdea.quality}</p>
        <button class='up-arrow'>Up</button>
      </div>
      <button class='remove-idea-btn'>Remove Idea</button>
    </section>
  `
  ideasContainer.insertAdjacentHTML('beforeend', ideaElement);
};

function appendIdeaFromLocal(savedIdea) {
  const starUrl = savedIdea.isFavorite ? './images/active-start.png' : './images/inactive-star.png';
  const ideaElement = `
    <section class='idea'>
      <img class='favorite-btn' src=${starUrl} alt='favorite button' />
      <h4>${savedIdea.title}</h4>
      <p>${savedIdea.content}</p>
      <div class='idea-rating'>
        <button class='down-arrow'>Down</button>
        <p>Quality: ${savedIdea.quality}</p>
        <button class='up-arrow'>Up</button>
      </div>
      <button class='remove-idea-btn'>Remove Idea</button>
    </section>
  `
  ideasContainer.insertAdjacentHTML('beforeend', ideaElement);
}

function appendStoredIdeas(){
  const savedIdeas = JSON.parse(localStorage.getItem('ideas'));
  if(savedIdeas) {
    ideas = savedIdeas;
    savedIdeas.forEach(idea => {
      appendIdeaFromLocal(idea);
    });
  }
};

const toggleFavorite = e => {
  const title = e.target.closest('section').children[1].innerText;
  const content = e.target.closest('section').children[2].innerText;
  let updatedIdeas = ideas.map(idea => idea);
  let idea = updatedIdeas.find(idea => {
    if(idea.title === title && idea.content === content) {
      return true;
    }
  });
  idea.isFavorite = !idea.isFavorite;
  ideas = updatedIdeas;
  localStorage.setItem('ideas', JSON.stringify(ideas));
  const starUrl = idea.isFavorite ? './images/active-start.png' : './images/inactive-star.png';
  e.target.src = starUrl;
}

const toggleFilterByStarred = e => {
  isFilteringByFav = !isFilteringByFav;
  if(isFilteringByFav) {
    const ideaElements = document.querySelectorAll('.idea');
    ideaElements.forEach(idea => idea.remove());
    const favIdeas = ideas.filter(idea => idea.isFavorite === true);
    favIdeas.forEach(idea => appendIdeaFromLocal(idea));
  } else {
    const ideaElements = document.querySelectorAll('.idea');
    ideaElements.forEach(idea => idea.remove());
    ideas.forEach(idea => appendIdeaFromLocal(idea));
  }
}