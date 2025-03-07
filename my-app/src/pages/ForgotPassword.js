import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ API_URL }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/forgot-password`, { email }); // Use API_URL here
      alert('Password reset link sent to your email');
      navigate('/login');
    } catch (err) {
      alert('Error sending password reset link');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Forgot Password</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', margin: '10px 0', padding: '5px' }}
      />
      <button
        onClick={handleSubmit}
        style={{ margin: '5px', padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Submit
      </button>
    </div>
  );
};

export default ForgotPassword;