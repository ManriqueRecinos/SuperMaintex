from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Obtener la URL de conexión desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_4jHgZsDbPyL3@ep-late-forest-a48unt2c-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require")

# Corregir el prefijo de la URL si es necesario (postgres:// -> postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Crear motor de base de datos para PostgreSQL
motor = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800
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