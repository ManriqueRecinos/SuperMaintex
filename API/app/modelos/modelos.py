from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean, Sequence
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.database import Base

class Rol(Base):
    __tablename__ = "rol"
    
    id = Column(Integer, Sequence('rol_id_seq'), primary_key=True, index=True)
    rol = Column(String(100), unique=True, nullable=False)
    descripcion = Column(Text, nullable=True)
    estado = Column(Integer, default=1, nullable=False)
    
    # Relación con usuarios
    usuarios = relationship("Usuario", back_populates="rol")
    
    def __repr__(self):
        return f"Rol(id={self.id}, rol={self.rol})"

class Departamento(Base):
    __tablename__ = "departamento"
    
    id = Column(Integer, Sequence('departamento_id_seq'), primary_key=True, index=True)
    depa = Column(String(100), unique=True, nullable=False)
    descripcion = Column(Text, nullable=True)
    estado = Column(Integer, default=1, nullable=False)
    
    # Relación con usuarios
    usuarios = relationship("Usuario", back_populates="departamento")
    
    def __repr__(self):
        return f"Departamento(id={self.id}, depa={self.depa})"

class Usuario(Base):
    __tablename__ = "usuario"
    
    id = Column(Integer, Sequence('usuario_id_seq'), primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    usuario = Column(String(50), unique=True, nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contrasenia = Column(String(255), nullable=False)
    carnet = Column(String(20), nullable=True)
    id_rol = Column(Integer, ForeignKey("rol.id"), nullable=False)
    id_depa = Column(Integer, ForeignKey("departamento.id"), nullable=False)
    estado = Column(Integer, default=1, nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), default=func.now())
    
    # Relaciones
    rol = relationship("Rol", back_populates="usuarios")
    departamento = relationship("Departamento", back_populates="usuarios")
    
    def __repr__(self):
        return f"Usuario(id={self.id}, usuario={self.usuario}, correo={self.correo})"