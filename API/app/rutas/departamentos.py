from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import obtener_db
from ..modelos.modelos import Departamento, Usuario
from ..esquemas.esquemas import DepartamentoCrear, Departamento as DepartamentoSchema
from ..utilidades.seguridad import obtener_usuario_actual

router = APIRouter(
    prefix="/departamentos",
    tags=["departamentos"],
    dependencies=[Depends(obtener_usuario_actual)]
)

@router.get("/", response_model=List[DepartamentoSchema])
async def obtener_departamentos(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Obtiene la lista de departamentos.
    Solo accesible para usuarios autenticados.
    """
    departamentos = db.query(Departamento).offset(skip).limit(limit).all()
    return departamentos

@router.get("/{id_depa}", response_model=DepartamentoSchema)
async def obtener_departamento(
    id_depa: int, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Obtiene un departamento por su ID.
    Solo accesible para usuarios autenticados.
    """
    departamento = db.query(Departamento).filter(Departamento.id == id_depa).first()
    if departamento is None:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return departamento

@router.post("/", response_model=DepartamentoSchema, status_code=status.HTTP_201_CREATED)
async def crear_departamento(
    departamento: DepartamentoCrear, 
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Crea un nuevo departamento.
    Solo accesible para usuarios autenticados.
    """
    # Verificar si el departamento ya existe
    db_depa = db.query(Departamento).filter(Departamento.depa == departamento.depa).first()
    if db_depa:
        raise HTTPException(status_code=400, detail="El departamento ya existe")
    
    # Crear el departamento
    db_depa = Departamento(**departamento.dict())
    db.add(db_depa)
    db.commit()
    db.refresh(db_depa)
    
    return db_depa

@router.put("/{id_depa}", response_model=DepartamentoSchema)
async def actualizar_departamento(
    id_depa: int,
    departamento_actualizar: DepartamentoCrear,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Actualiza un departamento existente.
    Solo accesible para usuarios autenticados.
    """
    # Obtener el departamento a actualizar
    db_depa = db.query(Departamento).filter(Departamento.id == id_depa).first()
    if db_depa is None:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    
    # Actualizar los campos
    for key, value in departamento_actualizar.dict().items():
        setattr(db_depa, key, value)
    
    db.commit()
    db.refresh(db_depa)
    
    return db_depa

@router.delete("/{id_depa}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_departamento(
    id_depa: int,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    """
    Elimina un departamento (desactivación lógica).
    Solo accesible para usuarios autenticados.
    """
    # Obtener el departamento a eliminar
    db_depa = db.query(Departamento).filter(Departamento.id == id_depa).first()
    if db_depa is None:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    
    # Verificar si hay usuarios con este departamento
    usuarios_con_depa = db.query(Usuario).filter(Usuario.id_depa == id_depa, Usuario.estado == 1).count()
    if usuarios_con_depa > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"No se puede eliminar el departamento porque hay {usuarios_con_depa} usuarios activos asignados a él"
        )
    
    # Desactivar el departamento (eliminación lógica)
    db_depa.estado = 0
    db.commit()
    
    return None