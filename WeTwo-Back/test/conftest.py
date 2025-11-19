import pytest
import sys
import os

# Añadimos el directorio padre al path para poder importar 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, get_db_connection

@pytest.fixture
def client():
    """Crea un cliente de pruebas de Flask."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_firebase_auth(mocker):
    """
    Simula la autenticación de Firebase.
    Intercepta 'app.auth.verify_id_token' para que no llame a Google real.
    """
    return mocker.patch('app.auth.verify_id_token')

@pytest.fixture
def db_cursor():
    """
    Limpia la base de datos antes de cada test para empezar desde cero.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Desactivamos la seguridad de claves foráneas para poder borrar
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    cursor.execute("TRUNCATE TABLE usuarios")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    conn.commit()
    
    yield cursor
    
    cursor.close()
    conn.close()