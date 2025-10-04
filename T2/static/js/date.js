const input = document.getElementById("fechaNacimiento");
const hoy = new Date();

const maxfecha = new Date();
maxfecha.setFullYear(hoy.getFullYear()-3);
const min = new Date();
min.setFullYear(min.getFullYear() - 80);

const formato = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth()+1).padStart(2,"0");
    const day = String(fecha.getDate()).padStart(2,"0");
    
    return `${year}-${month}-${day}`;
}

input.max = formato(maxfecha);
input.min = formato(min)