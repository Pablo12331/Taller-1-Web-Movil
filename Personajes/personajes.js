const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

// Imagen genérica para artistas
const defaultImage = "https://cdn-icons-png.flaticon.com/512/727/727245.png";

async function searchArtists() {
  const query = searchInput.value.trim();
  if (!query) {
    results.innerHTML = "<p class='text-center text-red-500'>⚠️ Escribe un artista para buscar</p>";
    return;
  }

  results.innerHTML = "<p class='text-center'>⏳ Buscando...</p>";

  try {
    const res = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(query)}&fmt=json`);
    const data = await res.json();

    if (!data.artists || data.artists.length === 0) {
      results.innerHTML = "<p class='text-center text-gray-500'>❌ No se encontraron artistas</p>";
      return;
    }

    // Mostrar primeros 10 resultados
    results.innerHTML = data.artists.slice(0, 10).map(artist => `
      <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
        <img src="${defaultImage}" alt="Artista" class="w-20 h-20 mb-3">
        <h2 class="font-bold text-lg text-center">${artist.name}</h2>
        <p class="text-sm text-gray-600 text-center">${artist.disambiguation || "Sin descripción"}</p>
        <p class="mt-1">🌍 ${artist.area ? artist.area.name : "Desconocido"}</p>
        <p class="mt-1">📅 ${artist["life-span"]?.begin || "?"} - ${artist["life-span"]?.end || "Presente"}</p>
        <a href="https://musicbrainz.org/artist/${artist.id}" target="_blank" 
           class="text-purple-700 underline block mt-2">🔗 Ver en MusicBrainz</a>
      </div>
    `).join("");
  } catch (err) {
    results.innerHTML = "<p class='text-red-500 text-center'>❌ Error al buscar artistas</p>";
    console.error(err);
  }
}

searchBtn.addEventListener("click", searchArtists);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchArtists();
});
