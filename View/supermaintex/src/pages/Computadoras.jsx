"use client"

import { useEffect, useState } from "react"
import API from "../services/api"
import { toast } from "react-toastify"
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Save,
  Search,
  AlertTriangle,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStickIcon as Memory,
  User,
  Tag,
  Network,
  Clock,
  Server,
  LayoutGrid,
  LayoutList,
  Filter,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function Computadoras() {
  const [computadoras, setComputadoras] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [modalDetalle, setModalDetalle] = useState(false)
  const [computadoraActual, setComputadoraActual] = useState(null)
  const [computadoraEliminar, setComputadoraEliminar] = useState(null)
  const [nuevaComputadora, setNuevaComputadora] = useState({
    marca: "",
    modelo: "",
    serie: "",
    procesador: "",
    ram: "",
    disco_duro: "",
    motherboard: "",
    sistema_operativo: "",
    ip: "",
    ultimo_mantenimiento: "",
    id_empleado: "",
    estado: 1,
  })
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(false)
  const [vistaTabla, setVistaTabla] = useState(false)
  const [filtroMarca, setFiltroMarca] = useState("")
  const [filtroEmpleado, setFiltroEmpleado] = useState("")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [marcasUnicas, setMarcasUnicas] = useState([])

  const obtenerComputadoras = async () => {
    try {
      setCargando(true)
      const response = await API.get("/computadoras")
      console.log("Datos recibidos:", response.data)
      setComputadoras(response.data)

      // Extraer marcas únicas para filtros
      const marcas = [...new Set(response.data.map((comp) => comp.marca).filter(Boolean))]
      setMarcasUnicas(marcas)
    } catch (error) {
      console.error("Error completo:", error)
      toast.error("Error al obtener computadoras")
    } finally {
      setCargando(false)
    }
  }

  const obtenerEmpleados = async () => {
    try {
      const response = await API.get("/empleados")
      setEmpleados(response.data)
    } catch (error) {
      toast.error("Error al obtener empleados")
    }
  }

  const eliminarComputadora = async () => {
    try {
      setCargando(true)
      await API.delete(`/computadoras/${computadoraEliminar.id}`)
      toast.success("Computadora eliminada correctamente")
      setModalEliminar(false)
      obtenerComputadoras()
    } catch (error) {
      const mensaje = error.response?.data?.detail || "Error al eliminar computadora"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const confirmarEliminar = (computadora) => {
    setComputadoraEliminar(computadora)
    setModalEliminar(true)
  }

  const agregarComputadora = async () => {
    try {
      // Convertir el ID de empleado a número si existe
      const computadoraData = {
        ...nuevaComputadora,
        id_empleado: nuevaComputadora.id_empleado ? Number.parseInt(nuevaComputadora.id_empleado) : null,
        ultimo_mantenimiento: nuevaComputadora.ultimo_mantenimiento || null,
      }

      setCargando(true)
      await API.post("/computadoras", computadoraData)
      toast.success("Computadora agregada correctamente")
      setModalAgregar(false)
      setNuevaComputadora({
        marca: "",
        modelo: "",
        serie: "",
        procesador: "",
        ram: "",
        disco_duro: "",
        motherboard: "",
        sistema_operativo: "",
        ip: "",
        ultimo_mantenimiento: "",
        id_empleado: "",
        estado: 1,
      })
      obtenerComputadoras()
    } catch (error) {
      console.error("Error al agregar computadora:", error)
      const mensaje = error.response?.data?.detail || "Error al agregar computadora"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const editarComputadora = async () => {
    try {
      // Convertir el ID de empleado a número si existe
      const computadoraData = {
        ...computadoraActual,
        id_empleado: computadoraActual.id_empleado ? Number.parseInt(computadoraActual.id_empleado) : null,
        ultimo_mantenimiento: computadoraActual.ultimo_mantenimiento || null,
      }

      setCargando(true)
      await API.put(`/computadoras/${computadoraActual.id}`, computadoraData)
      toast.success("Computadora actualizada correctamente")
      setModalEditar(false)
      obtenerComputadoras()
    } catch (error) {
      console.error("Error al actualizar computadora:", error)
      const mensaje = error.response?.data?.detail || "Error al actualizar computadora"
      toast.error(mensaje)
      setCargando(false)
    }
  }

  const abrirModalEditar = (computadora) => {
    // Formatear la fecha para el input date
    const compFormateada = { ...computadora }
    if (compFormateada.ultimo_mantenimiento) {
      compFormateada.ultimo_mantenimiento = compFormateada.ultimo_mantenimiento.split("T")[0]
    }
    setComputadoraActual(compFormateada)
    setModalEditar(true)
  }

  const abrirModalDetalle = (computadora) => {
    setComputadoraActual({ ...computadora })
    setModalDetalle(true)
  }

  const handleInputChange = (e, tipo) => {
    const { name, value } = e.target
    if (tipo === "nuevo") {
      setNuevaComputadora({ ...nuevaComputadora, [name]: value })
    } else {
      setComputadoraActual({ ...computadoraActual, [name]: value })
    }
  }

  const limpiarFiltros = () => {
    setBusqueda("")
    setFiltroMarca("")
    setFiltroEmpleado("")
  }

  // Aplicar todos los filtros
  const computadorasFiltradas = computadoras.filter((c) => {
    const coincideBusqueda =
      !busqueda ||
      (c.marca || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.modelo || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.serie || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.sistema_operativo || "").toLowerCase().includes(busqueda.toLowerCase())

    const coincideMarca = !filtroMarca || (c.marca || "").toLowerCase() === filtroMarca.toLowerCase()

    const coincideEmpleado = !filtroEmpleado || c.id_empleado === Number.parseInt(filtroEmpleado)

    return coincideBusqueda && coincideMarca && coincideEmpleado
  })

  useEffect(() => {
    obtenerComputadoras()
    obtenerEmpleados()
  }, [])

  // Función para obtener el nombre del empleado por ID
  const obtenerNombreEmpleado = (id_empleado) => {
    if (!id_empleado) return "No asignado"
    const empleado = empleados.find((e) => e.id === id_empleado)
    return empleado ? empleado.nombre : "No asignado"
  }

  // Función para generar un color basado en la marca
  const getColorByBrand = (marca) => {
    const marcaLower = (marca || "").toLowerCase()
    if (marcaLower.includes("dell")) return "bg-blue-100 border-blue-300 text-blue-800"
    if (marcaLower.includes("hp")) return "bg-indigo-100 border-indigo-300 text-indigo-800"
    if (marcaLower.includes("lenovo")) return "bg-red-100 border-red-300 text-red-800"
    if (marcaLower.includes("apple")) return "bg-gray-100 border-gray-300 text-gray-800"
    if (marcaLower.includes("asus")) return "bg-purple-100 border-purple-300 text-purple-800"
    if (marcaLower.includes("acer")) return "bg-green-100 border-green-300 text-green-800"
    return "bg-amber-100 border-amber-300 text-amber-800"
  }

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Computadoras</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar computadora..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-auto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Filtros"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              {(filtroMarca || filtroEmpleado) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-medium text-white">
                  {(filtroMarca ? 1 : 0) + (filtroEmpleado ? 1 : 0)}
                </span>
              )}
            </button>

            <div className="flex rounded-md overflow-hidden border border-gray-300">
              <button
                onClick={() => setVistaTabla(false)}
                className={`px-3 py-2 flex items-center ${!vistaTabla ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                title="Vista de tarjetas"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setVistaTabla(true)}
                className={`px-3 py-2 flex items-center ${vistaTabla ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                title="Vista de tabla"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setModalAgregar(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Agregar Computadora</span>
              <span className="inline md:hidden">Agregar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por marca</label>
                  <select
                    value={filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Todas las marcas</option>
                    {marcasUnicas.map((marca) => (
                      <option key={marca} value={marca}>
                        {marca}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por empleado</label>
                  <select
                    value={filtroEmpleado}
                    onChange={(e) => setFiltroEmpleado(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Todos los empleados</option>
                    <option value="0">Sin asignar</option>
                    {empleados.map((empleado) => (
                      <option key={empleado.id} value={empleado.id}>
                        {empleado.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {cargando ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-lg text-gray-600">Cargando computadoras...</span>
        </div>
      ) : computadorasFiltradas.length > 0 ? (
        <AnimatePresence mode="wait">
          {vistaTabla ? (
            // Vista de tabla
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 overflow-x-auto rounded-lg border border-gray-200"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Marca/Modelo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Serie
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Procesador
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      RAM
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Disco Duro
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sistema Operativo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Empleado
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {computadorasFiltradas.map((computadora) => (
                    <motion.tr
                      key={computadora.id}
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {computadora.marca} {computadora.modelo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {computadora.serie || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {computadora.procesador || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{computadora.ram || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {computadora.disco_duro || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {computadora.sistema_operativo || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {obtenerNombreEmpleado(computadora.id_empleado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => abrirModalDetalle(computadora)}
                            className="text-gray-600 hover:text-gray-900 bg-gray-100 p-1.5 rounded-full"
                            title="Ver detalles"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => abrirModalEditar(computadora)}
                            className="text-amber-600 hover:text-amber-900 bg-amber-100 p-1.5 rounded-full"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmarEliminar(computadora)}
                            className="text-red-600 hover:text-red-900 bg-red-100 p-1.5 rounded-full"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            // Vista de tarjetas
            <motion.div
              key="cards"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {computadorasFiltradas.map((computadora) => (
                <motion.div
                  key={computadora.id}
                  variants={itemVariants}
                  className={`border-2 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${getColorByBrand(computadora.marca || "")}`}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        {computadora.marca} {computadora.modelo}
                      </h3>
                      <p className="text-sm opacity-75 mt-1 flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        Serie: {computadora.serie || "N/A"}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => abrirModalDetalle(computadora)}
                        className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                        title="Ver detalles"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => abrirModalEditar(computadora)}
                        className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4 text-amber-600" />
                      </button>
                      <button
                        onClick={() => confirmarEliminar(computadora)}
                        className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 opacity-70" />
                      <span className="truncate">{computadora.procesador || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Memory className="h-4 w-4 opacity-70" />
                      <span>{computadora.ram || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="h-4 w-4 opacity-70" />
                      <span>{computadora.disco_duro || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Server className="h-4 w-4 opacity-70" />
                      <span className="truncate">{computadora.motherboard || "N/A"}</span>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-white border-t flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium truncate">
                      {obtenerNombreEmpleado(computadora.id_empleado)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-gray-50 rounded-lg"
        >
          <Monitor className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay computadoras</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron computadoras registradas o que coincidan con la búsqueda.
          </p>
          <button
            onClick={() => setModalAgregar(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Computadora
          </button>
        </motion.div>
      )}

      {/* Modal Agregar Computadora */}
      <AnimatePresence>
        {modalAgregar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
            onClick={() => setModalAgregar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalAgregar(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Agregar Nueva Computadora</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <input
                      type="text"
                      name="marca"
                      value={nuevaComputadora.marca}
                      onChange={(e) => handleInputChange(e, "nuevo")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                    <input
                      type="text"
                      name="modelo"
                      value={nuevaComputadora.modelo}
                      onChange={(e) => handleInputChange(e, "nuevo")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                  <input
                    type="text"
                    name="serie"
                    value={nuevaComputadora.serie}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Procesador</label>
                  <input
                    type="text"
                    name="procesador"
                    value={nuevaComputadora.procesador}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ej: Intel Core i5-10400 2.9GHz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motherboard</label>
                  <input
                    type="text"
                    name="motherboard"
                    value={nuevaComputadora.motherboard}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ej: ASUS Prime B460M-A"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Memoria RAM</label>
                    <input
                      type="text"
                      name="ram"
                      value={nuevaComputadora.ram}
                      onChange={(e) => handleInputChange(e, "nuevo")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: 8GB DDR4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disco Duro</label>
                    <input
                      type="text"
                      name="disco_duro"
                      value={nuevaComputadora.disco_duro}
                      onChange={(e) => handleInputChange(e, "nuevo")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: 1TB HDD"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección IP</label>
                    <input
                      type="text"
                      name="ip"
                      value={nuevaComputadora.ip}
                      onChange={(e) => handleInputChange(e, "nuevo")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: 192.168.1.100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sistema Operativo</label>
                    <input
                      type="text"
                      name="sistema_operativo"
                      value={nuevaComputadora.sistema_operativo}
                      onChange={(e) => handleInputChange(e, "nuevo")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: Windows 10 Pro"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Último Mantenimiento</label>
                  <input
                    type="date"
                    name="ultimo_mantenimiento"
                    value={nuevaComputadora.ultimo_mantenimiento}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
                  <select
                    name="id_empleado"
                    value={nuevaComputadora.id_empleado}
                    onChange={(e) => handleInputChange(e, "nuevo")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((empleado) => (
                      <option key={empleado.id} value={empleado.id}>
                        {empleado.nombre}
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
                    onClick={agregarComputadora}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar Computadora */}
      <AnimatePresence>
        {modalEditar && computadoraActual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
            onClick={() => setModalEditar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalEditar(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Editar Computadora</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <input
                      type="text"
                      name="marca"
                      value={computadoraActual.marca || ""}
                      onChange={(e) => handleInputChange(e, "editar")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                    <input
                      type="text"
                      name="modelo"
                      value={computadoraActual.modelo || ""}
                      onChange={(e) => handleInputChange(e, "editar")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                  <input
                    type="text"
                    name="serie"
                    value={computadoraActual.serie || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Procesador</label>
                  <input
                    type="text"
                    name="procesador"
                    value={computadoraActual.procesador || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motherboard</label>
                  <input
                    type="text"
                    name="motherboard"
                    value={computadoraActual.motherboard || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Memoria RAM</label>
                    <input
                      type="text"
                      name="ram"
                      value={computadoraActual.ram || ""}
                      onChange={(e) => handleInputChange(e, "editar")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disco Duro</label>
                    <input
                      type="text"
                      name="disco_duro"
                      value={computadoraActual.disco_duro || ""}
                      onChange={(e) => handleInputChange(e, "editar")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección IP</label>
                    <input
                      type="text"
                      name="ip"
                      value={computadoraActual.ip || ""}
                      onChange={(e) => handleInputChange(e, "editar")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sistema Operativo</label>
                    <input
                      type="text"
                      name="sistema_operativo"
                      value={computadoraActual.sistema_operativo || ""}
                      onChange={(e) => handleInputChange(e, "editar")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Último Mantenimiento</label>
                  <input
                    type="date"
                    name="ultimo_mantenimiento"
                    value={computadoraActual.ultimo_mantenimiento || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
                  <select
                    name="id_empleado"
                    value={computadoraActual.id_empleado || ""}
                    onChange={(e) => handleInputChange(e, "editar")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((empleado) => (
                      <option key={empleado.id} value={empleado.id}>
                        {empleado.nombre}
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
                    onClick={editarComputadora}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detalle Computadora */}
      <AnimatePresence>
        {modalDetalle && computadoraActual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
            onClick={() => setModalDetalle(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalDetalle(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <div
                className={`absolute top-0 left-0 w-full h-2 ${getColorByBrand(computadoraActual.marca || "").split(" ")[0]}`}
              ></div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 mt-2">
                <Monitor className="h-5 w-5 text-indigo-600" />
                {computadoraActual.marca} {computadoraActual.modelo}
              </h3>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Número de Serie</p>
                    <p className="mt-1">{computadoraActual.serie || "N/A"}</p>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Especificaciones</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-start gap-2">
                      <Cpu className="h-4 w-4 mt-0.5 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium">Procesador</p>
                        <p className="text-sm text-gray-600">{computadoraActual.procesador || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Server className="h-4 w-4 mt-0.5 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium">Motherboard</p>
                        <p className="text-sm text-gray-600">{computadoraActual.motherboard || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Memory className="h-4 w-4 mt-0.5 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium">Memoria RAM</p>
                        <p className="text-sm text-gray-600">{computadoraActual.ram || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <HardDrive className="h-4 w-4 mt-0.5 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium">Disco Duro</p>
                        <p className="text-sm text-gray-600">{computadoraActual.disco_duro || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 col-span-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mt-0.5 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">Sistema Operativo</p>
                        <p className="text-sm text-gray-600">{computadoraActual.sistema_operativo || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Información de Red</h4>
                  <div className="flex items-start gap-2">
                    <Network className="h-4 w-4 mt-0.5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium">Dirección IP</p>
                      <p className="text-sm text-gray-600">{computadoraActual.ip || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Mantenimiento</h4>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-indigo-500" />
                    <div>
                      <p className="text-sm font-medium">Último Mantenimiento</p>
                      <p className="text-sm text-gray-600">
                        {computadoraActual.ultimo_mantenimiento
                          ? new Date(computadoraActual.ultimo_mantenimiento).toLocaleDateString()
                          : "No registrado"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Asignación</h4>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <User className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium">{obtenerNombreEmpleado(computadoraActual.id_empleado)}</p>
                      <p className="text-sm text-gray-500">
                        {computadoraActual.id_empleado ? "Asignado" : "No asignado a ningún empleado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    setModalDetalle(false)
                    abrirModalEditar(computadoraActual)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => setModalDetalle(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmar Eliminación */}
      <AnimatePresence>
        {modalEliminar && computadoraEliminar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
            onClick={() => setModalEliminar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
                <p className="text-sm text-gray-500 mb-6">
                  ¿Estás seguro de que deseas eliminar la computadora{" "}
                  <span className="font-semibold">
                    {computadoraEliminar.marca} {computadoraEliminar.modelo}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setModalEliminar(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={eliminarComputadora}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Computadoras
