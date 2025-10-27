import json

def test_register_ok(monkeypatch, client):
    ...
    response = client.post("/register", json={
        "nombre": "Test User",
        "email": "test@example.com",
        "contraseña": "1234"
    })
    assert response.status_code == 201

    data = json.loads(response.data)
    assert data["message"] == "Usuario registrado con éxito"
