import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Necesario para las rutas
import Login from "./pages/Login";
import Sidebar from "./pages/Sidebar";
import Usuarios from "./pages/Usuarios";
import Empleados from "./pages/Empleados";
import Computadoras from "./pages/Computadoras";
// import Impresoras from "./pages/Impresoras";
// import CentroCostos from "./pages/CentroCostos";
// import Soporte from "./pages/Soporte";
import Departamentos from "./pages/Departamentos";
import Roles from "./pages/Roles";
// import Dashboard from "./pages/Dashboard";


function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserData(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
  };

  if (!userData) {
    return <Login onLoginSuccess={setUserData} />;
  }

  return (
    <div className="flex">
      <Sidebar userData={userData} onLogout={handleLogout} />
      <main className="flex-1 bg-gray-100 min-h-screen p-4 text-black">
<Routes>
  {/* <Route path="/dashboard" element={<Dashboard />} /> */}
  <Route path="/usuarios" element={<Usuarios />} />
  <Route path="/empleados" element={<Empleados />} />
  <Route path="/computadoras" element={<Computadoras />} />
  {/* <Route path="/impresoras" element={<Impresoras />} /> */}
  {/* <Route path="/centro-costos" element={<CentroCostos />} /> */}
  {/* <Route path="/soporte" element={<Soporte />} /> */}
  <Route path="/departamentos" element={<Departamentos />} />
  <Route path="/roles" element={<Roles />} />
  <Route path="*" element={<div>Página no encontrada</div>} />
</Routes>

      </main>
    </div>
  );
}

export default App;
