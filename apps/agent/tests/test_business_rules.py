import unittest
import os
import json
import uuid
from pathlib import Path
import sys

# Añadir src al path para poder importar lead_store
sys.path.append(str(Path(__file__).parent.parent / "src"))

from lead_store import LocalJsonStore

class TestBusinessRules(unittest.TestCase):
    def setUp(self):
        # Configurar un archivo temporal para las pruebas
        self.test_dir = Path(__file__).parent / "temp_data"
        self.test_dir.mkdir(exist_ok=True)
        self.local_path = self.test_dir / "leads.test.json"
        self.seed_path = self.test_dir / "leads.seed.json"
        
        # Crear un seed vacío
        self.seed_path.write_text("[]", encoding="utf-8")
        
        # Inicializar el store con rutas de prueba
        self.store = LocalJsonStore(local_path=self.local_path, seed_path=self.seed_path)

    def tearDown(self):
        # Limpiar archivos temporales
        if self.local_path.exists():
            self.local_path.unlink()
        if self.seed_path.exists():
            self.seed_path.unlink()
        if self.test_dir.exists():
            self.test_dir.rmdir()

    def test_rn01_initial_status(self):
        """RN01 - Estado Inicial: Todo nuevo lead debe iniciar con 'Not started'."""
        new_lead = {"name": "Test User", "email": "test@example.com"}
        inserted = self.store.insert_lead(new_lead)
        
        self.assertIsNotNone(inserted)
        self.assertEqual(inserted["status"], "Not started", "El estado inicial debe ser 'Not started'")

    def test_rn03_mandatory_fields(self):
        """RN03 - Campos Obligatorios: Simular validación de Name y Email."""
        # En la implementación actual, insert_lead acepta cualquier dict.
        # Vamos a probar que si pasamos los datos, se guardan correctamente.
        # Una mejora de negocio sería que fallara si faltan.
        lead_data = {"name": "Juan Perez", "email": "juan@perez.com"}
        inserted = self.store.insert_lead(lead_data)
        
        self.assertEqual(inserted["name"], "Juan Perez")
        self.assertEqual(inserted["email"], "juan@perez.com")

    def test_rn09_duplicate_prevention_logic(self):
        """RN09 - Simulación de prevención de duplicados por Email."""
        email = "duplicate@example.com"
        self.store.insert_lead({"name": "User 1", "email": email})
        
        # Lógica de negocio: antes de insertar, el agente debería listar y verificar.
        # Aquí probamos que podemos detectar el duplicado en la lista.
        all_leads = self.store.list_leads()
        is_duplicate = any(l.get("email") == email for l in all_leads)
        
        self.assertTrue(is_duplicate, "Debería detectar que el email ya existe")

if __name__ == "__main__":
    unittest.main()
