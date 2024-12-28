import React from 'react';
import { TextField, Button } from '@mui/material';

const AuthForm = ({
  email,
  password,
  isSignUp,
  setEmail,
  setPassword,
  handleLogin,
  handleSignUp,
  toggleAuthMode,
}) => {
  return (
    <div className="auth-container">
      <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="auth-form">
        <h2>Recipe App</h2>
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
        <Button variant="contained" color="primary" type="submit">
          {isSignUp ? 'Sign Up' : 'Login'}
        </Button>
        <p onClick={toggleAuthMode} style={{ cursor: 'pointer', marginTop: '10px' }}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
