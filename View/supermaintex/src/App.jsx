import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Sidebar from "./pages/Sidebar";

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

  return userData ? (
    <Sidebar userData={userData} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={setUserData} />
  );
}

export default App;
