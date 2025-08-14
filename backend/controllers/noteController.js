const User = require('../models/User');
const Note = require('../models/Note');

exports.addNote = async (req, res) => {
    const userId = req.user.id;

    try {
        const { date, note} = req.body;
        if (!date || !note) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'All required fields must be provided'
                }
            );
        }
        const newNote = new Note({
            userId,
            note,
            date: new Date(date)
        });

        await newNote.save();

        res.status(200).json(newNote);
    } catch (error) {
        console.error("Add note error", error);
        res.status(500).json({ success: false, message: "server error" });
    }
}
exports.getAllNote = async (req, res) => {
    const userId = req.user.id;
    try {
        const note = await Note.find({ userId }).sort({ date: -1 });
        res.json(note);
    } catch (error) {
        console.error("Get notes error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
}
exports.deleteNote = async (req, res) => {
    const userId = req.user.id;
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        
        // Check if the note belongs to the authenticated user
        if (note.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this note'
            });
        }
        
        // Use deleteOne() instead of the incorrect findByIdAndDelete on instance
        await Note.deleteOne({ _id: req.params.id });
        
        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error("Delete note error:", error);
        
        // Handle specific error cases
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid note ID format'
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while deleting the note" 
        });
    }
}

exports.updateNote = async (req, res) => {
    const userId = req.user.id;
    try {
        const { note, date} = req.body;

        if (!note || !date) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId },
            {
                note,
                date: new Date(date)
                
            },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error("Update Note error:", error);
        res.status(500).json({ success: false, message: "server error" });
    }
}
