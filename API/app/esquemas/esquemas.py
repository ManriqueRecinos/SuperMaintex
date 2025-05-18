from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Esquemas para Rol
class RolBase(BaseModel):
    rol: str
    descripcion: Optional[str] = None
    estado: int = 1

class RolCrear(RolBase):
    pass

class Rol(RolBase):
    id: int
    
    class Config:
        orm_mode = True

# Esquemas para Departamento
class DepartamentoBase(BaseModel):
    depa: str
    descripcion: Optional[str] = None
    estado: int = 1

class DepartamentoCrear(DepartamentoBase):
    pass

class Departamento(DepartamentoBase):
    id: int
    
    class Config:
        orm_mode = True

# Esquemas para Usuario
class UsuarioBase(BaseModel):
    nombre: str
    usuario: str
    correo: EmailStr
    carnet: Optional[str] = None
    id_rol: int
    id_depa: int
    estado: int = 1

class UsuarioCrear(UsuarioBase):
    contrasenia: str

class UsuarioActualizar(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    carnet: Optional[str] = None
    id_rol: Optional[int] = None
    id_depa: Optional[int] = None
    estado: Optional[int] = None

class Usuario(UsuarioBase):
    id: int
    fecha_creacion: datetime
    rol: Rol
    departamento: Departamento

    class Config:
        orm_mode = True

class UsuarioSinSensible(BaseModel):
    id: int
    nombre: str
    usuario: str
    correo: EmailStr
    carnet: Optional[str]
    rol: Rol
    departamento: Departamento
    estado: int
    fecha_creacion: datetime
    
    class Config:
        orm_mode = True

# Esquemas para autenticación
class CredencialesLogin(BaseModel):
    usuario: str
    contrasenia: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenDatos(BaseModel):
    id_usuario: Optional[int] = None