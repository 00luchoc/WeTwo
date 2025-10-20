import pytest
from app import app

def test_test_db_ok(client, monkeypatch):
    # """Simula una conexión exitosa a la base de datos."""
    # def mock_get_db_connection():
    #     class MockConn:
    #         def cursor(self): return self
    #         def execute(self, query): pass
    #         def fetchone(self): return (1,)
    #         def close(self): pass
    #     return MockConn()

    # monkeypatch.setattr("app.get_db_connection")
    response = client.get("/test-db")
    assert response.status_code == 200
    assert b"MySQL exitosa" in response.data
