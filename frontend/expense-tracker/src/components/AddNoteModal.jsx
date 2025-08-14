import React, { useState, useEffect } from 'react';
import { X, Calendar, Edit3 } from 'lucide-react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const AddNoteModal = ({ isOpen, onClose, onAddNote, onEditNote, editingNote }) => {
  const [formData, setFormData] = useState({
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setFormData({
        note: editingNote.note || '',
        date: editingNote.date ? new Date(editingNote.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingNote]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.note.trim()) {
      newErrors.note = 'Note is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const noteData = {
        note: formData.note.trim(),
        date: formData.date
      };

      if (editingNote) {
        await onEditNote({ ...noteData, id: editingNote._id });
      } else {
        await onAddNote(noteData);
      }

      // Reset form
      setFormData({
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-blue-100 mt-1">
            {editingNote ? 'Update your note details' : 'Track your notes with style'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Note Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Edit3 className="inline-block w-4 h-4 mr-1" />
              Note
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Enter your note here..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.note ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.note && (
              <p className="text-red-500 text-sm mt-1">{errors.note}</p>
            )}
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block w-4 h-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (editingNote ? 'Update Note' : 'Add Note')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
