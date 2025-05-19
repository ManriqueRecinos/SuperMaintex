"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Sidebar from "./pages/Sidebar"
import Usuarios from "./pages/Usuarios"
import Empleados from "./pages/Empleados"
import Computadoras from "./pages/Computadoras"
import Departamentos from "./pages/Departamentos"
import Roles from "./pages/Roles"
import API from "./services/api"

function App() {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
          API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`

          try {
            await API.get("/usuarios/me")
            setUserData(JSON.parse(storedUser))
          } catch (error) {
            console.error("Session expired or invalid:", error)
            handleLogout()
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete API.defaults.headers.common["Authorization"]
    setUserData(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userData) {
    return <Login onLoginSuccess={setUserData} />
  }

  return (
    <div className="flex">
      <Sidebar userData={userData} onLogout={handleLogout} />
      <main className="flex-1 bg-gray-100 min-h-screen p-4 text-black">
        <Routes>
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/computadoras" element={<Computadoras />} />
          <Route path="/departamentos" element={<Departamentos />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
