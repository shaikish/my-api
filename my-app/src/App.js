import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';

// Define the API URL (replace with your Render backend URL)
const API_URL = 'https://my-api-ivhy.onrender.com';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in and test API connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set login state based on token presence

    // ✅ Test API Connection
    fetch(`${API_URL}/`)
      .then(response => response.text())
      .then(data => console.log("Backend says:", data))
      .catch(error => console.error("API Error:", error));
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsLoggedIn(false); // Update login state
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav style={{ padding: '10px', backgroundColor: '#f4f4f4' }}>
        <Link to="/" style={{ margin: '10px', textDecoration: 'none', color: '#333' }}>Home</Link>
        {!isLoggedIn && (
          <>
            <Link to="/login" style={{ margin: '10px', textDecoration: 'none', color: '#333' }}>Login</Link>
            <Link to="/register" style={{ margin: '10px', textDecoration: 'none', color: '#333' }}>Register</Link>
            <Link to="/forgot-password" style={{ margin: '10px', textDecoration: 'none', color: '#333' }}>Forgot Password?</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link to="/profile" style={{ margin: '10px', textDecoration: 'none', color: '#333' }}>Profile</Link>
            <button
              onClick={logout}
              style={{ margin: '5px', padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Logout
            </button>
          </>
        )}
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} API_URL={API_URL} />} />
        <Route path="/register" element={<Register API_URL={API_URL} />} />
        <Route path="/forgot-password" element={<ForgotPassword API_URL={API_URL} />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile API_URL={API_URL} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
