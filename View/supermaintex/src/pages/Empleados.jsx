"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import { toast } from "react-toastify"
import { Pencil, Trash2, Plus, X, Save, Search, AlertTriangle } from 'lucide-react'

function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [roles, setRoles] = useState([]) // Estado para almacenar los roles
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [empleadoActual, setEmpleadoActual] = useState(null)
  const [empleadoEliminar, setEmpleadoEliminar] = useState(null)
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    id_rol: "", // Campo para el rol seleccionado
    id_departamento: "",
    fecha_ingreso: "",
    estado: 1,
  })
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(false)

  // Función para obtener empleados
  const obtenerEmpleados = async () => {
    try {
      setCargando(true)
      const response = await API.get("/empleados")
      setEmpleados(response.data)
    } catch (error) {
      console.error("Error al obtener empleados:", error)
      toast.error("Error al obtener empleados")
    } finally {
      setCargando(false)
    }
  }

  // Función para obtener departamentos
  const obtenerDepartamentos = async () => {
    try {
      const response = await API.get("/departamentos")
      setDepartamentos(response.data)
    } catch (error) {
      console.error("Error al obtener departamentos:", error)
      toast.error("Error al obtener departamentos")
    }
  }

  // Función para obtener roles
  const obtenerRoles = async () => {
    try {
      const response = await API.get("/roles")
      setRoles(response.data)
    } catch (error) {
      console.error("Error al obtener roles:", error)
      toast.error("Error al obtener roles")
    }
  }

  const eliminarEmpleado = async () => {
    try {
      setCargando(true)
      await API.delete(`/empleados/${empleadoEliminar.id}`)
      toast.success("Empleado eliminado correctamente")
      setModalEliminar(false)
      obtenerEmpleados()
    } catch (error) {
      const mensaje = error.response?.data?.detail || "Error al eliminar empleado"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const confirmarEliminar = (empleado) => {
    setEmpleadoEliminar(empleado)
    setModalEliminar(true)
  }

  const agregarEmpleado = async () => {
    try {
      // Convertir los IDs a números
      const empleadoData = {
        ...nuevoEmpleado,
        id_rol: nuevoEmpleado.id_rol ? parseInt(nuevoEmpleado.id_rol) : null,
        id_departamento: parseInt(nuevoEmpleado.id_departamento)
      }

      setCargando(true)
      await API.post("/empleados", empleadoData)
      toast.success("Empleado agregado correctamente")
      setModalAgregar(false)
      setNuevoEmpleado({
        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
        id_rol: "",
        id_departamento: "",
        fecha_ingreso: "",
        estado: 1,
      })
      obtenerEmpleados()
    } catch (error) {
      console.error("Error completo:", error)
      const mensaje = error.response?.data?.detail || "Error al agregar empleado"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const editarEmpleado = async () => {
    try {
      // Convertir los IDs a números
      const empleadoData = {
        ...empleadoActual,
        id_rol: empleadoActual.id_rol ? parseInt(empleadoActual.id_rol) : null,
        id_departamento: parseInt(empleadoActual.id_departamento)
      }

      setCargando(true)
      await API.put(`/empleados/${empleadoActual.id}`, empleadoData)
      toast.success("Empleado actualizado correctamente")
      setModalEditar(false)
      obtenerEmpleados()
    } catch (error) {
      console.error("Error completo:", error)
      const mensaje = error.response?.data?.detail || "Error al actualizar empleado"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const abrirModalEditar = (empleado) => {
    setEmpleadoActual({ ...empleado })
    setModalEditar(true)
  }

  const handleInputChange = (e, tipo) => {
    const { name, value } = e.target
    if (tipo === "nuevo") {
      setNuevoEmpleado({ ...nuevoEmpleado, [name]: value })
    } else {
      setEmpleadoActual({ ...empleadoActual, [name]: value })
    }
  }

  const empleadosFiltrados = empleados.filter(
    (e) =>
      e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      (e.rol?.rol || "").toLowerCase().includes(busqueda.toLowerCase()),
  )

  // Función para obtener el nombre del departamento por ID
  const obtenerNombreDepartamento = (id_departamento) => {
    const departamento = departamentos.find((d) => d.id === id_departamento)
    return departamento ? departamento.depa : "No asignado"
  }

  // Función para obtener el nombre del rol por ID
  const obtenerNombreRol = (id_rol) => {
    if (!id_rol) return "No asignado"
    const rol = roles.find((r) => r.id === id_rol)
    return rol ? rol.rol : "No asignado"
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    obtenerEmpleados()
    obtenerDepartamentos()
    obtenerRoles()
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Empleados</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar empleado..."
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
            Agregar Empleado
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
              <th className="px-6 py-3 border-b border-gray-200">Teléfono</th>
              <th className="px-6 py-3 border-b border-gray-200">Rol</th>
              <th className="px-6 py-3 border-b border-gray-200">Departamento</th>
              <th className="px-6 py-3 border-b border-gray-200">Fecha Ingreso</th>
              <th className="px-6 py-3 border-b border-gray-200 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cargando ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-500">Cargando empleados...</span>
                  </div>
                </td>
              </tr>
            ) : empleadosFiltrados.length > 0 ? (
              empleadosFiltrados.map((e, index) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{e.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{e.correo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{e.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {obtenerNombreRol(e.id_rol)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {obtenerNombreDepartamento(e.id_departamento)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {e.fecha_ingreso ? new Date(e.fecha_ingreso).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => abrirModalEditar(e)}
                        disabled={cargando}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-sm"
                        onClick={() => confirmarEliminar(e)}
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
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No hay empleados registrados o que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar Empleado */}
      {modalAgregar && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalAgregar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Agregar Nuevo Empleado</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoEmpleado.nombre}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={nuevoEmpleado.correo}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={nuevoEmpleado.telefono}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={nuevoEmpleado.direccion}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    name="id_rol"
                    value={nuevoEmpleado.id_rol}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    name="id_departamento"
                    value={nuevoEmpleado.id_departamento}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seleccione un departamento</option>
                    {departamentos.map((departamento) => (
                      <option key={departamento.id} value={departamento.id}>
                        {departamento.depa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  name="fecha_ingreso"
                  value={nuevoEmpleado.fecha_ingreso}
                  onChange={(e) => handleInputChange(e, "nuevo")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalAgregar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarEmpleado}
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

      {/* Modal Editar Empleado */}
      {modalEditar && empleadoActual && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalEditar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Editar Empleado</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={empleadoActual.nombre || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={empleadoActual.correo || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={empleadoActual.telefono || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={empleadoActual.direccion || ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    name="id_rol"
                    value={empleadoActual.id_rol || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    name="id_departamento"
                    value={empleadoActual.id_departamento || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seleccione un departamento</option>
                    {departamentos.map((departamento) => (
                      <option key={departamento.id} value={departamento.id}>
                        {departamento.depa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  name="fecha_ingreso"
                  value={empleadoActual.fecha_ingreso ? empleadoActual.fecha_ingreso.split("T")[0] : ""}
                  onChange={(e) => handleInputChange(e, "editar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setModalEditar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={editarEmpleado}
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
      {modalEliminar && empleadoEliminar && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar al empleado{" "}
                <span className="font-semibold">{empleadoEliminar.nombre}</span>? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setModalEliminar(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarEmpleado}
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

export default Empleados