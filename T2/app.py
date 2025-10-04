import os
import hashlib
from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
from database import db
from utils.validations import validate_form

app = Flask(__name__)
app.secret_key = "s3c3t_k3y"
app.config['MAX_CONTENT_LENGTH'] = 6 * 1024 * 1024


UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/", methods=["GET"])
def index():
    recent_students = db.get_recent_students(limit=5)
    students_data = []
    for idx, student in enumerate(recent_students, start=1):
        student = list(student)
        (
            _id, rut, name, lastname, birth_date, email, phone,
            name_apoderado, lastname_apoderado, rut_apoderado,
            regular_program, special_program, cint, midterm,
            ata_num, bekho_num, social_media, img_path, belt_size
        ) = [value if value is not None else "" for value in student]
        students_data.append({
            "index": idx,
            "full_name": f"{name} {lastname}",
            "cint": cint,
            "regular_program": regular_program,
            "special_program": special_program
        })
    return render_template("index.html", students=students_data)


@app.route("/agregar", methods=["GET", "POST"])
def agregar():
    if request.method == "POST":
        form = {key: request.form.get(key, "").strip() for key in request.form}
        img = request.files.get("archivo")
        errors = validate_form(form, files={"archivo": img} if img else None)

        if errors:
            return render_template("agregar.html", server_errors=errors, form=form)

        if form.get("claseCinturon") == "tiger":
            form["programaRegular"] = "TIGER"
            form["programaEspecial"] = "NO Aplica"

        img_filename = None
        if img and img.filename != "":
            first_bytes = img.read(4096)
            import filetype
            kind = filetype.guess(first_bytes)
            img.seek(0)

            if kind and kind.extension in {"jpg", "jpeg", "png"} and kind.mime in {"image/jpeg", "image/png"}:
                import secrets
                hash_name = hashlib.sha256((secure_filename(img.filename) + secrets.token_hex(8)).encode("utf-8")).hexdigest()
                img_filename = f"{hash_name}.{kind.extension}"
                img.save(os.path.join(app.root_path, app.config["UPLOAD_FOLDER"], img_filename))

        success, msg = db.register_student(
            form["rutE"], form["name"], form["lastname"], form["fechaNacimiento"],
            form["email"], form["phone"],
            form.get("nameA") or None, form.get("lastnameA") or None, form.get("rutA") or None,
            form.get("programaRegular"), form.get("programaEspecial"), form.get("cinturon"),
            form.get("midterm") or None,
            int(form.get("atanumber") or 0),
            int(form.get("bekhonumber") or 0),
            form.get("redsocial") or "", img_filename,
            form.get("size")
        )

        if not success:
            return render_template("agregar.html", server_errors=[msg], form=form)

        return redirect(url_for("index"))

    empty_form = {key: "" for key in ["rutE","name","lastname","fechaNacimiento","email","phone",
                                      "programaRegular","programaEspecial","cinturon","midterm",
                                      "claseCinturon","atanumber","bekhonumber","size",
                                      "nameA","lastnameA","rutA","rol","redsocial"]}
    return render_template("agregar.html", server_errors=None, form=empty_form)


@app.route("/listado", methods=["GET"])
def listado():
    page = request.args.get("page", 1, type=int)
    per_page = 5
    all_students = list(db.get_all_students())
    all_students.sort(key=lambda s: s[0])
    start = (page - 1) * per_page
    end = start + per_page
    students_slice = all_students[start:end]

    students_data = []
    for idx, student in enumerate(students_slice, start=start+1):
        (
            _id, rut, name, lastname, birth_date, email, phone,
            name_apoderado, lastname_apoderado, rut_apoderado,
            regular_program, special_program, cint, midterm,
            ata_num, bekho_num, social_media, img_path, belt_size
        ) = student
        students_data.append({
            "display_index": idx,
            "real_id": _id,
            "full_name": f"{name} {lastname}",
            "birth_date": birth_date,
            "email": email,
            "phone": phone,
            "cint": cint,
            "regular_program": regular_program,
            "special_program": special_program
        })

    total_pages = (len(all_students) + per_page - 1) // per_page
    return render_template("listado.html", data=students_data, page=page, total_pages=total_pages)


@app.route("/estudiante/<int:student_id>", methods=["GET"])
def estudiante(student_id):
    student = db.get_student_by_id(student_id)
    if not student:
        return render_template("datos.html", student=None)

    student = [value if value is not None else "" for value in student]
    (
        _id, rut, name, lastname, birth_date, email, phone,
        name_apoderado, lastname_apoderado, rut_apoderado,
        regular_program, special_program, cint, midterm,
        ata_num, bekho_num, social_media, img_path, belt_size
    ) = student

    from datetime import datetime
    birth_dt = datetime.strptime(str(birth_date), "%Y-%m-%d")
    today = datetime.today()
    edad = today.year - birth_dt.year - ((today.month, today.day) < (birth_dt.month, birth_dt.day))
    tiene_apoderado = bool(name_apoderado.strip() and lastname_apoderado.strip() and rut_apoderado.strip())

    return render_template(
        "datos.html",
        student={
            "id": _id,
            "full_name": f"{name} {lastname}",
            "edad": f"{edad} años",
            "email": email,
            "phone": phone,
            "regular_program": regular_program,
            "special_program": special_program,
            "cint": cint,
            "midterm": midterm,
            "ata_num": ata_num,
            "bekho_num": bekho_num,
            "belt_size": belt_size,
            "tiene_apoderado": tiene_apoderado,
            "name_apoderado": name_apoderado,
            "lastname_apoderado": lastname_apoderado,
            "rut_apoderado": rut_apoderado,
            "img_path": img_path
        }
    )