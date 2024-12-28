import React from 'react';
import { TextField, Button } from '@mui/material';

const RecipeForm = ({
  input,
  description,
  editId,
  editName,
  editDescription,
  setInput,
  setDescription,
  setEditName,
  setEditDescription,
  handleSubmit,
  cancelEdit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <TextField
        label="Recipe Name"
        variant="outlined"
        value={editId ? editName : input}
        onChange={(e) => (editId ? setEditName(e.target.value) : setInput(e.target.value))}
        style={{ margin: '5px' }}
      />
      <TextField
        label="Description"
        variant="outlined"
        value={editId ? editDescription : description}
        onChange={(e) => (editId ? setEditDescription(e.target.value) : setDescription(e.target.value))}
        style={{ margin: '5px' }}
      />
      <Button variant="contained" color="primary" type="submit">
        {editId ? 'Update Recipe' : 'Add Recipe'}
      </Button>
      {editId && (
        <Button variant="outlined" color="secondary" onClick={cancelEdit}>
          Cancel
        </Button>
      )}
    </form>
  );
};

export default RecipeForm;
