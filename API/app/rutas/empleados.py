from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import obtener_db
from ..modelos.modelos import Empleado, Departamento, Rol
from ..esquemas.esquemas import EmpleadoCrear, EmpleadoActualizar, Empleado as EmpleadoSchema
from ..utilidades.seguridad import obtener_usuario_actual

router = APIRouter(
    prefix="/empleados",
    tags=["empleados"],
    dependencies=[Depends(obtener_usuario_actual)]
)

@router.get("/", response_model=List[EmpleadoSchema])
async def listar_empleados(db: Session = Depends(obtener_db)):
    return db.query(Empleado).filter(Empleado.estado == 1).all()

@router.get("/{id_empleado}", response_model=EmpleadoSchema)
async def obtener_empleado(id_empleado: int, db: Session = Depends(obtener_db)):
    empleado = db.query(Empleado).filter(Empleado.id == id_empleado).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado

@router.post("/", response_model=EmpleadoSchema, status_code=status.HTTP_201_CREATED)
async def crear_empleado(empleado: EmpleadoCrear, db: Session = Depends(obtener_db)):
    # Verificar que el departamento existe
    departamento = db.query(Departamento).filter(Departamento.id == empleado.id_departamento).first()
    if not departamento:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    
    # Verificar que el rol existe si se proporciona
    if empleado.id_rol:
        rol = db.query(Rol).filter(Rol.id == empleado.id_rol).first()
        if not rol:
            raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    nuevo_empleado = Empleado(**empleado.dict())
    db.add(nuevo_empleado)
    db.commit()
    db.refresh(nuevo_empleado)
    return nuevo_empleado

@router.put("/{id_empleado}", response_model=EmpleadoSchema)
async def actualizar_empleado(id_empleado: int, datos: EmpleadoActualizar, db: Session = Depends(obtener_db)):
    empleado = db.query(Empleado).filter(Empleado.id == id_empleado).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    # Verificar que el departamento existe si se proporciona
    if datos.id_departamento is not None:
        departamento = db.query(Departamento).filter(Departamento.id == datos.id_departamento).first()
        if not departamento:
            raise HTTPException(status_code=404, detail="Departamento no encontrado")
    
    # Verificar que el rol existe si se proporciona
    if datos.id_rol is not None:
        rol = db.query(Rol).filter(Rol.id == datos.id_rol).first()
        if not rol:
            raise HTTPException(status_code=404, detail="Rol no encontrado")

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(empleado, key, value)
    
    db.commit()
    db.refresh(empleado)
    return empleado

@router.delete("/{id_empleado}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_empleado(id_empleado: int, db: Session = Depends(obtener_db)):
    empleado = db.query(Empleado).filter(Empleado.id == id_empleado).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    empleado.estado = 0
    db.commit()
    return None