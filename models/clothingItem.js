const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  weather: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('clothingItem', clothingItemSchema);