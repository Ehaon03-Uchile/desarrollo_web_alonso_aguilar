import pymysql
import json
from collections import defaultdict
from datetime import datetime

DB_NAME = "bekho"
DB_USERNAME = "root"
DB_PASSWORD = "root123"
DB_HOST = "localhost"
DB_PORT = 3306
DB_CHARSET = "utf8"

# ==========================
# Cargar queries
# ==========================
with open("database/querys.json", "r", encoding="utf-8") as querys:
    QUERY_DICT = json.load(querys)

def get_conn():
    return pymysql.connect(
        db=DB_NAME,
        user=DB_USERNAME,
        passwd=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        charset=DB_CHARSET
    )

# ==========================
# Funciones para obtener estudiante
# ==========================

def get_student_by_id(id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_student_by_id"], (id,))
    return cursor.fetchone()

def get_student_by_rut(rut):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_student_by_rut"], (rut,))
    return cursor.fetchone()

def get_student_by_email(email):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_student_by_email"], (email,))
    return cursor.fetchone()

def get_student_by_name_lastname(name, lastname):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_student_by_name_lastname"], (name, lastname))
    return cursor.fetchone()

def get_student_by_phone(phone):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_student_by_phone"], (phone,))
    return cursor.fetchone()

def get_student_by_ata(ata_num):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_student_by_ata"], (ata_num,))
    return cursor.fetchone()

def get_student_by_bekho(bekho_num):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_student_by_bekho"], (bekho_num,))
    return cursor.fetchone()

# ==========================
# Crear estudiante (multi-tabla)
# ==========================

def create_student(rut, name, lastname, birth_date, email, phone,
                   name_apoderado, lastname_apoderado, rut_apoderado,
                   regular_program, special_program, cint, midterm, ata_num, bekho_num,
                   social_media=None, img=None, belt_size=None):

    conn = get_conn()
    cursor = conn.cursor()

    # 1. Insertar en estudents_data
    cursor.execute(
        QUERY_DICT["create_student"],
        (rut, name, lastname, birth_date, email, phone)
    )
    estudent_id = cursor.lastrowid  

    # 2. Si tiene apoderado
    if name_apoderado and lastname_apoderado and rut_apoderado:
        cursor.execute(
            QUERY_DICT["create_apoderado"],
            (name_apoderado, lastname_apoderado, rut_apoderado, estudent_id)
        )

    # 3. Federative data (ahora incluye belt_size)
    cursor.execute(
        QUERY_DICT["create_federative_data"],
        (regular_program, special_program, cint, midterm, ata_num, bekho_num, belt_size, estudent_id)
    )

    # 4. Extra 
    cursor.execute(
        QUERY_DICT["create_extra"],
        (social_media or "", img or "", estudent_id)
    )

    conn.commit()
    return estudent_id

# ==========================
# Validación + Registro
# ==========================

def register_student(rut, name, lastname, birth_date, email, phone,
                     name_apoderado, lastname_apoderado, rut_apoderado,
                     regular_program, special_program, cint, midterm, ata_num, bekho_num,
                     social_media=None, img=None, belt_size=None):

    # Validaciones
    if get_student_by_rut(rut) is not None:
        return False, "El RUT ya está registrado."
    if get_student_by_name_lastname(name, lastname) is not None:
        return False, "Ya existe un estudiante con el mismo nombre y apellidos."
    if ata_num != 0 and get_student_by_ata(ata_num) is not None:
        return False, "El número ATA ya está registrado."
    if bekho_num != 0 and get_student_by_bekho(bekho_num) is not None:
        return False, "El número Bekho ya está registrado."

    # Registro real
    create_student(rut, name, lastname, birth_date, email, phone,
                   name_apoderado, lastname_apoderado, rut_apoderado,
                   regular_program, special_program, cint, midterm, ata_num, bekho_num,
                   social_media, img, belt_size)

    return True, None

# ==========================
# Obtener listados
# ==========================

def get_recent_students(limit=5):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_recent_students"], (limit,))
    return cursor.fetchall()

def get_all_students():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(QUERY_DICT["get_all_students"])
    return cursor.fetchall()

# ==========================
# Estadísticas
# ==========================

def classify_cint(cint_value):
    s = str(cint_value)
    if "BD" in s:
        return "negro"
    elif s in ["BLANCO TORTUGA", "BLANCO NARANJO", "BLANCO NARANJO TIGRE", "BLANCO AMARILLO", "BLANCO AMARILLO CHITA", "BLANCO CAMUFLADO", "BLANCO CAMUFLADO LEON", "BLANCO VERDE", "BLANCO VERDE AGUILA", "BLANCO PURPURA", "BLANCO PURPURA FENIX", "BLANCO AZUL", "BLANCO AZUL DRAGON", "BLANCO CAFE" ,"BLANCO CAFE COBRA", "BLANCO ROJO", "BLANCO ROJO PANTERA"]:
        return "tiger"
    else: 
        return "color"


def get_stats_daily(start_date=None, end_date=None):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        sql = """
          SELECT DATE(e.created_at) AS dia,
                 f.cint
          FROM estudents_data e
          JOIN federative_data f ON f.estudent_id = e.id
          WHERE 1=1
        """
        params = []
        if start_date:
            sql += " AND DATE(e.created_at) >= %s"
            params.append(start_date)
        if end_date:
            sql += " AND DATE(e.created_at) <= %s"
            params.append(end_date)
        sql += " ORDER BY dia ASC"
        cursor.execute(sql, tuple(params))
        rows = cursor.fetchall()
        counts = {}
        for dia, cint in rows:
            dia_str = str(dia)
            counts.setdefault(dia_str, 0)
            counts[dia_str] += 1
        return counts
    finally:
        cursor.close()
        conn.close()


def get_stats_totals_by_type():
    conn = get_conn()
    cursor = conn.cursor()
    try:
        sql = """
          SELECT f.cint, COUNT(*) as cnt
          FROM estudents_data e
          JOIN federative_data f ON f.estudent_id = e.id
          GROUP BY f.cint
        """
        cursor.execute(sql)
        rows = cursor.fetchall()
        totals = {"color": 0, "negro": 0, "tiger": 0}
        for cint, cnt in rows:
            cls = classify_cint(cint)
            totals[cls] = totals.get(cls, 0) + int(cnt)
        return totals
    finally:
        cursor.close()
        conn.close()


def get_stats_monthly_by_type(year=None):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        sql = """
          SELECT DATE_FORMAT(e.created_at, '%%Y-%%m') as ym, f.cint, COUNT(*) as cnt
          FROM estudents_data e
          JOIN federative_data f ON f.estudent_id = e.id
        """
        params = []
        if year:
            sql += " WHERE YEAR(e.created_at) = %s"
            params.append(year)
        sql += " GROUP BY ym, f.cint ORDER BY ym ASC"
        cursor.execute(sql, tuple(params))
        rows = cursor.fetchall()
        months = {}
        for ym, cint, cnt in rows:
            cls = classify_cint(cint)
            if ym not in months:
                months[ym] = {"negro": 0, "color": 0, "tiger": 0}
            months[ym][cls] += int(cnt)
        sorted_months = dict(sorted(months.items()))
        return sorted_months
    finally:
        cursor.close()
        conn.close()

# ==========================
# Comentarios / Observaciones
# ==========================
def get_comments(student_id, limit=100):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        sql = """
            SELECT id, nombre, texto, created_at
            FROM comentarios
            WHERE student_id = %s
            ORDER BY created_at DESC
            LIMIT %s
        """
        cursor.execute(sql, (student_id, limit))
        rows = cursor.fetchall()
        comments = []
        for r in rows:
            cid, nombre, texto, created_at = r
            comments.append({
                "id": cid,
                "nombre": nombre,
                "texto": texto,
                "created_at": created_at.strftime("%Y-%m-%d %H:%M:%S") if isinstance(created_at, (datetime,)) else str(created_at)
            })
        return comments
    finally:
        cursor.close()
        conn.close()


def add_comment(student_id, nombre, texto):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        sql = "INSERT INTO comentarios (student_id, nombre, texto) VALUES (%s, %s, %s)"
        cursor.execute(sql, (student_id, nombre, texto))
        conn.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        conn.close()
