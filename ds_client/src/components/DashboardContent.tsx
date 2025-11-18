import React from "react";
import Reports from "./Reports";
import ExpenseList from "./ExpenseList";
import AddExpense from "./AddExpense";
import DashboardHome from "./DashboardHome";
import Statement from "./Statement"
import GenerateReports from "./GenerateReport";

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
  onExpenseAdded?: (expense: Expense | null) => void; // new callback
}

export default function DashboardContent({
  activeMenu,
  expenses,
  total,
  onExpenseAdded,
}: DashboardContentProps) {
  // Render based on activeMenu
  if (activeMenu === "dashboard")
    return <DashboardHome expenses={expenses} total={total} />;
  if (activeMenu === "add")
    return <AddExpense onExpenseAdded={onExpenseAdded} />;
  if (activeMenu === "Expenses List")
    return <ExpenseList expenses={expenses} onExpenseAdded={onExpenseAdded} />;
  if (activeMenu === "generate_reports") return <GenerateReports />;
  if (activeMenu === "reports") return <Reports />;
  if (activeMenu === "Expenses Statement") return <Statement />

  return null;
}
