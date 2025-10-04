import pymysql
import json

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
