from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import obtener_db
from ..modelos.modelos import Computadora, Usuario
from ..esquemas.esquemas import ComputadoraCrear, ComputadoraActualizar, Computadora as ComputadoraSchema
from ..utilidades.seguridad import obtener_usuario_actual

router = APIRouter(
    prefix="/computadoras",
    tags=["computadoras"],
    dependencies=[Depends(obtener_usuario_actual)]
)

@router.get("/", response_model=List[ComputadoraSchema])
async def listar_computadoras(db: Session = Depends(obtener_db)):
    return db.query(Computadora).filter(Computadora.estado == 1).all()

@router.get("/{id_computadora}", response_model=ComputadoraSchema)
async def obtener_computadora(id_computadora: int, db: Session = Depends(obtener_db)):
    compu = db.query(Computadora).filter(Computadora.id == id_computadora).first()
    if not compu:
        raise HTTPException(status_code=404, detail="Computadora no encontrada")
    return compu

@router.post("/", response_model=ComputadoraSchema, status_code=status.HTTP_201_CREATED)
async def crear_computadora(computadora: ComputadoraCrear, db: Session = Depends(obtener_db)):
    nueva_compu = Computadora(**computadora.dict())
    db.add(nueva_compu)
    db.commit()
    db.refresh(nueva_compu)
    return nueva_compu

@router.put("/{id_computadora}", response_model=ComputadoraSchema)
async def actualizar_computadora(id_computadora: int, datos: ComputadoraActualizar, db: Session = Depends(obtener_db)):
    compu = db.query(Computadora).filter(Computadora.id == id_computadora).first()
    if not compu:
        raise HTTPException(status_code=404, detail="Computadora no encontrada")

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(compu, key, value)
    
    db.commit()
    db.refresh(compu)
    return compu

@router.delete("/{id_computadora}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_computadora(id_computadora: int, db: Session = Depends(obtener_db)):
    compu = db.query(Computadora).filter(Computadora.id == id_computadora).first()
    if not compu:
        raise HTTPException(status_code=404, detail="Computadora no encontrada")
    
    compu.estado = 0
    db.commit()
    return None
