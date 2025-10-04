const validateText = (text) => {
    if (!text) return false;
    let permitido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    let lengthValid = text.trim().length >= 3;
    let caractValid = permitido.test(text.trim());
    return lengthValid && caractValid;
};

const validateRut = (rut) => {
    if (!rut) return false;
    const cleaned = rut.replace(/\./g,"").replace("-","").toUpperCase();
    if (cleaned.length < 2) return false;
    let cuerpo = cleaned.slice(0,-1);
    let dv = cleaned.slice(-1).toUpperCase();
    let sum = 0, mult = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        const digit = parseInt(cuerpo[i]);
        if (isNaN(digit)) return false;
        sum += mult * digit;
        mult = mult < 7 ? mult + 1 : 2;
    }
    let dvReal = 11 - (sum % 11);
    dvReal = dvReal === 11 ? "0" : dvReal === 10 ? "K" : String(dvReal);
    return dv === dvReal;
};

const validateEmail = (email) => {
    if (!email) return false;
    let lengthValid = email.length > 15;
    let permitido = /^[A-Za-z0-9._%+-]+@[a-z]+\.[a-z]{2,}$/;
    let formatValid = permitido.test(email);
    return formatValid && lengthValid;
};

const validatePhone = (phone) => {
    if (!phone) return false;
    let lengthValid = phone.length >= 8;
    let re = /^[0-9]+$/;
    return lengthValid && re.test(phone);
};

const validateSelect = (value) => {
    return !!(value && String(value).trim() !== "");
};

const validateNumber = (num) => {
    if (num === undefined || num === null) return false;
    const s = String(num).trim();
    if (s === "") return false;
    return /^[0-9]+$/.test(s);
};

const inputArchivo = document.getElementById('archivo');
const archivoMsgEl = document.getElementById('archivoMsg');

if (inputArchivo) {
    inputArchivo.addEventListener('change', () => {
        const archivos = Array.from(inputArchivo.files);
        if (archivoMsgEl) archivoMsgEl.innerHTML = '';
        if (archivos.length > 5) {
            if (archivoMsgEl) {
                archivoMsgEl.innerHTML = "No puedes seleccionar más de 5 archivos!!";
                archivoMsgEl.classList.remove("oculto");
            }
            inputArchivo.value = '';
            return;
        }
        const tiposValidos = ['image/jpeg', 'image/png', 'image/jpg'];
        const archivosInvalidos = archivos.filter(file => !tiposValidos.includes(file.type));
        if (archivosInvalidos.length > 0) {
            if (archivoMsgEl) {
                archivoMsgEl.innerHTML = "Solo se permiten archivos de foto en formato .jpg, .jpeg, .png";
                archivoMsgEl.classList.remove("oculto");
            }
            inputArchivo.value = '';
            return;
        }
        if (archivoMsgEl) {
            archivoMsgEl.classList.add("oculto");
            archivoMsgEl.innerHTML = "Archivos válidos listos para enviar.";
        }
    });
}

const validateFile = () => {
    if (!inputArchivo) return true;
    const archivos = Array.from(inputArchivo.files);
    return archivos.length > 0;
};

const validateSocialMedia = (social) => {
    if (!social) return false;
    if (social.length <= 3) return false;
    return /^@[A-Za-z0-9._-]+$/.test(social);
};

const inputRutE = document.getElementById("rutE");
const inputRutA = document.getElementById("rutA");

if (inputRutE) {
    inputRutE.addEventListener("input", (e) => {
        const rut = e.target.value;
        if (rut === "-") { e.target.value = ""; return; }
        const cleaned = rut.replace(/\./g,'').replace(/\-/g, '').trim().toLowerCase();
        if (cleaned.length === 0) { e.target.value = ""; return; }
        const last = cleaned.substr(-1,1);
        const digits = cleaned.substr(0, cleaned.length-1);
        let format = '';
        for (let i = digits.length; i > 0; i--) {
            const ch = digits.charAt(i-1);
            format = ch.concat(format);
            if (i % 3 === 0) format = '.'.concat(format);
        }
        e.target.value = format.concat('-').concat(last);
    });
}

if (inputRutA) {
    inputRutA.addEventListener("input", (e) => {
        const rut = e.target.value;
        const cleaned = rut.replace(/\./g,'').replace(/\-/g,'').trim().toLowerCase();
        if (cleaned.length === 0) { e.target.value = ""; return; }
        const last = cleaned.substr(-1,1);
        const digits = cleaned.substr(0, cleaned.length-1);
        let format = '';
        for (let i = digits.length; i > 0; i--) {
            const ch = digits.charAt(i-1);
            format = ch.concat(format);
            if (i % 3 === 0) format = '.'.concat(format);
        }
        e.target.value = format.concat('-').concat(last);
    });
}

