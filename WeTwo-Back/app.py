from flask import Flask, request, jsonify
import mysql.connector
from dotenv import load_dotenv
from flask_cors import CORS
import bcrypt
import os

# Cargar variables de entorno (.env)
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite que tu frontend en React acceda a esta API

# Configuración de base de datos
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "port": int(os.getenv("DB_PORT")),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}

def get_connection():
    return mysql.connector.connect(**db_config)

# ------------------- RUTAS -------------------

# ✅ Registrar usuario
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")

    if not (nombre and email and password):
        return jsonify({"error": "Faltan campos"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Verificar si ya existe el email
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"error": "El correo ya está registrado"}), 400

        # Hashear la contraseña antes de guardarla
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        cursor.execute(
            "INSERT INTO usuarios (nombre, email, password) VALUES (%s, %s, %s)",
            (nombre, email, hashed),
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"mensaje": "Usuario registrado con éxito"}), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


# ✅ Login de usuario
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"error": "Faltan campos"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            return jsonify({"mensaje": "Login exitoso", "usuario": user["nombre"]}), 200
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


# ✅ Obtener todos los usuarios (opcional)
@app.route("/usuarios", methods=["GET"])
def get_usuarios():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nombre, email FROM usuarios")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
