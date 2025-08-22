import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useUser } from '../context/useUser';

const Dashboard = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me'); // 👈 cookie is sent automatically
        setUser(res.data);
      } catch (err) {
        // Token invalid or missing, so redirect back to login
        console.log(err)
        navigate('/');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    await api.post('/auth/logout');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {user ? <p>Welcome, {user.email}</p> : <p>Loading...</p>}

      <button
        onClick={handleSignOut}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
