import { useState } from "react";
import {
  MdDashboard,
  MdInbox,
  MdAccountCircle,
  MdEvent,
  MdSearch,
  MdAnalytics,
  MdInsertDriveFile,
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
  MdLogout,
} from "react-icons/md";

const menuItems = [
  { icon: <MdDashboard size={24} />, label: "Dashboard" },
  { icon: <MdInbox size={24} />, label: "Inbox" },
  { icon: <MdAccountCircle size={24} />, label: "Accounts" },
  { icon: <MdEvent size={24} />, label: "Schedule" },
  { icon: <MdSearch size={24} />, label: "Search" },
  { icon: <MdAnalytics size={24} />, label: "Analytics" },
  { icon: <MdInsertDriveFile size={24} />, label: "Files" },
  { icon: <MdSettings size={24} />, label: "Setting" },
];

export default function Sidebar({ userData, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-screen bg-blue-900 text-white flex flex-col transition-width duration-300`}
    >
      {/* Header con datos del usuario */}
      <div className="px-4 py-4 border-b border-blue-800">
        {isOpen ? (
          <div>
            <h1 className="text-base font-semibold leading-tight">{userData.nombre}</h1>
            <p className="text-sm text-blue-200">{userData.correo}</p>
            <p className="text-sm font-bold mt-1">Carnet: {userData.carnet} - {userData.rol.rol}</p>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded hover:bg-blue-700 transition"
            aria-label="Expand sidebar"
          >
            <MdChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex flex-col flex-1 mt-4 space-y-1">
        {menuItems.map(({ icon, label }, idx) => (
          <a
            key={idx}
            href="#"
            className="flex items-center gap-4 px-4 py-3 hover:bg-blue-700 cursor-pointer transition-colors"
          >
            {icon}
            {isOpen && <span className="text-sm">{label}</span>}
          </a>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-4 px-4 py-3 hover:bg-red-600 transition-colors"
      >
        <MdLogout size={24} />
        {isOpen && <span className="text-sm">Cerrar Sesión</span>}
      </button>
    </div>
  );
}
