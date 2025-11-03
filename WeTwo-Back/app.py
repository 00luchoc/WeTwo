from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import os
from dotenv import load_dotenv
import time
import logging
import secrets  # Para generar códigos seguros

# Configurar logging
logging.basicConfig(level=logging.DEBUG)

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- 1. CONFIGURACIÓN DE SEGURIDAD ---
# Clave secreta para JWT. ¡Cámbiala por algo seguro en producción!
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", secrets.token_hex(32))
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
# -----------------------------------

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

# 🔹 Registro - ACTUALIZADO con Seguridad y Código de Conexión
@app.route("/register", methods=["POST", "OPTIONS"])
def registro():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
        
    data = request.get_json()
    app.logger.info(f"Datos recibidos: {data}")
    
    if not data or not all([data.get("nombre"), data.get("email"), data.get("contraseña")]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    
    nombre = data.get("nombre")
    email = data.get("email")
    contraseña_plana = data.get("contraseña")

    # Hashear la contraseña (asegurando que sea bytes)
    hashed_password_bytes = bcrypt.generate_password_hash(contraseña_plana.encode('utf-8'))
    # Decodificar a string para guardarlo en la BD (VARCHAR)
    hashed_password = hashed_password_bytes.decode('utf-8')
    
    # Generar un código de conexión único
    connection_code = f"WT-{secrets.token_hex(3).upper()}"

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT email FROM usuarios WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "El email ya está registrado"}), 400
        
        # Insertar el usuario con la contraseña hasheada y el código
        sql = "INSERT INTO usuarios (nombre, email, contraseña, connection_code) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (
            nombre,
            email,
            hashed_password,  # Guardar la contraseña hasheada (como string)
            connection_code
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
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()

# 🔹 Login - ACTUALIZADO con Seguridad, Token JWT y parche "Invalid Salt"
@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
        
    data = request.get_json()
    email = data.get("email")
    contraseña_plana = data.get("contraseña")

    if not email or not contraseña_plana:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Obtener la contraseña HASHEADA de la BD
        cursor.execute("SELECT id, nombre, email, contraseña FROM usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        # --- INICIO DE LA CORRECCIÓN "Invalid Salt" y Encoding ---
        pw_hash_from_db_str = user["contraseña"]
        
        # 1. Asegurarnos de que el hash de la BD sea bytes
        if isinstance(pw_hash_from_db_str, bytes):
            pw_hash_bytes = pw_hash_from_db_str
        else:
            pw_hash_bytes = pw_hash_from_db_str.encode('utf-8')
            
        # 2. Asegurarnos de que la contraseña plana sea bytes
        contraseña_plana_bytes = contraseña_plana.encode('utf-8')

        is_valid = False # Asumir que no es válida por defecto
        try:
            # 3. Comparar bytes con bytes
            is_valid = bcrypt.check_password_hash(pw_hash_bytes, contraseña_plana_bytes)
        except ValueError as e:
            # Esto atrapa el "Invalid salt" si es texto plano o un hash corrupto
            app.logger.warning(f"Intento de login para {email} con un hash inválido (probablemente texto plano). Error: {e}")
            # is_valid se mantiene como False
        # --- FIN DE LA CORRECCIÓN ---

        if is_valid:
            
            # ¡Crear el token!
            access_token = create_access_token(identity=str(user["id"]))
            
            user_data = {
                "id": user["id"],
                "nombre": user["nombre"],
                "email": user["email"],
            }
            return jsonify({
                "message": "Login exitoso", 
                "usuario": user_data,
                "token": access_token  # Devolver el token al frontend
            }), 200
        else:
            return jsonify({"error": "Contraseña incorrecta"}), 401
            
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error del servidor: {str(e)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()

# 🔹 Conectar usuarios
@app.route("/connect", methods=["POST"])
@jwt_required()  # Protegida: solo usuarios logueados pueden conectar
def connect_partner():
    # Obtener el usuario actual desde el token JWT
    current_user_id = get_jwt_identity()["id"]
    
    data = request.get_json()
    partner_code = data.get("partner_code")

    if not partner_code:
        return jsonify({"error": "Falta el código de la pareja"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. Buscar a la pareja por su código
        cursor.execute("SELECT id FROM usuarios WHERE connection_code = %s", (partner_code,))
        partner = cursor.fetchone()

        if not partner:
            return jsonify({"error": "Código de pareja no encontrado"}), 404
        
        partner_id = partner["id"]

        if partner_id == current_user_id:
            return jsonify({"error": "No puedes conectarte contigo mismo"}), 400

        # 2. Conectar a los usuarios (actualización mutua)
        cursor.execute("UPDATE usuarios SET partner_id = %s WHERE id = %s", (partner_id, current_user_id))
        cursor.execute("UPDATE usuarios SET partner_id = %s WHERE id = %s", (current_user_id, partner_id))
        
        conn.commit()
        
        return jsonify({"message": "¡Conectados con éxito!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()

# 🔹 Obtener datos del usuario y su pareja
@app.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()["id"]
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # 1. Buscar al usuario actual
        cursor.execute("SELECT id, nombre, email, connection_code, partner_id FROM usuarios WHERE id = %s", (current_user_id,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
            
        partner = None
        if user["partner_id"]:
            # 2. Si tiene pareja, buscar los datos de la pareja
            cursor.execute("SELECT id, nombre, email, connection_code FROM usuarios WHERE id = %s", (user["partner_id"],))
            partner = cursor.fetchone()
            
        return jsonify({
            "user": user,
            "partner": partner
        }), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de base de datos: {str(err)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()

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

def create_app():
    return app 

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5000)), debug=True)

