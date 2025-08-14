import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axioInstance'
import AddNoteModal from '../../components/AddNoteModal'
import { API_PATHS } from '../../utils/apiPaths'

const Note = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notes, setNotes] = useState([])
  const [editingNote, setEditingNote] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch all notes
  const fetchNoteData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.NOTE.GET_ALL_NOTE)
      if (response.data) {
        setNotes(response.data)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle adding new note
  const handleAddNote = async (newNote) => {
    try {
      const response = await axiosInstance.post(API_PATHS.NOTE.ADD_NOTE, newNote)
      
      if (response.data) {
        await fetchNoteData()
        setIsModalOpen(false)
        console.log('Note added successfully!')
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  // Handle editing note
  const handleEditNote = async (updatedNote) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.NOTE.UPDATE_NOTE(updatedNote.id), 
        updatedNote
      )
      
      if (response.data) {
        await fetchNoteData()
        setIsModalOpen(false)
        setEditingNote(null)
        console.log('Note updated successfully!')
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  // Handle deleting note
  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axiosInstance.delete(API_PATHS.NOTE.DELETE_NOTE(noteId))

        await fetchNoteData()
        console.log('Note deleted successfully!')
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }
  }

  // Load notes on component mount
  useEffect(() => {
    fetchNoteData()
  }, [])

  return (
    <DashboardLayout activeMenu="Note">
      <div className="my-5 mx-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Note Manager</h1>
        </div>
        
        <button
          onClick={() => {
            setEditingNote(null)
            setIsModalOpen(true)
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Note
        </button>

        {/* Notes List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notes yet. Add your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div key={note._id} className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingNote(note)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{note.note}</p>
              </div>
            ))}
          </div>
        )}

        <AddNoteModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false)
            setEditingNote(null)
          }} 
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          editingNote={editingNote}
        />
      </div>
    </DashboardLayout>
  )
}

export default Note
