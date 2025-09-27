const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYmZmZGYwZGE5Yjc3YWQzZWZjYmNkZTFiYjVmYzI3OSIsIm5iZiI6MTc1ODQxODI4NC4yODQsInN1YiI6IjY4Y2Y1NTZjNGE2YmU2NWJiY2NkNzQ3MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o7ZmcdAKblCTCCWepjxtsjPwJ6Is8Oo2CFZSId5Zbxo';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w400';

function renderRow(url, containerId) {
  fetch(url, {
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    }
  })
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.results.forEach(item => {
      const poster = item.poster_path 
        ? IMAGE_BASE + item.poster_path 
        : 'https://via.placeholder.com/150x225?text=No+Image';
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${poster}" alt="${item.title || item.name}">
        <p>${item.title || item.name}</p>
        <span>⭐ ${item.vote_average.toFixed(1)}</span>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => console.error(err));
}


const URL_TENDENCIAS = 'https://api.themoviedb.org/3/trending/movie/day?language=es-ES';
const URL_POPULAR = 'https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1';
const URL_TOP_RATED = 'https://api.themoviedb.org/3/movie/top_rated?language=es-ES&page=1';


renderRow(URL_TENDENCIAS, 'tendencias');
renderRow(URL_POPULAR, 'popular');
renderRow(URL_TOP_RATED, 'top-rated');

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query === "") return;

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-ES&page=1`;

  renderRow(url, 'searchResults');
});