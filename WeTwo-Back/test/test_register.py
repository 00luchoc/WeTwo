import json
import pytest

def test_register_ok(client):
    response = client.post("/register", json={
        "nombre": "test",
        "email": "test@test.com",
        "contraseña": "1234"
    })
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["message"] == "Usuario registrado con éxito"

    # Elimina residuos del test
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE email = %s", ("test@example.com",))
    conn.commit()
    cursor.close()
    conn.close()
