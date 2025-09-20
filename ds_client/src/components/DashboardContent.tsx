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
  onExpenseAdded?: (expense: any) => void; // new callback
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
  if (activeMenu === "reports") return <Reports />;

  return null;
}
