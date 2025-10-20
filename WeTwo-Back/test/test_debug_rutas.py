import pytest
from app import app

def test_debug_routes(client):
    """Verifica que la ruta /debug-routes devuelve una lista de rutas."""
    response = client.get("/debug-routes")
    data = response.get_json()
    assert response.status_code == 200
    assert "routes" in data
    assert any("login" in r["path"] for r in data["routes"])
