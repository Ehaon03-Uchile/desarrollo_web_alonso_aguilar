const data = {
    "tiger": ["BLANCO - GRADO 9", "BLANCO TORTUGA", "BLANCO NARANJO", "BLANCO NARANJO TIGRE", "BLANCO AMARILLO", "BLANCO AMARILLO CHITA", "BLANCO CAMUFLADO", "BLANCO CAMUFLADO LEON", "BLANCO VERDE", "BLANCO VERDE AGUILA", "BLANCO PURPURA", "BLANCO PURPURA FENIX", "BLANCO AZUL", "BLANCO AZUL DRAGON", "BLANCO CAFE" ,"BLANCO CAFE COBRA", "BLANCO ROJO", "BLANCO ROJO PANTERA"],
    "color": ["BLANCO - GRADO 9", "8R NARANJO", "8D NARANJO", "7R AMARILLO", "7D AMARILLO", "6R CAMUFLADO", "6D CAMUFLADO", "5R VERDE", "5D VERDE", "4R PURPURA", "4D PURPURA", "3R AZUL", "3D AZUL", "2R CAFE", "2D CAFE", "1R ROJO", "1D ROJO", "1BR"],
    "negro" : ["1BD",  "2BD", "3BD", "4BD", "5BD", "6BD", "7BD", "8BD"],
    "midterm": ["Sin Midterm","1 Midterm", "2 Midterm", "3 Midterm", "4 Midterm", "5 Midterm", "6 Midterm"] 
}

const tiposRadios = document.querySelectorAll('input[name="claseCinturon"]');


function getTipo() {
  for (const radio of tiposRadios) {
    if (radio.checked) return radio.value;
  }
  return null;
}

const updateCinturon = () => {
    let selectCinturon = document.getElementById("cinturon");
    let tipoElegido = getTipo();

    selectCinturon.innerHTML = '<option value=""> --Seleccione-- </option>';
    
    if (data[tipoElegido]) {
        data[tipoElegido].forEach(cint => {
            let option = document.createElement("option")
            option.value = cint
            option.text = cint
            selectCinturon.appendChild(option)
        });
    }
    const regularLabel = document.getElementById("labelProgramaBase");
    const especialLabel = document.getElementById("labelProgramaEsp");
    actualizarLabelCinturon(regularLabel, especialLabel)
    updateMidterm()
}

const actualizarLabelCinturon = (labelR, labelE) => {
  const tipo = getTipo();

  const inputId1 = labelR.getAttribute("for"); // obtener id del input asociado
  const inputR = document.getElementById(inputId1);
  const padreR = labelR.parentNode;

  const inputId2 = labelE.getAttribute("for"); // obtener id del input asociado
  const inputE = document.getElementById(inputId2);
  const padreE = labelE.parentNode;
  
  
  if (!tipo) {
    labelR.textContent = "";
    labelE.textContent = "";
    return;
  }

  if (tipo === "color" || tipo === "negro") {

    labelR.classList.remove("oculto");
    labelE.classList.remove("oculto");
    inputR.classList.remove("oculto");
    inputE.classList.remove("oculto");

    padreR.classList.remove("oculto");
    padreE.classList.remove("oculto");

  } 
  else {

    labelR.classList.add("oculto");
    labelE.classList.add("oculto");
    inputR.classList.add("oculto");
    inputE.classList.add("oculto");

    padreR.classList.add("oculto");
    padreE.classList.add("oculto");
    
  }
}

const updateMidterm = () => {
    let selectMidterm = document.getElementById("midterm");
    let tipoElegido = getTipo();

    selectMidterm.innerHTML = '<option value=""> -- Seleccione -- </option>';
    
    if (tipoElegido === "negro") {
        data["midterm"].forEach(i => {
            let option = document.createElement("option")
            option.value = i
            option.text = i
            selectMidterm.appendChild(option)

            const labelM = document.getElementById("labelMidterm")
            const inputId = labelM.getAttribute("for"); // obtener id del input asociado
            const select = document.getElementById(inputId);
            const span = labelM.parentNode;

            labelM.classList.remove("oculto");
            select.classList.remove("oculto");
            span.classList.remove("oculto");
        });
    }
    else {
        const labelM = document.getElementById("labelMidterm")
        const inputId = labelM.getAttribute("for"); // obtener id del input asociado
        const select = document.getElementById(inputId);
        const span = labelM.parentNode;

        labelM.classList.add("oculto");
        select.classList.add("oculto");
        span.classList.add("oculto");
    }
}

tiposRadios.forEach(r => r.addEventListener("change", updateCinturon));