import sys, os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app  

@pytest.fixture
def client():
    """Crea un cliente de pruebas de Flask"""
    app.testing = True
    with app.test_client() as client:
        yield client
