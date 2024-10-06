const mongoose = require('mongoose');

const { Schema } = mongoose;

const MediaSchema = new Schema({
  file: { type: String },
  title: { type: String },
  text: { type: String },
  caption: { type: String },
});

module.exports = MediaSchema;
