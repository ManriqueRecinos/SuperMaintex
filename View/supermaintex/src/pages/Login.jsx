"use client"

import { useState } from "react"
import { ClipLoader } from "react-spinners"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import API from "../services/api"

function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState("")
  const [contrasenia, setContrasenia] = useState("")
  const [error, setError] = useState("")
  const [loginStatus, setLoginStatus] = useState("idle")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoginStatus("loading")

    const data = new URLSearchParams()
    data.append("username", usuario)
    data.append("password", contrasenia)

    const startTime = Date.now()

    try {
      const response = await API.post("/token", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })

      const { access_token } = response.data

      localStorage.setItem("token", access_token)

      API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

      const userResponse = await API.get("/usuarios/me")
      const userData = userResponse.data

      localStorage.setItem("user", JSON.stringify(userData))

      const elapsedTime = Date.now() - startTime
      const minLoadingTime = 2000
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

      setTimeout(() => {
        setLoginStatus("success")
        toast.success("Inicio de sesión exitoso ✅", { position: "top-center" })
        onLoginSuccess(userData)
      }, remainingTime)
    } catch (err) {
      console.error("Login error:", err)

      const elapsedTime = Date.now() - startTime
      const minLoadingTime = 2000
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

      setTimeout(() => {
        setError("Usuario o contraseña incorrectos")
        toast.error("Usuario o contraseña incorrectos", { position: "top-center" })
        setLoginStatus("error")
        setTimeout(() => setLoginStatus("idle"), 2000)
      }, remainingTime)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      <ToastContainer />

      {loginStatus === "loading" && (
        <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg">
          <ClipLoader size={50} color="#3b82f6" loading={true} />
          <p className="mt-4 text-gray-700 font-medium">Verificando credenciales...</p>
        </div>
      )}

      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Imagen */}
        <div className="hidden md:block w-1/2">
          <img
            src="/it.jpg"
            alt="Login Side"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="w-full md:w-1/2 p-8 relative">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Iniciar Sesión</h2>

          <label className="block mb-2 text-sm font-medium text-gray-700">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="username"
            disabled={loginStatus !== "idle"}
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="current-password"
            disabled={loginStatus !== "idle"}
          />

          <button
            type="submit"
            disabled={loginStatus !== "idle"}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-2 rounded transition"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
