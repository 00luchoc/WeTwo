from flask import Flask, jsonify
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "port": int(os.getenv("DB_PORT")),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}

print(db_config)

def get_connection():
    return mysql.connector.connect(**db_config)

# ------------------- RUTAS -------------------

# GET por obtener todos los usuarios
@app.route("/usuarios", methods=["GET"])
def get_usuarios():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# POST para agregar un usuario (INSERT)
@app.route("/usuarios", methods=["POST"])
def add_usuario():
    data = request.get_json()  # se espera un JSON { "nombre": "...", "email": "..." }
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO usuarios (nombre, email) VALUES (%s, %s)",
            (data["nombre"], data["email"])
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Usuario agregado correctamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# DELETE - eliminar un usuario por ID
@app.route("/usuarios/<int:usuario_id>", methods=["DELETE"])
def delete_usuario(usuario_id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (usuario_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": f"Usuario {usuario_id} eliminado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500