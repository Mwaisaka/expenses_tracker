import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import Sidebar from "../components/Sidebar.tsx";
import DashboardContent from "../components/DashboardContent.tsx";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  useEffect(() => {
    if (!token) return;

    const fetchExpenses = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/expenses/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch expenses");

        const data: Expense[] = await res.json();
        setExpenses(data);

        const sum = data.reduce((acc, exp) => acc + exp.amount, 0);
        setTotal(sum);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeMenu={activeMenu}
        setSidebarOpen={setSidebarOpen}
        setActiveMenu={setActiveMenu}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold capitalize">{activeMenu}</h1>
          <p className="text-gray-600">
            Welcome, <span className="font-semibold">{user?.username || "User"}</span>
          </p>
        </header>

        <DashboardContent activeMenu={activeMenu} expenses={expenses} total={total} />
      </div>
    </div>
  );
}
