"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import { toast } from "react-toastify"
import { Pencil, Trash2, UserPlus, X, Save, Search, AlertTriangle, Key } from "lucide-react"

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [modalPassword, setModalPassword] = useState(false)
  const [usuarioActual, setUsuarioActual] = useState(null)
  const [usuarioEliminar, setUsuarioEliminar] = useState(null)
  const [usuarioPassword, setUsuarioPassword] = useState(null)
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    carnet: "",
    usuario: "",
    contrasenia: "",
    id_rol: "",
    id_depa: "",
    estado: 1,
  })
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(false)

  const obtenerUsuarios = async () => {
    try {
      setCargando(true)
      const response = await API.get("/usuarios")
      setUsuarios(response.data)
    } catch (error) {
      toast.error("Error al obtener usuarios")
    } finally {
      setCargando(false)
    }
  }

  const obtenerRoles = async () => {
    try {
      const response = await API.get("/roles")
      setRoles(response.data)
    } catch (error) {
      toast.error("Error al obtener roles")
    }
  }

  const obtenerDepartamentos = async () => {
    try {
      const response = await API.get("/departamentos")
      setDepartamentos(response.data)
    } catch (error) {
      toast.error("Error al obtener departamentos")
    }
  }

  const eliminarUsuario = async () => {
    try {
      setCargando(true)
      await API.delete(`/usuarios/${usuarioEliminar.id}`)
      toast.success("Usuario eliminado correctamente")
      setModalEliminar(false)
      obtenerUsuarios()
    } catch (error) {
      toast.error("Error al eliminar usuario")
      setCargando(false)
    }
  }

  const confirmarEliminar = (usuario) => {
    setUsuarioEliminar(usuario)
    setModalEliminar(true)
  }

  const agregarUsuario = async () => {
    try {
      setCargando(true)
      await API.post("/usuarios", nuevoUsuario)
      toast.success("Usuario agregado correctamente")
      setModalAgregar(false)
      setNuevoUsuario({
        nombre: "",
        correo: "",
        carnet: "",
        usuario: "",
        contrasenia: "",
        id_rol: "",
        id_depa: "",
        estado: 1,
      })
      obtenerUsuarios()
    } catch (error) {
      toast.error(error.response?.data?.detail || "Error al agregar usuario")
      setCargando(false)
    }
  }

  const editarUsuario = async () => {
    try {
      setCargando(true)
      await API.put(`/usuarios/${usuarioActual.id}`, usuarioActual)
      toast.success("Usuario actualizado correctamente")
      setModalEditar(false)
      obtenerUsuarios()
    } catch (error) {
      toast.error(error.response?.data?.detail || "Error al actualizar usuario")
      setCargando(false)
    }
  }

  const cambiarPassword = async () => {
    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (nuevaPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      setCargando(true)
      await API.put(`/usuarios/${usuarioPassword.id}`, {
        contrasenia: nuevaPassword,
      })
      toast.success("Contraseña actualizada correctamente")
      setModalPassword(false)
      setNuevaPassword("")
      setConfirmarPassword("")
      obtenerUsuarios()
    } catch (error) {
      toast.error(error.response?.data?.detail || "Error al actualizar contraseña")
      setCargando(false)
    }
  }

  const abrirModalEditar = (usuario) => {
    setUsuarioActual({ ...usuario })
    setModalEditar(true)
  }

  const abrirModalPassword = (usuario) => {
    setUsuarioPassword({ ...usuario })
    setNuevaPassword("")
    setConfirmarPassword("")
    setModalPassword(true)
  }

  const handleInputChange = (e, tipo) => {
    const { name, value } = e.target
    if (tipo === "nuevo") {
      setNuevoUsuario({ ...nuevoUsuario, [name]: value })
    } else {
      setUsuarioActual({ ...usuarioActual, [name]: value })
    }
  }

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.carnet?.toLowerCase().includes(busqueda.toLowerCase()),
  )

  useEffect(() => {
    obtenerUsuarios()
    obtenerRoles()
    obtenerDepartamentos()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button
            onClick={() => setModalAgregar(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <UserPlus className="h-4 w-4" />
            Agregar Usuario
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200">#</th>
              <th className="px-6 py-3 border-b border-gray-200">Nombre</th>
              <th className="px-6 py-3 border-b border-gray-200">Correo</th>
              <th className="px-6 py-3 border-b border-gray-200">Carnet</th>
              <th className="px-6 py-3 border-b border-gray-200">Rol</th>
              <th className="px-6 py-3 border-b border-gray-200">Departamento</th>
              <th className="px-6 py-3 border-b border-gray-200 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cargando ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-500">Cargando usuarios...</span>
                  </div>
                </td>
              </tr>
            ) : usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{u.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.correo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.carnet}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {u.rol?.rol || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {u.departamento?.depa || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => abrirModalPassword(u)}
                        disabled={cargando}
                      >
                        <Key className="w-3.5 h-3.5" />
                        Contraseña
                      </button>
                      <button
                        className="flex items-center gap-1 bg-amber-400 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => abrirModalEditar(u)}
                        disabled={cargando}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => confirmarEliminar(u)}
                        disabled={cargando}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No hay usuarios registrados o que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar Usuario */}
      {modalAgregar && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalAgregar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Agregar Nuevo Usuario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoUsuario.nombre}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input
                  type="text"
                  name="usuario"
                  value={nuevoUsuario.usuario}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="contrasenia"
                  value={nuevoUsuario.contrasenia}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={nuevoUsuario.correo}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carnet</label>
                <input
                  type="text"
                  name="carnet"
                  value={nuevoUsuario.carnet}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  name="id_rol"
                  value={nuevoUsuario.id_rol}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.rol}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  name="id_depa"
                  value={nuevoUsuario.id_depa}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un departamento</option>
                  {departamentos.map((depa) => (
                    <option key={depa.id} value={depa.id}>
                      {depa.depa}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalAgregar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarUsuario}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Guardar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {modalEditar && usuarioActual && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalEditar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Editar Usuario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={usuarioActual.nombre || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={usuarioActual.correo || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carnet</label>
                <input
                  type="text"
                  name="carnet"
                  value={usuarioActual.carnet || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  name="id_rol"
                  value={usuarioActual.id_rol || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.rol}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  name="id_depa"
                  value={usuarioActual.id_depa || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un departamento</option>
                  {departamentos.map((depa) => (
                    <option key={depa.id} value={depa.id}>
                      {depa.depa}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalEditar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={editarUsuario}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-500"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {modalEliminar && usuarioEliminar && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar al usuario{" "}
                <span className="font-semibold">{usuarioEliminar.nombre}</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setModalEliminar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarUsuario}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cambiar Contraseña */}
      {modalPassword && usuarioPassword && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalPassword(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Cambiar Contraseña</h3>
            <p className="text-sm text-gray-500 mb-4">
              Cambiando contraseña para el usuario: <span className="font-semibold">{usuarioPassword.nombre}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Repita la contraseña"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalPassword(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={cambiarPassword}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      <span>Actualizar Contraseña</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Usuarios
