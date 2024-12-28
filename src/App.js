import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import AuthForm from './components/AuthForm';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import { Button } from '@mui/material';
import './App.css';

const auth = getAuth();
const q = query(collection(db, 'recipes'), orderBy('timestamp', 'desc'));

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      onSnapshot(q, (snapshot) =>
        setRecipes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const addRecipe = async (e) => {
    e.preventDefault();
    if (input && description) {
      await addDoc(collection(db, 'recipes'), {
        name: input,
        description,
        timestamp: serverTimestamp(),
      });
      setInput('');
      setDescription('');
    }
  };

  const updateRecipe = async (e) => {
    e.preventDefault();
    if (editName && editDescription) {
      await updateDoc(doc(db, 'recipes', editId), {
        name: editName,
        description: editDescription,
        timestamp: serverTimestamp(),
      });
      setEditId(null);
      setEditName('');
      setEditDescription('');
    }
  };

  const deleteRecipe = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await deleteDoc(doc(db, 'recipes', id));
    }
  };

  const editRecipe = (recipe) => {
    setEditId(recipe.id);
    setEditName(recipe.name);
    setEditDescription(recipe.description);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditDescription('');
  };

  return (
    <div className="App">
      {!user ? (
        <AuthForm
          email={email}
          password={password}
          isSignUp={isSignUp}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
          toggleAuthMode={() => setIsSignUp(!isSignUp)}
        />
      ) : (
        <>
          <div className="welcome-message">
            <h3>Welcome, {user.email}</h3>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <RecipeForm
            input={input}
            description={description}
            editId={editId}
            editName={editName}
            editDescription={editDescription}
            setInput={setInput}
            setDescription={setDescription}
            setEditName={setEditName}
            setEditDescription={setEditDescription}
            handleSubmit={editId ? updateRecipe : addRecipe}
            cancelEdit={cancelEdit}
          />
          <RecipeList recipes={recipes} deleteRecipe={deleteRecipe} editRecipe={editRecipe} />
        </>
      )}
    </div>
  );
}

export default App;
