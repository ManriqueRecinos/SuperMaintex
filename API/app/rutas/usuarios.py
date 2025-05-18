from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import obtener_db
from ..modelos.modelos import Usuario
from sqlalchemy.orm import joinedload
from ..esquemas.esquemas import UsuarioCrear, Usuario as UsuarioSchema, UsuarioSinSensible, UsuarioActualizar
from ..utilidades.seguridad import obtener_hash_contrasenia, obtener_usuario_actual

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"],
    dependencies=[Depends(obtener_usuario_actual)]
)

@router.get("/", response_model=List[UsuarioSinSensible])
async def obtener_usuarios(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Obtiene la lista de usuarios.
    Solo accesible para usuarios autenticados.
    """
    usuarios = db.query(Usuario).offset(skip).limit(limit).all()
    return usuarios

@router.get("/me", response_model=UsuarioSinSensible)
async def obtener_usuario_propio(usuario_actual: Usuario = Depends(obtener_usuario_actual)):
    """
    Obtiene los datos del usuario autenticado.
    """
    return usuario_actual

@router.get("/{id_usuario}", response_model=UsuarioSchema)
async def obtener_usuario(
    id_usuario: int, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Obtiene un usuario por su ID incluyendo su rol y departamento.
    """
    usuario = db.query(Usuario)\
                .options(joinedload(Usuario.rol), joinedload(Usuario.departamento))\
                .filter(Usuario.id == id_usuario).first()
    
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return usuario

@router.post("/", response_model=UsuarioSinSensible, status_code=status.HTTP_201_CREATED)
async def crear_usuario(
    usuario: UsuarioCrear, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Crea un nuevo usuario.
    Solo accesible para usuarios autenticados.
    """
    # Verificar si el usuario ya existe
    db_usuario = db.query(Usuario).filter(Usuario.usuario == usuario.usuario).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
    
    # Verificar si el correo ya existe
    db_correo = db.query(Usuario).filter(Usuario.correo == usuario.correo).first()
    if db_correo:
        raise HTTPException(status_code=400, detail="El correo ya está en uso")
    
    # Crear el usuario
    contrasenia_hash = obtener_hash_contrasenia(usuario.contrasenia)
    db_usuario = Usuario(
        nombre=usuario.nombre,
        usuario=usuario.usuario,
        correo=usuario.correo,
        contrasenia=contrasenia_hash,
        carnet=usuario.carnet,
        id_rol=usuario.id_rol,
        id_depa=usuario.id_depa,
        estado=usuario.estado
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    
    return db_usuario

@router.put("/{id_usuario}", response_model=UsuarioSinSensible)
async def actualizar_usuario(
    id_usuario: int,
    usuario_actualizar: UsuarioActualizar,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Actualiza un usuario existente.
    Solo accesible para usuarios autenticados.
    """
    # Obtener el usuario a actualizar
    db_usuario = db.query(Usuario).filter(Usuario.id == id_usuario).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Actualizar los campos proporcionados
    usuario_data = usuario_actualizar.dict(exclude_unset=True)
    for key, value in usuario_data.items():
        setattr(db_usuario, key, value)
    
    db.commit()
    db.refresh(db_usuario)
    
    return db_usuario

@router.delete("/{id_usuario}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_usuario(
    id_usuario: int,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Elimina un usuario (desactivación lógica).
    Solo accesible para usuarios autenticados.
    """
    # Obtener el usuario a eliminar
    db_usuario = db.query(Usuario).filter(Usuario.id == id_usuario).first()
    if db_usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Desactivar el usuario (eliminación lógica)
    db_usuario.estado = 0
    db.commit()
    
    return None