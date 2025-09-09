import React from "react";
import Reports from "./Reports";
import ExpenseList from "./ExpenseList";
import AddExpense from "./AddExpense";
import DashboardHome from "./DashboardHome";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface DashboardContentProps {
  activeMenu: string;
  expenses: Expense[];
  total: number;
}

export default function DashboardContent({
  activeMenu,
  expenses,
  total,
}: DashboardContentProps) {
  // Render based on activeMenu
  if (activeMenu === "dashboard")
    return <DashboardHome expenses={expenses} total={total} />;
  if (activeMenu === "add") return <AddExpense />;
  if (activeMenu === "Expenses List") return <ExpenseList expenses={expenses}/>;
  if (activeMenu === "reports") return <Reports />;

  return null;
}
