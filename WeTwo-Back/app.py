from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import bcrypt
import os
from dotenv import load_dotenv
import time

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# Configuración mejorada de base de datos

db_config = {
    "host": "10.9.120.5",  # IP directa en lugar de localhost
    "user": "wetwo",
    "password": "wetwo1234", 
    "database": "WeTwo",  # Asegúrate del nombre exacto de la BD
    "port": 3306,
    "use_pure": True,  # Forzar el conector Python puro
    "ssl_disabled": True,  # Deshabilitar SSL
    "connection_timeout": 30
}

def get_db_connection():
    """Función mejorada para obtener conexión con reintentos"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            conn = mysql.connector.connect(**db_config)
            print(f"✅ Conexión a MySQL establecida (intento {attempt + 1})")
            return conn
        except mysql.connector.Error as err:
            print(f"❌ Error de conexión (intento {attempt + 1}): {err}")
            if attempt < max_retries - 1:
                time.sleep(2)  # Esperar 2 segundos antes de reintentar
            else:
                raise err

@app.route("/")
def home():
    return "Servidor Flask funcionando"

# 🔹 Verificar conexión a la base de datos
@app.route("/test-db", methods=["GET"])
def test_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({"message": "✅ Conexión a MySQL exitosa", "result": result})
    except Exception as e:
        return jsonify({"error": f"❌ Error de conexión: {str(e)}"}), 500

# 🔹 Registro normal 
@app.route("/registro", methods=["POST"])
def registro():
    data = request.get_json()
    
    # Validar campos requeridos
    if not all([data.get("nombre"), data.get("email"), data.get("contraseña")]):
        return jsonify({"error": "Faltan campos obligatorios: nombre, email, contraseña"}), 400
    
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar si el email ya existe
        cursor.execute("SELECT email FROM usuarios WHERE email = %s", (data.get("email"),))
        if cursor.fetchone():
            return jsonify({"error": "El email ya está registrado"}), 400
        
        sql = "INSERT INTO usuarios (nombre, email, contraseña) VALUES (%s, %s, %s)"
        cursor.execute(sql, (
            data.get("nombre"),
            data.get("email"),
            data.get("contraseña"),
        ))
        conn.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201
        
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error del servidor: {str(e)}"}), 500
    finally:
        # Cerrar conexiones en el finally para asegurar que siempre se cierren
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# 🔹 Login simplificado
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    contraseña = data.get("contraseña")

    if not email or not contraseña:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT nombre, email, contraseña FROM usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        # Verificar contraseña
        if user["contraseña"] == contraseña:
            user_data = {
                "nombre": user["nombre"],
                "email": user["email"],
            }
            return jsonify({
                "message": "Login exitoso", 
                "usuario": user_data
            }), 200
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
            
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error del servidor: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5000)), debug=True)