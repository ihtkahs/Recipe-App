import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { TextField, Button } from '@mui/material';
import './App.css';
import { db } from './firebase.js';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const auth = getAuth();
const q = query(collection(db, 'recipes'), orderBy('timestamp', 'desc'));

function App() {
  const [user, setUser] = useState(null); // To store user information
  const [recipes, setRecipes] = useState([]);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between login and sign-up
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  // Handle sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  // Fetch recipes from Firestore
  useEffect(() => {
    if (user) {
      onSnapshot(q, (snapshot) => {
        setRecipes(snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
        })));
      });
    }
  }, [user]);

  // Add a new recipe
  const addRecipe = async (e) => {
    e.preventDefault();
    if (input && description) {
      await addDoc(collection(db, 'recipes'), {
        name: input,
        description: description, // Fix: Use state instead of hardcoded string
        timestamp: serverTimestamp(),
      });
      setInput('');
      setDescription('');
    }
  };

  const deleteRecipe = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteDoc(doc(db, 'recipes', id));
        console.log('Recipe deleted successfully');
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const editRecipe = (recipe) => {
    setEditId(recipe.id);
    setEditName(recipe.name);
    setEditDescription(recipe.description);
  };

  const updateRecipe = async (e) => {
    e.preventDefault();
    if (editName && editDescription) {
      try {
        await updateDoc(doc(db, 'recipes', editId), {
          name: editName,
          description: editDescription,
          timestamp: serverTimestamp(),
        });
        setEditId(null);
        setEditName('');
        setEditDescription('');
      } catch (error) {
        console.error('Error updating recipe:', error.message);
      }
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditDescription('');
  };

  return (
    <div className="App">
      <h2>Recipe Management App</h2>

      {/* Login / Sign-Up Form */}
      {!user ? (
        <>
          {isSignUp ? (
            <form onSubmit={handleSignUp}>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ margin: '5px' }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ margin: '5px' }}
              />
              <Button variant="contained" color="primary" type="submit">Sign Up</Button>
              <p onClick={() => setIsSignUp(false)} style={{ cursor: 'pointer', marginTop: '10px' }}>
                Already have an account? Login
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ margin: '5px' }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ margin: '5px' }}
              />
              <Button variant="contained" color="primary" type="submit">Login</Button>
              <p onClick={() => setIsSignUp(true)} style={{ cursor: 'pointer', marginTop: '10px' }}>
                Don't have an account? Sign Up
              </p>
            </form>
          )}
        </>
      ) : (
        <>
          <h3>Welcome, {user.email}</h3>
          <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>

          <form onSubmit={editId ? updateRecipe : addRecipe}>
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
              <Button variant="outlined" color="secondary" onClick={() => cancelEdit()}>
                Cancel
              </Button>
            )}
          </form>

          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
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
        </>
      )}
    </div>
  );
}

export default App;
