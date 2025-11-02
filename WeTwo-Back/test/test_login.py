import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_login_ok(client):
    """Prueba login exitoso usando la base de datos real de pruebas."""
    response = client.post("/login", json={
        "email": "test@example.com",
        "contraseña": "1234"
    })
    assert response.status_code == 200
    assert b"Login exitoso" in response.data
