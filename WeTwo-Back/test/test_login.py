import pytest
from app import app

def test_login_missing_fields(client):
    """Prueba si faltan email o contraseña."""
    response = client.post("/login", json={"email": "test@example.com"})
    assert response.status_code == 400
    assert b"requeridos" in response.data

def test_login_ok(monkeypatch, client):
    """Simula login exitoso."""
    def mock_get_db_connection():
        class MockConn:
            def cursor(self, dictionary=False): return self
            def execute(self, query, params=None): pass
            def fetchone(self): 
                return {"nombre": "User", "email": "test@example.com", "contraseña": "1234"}
            def close(self): pass
            # Simulación de is_connected()
            def is_connected(self):
                return True  # Simulamos que la conexión está activa
        return MockConn()

    monkeypatch.setattr("app.get_db_connection", mock_get_db_connection)
    response = client.post("/login", json={
        "email": "test@example.com",
        "contraseña": "1234"
    })
    assert response.status_code == 200
    assert b"Login exitoso" in response.data
