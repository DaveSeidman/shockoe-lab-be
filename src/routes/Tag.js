const express = require('express');
const Tag = require('../models/Tag');

const router = express.Router();

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new tag
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const existingTag = await Tag.findOne({ name });
    if (existingTag) return res.status(400).json({ message: 'Tag already exists' });

    const newTag = new Tag({ name });
    await newTag.save();

    const tags = await Tag.find(); // Fetch the updated list of tags
    res.status(201).json(tags); // Return the updated list of tags
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT to update a tag
router.put('/:id', async (req, res) => {
  const { name } = req.body;

  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    tag.name = name;
    await tag.save();

    const tags = await Tag.find(); // Fetch updated list of tags
    res.json(tags); // Return the updated list of tags
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a tag
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
