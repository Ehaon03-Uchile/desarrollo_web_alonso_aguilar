const validateText = (text) => {
    if (!text) return false;
    
    let permitido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    let lengthValid = text.trim().length >= 4;
    let caractValid = permitido.test(text.trim());

    return lengthValid && caractValid;
};

const validateRut = (rut) => {
    rut = rut.replace(/\./g,"").replace("-","");
    let cuerpo = rut.slice(0,-1);
    let dv = rut.slice(-1).toUpperCase();
    let sum = 0;
    let mult = 2;

    for (let i = cuerpo.length - 1; i >=0; i--) {
        sum += mult * parseInt(cuerpo[i]);
        mult = mult < 7 ? mult + 1: 2;
    }

    let dvReal = 11-(sum%11);
    dvReal = dvReal === 11 ? "0" : dvReal === 10 ? "K" : String(dvReal);

    return dv === dvReal;
}

const validateEmail = (email) => {
    if (!email) return false;

    let lengthValid = email.length > 15;
    let permitido = /^[A-Za-z0-9._%+-]+@[a-z]+\.[a-z]{2,}$/;
    let formatValid = permitido.test(email);

    return formatValid && lengthValid
}

const validatePhone = (phone) => {
    if (!phone) return false;

    let lengthValid = phone.length >=8;
    let re = /^[0-9]+$/;

    return lengthValid && re.test(phone);
}

const validateSelect = (select) => {
    if (!select) return false;
    return true;
}

const validateDate = () => {

    const inputDate = document.getElementById("fechaNacimiento");
    const hoy = new Date();
    const max = new Date();
    max.setFullYear(hoy.getFullYear()-3);
    const min = new Date();
    min.setFullYear(min.getFullYear() - 80); // ejemplo: mínimo 3 años atrás

    const formato = (d) => d.toISOString().split("T")[0];

    inputDate.setAttribute("min", formato(min));
    inputDate.setAttribute("max", formato(max));

    const valor = inputDate.value;
    if (!valor) return;

    const fecha = new Date(valor);
    if (fecha < min) inputDate.value = formato(min);
    if (fecha > max) inputDate.value = formato(max);
}

const validateNumber = (number) => {
    if (!number) return false;
    let re = /^[0-9]+$/;
    return re.test(String(number).trim());
}

// Validaciones Campos T1

const validateFile = () => {
    const archivos = Array.from(inputArchivo.files);
    if (archivos.length < 1) {
        return false;
    }
    return true
}

// Validación dinámica >5 archivos
const inputArchivo = document.getElementById('archivo');
const mensaje = document.getElementById('archivoMsg');

inputArchivo.addEventListener('change', () => {
    const archivos = Array.from(inputArchivo.files);
    mensaje.innerHTML = '';

    if (archivos.length > 5) {
        mensaje.innerHTML = "No puedes seleccionar más de 5 archivos!!";
        mensaje.classList.remove("oculto")
        inputArchivo.value = '';
        return;
    }
    const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
    const archivosInvalidos = archivos.filter(file => !tiposValidos.includes(file.type));
    if (archivosInvalidos.length > 0) {
        mensaje.innerHTML = "Solo se permiten archivos de foto en formato .pg, .jepg .jpg";
        inputArchivo.value = '';
        return;
    }
    mensaje.classList.add("oculto")
    mensaje.innerHTML = "Archivos válidos listos para enviar.";
});

const validateSocialMedia = (socialMedia) => {
    if (!socialMedia) return false;

    let lengthValid = socialMedia.length > 3;
    let permitido = /^@[A-Za-z0-9._-]+$/;
    let formatValid = permitido.test(socialMedia);

    return formatValid && lengthValid
}

// Validación dinámica Rut

const inputRutE = document.getElementById("rutE")
const inputRutA = document.getElementById("rutA")

