from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import obtener_db
from ..modelos.modelos import Rol, Usuario
from ..esquemas.esquemas import RolCrear, Rol as RolSchema
from ..utilidades.seguridad import obtener_usuario_actual

router = APIRouter(
    prefix="/roles",
    tags=["roles"],
    dependencies=[Depends(obtener_usuario_actual)]
)

@router.get("/", response_model=List[RolSchema])
async def obtener_roles(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Obtiene la lista de roles.
    Solo accesible para usuarios autenticados.
    """
    roles = db.query(Rol).offset(skip).limit(limit).all()
    return roles

@router.get("/{id_rol}", response_model=RolSchema)
async def obtener_rol(
    id_rol: int, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Obtiene un rol por su ID.
    Solo accesible para usuarios autenticados.
    """
    rol = db.query(Rol).filter(Rol.id == id_rol).first()
    if rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol

@router.post("/", response_model=RolSchema, status_code=status.HTTP_201_CREATED)
async def crear_rol(
    rol: RolCrear, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Crea un nuevo rol.
    Solo accesible para usuarios autenticados.
    """
    # Verificar si el rol ya existe
    db_rol = db.query(Rol).filter(Rol.rol == rol.rol).first()
    if db_rol:
        raise HTTPException(status_code=400, detail="El rol ya existe")
    
    # Crear el rol
    db_rol = Rol(**rol.dict())
    db.add(db_rol)
    db.commit()
    db.refresh(db_rol)
    
    return db_rol

@router.put("/{id_rol}", response_model=RolSchema)
async def actualizar_rol(
    id_rol: int,
    rol_actualizar: RolCrear,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Actualiza un rol existente.
    Solo accesible para usuarios autenticados.
    """
    # Obtener el rol a actualizar
    db_rol = db.query(Rol).filter(Rol.id == id_rol).first()
    if db_rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    # Actualizar los campos
    for key, value in rol_actualizar.dict().items():
        setattr(db_rol, key, value)
    
    db.commit()
    db.refresh(db_rol)
    
    return db_rol

@router.delete("/{id_rol}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_rol(
    id_rol: int,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Elimina un rol (desactivación lógica).
    Solo accesible para usuarios autenticados.
    """
    # Obtener el rol a eliminar
    db_rol = db.query(Rol).filter(Rol.id == id_rol).first()
    if db_rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    # Verificar si hay usuarios con este rol
    usuarios_con_rol = db.query(Usuario).filter(Usuario.id_rol == id_rol, Usuario.estado == 1).count()
    if usuarios_con_rol > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"No se puede eliminar el rol porque hay {usuarios_con_rol} usuarios activos asignados a él"
        )
    
    # Desactivar el rol (eliminación lógica)
    db_rol.estado = 0
    db.commit()
    
    return None