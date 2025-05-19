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

# Esquema para Computadora
class ComputadoraBase(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    serie: Optional[str] = None
    procesador: Optional[str] = None
    ram: Optional[str] = None
    disco_duro: Optional[str] = None
    motherboard: Optional[str] = None
    sistema_operativo: Optional[str] = None
    ip: Optional[str] = None
    estado: int = 1
    ultimo_mantenimiento: Optional[datetime] = None
    id_empleado: Optional[int] = None

class ComputadoraCrear(ComputadoraBase):
    pass

class ComputadoraActualizar(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    serie: Optional[str] = None
    procesador: Optional[str] = None
    ram: Optional[str] = None
    disco_duro: Optional[str] = None
    motherboard: Optional[str] = None
    sistema_operativo: Optional[str] = None
    ip: Optional[str] = None
    estado: Optional[int] = None
    ultimo_mantenimiento: Optional[datetime] = None
    id_empleado: Optional[int] = None

# Esquema para Empleado (actualizado para el frontend)
class EmpleadoBase(BaseModel):
    nombre: str
    correo: EmailStr
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    carnet: Optional[str] = None
    fecha_ingreso: Optional[datetime] = None
    id_departamento: int
    id_rol: Optional[int] = None
    estado: int = 1

class EmpleadoCrear(EmpleadoBase):
    pass

class EmpleadoActualizar(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    carnet: Optional[str] = None
    fecha_ingreso: Optional[datetime] = None
    id_departamento: Optional[int] = None
    id_rol: Optional[int] = None
    estado: Optional[int] = None

# Definición de Computadora para uso en Empleado
class ComputadoraSimple(BaseModel):
    id: int
    marca: Optional[str] = None
    modelo: Optional[str] = None
    serie: Optional[str] = None
    
    class Config:
        orm_mode = True

class Empleado(EmpleadoBase):
    id: int
    departamento: Departamento
    rol: Optional[Rol] = None
    computadoras: List[ComputadoraSimple] = []

    class Config:
        orm_mode = True

# Definición completa de Computadora
class Computadora(ComputadoraBase):
    id: int
    empleado: Optional[Empleado] = None

    class Config:
        orm_mode = True