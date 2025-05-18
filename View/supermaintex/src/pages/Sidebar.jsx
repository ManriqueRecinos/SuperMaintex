"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  MdDashboard,
  MdPerson,
  MdComputer,
  MdPrint,
  MdAttachMoney,
  MdSupportAgent,
  MdSettings,
  MdLogout,
  MdExpandMore,
  MdExpandLess,
  MdPeople,
  MdCategory,
} from "react-icons/md"

export default function Sidebar({ userData, onLogout }) {
  const [isOpen, setIsOpen] = useState(true)
  const [configOpen, setConfigOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { path: "/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" },
    { path: "/usuarios", icon: <MdPerson size={20} />, label: "Técnicos" },
    { path: "/computadoras", icon: <MdComputer size={20} />, label: "Computadoras" },
    { path: "/impresoras", icon: <MdPrint size={20} />, label: "Impresoras" },
    { path: "/centro-costos", icon: <MdAttachMoney size={20} />, label: "Centro de Costos" },
    { path: "/soporte", icon: <MdSupportAgent size={20} />, label: "Soporte" },
  ]

  const configItems = [
    { path: "/departamentos", icon: <MdCategory size={20} />, label: "Departamentos" },
    { path: "/roles", icon: <MdPeople size={20} />, label: "Roles" },
  ]

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-screen bg-indigo-800 text-white flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Header con título */}
      <div
        className="px-4 py-5 border-b border-indigo-700 flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="font-semibold text-lg">SuperMaintex</span>
        ) : (
          <span className="font-semibold text-lg">S</span>
        )}
      </div>

      {/* Información del usuario */}
      {isOpen && userData && (
        <div className="px-4 py-3 border-b border-indigo-700 overflow-hidden">
          <h2 className="text-sm font-semibold">{userData.nombre}</h2>
          <p className="text-xs text-indigo-200">{userData.rol?.rol || "Usuario"}</p>
          <p className="text-xs text-indigo-200 mt-1">{userData.correo}</p>
          <p className="text-xs text-indigo-200">Carnet: {userData.carnet}</p>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex-1 mt-2 overflow-y-auto">
        {menuItems.map(({ path, icon, label }) => {
          const isActive = location.pathname === path

          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-3 px-4 py-3 transition-all duration-200 ${
                isActive ? "bg-indigo-500 text-white border-l-4 border-white" : "hover:bg-indigo-700"
              }`}
            >
              <div className={`text-indigo-200 ${!isOpen && "mx-auto"}`}>{icon}</div>
              {isOpen && <span className="text-sm whitespace-nowrap overflow-hidden">{label}</span>}
            </Link>
          )
        })}

        {/* Configuración con submenú */}
        <div className="relative">
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className={`w-full flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-3 px-4 py-3 transition-all duration-200 ${
              location.pathname.includes("/config")
                ? "bg-indigo-500 text-white border-l-4 border-white"
                : "hover:bg-indigo-700"
            }`}
          >
            <div className={`text-indigo-200 ${!isOpen && "mx-auto"}`}>
              <MdSettings size={20} />
            </div>
            {isOpen && (
              <>
                <span className="text-sm flex-1 text-left whitespace-nowrap overflow-hidden">Configuración</span>
                {configOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
              </>
            )}
          </button>

          {isOpen && configOpen && (
            <div className="bg-indigo-900 overflow-hidden transition-all duration-300 ease-in-out">
              {configItems.map(({ path, icon, label }) => {
                const isActive = location.pathname === path

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 pl-10 pr-4 py-2.5 transition-all duration-200 ${
                      isActive ? "bg-indigo-600 text-white" : "hover:bg-indigo-700"
                    }`}
                  >
                    <div className="text-indigo-200">{icon}</div>
                    <span className="text-sm whitespace-nowrap overflow-hidden">{label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Cerrar sesión */}
      <div className="mt-auto px-4 py-3 border-t border-indigo-700">
        <button
          onClick={onLogout}
          className={`flex items-center ${isOpen ? "justify-start" : "justify-center"} gap-3 text-indigo-200 hover:text-white hover:bg-red-600 px-2 py-1 rounded transition-all duration-200 w-full`}
        >
          <div className={`${!isOpen && "mx-auto"}`}>
            <MdLogout size={20} />
          </div>
          {isOpen && <span className="text-sm whitespace-nowrap overflow-hidden">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  )
}
