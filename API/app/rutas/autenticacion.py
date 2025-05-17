from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ..db.database import obtener_db
from ..modelos.modelos import Usuario
from ..esquemas.esquemas import Token
from ..utilidades.seguridad import (
    verificar_contrasenia,
    crear_token_acceso,
    TIEMPO_EXPIRACION_TOKEN
)

router = APIRouter(tags=["autenticación"])

@router.post("/token", response_model=Token)
async def login_para_token_acceso(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(obtener_db)
):
    """
    Autentica al usuario y genera un token JWT.
    """
    # Buscar usuario por nombre de usuario
    usuario = db.query(Usuario).filter(Usuario.usuario == form_data.username).first()
    
    # Verificar si el usuario existe y la contraseña es correcta
    if not usuario or not verificar_contrasenia(form_data.password, usuario.contrasenia):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar si el usuario está activo
    if usuario.estado != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    
    # Crear token de acceso
    tiempo_expiracion = timedelta(minutes=TIEMPO_EXPIRACION_TOKEN)
    access_token = crear_token_acceso(
        datos={"sub": str(usuario.id)},
        tiempo_expiracion=tiempo_expiracion
    )
    
    return {"access_token": access_token, "token_type": "bearer"}