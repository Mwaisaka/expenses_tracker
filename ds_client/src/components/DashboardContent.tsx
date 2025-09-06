import React from "react";
import Card from "./Card";

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

export default function DashboardContent({ activeMenu, expenses, total }: DashboardContentProps) {
  // Sub-components
  const DashboardHome = () => (
    <main className="flex-1 max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Total Expenses" value={`$${total.toFixed(2)}`} color="text-blue-600" />

      <Card
        title="This Month"
        value={`$${expenses
          .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
          .reduce((acc, exp) => acc + exp.amount, 0)
          .toFixed(2)}`}
        color="text-green-600"
      />

      <Card
        title="Top Category"
        value={
          expenses.length > 0
            ? Object.entries(
                expenses.reduce((acc, exp) => {
                  acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                  return acc;
                }, {} as Record<string, number>)
              ).sort((a, b) => b[1] - a[1])[0][0]
            : "N/A"
        }
        color="text-purple-600"
      />

      {/* Recent Expenses */}
      <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold text-gray-700">Recent Expenses</h2>
        <ul className="mt-4 divide-y divide-gray-200 text-sm">
          {expenses.length > 0 ? (
            expenses
              .slice(-5)
              .reverse()
              .map((exp) => (
                <li key={exp.id} className="py-2 flex justify-between">
                  <span>
                    {exp.description} ({exp.category})
                  </span>
                  <span className="font-semibold text-red-500">-${exp.amount}</span>
                </li>
              ))
          ) : (
            <li className="py-2 text-gray-500">No expenses found</li>
          )}
        </ul>
      </div>
    </main>
  );

  const AddExpense = () => (
    <div className="p-6 bg-white rounded-2xl shadow max-w-lg mx-auto mt-6">
      <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Description" className="w-full p-2 border rounded" />
        <input type="number" placeholder="Amount" className="w-full p-2 border rounded" />
        <input type="text" placeholder="Category" className="w-full p-2 border rounded" />
        <input type="date" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Add
        </button>
      </form>
    </div>
  );

  const ExpenseList = () => (
    <div className="p-6 bg-white rounded-2xl shadow max-w-3xl mx-auto mt-6">
      <h2 className="text-lg font-semibold mb-4">Expenses List</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((exp) => (
              <tr key={exp.id} className="border-t">
                <td className="p-2">{exp.description}</td>
                <td className="p-2 text-red-500">-${exp.amount}</td>
                <td className="p-2">{exp.category}</td>
                <td className="p-2">{new Date(exp.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-2 text-center text-gray-500">
                No expenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const Reports = () => (
    <div className="p-6 bg-white rounded-2xl shadow max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-semibold">Reports</h2>
      <p className="text-gray-500 mt-2">Charts & insights coming soon 📊</p>
    </div>
  );

  // Render based on activeMenu
  if (activeMenu === "dashboard") return <DashboardHome />;
  if (activeMenu === "add") return <AddExpense />;
  if (activeMenu === "list") return <ExpenseList />;
  if (activeMenu === "reports") return <Reports />;

  return null;
}
