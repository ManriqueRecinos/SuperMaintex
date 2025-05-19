"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import { toast } from "react-toastify"
import { Pencil, Trash2, Plus, X, Save, Search, AlertTriangle } from "lucide-react"

function Roles() {
  const [roles, setRoles] = useState([])
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [rolActual, setRolActual] = useState(null)
  const [rolEliminar, setRolEliminar] = useState(null)
  const [nuevoRol, setNuevoRol] = useState({
    rol: "",
    descripcion: "",
    estado: 1,
  })
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(false)

  const obtenerRoles = async () => {
    try {
      setCargando(true)
      const response = await API.get("/roles")
      setRoles(response.data)
    } catch (error) {
      toast.error("Error al obtener roles")
    } finally {
      setCargando(false)
    }
  }

  const eliminarRol = async () => {
    try {
      setCargando(true)
      await API.delete(`/roles/${rolEliminar.id}`)
      toast.success("Rol eliminado correctamente")
      setModalEliminar(false)
      obtenerRoles()
    } catch (error) {
      const mensaje = error.response?.data?.detail || "Error al eliminar rol"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const confirmarEliminar = (rol) => {
    setRolEliminar(rol)
    setModalEliminar(true)
  }

  const agregarRol = async () => {
    try {
      setCargando(true)
      await API.post("/roles", nuevoRol)
      toast.success("Rol agregado correctamente")
      setModalAgregar(false)
      setNuevoRol({
        rol: "",
        descripcion: "",
        estado: 1,
      })
      obtenerRoles()
    } catch (error) {
      const mensaje = error.response?.data?.detail || "Error al agregar rol"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const editarRol = async () => {
    try {
      setCargando(true)
      await API.put(`/roles/${rolActual.id}`, rolActual)
      toast.success("Rol actualizado correctamente")
      setModalEditar(false)
      obtenerRoles()
    } catch (error) {
      const mensaje = error.response?.data?.detail || "Error al actualizar rol"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const abrirModalEditar = (rol) => {
    setRolActual({ ...rol })
    setModalEditar(true)
  }

  const handleInputChange = (e, tipo) => {
    const { name, value } = e.target
    if (tipo === "nuevo") {
      setNuevoRol({ ...nuevoRol, [name]: value })
    } else {
      setRolActual({ ...rolActual, [name]: value })
    }
  }

  const rolesFiltrados = roles.filter(
    (r) =>
      r.rol?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion?.toLowerCase().includes(busqueda.toLowerCase()),
  )

  useEffect(() => {
    obtenerRoles()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Roles</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar rol..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button
            onClick={() => setModalAgregar(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Agregar Rol
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200">#</th>
              <th className="px-6 py-3 border-b border-gray-200">Rol</th>
              <th className="px-6 py-3 border-b border-gray-200">Descripción</th>
              <th className="px-6 py-3 border-b border-gray-200 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cargando ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-500">Cargando roles...</span>
                  </div>
                </td>
              </tr>
            ) : rolesFiltrados.length > 0 ? (
              rolesFiltrados.map((r, index) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{r.rol}</td>
                  <td className="px-6 py-4">{r.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => abrirModalEditar(r)}
                        disabled={cargando}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => confirmarEliminar(r)}
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
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No hay roles registrados o que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar Rol */}
      {modalAgregar && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalAgregar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Agregar Nuevo Rol</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
                <input
                  type="text"
                  name="rol"
                  value={nuevoRol.rol}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={nuevoRol.descripcion}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalAgregar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarRol}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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

      {/* Modal Editar Rol */}
      {modalEditar && rolActual && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalEditar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Editar Rol</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
                <input
                  type="text"
                  name="rol"
                  value={rolActual.rol || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={rolActual.descripcion || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalEditar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={editarRol}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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
      {modalEliminar && rolEliminar && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar el rol <span className="font-semibold">{rolEliminar.rol}</span>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setModalEliminar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarRol}
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
    </div>
  )
}

export default Roles
