import pytest
from app import app

def test_home_route(client):
    """Prueba que la ruta raíz devuelva el mensaje esperado."""
    response = client.get("/")
    assert response.status_code == 200
    assert b"Servidor Flask funcionando" in response.data
