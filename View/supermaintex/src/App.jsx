import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Necesario para las rutas
import Login from "./pages/Login";
import Sidebar from "./pages/Sidebar";
import Usuarios from "./pages/Usuarios"; // ✅ Tu nueva vista

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
          <Route path="/usuarios" element={<Usuarios />} />
          {/* Puedes agregar más rutas aquí en el futuro */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
