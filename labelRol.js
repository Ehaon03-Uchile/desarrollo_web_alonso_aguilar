const rolRadios = document.querySelectorAll('input[name="rol"]');

function getRol() {
  for (const radio of rolRadios) {
    if (radio.checked) return radio.value;
  }
  return null;
}

const actualizarLabel = (label,textoA, textoE,show=false) => {
  const rol = getRol();
  const inputId = label.getAttribute("for"); // obtener id del input asociado
  const input = document.getElementById(inputId)
  const padre = label.parentNode;
  
  if (!rol) {
    label.textContent = "";
    return;
  }

  if (rol === "si") {
    label.textContent = textoA;
    label.classList.remove("oculto");
    input.classList.remove("oculto");

    padre.classList.remove("oculto");

  } 
  else {
    label.textContent = textoE;
    label.classList.remove("oculto");
    input.classList.remove("oculto");

    padre.classList.remove("oculto");
    if (show){
        label.classList.add("oculto");
        input.classList.add("oculto");
        
        padre.classList.remove("oculto");
    }
  }
}

const actNLabels = () => {
    const correoLabel = document.getElementById("labelEmail");
    actualizarLabel(correoLabel, "Correo Apoderado: ", "Correo Estudiante: ")

    const phonelabel = document.getElementById("labelPhone");
    actualizarLabel(phonelabel, "Teléfono Apoderado: ", "Teléfono Estudiante: ")

    const nameA = document.getElementById("nameALabel");
    actualizarLabel(nameA, "Nombre Apoderado: ", "", true)
    const lastnameALabel = document.getElementById("lastnameALabel");
    actualizarLabel(lastnameALabel, "Apellidos Apoderado: ", "", true)
    const rutA = document.getElementById("rutALabel");
    actualizarLabel(rutA, "Rut Apoderado: ", "", true)
}

rolRadios.forEach(r => r.addEventListener("change", actNLabels));