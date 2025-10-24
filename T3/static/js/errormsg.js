document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");

    if (errorParam) {
        const valBox = document.getElementById("val-box");
        const valList = document.getElementById("val-list");

        if (valBox && valList) {
            // limpiar lista previa
            valList.innerHTML = "";

            // separar errores por ";" (ej: ?error=Email en uso;RUT inválido)
            const errores = errorParam.split(";");

            errores.forEach(err => {
                const li = document.createElement("li");
                li.textContent = err.trim();
                valList.appendChild(li);
            });

            // mostrar la caja de validación
            valBox.classList.remove("oculto");
        }
    }
});

