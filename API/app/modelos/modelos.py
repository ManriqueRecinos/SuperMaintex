from sqlalchemy import Column, Integer,  String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import realationship
from sqlalchemy.sql import func
from ..db.database import Base

class Rol(Base):
    __tablename__ = "rol"

    id == Column(Integer, primary_key=True, index=True, autoincrement=True)
    rol = Column(String, unique=True, nullable=False)
    descripcion = Column(Text, nullable=False)
    estado = Column(Integer, default=1, nullable=False)

    # Relacion con usuarios
    usuarios = relationship("Usuario", back_populates="rol")

    def __repr__(self):
        return f"Rol(id={self.id}, rol{self.rol})"

class Departamento(Base):
    __tablename__ = "departamento"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    depa = Column(String, unique=True, nullable=False)
    descripcion = Column(Text, nullable=False)
    estado = Column(Integer, default=1, nullable=False)

    # Relacion con usuarios
    usuarios = relationship("Usuario", back_populates="departamento")

    def __repr__(self):
        return f"Departamento(id={self.id}, depa={self.depa})"
    
class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    usuario = Column(String, unique=True, nullable=False)
    correo = Column(String, unique=True, nullable=False)
    contrasenia = Column(String, nullable=False)
    carnet = Column(String, nullable=False)
    id_rol = Column(Integer, ForeignKey("rol.id"), nullable=False)
    id_depa = Column(Integer, ForeignKey("departamento.id"), nullable=False)
    estado = Column(Integer, default=1, nullable=False)
    fecha_creacion = Column(DateTime, default=func.now())

    # Relaciones
    rol = relationship("Rol", back_populates="usuarios")
    departamento = relationship("Departamento", back_populates="usuarios")

    def __repr__(self):
        return f"Usuario(id={self.id}, usuario={self.usuario}, correo={self.correo})"
