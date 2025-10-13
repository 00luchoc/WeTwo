from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import bcrypt
import os
from dotenv import load_dotenv
import time
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuración mejorada de base de datos
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
                time.sleep(2)
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

# 🔹 Registro - ambas rutas para compatibilidad
@app.route("/register", methods=["POST", "OPTIONS"])
@app.route("/registro", methods=["POST", "OPTIONS"])
def registro():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
        
    data = request.get_json()
    
    # Log para debugging
    app.logger.info(f"Datos recibidos: {data}")
    
    if not data:
        return jsonify({"error": "No se recibieron datos JSON"}), 400
    
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
        app.logger.error(f"Error de base de datos: {str(err)}")
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    except Exception as e:
        app.logger.error(f"Error del servidor: {str(e)}")
        return jsonify({"error": f"Error del servidor: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# 🔹 Login simplificado
@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
        
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

# 🔹 Ruta para debugging de rutas
@app.route("/debug-routes")
def debug_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "path": str(rule)
        })
    return jsonify({"routes": routes})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5000)), debug=True)