const express = require('express');
const Entry = require('../models/Entry');
const Tag = require('../models/Tag');
const Theme = require('../models/Theme');
const Type = require('../models/Type');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().populate('type').populate('tags', '_id'); // This loads only the _id field for tags
    const tags = await Tag.find();
    const themes = await Theme.find();
    const types = await Type.find();
    const users = await User.find();

    // TODO: revisit this
    const mappedEntries = entries.map((entry) => ({
      ...entry.toObject(),
      tags: entry.tags.map((tag) => tag._id.toString()), // Ensure the tags are returned as an array of strings
    }));

    res.json({ entries: mappedEntries, tags, themes, types, users });
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;
