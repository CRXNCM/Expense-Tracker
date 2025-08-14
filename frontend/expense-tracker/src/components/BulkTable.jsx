import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,   
} from "@heroicons/react/24/outline"; // DuplicateIcon is just illustrative, see note below

const BulkTable = ({
  columns = [
    { key: "date", label: "Date", type: "date", required: true },
    {
      key: "description",
      label: "Description",
      type: "text",
      required: true,
    },
    { key: "amount", label: "Amount", type: "number", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Entertainment",
        "Other",
      ],
      required: true,
    },
    { key: "notes", label: "Notes", type: "text", required: false },
  ],
  onAddAll,
  placeholderText = "Add your bulk entries here...",
}) => {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [clearAllConfirm, setClearAllConfirm] = useState(false);

  const generateId = () => Date.now() + Math.random();

  // Helper to parse and format dates to Date object (for react-datepicker)
  const parseDate = (val) => (val ? new Date(val) : null);

  const addRow = () => {
    // Basic validation before adding row
    const requiredMissing = columns.some((col) => {
      if (!col.required) return false;
      const val = newRow[col.key];
      if (col.type === "number") return !val || isNaN(val) || val === 0;
      return !val || val === "";
    });
    if (requiredMissing) {
      alert("Please fill all required fields");
      return;
    }

    const defaultRow = {};
    columns.forEach((col) => {
      defaultRow[col.key] = col.type === "number" ? 0 : "";
    });

    const newRowWithId = {
      id: generateId(),
      ...defaultRow,
      ...newRow,
    };

    setRows((prev) => [...prev, newRowWithId]);
    setNewRow({});
  };

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    setDeleteCandidate(null);
  };

  const duplicateRow = (id) => {
    const rowToDuplicate = rows.find((r) => r.id === id);
    if (!rowToDuplicate) return;
    const duplicatedRow = { ...rowToDuplicate, id: generateId() };
    setRows((prev) => [...prev, duplicatedRow]);
  };

  const startEditing = (row) => {
    setEditingId(row.id);
    // If date, convert to Date object for datepicker compatibility
    const rowCopy = { ...row };
    columns.forEach((col) => {
      if (col.type === "date" && rowCopy[col.key]) {
        rowCopy[col.key] = parseDate(rowCopy[col.key]);
      }
    });
    setEditingData(rowCopy);
  };

  const saveEditing = () => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== editingId) return row;
        const savedRow = { ...editingData };
        // Convert Date back to ISO string for date columns
        columns.forEach((col) => {
          if (col.type === "date" && savedRow[col.key] instanceof Date) {
            savedRow[col.key] = savedRow[col.key].toISOString().split("T")[0];
          }
        });
        return savedRow;
      })
    );
    setEditingId(null);
    setEditingData({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleAddAll = () => {
    if (onAddAll && rows.length > 0) {
      onAddAll(rows);
      setRows([]);
    }
  };

  const clearAllRows = () => {
    setRows([]);
    setClearAllConfirm(false);
  };




  const renderCell = (row, column) => {
    const isEditing = editingId === row.id;
    const value = isEditing ? editingData[column.key] : row[column.key];

    if (isEditing) {
      switch (column.type) {
        case "select":
          return (
            <select
              value={value || ""}
              onChange={(e) =>
                setEditingData({ ...editingData, [column.key]: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select {column.label}</option>
              {column.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        case "date":
          return (
            <DatePicker
              selected={value}
              onChange={(date) =>
                setEditingData({ ...editingData, [column.key]: date })
              }
              dateFormat="yyyy-MM-dd"
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select date"
            />
          );
        case "number":
          return (
            <input
              type="number"
              value={value || 0}
              onChange={(e) =>
                setEditingData({
                  ...editingData,
                  [column.key]: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
            />
          );
        default:
          return (
            <input
              type="text"
              value={value || ""}
              onChange={(e) =>
                setEditingData({ ...editingData, [column.key]: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${column.label.toLowerCase()}`}
            />
          );
      }
    }

    return (
      <div className="px-2 py-1 select-none">
        {column.type === "number" ? (
          <span className="font-medium">${value?.toLocaleString() || "0.00"}</span>
        ) : (
          <span className="text-gray-700">
            {column.type === "date" && value
              ? new Date(value).toLocaleDateString()
              : value || "-"}
          </span>
        )}
      </div>
    );
  };

  const isRowComplete = (row) => {
    return columns.every(
      (col) => !col.required || (row[col.key] && row[col.key] !== "" && row[col.key] !== 0)
    );
  };

  const totalAmount = rows.reduce((sum, row) => sum + (row.amount || 0), 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Bulk Data Entry</h2>
            <p className="text-blue-100 mt-1">{placeholderText}</p>
          </div>
          {rows.length > 0 && (
            <button
              onClick={() => setClearAllConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                    {column.required && <span className="text-red-500 ml-1">*</span>}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 whitespace-nowrap">
                        {renderCell(row, column)}
                      </td>
                    ))}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {editingId === row.id ? (
                          <>
                            <button
                              onClick={saveEditing}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              title="Save"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Cancel"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(row)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => duplicateRow(row.id)}
                              className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                              title="Duplicate"
                            >
                              <DocumentDuplicateIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(row.id)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Empty State */}
          {rows.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
              <p className="text-gray-500">Start by adding your first entry below</p>
            </div>
          )}
        </div>

        {/* Add New Row Form */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {columns.map((column) =>
              column.type === "date" ? (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.label}
                    {column.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <DatePicker
                    selected={newRow[column.key] ? new Date(newRow[column.key]) : null}
                    onChange={(date) =>
                      setNewRow({
                        ...newRow,
                        [column.key]: date ? date.toISOString().split("T")[0] : "",
                      })
                    }
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText={`Select ${column.label.toLowerCase()}`}
                  />
                </div>
              ) : (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.label}
                    {column.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {column.type === "select" ? (
                    <select
                      value={newRow[column.key] || ""}
                      onChange={(e) =>
                        setNewRow({ ...newRow, [column.key]: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select {column.label}</option>
                      {column.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={column.type}
                      value={newRow[column.key] || ""}
                      onChange={(e) =>
                        setNewRow({
                          ...newRow,
                          [column.key]:
                            column.type === "number"
                              ? parseFloat(e.target.value) || 0
                              : e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${column.label.toLowerCase()}`}
                      step={column.type === "number" ? "0.01" : undefined}
                    />
                  )}
                </div>
              )
            )}
            <button
              onClick={addRow}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Row
            </button>
          </div>
        </div>

        {/* Footer with Summary and Add All Button */}
        {rows.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{rows.length}</span> entries • Total:
                <span className="font-bold text-green-600 ml-1">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleAddAll}
                disabled={rows.length === 0 || !rows.every(isRowComplete)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  rows.length > 0 && rows.every(isRowComplete)
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add All Entries
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-sm mx-auto shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this entry?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteRow(deleteCandidate)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {clearAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-sm mx-auto shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Clear All Entries</h3>
            <p className="mb-6">Are you sure you want to remove all entries?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setClearAllConfirm(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={clearAllRows}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkTable;
