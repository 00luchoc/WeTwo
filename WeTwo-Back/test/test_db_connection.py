import pytest
from app import app

def test_test_db_ok(client, monkeypatch):
    response = client.get("/test-db")
    assert response.status_code == 200
    assert b"MySQL exitosa" in response.data
