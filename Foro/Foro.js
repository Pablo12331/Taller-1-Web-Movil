const commentsContainer = document.getElementById("comments");
const commentForm = document.getElementById("commentForm");

// Cargar comentarios iniciales
async function loadComments() {
  commentsContainer.innerHTML = "<p class='text-center col-span-3'>⏳ Cargando comentarios...</p>";

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments");
    const data = await res.json();

    // Mostrar primeros 20 comentarios
    commentsContainer.innerHTML = data.slice(0, 20).map(c => commentCard(c)).join("");
  } catch (err) {
    commentsContainer.innerHTML = "<p class='text-red-500 text-center col-span-3'>❌ Error al cargar comentarios</p>";
    console.error(err);
  }
}

// Función para renderizar comentario
function commentCard(c) {
  return `
    <div class="bg-white shadow rounded-lg p-4">
      <h2 class="font-bold text-lg text-purple-700">${c.name}</h2>
      <p class="text-sm text-gray-500 mb-2">✉️ ${c.email}</p>
      <p class="text-gray-700">${c.body}</p>
    </div>
  `;
}

// Manejar envío del formulario
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newComment = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    body: document.getElementById("body").value
  };

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments", {
      method: "POST",
      body: JSON.stringify(newComment),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    const data = await res.json();

    // Agregar el nuevo comentario arriba
    commentsContainer.innerHTML = commentCard(data) + commentsContainer.innerHTML;

    // Resetear formulario
    commentForm.reset();
  } catch (err) {
    alert("❌ Error al publicar comentario");
    console.error(err);
  }
});

// Inicializar
loadComments();
