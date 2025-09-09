from flask import Flask
import mysql.connector

app = Flask(__name__)

# Configuración de la conexión
db_config = {
    "host": "10.9.120.5",
    "user": "wetwo",
    "password": "wetwo1234",
    "database": "db"
}

@app.route("/")
def home():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT NOW();")  # Ejemplo: trae la fecha del servidor
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return f"Conexión exitosa! Hora del servidor: {result[0]}"
    except Exception as e:
        return f"Error conectando a la base de datos: {e}"

if __name__ == "__main__":
    app.run(debug=True)
