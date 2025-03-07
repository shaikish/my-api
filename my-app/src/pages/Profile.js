import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = ({ API_URL }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/user`, { headers: { 'auth-token': token } }); // Use API_URL here
      setUser(res.data);
    } catch (err) {
      alert('Error fetching user');
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to the login page
  };

  useEffect(() => {
    fetchUser();
  }, [API_URL]); // Add API_URL to dependency array to refetch if it changes

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <button
            onClick={logout}
            style={{ margin: '5px', padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;