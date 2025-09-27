const API = "https://api.tvmaze.com";

function SeriesView() {
    const element = document.createElement("section");

    element.innerHTML = `
        
    <div class="max-w-xl mx-auto">

        <h2 class="text-2xl font-bold mb-4">Buscador de Series</h2>
            <form id="f" class="flex flex-col gap-2 md:flex-row md:items-center mb-3">
                <input id="q" class="border rounded p-2 flex-1" placeholder="Busca una serie (ej: Stranger Things)">
                <select id="sort" class="border rounded p-2">
                    <option value="">Orden: Predeterminado</option>
                    <option value="name">Orden: Nombre</option>
                    <option value="rating">Orden: Rating</option>

                </select>
                <button class="bg-gray-900 text-white px-4 py-2 rounded">Buscar</button>
            </form>

    </div>
    <div id="resultados"></div>
    `;

    const form = element.querySelector("#f");
    const input = element.querySelector("#q");
    const sort = element.querySelector("#sort");
    const resultados = element.querySelector("#resultados");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        resultados.textContent = "Cargando...";

        try {
            const res = await fetch(`${API}/search/shows?q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error("Error en la búsqueda");
            const data = await res.json();

            if (data.length === 0) {
                resultados.textContent = "No se encontraron resultados.";
                return;
            }

            if (sort.value === "name") {
                data.sort((a, b) => a.show.name.localeCompare(b.show.name));
            }
            else if (sort.value === "rating") {
                data.sort((a, b) => (b.show.rating.average || 0) - (a.show.rating.average || 0));
            }
            
            
            resultados.innerHTML = data.slice(0,30).map(item => `
                <div class="rounded shadow-lg p-4 mb-4 transition-transform duration-200 
                    hover:-translate-y-1 hover:scale-102 hover:shadow-2xl
                    flex flex-col md:flex-row gap-4">

                    <div class="w-full md:w-1/4 md:pl-8">
                        <img src="${item.show.image ? item.show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image'}" 
                            alt="${item.show.name}" class="rounded" style="position: relative; left: 12px;" />
                    </div>
                    <div class="w-full md:w-3/4">
                        <h3 class="font-semibold mb-2">${item.show.name}</h3>
                        <p>${item.show.premiered ? item.show.premiered.slice(0,4) : "Sin año"}</p>
                        <p>Rating: ${item.show.rating.average || "Sin rating"}</p>
                        <p>Género: ${item.show.genres.join(", ") || "Sin géneros"}</p>
                        <p>Sinopsis: ${item.show.summary ? item.show.summary.replace(/<[^>]+>/g, '') : "Sin sinopsis"}</p>
                    </div>
                </div>
            `).join("");

        } catch (error) {
            resultados.textContent = "Hubo un error al buscar la serie.";
        }
    });
    return element;
}

// desplegar contenido en la pagina desde pagSeries.html
window.mostrarContenido = function() {
    const contenedor = document.getElementById("contenido");
    contenedor.innerHTML = "";          // Limpiar contenido al hacer otra busqueda
    contenedor.appendChild(SeriesView()); 
};

