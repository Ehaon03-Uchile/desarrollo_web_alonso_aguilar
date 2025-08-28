const cambioAgregar = () => {
    window.location.href = "../T1/agregar.html";
}
const cambioListado = () => {
    window.location.href = "../T1/listado.html";
}

let agregarBtn = document.getElementById("agregarBtn");
agregarBtn.addEventListener("click", cambioAgregar);

let listadoBtn = document.getElementById("listadoBtn");
listadoBtn.addEventListener("click", cambioListado);