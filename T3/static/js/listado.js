document.addEventListener("DOMContentLoaded", () => {
  const tablaBody = document.getElementById("tabla-body");
  const paginationDiv = document.getElementById("pagination");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  let currentPage = 1;
  let currentQuery = "";
  let currentSort = "name";
  let currentOrder = "asc";

  async function cargarListado(page = 1) {
    try {
      const params = new URLSearchParams({
        page,
        q: currentQuery,
        sort_by: currentSort,
        order: currentOrder
      });
      const response = await fetch(`/api/listado?${params}`);
      if (!response.ok) throw new Error("Error al cargar los datos");

      const data = await response.json();
      if (!data.ok) throw new Error("Error en la respuesta del servidor");

      renderTabla(data.data);
      renderPaginacion(data.page, data.total_pages);
    } catch (error) {
      tablaBody.innerHTML = `<tr><td colspan="8" style="color:red;">${error.message}</td></tr>`;
    }
  }

  function renderTabla(estudiantes) {
    if (!estudiantes.length) {
      tablaBody.innerHTML = `<tr><td colspan="8">No se encontraron resultados.</td></tr>`;
      return;
    }

    tablaBody.innerHTML = estudiantes.map(student => `
      <tr data-student-id="${student.real_id}">
        <td>${student.display_index}</td>
        <td>${student.full_name}</td>
        <td>${student.birth_date}</td>
        <td>${student.email}</td>
        <td>${student.phone}</td>
        <td>${student.cint}</td>
        <td>${student.regular_program}</td>
        <td>${student.special_program}</td>
      </tr>
    `).join("");

    document.querySelectorAll("#tabla2 tbody tr").forEach(row => {
      row.addEventListener("click", () => {
        const studentId = row.dataset.studentId;
        window.location.href = `/estudiante/${studentId}`;
      });
    });
  }

  function renderPaginacion(page, totalPages) {
    let html = "";

    if (page > 1) html += `<a href="#" data-page="${page - 1}" class="shadow-effect pulse-effect">« Anterior</a>`;
    for (let p = 1; p <= totalPages; p++) {
      html += p === page
        ? `<span class="current-page">${p}</span>`
        : `<a href="#" data-page="${p}" class="shadow-effect pulse-effect">${p}</a>`;
    }
    if (page < totalPages) html += `<a href="#" data-page="${page + 1}" class="shadow-effect pulse-effect">Siguiente »</a>`;

    paginationDiv.innerHTML = html;
    paginationDiv.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const newPage = parseInt(link.dataset.page);
        currentPage = newPage;
        cargarListado(newPage);
      });
    });
  }

  // --- Búsqueda dinámica (delay de 400ms para no saturar) ---
  let searchTimeout;
  searchInput.addEventListener("input", e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentQuery = e.target.value.trim();
      currentPage = 1;
      cargarListado(currentPage);
    }, 400);
  });

  // --- Orden ---
  sortSelect.addEventListener("change", e => {
    const [sortBy, order] = e.target.value.split("-");
    currentSort = sortBy;
    currentOrder = order;
    currentPage = 1;
    cargarListado(currentPage);
  });

  // Inicializar
  cargarListado(currentPage);
});
