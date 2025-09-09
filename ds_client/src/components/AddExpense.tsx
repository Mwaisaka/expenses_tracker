import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface AddExpenseProps {
  onClose?: () => void;
}
export default function AddExpense({ onClose }: AddExpenseProps) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: [e.target.value] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/add_expenses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer {token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to add expense.");
      }
      alert("Expense added succeesfully!");
      // Clear form
      setFormData({ description: "", amount: "", category: "", date: "" });

      // close modal after success
      if (onClose) onClose();
    } catch (err) {
      alert("Error adding expense.");
    }
  };
  return (
    <div className="p-6 bg-white rounded-2xl shadow max-w-lg mx-auto mt-6">
      <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Add
        </button>
      </form>
    </div>
  );
}
