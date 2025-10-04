import re
import filetype
from datetime import datetime
from PIL import Image


def validate_text(value):
    if not value:
        return False
    value = value.strip()
    if len(value) < 3:
        return False
    permitido = re.compile(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$')
    return bool(permitido.fullmatch(value))

def validate_rut(rut):
    if not rut:
        return False
    cleaned = rut.replace(".", "").replace("-", "").upper()
    if len(cleaned) < 2:
        return False
    cuerpo, dv = cleaned[:-1], cleaned[-1].upper()
    try:
        sum_ = 0
        mult = 2
        for digit in reversed(cuerpo):
            sum_ += int(digit) * mult
            mult = mult + 1 if mult < 7 else 2
    except ValueError:
        return False
    dv_real = 11 - (sum_ % 11)
    if dv_real == 11:
        dv_real = "0"
    elif dv_real == 10:
        dv_real = "K"
    else:
        dv_real = str(dv_real)
    return dv == dv_real

def validate_email(email):
    if not email:
        return False
    if len(email) <= 15:
        return False
    pattern = re.compile(r'^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$')
    return bool(pattern.fullmatch(email))

def validate_phone(phone):
    if not phone:
        return False
    phone = phone.strip()
    if len(phone) < 8:
        return False
    return bool(re.fullmatch(r'^[0-9]+$', phone))

def validate_select(value):
    if value is None:
        return False
    return bool(str(value).strip())

def validate_number(value):
    if value is None:
        return False
    value = str(value).strip()
    if value == "":
        return False
    return bool(re.fullmatch(r'^[0-9]+$', value))

def validate_social_media(value):
    if not value:
        return False
    if len(value) <= 3:
        return False
    pattern = re.compile(r'^@[A-Za-z0-9._-]+$')
    return bool(pattern.fullmatch(value))


ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
ALLOWED_MIMETYPES = {"image/jpeg", "image/png"}
MAX_FILE_SIZE = 6 * 1024 * 1024  

def validate_file(file):
    if file is None or file.filename == "":
        return False

    file.stream.seek(0, 2)
    size = file.stream.tell()
    if size > MAX_FILE_SIZE:
        file.stream.seek(0)
        return False
    file.stream.seek(0)

    head = file.stream.read(4096)
    kind = filetype.guess(head)
    if not kind or kind.extension not in ALLOWED_EXTENSIONS or kind.mime not in ALLOWED_MIMETYPES:
        file.stream.seek(0)
        return False

    try:
        file.stream.seek(0)
        img = Image.open(file.stream)
        img.verify()
    except Exception:
        file.stream.seek(0)
        return False

    file.stream.seek(0)
    return True

def validate_date(value):
    if not value:
        return False
    try:
        fecha = datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        return False
    hoy = datetime.today()
    min_fecha = hoy.replace(year=hoy.year - 80)
    max_fecha = hoy.replace(year=hoy.year - 3)
    return min_fecha <= fecha <= max_fecha

def validate_form(form, files=None):
    errors = []

    if not validate_text(form.get("name")):
        errors.append("Nombre Estudiante inválido")
    if not validate_text(form.get("lastname")):
        errors.append("Apellido Estudiante inválido")
    if not validate_rut(form.get("rutE")):
        errors.append("RUT Estudiante inválido")
    if not validate_date(form.get("fechaNacimiento")):
        errors.append("Fecha de Nacimiento inválida")

    rol = form.get("rol")
    if rol == "si":
        if not validate_text(form.get("nameA")):
            errors.append("Nombre Apoderado inválido")
        if not validate_text(form.get("lastnameA")):
            errors.append("Apellido Apoderado inválido")
        if not validate_rut(form.get("rutA")):
            errors.append("RUT Apoderado inválido")

    if not validate_email(form.get("email")):
        errors.append("Correo inválido")
    if not validate_phone(form.get("phone")):
        errors.append("Teléfono inválido")

    claseCinturon = form.get("claseCinturon")
    if not validate_select(claseCinturon):
        errors.append("Tipo de Cinturón inválido")
    else:
        if claseCinturon in ["color", "negro"]:
            if not validate_select(form.get("programaRegular")):
                errors.append("Programa Regular inválido")
            if not validate_select(form.get("programaEspecial")):
                errors.append("Programa Especial inválido")
            if claseCinturon == "negro":
                if not validate_select(form.get("midterm")):
                    errors.append("Midterm inválido")

    if not validate_select(form.get("cinturon")):
        errors.append("Grado Actual inválido")
    if not validate_number(form.get("atanumber")):
        errors.append("Número ATA inválido")
    if not validate_number(form.get("bekhonumber")):
        errors.append("Número Bekho inválido")
    if not validate_select(form.get("size")):
        errors.append("Tamaño del Cinturón inválido")
    if not validate_social_media(form.get("redsocial")):
        errors.append("Red Social inválida")

    archivo = files.get("archivo") if files else None
    if not validate_file(archivo):
        errors.append("Archivo inválido (formato o tamaño incorrecto)")

    return errors
