const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
        type: String,
        required: true
    }
  }, { timestamps: true });

  module.exports = mongoose.model('Note', NoteSchema);
