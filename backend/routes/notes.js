const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// GET /api/notes/ - fetch all notes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notes/ - create a new note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, platform = 'General' } = req.body;
    if (!title || !content) return res.status(400).json({ msg: 'Title and content are required' });

    const newNote = await Note.create({
      userId: req.user.id,
      title,
      content,
      platform
    });

    res.json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notes/:id - update a note (owner-only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.userId.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    Object.assign(note, updates);
    await note.save();

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notes/:id - delete a note (owner-only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.userId.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    await note.remove();
    res.json({ msg: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
