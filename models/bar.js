'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const barSchema = new Schema({
  barname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  phone: Number
});

barSchema.index({location: '2dsphere'});

const Bar = mongoose.model('Bar', barSchema);

module.exports = Bar;
