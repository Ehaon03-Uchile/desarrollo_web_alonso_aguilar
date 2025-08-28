
const home = () => {
    window.location.href = "index.html";
}

let homeBtn = document.getElementById("volverBtn2");
homeBtn.addEventListener("click", home);

const datos = () => {
    window.location.href = "datos.html"
}

let tabla = document.getElementById("tabla2") // Para cada fila, basta colocar id y un eventlistener para cada fila.
tabla.addEventListener("click", datos)