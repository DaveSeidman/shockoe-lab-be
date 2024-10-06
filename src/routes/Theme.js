const express = require('express');
const Theme = require('../models/Theme');

const router = express.Router();

// GET all themes
router.get('/', async (req, res) => {
  try {
    const themes = await Theme.find();
    res.json(themes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new theme
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    const existingTheme = await Theme.findOne({ name });
    if (existingTheme) return res.status(400).json({ message: 'Theme already exists' });

    const newTheme = new Theme({ name });
    await newTheme.save();

    const themes = await Theme.find(); // Fetch the updated list of themes
    res.status(201).json(themes); // Return the updated list of themes
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT to update a theme
router.put('/:id', async (req, res) => {
  const { name } = req.body;

  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) return res.status(404).json({ message: 'Theme not found' });

    theme.name = name;
    await theme.save();

    const themes = await Theme.find(); // Fetch updated list of themes
    res.json(themes); // Return the updated list of themes
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a theme
router.delete('/:id', async (req, res) => {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) return res.status(404).json({ message: 'Theme not found' });
    res.json({ message: 'Theme deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
