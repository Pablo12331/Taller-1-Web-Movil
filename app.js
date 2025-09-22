const resources = [
  { name: "Clima", api: "openweather" },
  { name: "Recetas", api: "themealdb" },
  { name: "Noticias", api: "newsapi" },
  { name: "Pokémon", api: "pokeapi" },
];

const resourcesContainer = document.getElementById("resources");
const content = document.getElementById("content");

// Crear botones dinámicos
resources.forEach(r => {
  const btn = document.createElement("button");
  btn.textContent = r.name;
  btn.className = "bg-blue-500 text-white p-2 rounded hover:bg-blue-700";
  btn.onclick = () => loadResource(r.api);
  resourcesContainer.appendChild(btn);
});

// Función de carga según API seleccionada
async function loadResource(api) {
  content.innerHTML = `<p class="text-center">⏳ Cargando ${api}...</p>`;

  try {
    let data;
    switch(api) {
      case "pokeapi":
        data = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5").then(res => res.json());
        content.innerHTML = data.results.map(p => `<p>🐉 ${p.name}</p>`).join("");
        break;
      case "themealdb":
        data = await fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(res => res.json());
        content.innerHTML = `<h2>${data.meals[0].strMeal}</h2><img src="${data.meals[0].strMealThumb}" class="w-40">`;
        break;
      default:
        content.innerHTML = `<p>No implementado aún 🚧</p>`;
    }
  } catch (err) {
    content.innerHTML = `<p class="text-red-500">❌ Error cargando ${api}</p>`;
  }
}
