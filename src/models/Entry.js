const mongoose = require('mongoose');
const MediaSchema = require('./Media');

const { Schema } = mongoose;

const EntrySchema = new Schema({
  type: { type: Schema.Types.ObjectId, ref: 'Type' },
  title: { type: String, required: true, default: ' ' },
  summary: { type: String, required: true, default: ' ' },
  text: MediaSchema,
  image: MediaSchema,
  video: MediaSchema,
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  related: [{ type: Schema.Types.ObjectId, ref: 'Entry' }],
  metadata: {
    citations: [{ type: String }],
    relatedEntries: [{ type: Schema.Types.ObjectId, ref: 'Entry' }],
  },
});

const Entry = mongoose.model('Entry', EntrySchema);

module.exports = Entry;
