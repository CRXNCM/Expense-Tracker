import React, { useState } from "react";
import axiosInstance from "../../utils/axioInstance"; // your configured axios
import { toast } from "react-toastify";

const categories = [
  "Groceries",
  "Transport",
  "Internet",
  "Utilities",
  "Entertainment",
  "Other",
];

const BulkFixedExpenses = ({ userId }) => {
  const [expenses, setExpenses] = useState([
    { category: "", subItem: "", amount: "", date: new Date().toISOString().slice(0, 10) },
  ]);
  const [saving, setSaving] = useState(false);

  const addRow = () => {
    setExpenses([
      ...expenses,
      { category: "", subItem: "", amount: "", date: new Date().toISOString().slice(0, 10) },
    ]);
  };

  const removeRow = (index) => {
    if (expenses.length === 1) {
      toast.warn("At least one row is required");
      return;
    }
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const handleSaveAll = async () => {
    // Validate inputs
    for (const [i, exp] of expenses.entries()) {
      if (!exp.category) {
        toast.error(`Row ${i + 1}: Category is required`);
        return;
      }
      if (!exp.subItem) {
        toast.error(`Row ${i + 1}: Sub-item is required`);
        return;
      }
      if (!exp.amount || isNaN(Number(exp.amount)) || Number(exp.amount) <= 0) {
        toast.error(`Row ${i + 1}: Amount must be a positive number`);
        return;
      }
      if (!exp.date) {
        toast.error(`Row ${i + 1}: Date is required`);
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        userId,
        expenses: expenses.map(({ category, subItem, amount, date }) => ({
          category,
          subItem,
          amount: Number(amount),
          date,
        })),
      };

      const response = await axiosInstance.post("/api/fixedexpenses/bulk", payload);

      toast.success("All expenses saved successfully!");
      // Optionally clear or reset form:
      setExpenses([{ category: "", subItem: "", amount: "", date: new Date().toISOString().slice(0, 10) }]);
    } catch (error) {
      console.error("Failed to save expenses", error);
      toast.error("Failed to save expenses");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Bulk Fixed Expenses</h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1">Category</th>
            <th className="border border-gray-300 px-2 py-1">Sub-item</th>
            <th className="border border-gray-300 px-2 py-1">Amount</th>
            <th className="border border-gray-300 px-2 py-1">Date</th>
            <th className="border border-gray-300 px-2 py-1">Remove</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-2 py-1">
                <select
                  className="w-full border border-gray-300 rounded px-1 py-0.5"
                  value={row.category}
                  onChange={(e) => handleChange(index, "category", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <input
                  type="text"
                  value={row.subItem}
                  onChange={(e) => handleChange(index, "subItem", e.target.value)}
                  className="w-full border border-gray-300 rounded px-1 py-0.5"
                  placeholder="Sub-item"
                />
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={row.amount}
                  onChange={(e) => handleChange(index, "amount", e.target.value)}
                  className="w-full border border-gray-300 rounded px-1 py-0.5"
                  placeholder="Amount"
                />
              </td>
              <td className="border border-gray-300 px-2 py-1">
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                  className="w-full border border-gray-300 rounded px-1 py-0.5"
                />
              </td>
              <td className="border border-gray-300 px-2 py-1 text-center">
                <button
                  onClick={() => removeRow(index)}
                  className="text-red-600 hover:text-red-900 font-bold"
                  title="Remove this row"
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={saving}
        >
          Add Row
        </button>

        <button
          onClick={handleSaveAll}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>
    </div>
  );
};

export default BulkFixedExpenses;
