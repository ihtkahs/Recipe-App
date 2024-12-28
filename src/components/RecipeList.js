import React from 'react';
import { Button } from '@mui/material';

const RecipeList = ({ recipes, deleteRecipe, editRecipe }) => {
  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="recipe-item">
          <h4>{recipe.name}</h4>
          <p>{recipe.description}</p>
          <Button variant="outlined" color="secondary" onClick={() => deleteRecipe(recipe.id)}>
            Delete
          </Button>
          <Button variant="outlined" color="primary" onClick={() => editRecipe(recipe)}>
            Edit
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default RecipeList;
