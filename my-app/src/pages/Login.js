import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('token', res.data); // Save token to localStorage
      setIsLoggedIn(true); // Update login state
      navigate('/profile'); // Redirect to profile page
    } catch (err) {
      alert('Error logging in');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: 'block', margin: '10px 0', padding: '5px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', margin: '10px 0', padding: '5px' }}
      />
      <button
        onClick={login}
        style={{ margin: '5px', padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Login
      </button>
    </div>
  );
};

export default Login;