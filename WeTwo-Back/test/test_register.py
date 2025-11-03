import json
import pytest
from app import get_db_connection

@pytest.fixture
def test_user():
    """Datos del usuario de prueba."""
    return {
        "nombre": "test_user",
        "email": "test@test.com",
        "contraseña": "1234"
    }

def test_register_ok(client, test_user):
    """Prueba el registro y elimina el usuario creado."""
    # --- Limpieza previa ---
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE email = %s", (test_user["email"],))
    conn.commit()

    # --- Ejecutar registro ---
    response = client.post("/register", json=test_user)
    assert response.status_code == 201, f"Error en registro: {response.data}"

    data = json.loads(response.data)
    assert data["message"] == "Usuario registrado con éxito"

    # --- Limpieza posterior ---
    cursor.execute("DELETE FROM usuarios WHERE email = %s", (test_user["email"],))
    conn.commit()

    cursor.close()
    conn.close()
