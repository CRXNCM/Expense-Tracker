const express = require('express');
const router = express.Router();
const {
    getAllNote,
    addNote,
    deleteNote,

    updateNote
} = require('../controllers/noteController');

const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addNote);
router.get('/getUser', protect, getAllNote);
router.delete('/delete/:id', protect, deleteNote);

router.put('/update/:id', protect, updateNote);

module.exports = router;
