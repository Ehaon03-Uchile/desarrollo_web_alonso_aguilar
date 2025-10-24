import os
import hashlib
import json
from datetime import datetime, timedelta
from flask import Flask, request, render_template, redirect, url_for, jsonify, make_response, session, abort
from werkzeug.utils import secure_filename
from database import db
from utils.validations import validate_form, validate_text  
from utils.extras import *
from flask_cors import CORS
import html

app = Flask(__name__)
app.secret_key = "s3c3t_k3y"
app.config['MAX_CONTENT_LENGTH'] = 6 * 1024 * 1024

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",   # ejemplo: Vite
            "http://127.0.0.1:5500",   # ejemplo: Live Server
            "https://tusitio.com"      # dominio de producción
        ],
        "supports_credentials": True
    }
})

@app.context_processor
def inject_now():
    return {"now": datetime.utcnow}

@app.before_request
def cargar_tema():
    theme = request.cookies.get('theme')
    if theme:
        session['theme'] = theme
    else:
        session['theme'] = 'light'

@app.route("/set_theme/<string:theme>")
def set_theme(theme):
    if theme not in ['light', 'dark']:
        return jsonify({"error": "Tema inválido"}), 400
    resp = make_response(jsonify({"status": "ok"}))
    resp.set_cookie("theme", theme, max_age=60*60*24*365)
    session['theme'] = theme
    return resp

# --------------- RUTAS ---------------

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
        red_social = str(form.get("redsocial"))
        if red_social != "":
            if "@" not in red_social:
                red_social = "@" + red_social

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
                
        elif img is not None and img.filename == "":
            img_filename = "bekhoLogo.png"

        success, msg = db.register_student(
            form["rutE"], form["name"], form["lastname"], form["fechaNacimiento"],
            form["email"], form["phone"],
            form.get("nameA") or None, form.get("lastnameA") or None, form.get("rutA") or None,
            form.get("programaRegular"), form.get("programaEspecial"), form.get("cinturon"),
            form.get("midterm") or None,
            int(form.get("atanumber") or 0),
            int(form.get("bekhonumber") or 0),
            red_social, img_filename,
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

# --------------------- Listado ------------------

@app.route("/listado", methods=["GET"])
def listado():
    page = request.args.get("page", 1, type=int)
    per_page = 10
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
            "birth_date": parseDate(birth_date),
            "email": email,
            "phone": phone,
            "cint": cint,
            "regular_program": regular_program,
            "special_program": special_program
        })

    total_pages = (len(all_students) + per_page - 1) // per_page
    return render_template("listado.html", data=students_data, page=page, total_pages=total_pages)

@app.route("/api/listado", methods=["GET"])
def api_listado():
    page = request.args.get("page", 1, type=int)
    per_page = 10
    query = (request.args.get("q") or "").strip().lower()
    sort_by = request.args.get("sort_by", "name")  # name, rut, birth_date
    order = request.args.get("order", "asc")       # asc o desc

    all_students = list(db.get_all_students())
    students = []

    for student in all_students:
        (
            _id, rut, name, lastname, birth_date, email, phone,
            name_apoderado, lastname_apoderado, rut_apoderado,
            regular_program, special_program, cint, midterm,
            ata_num, bekho_num, social_media, img_path, belt_size
        ) = student

        # --- Parseo inline y robusto de la fecha (dd-mm-yy, dd-mm-yyyy, yyyy-mm-dd, dd/mm/yyyy, etc.)
        birth_date_obj = None
        try:
            raw = "" if birth_date is None else str(birth_date).strip()
            if raw:
                raw_date = raw.split(" ")[0]
                for fmt in ("%d-%m-%y", "%d-%m-%Y", "%Y-%m-%d", "%d/%m/%Y", "%d/%m/%y"):
                    try:
                        birth_date_obj = datetime.strptime(raw_date, fmt).date()
                        break
                    except Exception:
                        continue
        except Exception:
            birth_date_obj = None

        students.append({
            "real_id": _id,
            "rut": html.escape(rut or ""),
            "full_name": html.escape(f"{name or ''} {lastname or ''}"),
            "birth_date": parseDate(birth_date),      # string para mostrar
            "birth_date_obj": birth_date_obj,         # objeto date para ordenar
            "email": html.escape(email or ""),
            "phone": html.escape(phone or ""),
            "cint": html.escape(cint or ""),
            "regular_program": html.escape(regular_program or ""),
            "special_program": html.escape(special_program or "")
        })

    # --- Filtro de búsqueda ---
    if query:
        students = [
            s for s in students
            if query in s["full_name"].lower()
            or query in s["rut"].lower()
            or query in s["email"].lower()
        ]

    # --- Ordenamiento ---
    reverse = (order == "desc")
    # usamos datetime.min.date() como valor mínimo si birth_date_obj es None
    min_date = datetime.min.date()
    key_map = {
        "name": lambda s: s["full_name"].lower(),
        "rut": lambda s: s["rut"],
        "birth_date": lambda s: s.get("birth_date_obj") or min_date
    }
    if sort_by in key_map:
        students.sort(key=key_map[sort_by], reverse=reverse)

    # --- Paginación ---
    total_pages = (len(students) + per_page - 1) // per_page
    start = (page - 1) * per_page
    end = start + per_page
    students_page = students[start:end]

    # --- Recalcular display_index y limpiar antes de serializar ---
    for idx, s in enumerate(students_page, start=start + 1):
        s["display_index"] = idx
        if "birth_date_obj" in s:
            del s["birth_date_obj"]

    return jsonify({
        "ok": True,
        "data": students_page,
        "page": page,
        "total_pages": total_pages,
    }), 200

