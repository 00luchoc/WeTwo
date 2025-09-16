from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

# Configuración de la conexión
db_config = {
    "host": "10.9.120.5",
    "user": "wetwo",
    "port": 3306,
    "password": "wetwo1234",
    "database": "WeTwo"
}

@app.route("/")
def home():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(result)   # 🔥 devuelve JSON
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
