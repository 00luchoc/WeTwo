import pytest
from app import app

def test_register_missing_fields(client):
    """Prueba cuando faltan campos obligatorios."""
    data = {"nombre": "Test"}
    response = client.post("/register", json=data)
    assert response.status_code == 400
    assert b"Faltan campos obligatorios" in response.data

def test_register_ok(monkeypatch, client):
    """Simula registro exitoso sin conectar a la base de datos real."""

    def mock_get_db_connection():
        class MockConn:
            def cursor(self): return self
            def execute(self, query, params=None):
                if "SELECT email" in query:
                    self._fetchone = None
            def fetchone(self): return self._fetchone
            def close(self): pass
            def commit(self): pass
            # Simulación de is_connected()
            def is_connected(self):
                return True  # Simulamos que la conexión está activa
        return MockConn()

    monkeypatch.setattr("app.get_db_connection", mock_get_db_connection)
    response = client.post("/register", json={
        "nombre": "Test User",
        "email": "test@example.com",
        "contraseña": "1234"
    })
    assert response.status_code == 201
    assert "Usuario registrado con éxito" in response.data.decode('utf-8')

