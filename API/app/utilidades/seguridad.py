from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..db.database import obtener_db
from ..modelos.modelos import Usuario
from ..esquemas.esquemas import TokenDatos

# Configuracion de seguridad
ALGORITMO = "HS256"
CLAVE_SECRETA = "supersecret"
TIEMPO_EXPIRACION_TOKEN = 30  # minutos

# Contexto para hash de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 con flujo de contraseña
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Funciones de utilidad
def verificar_contrasenia(contrasenia_plana, contrasenia_hash):
    """Verifica si la contraseña plana coincide con el hash."""
    return pwd_context.verify(contrasenia_plana, contrasenia_hash)

def obtener_hash_contrasenia(contrasenia):
    """Genera un hash de la contraseña."""
    return pwd_context.hash(contrasenia)

def crear_token_acceso(datos: dict, tiempo_expiracion: Optional[datetime] = None):
    """Crea un token JWT de acceso."""
    datos_codificar = datos.copy()

    if tiempo_expiracion:
        expiracion = datetime.utcnow() + tiempo_expiracion
    else:
        expiracion = datetime.utcnow() + timedelta(minutes=TIEMPO_EXPIRACION_TOKEN)

    datos_codificar.update({"exp": expiracion})
    token_jwt = jwt.encode(datos_codificar, CLAVE_SECRETA, algorithm=ALGORITMO)

    return token_jwt

def verificar_token_acceso(token: str = Depends(oauth2_sscheme), db: Session = Depends(obtener_db)):
    """Verifica el token JW y retorna loss datos del usuario."""
    credenciales_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        heaaders={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decodificar el token
        payload = jwt.decode(token, CLAVE_SECRETA, algorithms=[ALGORITMO])
        id_usuario: int = payload.get("sub")

        if id_usuario is None:
            raise credenciales_exception
        
        token_datos = TokenDatos(id_usuario=id_usuario)
    except JWTError:
        raise credenciales_exception
    
    # Verificar que el usuario existe en la basse de datos
    usuario = db.query(Usuario).filter(Usuario.id == token_datos.id_usuario).first()
    if usuario is None:
        raise credenciales_exception
    
    return usuario

def obtener_usuario_actual(usuario_actual: Usuario = Depends(verificar_token_acceso)):
    """Retorna el usuario actual autenticado."""
    if usuario_actual.estado != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo",
        )
    return usuario_actual