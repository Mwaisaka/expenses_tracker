import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  PieChart,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  activeMenu: string;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
  onLogout?: () => void;
}

export default function Sidebar({
  sidebarOpen,
  activeMenu,
  setSidebarOpen,
  setActiveMenu,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-blue-700 text-white transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className={`font-bold text-lg ${!sidebarOpen && "hidden"}`}>
          Expense Tracker
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-blue-600"
        >
          {sidebarOpen ? "<" : ">"}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-2">
        <button
          onClick={() => setActiveMenu("dashboard")}
          className={`flex items-center gap-2 p-2 rounded w-full text-left ${
            activeMenu === "dashboard" ? "bg-blue-600" : "hover:bg-blue-600"
          }`}
        >
          <LayoutDashboard size={20} />
          {sidebarOpen && <span>Dashboard</span>}
        </button>

        {/* <button
          onClick={() => setActiveMenu("add")}
          className={`flex items-center gap-2 p-2 rounded w-full text-left ${
            activeMenu === "add" ? "bg-blue-600" : "hover:bg-blue-600"
          }`}
        >
          <PlusCircle size={20} />
          {sidebarOpen && <span>Add Expense</span>}
        </button> */}

        <button
          onClick={() => setActiveMenu("Expenses List")}
          className={`flex items-center gap-2 p-2 rounded w-full text-left ${
            activeMenu === "Expenses List" ? "bg-blue-600" : "hover:bg-blue-600"
          }`}
        >
          <List size={20} />
          {sidebarOpen && <span>Manage Expenses</span>}
        </button>

        <button
          onClick={() => setActiveMenu("Expenses Statement")}
          className={`flex items-center gap-2 p-2 rounded w-full text-left ${
            activeMenu === "Expenses Statement"
              ? "bg-blue-600"
              : "hover:bg-blue-600"
          }`}
        >
          <List size={20} />
          {sidebarOpen && <span>Statement</span>}
        </button>

        <button
          onClick={() => setActiveMenu("Generate Reports")}
          className={`flex items-center gap-2 p-2 rounded w-full text-left ${
            activeMenu === "Generate Reports" ? "bg-blue-600" : "hover:bg-blue-600"
          }`}
        >
          <PieChart size={20} />
          {sidebarOpen && <span>Generate Reports</span>}
        </button>
        <button
          onClick={() => setActiveMenu("reports")}
          className={`flex items-center gap-2 p-2 rounded w-full text-left ${
            activeMenu === "reports" ? "bg-blue-600" : "hover:bg-blue-600"
          }`}
        >
          <PieChart size={20} />
          {sidebarOpen && <span>Reports</span>}
        </button>
      </nav>

      <div className="p-2">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full p-2 rounded hover:bg-blue-600"
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