const inputDate = document.getElementById("fechaNacimiento");
if (inputDate) {
    inputDate.addEventListener("input", () => {
        const hoy = new Date();
        const max = new Date(); max.setFullYear(hoy.getFullYear()-3);
        const min = new Date(); min.setFullYear(min.getFullYear() - 80);
        const fmt = (d) => d.toISOString().split('T')[0];
        inputDate.setAttribute('min', fmt(min));
        inputDate.setAttribute('max', fmt(max));
        const valor = inputDate.value;
        if (!valor) return;
        const f = new Date(valor);
        if (f < min) inputDate.value = fmt(min);
        if (f > max) inputDate.value = fmt(max);
    });
}

function getRol() {
    const radios = document.querySelectorAll('input[name="rol"]');
    for (const r of radios) if (r.checked) return r.value;
    return null;
}

function getTipo() {
    const radios = document.querySelectorAll('input[name="claseCinturon"]');
    for (const r of radios) if (r.checked) return r.value;
    return null;
}

function showErrorsList(errors) {
    if (!errors || !Array.isArray(errors) || errors.length === 0) return;
    const box = document.getElementById("val-box");
    const msg = document.getElementById("val-msg");
    const list = document.getElementById("val-list");
    if (!box || !msg || !list) return;
    list.textContent = "";
    for (const e of errors) {
        const li = document.createElement("li");
        li.innerText = e;
        list.appendChild(li);
    }
    msg.innerText = "Los siguientes campos son inválidos:";
    box.style.backgroundColor = "#ffdddd";
    box.style.borderLeftColor = "#f44336";
    box.classList.remove("oculto");

    // --- scroll al inicio ---
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function hideErrors() {
    const box = document.getElementById("val-box");
    const msg = document.getElementById("val-msg");
    const list = document.getElementById("val-list");
    if (!box || !msg || !list) return;
    list.textContent = "";
    msg.innerText = "";
    box.classList.add("oculto");
}

const validateForm = () => {
    const form = document.forms["form1"];
    if (!form) return true;
    const name = form["name"];
    const lastname = form["lastname"];
    const rutE = form["rutE"];
    const correo = form["email"];
    const telefono = form["phone"];
    const atanumber = form["atanumber"];
    const bekhonumber = form["bekhonumber"];
    const talla = form["size"];
    const grado = form["cinturon"];
    let invalid = [];
    let itsValid = true;
    const markInvalid = (label, el) => { if (el && el.style) el.style.borderColor = "red"; invalid.push(label); itsValid = false; };

    if (!validateText(name ? name.value : "")) markInvalid("Nombre Estudiante", name); else if (name) name.style.borderColor = "";
    if (!validateText(lastname ? lastname.value : "")) markInvalid("Apellido Estudiante", lastname); else if (lastname) lastname.style.borderColor = "";
    if (!validateRut(rutE ? rutE.value : "")) markInvalid("Rut Estudiante", rutE); else if (rutE) rutE.style.borderColor = "";
    const rol = getRol();
    if (rol === "si") {
        const nameA = form["nameA"], lastnameA = form["lastnameA"], rutA = form["rutA"];
        if (!validateText(nameA ? nameA.value : "")) markInvalid("Nombre Apoderado", nameA); else if (nameA) nameA.style.borderColor = "";
        if (!validateText(lastnameA ? lastnameA.value : "")) markInvalid("Apellido Apoderado", lastnameA); else if (lastnameA) lastnameA.style.borderColor = "";
        if (!validateRut(rutA ? rutA.value : "")) markInvalid("Rut Apoderado", rutA); else if (rutA) rutA.style.borderColor = "";
    }
    if (!validateEmail(correo ? correo.value : "")) markInvalid("Correo", correo); else if (correo) correo.style.borderColor = "";
    if (!validatePhone(telefono ? telefono.value : "")) markInvalid("Teléfono", telefono); else if (telefono) telefono.style.borderColor = "";
    const tipoElegido = getTipo();
    if (!validateSelect(tipoElegido)) {
        markInvalid("Tipo de Cinturón", null);
    } else {
        if (tipoElegido === "color" || tipoElegido === "negro") {
            const programaRegular = form["programaRegular"], programaEspecial = form["programaEspecial"];
            if (!validateSelect(programaRegular ? programaRegular.value : "")) markInvalid("Programa Regular", programaRegular); else if (programaRegular) programaRegular.style.borderColor = "";
            if (!validateSelect(programaEspecial ? programaEspecial.value : "")) markInvalid("Programa Especial", programaEspecial); else if (programaEspecial) programaEspecial.style.borderColor = "";
            if (tipoElegido === "negro") {
                const midterm = form["midterm"];
                if (!validateSelect(midterm ? midterm.value : "")) markInvalid("Midterm", midterm); else if (midterm) midterm.style.borderColor = "";
            }
        }
    }
    if (!validateSelect(grado ? (grado.value || "") : "")) markInvalid("Grado Actual", grado); else if (grado) grado.style.borderColor = "";
    if (!validateNumber(atanumber ? atanumber.value : "")) markInvalid("Número ATA", atanumber); else if (atanumber) atanumber.style.borderColor = "";
    if (!validateNumber(bekhonumber ? bekhonumber.value : "")) markInvalid("Número Bekho", bekhonumber); else if (bekhonumber) bekhonumber.style.borderColor = "";
    if (!validateSelect(talla ? (talla.value || "") : "")) markInvalid("Tamaño del Cinturón", null);
    const social = form["redsocial"];
    if (!validateFile()) markInvalid("Archivo", null);
    if (!validateSocialMedia(social ? social.value : "")) markInvalid("Red Social", social); else if (social) social.style.borderColor = "";

    if (!itsValid) {
        hideErrors();
        showErrorsList(invalid);
        return false;
    } else {
        hideErrors();
        return true;
    }
};

document.addEventListener("DOMContentLoaded", () => {
  const valBox = document.getElementById("val-box");
  const valList = document.getElementById("val-list");
  const hasServerRenderedList = valList && valList.children && valList.children.length > 0;

  if (!hasServerRenderedList && valBox) {
    const raw = valBox.getAttribute("data-server-errors");
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) {
          showErrorsList(arr); 
        }
      } catch (e) {}
    }
  }

  const formEl = document.getElementById("form1");
  const submitBtn = document.getElementById("enviarBtn");

  const submitHandler = (ev) => {
      if (ev && ev.preventDefault) ev.preventDefault();
      const ok = validateForm();
      if (!ok) return;

      // --- Confirmación centrada ---
      if (!formEl) return;
      formEl.style.display = "none";

      const modalConfirm = document.createElement("div");
      modalConfirm.style.position = "fixed";
      modalConfirm.style.top = "50%";
      modalConfirm.style.left = "50%";
      modalConfirm.style.transform = "translate(-50%, -50%)";
      modalConfirm.style.backgroundColor = "#ddffdd";
      modalConfirm.style.borderLeft = "6px solid #04d426";
      modalConfirm.style.padding = "20px";
      modalConfirm.style.borderRadius = "12px";
      modalConfirm.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
      modalConfirm.style.zIndex = 1000;
      modalConfirm.style.maxWidth = "400px";
      modalConfirm.style.width = "90%";
      modalConfirm.style.textAlign = "center";

      const info = document.createElement("p");
      info.innerText = "Formulario válido! Al apretar Confirmar, se registrará el estudiante y volverás al inicio";
      modalConfirm.appendChild(info);

      const confirmBtn = document.createElement("button");
      confirmBtn.type = "button";
      confirmBtn.innerText = "Confirmar";
      confirmBtn.className = "shadow-effect pulse-effect";
      confirmBtn.style.margin = "10px";
      confirmBtn.addEventListener("click", () => {
          const hidden = document.getElementById("client_validated");
          if (hidden) hidden.value = "1";
          formEl.submit();
      });
      modalConfirm.appendChild(confirmBtn);

      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.innerText = "Volver";
      backBtn.className = "shadow-effect pulse-effect";
      backBtn.style.margin = "10px";
      backBtn.addEventListener("click", () => {
          document.body.removeChild(modalConfirm);
          formEl.style.display = "block";
          const allInputs = formEl.querySelectorAll("input, select, textarea");
          allInputs.forEach(input => input.style.borderColor = "");
      });
      modalConfirm.appendChild(backBtn);

      document.body.appendChild(modalConfirm);
  };

  if (submitBtn) submitBtn.addEventListener("click", submitHandler);
  else if (formEl) formEl.addEventListener("submit", submitHandler);
});