//inputRutE.addEventListener("blur", (e) => {
    //let errorMsgRut = document.getElementById("errorMsgRut")
    //if (e.target.value === ""){
      //  errorMsgRut.innerHTML = ""
        //return
    //}
    //if (!validateRut(e.target.value)) {
      //  errorMsgRut.innerHTML = "Rut incorrecto!";
    //}
    //else {
      //  errorMsgRut.innerHTML = "";
    //}
//});

inputRutE.addEventListener("input", (e) => {
    if (!inputRutE) return;
    const rut = e.target.value
    if (rut==="-") {
        e.target.value = ""
        return
    } 
    const newRut = rut.replace(/\./g,'').replace(/\-/g, '').trim().toLowerCase();
    const lastDigit = newRut.substr(-1, 1);
    const rutDigit = newRut.substr(0, newRut.length-1)
    let format = '';
    for (let i = rutDigit.length; i > 0; i--) {
        const e = rutDigit.charAt(i-1);
        format = e.concat(format);
        if (i % 3 === 0){
        format = '.'.concat(format);
        }
    }
    salida = format.concat('-').concat(lastDigit);
    e.target.value = salida
    return salida = format.concat('-').concat(lastDigit);
});

inputRutA.addEventListener("input", (e) => {
    if (!inputRutA) return;
    const rut = e.target.value
    const newRut = rut.replace(/\./g,'').replace(/\-/g, '').trim().toLowerCase();
    const lastDigit = newRut.substr(-1, 1);
    const rutDigit = newRut.substr(0, newRut.length-1)
    let format = '';
    for (let i = rutDigit.length; i > 0; i--) {
        const e = rutDigit.charAt(i-1);
        format = e.concat(format);
        if (i % 3 === 0){
        format = '.'.concat(format);
        }
    }
    salida = format.concat('-').concat(lastDigit);
    e.target.value = salida
    return salida = format.concat('-').concat(lastDigit);
});

// Validación dinámica fecha

const inputDate = document.getElementById("fechaNacimiento");
if (inputDate){
    inputDate.addEventListener("input", validateDate);
}


