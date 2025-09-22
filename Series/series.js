const API = "https://api.tvmaze.com";

function SeriesView() {
    const element = document.createElement("section");

    element.innerHTML = `
        <h1>Series</h1>
        <h3>¡Busca tu serie favorita aquí!</h3>

        <form id="f" class="flex flex-col gap-2 md:flex-row md:items-center mb-3">
            <input id="q" class="border rounded p-2 flex-1" placeholder="Busca una serie (ej: game)">
            <select id="sort" class="border rounded p-2">
                <option value="name">Orden: Nombre</option>
                <option value="rating">Orden: Rating</option>
                <option value="year">Orden: Año</option>
            </select>
            <button class="bg-indigo-600 text-white px-4 py-2 rounded">Buscar</button>
        </form>
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

            resultados.innerHTML = data.map(item => `
                <div> 
                    <strong>${item.show.name}</strong>
                    <p>${item.show.premiered ? item.show.premiered.slice(0,4) : "Sin año"}</p>
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

