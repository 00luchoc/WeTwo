# test/test_connect.py
from unittest.mock import patch

def test_connect_success(client, db_cursor):
    """
    Julieta conecta con Alex. Caso de éxito real.
    """

    # Limpieza
    db_cursor.execute("DELETE FROM usuarios WHERE id IN ('uid_juli', 'uid_alex')")
    db_cursor._connection.commit()

    sql = "INSERT INTO usuarios (id, nombre, email, connection_code) VALUES (%s,%s,%s,%s)"

    db_cursor.execute(sql, ("uid_juli", "Julieta", "juli@test.com", "WT-JULI"))
    db_cursor.execute(sql, ("uid_alex", "Alex", "alex@test.com", "WT-ALEX"))
    db_cursor._connection.commit()

    mock_token = {"uid": "uid_juli"}

    with patch("app.auth.verify_id_token", return_value=mock_token):
        response = client.post(
            "/connect",
            json={"partner_code": "WT-ALEX"},
            headers={"Authorization": "Bearer token"}
        )

    assert response.status_code == 200
    assert response.get_json()["message"] == "¡Conectados con éxito!"


def test_connect_codigo_inexistente(client, db_cursor):
    """
    Intento de conectar con un código inexistente.
    """
    mock_token = {"uid": "uid_nonexist"}

    with patch("app.auth.verify_id_token", return_value=mock_token):
        res = client.post(
            "/connect",
            json={"partner_code": "NOPE"},
            headers={"Authorization": "Bearer X"}
        )

    assert res.status_code == 404


def test_connect_con_uno_mismo(client, db_cursor):
    """
    No se puede conectar con uno mismo.
    """

    # Limpieza
    db_cursor.execute("DELETE FROM usuarios WHERE id = 'uid_self'")
    db_cursor._connection.commit()

    db_cursor.execute(
        "INSERT INTO usuarios (id, nombre, email, connection_code) VALUES (%s,%s,%s,%s)",
        ("uid_self", "Yo Mismo", "yo@test.com", "WT-SELF")
    )
    db_cursor._connection.commit()

    mock_token = {"uid": "uid_self"}

    with patch("app.auth.verify_id_token", return_value=mock_token):
        res = client.post(
            "/connect",
            json={"partner_code": "WT-SELF"},
            headers={"Authorization": "Bearer tok"}
        )

    assert res.status_code == 400
    assert "contigo mismo" in res.get_json()["error"]
