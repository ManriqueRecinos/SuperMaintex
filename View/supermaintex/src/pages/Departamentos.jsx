"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import { toast } from "react-toastify"
import { Pencil, Trash2, Plus, X, Save, Search, AlertTriangle } from "lucide-react"

function Departamentos() {
  const [departamentos, setDepartamentos] = useState([])
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [departamentoActual, setDepartamentoActual] = useState(null)
  const [departamentoEliminar, setDepartamentoEliminar] = useState(null)
  const [nuevoDepartamento, setNuevoDepartamento] = useState({
    depa: "",
    descripcion: "",
    estado: 1,
  })
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(false)

  const obtenerDepartamentos = async () => {
    try {
      setCargando(true)
      const response = await API.get("/departamentos")
      setDepartamentos(response.data)
    } catch (error) {
      toast.error("Error al obtener departamentos")
    } finally {
      setCargando(false)
    }
  }

  const eliminarDepartamento = async () => {
    try {
      setCargando(true)
      await API.delete(`/departamentos/${departamentoEliminar.id}`)
      toast.success("Departamento eliminado correctamente")
      setModalEliminar(false)
      obtenerDepartamentos()
    } catch (error) {
      const mensaje = error.response?.data?.detail || "Error al eliminar departamento"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const confirmarEliminar = (departamento) => {
    setDepartamentoEliminar(departamento)
    setModalEliminar(true)
  }

  const agregarDepartamento = async () => {
    try {
      setCargando(true)
      await API.post("/departamentos", nuevoDepartamento)
      toast.success("Departamento agregado correctamente")
      setModalAgregar(false)
      setNuevoDepartamento({
        depa: "",
        descripcion: "",
        estado: 1,
      })
      obtenerDepartamentos()
    } catch (error) {
      const mensaje = error.response?.data?.detail || "Error al agregar departamento"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const editarDepartamento = async () => {
    try {
      setCargando(true)
      await API.put(`/departamentos/${departamentoActual.id}`, departamentoActual)
      toast.success("Departamento actualizado correctamente")
      setModalEditar(false)
      obtenerDepartamentos()
    } catch (error) {
      const mensaje = error.response?.data?.detail || "Error al actualizar departamento"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const abrirModalEditar = (departamento) => {
    setDepartamentoActual({ ...departamento })
    setModalEditar(true)
  }

  const handleInputChange = (e, tipo) => {
    const { name, value } = e.target
    if (tipo === "nuevo") {
      setNuevoDepartamento({ ...nuevoDepartamento, [name]: value })
    } else {
      setDepartamentoActual({ ...departamentoActual, [name]: value })
    }
  }

  const departamentosFiltrados = departamentos.filter(
    (d) =>
      d.depa?.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.descripcion?.toLowerCase().includes(busqueda.toLowerCase()),
  )

  useEffect(() => {
    obtenerDepartamentos()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Departamentos</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar departamento..."
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
            Agregar Departamento
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200">#</th>
              <th className="px-6 py-3 border-b border-gray-200">Departamento</th>
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
                    <span className="ml-2 text-gray-500">Cargando departamentos...</span>
                  </div>
                </td>
              </tr>
            ) : departamentosFiltrados.length > 0 ? (
              departamentosFiltrados.map((d, index) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{d.depa}</td>
                  <td className="px-6 py-4">{d.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => abrirModalEditar(d)}
                        disabled={cargando}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => confirmarEliminar(d)}
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
                  No hay departamentos registrados o que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar Departamento */}
      {modalAgregar && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalAgregar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Agregar Nuevo Departamento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Departamento</label>
                <input
                  type="text"
                  name="depa"
                  value={nuevoDepartamento.depa}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={nuevoDepartamento.descripcion}
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
                  onClick={agregarDepartamento}
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

      {/* Modal Editar Departamento */}
      {modalEditar && departamentoActual && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalEditar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Editar Departamento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Departamento</label>
                <input
                  type="text"
                  name="depa"
                  value={departamentoActual.depa || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={departamentoActual.descripcion || ""}
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
                  onClick={editarDepartamento}
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
      {modalEliminar && departamentoEliminar && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar el departamento{" "}
                <span className="font-semibold">{departamentoEliminar.depa}</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setModalEliminar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarDepartamento}
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

export default Departamentos
