# test/test_auth.py
import pytest
from unittest.mock import patch

def test_me_crea_usuario_si_no_existe(client, db_cursor):
    """
    Caso: /me debe crear un usuario nuevo si no existe en MySQL.
    """

    # Limpieza
    db_cursor.execute("DELETE FROM usuarios WHERE id = 'uid_test'")
    db_cursor._connection.commit()

    # Mock token Firebase
    mock_token = {
        "uid": "uid_test",
        "email": "nuevo@test.com",
        "name": "Nuevo Usuario"
    }

    with patch("app.auth.verify_id_token", return_value=mock_token):
        response = client.get("/me", headers={"Authorization": "Bearer faketoken"})

    assert response.status_code == 200
    data = response.get_json()

    assert data["usuario"]["id"] == "uid_test"
    assert data["usuario"]["email"] == "nuevo@test.com"
    assert "WT-" in data["usuario"]["connection_code"]


def test_me_retorna_perfil_existente(client, db_cursor):
    """
    Caso: /me devuelve un usuario existente si ya está creado.
    """

    # Crear usuario manualmente
    sql = "INSERT INTO usuarios (id, nombre, email, connection_code) VALUES (%s,%s,%s,%s)"
    db_cursor.execute(sql, ("uid_exist", "Julieta", "juli@test.com", "WT-123456"))
    db_cursor._connection.commit()

    mock_token = {
        "uid": "uid_exist",
        "email": "juli@test.com",
        "name": "Julieta"
    }

    with patch("app.auth.verify_id_token", return_value=mock_token):
        response = client.get("/me", headers={"Authorization": "Bearer tok"})
    
    data = response.get_json()
    assert response.status_code == 200
    assert data["usuario"]["nombre"] == "Julieta"
