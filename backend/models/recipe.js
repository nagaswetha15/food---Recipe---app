
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
