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

class ComputadoraBase(BaseModel):
    serie: Optional[str] = None
    nombre: str
    procesador: Optional[str] = None
    ram: Optional[str] = None
    disco_duro: Optional[str] = None
    motherboard: Optional[str] = None
    ip: Optional[str] = None
    estado: int
    ultimo_mantenimiento: Optional[datetime] = None
    id_empleado: Optional[int] = None

class ComputadoraCrear(ComputadoraBase):
    pass

class ComputadoraActualizar(BaseModel):
    serie: Optional[str] = None
    nombre: Optional[str] = None
    procesador: Optional[str] = None
    ram: Optional[str] = None
    disco_duro: Optional[str] = None
    motherboard: Optional[str] = None
    ip: Optional[str] = None
    estado: Optional[int] = None
    ultimo_mantenimiento: Optional[datetime] = None
    id_empleado: Optional[int] = None

class Computadora(ComputadoraBase):
    id: int

    class Config:
        orm_mode = True

class EmpleadoBase(BaseModel):
    nombre: str
    carnet: str
    correo: EmailStr
    id_depa: int
    id_rol: int
    estado: int
    id_computadora: Optional[int]

class EmpleadoCrear(EmpleadoBase):
    pass

class EmpleadoActualizar(BaseModel):
    nombre: Optional[str] = None
    carnet: Optional[str] = None
    correo: Optional[EmailStr] = None
    id_depa: Optional[int] = None
    id_rol: Optional[int] = None
    estado: Optional[int] = None
    id_computadora: Optional[int] = None

class Empleado(EmpleadoBase):
    id: int
    rol: Rol
    departamento: Departamento
    computadora: Optional[Computadora]

    class Config:
        orm_mode = True
