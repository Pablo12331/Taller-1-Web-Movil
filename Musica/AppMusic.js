
document.addEventListener('DOMContentLoaded', () => {

    const songsContainer = document.getElementById('songs-container');
    const loadingMessage = document.getElementById('loading-message');
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');
    const searchOverlay = document.getElementById('search-overlay');
    const musicIcon = document.getElementById('music-icon');
    const songsSectionTitle = document.getElementById('songs-section-title');
    const explorerSong = document.getElementById('explorer-song');

    const top10Song = (songs) =>
    {
        songsContainer.innerHTML = '';

        const songsHTML = songs.map((song, index) => 
        {
            const songRowHTML = `
                <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 p-0 sm:p-2 rounded-lg hover:bg-zinc-800 transition-colors duration-200">
                
                    <div class="flex items-center gap-1 w-full min-w-0">

                        <div class="w-8 text-center text-[#CC0000]   font-bold text-lg">${index + 1}</div>

                        <img src="${song.album.cover_small}" alt="Portada de ${song.album.title}" class="w-14 h-14 rounded-md">

                        <div class="flex-grow min-w-0"> 
                        
                            <h3 class="font-bold truncate">${song.title}</h3>
                            <p class="text-sm text-gray-400 truncate">${song.artist.name}</p>

                        </div>

                    </div>

                    <audio controls src="${song.preview}" class="h-8 w-full scale-85 sm:scale-100"></audio>

                </div>
            `;
            return songRowHTML; 
        }).join('');
        
        songsContainer.innerHTML = songsHTML;
    }

    const fetchTopSongs = async () => {

        const apiUrl = 'https://api.deezer.com/chart/0/tracks';

        const proxyUrl = 'https://corsproxy.io/?';

        try {
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));

            if (!response.ok) 
            {
                throw new Error(`Error de red: ${response.status}`);
            }

            const data = await response.json();

            top10Song(data.data);


        } 
        catch (error) 
        {
            loadingMessage.innerHTML = `<p class="text-red-500">No se pudieron cargar las canciones. Intenta de nuevo más tarde.</p>`;
            console.error("Ocurrió un error al buscar los datos:", error);
        }
        finally 
        {
            if (songsContainer.innerHTML !== '') 
            {
                loadingMessage.style.display = 'none';
            }
            songsContainer.style.display = 'grid';
        }
    };

    const musicSearch = async (query) => {
        songsContainer.innerHTML = '';
        loadingMessage.style.display = 'block';
        songsSectionTitle.textContent = `Buscando resultados para: "${query}"`;

        const apiUrl = `https://api.deezer.com/search?q=${query}`;
        const proxyUrl = 'https://corsproxy.io/?';

        try {
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            if (!response.ok) throw new Error(`Error de red: ${response.status}`);
            const data = await response.json();

            if (data.data.length === 0) {
                loadingMessage.innerHTML = `<p class="text-gray-500">No se encontraron resultados para "${query}".</p>`;
            } else {
                top10Song(data.data);
                loadingMessage.style.display = 'none';
            }

            } catch (error) {
                loadingMessage.innerHTML = `<p class="text-red-500">Hubo un error en la búsqueda.</p>`;
                console.error("Error en la búsqueda:", error);
            }
            finally 
            {
                if (songsContainer.innerHTML !== '') 
                {
                    loadingMessage.style.display = 'none';
                }
                songsContainer.style.display = 'flex';
            }
        };

    searchIcon.addEventListener('click', () => 
    {
        searchOverlay.classList.remove('hidden');

        searchInput.focus();
    });

    searchInput.addEventListener('blur', () => 
    {
        searchOverlay.classList.add('hidden');
    });

    searchInput.addEventListener('keypress', (event) => 
    {
        if (event.key === 'Enter' && searchInput.value.trim() !== '') {
            const query = searchInput.value.trim();
            musicSearch(query);
            searchOverlay.classList.add('hidden');
        }
    });

    musicIcon.addEventListener('click', () => 
    {
        songsSectionTitle.textContent = `Top 10 Canciones del Momento`;
        fetchTopSongs();
    });

    explorerSong.addEventListener('click', () => 
    {
        searchOverlay.classList.remove('hidden');
        searchInput.focus();
    });

    fetchTopSongs();
});