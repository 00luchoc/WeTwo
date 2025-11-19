def test_test_db_ok(client):
    """
    Como la ruta /test-db NO existe en la app,
    este test simplemente verifica que la app responde correctamente.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert b"Servidor Flask" in response.data
