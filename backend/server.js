

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
require('dotenv').config();

const app = express();
console.log('MY LATEST SERVER CODE IS RUNNING');

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});
app.get('/', (req, res) => {
  res.send('Food Recipe App Backend is Working!');
});

// Save a recipe
app.post('/recipes', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');

    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((error) => {
    console.log('MongoDB Connection Error:', error.message);
  });
