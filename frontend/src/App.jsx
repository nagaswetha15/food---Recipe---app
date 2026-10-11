


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000';

const initialRecipes = [
  {
    id: 'sample-1',
    name: 'Veg Biryani',
    category: 'Indian',
    time: '40 minutes',
    ingredients: 'Rice, vegetables, onion, spices, mint and coriander.',
    instructions: 'Cook the rice. Fry the vegetables with spices. Layer the rice and vegetables, then cook on low heat.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-2',
    name: 'Pizza',
    category: 'Italian',
    time: '30 minutes',
    ingredients: 'Pizza base, tomato sauce, cheese, capsicum and onion.',
    instructions: 'Spread tomato sauce over the base. Add cheese and vegetables. Bake until the cheese melts.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-3',
    name: 'Burger',
    category: 'Fast Food',
    time: '20 minutes',
    ingredients: 'Burger buns, potato patty, lettuce, tomato and sauce.',
    instructions: 'Cook the patty. Place it inside the bun with lettuce, tomato and sauce. Serve warm.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-4',
    name: 'Pasta',
    category: 'Italian',
    time: '25 minutes',
    ingredients: 'Pasta, tomato sauce, garlic, onion and cheese.',
    instructions: 'Boil the pasta. Prepare the sauce with garlic and onion. Mix the pasta with the sauce and serve.',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-5',
    name: 'Chocolate Cake',
    category: 'Dessert',
    time: '50 minutes',
    ingredients: 'Flour, cocoa powder, sugar, milk, butter and baking powder.',
    instructions: 'Mix the ingredients into a smooth batter. Pour into a cake tin and bake until cooked.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-6',
    name: 'Fresh Salad',
    category: 'Healthy',
    time: '10 minutes',
    ingredients: 'Cucumber, tomato, carrot, lettuce, lemon and salt.',
    instructions: 'Wash and chop the vegetables. Mix them together and add lemon juice and a little salt.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  }
];

function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [backendMessage, setBackendMessage] = useState('Checking connection...');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emptyRecipe = {
    name: '',
    category: '',
    time: '',
    ingredients: '',
    instructions: '',
    image: ''
  };

  const [newRecipe, setNewRecipe] = useState(emptyRecipe);

  useEffect(() => {
    async function loadData() {
      try {
        const statusResponse = await axios.get(`${API_URL}/`);
        setBackendMessage(statusResponse.data);

        const recipesResponse = await axios.get(`${API_URL}/recipes`);
        const savedRecipes = recipesResponse.data.map((recipe) => ({
          ...recipe,
          id: recipe._id || recipe.id
        }));

        setRecipes([...initialRecipes, ...savedRecipes]);
      } catch (error) {
        console.error('Loading error:', error);
        setBackendMessage('Could not connect to backend.');
      }
    }

    loadData();
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase()) ||
    (recipe.category || '').toLowerCase().includes(search.toLowerCase())
  );

  function handleInputChange(event) {
    const { name, value } = event.target;

    setNewRecipe((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function addRecipe(event) {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);

    try {
      const recipeData = {
        name: newRecipe.name.trim(),
        category: newRecipe.category.trim(),
        time: newRecipe.time.trim(),
        ingredients: newRecipe.ingredients.trim(),
        instructions: newRecipe.instructions.trim(),
        image: newRecipe.image.trim() ||
          'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80'
      };

      // Send the new recipe to the backend to save in MongoDB.
      const response = await axios.post(`${API_URL}/recipes`, recipeData);

      const savedRecipe = {
        ...response.data,
        id: response.data._id || response.data.id,
        category: response.data.category || recipeData.category,
        time: response.data.time || recipeData.time
      };

      setRecipes((previous) => [...previous, savedRecipe]);
      setNewRecipe(emptyRecipe);
      setShowForm(false);
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage(
        error.response?.data?.message ||
        'Could not save recipe. Check that the backend is running.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🍽️ Food Recipe Book</h1>
          <p>Discover delicious recipes and learn how to make them!</p>
        </div>
      </header>

      <main className="container">
        <div className="connection">
          Backend status: {backendMessage}
        </div>

        <section className="intro">
          <h2>Find Your Favourite Recipe</h2>
          <p>Simple and tasty recipes for everyone.</p>

          <div className="controls">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button
              type="button"
              className="add-button"
              onClick={() => {
                setShowForm((previous) => !previous);
                setErrorMessage('');
              }}
            >
              {showForm ? 'Close Form' : '+ Add Recipe'}
            </button>
          </div>
        </section>

        {showForm && (
          <form className="recipe-form" onSubmit={addRecipe}>
            <h2>Add a New Recipe</h2>

            <input
              name="name"
              placeholder="Recipe name"
              value={newRecipe.name}
              onChange={handleInputChange}
              required
            />

            <input
              name="category"
              placeholder="Category (Indian, Italian...)"
              value={newRecipe.category}
              onChange={handleInputChange}
              required
            />

            <input
              name="time"
              placeholder="Cooking time"
              value={newRecipe.time}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="ingredients"
              placeholder="Ingredients"
              value={newRecipe.ingredients}
              onChange={handleInputChange}
              required
            />

            <textarea
              name="instructions"
              placeholder="Cooking instructions"
              value={newRecipe.instructions}
              onChange={handleInputChange}
              required
            />

            <input
              name="image"
              type="url"
              placeholder="Image URL (optional)"
              value={newRecipe.image}
              onChange={handleInputChange}
            />

            {errorMessage && (
              <p role="alert" style={{ color: 'red' }}>
                {errorMessage}
              </p>
            )}

            <button
              className="add-button"
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Recipe'}
            </button>
          </form>
        )}

        <section className="recipes-section">
          <h2>Our Recipes</h2>

          {filteredRecipes.length === 0 ? (
            <p className="no-results">
              No recipes found. Try another search.
            </p>
          ) : (
            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <article className="recipe-card" key={recipe.id}>
                  <div className="recipe-image-wrap">
                    <img
                      className="recipe-image"
                      src={recipe.image}
                      alt={recipe.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.visibility = 'hidden';
                      }}
                    />
                  </div>

                  <div className="recipe-content">
                    <span className="category">
                      {recipe.category}
                    </span>

                    <h3>{recipe.name}</h3>
                    <p className="time">⏱ {recipe.time}</p>

                    <button
                      type="button"
                      className="view-button"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      View Recipe
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedRecipe && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedRecipe(null)}
        >
          <section
            className="recipe-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close-button"
              onClick={() => setSelectedRecipe(null)}
              aria-label="Close recipe"
            >
              ×
            </button>

            <h2>{selectedRecipe.name}</h2>

            <p>
              <strong>Category:</strong> {selectedRecipe.category}
            </p>

            <p>
              <strong>Cooking time:</strong> {selectedRecipe.time}
            </p>

            <h3>Ingredients</h3>
            <p>{selectedRecipe.ingredients}</p>

            <h3>Instructions</h3>
            <p>{selectedRecipe.instructions}</p>
          </section>
        </div>
      )}

      <footer className="footer">
        <p>Made with ❤️ for food lovers</p>
      </footer>
    </div>
  );
}

export default App;

