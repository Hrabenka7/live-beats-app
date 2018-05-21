'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  musicType: {
    type: String,
    enum: ['classic', 'jazz', 'pop', 'rap', 'rock', 'other'],
    required: true
  },
  description: {
    type: String
  },
  bar: {
    type: ObjectId,
    ref: 'Bar'
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
