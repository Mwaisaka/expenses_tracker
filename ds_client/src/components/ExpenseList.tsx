import React, { useState } from "react";
import AddExpense from "./AddExpense";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseProps {
  expenses: Expense[];
  onExpenseAdded?: (expense: Expense | null) => void;
}

export default function ExpenseList({
  expenses = [],
  onExpenseAdded,
}: ExpenseProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // month filter
  const [selectedYear, setSelectedYear] = useState<string>(""); // year filter

  // Handle checkbox toggle
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredExpenses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredExpenses.map((exp) => exp.id));
    }
  };

  // Get unique years from expenses for dropdown
  const years = Array.from(
    new Set(expenses.map((exp) => new Date(exp.date).getFullYear()))
  ).sort((a, b) => b - a);

  // Filter expenses based on search term + month + year
  const filteredExpenses = expenses.filter((exp) => {
    const search = searchTerm.toLowerCase();
    const expenseDate = new Date(exp.date);
    const expenseMonth = (expenseDate.getMonth() + 1).toString(); // 1–12
    const expenseYear = expenseDate.getFullYear().toString();
    return (
      (exp.description.toLowerCase().includes(search) ||
        exp.amount.toString().includes(search) ||
        exp.category.toLowerCase().includes(search) ||
        new Date(exp.date).toLocaleDateString().includes(search)) &&
      (selectedMonth === "" || selectedMonth === expenseMonth) &&
      (selectedYear === "" || selectedYear === expenseYear)
    );
  });

  //Handle Delete
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select atleast one expense to delete.");
      return;
    }
    //Ask the user for confirmation
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} expense(s)?`
    );
    if (confirmDelete) {
      //Proceed to delete the tenant
      try {
        for (const id of selectedIds) {
          const response = await fetch(
            `http://127.0.0.1:8000/expense_detail/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // add auth
              },
            }
          );
          if (!response.ok) {
            alert(`Failed to delete expense with id ${id}`);
            throw new Error(
              `Failed to delete selected item(s): ${response.statusText}`
            );
          }
        }
        alert("Selected expenses(s) deleted successfully.");

        setSelectedIds([]);
        //Refresh expenses list
        if (onExpenseAdded) {
          onExpenseAdded(null); // trigger parent refresh
        }
      } catch (err) {
        alert("Error in deleting expense(s):" + err);
      }
    } else {
      //Do noting and retain the expense list
      alert("Selected expense(s) not deleted!");
      return;
    }
  };

  //Handle Edit
  const handleEdit = () => {
    if (selectedIds.length === 1) {
      alert(`Edit this ID: ${selectedIds[0]}`);
      // Open edit modal or form for selectedIds[0]
    } else {
      alert("Please select exactly one expense to edit.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow max-w-3xl mx-auto mt-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Expenses List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by description, amount, category or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Action Buttons */}
      {selectedIds.length > 0 && (
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}

      {/* Table */}
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">
              <input
                type="checkbox"
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length === filteredExpenses.length
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Amount (Kes)</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((exp) => (
              <tr key={exp.id} className="border-t">
                <td className="p-2 border">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(exp.id)}
                    onChange={() => toggleSelect(exp.id)}
                  />
                </td>
                <td className="p-2 border">{exp.description}</td>
                <td className="p-2 text-red-500 border">
                  {" "}
                  {Number(exp.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="p-2 border">{exp.category}</td>
                <td className="p-2 border">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
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
      {/* Modal for AddExpense */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <AddExpense
              onClose={() => setShowModal(false)}
              onExpenseAdded={onExpenseAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
}
