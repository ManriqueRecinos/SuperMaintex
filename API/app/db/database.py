from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Ruta de la base de datos
DIRECTORIO_BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RUTA_BD = os.path.join(DIRECTORIO_BASE, "supermaintex.db")

# Crear URL de conexión
SQLALCHEMY_DATABASE_URL = f"sqlite:///{RUTA_BD}"

# Crear motor de base de datos
motor = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Crear sesión
SesionLocal = sessionmaker(autocommit=False, autoflush=False, bind=motor)

# Crear base para modelos
Base = declarative_base()

# Función para obtener la sesión de base de datos
def obtener_db():
    db = SesionLocal()
    try:
        yield db
    finally:
        db.close()