import os
import time
import logging
import secrets
from functools import wraps

import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- ¡NUEVAS IMPORTACIONES DE FIREBASE! ---
import firebase_admin
from firebase_admin import auth, credentials
# ---------------------------------------

# --- CONFIGURACIÓN DE LOGGING Y FIREBASE ADMIN ---
logging.basicConfig(level=logging.DEBUG)
load_dotenv()

try:
    cred = credentials.Certificate("we-two-firebase-adminsdk.json") 
    firebase_admin.initialize_app(cred)
    print("✅ Firebase Admin SDK inicializado")
except Exception as e:
    print(f"❌ ERROR: No se pudo encontrar 'we-two-firebase-adminsdk.json'.")
    print(f"❌ Error detallado: {e}")
    exit()
# -----------------------------------------------

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- CONFIGURACIÓN DE BASE DE DATOS ---
db_config = {
    "host": "10.9.120.5",
    "user": "wetwo",
    "password": "wetwo1234", 
    "database": "WeTwo",
    "port": 3306,
    "use_pure": True,
    "ssl_disabled": True,
    "connection_timeout": 30
}

def get_db_connection():
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # autocommit=True es clave para que la lógica de /me funcione
            conn = mysql.connector.connect(**db_config, autocommit=True)
            print(f"✅ Conexión a MySQL establecida (intento {attempt + 1})")
            return conn
        except mysql.connector.Error as err:
            print(f"❌ Error de conexión (intento {attempt + 1}): {err}")
            if attempt < max_retries - 1:
                time.sleep(2)
            else:
                raise err

# --- DECORADOR DE AUTENTICACIÓN (El "Portero" de Flask) ---
def firebase_token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"error": "Falta el token de autorización (Bearer token)"}), 401

        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token 
        except Exception as e:
            app.logger.error(f"Error al verificar token: {e}")
            return jsonify({"error": "Token inválido o expirado"}), 401
        
        return f(*args, **kwargs)
    return decorated_function
# ------------------------------------------

@app.route("/")
def home():
    return "Servidor Flask (Híbrido con Firebase) funcionando"

# --- RUTAS /register Y /login ELIMINADAS ---
# Firebase Authentication ahora maneja esto.

@app.route("/connect", methods=["POST"])
@firebase_token_required  # <-- Ruta protegida
def connect_partner():
    current_user_uid = request.user["uid"] 
    data = request.get_json()
    partner_code = data.get("partner_code")

    if not partner_code:
        return jsonify({"error": "Falta el código de la pareja"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id FROM usuarios WHERE connection_code = %s", (partner_code,))
        partner = cursor.fetchone()

        if not partner:
            return jsonify({"error": "Código de pareja no encontrado"}), 404

        partner_id = partner["id"] 

        if partner_id == current_user_uid:
            return jsonify({"error": "No puedes conectarte contigo mismo"}), 400

        cursor.execute("UPDATE usuarios SET partner_id = %s WHERE id = %s", (partner_id, current_user_uid))
        cursor.execute("UPDATE usuarios SET partner_id = %s WHERE id = %s", (current_user_uid, partner_id))
        
        return jsonify({"message": "¡Conectados con éxito!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()


@app.route("/me", methods=["GET"])
@firebase_token_required  # <-- Ruta protegida
def get_me():
    firebase_user = request.user
    current_user_uid = firebase_user["uid"]
    
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. INTENTAR BUSCAR AL USUARIO en MySQL
        cursor.execute("SELECT id, nombre, email, connection_code, partner_id FROM usuarios WHERE id = %s", (current_user_uid,))
        user = cursor.fetchone()

        # 2. SI NO EXISTE, CREARLO (Lógica "Upsert")
        if not user:
            app.logger.info(f"Usuario {current_user_uid} no encontrado. Creando perfil en MySQL...")
            
            email = firebase_user.get("email")
            full_name = firebase_user.get("name", "Usuario Anónimo") 
            nombre = (full_name[:50]) if full_name else "Usuario Anónimo" # Truncamos a 50
            connection_code = f"WT-{secrets.token_hex(3).upper()}"

            sql = "INSERT INTO usuarios (id, nombre, email, connection_code) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (current_user_uid, nombre, email, connection_code))
            
            cursor.execute("SELECT id, nombre, email, connection_code, partner_id FROM usuarios WHERE id = %s", (current_user_uid,))
            user = cursor.fetchone()
            
            if not user:
                 return jsonify({"error": "Error crítico al crear el perfil"}), 500

        # 3. BUSCAR A LA PAREJA (si existe)
        partner = None
        if user["partner_id"]:
            cursor.execute("SELECT id, nombre, email, connection_code FROM usuarios WHERE id = %s", (user["partner_id"],))
            partner = cursor.fetchone()

        # 4. DEVOLVER TODO
        return jsonify({"usuario": user, "partner": partner}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5000)), debug=True)