# ------------------- Estudiante -----------------------------


@app.route("/estudiante/<int:student_id>", methods=["GET"])
def estudiante(student_id):
    student_row = db.get_student_by_id(student_id)
    if not student_row:
        return render_template("datos.html", student=None)

    student = [value if value is not None else "" for value in student_row]
    (
        _id, rut, name, lastname, birth_date, email, phone,
        name_apoderado, lastname_apoderado, rut_apoderado,
        regular_program, special_program, cint, midterm,
        ata_num, bekho_num, social_media, img_path, belt_size, last_exam
    ) = student

    birth_dt = datetime.strptime(str(birth_date), "%Y-%m-%d")
    today = datetime.today()
    edad = today.year - birth_dt.year - ((today.month, today.day) < (birth_dt.month, birth_dt.day))
    tiene_apoderado = bool(name_apoderado.strip() and lastname_apoderado.strip() and rut_apoderado.strip())
    tiene_socialmedia = True if social_media != "" else False
    last_exam_exists = True if str(last_exam) != "" else False
    if last_exam_exists:
        last_exam = parseDate(str(last_exam).split(" ")[0])

    comments = db.get_comments(_id, limit=200)

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
            "img_path": img_path,
            "tiene_socialmedia": tiene_socialmedia,
            "social_media": social_media,
            "last_exam": last_exam,
            "last_exam_exists": last_exam_exists
        },
        comments=comments
    )

# ----------------- Estadísticas -----------------
@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    current_year = datetime.now().year
    return render_template("estadisticas.html", current_year=current_year)

@app.route("/api/estadisticas/daily", methods=["GET"])
def api_stats_daily():
    try:
        days = int(request.args.get("days", 30))
    except ValueError:
        days = 30
    end_dt = datetime.today()
    start_dt = end_dt - timedelta(days=days-1) if days > 1 else end_dt
    start_str = start_dt.strftime("%Y-%m-%d")
    end_str = end_dt.strftime("%Y-%m-%d")
    rows = db.get_stats_daily(start_date=start_str, end_date=end_str)
    return jsonify({"ok": True, "days": days, "start_date": start_str, "end_date": end_str, "data": rows}), 200

@app.route("/api/estadisticas/by_type", methods=["GET"])
def api_stats_by_type():
    rows = db.get_stats_totals_by_type()
    return jsonify({"ok": True, "data": rows}), 200

@app.route("/api/estadisticas/monthly", methods=["GET"])
def api_stats_monthly():
    try:
        year = int(request.args.get("year", datetime.now().year))
    except ValueError:
        year = datetime.now().year
    rows = db.get_stats_monthly_by_type(year=year)
    return jsonify({"ok": True, "year": year, "data": rows}), 200

# ----------------- Comentarios -----------------
@app.route("/api/comments/<int:student_id>", methods=["GET"])
def api_get_comments(student_id):
    comments = db.get_comments(student_id, limit=500)
    return jsonify({"ok": True, "comments": comments}), 200

@app.route("/api/comments/<int:student_id>", methods=["POST"])
def api_post_comment(student_id):
    if request.is_json:
        payload = request.get_json()
        nombre = (payload.get("nombre") or "").strip()
        texto = (payload.get("texto") or "").strip()
    else:
        nombre = (request.form.get("nombre") or "").strip()
        texto = (request.form.get("texto") or "").strip()

    errors = []

    # Validación acá mismo para no crear otra función :D

    if not nombre or len(nombre) < 3 or len(nombre) > 80 or not validate_text(nombre):
        errors.append("Nombre inválido — 3 a 80 caracteres, solo letras y espacios.")
    if not texto or len(texto) < 4:
        errors.append("Comentario inválido — al menos 4 caracteres.")
    if db.get_student_by_id(student_id) is None:
        errors.append("Estudiante no existe.")

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    c_id = db.add_comment(student_id, nombre, texto)
    comment_obj = {
        "id": c_id,
        "nombre": nombre,
        "texto": texto,
        "created_at": datetime.now().strftime("%d-%m-%Y %H:%M")
    }
    return jsonify({"ok": True, "comment": comment_obj}), 201
