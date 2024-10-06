const express = require('express');
const Type = require('../models/Type');

const router = express.Router();

// GET all types
router.get('/', async (req, res) => {
  try {
    const types = await Type.find();
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new type
// router.post('/', async (req, res) => {
//   const { name } = req.body;

//   try {
//     const existingType = await Type.findOne({ name });
//     if (existingType) return res.status(400).json({ message: 'Type already exists' });

//     const newType = new Type({ name });
//     await newType.save();
//     res.status(201).json(newType);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// DELETE a type
// router.delete('/:id', async (req, res) => {
//   try {
//     const type = await Type.findByIdAndDelete(req.params.id);
//     if (!type) return res.status(404).json({ message: 'Type not found' });
//     res.json({ message: 'Type deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
