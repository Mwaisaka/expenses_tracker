// import React from "react";
import Card from "./Card";
interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface DashboardHomeProps {
  expenses: Expense[];
  total: number;
}

export default function DashboardHome({ expenses, total }: DashboardHomeProps) {
  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        title="Total Expenses"
        value={`Kes. ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        color="text-blue-600"
      />

      <Card
        title="This Month"
        value={`Kes. ${expenses
          .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
          .reduce((acc, exp) => acc + Number(exp.amount), 0)
          .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
                  <span className="font-semibold text-red-500">
                    -Kes. {Number(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </li>
              ))
          ) : (
            <li className="py-2 text-gray-500">No expenses found</li>
          )}
        </ul>
      </div>
    </main>
  );
}
