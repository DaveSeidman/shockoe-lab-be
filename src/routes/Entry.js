const express = require('express');
const mongoose = require('mongoose');
const Entry = require('../models/Entry');

const router = express.Router();

// GET all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().populate('type tags');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single entry by ID
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('type tags');
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new entry
router.post('/', async (req, res) => {
  try {
    const typeObjectId = new mongoose.Types.ObjectId(req.body.type);
    const newEntry = new Entry({ type: typeObjectId });
    newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an entry
router.put('/:id', async (req, res) => {
  const { title, summary, text, image, video, tags, related } = req.body;

  console.log('update', req.params.id, image);

  try {
    // Find the entry by ID
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Update the entry fields
    entry.title = title || entry.title;
    entry.summary = summary || entry.summary;
    entry.tags = tags || entry.tags;
    entry.related = related || entry.related;
    entry.text = text || entry.text;
    entry.image = image || entry.image;
    entry.video = video || entry.video;

    // Save the updated entry
    await entry.save();

    // Respond with a success message
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update entry' });
  }
});

// DELETE an entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
