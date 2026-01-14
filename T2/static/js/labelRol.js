const rolRadios = document.querySelectorAll('input[name="rol"]');

function getRol() {
  for (const radio of rolRadios) {
    if (radio.checked) return radio.value;
  }
  return null;
}

const actualizarLabel = (labelRol,textoA, textoE,show=false) => {
  const rol = getRol();
  const inputId = labelRol.getAttribute("for"); // obtener id del input asociado
  const inputRol = document.getElementById(inputId)
  const padre = labelRol.parentNode;
  
  if (!rol) {
    labelRol.textContent = "";
    return;
  }

  if (rol === "si") {
    labelRol.textContent = textoA;
    labelRol.classList.remove("oculto");
    inputRol.classList.remove("oculto");

    padre.classList.remove("oculto");

  } 
  else {
    labelRol.textContent = textoE;
    labelRol.classList.remove("oculto");
    inputRol.classList.remove("oculto");

    padre.classList.remove("oculto");
    if (show){
        labelRol.classList.add("oculto");
        inputRol.classList.add("oculto");
        
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