from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token, get_jwt_identity, get_jwt, jwt_required, JWTManager
)
import os
from dotenv import load_dotenv
import time
import logging
import secrets

logging.basicConfig(level=logging.DEBUG)
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", secrets.token_hex(32))
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

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
            conn = mysql.connector.connect(**db_config)
            print(f"✅ Conexión a MySQL establecida (intento {attempt + 1})")
            return conn
        except mysql.connector.Error as err:
            print(f"❌ Error de conexión (intento {attempt + 1}): {err}")
            if attempt < max_retries - 1:
                time.sleep(2)
            else:
                raise err


@app.route("/")
def home():
    return "Servidor Flask funcionando"


@app.route("/register", methods=["POST", "OPTIONS"])
def registro():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
        
    data = request.get_json()
    if not data or not all([data.get("nombre"), data.get("email"), data.get("contraseña")]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    nombre = data["nombre"]
    email = data["email"]
    contraseña_plana = data["contraseña"]

    hashed_password = bcrypt.generate_password_hash(contraseña_plana).decode('utf-8')
    connection_code = f"WT-{secrets.token_hex(3).upper()}"

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT email FROM usuarios WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "El email ya está registrado"}), 400

        sql = "INSERT INTO usuarios (nombre, email, contraseña, connection_code) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (nombre, email, hashed_password, connection_code))
        conn.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()


@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
        
    data = request.get_json()
    email = data.get("email")
    contraseña_plana = data.get("contraseña")

    if not email or not contraseña_plana:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nombre, email, contraseña FROM usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if not bcrypt.check_password_hash(user["contraseña"], contraseña_plana):
            return jsonify({"error": "Contraseña incorrecta"}), 401

        # ✅ Token compatible con JWT v4+
        access_token = create_access_token(
            identity=str(user["id"]),
            additional_claims={"email": user["email"]}
        )

        return jsonify({
            "message": "Login exitoso",
            "usuario": {
                "id": user["id"],
                "nombre": user["nombre"],
                "email": user["email"],
            },
            "token": access_token
        }), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()


@app.route("/connect", methods=["POST"])
@jwt_required()
def connect_partner():
    current_user_id = int(get_jwt_identity())  # ✅ ahora es string, convertir a int
    data = request.get_json()
    partner_code = data.get("partner_code")

    if not partner_code:
        return jsonify({"error": "Falta el código de la pareja"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id FROM usuarios WHERE connection_code = %s", (partner_code,))
        partner = cursor.fetchone()

        if not partner:
            return jsonify({"error": "Código de pareja no encontrado"}), 404

        partner_id = partner["id"]

        if partner_id == current_user_id:
            return jsonify({"error": "No puedes conectarte contigo mismo"}), 400

        cursor.execute("UPDATE usuarios SET partner_id = %s WHERE id = %s", (partner_id, current_user_id))
        cursor.execute("UPDATE usuarios SET partner_id = %s WHERE id = %s", (current_user_id, partner_id))
        conn.commit()

        return jsonify({"message": "¡Conectados con éxito!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()


@app.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    current_user_id = int(get_jwt_identity())  # ✅ corregido
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, nombre, email, connection_code, partner_id FROM usuarios WHERE id = %s", (current_user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        partner = None
        if user["partner_id"]:
            cursor.execute("SELECT id, nombre, email, connection_code FROM usuarios WHERE id = %s", (user["partner_id"],))
            partner = cursor.fetchone()

        return jsonify({"user": user, "partner": partner}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5000)), debug=True)

