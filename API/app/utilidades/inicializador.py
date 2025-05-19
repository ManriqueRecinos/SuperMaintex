from sqlalchemy.orm import Session
from ..db.database import SesionLocal
from ..modelos.modelos import Computadora, Empleado, Rol, Departamento, Usuario
from .seguridad import obtener_hash_contrasenia

def crear_datos_iniciales():
    """
    Crea datos iniciales en la base de datos si no existen.
    """
    db = SesionLocal()
    
    try:
        # Verificar si ya existen roles
        roles_count = db.query(Rol).count()
        if roles_count == 0:
            # Crear roles básicos
            roles = [
                Rol(rol="Administrador", descripcion="Acceso completo al sistema"),
                Rol(rol="Técnico", descripcion="Acceso a funciones de mantenimiento"),
                Rol(rol="Usuario", descripcion="Acceso limitado para solicitar servicios")
            ]
            db.add_all(roles)
            db.commit()
            print("Roles iniciales creados")
        
        # Verificar si ya existen departamentos
        departamentos_count = db.query(Departamento).count()
        if departamentos_count == 0:
            # Crear departamentos básicos
            departamentos = [
                Departamento(depa="TI", descripcion="Tecnología de la Información"),
                Departamento(depa="Soporte", descripcion="Soporte Técnico"),
                Departamento(depa="Administración", descripcion="Administración General")
            ]
            db.add_all(departamentos)
            db.commit()
            print("Departamentos iniciales creados")
        
        # Verificar si ya existe un usuario administrador
        admin_exists = db.query(Usuario).filter(Usuario.usuario == "admin").first()
        if not admin_exists:
            # Obtener IDs de rol y departamento
            rol_admin = db.query(Rol).filter(Rol.rol == "Administrador").first()
            depa_ti = db.query(Departamento).filter(Departamento.depa == "TI").first()
            
            if rol_admin and depa_ti:
                # Crear usuario administrador
                admin_user = Usuario(
                    nombre="Administrador",
                    usuario="admin",
                    correo="admin@supermaintex.com",
                    contrasenia=obtener_hash_contrasenia("admin123"),
                    id_rol=rol_admin.id,
                    id_depa=depa_ti.id
                )
                db.add(admin_user)
                db.commit()
                print("Usuario administrador creado")
    
    except Exception as e:
        print(f"Error al crear datos iniciales: {e}")
        db.rollback()
    finally:
        db.close()