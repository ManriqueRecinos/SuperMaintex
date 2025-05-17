from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from .db.database import motor, Base
from .rutas import autenticacion, usuarios, roles, departamentos
from .utilidades.seguridad import obtener_usuario_actual
from .utilidades.inicializador import crear_datos_iniciales

# Cargar variables de entorno
load_dotenv()

# Crear la aplicación FastAPI
app = FastAPI(
    title="SuperMaintex API",
    description="API para el sistema de gestión y seguimiento de mantenimiento de computadoras",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=motor)

# Incluir las rutas
app.include_router(autenticacion.router)
app.include_router(usuarios.router)
app.include_router(roles.router)
app.include_router(departamentos.router)

@app.get("/", tags=["raíz"])
async def raiz():
    """
    Ruta raíz de la API.
    """
    return {
        "mensaje": "Bienvenido a la API de SuperMaintex",
        "documentación": "/docs",
        "versión": "1.0.0",
        "base_de_datos": "Neon PostgreSQL"
    }

@app.get("/protegido", tags=["prueba"])
async def ruta_protegida(usuario_actual = Depends(obtener_usuario_actual)):
    """
    Ruta de prueba que requiere autenticación.
    """
    return {
        "mensaje": "Acceso autorizado",
        "usuario": usuario_actual.usuario,
        "rol": usuario_actual.id_rol
    }

# Inicializar datos si es necesario
@app.on_event("startup")
async def inicializar_datos():
    """
    Crea datos iniciales en la base de datos si no existen.
    """
    crear_datos_iniciales()