const validateForm = () => {

    // Definiciones
    let form = document.forms["form1"];
    let name = form["name"];
    let lastname = form["lastname"];
    let rutE = form["rutE"];
    let correo = form["email"];
    let telefono = form["phone"];

    let tipo = form["claseCinturon"];
    let grado = form["cinturon"];

    let atanumber = form["atanumber"];
    let bekhonumber = form["bekhonumber"];
    let talla = form["size"];

    let invalidInputs = [];
    let itsValid = true;

    // Validación

    const setInvalidInput = (inputName, inputCase) => {
        if (inputCase){
            inputCase.style.borderColor = "red"
        }
        invalidInputs.push(inputName);
        itsValid = false;
    }

    if (!validateText(name.value)) {
        setInvalidInput("Nombre Estudiante", name);
    }
    else{
        name.style.borderColor=""
    }
    if (!validateText(lastname.value)) {
        setInvalidInput("Apellido Estudiante",lastname);
    }
    else{
        lastname.style.borderColor=""
    }
    if (!validateRut(rutE.value)) {
        setInvalidInput("Rut Estudiante",rutE);
    }
    else{
        rutE.style.borderColor=""
    }

    const rol = getRol();
    if (rol){
        if (rol === "si") {
            let nameA = form["nameA"];
            let lastnameA = form["lastnameA"];
            let rutA = form["rutA"];

            if (!validateText(nameA.value)) {
                setInvalidInput("Nombre Apoderado",nameA);
            }
            else{
                nameA.style.borderColor=""
            }
            if (!validateText(lastnameA.value)) {
                setInvalidInput("Apellido Apoderado",lastnameA);
            }
            else{
                lastnameA.style.borderColor=""
            }
            if (!validateRut(rutA.value)) {
                setInvalidInput("Rut Apoderado",rutA);
            } 
            else{
                rutA.style.borderColor=""
            }       
        }
    }
    if (!validateEmail(correo.value)) {
        setInvalidInput("Correo",correo);
    }
    else {
        correo.style.borderColor=""
    }
    if (!validatePhone(telefono.value)) {
        setInvalidInput("Teléfono",telefono);
    }
    else{
        telefono.style.borderColor=""
    }
    if (!validateSelect(tipo.value)) {
        setInvalidInput("Tipo de Cinturón");
    }
    const tipoElegido = getTipo();
    if (tipoElegido){
        if (tipoElegido === "color" || tipoElegido === "negro") {

            let programaRegular = form["programaRegular"];
            let programaEspecial = form["programaEspecial"];

            if (!validateSelect(programaEspecial.value)) {
            setInvalidInput("Programa Regular",programaRegular);
            }
            else{
                programaRegular.style.borderColor="";
            }
            if (!validateSelect(programaRegular.value)) {
            setInvalidInput("Programa Especial",programaEspecial);
            }
            else{
                programaEspecial.style.borderColor="";
            }

            if (tipoElegido === "negro"){

                let midterm = form["midterm"];
                if (!validateSelect(midterm.value)) {
                setInvalidInput("Midterm",midterm);
                }
                else{
                    midterm.style.borderColor="";
                }
            }
        }
    }
    if (!validateSelect(grado.value)) {
        setInvalidInput("Grado Actual",grado);
    }
    else{
        grado.style.borderColor="";
    }
    if (!validateNumber(atanumber.value)) {
        setInvalidInput("Número ATA",atanumber);
    }
    else{
        atanumber.style.borderColor="";
    }
    if (!validateNumber(bekhonumber.value)) {
        setInvalidInput("Número Bekho",bekhonumber);
    }
    else{
        bekhonumber.style.borderColor="";
    }
    if (!validateSelect(talla.value)) {
        setInvalidInput("Tamaño del Cinturón");
    }  

    // Validaciones T1
    let socialMedia = form["redsocial"];
    if (!validateFile()) {
        setInvalidInput("Archivo");
    }
    if (!validateSocialMedia(socialMedia.value)) {
        setInvalidInput("Red Social",socialMedia);
    }
    else{
        socialMedia.style.borderColor="";
    }

    // Mensaje de Error
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");
    let formContainer = document.querySelector(".main-container");

    if (!itsValid) {
        validationListElem.textContent = "";
        for (input10 of invalidInputs) {
            let listElement = document.createElement("li");
            listElement.innerText = input10;
            validationListElem.append(listElement);
        }

        validationMessageElem.innerText = "Los siguientes campos son inválidos:";
        validationBox.style.backgroundColor = "#ffdddd";
        validationBox.style.borderLeftColor = "#f44336";
        validationBox.classList.remove("oculto");
    }
    else {
        form.style.display = "none";
        validationMessageElem.innerText = "Formulario Válido! Quieres confirmar el envío?";
        validationListElem.textContent = "";
        let labelFinal = document.createElement("p")
        labelFinal.innerHTML = "Al apretar confirmar, volverá al inicio"
        validationBox.style.backgroundColor = "#ddffdd";
        validationBox.style.borderLeftColor = "#04d426ff";
        
        let sumbitButton = document.createElement("button");
        sumbitButton.innerText = "Confirmar";
        sumbitButton.style.marginRight = "10px";
        sumbitButton.addEventListener("click", () => {
            window.location.href = "../T1/index.html";
        })

        let backButton = document.createElement("button");
        backButton.innerText = "Volver";
        backButton.style.marginRight = "10px";
        backButton.addEventListener("click", () => {
            form.style.display = "block";
            validationBox.classList.add("oculto");
        })

        validationListElem.appendChild(labelFinal)
        validationListElem.appendChild(sumbitButton);
        validationListElem.appendChild(backButton);

        validationBox.classList.remove("oculto");
    }
};

// Validación Formulario

let sumbitBtn = document.getElementById("enviarBtn")
sumbitBtn.addEventListener("click", (e) => {
  e.preventDefault();     // <-- clave
  validateForm();
});

let volverBtn = document.getElementById("volverBtn")
volverBtn.addEventListener("click", (e) => {
  e.preventDefault();     // <-- clave
  window.location.href = "../T1/index.html";
});

